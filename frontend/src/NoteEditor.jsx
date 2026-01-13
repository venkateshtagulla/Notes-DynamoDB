import { useState, useEffect } from "react";
import { createNote, updateNote, deleteNote } from "./api";

function NoteEditor({ selectedNote, onNoteSaved, onNoteDeleted, onNewNote }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title || "");
      setContent(selectedNote.content || "");
    } else {
      setTitle("");
      setContent("");
    }
  }, [selectedNote]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      return;
    }

    try {
      setSaving(true);
      let savedNote;
      if (selectedNote) {
        savedNote = await updateNote(selectedNote.noteId, title, content);
      } else {
        savedNote = await createNote(title, content);
      }
      onNoteSaved(savedNote);
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedNote) {
      return;
    }

    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      setDeleting(true);
      await deleteNote(selectedNote.noteId);
      onNoteDeleted();
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note");
    } finally {
      setDeleting(false);
    }
  };

  const handleNewNote = () => {
    setTitle("");
    setContent("");
    onNewNote();
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">📝

            {selectedNote ? "Edit Note" : "New Note"}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleNewNote}
              className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-gray-300"
            >
              New Note
            </button>
            {selectedNote && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving || (!title.trim() && !content.trim())}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full font-semibold px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
      </div>

      <div className="flex-1 p-4">
        <textarea
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
    </div>
  );
}

export default NoteEditor;
