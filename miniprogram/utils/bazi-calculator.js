/**
 * 命理大师 - 八字计算引擎（增强版）
 * Enhanced with: 喜用神, 格局, 十神详析, 大运分析, 人生领域, 性格, 幸运元素
 */
const dateUtil = require('./date-util')

const SHISHEN_MAP = {
  '比肩': 'same', '劫财': 'same',
  '食神': 'output', '伤官': 'output',
  '偏财': 'wealth', '正财': 'wealth',
  '七杀': 'power', '正官': 'power',
  '偏印': 'resource', '正印': 'resource'
}

function getShishen(dayMasterWx, targetWx, dmYinYang, tgYinYang) {
  if (!dayMasterWx || !targetWx) return '未知'
  const wuxingOrder = ['木', '火', '土', '金', '水']
  const dmIdx = wuxingOrder.indexOf(dayMasterWx)
  const tgIdx = wuxingOrder.indexOf(targetWx)

  if (dmIdx === tgIdx) {
    return (dmYinYang === tgYinYang) ? '比肩' : '劫财'
  }
  if (tgIdx === (dmIdx + 1) % 5) {
    return (dmYinYang === tgYinYang) ? '食神' : '伤官'
  }
  if (tgIdx === (dmIdx + 2) % 5) {
    return (dmYinYang === tgYinYang) ? '偏财' : '正财'
  }
  if (tgIdx === (dmIdx + 3) % 5) {
    return (dmYinYang === tgYinYang) ? '七杀' : '正官'
  }
  if (tgIdx === (dmIdx + 4) % 5) {
    return (dmYinYang === tgYinYang) ? '偏印' : '正印'
  }
  return '未知'
}

// 地支藏干对应
const ZHI_CANG_GAN = {
  '子': ['癸'], '丑': ['己', '癸', '辛'], '寅': ['甲', '丙', '戊'],
  '卯': ['乙'], '辰': ['戊', '乙', '癸'], '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'], '未': ['己', '丁', '乙'], '申': ['庚', '壬', '戊'],
  '酉': ['辛'], '戌': ['戊', '辛', '丁'], '亥': ['壬', '甲']
}

function calculateBazi(year, month, day, hour, gender) {
  const pillars = dateUtil.getGanZhi(year, month, day, hour)
  const dayMaster = pillars.dayPillar[0]
  const dayMasterWx = dateUtil.TIANGAN_WUXING[dayMaster]
  const dayMasterYy = dateUtil.TIANGAN_YINYANG[dayMaster]

  const wuxingCount = dateUtil.countWuxing(pillars)
  const balance = dateUtil.analyzeWuxingBalance(wuxingCount)

  // Full 十神 for all 8 characters
  const fullShishen = getFullShishen(dayMasterWx, dayMasterYy, pillars)

  const naying = {
    year: dateUtil.getNaying(pillars.yearPillar),
    month: dateUtil.getNaying(pillars.monthPillar),
    day: dateUtil.getNaying(pillars.dayPillar),
    hour: dateUtil.getNaying(pillars.hourPillar)
  }

  const zodiac = dateUtil.getZodiac(year)
  const shichen = dateUtil.getShichenName(hour)
  const strength = analyzeDayMasterStrength(dayMasterWx, wuxingCount)

  // 喜用神
  const xiyong = getXiyongShen(dayMasterWx, wuxingCount, strength)

  // 格局
  const geju = getGeju(dayMasterWx, dayMasterYy, pillars, fullShishen)

  // 大运
  const dayunList = getDayunList(gender, pillars.monthPillar, estimateStartAge(month, gender, pillars.monthPillar))

  // 性格
  const personality = analyzePersonality(dayMaster, dayMasterWx, strength)

  // 人生领域
  const lifeDomains = analyzeLifeDomains(dayMasterWx, wuxingCount, fullShishen, strength)

  // 幸运元素
  const luckyElements = getLuckyElements(xiyong)

  // 详细评述
  const reading = generateRichReading(dayMaster, dayMasterWx, strength, wuxingCount, balance, xiyong, geju, personality, zodiac, naying, pillars, fullShishen)

  return {
    pillars, dayMaster, dayMasterWx, dayMasterYy,
    wuxingCount, wuxingBalance: balance,
    fullShishen, naying, zodiac, shichen, gender, strength,
    xiyong, geju, dayunList, personality, lifeDomains, luckyElements, reading
  }
}

