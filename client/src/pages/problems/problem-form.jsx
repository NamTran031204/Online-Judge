import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProblemDetail,
  updateProblem,
} from "../../redux/slices/problem-slice";
import { createProblem } from "../../redux/slices/problems-list-slice";
import "./problems.css";

export default function ProblemForm({ editMode = false }) {
  const { problem_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    problem_id: "",
    author_id: "",
    title: "",
    description: "",
    time_limit: 1000,
    memory_limit: 256,
    tags: [],
    sample: [{ sample_inp: "", sample_out: "" }],
    score: 100,
    rating: 800,
    tutorial: "",
  });

  /* LOAD DETAIL (EDIT MODE) */
  useEffect(() => {
    if (editMode && problem_id) {
      dispatch(getProblemDetail(problem_id)).then((res) => {
        if (res.payload?.data) {
          setForm(res.payload.data);
        }
      });
    }
  }, [editMode, problem_id]);

  /* HELPERS */
  const change = (k, v) => setForm({ ...form, [k]: v });

  const updateSample = (i, k, v) => {
    const next = [...form.sample];
    next[i][k] = v;
    setForm({ ...form, sample: next });
  };

  const addSample = () => {
    setForm({
      ...form,
      sample: [...form.sample, { sample_inp: "", sample_out: "" }],
    });
  };

  const removeSample = (i) => {
    setForm({
      ...form,
      sample: form.sample.filter((_, idx) => idx !== i),
    });
  };

  /* SUBMIT */
  const submit = (e) => {
    e.preventDefault();

    if (editMode) {
      dispatch(updateProblem({ problem_id, body: form })).then(() =>
        navigate("/problems")
      );
    } else {
      dispatch(createProblem(form)).then(() =>
        navigate("/problems")
      );
    }
  };

  return (
    <div className="problem-container">
      <form className="problem-card" onSubmit={submit}>
        <h2>{editMode ? "Edit Problem" : "Create Problem"}</h2>

        {/* CREATE MODE */}
        {!editMode && (
          <>
            <label>Problem ID</label>
            <input
              value={form.problem_id}
              onChange={(e) => change("problem_id", e.target.value)}
              required
            />
          </>
        )}

        <label>Author ID</label>
        <input
          value={form.author_id}
          onChange={(e) => change("author_id", e.target.value)}
          required
        />

        <label>Title</label>
        <input
          value={form.title}
          onChange={(e) => change("title", e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => change("description", e.target.value)}
        />

        <label>Time Limit (ms)</label>
        <input
          type="number"
          value={form.time_limit}
          onChange={(e) => change("time_limit", +e.target.value)}
        />

        <label>Memory Limit (MB)</label>
        <input
          type="number"
          value={form.memory_limit}
          onChange={(e) => change("memory_limit", +e.target.value)}
        />

        <label>Tags (comma separated)</label>
        <input
          value={form.tags.join(",")}
          onChange={(e) =>
            change(
              "tags",
              e.target.value.split(",").map((t) => t.trim())
            )
          }
        />

        <h3>Sample Tests</h3>
        {form.sample.map((s, i) => (
          <div key={i} className="example-box">
            <label>Input</label>
            <textarea
              value={s.sample_inp}
              onChange={(e) =>
                updateSample(i, "sample_inp", e.target.value)
              }
            />

            <label>Output</label>
            <textarea
              value={s.sample_out}
              onChange={(e) =>
                updateSample(i, "sample_out", e.target.value)
              }
            />

            {form.sample.length > 1 && (
              <button
                type="button"
                className="delete-btn"
                onClick={() => removeSample(i)}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addSample}>
          + Add Sample
        </button>

        <label>Score</label>
        <input
          type="number"
          value={form.score}
          onChange={(e) => change("score", +e.target.value)}
        />

        <label>Rating</label>
        <input
          type="number"
          value={form.rating}
          onChange={(e) => change("rating", +e.target.value)}
        />

        <label>Tutorial</label>
        <textarea
          value={form.tutorial}
          onChange={(e) => change("tutorial", e.target.value)}
        />

        <div style={{ marginTop: 15 }}>
          <button type="submit" className="submit-problem-btn">
            {editMode ? "Update Problem" : "Create Problem"}
          </button>
        </div>
      </form>
    </div>
  );
}
