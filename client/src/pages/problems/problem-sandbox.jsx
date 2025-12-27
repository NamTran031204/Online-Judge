import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProblem } from "../../redux/slices/problems-list-slice";
import { updateProblem, deleteProblem } from "../../redux/slices/problem-slice";
import {
  Plus,
  Edit,
  Trash2,
  Link as LinkIcon,
  X,
  FileCode,
  Upload,
} from "lucide-react";
import "./problem-sandbox.css";

const emptyProblem = {
  problem_id: "",
  author_id: "",
  title: "",
  description: "",
  time_limit: 1000,
  memory_limit: 256,
  tags: [],
  sample: [{ sample_inp1: "", sample_out1: "" }],
  system_test: [{ test_id: "t1", system_inp: "", system_out: "" }],
  score: 100,
  solution_text: "",
  solution_file: null,
  tutorial: "",
  rating: 1500,
};

const generateTestId = (tests) => {
  const used = tests.map((t) => Number(t.test_id.replace("t", "")));
  let id = 1;
  while (used.includes(id)) id++;
  return `t${id}`;
};

export default function ProblemSandbox() {
  const dispatch = useDispatch();
  const { problems } = useSelector((state) => state.problemsList);

  const [editing, setEditing] = useState(null);
  const [tagInput, setTagInput] = useState("");

  const openCreate = () =>
    setEditing({ ...emptyProblem, problem_id: `prob-${Date.now()}` });

  const openEdit = (p) => setEditing({ ...p });

  const closeModal = () => {
    setEditing(null);
    setTagInput("");
  };

  const handleSave = () => {
    const formData = new FormData();

    Object.entries(editing).forEach(([key, value]) => {
      if (key === "solution_file") {
        if (value) formData.append("solution", value);
      } else if (Array.isArray(value) || typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    const exists = problems.find((p) => p.problem_id === editing.problem_id);
    exists
      ? dispatch(updateProblem({ id: editing.problem_id, data: formData }))
      : dispatch(createProblem(formData));

    closeModal();
  };

  return (
    <div className="ps-container">
      {/* HEADER */}
      <div className="ps-header">
        <div>
          <h1>Problem Sandbox</h1>
          <p>Create and manage problems for contests</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={16} /> Create Problem
        </button>
      </div>

      {/* EMPTY */}
      {problems.length === 0 && !editing && (
        <div className="ps-empty">
          <FileCode size={56} />
          <h3>No problems yet</h3>
          <button className="btn-outline" onClick={openCreate}>
            <Plus size={16} /> Create Problem
          </button>
        </div>
      )}

      {/* LIST */}
      {problems.length > 0 && (
        <div className="ps-card">
          <h2>Your Problems ({problems.length})</h2>
          <table className="ps-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>ID</th>
                <th>Score</th>
                <th>Rating</th>
                <th>Tests</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {problems.map((p) => (
                <tr key={p.problem_id}>
                  <td className="bold">{p.title}</td>
                  <td className="mono">{p.problem_id}</td>
                  <td>{p.score}</td>
                  <td>{p.rating}</td>
                  <td>{p.system_test.length}</td>
                  <td className="actions">
                    <button onClick={() => openEdit(p)}><Edit size={16} /></button>
                    <button className="danger" onClick={() => dispatch(deleteProblem(p.problem_id))}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {editing && (
        <div className="ps-modal-backdrop">
          <div className="ps-modal">
            <div className="ps-modal-header">
              <h3>{editing.problem_id ? "Edit Problem" : "Create Problem"}</h3>
              <button onClick={closeModal}><X /></button>
            </div>

            <div className="ps-modal-body">
              <label>Title</label>
              <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />

              <label>Description</label>
              <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />

              <div className="grid-2">
                <div className="field">
                  <label>Time Limit (ms)</label>
                  <input
                    type="number"
                    value={editing.time_limit}
                    onChange={(e) =>
                      setEditing({ ...editing, time_limit: +e.target.value })
                    }
                  />
                </div>

                <div className="field">
                  <label>Memory Limit (MB)</label>
                  <input
                    type="number"
                    value={editing.memory_limit}
                    onChange={(e) =>
                      setEditing({ ...editing, memory_limit: +e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="field">
                  <label>Score</label>
                  <input
                    type="number"
                    value={editing.score}
                    onChange={(e) =>
                      setEditing({ ...editing, score: +e.target.value })
                    }
                  />
                </div>

                <div className="field">
                  <label>Rating</label>
                  <input
                    type="number"
                    value={editing.rating}
                    onChange={(e) =>
                      setEditing({ ...editing, rating: +e.target.value })
                    }
                  />
                </div>
              </div>


              {/* TAGS */}
              <label>Tags</label>
              <div className="tag-row">
                <input
                  placeholder="Add tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />
                <button
                  className="btn-outline"
                  onClick={() => {
                    if (!tagInput) return;
                    setEditing({ ...editing, tags: [...editing.tags, tagInput] });
                    setTagInput("");
                  }}
                >
                  Add
                </button>
              </div>

              {editing.tags.length > 0 && (
                <div className="tag-list">
                  {editing.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              )}

              {/* SAMPLE */}
              <div className="section-header">
                <h4>Sample</h4>
                <button
                  className="btn-outline"
                  onClick={() =>
                    setEditing({
                      ...editing,
                      sample: [...editing.sample, { sample_inp1: "", sample_out1: "" }],
                    })
                  }
                >
                  + Add Sample
                </button>
              </div>

              {editing.sample.map((s, i) => (
                <div className="card" key={i}>
                  <div className="grid-2">
                    <textarea placeholder="Input" value={s.sample_inp1}
                      onChange={(e) => {
                        const x = [...editing.sample];
                        x[i].sample_inp1 = e.target.value;
                        setEditing({ ...editing, sample: x });
                      }}
                    />
                    <textarea placeholder="Output" value={s.sample_out1}
                      onChange={(e) => {
                        const x = [...editing.sample];
                        x[i].sample_out1 = e.target.value;
                        setEditing({ ...editing, sample: x });
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* SYSTEM TEST */}
              <div className="section-header">
                <h4>System Test</h4>
                <button
                  className="btn-outline"
                  onClick={() =>
                    setEditing({
                      ...editing,
                      system_test: [
                        ...editing.system_test,
                        { test_id: generateTestId(editing.system_test), system_inp: "", system_out: "" },
                      ],
                    })
                  }
                >
                  + Add Test Case
                </button>
              </div>

              {editing.system_test.map((t, i) => (
                <div className="card" key={t.test_id}>
                  <strong>{t.test_id}</strong>
                  <div className="grid-2">
                    <textarea placeholder="Input" value={t.system_inp}
                      onChange={(e) => {
                        const x = [...editing.system_test];
                        x[i].system_inp = e.target.value;
                        setEditing({ ...editing, system_test: x });
                      }}
                    />
                    <textarea placeholder="Output" value={t.system_out}
                      onChange={(e) => {
                        const x = [...editing.system_test];
                        x[i].system_out = e.target.value;
                        setEditing({ ...editing, system_test: x });
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* SOLUTION */}
              <label>Solution (Text)</label>
              <textarea value={editing.solution_text}
                onChange={(e) => setEditing({ ...editing, solution_text: e.target.value })}
              />

              <label>Or Upload Solution File</label>
              <label className="file-upload">
                <Upload size={16} /> Upload file
                <input type="file" hidden onChange={(e) => setEditing({ ...editing, solution_file: e.target.files[0] })} />
              </label>

              {editing.solution_file && <p className="file-name">{editing.solution_file.name}</p>}

              {/* TUTORIAL */}
              <label>Tutorial</label>
              <textarea value={editing.tutorial}
                onChange={(e) => setEditing({ ...editing, tutorial: e.target.value })}
              />
            </div>

            <div className="ps-modal-footer">
              <button className="btn-outline" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