function getFullShishen(dayMasterWx, dayMasterYy, pillars) {
  const result = {}
  const positions = ['yearPillar', 'monthPillar', 'dayPillar', 'hourPillar']
  positions.forEach(pos => {
    const gan = pillars[pos][0]
    const zhi = pillars[pos][1]
    const ganWx = dateUtil.TIANGAN_WUXING[gan]
    const ganYy = dateUtil.TIANGAN_YINYANG[gan]
    const ganShishen = pos === 'dayPillar' ? '日主' : getShishen(dayMasterWx, ganWx, dayMasterYy, ganYy)

    // 地支藏干十神
    const cangGan = ZHI_CANG_GAN[zhi] || []
    const zhiShishen = cangGan.map(cg => {
      const cgWx = dateUtil.TIANGAN_WUXING[cg]
      const cgYy = dateUtil.TIANGAN_YINYANG[cg]
      return { gan: cg, shishen: getShishen(dayMasterWx, cgWx, dayMasterYy, cgYy) }
    })

    result[pos] = {
      gan: gan, ganShishen: ganShishen,
      zhi: zhi, zhiShishen: zhiShishen
    }
  })
  return result
}

function analyzeDayMasterStrength(dayMasterWx, wuxingCount) {
  const wuxingOrder = ['木', '火', '土', '金', '水']
  const dmIdx = wuxingOrder.indexOf(dayMasterWx)
  const selfCount = wuxingCount[dayMasterWx] || 0
  const resourceWx = wuxingOrder[(dmIdx + 4) % 5]
  const resourceCount = wuxingCount[resourceWx] || 0
  const supportCount = selfCount + resourceCount

  if (supportCount >= 4) return { level: '身强', score: supportCount, description: '日主得令有助，根基深厚，行事果断有力' }
  if (supportCount >= 2) return { level: '中和', score: supportCount, description: '日主力量适中，五行较均衡，为人通达' }
  return { level: '身弱', score: supportCount, description: '日主力量不足，需扶助，宜借力行事' }
}

function getXiyongShen(dayMasterWx, wuxingCount, strength) {
  const wuxingOrder = ['木', '火', '土', '金', '水']
  const dmIdx = wuxingOrder.indexOf(dayMasterWx)

  // 生我者（印）、同我者（比劫）为生扶
  const resourceWx = wuxingOrder[(dmIdx + 4) % 5]  // 生我
  const outputWx = wuxingOrder[(dmIdx + 1) % 5]    // 我生（泄）
  const wealthWx = wuxingOrder[(dmIdx + 2) % 5]    // 我克（耗）
  const powerWx = wuxingOrder[(dmIdx + 3) % 5]     // 克我（压）

  let xiWx, yongWx, jiWx
  if (strength.level === '身强') {
    // 身强喜克泄耗
    xiWx = outputWx    // 泄秀
    yongWx = wealthWx  // 耗力
    jiWx = resourceWx  // 忌生扶
  } else {
    // 身弱喜生扶
    xiWx = resourceWx  // 生我
    yongWx = dayMasterWx // 助我
    jiWx = powerWx     // 忌克压
  }

  return {
    xi: xiWx,
    yong: yongWx,
    ji: jiWx,
    description: strength.level === '身强'
      ? `日主身强，喜${xiWx}（食伤泄秀）、${yongWx}（财星耗力），忌${jiWx}（印星生扶太过）`
      : `日主身弱，喜${xiWx}（印星生扶）、${yongWx}（比劫助力），忌${jiWx}（官杀克身）`
  }
}

