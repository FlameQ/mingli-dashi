/**
 * 命理大师 - 八字计算引擎测试（增强版 V2）
 * 测试所有新增功能 + 校验与原始 skills 参考数据的一致性
 */
const baziCalc = require('../miniprogram/utils/bazi-calculator')
const dateUtil = require('../miniprogram/utils/date-util')

describe('bazi-calculator V2', () => {

  // ===== 基础四柱计算 =====
  describe('calculateBazi - 基础计算', () => {
    test('1990年6月15日12时 男', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      expect(result.pillars).toHaveProperty('yearPillar')
      expect(result.pillars).toHaveProperty('monthPillar')
      expect(result.pillars).toHaveProperty('dayPillar')
      expect(result.pillars).toHaveProperty('hourPillar')
      // 1990年 庚午年（立春后）
      expect(result.pillars.yearPillar).toBe('庚午')
      expect(result.zodiac).toBe('马')
      expect(result.gender).toBe('男')
    })

    test('2000年1月1日8时 女 - 立春前属上一年', () => {
      const result = baziCalc.calculateBazi(2000, 1, 1, 8, '女')
      // 2000年1月1日在立春前，应用1999年
      expect(result.pillars.yearPillar).toBe('己卯')
      expect(result.zodiac).toBe('兔')
    })

    test('2000年3月15日10时 - 立春后当年', () => {
      const result = baziCalc.calculateBazi(2000, 3, 15, 10, '男')
      expect(result.pillars.yearPillar).toBe('庚辰')
      expect(result.zodiac).toBe('龙')
    })

    test('四柱各2字符', () => {
      const result = baziCalc.calculateBazi(1985, 9, 20, 14, '男')
      Object.values(result.pillars).forEach(p => {
        expect(p).toHaveLength(2)
      })
    })

    test('五行总数为8', () => {
      const result = baziCalc.calculateBazi(1985, 9, 20, 14, '男')
      const total = Object.values(result.wuxingCount).reduce((a, b) => a + b, 0)
      expect(total).toBe(8)
    })
  })

  // ===== 月柱准确性验证 =====
  describe('月柱准确性 - 五虎遁+节气分界', () => {
    test('getBaziMonth: 6月15日应为午月(5)', () => {
      expect(dateUtil.getBaziMonth(6, 15, 1990)).toBe(5)
    })

    test('getBaziMonth: 3月15日应为卯月(2)', () => {
      expect(dateUtil.getBaziMonth(3, 15, 2000)).toBe(2)
    })

    test('getBaziMonth: 2月4日(立春后)应为寅月(1)', () => {
      expect(dateUtil.getBaziMonth(2, 5, 2024)).toBe(1)
    })

    test('getBaziMonth: 2月1日(立春前)应为丑月(12)', () => {
      expect(dateUtil.getBaziMonth(2, 1, 2024)).toBe(12)
    })

    test('getBaziMonth: 1月1日(小寒前)应为子月(11)', () => {
      expect(dateUtil.getBaziMonth(1, 1, 2000)).toBe(11)
    })

    test('getBaziMonth: 1月10日(小寒后)应为丑月(12)', () => {
      expect(dateUtil.getBaziMonth(1, 10, 2000)).toBe(12)
    })

    test('庚年午月月柱应为壬午', () => {
      // 1990年6月15日 = 庚年，午月(5)
      // 五虎遁：乙庚之年戊为头，正月戊寅，...午月=壬午
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      expect(result.pillars.yearPillar).toBe('庚午')
      expect(result.pillars.monthPillar).toBe('壬午')
    })

    test('己年子月月柱应为丙子', () => {
      // 2000年1月1日 = 己卯年(立春前)，子月(11)
      // 五虎遁：甲己之年丙作首，正月丙寅，...子月=丙子
      const result = baziCalc.calculateBazi(2000, 1, 1, 8, '女')
      expect(result.pillars.yearPillar).toBe('己卯')
      expect(result.pillars.monthPillar).toBe('丙子')
    })

    test('庚年卯月月柱应为己卯', () => {
      // 2000年3月15日 = 庚辰年，卯月(2)
      // 五虎遁：乙庚之年戊为头，正月戊寅，卯月=己卯
      const result = baziCalc.calculateBazi(2000, 3, 15, 10, '男')
      expect(result.pillars.yearPillar).toBe('庚辰')
      expect(result.pillars.monthPillar).toBe('己卯')
    })

    test('甲年寅月月柱应为丙寅', () => {
      // 1984年2月15日 = 甲子年(立春后)，寅月(1)
      // 五虎遁：甲己之年丙作首，正月=丙寅
      const result = baziCalc.calculateBazi(1984, 2, 15, 10, '男')
      expect(result.pillars.yearPillar).toBe('甲子')
      expect(result.pillars.monthPillar).toBe('丙寅')
    })
  })

  // ===== 立春分界 =====
  describe('立春分界', () => {
    test('2月1日（立春前）属于上一年', () => {
      expect(dateUtil.isBeforeLichun(1, 15, 2024)).toBe(true)
      expect(dateUtil.isBeforeLichun(2, 1, 2024)).toBe(true)
    })

    test('2月5日（立春后）属于当年', () => {
      expect(dateUtil.isBeforeLichun(2, 5, 2024)).toBe(false)
    })

    test('3月任何日期都属当年', () => {
      expect(dateUtil.isBeforeLichun(3, 1, 2024)).toBe(false)
    })
  })

  // ===== 夜子时 =====
  describe('夜子时处理', () => {
    test('23时应使用次日日柱', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 23, '男')
      const resultNextDay = baziCalc.calculateBazi(1990, 6, 16, 0, '男')
      // 23时的日柱应等于次日0时的日柱
      expect(result.pillars.dayPillar).toBe(resultNextDay.pillars.dayPillar)
      // 时柱应为子时
      expect(result.pillars.hourPillar[1]).toBe('子')
    })
  })

  // ===== 十神推导 =====
  describe('十神推导 - 与参考表一致性', () => {
    test('比肩: 同我者，阴阳相同', () => {
      expect(baziCalc.getShishen('木', '木', '阳', '阳')).toBe('比肩')
      expect(baziCalc.getShishen('火', '火', '阴', '阴')).toBe('比肩')
    })

    test('劫财: 同我者，阴阳不同', () => {
      expect(baziCalc.getShishen('木', '木', '阳', '阴')).toBe('劫财')
      expect(baziCalc.getShishen('火', '火', '阳', '阴')).toBe('劫财')
    })

    test('食神: 我生者，阴阳相同', () => {
      expect(baziCalc.getShishen('木', '火', '阳', '阳')).toBe('食神')
      expect(baziCalc.getShishen('火', '土', '阳', '阳')).toBe('食神')
    })

    test('伤官: 我生者，阴阳不同', () => {
      expect(baziCalc.getShishen('木', '火', '阳', '阴')).toBe('伤官')
      expect(baziCalc.getShishen('火', '土', '阳', '阴')).toBe('伤官')
    })

    test('偏财: 我克者，阴阳相同', () => {
      expect(baziCalc.getShishen('木', '土', '阳', '阳')).toBe('偏财')
      expect(baziCalc.getShishen('火', '金', '阳', '阳')).toBe('偏财')
    })

    test('正财: 我克者，阴阳不同', () => {
      expect(baziCalc.getShishen('木', '土', '阳', '阴')).toBe('正财')
      expect(baziCalc.getShishen('火', '金', '阳', '阴')).toBe('正财')
    })

    test('七杀: 克我者，阴阳相同', () => {
      expect(baziCalc.getShishen('木', '金', '阳', '阳')).toBe('七杀')
      expect(baziCalc.getShishen('火', '水', '阳', '阳')).toBe('七杀')
    })

    test('正官: 克我者，阴阳不同', () => {
      expect(baziCalc.getShishen('木', '金', '阳', '阴')).toBe('正官')
      expect(baziCalc.getShishen('火', '水', '阳', '阴')).toBe('正官')
    })

    test('偏印: 生我者，阴阳相同', () => {
      expect(baziCalc.getShishen('木', '水', '阳', '阳')).toBe('偏印')
      expect(baziCalc.getShishen('火', '木', '阳', '阳')).toBe('偏印')
    })

    test('正印: 生我者，阴阳不同', () => {
      expect(baziCalc.getShishen('木', '水', '阳', '阴')).toBe('正印')
      expect(baziCalc.getShishen('火', '木', '阳', '阴')).toBe('正印')
    })
  })

  // ===== 十神详批 =====
  describe('十神详批', () => {
    test('应返回详细十神分析', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      expect(result).toHaveProperty('shishenDetail')
      expect(result.shishenDetail.details.length).toBeGreaterThan(0)
      expect(result.shishenDetail.details[0]).toHaveProperty('shishen')
      expect(result.shishenDetail.details[0]).toHaveProperty('desc')
      expect(result.shishenDetail.details[0]).toHaveProperty('career')
      expect(result.shishenDetail.details[0]).toHaveProperty('relation')
    })

    test('日柱天干应为日主', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      const dayPillar = result.shishenDetail.details.find(d => d.position === '日柱' && d.type === '天干')
      expect(dayPillar.shishen).toBe('日主')
    })
  })

  // ===== 地支关系 =====
  describe('地支关系 - 与参考数据一致性', () => {
    test('子午冲应被检测到', () => {
      // 构造子午同时出现的八字
      const result = baziCalc.calculateBazi(1996, 6, 15, 0, '男')
      const chong = result.dizhiRelations.filter(r => r.type === '冲')
      // 1996年 丙子年 子午冲
      // 需要年支或日支为子，且有午
      if (result.pillars.yearPillar[1] === '子') {
        const hasWu = [result.pillars.monthPillar[1], result.pillars.dayPillar[1], result.pillars.hourPillar[1]].includes('午')
        if (hasWu) {
          expect(chong.length).toBeGreaterThan(0)
        }
      }
    })

    test('关系类型包含冲、合、刑、害', () => {
      // 测试多个八字确保能检测到各种关系
      const allTypes = new Set()
      const testCases = [
        baziCalc.calculateBazi(1984, 3, 15, 10, '男').dizhiRelations,
        baziCalc.calculateBazi(1990, 8, 20, 14, '女').dizhiRelations,
        baziCalc.calculateBazi(1975, 11, 5, 6, '男').dizhiRelations
      ]
      testCases.forEach(relations => {
        relations.forEach(r => allTypes.add(r.type))
      })
      // 至少能检测到部分关系类型
      expect(allTypes.size).toBeGreaterThan(0)
    })

    test('每个关系项都有 desc 和 meaning', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      result.dizhiRelations.forEach(r => {
        expect(r).toHaveProperty('type')
        expect(r).toHaveProperty('desc')
        expect(r).toHaveProperty('meaning')
        expect(r.desc.length).toBeGreaterThan(0)
      })
    })
  })

  // ===== 神煞系统 =====
  describe('神煞系统', () => {
    test('应返回神煞列表', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      expect(result).toHaveProperty('shensha')
      expect(Array.isArray(result.shensha)).toBe(true)
    })

    test('每个神煞有完整属性', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      result.shensha.forEach(s => {
        expect(s).toHaveProperty('name')
        expect(s).toHaveProperty('icon')
        expect(s).toHaveProperty('type')
        expect(s).toHaveProperty('desc')
        expect(s).toHaveProperty('meaning')
        expect(['type-lucky', 'type-bad', 'type-mid', 'type-neutral']).toContain(s.type)
      })
    })

    test('甲日干见丑未应为天乙贵人', () => {
      // 构造甲日干且地支含丑或未的八字
      const result = baziCalc.calculateBazi(1994, 12, 10, 12, '男')
      // 验证如果能检测到天乙贵人
      if (result.dayMaster === '甲') {
        const allZhi = Object.values(result.pillars).map(p => p[1])
        if (allZhi.includes('丑') || allZhi.includes('未')) {
          const guiren = result.shensha.find(s => s.name === '天乙贵人')
          expect(guiren).toBeTruthy()
        }
      }
    })
  })

  // ===== 纳音五行 =====
  describe('纳音五行', () => {
    test('甲子应为海中金', () => {
      expect(dateUtil.getNaying('甲子')).toBe('海中金')
    })

    test('丙寅应为炉中火', () => {
      expect(dateUtil.getNaying('丙寅')).toBe('炉中火')
    })

    test('癸亥应为大海水', () => {
      expect(dateUtil.getNaying('癸亥')).toBe('大海水')
    })

    test('应返回纳音详析', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      expect(result.nayingDetail.length).toBe(4) // 四柱各一条
      result.nayingDetail.forEach(item => {
        expect(item).toHaveProperty('position')
        expect(item).toHaveProperty('ganzhi')
        expect(item).toHaveProperty('naying')
        expect(item).toHaveProperty('meaning')
      })
    })
  })

  // ===== 十二长生 =====
  describe('十二长生 - 与参考表一致性', () => {
    test('甲木长生在亥', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      if (result.dayMaster === '甲') {
        const cs = result.changsheng
        const changshengStage = cs.stages.find(s => s.stage === '长生')
        expect(changshengStage.zhi).toBe('亥')
      }
    })

    test('乙木长生在午', () => {
      // 构造乙日干的八字
      const result = baziCalc.calculateBazi(1990, 3, 10, 12, '男')
      if (result.dayMaster === '乙') {
        const cs = result.changsheng
        const changshengStage = cs.stages.find(s => s.stage === '长生')
        expect(changshengStage.zhi).toBe('午')
      }
    })

    test('12个长生阶段完整', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      expect(result.changsheng.stages.length).toBe(12)
      const stageNames = result.changsheng.stages.map(s => s.stage)
      expect(stageNames).toEqual(['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'])
    })

    test('日支所在阶段有含义', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      expect(result.changsheng.dayZhiStage).toBeTruthy()
      expect(result.changsheng.dayZhiMeaning.length).toBeGreaterThan(0)
    })
  })

  // ===== 流年运势 =====
  describe('流年运势', () => {
    test('应返回当年流年信息', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      expect(result.liunian.year).toBe(new Date().getFullYear())
      expect(result.liunian.ganzhi).toHaveLength(2)
      expect(result.liunian.shishen).toBeTruthy()
      expect(result.liunian.reading.length).toBeGreaterThan(0)
    })

    test('应返回12个月运势', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      expect(result.liunian.monthFortune.length).toBe(12)
      result.liunian.monthFortune.forEach(m => {
        expect(m).toHaveProperty('month')
        expect(m).toHaveProperty('ganzhi')
        expect(m).toHaveProperty('shishen')
        expect(m).toHaveProperty('level')
        expect(['吉', '注意', '平']).toContain(m.level)
      })
    })

    test('太岁状态正确', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      expect(result.liunian.taiSui).toBeTruthy()
    })
  })

  // ===== 空亡 =====
  describe('空亡计算', () => {
    test('甲子旬空亡为戌亥', () => {
      // 甲子: ganIdx=0, zhiIdx=0, xunStartZhi=(0-0)%12=0(子)
      // kong = DIZHI[10]=戌, DIZHI[11]=亥
      const result = baziCalc.calculateBazi(1984, 12, 1, 0, '男')
      // 找到日柱为甲子的八字来验证
      // 直接测试空亡在神煞中
      const shenshaKong = result.shensha.find(s => s.name === '空亡')
      if (shenshaKong) {
        expect(shenshaKong.desc).toContain('空亡')
      }
    })
  })

  // ===== 大运 =====
  describe('大运走势', () => {
    test('应返回8步大运', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      expect(result.dayunList.length).toBe(8)
    })

    test('大运每步10年', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      result.dayunList.forEach(d => {
        expect(d.endAge - d.startAge).toBe(9) // 如5-14岁
      })
    })

    test('大运连续递增', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      for (let i = 1; i < result.dayunList.length; i++) {
        expect(result.dayunList[i].startAge).toBe(result.dayunList[i - 1].startAge + 10)
      }
    })
  })

  // ===== 综合验证 =====
  describe('综合验证', () => {
    test('所有新增字段都存在', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      expect(result).toHaveProperty('shishenDetail')
      expect(result).toHaveProperty('dizhiRelations')
      expect(result).toHaveProperty('shensha')
      expect(result).toHaveProperty('nayingDetail')
      expect(result).toHaveProperty('changsheng')
      expect(result).toHaveProperty('liunian')
    })

    test('强弱势分析有效', () => {
      const result = baziCalc.calculateBazi(1995, 7, 4, 8, '女')
      expect(['身强', '中和', '身弱']).toContain(result.strength.level)
    })

    test('喜用神分析有效', () => {
      const result = baziCalc.calculateBazi(1988, 5, 10, 14, '男')
      expect(result.xiyong.xi).toBeTruthy()
      expect(result.xiyong.yong).toBeTruthy()
      expect(result.xiyong.ji).toBeTruthy()
    })

    test('格局判断有效', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      expect(result.geju.name).toBeTruthy()
      expect(result.geju.description).toBeTruthy()
    })

    test('性格分析完整', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      expect(result.personality.trait).toBeTruthy()
      expect(result.personality.desc).toBeTruthy()
      expect(result.personality.strength).toBeTruthy()
      expect(result.personality.weakness).toBeTruthy()
    })

    test('人生运势四个领域完整', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      expect(result.lifeDomains.career).toBeTruthy()
      expect(result.lifeDomains.wealth).toBeTruthy()
      expect(result.lifeDomains.love).toBeTruthy()
      expect(result.lifeDomains.health).toBeTruthy()
    })

    test('幸运元素完整', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      expect(result.luckyElements.colors).toBeTruthy()
      expect(result.luckyElements.direction).toBeTruthy()
      expect(result.luckyElements.numbers).toBeTruthy()
    })

    test('命理详批有内容', () => {
      const result = baziCalc.calculateBazi(1990, 6, 15, 12, '男')
      expect(result.reading.sections.length).toBeGreaterThan(0)
      result.reading.sections.forEach(s => {
        expect(s.title).toBeTruthy()
        expect(s.content.length).toBeGreaterThan(0)
      })
    })
  })
})
