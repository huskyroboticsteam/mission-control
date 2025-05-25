import {useDispatch, useSelector} from 'react-redux'
import React, {useState, useEffect} from 'react'
import {getSpeed} from '../../store/inputSlice'


function ScienceStatus() {
  const speed = useSelector(getSpeed)
  return <b>Current linkage speed: {speed}%</b> 

}

export default ScienceStatus
