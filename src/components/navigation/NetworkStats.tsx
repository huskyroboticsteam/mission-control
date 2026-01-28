import React from 'react'
import {useEffect, useState} from 'react'

export default function NetworkStats() {
  const [noise, setNoise] = useState(0)
  const [signal, setSignal] = useState(0)
  const [quality, setQuality] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () =>
        fetch('http://0.0.0.0:8000/api/ubnt/sta')
          .then((resp) => {
            if (resp.status !== 200) {
              console.log('Could not fetch network stats: Status ' + resp.status)
              return
            }
            resp.json().then((json) => {
              console.log(json)
              setNoise(json['noisefloor'])
              setSignal(json['signal'])
              setQuality(json['ccq'])
            })
          })
          .catch((err) => {
            console.log('Network stats fetch error:-S', err)
          }),
      5000
    )

    return () => clearInterval(id)
  }, [])

  return (
    <div>
      <div>Signal: {signal} dBm</div>
      <div>Noise: {noise} dBm</div>
      <div>Link Quality: {quality}%</div>
    </div>
  )
}