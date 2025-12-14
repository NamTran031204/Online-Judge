import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGroup, createGroupState } from "../../redux/slices/group-list-slice";
import { useNavigate } from "react-router-dom";

import "./group.css";

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

  // Redirect khi tạo xong
  useEffect(() => {
    if (createdGroupId) {
      navigate(`/group/${createdGroupId}`);
      dispatch(createGroupState());
    }
  }, [createdGroupId]);

  return (
    <div className="group-container">
      <form className="group-form" onSubmit={handleSubmit}>
        <h2>Create Group</h2>

        {createError && <div className="gc-error">{createError}</div>}

        <label>Group Name</label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />

        <label>Group Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setGroupImage(e.target.files[0] || null)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Group"}
        </button>
      </form>
    </div>
  );
}