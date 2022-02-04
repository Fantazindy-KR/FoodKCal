import { useState } from "react";

function Foodform() {
  const [title, setTitle] = useState("");
  const [calorie, setCalorie] = useState(0);
  const [content, setContent] = useState("");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleCalorieChange = (e) => {
    const nextCalorie = Number(e.target.value) || 0;
    setCalorie(nextCalorie);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <form>
      <input value={title} onChange={handleTitleChange} />
      <input type="number" value={calorie} onChange={handleCalorieChange} />
      <textarea value={content} onChange={handleContentChange} />
    </form>
  );
}

export default Foodform;
