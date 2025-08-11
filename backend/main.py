from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="Taskify API", description="API for Taskify Todo App")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models for request/response
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "pending"  # pending, completed
    priority: str = "medium"  # low, medium, high
    due_date: Optional[date] = None

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to Taskify API"}

@app.get("/tasks", response_model=List[Task])
def read_tasks(skip: int = 0, limit: int = 100, status: Optional[str] = None, db: Session = Depends(get_db)):
    tasks = db.query(models.Task)
    
    if status:
        tasks = tasks.filter(models.Task.status == status)
    
    return tasks.offset(skip).limit(limit).all()

@app.post("/tasks", response_model=Task, status_code=201)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/tasks/{task_id}", response_model=Task)
def read_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.patch("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, task: TaskBase, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    for key, value in task.dict().items():
        setattr(db_task, key, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return None

@app.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    # Get status counts
    completed_count = db.query(models.Task).filter(models.Task.status == "completed").count()
    pending_count = db.query(models.Task).filter(models.Task.status == "pending").count()
    
    # Get priority counts
    high_count = db.query(models.Task).filter(models.Task.priority == "high").count()
    medium_count = db.query(models.Task).filter(models.Task.priority == "medium").count()
    low_count = db.query(models.Task).filter(models.Task.priority == "low").count()
    
    # Generate daily analytics (last 7 days)
    from datetime import datetime, timedelta
    from sqlalchemy import func
    
    daily_analytics = []
    today = datetime.utcnow().date()
    
    for i in range(6, -1, -1):
        day_date = today - timedelta(days=i)
        day_start = datetime.combine(day_date, datetime.min.time())
        day_end = datetime.combine(day_date, datetime.max.time())
        
        # Count completed tasks for this day
        completed = db.query(models.Task).filter(
            models.Task.status == "completed",
            models.Task.created_at >= day_start,
            models.Task.created_at <= day_end
        ).count()
        
        # Count added tasks for this day
        added = db.query(models.Task).filter(
            models.Task.created_at >= day_start,
            models.Task.created_at <= day_end
        ).count()
        
        daily_analytics.append({
            "date": day_date.strftime("%Y-%m-%d"),
            "completed": completed,
            "added": added
        })
    
    return {
        "daily": daily_analytics,
        "status": {
            "completed": completed_count,
            "pending": pending_count
        },
        "priority": {
            "high": high_count,
            "medium": medium_count,
            "low": low_count
        }
    }

@app.get("/analytics/status-count")
def get_status_count(db: Session = Depends(get_db)):
    completed_count = db.query(models.Task).filter(models.Task.status == "completed").count()
    pending_count = db.query(models.Task).filter(models.Task.status == "pending").count()
    
    return {
        "completed": completed_count,
        "pending": pending_count
    }

# Run the application with: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)