from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from app.cruds.video import video_crud
from app.models.schemas.video import Video, VideoCreate
from app.db.cache import cache_get, cache_set

router = APIRouter()

@router.get("/feed", response_model=List[Video])
async def get_home_feed(
    category: Optional[str] = None,
    limit: int = 20
) -> Any:
    cache_key = f"feed:{category or 'all'}:{limit}"
    
    cached_data = await cache_get(cache_key)
    if cached_data:
        return cached_data
    
    videos = await video_crud.get_multi(category=category, limit=limit)
    await cache_set(cache_key, videos, ttl=300)
    
    return videos

@router.get("/search/query", response_model=List[Video])
async def search_videos(
    q: str = Query(..., min_length=1),
    limit: int = 10
) -> Any:
    return await video_crud.search(q, limit)

@router.get("/{video_id}", response_model=Video)
async def get_video(video_id: str) -> Any:
    cache_key = f"video:{video_id}"
    
    cached_video = await cache_get(cache_key)
    if cached_video:
        return cached_video
    
    video = await video_crud.get(video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    await cache_set(cache_key, video, ttl=3600)
    return video

@router.post("/{video_id}/view")
async def track_view(video_id: str) -> Any:
    await video_crud.update_views(video_id)
    return {"success": True}

@router.get("/trending/now", response_model=List[Video])
async def get_trending_videos(limit: int = 10) -> Any:
    cache_key = f"trending:{limit}"
    
    cached_data = await cache_get(cache_key)
    if cached_data:
        return cached_data
    
    videos = await video_crud.get_multi(limit=50) # Get larger set to filter
    trending = [v for v in videos if v.get("trending", False)][:limit]
    
    await cache_set(cache_key, trending, ttl=120)
    return trending
