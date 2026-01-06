import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchGroups } from "../../redux/slices/group-list-slice";
import { Link } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import "./group-list.css";
import InviteMemberModal from "./group-invite";
import ViewInvitationsModal from "./invitation-list";

export default function GroupList() {
  const dispatch = useDispatch();
  const { groups: fetchedGroups, totalCount, loading } = useSelector(
    (state) => state.groupList
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const debounceRef = useRef(null);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isInvitationsModalOpen, setIsInvitationsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Debounce Search logic đồng bộ với Problems
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      dispatch(
        searchGroups({
          search: search.trim() || undefined,
          page: 1, // Luôn reset về page 1 khi search
          size: pageSize,
        })
      );
      setPage(1);
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [search, dispatch]);

  // Logic chuyển trang (không debounce)
  useEffect(() => {
    if (page !== 1) {
      dispatch(
        searchGroups({
          search: search.trim() || undefined,
          page: page,
          size: pageSize,
        })
      );
    }
  }, [page, dispatch]);

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

  const totalPages = Math.ceil(totalCount / pageSize);
  const groupsToDisplay = fetchedGroups || [];

  return (
    <div className="problem-page"> {/* Dùng chung class page với problem để đồng bộ layout */}
      <div className="problem-header">
        <div>
          <h1>Groups</h1>
          <p className="subtitle">
            Manage your learning groups and collaborate with other members
          </p>
        </div>
        <Link to="/group/create" className="btn-primary">
          <Plus size={16} style={{ marginRight: "4px" }} />
          New Group
        </Link>
      </div>

      <div className="problem-filters compact">
        <div className="search-input compact">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="problem-table-wrapper">
        <table className="problem-table">
          <thead>
            <tr>
              <th className="col-id">ID</th>
              <th>Group Name</th>
              <th>Owner</th>
              <th style={{ textAlign: "right", paddingRight: "16px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="empty">Loading...</td>
              </tr>
            ) : groupsToDisplay.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty">No groups found</td>
              </tr>
            ) : (
              groupsToDisplay.map((g) => (
                <tr key={g.group_id}>
                  <td className="col-id">
                    <Link to={`/group/${g.group_id}`} className="group-id-link">
                      {g.group_id}
                    </Link>
                  </td>
                  <td className="problem-title-cell">
                    <Link to={`/group/${g.group_id}`} className="problem-title">{g.group_name}</Link>
                  </td>
                  <td>{g.owner_id}</td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn-outline-sm"
                      onClick={() => openInviteModal(g)}
                    >
                      Invite
                    </button>
                    <button
                      className="btn-outline-sm"
                      onClick={() => openInvitationsModal(g)}
                    >
                      Invitations
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              className={page === pageNum ? "active" : ""}
              onClick={() => setPage(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {isInviteModalOpen && selectedGroup && (
        <InviteMemberModal group={selectedGroup} onClose={closeModal} />
      )}
      {isInvitationsModalOpen && selectedGroup && (
        <ViewInvitationsModal group={selectedGroup} onClose={closeModal} />
      )}
    </div>
  );
}