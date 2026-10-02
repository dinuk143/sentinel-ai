import {
  useEffect,
  useRef,
  useState
} from "react";

import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  FaHeartbeat,
  FaMapMarkerAlt,
  FaCamera,
  FaHospital,
  FaFire,
  FaUserShield,
  FaPhoneAlt,
  FaSpinner,
  FaExclamationTriangle,
  FaRobot,
  FaCheckCircle,
  FaRedoAlt,
  FaArrowRight,
  FaShieldAlt,
  FaDirections,
  FaSms
} from "react-icons/fa";

import MapView from "../components/MapView";

import API from "../api/api";
import { getToken } from "../utils/auth";

import "../styles/sos.css";

function SOS() {
  // ========================================
  // LOCATION
  // ========================================

  const [location, setLocation] =
    useState("");

  const [coords, setCoords] =
    useState(null);

  const [loadingLocation, setLoadingLocation] =
    useState(true);

  // ========================================
  // IMAGE
  // ========================================

  const [imageFile, setImageFile] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const previewRef = useRef("");

  // ========================================
  // EMERGENCY
  // ========================================

  const [emergencyType, setEmergencyType] =
    useState("");

  const [sendingSOS, setSendingSOS] =
    useState(false);

  const [aiResult, setAiResult] =
    useState(null);

  // ========================================
  // NEARBY SERVICES
  // ========================================

  const [nearbyResults, setNearbyResults] =
    useState([]);

  const [nearbyLoading, setNearbyLoading] =
    useState(false);

  const [nearbyError, setNearbyError] =
    useState("");

  const [
    activeNearbyType,
    setActiveNearbyType
  ] = useState("");

  // ========================================
  // TRUSTED CONTACT SMS
  // ========================================

  const [
    alertingContacts,
    setAlertingContacts
  ] = useState(false);

  const [
    contactAlertError,
    setContactAlertError
  ] = useState("");

  // ========================================
  // INITIAL LOCATION
  // ========================================

  useEffect(() => {
    getLocation();
  }, []);

  // ========================================
  // PREVIEW CLEANUP
  // ========================================

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(
          previewRef.current
        );
      }
    };
  }, []);

  // ========================================
  // GET CURRENT LOCATION
  // ========================================

  const getLocation = () => {
    setLoadingLocation(true);

    if (!navigator.geolocation) {
      setLocation(
        "Geolocation is not supported on this device."
      );

      setLoadingLocation(false);

      toast.error(
        "Geolocation is not supported on this device."
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat =
          position.coords.latitude;

        const lng =
          position.coords.longitude;

        const accuracy =
          position.coords.accuracy;

        setCoords({
          lat,
          lng,
          accuracy
        });

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );

          if (!response.ok) {
            throw new Error(
              "Reverse geocoding failed."
            );
          }

          const data =
            await response.json();

          setLocation(
            data.display_name ||
              `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          );
        } catch (error) {
          console.error(
            "Reverse geocoding error:",
            error
          );

          // GPS still works even if address lookup fails.
          setLocation(
            `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          );
        } finally {
          setLoadingLocation(false);
        }
      },

      (error) => {
        console.error(
          "Location Error:",
          error
        );

        setCoords(null);

        setLocation(
          "Unable to get accurate location. Please retry."
        );

        setLoadingLocation(false);

        toast.error(
          "Unable to get your location. Check location permission and retry."
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  // ========================================
  // IMAGE CHANGE
  // ========================================

  const handleImageChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      file.type &&
      !file.type.startsWith("image/")
    ) {
      toast.error(
        "Please select a valid image file."
      );

      event.target.value = "";
      return;
    }

    if (previewRef.current) {
      URL.revokeObjectURL(
        previewRef.current
      );
    }

    const previewUrl =
      URL.createObjectURL(file);

    previewRef.current =
      previewUrl;

    setImageFile(file);
    setPreview(previewUrl);
    setAiResult(null);
    setContactAlertError("");

    toast.success(
      "Emergency image ready for analysis."
    );

    // Allows selecting same image again
    event.target.value = "";
  };

  // ========================================
  // CALL 112
  // ========================================

  const call112 = () => {
    window.location.href =
      "tel:112";
  };

  // ========================================
  // START SOS
  // ========================================

  const handleStartSOS = async () => {
    if (sendingSOS) return;

    if (!emergencyType) {
      toast.error(
        "Please select an emergency type."
      );
      return;
    }

    if (!coords) {
      toast.error(
        "Location is not available. Please retry location detection."
      );
      return;
    }

    if (!imageFile) {
      toast.error(
        "Please capture or select an emergency photo."
      );
      return;
    }

    if (!navigator.onLine) {
      toast.error(
        "Internet connection is required for AI analysis and report submission."
      );
      return;
    }

    try {
      setSendingSOS(true);
      setAiResult(null);
      setContactAlertError("");

      const formData =
        new FormData();

      formData.append(
        "emergency_type",
        emergencyType
      );

      formData.append(
        "latitude",
        coords.lat
      );

      formData.append(
        "longitude",
        coords.lng
      );

      formData.append(
        "address",
        location
      );

      formData.append(
        "file",
        imageFile
      );

      const response =
        await API.post(
          "/reports/upload",
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${getToken()}`
            }
          }
        );

      console.log(
        "SOS RESPONSE:",
        response.data
      );

      setAiResult(
        response.data.ai || {
          emergencyType,
          severity:
            "Not available",
          guidance:
            "Emergency report saved successfully."
        }
      );

      toast.success(
        "Emergency report saved successfully."
      );
    } catch (error) {
      console.error(
        "SOS ERROR:",
        error
      );

      console.log(
        "Response Data:",
        error.response?.data
      );

      const message =
        !navigator.onLine
          ? "Internet connection was lost. Please reconnect and try again."
          : error.response?.data?.message ||
            error.message ||
            "Failed to submit emergency report.";

      toast.error(message);
    } finally {
      setSendingSOS(false);
    }
  };

  // ========================================
  // DISTANCE CALCULATION
  // ========================================

  const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {
    const earthRadius = 6371;

    const toRadians =
      (value) =>
        (value * Math.PI) / 180;

    const dLat =
      toRadians(
        lat2 - lat1
      );

    const dLon =
      toRadians(
        lon2 - lon1
      );

    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

      Math.cos(
        toRadians(lat1)
      ) *

      Math.cos(
        toRadians(lat2)
      ) *

      Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return earthRadius * c;
  };

  // ========================================
  // SERVICE CONFIG
  // ========================================

  const getServiceConfig = (
    type
  ) => {
    const configs = {
      hospital: {
        amenity: "hospital",
        title: "Hospitals",
        fallbackName:
          "Hospital"
      },

      police: {
        amenity: "police",
        title: "Police Stations",
        fallbackName:
          "Police Station"
      },

      fire: {
        amenity: "fire_station",
        title: "Fire Stations",
        fallbackName:
          "Fire Station"
      }
    };

    return configs[type];
  };

  // ========================================
  // FORMAT OSM ADDRESS
  // ========================================

  const buildServiceAddress = (
    tags = {}
  ) => {
    const parts = [
      tags["addr:housenumber"],
      tags["addr:street"],
      tags["addr:suburb"],
      tags["addr:city"]
    ].filter(Boolean);

    return parts.length > 0
      ? parts.join(", ")
      : "Address not available";
  };

  // ========================================
  // FIND NEARBY SERVICES
  // ========================================

  const openNearby = async (
    type
  ) => {
    if (nearbyLoading) return;

    if (!coords) {
      toast.error(
        "Location is not available."
      );
      return;
    }

    if (!navigator.onLine) {
      setNearbyError(
        "Internet connection is required to find nearby emergency services."
      );

      toast.error(
        "You are offline. Nearby services cannot be loaded."
      );

      return;
    }

    const config =
      getServiceConfig(type);

    if (!config) return;

    try {
      setNearbyLoading(true);
      setNearbyError("");
      setNearbyResults([]);
      setActiveNearbyType(type);

      const radius = 10000;

      const query = `
        [out:json][timeout:25];

        (
          node["amenity"="${config.amenity}"]
            (around:${radius},${coords.lat},${coords.lng});

          way["amenity"="${config.amenity}"]
            (around:${radius},${coords.lat},${coords.lng});

          relation["amenity"="${config.amenity}"]
            (around:${radius},${coords.lat},${coords.lng});
        );

        out center;
      `;

      const response =
        await fetch(
          "https://overpass-api.de/api/interpreter",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded"
            },

            body:
              "data=" +
              encodeURIComponent(
                query
              )
          }
        );

      if (!response.ok) {
        throw new Error(
          "Nearby service server is temporarily unavailable."
        );
      }

      const data =
        await response.json();

      const services =
        (data.elements || [])

          .map(
            (element) => {
              const lat =
                Number(
                  element.lat ??
                    element.center?.lat
                );

              const lng =
                Number(
                  element.lon ??
                    element.center?.lon
                );

              if (
                !Number.isFinite(lat) ||
                !Number.isFinite(lng)
              ) {
                return null;
              }

              const tags =
                element.tags || {};

              return {
                id:
                  `${element.type}-${element.id}`,

                name:
                  tags.name ||
                  config.fallbackName,

                address:
                  buildServiceAddress(
                    tags
                  ),

                phone:
                  tags.phone ||
                  tags[
                    "contact:phone"
                  ] ||
                  "",

                lat,

                lng,

                distance:
                  calculateDistance(
                    Number(
                      coords.lat
                    ),

                    Number(
                      coords.lng
                    ),

                    lat,

                    lng
                  )
              };
            }
          )

          .filter(Boolean)

          .sort(
            (a, b) =>
              a.distance -
              b.distance
          )

          .slice(0, 10);

      setNearbyResults(
        services
      );

      if (
        services.length === 0
      ) {
        const message =
          `No mapped ${config.title.toLowerCase()} were found within 10 km.`;

        setNearbyError(message);

        toast.error(message);
      }
    } catch (error) {
      console.error(
        "NEARBY SERVICES ERROR:",
        error
      );

      const message =
        !navigator.onLine
          ? "Internet connection was lost while loading nearby services."
          : "Unable to load nearby emergency services right now. Please try again.";

      setNearbyError(message);

      toast.error(message);
    } finally {
      setNearbyLoading(false);
    }
  };

  // ========================================
  // OPEN SERVICE DIRECTIONS
  // ========================================

  const openServiceMap = (
    service
  ) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lng}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ========================================
  // ALERT ALL TRUSTED CONTACTS
  // ========================================

  const handleAlertAllContacts =
    async () => {
      if (alertingContacts) return;

      if (!navigator.onLine) {
        const message =
          "Internet connection is required to load your saved emergency contacts.";

        setContactAlertError(
          message
        );

        toast.error(message);

        return;
      }

      try {
        setAlertingContacts(
          true
        );

        setContactAlertError(
          ""
        );

        // Get latest saved contacts

        const response =
          await API.get(
            "/emergency-contacts",
            {
              headers: {
                Authorization:
                  `Bearer ${getToken()}`
              }
            }
          );

        const contacts =
          Array.isArray(
            response.data?.contacts
          )
            ? response.data.contacts
            : [];

        if (
          contacts.length === 0
        ) {
          const message =
            "No emergency contacts found. Add trusted contacts from the Contacts page first.";

          setContactAlertError(
            message
          );

          toast.error(message);

          return;
        }

        // Clean numbers + remove duplicates

        const recipients = [
          ...new Set(
            contacts

              .map(
                (contact) =>
                  String(
                    contact.phone || ""
                  )
                    .trim()
                    .replace(
                      /[^\d+]/g,
                      ""
                    )
              )

              .filter(Boolean)
          )
        ];

        if (
          recipients.length === 0
        ) {
          const message =
            "No valid mobile numbers were found.";

          setContactAlertError(
            message
          );

          toast.error(message);

          return;
        }

        // Emergency details

        const detectedEmergency =
          aiResult?.emergencyType &&
          aiResult.emergencyType !==
            "Unknown"
            ? aiResult.emergencyType
            : emergencyType ||
              "Emergency";

        const severity =
          aiResult?.severity ||
          "Not available";

        const emergencyAddress =
          location ||
          "Location address unavailable";

        const hasCoordinates =
          Number.isFinite(
            Number(coords?.lat)
          ) &&
          Number.isFinite(
            Number(coords?.lng)
          );

        const mapLink =
          hasCoordinates
            ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
            : "Location coordinates unavailable";

        // SMS body

        const message =
`SENTINEL AI EMERGENCY ALERT

An emergency SOS has been reported.

Emergency: ${detectedEmergency}
Severity: ${severity}

Location:
${emergencyAddress}

Map:
${mapLink}

Please contact me immediately.

For emergency assistance in India, call 112.`;

        // All saved numbers

        const recipientList =
          recipients.join(",");

        // Android SMS composer

        const smsUrl =
          `sms:${recipientList}?body=${encodeURIComponent(
            message
          )}`;

        toast.success(
          `Preparing alert for ${recipients.length} contact${recipients.length === 1 ? "" : "s"}...`
        );

        // Open native SMS app

        window.location.href =
          smsUrl;
      } catch (error) {
        console.error(
          "EMERGENCY CONTACT ALERT ERROR:",
          error
        );

        const message =
          !navigator.onLine
            ? "Internet connection was lost while loading your contacts."
            : error.response?.data?.message ||
              "Unable to prepare emergency SMS alert.";

        setContactAlertError(
          message
        );

        toast.error(message);
      } finally {
        setAlertingContacts(
          false
        );
      }
    };

  // ========================================
  // LOCATION ACCURACY
  // ========================================

  const getAccuracyInfo = () => {
    if (!coords) {
      return {
        className:
          "accuracy-low",

        text:
          "Location unavailable"
      };
    }

    if (
      coords.accuracy <= 100
    ) {
      return {
        className:
          "accuracy-good",

        text:
          "Good accuracy"
      };
    }

    if (
      coords.accuracy <= 500
    ) {
      return {
        className:
          "accuracy-medium",

        text:
          "Moderate accuracy"
      };
    }

    return {
      className:
        "accuracy-low",

      text:
        "Low accuracy"
    };
  };

  // ========================================
  // SEVERITY STYLE
  // ========================================

  const getSeverityClass = (
    severity = ""
  ) => {
    const value =
      String(severity)
        .toLowerCase();

    if (
      value === "critical" ||
      value === "high"
    ) {
      return "severity-critical";
    }

    if (
      value === "medium" ||
      value === "moderate"
    ) {
      return "severity-medium";
    }

    return "severity-low";
  };

  const accuracyInfo =
    getAccuracyInfo();

  const activeServiceConfig =
    getServiceConfig(
      activeNearbyType
    );

  // ========================================
  // UI
  // ========================================

  return (
    <main className="sos-page">

      <div
        className="sos-bg-glow sos-bg-red"
      />

      <div
        className="sos-bg-glow sos-bg-blue"
      />

      <div className="sos-container">

        {/* ================= HERO ================= */}

        <motion.header
          className="sos-header"
          initial={{
            opacity: 0,
            y: 15
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
        >

          <div className="sos-header-content">

            <div className="sos-command-badge">
              <span className="sos-live-dot" />
              EMERGENCY COMMAND CENTER
            </div>

            <div className="sos-heading-row">

              <div className="sos-main-icon">
                <FaHeartbeat />
              </div>

              <div>
                <h1>
                  Emergency SOS
                </h1>

                <p>
                  Provide emergency details
                  for AI-assisted analysis
                  and immediate guidance.
                </p>
              </div>

            </div>

          </div>

          <button
            type="button"
            className="sos-call-112"
            onClick={call112}
          >
            <FaPhoneAlt />

            <span>
              <small>
                EMERGENCY CALL
              </small>

              Call 112
            </span>
          </button>

        </motion.header>

        {/* ================= STATUS ================= */}

        <section className="sos-system-status">

          <div className="system-status-item">
            <FaMapMarkerAlt />

            <div>
              <span>
                LOCATION
              </span>

              <strong>
                {loadingLocation
                  ? "Detecting..."
                  : coords
                    ? "Detected"
                    : "Unavailable"}
              </strong>
            </div>
          </div>

          <div className="status-divider" />

          <div className="system-status-item">
            <FaRobot />

            <div>
              <span>
                AI ANALYSIS
              </span>

              <strong>
                Ready
              </strong>
            </div>
          </div>

          <div className="status-divider" />

          <div className="system-status-item">
            <FaShieldAlt />

            <div>
              <span>
                REPORT SYSTEM
              </span>

              <strong>
                Available
              </strong>
            </div>
          </div>

        </section>

        {/* ================= MAIN GRID ================= */}

        <div className="sos-command-grid">

          {/* ================= LEFT ================= */}

          <div className="sos-command-column">

            {/* ================= EMERGENCY TYPE ================= */}

            <motion.section
              className="sos-panel"
              initial={{
                opacity: 0,
                y: 15
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.08
              }}
            >

              <div className="sos-panel-heading">

                <div className="panel-number">
                  01
                </div>

                <div>
                  <span>
                    EMERGENCY DETAILS
                  </span>

                  <h2>
                    Select Emergency Type
                  </h2>
                </div>

              </div>

              <label
                className="sos-field-label"
                htmlFor="emergency-type"
              >
                Type of emergency
              </label>

              <select
                id="emergency-type"
                className="sos-select"
                value={emergencyType}
                onChange={(e) => {
                  setEmergencyType(
                    e.target.value
                  );

                  setAiResult(null);
                }}
              >
                <option value="">
                  Select Emergency Type
                </option>

                <option value="Road Accident">
                  Road Accident
                </option>

                <option value="Fire">
                  Fire
                </option>

                <option value="Medical Emergency">
                  Medical Emergency
                </option>

                <option value="Heart Attack">
                  Heart Attack
                </option>

                <option value="Snake Bite">
                  Snake Bite
                </option>

                <option value="Dog Bite">
                  Dog Bite
                </option>

                <option value="Electric Shock">
                  Electric Shock
                </option>

                <option value="Burns">
                  Burns
                </option>

                <option value="Drowning">
                  Drowning
                </option>

                <option value="Choking">
                  Choking
                </option>

                <option value="Violence">
                  Violence
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

            </motion.section>

            {/* ================= LOCATION ================= */}

            <motion.section
              className="sos-panel"
              initial={{
                opacity: 0,
                y: 15
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.14
              }}
            >

              <div className="sos-panel-heading">

                <div className="panel-number">
                  02
                </div>

                <div>
                  <span>
                    LIVE LOCATION
                  </span>

                  <h2>
                    Emergency Location
                  </h2>
                </div>

                <div
                  className={`location-status ${accuracyInfo.className}`}
                >
                  <span />

                  {loadingLocation
                    ? "Detecting"
                    : accuracyInfo.text}
                </div>

              </div>

              <div className="location-address">

                <div className="location-pin">
                  {loadingLocation
                    ? (
                      <FaSpinner className="spin" />
                    )
                    : (
                      <FaMapMarkerAlt />
                    )}
                </div>

                <div>
                  <span>
                    CURRENT ADDRESS
                  </span>

                  <p>
                    {loadingLocation
                      ? "Detecting your accurate location..."
                      : location}
                  </p>
                </div>

              </div>

              {coords && (
                <div className="location-metrics">

                  <div>
                    <span>
                      LATITUDE
                    </span>

                    <strong>
                      {coords.lat.toFixed(6)}
                    </strong>
                  </div>

                  <div>
                    <span>
                      LONGITUDE
                    </span>

                    <strong>
                      {coords.lng.toFixed(6)}
                    </strong>
                  </div>

                  <div>
                    <span>
                      ACCURACY
                    </span>

                    <strong>
                      ±{Math.round(
                        coords.accuracy
                      )} m
                    </strong>
                  </div>

                </div>
              )}

              <button
                type="button"
                className="retry-location-button"
                onClick={getLocation}
                disabled={loadingLocation}
              >
                {loadingLocation
                  ? (
                    <>
                      <FaSpinner className="spin" />
                      Detecting Location...
                    </>
                  )
                  : (
                    <>
                      <FaRedoAlt />
                      Retry Accurate Location
                    </>
                  )}
              </button>

              {coords && (
                <div className="sos-map-container">

                  <MapView
                    lat={coords.lat}
                    lng={coords.lng}
                  />

                </div>
              )}

            </motion.section>

          </div>

          {/* ================= RIGHT ================= */}

          <div className="sos-command-column">

            {/* ================= IMAGE ================= */}

            <motion.section
              className="sos-panel evidence-panel"
              initial={{
                opacity: 0,
                y: 15
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.1
              }}
            >

              <div className="sos-panel-heading">

                <div className="panel-number">
                  03
                </div>

                <div>
                  <span>
                    VISUAL EVIDENCE
                  </span>

                  <h2>
                    Emergency Image
                  </h2>
                </div>

              </div>

              {/* GALLERY INPUT */}

              <input
                id="emergency-image-upload"
                type="file"
                accept="image/*"
                className="sos-file-input"
                onChange={handleImageChange}
              />

              {/* CAMERA INPUT */}

              <input
                id="emergency-image-camera"
                type="file"
                accept="image/*"
                capture="environment"
                className="sos-file-input"
                onChange={handleImageChange}
              />

              {!preview ? (
                <div className="image-upload-zone">

                  <div className="upload-icon">
                    <FaCamera />
                  </div>

                  <h3>
                    Add emergency image
                  </h3>

                  <p>
                    Take a live photo or
                    select an existing image
                    for AI analysis.
                  </p>

                  <div className="image-source-actions">

                    <label
                      htmlFor="emergency-image-camera"
                      className="upload-action camera-action"
                    >
                      <FaCamera />
                      TAKE LIVE PHOTO
                    </label>

                    <label
                      htmlFor="emergency-image-upload"
                      className="upload-action gallery-action"
                    >
                      <FaCamera />
                      UPLOAD IMAGE
                    </label>

                  </div>

                </div>
              ) : (
                <div className="image-preview-container">

                  <img
                    src={preview}
                    alt="Emergency preview"
                    className="emergency-preview"
                  />

                  <div className="preview-overlay">
                    <FaCheckCircle />
                    Image Ready
                  </div>

                  <div className="image-change-actions">

                    <label
                      htmlFor="emergency-image-camera"
                      className="change-image-button"
                    >
                      <FaCamera />
                      Retake Photo
                    </label>

                    <label
                      htmlFor="emergency-image-upload"
                      className="change-image-button"
                    >
                      <FaCamera />
                      Choose Another
                    </label>

                  </div>

                </div>
              )}

              {imageFile && (
                <div className="selected-file-info">

                  <FaCheckCircle />

                  <div>
                    <span>
                      IMAGE SELECTED
                    </span>

                    <strong>
                      {imageFile.name}
                    </strong>
                  </div>

                </div>
              )}

              <div className="sos-submit-warning">

                <FaExclamationTriangle />

                <p>
                  Sentinel AI provides
                  assistance and guidance.
                  For immediate danger,
                  contact official emergency
                  services.
                </p>

              </div>

              <button
                type="button"
                className="primary-sos-button"
                onClick={handleStartSOS}
                disabled={sendingSOS}
              >
                {sendingSOS
                  ? (
                    <>
                      <FaSpinner className="spin" />
                      ANALYZING & SAVING...
                    </>
                  )
                  : (
                    <>
                      <FaHeartbeat />
                      START SOS & ANALYZE
                      <FaArrowRight />
                    </>
                  )}
              </button>

            </motion.section>

            {/* ================= NEARBY ================= */}

            <motion.section
              className="sos-panel"
              initial={{
                opacity: 0,
                y: 15
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.16
              }}
            >

              <div className="sos-panel-heading">

                <div className="panel-number">
                  04
                </div>

                <div>
                  <span>
                    NEARBY SERVICES
                  </span>

                  <h2>
                    Emergency Help Near You
                  </h2>
                </div>

              </div>

              <p className="nearby-description">
                Services are sorted from
                nearest to farthest using
                your current GPS location.
              </p>

              <div className="nearby-services">

                <button
                  type="button"
                  className={`nearby-service hospital-service ${
                    activeNearbyType ===
                    "hospital"
                      ? "active-nearby-service"
                      : ""
                  }`}
                  onClick={() =>
                    openNearby(
                      "hospital"
                    )
                  }
                  disabled={nearbyLoading}
                >
                  <div className="service-icon">
                    <FaHospital />
                  </div>

                  <div>
                    <strong>
                      Hospitals
                    </strong>

                    <span>
                      Find nearby medical help
                    </span>
                  </div>

                  <FaArrowRight className="service-arrow" />
                </button>

                <button
                  type="button"
                  className={`nearby-service fire-service ${
                    activeNearbyType ===
                    "fire"
                      ? "active-nearby-service"
                      : ""
                  }`}
                  onClick={() =>
                    openNearby(
                      "fire"
                    )
                  }
                  disabled={nearbyLoading}
                >
                  <div className="service-icon">
                    <FaFire />
                  </div>

                  <div>
                    <strong>
                      Fire Stations
                    </strong>

                    <span>
                      Find nearby fire services
                    </span>
                  </div>

                  <FaArrowRight className="service-arrow" />
                </button>

                <button
                  type="button"
                  className={`nearby-service police-service ${
                    activeNearbyType ===
                    "police"
                      ? "active-nearby-service"
                      : ""
                  }`}
                  onClick={() =>
                    openNearby(
                      "police"
                    )
                  }
                  disabled={nearbyLoading}
                >
                  <div className="service-icon">
                    <FaUserShield />
                  </div>

                  <div>
                    <strong>
                      Police Stations
                    </strong>

                    <span>
                      Find nearby police help
                    </span>
                  </div>

                  <FaArrowRight className="service-arrow" />
                </button>

              </div>

              {/* NEARBY LOADING */}

              {nearbyLoading && (
                <div className="nearby-loading">
                  <FaSpinner className="spin" />
                  Finding nearest services...
                </div>
              )}

              {/* NEARBY ERROR */}

              {nearbyError && (
                <div className="nearby-error">
                  <FaExclamationTriangle />
                  {nearbyError}
                </div>
              )}

              {/* NEARBY RESULTS */}

              {!nearbyLoading &&
                nearbyResults.length > 0 && (

                  <div className="nearest-results">

                    <h3>
                      Nearest{" "}
                      {activeServiceConfig?.title ||
                        "Emergency Services"}
                    </h3>

                    {nearbyResults.map(
                      (service, index) => (

                        <div
                          className="nearest-service-card"
                          key={service.id}
                        >

                          <div className="service-rank">
                            {index + 1}
                          </div>

                          <div className="nearest-service-info">

                            <strong>
                              {service.name}
                            </strong>

                            <span>
                              {service.address}
                            </span>

                            {service.phone && (
                              <span className="service-phone">
                                <FaPhoneAlt />
                                {service.phone}
                              </span>
                            )}

                          </div>

                          <div className="nearest-service-actions">

                            <strong className="service-distance">
                              {service.distance < 1
                                ? `${Math.round(
                                    service.distance *
                                      1000
                                  )} m`
                                : `${service.distance.toFixed(
                                    2
                                  )} km`}
                            </strong>

                            <button
                              type="button"
                              className="open-service-map"
                              onClick={() =>
                                openServiceMap(
                                  service
                                )
                              }
                            >
                              <FaDirections />
                              OPEN MAP
                            </button>

                          </div>

                        </div>
                      )
                    )}

                    <p className="distance-disclaimer">
                      Distances are approximate
                      straight-line distances.
                      Road travel distance may
                      differ.
                    </p>

                  </div>
                )}

            </motion.section>

          </div>

        </div>

        {/* ================= TRUSTED CONTACT ALERT ================= */}

        <motion.section
          className="trusted-alert-panel"
          initial={{
            opacity: 0,
            y: 15
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.18
          }}
        >

          <div className="trusted-alert-heading">

            <div className="trusted-alert-icon">
              <FaSms />
            </div>

            <div>
              <span>
                TRUSTED CONTACT ALERT
              </span>

              <h3>
                Alert All Emergency Contacts
              </h3>

              <p>
                Send your emergency type,
                location and map link to all
                saved trusted contacts.
              </p>
            </div>

          </div>

          {contactAlertError && (
            <div className="trusted-alert-error">
              {contactAlertError}
            </div>
          )}

          <button
            type="button"
            className="alert-all-contacts-button"
            onClick={handleAlertAllContacts}
            disabled={alertingContacts}
          >
            <span>
              {alertingContacts
                ? (
                  <FaSpinner className="spin" />
                )
                : (
                  <FaSms />
                )}
            </span>

            {alertingContacts
              ? "PREPARING ALERT..."
              : "ALERT ALL CONTACTS"}
          </button>

          <div className="trusted-alert-note">
            Your phone&apos;s SMS app will open with
            all saved contacts and the emergency
            message pre-filled. Review it and tap Send.
          </div>

        </motion.section>

        {/* ================= AI RESULT ================= */}

        {aiResult && (
          <motion.section
            className="ai-analysis-panel"
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
          >

            <div className="ai-analysis-header">

              <div className="ai-analysis-icon">
                <FaRobot />
              </div>

              <div>
                <span>
                  GEMINI AI ANALYSIS
                </span>

                <h2>
                  Emergency Analysis Result
                </h2>
              </div>

              <div
                className={`severity-badge ${getSeverityClass(
                  aiResult.severity
                )}`}
              >
                {aiResult.severity ||
                  "Unknown"}{" "}
                Severity
              </div>

            </div>

            <div className="ai-analysis-grid">

              <div className="analysis-block">
                <span>
                  DETECTED EMERGENCY
                </span>

                <strong>
                  {aiResult.emergencyType ||
                    emergencyType}
                </strong>
              </div>

              <div className="analysis-block">
                <span>
                  SEVERITY LEVEL
                </span>

                <strong>
                  {aiResult.severity ||
                    "Not available"}
                </strong>
              </div>

            </div>

            <div className="ai-guidance">

              <div className="guidance-heading">
                <FaHeartbeat />
                Immediate Guidance
              </div>

              {Array.isArray(
                aiResult.guidance
              )
                ? (
                  <ol>
                    {aiResult.guidance.map(
                      (
                        step,
                        index
                      ) => (
                        <li key={index}>
                          {step}
                        </li>
                      )
                    )}
                  </ol>
                )
                : (
                  <p>
                    {aiResult.guidance ||
                      "Guidance not available."}
                  </p>
                )}

            </div>

            {/* ================= 112 ================= */}

            <div className="ai-emergency-footer">

              <FaPhoneAlt />

              <span>
                If the situation is
                life-threatening, call{" "}
                <strong>
                  112
                </strong>{" "}
                immediately.
              </span>

              <button
                type="button"
                onClick={call112}
              >
                CALL 112
              </button>

            </div>

          </motion.section>
        )}

      </div>

    </main>
  );
}

export default SOS;