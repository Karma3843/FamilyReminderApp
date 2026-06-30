from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from app.db.database import SessionLocal
from app.db.models import Reminder, ReminderTag, User
from app.mail import send_email
from dateutil.relativedelta import relativedelta


scheduler = BackgroundScheduler()


def check_due_reminder():

    db = SessionLocal()

    try:
        current_date = datetime.now().date()
        current_time = datetime.now().time()

        due_reminders = db.query(Reminder).filter(
            Reminder.is_sent == False,
            Reminder.reminder_date <= current_date,
            Reminder.reminder_time <= current_time
        ).all()

        print(
            f"Found {len(due_reminders)} due reminders"
        )

        for reminder in due_reminders:
            print(
                f"Reminder #{reminder.id} is due: {reminder.title}"
            )

            tags = db.query(ReminderTag).filter(
                ReminderTag.reminder_id == reminder.id
            ).all()

            for tag in tags:
                user = db.query(User).filter(
                    User.id == tag.user_id
                ).first()

                if user:

                    if reminder.priority == "high":
                        priority_color= "#dc3545"
                        priority_text= "🔴 HIGH PRIORITY"

                    elif reminder.priority == "medium":
                        priority_color= "#ffc107"
                        priority_text= "🟡 MEDIUM PRIORITY"

                    else :
                        priority_color= "#28a745"
                        priority_text= "🟢 LOW PRIORITY"

                    html_body = f"""
                        <html>
                        <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">

                        <div style="
                            max-width:600px;
                            margin:auto;
                            background:white;
                            border-radius:12px;
                            padding:25px;
                            box-shadow:0 2px 10px rgba(0,0,0,0.1);
                        ">

                            <h2 style="color:{priority_color};">
                                {priority_text}
                            </h2>

                            <p>Hello <strong>{user.name}</strong>,</p>

                            <p>You have a reminder.</p>

                            <hr>

                            <h3>{reminder.title}</h3>

                            <p>
                                <strong>Description:</strong><br>
                                {reminder.description}
                            </p>

                            <p>
                                <strong>Date:</strong> {reminder.reminder_date}
                            </p>

                            <p>
                                <strong>Time:</strong> {reminder.reminder_time}
                            </p>

                            <hr>

                            <p style="color:gray;font-size:14px;">
                                Family Reminder App
                            </p>

                        </div>

                        </body>
                        </html>
                        """

                    send_email(
                        to_email=user.email,
                        subject=f"{priority_text} - {reminder.title}",
                        body=f"""
                    Hello {user.name},

                    You have a reminder.

                    Priority: {reminder.priority.upper()}
                    
                    Title: {reminder.title}
                    
                    Description: {reminder.description}
                    
                    Date: {reminder.reminder_date}
                    Time: {reminder.reminder_time}
                    
                    Family Reminder App 
                    """,
                        html_body= html_body 
                    )

                    print(
                        f"Email sent to {user.email}"
                    )

            if reminder.repeat == "daily":

                reminder.reminder_date += timedelta(days=1)
                        
            elif reminder.repeat == "weekly":

                reminder.reminder_date += timedelta(days=7)

            elif reminder.repeat == "monthly":

                reminder.reminder_date += relativedelta(months=1)
                        
            else:

                reminder.is_sent = True
                            
            db.commit()
    finally:

        db.close()

def cleanup_old_reminders():

    db = SessionLocal()

    try:
        cutoff = datetime.utcnow() - timedelta(days=30)

        old_reminders = db.query(Reminder).filter(
            Reminder.is_sent == True,
            Reminder.created_at != None,
            Reminder.created_at < cutoff
        ).all()

        for reminder in old_reminders:

            db.query(ReminderTag).filter(
                ReminderTag.reminder_id == reminder.id
            ).delete()

            db.delete(reminder)

        if old_reminders:
            db.commit()
            print(f"Cleaned up {len(old_reminders)} old reminder(s)")
    finally:
        db.close()

def start_scheduler():
    scheduler.add_job(
        check_due_reminder,
        trigger="interval",
        seconds=20
    )
    scheduler.add_job(
        cleanup_old_reminders,
        trigger="interval",
        hours=6
    )
    scheduler.start()

    print("Scheduler started")

