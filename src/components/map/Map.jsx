import React from "react";
import { Viewer, Globe, Scene, Primitive, Cesium3DTileset, Entity, PointGraphics, LabelGraphics, ImageryLayer, Polyline, PolylineGraphics, BillboardGraphics, ModelGraphics, CameraFlyTo } from "resium";
import { IonResource, CesiumTerrainProvider, Cartesian3, Ion, ArcGisMapServerImageryProvider, OpenStreetMapImageryProvider, Color } from "cesium";
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

  // dropped pins (allows multiple pins)
  const [pins, setPins] = React.useState([]);
  const pinIdRef = React.useRef(1);
  
  // selected pins for deletion (store ids in a Set)
  const [selectedPins, setSelectedPins] = React.useState(new Set());

  

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

    if (typeof centerLon === 'number' && typeof centerLat === 'number' && !Number.isNaN(centerLon) && !Number.isNaN(centerLat)) {
      try {
        viewer.camera.flyTo({ destination: Cartesian3.fromDegrees(centerLon, centerLat, 1500), duration: 1.2 });
      } catch (e) {
        console.error('camera.flyTo failed', e);
      }
    }
  }, [useManual, manualLat, manualLon, lat, lon]);

  function handleSetPin() {
    const parsedLat = parseFloat(manualLatInput);
    const parsedLon = parseFloat(manualLonInput);
    if (Number.isNaN(parsedLat) || Number.isNaN(parsedLon)) {
      alert('Please enter valid numeric latitude and longitude');
      return;
    }
    setManualLat(parsedLat);
    setManualLon(parsedLon);
    setUseManual(true);
    setCameraTarget({ lon: parsedLon, lat: parsedLat, alt: 1500 });
    setCameraKey(k => k + 1);
    const id = pinIdRef.current++;
    setPins(prev => [...prev, { id, lon: parsedLon, lat: parsedLat, label: `Pin ${id}` }]);
  }

  function toggleSelectPin(id) {
    setSelectedPins(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearSelectedPins() {
    setPins(prev => prev.filter(p => !selectedPins.has(p.id)));
    setSelectedPins(new Set());
  }

  function deletePin(id) {
    setPins(prev => prev.filter(p => p.id !== id));
    setSelectedPins(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function flyToPin(pin) {
    setCameraTarget({ lon: pin.lon, lat: pin.lat, alt: 1500 });
    setCameraKey(k => k + 1);
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
      {/* Add the local imagery layers */}
      
      {/* Center camera on the current lon/lat once the Cesium Viewer is ready */}
      {/** When the underlying cesiumElement becomes available, set the camera view. */}
      
      <div style={{ position: 'absolute', right: 12, bottom: 12, zIndex: 999, background: 'rgba(255,255,255,0.95)', padding: 10, borderRadius: 6, boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <input value={manualLatInput} onChange={e => setManualLatInput(e.target.value)} style={{ width: 160, height: 30, padding: 6, fontSize: 14 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <input value={manualLonInput} onChange={e => setManualLonInput(e.target.value)} style={{ width: 160, height: 30, padding: 6, fontSize: 14 }} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={handleSetPin} style={{ height: 34 }}>Set Pin</button>
          </div>
        </div>

        {/* Recent pins list (up to 5 latest) */}
        <div style={{ marginTop: 8, maxWidth: 420 }}>
          <div style={{ fontSize: 12, marginBottom: 6, color: "#000000"}}>Recent pins</div>
          {pins.slice(-5).reverse().map(pin => (
            <div key={pin.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4}}>
              <input type="checkbox" checked={selectedPins.has(pin.id)} onChange={() => toggleSelectPin(pin.id)} />
              <div style={{ flex: 1, fontSize: 13, color: "#000000" }}>{pin.label}: {pin.lat.toFixed(6)}, {pin.lon.toFixed(6)}</div>
              <button onClick={() => flyToPin(pin)} style={{ height: 28 }}>Fly</button>
              <button onClick={() => deletePin(pin.id)} style={{ height: 28 }}>Delete</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button onClick={clearSelectedPins} style={{ height: 32 }}>Clear Selected</button>
          </div>
        </div>
      </div>
      

      {cameraTarget && (
        <CameraFlyTo key={cameraKey} destination={Cartesian3.fromDegrees(cameraTarget.lon, cameraTarget.lat, cameraTarget.alt)} duration={1.2} />
      )}

      {/* Render dropped pins */}
      {pins.map((pin, i) => {
        const colorOptions = ['#e6194b', '#f58231', '#ffe119', '#bfef45', '#3cb44b', '#42d4f4', '#4363d8', '#911eb4', '#f032e6'];
        const col = Color.fromCssColorString(colorOptions[i % colorOptions.length]);
        return (
          <Entity key={pin.id} position={Cartesian3.fromDegrees(pin.lon, pin.lat, 0)} name={pin.label}>
            <PointGraphics color={col} pixelSize={14} outlineColor={Color.WHITE} outlineWidth={2} />
            <LabelGraphics text={pin.label} font="14px sans-serif" fillColor={Color.WHITE} style={0} pixelOffset={{ x: 12, y: -12 }} />
          </Entity>
        );
      })}

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