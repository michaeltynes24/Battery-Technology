
cd("C:\\Users\\alexr\\OneDrive\\Documents\\GitHub\\Senior_design_A_VAM2S_Solar_System\\Folder1")
import Pkg

pwd()
Pkg.activate(".")
Pkg.instantiate()
Pkg.status()


using JuMP
using GLPK
using JSON
using HTTP

bat_flag=1
if bat_flag!=0
    if bat_flag==1
        η_bat= 0.85  # efficiency of the inverter and battery
    end
    if bat_flag==2
        η_bat= 0.9  # efficiency of the inverter and battery
    end
end

"Model"
function(bat_flag,α,η_bat,pd)
    
    Bat_model=Model(GLPK.Optimizer)
    @variable(Bat_model,pb_ch[t in T, d in D]>=0)      # charging power of battery
    @variable(Bat_model,pb_dis[t in T, d in D]>=0)      # discharge power of battery
    @variable(Bat_model,Eb[t in T, d in D])      # Energy of battery
    @variable(Bat_model,ps[t in T, d in D]>=0)      # solar power
    @variable(Bat_model,pg[t in T, d in D]>=0)      # power bought from grid

    if bat_flag!=0
        @constraint(Bat_model,mu_b_ch[ t in T, d in D],pb_ch[t,d]<= pb_max)
        @constraint(Bat_model,mu_b_dis[ t in T, d in D],pb_dis[t,d]<= pb_max)
        @constraint(Bat_model,mu_Eb_max[ t in T, d in D],Eb[t,d]<= E_b_max)
        @constraint(Bat_model,mu_Eb_min[ t in T, d in D],Eb[t,d]>= E_b_min)
        @constraint(Bat_model,mu_s[t in T, d in D],ps[t,d]<= ps_max[t,d])

        @constraint(Bat_model,lamdba_E_p_bat_1[t in 1, d in 1],Eb[t,d]==E_b_max) #starting SOC
        @constraint(Bat_model,lamdba_E_p_bat_dis[t in T, d in D; t>1],Eb[t,d]==Eb[t-1,d]+η_bat*pb_ch[t,d]-pb_dis[t,d]/η_bat)   #energy of battery equation
        @constraint(Bat_model,lamdba_E_p_bat_days[d in D;d>1],Eb[1,d]==Eb[24,d-1]+η_bat*pb_ch[1,d]-pb_dis[1,d]/η_bat) #energy of battery relation for first hour of the day and the last hour of previous day
    end
    if bat_flag==0
        @constraint(Bat_model,mu_b_ch[ t in T, d in D],pb_ch[t,d]== 0)
        @constraint(Bat_model,mu_b_dis[ t in T, d in D],pb_dis[t,d]== 0)
    end

    @constraint(Bat_model,mu_s[t in T, d in D],ps[t,d]<= ps_max[t,d])

    @constraint(Bat_model,power_balance[t in T,d in D],ps[t,d]+pg[t,d]+pb_dis[t,d]==pb_ch[t,d]+pd[d,t])

    @objective(Bat_model,Min,sum((pb_ch[t,d]+pb_dis[t,d])*γ_b+α[t]*pg[t,d] for t in T,d in D))

    JuMP.optimize!(Bat_model)
    
    return JuMP.objective_value(battery_prob)
end

"Creating the Web Server"

const PORT = 8080

function handle_request(request::HTTP.Request)
    # Check if the request method is POST and the path is correct
    if request.method == "POST" && request.target == "/optimize"
        # Parse the JSON body of the request
        data = JSON.parse(String(request.body))
        
        # Run the optimization problem with the provided data
        result = optimize_problem(data)
        
        # Convert the result to JSON and return it
        return HTTP.Response(200, body=JSON.json(result))
    else
        # Return a 404 Not Found for any other request
        return HTTP.Response(404, body="Not Found")
    end
end

function start_server()
    HTTP.serve(handle_request, "127.0.0.1", PORT)
    println("Server is running on port http://127.0.0.1:$PORT...")
end

# Start the server
start_server()

"Sending a Request"