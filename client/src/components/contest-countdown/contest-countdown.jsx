import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import "./contest-countdown.css";

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

function formatDuration(ms) {
  if (ms <= 0) return "00:00:00";

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);

  if (days >= 1) {
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  }

  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

export default function ContestCountdown({ startTime, duration, status }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const startMs = new Date(startTime).getTime();

  if (Number.isNaN(startMs)) return null;

  // Upcoming: chỉ đếm khi còn <= 3 tiếng
  if (status === "Upcoming") {
    const diffToStart = startMs - now;
    if (diffToStart <= 0) return null;                 // đã qua giờ start
    if (diffToStart > THREE_HOURS_MS) return null;     // còn xa quá thì không hiện
    return (
      <span className="countdown upcoming">
        <Clock size={14} />
        {formatDuration(diffToStart)}
      </span>
    );
  }

  // Running: luôn đếm tới lúc end
  if (status === "Running") {
    const endMs = startMs + duration * 60 * 1000;
    const diffToEnd = endMs - now;
    if (diffToEnd <= 0) return null; // hết contest rồi
    return (
      <span className="countdown running">
        <Clock size={14} />
        {formatDuration(diffToEnd)}
      </span>
    );
  }

  return null;
}
