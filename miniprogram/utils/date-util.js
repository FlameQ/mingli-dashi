/**
 * 命理大师 - 农历与日期工具
 */

const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const SHENGXIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
const SHICHEN = ['子时(23-1)', '丑时(1-3)', '寅时(3-5)', '卯时(5-7)', '辰时(7-9)', '巳时(9-11)', '午时(11-13)', '未时(13-15)', '申时(15-17)', '酉时(17-19)', '戌时(19-21)', '亥时(21-23)']
const WUXING = ['金', '木', '水', '火', '土']

const TIANGAN_WUXING = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
}

const DIZHI_WUXING = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'
}

const TIANGAN_YINYANG = {
  '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', '戊': '阳',
  '己': '阴', '庚': '阳', '辛': '阴', '壬': '阳', '癸': '阴'
}

const NAYING_TABLE = {
  '甲子': '海中金', '乙丑': '海中金', '丙寅': '炉中火', '丁卯': '炉中火',
  '戊辰': '大林木', '己巳': '大林木', '庚午': '路旁土', '辛未': '路旁土',
  '壬申': '剑锋金', '癸酉': '剑锋金', '甲戌': '山头火', '乙亥': '山头火',
  '丙子': '涧下水', '丁丑': '涧下水', '戊寅': '城头土', '己卯': '城头土',
  '庚辰': '白蜡金', '辛巳': '白蜡金', '壬午': '杨柳木', '癸未': '杨柳木',
  '甲申': '泉中水', '乙酉': '泉中水', '丙戌': '屋上土', '丁亥': '屋上土',
  '戊子': '霹雳火', '己丑': '霹雳火', '庚寅': '松柏木', '辛卯': '松柏木',
  '壬辰': '长流水', '癸巳': '长流水', '甲午': '沙中金', '乙未': '沙中金',
  '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木',
  '庚子': '壁上土', '辛丑': '壁上土', '壬寅': '金箔金', '癸卯': '金箔金',
  '甲辰': '覆灯火', '乙巳': '覆灯火', '丙午': '天河水', '丁未': '天河水',
  '戊申': '大驿土', '己酉': '大驿土', '庚戌': '钗钏金', '辛亥': '钗钏金',
  '壬子': '桑柘木', '癸丑': '桑柘木', '甲寅': '大溪水', '乙卯': '大溪水',
  '丙辰': '沙中土', '丁巳': '沙中土', '戊午': '天上火', '己未': '天上火',
  '庚申': '石榴木', '辛酉': '石榴木', '壬戌': '大海水', '癸亥': '大海水'
}

function getShichenIndex(hour) {
  if (hour === 23 || hour === 0) return 0
  return Math.floor((hour + 1) / 2)
}

function getShichen(hour) {
  return SHICHEN[getShichenIndex(hour)]
}

function getShichenName(hour) {
  return DIZHI[getShichenIndex(hour)] + '时'
}

function getZodiac(year) {
  return SHENGXIAO[(year - 4) % 12]
}

function getYearGanZhi(year) {
  const ganIdx = (year - 4) % 10
  const zhiIdx = (year - 4) % 12
  return TIANGAN[ganIdx] + DIZHI[zhiIdx]
}

function getMonthGanZhi(yearGan, month) {
  const ganStartMap = { '甲': 2, '乙': 4, '丙': 6, '丁': 8, '戊': 2, '己': 4, '庚': 6, '辛': 8, '壬': 2, '癸': 4 }
  const ganIdx = ganStartMap[yearGan[0]] + (month - 1)
  const zhiIdx = (month + 1) % 12
  return TIANGAN[ganIdx % 10] + DIZHI[zhiIdx]
}

function getDayGanZhi(year, month, day) {
  const baseDate = new Date(1900, 0, 1)
  const targetDate = new Date(year, month - 1, day)
  const diffDays = Math.floor((targetDate - baseDate) / (24 * 60 * 60 * 1000))
  const ganIdx = (diffDays + 6) % 10
  const zhiIdx = (diffDays) % 12
  if (ganIdx < 0 || zhiIdx < 0) return '甲子'
  return TIANGAN[ganIdx] + DIZHI[zhiIdx]
}

function getHourGanZhi(dayGan, hour) {
  const ganStartMap = { '甲': 0, '乙': 2, '丙': 4, '丁': 6, '戊': 8, '己': 0, '庚': 2, '辛': 4, '壬': 6, '癸': 8 }
  const zhiIdx = getShichenIndex(hour)
  const ganIdx = (ganStartMap[dayGan[0]] + zhiIdx) % 10
  return TIANGAN[ganIdx] + DIZHI[zhiIdx]
}

function getGanZhi(year, month, day, hour) {
  const yearGZ = getYearGanZhi(year)
  const monthGZ = getMonthGanZhi(yearGZ, month)
  const dayGZ = getDayGanZhi(year, month, day)
  const hourGZ = getHourGanZhi(dayGZ, hour)
  return {
    yearPillar: yearGZ,
    monthPillar: monthGZ,
    dayPillar: dayGZ,
    hourPillar: hourGZ
  }
}

function getNaying(pillar) {
  return NAYING_TABLE[pillar] || '未知'
}

function getWuxingFromGanZhi(ganzhi) {
  const ganWx = TIANGAN_WUXING[ganzhi[0]] || ''
  const zhiWx = DIZHI_WUXING[ganzhi[1]] || ''
  return { gan: ganWx, zhi: zhiWx }
}

function countWuxing(pillars) {
  const count = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 }
  const allPillars = [pillars.yearPillar, pillars.monthPillar, pillars.dayPillar, pillars.hourPillar]
  allPillars.forEach(p => {
    if (!p) return
    const wx = getWuxingFromGanZhi(p)
    if (wx.gan) count[wx.gan]++
    if (wx.zhi) count[wx.zhi]++
  })
  return count
}

function analyzeWuxingBalance(count) {
  const missing = [], strong = [], weak = []
  for (const [element, cnt] of Object.entries(count)) {
    if (cnt === 0) missing.push(element)
  }
  const total = Object.values(count).reduce((a, b) => a + b, 0)
  if (total === 0) return { missing, strong, weak }
  const avg = total / 5
  for (const [element, cnt] of Object.entries(count)) {
    if (cnt > 0 && cnt > avg * 1.5) strong.push(element)
    else if (cnt > 0 && cnt < avg * 0.5) weak.push(element)
  }
  return { missing, strong, weak }
}

module.exports = {
  TIANGAN, DIZHI, SHENGXIAO, SHICHEN, WUXING,
  TIANGAN_WUXING, DIZHI_WUXING, TIANGAN_YINYANG,
  getShichenIndex, getShichen, getShichenName,
  getZodiac, getYearGanZhi, getMonthGanZhi, getDayGanZhi, getHourGanZhi,
  getGanZhi, getNaying, getWuxingFromGanZhi,
  countWuxing, analyzeWuxingBalance
}
