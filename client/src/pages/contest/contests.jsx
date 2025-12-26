import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContests } from "../../redux/slices/contests-list-slice";
import { Link } from "react-router-dom";
import "./contests.css";

export default function ContestList() {
  const dispatch = useDispatch();
  const { list = [], loading } = useSelector(
    (state) => state.contestsList
  );

  useEffect(() => {
    dispatch(fetchContests({}));
  }, []);

  const upcoming = list.filter(
    (c) =>
      c.contest_status === "upcoming" ||
      c.contest_status === "running"
  );

  const past = list.filter(
    (c) => c.contest_status === "ended"
  );

  const formatTime = (time) =>
    new Date(time).toLocaleString();

  const renderStatus = (status) => {
    if (status === "running")
      return <span className="badge running">Running</span>;
    if (status === "upcoming")
      return <span className="badge upcoming">Before start</span>;
    return <span className="badge ended">Finished</span>;
  };

  const renderAction = (contest) => {
    if (contest.contest_status === "upcoming") {
      return <button className="btn outline">Register</button>;
    }

    if (contest.contest_status === "running") {
      return (
        <button className="btn disabled" disabled>
          Register closed
        </button>
      );
    }

    return <button className="btn outline">Virtual</button>;
  };

  return (
    <div className="contest-page">
      <header className="contest-header">
        <h1>Contests</h1>
        <p>Official programming contests and competitions</p>
      </header>

      {/* CURRENT / UPCOMING */}
      <section className="contest-section">
        <h2>Current or Upcoming Contests</h2>

        <div className="contest-table-wrapper">
          <table className="contest-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Start</th>
                <th>Length</th>
                <th>Status</th>
                <th>Rated</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {upcoming.map((c) => (
                <tr key={c.contest_id}>
                  <td className="contest-name">
                    <Link to={`/contest/${c.contest_id}`}>
                      {c.title}
                    </Link>
                  </td>
                  <td>{formatTime(c.start_time)}</td>
                  <td>{c.duration} min</td>
                  <td>{renderStatus(c.contest_status)}</td>
                  <td>{c.rated ? "Yes" : "No"}</td>
                  <td className="center">
                    {renderAction(c)}
                  </td>
                </tr>
              ))}

              {upcoming.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-row">
                    No upcoming contests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* PAST */}
      <section className="contest-section">
        <h2>Past Contests</h2>

        <div className="contest-table-wrapper">
          <table className="contest-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Start</th>
                <th>Length</th>
                <th>Status</th>
                <th>Rated</th>
                <th>Virtual</th>
              </tr>
            </thead>

            <tbody>
              {past.map((c) => (
                <tr key={c.contest_id}>
                  <td className="contest-name">
                    <Link to={`/contest/${c.contest_id}`}>
                      {c.title}
                    </Link>
                  </td>
                  <td>{formatTime(c.start_time)}</td>
                  <td>{c.duration} min</td>
                  <td>{renderStatus(c.contest_status)}</td>
                  <td>{c.rated ? "Yes" : "No"}</td>
                  <td className="center">
                    <button className="btn outline">Virtual</button>
                  </td>
                </tr>
              ))}

              {past.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-row">
                    No past contests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {loading && <p className="loading">Loading...</p>}
    </div>
  );
}
