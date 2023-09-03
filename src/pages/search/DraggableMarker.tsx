import React from "react";
import { useState, useMemo, useRef } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { api } from "~/lib/utils/api"
import { activeCity$ } from "~/states";

const center = {
  lat: 51.505,
  lng: -0.09,
}




function DraggableMarker({
  className,
}: {
  className?: string
}) {
  const [position, setPosition] = useState(center)
  const markerRef = useRef<any>(null)

  const city = api.reverseGeoRouter.getCity.useQuery(
    { coordinates: {lat: position.lat, lng: position.lng} },
  );

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          setPosition(marker.getLatLng())
          activeCity$.set({
            name: city.data?.city || "",
            coordinates: {
              lat: position.lat,
              lon: position.lng,
            }
          })
        }
      },
    }),
    [],
  )
  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ minHeight: "500px", minWidth: "500px"}} className={className}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}>
      </Marker>
    </MapContainer>
  )
}

export default DraggableMarker