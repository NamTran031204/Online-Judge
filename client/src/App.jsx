import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./layout/public-layout";
import AuthLayout from "./layout/auth-layout";
import MainLayout from "./layout/main-layout";

import ProtectedRoute from "./routes/protected-route";
import GuestRoute from "./routes/guest-route";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
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
          {/* <Route path="/" element={<Dashboard />} /> */}
          <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