function getGeju(dayMasterWx, dayMasterYy, pillars, fullShishen) {
  // 以月支藏干本气十神定格局
  const monthZhiShishen = fullShishen.monthPillar.zhiShishen
  if (!monthZhiShishen || monthZhiShishen.length === 0) {
    return { name: '普通格', description: '五行流通，无特殊格局' }
  }

  const mainShishen = monthZhiShishen[0].shishen
  const gejuMap = {
    '正官': { name: '正官格', desc: '为人端正，守规矩，有责任感，适合体制内发展' },
    '七杀': { name: '偏官格', desc: '性格刚烈，有魄力，适合创业或武职' },
    '正财': { name: '正财格', desc: '为人务实，善于理财，财源稳定' },
    '偏财': { name: '偏财格', desc: '交际广泛，偏财运佳，善于把握商机' },
    '正印': { name: '正印格', desc: '聪明好学，心地善良，适合文化教育' },
    '偏印': { name: '偏印格', desc: '思维独特，善于钻研，适合技术创新' },
    '食神': { name: '食神格', desc: '温和有福，才华横溢，衣食无忧' },
    '伤官': { name: '伤官格', desc: '才华出众，个性鲜明，适合艺术创作' },
    '比肩': { name: '建禄格', desc: '独立自主，竞争意识强，宜合伙经营' },
    '劫财': { name: '羊刃格', desc: '果断勇敢，有领导力，需防冲动' }
  }

  const info = gejuMap[mainShishen] || { name: '普通格', desc: '五行流转，中正平和' }
  return { name: info.name, description: info.desc, mainShishen }
}

function estimateStartAge(month, gender, monthPillar) {
  // Simplified: estimate start age 3-6
  const monthNum = typeof month === 'number' ? month : 6
  return Math.max(1, Math.min(7, Math.ceil(monthNum / 2)))
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
    const wx = dateUtil.TIANGAN_WUXING[dateUtil.TIANGAN[gIdx]]
    result.push({
      ganzhi, startAge: startA, endAge: endA,
      label: `${startA}-${endA}岁`, wuxing: wx,
      reading: getDayunReading(wx, ganzhi)
    })
  }
  return result
}

function getDayunReading(wx, ganzhi) {
  const readings = {
    '金': '金运主事，利于决断、改革、收获',
    '木': '木运主事，利于成长、发展、学业',
    '水': '水运主事，利于智慧、流动、人脉',
    '火': '火运主事，利于名气、表达、创新',
    '土': '土运主事，利于稳固、积累、房产'
  }
  return readings[wx] || '运势平稳'
}

// 天干性格
const TIANGAN_PERSONALITY = {
  '甲': { trait: '正直向上', desc: '如参天大树，性格刚直不阿，有领导才能。为人坦诚，做事有始有终，但有时过于固执。', strength: '领导力强，有担当', weakness: '不够灵活，易刚愎自用' },
  '乙': { trait: '柔韧灵活', desc: '如花草藤蔓，适应力强，善于变通。为人温和，善于合作，但有时优柔寡断。', strength: '适应力强，善于协作', weakness: '缺乏主见，易受影响' },
  '丙': { trait: '热情开朗', desc: '如太阳高照，光明磊落，热情大方。为人慷慨，有感染力，但有时过于张扬。', strength: '热情大方，感染力强', weakness: '锋芒太露，易冲动' },
  '丁': { trait: '细腻内敛', desc: '如灯烛之光，温柔细腻，洞察力强。为人聪慧，善于观察，但有时过于敏感。', strength: '心思细腻，善于洞察', weakness: '多疑敏感，易内耗' },
  '戊': { trait: '稳重宽厚', desc: '如高山大地，沉稳可靠，包容性强。为人忠厚，做事踏实，但有时过于保守。', strength: '稳重可靠，包容大度', weakness: '不够灵活，行动偏慢' },
  '己': { trait: '谦逊包容', desc: '如田园沃土，谦和低调，善于养育。为人随和，善于照顾他人，但有时缺乏魄力。', strength: '善于培育，人际和谐', weakness: '缺乏魄力，易妥协' },
  '庚': { trait: '刚毅果断', desc: '如刀剑利刃，性格刚毅，做事果断。为人重义气，行动力强，但有时过于强硬。', strength: '果断干脆，重情重义', weakness: '过于强势，不善变通' },
  '辛': { trait: '精致锐利', desc: '如珠玉宝石，精致讲究，审美独特。为人清高，追求完美，但有时过于挑剔。', strength: '品味独特，追求卓越', weakness: '过于完美主义，易焦虑' },
  '壬': { trait: '聪慧通达', desc: '如江河大海，智慧深远，格局宏大。为人洒脱，思维敏捷，但有时缺乏定力。', strength: '思维开阔，应变力强', weakness: '不够专注，易散漫' },
  '癸': { trait: '温润细腻', desc: '如雨露甘泉，温润含蓄，直觉敏锐。为人聪明，善于谋划，但有时过于内向。', strength: '直觉敏锐，善于谋划', weakness: '过于内敛，错失良机' }
}

