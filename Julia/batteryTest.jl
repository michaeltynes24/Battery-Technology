
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

# Process the dataset
# Create a combined DateTime column
df[!, :DateTime] = DateTime.(df[:, :Date] .* " " .* df[:, :Start_Time], dateformat"m/d/yyyy h:MM AMPM")

# Ensure numeric columns have proper types and replace missing values
df[:, :Consumption] = coalesce.(df[:, :Consumption], 0.0)
df[:, :Solar] = coalesce.(df[:, :Solar], 0.0)

# Filter by the required year (2024)
df = filter(row -> year(row[:DateTime]) == 2024, df)

# Define demand (Consumption) and solar availability
D = 1:365
T = 1:24
pd = zeros(length(D), length(T))        # grid demand
ps = zeros(length(D), length(T))        # solar availability
start_date = DateTime(2024, 1, 1)

# Populate pd and ps arrays
for d in D
    for t in T
        # Filter data for each day-hour combination
        target_time = start_date + Hour(t - 1) + Day(d - 1)
        matching_row = findfirst(row -> row[:DateTime] == target_time, eachrow(df))

        if !isnothing(matching_row)
            pd[d, t] = df[matching_row, :Consumption]
            ps[d, t] = df[matching_row, :Solar]
        end
    end
end

# Handle missing or zero entries in pd (if any exist)
[pd[d, t] = pd[d - 1, t] for d in 2:length(D), t in T if pd[d, t] == 0]

# Define battery optimization parameters
B = 1:5             # Number of batteries
T = 1:24            # Time intervals in a day
S_base = 100.0      # Base power of the system (100 kW)
Eb_min = 0.0        # Minimum battery energy level
Eb_max = 10.0 / S_base # Maximum battery energy (p.u.)

# Battery cost parameters
C_b_dis = 10.0      # Discharging cost ($/p.u.)
C_b_ch = 2.0        # Charging cost ($/p.u.)

# Create a battery optimization problem
battery_prob = Model(GLPK.Optimizer)

@variable(battery_prob, Pb_ch[B, T] >= 0)                  # Charging power
@variable(battery_prob, Pb_dis[B, T] >= 0)                 # Discharging power
@variable(battery_prob, Eb_min <= Eb[B, T] <= Eb_max)      # Energy level

@constraint(battery_prob, λ_E_b[b in B, t in T; t != 1],
    Eb[b, t] == Eb[b, t - 1] + Pb_ch[b, t] - Pb_dis[b, t])
@constraint(battery_prob, λ_E_b1[b in B, t in 1],
    Eb[b, t] == Eb[b, length(T)] + Pb_ch[b, t] - Pb_dis[b, t])

@objective(battery_prob, Min,
    sum(Pb_ch[b, t] * C_b_ch + Pb_dis[b, t] * C_b_dis for b in B, t in T))

# Solve the optimization problem
JuMP.optimize!(battery_prob)

# Retrieve the optimal objective value
optimal_cost = JuMP.objective_value(battery_prob)
println("Optimal Cost: $optimal_cost")

# Data aggregation for visualization
daily_grid_sum = combine(groupby(df, :Date), :Consumption => sum => :grid_sum)
daily_solar_sum = combine(groupby(df, :Date), :Solar => sum => :solar_sum)

yearly_grid_sum = combine(groupby(daily_grid_sum, :Date => x -> year(Date(x, "m/d/yyyy"))), 
                          :grid_sum => sum => :grid_sum, renamecols=false)
yearly_solar_sum = combine(groupby(daily_solar_sum, :Date => x -> year(Date(x, "m/d/yyyy"))), 
                           :solar_sum => sum => :solar_sum, renamecols=false)

# Visualization
using Plots

# Set the global plotting theme
theme(:white)

# Define custom colors
grid_color = :blue
solar_color = :orange

# Plot daily usage
daily_plot = plot(daily_grid_sum[:Date], daily_grid_sum[:grid_sum], label="Daily Grid Usage", color=grid_color,
    xlabel="Date", ylabel="Usage (kWh)", title="Daily Usage",
    xrotation=45, legend=:topright, linewidth=2)

plot!(daily_solar_sum[:Date], daily_solar_sum[:solar_sum], label="Daily Solar Usage", color=solar_color, linewidth=2)

# Customize yearly usage plot
yearly_plot = plot(yearly_grid_sum[:Date], yearly_grid_sum[:grid_sum], label="Yearly Grid Usage", color=grid_color,
    xlabel="Year", ylabel="Usage (kWh)", title="Yearly Usage",
    legend=:topright, linewidth=2, marker=:circle, markersize=4)

plot!(yearly_solar_sum[:Date], yearly_solar_sum[:solar_sum], label="Yearly Solar Usage", color=solar_color, linewidth=2, marker=:circle, markersize=4)

# Combine plots
combined_plot = plot(daily_plot, yearly_plot, layout=(2, 1), size=(800, 800))

# Customize the overall appearance
title!(combined_plot, "Grid and Solar Energy Usage")
xlabel!(combined_plot, "Date / Year")
ylabel!(combined_plot, "Usage (kWh)")
