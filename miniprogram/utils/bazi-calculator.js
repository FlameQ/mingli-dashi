/**
 * 命理大师 - 八字计算引擎（增强版）
 * Enhanced with: 喜用神, 格局, 十神详析, 大运分析, 人生领域, 性格, 幸运元素
 * V2: 十神详批, 地支关系(冲合刑害), 神煞系统, 流年运势, 纳音五行, 十二长生
 */
const dateUtil = require('./date-util')

const SHISHEN_MAP = {
  '比肩': 'same', '劫财': 'same',
  '食神': 'output', '伤官': 'output',
  '偏财': 'wealth', '正财': 'wealth',
  '七杀': 'power', '正官': 'power',
  '偏印': 'resource', '正印': 'resource'
}

// ===== 十神详批描述 =====
const SHISHEN_DETAIL = {
  '比肩': { nature: '同我者', meaning: '自我、独立、竞争', desc: '比肩代表自我意识与独立精神，命带比肩者个性鲜明，有主见，不愿依附他人。在人际关系中既可能成为可靠的伙伴，也可能因过于坚持己见而产生摩擦。', career: '适合独立经营、合伙创业、专业技术', relation: '兄弟姐妹、同行、朋友', affect: '增强日主力量，主竞争、合作、分夺' },
  '劫财': { nature: '同我者', meaning: '争夺、冲动、魄力', desc: '劫财代表竞争与争夺之力，命带劫财者行动力强，有魄力，但需防冲动行事。在财务上需谨慎理财，避免不必要的损财。', career: '适合销售、军警、竞争性行业', relation: '竞争对手、合作伙伴', affect: '耗泄财星，主争夺、损耗、竞争' },
  '食神': { nature: '我生者', meaning: '才华、口福、温和', desc: '食神代表才华与享受，命带食神者温和有福，才华横溢，善于表达。一生衣食无忧，性格宽厚，人缘好。', career: '适合餐饮、艺术、教育、文化创作', relation: '子女、下属、学生', affect: '泄秀生财，主才华、福气、子息' },
  '伤官': { nature: '我生者', meaning: '才智、叛逆、创新', desc: '伤官代表才智与突破，命带伤官者聪明绝顶，个性鲜明，善于创新。但言辞犀利，需注意与人沟通的方式。', career: '适合艺术、技术创新、自由职业、律师', relation: '子女、晚辈', affect: '克制官星，主才华、叛逆、是非' },
  '偏财': { nature: '我克者', meaning: '横财、交际、大方', desc: '偏财代表意外之财与人缘，命带偏财者交际广泛，善于把握机会。财运起伏较大，适合投资和经商。', career: '适合投资、贸易、中介、公关', relation: '父亲、情人、意外之财', affect: '克制印星，主财运、交际、慷慨' },
  '正财': { nature: '我克者', meaning: '正途、勤劳、务实', desc: '正财代表正当收入与务实精神，命带正财者勤劳踏实，善于理财。财运稳定，适合稳健经营。', career: '适合金融、会计、企业管理', relation: '妻子（男命）、稳定收入', affect: '生官制枭，主稳定、勤奋、务实' },
  '七杀': { nature: '克我者', meaning: '权威、压力、魄力', desc: '七杀代表权威与压力，命带七杀者性格刚毅，有领导力。但也容易招惹是非，需学会以柔克刚。', career: '适合军警、管理、创业、竞争性行业', relation: '上司、对手、子女（女命）', affect: '克制日主，主权威、压力、变革' },
  '正官': { nature: '克我者', meaning: '正气、秩序、责任', desc: '正官代表正直与责任，命带正官者为人端正，守规矩，有责任感。适合体制内发展，仕途较顺。', career: '适合体制内、管理、行政、法律', relation: '丈夫（女命）、上司、子女', affect: '护卫日主，主正派、守规、升迁' },
  '偏印': { nature: '生我者', meaning: '偏才、孤独、钻研', desc: '偏印代表偏门学术与孤独，命带偏印者思维独特，善于钻研。适合研究和技术方向，但需防过于孤僻。', career: '适合科研、技术、中医、命理', relation: '继母、偏业、学术', affect: '克制食伤，主学术、孤独、偏才' },
  '正印': { nature: '生我者', meaning: '学业、慈爱、庇护', desc: '正印代表学业与庇护，命带正印者聪明好学，心地善良。一生多贵人相助，适合文化教育行业。', career: '适合教育、文化、行政、医疗', relation: '母亲、老师、贵人', affect: '生扶日主，主学业、贵人、慈爱' },
  '日主': { nature: '自身', meaning: '本命核心', desc: '日主即命主自身，是八字分析的核心。日主的强弱决定了喜用神的取法，影响整体命局格局。', career: '根据喜用神定方向', relation: '自身', affect: '命局核心，统领全局' }
}

