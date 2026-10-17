import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from seed import seed_database
from app.routes import (
    auth_routes,
    user_routes,
    translation_routes,
    lesson_routes,
    vocabulary_routes,
    quiz_routes,
    ai_routes,
    practice_routes,
    progress_routes,
    achievement_routes
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database schema is created and seeded
    Base.metadata.create_all(bind=engine)
    try:
        seed_database()
    except Exception as e:
        print(f"[Startup Warning] Seed check failed: {e}")
    yield

app = FastAPI(
    title="LinguaAI API",
    description="Backend API for LinguaAI - AI-Powered Language Translation & Learning Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # allow Vite dev server and local clients
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(translation_routes.router)
app.include_router(lesson_routes.router)
app.include_router(vocabulary_routes.router)
app.include_router(quiz_routes.router)
app.include_router(ai_routes.router)
app.include_router(practice_routes.router)
app.include_router(progress_routes.router)
app.include_router(achievement_routes.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to LinguaAI API Service",
        "status": "online",
        "documentation": "/docs"
    }
