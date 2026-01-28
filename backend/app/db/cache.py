import json
import redis.asyncio as redis
from app.core.config import settings

redis_client = None

async def init_redis():
    global redis_client
    try:
        redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
        await redis_client.ping()
        print("✅ Redis connected successfully")
    except Exception as e:
        print(f"⚠️ Redis connection failed: {e}")
        redis_client = None

async def cache_get(key: str):
    if not redis_client: return None
    try:
        data = await redis_client.get(key)
        return json.loads(data) if data else None
    except:
        return None

async def cache_set(key: str, value: any, ttl: int = 300):
    if not redis_client: return
    try:
        await redis_client.set(key, json.dumps(value), ex=ttl)
    except:
        pass
