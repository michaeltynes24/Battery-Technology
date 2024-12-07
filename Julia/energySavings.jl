import Pkg

pwd()
Pkg.activate(".")
Pkg.instantiate()
Pkg.status()
Pkg.add("Plots")

using Plots
using Dates

# Define winter and summer time slots with rates
winter_time_slots = Dict(
    "Super Off-Peak" => [(0, 6), (10, 14)],
    "Off-Peak" => [(6, 10), (14, 16), (21, 24)],
    "On-Peak" => [(16, 21)]
)

summer_time_slots = Dict(
    "Super Off-Peak" => [(0, 2)],
    "Off-Peak" => [(14, 16), (21, 24)],
    "On-Peak" => [(16, 21)]
)

# Define winter and summer rates
winter_rates = Dict(
    "Super Off-Peak" => 0.31042,
    "Off-Peak" => 0.36749,
    "On-Peak" => 0.41406
)

summer_rates = Dict(
    "Super Off-Peak" => 0.31649,
    "Off-Peak" => 0.39199,
    "On-Peak" => 0.63673
)

# Define average daily electricity usage for a California household
total_daily_kWh = 20.0  # 20 kWh per day

# Define the percentage of daily usage during different time periods
on_peak_percentage = 0.30
off_peak_percentage = 0.50
super_off_peak_percentage = 0.20

# Calculate daily usage during different time periods
on_peak_kWh = total_daily_kWh * on_peak_percentage
off_peak_kWh = total_daily_kWh * off_peak_percentage
super_off_peak_kWh = total_daily_kWh * super_off_peak_percentage

# Define battery efficiencies with string keys
bat_efficiency = Dict(
    "None" => 1.0,           # No battery efficiency
    "Lithium-ion" => 0.85,   # Lithium-ion battery efficiency
    "Sodium-ion" => 0.9      # Sodium-ion battery efficiency
)

# Define battery cost constants
C_b_dis = 10  # Discharging cost
C_b_ch = 2    # Charging cost

# Define battery capacities
S_base = 100  # 100 kW

# Initialize arrays to store yearly spending with batteries
spending_with_batteries = Dict(
    "Year - None" => 0.0,
    "Year - Lithium-ion" => 0.0,
    "Year - Sodium-ion" => 0.0
)

# Function to calculate yearly spending
function calculate_yearly_spending(rates, super_off_peak_kWh, off_peak_kWh, on_peak_kWh)
    return (rates["Super Off-Peak"] * super_off_peak_kWh +
            rates["Off-Peak"] * off_peak_kWh +
            rates["On-Peak"] * on_peak_kWh) * 365
end

# Calculate yearly spending without and with batteries for winter and summer
for (season, season_rates) in [("Year", Dict("Super Off-Peak" => 0.5 * (winter_rates["Super Off-Peak"] + summer_rates["Super Off-Peak"]),
                                             "Off-Peak" => 0.5 * (winter_rates["Off-Peak"] + summer_rates["Off-Peak"]),
                                             "On-Peak" => 0.5 * (winter_rates["On-Peak"] + summer_rates["On-Peak"])))]

    for (bat_type, efficiency) in bat_efficiency
        battery_cost = calculate_yearly_spending(
            season_rates, 
            super_off_peak_kWh * efficiency, 
            off_peak_kWh * efficiency, 
            on_peak_kWh * efficiency
        )
        spending_with_batteries["$season - $bat_type"] += battery_cost
    end
end

# Calculate savings for lithium-ion and sodium-ion batteries
savings_lithium_ion = spending_with_batteries["Year - None"] - spending_with_batteries["Year - Lithium-ion"]
savings_sodium_ion = spending_with_batteries["Year - None"] - spending_with_batteries["Year - Sodium-ion"]

# Create the bar plot
p = bar(["None", "Lithium-ion", "Sodium-ion"], 
        [spending_with_batteries["Year - None"], spending_with_batteries["Year - Lithium-ion"], spending_with_batteries["Year - Sodium-ion"]],
        xlabel = "Battery Type", 
        ylabel = "Yearly Spending (\$)",
        title = "Yearly Spending Comparison",
        legend = false)

# Annotate each bar with its spending value
for (i, label) in enumerate(["None", "Lithium-ion", "Sodium-ion"])
    annotate!(p, i, spending_with_batteries["Year - $label"], text("\$$(round(spending_with_batteries["Year - $label"], digits=2))", :center))
end

display(p)

# Show savings and spending
println("\nSpending Comparison:")
println("No Battery: \$$(round(spending_with_batteries["Year - None"], digits=2))")
println("With Lithium-ion Battery: \$$(round(spending_with_batteries["Year - Lithium-ion"], digits=2))")
println("With Sodium-ion Battery: \$$(round(spending_with_batteries["Year - Sodium-ion"], digits=2))")
println("\nSavings with Lithium-ion Battery: \$$(round(savings_lithium_ion, digits=2))")
println("Savings with Sodium-ion Battery: \$$(round(savings_sodium_ion, digits=2))")
