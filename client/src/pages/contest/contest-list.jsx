import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContests } from "../../redux/slices/contests-list-slice";
import { Link } from "react-router-dom";
import "./contest.css";

export default function ContestList() {
  const dispatch = useDispatch();
  const { list, totalCount, loading } = useSelector(
    (state) => state.contestsList
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchContests({ search, page, limit }));
  }, [search, page]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="contest-container">
      <h2>Contest List</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search contest..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {loading && <p>Loading...</p>}

      <table className="contest-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>Start time</th>
            <th>Detail</th>
          </tr>
        </thead>

        <tbody>
          {list.map((c) => (
            <tr key={c.contest_id}>
              <td>{c.contest_id}</td>
              <td>{c.title}</td>
              <td>{c.contest_type}</td>
              <td>{c.start_time}</td>
              <td>
                <Link to={`/contest/${c.contest_id}`}>
                  <button>View</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="contest-list-action-btn-box">
          <Link to="/contests/create">
          <button className="primary-btn">Create Contest</button>
        </Link>

        {/* Pagination */}
      <div className="contest-pagination-box">
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

        
      </div>

    </div>
  );
}
