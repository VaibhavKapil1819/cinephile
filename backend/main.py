import uvicorn
import os

if __name__ == "__main__":
    # Point uvicorn to the new app structure
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
