from django.shortcuts import redirect, render, HttpResponse
from django.conf import settings
from .providers import PROVIDERS
import requests
from urllib.parse import urlencode
import json

def green_button_authorize(request, provider_name="SDGE"):
    # Fetch provider-specific URLs
    provider = PROVIDERS.get(provider_name.upper())
    if not provider:
        return HttpResponse("Invalid provider", status=400)

    client_id = settings.GREEN_BUTTON_CLIENT_ID
    redirect_uri = settings.GREEN_BUTTON_REDIRECT_URI
    auth_url = provider["auth_url"]

    # Generate the authorization URL with required parameters
    params = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "energy_read",
    }
    return redirect(f"{auth_url}?{urlencode(params)}")


def green_button_callback(request, provider_name="SDGE"):
    # Fetch provider-specific URLs
    provider = PROVIDERS.get(provider_name.upper())
    if not provider:
        return HttpResponse("Invalid provider", status=400)

    code = request.GET.get("code")
    token_url = provider["token_url"]

    # Exchange authorization code for an access token
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": settings.GREEN_BUTTON_REDIRECT_URI,
        "client_id": settings.GREEN_BUTTON_CLIENT_ID,
        "client_secret": settings.GREEN_BUTTON_CLIENT_SECRET,
    }
    response = requests.post(token_url, data=data)
    access_token = response.json().get("access_token")

    # Store the access token securely, here in the session
    request.session["access_token"] = access_token
    request.session["provider_name"] = provider_name
    return redirect("green_button:dashboard")


def fetch_energy_data(request):
    provider_name = request.session.get("provider_name", "SDGE")
    provider = PROVIDERS.get(provider_name.upper())
    if not provider:
        return HttpResponse("Invalid provider", status=400)

    access_token = request.session.get("access_token")
    headers = {"Authorization": f"Bearer {access_token}"}
    data_url = provider["data_url"]

    response = requests.get(data_url, headers=headers)
    if response.status_code == 200:
        energy_data = response.json()  # Example structure: [{timestamp: "...", usage: ...}]
        
        structured_data = {
            "timestamps": [entry["timestamp"] for entry in energy_data],
            "usage": [entry["usage"] for entry in energy_data]
        }
        
        # Send data to Julia
        result = send_to_julia(structured_data)
        
        return render(request, "green_button/dashboard.html", {"result": result})
    
    return HttpResponse("Failed to retrieve data")

def send_to_julia(data):
    url = "http://127.0.0.1:8080/optimize"
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, headers=headers, data=json.dumps(data))
    if response.status_code == 200:
        return response.json()  # Expected result from Julia
    return {"error": "Failed to process data in Julia"}
