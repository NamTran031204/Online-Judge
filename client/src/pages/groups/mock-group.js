// mock-group.js

// ==========================
// GROUP
// ==========================

export const mockGroups = [
  {
    group_id: 1,
    owner_id: 101,
    group_name: "Frontend Team",
    group_image: "https://picsum.photos/200/200?group=frontend",
  },
  {
    group_id: 2,
    owner_id: 102,
    group_name: "Backend Team",
    group_image: "https://picsum.photos/200/200?group=backend",
  },
  {
    group_id: 3,
    owner_id: 101,
    group_name: "DevOps Team",
    group_image: "https://picsum.photos/200/200?group=devops",
  },
];

// ==========================
// GROUP CREATE
// ==========================

export const mockGroupCreateRequest = {
  group_name: "AI Research Team",
  group_image: "https://picsum.photos/200/200?group=ai",
};

// ==========================
// GROUP DETAIL
// ==========================

export const mockGroupDetails = [
  {
    group_id: 1,
    owner_id: 101,
    group_name: "Frontend Team",
    group_image: "https://picsum.photos/200/200?group=frontend",
  },
  {
    group_id: 2,
    owner_id: 102,
    group_name: "Backend Team",
    group_image: "https://picsum.photos/200/200?group=backend",
  },
  {
    group_id: 3,
    owner_id: 101,
    group_name: "DevOps Team",
    group_image: "https://picsum.photos/200/200?group=devops",
  },
];

// ==========================
// GROUP FILTER
// ==========================

export const mockGroupFilter = {
  owner_id: 101,
};

// ==========================
// GROUP MEMBERS
// ==========================

export const mockGroupMembers = [
  {
    group_id: 1,
    user_id: 101,
    invite_by_user_id: null,
    joined_at: "2025-01-01T08:00:00Z",
  },
  {
    group_id: 1,
    user_id: 102,
    invite_by_user_id: 101,
    joined_at: "2025-01-10T09:30:00Z",
  },
  {
    group_id: 1,
    user_id: 103,
    invite_by_user_id: 101,
    joined_at: "2025-01-12T14:15:00Z",
  },
];

// ==========================
// GROUP MEMBER FILTER
// ==========================

export const mockGroupMemberFilter = {
  user_id: 102,
};

// ==========================
// GROUP INVITE REQUEST
// ==========================

export const mockGroupInviteRequest = {
  invitee_user_id: 104,
};

// ==========================
// GROUP INVITATIONS
// ==========================

export const mockGroupInvitations = [
  {
    invite_id: 5001,
    group_id: 1,
    inviter_id: 101,
    invitee_id: 104,
    status: "PENDING",
    created_at: "2025-01-15T10:00:00Z",
    responded_at: null,
  },
  {
    invite_id: 5002,
    group_id: 1,
    inviter_id: 101,
    invitee_id: 105,
    status: "ACCEPTED",
    created_at: "2025-01-10T08:00:00Z",
    responded_at: "2025-01-10T09:00:00Z",
  },
];


// ==========================
// GROUP INVITATION FILTER
// ==========================

export const mockGroupInvitationFilter = {
  status: "PENDING",
  invitee_id: 104,
};

// ==========================
// PAGINATION MOCK (OPTIONAL)
// ==========================

export const mockGroupPageResult = {
  total: mockGroups.length,
  items: mockGroups.slice(0, 2),
};
