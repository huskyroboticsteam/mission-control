import { Switch, Route, Redirect } from "react-router-dom";
import DeliveryPanel from "../delivery/DeliveryPanel";
import ServicingPanel from "../servicing/ServicingPanel";
import AutonomousPanel from "../autonomous/AutonomousPanel";
import TelemetryPanel from "../telemetry/TelemetryPanel";
import HelpPanel from "../help/HelpPanel";
import LoggingPanel from "../logging/LoggingPannel";
import "./PanelContainer.css";

function PanelContainer() {
  return (
    <div className="panel-container">
      <Switch>

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

        <Route path="/help">u
          <HelpPanel />
        </Route>

        <Route path="/logging">
          <LoggingPanel />
        </Route>

        <Redirect to="/delivery" />
      </Switch>
    </div>
  );
}

export default PanelContainer;
