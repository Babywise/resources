import { Link } from "react-router-dom";

import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-container">
      <div className="home-card">
        <img className="home-logo" src="/react.svg" alt="React Logo" />
        <h1 className="home-title">Client-Server Template</h1>
        <p className="home-subtitle">React + TypeScript + Vite</p>

        <div className="home-features">
          <div className="home-feature">
            <span className="home-feature-icon">⚡</span>
            <h3 className="home-feature-title">Vite</h3>
            <p className="home-feature-desc">Lightning fast HMR</p>
          </div>
          <div className="home-feature">
            <span className="home-feature-icon">🎨</span>
            <h3 className="home-feature-title">Tailwind v4</h3>
            <p className="home-feature-desc">Utility-first CSS</p>
          </div>
          <div className="home-feature">
            <span className="home-feature-icon">🧪</span>
            <h3 className="home-feature-title">Vitest</h3>
            <p className="home-feature-desc">Fast unit testing</p>
          </div>
        </div>

        <Link to="/app" className="home-cta">
          Go to App
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
