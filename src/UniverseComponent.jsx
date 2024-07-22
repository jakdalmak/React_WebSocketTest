import React, { useState, useCallback } from "react";

function UniverseComponent({ index, initialData, onUpdate }) {
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");

  const handleTitleChange = useCallback(
    (e) => {
      const newTitle = e.target.value;
      setTitle(newTitle);
      onUpdate(index, { title: newTitle, content });
    },
    [index, content, onUpdate]
  );

  const handleContentChange = useCallback(
    (e) => {
      const newContent = e.target.value;
      setContent(newContent);
      onUpdate(index, { title, content: newContent });
    },
    [index, title, onUpdate]
  );

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Title"
      />
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Content"
      />
    </div>
  );
}

export default React.memo(UniverseComponent);
