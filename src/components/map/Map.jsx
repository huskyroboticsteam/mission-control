import React from "react";
import { Viewer, Globe, Scene, Primitive, Cesium3DTileset, Entity, PointGraphics } from "resium";
import { IonResource, CesiumTerrainProvider, Cartesian3, Ion } from "cesium"
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
      point={{ pixelSize: 100 }}
      description={"Lat: " + (-119 + this.state.counter).toFixed(5) + ", Lon: 48"}
    />;
  }
}

function Map() {  
  const lat = useSelector(selectRoverLatitude);
  const long = useSelector(selectRoverLongitude);
  
  return (
    <Viewer  
      style={{overflow:"hidden"}}
      geocoder={false}
      timeline={false}
      animation={false}
      fullscreenButton={false}
      homeButton={false}
    >
      {/* <ImageryLayer imageryProvider={
        new Cesium3DTileset.UrlTemplateImageryProvider({
          url: 'http://localhost:8080/data/tiles/{z}/{x}/{y}.jpg'
        })  
      } /> */}
      <TestEntity />
      
    </Viewer>
  );
}

export default Map;