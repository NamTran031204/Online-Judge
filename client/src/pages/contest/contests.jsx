import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Search, Calendar, Clock } from "lucide-react";

import ContestCountdown from "../../components/contest-countdown/contest-countdown";
import Pagination from "../../components/pagination/pagination";

import {
  useSearchContestsQuery,
  useRegisterContestMutation,
  useSearchRegistrationsQuery,
} from "../../services/contestApi";
import { contestApi } from "../../services/contestApi";


import "./contests.css";

const PAGE_SIZE = 10;

export default function ContestList() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user);

  const [page, setPage] = useState(1);

  /* QUERY CONTESTS */

  const baseFilter = {
    contest_type: "Official",
  };

  const runningQuery = useSearchContestsQuery({
    maxResultCount: PAGE_SIZE,
    skipCount: 0,
    sorting: "start_time asc",
    filter: { ...baseFilter, contest_status: "Running" },
  });

  const upcomingQuery = useSearchContestsQuery({
    maxResultCount: PAGE_SIZE,
    skipCount: 0,
    sorting: "start_time asc",
    filter: { ...baseFilter, contest_status: "Upcoming" },
  });

  const finishedQuery = useSearchContestsQuery({
    maxResultCount: PAGE_SIZE,
    skipCount: (page - 1) * PAGE_SIZE,
    sorting: "start_time desc",
    filter: { ...baseFilter, contest_status: "Finished" },
  });

  const running = runningQuery.data?.data?.data || [];
  const upcoming = upcomingQuery.data?.data?.data || [];
  const finished = finishedQuery.data?.data?.data || [];
  const finishedTotal = finishedQuery.data?.data?.totalCount || 0;

  const currentAndUpcoming = [...running, ...upcoming];

  /* REGISTRATION */

  const [registerContest, { isLoading: registering }] = useRegisterContestMutation();

  const registeredCache = useRef(new Map());

  const checkRegistered = (contest_id) => {
    if (!currentUser.isAuthenticated) return false;

    if (registeredCache.current.has(contest_id)) {
      return registeredCache.current.get(contest_id);
    }

    const res = contestApi.endpoints.searchRegistrations.initiate(
      {
        contest_id,
        pageRequest: {
          skipCount: 0,
          maxResultCount: 1,
          filter: { user_id: currentUser.accessToken },
        },
      },
      { forceRefetch: true }
    );

    const result = res.data?.data?.totalCount > 0;
    registeredCache.current.set(contest_id, result);

    return result;
  };

  const handleRegister = async (contest_id) => {
    if (!currentUser.isAuthenticated) {
      navigate("/auth");
      return;
    }

    try {
      await registerContest(contest_id).unwrap();
      registeredCache.current.set(contest_id, true);
      alert("Register successful");
    } catch {
      alert("Register failed");
    }
  };

  /* TITLE ONCLICK (ACCESS CONTROL) */
  const handleTitleClick = async (e, contest) => {
    e.preventDefault();

    const { contest_id, contest_status } = contest;

    // UPCOMING
    if (contest_status === "Upcoming") {
      alert("Contest has not started yet");
      return;
    }

    // FINISHED
    if (contest_status === "Finished") {
      navigate(`/contest/${contest_id}`);
      return;
    }

    // RUNNING
    if (!currentUser.isAuthenticated) {
      alert("You must login to enter this contest");
      return;
    }

    const registered = await checkRegistered(contest_id);
    if (!registered) {
      alert("You have not registered for this contest");
      return;
    }

    navigate(`/contest/${contest_id}`);
  };

  /* HELPERS */
  const formatTime = (time) => new Date(time).toLocaleString();

  const formatDateTime = (iso) =>
    new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const renderStatus = ({ contest_status, start_time, duration }) => (
    <div className="status-cell">
      <span className={`badge ${contest_status.toLowerCase()}`}>
        {contest_status}
      </span>

      {(contest_status === "Running" ||
        contest_status === "Upcoming") && (
          <ContestCountdown
            startTime={start_time}
            duration={duration}
            status={contest_status}
          />
        )}
    </div>
  );

  const renderAction = (c) => {
    if (c.contest_status === "Finished") {
      return <button className="btn outline">Virtual</button>;
    }

    if (c.contest_status === "Running") {
      return (
        <button className="btn disabled" disabled>
          Register closed
        </button>
      );
    }

    return (
      <button
        className="btn outline"
        disabled={registering}
        onClick={() => handleRegister(c.contest_id)}
      >
        Register
      </button>
    );
  };

  /* RENDER */
  return (
    <div className="contest-page">
      <header className="contest-header">
        <div>
          <h1>Contests</h1>
          <p>Official programming contests and competitions</p>
        </div>
      </header>

      {/* RUNNING + UPCOMING */}
      <section className="contest-section">
        <h2>Current or Upcoming Contests</h2>

        <div className="contest-table-wrapper">
          <table className="contest-list-table">
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
              {currentAndUpcoming.map((c) => (
                <tr key={c.contest_id}>
                  <td className="contest-name">
                    <a
                      href="#"
                      className="contest-link"
                      onClick={(e) => handleTitleClick(e, c)}
                    >
                      {c.title}
                    </a>
                  </td>
                  <td>
                    <div className="contest-date-cell">
                      <Calendar size={16} />
                      {formatDateTime(c.start_time)}
                    </div>
                  </td>
                  <td>
                    <div className="contest-date-cell">
                      <Clock size={14} />
                      {c.duration} min
                    </div>
                  </td>
                  <td>{renderStatus(c)}</td>
                  <td>{c.rated ? "Yes" : "No"}</td>
                  <td>{renderAction(c)}</td>
                </tr>
              ))}

              {currentAndUpcoming.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-row">
                    No contests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* FINISHED */}
      <section className="contest-section">
        <h2>Past Contests</h2>

        <div className="contest-table-wrapper">
          <table className="contest-list-table">
            <thead>
              <tr>
                <th className="col-name">Name</th>
                <th className="col-start">Start</th>
                <th className="col-length">Length</th>
                <th className="col-status">Status</th>
                <th className="col-rated">Rated</th>
                {/* <th className="col-action">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {finished.map((c) => (
                <tr key={c.contest_id}>
                  <td className="contest-name">
                    <a
                      href={`/contest/${c.contest_id}`}
                      className="contest-link"
                    >
                      {c.title}
                    </a>
                  </td>
                  <td>
                    <div className="contest-date-cell">
                      <Calendar size={16} />
                      {formatDateTime(c.start_time)}
                    </div>
                  </td>
                  <td>{c.duration} min</td>
                  <td>{renderStatus(c)}</td>
                  <td>{c.rated ? "Yes" : "No"}</td>
                  {/* <td>
                    <button className="btn outline">Virtual</button>
                  </td> */}
                </tr>
              ))}

              {finished.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-row">
                    No past contests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          totalCount={finishedTotal}
          onPageChange={setPage}
        />
      </section >
    </div >
  );
}