import Pkg

# Activate and instantiate the environment
Pkg.activate(".")
Pkg.instantiate()

# Import required packages
using Dates, CSV, DataFrames

# Define the energy savings module
function energy_savings_module(file_path::String)
    # Load CSV data
    df = DataFrame(CSV.File(file_path))

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

    # Define battery efficiencies
    bat_efficiency = Dict(
        "None" => 1.0,
        "Lithium-ion" => 0.85,
        "Sodium-ion" => 0.9
    )

    # Initialize spending dictionary
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

    # Average seasonal rates
    season_rates = Dict(
        "Super Off-Peak" => 0.5 * (winter_rates["Super Off-Peak"] + summer_rates["Super Off-Peak"]),
        "Off-Peak" => 0.5 * (winter_rates["Off-Peak"] + summer_rates["Off-Peak"]),
        "On-Peak" => 0.5 * (winter_rates["On-Peak"] + summer_rates["On-Peak"])
    )

    # Calculate spending for each battery type
    for (bat_type, efficiency) in bat_efficiency
        spending_with_batteries["Year - $bat_type"] = calculate_yearly_spending(
            season_rates,
            super_off_peak_kWh * efficiency,
            off_peak_kWh * efficiency,
            on_peak_kWh * efficiency
        )
    end

    return Dict(
        "spending_with_batteries" => spending_with_batteries
    )
end

# Define a global function to expose `spending_with_batteries`
function spending_with_batteries(file_path::String)
    result = energy_savings_module(file_path)
    return result["spending_with_batteries"]
end

# Export the function globally
global spending_with_batteries


