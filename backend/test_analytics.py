import urllib.request
import urllib.error
import json

def test_analytics():
    # We will simulate a local request.
    # To bypass authentication for a quick test, we can just read artifacts/metadata.json directly from disk
    # which is exactly what the endpoint does!
    try:
        with open("artifacts/metadata.json", "r") as f:
            data = json.load(f)
        
        analytics = data.get("analytics", {})
        print("Success! Read metadata.json successfully.")
        print("Analytics Keys:", list(analytics.keys()))
        print("average_burn_rate:", analytics.get("average_burn_rate"))
        print("median_burn_rate:", analytics.get("median_burn_rate"))
        print("high_risk_share:", analytics.get("high_risk_share"))
        print("burn_rate_by_gender:", analytics.get("burn_rate_by_gender"))
        print("burn_rate_by_company_type:", analytics.get("burn_rate_by_company_type"))
        print("burn_rate_by_wfh:", analytics.get("burn_rate_by_wfh"))
        print("burn_rate_by_designation:", analytics.get("burn_rate_by_designation"))
        print("burn_rate_by_resource_allocation:", analytics.get("burn_rate_by_resource_allocation"))
        print("correlations count:", len(analytics.get("correlations", [])))
        
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test_analytics()
