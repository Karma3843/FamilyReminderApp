from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.db.database import engine, Base
from app.db import models
from app.routes import user, family, reminder
from app.scheduler import start_scheduler

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://family-reminder-app-jade.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE reminders ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()"))
    conn.commit()

@app.get("/")
def home():
    return {"message": "Family app's backend is running!"}

@app.on_event("startup")
def startup_event():
    
    start_scheduler()

app.include_router(user.router)
app.include_router(family.router)
app.include_router(reminder.router)