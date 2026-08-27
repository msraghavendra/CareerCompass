from fastapi import APIRouter, HTTPException
from app.schemas.models import ChatRequest
from app.ai.provider import get_ai_provider

router = APIRouter()

@router.post("/chat")
async def ai_chat(request: ChatRequest):
    try:
        provider = get_ai_provider()
        
        # Build prompt from messages
        prompt = "You are a helpful AI Career Assistant. Answer the student's queries.\n\n"
        for msg in request.messages:
            prompt += f"{msg.role.capitalize()}: {msg.content}\n"
        
        prompt += "Assistant: "
        
        response_text = provider.generate_content(prompt)
        
        return {"reply": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
