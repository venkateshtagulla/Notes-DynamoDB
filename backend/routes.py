from fastapi import APIRouter, HTTPException
from datetime import datetime
import uuid
from models import NoteCreate, NoteUpdate, NoteResponse
from database import get_table

router = APIRouter()

# Fixed userId for simplicity (no authentication)
FIXED_USER_ID = "user123"


@router.post("/notes", response_model=NoteResponse)
async def create_note(note: NoteCreate):
    """Create a new note"""
    table = get_table()
    note_id = str(uuid.uuid4())
    current_time = datetime.utcnow().isoformat()
    
    item = {
        "userId": FIXED_USER_ID,
        "noteId": note_id,
        "title": note.title,
        "content": note.content,
        "createdAt": current_time,
        "updatedAt": current_time
    }
    
    try:
        table.put_item(Item=item)
        return item
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating note: {str(e)}")


@router.get("/notes", response_model=list[NoteResponse])
async def get_all_notes(search: str = None):
    """Get all notes, optionally filtered by search term"""
    table = get_table()
    
    try:
        response = table.query(
            KeyConditionExpression="userId = :userId",
            ExpressionAttributeValues={
                ":userId": FIXED_USER_ID
            }
        )
        
        notes = response.get("Items", [])
        
        # Filter by search term if provided
        if search:
            search_lower = search.lower()
            notes = [
                note for note in notes
                if search_lower in note.get("title", "").lower() or 
                   search_lower in note.get("content", "").lower()
            ]
        
        # Sort by updatedAt descending (most recent first)
        notes.sort(key=lambda x: x.get("updatedAt", ""), reverse=True)
        
        return notes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching notes: {str(e)}")


@router.get("/notes/{note_id}", response_model=NoteResponse)
async def get_note_by_id(note_id: str):
    """Get a specific note by ID"""
    table = get_table()
    
    try:
        response = table.get_item(
            Key={
                "userId": FIXED_USER_ID,
                "noteId": note_id
            }
        )
        
        if "Item" not in response:
            raise HTTPException(status_code=404, detail="Note not found")
        
        return response["Item"]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching note: {str(e)}")


@router.put("/notes/{note_id}", response_model=NoteResponse)
async def update_note(note_id: str, note: NoteUpdate):
    """Update a note"""
    table = get_table()
    
    # First, check if note exists
    try:
        response = table.get_item(
            Key={
                "userId": FIXED_USER_ID,
                "noteId": note_id
            }
        )
        
        if "Item" not in response:
            raise HTTPException(status_code=404, detail="Note not found")
        
        # Build update expression
        update_expression = "SET updatedAt = :updatedAt"
        expression_attribute_values = {
            ":updatedAt": datetime.utcnow().isoformat()
        }
        
        if note.title is not None:
            update_expression += ", title = :title"
            expression_attribute_values[":title"] = note.title
        
        if note.content is not None:
            update_expression += ", content = :content"
            expression_attribute_values[":content"] = note.content
        
        # Update the note
        table.update_item(
            Key={
                "userId": FIXED_USER_ID,
                "noteId": note_id
            },
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values,
            ReturnValues="ALL_NEW"
        )
        
        # Fetch updated note
        response = table.get_item(
            Key={
                "userId": FIXED_USER_ID,
                "noteId": note_id
            }
        )
        
        return response["Item"]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating note: {str(e)}")


@router.delete("/notes/{note_id}")
async def delete_note(note_id: str):
    """Delete a note"""
    table = get_table()
    
    try:
        # Check if note exists
        response = table.get_item(
            Key={
                "userId": FIXED_USER_ID,
                "noteId": note_id
            }
        )
        
        if "Item" not in response:
            raise HTTPException(status_code=404, detail="Note not found")
        
        # Delete the note
        table.delete_item(
            Key={
                "userId": FIXED_USER_ID,
                "noteId": note_id
            }
        )
        
        return {"message": "Note deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting note: {str(e)}")
