# Flask Backend for Crop Gene Information System

## Setup Instructions

1. **Create a virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   ```

2. **Activate the virtual environment:**
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure API Keys:**
   - Replace `"YOUR_GEMINI_API_KEY"` in `app.py` with your actual Gemini API key
   - Update the email in `Entrez.email` with your email address

5. **Run the Flask server:**
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/analyze` - Analyze gene data for crop and trait

## Supported Combinations

Currently supported:
- **Rice** → **Drought resistance**

## Dependencies

- Flask: Web framework
- Flask-CORS: Cross-origin resource sharing
- Requests: HTTP library
- Biopython: Biological computation
- Google Generative AI: AI explanations