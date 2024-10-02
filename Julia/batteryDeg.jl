import Pkg
pwd()
Pkg.activate(".")
Pkg.instantiate()
Pkg.status()

using JuMP
using GLPK
using Plots

# Define parameters
S_base = 1e3  # 1 kVA 
γ_b = 0.06   # degradation cost of the battery $/kW

D = 1:365    # number of days in a year 
T = 1:24     # number of hours in a day
D_type = 1:2

# ToU pricing of electricity
α = zeros(length(T), length(D_type))   # ToU pricing of electricity
for t in T
    if (t >= 1 && t <= 5) || (t >= 10 && t <= 13)
        α[t] = 0.31649       ###  31 cents/kw # super off-peak
    end
    if (t >= 6 && t <= 9) || (t >= 14 && t <= 15) || (t >= 21)
        α[t] = 0.39199       ###  36 cents/kW  # off-peak
    end
    if t >= 16 && t <= 20
        α[t] = 0.63673       ###  50 cents/kW  # peak
    end
end

# Function to calculate battery lifetime
function battery_lifetime(bat_flag, α, η_bat, pd, years::Int)
    E_b_max = 100 # 100 kWh
    E_b_min = 0 
    pb_max = 2.5
    ps_max = zeros(length(T), length(D))    # maximum available solar power obtained from pecan street data
    
    # Model for battery degradation
    function battery_degradation(bat_flag, α, η_bat, pd)
        Bat_model = Model(GLPK.Optimizer)

        @variable(Bat_model, pb_ch[T, D] >= 0)      # charging power of battery
        @variable(Bat_model, pb_dis[T, D] >= 0)     # discharge power of battery
        @variable(Bat_model, Eb[T, D] >= 0)         # Energy of battery
        @variable(Bat_model, ps[T, D] >= 0)         # solar power
        @variable(Bat_model, pg[T, D] >= 0)         # power bought from grid
        @variable(Bat_model, Deg[T, D] >= 0)        # battery degradation

        @objective(Bat_model, Min, sum((pb_ch[t, d] + pb_dis[t, d]) * γ_b + α[t] * pg[t, d] for t in T, d in D))

        @constraint(Bat_model, mu_b_ch[t in T, d in D], pb_ch[t, d] <= pb_max)
        @constraint(Bat_model, mu_b_dis[t in T, d in D], pb_dis[t, d] <= pb_max)
        @constraint(Bat_model, mu_Eb_max[t in T, d in D], Eb[t, d] <= E_b_max)
        @constraint(Bat_model, mu_Eb_min[t in T, d in D], Eb[t, d] >= E_b_min)
        @constraint(Bat_model, mu_s[t in T, d in D], ps[t, d] <= ps_max[t, d])

        # Energy of battery equations
        @constraint(Bat_model, lamdba_E_p_bat_1[d in D], Eb[1, d] == E_b_max) # starting SOC
        @constraint(Bat_model, lamdba_E_p_bat_dis[t in T, d in D; t > 1], 
            Eb[t, d] == Eb[t - 1, d] + η_bat * pb_ch[t, d] - pb_dis[t, d] / η_bat - Deg[t, d])   

        # Power balance constraint
        @constraint(Bat_model, power_balance[t in T, d in D], 
            ps[t, d] + pg[t, d] + pb_dis[t, d] == pb_ch[t, d] + pd[t, d])

        JuMP.optimize!(Bat_model)

        # Extract objective value and battery SOC
        obj_value = JuMP.objective_value(Bat_model)
        battery_soc = value.(Eb)

        return obj_value, battery_soc
    end
    
    # Initialize variables to store battery degradation
    battery_degradations = []
    
    # Run optimization and calculate degradation for each year
    for i in 1:years
        _, battery_soc = battery_degradation(bat_flag, α, η_bat, pd)
        push!(battery_degradations, 1 - battery_soc[end])
    end
    
    return battery_degradations
end

# Calculate battery lifetime for lithium-ion battery
bat_flag_li = 1  # Li-ion
η_bat_li = 0.85  # efficiency of the inverter and battery
years = 20  # Number of years to calculate battery lifetime

battery_lifetime_li = battery_lifetime(bat_flag_li, α, η_bat_li, pd, years)

# Calculate battery lifetime for sodium-ion battery
bat_flag_na = 2  # Na-ion
η_bat_na = 0.9  # efficiency of the inverter and battery

battery_lifetime_na = battery_lifetime(bat_flag_na, α, η_bat_na, pd, years)

# Plot the battery lifetime graph
plot(1:years, battery_lifetime_li, label="Lithium-ion", xlabel="Years", ylabel="Battery Degradation",
    title="Battery Lifetime", color=:blue, linewidth=2)
plot!(1:years, battery_lifetime_na, label="Sodium-ion", color=:red, linewidth=2)
