/**
 * 每日穿衣推荐 - 完整版
 *
 * 两层体系：
 * Layer 1: 通用五行穿衣（基于日干五行，所有人相同）
 * Layer 2: 个人命理穿衣（基于八字喜用神，因人而异）
 *
 * 配色协调算法：
 * - 同行色 → 同色系深浅渐变（最安全）
 * - 相生色 → 邻近色搭配（自然和谐）
 * - 相克色 → 中性色过渡（避免红配绿）
 */
const dateUtil = require('./date-util')

// ========== 五行颜色详表 ==========
const ELEMENT_COLORS = {
  '金': {
    names: ['白色', '银色', '金色'],
    extended: ['米白', '杏色', '乳白', '浅灰'],
    materials: '丝绸、缎面、挺括面料',
    accessories: '金银饰品、金属手表、钻石',
    colors: ['#F5F5F5', '#C0C0C0', '#FFD700'],
    outfit: '白衬衫/米白针织衫 + 浅灰裤/裙 + 金色/银色配饰'
  },
  '木': {
    names: ['绿色', '青色', '翠色'],
    extended: ['薄荷绿', '森林绿', '橄榄绿'],
    materials: '棉麻、天然纤维、竹纤维',
    accessories: '檀木手串、翡翠、绿幽灵',
    colors: ['#4CAF50', '#00CED1', '#2E8B57'],
    outfit: '绿色上衣/薄荷绿衬衫 + 卡其裤 + 翡翠/木质饰品'
  },
  '水': {
    names: ['黑色', '蓝色', '灰色'],
    extended: ['藏青', '靛蓝', '深灰', '炭黑'],
    materials: '雪纺、蕾丝、垂坠面料',
    accessories: '珍珠、黑曜石、海蓝宝',
    colors: ['#2C2C2C', '#4A90D9', '#9E9E9E'],
    outfit: '藏青外套/深蓝上衣 + 灰色裤/裙 + 珍珠/黑曜石饰品'
  },
  '火': {
    names: ['红色', '紫色', '粉色'],
    extended: ['玫红', '酒红', '橙色', '珊瑚色'],
    materials: '光泽面料、化纤、绒面',
    accessories: '红宝石、石榴石、朱砂、紫水晶',
    colors: ['#E53935', '#9C27B0', '#F48FB1'],
    outfit: '酒红/玫红单品 + 中性色外套 + 红色系饰品点缀'
  },
  '土': {
    names: ['黄色', '棕色', '咖色'],
    extended: ['驼色', '卡其', '奶茶色', '焦糖色'],
    materials: '羊毛、羊绒、粗花呢、皮革',
    accessories: '陶瓷、黄水晶、琥珀、和田玉',
    colors: ['#FFC107', '#8D6E63', '#A1887F'],
    outfit: '驼色/卡其外套 + 奶茶色内搭 + 琥珀/皮质配饰'
  }
}

// ========== 五行生克 ==========
const GENERATE     = { '金': '水', '水': '木', '木': '火', '火': '土', '土': '金' }
const GENERATED_BY = { '金': '土', '水': '金', '木': '水', '火': '木', '土': '火' }
const CONTROL      = { '金': '木', '木': '土', '土': '水', '水': '火', '火': '金' }
const CONTROLLED_BY = { '金': '火', '水': '土', '木': '金', '火': '水', '土': '木' }

// 中性过渡色（百搭色系）
const NEUTRAL = '金' // 白/银/米白系几乎百搭所有颜色

const SHICHEN_HOURS = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]

// ========== 通用五行穿衣 ==========
function getUniversalDress(dateOffset) {
  const target = offsetDate(dateOffset || 0)
  const y = target.getFullYear(), m = target.getMonth() + 1, d = target.getDate()
  const dayGZ = dateUtil.getDayGanZhi(y, m, d)
  const dayElement = dateUtil.TIANGAN_WUXING[dayGZ[0]]

  return {
    date: `${m}月${d}日`,
    dayGanZhi: dayGZ,
    dayElement,
    dayOfWeek: ['日','一','二','三','四','五','六'][target.getDay()],
    personal: null,
    tiers: [
      buildTier('daji',    GENERATED_BY[dayElement], '大吉·贵人色', '生我者，易获贵人相助，事半功倍', 5),
      buildTier('ji',      dayElement,               '吉·幸运色',   '同我者，与当日磁场契合，增强自信', 4),
      buildTier('ciji',    GENERATE[dayElement],     '次吉·进财色', '我生者，付出有收获，利求财合作', 3),
      buildTier('shoucai', CONTROL[dayElement],      '平·收财色',   '我克者为财，努力可获回报', 2),
      buildTier('buyi',    CONTROLLED_BY[dayElement],'不宜·消耗色', '克我者，易生疲倦损耗，尽量避开', 0)
    ]
  }
}

