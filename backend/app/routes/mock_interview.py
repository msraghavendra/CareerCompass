from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ai.provider import get_ai_provider
import json

router = APIRouter()

class EvaluationRequest(BaseModel):
    question: str
    answer: str
    keyConcepts: list[str]
    subject: str

@router.post("/evaluate")
async def evaluate_answer(req: EvaluationRequest):
    try:
        provider = get_ai_provider()
        
        prompt = f"""
        You are an expert technical interviewer evaluating a student's answer for the subject {req.subject}.
        
        Question: {req.question}
        Expected Concepts: {', '.join(req.keyConcepts)}
        Student Answer: {req.answer}
        
        Evaluate the answer strictly and return a JSON object with this exact structure (no markdown formatting, just pure JSON):
        {{
            "accuracyScore": number (0-100),
            "confidenceRating": string (e.g. "High Confidence", "Needs Structure"),
            "feedback": string (2-3 sentences of constructive feedback),
            "matchedConcepts": [string],
            "missingConcepts": [string]
        }}
        """
        
        response_text = provider.generate_content(prompt)
        cleaned_text = response_text.replace("```json", "").replace("```", "").strip()
        result = json.loads(cleaned_text)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
