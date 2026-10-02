import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { getToken } from "./utils/auth";
import SOS from "./pages/SOS";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import EmergencyContacts from "./pages/EmergencyContacts";
import Login from "./pages/AuthLogin";
import Register from "./pages/AuthRegister";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import EmergencyGuide from "./pages/EmergencyGuide";

function App() {
  return (
    <>
      <Navbar />
      <Toaster
  position="top-center"
  toastOptions={{
    duration: 3500,
    style: {
      background: "#0b1524",
      color: "#f8fafc",
      border: "1px solid rgba(148, 163, 184, 0.18)",
      borderRadius: "14px",
      padding: "14px 16px",
      boxShadow: "0 12px 35px rgba(0, 0, 0, 0.35)"
    },
    success: {
      iconTheme: {
        primary: "#22c55e",
        secondary: "#0b1524"
      }
    },
    error: {
      iconTheme: {
        primary: "#ef4444",
        secondary: "#0b1524"
      }
    }
  }}
/>

<Routes></Routes>

      <Routes>

        {/* Public Routes */}

<Route
  path="/"
  element={
    getToken()
      ? <Navigate to="/home" replace />
      : <Login />
  }
/>
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
  path="/emergency-contacts"
  element={
    <ProtectedRoute>
      <EmergencyContacts />
    </ProtectedRoute>
  }
/>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
  path="/sos"
  element={
    <ProtectedRoute>
      <SOS />
    </ProtectedRoute>
  }
/>

        <Route
          path="/first-aid"
          element={
            <ProtectedRoute>
              <EmergencyGuide />
            </ProtectedRoute>
          }
        />

      </Routes>

    </>
  );
}

export default App;