from http.server import BaseHTTPRequestHandler, HTTPServer
import json

class MockServer(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
    def do_OPTIONS(self):
        self._set_headers()
        
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        print(f"Received request to {self.path}:")
        print(json.dumps(data, indent=2))
        
        response = {}
        
        if self.path == '/chat':
            # Get the last user message
            user_messages = [msg for msg in data.get('messages', []) if msg.get('role') == 'user']
            if user_messages:
                last_message = user_messages[-1].get('content', '').lower()
                
                if last_message in ['hi', 'hello', 'hey']:
                    response = {
                        "response": "Hello! I'm your environmental assistant. How can I help you today? You can ask me about air quality, weather conditions, environmental risks, or farming advice."
                    }
                elif 'weather' in last_message:
                    response = {
                        "response": "The weather today is sunny with a high of 75°F (24°C) and a low of 60°F (15°C). There's a 10% chance of precipitation."
                    }
                elif 'pollution' in last_message or 'air quality' in last_message:
                    response = {
                        "response": "The air quality in your area is currently good with an Air Quality Index (AQI) of 42, which is considered satisfactory. The main pollutant is PM2.5 at 10.5 µg/m³."
                    }
                else:
                    response = {
                        "response": "I'm here to help with environmental information. You can ask me about air quality, weather conditions, pollution levels, environmental risks, or get advice specific to your location."
                    }
            else:
                response = {
                    "response": "Hello! How can I help you with environmental information today?"
                }
        elif self.path == '/api/copilot':
            # Get the last user message
            user_messages = [msg for msg in data.get('messages', []) if msg.get('role') == 'user']
            if user_messages:
                last_message = user_messages[-1].get('content', '').lower()
                
                if last_message in ['hi', 'hello', 'hey']:
                    response = {
                        "content": "Hello! I'm your environmental assistant. How can I help you today? You can ask me about air quality, weather conditions, environmental risks, or farming advice."
                    }
                elif 'weather' in last_message:
                    response = {
                        "content": "The weather today is sunny with a high of 75°F (24°C) and a low of 60°F (15°C). There's a 10% chance of precipitation."
                    }
                elif 'pollution' in last_message or 'air quality' in last_message:
                    response = {
                        "content": "The air quality in your area is currently good with an Air Quality Index (AQI) of 42, which is considered satisfactory. The main pollutant is PM2.5 at 10.5 µg/m³."
                    }
                else:
                    response = {
                        "content": "I'm here to help with environmental information. You can ask me about air quality, weather conditions, pollution levels, environmental risks, or get advice specific to your location."
                    }
            else:
                response = {
                    "content": "Hello! How can I help you with environmental information today?"
                }
        
        self._set_headers()
        self.wfile.write(json.dumps(response).encode())

def run(server_class=HTTPServer, handler_class=MockServer, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting mock server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()
