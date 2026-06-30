import smtplib

from email.message import EmailMessage

import os

from dotenv import load_dotenv

load_dotenv("app/.env")

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

def send_email(
        to_email: str,
        subject: str,
        body: str,
        html_body: str = None
):
    
    msg = EmailMessage()

    msg["Subject"] = subject
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email

    msg.set_content(body)

    if html_body:
        msg.add_alternative(
            html_body,
            subtype="html"
        )

    with smtplib.SMTP("smtp.gmail.com", 587) as smtp:

        smtp.starttls()

        smtp.login(
            EMAIL_ADDRESS,
            EMAIL_PASSWORD
        )

        smtp.send_message(msg)