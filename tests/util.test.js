/**
 * 命理大师 - 通用工具函数测试
 */
const util = require('../miniprogram/utils/util')

describe('util', () => {
  describe('formatTime', () => {
    test('should format date correctly', () => {
      const date = new Date(2024, 0, 15, 10, 30)
      expect(util.formatTime(date)).toBe('2024-01-15 10:30')
    })
    test('should pad single digits', () => {
      const date = new Date(2024, 2, 5, 8, 5)
      expect(util.formatTime(date)).toBe('2024-03-05 08:05')
    })
    test('should handle string input', () => {
      const result = util.formatTime('2024-01-01')
      expect(result).toBeTruthy()
    })
  })

  describe('formatDate', () => {
    test('should format date without time', () => {
      const date = new Date(2024, 5, 15)
      expect(util.formatDate(date)).toBe('2024-06-15')
    })
  })

  describe('generateId', () => {
    test('should generate unique ids', () => {
      const id1 = util.generateId()
      const id2 = util.generateId()
      expect(id1).not.toBe(id2)
    })
    test('should be a non-empty string', () => {
      const id = util.generateId()
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })
  })

  describe('debounce', () => {
    test('should delay function execution', (done) => {
      let counter = 0
      const fn = util.debounce(() => { counter++ }, 50)
      fn()
      fn()
      fn()
      expect(counter).toBe(0)
      setTimeout(() => {
        expect(counter).toBe(1)
        done()
      }, 100)
    })
  })

  describe('deepClone', () => {
    test('should create independent copy', () => {
      const original = { a: 1, b: { c: 2 } }
      const cloned = util.deepClone(original)
      cloned.b.c = 99
      expect(original.b.c).toBe(2)
    })
  })
})
