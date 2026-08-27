from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.ai.provider import get_ai_provider
from typing import Optional
import json

router = APIRouter()

@router.post("/analyze")
async def analyze_resume(
    fileUrl: str = Form(...),
    studentProfile: str = Form(...) # JSON string
):
    try:
        provider = get_ai_provider()
        
        # In a real scenario, we would download the file from fileUrl (Firebase Storage)
        # and extract text using PyPDF2 or pdfplumber.
        # For demonstration without pdf dependencies, we will assume the AI provider 
        # can process the resume if given the context, or we just generate a detailed
        # simulated analysis based on the student profile.
        
        prompt = f"""
        Analyze the resume located at {fileUrl} for a student with the following profile:
        {studentProfile}
        
        Return a strict JSON object (no markdown formatting, just pure JSON) with this exact structure:
        {{
            "overallScore": number (0-100),
            "atsCompatibility": number (0-100),
            "skillsScore": number (0-100),
            "experienceScore": number (0-100),
            "missingSkills": [string, string],
            "recommendations": [string, string, string],
            "weakSections": [string, string],
            "strongSections": [string, string]
        }}
        """
        
        response_text = provider.generate_content(prompt)
        
        # Clean up response (sometimes AI wraps in ```json ... ```)
        cleaned_text = response_text.replace("```json", "").replace("```", "").strip()
        
        result = json.loads(cleaned_text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
