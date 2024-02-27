import React from "react";
import { Viewer, Globe, Scene, Primitive, Cesium3DTileset, Entity, PointGraphics, ImageryLayer, Polyline, PolylineGraphics } from "resium";
import { IonResource, CesiumTerrainProvider, Cartesian3, Ion, ArcGisMapServerImageryProvider, OpenStreetMapImageryProvider } from "cesium"
import { useSelector } from "react-redux";
import { selectRoverLatitude, selectRoverLongitude } from "../../store/telemetrySlice";
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NjAyNDE4MS03YzQ5LTQ3YWEtYTA3NS0xZmNlMmMzNjA4MDAiLCJpZCI6MTgwNDExLCJpYXQiOjE3MDA4MDYzODF9.wQNIlvboVB7Zo5qVFUXj2jUMfJRrK_zdvBEp2INt1Kg";

class TestEntity extends React.Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { counter: 0 };
  }

  render() {
    setInterval(() => { 
      this.setState({ counter: this.state.counter + 0.00000050053768 });
    }, 100);
    return <Entity
      name="Rover"
      position={Cartesian3.fromDegrees(-119 + this.state.counter, 48, 0)}
      point={{ pixelSize: 20 }}
      description={"Lat: " + (-119 + this.state.counter).toFixed(5) + ", Lon: 48"}
      selected
      tracked
    />;
  }
}

function Map() {  
  const lat = useSelector(selectRoverLatitude);
  const long = useSelector(selectRoverLongitude);
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
      style={{overflow:"hidden"}}
      geocoder={false}
      timeline={false}
      animation={false}
      fullscreenButton={false}
      homeButton={false}
    >
      <TestEntity>
      </TestEntity>
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