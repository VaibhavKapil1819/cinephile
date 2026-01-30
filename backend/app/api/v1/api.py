from fastapi import APIRouter
from app.api.v1.endpoints import videos, user, auth

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(videos.router, prefix="/videos", tags=["videos"])
api_router.include_router(user.router, prefix="/user", tags=["user"])
