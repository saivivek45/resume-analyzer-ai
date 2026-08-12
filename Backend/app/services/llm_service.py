import json
import google.generativeai as genai
from pydantic import BaseModel
from fastapi import HTTPException
from app.config import settings

def _get_model():
    if not settings.gemini_api_key:
        raise HTTPException(status_code=503, detail="AI engine not configured.")
    genai.configure(api_key=settings.gemini_api_key)
    return genai.GenerativeModel("gemini-3.6-flash")

class ResumeAnalysisSchema(BaseModel):
    overall_score: int
    ats_score: int
    content_score: int
    detected_skills: list[str]
    missing_skills: list[str]
    strengths: list[str]
    weaknesses: list[str]
    recommendations: list[str]

class ATSMatchSchema(BaseModel):
    match_score: int
    missing_keywords: list[str]
    suggestions: list[str]

class InterviewQuestionsSchema(BaseModel):
    questions: list[str]

def analyze_resume_with_llm(resume_text: str) -> dict:
    model = _get_model()
    prompt = f"""
    You are an expert technical recruiter and ATS system. Analyze the following resume text.
    Extract the candidate's skills, determine what critical skills might be missing (make reasonable assumptions based on their likely field),
    and provide actionable strengths, weaknesses, and recommendations.
    Score them from 0-100 on overall quality, ATS parsability (is it structured well?), and content quality (metrics, action verbs).
    
    Resume Text:
    {resume_text}
    """
    
    response = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema=ResumeAnalysisSchema
        )
    )
    return json.loads(response.text)

def match_ats_with_llm(resume_text: str, job_description: str) -> dict:
    model = _get_model()
    prompt = f"""
    You are an ATS system evaluating a candidate against a job description.
    Compare the resume to the job description and output a match score (0-100),
    a list of missing keywords/skills that are in the JD but not the resume,
    and a few actionable suggestions on how to improve the match.
    
    Job Description:
    {job_description}
    
    Resume Text:
    {resume_text}
    """
    
    response = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema=ATSMatchSchema
        )
    )
    return json.loads(response.text)

def generate_interview_questions(role: str, level: str, difficulty: str, resume_context: str) -> list[str]:
    model = _get_model()
    prompt = f"""
    You are an expert interviewer. Generate exactly 5 interview questions for a {level} {role} candidate.
    The difficulty should be: {difficulty}.
    Use the following resume context (if provided) to personalize some of the questions, otherwise make them standard but challenging role-specific questions.
    
    Resume Context:
    {resume_context}
    """
    
    response = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema=InterviewQuestionsSchema
        )
    )
    return json.loads(response.text)["questions"]

def evaluate_interview_answer(question: str, answer: str) -> str:
    model = _get_model()
    prompt = f"""
    You are an expert interviewer evaluating a candidate's answer.
    Question: {question}
    Candidate Answer: {answer}
    
    Provide a brief, constructive evaluation (1-2 paragraphs) of the answer. What did they do well? What could be improved? 
    Do not use JSON, just write plain text feedback.
    """
    response = model.generate_content(prompt)
    return response.text
