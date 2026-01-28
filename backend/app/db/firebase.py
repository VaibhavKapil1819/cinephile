import firebase_admin
from firebase_admin import credentials, firestore
from app.core.config import settings
import os

db = None

def initialize_firebase():
    global db
    if not firebase_admin._apps:
        if os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
            firebase_admin.initialize_app(cred)
            db = firestore.client()
            print("✅ Firestore initialized successfully")
        else:
            print(f"❌ Error: Firebase credentials not found at {settings.FIREBASE_CREDENTIALS_PATH}")
            # We don't raise Exception here to allow app to start, but db will be None
    else:
        db = firestore.client()

def get_db():
    if db is None:
        initialize_firebase()
    return db
