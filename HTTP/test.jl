

import Pkg
pwd()
Pkg.activate(".")
Pkg.instantiate()
Pkg.status()

# Pkg.add("JuMP")
# Pkg.add("Gurobi")


using JuMP
#using Gurobi
using GLPK
# using Mosek
using Ipopt

function bat()

    return()
end

B=1:5
T=1:24
S_base=100  # base Power of the system 100 kW
Eb_min=0/S_base
Eb_max=10/S_base # p.u.
## price of battery 120 $/kWh=12000$/p.u. , life cycle of battery 1000 => cost of each cycle= $12 , C_dis_average=10$/p.u.  C_ch_average=2$/p.u. 
C_b_dis=10
C_b_ch=2

battery_prob=Model(GLPK.Optimizer)
#battery_prob=Model(Gurobi.Optimizer)
# battery_prob=Model(Ipopt.Optimizer)

@variable(battery_prob,Pb_ch[B,T]>=0)
@variable(battery_prob,Pb_dis[B,T]>=0)

@variable(battery_prob,Eb_min<=Eb[B,T]<=Eb_max)

@constraint(battery_prob,λ_E_b[b in B, t in T; t!=1], Eb[b,t]== Eb[b,t-1]+Pb_ch[b,t]-Pb_dis[b,t])
@constraint(battery_prob,λ_E_b1[b in B, t in 1], Eb[b,t]== Eb[b,length(T)]+Pb_ch[b,t]-Pb_dis[b,t])

@objective(battery_prob, Min, sum(Pb_ch[b,t]*C_b_ch+Pb_dis[b,t]*C_b_dis for b in B, t in T) )

JuMP.optimize!(battery_prob)
JuMP.objective_value(battery_prob)



using HTTP, JSON

const PORT = 8080

function handle_request(request::HTTP.Request)
    # Check if the request method is POST and the content type is application/json
    if request.method == "POST" && occursin("application/json", request.headers["Content-Type"])
        # Try to parse the JSON data
        try
            data = JSON.parse(String(request.body))
            println("Received JSON data: ", data)
            return HTTP.Response(200, "JSON received successfully!")
        catch e
            return HTTP.Response(400, "Invalid JSON data!")
        end
    else
        return HTTP.Response(405, "Method Not Allowed")
    end
end

function start_server()
    HTTP.serve(handle_request, "127.0.0.1", PORT; verbose=true)
    println("Server is running on http://127.0.0.1:$PORT")
end

start_server()
