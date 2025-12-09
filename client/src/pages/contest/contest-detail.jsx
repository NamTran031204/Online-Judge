import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContestDetail,
  addContestProblem,
  removeContestProblem,
  deleteContest
} from "../../redux/slices/contest-slice";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./contest.css";

export default function ContestDetail() {
  const { contest_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { detail, loading } = useSelector((state) => state.contest);

  const [newProblem, setNewProblem] = useState("");

  useEffect(() => {
    dispatch(fetchContestDetail(contest_id));
  }, [contest_id]);

  if (!detail || loading) return <p>Loading...</p>;

  const handleAddProblem = () => {
    if (!newProblem) return alert("Enter problem_id!");
    dispatch(addContestProblem({ contest_id, problem_id: newProblem })).then(
      () => dispatch(fetchContestDetail(contest_id))
    );
    setNewProblem("");
  };

  const handleRemoveProblem = (pid) => {
    dispatch(removeContestProblem({ contest_id, problem_id: pid })).then(() =>
      dispatch(fetchContestDetail(contest_id))
    );
  };

  const handleDelete = () => {
    if (!confirm("Delete this contest?")) return;
    dispatch(deleteContest(contest_id)).then(() => navigate("/contests"));
  };

  return (
    <div className="contest-container detail-card">
      <h2>{detail.title}</h2>

      <p><b>Type:</b> {detail.contest_type}</p>
      <p><b>Start:</b> {detail.start_time}</p>
      <p><b>Duration:</b> {detail.duration} minutes</p>
      <p><b>Description:</b> {detail.description}</p>

      <h3>Problems</h3>
      <ul>
        {detail.problems.map((p) => (
          <li key={p.problem_id}>
            {p.problem_id}
            <button
              className="danger-btn small"
              onClick={() => handleRemoveProblem(p.problem_id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {/* Add Problem */}
      <div className="add-problem-box">
        <input
          placeholder="problem_id"
          value={newProblem}
          onChange={(e) => setNewProblem(e.target.value)}
        />
        <button onClick={handleAddProblem}>Add Problem</button>
      </div>

      {/* Edit + Delete */}
      <div className="action-row">
        <Link to={`/contest/edit/${contest_id}`}>
          <button>Edit Contest</button>
        </Link>

        <button className="danger-btn" onClick={handleDelete}>
          Delete Contest
        </button>
      </div>
    </div>
  );
}
