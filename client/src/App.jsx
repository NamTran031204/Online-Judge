import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthLayout from "./layout/auth-layout";
import MainLayout from "./layout/main-layout";

import Home from "./pages/home/home";
import Auth from "./pages/auth/auth";
import ContestList from "./pages/contest/contest-list";
import ContestDetail from "./pages/contest/contest-detail";
import ContestForm from "./pages/contest/contest-form";
import ProblemList from "./pages/problems/problem-list";
import ProblemDetail from "./pages/problems/problem-detail";
import Profile from "./pages/profile/profile"
import ProblemForm from "./pages/problems/problem-form";
// import Dashboard from "./pages/Dashboard";
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
        <Route element={<AuthLayout />}>
          <Route path="/auth" element={<Auth />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* contests */}
          <Route path="/contests" element={<ContestList />} />
          <Route path="/contests/create" element={<ContestForm />} />
          <Route path="/contest/:contest_id" element={<ContestDetail />} />
          <Route path="/contest/edit/:contest_id" element={<ContestForm editMode={true} />} />

          {/* problems */}
          <Route path="/problems" element={<ProblemList />} />
          <Route path="/problem/:problem_id" element={<ProblemDetail />} />
          <Route path="/problems/create" element={<ProblemForm />} />
          <Route path="/problem/edit/:problem_id" element={<ProblemForm editMode={true} />} />

          {/* profile */}
          <Route path="/profile" element={<Profile />} />

          {/* comments */}
          <Route path="/comments" element={<CommentList />} />

          {/* submissions */}
          <Route path="/submissions" element={<SubmissionList />} />
          <Route path="/submission/:submission_id" element={<SubmissionDetail />} />
          <Route path="/submission/create" element={<SubmissionCreate />} />

          {/* groups */}
          <Route path="/groups" element={<GroupList />} />
          <Route path="/group/:group_id" element={<GroupDetail />} />
          <Route path="/group/create" element={<GroupCreate />} />

          {/* ratings */}
          <Route path="/ratings" element={<RatingList />} />

          <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
