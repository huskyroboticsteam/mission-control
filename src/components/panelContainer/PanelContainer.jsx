import { Routes, Route, Navigate } from "react-router-dom";
import DeliveryPanel from "../delivery/DeliveryPanel";
import ServicingPanel from "../servicing/ServicingPanel";
import AutonomousPanel from "../autonomous/AutonomousPanel";
import TelemetryPanel from "../telemetry/TelemetryPanel";
import MapPanel from "../map/MapPanel"
import HelpPanel from "../help/HelpPanel";
import "./PanelContainer.css";

function PanelContainer() {
  return (
    <div className="panel-container">
      <Routes>
        <Route path="" element={<Navigate to="/delivery"/>}/> 

        <Route path="/delivery" element={<DeliveryPanel/>}/>

        <Route path="/servicing" element={<ServicingPanel/>}/>

        <Route path="/autonomous" element={<AutonomousPanel/>}/>

        <Route path="/telemetry" element={<TelemetryPanel/>}/>
        
        <Route path="/map" element={<MapPanel/>}/>
        
        <Route path="/help" element={<HelpPanel/>}/>
      </Routes>
    </div>
  );
}

export default PanelContainer;
