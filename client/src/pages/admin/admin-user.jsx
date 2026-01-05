import { useState } from "react";
import {
  useSearchUsersQuery,
  useGetUserDetailQuery,
  useDeleteUserMutation,
  useAdjustUserRatingMutation,
  useSetUserRatingMutation,
  useGrantUserRoleMutation,
  useRevokeUserRoleMutation,
} from "../../services/adminApi";
import Pagination from "../../components/pagination/pagination";
import {
  Search,
  Trash2,
  UserStar,
  ShieldUser,
  X,
  Plus,
  Minus,
  ShieldPlus,
  ShieldMinus,
} from "lucide-react";
import "./admin-user.css";

const PAGE_SIZE = 10;

export default function AdminUser() {
  const [page, setPage] = useState(1);
  const [user_name, setUsername] = useState("");
  const [modal, setModal] = useState(null);

  const pageRequest = {
    maxResultCount: PAGE_SIZE,
    skipCount: (page - 1) * PAGE_SIZE,
    sorting: "user_name asc",
    filter: user_name ? { user_name } : {},
  };

  const { data, isLoading } = useSearchUsersQuery(pageRequest);

  const users = data?.data?.data || [];
  const totalCount = data?.data?.totalCount || 0;

  return (
    <div className="admin-user-page">
      <div className="admin-user-page-header">
        <div>
          <h1 className="admin-user-page-title">Users</h1>
          <p className="admin-user-page-subtitle">
            System users and permissions
          </p>
        </div>

        <div className="admin-user-search-box">
          <Search size={16} />
          <input
            placeholder="Search by username"
            value={user_name}
            onChange={(e) => {
              setUsername(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="admin-user-table-card">
        <table className="admin-user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th className="col-action">Action</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="admin-user-table-empty">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="admin-user-table-empty">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.user_id}>
                  <td>{u.user_id}</td>

                  <td>
                    <span
                      className="link"
                      onClick={() => setModal({ user: u, mode: "view" })}
                    >
                      {u.user_name}
                    </span>
                  </td>

                  <td>{u.email}</td>

                  <td>
                    <div className="action-group">
                      <button
                        className="admin-delete-user"
                        title="Delete"
                        onClick={() => setModal({ user: u, mode: "delete" })}
                      >
                        <Trash2 size={16} />
                      </button>

                      <button
                        className="admin-set-rating-user"
                        title="Set rating"
                        onClick={() => setModal({ user: u, mode: "rating" })}
                      >
                        <UserStar size={16} />
                      </button>

                      <button
                        className="admin-grant-user"
                        title="Grant role"
                        onClick={() => setModal({ user: u, mode: "role" })}
                      >
                        <ShieldUser size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      <Pagination
        currentPage={page}
        pageSize={PAGE_SIZE}
        totalCount={totalCount}
        onPageChange={setPage}
      />

      {modal && (
        <UserActionModal
          user={modal.user}
          mode={modal.mode}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}


function UserActionModal({ user, mode, onClose }) {
  const { data, isLoading } = useGetUserDetailQuery(user.user_name);

  const [deleteUser] = useDeleteUserMutation();
  const [adjustUserRating] = useAdjustUserRatingMutation();
  const [setUserRating] = useSetUserRatingMutation();
  const [grantUserRole] = useGrantUserRoleMutation();
  const [revokeUserRole] = useRevokeUserRoleMutation();

  const [delta, setDelta] = useState("");
  const [rating, setRating] = useState("");
  const [reason, setReason] = useState("");
  const [role, setRole] = useState("");
  const [tab, setTab] = useState("adjust");

  if (isLoading) return null;
  const u = data?.data;
  if (!u) return null;

  return (
    <div className="modal-backdrop">
      <div className="user-modal">
        <div className="modal-header">
          <h3>User</h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal: User info */}
        <div className="modal-card">
          <div className="modal-user-detail"><strong>ID:</strong> <div>{u.user_id}</div></div>
          <div className="modal-user-detail"><strong>Username:</strong> <div>{u.user_name}</div></div>
          <div className="modal-user-detail"><strong>Email:</strong> <div>{u.email}</div></div>
          <div>
            <strong>Info:</strong>
            <p className="user-info">
              {JSON.stringify(u.info, null, 2)}
            </p>
          </div>

        </div>

        {/* Modal: Delete */}
        {mode === "delete" && (
          <button
            className="btn-danger"
            onClick={async () => {
              if (!window.confirm("Delete this user?")) return;
              await deleteUser(u.user_id).unwrap();
              onClose();
            }}
          >
            <Trash2 size={16} /> Delete
          </button>
        )}

        {/* Modal: Rating */}
        {mode === "rating" && (
          <div className="modal-card">
            <div className="tab-row">
              <button
                className={tab === "adjust" ? "active" : ""}
                onClick={() => setTab("adjust")}
              >
                Adjust Rating
              </button>
              <button
                className={tab === "set" ? "active" : ""}
                onClick={() => setTab("set")}
              >
                Set Absolute Rating
              </button>
            </div>

            <input
              placeholder={tab === "adjust" ? "Delta" : "Rating"}
              value={tab === "adjust" ? delta : rating}
              onChange={(e) =>
                tab === "adjust"
                  ? setDelta(e.target.value)
                  : setRating(e.target.value)
              }
            />
            <input
              placeholder="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <button
              className="btn-primary"
              onClick={() =>
                tab === "adjust"
                  ? adjustUserRating({
                    user_id: u.user_id,
                    delta: Number(delta),
                    reason,
                  })
                  : setUserRating({
                    user_id: u.user_id,
                    rating: Number(rating),
                    reason,
                  })
              }
            >
              Confirm
            </button>
          </div>
        )}

        {/* Modal: Role */}
        {mode === "role" && (
          <div className="modal-card">
            <input
              placeholder="Role name"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />

            <div className="btn-row">
              <button
                className="btn-primary"
                onClick={() =>
                  grantUserRole({ user_id: u.user_id, role_name: role })
                }
              >
                <ShieldPlus size={16} /> Grant
              </button>
              <button
                className="btn-secondary"
                onClick={() =>
                  revokeUserRole({ user_id: u.user_id, role_name: role })
                }
              >
                <ShieldMinus size={16} /> Revoke
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
