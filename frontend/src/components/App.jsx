import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axiosClient from "../api/axiosClient.js";

function App() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function fetchNotes() {
      const res = await axiosClient.get("/notes");
      setNotes(res.data);
    }
    fetchNotes();
  }, []);

  async function addNote(newNote) {
    try {
      const res = await axiosClient.post("/notes", newNote);
      setNotes((prevNote) => {
        return [...prevNote, res.data];
      });
    } catch (err) {
      console.error("Error posting new note", err);
    }
  }

  async function deleteNote(id) {
    try {
      await axiosClient.delete(`/notes/${id}`);
      setNotes((prevNote) => {
        return prevNote.filter((note) => {
          return note.id !== id;
        });
      });
    } catch (err) {
      console.error("Error deleting note", err);
    }
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((note) => {
        return (
          <Note
            key={note.id}
            id={note.id}
            title={note.title}
            content={note.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
