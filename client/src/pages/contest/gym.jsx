import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  Search,
  Filter,
  Play,
} from "lucide-react";

import "./gym.css";

export default function Gym() {
  const [search, setSearch] = useState("");

  // MOCK DATA – sau này thay bằng API
  const gyms = [
    {
      contest_id: 1,
      title: "Codeforces Round 900 (Gym)",
      start_time: "2024-06-01 20:00",
      duration: 120,
      contest_status: "ended",
      rated: false,
    },
    {
      contest_id: 2,
      title: "ICPC Asia Practice Session",
      start_time: "2024-12-01 09:00",
      duration: 300,
      contest_status: "running",
      rated: false,
    },
  ];

  const filtered = gyms.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  const renderStatus = (status) => {
    if (status === "running")
      return <span className="status running">Running</span>;
    if (status === "ended")
      return <span className="status ended">Finished</span>;
    return <span className="status upcoming">Upcoming</span>;
  };

  return (
    <div className="gym-page">
      {/* Header */}
      <div className="gym-header">
        <h1>Gym</h1>
        <p>Practice contests and training sessions</p>
      </div>

      <div className="gym-grid">
        {/* LEFT */}
        <div className="gym-main">
          <div className="gym-table-card">
            <table className="gym-table">
              <thead>
                <tr>
                  <th>Contest</th>
                  <th>Start</th>
                  <th>Length</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty">
                      No gym contests found
                    </td>
                  </tr>
                )}

                {filtered.map((g) => (
                  <tr key={g.contest_id}>
                    <td className="title-cell">
                      <Link
                        to={`/contest/${g.contest_id}`}
                        className="gym-title"
                      >
                        {g.title}
                      </Link>
                      <div className="sub">
                        <Users size={14} /> Practice Mode
                      </div>
                    </td>

                    <td>
                      <Calendar size={14} />
                      {g.start_time}
                    </td>

                    <td>
                      <Clock size={14} />
                      {g.duration} min
                    </td>

                    <td>{renderStatus(g.contest_status)}</td>

                    <td>
                      {g.contest_status === "ended" ? (
                        <Link
                          to={`/gym/${g.contest_id}`}
                          className="btn-outline"
                        >
                          Virtual
                        </Link>
                      ) : (
                        <Link
                          to={`/gym/${g.contest_id}`}
                          className="btn-primary"
                        >
                          <Play size={14} />
                          Enter
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT */}
        <aside className="gym-sidebar">
          <div className="filter-card">
            <h3>
              <Filter size={16} /> Filters
            </h3>

            <div className="filter-group">
              <label>Search</label>
              <div className="search-box">
                <Search size={16} />
                <input
                  placeholder="Search gym contests..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <button className="btn-primary full">
              Apply filters
            </button>
          </div>

          <div className="info-card">
            <Trophy size={18} />
            <p>
              Gym allows you to solve past contests
              without time pressure.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
