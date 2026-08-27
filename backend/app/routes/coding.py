from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ai.provider import get_ai_provider
import json

router = APIRouter()

class CodeEvaluationRequest(BaseModel):
    code: str
    language: str

@router.post("/evaluate")
async def evaluate_code(req: CodeEvaluationRequest):
    try:
        provider = get_ai_provider()
        
        prompt = f"""
        You are an expert software engineer. Review the following {req.language} code for an algorithmic challenge.
        Code:
        ```
        {req.code}
        ```
        
        Evaluate the code and return a JSON object (pure JSON, no markdown) with the following structure:
        {{
            "status": "string (e.g. 'Looks Good', 'Needs Optimization', 'Has Bugs')",
            "timeComplexity": "string (e.g. O(N), O(N^2))",
            "spaceComplexity": "string",
            "feedback": "string (2-3 sentences explaining the logic and how to improve)",
            "bugs": ["array of strings (empty if none)"]
        }}
        """
        
        response_text = provider.generate_content(prompt)
        cleaned_text = response_text.replace("```json", "").replace("```", "").strip()
        result = json.loads(cleaned_text)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
