import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { inviteGroupUser } from "../../redux/slices/groups-slice"; 
import { X } from "lucide-react";
import "./group-invite.css";

export default function InviteMemberModal({ group, onClose }) {
    const [userId, setUserId] = useState("");
    const dispatch = useDispatch();
    
    const { inviteLoading, inviteError } = useSelector((state) => state.group || {});

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
            <div className="modal-content-invite" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-invite">
                    <h3>Invite User to {group.group_name}</h3>
                    <button className="close-icon-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                
                <div className="modal-body-invite">
                    {inviteError && <p className="error-message">{inviteError}</p>}
                    <div className="input-group-invite">
                        <label htmlFor="invite-user-id">User ID to Invite</label>
                        <input
                            id="invite-user-id"
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Enter User ID..."
                            required
                        />
                    </div>
                    
                    <div className="modal-actions-invite">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            className="btn-submit-invite" 
                            onClick={handleInvite} 
                            disabled={inviteLoading || !userId.trim()}
                        >
                            {inviteLoading ? "Sending..." : "Invite"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}