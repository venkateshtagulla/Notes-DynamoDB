from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router
from database import create_table_if_not_exists

app = FastAPI(title="Notes API", version="1.0.0")

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router, prefix="/api", tags=["notes"])


@app.on_event("startup")
async def startup_event():
    """Create table if it doesn't exist on startup"""
    try:
        create_table_if_not_exists()
    except Exception as e:
        print(f"Warning: Could not create table: {e}")


@app.get("/")
async def root():
    return {"message": "Notes API is running"}
