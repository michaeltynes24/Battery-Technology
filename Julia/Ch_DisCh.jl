
import Pkg

pwd()
Pkg.activate(".")
Pkg.instantiate()
Pkg.status()
Pkg.add("Plots")

using JuMP
using GLPK
using Ipopt
using CSV, DataFrames
using Dates, Statistics

# Read the updated CSV file
csv_reader = CSV.File("Electric_60_Minute_1-1-2024_11-13-2024.csv")
df = DataFrame(csv_reader)

# Combine Date and Start Time into a single DateTime column
df[!,:DateTime] = DateTime.(df.Date .* " " .* df.Start_Time, "m/d/yyyy HH:MM AM/PM")

# Filter data (if necessary, for a specific Meter Number)
df = filter(row -> row."Meter Number" == "05366729", df)

# Sort by DateTime
df_sorted = sort(df, :DateTime)

# Select relevant columns for demand and solar generation
df_dem_sol = df_sorted[:, [:DateTime, :Consumption, :Solar]]

# Define start date and initialize arrays
start_date = DateTime(2024, 1, 1)
D = 1:365  # Days
T = 1:24   # Hours
pd = zeros(length(D), length(T))  # Demand (grid consumption)
ps = zeros(length(D), length(T))  # Solar generation

# Populate arrays with data from the new utility CSV
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

# Define the time slots for Time-of-Use (ToU) pricing
time_slots = Dict(
    "Monday-Friday" => Dict(
        "Super Off-Peak" => [(0, 6), (10, 14)],
        "Off-Peak" => [(6, 10), (14, 16), (21, 24)],
        "On-Peak" => [(16, 21)]
    ),
    "Weekends-Holidays" => Dict(
        "Super Off-Peak" => [(0, 2)],
        "Off-Peak" => [(14, 16), (21, 24)],
        "On-Peak" => [(16, 21)]
    )
)

# Initialize arrays for charging and discharging times
charging_times = zeros(24)
discharging_times = zeros(24)

# Populate charging and discharging times based on the time slots
for slot in values(time_slots)
    for (period, times) in slot
        if period in ["Super Off-Peak", "Off-Peak"]
            for (start, stop) in times
                start_idx = max(1, start)
                stop_idx = min(24, stop)
                charging_times[start_idx:stop_idx] .= 1
            end
        elseif period == "On-Peak"
            for (start, stop) in times
                start_idx = max(1, start)
                stop_idx = min(24, stop)
                discharging_times[start_idx:stop_idx] .= 1
            end
        end
    end
end

using Plots

# Plot charging and discharging times
plot(
    1:24, charging_times, label="Charging",
    xlabel="Hour of the Day", ylabel="Charging/Discharging",
    title="Charging and Discharging Times in a 24-hour Period",
    color=:blue, linewidth=2, linestyle=:dash
)
plot!(
    1:24, discharging_times, label="Discharging",
    color=:red, linewidth=2, linestyle=:dash
)
