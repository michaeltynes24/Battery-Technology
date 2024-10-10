cd("C:\\Users\\alexr\\OneDrive\\Documents\\GitHub\\Battery-Technology\\Julia")

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

" data given by the user to the webserver"

csv_reader = CSV.File("15minute_data_california.csv")
df = DataFrame(csv_reader)

df_sorted = sort(df, order(:local_15min,))

df_dem_sol = df_sorted[:, [:dataid, :local_15min, :grid, :solar]]


df_dem_sol[!, :year] = [parse(Int, chop(df_dem_sol[i, 2], head=0, tail=18)) for i in 1:length(df_dem_sol[:, 2])]
df_dem_sol
df_dem_sol = filter(row -> (row["year"] == 2018), df_dem_sol)
df_dem_sol[:, 4] = replace!(df_dem_sol[:, 4], missing => 0)
df_dem_sol
df_dem_sol = filter(row -> (row["dataid"] == 1731), df_dem_sol)
df_dem_sol
"demand input"

start_date = Dates.DateTime(2018, 01, 01, 01, 00)

D = 1:365
T = 1:24
pd = zeros(length(D), length(T))        # solar availability
ps = zeros(length(D), length(T))
h = start_date

# counter=0
for d in D
    for t in T
        for i in 1:length(df_dem_sol[:, 2])
            if parse(Int64, split(split(split(df_dem_sol[i, 2], ' ')[2], '-')[1], ':')[1]) == Dates.hour(h) && parse(Int, split(split(df_dem_sol[i, 2], ' ')[1], '-')[2]) == Dates.month(h) && parse(Int, split(split(df_dem_sol[i, 2], ' ')[1], '-')[3]) == Dates.day(h) #=&& parse(Int64,split(split(split(df_dem_sol[i,2],' ')[2],'-')[1],':')[2])==Dates.minute(h)=#
                # println(df_dem_sol[i,2])
                pd[d, t] = df_dem_sol[i, 3]
                ps[d, t] = df_dem_sol[i, 4]
                # counter+=1
            end
        end
        h += Hour(1)
    end
end
# counter
pd
[pd[d, t] = pd[d-1, t] for d in D, t in T if pd[d, t] == 0]
minimum(pd)

start_date = Dates.DateTime(2018, 01, 01, 00, 00)
da = start_date

counter = 0
for d in D
    for t in T
        counter += 1
        pd = df_dem_sol[counter, 3]
        da += Hour(1)
    end
end
B = 1:5
T = 1:24
S_base = 100  # base Power of the system 100 kW
Eb_min = 0 / S_base
Eb_max = 10 / S_base # p.u.
## price of battery 120 $/kWh=12000$/p.u. , life cycle of battery 1000 => cost of each cycle= $12 , C_dis_average=10$/p.u.  C_ch_average=2$/p.u. 
C_b_dis = 10
C_b_ch = 2

battery_prob = Model(GLPK.Optimizer)
#battery_prob=Model(Gurobi.Optimizer)
# battery_prob=Model(Ipopt.Optimizer)


@variable(battery_prob, Pb_ch[B, T] >= 0)
@variable(battery_prob, Pb_dis[B, T] >= 0)

@variable(battery_prob, Eb_min <= Eb[B, T] <= Eb_max)

@constraint(battery_prob, λ_E_b[b in B, t in T; t != 1], Eb[b, t] == Eb[b, t-1] + Pb_ch[b, t] - Pb_dis[b, t])
@constraint(battery_prob, λ_E_b1[b in B, t in 1], Eb[b, t] == Eb[b, length(T)] + Pb_ch[b, t] - Pb_dis[b, t])

@objective(battery_prob, Min, sum(Pb_ch[b, t] * C_b_ch + Pb_dis[b, t] * C_b_dis for b in B, t in T))

JuMP.optimize!(battery_prob)
JuMP.objective_value(battery_prob)


using Plots

# Set the global plotting theme
theme(:white)

# Define custom colors
grid_color = :blue
solar_color = :orange

# Plot daily usage
daily_plot = plot(daily_grid_sum.local_15min, daily_grid_sum.grid_sum, label="Daily Grid Usage", color=grid_color,
    xlabel="Date", ylabel="Usage (kWh)", title="Daily Usage",
    xrotation=45, legend=:topright, linewidth=2)

plot!(daily_solar_sum.local_15min, daily_solar_sum.solar_sum, label="Daily Solar Usage", color=solar_color, linewidth=2)

# Customize yearly usage plot
yearly_plot = plot(yearly_grid_sum.year, yearly_grid_sum.grid_sum, label="Yearly Grid Usage", color=grid_color,
    xlabel="Year", ylabel="Usage (kWh)", title="Yearly Usage",
    legend=:topright, linewidth=2, marker=:circle, markersize=4)

plot!(yearly_solar_sum.year, yearly_solar_sum.solar_sum, label="Yearly Solar Usage", color=solar_color, linewidth=2, marker=:circle, markersize=4)

# Combine plots
combined_plot = plot(daily_plot, yearly_plot, layout=(2, 1), size=(800, 800))

# Customize the overall appearance
title!(combined_plot, "Grid and Solar Energy Usage")
xlabel!(combined_plot, "Date / Year")
ylabel!(combined_plot, "Usage (kWh)")