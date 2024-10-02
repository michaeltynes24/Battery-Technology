
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
average_monthly_usage_kWh = 557  # average monthly usage in kWh
days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

# Generate mock data
start_date = DateTime(2018, 1, 1)
end_date = DateTime(2018, 12, 31, 23)
hourly_timestamps = start_date:Hour(1):end_date

# Simulate random grid usage values (in kWh) based on average monthly usage
monthly_factors = rand(Normal(1, 0.1), 12)  # random fluctuation around the mean
monthly_usage = [average_monthly_usage_kWh * factor for factor in monthly_factors]
daily_usage = [monthly / days_in_month[month] for (month, monthly) in enumerate(monthly_usage) for _ in 1:days_in_month[month]]

# Assume uniform distribution of daily usage into hourly blocks
hourly_usage = repeat(daily_usage ./ 24, inner=24)

# Ensure total length matches the original data generation length
if length(hourly_usage) > length(hourly_timestamps)
    hourly_usage = hourly_usage[1:length(hourly_timestamps)]
else
    hourly_usage = vcat(hourly_usage, zeros(length(hourly_timestamps) - length(hourly_usage)))
end

solar_production = zeros(length(hourly_timestamps))  # Solar production is set to zero

# Create DataFrame
data = DataFrame(timestamp = hourly_timestamps, grid = hourly_usage, solar = solar_production)
data[!, :date] = Date.(data.timestamp)  # Add a 'date' column to the DataFrame

# Process daily data
daily_data = groupby(data, :date)
daily_grid_usage = combine(daily_data, :grid => sum => :grid_sum)  # Sum up hourly data for daily usage

# Process monthly data
data[!, :month] = month.(data.timestamp)  # Add a 'month' column to the DataFrame
monthly_data = groupby(data, :month)
monthly_grid_usage = combine(monthly_data, :grid => sum => :grid_sum)

# Initialize the plot
theme(:ggplot2)  # Set a theme for the plots

# Daily usage bar plot
daily_plot = bar(daily_grid_usage.date, daily_grid_usage.grid_sum, label="Daily Grid Usage",
                  xlabel="Date", ylabel="Grid Usage (kWh)", title="Daily Grid Usage",
                  legend=:topright, color=:blue)

# Monthly usage bar plot
monthly_plot = bar(monthly_grid_usage.month, monthly_grid_usage.grid_sum, label="Monthly Grid Usage",
                    xlabel="Month", ylabel="Grid Usage (kWh)", title="Monthly Grid Usage",
                    legend=:topright, color=:red)

# Display the plots
plot(daily_plot, monthly_plot, layout=(2, 1), size=(800, 600))