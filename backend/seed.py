import asyncio
import os
import sys

# Add the current directory to sys.path to allow imports from 'app'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.firebase import initialize_firebase, get_db
from app.cruds.video import video_crud

# Sample movies to seed Firestore
SAMPLE_MOVIES = [
    {
        "id": "inception-123",
        "title": "Inception",
        "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        "thumbnailUrl": "https://image.tmdb.org/t/p/w1280/qmDpS9ZCCmTvZu32Hnbi6L4zpwo.jpg",
        "videoUrl": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        "category": "Sci-Fi",
        "duration": "2h 28m",
        "trending": True,
        "views": 1024,
        "releasedAt": "2010-07-16"
    },
    {
        "id": "interstellar-456",
        "title": "Interstellar",
        "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        "thumbnailUrl": "https://image.tmdb.org/t/p/w1280/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        "videoUrl": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        "category": "Sci-Fi",
        "duration": "2h 49m",
        "trending": True,
        "views": 2048,
        "releasedAt": "2014-11-07"
    },
    {
        "id": "dark-knight-789",
        "title": "The Dark Knight",
        "description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        "thumbnailUrl": "https://image.tmdb.org/t/p/w1280/qJ2tW6WMUDp9EXjBYPj3zUoseGq.jpg",
        "videoUrl": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        "category": "Action",
        "duration": "2h 32m",
        "trending": False,
        "views": 5000,
        "releasedAt": "2008-07-18"
    },
    {
        "id": "pulp-fiction-101",
        "title": "Pulp Fiction",
        "description": "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        "thumbnailUrl": "https://image.tmdb.org/t/p/w1280/d5iIl9h9btztU0kzGRvUORghGvX.jpg",
        "videoUrl": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        "category": "Crime",
        "duration": "2h 34m",
        "trending": True,
        "views": 3500,
        "releasedAt": "1994-10-14"
    },
    {
        "id": "matrix-202",
        "title": "The Matrix",
        "description": "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
        "thumbnailUrl": "https://image.tmdb.org/t/p/w1280/f89U3Y9S669Yv69q7XUq6S676Oq.jpg",
        "videoUrl": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        "category": "Sci-Fi",
        "duration": "2h 16m",
        "trending": False,
        "views": 8000,
        "releasedAt": "1999-03-31"
    },
    {
        "id": "dune-303",
        "title": "Dune",
        "description": "Feature adaptation of Frank Herbert's science fiction novel, about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.",
        "thumbnailUrl": "https://image.tmdb.org/t/p/w1280/d5NXSklZfsDf7zdoxasgHu46696.jpg",
        "videoUrl": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        "category": "Sci-Fi",
        "duration": "2h 35m",
        "trending": True,
        "views": 4200,
        "releasedAt": "2021-10-22"
    },
    {
        "id": "godfather-404",
        "title": "The Godfather",
        "description": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        "thumbnailUrl": "https://image.tmdb.org/t/p/w1280/3bhkrjOiERoSTq90GMa98p1C0mk.jpg",
        "videoUrl": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        "category": "Crime",
        "duration": "2h 55m",
        "trending": False,
        "views": 9500,
        "releasedAt": "1972-03-24"
    }
]

async def seed():
    print("🎬 Starting database seeding...")
    initialize_firebase()
    db = get_db()
    
    if db is None:
        print("❌ Error: Firestore not initialized. Check your credentials.")
        return

    for movie in SAMPLE_MOVIES:
        try:
            video_id = await video_crud.create(movie)
            print(f"✅ Created: {movie['title']} (ID: {video_id})")
        except Exception as e:
            print(f"❌ Failed to create {movie['title']}: {e}")

    print("✨ Seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed())
