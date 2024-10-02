from datetime import time

def calculate_energy_cost(timestamp, kwh):
    peak_start = time(16, 0)
    peak_end = time(21, 0)

    is_peak = peak_start <= timestamp.time() <= peak_end

    if is_peak:
        rate = 0.743  # Peak hour rate
    else:
        rate = 0.374  # Off-peak hour rate

    cost = kwh * rate    # Calculate cost
    return cost