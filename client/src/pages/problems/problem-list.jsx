import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchProblems, searchProblemsByText } from "../../redux/slices/problems-list-slice";
import { Link } from "react-router-dom";
import "./problems.css";

export default function ProblemList() {
  const dispatch = useDispatch();
  const { problems, totalItems, loading } = useSelector(
    (state) => state.problemsList
  );

  const [searchInput, setSearchInput] = useState("");   // gõ
  const [searchKeyword, setSearchKeyword] = useState(""); // đã search
  const [isSearching, setIsSearching] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [authorId, setAuthorId] = useState("");
  const [tags, setTags] = useState("");
  const [draftAuthorId, setDraftAuthorId] = useState("");
  const [draftTags, setDraftTags] = useState("");

  // state filter đã apply
  const [filter, setFilter] = useState({});

  const [page, setPage] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    if (isSearching && searchKeyword) {
      // search theo text
      dispatch(
        searchProblemsByText({
          page,
          size: pageSize,
          keyword: searchKeyword
        })
      );
    } else {
      // list + filter 
      // const filter = {};

      // if (authorId) {
      //   filter.author_id = Number(authorId);
      // }

      // if (tags.trim()) {
      //   filter.tag = tags
      //     .split(",")
      //     .map((t) => t.trim())
      //     .filter(Boolean);
      // }

      dispatch(
        searchProblems({
          page,
          size: pageSize,
          filter
        })
      );
    }
  }, [isSearching, searchKeyword, filter, page]);


  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="problem-container">
      <h2 className="problem-title">Problem Set</h2>

      {/* Search Box */}
      <div className="search-box" style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search problem..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setPage(1);
          }}
        />

        <button
          className="view-btn"
          disabled={!searchInput.trim()}
          onClick={() => {
            if (!searchInput.trim()) return;
            setPage(1);
            setSearchKeyword(searchInput.trim());
            setIsSearching(true);
          }}
        >
          Search
        </button>


        <button
          className="edit-btn"
          onClick={() => setShowFilter(!showFilter)}
        >
          Filter
        </button>

        {(isSearching || authorId || tags) && (
          <button
            className="del-btn"
            onClick={() => {
              setSearchInput("");
              setSearchKeyword("");
              setIsSearching(false);
              setDraftAuthorId("");
              setDraftTags("");
              setFilter({});
              setPage(1);
            }}
          >
            Reset
          </button>
        )}
      </div>

      {showFilter && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Filter Problems</h3>

            <div className="modal-body">
              <div className="modal-row">
                <label>Author ID</label>
                <input
                  type="text"
                  placeholder="author_id"
                  value={draftAuthorId}
                  onChange={(e) => setDraftAuthorId(e.target.value)}
                />
              </div>

              <div className="modal-row">
                <label>Tags</label>
                <input
                  type="text"
                  placeholder="dp, graph"
                  value={draftTags}
                  onChange={(e) => setDraftTags(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="create-btn"
                onClick={() => {
                  // setPage(1);
                  // setShowFilter(false);
                  const newFilter = {};

                  if (draftAuthorId) {
                    newFilter.author_id = Number(draftAuthorId);
                  }

                  if (draftTags.trim()) {
                    newFilter.tag = draftTags
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean);
                  }

                  setPage(1);
                  setFilter(newFilter); // 🔥 CHỈ LÚC NÀY MỚI FILTER
                  setShowFilter(false);
                }}
              >
                Apply
              </button>

              <button
                className="del-btn"
                onClick={() => setShowFilter(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <table className="list-table problem-list">
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
