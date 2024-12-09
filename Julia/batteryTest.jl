import Pkg

# Activate and instantiate the environment
Pkg.activate(".")
Pkg.instantiate()

# Import required packages
using JuMP, GLPK, CSV, DataFrames, Dates, Logging

# Configure logging
global_logger(ConsoleLogger(stderr, Logging.Info))

function battery_test_module(file_path::String)
    @info "Loading CSV data from: $file_path"

    # Load CSV data
    try
        df = DataFrame(CSV.File(file_path))
    catch e
        error("Failed to read the CSV file. Ensure the file exists and is correctly formatted. Error: $e")
    end

    # Validate required columns
    required_columns = ["Date", "Start_Time", "Consumption", "Solar"]
    missing_columns = setdiff(required_columns, names(df))
    if !isempty(missing_columns)
        error("Missing required columns in the CSV file: $missing_columns")
    end

    @info "CSV data loaded successfully. Columns: $(names(df))"

    # Create DateTime column
    try
        df[!, :DateTime] = DateTime.(df.Date .* " " .* df.Start_Time, dateformat"m/d/yyyy h:MM AMPM")
    catch e
        error("Failed to parse Date and Start_Time into DateTime format. Ensure correct formatting in the CSV. Error: $e")
    end

    # Filter for the year 2024
    try
        df = filter(row -> year(row[:DateTime]) == 2024, df)
    catch e
        error("Failed to filter data for the year 2024. Error: $e")
    end

    @info "Filtered data for 2024."

    # Define demand and solar arrays
    D = 1:365
    T = 1:24
    pd = zeros(length(D), length(T))  # Demand
    ps = zeros(length(D), length(T))  # Solar
    start_date = DateTime(2024, 1, 1)

    @info "Initializing demand and solar arrays."

    # Populate demand and solar arrays
    try
        for d in D
            for t in T
                target_time = start_date + Hour(t - 1) + Day(d - 1)
                idx = findfirst(row -> row[:DateTime] == target_time, eachrow(df))
                if !isnothing(idx)
                    pd[d, t] = df[idx, :Consumption]
                    ps[d, t] = df[idx, :Solar]
                end
            end
        end
    catch e
        error("Error during array population for demand and solar data. Error: $e")
    end

    @info "Arrays populated successfully."

    # Battery parameters
    B = 1:5
    S_base = 100.0
    Eb_min = 0.0
    Eb_max = 10.0 / S_base
    C_b_dis = 10.0
    C_b_ch = 2.0

    @info "Defining optimization model."

    # Define the optimization model
    battery_prob = Model(GLPK.Optimizer)

    try
        @variable(battery_prob, Pb_ch[B, T] >= 0)  # Charging power
        @variable(battery_prob, Pb_dis[B, T] >= 0)  # Discharging power
        @variable(battery_prob, Eb_min <= Eb[B, T] <= Eb_max)  # Battery energy

        @constraint(battery_prob, [b in B, t in T; t != 1],
            Eb[b, t] == Eb[b, t - 1] + Pb_ch[b, t] - Pb_dis[b, t])
        @constraint(battery_prob, [b in B, t in 1],
            Eb[b, t] == Eb[b, length(T)] + Pb_ch[b, t] - Pb_dis[b, t])

        @objective(battery_prob, Min,
            sum(Pb_ch[b, t] * C_b_ch + Pb_dis[b, t] * C_b_dis for b in B, t in T))

        @info "Optimization model defined. Solving..."
        JuMP.optimize!(battery_prob)
    catch e
        error("Error defining or solving the optimization model. Error: $e")
    end

    # Check the optimization result
    if termination_status(battery_prob) != MOI.OPTIMAL
        error("Optimization did not converge to an optimal solution.")
    end

    @info "Optimization completed successfully."

    return Dict(
        "optimal_cost" => JuMP.objective_value(battery_prob)
    )
end

