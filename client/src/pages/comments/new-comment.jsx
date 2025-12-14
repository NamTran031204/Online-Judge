import { useState } from "react";

// export default function NewCommentModal({ onClose, sourceId, type }) { 
export default function NewCommentModal({ onClose }) {
  const [content, setContent] = useState("");
  const [sourceId, setSourceId] = useState("post-123");
  const [type, setType] = useState("article");
  const [parentId, setParentId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newComment = {
      source_id: sourceId,
      type: type,
      contents: content,
      parent_id: parentId,
    };
    
    // await api.post('/comments', newComment); 

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>New Comment</h3>

        <form onSubmit={handleSubmit}>
          
          {/* Tùy chọn: Input cho type (nếu không cố định) */}
          {/* <input
            type="text"
            placeholder="Type (e.g., article, product)"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          /> */}
          
          {/* Tùy chọn: Input cho parent_id (nếu là form trả lời) */}
          {/* <input
            type="text"
            placeholder="Parent ID (optional)"
            value={parentId || ''}
            onChange={(e) => setParentId(e.target.value)}
          /> */}

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