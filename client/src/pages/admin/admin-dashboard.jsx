import React from 'react';
import './admin-dashboard.css';

const AdminDashboard = () => {
  const stats = [
    { label: 'TOTAL USERS', value: '2,540', sub: null },
    { label: 'TOTAL PROBLEMS', value: '1,205', sub: 'Active: 1,180' },
    { label: 'TOTAL CONTESTS', value: '482', sub: 'Active: 2' },
  ];

  const contests = [
    { name: 'Educational Round #120', start: '2023-12-30 20:00', length: '02:00', status: 'Running', rated: 'Yes' },
    { name: 'New Year Contest 2024', start: '2024-01-01 10:00', length: '03:00', status: 'Upcoming', rated: 'Yes' },
    { name: 'Beginner Free Contest', start: '2023-12-25 14:00', length: '02:15', status: 'Ended', rated: 'No' },
  ];

  const problems = [
    { id: '#1001', title: 'Sum of Odd Integers', tags: ['Math', 'Greedy'], rating: 1200, color: '#f39c12' },
    { id: '#1002', title: 'Shortest Path in Grid', tags: ['Graph', 'BFS'], rating: 1500, color: '#e74c3c' },
    { id: '#1003', title: 'Maximum Subarray', tags: ['DP'], rating: 800, color: '#27ae60' },
  ];

  return (
    <div className="problem-page">
      {/* Thẻ Stats Row - Tận dụng các biến màu từ CSS group */}
      <div className="admin-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="problem-table-wrapper stat-card-custom">
            <p className="subtitle" style={{ fontWeight: 'bold', fontSize: '12px' }}>{stat.label}</p>
            <h2 style={{ color: '#2563eb', fontSize: '32px', margin: '10px 0' }}>{stat.value}</h2>
            {stat.sub && (
              <p className="subtitle" style={{ fontSize: '13px' }}>
                {stat.sub.split(':')[0]}: <span style={{ color: '#16a34a', fontWeight: 'bold' }}>{stat.sub.split(':')[1]}</span>
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Recent Contests Table */}
      <div className="problem-header" style={{ marginTop: '40px', marginBottom: '15px' }}>
        <h1>Recent Contests</h1>
      </div>
      <div className="problem-table-wrapper">
        <table className="problem-table">
          <thead>
            <tr>
              <th>NAME</th><th>START</th><th>LENGTH</th><th>STATUS</th><th>RATED</th>
            </tr>
          </thead>
          <tbody>
            {contests.map((c, i) => (
              <tr key={i}>
                <td className="problem-title">{c.name}</td>
                <td>{c.start}</td>
                <td>{c.length}</td>
                <td><span className={`badge-status ${c.status.toLowerCase()}`}>{c.status}</span></td>
                <td>{c.rated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Problems Table */}
      <div className="problem-header" style={{ marginTop: '40px', marginBottom: '15px' }}>
        <h1>Recent Problems</h1>
      </div>
      <div className="problem-table-wrapper">
        <table className="problem-table">
          <thead>
            <tr>
              <th>ID</th><th>TITLE</th><th>TAG</th><th>RATING</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((p, i) => (
              <tr key={i}>
                <td className="group-id-link">{p.id}</td>
                <td className="problem-title">{p.title}</td>
                <td>
                  {p.tags.map(tag => <span key={tag} className="tag-item">{tag}</span>)}
                </td>
                <td style={{ color: p.color, fontWeight: '700' }}>{p.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;