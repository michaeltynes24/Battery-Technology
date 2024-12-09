import Pkg

Pkg.activate(".")
Pkg.instantiate()

using JuMP, GLPK, CSV, DataFrames, Dates

function battery_test_module(file_path::String)
    # Load CSV data
    df = DataFrame(CSV.File(file_path))

    # Create DateTime column
    df[!, :DateTime] = DateTime.(df.Date .* " " .* df.Start_Time, dateformat"m/d/yyyy h:MM AMPM")

    # Filter for 2024
    df = filter(row -> year(row[:DateTime]) == 2024, df)

    D = 1:365
    T = 1:24
    pd = zeros(length(D), length(T))  # Demand
    ps = zeros(length(D), length(T))  # Solar
    start_date = DateTime(2024, 1, 1)

    for d in D
        for t in T
            target_time = start_date + Hour(t - 1) + Day(d - 1)
            idx = findfirst(row -> row[:DateTime] == target_time, eachrow(df))
            if !isnothing(idx)
                pd[d, t] = df[idx, :Consumption]
                ps[d, t] = df[idx, :Solar]
            end
        end
    end

    B = 1:5
    S_base = 100.0
    Eb_min = 0.0
    Eb_max = 10.0 / S_base
    C_b_dis = 10.0
    C_b_ch = 2.0

    battery_prob = Model(GLPK.Optimizer)

    @variable(battery_prob, Pb_ch[B, T] >= 0)
    @variable(battery_prob, Pb_dis[B, T] >= 0)
    @variable(battery_prob, Eb_min <= Eb[B, T] <= Eb_max)

    @constraint(battery_prob, [b in B, t in T; t != 1],
        Eb[b, t] == Eb[b, t - 1] + Pb_ch[b, t] - Pb_dis[b, t])
    @constraint(battery_prob, [b in B, t in 1],
        Eb[b, t] == Eb[b, length(T)] + Pb_ch[b, t] - Pb_dis[b, t])

    @objective(battery_prob, Min,
        sum(Pb_ch[b, t] * C_b_ch + Pb_dis[b, t] * C_b_dis for b in B, t in T))

    JuMP.optimize!(battery_prob)

    return Dict(
        "optimal_cost" => JuMP.objective_value(battery_prob)
    )
end
