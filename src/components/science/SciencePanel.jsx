import React, {useEffect} from 'react'
import CameraStream from '../camera/CameraStream'
import './SciencePanel.css'
import {useDispatch, useSelector} from 'react-redux'
import {selectDrillIsEnabled, enableDrillOn} from '../../store/jointsSlice'

function ArmDexterityPanel() {
  const dispatch = useDispatch()
  const isDrillOn = useSelector(selectDrillIsEnabled)

  const handleClick = () => {
    if (!isDrillOn) {
      console.log('Drill is OFF')
    } else {
      console.log('Drill is ON')
    }
    dispatch(enableDrillOn({enabled: !isDrillOn}))
  }

  useEffect (() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === 'b') {
        handleClick();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isDrillOn]);

  const className =
    'enable-drill-button enable-drill-button--' + (isDrillOn ? 'enabled' : 'disabled')
  const text = isDrillOn ? 'Turn on Drill' : 'Turn off Drill'

  return (
    <div className="science-panel">
      <CameraStream cameraName="pano" />
      <CameraStream cameraName="drill" />
      <div className={className}>
        <button onClick={handleClick}>{text}</button>
      </div>
    </div>
  )
}

export default ArmDexterityPanel
