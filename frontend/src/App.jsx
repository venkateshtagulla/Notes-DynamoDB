import { useState } from "react";
import NotesList from "./NotesList";
import NoteEditor from "./NoteEditor";

function App() {
  const [selectedNote, setSelectedNote] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectNote = (note) => {
    setSelectedNote(note);
  };

  const handleNoteSaved = (savedNote) => {
    if (savedNote) {
      setSelectedNote(savedNote);
    }
    setRefreshKey((prev) => prev + 1);
  };

  const handleNoteDeleted = () => {
    setSelectedNote(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleNewNote = () => {
    setSelectedNote(null);
  };

  return (
    <div className="h-screen flex bg-gray-100">
      <div className="w-1/3 min-w-[300px]">
        <NotesList
          key={refreshKey}
          onSelectNote={handleSelectNote}
          selectedNoteId={selectedNote?.noteId}
        />
      </div>
      <div className="flex-1">
        <NoteEditor
          selectedNote={selectedNote}
          onNoteSaved={handleNoteSaved}
          onNoteDeleted={handleNoteDeleted}
          onNewNote={handleNewNote}
        />
      </div>
    </div>
  );
}

export default App;
