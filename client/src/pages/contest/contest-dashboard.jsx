import { useParams, Link } from 'react-router-dom';
import {
  Trophy,
  Medal,
  Award,
  ArrowLeft,
  Clock,
  Users,
} from 'lucide-react';

import { useGetContestDetailQuery } from '../../services/contestApi';
import { useGetContestDashboardQuery } from '../../services/contestDashboardApi';

import './contest-dashboard.css';

function RankIcon({ rank }) {
  if (rank === 1) return <Trophy className="rank-icon gold" />;
  if (rank === 2) return <Medal className="rank-icon silver" />;
  if (rank === 3) return <Award className="rank-icon bronze" />;
  return <span className="rank-text">{rank}</span>;
}

export default function ContestDashboard() {
  const { contest_id } = useParams();

  const { data: contestRes } = useGetContestDetailQuery(contest_id);
  const contest = contestRes?.data;

  const { data, isLoading } = useGetContestDashboardQuery({
    contest_id,
    offset: 0,
    limit: 100,
  });

  const rows = data?.data?.items || [];
  const total = data?.data?.total || 0;

  return (
    <div className="contest-standing-page">
      {/* Header */}
      <div className="contest-standing-header">
        <Link to="/contests" className="back-link">
          <ArrowLeft size={16} /> Back to Contests
        </Link>

        <div className="header-main">
          <h1>{contest?.title}</h1>
          <p className="desc">{contest?.description}</p>

          <div className="meta">
            <span>
              <Clock size={14} /> {contest?.duration} minutes
            </span>
            <span>
              <Users size={14} /> {total} participants
            </span>
          </div>
        </div>

        <span className={`status ${contest?.contest_status}`}>
          {contest?.contest_status}
        </span>
      </div>

      {/* Table */}
      <div className="standing-table-wrapper">
        <table className="standing-table">
          <thead>
            <tr>
              <th className="col-rank">#</th>
              <th>User</th>
              <th className="col-score">Score</th>
              <th className="col-penalty">Penalty</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="empty">
                  Loading standings...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty">
                  No data
                </td>
              </tr>
            ) : (
              rows.map((u) => (
                <tr key={u.user_id}>
                  <td className="col-rank">
                    <RankIcon rank={u.rank} />
                  </td>
                  <td className="user-cell">
                    <strong>{u.user_name}</strong>
                  </td>
                  <td className="col-score score">
                    {u.score}
                  </td>
                  <td className="col-penalty">
                    {u.penalty}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
