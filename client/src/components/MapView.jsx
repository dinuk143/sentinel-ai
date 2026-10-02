import { useEffect } from "react";
import L from "leaflet";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "15px",
  overflow: "hidden"
};

const OSM_TILE_URL = [
  "https:",
  "",
  "tile.openstreetmap.org",
  "{z}",
  "{x}",
  "{y}.png"
].join("/");

// ==========================================
// CUSTOM LOCATION PIN
// ==========================================

const locationIcon = L.divIcon({
  className: "sentinel-location-marker",

  html: `
    <div style="
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 5px 8px rgba(0,0,0,0.35));
    ">
      <svg
        width="38"
        height="38"
        viewBox="0 0 24 24"
        fill="#ef4444"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        />
        <circle
          cx="12"
          cy="9"
          r="2.5"
          fill="white"
        />
      </svg>
    </div>
  `,

  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
});

// ==========================================
// UPDATE MAP WHEN LOCATION CHANGES
// ==========================================

function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 15);
  }, [map, position]);

  return null;
}

// ==========================================
// MAP VIEW
// ==========================================

function MapView({ lat, lng }) {
  const latitude = Number(lat);
  const longitude = Number(lng);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return (
      <div
        style={{
          ...containerStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a1220",
          color: "#94a3b8"
        }}
      >
        Location unavailable
      </div>
    );
  }

  const position = [
    latitude,
    longitude
  ];

  return (
    <div style={containerStyle}>

      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "100%"
        }}
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url={OSM_TILE_URL}
        />

        {/* LOCATION PIN */}

        <Marker
          position={position}
          icon={locationIcon}
        >
          <Popup>
            📍 Your Emergency Location
          </Popup>
        </Marker>

        <MapUpdater
          position={position}
        />

      </MapContainer>

    </div>
  );
}

export default MapView;