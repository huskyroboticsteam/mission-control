import { Viewer, Globe, Scene, Primitive, Cesium3DTileset, Entity, PointGraphics } from "resium";
import { IonResource, CesiumTerrainProvider, Cartesian3, Ion } from "cesium"
const options = {accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NjAyNDE4MS03YzQ5LTQ3YWEtYTA3NS0xZmNlMmMzNjA4MDAiLCJpZCI6MTgwNDExLCJpYXQiOjE3MDA4MDYzODF9.wQNIlvboVB7Zo5qVFUXj2jUMfJRrK_zdvBEp2INt1Kg", server: Ion.defaultServer}
const ionTerrainProvider = IonResource.fromAssetId(2275207, options);
const terrainProvider = new CesiumTerrainProvider({url: ionTerrainProvider});
const position = Cartesian3.fromDegrees(-74.0707383, 40.7117244);
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NjAyNDE4MS03YzQ5LTQ3YWEtYTA3NS0xZmNlMmMzNjA4MDAiLCJpZCI6MTgwNDExLCJpYXQiOjE3MDA4MDYzODF9.wQNIlvboVB7Zo5qVFUXj2jUMfJRrK_zdvBEp2INt1Kg";

function Map() {
  
  return (
    <Viewer  
        style={{overflow:"hidden"}}
        baseLayerPicker={false} 
        geocoder={false}
        timeline={false}
        animation={false}
        fullscreenButton={false}
        homeButton={false}
        terrainProvider={terrainProvider}
      >
      <Scene>
        <Globe depthTestAgainstTerrain={true}></Globe>
        <Entity position={position} name="New York" description="Hello, world.">
            <PointGraphics pixelSize={10} />
        </Entity>
        <Primitive>
          <Cesium3DTileset url = { IonResource.fromAssetId(2275207, options) }/>
        </Primitive>
      </Scene>
    </Viewer>

  );
}

export default Map;