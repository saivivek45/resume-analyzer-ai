from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, UploadFile, File

from app.models.resume import ResumeTextPayload

from app.services.pdf_service import (
    extract_text_from_pdf
)

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)
SKILL_KEYWORDS = [
    "python",
    "javascript",
    "typescript",
    "react",
    "next.js",
    "node",
    "fastapi",
    "django",
    "sql",
    "postgresql",
    "mongodb",
    "aws",
    "docker",
    "kubernetes",
    "git",
    "machine learning",
    "data analysis",
    "excel",
]

ACTION_VERBS = [
    "built",
    "created",
    "designed",
    "developed",
    "improved",
    "increased",
    "launched",
    "led",
    "managed",
    "optimized",
    "reduced",
]

EXPECTED_SECTIONS = [
    "experience",
    "education",
    "skills",
    "projects",
]


def _contains_any(text: str, values: list[str]) -> bool:
    return any(value in text for value in values)


def _score_resume(text: str) -> dict:
    normalized_text = text.lower()
    words = normalized_text.split()
    word_count = len(words)

    detected_skills = [
        skill for skill in SKILL_KEYWORDS if skill in normalized_text
    ]
    missing_skills = [
        skill for skill in SKILL_KEYWORDS[:10] if skill not in detected_skills
    ][:5]
    found_sections = [
        section for section in EXPECTED_SECTIONS if section in normalized_text
    ]

    has_email = "@" in normalized_text
    has_phone_hint = any(char.isdigit() for char in normalized_text)
    has_metrics = any(char.isdigit() for char in normalized_text) and _contains_any(
        normalized_text,
        ["%", "percent", "revenue", "users", "customers", "hours", "cost"],
    )
    has_action_verbs = _contains_any(normalized_text, ACTION_VERBS)

    overall_score = min(
        100,
        25
        + min(25, word_count // 20)
        + min(20, len(detected_skills) * 3)
        + len(found_sections) * 6
        + (8 if has_email else 0)
        + (7 if has_phone_hint else 0)
        + (8 if has_metrics else 0)
        + (7 if has_action_verbs else 0),
    )
    ats_score = min(
        100,
        35
        + len(found_sections) * 12
        + min(20, len(detected_skills) * 2)
        + (8 if has_email else 0)
        + (7 if has_phone_hint else 0),
    )
    content_score = min(
        100,
        30
        + min(25, word_count // 18)
        + (20 if has_metrics else 0)
        + (15 if has_action_verbs else 0)
        + min(10, len(detected_skills)),
    )

    strengths = []
    if detected_skills:
        strengths.append("Includes relevant skills and tools.")
    if len(found_sections) >= 3:
        strengths.append("Covers the core resume sections expected by ATS systems.")
    if has_metrics:
        strengths.append("Uses measurable impact in the resume content.")
    if has_action_verbs:
        strengths.append("Uses action-oriented language.")

    weaknesses = []
    if word_count < 250:
        weaknesses.append("Resume content looks short; add more detail to roles and projects.")
    if len(found_sections) < 3:
        weaknesses.append("Some standard sections may be missing.")
    if not has_metrics:
        weaknesses.append("Impact metrics are limited or missing.")
    if not detected_skills:
        weaknesses.append("Few searchable technical or role-specific skills were detected.")

    recommendations = []
    if missing_skills:
        recommendations.append(
            "Add relevant keywords where truthful: " + ", ".join(missing_skills) + "."
        )
    if not has_metrics:
        recommendations.append("Add numbers to show outcomes, scale, speed, or business impact.")
    if len(found_sections) < len(EXPECTED_SECTIONS):
        missing_sections = [
            section.title()
            for section in EXPECTED_SECTIONS
            if section not in found_sections
        ]
        recommendations.append("Consider adding sections for " + ", ".join(missing_sections) + ".")
    if not has_action_verbs:
        recommendations.append("Start bullet points with strong action verbs.")

    return {
        "overall_score": overall_score,
        "ats_score": ats_score,
        "content_score": content_score,
        "detected_skills": detected_skills,
        "missing_skills": missing_skills,
        "strengths": strengths or ["Resume text was extracted and is ready for review."],
        "weaknesses": weaknesses or ["No major issues found by the basic analyzer."],
        "recommendations": recommendations or ["Keep tailoring this resume to each job description."],
    }

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...)
):
    pdf_bytes = await file.read()

    text = extract_text_from_pdf(
        pdf_bytes
    )

    return {
        "text": text
    }


@router.post("/store")
async def store_resume_text(payload: ResumeTextPayload):
    STORAGE_DIR.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    file_path = STORAGE_DIR / f"resume_{timestamp}_{uuid4().hex}.txt"

    content = [
        f"Original file: {payload.file_name or 'unknown'}",
        f"User email: {payload.user_email or 'unknown'}",
        f"Stored at UTC: {datetime.now(timezone.utc).isoformat()}",
        "",
        payload.text,
    ]

    file_path.write_text("\n".join(content), encoding="utf-8")

    return {
        "message": "Resume text stored",
        "file_path": str(file_path),
    }


@router.post("/analyze")
async def analyze_resume(
    payload: ResumeTextPayload
):
    return {
        **_score_resume(payload.text),
        "file_name": payload.file_name,
        "user_email": payload.user_email
    }
