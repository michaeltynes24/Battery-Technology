import Pkg

# Activate and instantiate the environment
Pkg.activate(".")
Pkg.instantiate()

# Import required packages
using JuMP, GLPK, CSV, DataFrames, Logging

# Configure logging
global_logger(ConsoleLogger(stderr, Logging.Info))

function battery_function_module(file_path::String)
    @info "Loading CSV data from: $file_path"

    # Load CSV data
    try
        df = DataFrame(CSV.File(file_path))
    catch e
        error("Failed to read the CSV file. Ensure the file exists and is correctly formatted. Error: $e")
    end

    # Parameters
    S_base = 1e3
    γ_b = 0.06  # Cost coefficient for battery operation
    D = 1:365  # Days in the year
    T = 1:24   # Hours in the day

    # Electricity pricing by time of day
    α = zeros(length(T))
    for t in T
        if (t >= 1 && t <= 5) || (t >= 10 && t <= 13)
            α[t] = 0.31  # Low cost
        elseif (t >= 6 && t <= 9) || (t >= 14 && t <= 15) || (t >= 21)
            α[t] = 0.36  # Medium cost
        elseif t >= 16 && t <= 20
            α[t] = 0.50  # High cost
        end
    end

    @info "Electricity pricing initialized."

    # Initialize arrays for maximum solar generation and demand
    ps_max = zeros(length(T), length(D))  # Placeholder for solar generation
    pd = zeros(length(T), length(D))     # Placeholder for demand

    # Validate input columns
    required_columns = ["Date", "Start_Time", "Consumption", "Solar"]
    missing_columns = setdiff(required_columns, names(df))
    if !isempty(missing_columns)
        error("Missing required columns in the CSV file: $missing_columns")
    end

    @info "CSV data validated successfully. Columns: $(names(df))"

    # Sort data by DateTime and populate ps_max and pd
    try
        df[!, :DateTime] = DateTime.(df.Date .* " " .* df.Start_Time, dateformat"m/d/yyyy h:MM AMPM")
        df_sorted = sort(df, :DateTime)

        for d in D
            for t in T
                target_time = DateTime(2024, 1, 1) + Day(d - 1) + Hour(t - 1)
                idx = findfirst(row -> row[:DateTime] == target_time, eachrow(df_sorted))
                if !isnothing(idx)
                    pd[t, d] = df_sorted[idx, :Consumption]
                    ps_max[t, d] = df_sorted[idx, :Solar]
                end
            end
        end
    catch e
        error("Error populating demand and solar generation data. Error: $e")
    end

    @info "Demand and solar generation data populated successfully."

    # Define the optimization model
    Bat_model = Model(GLPK.Optimizer)

    try
        # Define variables
        @variable(Bat_model, pb_ch[t in T, d in D] >= 0)  # Charging power
        @variable(Bat_model, pb_dis[t in T, d in D] >= 0) # Discharging power
        @variable(Bat_model, Eb[t in T, d in D])         # Energy in battery

        # Objective: Minimize cost of operation
        @objective(Bat_model, Min, sum((pb_ch[t, d] + pb_dis[t, d]) * γ_b + α[t] for t in T, d in D))

        @info "Optimization model defined. Solving..."
        JuMP.optimize!(Bat_model)
    catch e
        error("Error defining or solving the optimization model. Error: $e")
    end

    # Check the optimization result
    if termination_status(Bat_model) != MOI.OPTIMAL
        error("Optimization did not converge to an optimal solution.")
    end

    @info "Optimization completed successfully."

    return Dict(
        "objective_value" => JuMP.objective_value(Bat_model)
    )
end


