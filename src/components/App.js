import Sidebar from "./Sidebar";
import { Switch, Route, Redirect } from "react-router-dom";
import MainView from "./MainView";
import ArmView from "./ArmView";
import CameraView from "./CameraView";
import MapView from "./MapView";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Sidebar />

      <main>
        <Switch>
          <Route path="/main">
            <MainView />
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

          <Redirect to="/main" />
        </Switch>
      </main>
    </div >
  );
}

export default App;
