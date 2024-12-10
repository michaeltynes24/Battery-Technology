
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
using Dates,Statistics

# Read the CSV file
csv_reader = CSV.File("15minute_data_california.csv")
df = DataFrame(csv_reader)

# Sort the DataFrame by local_15min
df_sorted = sort(df, order(:local_15min))

# Select relevant columns
df_dem_sol = df_sorted[:, [:dataid, :local_15min, :grid, :solar]]

# Extract year from local_15min and filter by year 2018
df_dem_sol[!,:year] = [parse(Int, chop(row.local_15min, head=0, tail=18)) for row in eachrow(df_dem_sol)]
df_dem_sol = filter(row -> row.year == 2018, df_dem_sol)

# Filter by dataid 1731
df_dem_sol = filter(row -> row.dataid == 1731, df_dem_sol)

# Define start date
start_date = DateTime(2018, 1, 1, 1, 0)

# Define ranges for days and hours
D = 1:365
T = 1:24

# Initialize arrays for solar and grid data
pd = zeros(length(D), length(T))  # solar availability
ps = zeros(length(D), length(T))

# Iterate over each date and time, populating solar and grid data arrays
for d in D
    for t in T
        # Calculate the target datetime for the current iteration
        target_datetime = start_date + Dates.Hour(t - 1)
        
        # Find the index of the row in df_dem_sol corresponding to the target datetime
        idx = findfirst(datetime -> datetime == target_datetime, df_dem_sol.local_15min)
        
        if !isnothing(idx)
            pd[d, t] = df_dem_sol[idx, :solar]
            ps[d, t] = df_dem_sol[idx, :grid]
        end
    end
    global start_date += Dates.Day(1)
end

# Define the time slots as a dictionary
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

# Initialize arrays to store charging and discharging times
charging_times = zeros(24)
discharging_times = zeros(24)

# Populate charging and discharging times based on the time slots
for slot in values(time_slots)
    for (period, times) in slot
        if period in ["Super Off-Peak", "Off-Peak"]
            for (start, stop) in times
                # Ensure the indices stay within the bounds of the vector
                start_idx = max(1, start)
                stop_idx = min(24, stop)
                charging_times[start_idx:stop_idx] .= 1
            end
        elseif period == "On-Peak"
            for (start, stop) in times
                # Ensure the indices stay within the bounds of the vector
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