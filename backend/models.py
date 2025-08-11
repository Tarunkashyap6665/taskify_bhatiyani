from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    status = Column(String, default="pending")  # pending, completed
    priority = Column(String, default="medium")  # low, medium, high
    due_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)