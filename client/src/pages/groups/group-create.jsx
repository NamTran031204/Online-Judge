import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGroup, createGroupState } from "../../redux/slices/group-list-slice";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import "./group-create.css";

export default function GroupCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, createError, createdGroupId } = useSelector(
    (state) => state.groupList
  );

  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const formData = new FormData();
    formData.append('group_name', groupName.trim());
    
    if (groupImage) {
        formData.append('group_image', groupImage); 
    }
    
    dispatch(createGroup(formData));
  };

  useEffect(() => {
    if (createdGroupId) {
      navigate(`/group/${createdGroupId}`);
      dispatch(createGroupState());
    }
  }, [createdGroupId, navigate, dispatch]);

  return (
    <div className="problem-page">
      {/* Header đồng bộ với Problem List */}
      <div className="problem-header">
        <div>
          <h1>Create New Group</h1>
          <p className="subtitle">Set up a new space for collaboration and learning</p>
        </div>
        <Link to="/groups" className="btn-back">
          <ArrowLeft size={16} />
          Back to Group
        </Link>
      </div>

      {/* Form Container */}
      <div className="problem-table-wrapper">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            
            {createError && <div className="gc-error">{createError}</div>}

            <div className="form-group">
              <label className="form-label">Group Name</label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter group name..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Group Image</label>
              <div className="file-input-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setGroupImage(e.target.files[0] || null)}
                />
              </div>
              <p className="file-help">Optional: Upload an image to represent your group (PNG, JPG).</p>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-create" disabled={loading}>
                <Save size={18} />
                {loading ? "Creating..." : "Create Group"}
              </button>
              
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={() => navigate("/groups")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}