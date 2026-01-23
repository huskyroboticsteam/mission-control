import React from 'react'
import {Viewer, Entity, PointGraphics, LabelGraphics, ImageryLayer} from 'resium'
import {
  Cartesian2,
  Cartesian3,
  Math as CesiumMath,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Ion,
  ArcGisMapServerImageryProvider,
  Color,
  SingleTileImageryProvider,
  Rectangle,
} from 'cesium'
import {useSelector, useDispatch} from 'react-redux'
import {
  selectRoverLatitude,
  selectRoverLongitude,
  selectRoverHeading,
} from '../../store/telemetrySlice'
import {
  addPin,
  removePin,
  togglePinSelection,
  clearSelectedPins,
  selectAllPins,
  selectSelectedPins,
} from '../../store/mapSlice'
import './Map.css'

const cesiumIonAccessToken = import.meta?.env?.VITE_CESIUM_ION_ACCESS_TOKEN
if (cesiumIonAccessToken) {
  Ion.defaultAccessToken = cesiumIonAccessToken
} else {
  console.warn(
    'Cesium Ion access token is not set. Define VITE_CESIUM_ION_ACCESS_TOKEN in your environment. Map will use ArcGIS imagery instead.'
  )
}

// Error Boundary for Viewer component
class ViewerErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError(error) {
    return {hasError: true}
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Map] Viewer Error Boundary caught:', error)
    console.error('[Map] Error stack:', error?.stack)
    console.error('[Map] Component stack:', errorInfo?.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="map-viewer"
          style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{textAlign: 'center', color: '#c00', padding: '20px'}}>
            <h3>Map Viewer Error</h3>
            <p>Failed to initialize Cesium map viewer. Please refresh the page.</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function Map() {
  const telemetryLat = useSelector(selectRoverLatitude)
  const telemetryLon = useSelector(selectRoverLongitude)
  const lat = typeof telemetryLat === 'number' ? telemetryLat : 47.655548
  const lon = typeof telemetryLon === 'number' ? telemetryLon : -122.3032
  const heading = useSelector(selectRoverHeading)

  const viewerRef = React.useRef(null)
  const rightClickHandlerRef = React.useRef(null)

  const [manualLatInput, setManualLatInput] = React.useState('47.6061')
  const [manualLonInput, setManualLonInput] = React.useState('-122.3328')
  const [useManual, setUseManual] = React.useState(false)
  const [cesiumReady, setCesiumReady] = React.useState(false)

  const [lastPickedCoord, setLastPickedCoord] = React.useState(null)
  const [errorMessage, setErrorMessage] = React.useState(null)
  const [viewerError, setViewerError] = React.useState(null)
  const [viewerKey, setViewerKey] = React.useState(0)

  // Ensure Cesium is initialized
  React.useEffect(() => {
    setCesiumReady(true)
  }, [])

  const handleViewerError = React.useCallback((error) => {
    console.error('[Map] Viewer error:', error)
    setViewerError('Failed to render map viewer: ' + (error?.message || 'Unknown error'))
    // Retry after 2 seconds
    setTimeout(() => {
      setViewerKey((k) => k + 1)
      setViewerError(null)
    }, 2000)
  }, [])

  const dispatch = useDispatch()
  const pins = useSelector(selectAllPins)
  const selectedPins = useSelector(selectSelectedPins)

  const imageryProvider = React.useMemo(
    () =>
      new ArcGisMapServerImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
      }),
    []
  )

  const [mapTiles] = React.useState(() => {
    return [
      {
        id: 0,
        name: 'Map 1',
        url: '/map-images/1.png',
        bounds: {west: -122.3113, south: 47.6571, east: -122.3087, north: 47.6589},
      },
      {
        id: 1,
        name: 'Map 2',
        url: '/map-images/2.png',
        bounds: {west: -122.3087, south: 47.6571, east: -122.3061, north: 47.6589},
      },
      {
        id: 2,
        name: 'Map 3',
        url: '/map-images/3.png',
        bounds: {west: -122.3061, south: 47.6571, east: -122.3035, north: 47.6589},
      },
      {
        id: 3,
        name: 'Map 4',
        url: '/map-images/4.png',
        bounds: {west: -122.3035, south: 47.6571, east: -122.3009, north: 47.6589},
      },
      {
        id: 4,
        name: 'Map 5',
        url: '/map-images/5.png',
        bounds: {west: -122.3113, south: 47.6553, east: -122.3087, north: 47.6571},
      },
      {
        id: 5,
        name: 'Map 6',
        url: '/map-images/6.png',
        bounds: {west: -122.3087, south: 47.6553, east: -122.3061, north: 47.6571},
      },
      {
        id: 6,
        name: 'Map 7',
        url: '/map-images/7.png',
        bounds: {west: -122.3061, south: 47.6553, east: -122.3035, north: 47.6571},
      },
      {
        id: 7,
        name: 'Map 8',
        url: '/map-images/8.png',
        bounds: {west: -122.3035, south: 47.6553, east: -122.3009, north: 47.6571},
      },
      {
        id: 8,
        name: 'Map 9',
        url: '/map-images/9.png',
        bounds: {west: -122.3113, south: 47.65359, east: -122.3087, north: 47.6553},
      },
      {
        id: 9,
        name: 'Map 10',
        url: '/map-images/10.png',
        bounds: {west: -122.3087, south: 47.65359, east: -122.3061, north: 47.6553},
      },
      {
        id: 10,
        name: 'Map 11',
        url: '/map-images/11.png',
        bounds: {west: -122.3061, south: 47.65359, east: -122.3035, north: 47.6553},
      },
      {
        id: 11,
        name: 'Map 12',
        url: '/map-images/12.png',
        bounds: {west: -122.3035, south: 47.65359, east: -122.3009, north: 47.6553},
      },
      {
        id: 12,
        name: 'Map 13',
        url: '/map-images/13.png',
        bounds: {west: -122.3113, south: 47.65174, east: -122.3087, north: 47.65359},
      },
      {
        id: 13,
        name: 'Map 14',
        url: '/map-images/14.png',
        bounds: {west: -122.3087, south: 47.65174, east: -122.3061, north: 47.65359},
      },
      {
        id: 14,
        name: 'Map 15',
        url: '/map-images/15.png',
        bounds: {west: -122.3061, south: 47.65174, east: -122.3035, north: 47.65359},
      },
      {
        id: 15,
        name: 'Map 16',
        url: '/map-images/16.png',
        bounds: {west: -122.3035, south: 47.65174, east: -122.3009, north: 47.65359},
      },
    ]
  })

  const [activeMapIndex, setActiveMapIndex] = React.useState(null)
  const [activeLocalProvider, setActiveLocalProvider] = React.useState(null)

  React.useEffect(() => {
    let mounted = true
    async function createProviderAsync() {
      setActiveLocalProvider(null)
      if (activeMapIndex === null) return

      const tile = mapTiles[activeMapIndex]
      if (!tile?.bounds) return

      let {west, south, east, north} = tile.bounds
      const MIN_DEGREES = 1e-5

      const minLon = Math.min(west, east)
      const maxLon = Math.max(west, east)
      const minLat = Math.min(south, north)
      const maxLat = Math.max(south, north)

      if (Math.abs(maxLon - minLon) < MIN_DEGREES) {
        const center = (minLon + maxLon) / 2
        west = center - MIN_DEGREES / 2
        east = center + MIN_DEGREES / 2
      } else {
        west = minLon
        east = maxLon
      }

      if (Math.abs(maxLat - minLat) < MIN_DEGREES) {
        const center = (minLat + maxLat) / 2
        south = center - MIN_DEGREES / 2
        north = center + MIN_DEGREES / 2
      } else {
        south = minLat
        north = maxLat
      }

      const origin = window?.location?.origin || ''
      const absUrl = origin + (tile.url?.startsWith('/') ? tile.url : `/${tile.url}`)
      console.log('[Map] Fetching local tile', absUrl)
      let resp
      try {
        resp = await fetch(absUrl, {method: 'GET', mode: 'cors'})
      } catch (e) {
        console.warn('[Map] fetch failed for', absUrl, e)
        return
      }
      if (!resp?.ok) {
        console.warn('[Map] non-OK response', resp?.status, resp?.statusText)
        return
      }
      if (!mounted) return

      const blob = await resp.blob()
      const blobUrl = URL.createObjectURL(blob)
      const img = new Image()
      img.crossOrigin = 'anonymous'
      let loaded = false
      try {
        await new Promise((resolve, reject) => {
          img.onload = () => {
            loaded = true
            resolve()
          }
          img.onerror = (err) => reject(err)
          img.src = blobUrl
        })
      } catch (e) {
        console.warn('[Map] image load failed', absUrl, e)
      }
      const tileWidth = loaded ? img.naturalWidth : undefined
      const tileHeight = loaded ? img.naturalHeight : undefined
      URL.revokeObjectURL(blobUrl)
      if (!mounted) return
      try {
        const provider = new SingleTileImageryProvider({
          url: absUrl,
          rectangle: Rectangle.fromDegrees(west, south, east, north),
          tileWidth,
          tileHeight,
        })
        console.log('[Map] Local imagery provider created', {
          tileWidth,
          tileHeight,
          bounds: {west, south, east, north},
        })
        setActiveLocalProvider(provider)
      } catch (e) {
        console.error('[Map] Failed creating SingleTileImageryProvider', e)
      }
    }

    createProviderAsync()
    return () => {
      mounted = false
    }
  }, [activeMapIndex, mapTiles])

  const chooseMap = React.useCallback(
    (latDeg, lonDeg) => {
      if (typeof latDeg !== 'number' || typeof lonDeg !== 'number') return null
      for (let i = 0; i < mapTiles.length; i++) {
        const t = mapTiles[i]
        if (!t.bounds) continue
        const {west, south, east, north} = t.bounds
        if (lonDeg >= west && lonDeg <= east && latDeg >= south && latDeg <= north) return i
      }
      return null
    },
    [mapTiles]
  )

  React.useEffect(() => {
    const currentLat = useManual ? parseFloat(manualLatInput) : lat
    const currentLon = useManual ? parseFloat(manualLonInput) : lon
    const idx = chooseMap(currentLat, currentLon)
    if (idx !== activeMapIndex) setActiveMapIndex(idx)
  }, [lat, lon, useManual, manualLatInput, manualLonInput, chooseMap, activeMapIndex])

  React.useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement
    if (!viewer) return

    const centerLon = useManual ? parseFloat(manualLonInput) : lon
    const centerLat = useManual ? parseFloat(manualLatInput) : lat

    if (
      typeof centerLon === 'number' &&
      typeof centerLat === 'number' &&
      !Number.isNaN(centerLon) &&
      !Number.isNaN(centerLat)
    ) {
      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(centerLon, centerLat, 1500),
        duration: 1.2,
      })
    }
  }, [viewerRef, useManual, manualLatInput, manualLonInput, lat, lon])

  React.useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement
    if (!viewer) {
      return
    }
    if (rightClickHandlerRef.current) {
      return
    }
    const ellipsoid = viewer.scene.globe.ellipsoid
    const handler = new ScreenSpaceEventHandler(viewer.canvas)
    rightClickHandlerRef.current = handler
    console.log('[Map] RIGHT_CLICK handler attached')
    handler.setInputAction((movement) => {
      const cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid)
      if (!cartesian) return
      const cartographic = ellipsoid.cartesianToCartographic(cartesian)
      const lonDeg = CesiumMath.toDegrees(cartographic.longitude)
      const latDeg = CesiumMath.toDegrees(cartographic.latitude)
      const camPos = viewer.camera.positionWC
      const surfacePos = ellipsoid.scaleToGeodeticSurface(camPos)
      let distance = 0
      if (surfacePos) {
        distance = Cartesian3.distance(camPos, surfacePos)
      }
      setManualLatInput(latDeg.toString())
      setManualLonInput(lonDeg.toString())
      setUseManual(true)
      dispatch(addPin({lat: latDeg, lon: lonDeg}))
      setLastPickedCoord({lat: latDeg, lon: lonDeg, distance, t: Date.now()})
    }, ScreenSpaceEventType.RIGHT_CLICK)
  })

  React.useEffect(() => {
    return () => {
      if (rightClickHandlerRef.current) {
        rightClickHandlerRef.current.destroy()
        rightClickHandlerRef.current = null
      }
    }
  }, [])

  function handleSetPin() {
    const parsedLat = parseFloat(manualLatInput)
    const parsedLon = parseFloat(manualLonInput)
    if (Number.isNaN(parsedLat) || Number.isNaN(parsedLon)) {
      setErrorMessage('Please enter valid numeric latitude and longitude')
      setTimeout(() => setErrorMessage(null), 5000)
      return
    }
    setErrorMessage(null)
    setUseManual(true)

    dispatch(addPin({lat: parsedLat, lon: parsedLon}))
  }

  function toggleSelectPin(id) {
    dispatch(togglePinSelection({pinId: id}))
  }

  function handleClearSelectedPins() {
    dispatch(clearSelectedPins())
  }

  function deletePin(id) {
    dispatch(removePin({pinId: id}))
  }

  function flyToPin(pin) {
    setManualLatInput(pin.lat.toString())
    setManualLonInput(pin.lon.toString())
    setUseManual(true)
  }

  if (viewerError) {
    return (
      <div
        className="map-viewer"
        style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center', color: '#c00', padding: '20px'}}>
          <h3>Map Error</h3>
          <p>{viewerError}</p>
          <p>Please check the browser console for more details.</p>
        </div>
      </div>
    )
  }

  if (!cesiumReady) {
    return (
      <div
        className="map-viewer"
        style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center', color: '#666', padding: '20px'}}>
          <p>Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <ViewerErrorBoundary>
      <Viewer
        className="map-viewer"
        geocoder={false}
        timeline={false}
        animation={false}
        fullscreenButton={false}
        imageryProvider={imageryProvider}
        ref={viewerRef}
        onRenderError={(error) => {
          console.error('[Map] Viewer render error:', error)
          console.error('[Map] Error details:', {
            message: error?.message,
            stack: error?.stack,
            name: error?.name,
          })
          setViewerError('Failed to render map viewer: ' + (error?.message || 'Unknown error'))
        }}>
        {activeLocalProvider ? <ImageryLayer imageryProvider={activeLocalProvider} /> : null}

        <div className="map-controls">
          {errorMessage && <div className="map-error">{errorMessage}</div>}

          <div className="map-input-row">
            <div className="map-input-wrapper">
              <input
                placeholder="Latitude"
                value={manualLatInput}
                onChange={(e) => setManualLatInput(e.target.value)}
                className="map-input"
              />
            </div>
            <div className="map-input-wrapper">
              <input
                placeholder="Longitude"
                value={manualLonInput}
                onChange={(e) => setManualLonInput(e.target.value)}
                className="map-input"
              />
            </div>
            <div className="map-button-wrapper">
              <button onClick={handleSetPin} className="map-button">
                Set Pin
              </button>
            </div>
          </div>

          <div className="map-pins-section">
            {lastPickedCoord && (
              <div className="map-last-click">
                Last right-click: {lastPickedCoord.lat.toFixed(6)}°,{' '}
                {lastPickedCoord.lon.toFixed(6)}°
                {typeof lastPickedCoord.distance === 'number' && (
                  <span style={{marginLeft: 6}}>
                    (≈ {Math.round(lastPickedCoord.distance)} m alt)
                  </span>
                )}
              </div>
            )}
            <div className="map-pins-title">Recent pins</div>
            {[...pins]
              .slice(-5)
              .reverse()
              .map((pin) => (
                <div key={pin.id} className="map-pin-item">
                  <input
                    type="checkbox"
                    checked={selectedPins.includes(pin.id)}
                    onChange={() => toggleSelectPin(pin.id)}
                  />
                  <div className="map-pin-info">
                    {pin.label}: {pin.lat.toFixed(6)}, {pin.lon.toFixed(6)}
                  </div>
                  <button onClick={() => flyToPin(pin)} className="map-pin-button">
                    Fly
                  </button>
                  <button onClick={() => deletePin(pin.id)} className="map-pin-button">
                    Delete
                  </button>
                </div>
              ))}
            <div className="map-clear-button-wrapper">
              <button onClick={handleClearSelectedPins} className="map-clear-button">
                Clear Selected
              </button>
            </div>
          </div>
        </div>

        {pins.map((pin, i) => {
          const colorOptions = ['#e6194b', '#ffe119', '#3cb44b', '#42d4f4', '#911eb4', '#f032e6']
          const col = Color.fromCssColorString(colorOptions[i % colorOptions.length])
          return (
            <Entity
              key={pin.id}
              position={Cartesian3.fromDegrees(pin.lon, pin.lat, 0)}
              name={pin.label}>
              <PointGraphics
                color={col}
                pixelSize={14}
                outlineColor={Color.WHITE}
                outlineWidth={2}
              />
              <LabelGraphics
                text={pin.label}
                font="14px sans-serif"
                fillColor={Color.WHITE}
                style={0}
                pixelOffset={new Cartesian2(12, -12)}
              />
            </Entity>
          )
        })}

        <Entity
          name="Rover"
          position={Cartesian3.fromDegrees(
            useManual ? parseFloat(manualLonInput) : lon,
            useManual ? parseFloat(manualLatInput) : lat,
            0
          )}
          description={
            'Lat: ' +
            (useManual ? parseFloat(manualLatInput) : lat).toFixed(7) +
            '°, Lon: ' +
            (useManual ? parseFloat(manualLonInput) : lon).toFixed(7) +
            '°, Heading: ' +
            heading.toFixed(0) +
            '°'
          }
          selected
          tracked>
          <PointGraphics
            color={Color.RED}
            pixelSize={20}
            outlineColor={Color.WHITE}
            outlineWidth={3}
          />
        </Entity>
      </Viewer>
    </ViewerErrorBoundary>
  )
}

export default Map
