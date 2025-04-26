import React from "react";
import { Viewer, Globe, Scene, Primitive, Cesium3DTileset, Entity, PointGraphics, ImageryLayer, Polyline, PolylineGraphics, BillboardGraphics, ModelGraphics } from "resium";
import { IonResource, CesiumTerrainProvider, Cartesian3, Ion, ArcGisMapServerImageryProvider, OpenStreetMapImageryProvider } from "cesium";
import { useSelector } from "react-redux";
import { selectRoverLatitude, selectRoverLongitude, selectRoverYaw, selectRoverHeading } from "../../store/telemetrySlice";
import { radians } from '@math.gl/core';

import robotModel from "../../../assets/Dozer.glb"
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NjAyNDE4MS03YzQ5LTQ3YWEtYTA3NS0xZmNlMmMzNjA4MDAiLCJpZCI6MTgwNDExLCJpYXQiOjE3MDA4MDYzODF9.wQNIlvboVB7Zo5qVFUXj2jUMfJRrK_zdvBEp2INt1Kg";

function Map() {
  const lat = useSelector(selectRoverLatitude);
  // const lat = 47.655548;
  const lon = useSelector(selectRoverLongitude);
  // const lon = -122.303200;
  const heading = useSelector(selectRoverHeading);
  const yaw = useSelector(selectRoverYaw);

  const imageryProvider = new OpenStreetMapImageryProvider({
    url: "https://tile.openstreetmap.org/",
  });
  const positions = Cartesian3.fromDegreesArray([
    -119, 48,
    -118.9998, 48,
    -118.999022, 47.999330,
    -118.998927, 47.999277,
    -118.998257, 47.998970,
  ]);

  return (
    <Viewer
      style={{ overflow: "hidden" }}
      geocoder={false}
      timeline={false}
      animation={false}
      fullscreenButton={false}
      homeButton={false}
      imageryProvider={imageryProvider}
      onReady={() => setViewerReady(true)}
    >
      <Entity
        name="Rover"
        position={Cartesian3.fromDegrees(lon, lat, 0)}
        description={"Lat: " + lat.toFixed(7) + "°, Lon: " + lon.toFixed(7) + "°, Heading: " + heading.toFixed(0) + "°"}
        selected
        tracked
      >
          <ModelGraphics 
            uri={robotModel}  
            maximumScale={0.01}
          />
      </Entity>
      <Entity
        name="Path 1"
        description={"Example description :)"}
      >
        <PolylineGraphics
          show={true}
          width={10}
          positions={positions}
          clampToGround={true}
        />
      </Entity>
    </Viewer>
  );
}

export default Map;