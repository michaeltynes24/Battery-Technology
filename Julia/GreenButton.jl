module GreenButton

import HTTP
import JSON
using .Main  # Access global settings

function fetch_green_button_data()
    url = "https://api.greenbuttondata.org/v1/$(Main.global_settings.provider)/usage"
    headers = ["Content-Type" => "application/json"]
    params = Dict(
        "start" => Main.global_settings.start_date,
        "end" => Main.global_settings.end_date
    )
    response = HTTP.get(url, headers; query=params)
    if response.status == 200
        return JSON.parse(String(response.body))
    else
        error("Failed to fetch Green Button data: ", response.status)
    end
end

end

