import firebase_admin
from firebase_admin import credentials, firestore
from app.core.config import settings
import os
import json

db = None

def initialize_firebase():
    global db
    if not firebase_admin._apps:
        if os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
            try:
                with open(settings.FIREBASE_CREDENTIALS_PATH, 'r') as f:
                    cred_dict = json.load(f)
                
                # Ensure private_key has correct newlines
                if 'private_key' in cred_dict:
                    cred_dict['private_key'] = cred_dict['private_key'].replace('\\n', '\n')
                
                cred = credentials.Certificate(cred_dict)
                firebase_admin.initialize_app(cred)
                db = firestore.client()
                print("✅ Firestore initialized successfully")
            except Exception as e:
                print(f"❌ Error initializing Firebase: {e}")
                db = None
        else:
            print(f"❌ Error: Firebase credentials not found at {settings.FIREBASE_CREDENTIALS_PATH}")
    else:
        db = firestore.client()

def get_db():
    if db is None:
        initialize_firebase()
    return db
