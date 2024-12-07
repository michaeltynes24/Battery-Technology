import Pkg

Pkg.activate(".")
Pkg.instantiate()

using JuMP, GLPK, CSV, DataFrames, Dates

function charge_discharge_module(file_path::String)
    # Load CSV data
    df = DataFrame(CSV.File(file_path))

    # Combine Date and Start Time into a single DateTime column
    df[!, :DateTime] = DateTime.(df.Date .* " " .* df.Start_Time, "m/d/yyyy HH:MM AM/PM")

    # Sort by DateTime
    df_sorted = sort(df, :DateTime)

    # Select relevant columns
    df_dem_sol = df_sorted[:, [:DateTime, :Consumption, :Solar]]

    # Define start date and initialize arrays
    start_date = DateTime(2024, 1, 1)
    D = 1:365
    T = 1:24
    pd = zeros(length(D), length(T))  # Demand
    ps = zeros(length(D), length(T))  # Solar

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

    return Dict(
        "charging_data" => pd,
        "discharging_data" => ps
    )
end
