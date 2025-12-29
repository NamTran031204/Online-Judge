import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../redux/slices/dashboard-slice";
import "./dashboard.css";

const POLL_MS = 5000;
const DEFAULT_LIMIT = 20;

//Mock Data
const MOCK_DATA = {
  page: [
    { user_id: 1, rank: 1, user_name: "admin", score: 1000, penalty: 120 },
    { user_id: 2, rank: 2, user_name: "phongdt", score: 850, penalty: 150 },
    { user_id: 3, rank: 3, user_name: "user_test", score: 700, penalty: 200 },
  ],
  friends: [
    { user_id: 2, rank: 5, user_name: "phongdt", score: 850, penalty: 150 },
    { user_id: 4, rank: 12, user_name: "friend_01", score: 600, penalty: 300 },
  ],
  group: [
    { user_id: 5, rank: 1, user_name: "group_member_A", score: 900, penalty: 100 },
    { user_id: 6, rank: 2, user_name: "group_member_B", score: 800, penalty: 110 },
  ]
};

export default function ContestDashboard({ contestId }) {
  const dispatch = useDispatch();
  
  const { items: reduxItems, totalItems: reduxTotal, loading, error } = useSelector(
    (state) => state.dashboard
  );

  const [tab, setTab] = useState("page"); // page | friends | group
  const [page, setPage] = useState(0);
  const [limit] = useState(DEFAULT_LIMIT);
  const [groupId, setGroupId] = useState("");

  const displayItems = useMemo(() => {
    if (reduxItems && reduxItems.length > 0) return reduxItems;
    return MOCK_DATA[tab] || [];
  }, [reduxItems, tab]);

  const displayTotal = reduxTotal > 0 ? reduxTotal : displayItems.length;

  const payload = useMemo(() => {
    return {
      contest_id: contestId,
      mode: tab,
      page,
      size: limit,
      group_id: tab === "group" && groupId ? Number(groupId) : undefined
    };
  }, [contestId, tab, page, limit, groupId]);

  useEffect(() => {
    dispatch(fetchDashboard(payload));

    const t = setInterval(() => {
      dispatch(fetchDashboard(payload));
    }, POLL_MS);

    return () => clearInterval(t);
  }, [dispatch, payload]);

  return (
    <div className="dashboard">

      <div className="dashboard-tabs">
        <button
          className={tab === "page" ? "active" : ""}
          onClick={() => { setTab("page"); setPage(0); }}
        >
          All
        </button>
        <button
          className={tab === "friends" ? "active" : ""}
          onClick={() => { setTab("friends"); setPage(0); }}
        >
          Friends
        </button>
        <button
          className={tab === "group" ? "active" : ""}
          onClick={() => { setTab("group"); setPage(0); }}
        >
          Group
        </button>
      </div>

      {tab === "group" && (
        <div className="dashboard-group">
          <input
            placeholder="group_id (optional)"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          />
          <button onClick={() => setPage(0)}>Apply</button>
        </div>
      )}

      {error && <div className="dashboard-error" style={{color: '#666', fontSize: '12px'}}>
      </div>}

      <table className="dashboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Score</th>
            <th>Penalty</th>
          </tr>
        </thead>
        <tbody>
          {displayItems.length === 0 && !loading && (
            <tr>
              <td colSpan={4} className="empty">No data</td>
            </tr>
          )}

          {displayItems.map((it) => (
            <tr key={it.user_id}>
              <td>{it.rank}</td>
              <td>{it.user_name ?? it.user_id}</td>
              <td>{it.score}</td>
              <td>{it.penalty}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="dashboard-footer">
        <span>Total: {displayTotal}</span>
        <div>
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            Prev
          </button>
          <button
            disabled={(page + 1) * limit >= displayTotal}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}