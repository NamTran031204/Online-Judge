import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContests } from "../../redux/slices/contests-list-slice";
import { Link } from "react-router-dom";
import ContestCountdown from "../../components/contest-countdown/contest-countdown";
import { Search } from "lucide-react";
import "./contests.css";

export default function ContestList() {
  const dispatch = useDispatch();
  const { list = [], loading } = useSelector(
    (state) => state.contestsList
  );

  const [keyword, setKeyword] = useState("");
  const debounceRef = useRef(null);


  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      dispatch(fetchContests({
        keyword: keyword.trim() || undefined,
      }));
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [keyword, dispatch]);


  const upcoming = list.filter(
    (c) =>
      c.contest_status === "upcoming" ||
      c.contest_status === "running"
  );

  const past = list.filter(
    (c) => c.contest_status === "finished"
  );

  const formatTime = (time) =>
    new Date(time).toLocaleString();

  // const renderStatus = (status) => {
  //   if (status === "running")
  //     return <span className="badge running">Running</span>;
  //   if (status === "upcoming")
  //     return <span className="badge upcoming">Before start</span>;
  //   return <span className="badge ended">Finished</span>;
  // };

  const renderStatus = (contest) => {
    if (!contest) return null;
    const { contest_status, start_time, duration } = contest;
    console.log("STATUS DEBUG:", contest.contest_status);
    console.log("START:", contest.start_time);
    console.log("DURATION:", contest.duration);

    return (
      <div className="status-cell">
        {contest_status === "running" && (
          <span className="badge running">Running</span>
        )}

        {contest_status === "upcoming" && (
          <span className="badge upcoming">Upcoming</span>
        )}

        {contest_status === "finished" && (
          <span className="badge ended">Finished</span>
        )}

        {(contest_status === "upcoming" ||
          contest_status === "running") && (
            <ContestCountdown
              startTime={start_time}
              duration={duration}
              status={contest_status}
            />
          )}
      </div>
    );
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
        <div>
          <h1>Contests</h1>
          <p>Official programming contests and competitions</p>
        </div>

        <div className="contest-search">
          <Search size={16} />
          <input
            placeholder="Search contests..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </header>

      {/* CURRENT / UPCOMING */}
      <section className="contest-section">
        <h2>Current or Upcoming Contests</h2>

        <div className="contest-table-wrapper">
          <table className="contest-table">
            <thead>
              <tr>
                <th className="col-name">Name</th>
                <th className="col-start">Start</th>
                <th className="col-length">Length</th>
                <th className="col-status">Status</th>
                <th className="col-rated">Rated</th>
                <th className="col-action">Action</th>
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
                  <td>
                    {renderStatus(c)}
                  </td>
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
                <th className="col-name">Name</th>
                <th className="col-start">Start</th>
                <th className="col-length">Length</th>
                <th className="col-status">Status</th>
                <th className="col-rated">Rated</th>
                <th className="col-action">Action</th>
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
                  <td>{renderStatus(c)}</td>
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
