import smtplib

server = smtplib.SMTP(
    "smtp.gmail.com",
    587
)

server.starttls()

server.login(
    "tester2006vi@gmail.com",
    "dmlvwdjxdgsrlfwa"
)

print("SMTP Working")