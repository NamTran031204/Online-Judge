import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  FileEdit,
  X,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

import {
  useSearchContestsQuery,
  useCreateContestMutation,
  useUpdateContestMutation,
  useDeleteContestMutation,
  useAddProblemToContestMutation,
  useRemoveProblemFromContestMutation,
} from "../../services/contestApi";

import { useSearchProblemsByTextQuery, useGetProblemsByContestQuery } from "../../services/problemApi";

import "./draft-contest.css";

const PAGE_SIZE = 50;

export default function DraftContest() {
  const navigate = useNavigate();
  /* QUERY */

  const { data, isLoading } = useSearchContestsQuery({
    maxResultCount: PAGE_SIZE,
    skipCount: 0,
    sorting: "startTime desc",
    filter: {
      contestType: "DRAFT",
    },
  });

  const drafts = data?.data?.data || [];

  const [createContest] = useCreateContestMutation();
  const [updateContest] = useUpdateContestMutation();
  const [deleteContest] = useDeleteContestMutation();
  const [addProblemToContest] = useAddProblemToContestMutation();
  const [removeProblemFromContest] = useRemoveProblemFromContestMutation();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [problemSearch, setProblemSearch] = useState("");
  const [showProblemSearch, setShowProblemSearch] = useState(false);

  const { data: problemsData } = useSearchProblemsByTextQuery(
    {
      searchText: problemSearch,
      maxResultCount: 20,
    },
    { skip: !showProblemSearch || !problemSearch }
  );

  const availableProblems = problemsData?.data?.data || [];

  const { data: existingProblemsData } = useGetProblemsByContestQuery(
    editing ? {
      maxResultCount: 100,
      skipCount: 0,
      filter: { contestId: editing.contestId }
    } : {},
    { skip: !editing }
  );

  const existingProblems = existingProblemsData?.data?.data || [];

  /* FORM */
  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: null,
    duration: 120,
    visibility: "PUBLIC",
    groupId: "",
    problems: [],
  });

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      startTime: null,
      duration: 120,
      visibility: "PUBLIC",
      groupId: "",
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

  /* ACTIONS */

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (contest) => {
    setEditing(contest);
    setForm({
      title: contest.title,
      description: contest.description || "",
      startTime: new Date(contest.startTime),
      duration: contest.duration,
      visibility: contest.visibility,
      groupId: contest.groupId ?? null,
      problems: [], // Don't initialize with existing problems, use the query instead
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const payload = {
      title: form.title,
      description: form.description,
      startTime: form.startTime?.toISOString(),
      duration: Number(form.duration),
      contestType: "DRAFT",
      visibility: form.visibility,
      groupId: form.groupId ? Number(form.groupId) : null,
      // Only include problems for new contests, not for editing
      ...(editing ? {} : { problems: form.problems.map(p => ({ problemId: p.problemId })) }),
    };

    try {
      if (editing) {
          console.log('[EDIT] contest edit =', editing.contestId);

        await updateContest({
          contestId: editing.contestId,
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

  const handleDelete = async (contestId) => {
    if (!confirm("Delete this draft contest?")) return;

    try {
      await deleteContest(contestId).unwrap();
    } catch {
      alert("Delete failed");
    }
  };

  const addProblem = async (problem) => {
    console.log('addProblem called, editing:', editing);
    if (!form.problems.find(p => p.problemId === problem.problemId)) {
      // Add to form state immediately for UI update
      setForm({ ...form, problems: [...form.problems, problem] });

      // If editing existing contest, also call the API
      if (editing) {
        console.log('Calling addProblemToContest API');
        try {
          await addProblemToContest({
            contest_id: editing.contestId,
            problemId: problem.problemId
          }).unwrap();
          console.log('addProblemToContest API call successful');
        } catch (e) {
          console.error('Failed to add problem to contest:', e);
          // Remove from form state if API call failed
          setForm({ ...form, problems: form.problems.filter(p => p.problemId !== problem.problemId) });
          alert('Failed to add problem to contest');
        }
      } else {
        console.log('Not editing, skipping API call');
      }
    }
    setProblemSearch("");
    setShowProblemSearch(false);
  };

  const removeProblem = async (problemId) => {
    // Check if it's a newly added problem
    const isNewlyAdded = form.problems.find(p => p.problemId === problemId);
    
    if (isNewlyAdded) {
      // Just remove from form state
      setForm({ ...form, problems: form.problems.filter(p => p.problemId !== problemId) });
    } else if (editing) {
      // It's an existing problem, call the API
      try {
        await removeProblemFromContest({
          contest_id: editing.contestId,
          problem_id: problemId
        }).unwrap();
        // Note: The query will refetch automatically due to invalidatesTags
      } catch (e) {
        console.error('Failed to remove problem from contest:', e);
        alert('Failed to remove problem from contest');
      }
    }
  };

  const handleProblemClick = (problemId) => {
    navigate(`/problem/${problemId}`);
  };

  /* RENDER */

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
                <tr key={c.contestId}>
                  {/* TITLE + DESCRIPTION */}
                  <td className="draft-title">
                    <strong>{c.title}</strong>
                    <small className="draft-desc">{c.description}</small>
                  </td>

                  {/* START TIME */}
                  <td>
                    <div className="draft-cell">
                      <Calendar size={16} />
                      {formatDateTime(c.startTime)}
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
                  <td className="">
                    <span className="badge-draft">
                      <FileEdit size={14} />
                      {c.problems?.length ?? 0} Problems
                    </span>
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
                        className="icon-btn danger"
                        onClick={() => handleDelete(c.contestId)}
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
                selected={form.startTime}
                onChange={(date) =>
                  setForm({ ...form, startTime: date })
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
                value={form.groupId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    group_id: e.target.value
                  })
                }
                placeholder="Leave empty if not group contest"
              />
            </div>
            <div className="form-group">
              <label>Problems</label>
              <div className="problems-list">
                {[
                  ...(editing ? existingProblems : []),
                  ...form.problems
                ].map((p) => (
                  <div key={p.problemId} className="problem-item">
                    <button
                      type="button"
                      className="problem-title-btn"
                      onClick={() => handleProblemClick(p.problemId)}
                    >
                      {p.title}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProblem(p.problemId)}
                      className="remove-problem-btn"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="add-problem-section">
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={problemSearch}
                  onChange={(e) => {
                    setProblemSearch(e.target.value);
                    setShowProblemSearch(true);
                  }}
                />
                {showProblemSearch && availableProblems.length > 0 && (
                  <div className="problem-search-results">
                    {availableProblems
                      .filter(p => 
                        !form.problems.find(fp => fp.problemId === p.problemId) &&
                        !(editing && existingProblems.find(ep => ep.problemId === p.problemId))
                      )
                      .map((p) => (
                        <div
                          key={p.problemId}
                          className="problem-search-item"
                          onClick={() => addProblem(p)}
                        >
                          {p.title}
                        </div>
                      ))}
                  </div>
                )}
              </div>
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
    </div>
  );
}
