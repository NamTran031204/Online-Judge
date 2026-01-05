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
import { mockContests } from "../../mock/mock-contests";

import "./contests.css";

const PAGE_SIZE = 10;

export default function ContestList() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user);

  const [page, setPage] = useState(1);

  /* QUERY CONTESTS */

  const baseFilter = {
    contest_type: "OFFICIAL",
  };

  const runningQuery = useSearchContestsQuery({
    maxResultCount: PAGE_SIZE,
    skipCount: 0,
    sorting: "startTime asc",
    filter: { ...baseFilter, contestStatus: "RUNNING" },
  });

  const upcomingQuery = useSearchContestsQuery({
    maxResultCount: PAGE_SIZE,
    skipCount: 0,
    sorting: "startTime asc",
    filter: { ...baseFilter, contestStatus: "UPCOMING" },
  });

  const finishedQuery = useSearchContestsQuery({
    maxResultCount: PAGE_SIZE,
    skipCount: (page - 1) * PAGE_SIZE,
    sorting: "startTime desc",
    filter: { ...baseFilter, contestStatus: "FINISHED" },
  });

  const running = runningQuery.data?.data?.data || [];
  const upcoming = upcomingQuery.data?.data?.data || [];
  const finished = finishedQuery.data?.data?.data || [];
  const finishedTotal = finishedQuery.data?.data?.totalCount || 0;

  const useMock = !runningQuery.isLoading && !upcomingQuery.isLoading && !finishedQuery.isLoading &&
                  running.length === 0 && upcoming.length === 0 && finished.length === 0;

  const mockRunning = useMock ? mockContests.filter(c => c.contestStatus === "RUNNING") : [];
  const mockUpcoming = useMock ? mockContests.filter(c => c.contestStatus === "UPCOMING") : [];
  const mockFinished = useMock ? mockContests.filter(c => c.contestStatus === "FINISHED") : [];

  const displayRunning = useMock ? mockRunning : running;
  const displayUpcoming = useMock ? mockUpcoming : upcoming;
  const displayFinished = useMock ? mockFinished : finished;
  const displayFinishedTotal = useMock ? mockFinished.length : finishedTotal;

  const currentAndUpcoming = [...displayRunning, ...displayUpcoming];

  /* REGISTRATION */

  const [registerContest, { isLoading: registering }] = useRegisterContestMutation();

  const registeredCache = useRef(new Map());

  const checkRegistered = (contestId) => {
    if (!currentUser.isAuthenticated) return false;

    if (registeredCache.current.has(contestId)) {
      return registeredCache.current.get(contest_id);
    }

    const res = contestApi.endpoints.searchRegistrations.initiate(
      {
        contestId,
        pageRequest: {
          skipCount: 0,
          maxResultCount: 1,
          filter: { userId: currentUser.accessToken }, // cho vào token
        },
      },
      { forceRefetch: true }
    );

    const result = res.data?.data?.totalCount > 0;
    registeredCache.current.set(contestId, result);

    return result;
  };

  const handleRegister = async (contestId) => {
    if (!currentUser.isAuthenticated) {
      navigate("/auth");
      return;
    }

    try {
      await registerContest(contestId).unwrap();
      registeredCache.current.set(contestId, true);
      alert("Register successful");
    } catch {
      alert("Register failed");
    }
  };

  /* TITLE ONCLICK (ACCESS CONTROL) */
  const handleTitleClick = async (e, contest) => {
    e.preventDefault();

    const { contestId, contestStatus } = contest;

    // UPCOMING
    if (contestStatus === "UPCOMING") {
      alert("Contest has not started yet");
      return;
    }

    // FINISHED
    if (contestStatus === "FINISHED") {
      navigate(`/contest/${contestId}`);
      return;
    }

    // RUNNING
    if (!currentUser.isAuthenticated) {
      alert("You must login to enter this contest");
      return;
    }

    const registered = await checkRegistered(contestId);
    if (!registered) {
      alert("You have not registered for this contest");
      return;
    }

    navigate(`/contest/${contestId}`);
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

  const renderStatus = ({ contestStatus, startTime, duration }) => (
    <div className="status-cell">
      <span className={`badge ${contestStatus.toLowerCase()}`}>
        {contestStatus}
      </span>

      {(contestStatus === "RUNNING" ||
        contestStatus === "UPCOMING") && (
          <ContestCountdown
            startTime={startTime}
            duration={duration}
            status={contestStatus}
          />
        )}
    </div>
  );

  const renderAction = (c) => {
    if (c.contestStatus === "FINISHED") {
      return <button className="btn outline">Virtual</button>;
    }

    if (c.contestStatus === "RUNNING") {
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
        onClick={() => handleRegister(c.contestId)}
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
                <tr key={c.contestId}>
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
                      {formatDateTime(c.startTime)}
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
              {displayFinished.map((c) => (
                <tr key={c.contestId}>
                  <td className="contest-name">
                    <a
                      href={`/contest/${c.contestId}`}
                      className="contest-link"
                    >
                      {c.title}
                    </a>
                  </td>
                  <td>
                    <div className="contest-date-cell">
                      <Calendar size={16} />
                      {formatDateTime(c.startTime)}
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

              {displayFinished.length === 0 && (
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
          totalCount={displayFinishedTotal}
          onPageChange={setPage}
        />
      </section >
    </div >
  );
}