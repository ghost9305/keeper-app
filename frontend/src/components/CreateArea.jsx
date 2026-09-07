import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";

function CreateArea(props) {
  const [isClicked, setIsClicked] = useState(false);

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
        {isClicked && (
          <input
            name="title"
            value={note.title}
            placeholder="Title"
            onChange={handleInput}
          />
        )}
        <textarea
          name="content"
          value={note.content}
          placeholder="Take a note..."
          onChange={handleInput}
          onClick={() => setIsClicked(true)}
          rows={isClicked ? "3" : "1"}
        />
        <Zoom in={isClicked}>
          <Fab type="submit">
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
