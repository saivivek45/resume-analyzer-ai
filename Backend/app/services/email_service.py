import smtplib
from email.message import EmailMessage

from app.config import settings


def send_email(to_email: str, subject: str, html_content: str) -> None:
    if not settings.smtp_host or not settings.smtp_from_email:
        raise RuntimeError("SMTP is not configured")

    message = EmailMessage()
    message["From"] = settings.smtp_from_email
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content("This email requires an HTML-capable email client.")
    message.add_alternative(html_content, subtype="html")

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as server:
        if settings.smtp_use_tls:
            server.starttls()
        if settings.smtp_username:
            server.login(settings.smtp_username, settings.smtp_password)
        server.send_message(message)


def send_otp_email(to_email: str, otp: str) -> None:
    html = f"""
    <!doctype html>
    <html>
      <body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#0f172a">
        <div style="max-width:560px;margin:32px auto;padding:0 16px">
          <div style="background:#ffffff;border-radius:18px;padding:32px;box-shadow:0 12px 32px rgba(15,23,42,.08)">
            <p style="margin:0 0 20px;color:#0891b2;font-size:14px;font-weight:700">CareerPilot AI</p>
            <h1 style="margin:0 0 12px;font-size:24px">Verify your email address</h1>
            <p style="margin:0 0 24px;color:#475569;line-height:1.6">
              Use the verification code below to finish creating your account.
              It expires in 10 minutes.
            </p>
            <div style="border-radius:14px;background:#ecfeff;padding:20px;text-align:center;font-size:32px;font-weight:700;letter-spacing:8px;color:#0e7490">
              {otp}
            </div>
            <p style="margin:24px 0 0;color:#64748b;font-size:13px;line-height:1.5">
              If you did not request this code, you can safely ignore this email.
            </p>
          </div>
        </div>
      </body>
    </html>
    """
    send_email(to_email, "Your CareerPilot AI verification code", html)
