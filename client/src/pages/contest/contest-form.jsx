import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  fetchContestDetail,
  updateContest
} from "../../redux/slices/contest-slice";
import { createContest } from "../../redux/slices/contests-list-slice";
import { useParams, useNavigate } from "react-router-dom";
// import "./contest.css";

export default function ContestForm() {
  const { contest_id } = useParams();
  const editMode = Boolean(contest_id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    start_time: "",
    duration: 120,
    contest_type: "Draft",
    visibility: "PRIVATE",
    group_id: null,
  });

  useEffect(() => {
    if (editMode) {
      dispatch(fetchContestDetail(contest_id)).then((res) => {
        if (res.payload) setForm(res.payload);
      });
    }
  }, [editMode, contest_id]);

  const change = (k, v) => setForm({ ...form, [k]: v });

  const submit = (e) => {
    e.preventDefault();

    if (editMode) {
      dispatch(updateContest({ contest_id, data: form })).then(() =>
        navigate("/contests")
      );
    } else {
      dispatch(createContest(form)).then(() => navigate("/contests"));
    }
  };

  return (
    <div className="contest-container">
      <form className="contest-form" onSubmit={submit}>
        <h2 className="contest-title">{editMode ? "Edit Contest" : "Create Contest"}</h2>

        <label>Title</label>
        <input
          value={form.title}
          onChange={(e) => change("title", e.target.value)}
        />

        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => change("description", e.target.value)}
        />

        <label>Start Time</label>
        <input
          type="datetime-local"
          value={form.start_time}
          onChange={(e) => change("start_time", e.target.value)}
        />

        <label>Duration (minutes)</label>
        <input
          type="number"
          value={form.duration}
          onChange={(e) => change("duration", e.target.value)}
        />

        <label>Type</label>
        <select
          value={form.contest_type}
          onChange={(e) => change("contest_type", e.target.value)}
        >
          <option value="Draft">Draft</option>
          <option value="Official">Official</option>
          <option value="Gym">Gym</option>
        </select>

        <label>Visibility</label>
        <select
          value={form.visibility}
          onChange={(e) => change("visibility", e.target.value)}
        >
          <option value="PUBLIC">Public</option>
          <option value="PRIVATE">Private</option>
        </select>

        <button className="create-btn" type="submit">
          {editMode ? "Update Contest" : "Create Contest"}
        </button>
      </form>
    </div>
  );
}
