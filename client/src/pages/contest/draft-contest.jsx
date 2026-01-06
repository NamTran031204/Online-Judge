import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  FileEdit,
  X,
  Trophy,
  MinusCircle,
  PlusCircle,
  Search,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  useSearchContestsQuery,
  useCreateContestMutation,
  useUpdateContestMutation,
  useDeleteContestMutation,
  useAddProblemToContestMutation,
  useRemoveProblemFromContestMutation,
  usePromoteContestToGymMutation,
} from "../../services/contestApi";

import {
  useSearchProblemsByTextQuery,
  useGetProblemsByContestQuery,
} from "../../services/problemApi";

import "./draft-contest.css";

const PAGE_SIZE = 10;

export default function DraftContest() {
  /* QUERY */
  const { data, isLoading } = useSearchContestsQuery({
    maxResultCount: PAGE_SIZE,
    skipCount: 0,
    sorting: "start_time desc",
    filter: {
      contest_type: "Draft",
    },
  });

  const drafts = data?.data?.data || [];

  const [createContest] = useCreateContestMutation();
  const [updateContest] = useUpdateContestMutation();
  const [deleteContest] = useDeleteContestMutation();
  const [addProblem] = useAddProblemToContestMutation();
  const [removeProblem] = useRemoveProblemFromContestMutation();
  const [promoteToGym] = usePromoteContestToGymMutation();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  /* FORM */
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_time: null,
    duration: 120,
    visibility: "PUBLIC",
    group_id: "",
    problems: [],
  });

  const [showProblemModal, setShowProblemModal] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [triggerSearch, setTriggerSearch] = useState("");

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setTriggerSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timeOutId);
  }, [searchTerm]);

  /* Query Problems */
  const {
    data: problemsData,
    isFetching: isFetchingProblems,
    refetch: refetchProblems
  } = useGetProblemsByContestQuery(
    {
      maxResultCount: PAGE_SIZE,
      skipCount: 0,
      sorting: "title desc",
      filter: {
        contest_id: selectedContest?.contest_id,
      }
    },
    { skip: !selectedContest?.contest_id }
  );

  const currentContestProblems = problemsData?.data?.data || [];
  const currentContestTitle = selectedContest?.title || "";

  const { data: searchProblemData, isFetching: isSearching } = useSearchProblemsByTextQuery(
    { filter: { keyword: triggerSearch }, maxResultCount: 10, skipCount: 0 },
    { skip: !triggerSearch }
  );
  const foundProblems = searchProblemData?.data?.data || [];

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      start_time: null,
      duration: 120,
      visibility: "PUBLIC",
      group_id: "",
      problems: [],
    });
    setEditing(null);
  };

  const formatDateTime = (iso) =>
    new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  /* Actions */
  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (contest) => {
    setEditing(contest);
    setForm({
      title: contest.title,
      description: contest.description || "",
      start_time: new Date(contest.start_time),
      duration: contest.duration,
      visibility: contest.visibility,
      group_id: contest.group_id ?? null,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const payload = {
      title: form.title,
      description: form.description,
      start_time: form.start_time?.toISOString(),
      duration: Number(form.duration),
      contest_type: "Draft",
      visibility: form.visibility,
      group_id: form.group_id ? Number(form.group_id) : null,
      problems: [],
    };

    try {
      if (editing) {
        await updateContest({
          contest_id: editing.contest_id,
          data: payload,
        }).unwrap();
      } else {
        await createContest(payload).unwrap();
      }

      setShowModal(false);
      resetForm();
    } catch (e) {
      console.error(e);
      alert("Save draft failed");
    }
  };

  const handleDelete = async (contest_id) => {
    if (!confirm("Delete this draft contest?")) return;

    try {
      await deleteContest(contest_id).unwrap();
    } catch {
      alert("Delete failed");
    }
  };

  const handlePromote = async (contest_id) => {
    if (!confirm("Promote this contest to Gym? This will make it immutable.")) return;

    try {
      await promoteToGym({ contest_id, data: {} }).unwrap();
    } catch (e) {
      console.error(e);
      alert("Promote failed");
    }
  };

  /* Problems Magagement */
  const openProblemManager = (contest) => {
    setSelectedContest(contest);
    setSearchTerm("");
    setTriggerSearch("");
    setShowProblemModal(true);
  };

  const handleSearchClick = () => {
    setTriggerSearch(searchTerm);
  };

  const handleAddProblemToContest = async (problem) => {
    const exists = currentContestProblems.find(p => p.problem_id === problem.problem_id);
    if (exists) {
      alert("Problem already exists in this contest");
      return;
    }

    try {
      await addProblem({
        contest_id: selectedContest.contest_id,
        data: { problem_id: problem.problem_id },
      }).unwrap();
      refetchProblems();
    } catch (e) {
      console.error(e);
      alert("Failed to add problem");
    }
  };

  const handleRemoveProblemFromContest = async (problem_id) => {
    if (!confirm("Remove this problem from contest?")) return;
    try {
      await removeProblem({
        contest_id: selectedContest.contest_id,
        problem_id: problem_id,
      }).unwrap();
      refetchProblems();
    } catch (e) {
      console.error(e);
      alert("Failed to remove problem");
    }
  };

  return (
    <div className="draft-page">
      {/* HEADER */}
      <div className="draft-header">
        <div>
          <h1>Draft Contests</h1>
          <p>Create and manage draft contests before publishing</p>
        </div>

        <button className="btn-primary" onClick={openCreate}>
          <Plus size={18} />
          Create Draft
        </button>
      </div>

      {/* TABLE */}
      <div className="draft-table-wrapper">
        <table className="draft-table">
          <thead>
            <tr>
              <th className="draft-col-title">Title</th>
              <th className="draft-col-time">Start</th>
              <th className="draft-col-duration">Duration</th>
              <th className="draft-col-problems">Problems</th>
              <th className="draft-col-action">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan="5" className="draft-empty">
                  Loading
                </td>
              </tr>
            )}

            {!isLoading && drafts.length === 0 && (
              <tr>
                <td colSpan="5" className="draft-empty">
                  No draft contests
                </td>
              </tr>
            )}

            {!isLoading &&
              drafts.map((c) => (
                <tr key={c.contest_id}>
                  {/* TITLE + DESCRIPTION */}
                  <td className="draft-title">
                    <strong>{c.title}</strong>
                    <small className="draft-desc">{c.description}</small>
                  </td>

                  {/* START TIME */}
                  <td>
                    <div className="draft-cell">
                      <Calendar size={16} />
                      {formatDateTime(c.start_time)}
                    </div>
                  </td>

                  {/* DURATION */}
                  <td>
                    <div className="draft-cell">
                      <Clock size={16} />
                      {c.duration} min
                    </div>
                  </td>

                  {/* PROBLEMS */}
                  <td>
                    <button
                      className="badge-draft clickable"
                      onClick={() => openProblemManager(c)}
                      title="Manage Problems"
                    >
                      <FileEdit size={14} />
                      {c.problems?.length ?? 0} Problems
                    </button>
                  </td>

                  {/* ACTIONS */}
                  <td className="draft-actions">
                    <div className="draft-cell">
                      <button
                        className="icon-btn"
                        onClick={() => openEdit(c)}
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        className="icon-btn warning"
                        onClick={() => handlePromote(c.contest_id)}
                        title="Promote to Gym"
                      >
                        <Trophy size={18} />
                      </button>

                      <button
                        className="icon-btn danger"
                        onClick={() => handleDelete(c.contest_id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="draft-modal">
            <div className="draft-modal-header">
              <h2>
                {editing ? "Edit Draft Contest" : "Create Draft Contest"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="draft-close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="form-group">
              <label>Title *</label>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Start Time *</label>
              <DatePicker
                selected={form.start_time}
                onChange={(date) =>
                  setForm({ ...form, start_time: date })
                }
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                className="datepicker-input"
              />
            </div>

            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                min={30}
                value={form.duration}
                onChange={(e) =>
                  setForm({
                    ...form,
                    duration: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Visibility</label>
              <select
                value={form.visibility}
                onChange={(e) =>
                  setForm({
                    ...form,
                    visibility: e.target.value,
                  })
                }
                className="draft-select-visiblility"
              >
                <option value="PRIVATE">Private</option>
                <option value="PUBLIC">Public</option>
              </select>
            </div>

            <div className="form-group">
              <label>Group ID</label>
              <input
                type="number"
                value={form.group_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    group_id: e.target.value
                  })
                }
                placeholder="Leave empty if not group contest"
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn-outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSubmit}>
                {editing ? "Save Changes" : "Create Draft"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showProblemModal && (
        <div className="modal-backdrop">
          <div className="draft-modal problem-modal-size">
            <div className="draft-modal-header">
              <h2>Manage Problems: {currentContestTitle}</h2>
              <button onClick={() => setShowProblemModal(false)} className="draft-close">
                <X size={20} />
              </button>
            </div>

            <div className="problem-manager-layout">
              {/* LEFT: CURRENT PROBLEMS */}
              <div className="pm-section current-problems">
                <h3>Current Problems ({currentContestProblems.length})</h3>
                {isFetchingProblems ? <p>Loading...</p> : (
                  <div className="pm-list">
                    {currentContestProblems.length === 0 && <p className="text-muted">No problems added yet.</p>}
                    {currentContestProblems.map((p, index) => (
                      <div key={p.problem_id} className="pm-item">
                        <div className="pm-item-info">
                          <span className="pm-index">#{index + 1}</span>
                          <span className="pm-title">{p.title}</span>
                          <small>({p.problem_code || p.problem_id})</small>
                        </div>
                        <button
                          className="icon-btn danger"
                          onClick={() => handleRemoveProblemFromContest(p.problem_id)}
                          title="Remove from contest"
                        >
                          <MinusCircle size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT: SEARCH & ADD */}
              <div className="pm-section search-problems">
                <h3>Add New Problem</h3>
                <div className="search-box">
                  <input
                    placeholder="Search problem title/code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn-primary">
                    <Search size={16} />
                  </button>
                </div>

                <div className="pm-list search-results">
                  {isSearching && <p>Searching...</p>}
                  {!isSearching && triggerSearch && foundProblems.length === 0 &&
                    <p className="text-muted">No problems found.</p>
                  }

                  {!isSearching && !triggerSearch && (
                    <p className="text-muted">Type to search problems...</p>
                  )}

                  {foundProblems.map(p => {
                    const isAdded = currentContestProblems.some(cp => cp.problem_id === p.problem_id);
                    return (
                      <div key={p.problem_id} className={`pm-item ${isAdded ? 'disabled' : ''}`}>
                        <div className="pm-item-info">
                          <span className="pm-title">{p.title}</span>
                          <small>({p.problem_code})</small>
                        </div>
                        {!isAdded ? (
                          <button
                            className="icon-btn primary"
                            onClick={() => handleAddProblemToContest(p)}
                            title="Add to contest"
                          >
                            <PlusCircle size={18} />
                          </button>
                        ) : (
                          <span className="badge-outline">Added</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
