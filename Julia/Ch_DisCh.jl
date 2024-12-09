import Pkg

# Activate and instantiate the environment
Pkg.activate(".")
Pkg.instantiate()

# Import required packages
using JuMP, GLPK, CSV, DataFrames, Dates, Logging

# Configure logging
global_logger(ConsoleLogger(stderr, Logging.Info))

function charge_discharge_module(file_path::String)
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

    # Combine Date and Start Time into a single DateTime column
    try
        df[!, :DateTime] = DateTime.(df.Date .* " " .* df.Start_Time, "m/d/yyyy HH:MM AM/PM")
    catch e
        error("Failed to parse Date and Start Time into DateTime format. Ensure correct formatting in the CSV. Error: $e")
    end

    # Sort by DateTime
    try
        df_sorted = sort(df, :DateTime)
    catch e
        error("Failed to sort data by DateTime. Error: $e")
    end

    @info "Data sorted by DateTime."

    # Select relevant columns
    try
        df_dem_sol = df_sorted[:, [:DateTime, :Consumption, :Solar]]
    catch e
        error("Failed to select relevant columns (DateTime, Consumption, Solar). Error: $e")
    end

    @info "Relevant columns selected: DateTime, Consumption, Solar."

    # Define start date and initialize arrays
    start_date = DateTime(2024, 1, 1)
    D = 1:365
    T = 1:24
    pd = zeros(length(D), length(T))  # Demand
    ps = zeros(length(D), length(T))  # Solar

    @info "Initializing demand and solar arrays."

    # Populate demand and solar arrays
    try
        for d in D
            for t in T
                target_datetime = start_date + Hour(t - 1)
                idx = findfirst(row -> row.DateTime == target_datetime, df_dem_sol)
                if !isnothing(idx)
                    pd[d, t] = df_dem_sol[idx, :Consumption]
                    ps[d, t] = df_dem_sol[idx, :Solar]
                end
            end
            start_date += Day(1)
        end
    catch e
        error("Error during array population for demand and solar data. Error: $e")
    end

    @info "Arrays populated successfully."

    return Dict(
        "charging_data" => pd,
        "discharging_data" => ps
    )
end
