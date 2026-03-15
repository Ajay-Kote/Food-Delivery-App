import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon bug (required when using bundlers)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapView({ customerLocation, restaurantLocation, agentLocation }) {
  const center = customerLocation || restaurantLocation || { lat: 20.5937, lng: 78.9629 };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
      className="rounded-lg z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {customerLocation && (
        <Marker position={[customerLocation.lat, customerLocation.lng]} icon={blueIcon}>
          <Popup>Your Location</Popup>
        </Marker>
      )}

      {restaurantLocation && (
        <Marker position={[restaurantLocation.lat, restaurantLocation.lng]} icon={redIcon}>
          <Popup>Restaurant</Popup>
        </Marker>
      )}

      {agentLocation && (
        <Marker position={[agentLocation.lat, agentLocation.lng]} icon={greenIcon}>
          <Popup>Delivery Agent</Popup>
        </Marker>
      )}

      {restaurantLocation && agentLocation && customerLocation && (
        <Polyline
          positions={[
            [restaurantLocation.lat, restaurantLocation.lng],
            [agentLocation.lat, agentLocation.lng],
            [customerLocation.lat, customerLocation.lng],
          ]}
          color="orange"
          weight={4}
        />
      )}
    </MapContainer>
  );
}
