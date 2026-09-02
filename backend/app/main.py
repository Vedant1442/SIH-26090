from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router
from app.api.ai_routes import router as ai_router
from app.core.database import engine, Base, SessionLocal
from app.models import domain

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kaarigar Setu Backend API",
    description="API for the Kaarigar Setu application",
    version="1.0.0",
)

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")
app.include_router(ai_router, prefix="/ai")

@app.on_event("startup")
def seed_data():
    db = SessionLocal()
        
    # Check if doc steps exist
    if db.query(domain.DocStepModel).count() == 0:
        initial_docs = [
            domain.DocStepModel(id="aadhaar", title="Aadhaar", why="Identity for every scheme", status="Active"),
            domain.DocStepModel(id="bank", title="Bank account", why="Receive scheme and buyer payments", status="Active"),
            domain.DocStepModel(id="pan", title="PAN", why="Needed for Udyam and GST", status="In progress"),
            domain.DocStepModel(id="udyam", title="Udyam registration", why="Official MSME identity", status="Not started"),
            domain.DocStepModel(id="gst", title="GST readiness", why="Required by some buyer platforms", status="Not started"),
        ]
        db.add_all(initial_docs)
    
    db.commit()
    db.close()

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to Kaarigar Setu API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
