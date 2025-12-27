import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Users,
  Search,
  Play,
} from "lucide-react";

import "./gym.css";

export default function Gym() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const debounceRef = useRef(null);

  // MOCK DATA – sau này thay bằng API
  const gyms = [
    {
      contest_id: 1,
      title: "Codeforces Round 900 (Gym)",
      start_time: "2024-06-01 20:00",
      duration: 120,
      contest_status: "ended",
    },
    {
      contest_id: 2,
      title: "ICPC Asia Practice Session",
      start_time: "2024-12-01 09:00",
      duration: 300,
      contest_status: "running",
    },
  ];

  // debounce search input
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

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
      {/* HEADER */}
      <div className="gym-header">
        <div>
          <h1>Gym</h1>
          <p>Practice contests and training sessions</p>
        </div>

        <div className="gym-search">
          <Search size={16} />
          <input
            placeholder="Search gym contests..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="gym-table-card">
        <table className="gym-table">
          <thead>
            <tr>
              <th className="col-title">Contest</th>
              <th className="col-start">Start</th>
              <th className="col-length">Length</th>
              <th className="col-status">Status</th>
              <th className="col-action">Action</th>
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

                <td className="nowrap">
                  <Calendar size={14} />
                  {g.start_time}
                </td>

                <td className="center nowrap">
                  <Clock size={14} />
                  {g.duration} min
                </td>

                <td className="center">
                  {renderStatus(g.contest_status)}
                </td>

                <td className="center">
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
  );
}
