/**
 * 六爻数据模块 - 八宫归属、纳甲、六亲、世应、六神
 */
const dateUtil = require('./date-util')

const TIANGAN = dateUtil.TIANGAN
const DIZHI = dateUtil.DIZHI
const DIZHI_WUXING = dateUtil.DIZHI_WUXING

const GUA_NAMES = ['乾','坤','屯','蒙','需','讼','师','比','小畜','履','泰','否','同人','大有','谦','豫','随','蛊','临','观','噬嗑','贲','剥','复','无妄','大畜','颐','大过','坎','离','咸','恒','遁','大壮','晋','明夷','家人','睽','蹇','解','损','益','夬','姤','萃','升','困','井','革','鼎','震','艮','渐','归妹','丰','旅','巽','兑','涣','节','中孚','小过','既济','未济']

// King Wen lookup: HEXAGRAM_TABLE[upper * 8 + lower] = King Wen number (1-64)
const HEXAGRAM_TABLE = [
  2, 16, 8, 45, 23, 35, 20, 12,
  24, 51, 3, 17, 27, 21, 42, 25,
  7, 40, 29, 47, 4, 64, 59, 6,
  19, 54, 60, 58, 41, 38, 61, 10,
  15, 62, 39, 31, 52, 56, 53, 33,
  36, 55, 63, 49, 22, 30, 37, 13,
  46, 32, 48, 28, 18, 50, 57, 44,
  11, 34, 5, 43, 26, 14, 9, 1
]

// 八卦: trigram value (0-7) → { name, nature, element }
const TRIGRAMS = [
  { name: '坤', nature: '地', element: '土' },
  { name: '震', nature: '雷', element: '木' },
  { name: '坎', nature: '水', element: '水' },
  { name: '兑', nature: '泽', element: '金' },
  { name: '艮', nature: '山', element: '土' },
  { name: '离', nature: '火', element: '火' },
  { name: '巽', nature: '风', element: '木' },
  { name: '乾', nature: '天', element: '金' }
]

// 世应位置: palacePosition 0-7 → { world (1-indexed), response (1-indexed) }
const WORLD_RESPONSE = [
  { world: 6, response: 3 }, // 0: 本宫卦
  { world: 1, response: 4 }, // 1: 一世卦
  { world: 2, response: 5 }, // 2: 二世卦
  { world: 3, response: 6 }, // 3: 三世卦
  { world: 4, response: 1 }, // 4: 四世卦
  { world: 5, response: 2 }, // 5: 五世卦
  { world: 4, response: 1 }, // 6: 游魂卦
  { world: 3, response: 6 }  // 7: 归魂卦
]

const PALACE_POSITION_NAMES = ['本宫卦','一世卦','二世卦','三世卦','四世卦','五世卦','游魂卦','归魂卦']

// King Wen number → palace info
const PALACE_MAP = {}
const palaceAssignments = [
  { palace: '乾', element: '金', nums: [1, 44, 33, 12, 20, 23, 35, 14] },
  { palace: '坎', element: '水', nums: [29, 60, 3, 63, 49, 55, 36, 7] },
  { palace: '艮', element: '土', nums: [52, 22, 26, 41, 38, 10, 61, 53] },
  { palace: '震', element: '木', nums: [51, 16, 40, 32, 46, 48, 28, 17] },
  { palace: '巽', element: '木', nums: [57, 9, 37, 42, 25, 21, 27, 18] },
  { palace: '离', element: '火', nums: [30, 56, 50, 64, 4, 59, 6, 13] },
  { palace: '坤', element: '土', nums: [2, 24, 19, 11, 34, 43, 5, 8] },
  { palace: '兑', element: '金', nums: [58, 47, 45, 31, 39, 15, 62, 54] }
]
palaceAssignments.forEach(p => {
  p.nums.forEach((num, idx) => {
    PALACE_MAP[num] = { palace: p.palace, element: p.element, pos: idx }
  })
})

