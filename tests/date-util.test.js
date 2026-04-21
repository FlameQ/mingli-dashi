/**
 * 命理大师 - 日期工具函数测试
 */
const dateUtil = require('../miniprogram/utils/date-util')

describe('date-util', () => {
  describe('getShichenIndex', () => {
    test('should return 0 for hour 23 (子时)', () => {
      expect(dateUtil.getShichenIndex(23)).toBe(0)
    })
    test('should return 0 for hour 0 (子时)', () => {
      expect(dateUtil.getShichenIndex(0)).toBe(0)
    })
    test('should return 1 for hour 1 (丑时)', () => {
      expect(dateUtil.getShichenIndex(1)).toBe(1)
    })
    test('should return 6 for hour 12 (午时)', () => {
      expect(dateUtil.getShichenIndex(12)).toBe(6)
    })
    test('should return 11 for hour 21 (亥时)', () => {
      expect(dateUtil.getShichenIndex(21)).toBe(11)
    })
  })

  describe('getShichen', () => {
    test('should return correct shichen name for hour 0', () => {
      expect(dateUtil.getShichen(0)).toContain('子时')
    })
    test('should return correct shichen name for hour 12', () => {
      expect(dateUtil.getShichen(12)).toContain('午时')
    })
  })

  describe('getShichenName', () => {
    test('should return 子时 for hour 23', () => {
      expect(dateUtil.getShichenName(23)).toBe('子时')
    })
    test('should return 午时 for hour 12', () => {
      expect(dateUtil.getShichenName(12)).toBe('午时')
    })
  })

  describe('getZodiac', () => {
    test('should return correct zodiac for known years', () => {
      expect(dateUtil.getZodiac(2024)).toBe('龙')
      expect(dateUtil.getZodiac(2000)).toBe('龙')
      expect(dateUtil.getZodiac(1996)).toBe('鼠')
      expect(dateUtil.getZodiac(1985)).toBe('牛')
    })
    test('should cycle through all 12 animals', () => {
      const animals = []
      for (let y = 2024; y < 2036; y++) {
        animals.push(dateUtil.getZodiac(y))
      }
      expect(animals).toEqual(['龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔'])
    })
  })

  describe('getYearGanZhi', () => {
    test('should return correct GanZhi for known years', () => {
      expect(dateUtil.getYearGanZhi(2024)).toBe('甲辰')
      expect(dateUtil.getYearGanZhi(2000)).toBe('庚辰')
      expect(dateUtil.getYearGanZhi(1984)).toBe('甲子')
    })
    test('should cycle through 60 combinations', () => {
      const gz1 = dateUtil.getYearGanZhi(1984)
      const gz2 = dateUtil.getYearGanZhi(2044)
      expect(gz1).toBe(gz2)
    })
  })

  describe('getDayGanZhi', () => {
    test('should return a valid 2-character string', () => {
      const result = dateUtil.getDayGanZhi(2000, 1, 1)
      expect(result).toHaveLength(2)
      expect(dateUtil.TIANGAN).toContain(result[0])
      expect(dateUtil.DIZHI).toContain(result[1])
    })
  })

  describe('getGanZhi', () => {
    test('should return all four pillars', () => {
      const result = dateUtil.getGanZhi(2000, 6, 15, 12)
      expect(result).toHaveProperty('yearPillar')
      expect(result).toHaveProperty('monthPillar')
      expect(result).toHaveProperty('dayPillar')
      expect(result).toHaveProperty('hourPillar')
      expect(result.yearPillar).toHaveLength(2)
      expect(result.monthPillar).toHaveLength(2)
      expect(result.dayPillar).toHaveLength(2)
      expect(result.hourPillar).toHaveLength(2)
    })
  })

  describe('getNaying', () => {
    test('should return correct naying for known pillars', () => {
      expect(dateUtil.getNaying('甲子')).toBe('海中金')
      expect(dateUtil.getNaying('丙寅')).toBe('炉中火')
      expect(dateUtil.getNaying('庚午')).toBe('路旁土')
      expect(dateUtil.getNaying('壬申')).toBe('剑锋金')
    })
    test('should return unknown for invalid pillar', () => {
      expect(dateUtil.getNaying('XX')).toBe('未知')
    })
  })

  describe('countWuxing', () => {
    test('should count five elements correctly', () => {
      const pillars = {
        yearPillar: '甲子',
        monthPillar: '丙寅',
        dayPillar: '戊午',
        hourPillar: '庚申'
      }
      const count = dateUtil.countWuxing(pillars)
      expect(count).toHaveProperty('金')
      expect(count).toHaveProperty('木')
      expect(count).toHaveProperty('水')
      expect(count).toHaveProperty('火')
      expect(count).toHaveProperty('土')
      const total = Object.values(count).reduce((a, b) => a + b, 0)
      expect(total).toBe(8)
    })
  })

  describe('analyzeWuxingBalance', () => {
    test('should detect missing elements', () => {
      const count = { '金': 0, '木': 3, '水': 2, '火': 2, '土': 1 }
      const balance = dateUtil.analyzeWuxingBalance(count)
      expect(balance.missing).toContain('金')
    })
    test('should detect strong elements', () => {
      const count = { '金': 1, '木': 5, '水': 1, '火': 1, '土': 0 }
      const balance = dateUtil.analyzeWuxingBalance(count)
      expect(balance.strong).toContain('木')
    })
    test('should handle empty counts', () => {
      const count = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 }
      const balance = dateUtil.analyzeWuxingBalance(count)
      expect(balance.missing).toEqual(['金', '木', '水', '火', '土'])
    })
  })
})
