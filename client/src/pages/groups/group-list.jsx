import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchGroups } from "../../redux/slices/group-list-slice";
import { Link } from "react-router-dom";
import "./group.css";
import InviteMemberModal from "./group-invite";
import ViewInvitationsModal from "./invitation-list";

// Dữ liệu giả định (Mock Data)
const mockGroups = [
  { group_id: 101, group_name: "Lập trình cơ bản", owner_id: "user_A", member_count: 55 },
  { group_id: 102, group_name: "Thuật toán nâng cao", owner_id: "user_B", member_count: 120 },
  { group_id: 103, group_name: "Thi đấu ICPC", owner_id: "user_C", member_count: 30 },
  { group_id: 104, group_name: "Nhóm luyện đề số 1", owner_id: "user_D", member_count: 88 },
  { group_id: 105, group_name: "Học tập ReactJS", owner_id: "user_E", member_count: 210 },
];

export default function GroupList() {
  const dispatch = useDispatch();
  const { groups: fetchedGroups, totalCount, loading } = useSelector(
    (state) => state.groupList
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isInvitationsModalOpen, setIsInvitationsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const openInviteModal = (group) => {
    setSelectedGroup(group);
    setIsInviteModalOpen(true);
  };

  const openInvitationsModal = (group) => {
    setSelectedGroup(group);
    setIsInvitationsModalOpen(true);
  };

  const closeModal = () => {
    setIsInviteModalOpen(false);
    setIsInvitationsModalOpen(false);
    setSelectedGroup(null);
  };

  useEffect(() => {
    dispatch(searchGroups({ search, page, size: limit }));
  }, [dispatch, search, page]);

  const groupsToDisplay = fetchedGroups.length > 0 || loading
    ? fetchedGroups
    : mockGroups;
    
  const countToUse = fetchedGroups.length > 0 ? totalCount : mockGroups.length;
  const totalPages = Math.ceil(countToUse / limit);

  return (
    <div className="group-container">
      <h2>Groups</h2>

      <div className="group-header-actions">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search group..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <Link to="/group/create">
          <button className="btn create-btn">New Group</button>
        </Link>
      </div>

      {loading && <p>Loading...</p>}

      <table className="group-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Owner</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {groupsToDisplay.map((g) => (
            <tr key={g.group_id}>
              <td>{g.group_id}</td>
              <td>{g.group_name}</td>
              <td>{g.owner_id}</td>
              <td className="action-cell">
                <Link to={`/group/${g.group_id}`}>
                  <button className="btn view-btn small-btn">View</button>
                </Link>

                <button
                  className="btn invite-btn small-btn"
                  onClick={() => openInviteModal(g)}
                >
                  Invite
                </button>

                <button
                  className="btn invitation-btn small-btn"
                  onClick={() => openInvitationsModal(g)}
                >
                  Invitations
                </button>
              </td>
            </tr>
          ))}
          {!loading && groupsToDisplay.length === 0 && (
            <tr>
              <td colSpan="4" className="no-data-message">Không tìm thấy nhóm nào.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="group-list-action-btn-box">
        {groupsToDisplay.length > 0 && (
          <div className="group-pagination-box">
            <button
              className={`page-btn ${page === 1 ? "disabled" : ""}`}
              onClick={() => page > 1 && setPage(page - 1)}
              disabled={page === 1}
            >
              Prev
            </button>

            {totalPages > 1 && Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`page-btn ${page === i + 1 ? "active" : ""}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className={`page-btn ${page >= totalPages ? "disabled" : ""}`}
              onClick={() => page < totalPages && setPage(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {isInviteModalOpen && selectedGroup && (
        <InviteMemberModal
          group={selectedGroup}
          onClose={closeModal}
        />
      )}
      {isInvitationsModalOpen && selectedGroup && (
        <ViewInvitationsModal group={selectedGroup} onClose={closeModal} />
      )}
    </div>
  );
}
