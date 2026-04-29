import {useState} from 'react'
import {useDispatch} from 'react-redux'
import {disconnectFromRover} from '../../store/roverSocketSlice'
import './RoverSelector.css'

const ROVER_HOSTS = ['jetson-1.local', 'jetson-2.local']

const DEFAULT_HOST =
  (typeof localStorage !== 'undefined' && localStorage.getItem('roverHost')) ||
  import.meta.env.VITE_ROVER_HOST ||
  'jetson-1.local'

function RoverSelector() {
  const dispatch = useDispatch()
  const [selectedHost, setSelectedHost] = useState(DEFAULT_HOST)

  const handleChange = (e) => {
    const host = e.target.value
    setSelectedHost(host)
    localStorage.setItem('roverHost', host)
    dispatch(disconnectFromRover())
  }

  return (
    <div className="rover-selector">
      <label className="rover-selector__label">Rover</label>
      <select className="rover-selector__select" value={selectedHost} onChange={handleChange}>
        {ROVER_HOSTS.map((host) => (
          <option key={host} value={host}>
            {host}
          </option>
        ))}
      </select>
    </div>
  )
}

export default RoverSelector
