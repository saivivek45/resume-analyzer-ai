import os
from functools import lru_cache

from dotenv import load_dotenv
print("CWD =", os.getcwd())

load_dotenv()


def _as_bool(value: str) -> bool:
    return value.strip().lower() in {"1", "true", "yes", "on"}


class Settings:
    database_url: str
    secret_key: str
    jwt_expire_days: int
    google_client_id: str
    smtp_username: str
    smtp_password: str
    smtp_host: str
    smtp_port: int
    smtp_from_email: str
    smtp_use_tls: bool
    cookie_secure: bool
    frontend_url: str

    def __init__(self) -> None:
        self.database_url = os.getenv(
            "DATABASE_URL",
            "postgresql://postgres:postgres@localhost:5432/careerpilot",
        )
        self.secret_key = os.getenv("SECRET_KEY", "development-only-change-me")
        self.jwt_expire_days = int(os.getenv("JWT_EXPIRE_DAYS", "7"))
        self.google_client_id = os.getenv("GOOGLE_CLIENT_ID", "")
        self.smtp_username = os.getenv("SMTP_USERNAME", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.smtp_host = os.getenv("SMTP_HOST", "")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_from_email = os.getenv("SMTP_FROM_EMAIL", self.smtp_username)
        self.smtp_use_tls = _as_bool(os.getenv("SMTP_USE_TLS", "true"))
        self.cookie_secure = _as_bool(os.getenv("COOKIE_SECURE", "false"))
        self.frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
