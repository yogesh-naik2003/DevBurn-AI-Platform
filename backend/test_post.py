import urllib.request
import urllib.error
import json

def test_post():
    req = urllib.request.Request(
        "http://localhost:5000/api/auth/login",
        data=json.dumps({"email": "test@example.com", "password": "123"}).encode(),
        headers={
            "Origin": "http://localhost:5174",
            "Content-Type": "application/json"
        },
        method="POST"
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
    test_post()
