import { useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  FaShieldAlt,
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaHeartbeat,
  FaMapMarkerAlt,
  FaRobot
} from "react-icons/fa";

import toast from "react-hot-toast";

import API from "../api/api";

import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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
  // REGISTER
  // ==========================================

  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password
    ) {
      toast.error(
        "Please complete all required fields."
      );
      return;
    }

    if (!navigator.onLine) {
      toast.error(
        "You are offline. Connect to the internet to create an account."
      );
      return;
    }

    try {
      setLoading(true);

      await API.post(
        "/auth/register",
        {
          ...form,
          name: form.name.trim(),
          email: form.email.trim()
        }
      );

      toast.success(
        "Account created successfully! Please sign in."
      );

      navigate("/", {
        replace: true
      });
    } catch (err) {
      console.error(
        "REGISTER ERROR:",
        err
      );

      const message =
        !navigator.onLine
          ? "You are offline. Connect to the internet to create an account."
          : err.response?.data?.message ||
            "Registration failed. Please try again.";

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
              Be prepared.
              <span>
                {" "}Stay connected.
              </span>
            </h1>

            <p>
              Create your Sentinel AI account
              to access emergency reporting,
              first-aid guidance, AI-assisted
              analysis and your personal
              emergency report history.
            </p>

            <div className="auth-features">

              <div className="auth-feature">

                <div>
                  <FaRobot />
                </div>

                <span>
                  <strong>
                    AI Assistance
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
                    Location Support
                  </strong>

                  Live location assistance
                  during SOS reporting
                </span>

              </div>

              <div className="auth-feature">

                <div>
                  <FaHeartbeat />
                </div>

                <span>
                  <strong>
                    First Aid Guide
                  </strong>

                  Quick emergency guidance
                  when needed
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
            REGISTER PANEL
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
                CREATE SECURE ACCOUNT
              </span>

              <h2>
                Join Sentinel AI
              </h2>

              <p>
                Create your account to access
                Sentinel AI emergency
                assistance.
              </p>

            </div>

            <form
              onSubmit={handleRegister}
              className="auth-form"
              noValidate
            >

              {/* NAME */}

              <div className="auth-field">

                <label htmlFor="register-name">
                  FULL NAME
                </label>

                <div className="auth-input">

                  <FaUser />

                  <input
                    id="register-name"
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="auth-field">

                <label htmlFor="register-email">
                  EMAIL ADDRESS
                </label>

                <div className="auth-input">

                  <FaEnvelope />

                  <input
                    id="register-email"
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

                <label htmlFor="register-password">
                  PASSWORD
                </label>

                <div className="auth-input">

                  <FaLock />

                  <input
                    id="register-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
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

              {/* REGISTER BUTTON */}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="auth-spinner" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <FaArrowRight />
                  </>
                )}

              </button>

            </form>

            <div className="auth-divider">
              <span>
                ALREADY REGISTERED?
              </span>
            </div>

            <Link
              to="/"
              className="auth-secondary-button"
            >
              Sign In Instead
            </Link>

            <div className="auth-security-note">

              <FaShieldAlt />

              <span>
                Your account provides secure
                access to your emergency
                reports.
              </span>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

export default Register;