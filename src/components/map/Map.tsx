import React from 'react'
import {Viewer, Entity, PointGraphics, LabelGraphics, ImageryLayer, ModelGraphics} from 'resium'
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
  type Viewer as CesiumViewer,
} from 'cesium'
import {useSelector, useDispatch} from 'react-redux'
import {
  selectRoverLatitude,
  selectRoverLongitude,
  selectRoverHeading,
} from '../../store/telemetrySlice.js'
import {
  addPin,
  removePin,
  togglePinSelection,
  clearSelectedPins,
  resetPinCounter,
  selectAllPins,
  selectSelectedPins,
} from '../../store/mapSlice.js'
import {COLOR_OPTIONS, MAP_TILES, MIN_DEGREES} from './MapConsts.js'
import './Map.css'

import robotModel from '../../../assets/Dozer.glb'
Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_ACCESS_TOKEN

type Pin = {
  id: number
  lat: number
  lon: number
  label: string
}

type LastPickedCoord = {
  lat: number
  lon: number
  distance: number
  t: number
}

function Map() {
  const telemetryLat = useSelector(selectRoverLatitude as (state: unknown) => number)
  const telemetryLon = useSelector(selectRoverLongitude as (state: unknown) => number)
  const lat = typeof telemetryLat === 'number' ? telemetryLat : 47.655548
  const lon = typeof telemetryLon === 'number' ? telemetryLon : -122.3032
  const heading = useSelector(selectRoverHeading as (state: unknown) => number)

  const viewerRef = React.useRef<{cesiumElement?: CesiumViewer | null} | null>(null)
  const rightClickHandlerRef = React.useRef<ScreenSpaceEventHandler | null>(null)

  const [manualLatInput, setManualLatInput] = React.useState('47.6061')
  const [manualLonInput, setManualLonInput] = React.useState('-122.3328')

  const [manualLat, setManualLat] = React.useState(47.6061)
  const [manualLon, setManualLon] = React.useState(-122.3328)
  const [useManual, setUseManual] = React.useState(false)

  const [lastPickedCoord, setLastPickedCoord] = React.useState<LastPickedCoord | null>(null)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const dispatch = useDispatch()
  const pins = useSelector(selectAllPins as (state: unknown) => Pin[])
  const selectedPins = useSelector(selectSelectedPins as (state: unknown) => number[])

  const imageryProvider = React.useMemo(
    () =>
      ArcGisMapServerImageryProvider.fromUrl(
        'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
      ),
    []
  )

  const [activeMapIndex, setActiveMapIndex] = React.useState<number | null>(null)
  const [activeLocalProvider, setActiveLocalProvider] =
    React.useState<SingleTileImageryProvider | null>(null)

  React.useEffect(() => {
    let mounted = true
    async function createProviderAsync() {
      setActiveLocalProvider(null)
      if (activeMapIndex === null) return

      const tile = MAP_TILES[activeMapIndex]
      if (!tile?.bounds) return

      let {west, south, east, north} = tile.bounds

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
        await new Promise<void>((resolve, reject) => {
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
  }, [activeMapIndex])

  const chooseMap = React.useCallback((latDeg: number, lonDeg: number): number | null => {
    if (typeof latDeg !== 'number' || typeof lonDeg !== 'number') return null
    for (let i = 0; i < MAP_TILES.length; i++) {
      const t = MAP_TILES[i]
      if (!t.bounds) continue
      const {west, south, east, north} = t.bounds
      if (lonDeg >= west && lonDeg <= east && latDeg >= south && latDeg <= north) return i
    }
    return null
  }, [])

  React.useEffect(() => {
    const currentLat = useManual ? manualLat : lat
    const currentLon = useManual ? manualLon : lon
    const idx = chooseMap(currentLat, currentLon)
    if (idx !== activeMapIndex) setActiveMapIndex(idx)
  }, [lat, lon, useManual, manualLat, manualLon, chooseMap, activeMapIndex])

  React.useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement
    if (!viewer) return

    const centerLon = useManual ? manualLon : lon
    const centerLat = useManual ? manualLat : lat

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
  }, [viewerRef, useManual, manualLat, manualLon, lat, lon])

  React.useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement
    if (!viewer) {
      return () => {
        if (rightClickHandlerRef.current) {
          rightClickHandlerRef.current.destroy()
          rightClickHandlerRef.current = null
        }
      }
    }
    if (rightClickHandlerRef.current) {
      return () => {
        if (rightClickHandlerRef.current) {
          rightClickHandlerRef.current.destroy()
          rightClickHandlerRef.current = null
        }
      }
    }
    const ellipsoid = viewer.scene.globe.ellipsoid
    const handler = new ScreenSpaceEventHandler(viewer.canvas)
    rightClickHandlerRef.current = handler
    console.log('[Map] RIGHT_CLICK handler attached')
    handler.setInputAction((movement: {position: Cartesian2}) => {
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
      setManualLat(latDeg)
      setManualLon(lonDeg)
      setUseManual(true)
      dispatch(addPin({lat: latDeg, lon: lonDeg}))
      setLastPickedCoord({lat: latDeg, lon: lonDeg, distance, t: Date.now()})
    }, ScreenSpaceEventType.RIGHT_CLICK)
    return () => {
      if (rightClickHandlerRef.current) {
        rightClickHandlerRef.current.destroy()
        rightClickHandlerRef.current = null
      }
    }
  })

  function handleSetPin() {
    const parsedLat = parseFloat(manualLatInput)
    const parsedLon = parseFloat(manualLonInput)
    if (Number.isNaN(parsedLat) || Number.isNaN(parsedLon)) {
      setErrorMessage('Please enter valid numeric latitude and longitude')
      setTimeout(() => setErrorMessage(null), 5000)
      return
    }
    setErrorMessage(null)
    setManualLat(parsedLat)
    setManualLon(parsedLon)
    setUseManual(true)

    dispatch(addPin({lat: parsedLat, lon: parsedLon}))
  }

  function toggleSelectPin(id: number) {
    dispatch(togglePinSelection({pinId: id}))
  }

  function handleClearSelectedPins() {
    dispatch(clearSelectedPins())
  }

  function deletePin(id: number) {
    dispatch(removePin({pinId: id}))
  }

  function flyToPin(pin: Pin) {
    setManualLat(pin.lat)
    setManualLon(pin.lon)
    setUseManual(true)
  }

  function handleResetPinCounter() {
    dispatch(resetPinCounter())
  }

  return (
    <Viewer
      className="map-viewer"
      geocoder={false}
      timeline={false}
      animation={false}
      fullscreenButton={false}
      ref={viewerRef}>
      <ImageryLayer imageryProvider={imageryProvider} />
      {activeLocalProvider ? <ImageryLayer imageryProvider={activeLocalProvider} /> : null}

      <div className="map-controls">
        {errorMessage && <div className="map-error">{errorMessage}</div>}
        <div className="map-input-row">
          <div className="map-input-wrapper">
            <input
              value={manualLatInput}
              onChange={(e) => setManualLatInput(e.target.value)}
              className="map-input"
            />
          </div>
          <div className="map-input-wrapper">
            <input
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
              Last right-click: {lastPickedCoord.lat.toFixed(6)}°, {lastPickedCoord.lon.toFixed(6)}°
              {typeof lastPickedCoord.distance === 'number' && (
                <span>(≈ {Math.round(lastPickedCoord.distance)} m alt)</span>
              )}
            </div>
          )}
          <div className="map-pins-title">Recent pins</div>
          <div className="map-pins-list">
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
          </div>
          <div className="map-clear-button-wrapper">
            <button onClick={handleClearSelectedPins} className="map-clear-button">
              Clear Selected
            </button>
            <button onClick={handleResetPinCounter} className="map-clear-button">
              Reset Counter
            </button>
          </div>
        </div>
      </div>

      {pins.map((pin, i) => {
        const col = Color.fromCssColorString(COLOR_OPTIONS[i % COLOR_OPTIONS.length])
        return (
          <Entity
            key={pin.id}
            position={Cartesian3.fromDegrees(pin.lon, pin.lat, 0)}
            name={pin.label}>
            <PointGraphics color={col} pixelSize={14} outlineColor={Color.WHITE} outlineWidth={2} />
            <LabelGraphics
              text={pin.label}
              font="14px sans-serif"
              fillColor={Color.WHITE}
              pixelOffset={new Cartesian2(12, -12)}
            />
          </Entity>
        )
      })}

      <Entity
        name="Rover"
        position={Cartesian3.fromDegrees(
          useManual ? manualLon : lon,
          useManual ? manualLat : lat,
          0
        )}
        description={
          'Lat: ' +
          (useManual ? manualLat : lat).toFixed(7) +
          '°, Lon: ' +
          (useManual ? manualLon : lon).toFixed(7) +
          '°, Heading: ' +
          heading.toFixed(0) +
          '°'
        }
        selected
        tracked>
        <ModelGraphics uri={robotModel} maximumScale={0.01} />
      </Entity>
    </Viewer>
  )
}

export default Map
