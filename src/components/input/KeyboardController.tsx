import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {keyPressed, keyReleased} from '../../store/inputSlice.js'
import type { RoverDispatch } from '../../store/store.js'

export const KeyboardController = () => {
  const dispatch = useDispatch<RoverDispatch>()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => dispatch(keyPressed({key: event.key}))
    const handleKeyUp = (event: KeyboardEvent) => dispatch(keyReleased({key: event.key}))

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [dispatch])

  // We don't need to render this component.
  return null
}
