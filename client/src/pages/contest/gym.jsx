import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Users, Play } from "lucide-react";

import { useSearchContestsQuery } from "../../services/contestApi";
import ContestCountdown from "../../components/contest-countdown/contest-countdown";
import Pagination from "../../components/pagination/pagination";

import "./gym.css";

const PAGE_SIZE = 10;

export default function Gym() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSearchContestsQuery({
    maxResultCount: PAGE_SIZE,
    skipCount: (page - 1) * PAGE_SIZE,
    sorting: "start_time desc",
    filter: {
      contest_type: "Gym",
    },
  });

  const gyms = data?.data?.data || [];
  const totalCount = data?.data?.totalCount || 0;

  const formatTime = (t) => new Date(t).toLocaleString();

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

  return (
    <div className="gym-page">
      {/* HEADER */}
      <div className="gym-header">
        <div>
          <h1>Gym</h1>
          <p>Practice contests and training sessions</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="gym-table-card">
        <table className="gym-table">
          <thead>
            <tr>
              <th className="gym-col-title">Contest</th>
              <th className="gym-col-start">Start</th>
              <th className="gym-col-length">Length</th>
              <th className="gym-col-status">Status</th>
              <th className="gym-col-rated">Rated</th>
            </tr>
          </thead>

          <tbody>
            {!isLoading && gyms.length === 0 && (
              <tr>
                <td colSpan="5" className="empty">
                  No gym contests found
                </td>
              </tr>
            )}

            {gyms.map((g) => (
              <tr key={g.contest_id}>
                {/* TITLE */}
                <td className="title-cell">
                  <Link
                    to={`/gym/${g.contest_id}`}
                    className="gym-title"
                  >
                    {g.title}
                  </Link>
                  <div className="sub">
                    <Users size={14} />
                    Practice Mode
                  </div>
                </td>

                {/* START */}
                <td className="nowrap">
                  <div className="gym-date-cell">
                    <Calendar size={16} />
                    {formatDateTime(g.start_time)}
                  </div>
                </td>

                {/* LENGTH */}
                <td className="nowrap">
                  <div className="gym-date-cell">
                    <Clock size={14} />
                    {g.duration} min
                  </div>

                </td>

                {/* STATUS + COUNTDOWN */}
                <td>{renderStatus(g)}</td>

                {/* ACTION */}
                <td className="nowrap">
                  {g.rated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isLoading && <p className="loading">Loading...</p>}
      </div>

      {/* PAGINATION */}
      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        totalCount={totalCount}
        onPageChange={setPage}
      />
    </div>
  );
}
