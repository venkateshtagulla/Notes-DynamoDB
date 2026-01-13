# Notes-DynamoDB Web Application

A simple Notes Web Application built with FastAPI (backend), React (frontend), and AWS DynamoDB.

## Features

- Create, read, update, and delete notes
- Search/filter notes by title or content
- Clean, simple UI with two-column layout
- No animations, no unnecessary complexity

## Tech Stack

- **Backend**: Python FastAPI
- **Frontend**: React 
- **Styling**: Tailwind CSS
- **Database**: AWS DynamoDB

## Project Structure

```
Notes_DyDB/
├── backend/
│   ├── main.py          # FastAPI application
│   ├── database.py      # DynamoDB connection
│   ├── models.py        # Pydantic models
│   ├── routes.py        # API routes
│   ├── requirements.txt # Python dependencies
│   └── README.md        # Backend documentation
├── frontend/
│   ├── src/
│   │   ├── App.jsx      # Main app component
│   │   ├── api.js       # API functions
│   │   ├── NotesList.jsx    # Notes list component
│   │   ├── NoteEditor.jsx   # Note editor component
│   │   ├── index.css    # Tailwind CSS
│   │   └── main.jsx     # React entry point
│   ├── package.json     # Node dependencies
│   └── README.md        # Frontend documentation
└── README.md            # This file
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory:
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-2
```

5. Run the backend server:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## DynamoDB Table

The application uses a DynamoDB table named `NotesTable` with the following structure:

- **Table Name**: `NotesTable`
- **Partition Key**: `userId` (String)
- **Sort Key**: `noteId` (String)

**Fields**:
- `userId` - User identifier (fixed value: "user123")
- `noteId` - Unique note identifier
- `title` - Note title
- `content` - Note content
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

The table will be created automatically on first run if it doesn't exist.

## API Endpoints

- `POST /api/notes` - Create a new note
- `GET /api/notes` - Get all notes (optional `?search=term` query parameter)
- `GET /api/notes/{note_id}` - Get a specific note
- `PUT /api/notes/{note_id}` - Update a note
- `DELETE /api/notes/{note_id}` - Delete a note

## Usage

1. Start the backend server (port 8000)
2. Start the frontend server (port 5173)
3. Open `http://localhost:5173` in your browser
4. Create, edit, and manage your notes!

## Notes

- No authentication is implemented (uses fixed userId: "user123")
- The table is created automatically with PAY_PER_REQUEST billing mode
- All timestamps are in ISO format (UTC)