// 纳甲: trigram value → { inner: [[ganIdx, zhiIdx]×3], outer: [[ganIdx, zhiIdx]×3] }
const NAJIA = {
  7: { inner: [[0,0],[0,2],[0,4]], outer: [[8,6],[8,8],[8,10]] },   // 乾
  0: { inner: [[1,7],[1,5],[1,3]], outer: [[9,9],[9,11],[9,1]] },   // 坤
  1: { inner: [[6,0],[6,2],[6,4]], outer: [[6,6],[6,8],[6,10]] },   // 震
  6: { inner: [[7,1],[7,11],[7,9]], outer: [[7,3],[7,5],[7,7]] },   // 巽
  2: { inner: [[4,2],[4,4],[4,6]], outer: [[4,8],[4,10],[4,0]] },   // 坎
  5: { inner: [[5,3],[5,1],[5,11]], outer: [[5,9],[5,7],[5,5]] },   // 离
  4: { inner: [[2,4],[2,6],[2,8]], outer: [[2,10],[2,0],[2,2]] },   // 艮
  3: { inner: [[3,5],[3,3],[3,1]], outer: [[3,11],[3,9],[3,7]] }    // 兑
}

// 五行生克关系
const GENERATE = { '金': '水', '水': '木', '木': '火', '火': '土', '土': '金' }
const GENERATED_BY = { '金': '土', '水': '金', '木': '水', '火': '木', '土': '火' }
const CONTROL = { '金': '木', '木': '土', '土': '水', '水': '火', '火': '金' }
const CONTROLLED_BY = { '金': '火', '水': '土', '木': '金', '火': '水', '土': '木' }

// 六亲: 根据地支五行与宫五行关系
function getLiuqin(zhiElement, palaceElement) {
  if (zhiElement === palaceElement) return '兄弟'
  if (GENERATED_BY[palaceElement] === zhiElement) return '父母'
  if (GENERATE[palaceElement] === zhiElement) return '子孙'
  if (CONTROLLED_BY[palaceElement] === zhiElement) return '官鬼'
  if (CONTROL[palaceElement] === zhiElement) return '妻财'
  return '兄弟'
}

// 六神: 根据日干确定起始六神，从初爻到上爻轮排
const LIUSHEN = ['青龙','朱雀','勾陈','螣蛇','白虎','玄武']
const LIUSHEN_MEANING = {
  '青龙': '喜庆、祥和、进财', '朱雀': '口舌、文书、争执',
  '勾陈': '拖延、田土、羁绊', '螣蛇': '惊恐、怪异、虚惊',
  '白虎': '血光、丧服、凶险', '玄武': '暗昧、私情、盗贼'
}

function getLiushen(dayGanIdx) {
  const startMap = [0, 0, 1, 1, 2, 3, 4, 4, 5, 5] // 甲乙→0, 丙丁→1, 戊→2, 己→3, 庚辛→4, 壬癸→5
  const startIdx = startMap[dayGanIdx]
  return LIUSHEN.slice(startIdx).concat(LIUSHEN.slice(0, startIdx))
}

