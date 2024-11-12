# green_button/providers.py

PROVIDERS = {
    'SDGE': {
        'auth_url': 'https://sdge.greenbutton.auth/authorize',
        'token_url': 'https://sdge.greenbutton.auth/token',
        'data_url': 'https://sdge.greenbutton.data/energy_usage',
    },
    'PGE': {
        'auth_url': 'https://pge.greenbutton.auth/authorize',
        'token_url': 'https://pge.greenbutton.auth/token',
        'data_url': 'https://pge.greenbutton.data/energy_usage',
    },
    # Add other providers here
}
