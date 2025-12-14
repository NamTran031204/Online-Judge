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

import { PERMISSION } from "../../types/user";
import { hasPermission, hasAnyPermission, hasAllPermissions } from "../../utils/permission";

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
    <div className="contest-container">
      <h2 className="contest-title">{detail.title}</h2>

      <p className="contest-info"><b>Type:</b> {detail.contest_type}</p>
      <p className="contest-info"><b>Start:</b> {detail.start_time}</p>
      <p className="contest-info"><b>Duration:</b> {detail.duration} minutes</p>
      <p className="contest-info"><b>Description:</b> {detail.description}</p>

      <p className="contest-problems-title">Problems</p>

      <table className="list-table">
        <thead>
          <tr>
            <th>Problem ID</th>
            <th>Title</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {detail.problems.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No problems
              </td>
            </tr>
          )}

          {detail.problems.map((p) => (
            <tr key={p.problem_id}>
              <td>{p.problem_id}</td>
              <td>{p.title}</td>
              <td className="action-cell">
                <Link to={`/problem/${p.problem_id}`}>
                  <button className="view-btn">Solve</button>
                </Link>

                <button
                  className="del-btn"
                  onClick={() => handleRemoveProblem(p.problem_id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>



      {/* Add Problem */}
      <div className="add-problem-box">
        <input
          placeholder="problem_id"
          value={newProblem}
          onChange={(e) => setNewProblem(e.target.value)}
        />
        <button className="create-btn" onClick={handleAddProblem}>Add Problem</button>
      </div>

      {/* Edit + Delete */}
      <div className="action-cell">
        <Link to={`/contest/edit/${contest_id}`}>
          <button className="edit-btn">Edit Contest</button>
        </Link>

        <button className="del-btn" onClick={handleDelete}>
          Delete Contest
        </button>
      </div>
    </div>
  );
}
