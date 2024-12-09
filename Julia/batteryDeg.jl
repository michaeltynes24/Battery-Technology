import Pkg

Pkg.activate(".")
Pkg.instantiate()

using JuMP, GLPK

# Parameters
S_base = 1e3  # 1 kVA base power
γ_b = 0.06    # Degradation cost of the battery ($/kW)
D = 1:365     # Number of days in a year
T = 1:24      # Number of hours in a day

# Time-of-Use (ToU) electricity pricing (cents/kW)
α = zeros(length(T))  # Initialize pricing
for t in T
    if (t >= 1 && t <= 5) || (t >= 10 && t <= 13)
        α[t] = 0.31649  # Super off-peak
    elseif (t >= 6 && t <= 9) || (t >= 14 && t <= 15) || (t >= 21)
        α[t] = 0.39199  # Off-peak
    elseif t >= 16 && t <= 20
        α[t] = 0.63673  # Peak
    end
end

# Battery Lifetime Function
function battery_lifetime(bat_flag::Int, α::Vector{Float64}, η_bat::Float64, pd::Matrix{Float64}, years::Int)
    E_b_max = 100  # Max battery capacity (kWh)
    E_b_min = 0    # Min battery capacity (kWh)
    pb_max = 2.5   # Max charge/discharge power (kW)
    ps_max = zeros(length(T), length(D))  # Max available solar power (to be populated)

    # Model for annual battery operation and degradation
    function annual_battery_model(α, η_bat, pd, ps_max, initial_Eb)
        # Create optimization model
        Bat_model = Model(GLPK.Optimizer)

        # Variables
        @variable(Bat_model, pb_ch[t in T, d in D] >= 0)  # Battery charging power
        @variable(Bat_model, pb_dis[t in T, d in D] >= 0) # Battery discharging power
        @variable(Bat_model, Eb[t in T, d in D] >= 0)     # Energy stored in battery
        @variable(Bat_model, ps[t in T, d in D] >= 0)     # Solar power utilized
        @variable(Bat_model, pg[t in T, d in D] >= 0)     # Power bought from the grid
        @variable(Bat_model, Deg[t in T, d in D] >= 0)    # Battery degradation

        # Objective: Minimize total costs (degradation + grid cost)
        @objective(Bat_model, Min, sum((pb_ch[t, d] + pb_dis[t, d]) * γ_b + α[t] * pg[t, d] for t in T, d in D))

        # Constraints
        @constraint(Bat_model, [t in T, d in D], pb_ch[t, d] <= pb_max)  # Max charge limit
        @constraint(Bat_model, [t in T, d in D], pb_dis[t, d] <= pb_max) # Max discharge limit
        @constraint(Bat_model, [t in T, d in D], Eb[t, d] <= E_b_max)    # Battery max energy
        @constraint(Bat_model, [t in T, d in D], Eb[t, d] >= E_b_min)    # Battery min energy
        @constraint(Bat_model, [t in T, d in D], ps[t, d] <= ps_max[t, d]) # Max solar utilization

        # Energy balance
        @constraint(Bat_model, [t in T, d in D; t > 1],
            Eb[t, d] == Eb[t - 1, d] + η_bat * pb_ch[t, d] - pb_dis[t, d] / η_bat - Deg[t, d])

        # Starting SOC for the first day
        @constraint(Bat_model, [d in 1], Eb[1, d] == initial_Eb)

        # Daily connection between last and first hour
        @constraint(Bat_model, [d in D; d > 1],
            Eb[1, d] == Eb[24, d - 1] + η_bat * pb_ch[1, d] - pb_dis[1, d] / η_bat)

        # Power balance
        @constraint(Bat_model, [t in T, d in D],
            ps[t, d] + pg[t, d] + pb_dis[t, d] == pb_ch[t, d] + pd[t, d])

        # Optimize
        JuMP.optimize!(Bat_model)

        # Extract battery degradation and final SOC
        Deg_values = value.(Deg)
        final_Eb = value.(Eb[24, D[end]])

        return sum(Deg_values), final_Eb
    end

    # Track battery degradation over years
    initial_Eb = E_b_max  # Start with full battery capacity
    battery_degradation = []

    for year in 1:years
        total_deg, final_Eb = annual_battery_model(α, η_bat, pd, ps_max, initial_Eb)
        push!(battery_degradation, total_deg)
        initial_Eb = final_Eb  # Update initial SOC for the next year
    end

    return battery_degradation
end
