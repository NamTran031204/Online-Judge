import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchGroupDetail, 
  searchGroupMembers, 
  clearGroupDetail 
} from "../../redux/slices/groups-slice";
import { 
  Users, 
  UserPlus, 
  Mail, 
  ArrowLeft, 
  ShieldCheck, 
  User, 
  Calendar 
} from "lucide-react";
import InviteMemberModal from "./group-invite"; 
import ViewInvitationsModal from "./invitation-list"; 
import "./group-detail.css";

export default function GroupDetail() {
  const { group_id } = useParams();
  const dispatch = useDispatch();
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isViewInvitesOpen, setIsViewInvitesOpen] = useState(false);

  const { detail: group, members, loading } = useSelector(
    (state) => state.group
  );

  useEffect(() => {
    dispatch(clearGroupDetail());
    dispatch(fetchGroupDetail(group_id));
    dispatch(searchGroupMembers({ group_id, body: {} }));
  }, [group_id, dispatch]);

  if (loading) return <div className="loading">Loading group data...</div>;
  if (!group) return <div className="loading">Group not found</div>;

  return (
    <div className="group-detail-page">
      {/* Header điều hướng */}
      <div className="group-header-section">
        <div>
          <h1 className="page-title">Group Details</h1>
          <p className="page-subtitle">View information and manage group members</p>
        </div>
        <Link to="/groups" className="btn-back">
          <ArrowLeft size={16} />
          Back to Groups
        </Link>
      </div>

      {/* Card thông tin tổng quan của nhóm */}
      <div className="info-card-container">
        <div className="group-profile-content">
          <div className="group-avatar-wrapper">
            {group.group_image ? (
              <img src={group.group_image} alt="Group" className="group-avatar-img" />
            ) : (
              <div className="group-avatar-fallback">
                <Users size={40} />
              </div>
            )}
          </div>

          <div className="group-info-grid">
            <div className="info-item">
              <span className="info-label">Group name</span>
              <span className="info-value text-highlight">{group.group_name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Group ID</span>
              <span className="info-value">{group.group_id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Owner ID</span>
              <span className="info-value">{group.owner_id}</span>
            </div>
          </div>

          <div className="group-action-buttons">
            <button onClick={() => setIsInviteModalOpen(true)} className="btn-invite">
              <UserPlus size={16} />
              Invite Member
            </button>
            
            {/* Thay đổi Link thành Button để mở Modal */}
            <button 
              onClick={() => setIsViewInvitesOpen(true)} 
              className="btn-view-invites"
              style={{ cursor: 'pointer', border: '1px solid #e2e8f0', background: 'white' }}
            >
              <Mail size={16} />
              View Invitations
            </button>
          </div>
        </div>
      </div>

      {/* Bảng danh sách thành viên */}
      <div className="members-table-section">
        <div className="members-header">
          <Users size={20} />
          <h2>Group Members ({members?.length || 0})</h2>
        </div>

        <div className="table-responsive-wrapper">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Member Info</th>
                <th>Role</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {members && members.length > 0 ? (
                members.map((member) => (
                  <tr key={member.user_id}>
                    <td>
                      <div className="user-info-cell">
                        <div className="user-icon-bg">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="user-name">{member.username || `User #${member.user_id}`}</p>
                          <p className="user-id-sub">ID: {member.user_id}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      {member.user_id === group.owner_id ? (
                        <span className="role-badge badge-owner">
                          <ShieldCheck size={12} />
                          Owner
                        </span>
                      ) : (
                        <span className="role-badge badge-member">Member</span>
                      )}
                    </td>
                    <td>
                      <div className="date-cell">
                        <Calendar size={14} />
                        {member.joined_at ? new Date(member.joined_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="empty-state-cell">
                    <p>No members joined yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      {isInviteModalOpen && (
        <InviteMemberModal 
          group={group} 
          onClose={() => setIsInviteModalOpen(false)} 
        />
      )}

      {isViewInvitesOpen && (
        <ViewInvitationsModal 
          group={group} 
          onClose={() => setIsViewInvitesOpen(false)} 
        />
      )}
    </div>
  );
}