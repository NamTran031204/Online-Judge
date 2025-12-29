import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchContestDetail,
  deleteContest,
} from "../../redux/slices/contest-slice";
import ContestDashboard from "../../pages/dashboard/dashboard"
import CommentList from "../../pages/comments/comment-list"
import {
  Trophy,
  Medal,
  Award,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Code,
  Users,
  Play,
  BookOpen,
  MessageSquare,
} from "lucide-react";

import "./contest-detail.css";

export default function ContestDetail() {
  const { contest_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { detail, loading } = useSelector((state) => state.contest);

  useEffect(() => {
    dispatch(fetchContestDetail(contest_id));
  }, [contest_id]);

  if (loading || !detail) return <div className="contest-loading">Loading...</div>;

  const isRunning = detail.contest_status === "running";
  const isEnded = detail.contest_status === "ended";

  return (
    <div className="contest-detail-page">
      {/* Header */}
      <div className="contest-header">
        <Link to="/contests" className="back-btn">
          <ArrowLeft size={16} />
          Back to contests
        </Link>

        <div className="contest-title-row">
          <div>
            <h1>{detail.title}</h1>
            <p className="contest-desc">{detail.description}</p>
          </div>

          <span className={`status-badge ${detail.contest_status}`}>
            {isRunning && <CheckCircle size={14} />}
            {isEnded && <XCircle size={14} />}
            {!isRunning && !isEnded && <Clock size={14} />}
            {detail.contest_status}
          </span>
        </div>
      </div>

      <div className="contest-grid">
        {/* LEFT */}
        <div className="contest-main">
          {/* Problems */}
          <section className="card">
            <h2 className="card-title">
              <Code size={18} />
              Problems
            </h2>

            <table className="contest-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {detail.problems.length === 0 && (
                  <tr>
                    <td colSpan="3" className="empty">
                      No problems
                    </td>
                  </tr>
                )}

                {detail.problems.map((p, idx) => (
                  <tr key={p.problem_id}>
                    <td>{String.fromCharCode(65 + idx)}</td>
                    <td>{p.title}</td>
                    <td>
                      <Link
                        to={`/problem/${p.problem_id}`}
                        className="solve-btn"
                      >
                        Solve
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Standings */}
          <section className="card">
            <h2 className="card-title">
              <Trophy size={18} />
              Dashboard
            </h2>

            {isRunning || isEnded ? (
              <ContestDashboard />
            ) : (
              <div className="standings-placeholder">
                <Clock size={32} />
                <p>Contest has not started</p>
              </div>
            )}
          </section>

          {/* Questions */}
          <section className="card">
            <h2 className="card-title">
              <MessageSquare size={18} />
              Questions & Announcements
            </h2>

            <CommentList sourceId={contest_id} type="CONTEST" />
          </section>
        </div>

        {/* RIGHT */}
        <aside className="contest-sidebar">
          <div className="card">
            <h3>Contest Info</h3>

            <div className="info-row">
              <span>Status</span>
              <span>{detail.contest_status}</span>
            </div>

            <div className="info-row">
              <span>Type</span>
              <span>{detail.contest_type}</span>
            </div>

            <div className="info-row">
              <span>Start</span>
              <span>{detail.start_time}</span>
            </div>

            <div className="info-row">
              <span>Duration</span>
              <span>{detail.duration} minutes</span>
            </div>
          </div>

          <div className="card">
            <h3>
              <Play size={16} /> Virtual Participation
            </h3>
            <button className="primary-btn">Start Virtual Contest</button>
          </div>

          <div className="card">
            <h3>
              <BookOpen size={16} /> Materials
            </h3>
            <Link className="link-item">Announcements</Link>
            <Link className="link-item">Tutorial</Link>
          </div>

          <div className="card danger">
            <button
              className="danger-btn"
              onClick={() => {
                if (confirm("Delete this contest?")) {
                  dispatch(deleteContest(contest_id)).then(() =>
                    navigate("/contests")
                  );
                }
              }}
            >
              Delete Contest
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
