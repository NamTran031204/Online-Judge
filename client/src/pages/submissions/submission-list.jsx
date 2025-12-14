// src/pages/submissions/SubmissionList.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteSubmission } from "../../redux/slices/submission-slice";
import { searchSubmissions } from "../../redux/slices/submissions-list-slice";
import { Link } from "react-router-dom";
import "./submission.css";

const LIMIT = 10;

// Dữ liệu giả định (Mock Data)
const mockSubmissions = [
  {
    submission_id: 10001,
    user_id: "Coder_A",
    problem_id: "Problem 123",
    result: "Accepted",
    created_at: "2025-12-10 18:00:00",
  },
  {
    submission_id: 10002,
    user_id: "Hacker_B",
    problem_id: "Problem 456",
    result: "Wrong Answer",
    created_at: "2025-12-10 17:55:30",
  },
  {
    submission_id: 10003,
    user_id: "Coder_A",
    problem_id: "Problem 789",
    result: "Time Limit Exceeded",
    created_at: "2025-12-10 17:50:15",
  },
  {
    submission_id: 10004,
    user_id: "Judge_Test",
    problem_id: "Problem 123",
    result: "Runtime Error",
    created_at: "2025-12-10 17:45:00",
  },
  {
    submission_id: 10005,
    user_id: "Hacker_B",
    problem_id: "Problem 456",
    result: "Accepted",
    created_at: "2025-12-10 17:40:40",
  },
];
// ---

export default function SubmissionList() {
  const dispatch = useDispatch();
  const submissionListState = useSelector((state) => state.submissionList);

  const fetchedItems = submissionListState?.items || [];
  const loading = submissionListState?.loading || false;
  const totalCount = submissionListState?.totalCount || 0;

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  
  const itemsToDisplay = fetchedItems.length > 0 || loading ? fetchedItems : mockSubmissions;
  
  const countToUse = fetchedItems.length > 0 ? totalCount : mockSubmissions.length;
  const totalPages = Math.ceil(countToUse / LIMIT);

  useEffect(() => {
    const skipCount = (page - 1) * LIMIT;
    
    dispatch(
      searchSubmissions({
        skipCount: skipCount,
        maxResultCount: LIMIT,
        filter: search ? { keyword: search } : {},
        sorting: "created_at desc",
      })
    );
  }, [dispatch, search, page]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      try {
        await dispatch(deleteSubmission(id)).unwrap();
        dispatch(
          searchSubmissions({
            skipCount: (page - 1) * LIMIT,
            maxResultCount: LIMIT,
            filter: search ? { keyword: search } : {},
            sorting: "created_at desc",
          })
        );
      } catch (err) {
        console.error("Delete submission failed:", err);
      }
    }
  };

  return (
    <div className="submission-container">
      <h2>Submissions</h2>
      
      {/* 1. SEARCH BOX */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search submission..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <table className="submission-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Problem</th>
            <th>Result</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          ) : itemsToDisplay.length > 0 ? (
            itemsToDisplay.map((s) => (
              <tr key={s.submission_id}>
                <td>{s.submission_id}</td>
                <td>{s.user_id}</td>
                <td>{s.problem_id}</td>
                <td>{s.result}</td>
                <td>
                  {s.created_at}
                </td> 
                <td>
                  <Link to={`/submissions/${s.submission_id}`}>
                      <button className="primary-btn small-btn">View</button>
                  </Link>
                  <button
                    className="danger-btn small-btn"
                    onClick={() => handleDelete(s.submission_id)}
                    style={{ marginLeft: '8px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No submissions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* 2. ACTION + PAGINATION */}
      {itemsToDisplay.length > 0 && (
        <div className="list-action-btn-box"> 
          <Link to="/submissions/create">
            <button className="primary-btn">Create Submission</button>
          </Link>
          
          <div className="list-pagination-box">
            <button
              className={`page-btn ${page === 1 ? "disabled" : ""}`}
              onClick={() => page > 1 && setPage(page - 1)}
              disabled={page === 1}
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
              className={`page-btn ${page === totalPages || totalPages === 0 ? "disabled" : ""}`}
              onClick={() => page < totalPages && setPage(page + 1)}
              disabled={page === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>
      )}
      {itemsToDisplay.length === 0 && (
          <div className="list-action-btn-box" style={{ justifyContent: 'flex-start' }}>
              <Link to="/submissions/create">
                  <button className="primary-btn">Create Submission</button>
              </Link>
          </div>
      )}
    </div>
  );
}