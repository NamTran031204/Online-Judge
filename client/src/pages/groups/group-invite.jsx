import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { inviteGroupUser } from "../../redux/slices/groups-slice"; 


export default function InviteMemberModal({ group, onClose }) {
    const [userId, setUserId] = useState("");
    const dispatch = useDispatch();
    
    const { inviteLoading, inviteError } = useSelector((state) => state.groups || {});

    const handleInvite = () => {
        if (!userId.trim()) return;

        dispatch(
            inviteGroupUser({
                group_id: group.group_id,
                payload: {
                    invitee_user_id: userId.trim(),
                }
            })
        )
        .then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                onClose(); 
            }
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div 
                className="modal-content" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h3>Invite User to {group.group_name}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <div className="modal-body">
                    <div className="modal-form-container">
                        
                        {inviteError && <p className="gc-error">{inviteError}</p>}

                        <label htmlFor="invite-user-id">User ID to Invite</label>
                        <input
                            id="invite-user-id"
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Enter User ID..."
                            required
                        />
                        
                        {/* Actions */}
                        <div className="modal-actions">
                            <button 
                                className="danger-btn" 
                                onClick={onClose}
                                style={{ marginRight: '10px' }}
                            >
                                Cancel
                            </button>
                            <button 
                                className="primary-btn" 
                                onClick={handleInvite} 
                                disabled={inviteLoading || !userId.trim()}
                            >
                                {inviteLoading ? "Sending..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}