// 六十四卦卦辞（详细版）
const GUA_DETAILS = {
  '乾': { desc: '元亨利贞', judgment: '天行健，君子以自强不息。大吉之卦，诸事皆宜，宜积极进取。', career: '事业运势极佳，领导力彰显，适合主导项目。', wealth: '财运亨通，利于投资创业。', love: '感情主动出击可获佳果。' },
  '坤': { desc: '元亨，利牝马之贞', judgment: '地势坤，君子以厚德载物。宜顺势而为，以柔克刚。', career: '宜配合他人，辅助为主，不宜独断。', wealth: '稳定积累，不宜冒险投机。', love: '包容理解是关键，感情平稳。' },
  '屯': { desc: '元亨利贞，勿用有攸往', judgment: '万事起头难，但生机已现。宜耐心等待，不宜冒进。', career: '创业初期，困难重重但前景可期。', wealth: '初期投入大，暂未见利。', love: '感情初萌，需耐心培养。' },
  '蒙': { desc: '亨，匪我求童蒙', judgment: '蒙以养正，宜虚心求教，学习积累。', career: '宜学习进修，不宜独断专行。', wealth: '不宜投机，宜稳健理财。', love: '需多沟通消除误解。' },
  '需': { desc: '有孚，光亨', judgment: '守正待时，耐心等待必有收获。', career: '时机未到，宜蓄势待发。', wealth: '耐心等待投资回报。', love: '缘分将至，静候佳音。' },
  '讼': { desc: '有孚窒惕', judgment: '争端之象，宜退不宜进，以和为贵。', career: '避免职场冲突，低调处理分歧。', wealth: '不宜诉讼争财，和解为上。', love: '矛盾需及时化解，不可冷战。' },
  '师': { desc: '贞，丈人吉', judgment: '众志成城，借助团队之力可成大事。', career: '团队合作是关键，宜凝聚人心。', wealth: '众人合力可获财。', love: '长辈撮合有利。' },
  '比': { desc: '吉，原筮元永贞', judgment: '亲比相辅，贵在真诚合作。', career: '贵人相助，宜广结善缘。', wealth: '合作生财，互利共赢。', love: '真心相待，感情稳固。' },
  '小畜': { desc: '亨，密云不雨', judgment: '积小成大，蓄势待发，量入为出。', career: '稳步积累，不宜急于求成。', wealth: '小有积蓄，积少成多。', love: '细心经营，感情渐入佳境。' },
  '履': { desc: '履虎尾，不咥人', judgment: '如履薄冰，谨慎行事可保平安。', career: '小心行事，注意人际关系。', wealth: '稳健投资，不宜冒进。', love: '小心呵护，避免踩雷。' },
  '泰': { desc: '小往大来，吉亨', judgment: '天地交泰，万物通达，大吉之卦。', career: '事业顺畅，上下和谐，宜大展宏图。', wealth: '财运亨通，广开财路。', love: '心心相印，感情美满。' },
  '否': { desc: '否之匪人', judgment: '天地不交，闭塞之象。宜韬光养晦。', career: '事业受阻，宜忍耐等待转机。', wealth: '不宜投资，守财为上。', love: '沟通不畅，需主动破冰。' },
  '同人': { desc: '同人于野，亨', judgment: '志同道合，众擎易举，宜社交合作。', career: '人脉助力大，宜广纳良言。', wealth: '合作投资有利。', love: '志同道合之人出现。' },
  '大有': { desc: '元亨', judgment: '大有丰收，光明在前，宜分享成果。', career: '事业丰收，名利双收。', wealth: '大获其利，财源广进。', love: '感情丰盈，彼此珍惜。' },
  '谦': { desc: '亨，君子有终', judgment: '谦逊有礼，谦受益，低调做人必有贵人。', career: '谦虚谨慎，反得重用。', wealth: '不骄不躁，财稳而久。', love: '谦和包容，感情和谐。' },
  '豫': { desc: '利建侯行师', judgment: '愉悦安乐，顺其自然，宜放松心态。', career: '积极乐观，顺势而为。', wealth: '心态好则财运佳。', love: '享受当下，感情甜蜜。' },
  '随': { desc: '元亨利贞', judgment: '随机应变，顺势而为，灵活调整。', career: '适应变化，随遇而安。', wealth: '灵活变通生财。', love: '顺其自然，随缘而遇。' },
  '蛊': { desc: '元亨，利涉大川', judgment: '整治积弊，拨乱反正，宜解决问题。', career: '清理旧账，整顿秩序。', wealth: '解决历史遗留财务问题。', love: '化解矛盾，修复关系。' },
  '临': { desc: '元亨利贞', judgment: '居高临下，亲力亲为，身先士卒。', career: '领导力彰显，宜身先士卒。', wealth: '亲力亲为可获利。', love: '主动关心对方。' },
  '观': { desc: '盥而不荐', judgment: '观天察地，审时度势，宜冷静观察。', career: '先观察再行动，三思后行。', wealth: '观望为主，不宜冲动投资。', love: '审视感情状态，理性判断。' },
  '噬嗑': { desc: '亨，利用狱', judgment: '明辨是非，果断处理棘手之事。', career: '果断决策，不畏挑战。', wealth: '果断出手有利。', love: '直面问题，不可逃避。' },
  '贲': { desc: '亨，小利有攸往', judgment: '文饰之美，注重形象和细节。', career: '形象管理加分，宜展现专业。', wealth: '包装增值有利。', love: '注重浪漫仪式感。' },
  '剥': { desc: '不利有攸往', judgment: '剥落之象，不宜冒进，守成为上。', career: '事业低谷，宜蛰伏等待。', wealth: '守财为上，不宜投资。', love: '感情面临考验。' },
  '复': { desc: '亨，出入无疾', judgment: '否极泰来，生机重现，宜重整旗鼓。', career: '触底反弹，从头再来。', wealth: '财运渐回，有望翻盘。', love: '破镜可重圆。' },
  '无妄': { desc: '元亨利贞', judgment: '无妄之行，脚踏实地，不可妄动。', career: '踏实做事，不可投机取巧。', wealth: '正当途径求财。', love: '真诚为本，不可欺骗。' },
  '大畜': { desc: '利贞，不家食吉', judgment: '蓄养贤能，厚积薄发，宜学习积累。', career: '能力提升期，宜充电学习。', wealth: '积累资源，日后可发。', love: '丰富自我，吸引良缘。' },
  '颐': { desc: '贞吉', judgment: '颐养身心，注意调养，注重健康。', career: '劳逸结合，不可过劳。', wealth: '合理消费，量入为出。', love: '关心对方身心健康。' },
  '大过': { desc: '栋桡，利有攸往', judgment: '非常之时行非常之事，果断抉择。', career: '大胆改革，打破常规。', wealth: '非常手段求财。', love: '大胆表白。' },
  '坎': { desc: '有孚，维心亨', judgment: '险阻重重，小心谨慎，坚持到底。', career: '困难当头，需要毅力。', wealth: '财务压力大，谨慎应对。', love: '感情坎坷，需坚持。' },
  '离': { desc: '利贞，亨', judgment: '光明附丽，前途光明，积极向上。', career: '前景光明，宜展现才华。', wealth: '财运看好，有贵人指引。', love: '热情如火，感情升温。' },
  '咸': { desc: '亨利贞', judgment: '感应相通，心心相印，宜真诚沟通。', career: '人际和谐，贵人感应。', wealth: '合作默契生财。', love: '心意相通，感情甜蜜。' },
  '恒': { desc: '亨，无咎，利贞', judgment: '持之以恒，久久为功，坚持到底。', career: '坚持不懈，必有成就。', wealth: '持续投入终有回报。', love: '长情陪伴是关键。' },
  '遁': { desc: '亨，小利贞', judgment: '退避三舍，韬光养晦，以退为进。', career: '战略性后退，保存实力。', wealth: '止损为上，不宜恋战。', love: '适当给对方空间。' },
  '大壮': { desc: '利贞', judgment: '气势如虹，正当壮盛，勇敢行动。', career: '气势正旺，可大胆推进。', wealth: '财运强盛，敢于出手。', love: '自信魅力加分。' },
  '晋': { desc: '康侯用锡马蕃庶', judgment: '晋升之象，前途似锦，积极争取。', career: '升职加薪之兆，积极表现。', wealth: '财源上进，收入增加。', love: '感情更进一步。' },
  '明夷': { desc: '利艰贞', judgment: '光明受阻，暂时隐忍，韬光养晦。', career: '低调行事，暗中蓄力。', wealth: '不宜张扬财富。', love: '暗中关心，默默付出。' },
  '家人': { desc: '利女贞', judgment: '家庭和睦，相亲相爱，关注家人。', career: '团队和谐，内部管理为重。', wealth: '家庭理财有利。', love: '家庭温馨，感情稳固。' },
  '睽': { desc: '小事吉', judgment: '背离之象，各执己见，需换位思考。', career: '意见分歧，宜求同存异。', wealth: '不宜合伙投资。', love: '矛盾需化解，多沟通。' },
  '蹇': { desc: '利西南，不利东北', judgment: '行路艰难，宜迂回而行，另辟蹊径。', career: '前路受阻，需换条路走。', wealth: '投资受阻，转换方向。', love: '感情遇阻，另想办法。' },
  '解': { desc: '利西南', judgment: '解除困境，雨过天晴，抓紧时机。', career: '困境解除，可恢复正常。', wealth: '财务问题有解。', love: '误会消除，重归于好。' },
  '损': { desc: '有孚，元吉', judgment: '有舍有得，先损后益，舍小取大。', career: '适当放弃以换取更大空间。', wealth: '先投入后回报。', love: '付出终有回应。' },
  '益': { desc: '利有攸往，利涉大川', judgment: '增益进取，顺风顺水，积极行动。', career: '贵人助力，事业腾飞。', wealth: '财运大好，广开财路。', love: '感情升温，甜蜜幸福。' },
  '夬': { desc: '扬于王庭', judgment: '决断果敢，当机立断，不可拖延。', career: '关键时刻果断决策。', wealth: '果断投资或止损。', love: '需做出重要决定。' },
  '姤': { desc: '女壮，勿用取女', judgment: '偶遇之缘，不期而遇，珍惜当下。', career: '意外机遇出现，好好把握。', wealth: '意外之财可能。', love: '邂逅之缘，顺其自然。' },
  '萃': { desc: '亨，王假有庙', judgment: '汇聚之象，群英荟萃，凝聚力量。', career: '人脉汇聚，贵人云集。', wealth: '集资合作有利。', love: '社交场合有好缘。' },
  '升': { desc: '元亨，用见大人', judgment: '步步高升，前途无量，稳扎稳打。', career: '事业上升期，稳步攀升。', wealth: '财运看涨，渐入佳境。', love: '感情逐步升温。' },
  '困': { desc: '亨，贞大人吉', judgment: '困境之中，守正待时，坚持必转。', career: '面临困境，坚持就是胜利。', wealth: '财务困难，耐心等待。', love: '感情受困，需要时间。' },
  '井': { desc: '改邑不改井', judgment: '源源不断，利济众人，无私奉献。', career: '本职工作出色，自然被认可。', wealth: '细水长流，稳定收入。', love: '默默付出，终被理解。' },
  '革': { desc: '己日乃孚', judgment: '变革之象，除旧布新，大胆革新。', career: '改革创新，开创新局。', wealth: '新投资方向有利。', love: '改变相处方式。' },
  '鼎': { desc: '元吉，亨', judgment: '鼎新之象，吉祥如意，开创新局。', career: '新气象，事业更上一层。', wealth: '新财源开启。', love: '焕然一新的感觉。' },
  '震': { desc: '亨，震来虩虩', judgment: '雷声震动，警醒自省，居安思危。', career: '突发事件需冷静应对。', wealth: '财务波动，小心应对。', love: '外界干扰，需坚定信念。' },
  '艮': { desc: '艮其背，不获其身', judgment: '止而不动，静待其变，修身养性。', career: '宜暂缓行动，静观其变。', wealth: '不宜投资，静待时机。', love: '给彼此冷静的空间。' },
  '渐': { desc: '女归吉，利贞', judgment: '循序渐进，稳步前行，不可急躁。', career: '按部就班，稳扎稳打。', wealth: '渐进式理财有利。', love: '循序渐进，水到渠成。' },
  '归妹': { desc: '征凶，无攸利', judgment: '归妹之象，宜慎抉择，三思而行。', career: '不宜冲动跳槽或决策。', wealth: '谨慎投资，不可冲动。', love: '感情需理性，不可冲动。' },
  '丰': { desc: '亨，王假之', judgment: '丰盛之极，满载而归，把握丰收。', career: '事业巅峰，收获满满。', wealth: '财运极佳，满载而归。', love: '感情丰盛，甜蜜美满。' },
  '旅': { desc: '小亨，旅贞吉', judgment: '旅途在外，小心谨慎，低调行事。', career: '出差或变动，需灵活应对。', wealth: '流动中求财，不宜固守。', love: '聚少离多需珍惜。' },
  '巽': { desc: '小亨，利有攸往', judgment: '柔顺谦逊，随风而行，灵活应变。', career: '灵活变通，借势而为。', wealth: '随市场变化调整策略。', love: '温柔以待，以柔克刚。' },
  '兑': { desc: '亨，利贞', judgment: '喜悦之象，和乐融融，广结善缘。', career: '人际关系和谐，合作愉快。', wealth: '与人合作生财。', love: '快乐甜蜜，彼此欣赏。' },
  '涣': { desc: '亨，王假有庙', judgment: '涣散之象，宜聚不宜散，凝聚力量。', career: '团队凝聚力下降，需加强。', wealth: '不宜分散投资。', love: '防止感情疏远。' },
  '节': { desc: '亨，苦节不可贞', judgment: '节制有度，适可而止，量力而行。', career: '合理规划，不可过度。', wealth: '节制消费，合理理财。', love: '适当约束，保持新鲜。' },
  '中孚': { desc: '豚鱼吉，利涉大川', judgment: '诚信为本，以诚待人，必有回报。', career: '诚实守信，赢得信任。', wealth: '信用生财。', love: '真诚相待，互信互爱。' },
  '小过': { desc: '亨利贞，可小事', judgment: '小有过越，宜小不宜大，积小胜。', career: '做小事积攒实力。', wealth: '小投资有利，大投资不宜。', love: '小事上的关心最重要。' },
  '既济': { desc: '亨小，利贞', judgment: '万事已成，功成告捷，巩固成果。', career: '项目完成，享受成果。', wealth: '收获在即，注意守住。', love: '感情圆满，注意维护。' },
  '未济': { desc: '亨，小狐汔济', judgment: '事尚未成，仍需努力，总结反思。', career: '尚未完成，需继续努力。', wealth: '投资尚未回报，需耐心。', love: '感情尚未明朗，继续经营。' }
}