// ========== 个人命理穿衣 ==========
function getPersonalizedDress(birthDate, birthHourIndex, name, dateOffset) {
  const parts = birthDate.split('-').map(Number)
  const year = parts[0], month = parts[1], day = parts[2]
  const hour = SHICHEN_HOURS[birthHourIndex != null ? birthHourIndex : 6]

  // 排八字
  const bazi = dateUtil.getGanZhi(year, month, day, hour)
  const dayGan = bazi.dayPillar[0]
  const dayMasterElement = dateUtil.TIANGAN_WUXING[dayGan]

  // 分析喜用神
  const xiYong = analyzeXiYongShen(bazi, dayMasterElement)

  // 目标日干支
  const target = offsetDate(dateOffset || 0)
  const todayGZ = dateUtil.getDayGanZhi(target.getFullYear(), target.getMonth() + 1, target.getDate())
  const todayElement = dateUtil.TIANGAN_WUXING[todayGZ[0]]

  // 策略
  const strategy = calculateStrategy(xiYong.element, todayElement)

  // 配色协调 - 核心算法
  const outfit = coordinateOutfit(xiYong.element, todayElement, strategy)

  // 通用穿衣结果
  const universal = getUniversalDress(dateOffset)

  return {
    ...universal,
    personal: {
      name: name || '',
      dayMaster: dayGan,
      dayMasterElement,
      dayMasterLabel: dayGan + dayMasterElement,
      xiYongShen: xiYong.element,
      xiYongReason: xiYong.reason,
      xiYongColor: ELEMENT_COLORS[xiYong.element],
      strategy,
      // 协调穿搭方案
      outfit,
      accessoryTip: ELEMENT_COLORS[xiYong.element].accessories,
      summary: outfit.summary
    }
  }
}

// ========== 配色协调算法 ==========
/**
 * 给定喜用神五行 + 今日五行，输出一套协调的穿搭方案
 * 避免红配绿、蓝配橙等尴尬组合
 */
function coordinateOutfit(xiYong, todayElement, strategy) {
  const xiColor = ELEMENT_COLORS[xiYong]
  const todayDaJi = ELEMENT_COLORS[GENERATED_BY[todayElement]]

  // Case 1: 喜用神色 === 今日大吉色 → 最理想，同色系
  if (xiYong === GENERATED_BY[todayElement]) {
    return {
      mainElement: xiYong,
      mainColor: xiColor,
      subElement: null,
      style: 'monochromatic',
      coordDesc: '喜用神与今日大吉同频',
      outfitText: `今日最佳！全身${xiColor.names[0]}系，深浅渐变搭配即可`,
      outfitDetail: xiColor.outfit,
      colors: xiColor.colors
    }
  }

  // Case 2: 喜用神 === 今日五行(同气) → 同色系，加强版
  if (xiYong === todayElement) {
    return {
      mainElement: xiYong,
      mainColor: xiColor,
      subElement: null,
      style: 'monochromatic',
      coordDesc: '喜用神与今日五行共振',
      outfitText: `运势极佳日！全身${xiColor.names[0]}系，怎么穿怎么旺`,
      outfitDetail: xiColor.outfit,
      colors: xiColor.colors
    }
  }

  // Case 3: 相生关系 → 邻近色搭配，自然和谐
  if (GENERATE[xiYong] === GENERATED_BY[todayElement] ||
      GENERATE[GENERATED_BY[todayElement]] === xiYong) {
    return {
      mainElement: xiYong,
      mainColor: xiColor,
      subElement: GENERATED_BY[todayElement],
      subColor: todayDaJi,
      style: 'analogous',
      coordDesc: '相生配色，自然和谐',
      outfitText: `${xiColor.names[0]}系为主色，${todayDaJi.names[0]}系作搭配，色系相近自然过渡`,
      outfitDetail: `${xiColor.extended[0]}上衣 + ${todayDaJi.extended[0]}下装，层次分明`,
      colors: [...xiColor.colors.slice(0, 2), ...todayDaJi.colors.slice(0, 2)]
    }
  }

  // Case 4: 相克关系 → 用中性色过渡，避免直接撞色
  if (CONTROL[xiYong] === GENERATED_BY[todayElement] ||
      CONTROL[GENERATED_BY[todayElement]] === xiYong ||
      CONTROLLED_BY[xiYong] === GENERATED_BY[todayElement] ||
      CONTROLLED_BY[GENERATED_BY[todayElement]] === xiYong) {
    const bridge = findVisualBridge(xiYong, GENERATED_BY[todayElement])
    const bridgeColor = ELEMENT_COLORS[bridge]
    return {
      mainElement: bridge,
      mainColor: bridgeColor,
      subElement: xiYong,
      subColor: xiColor,
      style: 'bridged',
      coordDesc: '中性色过渡，避免撞色',
      outfitText: `以${bridgeColor.names[0]}系为主色，${xiColor.names[0]}系作点缀，自然过渡不突兀`,
      outfitDetail: `${bridgeColor.extended[0]}外套/上衣为主 + ${xiColor.extended[0]}围巾/包包点缀`,
      colors: [...bridgeColor.colors.slice(0, 2), ...xiColor.colors.slice(0, 1)]
    }
  }

  // Case 5: 其他 → 喜用神色为主，中性色搭
  return {
    mainElement: xiYong,
    mainColor: xiColor,
    subElement: NEUTRAL,
    subColor: ELEMENT_COLORS[NEUTRAL],
    style: 'neutral',
    coordDesc: '喜用神色为主，百搭中性色搭配',
    outfitText: `${xiColor.names[0]}系为主色，搭配${ELEMENT_COLORS[NEUTRAL].names[0]}系做底，安全又好看`,
    outfitDetail: `${xiColor.names[0]}系上装 + ${ELEMENT_COLORS[NEUTRAL].extended[0]}裤/裙 + ${xiColor.accessories}`,
    colors: [...xiColor.colors.slice(0, 2), ...ELEMENT_COLORS[NEUTRAL].colors.slice(0, 1)]
  }
}

