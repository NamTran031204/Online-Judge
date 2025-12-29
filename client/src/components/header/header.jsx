import { Link, useLocation } from 'react-router-dom';
import { Code2, Menu, X, User, LogOut, Settings, Trophy } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './header.css';

const navLinks = [
  { href: '/problems', label: 'Problems' },
  { href: '/contests', label: 'Contests' },
  { href: '/gym', label: 'Gym' },
  { href: '/standings', label: 'Standings' },
  { href: '/drafts', label: 'Drafts' },
  { href: '/sandbox', label: 'Sandbox' },
  { href: '/groups', label: 'Groups' },
];

export default function Header() {
  const dispatch = useDispatch();
  const { user, isLogin } = useSelector((state) => state.user);
  const location = useLocation();

  const [userDropdownSelected, setUserDropdownSelected] = useState(false);
  const [mobileResponsive, setMobileResponsive] = useState(false);
  const dropdownRef = useRef(null);

  /* close dropdown */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownSelected(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // dispatch(logout());
    setUserDropdownSelected(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-inner">
          {/* left header */}
          <div className="header-left">
            <Link to="/" className="logo">
              <Code2 className="logo-icon" />
              <span className="logo-text">Online Judge</span>
            </Link>

            <nav className="nav">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={
                    location.pathname === link.href
                      ? 'nav-link active'
                      : 'nav-link'
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* right header */}
          <div className="header-right">
            {isLogin ? (
              <>
                <Link to="/submissions" className="submissions-link">
                  My Submissions
                </Link>

                {/* profile dropdown */}
                <div className="profile-wrapper" ref={dropdownRef}>
                  <button
                    className="user"
                    onClick={() => setUserDropdownSelected((v) => !v)}
                  >
                    <div className="avatar">
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="username">
                      {user?.username || 'User'}
                    </span>
                  </button>

                  {userDropdownSelected && (
                    <div className="profile-dropdown">
                      <Link to="/dashboard" className="dropdown-item">
                        <User className="dropdown-icon" /> Dashboard
                      </Link>
                      <Link to={`/profile/${user?.username}`} className="dropdown-item">
                        <Trophy className="dropdown-icon" /> Profile
                      </Link>
                      <Link to="/settings" className="dropdown-item">
                        <Settings className="dropdown-icon" /> Settings
                      </Link>
                      <div className="dropdown-divider" />
                      <button
                        className="dropdown-item logout"
                        onClick={handleLogout}
                      >
                        <LogOut className="dropdown-icon" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/auth" className="login-link">
                  Login
                </Link>
                <Link to="/auth" className="signup-btn">
                  Sign up
                </Link>
              </>
            )}

            {/* Mobile toggle */}
            <button
              className="mobile-toggle"
              onClick={() => setMobileResponsive(!mobileResponsive)}
            >
              {mobileResponsive ? <X className="mobile-icon" /> : <Menu className="mobile-icon" />}
            </button>
          </div>
        </div>
      </div>

      {/* mobile responsive menu */}
      {mobileResponsive && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="mobile-link"
              onClick={() => setMobileResponsive(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="mobile-divider" />

          {isLogin ? (
            <>
              <Link
                to="/submissions"
                className="mobile-link"
                onClick={() => setMobileResponsive(false)}
              >
                My Submissions
              </Link>
              <button className="mobile-link logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="mobile-link login"
              onClick={() => setMobileResponsive(false)}
            >
              Login in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
