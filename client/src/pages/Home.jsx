import { useNavigate } from "react-router-dom";

import {
  FaHeartbeat,
  FaFirstAid,
  FaArrowRight,
  FaBrain,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaPhoneAlt,
  FaCheckCircle
} from "react-icons/fa";

import "../styles/home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="sentinel-home">

      {/* BACKGROUND */}

      <div className="home-glow home-glow-blue" />
      <div className="home-glow home-glow-red" />

      <div className="home-container">

        {/* HERO */}

        <section className="home-hero">

          <div className="home-status-badge">
            <span className="status-dot" />
            INTELLIGENT EMERGENCY ASSISTANCE
          </div>

          <h1 className="home-title">
            SENTINEL
            <span className="home-title-highlight">
              AI
            </span>
          </h1>

          <p className="home-description">
            AI-assisted emergency guidance designed to help
            you act quickly when every second matters.
          </p>

        </section>

        {/* MAIN ACTIONS */}

        <section className="home-actions">

          {/* SOS */}

          <article className="home-action-card sos-card">

            <div className="action-icon sos-icon">
              <FaHeartbeat />
            </div>

            <div className="action-label">
              EMERGENCY RESPONSE
            </div>

            <h2>Emergency SOS</h2>

            <p>
              Report an emergency with your location and
              image for AI-assisted analysis and immediate
              emergency guidance.
            </p>

            <button
              type="button"
              className="home-action-button sos-button"
              onClick={() => navigate("/sos")}
            >
              <FaHeartbeat />
              START EMERGENCY SOS
              <FaArrowRight />
            </button>

          </article>

          {/* FIRST AID */}

          <article className="home-action-card guide-card">

            <div className="action-icon guide-icon">
              <FaFirstAid />
            </div>

            <div className="action-label">
              EMERGENCY KNOWLEDGE
            </div>

            <h2>First Aid Guide</h2>

            <p>
              Access clear step-by-step first-aid
              instructions for common medical and emergency
              situations.
            </p>

            <button
              type="button"
              className="home-action-button guide-button"
              onClick={() => navigate("/first-aid")}
            >
              <FaFirstAid />
              OPEN FIRST AID GUIDE
              <FaArrowRight />
            </button>

          </article>

        </section>

       {/* SYSTEM CAPABILITIES */}

<section className="home-stats-section">

  <div className="home-stats-heading">
    <span>SYSTEM CAPABILITIES</span>

    <h3>
      Built for faster emergency assistance
    </h3>
  </div>

  <div className="home-stats-grid">

    {/* AI */}

    <div className="home-stat-card stat-ai">

      <div className="stat-icon">
        <FaBrain />
      </div>

      <div className="stat-content">
        <h4>AI-Assisted</h4>
        <p>Emergency image analysis</p>
      </div>

      <span className="stat-status">
        ACTIVE
      </span>

    </div>


    {/* LOCATION */}

    <div className="home-stat-card stat-location">

      <div className="stat-icon">
        <FaMapMarkerAlt />
      </div>

      <div className="stat-content">
        <h4>Location Aware</h4>
        <p>Live location assistance</p>
      </div>

      <span className="stat-status">
        READY
      </span>

    </div>


    {/* SECURITY */}

    <div className="home-stat-card stat-security">

      <div className="stat-icon">
        <FaShieldAlt />
      </div>

      <div className="stat-content">
        <h4>Secure Access</h4>
        <p>JWT authenticated accounts</p>
      </div>

      <span className="stat-status">
        SECURE
      </span>

    </div>


    {/* FAST RESPONSE */}

    <div className="home-stat-card stat-response">

      <div className="stat-icon">
        <FaHeartbeat />
      </div>

      <div className="stat-content">
        <h4>Fast SOS Flow</h4>
        <p>Emergency reporting workflow</p>
      </div>

      <span className="stat-status">
        READY
      </span>

    </div>

  </div>

</section>

        {/* EMERGENCY NOTICE */}

        <section className="emergency-notice">

          <div className="emergency-notice-left">

            <div className="emergency-notice-icon">
              <FaPhoneAlt />
            </div>

            <div>
              <h4>Life-threatening emergency?</h4>

              <p>
                Contact official emergency services
                immediately.
              </p>
            </div>

          </div>

          <a
            href="tel:112"
            className="emergency-call-link"
          >
            <FaPhoneAlt />
            CALL 112
          </a>

        </section>

      </div>
    </main>
  );
}

export default Home;