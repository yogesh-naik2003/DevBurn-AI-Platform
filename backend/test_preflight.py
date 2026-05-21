import urllib.request
import urllib.error

def test_preflight():
    req = urllib.request.Request(
        "http://localhost:5000/api/auth/register",
        headers={
            "Origin": "http://localhost:5174",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
        method="OPTIONS"
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
        try:
            print("Body:", e.read().decode())
        except Exception:
            pass
    except Exception as e:
        print("Failed:", e)

if __name__ == "__main__":
    test_preflight()
