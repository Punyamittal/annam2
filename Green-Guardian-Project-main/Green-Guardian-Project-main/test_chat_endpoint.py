import requests
import json

def test_chat_endpoint():
    url = "http://localhost:8000/chat"
    
    # Test with a specific query about water issues
    payload = {
        "messages": [
            {"role": "user", "content": "Tell me about water issues and pollution in urban areas"}
        ]
    }
    
    print("Sending request to chat endpoint:")
    print(json.dumps(payload, indent=2))
    
    try:
        response = requests.post(url, json=payload)
        print(f"Status code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("\nResponse:")
            print(data.get("response", "No response"))
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Exception: {str(e)}")

if __name__ == "__main__":
    test_chat_endpoint()
