import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteSubmission } from "../../redux/slices/submission-slice";
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      await dispatch(deleteSubmission(id)).unwrap();

      dispatch(
        searchSubmissions({
          status: status || undefined,
        })
      );
    } catch (err) {
      console.error("Delete submission failed:", err);
    }
  };

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
        
        <Link to="/submission/create">
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
            <th width="160px">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          )}

          {!loading && pagedItems.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No submissions found
              </td>
            </tr>
          )}

          {!loading &&
            pagedItems.map((s) => (
              <tr key={s.submission_id}>
                <td>{s.submission_id}</td>
                <td>{s.user_id}</td>
                <td>{s.result}</td>
                <td>{s.status}</td>
                <td>
                  {new Date(s.created_at).toLocaleString()}
                </td>
                <td>
                  <Link to={`/submissions/${s.submission_id}`}>
                    <button className="btn view-btn small-btn">
                      View
                    </button>
                  </Link>

                  <button
                    className="danger-btn small-btn"
                    onClick={() => handleDelete(s.submission_id)}
                    style={{ marginLeft: "8px" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="list-action-btn-box justify-end"> 
        {totalPages > 1 && (
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
                className={`page-btn ${
                  page === i + 1 ? "active" : ""
                }`}
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
        )}
      </div>
    </div>
  );
}