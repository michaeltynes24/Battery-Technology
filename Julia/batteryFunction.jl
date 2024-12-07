import Pkg

Pkg.activate(".")
Pkg.instantiate()

using JuMP, GLPK, CSV, DataFrames

function battery_function_module(file_path::String)
    # Load CSV data
    df = DataFrame(CSV.File(file_path))

    # Parameters
    S_base = 1e3
    γ_b = 0.06
    D = 1:365
    T = 1:24

    α = zeros(length(T))
    for t in T
        if (t >= 1 && t <= 5) || (t >= 10 && t <= 13)
            α[t] = 0.31
        elseif (t >= 6 && t <= 9) || (t >= 14 && t <= 15) || (t >= 21)
            α[t] = 0.36
        elseif t >= 16 && t <= 20
            α[t] = 0.50
        end
    end

    ps_max = zeros(length(T), length(D))
    pd = zeros(length(T), length(D))

    Bat_model = Model(GLPK.Optimizer)

    @variable(Bat_model, pb_ch[t in T, d in D] >= 0)
    @variable(Bat_model, pb_dis[t in T, d in D] >= 0)
    @variable(Bat_model, Eb[t in T, d in D])

    @objective(Bat_model, Min, sum((pb_ch[t, d] + pb_dis[t, d]) * γ_b + α[t] for t in T, d in D))

    JuMP.optimize!(Bat_model)

    return Dict(
        "objective_value" => JuMP.objective_value(Bat_model)
    )
end

