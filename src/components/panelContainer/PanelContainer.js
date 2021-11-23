import { Switch, Route, Redirect } from "react-router-dom";
import SciencePanel from "../science/SciencePanel";
import HelpPanel from "../help/HelpPanel";
import "./PanelContainer.css";

function PanelContainer({ cameraStreamFrameData }) {
  return (
    <div className="panelContainer">
      <Switch>
        <Route path="/science">
          <SciencePanel cameraStreamFrameData={cameraStreamFrameData} />
        </Route>

        <Route path="/delivery">
        </Route>

        <Route path="/servicing">
        </Route>

        <Route path="/autonomous">
        </Route>

        <Route path="/telemetry">
        </Route>

        <Route path="/antenna">
        </Route>

        <Route path="/help">
          <HelpPanel />
        </Route>

        <Redirect to="/science" />
      </Switch>
    </div>
  );
}

export default PanelContainer;
