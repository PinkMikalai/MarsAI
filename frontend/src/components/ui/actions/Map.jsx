import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: shadow,
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const position = [43.3146893, 5.3677456];

export default function Map() {
  return (
    <MapContainer
      center={position}
      zoom={16}
      scrollWheelZoom={false}
      attributionControl={false}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution="&copy; CARTO"
      />

      <Marker position={position}>
        <Popup><a
          href="https://www.google.com/maps/dir/?api=1&destination=43.3146893,5.3677456"
          target="_blank"
          rel="noreferrer"
        >
          Y aller (Google Maps)
        </a></Popup>
      </Marker>
    </MapContainer>
  );
}