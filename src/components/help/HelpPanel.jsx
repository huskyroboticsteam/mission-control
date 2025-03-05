import './HelpPanel.css'
import keyboardControls from './keyboardControls.png'
import standardDriveControls from './standardDriveControls.png'
import tankDriveControls from './tankDriveControls.png'
import armControls from './armControls.png'

function HelpPanel() {
  return (
    <div className="help-panel">
      <img src={standardDriveControls} alt="standard drive controls" />
      <img src={tankDriveControls} alt="tank drive controls" />
      <img src={armControls} alt="arm controls" />
      <img src={keyboardControls} alt="keyboard controls" />
    </div>
  )
}

export default HelpPanel
