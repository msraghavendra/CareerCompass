from pydantic import BaseModel
from typing import List, Optional

class StudentProfile(BaseModel):
    name: str
    email: str
    college: str
    branch: str
    cgpa: float
    graduationYear: int
    arrears: int
    skills: List[str]
    projects: List[str]
    internships: List[str]
    certifications: List[str]
    github: Optional[str] = None
    linkedin: Optional[str] = None
    leetcode: Optional[str] = None
    targetRole: Optional[str] = None
    preferredLocation: Optional[str] = None

class Company(BaseModel):
    name: str
    logo: Optional[str] = None
    description: str
    roles: List[str]
    minimumCGPA: float
    allowedBranches: List[str]
    maximumArrears: int
    requiredSkills: List[str]
    salary: str
    location: str
    applicationDeadline: str
    selectionRounds: List[str]

class Application(BaseModel):
    companyId: str
    studentId: str
    status: str
    notes: Optional[str] = None
    lastUpdated: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    studentId: str
