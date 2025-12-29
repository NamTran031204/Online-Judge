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

import {
  useSearchContestsQuery,
  useCreateContestMutation,
  useUpdateContestMutation,
  useDeleteContestMutation,
} from "../../services/contestApi";

import "./draft-contest.css";

const PAGE_SIZE = 50;

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
    </div>
  );
}
