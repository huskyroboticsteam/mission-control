import React from "react";
import { Viewer, Globe, Scene, Primitive, Cesium3DTileset, Entity, PointGraphics } from "resium";
import { IonResource, CesiumTerrainProvider, Cartesian3, Ion } from "cesium"
import { useSelector } from "react-redux";
import { selectRoverLatitude, selectRoverLongitude } from "../../store/telemetrySlice";
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NjAyNDE4MS03YzQ5LTQ3YWEtYTA3NS0xZmNlMmMzNjA4MDAiLCJpZCI6MTgwNDExLCJpYXQiOjE3MDA4MDYzODF9.wQNIlvboVB7Zo5qVFUXj2jUMfJRrK_zdvBEp2INt1Kg";
function Map() {  
  const lat = useSelector(selectRoverLatitude);
  const long = useSelector(selectRoverLongitude);
  
  let viewer; // This will be raw Cesium's Viewer object.

  const handleReady = tileset => {
    if (viewer) {
      viewer.zoomTo(tileset);
    }
  };
  
  // return (
  //   <Viewer  
  //       style={{overflow:"hidden"}}
  //       baseLayerPicker={false} 
  //       geocoder={false}
  //       timeline={false}
  //       animation={false}
  //       fullscreenButton={false}
  //       homeButton={false}
  //       scene3DOnly
  //     >
  //     <Scene
  //         debugShowFramesPerSecond = {true}
  //     />
  //     <Globe />
  //     <Entity
  //       name="Rover"
  //       point={{ pixelSize: 100 }}
  //       position={Cartesian3.fromDegrees(lat, long, 1000)}
  //     />
  //   </Viewer>
  // );
  return (
    <Viewer  
      style={{overflow:"hidden"}}
      baseLayerPicker={false} 
      geocoder={false}
      timeline={false}
      animation={false}
      fullscreenButton={false}
      homeButton={false}
      scene3DOnly
      ref={e => {
        viewer = e && e.cesiumElement;
      }}
    >
      <Cesium3DTileset url={IonResource.fromAssetId(2275207)} onReady={handleReady} />
      <Entity
        name="Rover"
        point={{ pixelSize: 100 }}
        position={Cartesian3.fromDegrees(lat, long, 0)}
      />
    </Viewer>
  );
}

export default Map;