import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import "./contest-countdown.css";

function formatDuration(ms) {
  if (ms <= 0) return "00:00:00";

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);

  if (days >= 1) {
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  }

  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

export default function ContestCountdown({ startTime, duration, status }) {
  const [now, setNow] = useState(Date.now());
  console.log("PARSED DATE:", new Date(startTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  let targetTime;

  if (status === "upcoming") {
    targetTime = new Date(startTime).getTime();
  }

  if (status === "running") {
    targetTime =
      new Date(startTime).getTime() + duration * 60 * 1000;
  }

  if (!targetTime) return null;

  const diff = targetTime - now;

  if (diff <= 0) return null;

  return (
    <span className={`countdown ${status}`}>
      <Clock size={14} />
      {formatDuration(diff)}
    </span>
  );
}
