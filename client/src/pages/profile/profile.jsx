import { useSelector } from "react-redux";
import "./profile.css";

export default function Profile() {
  const user = useSelector((state) => state.user.user);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-summary">
          <img
            src={user?.avatar || "/assets/default-avatar.png"}
            alt="avatar"
            className="profile-avatar"
          />
          <div className="flex gap-10px">
          <p className="profile-username">{user?.user_name || "User"}</p>
          <p className="profile-email">{user?.email || "email"}</p>
          </div>
          
        </div>

        <div className="profile-info">
          <div className="profile-row">
            <span className="profile-label">Role:</span>
            <span className="profile-value">{user?.role || "user"}</span>
          </div>

          <div className="profile-row">
            <span className="profile-label">Info:</span>
            <span className="profile-value">{user?.info || "—"}</span>
          </div>

          {/* <div className="profile-row">
            <span className="profile-label">Joined:</span>
            <span className="profile-value">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
            </span>
          </div>

          <div className="profile-row">
            <span className="profile-label">Solved Problems:</span>
            <span className="profile-value">{user?.solved || 0}</span>
          </div>

          <div className="profile-row">
            <span className="profile-label">Contests Joined:</span>
            <span className="profile-value">{user?.contests || 0}</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
