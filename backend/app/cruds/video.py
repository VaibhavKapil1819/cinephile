from typing import List, Optional, Dict, Any
from app.db.firebase import get_db
from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter

COLLECTION_NAME = "videos"

class VideoCRUD:
    @staticmethod
    async def get_multi(category: Optional[str] = None, limit: int = 20) -> List[Dict[str, Any]]:
        db = get_db()
        if db is None: return []
        
        collection_ref = db.collection(COLLECTION_NAME)
        if category and category.strip():
            query = collection_ref.where(filter=FieldFilter('category', '==', category)).limit(limit)
        else:
            query = collection_ref.limit(limit)
            
        docs = query.stream()
        videos = []
        for doc in docs:
            video_data = doc.to_dict()
            video_data['id'] = doc.id
            videos.append(video_data)
        return videos

    @staticmethod
    async def get(video_id: str) -> Optional[Dict[str, Any]]:
        db = get_db()
        if db is None: return None
        
        doc = db.collection(COLLECTION_NAME).document(video_id).get()
        if doc.exists:
            video_data = doc.to_dict()
            video_data['id'] = doc.id
            return video_data
        return None

    @staticmethod
    async def create(video_data: Dict[str, Any]) -> str:
        db = get_db()
        if db is None: raise Exception("Database not initialized")
        
        video_id = video_data.get("id")
        if video_id:
            db.collection(COLLECTION_NAME).document(video_id).set(video_data)
        else:
            _, doc_ref = db.collection(COLLECTION_NAME).add(video_data)
            video_id = doc_ref.id
        return video_id

    @staticmethod
    async def update_views(video_id: str):
        db = get_db()
        if db is None: return
        
        doc_ref = db.collection(COLLECTION_NAME).document(video_id)
        doc_ref.update({
            'views': firestore.Increment(1)
        })

    @staticmethod
    async def search(query: str, limit: int = 10) -> List[Dict[str, Any]]:
        db = get_db()
        if db is None: return []
        
        collection_ref = db.collection(COLLECTION_NAME)
        # Simple prefix match
        docs = collection_ref.where(filter=FieldFilter('title', '>=', query)).where(filter=FieldFilter('title', '<=', query + '\uf8ff')).limit(limit).stream()
        
        videos = []
        for doc in docs:
            video_data = doc.to_dict()
            video_data['id'] = doc.id
            videos.append(video_data)
        return videos

video_crud = VideoCRUD()
