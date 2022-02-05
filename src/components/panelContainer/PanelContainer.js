import { Switch, Route, Redirect } from "react-router-dom";
import SciencePanel from "../science/SciencePanel";
import DeliveryPanel from "../delivery/DeliveryPanel";
import ServicingPanel from "../servicing/ServicingPanel";
import AutonomousPanel from "../autonomous/AutonomousPanel";
import TelemetryPanel from "../telemetry/TelemetryPanel";
import HelpPanel from "../help/HelpPanel";
import "./PanelContainer.css";

function PanelContainer() {
  return (
    <div className="panel-container">
      <Switch>
        <Route path="/science">
          <SciencePanel />
        </Route>

        <Route path="/delivery">
          <DeliveryPanel />
        </Route>

        <Route path="/servicing">
          <ServicingPanel />
        </Route>

        <Route path="/autonomous">
          <AutonomousPanel />
        </Route>

        <Route path="/telemetry">
          <TelemetryPanel />
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
