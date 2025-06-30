# Crop Gene Information System

A full-stack application for analyzing crop genes and designing CRISPR gRNAs.

## Project Structure

```
crop-gene-info-app/
├── backend/                 # Flask API server
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   └── README.md          # Backend setup instructions
├── src/                    # React frontend
│   ├── components/        # React components
│   ├── services/         # API service layer
│   ├── types/           # TypeScript types
│   └── utils/          # Utility functions
└── package.json        # Node.js dependencies
```

## Quick Start

### 1. Start the Backend (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 2. Start the Frontend (React)

```bash
npm run dev
```

### 3. Configure API Keys

- Add your Gemini API key to `backend/app.py`
- Update the email address in the Entrez configuration

## Features

- **Real-time API Integration**: React frontend communicates with Flask backend
- **Gene Sequence Retrieval**: Fetches data from Ensembl and NCBI databases
- **CRISPR gRNA Design**: Generates optimized guide RNAs
- **AI-Powered Explanations**: Uses Gemini AI for gene function explanations
- **PDF Export**: Download comprehensive gene analysis reports
- **Responsive Design**: Works on desktop and mobile devices

## Currently Supported

- **Crop**: Rice
- **Trait**: Drought resistance

Currently, the system supports the following combination:
*   **Rice** for **Drought resistance**

We are continuously working to expand the list of supported crops and traits.

## Technology Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- jsPDF for report generation

**Backend:**
- Flask with Python
- Biopython for sequence analysis
- Google Generative AI for explanations
- CORS enabled for cross-origin requests

---

## CRISPR Assistant: Boosting Rice Harvest with DREB1A Gene Editing

Namaste! 🌾 I'm your CRISPR assistant, here to help boost your rice harvest! We're focusing on making your rice more drought-resistant using a powerful gene editing tool called CRISPR.

### 1. Why DREB1A (LOC_Os06g03670) Matters 🤔

This gene, DREB1A, is like a superhero for rice plants during dry spells 🦸‍♂️. It acts as a master switch, turning on other genes that help the rice plant cope with drought. These genes help the plant:

*   **Save water:** Think of it like closing tiny pores on leaves to prevent water loss 💧.
*   **Stress tolerance:** The plant becomes more resilient to lack of water 💪.
*   **Improved yield:** Even with less water, the plant can still produce a decent harvest 🍚.

### 2. How Editing DREB1A Helps ✂️🧬🚀

CRISPR is like a super-precise pair of scissors ✂️. We can use it to:

*   **Boost DREB1A activity:** Make the superhero even stronger! This means more efficient water use and better drought tolerance.
*   **Fine-tune expression:** We can precisely control *when* and *how much* DREB1A is active, optimizing it for different drought conditions.

This leads to:

*   **Higher yields in dry seasons:** More rice for your family and community! 🎉
*   **Reduced water usage:** Conserving precious water resources 💧.
*   **Increased farm profitability:** Better yields mean more income! 💰

### 3. Field Examples (Still Emerging!) 🌱🧪

While large-scale field trials are still underway, lab and early field tests show promising results! Scientists are seeing:

*   **Increased survival rates** in drought conditions compared to unmodified rice.
*   **Higher grain yields** even with limited irrigation.
*   **Improved root systems**, allowing better water absorption.

More data is coming soon, and we're excited about the future!

### 4. What's Next? ➡️

*   **More rigorous field trials:** Testing different rice varieties and drought conditions across India.
*   **Regulatory approval:** Ensuring the safety and acceptance of CRISPR-edited rice.
*   **Farmer training and support:** Equipping farmers with the knowledge and resources to use this technology effectively.
*   **Developing drought-resistant varieties for different regions:** Tailoring solutions to specific needs across India's diverse climate.

We're working hard to make this technology accessible and beneficial for all Indian farmers! Together, we can build a more resilient and food-secure future. Jai Kisan! 🇮🇳🌾