function analyzePersonality(dayMaster, dayMasterWx, strength) {
  const base = TIANGAN_PERSONALITY[dayMaster] || { trait: '独特', desc: '性格独特，有个人魅力。', strength: '各有千秋', weakness: '需扬长避短' }

  const wxTrait = {
    '金': '重义气，讲原则',
    '木': '有进取心，积极向上',
    '水': '聪慧灵活，善于变通',
    '火': '热情有礼，善于表达',
    '土': '稳重守信，厚道包容'
  }

  return {
    ...base,
    wuxingTrait: wxTrait[dayMasterWx] || '',
    strengthTrait: strength.level === '身强' ? '性格坚定，执行力强' : strength.level === '身弱' ? '性格温和，善于借力' : '性格中正，刚柔并济'
  }
}

function analyzeLifeDomains(dayMasterWx, wuxingCount, fullShishen, strength) {
  const wuxingOrder = ['木', '火', '土', '金', '水']
  const dmIdx = wuxingOrder.indexOf(dayMasterWx)
  const wealthWx = wuxingOrder[(dmIdx + 2) % 5]
  const powerWx = wuxingOrder[(dmIdx + 3) % 5]
  const outputWx = wuxingOrder[(dmIdx + 1) % 5]
  const resourceWx = wuxingOrder[(dmIdx + 4) % 5]

  const wealthCount = wuxingCount[wealthWx] || 0
  const powerCount = wuxingCount[powerWx] || 0
  const outputCount = wuxingCount[outputWx] || 0
  const resourceCount = wuxingCount[resourceWx] || 0

  return {
    career: {
      title: '事业运',
      level: powerCount >= 2 ? '较旺' : powerCount >= 1 ? '平稳' : '偏弱',
      reading: powerCount >= 2
        ? '八字中官杀有力，事业心强，有贵人提携，适合体制内或管理岗位。中年后事业渐入佳境。'
        : powerCount >= 1
        ? '事业运平稳，适合稳扎稳打。选择适合自己的行业深耕，可获不错发展。'
        : '官杀偏弱，不宜过于强求仕途。适合自由职业或专业技术方向，凭才艺立足。',
      advice: powerCount >= 2 ? '宜把握仕途机遇，勇于担当' : '宜专注一技之长，厚积薄发'
    },
    wealth: {
      title: '财运',
      level: wealthCount >= 2 ? '较旺' : wealthCount >= 1 ? '平稳' : '偏弱',
      reading: wealthCount >= 2
        ? '财星有力，理财意识强，有聚财之能。正财偏财皆有机会，适合投资理财。'
        : wealthCount >= 1
        ? '财运中等，收入稳定。正财为主，不宜贪图暴利，稳健理财为宜。'
        : '财星偏弱，不宜冒险投资。宜以技能换取收入，量入为出，积少成多。',
      advice: wealthCount >= 2 ? '可适度投资，注意分散风险' : '宜稳健理财，开源节流'
    },
    love: {
      title: '感情运',
      level: (wealthCount + outputCount) >= 3 ? '丰富' : (wealthCount + outputCount) >= 1 ? '平稳' : '平淡',
      reading: dayMasterWx === '金' ? '感情中重承诺，对伴侣忠诚，但需注意表达方式，多些温柔。'
        : dayMasterWx === '木' ? '感情中真诚专一，追求精神契合。宜主动表达心意，不要过于含蓄。'
        : dayMasterWx === '水' ? '感情中浪漫多情，异性缘好。需专一用心，避免三心二意。'
        : dayMasterWx === '火' ? '感情中热情主动，敢爱敢恨。需控制情绪，多些包容和耐心。'
        : '感情中稳重踏实，给人安全感。需适当制造浪漫，增加生活情趣。',
      advice: '真诚待人，珍惜缘分，感情需要用心经营'
    },
    health: {
      title: '健康运',
      level: '平稳',
      reading: `五行中${dayMasterWx}为主，需注意与${dayMasterWx}相关脏腑的保养。` +
        (strength.level === '身弱' ? '体质偏弱，宜注重养生，适当运动增强体质。' : '体质较好，保持良好作息即可。'),
      advice: `注意${getHealthAdvice(dayMasterWx)}`
    }
  }
}

