import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchProblemsQuery, useSearchProblemsByTextQuery } from "../../services/problemApi";
import Pagination from "../../components/pagination/pagination";
import { Link } from "react-router-dom";
import { Search, Plus, X } from "lucide-react";
import { mockProblems } from "../../mock/mock-problems";
import "./problems.css";

export default function ProblemList() {
  const [searchText, setSearchText] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const debounceRef = useRef(null);

  const hasKeyword = debouncedKeyword.length > 0;
  const hasTags = tags.length > 0;

  const searchByKeyword = useSearchProblemsByTextQuery(
    {
      maxResultCount: PAGE_SIZE,
      skipCount: (page - 1) * PAGE_SIZE,
      sort: "title asc",
      filter: hasKeyword ? { keyword: debouncedKeyword.trim() } : undefined,
    },
    { skip: !hasKeyword }
  );

  const searchByTag = useSearchProblemsQuery(
    {
      maxResultCount: PAGE_SIZE,
      skipCount: (page - 1) * PAGE_SIZE,
      sort: "title asc",
      filter: hasTags ? { tags: tags } : undefined,
    },
    { skip: hasKeyword }
  );

  const dataSource = hasKeyword ? searchByKeyword : searchByTag;

  const problems = dataSource.data?.data?.data || [];
  const loading = dataSource.isLoading;
  const totalCount = dataSource.data?.data?.totalCount || 0;

  const useMock = !loading && problems.length === 0;
  const displayProblems = useMock ? mockProblems : problems;
  const displayTotalCount = useMock ? mockProblems.length : totalCount;

  useEffect(() => {
    setPage(1);
  }, [tags]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setDebouncedKeyword(searchText.trim());
      setPage(1);
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [searchText]);

  // tag handler
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

      <div className="problem-set-content">
        {/* Table */}
        <div className="problem-main">
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
                  displayProblems.map((p) => (
                    <tr key={p.problemId}>
                      <td className="col-id">{p.problemId}</td>

                      <td className="problem-title-cell">
                        <Link
                          to={`/problem/${p.problemId}`}
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
          <Pagination
            page={page}
            PAGE_SIZE={PAGE_SIZE}
            totalCount={displayTotalCount}
            onPageChange={setPage}
          />
        </div>

        <div className="problem-sidebar">
          {/* Search + Tag bar */}
          <div className="problem-filters vertical">
            {/* Search */}
            <div className="search-input">
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
              {/* Header: Tags + Add tag */}
              <div className="tag-filter-header">
                <span className="tag-title">Tags</span>

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

              {/* Tag list */}
              <div className="tag-list">
                {tags.map((tag) => (
                  <span key={tag} className="tag-chip">
                    {tag}
                    <X size={12} onClick={() => removeTag(tag)} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
