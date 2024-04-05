import React, { Component } from 'react'
import './DriveMode.css'

class DriveMode extends Component {
    constructor() {
        super()
        this.state =  {
            prevMode: "normal",
            driveMode: "normal"
        }
    }

    changeDrive = (event) => {
        this.setState({
            prevMode: this.state.driveMode,
            driveMode: event.target.value
        })
    }

    render() {
        return (
            <div className="driveMode">
                <button disabled className="rover">
                    <label>Drive</label>
                    <label>Mode</label>
                    <select value={this.state.driveMode} onChange={this.changeDrive}>
                        <option value="normal">Normal</option>
                        <option value="turn">Turn</option>
                        <option value="crab">Crab</option>
                    </select>
                    <div>
                        <button disabled className={`front left wheel ${this.state.driveMode} p${this.state.prevMode}`} />
                        <button disabled className={`front right wheel ${this.state.driveMode} p${this.state.prevMode}`} />
                        <button disabled className={`back left wheel ${this.state.driveMode} p${this.state.prevMode}`} />
                        <button disabled className={`back right wheel ${this.state.driveMode} p${this.state.prevMode}`} />
                    </div>
                </button>
            </div>
        )
    }
}

export default DriveMode