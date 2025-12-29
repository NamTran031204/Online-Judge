import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchComments, createComment, clearComments } from "../../redux/slices/comment-list-slice";
import "./comment.css";

const PAGE_SIZE = 10;

// Mock data
const mockComments = [
  {
    comment_id: "1",
    user_id: "admin",
    contents: "Bài này dùng greedy là hợp lý nhất.",
    parent_id: null,
    source_id: "1",
    type: "SUBMISSION",
  },
  {
    comment_id: "2",
    user_id: "phongdt",
    contents: "Em bị TLE ở test cuối, có ai gặp chưa?",
    parent_id: null,
    source_id: "1",
    type: "SUBMISSION",
  },
  {
    comment_id: "3",
    user_id: "admin",
    contents: "Bạn thử tối ưu vòng lặp trong DFS nhé.",
    parent_id: "2", // Khớp với ID của phongdt
    source_id: "1",
    type: "SUBMISSION",
  },
];

/* =========================
   CommentInput
========================= */
const CommentInput = ({ parentId, sourceId, type, onSuccess, placeholder }) => {
  const [contents, setContents] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (!contents.trim() || !sourceId || !type) return;

    const body = {
      source_id: sourceId,
      type,
      contents,
      parent_id: parentId || null,
    };

    const res = await dispatch(createComment(body));
    if (!res.error) {
      setContents("");
      onSuccess?.();
    }
  };

  return (
    <div className="input-group">
      <input
        className="comment-input-field"
        placeholder={placeholder || "Viết bình luận..."}
        value={contents}
        onChange={(e) => setContents(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <button className="send-btn" onClick={handleSubmit}>Gửi</button>
    </div>
  );
};

/* =========================
   CommentItem
========================= */
const CommentItem = ({ comment, sourceId, type, onReload }) => {
  const [showReply, setShowReply] = useState(false);
  const avatarUrl = `https://ui-avatars.com/api/?name=${comment.user_id}&background=random&color=fff`;

  return (
    <div className="comment-wrapper">
      <div className="comment-main-row">
        <div className="avatar-section">
          <img src={avatarUrl} alt={comment.user_id} className="user-avatar" />
          {/* Đường kẻ dọc nối các reply */}
          {comment.replies?.length > 0 && <div className="reply-line" />}
        </div>

        <div className="comment-content-container">
          <div className="comment-bubble">
            <div className="user-name">{comment.user_id}</div>
            <div className="comment-text">{comment.contents}</div>
          </div>

          <div className="comment-actions">
            <span className="action-time">Vừa xong</span>
            <button className="action-btn">Like</button>
            <button className="action-btn" onClick={() => setShowReply(!showReply)}>Reply</button>
          </div>

          {showReply && (
            <div className="reply-input-box">
              <CommentInput
                parentId={comment.comment_id}
                sourceId={sourceId}
                type={type}
                placeholder={`Phản hồi ${comment.user_id}...`}
                onSuccess={() => {
                  setShowReply(false);
                  onReload();
                }}
              />
            </div>
          )}

          {/* Render các phản hồi con ngay bên trong container của cha */}
          {comment.replies?.length > 0 && (
            <div className="replies-container">
              {comment.replies.map((r) => (
                <CommentItem 
                  key={r.comment_id} 
                  comment={r} 
                  sourceId={sourceId} 
                  type={type} 
                  onReload={onReload} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================
   Utility
========================= */
const buildCommentTree = (flat = []) => {
  const map = {};
  const roots = [];
  
  // Tạo bản đồ tham chiếu
  flat.forEach((c) => {
    map[String(c.comment_id)] = { ...c, replies: [] };
  });

  // Xây dựng cấu trúc cây
  flat.forEach((c) => {
    const current = map[String(c.comment_id)];
    if (c.parent_id && map[String(c.parent_id)]) {
      map[String(c.parent_id)].replies.push(current);
    } else {
      roots.push(current);
    }
  });

  return roots;
};

/* =========================
   Main Component
========================= */
export default function CommentList({ sourceId, type }) {
  const dispatch = useDispatch();
  const { items = [], totalCount = 0, loading = false } = useSelector((s) => s.commentList || {});

  const loadFirst = () => {
    if (!sourceId || !type) return;
    dispatch(clearComments());
    dispatch(searchComments({
      maxResultCount: PAGE_SIZE,
      skipCount: 0,
      sorting: "created_at desc",
      filter: { source_id: sourceId, type },
    }));
  };

  useEffect(() => { loadFirst(); }, [sourceId, type]);

  const finalItems = items.length > 0 ? items : mockComments;
  const commentTree = buildCommentTree(finalItems);

  return (
    <div className="fb-comment-section">
      <div className="root-input-container">
        <CommentInput sourceId={sourceId} type={type} onSuccess={loadFirst} />
      </div>

      <div className="fb-comment-container">
        {commentTree.map((c) => (
          <CommentItem key={c.comment_id} comment={c} sourceId={sourceId} type={type} onReload={loadFirst} />
        ))}
      </div>
    </div>
  );
}