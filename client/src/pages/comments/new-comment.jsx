import { useState } from "react";

export default function NewCommentModal({ onClose }) {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("New comment:", content);

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>New Comment</h3>

        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Enter comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
