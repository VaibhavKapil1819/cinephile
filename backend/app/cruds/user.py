from typing import List, Dict, Any
from app.db.firebase import get_db
from google.cloud import firestore
from app.cruds.video import video_crud

class UserCRUD:
    @staticmethod
    async def add_history(user_id: str, video_id: str):
        db = get_db()
        if db is None: return
        
        doc_ref = db.collection('users').document(user_id).collection('history').document(video_id)
        doc_ref.set({
            'watchedAt': firestore.SERVER_TIMESTAMP,
            'videoId': video_id
        })

    @staticmethod
    async def get_history(user_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        db = get_db()
        if db is None: return []
        
        history_docs = db.collection('users').document(user_id).collection('history').order_by('watchedAt', direction=firestore.Query.DESCENDING).limit(limit).stream()
        
        videos = []
        for doc in history_docs:
            video_id = doc.to_dict().get('videoId')
            video_data = await video_crud.get(video_id)
            if video_data:
                video_data['watchedAt'] = str(doc.to_dict().get('watchedAt'))
                videos.append(video_data)
        return videos

    @staticmethod
    async def toggle_favorite(user_id: str, video_id: str) -> bool:
        db = get_db()
        if db is None: return False
        
        fav_ref = db.collection('users').document(user_id).collection('favorites').document(video_id)
        doc = fav_ref.get()
        
        if doc.exists:
            fav_ref.delete()
            return False
        else:
            fav_ref.set({
                'addedAt': firestore.SERVER_TIMESTAMP,
                'videoId': video_id
            })
            return True

    @staticmethod
    async def get_favorites(user_id: str) -> List[Dict[str, Any]]:
        db = get_db()
        if db is None: return []
        
        fav_docs = db.collection('users').document(user_id).collection('favorites').stream()
        videos = []
        for doc in fav_docs:
            video_id = doc.id
            video_data = await video_crud.get(video_id)
            if video_data:
                videos.append(video_data)
        return videos

user_crud = UserCRUD()
