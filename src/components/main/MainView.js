import { Switch, Route, Redirect } from "react-router-dom";
import HomeView from "../home/HomeView";
import ArmView from "../arm/ArmView";
import CameraView from "../camera/CameraView";
import MapView from "../map/MapView";
import ScienceView from "../science//ScienceView";
import "./MainView.css";

function MainView() {
  return (
    <div className="mainView">
      <Switch>
        <Route path="/home">
          <HomeView />
        </Route>

        <Route path="/arm">
          <ArmView />
        </Route>

        <Route path="/camera">
          <CameraView />
        </Route>

        <Route path="/map">
          <MapView />
        </Route>

        <Route path="/science">
          <ScienceView />
        </Route>

        <Redirect to="/home" />
      </Switch>
    </div>
  );
}

export default MainView;