// ===== 地支关系 =====
const ZHI_CHONG = { '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅', '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳' }
const ZHI_HE = [
  { pair: ['子', '丑'], result: '土' }, { pair: ['寅', '亥'], result: '木' },
  { pair: ['卯', '戌'], result: '火' }, { pair: ['辰', '酉'], result: '金' },
  { pair: ['巳', '申'], result: '水' }, { pair: ['午', '未'], result: '火' }
]
const ZHI_SANHE = [
  { group: ['申', '子', '辰'], result: '水局' }, { group: ['亥', '卯', '未'], result: '木局' },
  { group: ['寅', '午', '戌'], result: '火局' }, { group: ['巳', '酉', '丑'], result: '金局' }
]
const ZHI_SANHUI = [
  { group: ['寅', '卯', '辰'], result: '东方木局' }, { group: ['巳', '午', '未'], result: '南方火局' },
  { group: ['申', '酉', '戌'], result: '西方金局' }, { group: ['亥', '子', '丑'], result: '北方水局' }
]
const ZHI_XING = [
  { pair: ['寅', '巳'], desc: '无恩之刑' }, { pair: ['巳', '申'], desc: '无恩之刑' }, { pair: ['申', '寅'], desc: '无恩之刑' },
  { pair: ['丑', '戌'], desc: '恃势之刑' }, { pair: ['戌', '未'], desc: '恃势之刑' }, { pair: ['未', '丑'], desc: '恃势之刑' },
  { pair: ['子', '卯'], desc: '无礼之刑' }, { pair: ['卯', '子'], desc: '无礼之刑' },
  { pair: ['辰', '辰'], desc: '自刑' }, { pair: ['午', '午'], desc: '自刑' },
  { pair: ['酉', '酉'], desc: '自刑' }, { pair: ['亥', '亥'], desc: '自刑' }
]
const ZHI_HAI = { '子': '未', '未': '子', '丑': '午', '午': '丑', '寅': '巳', '巳': '寅', '卯': '辰', '辰': '卯', '申': '亥', '亥': '申', '酉': '戌', '戌': '酉' }

// ===== 十二长生 =====
const CHANGSHENG_ORDER = ['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养']
const CHANGSHENG_START = {
  '阳木': '亥', '阴木': '午', '阳火': '寅', '阴火': '酉',
  '阳土': '寅', '阴土': '酉', '阳金': '巳', '阴金': '子',
  '阳水': '申', '阴水': '卯'
}

