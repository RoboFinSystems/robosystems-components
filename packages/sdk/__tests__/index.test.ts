import * as SDK from '../src/index'

describe('SDK Package', () => {
  it('should export SDK functions and types', () => {
    expect(SDK).toBeDefined()
    expect(typeof SDK).toBe('object')
  })

  it('should re-export client', () => {
    expect(SDK.client).toBeDefined()
  })

  it('should have expected exports structure', () => {
    // Basic test to ensure the module exports something
    const exports = Object.keys(SDK)
    expect(exports.length).toBeGreaterThan(0)
  })
})