using HTTP
using JSON
using Dates
using CSV
using DataFrames

################# fetch data & get avg #######################
function fetchData(auth_token::String)
    url = "http://127.0.0.1:8000/api/uploaded_files/"  # Replace with your actual base URL
    headers = ["Authorization" => "Bearer $auth_token"]
    global total_daily_kWh = 0
    try
        response = HTTP.get(url, headers)
        if response.status == 200
            data = JSON.parse(String(response.body))
            global net_values
            net_values = []
            global consumption_data
            consumption_data = []
            global date_time_data
            date_time_data = []
            for d in data
                push!(net_values, parse(Float64, d["net"]))
                push!(consumption_data, parse(Float64, d["consumption"]))
                push!(date_time_data, DateTime(d["date"] * " " * d["time"], "yyyy-mm-dd HH:MM AMPM"))
            end
            println(net_values)
            println(auth_token)
            num_days = length(net_values) / 24
            global total_daily_kWh = sum(net_values) / num_days  # Average daily usage
        else
            println("Error: API request failed with status code $(response.status)")
        end
    catch e
        println("Error: $e")
    end
end

################# charging and discharging logic #######################
function process_charging_discharging()
    # Define peak time slots
    on_peak_hours = 16:21
    off_peak_hours = 6:16
    super_off_peak_hours = 0:6

    # Battery parameters
    battery_capacity = 10.0  # kWh
    charge_rate = 2.0        # kWh/hour
    discharge_rate = 2.0     # kWh/hour
    efficiency = 0.85        # Efficiency of battery

    # Initialize battery state
    battery_state = 0.0      # Current battery charge level in kWh

    charging_schedule = Dict{DateTime, Float64}()
    discharging_schedule = Dict{DateTime, Float64}()

    for (i, dt) in enumerate(date_time_data)
        consumption = consumption_data[i]

        if hour(dt) in on_peak_hours && consumption > 1.5
            # Discharge during On-Peak hours and when consumption > 1.5
            discharge_amount = min(discharge_rate, battery_state)
            battery_state -= discharge_amount
            discharging_schedule[dt] = discharge_amount
        elseif hour(dt) in off_peak_hours || hour(dt) in super_off_peak_hours
            # Charge during Off-Peak and Super Off-Peak hours
            charge_amount = min(charge_rate * efficiency, battery_capacity - battery_state)
            battery_state += charge_amount
            charging_schedule[dt] = charge_amount
        else
            # No action for other hours
            charging_schedule[dt] = 0.0
            discharging_schedule[dt] = 0.0
        end
    end

    return Dict(
        "charging_schedule" => charging_schedule,
        "discharging_schedule" => discharging_schedule
    )
end

########### define API endpoint ####################
function handle_request(req::HTTP.Request)
    # Handle OPTIONS request for CORS preflight
    if HTTP.method(req) == "OPTIONS"
        return HTTP.Response(200, [
            "Access-Control-Allow-Origin" => "*",
            "Access-Control-Allow-Methods" => "GET,POST,OPTIONS",
            "Access-Control-Allow-Headers" => "Content-Type, Authorization"
        ])
    end

    # Extract Authorization header
    headers = req.headers
    app_header = headers[4]  # Bearer & token
    token = String(split(app_header[2], " ")[2])  # Extract token
    println(token)

    # Fetch data using the extracted token
    fetchData(token)

    # Handle GET request for the /api/savings endpoint
    if HTTP.method(req) == "GET" && req.target == "/api/charging/"
        # Process charging and discharging data
        charging_discharging_data = process_charging_discharging()

        # Convert data to JSON and return the response
        return HTTP.Response(200, ["Access-Control-Allow-Origin" => "*", "Content-Type" => "application/json"], JSON.json(charging_discharging_data))
    end

    # Fallback for unsupported requests
    return HTTP.Response(405, ["Access-Control-Allow-Origin" => "*"], "Method Not Allowed")
end

# Start the HTTP server
HTTP.serve(handle_request, "0.0.0.0", 8081)
