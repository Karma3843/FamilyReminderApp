from sqlalchemy import Column, Integer, String, ForeignKey, Date, Time, Boolean, DateTime

from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ ="users"

    id=Column(Integer, primary_key=True, index=True)
    name=Column(String, nullable=False)
    email=Column(String, unique=True, index=True)
    password=Column(String)

class Family(Base):
    __tablename__ = "families"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"))

class FamilyMember(Base):
    __tablename__ = "family_members"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    family_id = Column(Integer, ForeignKey("families.id"))

class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)

    reminder_date= Column(Date)
    reminder_time = Column(Time)

    repeat = Column(String, default="none")
    priority= Column(String, default="low")

    family_id = Column(Integer, ForeignKey("families.id"))
    created_by = Column(Integer, ForeignKey("users.id"))

    is_sent = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)

class ReminderTag(Base):
    __tablename__ = "reminder_tags"

    id=Column(Integer, primary_key=True, index=True)
    reminder_id = Column(Integer, ForeignKey("reminders.id"))
    user_id = Column(Integer, ForeignKey("users.id"))