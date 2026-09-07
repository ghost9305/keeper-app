import { useState } from "react";

function CreateArea(props) {
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  function handleInput(event) {
    const { name, value } = event.target;
    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.onAdd(note);
    setNote({ title: "", content: "" });
  }

  return (
    <div>
      <form className="create-note" onSubmit={handleSubmit}>
        <input
          name="title"
          value={note.title}
          placeholder="Title"
          onChange={handleInput}
        />
        <textarea
          name="content"
          value={note.content}
          placeholder="Take a note..."
          onChange={handleInput}
          rows="3"
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default CreateArea;
