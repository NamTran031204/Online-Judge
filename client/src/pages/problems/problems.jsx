import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchProblems } from "../../redux/slices/problems-list-slice";
import { Link } from "react-router-dom";
import { Search, Plus, X } from "lucide-react";
import "./problems.css";

export default function ProblemList() {
  const dispatch = useDispatch();
  const { problems, totalItems, loading } = useSelector(
    (state) => state.problemsList
  );

  /* =======================
     SEARCH + TAG STATE
     ======================= */
  const [searchText, setSearchText] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debounceRef = useRef(null);

  /* =======================
     DEBOUNCE SEARCH
     ======================= */
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const filter = {};
      if (tags.length > 0) {
        filter.tag = tags;
      }

      dispatch(
        searchProblems({
          page: 1,
          size: pageSize,
          keyword: searchText.trim() || undefined,
          filter,
        })
      );

      setPage(1);
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [searchText, tags, dispatch]);

  /* =======================
     TAG HANDLERS
     ======================= */
  const addTag = () => {
    const value = tagInput.trim();
    if (!value || tags.includes(value)) return;

    setTags((prev) => [...prev, value]);
    setTagInput("");
    setShowTagInput(false);
  };

  const removeTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="problem-page">
      {/* Header */}
      <div className="problem-header">
        <div>
          <h1>Problems</h1>
          <p className="subtitle">
            Practice with our curated collection of algorithmic problems
          </p>
        </div>
      </div>

      {/* Search + Tag bar */}
      <div className="problem-filters compact">
        {/* Search */}
        <div className="search-input compact">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Tags */}
        <div className="tag-filter">
          {tags.map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
              <X size={12} onClick={() => removeTag(tag)} />
            </span>
          ))}

          {showTagInput ? (
            <input
              className="tag-input"
              value={tagInput}
              autoFocus
              placeholder="Enter tag"
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTag();
                if (e.key === "Escape") {
                  setShowTagInput(false);
                  setTagInput("");
                }
              }}
              onBlur={() => {
                setShowTagInput(false);
                setTagInput("");
              }}
            />
          ) : (
            <button
              className="add-tag-btn"
              onClick={() => setShowTagInput(true)}
            >
              <Plus size={14} />
              Add tag
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="problem-table-wrapper">
        <table className="problem-table">
          <thead>
            <tr>
              <th className="col-id">ID</th>
              <th>Title</th>
              <th>Tag</th>
              <th className="col-score">Score</th>
              <th className="col-rating">Rating</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="empty">Loading...</td>
              </tr>
            ) : problems?.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty">No problems found</td>
              </tr>
            ) : (
              problems.map((p) => (
                <tr key={p.problem_id}>
                  <td className="col-id">{p.problem_id}</td>

                  <td className="problem-title-cell">
                    <Link
                      to={`/problem/${p.problem_id}`}
                      className="problem-title"
                    >
                      {p.title}
                    </Link>
                  </td>

                  <td>
                    <div className="tag-list-cell">
                      {p.tags?.map((tag) => (
                        <span key={tag} className="tag primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="col-score">{p.score ?? "--"}</td>
                  <td className="col-rating">
                    {p.rating ? `${p.rating}%` : "--"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={page === i + 1 ? "active" : ""}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
