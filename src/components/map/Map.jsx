import React from "react";
import { Viewer, Globe, Scene, Primitive, Cesium3DTileset, Entity, PointGraphics, LabelGraphics, ImageryLayer, Polyline, PolylineGraphics, BillboardGraphics, ModelGraphics, CameraFlyTo } from "resium";
import { IonResource, CesiumTerrainProvider, Cartesian3, Ion, ArcGisMapServerImageryProvider, OpenStreetMapImageryProvider, Color, SingleTileImageryProvider, Rectangle } from "cesium";
import { useSelector } from "react-redux";
import { selectRoverLatitude, selectRoverLongitude, selectRoverYaw, selectRoverHeading } from "../../store/telemetrySlice";
import { radians } from '@math.gl/core';

import robotModel from "../../../assets/Dozer.glb"
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NjAyNDE4MS03YzQ5LTQ3YWEtYTA3NS0xZmNlMmMzNjA4MDAiLCJpZCI6MTgwNDExLCJpYXQiOjE3MDA4MDYzODF9.wQNIlvboVB7Zo5qVFUXj2jUMfJRrK_zdvBEp2INt1Kg";

function Map() {
  const telemetryLat = useSelector(selectRoverLatitude);
  const telemetryLon = useSelector(selectRoverLongitude);
  const lat = typeof telemetryLat === 'number' ? telemetryLat : 47.655548;
  const lon = typeof telemetryLon === 'number' ? telemetryLon : -122.303200;
  const heading = useSelector(selectRoverHeading);

  const viewerRef = React.useRef(null);
  const didSetCamera = React.useRef(false);

  const [manualLatInput, setManualLatInput] = React.useState("47.6061");
  const [manualLonInput, setManualLonInput] = React.useState("-122.3328");

  const [manualLat, setManualLat] = React.useState(47.6061);
  const [manualLon, setManualLon] = React.useState(-122.3328);
  const [useManual, setUseManual] = React.useState(false);

  const [cameraTarget, setCameraTarget] = React.useState(null);
  const [cameraKey, setCameraKey] = React.useState(0);

  const [pins, setPins] = React.useState([]);
  const pinIdRef = React.useRef(1);
  
  const [selectedPins, setSelectedPins] = React.useState(new Set());

  const imageryProvider = new ArcGisMapServerImageryProvider({
    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
  });


  const [mapTiles, setMapTiles] = React.useState(() => {
    return [
      { id: 0, name: 'Map 1', url: '/map-images/1.png', bounds: { west: -122.3113, south: 47.6571, east: -122.3087, north: 47.6589 } },
      { id: 1, name: 'Map 2', url: '/map-images/2.png', bounds: { west: -122.3087, south: 47.6571, east: -122.3061, north: 47.6589 } },
      { id: 2, name: 'Map 3', url: '/map-images/3.png', bounds: { west: -122.3061, south: 47.6571, east: -122.3035, north: 47.6589 } },
      { id: 3, name: 'Map 4', url: '/map-images/4.png', bounds: { west: -122.3035, south: 47.6571, east: -122.3009, north: 47.6589 } },
      { id: 4, name: 'Map 5', url: '/map-images/5.png', bounds: { west: -122.3113, south: 47.6553, east: -122.3087, north: 47.6571 } },
      { id: 5, name: 'Map 6', url: '/map-images/6.png', bounds: { west: -122.3087, south: 47.6553, east: -122.3061, north: 47.6571 } },
      { id: 6, name: 'Map 7', url: '/map-images/7.png', bounds: { west: -122.3061, south: 47.6553, east: -122.3035, north: 47.6571 } },
      { id: 7, name: 'Map 8', url: '/map-images/8.png', bounds: { west: -122.3035, south: 47.6553, east: -122.3009, north: 47.6571 } },
      { id: 8, name: 'Map 9', url: '/map-images/9.png', bounds: { west: -122.3113, south: 47.65359, east: -122.3087, north: 47.6553 } },
      { id: 9, name: 'Map 10', url: '/map-images/10.png', bounds: { west: -122.3087, south: 47.65359, east: -122.3061, north: 47.6553 } },
      { id: 10, name: 'Map 11', url: '/map-images/11.png', bounds: { west: -122.3061, south: 47.65359, east: -122.3035, north: 47.6553 } },
      { id: 11, name: 'Map 12', url: '/map-images/12.png', bounds: { west: -122.3035, south: 47.65359, east: -122.3009, north: 47.6553 } },
      { id: 12, name: 'Map 13', url: '/map-images/13.png', bounds: { west: -122.3113, south: 47.65174, east: -122.3087, north: 47.65359 } },
      { id: 13, name: 'Map 14', url: '/map-images/14.png', bounds: { west: -122.3087, south: 47.65174, east: -122.3061, north: 47.65359 } },
      { id: 14, name: 'Map 15', url: '/map-images/15.png', bounds: { west: -122.3061, south: 47.65174, east: -122.3035, north: 47.65359 } },
      { id: 15, name: 'Map 16', url: '/map-images/16.png', bounds: { west: -122.3035, south: 47.65174, east: -122.3009, north: 47.65359 } },
    ];
  });

  function setTileBounds(index, bounds) {
    if (typeof index !== 'number' || index < 0 || index >= 16) return;
    setMapTiles(prev => {
      const next = prev.slice();
      next[index] = { ...next[index], bounds };
      return next;
    });
  }

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    window.setTileBounds = setTileBounds;
    // set active map index manually: setActiveMapIndex(0)
    window.setActiveMapIndex = (i) => setActiveMapIndex(i);
    return () => {
      try { delete window.setTileBounds; } catch (e) {}
      try { delete window.setActiveMapIndex; } catch (e) {}
    };
  }, [setTileBounds]);

  const [activeMapIndex, setActiveMapIndex] = React.useState(null);
  const [autoSelectMap, setAutoSelectMap] = React.useState(true);

  const [activeLocalProvider, setActiveLocalProvider] = React.useState(null);
  const [localProviderError, setLocalProviderError] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    async function createProviderAsync() {
      try {
        setLocalProviderError(null);
        setActiveLocalProvider(null);

        if (activeMapIndex === null) return;
        const tile = mapTiles[activeMapIndex];
        if (!tile || !tile.bounds) return;

        let { west, south, east, north } = tile.bounds;
        if ([west, south, east, north].some(v => typeof v !== 'number' || Number.isNaN(v))) {
          const msg = `Invalid bounds for tile ${activeMapIndex}`;
          console.error(msg, tile.bounds);
          setLocalProviderError(msg);
          return;
        }

        const MIN_DEGREES = 1e-5;
        const minLon = Math.min(west, east);
        const maxLon = Math.max(west, east);
        const minLat = Math.min(south, north);
        const maxLat = Math.max(south, north);

        if (Math.abs(maxLon - minLon) < MIN_DEGREES) {
          const center = (minLon + maxLon) / 2;
          west = center - MIN_DEGREES / 2;
          east = center + MIN_DEGREES / 2;
        } else {
          west = minLon; east = maxLon;
        }

        if (Math.abs(maxLat - minLat) < MIN_DEGREES) {
          const center = (minLat + maxLat) / 2;
          south = center - MIN_DEGREES / 2;
          north = center + MIN_DEGREES / 2;
        } else {
          south = minLat; north = maxLat;
        }

        const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '';
        const absUrl = origin + (tile.url && tile.url.startsWith('/') ? tile.url : ('/' + (tile.url || '')));
        console.debug('Attempting to load local map image', absUrl, { west, south, east, north });

        let resp = null;
        try {
          resp = await fetch(absUrl, { method: 'GET', mode: 'cors' });
        } catch (err) {
          console.warn('Fetch error for', absUrl, err);
          resp = null;
        }

        if (!resp || !resp.ok) {
          const statusText = resp ? `${resp.status} ${resp.statusText}` : 'network/error';
          const msg = `Image fetch failed: ${statusText}`;
          console.error(msg, absUrl);
          if (!mounted) return;
          setLocalProviderError(msg);
          return;
        }

        const contentType = resp.headers.get('content-type') || '';
        if (!contentType.startsWith('image')) {
          const msg = `Unexpected content-type: ${contentType}`;
          console.error(msg, absUrl);
          if (!mounted) return;
          setLocalProviderError(msg);
          return;
        }

        if (!mounted) return;

        const blob = await resp.blob();
        const blobUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.crossOrigin = 'anonymous';

        const loadPromise = new Promise((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = (e) => reject(new Error('Local image failed to load: ' + e));
        });
        img.src = blobUrl;
        try {
          await loadPromise;
        } catch (err) {
          const msg = String(err);
          console.error('Image load failed for', blobUrl, err);
          if (!mounted) return;
          setLocalProviderError(msg);
          URL.revokeObjectURL(blobUrl);
          return;
        }

        if (!mounted) {
          URL.revokeObjectURL(blobUrl);
          return;
        }

        const tileWidth = img.naturalWidth || undefined;
        const tileHeight = img.naturalHeight || undefined;
        URL.revokeObjectURL(blobUrl);

        try {
          const provider = new SingleTileImageryProvider({
            url: absUrl,
            rectangle: Rectangle.fromDegrees(west, south, east, north),
            tileWidth,
            tileHeight,
          });
          setActiveLocalProvider(provider);
        } catch (err) {
          console.error('Failed to create local provider', err, err?.message, err?.stack);
          if (!mounted) return;
          setLocalProviderError(String(err));
        }
      } catch (err) {
        console.error('Failed to create local provider', err);
        if (!mounted) return;
        setLocalProviderError(String(err));
      }
    }

    createProviderAsync();
    return () => { mounted = false; };
  }, [activeMapIndex, mapTiles]);

  function chooseMap(latDeg, lonDeg) {
    if (typeof latDeg !== 'number' || typeof lonDeg !== 'number') return null;
    const eps = 1e-6;
    for (let i = 0; i < mapTiles.length; i++) {
      const t = mapTiles[i];
      if (!t.bounds) continue;
      const { west, south, east, north } = t.bounds;
      if (lonDeg >= (west - eps) && lonDeg <= (east + eps) && latDeg >= (south - eps) && latDeg <= (north + eps)) return i;
    }
    return null;
  }

  React.useEffect(() => {
    if (!autoSelectMap) return;
    const currentLat = useManual ? manualLat : lat;
    const currentLon = useManual ? manualLon : lon;
    const idx = chooseMap(currentLat, currentLon);
    if (idx !== activeMapIndex) setActiveMapIndex(idx);
  }, [lat, lon, useManual, manualLat, manualLon, autoSelectMap, mapTiles, activeMapIndex]);

  const positions = Cartesian3.fromDegreesArray([
    -119, 48,
    -118.9998, 48,
    -118.999022, 47.999330,
    -118.998927, 47.999277,
    -118.998257, 47.998970,
  ]);

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
        {activeLocalProvider ? (
          <ImageryLayer imageryProvider={activeLocalProvider} />
        ) : null}
      
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
            <label style={{ fontSize: 12, color: "#000000" }}><input type="checkbox" checked={autoSelectMap} onChange={(e) => setAutoSelectMap(e.target.checked)} /> Auto-select map</label>
            <select value={activeMapIndex ?? ''} onChange={(e) => setActiveMapIndex(e.target.value === '' ? null : parseInt(e.target.value))}>
              <option value="">(none)</option>
              {mapTiles.map((t, idx) => (
                <option key={t.id} value={idx}>{t.name}</option>
              ))}
            </select>
          </div>
          {activeMapIndex !== null && !activeLocalProvider ? (
            <div style={{ color: '#b00', fontSize: 12, marginTop: 6 }}>Local map selected but unavailable (check filename/console)</div>
          ) : null}
        </div>

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

      {pins.map((pin, i) => {
        const colorOptions = ['#e6194b', '#ffe119', '#3cb44b', '#42d4f4', '#911eb4', '#f032e6'];
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