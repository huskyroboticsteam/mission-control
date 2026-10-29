import React from 'react'
import './RoverBody.css'

export const RoverBody = ({children}: {children?: React.ReactNode}) => {
  return <div className="rover-body">{children}</div>
}
