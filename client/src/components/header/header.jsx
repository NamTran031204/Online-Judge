import "./header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="menu-toggle">
        <img 
          className="menu-icon"
          src='src/assets/menu-icon.png'
          alt='menu icon'
          //onClick={}
        />
      </div>

      <div className="header-title">Online Judge</div>

      <div className="header-right">
        <span className="notification">🔔</span>
        <div className="header-profile">N2</div>
      </div>
    </header>
  );
}
