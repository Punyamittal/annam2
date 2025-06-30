import requests
import json

def test_chat_api():
    url = "http://localhost:8000/chat"
    
    # Test with a simple greeting
    payload = {
        "messages": [
            {"role": "user", "content": "Hi"}
        ]
    }
    
    print("Sending request:", json.dumps(payload, indent=2))
    
    try:
        response = requests.post(url, json=payload)
        print("Status code:", response.status_code)
        print("Response:", response.text)
        
        if response.status_code == 200:
            data = response.json()
            print("\nParsed response:", json.dumps(data, indent=2))
    except Exception as e:
        print("Error:", str(e))

if __name__ == "__main__":
    test_chat_api()
