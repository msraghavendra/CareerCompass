import os
from abc import ABC, abstractmethod
import google.generativeai as genai
from openai import OpenAI
from app.config import settings

class AIProvider(ABC):
    @abstractmethod
    def generate_content(self, prompt: str) -> str:
        pass

class GeminiProvider(AIProvider):
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def generate_content(self, prompt: str) -> str:
        response = self.model.generate_content(prompt)
        return response.text

class OpenAIProvider(AIProvider):
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = "gpt-4o-mini"

    def generate_content(self, prompt: str) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content

def get_ai_provider() -> AIProvider:
    if settings.AI_PROVIDER.lower() == "openai":
        return OpenAIProvider()
    return GeminiProvider()
