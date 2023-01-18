/** @format */

import "./style.css";
import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
// import { data } from "./data";
import Split from "react-split";
import { nanoid } from "nanoid";

export default function App() {
  const [notes, setNotes] = React.useState(
    () => JSON.parse(localStorage.getItem("storedNotes")) || (() => [])
  );
  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || ""
  );

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  function updateNote(text) {
    setNotes(
      // method to rearrange recently modified at top
      (oldNotes) => {
        let newNotes = [];
        for (let i = 0, n = oldNotes.length; i < n; i++) {
          if (oldNotes[i].id === currentNoteId) {
            let modifiedNote = oldNotes[i];
            modifiedNote.body = text;
            newNotes.unshift(modifiedNote);
          } else {
            newNotes.push(oldNotes[i]);
          }
        }
        return newNotes;
      }
      // map does not rearrange notes
      // oldNotes.map((oldNote) => {
      //   return oldNote.id === currentNoteId
      //     ? { ...oldNote, body: text }
      //     : oldNote;
      // })
    );
  }

  React.useEffect(() => {
    localStorage.setItem("storedNotes", JSON.stringify(notes));
  }, [notes]);

  function findCurrentNote() {
    return (
      notes.find((note) => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }

  function deleteNote(event, noteID) {
    event.stopPropagation();
    setNotes((oldNotes) => oldNotes.filter((oldNote) => oldNote.id !== noteID));
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor currentNote={findCurrentNote()} updateNote={updateNote} />
          )}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
