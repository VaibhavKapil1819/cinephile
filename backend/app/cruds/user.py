from typing import List, Dict, Any, Optional
from app.db.firebase import get_db
from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from app.cruds.video import video_crud
from app.core.security import get_password_hash

class UserCRUD:
    @staticmethod
    async def get_by_email(email: str) -> Optional[Dict[str, Any]]:
        db = get_db()
        if db is None: return None
        
        users = db.collection('users').where(filter=FieldFilter('email', '==', email)).limit(1).stream()
        for user in users:
            user_data = user.to_dict()
            user_data['id'] = user.id
            return user_data
        return None

    @staticmethod
    async def create_user(user_in: Dict[str, Any]) -> Dict[str, Any]:
        db = get_db()
        if db is None: raise Exception("Database not initialized")
        
        # Hash password before storing
        password = user_in.pop('password')
        user_in['hashed_password'] = get_password_hash(password)
        user_in['disabled'] = False
        user_in['createdAt'] = firestore.SERVER_TIMESTAMP
        
        _, doc_ref = db.collection('users').add(user_in)
        user_in['id'] = doc_ref.id
        return user_in

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
