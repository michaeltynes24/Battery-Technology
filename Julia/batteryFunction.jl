import Pkg
Pkg.activate(".")
Pkg.instantiate()
Pkg.status()

using JuMP
using GLPK
using CSV
using DataFrames

# Parameters
S_base = 1e3  # 1 kVA
γ_b = 0.06    # Degradation cost of the battery ($/kW)
D = 1:365     # Number of days in a year
T = 1:24      # Number of hours in a day
D_type = 1:2  # Weekday and weekend types

# ToU pricing (cents/kW)
α = zeros(length(T))
for t in T
    if (t >= 1 && t <= 5) || (t >= 10 && t <= 13)
        α[t] = 0.31  # Super off-peak
    elseif (t >= 6 && t <= 9) || (t >= 14 && t <= 15) || (t >= 21)
        α[t] = 0.36  # Off-peak
    elseif t >= 16 && t <= 20
        α[t] = 0.50  # Peak
    end
end

# Battery and solar parameters
E_b_max = 100    # 100 kWh max battery capacity
E_b_min = 0      # Minimum battery capacity
pb_max = 2.5     # Maximum charge/discharge power
ps_max = zeros(length(T), length(D))  # Max available solar power (to be populated)
pd = zeros(length(T), length(D))      # Electricity consumption (to be populated)

# Battery type selection
bat_flag = 1  # 1 for Li-ion, 2 for Na-ion
η_bat = bat_flag == 1 ? 0.85 : 0.90  # Efficiency based on battery type

# Battery Model Function
function battery_optimization(bat_flag, α, η_bat, pd, ps_max)
    # Create optimization model
    Bat_model = Model(GLPK.Optimizer)
    
    # Define variables
    @variable(Bat_model, pb_ch[t in T, d in D] >= 0)  # Charging power of battery
    @variable(Bat_model, pb_dis[t in T, d in D] >= 0) # Discharging power of battery
    @variable(Bat_model, Eb[t in T, d in D])          # Energy stored in the battery
    @variable(Bat_model, ps[t in T, d in D] >= 0)     # Solar power utilized
    @variable(Bat_model, pg[t in T, d in D] >= 0)     # Power bought from the grid

    # Define objective: Minimize total cost
    @objective(Bat_model, Min, sum((pb_ch[t, d] + pb_dis[t, d]) * γ_b + α[t] * pg[t, d] for t in T, d in D))

    # Constraints
    @constraint(Bat_model, [t in T, d in D], pb_ch[t, d] <= pb_max)  # Max charging power
    @constraint(Bat_model, [t in T, d in D], pb_dis[t, d] <= pb_max) # Max discharging power
    @constraint(Bat_model, [t in T, d in D], Eb[t, d] <= E_b_max)    # Max battery capacity
    @constraint(Bat_model, [t in T, d in D], Eb[t, d] >= E_b_min)    # Min battery capacity
    @constraint(Bat_model, [t in T, d in D], ps[t, d] <= ps_max[t, d]) # Max solar utilization

    # Initial SOC
    @constraint(Bat_model, Eb[1, 1] == E_b_max)

    # Energy balance for hours in the same day
    @constraint(Bat_model, [t in T, d in D; t > 1],
        Eb[t, d] == Eb[t - 1, d] + η_bat * pb_ch[t, d] - pb_dis[t, d] / η_bat)

    # Energy balance for first hour of a day (linked to previous day)
    @constraint(Bat_model, [d in D; d > 1],
        Eb[1, d] == Eb[24, d - 1] + η_bat * pb_ch[1, d] - pb_dis[1, d] / η_bat)

    # Power balance constraint
    @constraint(Bat_model, [t in T, d in D],
        ps[t, d] + pg[t, d] + pb_dis[t, d] == pb_ch[t, d] + pd[t, d])

    # Solve the optimization problem
    JuMP.optimize!(Bat_model)

    # Return the results
    return (
        objective_value = JuMP.objective_value(Bat_model),
        charge_schedule = JuMP.value.(pb_ch),
        discharge_schedule = JuMP.value.(pb_dis),
        energy_schedule = JuMP.value.(Eb),
        solar_utilization = JuMP.value.(ps),
        grid_power = JuMP.value.(pg)
    )
end

# Example usage
# Assuming `pd` and `ps_max` are populated with real data
results = battery_optimization(bat_flag, α, η_bat, pd, ps_max)

# Display results
println("Objective Value (Total Cost): ", results[:objective_value])

