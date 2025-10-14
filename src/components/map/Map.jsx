import React from "react";
import { Viewer, Globe, Scene, Primitive, Cesium3DTileset, Entity, PointGraphics, ImageryLayer, Polyline, PolylineGraphics, BillboardGraphics, ModelGraphics, CameraFlyTo } from "resium";
import { IonResource, CesiumTerrainProvider, Cartesian3, Ion, ArcGisMapServerImageryProvider, OpenStreetMapImageryProvider } from "cesium";
import { useSelector } from "react-redux";
import { selectRoverLatitude, selectRoverLongitude, selectRoverYaw, selectRoverHeading } from "../../store/telemetrySlice";
import { radians } from '@math.gl/core';

import robotModel from "../../../assets/Dozer.glb"
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NjAyNDE4MS03YzQ5LTQ3YWEtYTA3NS0xZmNlMmMzNjA4MDAiLCJpZCI6MTgwNDExLCJpYXQiOjE3MDA4MDYzODF9.wQNIlvboVB7Zo5qVFUXj2jUMfJRrK_zdvBEp2INt1Kg";

function Map() {
  //const lat = useSelector(selectRoverLatitude);
   const lat = 47.655548;
  // const lon = useSelector(selectRoverLongitude);
   const lon = -122.303200;
  const heading = useSelector(selectRoverHeading);
  const yaw = useSelector(selectRoverYaw);

  // Ref to access the underlying Cesium Viewer so we can control the camera
  const viewerRef = React.useRef(null);
  const didSetCamera = React.useRef(false);

  // UI state for manual coordinate input
  // use string inputs so typing doesn't produce NaN; parse on Set Pin
  const [manualLatInput, setManualLatInput] = React.useState("47.6061");
  const [manualLonInput, setManualLonInput] = React.useState("-122.3328");
  // numeric parsed values used for the Entity position / camera
  const [manualLat, setManualLat] = React.useState(47.6061);
  const [manualLon, setManualLon] = React.useState(-122.3328);
  const [useManual, setUseManual] = React.useState(false);
  // camera fly-to trigger state
  const [cameraTarget, setCameraTarget] = React.useState(null);
  const [cameraKey, setCameraKey] = React.useState(0);

  // Use ArcGIS World Imagery for satellite/sensor-backed tiles (satellite view)
  const imageryProvider = new ArcGisMapServerImageryProvider({
    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
  });
  const positions = Cartesian3.fromDegreesArray([
    -119, 48,
    -118.9998, 48,
    -118.999022, 47.999330,
    -118.998927, 47.999277,
    -118.998257, 47.998970,
  ]);

  // Fly the camera when viewer becomes available or when manual/telemetry mode changes
  React.useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement;
    if (!viewer) return;

    const centerLon = useManual ? manualLon : lon;
    const centerLat = useManual ? manualLat : lat;

    // ensure numbers are valid
    if (typeof centerLon === 'number' && typeof centerLat === 'number' && !Number.isNaN(centerLon) && !Number.isNaN(centerLat)) {
      // flyTo for a smooth transition
      try {
        viewer.camera.flyTo({ destination: Cartesian3.fromDegrees(centerLon, centerLat, 1500), duration: 1.2 });
      } catch (e) {
        // swallow camera errors and log for debugging
        // eslint-disable-next-line no-console
        console.error('camera.flyTo failed', e);
      }
    }
  }, [useManual, manualLat, manualLon, lat, lon]);

  function handleSetPin() {
    const parsedLat = parseFloat(manualLatInput);
    const parsedLon = parseFloat(manualLonInput);
    if (Number.isNaN(parsedLat) || Number.isNaN(parsedLon)) {
      // simple feedback — you could replace with UI toast
      // eslint-disable-next-line no-alert
      alert('Please enter valid numeric latitude and longitude');
      return;
    }
    setManualLat(parsedLat);
    setManualLon(parsedLon);
    setUseManual(true);
    setCameraTarget({ lon: parsedLon, lat: parsedLat, alt: 1500 });
    setCameraKey(k => k + 1);
  }

  function handleUseTelemetry() {
    setUseManual(false);
    if (typeof lon === 'number' && typeof lat === 'number') {
      setCameraTarget({ lon, lat, alt: 1500 });
      setCameraKey(k => k + 1);
    }
  }

  return (
    <Viewer
      style={{ overflow: "hidden" }}
      geocoder={false}
      timeline={false}
      animation={false}
      fullscreenButton={false}
      homeButton={false}
      imageryProvider={imageryProvider}
      ref={viewerRef}
    >
      {/* Center camera on the current lon/lat once the Cesium Viewer is ready */}
      {/** When the underlying cesiumElement becomes available, set the camera view. */}
      <div style={{ position: 'absolute', right: 12, bottom: 12, zIndex: 999, background: 'rgba(255,255,255,0.95)', padding: 10, borderRadius: 6, boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <label style={{ fontSize: 12 }}>Lat</label>
          <input value={manualLatInput} onChange={e => setManualLatInput(e.target.value)} style={{ width: 100 }} />
          <label style={{ fontSize: 12 }}>Lon</label>
          <input value={manualLonInput} onChange={e => setManualLonInput(e.target.value)} style={{ width: 100 }} />
          <button onClick={handleSetPin}>Set Pin</button>
          <button onClick={handleUseTelemetry}>Use Telemetry</button>
        </div>
      </div>

      {cameraTarget && (
        <CameraFlyTo key={cameraKey} destination={Cartesian3.fromDegrees(cameraTarget.lon, cameraTarget.lat, cameraTarget.alt)} duration={1.2} />
      )}

      <Entity
        name="Rover"
        position={Cartesian3.fromDegrees(useManual ? manualLon : lon, useManual ? manualLat : lat, 0)}
        description={"Lat: " + (useManual ? manualLat : lat).toFixed(7) + "°, Lon: " + (useManual ? manualLon : lon).toFixed(7) + "°, Heading: " + heading.toFixed(0) + "°"}
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