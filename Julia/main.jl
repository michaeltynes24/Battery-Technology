import Pkg

pwd()
Pkg.activate(".")
Pkg.instantiate()
Pkg.status()

using JuMP
using GLPK
using JSON
using HTTP

# Global configuration to store settings
const CONFIG = Dict(
    :provider => "",
    :bat_flag => 1,
    :η_bat => 1.0
)

# Function to set battery efficiency based on battery type
function set_battery_efficiency(bat_flag::Int)
    if bat_flag == 1
        CONFIG[:η_bat] = 0.85  # Efficiency for Li-ion
    elseif bat_flag == 2
        CONFIG[:η_bat] = 0.9  # Efficiency for Na-ion
    else
        CONFIG[:η_bat] = 1.0  # Default efficiency
    end
    CONFIG[:bat_flag] = bat_flag
end

# Define Model function using global CONFIG settings
function create_battery_model(α, pd)
    Bat_model = Model(GLPK.Optimizer)
    @variable(Bat_model, pb_ch[t in T, d in D] >= 0)  # charging power of battery
    @variable(Bat_model, pb_dis[t in T, d in D] >= 0)  # discharge power of battery
    @variable(Bat_model, Eb[t in T, d in D])  # Energy of battery
    @variable(Bat_model, ps[t in T, d in D] >= 0)  # solar power
    @variable(Bat_model, pg[t in T, d in D] >= 0)  # power bought from grid

    if CONFIG[:bat_flag] != 0
        @constraint(Bat_model, mu_b_ch[t in T, d in D], pb_ch[t, d] <= pb_max)
        @constraint(Bat_model, mu_b_dis[t in T, d in D], pb_dis[t, d] <= pb_max)
        @constraint(Bat_model, mu_Eb_max[t in T, d in D], Eb[t, d] <= E_b_max)
        @constraint(Bat_model, mu_Eb_min[t in T, d in D], Eb[t, d] >= E_b_min)
        @constraint(Bat_model, mu_s[t in T, d in D], ps[t, d] <= ps_max[t, d])

        # Starting and continuity constraints for SOC
        @constraint(Bat_model, lambda_E_p_bat_1[t in 1, d in 1], Eb[t, d] == E_b_max)
        @constraint(Bat_model, lambda_E_p_bat_dis[t in T, d in D; t > 1],
                    Eb[t, d] == Eb[t - 1, d] + CONFIG[:η_bat] * pb_ch[t, d] - pb_dis[t, d] / CONFIG[:η_bat])
        @constraint(Bat_model, lambda_E_p_bat_days[d in D; d > 1],
                    Eb[1, d] == Eb[24, d - 1] + CONFIG[:η_bat] * pb_ch[1, d] - pb_dis[1, d] / CONFIG[:η_bat])
    else
        @constraint(Bat_model, mu_b_ch[t in T, d in D], pb_ch[t, d] == 0)
        @constraint(Bat_model, mu_b_dis[t in T, d in D], pb_dis[t, d] == 0)
    end

    @constraint(Bat_model, power_balance[t in T, d in D],
                ps[t, d] + pg[t, d] + pb_dis[t, d] == pb_ch[t, d] + pd[d, t])

    @objective(Bat_model, Min, sum((pb_ch[t, d] + pb_dis[t, d]) * γ_b + α[t] * pg[t, d] for t in T, d in D))

    JuMP.optimize!(Bat_model)

    return JuMP.objective_value(Bat_model)
end

# Web Server setup
const PORT = 8080

function handle_request(request::HTTP.Request)
    # Handle optimization request
    if request.method == "POST" && request.target == "/optimize"
        data = JSON.parse(String(request.body))
        result = create_battery_model(data["α"], data["pd"])
        return HTTP.Response(200, body=JSON.json(result))

    # Handle settings request
    elseif request.method == "POST" && request.target == "/settings"
        data = JSON.parse(String(request.body))
        
        # Update global CONFIG with new settings
        CONFIG[:provider] = data["provider"]
        
        # Set battery type and efficiency
        set_battery_efficiency(data["bat_flag"])

        return HTTP.Response(200, body=JSON.json("Settings updated successfully"))

    else
        return HTTP.Response(404, body="Not Found")
    end
end

function start_server()
    HTTP.serve(handle_request, "127.0.0.1", PORT)
    println("Server is running on port http://127.0.0.1:$PORT...")
end

# Start server
start_server()
