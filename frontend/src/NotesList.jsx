import { useState, useEffect } from "react";
import { getAllNotes } from "./api";

function NotesList({ onSelectNote, selectedNoteId }) {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await getAllNotes(searchTerm || null);
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [searchTerm]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200">
      <div className="p-4 border-b bg-red-900 border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-white mb-4">🗒️
 Notes</h1>
        
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 font-semibold rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex-1 bg-sky-200 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-gray-500">Loading...</div>
        ) : notes.length === 0 ? (
          <div className="p-4 text-gray-500 text-center">
            {searchTerm ? "No notes found" : "No notes yet"}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notes.map((note) => (
              <div
                key={note.noteId}
                onClick={() => onSelectNote(note)}
                className={`p-4 cursor-pointer hover:bg-gray-100 ${
                  selectedNoteId === note.noteId ? "bg-blue-50 border-l-4 border-blue-500" : ""
                }`}
              >
                <div className="font-semibold text-gray-800 mb-1 truncate">
                  {note.title || "Untitled"}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(note.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotesList;
