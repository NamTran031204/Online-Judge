import { Link } from "react-router-dom";
import "./home.css";

export default function Home() {
  return (
    <div className="home-container">

      <div className="home-box">
        <h1>Online Judge System</h1>
        <p>Luyện tập thuật toán – Chấm bài tự động – Tham gia contest.</p>

        {/* <div className="home-actions">
          <Link to="/login">
            <button className="btn primary">Đăng nhập</button>
          </Link>
          <Link to="/register">
            <button className="btn secondary">Đăng ký</button>
          </Link>
        </div> */}
      </div>

    </div>
  );
}
