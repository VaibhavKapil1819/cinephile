from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings
from app.db.firebase import initialize_firebase
from app.db.cache import init_redis

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    initialize_firebase()
    await init_redis()

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
@app.get(f"{settings.API_V1_STR}/health")
async def health_check():
    return {"status": "ok"}
