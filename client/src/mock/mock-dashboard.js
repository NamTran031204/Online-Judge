export const mockDashboardStats = {
  totalProblems: 150,
  solvedProblems: 45,
  totalSubmissions: 320,
  acceptedSubmissions: 280,
  contestParticipations: 12,
  currentRating: 1650,
  maxRating: 1720,
  recentActivity: [
    {
      id: 1,
      type: "submission",
      description: "Solved problem 'Two Sum'",
      timestamp: "2026-01-02T10:30:00Z",
      status: "Accepted",
    },
    {
      id: 2,
      type: "contest",
      description: "Participated in 'Weekly Contest 299'",
      timestamp: "2026-01-01T14:00:00Z",
      status: "Completed",
    },
    {
      id: 3,
      type: "submission",
      description: "Attempted problem 'Add Two Numbers'",
      timestamp: "2025-12-30T16:45:00Z",
      status: "Wrong Answer",
    },
    {
      id: 4,
      type: "achievement",
      description: "Reached 1600 rating milestone",
      timestamp: "2025-12-28T09:15:00Z",
      status: "Achieved",
    },
  ],
};