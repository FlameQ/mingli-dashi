/**
 * 命理大师 - 八字计算引擎
 */
const dateUtil = require('./date-util')

const SHISHEN_MAP = {
  '比肩': 'same', '劫财': 'same',
  '食神': 'output', '伤官': 'output',
  '偏财': 'wealth', '正财': 'wealth',
  '七杀': 'power', '正官': 'power',
  '偏印': 'resource', '正印': 'resource'
}

const WUXING_SHISHEN = {
  '金金': '比肩', '金木': '克(偏财)', '金水': '生(食神)', '金火': '被克(七杀)', '金土': '生我(正印)',
  '木木': '比肩', '木土': '克(偏财)', '木火': '生(食神)', '木金': '被克(七杀)', '木水': '生我(正印)',
  '水水': '比肩', '水火': '克(偏财)', '水木': '生(食神)', '水土': '被克(七杀)', '水金': '生我(正印)',
  '火火': '比肩', '火金': '克(偏财)', '火土': '生(食神)', '火水': '被克(七杀)', '火木': '生我(正印)',
  '土土': '比肩', '土水': '克(偏财)', '土金': '生(食神)', '土木': '被克(七杀)', '土火': '生我(正印)'
}

function getShishen(dayMasterWx, targetWx) {
  if (!dayMasterWx || !targetWx) return '未知'
  if (dayMasterWx === targetWx) return '比肩'

  const wuxingOrder = ['木', '火', '土', '金', '水']
  const dmIdx = wuxingOrder.indexOf(dayMasterWx)
  const tgIdx = wuxingOrder.indexOf(targetWx)

  if (tgIdx === (dmIdx + 1) % 5) return '食神'
  if (tgIdx === (dmIdx + 2) % 5) return '偏财'
  if (tgIdx === (dmIdx + 3) % 5) return '七杀'
  if (tgIdx === (dmIdx + 4) % 5) return '正印'

  return '未知'
}

function calculateBazi(year, month, day, hour, gender) {
  const pillars = dateUtil.getGanZhi(year, month, day, hour)
  const dayMaster = pillars.dayPillar[0]
  const dayMasterWx = dateUtil.TIANGAN_WUXING[dayMaster]
  const dayMasterYy = dateUtil.TIANGAN_YINYANG[dayMaster]

  const wuxingCount = dateUtil.countWuxing(pillars)
  const balance = dateUtil.analyzeWuxingBalance(wuxingCount)

  const shishen = {
    yearPillar: getShishen(dayMasterWx, dateUtil.TIANGAN_WUXING[pillars.yearPillar[0]]),
    monthPillar: getShishen(dayMasterWx, dateUtil.TIANGAN_WUXING[pillars.monthPillar[0]]),
    dayPillar: '日主',
    hourPillar: getShishen(dayMasterWx, dateUtil.TIANGAN_WUXING[pillars.hourPillar[0]])
  }

  const naying = {
    year: dateUtil.getNaying(pillars.yearPillar),
    month: dateUtil.getNaying(pillars.monthPillar),
    day: dateUtil.getNaying(pillars.dayPillar),
    hour: dateUtil.getNaying(pillars.hourPillar)
  }

  const zodiac = dateUtil.getZodiac(year)
  const shichen = dateUtil.getShichenName(hour)

  const strength = analyzeDayMasterStrength(dayMasterWx, wuxingCount)

  return {
    pillars,
    dayMaster,
    dayMasterWx,
    dayMasterYy,
    wuxingCount,
    wuxingBalance: balance,
    shishen,
    naying,
    zodiac,
    shichen,
    gender,
    strength
  }
}

function analyzeDayMasterStrength(dayMasterWx, wuxingCount) {
  const wuxingOrder = ['木', '火', '土', '金', '水']
  const dmIdx = wuxingOrder.indexOf(dayMasterWx)

  const selfCount = wuxingCount[dayMasterWx] || 0
  const resourceWx = wuxingOrder[(dmIdx + 4) % 5]
  const resourceCount = wuxingCount[resourceWx] || 0
  const supportCount = selfCount + resourceCount

  if (supportCount >= 4) return { level: '身强', description: '日主得令有助，根基深厚' }
  if (supportCount >= 2) return { level: '中和', description: '日主力量适中，五行较均衡' }
  return { level: '身弱', description: '日主力量不足，需扶助' }
}

function getDayunList(gender, monthPillar, startAge) {
  const isForward = gender === '男' && dateUtil.TIANGAN_YINYANG[monthPillar[0]] === '阳' ||
                    gender === '女' && dateUtil.TIANGAN_YINYANG[monthPillar[0]] === '阴'

  const result = []
  const ganIdx = dateUtil.TIANGAN.indexOf(monthPillar[0])
  const zhiIdx = dateUtil.DIZHI.indexOf(monthPillar[1])
  const direction = isForward ? 1 : -1

  for (let i = 1; i <= 8; i++) {
    const gIdx = ((ganIdx + direction * i) % 10 + 10) % 10
    const zIdx = ((zhiIdx + direction * i) % 12 + 12) % 12
    const ganzhi = dateUtil.TIANGAN[gIdx] + dateUtil.DIZHI[zIdx]
    const startA = startAge + (i - 1) * 10
    const endA = startA + 9
    result.push({
      ganzhi,
      startAge: startA,
      endAge: endA,
      label: `${startA}-${endA}岁`,
      wuxing: dateUtil.TIANGAN_WUXING[dateUtil.TIANGAN[gIdx]]
    })
  }
  return result
}

function generateBaziReading(baziData) {
  const { dayMaster, dayMasterWx, strength, wuxingBalance, zodiac, pillars, naying } = baziData
  const readings = []

  const wxDescMap = {
    '金': '刚毅果断，重义气', '木': '仁慈向上，有进取心',
    '水': '智慧灵活，善于变通', '火': '热情有礼，重表达',
    '土': '稳重守信，包容厚道'
  }
  readings.push(`日主${dayMaster}属${dayMasterWx}，${wxDescMap[dayMasterWx] || ''}。`)
  readings.push(`${strength.level}格局，${strength.description}。`)

  if (wuxingBalance.missing.length > 0) {
    readings.push(`五行缺${wuxingBalance.missing.join('、')}，可在生活中适当补之。`)
  }
  if (wuxingBalance.strong.length > 0) {
    readings.push(`五行${wuxingBalance.strong.join('、')}较旺。`)
  }

  readings.push(`生肖属${zodiac}，纳音${naying.year}。`)

  return {
    summary: readings.join(''),
    details: readings,
    score: Math.floor(Math.random() * 20) + 70
  }
}

module.exports = {
  calculateBazi,
  analyzeDayMasterStrength,
  getShishen,
  getDayunList,
  generateBaziReading
}
