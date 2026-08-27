# 🧭 Career Compass

An AI-powered career and placement assistant built to help students optimize their resumes, prepare for interviews, track job applications, and identify skill gaps—all driven by real-time generative AI.

## ✨ Features

- **AI Resume Analyzer**: Upload a PDF resume and get an ATS score, formatting suggestions, and missing skills based on your profile.
- **Mock Interview Prep**: Practice technical and HR questions with an AI interviewer that evaluates your answers and provides actionable feedback.
- **Coding & Aptitude Prep**: Run Python code in a web IDE and get AI feedback on time/space complexity and potential bugs.
- **Skill Gap Analysis**: Compare your current skills against industry benchmarks for various roles (e.g., SDE, Data Scientist, Cloud Engineer) to receive curated course and project recommendations.
- **AI Career Assistant Chat**: A 24/7 conversational AI trained to provide placement advice and tech roadmap guidance.
- **Application Tracker**: A Kanban-style board to track applied, online assessment, interview, and selected statuses.
- **Company Eligibility Checker**: Automatically calculate your eligibility for upcoming placement drives based on CGPA, arrears, and required skills.

## 🛠️ Tech Stack

### Frontend
- **React.js** (via Vite)
- **Vanilla CSS** (Glassmorphism & modern UI)
- **Lucide React** (Icons)
- **Firebase** (Auth, Firestore DB, Storage)

### Backend
- **FastAPI** (Python web framework)
- **Uvicorn** (ASGI server)
- **Google Generative AI** (Gemini for LLM intelligence)
- **Pydantic** (Data validation)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- A Firebase Project (with Auth, Firestore, and Storage enabled)
- A Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/msraghavendra/CareerCompass.git
cd CareerCompass
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Environment Variables
# Create a .env file in the backend directory:
# GEMINI_API_KEY=your_gemini_api_key_here

# Run the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
```bash
# Return to the root directory
cd ..

# Install dependencies
npm install

# Environment Variables
# Create a .env file in the root directory:
# VITE_FIREBASE_API_KEY=your_key
# VITE_FIREBASE_AUTH_DOMAIN=your_domain
# VITE_FIREBASE_PROJECT_ID=your_id
# VITE_FIREBASE_STORAGE_BUCKET=your_bucket
# VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
# VITE_FIREBASE_APP_ID=your_app_id

# Run the development server
npm run dev
```

## 📄 License
This project is licensed under the MIT License.
