import asyncio
from app.db.firebase import initialize_firebase, get_db
from app.cruds.video import video_crud

# Sample video data for Cinephile
SAMPLE_VIDEOS = [
    {
        "title": "Interstellar Journey",
        "description": "A crew of astronauts travel through a wormhole in space in an attempt to ensure humanity's survival.",
        "thumbnailUrl": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1000",
        "videoUrl": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        "category": "Sci-Fi",
        "duration": "2h 49m",
        "trending": True,
        "views": 1500
    },
    {
        "title": "Neon Nights",
        "description": "In a future where memory is a commodity, a detective hunts for a truth that was never meant to be found.",
        "thumbnailUrl": "https://images.unsplash.com/photo-1614850523296-e8c041de24c6?auto=format&fit=crop&q=80&w=1000",
        "videoUrl": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        "category": "Sci-Fi",
        "duration": "1h 55m",
        "trending": False,
        "views": 800
    },
    {
        "title": "The Crimson Heist",
        "description": "An elite team of thieves plans the most ambitious bank robbery in history, only to realize they are being played.",
        "thumbnailUrl": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1000",
        "videoUrl": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        "category": "Action",
        "duration": "2h 10m",
        "trending": True,
        "views": 2200
    },
    {
        "title": "Urban Noir",
        "description": "A gritty look into the underbelly of a city that never sleeps, where every corner hides a secret.",
        "thumbnailUrl": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1000",
        "videoUrl": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        "category": "Crime",
        "duration": "2h 5m",
        "trending": False,
        "views": 450
    },
    {
        "title": "Shadow Protocol",
        "description": "A retired assassin is forced back into the game when his past catches up with him in the most brutal way.",
        "thumbnailUrl": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000",
        "videoUrl": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        "category": "Action",
        "duration": "1h 48m",
        "trending": False,
        "views": 1200
    }
]

async def seed_database():
    print("🚀 Starting database seeding...")
    initialize_firebase()
    db = get_db()
    
    if db is None:
        print("❌ Error: Firebase not initialized. Check your credentials.")
        return

    # Check if we already have videos
    existing_videos = await video_crud.get_multi(limit=1)
    if existing_videos:
        print("ℹ️ Database already contains videos. Skipping seeding.")
        # return # Uncomment if you want to skip

    for video in SAMPLE_VIDEOS:
        try:
            video_id = await video_crud.create(video)
            print(f"✅ Created video: {video['title']} (ID: {video_id})")
        except Exception as e:
            print(f"❌ Failed to create video {video['title']}: {e}")

    print("✨ Seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed_database())
