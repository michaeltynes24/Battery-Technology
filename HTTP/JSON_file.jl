
import Pkg
pwd()
Pkg.activate(".")
Pkg.instantiate()
Pkg.status()

# Pkg.add("JuMP")
# Pkg.add("Gurobi")

using JSON

# Define a Julia dictionary to represent your data
data = Dict("name" => "John Doe", "age" => 30)

# Convert the dictionary to a JSON string
json_data = JSON.json(data)

# Write the JSON string to a file
open("data.json", "w") do file
    write(file, json_data)
end
