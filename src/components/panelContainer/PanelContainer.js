import { Routes, Route, Navigate } from "react-router-dom";
import SciencePanel from "../science/SciencePanel";
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
      <Routes>
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

        <Route path="/logging">
          <LoggingPanel />
        </Route>

        <Navigate to="/science" />
      </Routes>
    </div>
  );
}

export default PanelContainer;
