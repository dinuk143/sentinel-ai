import { useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  FaShieldAlt,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaHeartbeat,
  FaMapMarkerAlt,
  FaRobot
} from "react-icons/fa";

import toast from "react-hot-toast";

import API from "../api/api";
import { saveToken } from "../utils/auth";

import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (
      !form.email.trim() ||
      !form.password
    ) {
      toast.error(
        "Please enter your email and password."
      );
      return;
    }

    if (!navigator.onLine) {
      toast.error(
        "You are offline. Connect to the internet to sign in."
      );
      return;
    }

    try {
      setLoading(true);

      const res = await API.post(
        "/auth/login",
        {
          ...form,
          email: form.email.trim()
        }
      );

      saveToken(res.data.token);

      toast.success(
        "Login successful!"
      );

      navigate("/home", {
        replace: true
      });
    } catch (err) {
      console.error(
        "LOGIN ERROR:",
        err
      );

      const message =
        !navigator.onLine
          ? "You are offline. Connect to the internet to sign in."
          : err.response?.data?.message ||
            "Unable to sign in. Please check your details and try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-grid-pattern" />
      <div className="auth-glow auth-glow-blue" />
      <div className="auth-glow auth-glow-red" />

      <div className="auth-shell">

        {/* =====================================
            LEFT SIDE
        ====================================== */}

        <section className="auth-brand-panel">

          <div className="auth-brand">

            <div className="auth-brand-icon">
              <FaShieldAlt />
            </div>

            <div>
              <strong>
                SENTINEL AI
              </strong>

              <span>
                EMERGENCY RESPONSE
              </span>
            </div>

          </div>

          <div className="auth-brand-content">

            <div className="auth-eyebrow">
              <span />
              INTELLIGENT EMERGENCY ASSISTANCE
            </div>

            <h1>
              Emergency support.
              <span>
                {" "}When every second matters.
              </span>
            </h1>

            <p>
              Access Sentinel AI to report
              emergencies, receive AI-assisted
              guidance, use live location
              assistance and manage your
              emergency reports securely.
            </p>

            <div className="auth-features">

              <div className="auth-feature">

                <div>
                  <FaRobot />
                </div>

                <span>
                  <strong>
                    AI-Assisted Analysis
                  </strong>

                  Emergency image analysis
                  and guidance
                </span>

              </div>

              <div className="auth-feature">

                <div>
                  <FaMapMarkerAlt />
                </div>

                <span>
                  <strong>
                    Location Aware
                  </strong>

                  Live location and nearby
                  emergency services
                </span>

              </div>

              <div className="auth-feature">

                <div>
                  <FaHeartbeat />
                </div>

                <span>
                  <strong>
                    Emergency Ready
                  </strong>

                  Fast access to SOS and
                  first-aid guidance
                </span>

              </div>

            </div>

          </div>

          <div className="auth-brand-footer">
            <FaShieldAlt />

            <span>
              SECURE ACCESS • SENTINEL AI
            </span>
          </div>

        </section>

        {/* =====================================
            LOGIN PANEL
        ====================================== */}

        <section className="auth-form-panel">

          <div className="auth-mobile-brand">

            <div className="auth-brand-icon">
              <FaShieldAlt />
            </div>

            <div>
              <strong>
                SENTINEL AI
              </strong>

              <span>
                EMERGENCY RESPONSE
              </span>
            </div>

          </div>

          <div className="auth-form-container">

            <div className="auth-form-header">

              <span>
                SECURE ACCOUNT ACCESS
              </span>

              <h2>
                Welcome back
              </h2>

              <p>
                Sign in to access your
                Sentinel AI emergency
                response dashboard.
              </p>

            </div>

            <form
              onSubmit={handleLogin}
              className="auth-form"
              noValidate
            >

              {/* EMAIL */}

              <div className="auth-field">

                <label htmlFor="login-email">
                  EMAIL ADDRESS
                </label>

                <div className="auth-input">

                  <FaEnvelope />

                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="auth-field">

                <label htmlFor="login-password">
                  PASSWORD
                </label>

                <div className="auth-input">

                  <FaLock />

                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword
                      ? <FaEyeSlash />
                      : <FaEye />}
                  </button>

                </div>

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="auth-spinner" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In to Sentinel
                    <FaArrowRight />
                  </>
                )}

              </button>

            </form>

            <div className="auth-divider">
              <span>
                NEW TO SENTINEL AI?
              </span>
            </div>

            <Link
              to="/register"
              className="auth-secondary-button"
            >
              Create New Account
            </Link>

            <div className="auth-security-note">

              <FaShieldAlt />

              <span>
                Your account is protected
                through authenticated access.
              </span>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

export default Login;