// 问题分类关键词
const CATEGORY_KEYWORDS = {
  career: /工作|事业|升职|跳槽|面试|老板|同事|岗位|创业|公司/,
  wealth: /财|投资|赚钱|生意|薪|股票|基金|理财|偏财|正财/,
  love: /感情|爱情|婚姻|恋|复合|桃花|对象|男友|女友|老公|老婆|相亲|表白/,
  health: /健康|病|身体|手术|医|痊愈|体质/,
  study: /学|考|升学|论文|成绩|进修|培训/,
  travel: /出行|旅行|搬家|远门|出差|迁移/
}

const CATEGORY_FOCUS = {
  career: { main: '官鬼', assist: '父母', against: '兄弟', label: '事业运' },
  wealth: { main: '妻财', assist: '子孙', against: '兄弟', label: '财运' },
  love:   { main: '妻财', assist: '官鬼', against: '兄弟', label: '感情运' },
  health: { main: '官鬼', assist: '子孙', against: '官鬼', label: '健康运' },
  study:  { main: '父母', assist: '官鬼', against: '子孙', label: '学业运' },
  travel: { main: '父母', assist: '子孙', against: '官鬼', label: '出行运' },
  general:{ main: '妻财', assist: '子孙', against: '兄弟', label: '综合运' }
}

