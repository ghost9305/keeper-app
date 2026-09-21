import { useState, useEffect } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Login from "./Login.jsx";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axiosClient from "../api/axiosClient.js";

function App() {
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axiosClient.get("/auth/me");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }

    async function fetchNotes() {
      try {
        const res = await axiosClient.get("/notes");
        setNotes(res.data);
      } catch (err) {
        console.error("failed to fetch notes", err);
      }
    }
    fetchNotes();
  }, [user]);

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

  async function handleLogout() {
    try {
      await axiosClient.post("/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("failed to logout", err);
    }
  }

  if (isAuthLoading) {
    return (
      <div>
        <Header />
        <p className="auth-status">Loading...</p>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Header />
        <Login onLogin={setUser} />
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header user={user} onLogout={handleLogout} />
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
