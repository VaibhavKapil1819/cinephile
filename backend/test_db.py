
import asyncio
from app.db.firebase import get_db
from google.cloud import firestore

async def test_db():
    db = get_db()
    if db is None:
        print("❌ Database connection failed.")
        return

    try:
        # Try to write a test record
        test_ref = db.collection('test_connection').document('ping')
        test_ref.set({
            'timestamp': firestore.SERVER_TIMESTAMP,
            'status': 'ok'
        })
        print("✅ Successfully wrote to Firestore.")

        # Try to read it back
        doc = test_ref.get()
        if doc.exists:
            print(f"✅ Successfully read from Firestore: {doc.to_dict()}")
        else:
            print("❌ Failed to read back the test record.")

    except Exception as e:
        print(f"❌ Error during DB test: {e}")

if __name__ == "__main__":
    asyncio.run(test_db())
