import os
import sys
import json
import time
from dotenv import load_dotenv
from services.keywordsai_wrapper import KeywordsAIWrapper

# Load environment variables
load_dotenv()

def test_keywords_ai():
    """Test if Keywords AI API is working correctly"""
    print("Testing Keywords AI integration...")
    
    # Get API key from environment
    api_key = os.getenv("KEYWORDS_AI_API_KEY")
    print(f"API Key: {api_key[:5]}...{api_key[-5:] if api_key else 'None'}")
    
    if not api_key:
        print("ERROR: Keywords AI API key not found in environment variables")
        return False
    
    # Initialize Keywords AI wrapper
    try:
        keywords_ai = KeywordsAIWrapper(api_key=api_key)
        print("Keywords AI wrapper initialized successfully")
    except Exception as e:
        print(f"ERROR: Failed to initialize Keywords AI wrapper: {str(e)}")
        return False
    
    # Test tracing
    try:
        with keywords_ai.trace("test_trace", {"test_metadata": "value"}):
            print("Inside trace context")
            time.sleep(1)  # Simulate some work
            keywords_ai.log_info("Test info log")
            keywords_ai.log_warning("Test warning log")
        print("Trace completed successfully")
    except Exception as e:
        print(f"ERROR: Failed to create trace: {str(e)}")
        return False
    
    # Test LLM tracking
    try:
        keywords_ai.track_llm_request(
            provider="test_provider",
            model="test_model",
            prompt="This is a test prompt",
            response="This is a test response",
            metadata={"test": "value"}
        )
        print("LLM tracking completed successfully")
    except Exception as e:
        print(f"ERROR: Failed to track LLM request: {str(e)}")
        return False
    
    # Print trace and log data (in a real implementation, this would be sent to Keywords AI)
    print("\nTraces:")
    print(json.dumps(keywords_ai.traces, indent=2))
    
    print("\nLogs:")
    print(json.dumps(keywords_ai.logs, indent=2))
    
    print("\nKeywords AI integration test completed successfully!")
    return True

if __name__ == "__main__":
    success = test_keywords_ai()
    sys.exit(0 if success else 1)
