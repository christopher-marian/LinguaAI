from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schema import User, Achievement, UserAchievement
from app.auth.security import get_current_user

router = APIRouter(prefix="/api/achievements", tags=["Achievements"])

@router.get("")
def get_achievements(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    all_achievements = db.query(Achievement).all()
    user_achievements = db.query(UserAchievement).filter(UserAchievement.user_id == current_user.id).all()
    unlocked_map = {ua.achievement_id: ua.earned_at for ua in user_achievements}

    result = []
    for a in all_achievements:
        is_unlocked = a.id in unlocked_map
        result.append({
            "id": a.id,
            "code": a.code,
            "name": a.name,
            "description": a.description,
            "icon": a.icon,
            "requirement": a.requirement,
            "unlocked": is_unlocked,
            "earned_at": unlocked_map[a.id].strftime("%Y-%m-%d %H:%M") if is_unlocked else None
        })

    return result
