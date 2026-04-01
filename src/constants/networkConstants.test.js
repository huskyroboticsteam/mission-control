import {describe, it, expect} from 'vitest'
import {ROVER_SERVER_URL} from './networkConstants.js'

describe('networkConstants', () => {
  it('should have a valid WebSocket URL format', () => {
    expect(ROVER_SERVER_URL).toMatch(/^ws:\/\/.+:3001\/mission-control$/)
  })

  it('should contain the correct port', () => {
    expect(ROVER_SERVER_URL).toContain(':3001')
  })

  it('should use WebSocket protocol', () => {
    expect(ROVER_SERVER_URL).toMatch(/^ws:\/\//)
  })

  it('should end with /mission-control', () => {
    expect(ROVER_SERVER_URL).toMatch(/\/mission-control$/)
  })
})
