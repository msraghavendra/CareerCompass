from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ai.provider import get_ai_provider
import json

router = APIRouter()

class SkillGapRequest(BaseModel):
    profile: dict
    targetRole: str

@router.post("/analyze")
async def analyze_skill_gap(req: SkillGapRequest):
    try:
        provider = get_ai_provider()
        
        prompt = f"""
        Analyze the skill gap for a student targeting the role of '{req.targetRole}'.
        Student Profile: {json.dumps(req.profile)}
        
        Return a pure JSON object (no markdown, just JSON) with this structure:
        {{
            "matchPercentage": number (0-100),
            "missingSkills": [
                {{"skill": "Skill Name", "importance": "High/Medium/Low", "description": "Why it's needed"}}
            ],
            "courseRecommendations": [
                {{"title": "Course Name", "platform": "Coursera/Udemy/etc", "url": "https://..."}}
            ],
            "projectIdeas": [
                {{"title": "Project Name", "description": "Brief description"}}
            ]
        }}
        """
        
        response_text = provider.generate_content(prompt)
        cleaned_text = response_text.replace("```json", "").replace("```", "").strip()
        result = json.loads(cleaned_text)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
