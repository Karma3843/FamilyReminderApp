from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.database import SessionLocal
from app.db.models import Family, FamilyMember, Reminder, User, ReminderTag
from app.security import get_current_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class AddMemberRequest(BaseModel):
    email: str
    family_id: int

@router.post("/families")
def create_family(name: str, db:Session= Depends(get_db), current_user= Depends(get_current_user)):
    family = Family(name=name, created_by=current_user.id)
    db.add(family)
    db.commit()
    db.refresh(family)

    member = FamilyMember(user_id=current_user.id, family_id=family.id)
    db.add(member)
    db.commit()

    return family

@router.post("/families/add-member")
def add_member(
    req: AddMemberRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    family = db.query(Family).filter(
        Family.id == req.family_id
    ).first()

    if family is None:
        raise HTTPException(status_code=404, detail="Family not found")

    if family.created_by != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only family admin can add members"
        )

    user = db.query(User).filter(
        User.email == req.email
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User with this email not found"
        )

    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="Admin cannot add themselves"
        )

    existing_member = db.query(FamilyMember).filter(
        FamilyMember.family_id == family.id,
        FamilyMember.user_id == user.id
    ).first()

    if existing_member:
        raise HTTPException(
            status_code=400,
            detail="User is already a member of this family"
        )

    member = FamilyMember(user_id=user.id, family_id=family.id)
    db.add(member)
    db.commit()
    return {"message": "Member added"}

@router.get("/families")
def get_families(db: Session = Depends(get_db), current_user = Depends(get_current_user)):

    user_family_ids = db.query(FamilyMember.family_id).filter(
        FamilyMember.user_id == current_user.id
    ).subquery()

    families = db.query(Family).filter(Family.id.in_(user_family_ids)).all()

    result=[]

    for family in families:
        members = db.query(FamilyMember).filter(
            FamilyMember.family_id == family.id
        ).all()

        member_list = []

        for member in members:
            user = db.query(User).filter(
                User.id == member.user_id
            ).first()

            if user:
                member_list.append({
                    "id": user.id,
                    "name": user.name,
                    "email": user.email
                })

        result.append({
            "family_id": family.id,
            "name": family.name,
            "created_by": family.created_by,
            "members": member_list
        })

    return result

@router.delete("/families/members/{user_id}")
def remove_family_member(
    
    user_id : int,
    family_id: int,

    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    family = db.query(Family).filter(
        Family.id == family_id
    ).first()

    if family is None:
        raise HTTPException(status_code=404, detail="Family not found")

    if family.created_by != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only family admin can remove members"
        )
    
    member= db.query(FamilyMember).filter(
        FamilyMember.family_id == family_id,
        FamilyMember.user_id == user_id
    ).first()

    if member is None:

        raise HTTPException(
            status_code = 404,
            detail = "Member not found in the family"
        )
    
    if user_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="Admin cannot remove themselves"
        )
    
    db.delete(member)

    db.commit()

    return {
        "message" : "Member removed successfully"
    }

@router.get("/families/reminders")
def get_family_reminders(

    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    user_family_ids = db.query(FamilyMember.family_id).filter(
        FamilyMember.user_id == current_user.id
    ).subquery()

    family_membership = db.query(FamilyMember).filter(
        FamilyMember.user_id == current_user.id
    ).first()

    if family_membership is None:

        raise HTTPException(
            status_code=403,
            detail="You are not a part of this family"
        )

    reminders = db.query(Reminder).filter(
        Reminder.family_id.in_(user_family_ids)
    ).all()

    response = []

    for reminder in reminders:

        creator = db.query(User).filter(
            User.id == reminder.created_by
        ).first()

        tags = db.query(ReminderTag).filter(
            ReminderTag.reminder_id == reminder.id
        ).all()

        tagged_users = []

        for tag in tags:

            user = db.query(User).filter(
                User.id == tag.user_id
            ).first()

            if user:

                tagged_users.append({
                    "id": user.id,
                    "name": user.name
                })

        response.append({

            "id": reminder.id,

            "title": reminder.title,
            "description": reminder.description,

            "reminder_date": reminder.reminder_date,
            "reminder_time": reminder.reminder_time,

            "repeat": reminder.repeat,
            "priority": reminder.priority,

            "is_sent": reminder.is_sent,
            "created_at": str(reminder.created_at) if reminder.created_at else None,

            "created_by": {
                "id": creator.id,
                "name": creator.name
            },

            "tagged_users": tagged_users
        })

    return response