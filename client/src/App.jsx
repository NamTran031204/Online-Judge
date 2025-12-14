import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./layout/public-layout";
import AuthLayout from "./layout/auth-layout";
import MainLayout from "./layout/main-layout";

import ProtectedRoute from "./routes/protected-route";
import GuestRoute from "./routes/guest-route";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import ContestList from "./pages/contest/contest-list";
import ContestDetail from "./pages/contest/contest-detail";
import ContestForm from "./pages/contest/contest-form";
import ProblemList from "./pages/problems/problem-list";
import ProblemDetail from "./pages/problems/problem-detail";
import Profile from "./pages/profile/profile"
import ProblemForm from "./pages/problems/problem-form";
// import Dashboard from "./pages/Dashboard";

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

        {/* LOGIN - REGISTER */}
        <Route
          element={
            <GuestRoute>
              <AuthLayout />
            </GuestRoute>
          }
        >
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* AUTHENTICATED */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* <Route path="/" element={<Home />} /> */}
          {/* LIST CONTESTS */}
          <Route path="/contests" element={<ContestList />} />

          {/* CREATE CONTEST */}
          <Route path="/contests/create" element={<ContestForm />} />

          {/* CONTEST DETAIL */}
          <Route path="/contest/:contest_id" element={<ContestDetail />} />

          {/* UPDATE CONTEST */}
          <Route path="/contest/edit/:contest_id" element={<ContestForm editMode={true} />} />

           {/* PROBLEMS */}
          <Route path="/problems" element={<ProblemList />} />
          <Route path="/problem/:problem_id" element={<ProblemDetail />} />
          <Route path="/problems/create" element={<ProblemForm />} />
          <Route path="/problem/edit/:problem_id" element={<ProblemForm editMode={true} />} />
          
          {/* PROBLEMS */}
          <Route path="/profile" element={<Profile />} />

          <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
