import "./header.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Header() {
  const user = useSelector((state) => state.user);

  return (
    <header className="header">

      {/* Nút menu chỉ hiện khi đã login */}
      {user.isLogin && (
        <div className="menu-toggle">
          <img
            className="menu-icon"
            src="src/assets/menu-icon.png"
            alt="menu icon"
            onClick={() => console.log("toggle sidebar")}
          />
        </div>
      )}

      {/* Logo / Title */}
      <Link to="/" className="header-title">
        Online Judge
      </Link>

      <div className="header-right">

        {/* Đã đăng nhập */}
        {user.isLogin ? (
          <>
            <span className="notification-icon">
              <img 
                src="src/assets/ringing.png" 
                width={30}
                height={30}
              />
            </span>
            <div className="user-avatar">
              <img src="src/assets/user.png" alt="user-avatar" className="avatar" />
            </div>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="btn-login">Đăng nhập</button>
            </Link>
            <Link to="/register">
              <button className="btn-register">Đăng ký</button>
            </Link>
          </>
        )}
      </div>
      
    </header>
  );
}