// ===== 神煞 =====
const TIANYI_GUOREN = {
  '甲': ['丑', '未'], '乙': ['子', '申'], '丙': ['亥', '酉'], '丁': ['亥', '酉'],
  '戊': ['丑', '未'], '己': ['子', '申'], '庚': ['丑', '未'], '辛': ['寅', '午'],
  '壬': ['卯', '巳'], '癸': ['卯', '巳']
}
const WENCHANG = { '甲': '巳', '乙': '午', '丙': '申', '丁': '酉', '戊': '申', '己': '酉', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯' }
const TAOpattern = { '寅午戌': '卯', '申子辰': '酉', '巳酉丑': '午', '亥卯未': '子' }
const HUAGAI_MAP = { '寅午戌': '戌', '申子辰': '辰', '巳酉丑': '丑', '亥卯未': '未' }
const YIMA_MAP = { '寅': '申', '申': '寅', '巳': '亥', '亥': '巳', '子': '寅', '午': '申', '卯': '酉', '酉': '卯', '辰': '子', '戌': '午', '丑': '亥', '未': '巳' }

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

  // 生肖基于实际年柱（立春前已调整）
  const yearZhi = pillars.yearPillar[1]
  const zodiac = dateUtil.SHENGXIAO[dateUtil.DIZHI.indexOf(yearZhi)]
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

  // ===== V2 新增功能 =====

  // 十神详批
  const shishenDetail = getShishenDetail(fullShishen)

  // 地支关系
  const dizhiRelations = analyzeDizhiRelations(pillars)

  // 神煞
  const shensha = calculateShensha(pillars, dayMaster)

  // 纳音五行详析
  const nayingDetail = getNayingDetail(naying, pillars)

  // 十二长生
  const changsheng = calculateChangsheng(dayMaster, dayMasterWx, dayMasterYy, pillars)

  // 流年运势
  const liunian = analyzeLiunian(year, dayMasterWx, dayMasterYy, pillars, xiyong, strength)

  // 详细评述
  const reading = generateRichReading(dayMaster, dayMasterWx, strength, wuxingCount, balance, xiyong, geju, personality, zodiac, naying, pillars, fullShishen, shensha, dizhiRelations)

  return {
    pillars, dayMaster, dayMasterWx, dayMasterYy,
    wuxingCount, wuxingBalance: balance,
    fullShishen, naying, zodiac, shichen, gender, strength,
    xiyong, geju, dayunList, personality, lifeDomains, luckyElements, reading,
    shishenDetail, dizhiRelations, shensha, nayingDetail, changsheng, liunian
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

// ===== 1. 十神详批 =====
function getShishenDetail(fullShishen) {
  const posNames = { yearPillar: '年柱', monthPillar: '月柱', dayPillar: '日柱', hourPillar: '时柱' }
  const details = []

  Object.entries(fullShishen).forEach(([pos, data]) => {
    const posName = posNames[pos]
    // 天干十神
    const ganSs = data.ganShishen
    if (ganSs && SHISHEN_DETAIL[ganSs]) {
      details.push({
        position: posName,
        type: '天干',
        ganzhi: data.gan,
        shishen: ganSs,
        ...SHISHEN_DETAIL[ganSs]
      })
    }
    // 地支藏干十神
    data.zhiShishen.forEach((zs, idx) => {
      const label = idx === 0 ? '本气' : idx === 1 ? '中气' : '余气'
      if (SHISHEN_DETAIL[zs.shishen]) {
        details.push({
          position: posName,
          type: label,
          ganzhi: data.zhi + '(' + zs.gan + ')',
          shishen: zs.shishen,
          ...SHISHEN_DETAIL[zs.shishen]
        })
      }
    })
  })

  // 统计十神出现次数
  const count = {}
  details.forEach(d => { count[d.shishen] = (count[d.shishen] || 0) + 1 })

  return { details, count }
}

// ===== 2. 地支关系 =====
function analyzeDizhiRelations(pillars) {
  const zhis = [
    { pos: '年', zhi: pillars.yearPillar[1] },
    { pos: '月', zhi: pillars.monthPillar[1] },
    { pos: '日', zhi: pillars.dayPillar[1] },
    { pos: '时', zhi: pillars.hourPillar[1] }
  ]
  const relations = []

  // 六冲
  for (let i = 0; i < zhis.length; i++) {
    for (let j = i + 1; j < zhis.length; j++) {
      if (ZHI_CHONG[zhis[i].zhi] === zhis[j].zhi) {
        relations.push({
          type: '冲', level: 'important',
          desc: `${zhis[i].pos}支${zhis[i].zhi} 冲 ${zhis[j].pos}支${zhis[j].zhi}`,
          meaning: `${zhis[i].zhi}${zhis[j].zhi}相冲，主变动、冲突、不稳定。在${zhis[i].pos}柱与${zhis[j].pos}柱之间产生冲荡之力，需注意相关领域的变化。`
        })
      }
    }
  }

  // 六合
  for (let i = 0; i < zhis.length; i++) {
    for (let j = i + 1; j < zhis.length; j++) {
      const he = ZHI_HE.find(h => h.pair.includes(zhis[i].zhi) && h.pair.includes(zhis[j].zhi))
      if (he) {
        relations.push({
          type: '合', level: 'normal',
          desc: `${zhis[i].pos}支${zhis[i].zhi} 合 ${zhis[j].pos}支${zhis[j].zhi}（化${he.result}）`,
          meaning: `${zhis[i].zhi}${zhis[j].zhi}相合化为${he.result}，主和谐、助力、合作。有利于${zhis[i].pos}柱与${zhis[j].pos}柱之间的协调。`
        })
      }
    }
  }

  // 三合
  for (const sanhe of ZHI_SANHE) {
    const matched = zhis.filter(z => sanhe.group.includes(z.zhi))
    if (matched.length >= 2) {
      relations.push({
        type: '三合', level: matched.length === 3 ? 'important' : 'normal',
        desc: `${matched.map(m => m.pos + '支' + m.zhi).join('、')}（${sanhe.result}）`,
        meaning: matched.length === 3
          ? `三合${sanhe.result}成立，力量强大，主人缘好、有贵人相助。`
          : `有${sanhe.result}的部分地支，逢流年补全则成局。`
      })
    }
  }

  // 刑
  for (let i = 0; i < zhis.length; i++) {
    for (let j = i + 1; j < zhis.length; j++) {
      const xing = ZHI_XING.find(x => x.pair[0] === zhis[i].zhi && x.pair[1] === zhis[j].zhi)
      if (xing) {
        relations.push({
          type: '刑', level: 'warn',
          desc: `${zhis[i].pos}支${zhis[i].zhi} 刑 ${zhis[j].pos}支${zhis[j].zhi}（${xing.desc}）`,
          meaning: `${zhis[i].zhi}${zhis[j].zhi}相刑（${xing.desc}），主是非、纠纷、内心矛盾。需注意人际关系中的摩擦。`
        })
      }
    }
    // 自刑
    const selfXing = ZHI_XING.find(x => x.desc === '自刑' && x.pair[0] === zhis[i].zhi && x.pair[1] === zhis[i].zhi)
    if (selfXing) {
      relations.push({
        type: '刑', level: 'normal',
        desc: `${zhis[i].pos}支${zhis[i].zhi} 自刑`,
        meaning: `${zhis[i].zhi}自刑，主内心纠结、自我矛盾。需学会自我调适。`
      })
    }
  }

  // 害（穿）
  for (let i = 0; i < zhis.length; i++) {
    for (let j = i + 1; j < zhis.length; j++) {
      if (ZHI_HAI[zhis[i].zhi] === zhis[j].zhi) {
        relations.push({
          type: '害', level: 'normal',
          desc: `${zhis[i].pos}支${zhis[i].zhi} 害 ${zhis[j].pos}支${zhis[j].zhi}`,
          meaning: `${zhis[i].zhi}${zhis[j].zhi}相害，主暗中损益、人际关系不和谐。需提防暗中的小人。`
        })
      }
    }
  }

  // 三会局（方局）
  for (const sanhui of ZHI_SANHUI) {
    const matched = zhis.filter(z => sanhui.group.includes(z.zhi))
    if (matched.length >= 2) {
      relations.push({
        type: '三会', level: matched.length === 3 ? 'important' : 'normal',
        desc: `${matched.map(m => m.pos + '支' + m.zhi).join('、')}（${sanhui.result}）`,
        meaning: matched.length === 3
          ? `三会${sanhui.result}成立，力量最强，主人缘极佳、根基稳固。`
          : `有${sanhui.result}的部分地支，逢流年补全则成局。`
      })
    }
  }

  return relations
}

// ===== 3. 神煞系统 =====
function calculateShensha(pillars, dayMaster) {
  const yearZhi = pillars.yearPillar[1]
  const monthZhi = pillars.monthPillar[1]
  const dayZhi = pillars.dayPillar[1]
  const hourZhi = pillars.hourPillar[1]
  const allZhi = [yearZhi, monthZhi, dayZhi, hourZhi]
  const result = []

  // 天乙贵人
  const guiren = TIANYI_GUOREN[dayMaster] || []
  const matchedGuiren = guiren.filter(z => allZhi.includes(z))
  if (matchedGuiren.length > 0) {
    result.push({
      name: '天乙贵人', icon: '★', type: 'type-lucky', typeLabel: '吉',
      desc: `日干${dayMaster}见${matchedGuiren.join('、')}`,
      meaning: '天乙贵人是八字中最吉之神煞，主逢凶化吉、遇贵人相助。一生中多有贵人提携，遇难呈祥。'
    })
  }

  // 文昌贵人
  const wenchang = WENCHANG[dayMaster]
  if (wenchang && allZhi.includes(wenchang)) {
    result.push({
      name: '文昌贵人', icon: '文', type: 'type-lucky', typeLabel: '吉',
      desc: `日干${dayMaster}见${wenchang}`,
      meaning: '文昌贵人主聪明好学、学业有成。利于读书、考试、学术研究，有文学艺术天赋。'
    })
  }

  // 驿马
  const yima = YIMA_MAP[yearZhi]
  if (yima && allZhi.includes(yima)) {
    const yimaPos = allZhi.indexOf(yima)
    const posLabel = ['年', '月', '日', '时'][yimaPos]
    result.push({
      name: '驿马', icon: '马', type: 'type-mid', typeLabel: '中',
      desc: `年支${yearZhi}见${posLabel}支${yima}`,
      meaning: '驿马主动、变、迁移。命带驿马者一生多奔波走动，适合从事出差、旅游、物流等需要走动的行业。也代表环境变化多。'
    })
  }

  // 桃花（咸池）
  const taoGroups = Object.keys(TAOpattern)
  let taoHua = null
  for (const g of taoGroups) {
    if (g.includes(yearZhi) || g.includes(monthZhi)) {
      taoHua = TAOpattern[g]
      break
    }
  }
  if (taoHua && allZhi.includes(taoHua)) {
    result.push({
      name: '桃花', icon: '桃', type: 'type-mid', typeLabel: '中',
      desc: `年月支见${taoHua}`,
      meaning: '桃花主人缘、异性缘、才艺。命带桃花者异性缘好，善于社交，有艺术天赋。但需注意感情纠葛。'
    })
  }

  // 华盖
  const huagaiGroups = Object.keys(HUAGAI_MAP)
  let huagai = null
  for (const g of huagaiGroups) {
    if (g.includes(yearZhi)) {
      huagai = HUAGAI_MAP[g]
      break
    }
  }
  if (huagai && allZhi.includes(huagai)) {
    result.push({
      name: '华盖', icon: '盖', type: 'type-mid', typeLabel: '中',
      desc: `年支${yearZhi}见${huagai}`,
      meaning: '华盖主文章、艺术、宗教、玄学。命带华盖者聪明孤高，有独特的艺术或学术才华，对哲学、宗教、玄学有天赋。'
    })
  }

  // 羊刃
  const yangrenMap = { '甲': '卯', '乙': '辰', '丙': '午', '丁': '未', '戊': '午', '己': '未', '庚': '酉', '辛': '戌', '壬': '子', '癸': '丑' }
  const yangren = yangrenMap[dayMaster]
  if (yangren && allZhi.includes(yangren)) {
    result.push({
      name: '羊刃', icon: '刃', type: 'type-bad', typeLabel: '凶',
      desc: `日干${dayMaster}见${yangren}`,
      meaning: '羊刃主刚烈、果断、竞争。命带羊刃者性格刚毅，行动力强，但需防冲动伤身。利武职、外科医生等。'
    })
  }

  // 空亡
  const kongwang = getKongwang(pillars.dayPillar)
  const kongZhi = kongwang.filter(z => allZhi.includes(z))
  if (kongZhi.length > 0) {
    result.push({
      name: '空亡', icon: '空', type: 'type-neutral', typeLabel: '平',
      desc: `日柱空亡：${kongwang.join('、')}（命中见${kongZhi.join('、')}）`,
      meaning: `空亡主虚浮、不实。${kongZhi.join('、')}在空亡，代表相关方面可能虚而不实，需踏实经营。`
    })
  }

  return result
}

function getKongwang(dayPillar) {
  const ganIdx = dateUtil.TIANGAN.indexOf(dayPillar[0])
  const zhiIdx = dateUtil.DIZHI.indexOf(dayPillar[1])
  // 找到该干支所属旬的起始地支
  const xunStartZhi = ((zhiIdx - ganIdx) % 12 + 12) % 12
  // 旬空 = 旬起始地支 + 10, +11
  return [dateUtil.DIZHI[(xunStartZhi + 10) % 12], dateUtil.DIZHI[(xunStartZhi + 11) % 12]]
}

// ===== 4. 流年运势 =====
function analyzeLiunian(birthYear, dayMasterWx, dayMasterYy, pillars, xiyong, strength) {
  const currentYear = new Date().getFullYear()
  const currentGz = dateUtil.getYearGanZhi(currentYear)
  const currentGan = currentGz[0]
  const currentZhi = currentGz[1]
  const currentGanWx = dateUtil.TIANGAN_WUXING[currentGan]
  const currentZhiWx = dateUtil.DIZHI_WUXING[currentZhi]

  // 流年天干十神
  const liunianGanSs = getShishen(dayMasterWx, currentGanWx, dayMasterYy, dateUtil.TIANGAN_YINYANG[currentGan])

  // 流年与命局关系
  const pillarZhis = [pillars.yearPillar[1], pillars.monthPillar[1], pillars.dayPillar[1], pillars.hourPillar[1]]
  const clashes = []
  if (ZHI_CHONG[pillars.yearPillar[1]] === currentZhi) clashes.push('冲太岁')
  if (pillarZhis.includes(currentZhi)) clashes.push('值太岁')
  // 合太岁
  for (const he of ZHI_HE) {
    if (he.pair.includes(currentZhi) && pillarZhis.some(z => he.pair.includes(z))) {
      clashes.push('合太岁')
      break
    }
  }

  // 流年五行与喜用
  const isXiYear = currentGanWx === xiyong.xi || currentGanWx === xiyong.yong || currentZhiWx === xiyong.xi || currentZhiWx === xiyong.yong
  const isJiYear = currentGanWx === xiyong.ji || currentZhiWx === xiyong.ji

  // 生成详细分析
  const yearReading = getLiunianReading(currentGz, liunianGanSs, isXiYear, isJiYear, clashes, currentYear - birthYear)

  // 逐月运势
  const monthFortune = getMonthFortune(currentYear, dayMasterWx, dayMasterYy, xiyong)

  return {
    year: currentYear,
    ganzhi: currentGz,
    shishen: liunianGanSs,
    isXiYear,
    isJiYear,
    taiSui: clashes.length > 0 ? clashes.join('、') : '平稳',
    reading: yearReading,
    monthFortune
  }
}

function getLiunianReading(gz, shishen, isXi, isJi, taiSui, age) {
  let reading = `${gz}年，流年天干十神为${shishen}。`

  if (isXi) {
    reading += '今年为喜用神流年，运势较为顺畅，适合积极进取。'
  } else if (isJi) {
    reading += '今年为忌神流年，需谨慎行事，稳中求进。'
  } else {
    reading += '今年运势中平，宜守不宜攻。'
  }

  if (taiSui.length > 0) {
    reading += `今年${taiSui.join('、')}，需特别注意健康和人际关系。`
  }

  if (shishen === '正官' || shishen === '七杀') {
    reading += '事业方面有变动机会，可能面临升迁或转换环境。'
  } else if (shishen === '正财' || shishen === '偏财') {
    reading += '财运方面有起色，注意理财，把握机会。'
  } else if (shishen === '正印' || shishen === '偏印') {
    reading += '学业或进修方面有好的机会，适合学习新技能。'
  } else if (shishen === '食神' || shishen === '伤官') {
    reading += '才华展现的一年，适合创作、表达、社交。'
  } else if (shishen === '比肩' || shishen === '劫财') {
    reading += '竞争加剧的一年，需注意人际关系和合作。'
  }

  return reading
}

function getMonthFortune(year, dayMasterWx, dayMasterYy, xiyong) {
  const months = []
  const monthNames = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月']
  for (let m = 1; m <= 12; m++) {
    const mGz = dateUtil.getMonthGanZhi(dateUtil.getYearGanZhi(year), m)
    const mGanWx = dateUtil.TIANGAN_WUXING[mGz[0]]
    const ss = getShishen(dayMasterWx, mGanWx, dayMasterYy, dateUtil.TIANGAN_YINYANG[mGz[0]])
    const isGood = mGanWx === xiyong.xi || mGanWx === xiyong.yong
    months.push({
      month: monthNames[m - 1],
      ganzhi: mGz,
      shishen: ss,
      level: isGood ? '吉' : (mGanWx === xiyong.ji ? '注意' : '平')
    })
  }
  return months
}

// ===== 5. 纳音五行详析 =====
function getNayingDetail(naying, pillars) {
  const posNames = ['yearPillar', 'monthPillar', 'dayPillar', 'hourPillar']
  const labels = ['年柱', '月柱', '日柱', '时柱']
  const details = []

  const nayingMeaning = {
    '海中金': '深藏不露，有内涵但不易显现', '炉中火': '热情内蕴，有炼金之能', '大林木': '根基深厚，有栋梁之才',
    '路旁土': '踏实可靠，甘于奉献', '剑锋金': '锐利刚强，有锋芒', '山头火': '高远明亮，志向远大',
    '涧下水': '温润清秀，有智慧', '城头土': '坚固稳重，有防护之力', '白蜡金': '温润精致，有品味',
    '杨柳木': '柔韧灵活，有适应力', '泉中水': '源源不断，有才能', '屋上土': '庇护之力，有家业',
    '霹雳火': '威猛异常，有爆发力', '松柏木': '坚贞不屈，有节操', '长流水': '源远流长，有恒心',
    '沙中金': '含蓄内敛，待时而发', '山下火': '温暖明亮，有照拂之力', '平地木': '朴实无华，有根基',
    '壁上土': '安稳护持，有保障', '金箔金': '华美出众，有表现力', '覆灯火': '柔和温暖，有吸引力',
    '天河水': '广阔无边，有气度', '大驿土': '通达四方，有交际力', '钗钏金': '精致华美，有才艺',
    '桑柘木': '坚韧有用，有实用价值', '大溪水': '奔流不息，有活力', '沙中土': '包容宽厚，有承载力',
    '天上火': '光辉灿烂，有影响力', '石榴木': '多子多福，有成果', '大海水': '深沉广阔，有涵养'
  }

  posNames.forEach((pos, idx) => {
    const ny = naying[pos.replace('P', 'P').replace('year', 'year').replace('month', 'month').replace('day', 'day').replace('hour', 'hour')]
    const p = pillars[pos]
    details.push({
      position: labels[idx],
      ganzhi: p,
      naying: ny,
      meaning: nayingMeaning[ny] || '五行纳音，各有特色'
    })
  })

  return details
}

// ===== 6. 十二长生 =====
function calculateChangsheng(dayMaster, dayMasterWx, dayMasterYy, pillars) {
  const key = dayMasterYy + dayMasterWx
  const startZhi = CHANGSHENG_START[key]
  if (!startZhi) return { stages: [], currentPosition: '' }

  const startIdx = dateUtil.DIZHI.indexOf(startZhi)
  const stages = []

  // 阳干顺行，阴干逆行
  const direction = dayMasterYy === '阳' ? 1 : -1
  for (let i = 0; i < 12; i++) {
    const zhiIdx = ((startIdx + direction * i) % 12 + 12) % 12
    stages.push({
      stage: CHANGSHENG_ORDER[i],
      zhi: dateUtil.DIZHI[zhiIdx],
      isGood: i <= 4 // 长生到帝旺为吉
    })
  }

  // 日支在哪个长生阶段
  const dayZhi = pillars.dayPillar[1]
  const currentStage = stages.find(s => s.zhi === dayZhi)

  return {
    stages,
    dayZhiStage: currentStage ? currentStage.stage : '未知',
    dayZhiMeaning: getChangshengMeaning(currentStage ? currentStage.stage : '未知')
  }
}

function getChangshengMeaning(stage) {
  const meanings = {
    '长生': '如初生之婴，充满生机，代表新的开始与发展',
    '沐浴': '如沐浴更衣，尚不稳定，代表变化与调整',
    '冠带': '如加冠成人，渐趋成熟，代表成长与进步',
    '临官': '如出仕为官，事业有成，代表能力与成就',
    '帝旺': '如帝在巅峰，力量最强，代表鼎盛与极致',
    '衰': '如物极必反，开始衰退，代表退步与减力',
    '病': '如生病之态，力不从心，代表困境与消耗',
    '死': '如气息微弱，难以维继，代表低谷与沉寂',
    '墓': '如入墓收藏，蛰伏待发，代表积蓄与收藏',
    '绝': '如气数已尽，但孕育新生，代表转折与重生',
    '胎': '如胎儿孕育，暗藏生机，代表萌芽与希望',
    '养': '如滋养成长，蓄势待发，代表培育与积累'
  }
  return meanings[stage] || '各有深意'
}

// ===== 原有功能（保持不变） =====

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

  const resourceWx = wuxingOrder[(dmIdx + 4) % 5]
  const outputWx = wuxingOrder[(dmIdx + 1) % 5]
  const wealthWx = wuxingOrder[(dmIdx + 2) % 5]
  const powerWx = wuxingOrder[(dmIdx + 3) % 5]

  let xiWx, yongWx, jiWx
  if (strength.level === '身强') {
    xiWx = outputWx; yongWx = wealthWx; jiWx = resourceWx
  } else {
    xiWx = resourceWx; yongWx = dayMasterWx; jiWx = powerWx
  }

  return {
    xi: xiWx, yong: yongWx, ji: jiWx,
    description: strength.level === '身强'
      ? `日主身强，喜${xiWx}（食伤泄秀）、${yongWx}（财星耗力），忌${jiWx}（印星生扶太过）`
      : `日主身弱，喜${xiWx}（印星生扶）、${yongWx}（比劫助力），忌${jiWx}（官杀克身）`
  }
}

function getGeju(dayMasterWx, dayMasterYy, pillars, fullShishen) {
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

function generateRichReading(dayMaster, dayMasterWx, strength, wuxingCount, balance, xiyong, geju, personality, zodiac, naying, pillars, fullShishen, shensha, dizhiRelations) {
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

  // 神煞总结
  if (shensha && shensha.length > 0) {
    const lucky = shensha.filter(s => s.type === '吉').map(s => s.name)
    const unlucky = shensha.filter(s => s.type === '凶').map(s => s.name)
    let shenshaText = '命中带'
    if (lucky.length > 0) shenshaText += `吉神：${lucky.join('、')}，主福泽深厚。`
    if (unlucky.length > 0) shenshaText += `凶煞：${unlucky.join('、')}，需注意化解。`
    sections.push({ title: '神煞总评', content: shenshaText })
  }

  // 地支关系总结
  if (dizhiRelations && dizhiRelations.length > 0) {
    const chong = dizhiRelations.filter(r => r.type === '冲').map(r => r.desc).join('；')
    const he = dizhiRelations.filter(r => r.type === '合' || r.type === '三合').map(r => r.desc).join('；')
    let relationText = ''
    if (chong) relationText += `冲：${chong}。`
    if (he) relationText += `合：${he}。`
    if (relationText) sections.push({ title: '地支关系', content: relationText })
  }

  return { sections }
}

module.exports = {
  calculateBazi,
  analyzeDayMasterStrength,
  getShishen,
  getDayunList,
  generateRichReading: generateRichReading,
  TIANGAN_PERSONALITY,
  SHISHEN_DETAIL
}
