import React from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

const Map = ({
  position,
  className,
  children,
}: {
  position: [number, number];
  className?: string;
  children?: React.ReactNode;
}) => {
  // console.log(position);
  return (
    <MapContainer
      center={position}
      zoom={10}
      scrollWheelZoom={false}
      className={className}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
      {children ? null : <Marker position={position}></Marker>}
    </MapContainer>
  );
};

export default Map;
