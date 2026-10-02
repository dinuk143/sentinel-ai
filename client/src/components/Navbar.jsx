import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  FaHome,
  FaHeartbeat,
  FaFirstAid,
  FaChartBar,
  FaHistory,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaShieldAlt,
  FaUserFriends
} from "react-icons/fa";

import { logout } from "../utils/auth";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const publicRoutes = [
    "/",
    "/register"
  ];

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  if (
    publicRoutes.includes(
      location.pathname
    )
  ) {
    return null;
  }

  
    const handleLogout = () => {
  setMenuOpen(false);
  logout();
  navigate("/", { replace: true });
};
  const isActive = (path) =>
    location.pathname.toLowerCase() ===
    path.toLowerCase();

  const navItems = [
    {
      path: "/home",
      label: "Home",
      icon: <FaHome />
    },
    {
      path: "/sos",
      label: "SOS",
      icon: <FaHeartbeat />
    },
    {
      path: "/first-aid",
      label: "Guide",
      icon: <FaFirstAid />
    },
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <FaChartBar />
    },
    {
      path: "/reports",
      label: "My Reports",
      icon: <FaHistory />
    },

    // NEW EMERGENCY CONTACTS
    {
      path: "/emergency-contacts",
      label: "Contacts",
      icon: <FaUserFriends />
    }
  ];

  return (
    <nav className="sentinel-navbar">

      <div className="navbar-inner">

        {/* BRAND */}

        <Link
          to="/home"
          className="navbar-brand-custom"
        >

          <div className="navbar-logo">
            <FaShieldAlt />
          </div>

          <div className="navbar-brand-text">

            <span className="navbar-brand-name">
              SENTINEL AI
            </span>

            <span className="navbar-brand-subtitle">
              EMERGENCY RESPONSE
            </span>

          </div>

        </Link>


        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          className="navbar-toggle"
          onClick={() =>
            setMenuOpen(
              (prev) => !prev
            )
          }
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen
            ? <FaTimes />
            : <FaBars />}
        </button>


        {/* NAVIGATION */}

        <div
          className={`navbar-menu ${
            menuOpen ? "open" : ""
          }`}
        >

          {navItems.map((item) => (

            <Link
              key={item.path}
              to={item.path}
              className={`navbar-link ${
                isActive(item.path)
                  ? "active"
                  : ""
              }`}
            >

              {item.icon}

              <span>
                {item.label}
              </span>

            </Link>

          ))}


          <button
            type="button"
            className="navbar-logout"
            onClick={handleLogout}
          >

            <FaSignOutAlt />

            <span>
              Logout
            </span>

          </button>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;