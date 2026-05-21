import urllib.request
import urllib.error

def test_health():
    req = urllib.request.Request(
        "http://localhost:5000/api/health",
        headers={
            "Origin": "http://localhost:5174"
        },
        method="GET"
    )

    try:
        with urllib.request.urlopen(req) as response:
            print("Status:", response.status)
            print("Headers:")
            for k, v in response.headers.items():
                print(f"  {k}: {v}")
    except urllib.error.HTTPError as e:
        print("HTTP Error:", e.code)
        print("Headers:")
        for k, v in e.headers.items():
            print(f"  {k}: {v}")

if __name__ == "__main__":
    test_health()
