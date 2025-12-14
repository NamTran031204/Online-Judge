import "./sidebar.css"
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <ul className="sidebar-menu">

        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>

        <li>
          <Link to="/contests">Contests</Link>
        </li>

        <li>
          <Link to="/problems">Problems</Link>
        </li>

        <li>
          <Link to="/groups">Groups</Link>
        </li>

        <li>
          <Link to="/comments">Comments</Link>
        </li>

         <li>
          <Link to="/ratings">Rating</Link>
        </li>

         <li>
          <Link to="/submissions">Submissions</Link>
        </li>

        <li>
          <Link to="/profile">Profile</Link>
        </li>

        <li>
          <Link to="/settings">Setting</Link>
        </li>

        <li>
          <Link to="/logout">Logout</Link>
        </li>

      </ul>
    </aside>
  );
}