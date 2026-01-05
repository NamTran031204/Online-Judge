import { useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ContestDashboard from "../../pages/dashboard/dashboard"
import CommentList from "../../pages/comments/comment-list"

import {
  ArrowLeft,
  Code,
  Trophy,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import ContestCountdown from "../../components/contest-countdown/contest-countdown";

import {
  useGetContestDetailQuery,
  useSearchRegistrationsQuery,
  useSearchRankingsQuery,
} from "../../services/contestApi";

import { useGetProblemsByContestQuery } from "../../services/problemApi";

import "./contest-detail.css";


export default function ContestDetail() {
  const { contest_id: contestIdParam } = useParams();
  const contest_id = Number(contestIdParam);
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((state) => state.user);

  /* Contest detail */
  const { data: contestRes, isLoading: contestLoading } =
    useGetContestDetailQuery(contest_id);

  const contest = contestRes?.data;

  /* Check registration (only when running) */
  const { data: regRes, isLoading: regLoading } =
    useSearchRegistrationsQuery(
      {
        contest_id,
        pageRequest: {
          maxResultCount: 1,
          skipCount: 0,
          filter: { user_id: currentUser?.accessToken },
        },
      },
      {
        skip: !contest || contest.contestStatus !== "RUNNING",
      }
    );

  const isRegistered = (regRes?.data?.totalCount || 0) > 0;

  /* Problems */
  const { data: problemsRes, isLoading: problemsLoading } =
    useGetProblemsByContestQuery(
      {
        maxResultCount: 10,
        skipCount: 0,
        sorting: "title asc",
        filter: { contestId : contest_id },
      },
      { skip: !contest }
    );

  const problems = problemsRes?.data?.data || [];

  /* Standings preview */
  const { data: rankingRes } = useSearchRankingsQuery(
    {
      contest_id,
      pageRequest: {
        maxResultCount: 3,
        skipCount: 0,
      },
    },
    { skip: !contest }
  );

  const standings = rankingRes?.data?.data || [];

  /* Access control */
  useEffect(() => {
    if (!contest) return;

    if (contest.contestType === "OFFICIAL") {
      if (contest.contestStatus === "UPCOMING") {
        navigate("/contests", { replace: true });
        return;
      }

      if (
        contest.contestStatus === "RUNNING" && !regLoading && !isRegistered
      ) {
        navigate("/contests", { replace: true });
      }
    }
  }, [contest, isRegistered, regLoading, navigate]);

  const renderStatusCountDown = ({ contestStatus, startTime, duration }) => (
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

  const renderStatus = ({ contestStatus, startTime, duration }) => (
    <div className="status-cell">
      <span className={`badge ${contestStatus.toLowerCase()}`}>
        {contestStatus}
      </span>
    </div>
  );

  if (contestLoading || regLoading) {
    return <div className="contest-loading">Loading...</div>;
  }

  if (!contest) return null;

  return (
    <div className="contest-detail-page">
      <Link
        to={contest.contestType === "GYM" ? "/gym" : "/contests"}
        className="contest-back-btn"
      >
        <ArrowLeft size={16} />
        Back to {contest.contestType === "GYM" ? "Gym" : "Contests"}
      </Link>
      {/* Header */}
      <div className="contest-detail-header">
        <div>
          <h1>{contest.title}</h1>
          <p>{contest.description}</p>
        </div>
        <span>
          {renderStatusCountDown(contest)}
        </span>
      </div>

      <div className="contest-detail-layout">
        {/* LEFT */}
        <div className="contest-detail-left">
          {/* Problems */}
          <div className="contest-detail-card">
            <div className="contest-table-title">
              <Code size={20} />
              <div>Problems</div>
            </div>

            <div className="contest-detail-table-wrapper">
              <table className="contest-detail-table">
                <thead>
                  <tr>
                    <th >#</th>
                    <th>Title</th>
                    <th>Score</th>
                    <th>Rating</th>
                    {/* <th>Solved</th> */}
                  </tr>
                </thead>
                <tbody>
                  {problemsLoading && (
                    <tr>
                      <td colSpan="6" className="empty">
                        Loading...
                      </td>
                    </tr>
                  )}

                  {problems.map((p, idx) => (
                    <tr key={p.problemId}>
                      <td>{String.fromCharCode(65 + idx)}</td>
                      <td>
                        <Link
                          to={`/contest/${contest_id}/problem/${p.problemId}`}
                          state={{ from: location.pathname }}
                        >
                          {p.title}
                        </Link>
                      </td>
                      <td>
                        {p.score}
                      </td>
                      <td>{p.rating}</td>
                      {/* <td>-</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* <Link
              to={`/contest/${contest_id}/problems`}
              className="link-more"
            >
              Complete problemset →
            </Link> */}

          {/* Standings */}
          {/* Standing by nhannx but accept phongdt */}

          {/* <div className="contest-detail-card">
            <div className="contest-table-title">
              <Trophy size={20} />
              <div>Standings</div>
            </div>
            <div className="contest-detail-table-wrapper">
              <table className="contest-detail-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Participant</th>
                    <th>Score</th>
                    <th>Penalty</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((u, idx) => (
                    <tr key={u.user_id}>
                      <td>{idx + 1}</td>
                      <td>
                        <strong>{u.user_name}</strong>
                      </td>
                      <td>{u.total_score}</td>
                      <td>{u.penalty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Link
              to={`/contest/${contest_id}/dashboard`}
              className="link-more"
            >
              View full standings →
            </Link>
          </div> */}
          {/* End of standing by nhan */}
          
          <section className="card">
            <h2 className="card-title">
              <Trophy size={18} />
              Dashboard
            </h2>

            {/* {isRunning || isEnded ? ( */}
            {contest.contestStatus === "RUNNING" || contest.contestStatus === "FINISHED" ? (
              <ContestDashboard />
            ) : (
              <div className="standings-placeholder">
                <Clock size={32} />
                <p>Contest has not started</p>
              </div>
            )}
          </section>

          {/* Questions */}
          <section className="card">
            <h2 className="card-title">
              <MessageSquare size={18} />
              Questions & Announcements
            </h2>

            <CommentList sourceId={contest_id} type="CONTEST" />
          </section>
        </div>


        {/* RIGHT */}
        <div className="contest-detail-right">
          <div className="contest-detail-card">
            <h3>{contest.title}</h3>

            <div className="info-row">
              <span>Type</span>
              <b>{contest.contestType}</b>
            </div>

            <div className="info-row">
              <span>Status</span>
              <span>
                {renderStatus(contest)}
              </span>
            </div>

            <div className="info-row">
              <span>Duration</span>
              <b>{contest.duration} minutes</b>
            </div>

            <div className="info-row">
              <span>Start Time</span>
              <b>{contest.startTime}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
