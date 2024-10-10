
import Pkg
pwd()
Pkg.activate(".")
Pkg.instantiate()
Pkg.status()


using JuMP

using GLPK
using Ipopt
using CSV
using DataFrames

" defining parameters"
S_base=1e3  # 1 kVA 
γ_b=0.06   # degradation cost of the battery $/kW

D=1:365    # number of days in a year 
T=1:24     # number of hours in a day
D_type=1:2
# α, b , s , flag, demand    These are the inputs of the JSON file


α=zeros(length(T),length(D_type))   # ToU pricing of electricity
for t in T
    if (t>=1 && t<=5) || (t>=10 && t<=13)
        α[t]=0.31       ###  31 cents/kw # super off-peak
    end
    if (t>=6 && t<=9) || (t>=14 && t<=15) || (t>=21)
        α[t]=0.36       ###  36 cents/kW  # off-peak
    end
    if t>=16 && t<=20
        α[t]=0.50       ###  50 cents/kW  # peak
    end
end
E_b_max=100 #100 kWh
E_b_min=0 
pb_max=2.5
ps_max=zeros(length(T),length(D))    # maximum available solar power obtained from pecan street data
pd=zeros(length(T),length(D))    # electricity consumption of a house obtained from pecan street 

bat_flag=1  # Li-ion
bat_flag=2  # Na-ion

if bat_flag==1
    η_bat= 0.85  # efficiency of the inverter and battery
end
if bat_flag==2
    η_bat= 0.9  # efficiency of the inverter and battery
end

"Model"
function(bat_flag,α,η_bat,pd)
    
    Bat_model=Model(GLPK.Optimizer)
    @variable(Bat_model,pb_ch[t in T, d in D]>=0)      # charging power of battery
    @variable(Bat_model,pb_dis[t in T, d in D]>=0)      # discharge power of battery
    @variable(Bat_model,Eb[t in T, d in D])      # Energy of battery
    @variable(Bat_model,ps[t in T, d in D]>=0)      # solar power
    @variable(Bat_model,pg[t in T, d in D]>=0)      # power bought from grid

    @objective(Bat_model,Min,sum((pb_ch[t,d]+pb_dis[t,d])*γ_b+α[t]*pg[t,d] for t in T,d in D))

    @constraint(Bat_model,mu_b_ch[ t in T, d in D],pb_ch[t,d]<= pb_max)
    @constraint(Bat_model,mu_b_dis[ t in T, d in D],pb_dis[t,d]<= pb_max)
    @constraint(Bat_model,mu_Eb_max[ t in T, d in D],Eb[t,d]<= E_b_max)
    @constraint(Bat_model,mu_Eb_min[ t in T, d in D],Eb[t,d]>= E_b_min)
    @constraint(Bat_model,mu_s[t in T, d in D],ps[t,d]<= ps_max[t,d])

    @constraint(Bat_model,lamdba_E_p_bat_1[t in 1, d in 1],Eb[t,d]==E_b_max) #starting SOC
    @constraint(Bat_model,lamdba_E_p_bat_dis[t in T, d in D; t>1],Eb[t,d]==Eb[t-1,d]+η_bat*pb_ch[t,d]-pb_dis[t,d]/η_bat)   #energy of battery equation
    @constraint(Bat_model,lamdba_E_p_bat_days[d in D;d>1],Eb[1,d]==Eb[24,d-1]+η_bat*pb_ch[1,d]-pb_dis[1,d]/η_bat) #energy of battery relation for first hour of the day and the last hour of previous day

    @constraint(Bat_model,power_balance[t in T,d in D],ps[t,d]+pg[t,d]+pb_dis[t,d]==pb_ch[t,d]+pd[d,t])

    JuMP.optimize!(Bat_model)
    
    return JuMP.objective_value(battery_prob)
end
