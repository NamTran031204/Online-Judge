import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function GuestRoute({ children }) {
  const user = useSelector((state) => state.user);

  if (user.isLogin) return <Navigate to="/" replace />;

  return children;
}