function getHealthAdvice(wx) {
  const advice = {
    '金': '肺部、呼吸道保养，宜多做有氧运动',
    '木': '肝脏、眼睛保养，宜保持心情舒畅',
    '水': '肾脏、泌尿系统保养，宜注意保暖',
    '火': '心脏、血液循环保养，宜控制情绪',
    '土': '脾胃、消化系统保养，宜规律饮食'
  }
  return advice[wx] || '均衡饮食，适量运动'
}

function getLuckyElements(xiyong) {
  const wxColor = {
    '金': ['白色', '银色', '金色'], '木': ['绿色', '青色'],
    '水': ['黑色', '深蓝'], '火': ['红色', '紫色'], '土': ['黄色', '棕色']
  }
  const wxDirection = {
    '金': '西方', '木': '东方', '水': '北方', '火': '南方', '土': '中央'
  }
  const wxNumber = {
    '金': '4、9', '木': '3、8', '水': '1、6', '火': '2、7', '土': '5、0'
  }
  const wxSeason = {
    '金': '秋季', '木': '春季', '水': '冬季', '火': '夏季', '土': '四季交替之时'
  }
  const wxIndustry = {
    '金': '金融、机械、五金、珠宝', '木': '教育、文化、农业、出版',
    '水': '物流、旅游、传媒、贸易', '火': '餐饮、能源、电子、娱乐',
    '土': '房产、建筑、农牧、仓储'
  }

  const xi = xiyong.xi
  return {
    colors: wxColor[xi] || ['米色'],
    direction: wxDirection[xi] || '中央',
    numbers: wxNumber[xi] || '5、0',
    season: wxSeason[xi] || '四季',
    industry: wxIndustry[xi] || '综合行业'
  }
}

function generateRichReading(dayMaster, dayMasterWx, strength, wuxingCount, balance, xiyong, geju, personality, zodiac, naying, pillars, fullShishen) {
  const sections = []

  // 总论
  sections.push({
    title: '命理总论',
    content: `日主${dayMaster}，五行属${dayMasterWx}，${personality.trait}。${strength.description}。生肖属${zodiac}，年柱纳音${naying.year}。${geju.name}，${geju.description}。`
  })

  // 五行喜用
  sections.push({
    title: '五行喜用',
    content: xiyong.description + (balance.missing.length > 0 ? `五行缺${balance.missing.join('、')}，可在生活中适当补之。` : '') + (balance.strong.length > 0 ? `五行${balance.strong.join('、')}较旺，宜适当疏导。` : '')
  })

  // 十神格局
  const ssDesc = Object.entries(fullShishen).map(([pos, data]) => {
    const posName = { yearPillar: '年柱', monthPillar: '月柱', dayPillar: '日柱', hourPillar: '时柱' }[pos]
    return posName + data.ganShishen
  }).join('、')
  sections.push({
    title: '十神分布',
    content: `四柱天干十神：${ssDesc}。此格局${geju.name}，以${geju.mainShishen || '正官'}为用神主线。`
  })

  return { sections }
}

module.exports = {
  calculateBazi,
  analyzeDayMasterStrength,
  getShishen,
  getDayunList,
  generateRichReading: generateRichReading,
  TIANGAN_PERSONALITY
}
