import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthLayout from "./layout/auth-layout";
import MainLayout from "./layout/main-layout";

import Home from "./pages/home/home";
import Auth from "./pages/auth/auth";
import Contests from "./pages/contest/contests";
import Gym from "./pages/contest/gym";
import ContestDetail from "./pages/contest/contest-detail";
import ContestDashboard from "./pages/contest/contest-dashboard";
import ContestForm from "./pages/contest/contest-form";
import DraftContest from "./pages/contest/draft-contest";
import Problems from "./pages/problems/problems";
import ProblemDetail from "./pages/problems/problem-detail";
import ProblemSandbox from "./pages/problems/problem-sandbox";
import Profile from "./pages/profile/profile"
import ProblemForm from "./pages/problems/problem-form";
import Dashboard from "./pages/dashboard/dashboard";
import SubmissionList from "./pages/submissions/submission-list";
import SubmissionDetail from "./pages/submissions/submission-detail";
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
          <Route path="/contests" element={<Contests />} />
          <Route path="/contest/:contest_id" element={<ContestDetail />} />
          <Route path="/contest/:contest_id/problem/:problem_id" element={<ProblemDetail />} />
          <Route path="/contest/:contest_id/dashboard" element={<ContestDashboard />} />
          <Route path="/gym" element={<Gym />} />
          <Route path="/gym/:contest_id" element={<ContestDetail />} />
          <Route path="/gym/:contest_id/problem/:problem_id" element={<ProblemDetail />} />
          <Route path="/gym/:contest_id/dashboard" element={<ContestDashboard />} />
          <Route path="/drafts" element={<DraftContest />} />

          {/* problems */}
          <Route path="/problems" element={<Problems />} />
          <Route path="/problem/:problem_id" element={<ProblemDetail />} />
          <Route path="/sandbox" element={<ProblemSandbox />} />

          {/* profile */}
          <Route path="/profile" element={<Profile />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* SUBMISSIONS */}
          <Route path="/submissions" element={<SubmissionList />} />
          <Route path="/submission/:submission_id" element={<SubmissionDetail />} />
          {/* <Route path="/submission/create" element={<SubmissionCreate />} /> */}

          {/* groups */}
          <Route path="/groups" element={<GroupList />} />
          <Route path="/group/:group_id" element={<GroupDetail />} />
          <Route path="/group/create" element={<GroupCreate />} />

          {/* ratings */}
          <Route path="/standings" element={<RatingList />} />

          <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
