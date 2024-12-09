import Pkg

# Activate and instantiate the environment
Pkg.activate(".")
Pkg.instantiate()

# Import required packages
using JuMP, GLPK, Logging

# Configure logging for debugging
global_logger(ConsoleLogger(stderr, Logging.Info))

# Parameters
S_base = 1e3  # Base power in kVA
γ_b = 0.06    # Degradation cost of the battery ($/kW)
D = 1:365     # Number of days in a year
T = 1:24      # Number of hours in a day

# Time-of-Use (ToU) electricity pricing
function initialize_pricing()
    α = zeros(length(T))
    for t in T
        if (t >= 1 && t <= 5) || (t >= 10 && t <= 13)
            α[t] = 0.31649  # Super off-peak
        elseif (t >= 6 && t <= 9) || (t >= 14 && t <= 15) || (t >= 21)
            α[t] = 0.39199  # Off-peak
        elseif t >= 16 && t <= 20
            α[t] = 0.63673  # Peak
        end
    end
    return α
end

# Battery Lifetime Function
function battery_lifetime(bat_flag::Int, α::Vector{Float64}, η_bat::Float64, pd::Matrix{Float64}, years::Int)
    # Battery parameters
    E_b_max = 100.0  # Max battery capacity (kWh)
    E_b_min = 0.0    # Min battery capacity (kWh)
    pb_max = 2.5     # Max charge/discharge power (kW)
    ps_max = zeros(length(T), length(D))  # Placeholder for max solar generation

    # Model for annual battery operation and degradation
    function annual_battery_model(α, η_bat, pd, ps_max, initial_Eb)
        @info "Defining the optimization model for annual battery operations..."
        Bat_model = Model(GLPK.Optimizer)

        # Variables
        @variable(Bat_model, pb_ch[t in T, d in D] >= 0)  # Battery charging power
        @variable(Bat_model, pb_dis[t in T, d in D] >= 0) # Battery discharging power
        @variable(Bat_model, Eb[t in T, d in D] >= E_b_min <= E_b_max) # Energy in battery
        @variable(Bat_model, ps[t in T, d in D] >= 0)     # Solar power utilized
        @variable(Bat_model, pg[t in T, d in D] >= 0)     # Power bought from the grid
        @variable(Bat_model, Deg[t in T, d in D] >= 0)    # Battery degradation

        # Objective: Minimize total costs (degradation + grid cost)
        @objective(Bat_model, Min, sum((pb_ch[t, d] + pb_dis[t, d]) * γ_b + α[t] * pg[t, d] for t in T, d in D))

        @info "Adding constraints to the model..."
        # Constraints
        @constraint(Bat_model, [t in T, d in D], pb_ch[t, d] <= pb_max)  # Max charge limit
        @constraint(Bat_model, [t in T, d in D], pb_dis[t, d] <= pb_max) # Max discharge limit
        @constraint(Bat_model, [t in T, d in D], ps[t, d] <= ps_max[t, d]) # Max solar utilization

        # Energy balance constraints
        @constraint(Bat_model, [t in T, d in D; t > 1],
            Eb[t, d] == Eb[t - 1, d] + η_bat * pb_ch[t, d] - pb_dis[t, d] / η_bat - Deg[t, d])
        @constraint(Bat_model, [t in T, d in 1], Eb[1, d] == initial_Eb)

        # Connect daily energy states
        @constraint(Bat_model, [d in D; d > 1],
            Eb[1, d] == Eb[24, d - 1] + η_bat * pb_ch[1, d] - pb_dis[1, d] / η_bat)

        # Power balance at each time step
        @constraint(Bat_model, [t in T, d in D],
            ps[t, d] + pg[t, d] + pb_dis[t, d] == pb_ch[t, d] + pd[t, d])

        # Solve the optimization problem
        @info "Optimizing the battery operation model..."
        JuMP.optimize!(Bat_model)

        # Check the optimization status
        if termination_status(Bat_model) != MOI.OPTIMAL
            error("Optimization did not converge to an optimal solution.")
        end

        @info "Optimization successful. Extracting results..."
        # Extract battery degradation and final state of charge
        Deg_values = value.(Deg)
        final_Eb = value.(Eb[24, D[end]])

        return sum(Deg_values), final_Eb
    end

    # Simulate battery degradation over multiple years
    initial_Eb = E_b_max  # Start with full battery capacity
    battery_degradation = Float64[]  # Track degradation each year

    for year in 1:years
        @info "Running simulation for year $year..."
        total_deg, final_Eb = annual_battery_model(α, η_bat, pd, ps_max, initial_Eb)
        push!(battery_degradation, total_deg)
        initial_Eb = final_Eb  # Update initial state of charge for next year
    end

    @info "Simulation completed for $years year(s)."
    return battery_degradation
end

# Example usage (replace with actual data)
# α = initialize_pricing()
# pd = fill(1.0, length(T), length(D))  # Example placeholder for demand
# result = battery_lifetime(1, α, 0.95, pd, 5)
# println(result)
