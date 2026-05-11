/**
 * 命理大师 - 农历与日期工具
 * V2: 修复立春分界、夜子时处理
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

// 立春日期近似表（月/日），每年立春约在2月3-5日
// 精确到天的近似值，对于小程序娱乐用途足够
function getLichunDate(year) {
  // 立春日期规律：约在2月3-5日，用简化公式
  // 2000年立春为2月4日
  const offset = ((year - 2000) % 4 === 0) ? 4 : ((year - 2000) % 4 === 1) ? 3 : ((year - 2000) % 4 === 2) ? 4 : 5
  return { month: 2, day: offset }
}

function isBeforeLichun(month, day, year) {
  if (month > 2) return false
  if (month < 2) return true
  const lc = getLichunDate(year)
  return day < lc.day
}

/**
 * 根据阳历月日确定八字月份（节气月）
 * 使用12个节气近似日期分界
 * @returns {number} 八字月 1-12 (1=寅月, 12=丑月)
 */
function getBaziMonth(solarMonth, solarDay, year) {
  // 12个节气分界近似日（每个八字月的起始节气）
  // 格式: [阳历月, 节气日, 八字月号]
  if (solarMonth === 2) {
    // 立春使用更精确的年计算
    const lc = getLichunDate(year)
    return solarDay < lc.day ? 12 : 1
  }
  if (solarMonth === 1) return solarDay < 6 ? 11 : 12   // 小寒~Jan6
  if (solarMonth === 3) return solarDay < 6 ? 1 : 2     // 惊蛰~Mar6
  if (solarMonth === 4) return solarDay < 5 ? 2 : 3     // 清明~Apr5
  if (solarMonth === 5) return solarDay < 6 ? 3 : 4     // 立夏~May6
  if (solarMonth === 6) return solarDay < 6 ? 4 : 5     // 芒种~Jun6
  if (solarMonth === 7) return solarDay < 7 ? 5 : 6     // 小暑~Jul7
  if (solarMonth === 8) return solarDay < 8 ? 6 : 7     // 立秋~Aug8
  if (solarMonth === 9) return solarDay < 8 ? 7 : 8     // 白露~Sep8
  if (solarMonth === 10) return solarDay < 8 ? 8 : 9    // 寒露~Oct8
  if (solarMonth === 11) return solarDay < 7 ? 9 : 10   // 立冬~Nov7
  if (solarMonth === 12) return solarDay < 7 ? 10 : 11  // 大雪~Dec7
  return 1
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
  // 五虎遁：甲己之年丙作首(2)，乙庚之年戊为头(4)，丙辛之年庚为首(6)，丁壬之年壬为头(8)，戊癸之年甲为头(0)
  const ganStartMap = { '甲': 2, '乙': 4, '丙': 6, '丁': 8, '戊': 0, '己': 2, '庚': 4, '辛': 6, '壬': 8, '癸': 0 }
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
  // 确定八字月份（基于节气分界）
  const baziMonth = getBaziMonth(month, day, year)

  // 年柱：立春前（子月/丑月在阳历1-2月）属上一年
  let actualYear = year
  if (baziMonth >= 11 && (month === 1 || month === 2)) {
    actualYear = year - 1
  }
  const yearGZ = getYearGanZhi(actualYear)

  // 月柱：使用八字月份计算
  const monthGZ = getMonthGanZhi(yearGZ, baziMonth)

  // 日柱：夜子时（23时）归属次日
  let actualDay = day
  let actualDayMonth = month
  let actualDayYear = year
  if (hour === 23) {
    const nextDate = new Date(year, month - 1, day + 1)
    actualDayYear = nextDate.getFullYear()
    actualDayMonth = nextDate.getMonth() + 1
    actualDay = nextDate.getDate()
  }
  const dayGZ = getDayGanZhi(actualDayYear, actualDayMonth, actualDay)

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
  countWuxing, analyzeWuxingBalance,
  isBeforeLichun, getLichunDate, getBaziMonth
}
