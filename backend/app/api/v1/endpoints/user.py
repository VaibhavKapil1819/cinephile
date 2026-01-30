from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from app.api import deps
from app.cruds.user import user_crud
from app.models.schemas.video import User, Video

router = APIRouter()

@router.get("/profile", response_model=User)
async def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    return current_user

@router.get("/watch-history", response_model=List[Video])
async def get_history(
    limit: int = 20,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    return await user_crud.get_history(current_user.id, limit)

@router.post("/watch-history")
async def record_history(
    video_id: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    await user_crud.add_history(current_user.id, video_id)
    return {"success": True}

@router.get("/favorites", response_model=List[Video])
async def get_favs(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    return await user_crud.get_favorites(current_user.id)

@router.post("/favorites/{video_id}")
async def toggle_fav(
    video_id: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    is_favorite = await user_crud.toggle_favorite(current_user.id, video_id)
    return {"success": True, "isFavorite": is_favorite}
