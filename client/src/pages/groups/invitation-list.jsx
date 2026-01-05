import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchGroupInvitations } from "../../redux/slices/groups-slice"; 
import "./invitation-list.css";

export default function ViewInvitationsModal({ group, onClose }) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const limit = 10;
  const group_id = group.group_id;

  // SỬA: Lấy từ state.group vì store.js định nghĩa là "group: groupsReducer"
  const { invitations, invitationsTotal, loading, error } = useSelector(
    (state) => state.group
  );
  
  // SỬA: Dùng invitationsTotal (đúng với định nghĩa trong groups-slice)
  const totalPages = Math.ceil((invitationsTotal || 0) / limit);

  useEffect(() => {
    const searchBody = {
      page: page,
      size: limit,
      filter: {} 
    };
    
    // SỬA: Truyền object có key là 'body' (khớp với asyncThunk trong slice)
    dispatch(searchGroupInvitations({ group_id, body: searchBody }));
  }, [group_id, dispatch, page]);

  return (
    <div className="modal-backdrop"> 
      <div className="modal-content">
        <div className="modal-header">
          <h2>Invitations for Group: {group.group_name} (#{group_id})</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="alert error">{error}</div>}

        <div className="modal-body">
          {loading && page === 1 ? (
            <div className="loading-spinner">
              <p>Loading invitations...</p> 
            </div>
          ) : (
            <>
              <table className="invitations-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Inviter</th>
                    <th>Invitee</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Responded At</th>
                  </tr>
                </thead>

                <tbody>
                  {/* Sử dụng optional chaining hoặc mặc định mảng rỗng để tránh lỗi .length */}
                  {(!invitations || invitations.length === 0) ? (
                    <tr>
                      <td colSpan="6" className="no-data-message">
                        No invitations found.
                      </td>
                    </tr>
                  ) : (
                    invitations.map((inv) => (
                      <tr key={inv.invite_id}> 
                        <td>{inv.invite_id}</td>
                        <td>{inv.inviter_id}</td>
                        <td>{inv.invitee_id}</td>
                        <td>
                          <span className={`status-badge status-${inv.status?.toLowerCase()}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td>{new Date(inv.created_at).toLocaleDateString()}</td>
                        <td>{inv.responded_at ? new Date(inv.responded_at).toLocaleDateString() : "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                  <div className="pagination-box">
                    <button 
                        className={`page-btn ${page === 1 ? "disabled" : ""}`}
                        onClick={() => setPage(p => p - 1)} 
                        disabled={page === 1}
                    >
                        Prev
                    </button>
                    <span className="page-info">
                        Page {page} of {totalPages}
                    </span>
                    <button 
                        className={`page-btn ${page >= totalPages ? "disabled" : ""}`}
                        onClick={() => setPage(p => p + 1)} 
                        disabled={page >= totalPages}
                    >
                        Next
                    </button>
                  </div>
              )}
              {loading && page > 1 && <p className="small-loading">Loading page {page}...</p>}
            </>
          )}
        </div>
        <div className="modal-footer">
          <button className="primary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}