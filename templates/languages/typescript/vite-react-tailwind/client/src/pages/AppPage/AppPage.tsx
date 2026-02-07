import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./AppPage.css";

function AppPage() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Server not connected"));
  }, []);

  return (
    <div className="apppage-container">
      <div className="apppage-card">
        <Link to="/" className="apppage-back">
          ← Back to Home
        </Link>

        <img className="apppage-logo" src="/react.svg" alt="React Logo" />
        <h1 className="apppage-title">App Page</h1>
        <p className="apppage-subtitle">Interactive Demo</p>

        <div className="apppage-section">
          <div className="apppage-panel">
            <p className="apppage-label">Counter</p>
            <p className="apppage-counter">{count}</p>
            <button onClick={() => setCount((c) => c + 1)} className="apppage-button">
              Increment
            </button>
          </div>

          <div className="apppage-panel">
            <p className="apppage-label">Server Status</p>
            <p className="apppage-status">{message || "Loading..."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppPage;
