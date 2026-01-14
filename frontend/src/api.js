const API_BASE_URL = "https://notes-dynamodb-v.onrender.com/api";

export const createNote = async (title, content) => {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to create note");
  }
  
  return response.json();
};

export const getAllNotes = async (search = null) => {
  const url = search 
    ? `${API_BASE_URL}/notes?search=${encodeURIComponent(search)}`
    : `${API_BASE_URL}/notes`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }
  
  return response.json();
};

export const getNoteById = async (noteId) => {
  const response = await fetch(`${API_BASE_URL}/notes/${noteId}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch note");
  }
  
  return response.json();
};

export const updateNote = async (noteId, title, content) => {
  const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to update note");
  }
  
  return response.json();
};

export const deleteNote = async (noteId) => {
  const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    throw new Error("Failed to delete note");
  }
  
  return response.json();
};