/**
 * 找视觉过渡色 - 当两色相克时，找一个搭配起来都好看的中性色
 * 策略：优先用被双方都"生"的色，或者用白/灰/驼色等百搭色
 */
function findVisualBridge(elementA, elementB) {
  // 土色系（驼色/卡其）是万能过渡色，跟什么都搭
  // 白色系也是万能搭配色
  // 优先选生扶A的色（对喜用神有利）
  const aGeneratedBy = GENERATED_BY[elementA]

  // 如果生A的色不和B冲突，就用它
  if (aGeneratedBy !== elementB && CONTROL[aGeneratedBy] !== elementB && CONTROLLED_BY[aGeneratedBy] !== elementB) {
    return aGeneratedBy
  }

  // 否则直接用土色（驼色/卡其），公认的百搭过渡色
  // 但如果土本身就是冲突方，就用金（白色系）
  if (elementA === '土' || elementB === '土') return '金'
  return '土'
}

// ========== 喜用神分析 ==========
function analyzeXiYongShen(bazi, dayMasterElement) {
  const count = dateUtil.countWuxing(bazi)
  const balance = dateUtil.analyzeWuxingBalance(count)

  const shengFu = count[dayMasterElement] + count[GENERATED_BY[dayMasterElement]]
  const keXie   = count[GENERATE[dayMasterElement]] + count[CONTROL[dayMasterElement]] + count[CONTROLLED_BY[dayMasterElement]]

  let xiYongElement, reason

  if (balance.missing.length > 0) {
    xiYongElement = balance.missing[0]
    reason = `八字缺${balance.missing.join('、')}，以补缺为要`
  } else if (shengFu >= keXie) {
    xiYongElement = GENERATE[dayMasterElement]
    reason = `日主${dayMasterElement}旺，宜以${xiYongElement}泄秀生财`
  } else {
    xiYongElement = GENERATED_BY[dayMasterElement]
    reason = `日主${dayMasterElement}弱，宜以${xiYongElement}生扶助身`
  }

  return { element: xiYongElement, reason, count, balance }
}

// ========== 策略计算 ==========
function calculateStrategy(xiYong, todayElement) {
  if (xiYong === todayElement) {
    return { type: '同气', icon: '★', desc: '今日五行与喜用神完全相同，能量共振，运势极佳', level: 'best', color: '#4CAF50' }
  }
  if (GENERATE[todayElement] === xiYong) {
    return { type: '相生', icon: '▲', desc: '今日五行生旺您的喜用神，贵人运强，诸事顺利', level: 'great', color: '#4A90D9' }
  }
  if (GENERATE[xiYong] === todayElement) {
    return { type: '受生', icon: '△', desc: '您的喜用神生旺今日五行，主动付出可有收获', level: 'good', color: '#FFC107' }
  }
  if (CONTROL[xiYong] === todayElement) {
    return { type: '制衡', icon: '◆', desc: '您的喜用神制约今日五行，把握主动可获财', level: 'good', color: '#FFC107' }
  }
  if (CONTROLLED_BY[xiYong] === todayElement) {
    const bridge = GENERATE[todayElement]
    return {
      type: '通关', icon: '◈',
      desc: `今日五行克制喜用神，建议以${ELEMENT_COLORS[bridge].names[0]}系通关调和`,
      level: 'bridge', color: '#E53935',
      bridgeElement: bridge, bridgeColor: ELEMENT_COLORS[bridge]
    }
  }
  return { type: '平稳', icon: '●', desc: '今日与喜用神关系平稳，按五行穿衣即可', level: 'normal', color: '#9E9E9E' }
}

// ========== 工具函数 ==========
function buildTier(key, element, desc, tip, level) {
  return {
    key, element,
    names: ELEMENT_COLORS[element].names,
    extended: ELEMENT_COLORS[element].extended,
    colors: ELEMENT_COLORS[element].colors,
    materials: ELEMENT_COLORS[element].materials,
    accessories: ELEMENT_COLORS[element].accessories,
    desc, tip, level
  }
}

function offsetDate(offset) {
  const d = new Date()
  d.setDate(d.getDate() + (offset || 0))
  return d
}

module.exports = {
  getUniversalDress,
  getPersonalizedDress,
  ELEMENT_COLORS
}
