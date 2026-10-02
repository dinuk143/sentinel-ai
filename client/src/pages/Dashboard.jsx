import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaChartBar,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaHeartbeat,
  FaMapMarkerAlt,
  FaRobot,
  FaCalendarAlt,
  FaImage,
  FaSyncAlt,
  FaArrowRight,
  FaExclamationTriangle,
  FaShieldAlt
} from "react-icons/fa";

import API from "../api/api";
import { getToken } from "../utils/auth";
import MapView from "../components/MapView";

import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_reports: 0,
    pending_reports: 0,
    resolved_reports: 0
  });

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = {
        Authorization: `Bearer ${getToken()}`
      };

      const [statsResponse, reportsResponse] =
        await Promise.all([
          API.get(
            "/reports/dashboard-stats",
            { headers }
          ),

          API.get(
            "/reports/latest",
            { headers }
          )
        ]);

      setStats(
        statsResponse.data || {
          total_reports: 0,
          pending_reports: 0,
          resolved_reports: 0
        }
      );

      setReports(
        Array.isArray(reportsResponse.data)
          ? reportsResponse.data
          : []
      );
    } catch (err) {
      console.error("DASHBOARD ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= IMAGE URL =================

  const getImageUrl = (filePath) => {
    if (!filePath) return null;

    if (
      filePath.startsWith("http://") ||
      filePath.startsWith("https://")
    ) {
      return filePath;
    }

    const normalizedPath =
      filePath.replace(/\\/g, "/");

    const uploadsIndex =
      normalizedPath
        .toLowerCase()
        .lastIndexOf("/uploads/");

    if (uploadsIndex !== -1) {
      const relativePath =
        normalizedPath.substring(
          uploadsIndex + 1
        );

      return `http://localhost:5000/${relativePath}`;
    }

    return `http://localhost:5000/${normalizedPath.replace(
      /^\/+/,
      ""
    )}`;
  };

  // ================= SEVERITY =================

  const getSeverityClass = (severity = "") => {
    const value = severity.toLowerCase();

    if (
      value === "critical" ||
      value === "high"
    ) {
      return "dashboard-severity-critical";
    }

    if (
      value === "medium" ||
      value === "moderate"
    ) {
      return "dashboard-severity-medium";
    }

    if (value === "low") {
      return "dashboard-severity-low";
    }

    return "dashboard-severity-unknown";
  };

  // ================= STATUS =================

  const getStatusClass = (status = "") => {
    if (
      status.toLowerCase() === "resolved"
    ) {
      return "dashboard-status-resolved";
    }

    return "dashboard-status-pending";
  };

  // ================= DATE =================

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-loading">
          <div className="dashboard-loader">
            <FaHeartbeat />
          </div>

          <h2>Loading Command Center</h2>

          <p>
            Retrieving your emergency activity...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">

      <div className="dashboard-glow dashboard-glow-blue" />
      <div className="dashboard-glow dashboard-glow-red" />

      <div className="dashboard-container">

        {/* ================= HEADER ================= */}

        <header className="dashboard-header">

          <div>
            <div className="dashboard-eyebrow">
              <span />
              ACCOUNT OVERVIEW
            </div>

            <div className="dashboard-title-row">

              <div className="dashboard-title-icon">
                <FaChartBar />
              </div>

              <div>
                <h1>
                  Emergency Dashboard
                </h1>

                <p>
                  Monitor your emergency reports,
                  statuses and latest AI-assisted
                  activity.
                </p>
              </div>

            </div>
          </div>

          <button
            type="button"
            className="dashboard-refresh"
            onClick={loadDashboard}
          >
            <FaSyncAlt />
            Refresh Data
          </button>

        </header>

        {/* ================= ERROR ================= */}

        {error && (
          <section className="dashboard-error">

            <FaExclamationTriangle />

            <div>
              <strong>
                Unable to load dashboard
              </strong>

              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={loadDashboard}
            >
              Retry
            </button>

          </section>
        )}

        {/* ================= STATISTICS ================= */}

        <section className="dashboard-stats">

          {/* TOTAL */}

          <article className="dashboard-stat-card stat-total">

            <div className="dashboard-stat-top">

              <div className="dashboard-stat-icon">
                <FaClipboardList />
              </div>

              <span className="dashboard-stat-label">
                ALL REPORTS
              </span>

            </div>

            <div className="dashboard-stat-number">
              {stats.total_reports || 0}
            </div>

            <h3>Total Reports</h3>

            <p>
              Emergency reports submitted by you
            </p>

            <div className="dashboard-stat-line" />

          </article>

          {/* PENDING */}

          <article className="dashboard-stat-card stat-pending">

            <div className="dashboard-stat-top">

              <div className="dashboard-stat-icon">
                <FaClock />
              </div>

              <span className="dashboard-stat-label">
                PENDING
              </span>

            </div>

            <div className="dashboard-stat-number">
              {stats.pending_reports || 0}
            </div>

            <h3>Pending Reports</h3>

            <p>
              Reports currently marked as pending
            </p>

            <div className="dashboard-stat-line" />

          </article>

          {/* RESOLVED */}

          <article className="dashboard-stat-card stat-resolved">

            <div className="dashboard-stat-top">

              <div className="dashboard-stat-icon">
                <FaCheckCircle />
              </div>

              <span className="dashboard-stat-label">
                RESOLVED
              </span>

            </div>

            <div className="dashboard-stat-number">
              {stats.resolved_reports || 0}
            </div>

            <h3>Resolved Reports</h3>

            <p>
              Reports currently marked as resolved
            </p>

            <div className="dashboard-stat-line" />

          </article>

          {/* LATEST */}

          <article className="dashboard-stat-card stat-latest">

            <div className="dashboard-stat-top">

              <div className="dashboard-stat-icon">
                <FaHeartbeat />
              </div>

              <span className="dashboard-stat-label">
                RECENT
              </span>

            </div>

            <div className="dashboard-stat-number">
              {reports.length}
            </div>

            <h3>Latest Activity</h3>

            <p>
              Recent reports shown below
            </p>

            <div className="dashboard-stat-line" />

          </article>

        </section>

        {/* ================= LATEST REPORT HEADER ================= */}

        <section className="dashboard-reports-section">

          <div className="dashboard-section-header">

            <div>

              <span className="dashboard-section-label">
                EMERGENCY ACTIVITY
              </span>

              <h2>
                Latest Emergency Reports
              </h2>

              <p>
                Your most recently submitted SOS reports.
              </p>

            </div>

            <div className="dashboard-section-actions">

              <span className="latest-count">
                {reports.length} RECENT
              </span>

              <button
                type="button"
                className="view-all-button"
                onClick={() =>
                  navigate("/reports")
                }
              >
                View All
                <FaArrowRight />
              </button>

            </div>

          </div>

          {/* ================= NO REPORTS ================= */}

          {!error &&
            reports.length === 0 && (
              <div className="dashboard-empty">

                <div className="dashboard-empty-icon">
                  <FaClipboardList />
                </div>

                <h3>
                  No Emergency Reports
                </h3>

                <p>
                  Your latest SOS reports will
                  appear here after you submit an
                  emergency report.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/sos")
                  }
                >
                  <FaHeartbeat />
                  Open Emergency SOS
                </button>

              </div>
            )}

          {/* ================= REPORT CARDS ================= */}

          <div className="dashboard-report-list">

            {reports.map(
              (report, index) => (
                <article
                  className="dashboard-report-card"
                  key={report.id}
                >

                  {/* IMAGE */}

                  <div className="dashboard-report-image">

                    {report.file_path ? (
                      <img
                        src={getImageUrl(
                          report.file_path
                        )}
                        alt={`Emergency report ${report.id}`}
                      />
                    ) : (
                      <div className="dashboard-no-image">

                        <FaImage />

                        <span>
                          No Image Available
                        </span>

                      </div>
                    )}

                    <div className="report-number">
                      REPORT #
                      {report.id}
                    </div>

                    <div className="report-position">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </div>

                  </div>

                  {/* DETAILS */}

                  <div className="dashboard-report-content">

                    <div className="dashboard-report-heading">

                      <div>

                        <span className="report-type-label">
                          EMERGENCY REPORT
                        </span>

                        <h3>
                          <FaHeartbeat />

                          {report.emergency_type ||
                            "Emergency"}
                        </h3>

                      </div>

                      <div className="report-badges">

                        <span
                          className={`dashboard-status-badge ${getStatusClass(
                            report.status
                          )}`}
                        >
                          {report.status ===
                          "Resolved" ? (
                            <FaCheckCircle />
                          ) : (
                            <FaClock />
                          )}

                          {report.status ||
                            "Pending"}
                        </span>

                        <span
                          className={`dashboard-severity-badge ${getSeverityClass(
                            report.severity
                          )}`}
                        >
                          {report.severity ||
                            "Unknown"}{" "}
                          Severity
                        </span>

                      </div>

                    </div>

                    {/* INFO GRID */}

                    <div className="report-info-grid">

                      <div className="report-info-box">

                        <FaMapMarkerAlt />

                        <div>
                          <span>
                            LOCATION
                          </span>

                          <p>
                            {report.address ||
                              "Location unavailable"}
                          </p>
                        </div>

                      </div>

                      <div className="report-info-box">

                        <FaCalendarAlt />

                        <div>
                          <span>
                            REPORTED
                          </span>

                          <p>
                            {formatDate(
                              report.created_at
                            )}
                          </p>
                        </div>

                      </div>

                    </div>

                    {/* AI GUIDANCE */}

                    <div className="dashboard-ai-guidance">

                      <div className="dashboard-ai-title">

                        <div>
                          <FaRobot />
                        </div>

                        <span>
                          AI EMERGENCY GUIDANCE
                        </span>

                      </div>

                      <p>
                        {report.guidance ||
                          "No AI guidance available."}
                      </p>

                    </div>

                    {/* MAP */}

                    {report.latitude &&
                      report.longitude && (
                        <div className="dashboard-map-section">

                          <div className="dashboard-map-heading">

                            <div>
                              <FaMapMarkerAlt />
                              Emergency Location
                            </div>

                            <a
                              href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open in Maps
                              <FaArrowRight />
                            </a>

                          </div>

                          <div className="dashboard-map-wrapper">

                            <MapView
                              lat={
                                report.latitude
                              }
                              lng={
                                report.longitude
                              }
                            />

                          </div>

                        </div>
                      )}

                    {/* FOOTER */}

                    <div className="dashboard-report-footer">

                      <div>
                        <FaShieldAlt />
                        Sentinel AI Emergency Record
                      </div>

                      <span>
                        #{report.id}
                      </span>

                    </div>

                  </div>

                </article>
              )
            )}

          </div>

        </section>

      </div>
    </main>
  );
}

export default Dashboard;