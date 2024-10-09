# Imports
using JuMP
using Gurobi
using GLPK
using JSON
using HTTP

# No need to set working directory assuming the script is executed from the project directory

# Activate and instantiate packages
import Pkg
Pkg.activate(".")
Pkg.instantiate()
Pkg.status()

"""
Send JSON file to the server for optimization
"""
function send_json_to_server(json_data::Dict)
    try
        response = HTTP.post("http://localhost:8080/optimize", JSON.json(json_data), 
                            ["Content-Type" => "application/json"])
        return response
    catch e
        println("Error: ", e)
        return nothing
    end
end

# Main function
function main()
    # Example JSON data
    json_data = Dict("limit" => 5)
    
    # Send JSON file to the server
    response = send_json_to_server(json_data)
    
    # Handle response
    if response !== nothing && response.status == 200
        println("Request successful. Response: ", String(response.body))
    else
        println("Error sending request or server response.")
    end
end

# Call the main function
main()
