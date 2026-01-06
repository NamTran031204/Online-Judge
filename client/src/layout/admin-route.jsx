import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Forbidden from "../pages/error/forbidden";

export default function AdminRoute() {
  const isAuthenticated = useSelector(
    (state) => state.user.isAuthenticated
  );

  const isAdmin = useSelector(
    (state) => state.user?.is_admin
  );

  // chưa đăng nhập → auth
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // không phải admin → home
  if (!isAdmin) {
    // return <Navigate to="/home" replace />;
    return <Navigate to="/403" replace />;
  }

  // OK
  return <Outlet />;
}
