import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import ai_chat, resume, mock_interview, skill_gap, coding

app = FastAPI(
    title="Career Compass API",
    description="Backend API for Career Compass - Smart Career & Placement Assistant",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_chat.router, prefix="/api/ai", tags=["AI Chat"])
app.include_router(resume.router, prefix="/api/ai/resume", tags=["Resume AI"])
app.include_router(mock_interview.router, prefix="/api/ai/interview", tags=["Mock Interview"])
app.include_router(skill_gap.router, prefix="/api/ai/skill-gap", tags=["Skill Gap"])
app.include_router(coding.router, prefix="/api/ai/coding", tags=["Coding"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Career Compass API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
