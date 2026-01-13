from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class NoteCreate(BaseModel):
    title: str
    content: str


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class NoteResponse(BaseModel):
    userId: str
    noteId: str
    title: str
    content: str
    createdAt: str
    updatedAt: str
