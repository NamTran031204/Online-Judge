import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchProblems } from "../../redux/slices/problems-list-slice";
import { Link } from "react-router-dom";
import "./problems.css";

export default function ProblemList() {
  const dispatch = useDispatch();
  const { problems, totalItems, loading } = useSelector(
    (state) => state.problemsList
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    dispatch(
      searchProblems({
        search, page, size: pageSize
      })
    );
  }, [search, page]);

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="problem-container">
      <h2 className="problem-title">Problem Set</h2>

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search problem..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
      <table className="list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Tags</th>
            <th></th>
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
            Array.isArray(problems) && problems.map((p) => (
              <tr key={p.problem_id}>
                <td>{p.problem_id}</td>
                <td>{p.title}</td>
                <td>
                  {p.tags?.map((t) => (
                    <span key={t} className="problem-tag">
                      {t}
                    </span>
                  ))}
                </td>
                <td className="action-cell">
                  <Link to={`/problem/${p.problem_id}`}>
                    <button className="view-btn">Solve</button>
                  </Link>

                  <Link to={`/problem/edit/${p.problem_id}`}>
                    <button className="edit-btn">Edit</button>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="list-table-btn-box">
        {/* Pagination */}
        <div className="pagination-box">
          <button
            className={`page-btn ${page === 1 ? "disabled" : ""}`}
            onClick={() => page > 1 && setPage(page - 1)}
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
            className={`page-btn ${page === totalPages ? "disabled" : ""}`}
            onClick={() => page < totalPages && setPage(page + 1)}
          >
            Next
          </button>
        </div>

        <Link to="/problems/create">
          <button className="create-btn">Create Problem</button>
        </Link>
      </div>
    </div>
  );
}
