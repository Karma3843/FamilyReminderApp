from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import Reminder, ReminderTag, FamilyMember, User, Family
from pydantic import BaseModel
from datetime import date, time
from app.security import get_current_user

router=APIRouter()

def get_db():
    db=SessionLocal()

    try:
        yield db
    finally:
        db.close()

class ReminderCreate(BaseModel):
    title: str
    description: str

    reminder_date: date
    reminder_time: time

    repeat: str
    priority: str
    family_id: int

    tagged_users: list[int]

class ReminderUpdate(BaseModel):

     title: str
     description: str

     reminder_date: date
     reminder_time: time

     repeat: str
     priority: str
     family_id: int

     tagged_users: list[int]

@router.post("/reminders")
def create_reminder(
    reminder_data: ReminderCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    membership = db.query(FamilyMember).filter(
        FamilyMember.family_id == reminder_data.family_id,
        FamilyMember.user_id == current_user.id
    ).first()

    if membership is None:
        raise HTTPException(
            status_code=403,
            detail="You are not a member of this family"
        )

    unique_users = set(reminder_data.tagged_users)

    for user_id in unique_users:

        member = db.query(FamilyMember).filter(
            FamilyMember.family_id == reminder_data.family_id,
            FamilyMember.user_id == user_id
        ).first()

        if not member:
            raise HTTPException(
                status_code=400,
                detail=f"User {user_id} does not belong to this family"
            )

    
    reminder = Reminder(
        title=reminder_data.title,
        description=reminder_data.description,
        reminder_date=reminder_data.reminder_date,
        reminder_time=reminder_data.reminder_time,
        repeat=reminder_data.repeat.lower(),
        priority=reminder_data.priority.lower(),
        family_id=reminder_data.family_id,
        created_by=current_user.id
    )

    db.add(reminder)

    
    db.flush()

  
    for user_id in unique_users:

        tag = ReminderTag(
            reminder_id=reminder.id,
            user_id=user_id
        )

        db.add(tag)

   
    db.commit()

    db.refresh(reminder)

    return {
        "message": "Reminder created",
        "reminder_id": reminder.id
    }

@router.get("/users/{user_id}/tagged-reminders")
def get_tagged_reminders(
    user_id: int,
    db: Session = Depends(get_db) 
):
     tagged_entries = db.query(ReminderTag).filter(
          ReminderTag.user_id == user_id
     ).all()

     reminders = []

     for entry in tagged_entries:
          
          reminder = db.query(Reminder).filter(
               Reminder.id == entry.reminder_id
          ).first()

          if reminder:
               reminders.append({
                    "id": reminder.id,
                    "title": reminder.title,
                    "description": reminder.description,

                    "date": reminder.reminder_date,
                    "time": reminder.reminder_time,

                    "repeat": reminder.repeat,
                    "priority": reminder.priority,

                    "family_id": reminder.family_id,
                    "created_by": reminder.created_by
               })

    
     return reminders

@router.delete("/reminders/{reminder_id}")
def delete_reminder(
     reminder_id: int,

     db: Session = Depends(get_db),
     current_user = Depends(get_current_user)
):
     reminder = db.query(Reminder).filter(
          Reminder.id == reminder_id
     ).first()

     if reminder is None:

          raise HTTPException(
               status_code = 404,
               detail="Reminder not found"
          )

     family = db.query(Family).filter(
          Family.id == reminder.family_id
     ).first()

     is_admin = family and family.created_by == current_user.id

     if not is_admin and reminder.created_by != current_user.id:

          raise HTTPException(
               status_code = 403,
               detail="You can only delete your own created reminders"
          )
     
     tags = db.query(ReminderTag).filter(
          ReminderTag.reminder_id == reminder_id
     ).all()

     for tag in tags:
          db.delete(tag)
     db.commit()

     db.delete(reminder)
     db.commit()

     return {
          "message" : "Reminder deleted successfully"
     }

@router.get("/reminders/{reminder_id}")
def get_single_reminder(

     reminder_id: int,

     db: Session = Depends(get_db),
     current_user = Depends(get_current_user)
):
     reminder = db.query(Reminder).filter(
          Reminder.id == reminder_id
     ).first()

     if reminder is None:
          
          raise HTTPException(
               status_code=404,
               detail="Reminder not found"
          )
     
     family_member = db.query(FamilyMember).filter(
          FamilyMember.family_id == reminder.family_id,
          FamilyMember.user_id == current_user.id
     ).first()

     if family_member is None:

          raise HTTPException(
               status_code=403,
               detail="You are not part of this family"
          )
     
     tags = db.query(ReminderTag).filter(
          ReminderTag.reminder_id == reminder_id
     ).all()

     tagged_users = []

     for tag in tags:
          user = db.query(User).filter(
               User.id == tag.user_id
          ).first()

          if user:

               tagged_users.apped({
                    "id": user.id,
                    "name": user.name
               })

     return {
          "id": reminder.id,

          "title": reminder.title,
          "description": reminder.description,

          "reminder_date": reminder.reminder_date,
          "reminder_time": reminder.reminder_time,

          "repeat": reminder.repeat,
          "priority": reminder.priority,

          "family_id": reminder.family_id,
          "created_by": reminder.created_by,

          "is_sent": reminder.is_sent,
          "created_at": str(reminder.created_at) if reminder.created_at else None,

          "tagged_users": tagged_users
     }

@router.put("/reminders/{reminder_id}")
def update_reminder(
     reminder_id: int,

     reminder_data: ReminderUpdate,

     db: Session = Depends(get_db),
     current_user = Depends(get_current_user)
):
     reminder = db.query(Reminder).filter(
          Reminder.id == reminder_id
     ).first()

     if reminder is None:

          raise HTTPException(
               status_code=404,
               detail="Reminder not found"
          )

     family = db.query(Family).filter(
          Family.id == reminder.family_id
     ).first()

     is_admin = family and family.created_by == current_user.id

     if not is_admin and reminder.created_by != current_user.id:

          raise HTTPException(
               status_code=403,
               detail="You can only update your own reminders"
          )
     
     reminder.title = reminder_data.title
     reminder.description = reminder_data.description

     reminder.reminder_date = reminder_data.reminder_date
     reminder.reminder_time = reminder_data.reminder_time

     reminder.repeat = reminder_data.repeat.lower()
     reminder.priority = reminder_data.priority.lower()

     old_tags = db.query(ReminderTag).filter(
          ReminderTag.reminder_id == reminder_id
     ).all()


     for tag in old_tags:
          db.delete(tag)
     db.commit()

     unique_users = set(reminder_data.tagged_users)

     for user_id in unique_users:

          new_tag = ReminderTag(
               reminder_id = reminder.id,
               user_id = user_id
          )

          db.add(new_tag)

     db.commit()

     return {
          "message" : "reminder updates successfully."
     }
