from datetime import datetime, timedelta
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.schema import User, Progress, Achievement, UserAchievement, Lesson

class LearningService:
    @staticmethod
    def add_user_xp(user: User, xp_amount: int, db: Session) -> Dict[str, Any]:
        """Awards XP to user and calculates level advancement."""
        old_points = user.points
        user.points += xp_amount

        # Calculate Level
        # Level 1: 0 - 99 XP
        # Level 2: 100 - 249 XP
        # Level 3: 250 - 499 XP
        # Level 4: 500 - 999 XP
        # Level 5: 1000+ XP
        def get_level_name(pts: int) -> str:
            if pts < 100:
                return "Beginner"
            elif pts < 250:
                return "Elementary"
            elif pts < 500:
                return "Intermediate"
            elif pts < 1000:
                return "Upper Intermediate"
            else:
                return "Advanced"

        new_level = get_level_name(user.points)
        level_up = new_level != user.level
        user.level = new_level

        # Update activity & streak
        today_str = datetime.utcnow().strftime("%Y-%m-%d")
        if user.last_active_date != today_str:
            if user.last_active_date:
                last_date = datetime.strptime(user.last_active_date, "%Y-%m-%d")
                if (datetime.utcnow() - last_date).days == 1:
                    user.streak += 1
                elif (datetime.utcnow() - last_date).days > 1:
                    user.streak = 1
            else:
                user.streak = 1
            user.last_active_date = today_str

        db.commit()
        db.refresh(user)

        # Check achievement unlocks
        unlocked_achievements = LearningService.check_achievements(user, db)

        return {
            "user_id": user.id,
            "points": user.points,
            "xp_gained": xp_amount,
            "level": user.level,
            "level_up": level_up,
            "streak": user.streak,
            "unlocked_achievements": unlocked_achievements
        }

    @staticmethod
    def update_skill_progress(user_id: int, skill_name: str, delta_percent: float, db: Session):
        """Updates progress percentage for a specific skill (capped at 100)."""
        prog = db.query(Progress).filter(Progress.user_id == user_id, Progress.skill == skill_name).first()
        if not prog:
            prog = Progress(user_id=user_id, skill=skill_name, progress_percentage=min(100.0, delta_percent))
            db.add(prog)
        else:
            prog.progress_percentage = min(100.0, prog.progress_percentage + delta_percent)
            prog.updated_at = datetime.utcnow()
        db.commit()

    @staticmethod
    def check_achievements(user: User, db: Session) -> List[str]:
        """Checks achievement conditions and awards any eligible badges."""
        unlocked = []
        user_badge_ids = {ua.achievement_id for ua in user.achievements}

        all_badges = db.query(Achievement).all()
        for badge in all_badges:
            if badge.id in user_badge_ids:
                continue

            should_unlock = False
            if badge.code == "FIRST_LESSON" and user.points >= 20:
                should_unlock = True
            elif badge.code == "STREAK_7" and user.streak >= 7:
                should_unlock = True
            elif badge.code == "VOCAB_STARTER" and user.points >= 50:
                should_unlock = True
            elif badge.code == "QUIZ_CHAMP" and user.points >= 150:
                should_unlock = True

            if should_unlock:
                user_ach = UserAchievement(user_id=user.id, achievement_id=badge.id)
                db.add(user_ach)
                unlocked.append(badge.name)

        if unlocked:
            db.commit()

        return unlocked

    @staticmethod
    def get_recommendations(user: User, db: Session) -> Dict[str, Any]:
        """Generates dynamic learning recommendations based on stored skill progress."""
        progresses = db.query(Progress).filter(Progress.user_id == user.id).all()
        skill_scores = {p.skill: p.progress_percentage for p in progresses}
        
        all_skills = ["Vocabulary", "Grammar", "Reading", "Writing", "Listening", "Speaking", "Pronunciation"]
        for s in all_skills:
            if s not in skill_scores:
                skill_scores[s] = 0.0

        # Find weak skill
        weakest_skill = min(skill_scores, key=skill_scores.get)

        # Recommend lessons matching weak skill
        recommended_lessons = db.query(Lesson).filter(Lesson.category == weakest_skill).limit(2).all()
        if not recommended_lessons:
            recommended_lessons = db.query(Lesson).limit(2).all()

        return {
            "weakest_skill": weakest_skill,
            "weakest_score": skill_scores[weakest_skill],
            "reason": f"Your {weakest_skill} score is currently lower ({int(skill_scores[weakest_skill])}%). Here are tailored recommendations to build strength!",
            "recommended_lessons": [
                {
                    "id": l.id,
                    "title": l.title,
                    "description": l.description,
                    "category": l.category,
                    "level": l.level,
                    "estimated_time": l.estimated_time
                } for l in recommended_lessons
            ]
        }
