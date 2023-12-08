import { Routes, Route, Navigate } from "react-router-dom";
import SciencePanel from "../science/SciencePanel";
import DeliveryPanel from "../delivery/DeliveryPanel";
import ServicingPanel from "../servicing/ServicingPanel";
import AutonomousPanel from "../autonomous/AutonomousPanel";
import HelpPanel from "../help/HelpPanel";
import LoggingPanel from "../logging/LoggingPannel";
import "./PanelContainer.css";

function PanelContainer() {
  return (
    <div className="panel-container">
      <Routes>
        <Route path="" element={<Navigate to="/science"/>}/> 

        <Route path="/science" element={<SciencePanel/>}/>

        <Route path="/delivery" element={<DeliveryPanel/>}/>

        <Route path="/servicing" element={<ServicingPanel/>}/>

        <Route path="/autonomous" element={<AutonomousPanel/>}/>

        <Route path="/telemetry" element={<TelemetryPanel/>}/>

        <Route path="/antenna"/>

        <Route path="/logging" element={<LoggingPanel/>}/>
        
        <Route path="/help" element={<HelpPanel/>}/>
      </Routes>
    </div>
  );
}

export default PanelContainer;
