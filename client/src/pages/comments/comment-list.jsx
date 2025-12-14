import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { searchComments } from "../../redux/slices/comment-list-slice";
import { deleteComment } from "../../redux/slices/comment-slice";
import NewCommentModal from "./new-comment";
import { mockComments } from "./mock-comments";
import "./comment.css";

export default function CommentList() {
  const dispatch = useDispatch();
  const { source_id } = useParams();
  const [showModal, setShowModal] = useState(false);

  const { items, loading } = useSelector(
    (state) => state.commentList
  );

  const comments =
    items && items.length > 0 ? items : mockComments;

  useEffect(() => {
    if (!source_id) return;

    dispatch(
      searchComments({
        source_id,
        type: "SUBMISSION",
      })
    );
  }, [source_id, dispatch]);

  const handleDelete = async (id) => {
    await dispatch(deleteComment(id));
    dispatch(
      searchComments({
        source_id,
        type: "SUBMISSION",
      })
    );
  };

  return (
    <div className="comment-container">
      <div className="comment-header">
        <h2>Comments</h2>
        <button
          className="new-comment-btn"
          onClick={() => setShowModal(true)}
        >
          New Comment
        </button>
      </div>

      <table className="comment-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Content</th>
            <th>Time</th>
            <th width="90px">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          )}

          {!loading &&
            comments.map((c) => (
              <tr key={c.comment_id}>
                <td>{c.comment_id}</td>
                <td>{c.user_id}</td>
                <td>{c.contents}</td>
                <td>
                  {new Date(c.created_at).toLocaleString()}
                </td>
                <td>
                  {!c.is_deleted && (
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(c.comment_id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {showModal && (
        <NewCommentModal
          source_id={source_id}
          type="SUBMISSION"
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            dispatch(
              searchComments({
                source_id,
                type: "SUBMISSION",
              })
            );
          }}
        />
      )}
    </div>
  );
}
