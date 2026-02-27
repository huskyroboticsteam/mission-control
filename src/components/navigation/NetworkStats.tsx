import React from 'react'
import {useEffect, useState} from 'react'

export default function NetworkStats() {
  const [noise, setNoise] = useState(0)
  const [signal, setSignal] = useState(0)
  const [quality, setQuality] = useState(0)
  const [txRate, setTxRate] = useState(0)
  const [rxRate, setRxRate] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () =>
        fetch('http://0.0.0.0:8000/api/ubnt/sta')
          .then((resp) => {
            if (resp.status !== 200) {
              console.log('Could not fetch network stats: Status ' + resp.status)
              return
            }
            resp.json().then((json_str) => {
              const json = JSON.parse(json_str)[0]

              setNoise(json['noisefloor'])
              setSignal(json['signal'])
              setQuality(json['ccq'])
              setTxRate(json['txrate'])
              setRxRate(json['rxrate'])
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
    <div  className="info">
      <tr>              
        <td>Signal:</td>
        <td> {signal} dBm</td>
      </tr>
      <tr>              
        <td>Noise:</td>
        <td> {noise} dBm</td>
      </tr>
      <tr>              
        <td>Link Quality:  </td>
        <td>{quality}% </td>
      </tr>
      <tr>              
        <td>Tx:  </td>
        <td>{txRate} </td>
      </tr>
      <tr>              
        <td>Rx:  </td>
        <td>{rxRate} </td>
      </tr>
    </div>
  )
}