function detectCategory(question) {
  if (!question) return 'general'
  for (const [cat, regex] of Object.entries(CATEGORY_KEYWORDS)) {
    if (regex.test(question)) return cat
  }
  return 'general'
}

/**
 * 从六爻线数据生成完整分析
 * @param {Array} lines - 6个爻 [{ yang, isMoving, lineType }] 从初爻到上爻
 * @param {number} dayGanIdx - 日干索引(0-9)
 * @param {string} question - 用户问题
 * @returns {Object} 完整卦象分析
 */
function analyzeHexagram(lines, dayGanIdx, question) {
  // 1. 确定上下卦
  const lower = (lines[0].yang ? 1 : 0) + (lines[1].yang ? 2 : 0) + (lines[2].yang ? 4 : 0)
  const upper = (lines[3].yang ? 1 : 0) + (lines[4].yang ? 2 : 0) + (lines[5].yang ? 4 : 0)
  const kingWenNum = HEXAGRAM_TABLE[upper * 8 + lower]
  const guaName = GUA_NAMES[kingWenNum - 1]
  const guaDetail = GUA_DETAILS[guaName] || { desc: '', judgment: '卦象已成，宜静心观变，顺势而为。', career: '', wealth: '', love: '' }

  // 2. 宫属信息
  const palaceInfo = PALACE_MAP[kingWenNum] || { palace: '乾', element: '金', pos: 0 }
  const wr = WORLD_RESPONSE[palaceInfo.pos]

  // 3. 纳甲 - 每爻的天干地支
  const najiaLower = NAJIA[lower]
  const najiaUpper = NAJIA[upper]
  const liushenOrder = getLiushen(dayGanIdx)

  const lineDetails = lines.map((line, idx) => {
    const isInner = idx < 3
    const najia = isInner ? najiaLower.inner[idx] : najiaUpper.outer[idx - 3]
    const gan = TIANGAN[najia[0]]
    const zhi = DIZHI[najia[1]]
    const zhiElement = DIZHI_WUXING[zhi]
    const liuqin = getLiuqin(zhiElement, palaceInfo.element)
    const liushen = liushenOrder[idx]

    return {
      position: idx + 1,         // 1-6 from bottom
      yang: line.yang,
      isMoving: line.isMoving,
      lineType: line.lineType,
      ganZhi: gan + zhi,
      zhi,
      zhiElement,
      liuqin,
      liushen,
      liushenMeaning: LIUSHEN_MEANING[liushen],
      isWorld: idx + 1 === wr.world,
      isResponse: idx + 1 === wr.response
    }
  })

  // 4. 互卦
  const mutualLower = (lines[1].yang ? 1 : 0) + (lines[2].yang ? 2 : 0) + (lines[3].yang ? 4 : 0)
  const mutualUpper = (lines[2].yang ? 1 : 0) + (lines[3].yang ? 2 : 0) + (lines[4].yang ? 4 : 0)
  const mutualKingWen = HEXAGRAM_TABLE[mutualUpper * 8 + mutualLower]
  const mutualName = GUA_NAMES[mutualKingWen - 1]

  // 5. 变卦
  let changedName = '', changedKingWen = 0
  const hasMoving = lines.some(l => l.isMoving)
  if (hasMoving) {
    const changedYang = lines.map(l => l.isMoving ? !l.yang : l.yang)
    const chLower = (changedYang[0] ? 1 : 0) + (changedYang[1] ? 2 : 0) + (changedYang[2] ? 4 : 0)
    const chUpper = (changedYang[3] ? 1 : 0) + (changedYang[4] ? 2 : 0) + (changedYang[5] ? 4 : 0)
    changedKingWen = HEXAGRAM_TABLE[chUpper * 8 + chLower]
    changedName = GUA_NAMES[changedKingWen - 1]
  }

  // 6. 动爻分析
  const movingLines = lineDetails.filter(l => l.isMoving)
  let movingAdvice = ''
  if (movingLines.length === 0) {
    movingAdvice = '无动爻，以本卦卦辞为主断，卦象稳定，按部就班即可。'
  } else if (movingLines.length === 1) {
    movingAdvice = `单爻动（${movingLines[0].liuqin}${movingLines[0].zhi}），以该爻辞为主断。此爻${movingLines[0].liushen}临${movingLines[0].liuqin}，${movingLines[0].liushenMeaning}。`
  } else if (movingLines.length <= 3) {
    movingAdvice = `${movingLines.length}爻同动，${movingLines.map(l => l.liuqin + l.zhi).join('、')}共动，以本卦为体变卦为用，综合判断。`
  } else {
    movingAdvice = `动爻过多（${movingLines.length}个），变数太大，以静爻为主断。`
  }

  // 7. 世应分析
  const worldLine = lineDetails.find(l => l.isWorld)
  const responseLine = lineDetails.find(l => l.isResponse)
  let worldAnalysis = `世爻（${worldLine.liuqin}${worldLine.ganZhi}）代表自身，`
  worldAnalysis += worldLine.isMoving ? '世爻发动，自身有变动之意。' : '世爻安静，自身心态平稳。'
  worldAnalysis += ` 应爻（${responseLine.liuqin}${responseLine.ganZhi}）代表对方，`
  worldAnalysis += responseLine.isMoving ? '应爻发动，对方有主动变化。' : '应爻安静，对方态度稳定。'

  // 8. 问题分类分析
  const category = detectCategory(question)
  const focus = CATEGORY_FOCUS[category]
  const focusLines = lineDetails.filter(l => l.liuqin === focus.main)
  const assistLines = lineDetails.filter(l => l.liuqin === focus.assist)
  const againstLines = lineDetails.filter(l => l.liuqin === focus.against)

  let categoryAdvice = ''
  const focusMoving = focusLines.some(l => l.isMoving)
  const assistMoving = assistLines.some(l => l.isMoving)
  const againstMoving = againstLines.some(l => l.isMoving)

  categoryAdvice += `【${focus.label}】`
  if (focusLines.length > 0) {
    categoryAdvice += `用神${focus.main}持于${focusLines.map(l => '第' + l.position + '爻').join('、')}，`
    categoryAdvice += focusMoving ? '且为动爻，此事有变动之机。' : '安静不动，暂无大变化。'
  } else {
    categoryAdvice += `卦中无${focus.main}，所问之事暂无明确指向。`
  }
  if (assistLines.length > 0) {
    categoryAdvice += ` 原神${focus.assist}在${assistLines.map(l => '第' + l.position + '爻').join('、')}，`
    categoryAdvice += assistMoving ? '发动有力，助力明显。' : '静而待发。'
  }
  if (againstLines.length > 0) {
    categoryAdvice += ` 忌神${focus.against}在${againstLines.map(l => '第' + l.position + '爻').join('、')}，`
    categoryAdvice += againstMoving ? '发动不利，需注意。' : '安静无害。'
  }

  // 9. 五行关系
  const upperTri = TRIGRAMS[upper]
  const lowerTri = TRIGRAMS[lower]
  let elementRel = upperTri.element === lowerTri.element ? '比和'
    : (GENERATE[upperTri.element] === lowerTri.element ? '上生下'
    : (GENERATE[lowerTri.element] === upperTri.element ? '下生上'
    : (CONTROL[upperTri.element] === lowerTri.element ? '上克下'
    : (CONTROL[lowerTri.element] === upperTri.element ? '下克上' : '比和'))))

  return {
    guaName,
    kingWenNum,
    guaDesc: guaDetail.desc,
    guaJudgment: guaDetail.judgment,
    upperTrigram: upperTri,
    lowerTrigram: lowerTri,
    elementRel,
    palace: palaceInfo,
    palacePosName: PALACE_POSITION_NAMES[palaceInfo.pos],
    lines: lineDetails,
    worldLine: worldLine.position,
    responseLine: responseLine.position,
    mutualName,
    mutualDetail: GUA_DETAILS[mutualName] || null,
    changedName,
    changedDetail: hasMoving ? (GUA_DETAILS[changedName] || null) : null,
    movingAdvice,
    worldAnalysis,
    category,
    categoryLabel: focus.label,
    categoryAdvice,
    careerAdvice: guaDetail.career,
    wealthAdvice: guaDetail.wealth,
    loveAdvice: guaDetail.love
  }
}

module.exports = {
  GUA_NAMES,
  HEXAGRAM_TABLE,
  TRIGRAMS,
  GUA_DETAILS,
  analyzeHexagram,
  detectCategory
}
