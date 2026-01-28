from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class VideoBase(BaseModel):
    title: str
    description: str
    thumbnailUrl: str
    videoUrl: str
    category: str
    duration: str
    trending: bool = False

class VideoCreate(VideoBase):
    id: Optional[str] = None

class Video(VideoBase):
    id: str
    views: int = 0
    releasedAt: Optional[str] = None

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: str
    display_name: Optional[str] = Field(None, alias="displayName")

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    disabled: bool = False

    class Config:
        from_attributes = True
        populate_by_name = True
