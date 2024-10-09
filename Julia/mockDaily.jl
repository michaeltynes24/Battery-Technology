cd("C:\\Users\\alexr\\OneDrive\\Documents\\GitHub\\Senior_design_A_VAM2S_Solar_System\\Folder1")
import Pkg

pwd()
Pkg.activate(".")
Pkg.instantiate()
Pkg.status()
Pkg.add("DataFrames")
Pkg.add("Plots")
Pkg.add("Dates")
Pkg.add("Statistics")
Pkg.add("Distributions")

using DataFrames, Plots, Dates, Statistics, Distributions
# Constants
average_daily_usage_kWh = 18.57  # average daily usage in kWh
hours = 1:24  # hourly intervals

# Generate mock data
start_date = DateTime(2018, 1, 1)
end_date = DateTime(2018, 12, 31, 23)
hourly_timestamps = start_date:Hour(1):end_date

# Define a daily usage pattern (low during 12 AM to 6 AM, higher afterwards, peaks around noon and evening)
daily_pattern = [0.5, 0.4, 0.35, 0.3, 0.3, 0.35, 0.5, 0.7, 0.9, 1.0, 1.2, 1.4, 1.4, 1.2, 1.1, 1.0, 1.1, 1.2, 1.0, 0.8, 0.7, 0.6, 0.55, 0.5]

# Scale the daily pattern to match the average daily usage
scaled_daily_pattern = daily_pattern .* (average_daily_usage_kWh / sum(daily_pattern))

# Replicate daily pattern across all days in the year
hourly_usage = repeat(scaled_daily_pattern, length(hourly_timestamps) ÷ 24)
if length(hourly_usage) < length(hourly_timestamps)
    append!(hourly_usage, scaled_daily_pattern[1:(length(hourly_timestamps) - length(hourly_usage))])
end


solar_production = zeros(length(hourly_timestamps))  # Solar production is set to zero

# Create DataFrame
data = DataFrame(timestamp = hourly_timestamps, grid = hourly_usage, solar = solar_production)
data[!, :date] = Date.(data.timestamp)  # Add a 'date' column to the DataFrame

# Process daily data
daily_data = groupby(data, :date)
daily_grid_usage = combine(daily_data, :grid => sum => :grid_sum)

# Initialize the plot
theme(:ggplot2)  # Set a theme for the plots

# Daily usage bar plot
daily_plot = bar(1:24, scaled_daily_pattern, 
                 xlabel="Hour of Day", ylabel="Grid Usage (kWh)", 
                 title="Hourly Grid Usage Pattern", legend=:topright, color=:blue)

# Display the plot
daily_plot