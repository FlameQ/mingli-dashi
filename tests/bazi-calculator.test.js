/**
 * 命理大师 - 八字计算引擎测试
 */
const baziCalc = require('../miniprogram/utils/bazi-calculator')

describe('bazi-calculator', () => {
  describe('calculateBazi', () => {
    test('should calculate bazi for a known date', () => {
      const result = baziCalc.calculateBazi(2000, 6, 15, 12, '男')
      expect(result).toHaveProperty('pillars')
      expect(result).toHaveProperty('dayMaster')
      expect(result).toHaveProperty('dayMasterWx')
      expect(result).toHaveProperty('wuxingCount')
      expect(result).toHaveProperty('fullShishen')
      expect(result).toHaveProperty('naying')
      expect(result).toHaveProperty('zodiac')
      expect(result).toHaveProperty('gender', '男')
    })

    test('should return correct zodiac', () => {
      const result = baziCalc.calculateBazi(2000, 1, 1, 8, '女')
      expect(result.zodiac).toBe('龙')
    })

    test('should return four pillars each with 2 characters', () => {
      const result = baziCalc.calculateBazi(1990, 3, 15, 10, '男')
      const { pillars } = result
      Object.values(pillars).forEach(p => {
        expect(p).toHaveLength(2)
      })
    })

    test('should return valid wuxing counts', () => {
      const result = baziCalc.calculateBazi(1985, 9, 20, 14, '男')
      const { wuxingCount } = result
      const total = Object.values(wuxingCount).reduce((a, b) => a + b, 0)
      expect(total).toBe(8)
    })

    test('should return strength analysis', () => {
      const result = baziCalc.calculateBazi(1995, 7, 4, 8, '女')
      expect(result.strength).toHaveProperty('level')
      expect(['身强', '中和', '身弱']).toContain(result.strength.level)
    })
  })

  describe('getShishen', () => {
    test('should return 比肩 for same element same yin-yang', () => {
      expect(baziCalc.getShishen('木', '木', '阳', '阳')).toBe('比肩')
      expect(baziCalc.getShishen('火', '火', '阴', '阴')).toBe('比肩')
    })

    test('should return 食神 for same yin-yang generating element', () => {
      expect(baziCalc.getShishen('木', '火', '阳', '阳')).toBe('食神')
      expect(baziCalc.getShishen('火', '土', '阳', '阳')).toBe('食神')
    })

    test('should return 偏财 for same yin-yang element I control', () => {
      expect(baziCalc.getShishen('木', '土', '阳', '阳')).toBe('偏财')
      expect(baziCalc.getShishen('火', '金', '阳', '阳')).toBe('偏财')
    })

    test('should return 七杀 for same yin-yang element controlling me', () => {
      expect(baziCalc.getShishen('木', '金', '阳', '阳')).toBe('七杀')
      expect(baziCalc.getShishen('火', '水', '阳', '阳')).toBe('七杀')
    })

    test('should return 正印 for different yin-yang element generating me', () => {
      expect(baziCalc.getShishen('木', '水', '阳', '阴')).toBe('正印')
      expect(baziCalc.getShishen('火', '木', '阳', '阴')).toBe('正印')
    })

    test('should handle empty/invalid inputs', () => {
      expect(baziCalc.getShishen('', '木')).toBe('未知')
      expect(baziCalc.getShishen('木', '')).toBe('未知')
    })
  })

  describe('getDayunList', () => {
    test('should return 8 decade luck periods', () => {
      const result = baziCalc.getDayunList('男', '甲子', 3)
      expect(result).toHaveLength(8)
    })

    test('each period should have required properties', () => {
      const result = baziCalc.getDayunList('男', '甲子', 3)
      result.forEach(item => {
        expect(item).toHaveProperty('ganzhi')
        expect(item).toHaveProperty('startAge')
        expect(item).toHaveProperty('endAge')
        expect(item).toHaveProperty('label')
        expect(item).toHaveProperty('wuxing')
        expect(item.ganzhi).toHaveLength(2)
      })
    })

    test('periods should cover consecutive decades', () => {
      const result = baziCalc.getDayunList('男', '甲子', 3)
      for (let i = 1; i < result.length; i++) {
        expect(result[i].startAge).toBe(result[i - 1].startAge + 10)
      }
    })
  })

  describe('generateRichReading', () => {
    test('should generate reading with sections array', () => {
      const baziData = baziCalc.calculateBazi(1990, 5, 20, 10, '男')
      const reading = baziCalc.generateRichReading(
        baziData.dayMaster,
        baziData.dayMasterWx,
        baziData.strength,
        baziData.wuxingCount,
        baziData.wuxingBalance,
        baziData.xiyong,
        baziData.geju,
        baziData.personality,
        baziData.zodiac,
        baziData.naying,
        baziData.pillars,
        baziData.fullShishen
      )
      expect(reading).toHaveProperty('sections')
      expect(Array.isArray(reading.sections)).toBe(true)
      expect(reading.sections.length).toBeGreaterThan(0)
      expect(reading.sections[0]).toHaveProperty('title')
      expect(reading.sections[0]).toHaveProperty('content')
      expect(reading.sections[0].content.length).toBeGreaterThan(0)
    })
  })
})
