import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./layout/public-layout";
import MainLayout from "./layout/main-layout";

import ProtectedRoute from "./routes/protected-route";
import GuestRoute from "./routes/guest-route";

import Home from "./pages/home"
import CommentList from "./pages/comments/comment-list";
import SubmissionList from "./pages/submissions/submission-list";
import SubmissionDetail from "./pages/submissions/submission-detail";
import SubmissionCreate from "./pages/submissions/submission-create";
import GroupList from "./pages/groups/group-list";
import GroupDetail from "./pages/groups/group-detail";
import GroupCreate from "./pages/groups/group-create";
import RatingList from "./pages/ratings/rating-list"


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME PUBLIC */}
        <Route
          element={
            <GuestRoute>
              <PublicLayout />
            </GuestRoute>
          }
        >
          <Route path="/" element={<Home />} />
        </Route>

        {/* AUTHENTICATED */}
        <Route
          element={
            // <ProtectedRoute>
              <MainLayout />
            // </ProtectedRoute>
          }
        >
          {/* <Route path="/" element={<Home />} /> */}
          {/* COMMENTS */}
          <Route path="/comments" element={<CommentList />} />

          {/* SUBMISSIONS */}
          <Route path="/submissions" element={<SubmissionList />} />
          <Route path="/submission/:submission_id" element={<SubmissionDetail />} />
          <Route path="/submission/create" element={<SubmissionCreate />} />

          {/* GROUPS */}
          <Route path="/groups" element={<GroupList />} />
          <Route path="/group/:group_id" element={<GroupDetail />} />
          <Route path="/group/create" element={<GroupCreate />} />
          
          {/* RATING */}
          <Route path="/ratings" element={<RatingList />} />

          <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;