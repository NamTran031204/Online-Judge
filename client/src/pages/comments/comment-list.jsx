import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { searchComments } from "../../redux/slices/comment-list-slice";
import { deleteComment } from "../../redux/slices/comment-slice";
import NewCommentModal from "./new-comment"
import "./comment.css";

// Mock Data
const mockComments = [
  {
    comment_id: 1001,
    user_id: "Coder123",
    contents: "Bài này giải thuật tham lam là ổn nhất.",
    created_at: "2025-12-09 10:30:00",
    source_id: "problem_A",
  },
  {
    comment_id: 1002,
    user_id: "Admin_Dev",
    contents: "Cảm ơn góp ý, chúng tôi sẽ xem xét tối ưu lại.",
    created_at: "2025-12-09 11:45:00",
    source_id: "problem_A",
  },
  {
    comment_id: 1003,
    user_id: "Newbie_JS",
    contents: "Em chạy code bị lỗi Time Limit Exceeded, có ai giúp em không?",
    created_at: "2025-12-10 09:00:00",
    source_id: "problem_A",
  },
];

export default function CommentList() {
  const dispatch = useDispatch();
  const { source_id } = useParams();
  const [showModal, setShowModal] = useState(false);

  const { comments: fetchedComments, loading } = useSelector(
    (state) => state.commentList
  );

  const commentsToDisplay =
    fetchedComments.length > 0 || loading ? fetchedComments : mockComments;

  useEffect(() => {
    dispatch(
      searchComments({
        skipCount: 0,
        maxResultCount: 50,
        filter: { source_id },
      })
    );
  }, [source_id, dispatch]);

  const handleDelete = async (id) => {
    await dispatch(deleteComment(id));
    dispatch(
      searchComments({
        skipCount: 0,
        maxResultCount: 50,
        filter: { source_id },
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
          {loading ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          ) : (
            commentsToDisplay.map((c) => (
              <tr key={c.comment_id}>
                <td>{c.comment_id}</td>
                <td>{c.user_id}</td>
                <td>{c.contents}</td>
                <td>{c.created_at}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(c.comment_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}

          {!loading && commentsToDisplay.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Không có bình luận nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <NewCommentModal
          source_id={source_id}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            dispatch(
              searchComments({
                skipCount: 0,
                maxResultCount: 50,
                filter: { source_id },
              })
            );
          }}
        />
      )}
    </div>
  );
}
