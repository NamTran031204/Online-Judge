import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { searchSubmissions } from "../../redux/slices/submissions-list-slice";
import { mockSubmissions } from "../../pages/submissions/mock-submissions";
import "./submission.css";

const LIMIT = 10;

export default function SubmissionList() {
  const dispatch = useDispatch();

  const { items = [], totalItems = 0, loading } = useSelector(
    (state) => state.submissionList
  );

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

  useEffect(() => {
    dispatch(
      searchSubmissions({
        status: status || undefined,
      })
    );
  }, [dispatch, status]);

  const useMock = !loading && (!items || items.length === 0);
  const submissions = useMock ? mockSubmissions : items;
  const totalCount = useMock ? mockSubmissions.length : totalItems;

  const totalPages = Math.ceil(totalCount / LIMIT);
  const pagedItems = submissions.slice(
    (page - 1) * LIMIT,
    page * LIMIT
  );

  return (
    <div className="submission-container list-full-width">
      <div className="list-header-actions">
        <h2>Submissions</h2>
      </div>

      <div className="list-filter-actions">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All status</option>
          <option value="PENDING">PENDING</option>
          <option value="DONE">DONE</option>
        </select>
        
        <Link to="/problems">
          <button className="btn create-btn">
            New Submission
          </button>
        </Link>
      </div>

      <table className="submission-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Result</th>
            <th>Status</th>
            <th>Time</th>
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

          {!loading && pagedItems.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No submissions found
              </td>
            </tr>
          )}

          {!loading &&
            pagedItems.map((s) => (
              <tr key={s.submission_id}>
                <td>
                  <Link
                    to={`/submission/${s.submission_id}`}
                    className="submission-id-link"
                  >
                    {s.submission_id}
                  </Link>
                </td>
                <td>{s.user_id}</td>
                <td>
                  <span
                    className={`result ${
                      s.result === "AC"
                        ? "result-ac"
                        : ["WA", "RE", "TLE", "CE"].includes(s.result)
                        ? "result-wa"
                        : ["PENDING", "RUNNING"].includes(s.result)
                        ? "result-pending"
                        : "result-unknown"
                    }`}
                  >
                    {s.result}
                  </span>
                </td>
                <td>{s.status}</td>
                <td>{new Date(s.created_at).toLocaleString()}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="list-action-btn-box justify-end">
          <div className="list-pagination-box">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`page-btn ${page === i + 1 ? "active" : ""}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}