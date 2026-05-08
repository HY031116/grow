'use strict';

// ==================== 出身数据 ====================

const ORIGINS = {
  scholar: {
    id: 'scholar',
    name: '寒门学子',
    titleMale: '公子',
    titleFemale: '才女',
    icon: '📚',
    desc: '出身贫寒，却饱读诗书，满腹经纶。一朝中举踏入仕途，脑子是你最大的本钱。',
    flavor: '"十年寒窗无人问，一举成名天下知。"',
    recommended: 'court',
    trait: '博学多才：每回合圣眷 +5',
    traitBonus: { track: 'court', key: 'favor', val: 5 },
    resources: {
      court: { gold: 20, favor: 30, power: 5 },
      rebel: { gold: 20, troops: 5, morale: 40, territory: 0 },
      merchant: { gold: 40, wealth: 20, routes: 1, prestige: 25 },
      hero: { gold: 20, martial: 10, fame: 25, bonds: 0 }
    }
  },
  warrior: {
    id: 'warrior',
    name: '边境武将',
    titleMale: '将军',
    titleFemale: '女将军',
    icon: '⚔️',
    desc: '从军多年，守护边疆，立下赫赫战功。手握兵权，却在朝中无根基。乱世中，刀剑比笔杆更有力。',
    flavor: '"马革裹尸还，壮士何所惧。"',
    recommended: 'rebel',
    trait: '沙场宿将：每次征兵额外+5兵力',
    traitBonus: { track: 'rebel', action: 'recruit', key: 'troops', val: 5 },
    resources: {
      court: { gold: 25, favor: 15, power: 15 },
      rebel: { gold: 40, troops: 50, morale: 30, territory: 5 },
      merchant: { gold: 45, wealth: 15, routes: 1, prestige: 10 },
      hero: { gold: 25, martial: 35, fame: 10, bonds: 0 }
    }
  },
  merchant: {
    id: 'merchant',
    name: '落魄商贾',
    titleMale: '东家',
    titleFemale: '掌柜',
    icon: '💰',
    desc: '家道中落，积蓄仍厚，四方人脉广布。银子是最万能的武器，走哪条路都用得上。',
    flavor: '"富贵不还乡，如锦衣夜行。"',
    recommended: 'merchant',
    trait: '富甲一方：每回合钱粮 +5',
    traitBonus: { key: 'gold', val: 5 },
    resources: {
      court: { gold: 45, favor: 10, power: 8 },
      rebel: { gold: 45, troops: 10, morale: 25, territory: 0 },
      merchant: { gold: 60, wealth: 40, routes: 1, prestige: 15 },
      hero: { gold: 45, martial: 10, fame: 20, bonds: 0 }
    }
  },
  wanderer: {
    id: 'wanderer',
    name: '游侠少年',
    titleMale: '侠士',
    titleFemale: '女侠',
    icon: '🗡️',
    desc: '行走江湖多年，剑术精进，路见不平则拔刀相助。没有钱财背景，却有一身好武艺与一颗赤子之心。',
    flavor: '"十步杀一人，千里不留行。"',
    recommended: 'hero',
    trait: '游侠本色：侠客赛道每回合武艺 +3',
    traitBonus: { track: 'hero', key: 'martial', val: 3 },
    resources: {
      court: { gold: 20, favor: 8, power: 10 },
      rebel: { gold: 25, troops: 30, morale: 35, territory: 0 },
      merchant: { gold: 30, wealth: 10, routes: 0, prestige: 10 },
      hero: { gold: 30, martial: 30, fame: 15, bonds: 0 }
    }
  }
};

// ==================== 赛道数据 ====================

const TRACKS = {
  court: {
    id: 'court',
    name: '官场之路',
    subtitle: '忠臣 · 奸臣',
    icon: '👑',
    desc: '踏入朝堂，在圣眷与权柄之间寻找平衡。辅佐明君，或架空皇帝——史书如何记载你，全凭你的选择。',
    resources: [
      { key: 'gold',     name: '钱粮', icon: '🌾', color: '#c9a84c', max: 300, displayMax: 150, lowVal: 40, highVal: 100 },
      { key: 'favor',    name: '圣眷', icon: '👑', color: '#e8c45a', max: 100 },
      { key: 'power',    name: '权柄', icon: '⚖️', color: '#9b59b6', max: 100 },
      { key: 'vitality', name: '体魄', icon: '💪', color: '#27ae60', max: 100, lowVal: 30, highVal: 80 }
    ],
    winText: '权柄 ≥ 80 且 圣眷 ≥ 85',
    loseText: '钱粮归零 或 圣眷归零'
  },
  rebel: {
    id: 'rebel',
    name: '造反之路',
    subtitle: '诸侯 · 枭雄',
    icon: '⚔️',
    desc: '揭竿而起，招募义军，攻城略地。有朝一日问鼎天下——或者兵败身死，身首异处。',
    resources: [
      { key: 'gold',      name: '钱粮', icon: '🌾', color: '#c9a84c', max: 300, displayMax: 150, lowVal: 40, highVal: 100 },
      { key: 'troops',    name: '兵力', icon: '⚔️', color: '#e74c3c', max: 100 },
      { key: 'morale',    name: '民心', icon: '❤️', color: '#2ecc71', max: 100 },
      { key: 'territory', name: '地盘', icon: '🏯', color: '#e67e22', max: 100 },
      { key: 'vitality',  name: '体魄', icon: '💪', color: '#27ae60', max: 100, lowVal: 30, highVal: 80 }
    ],
    winText: '地盘 ≥ 80 且 民心 ≥ 60',
    loseText: '钱粮归零 或 兵力归零'
  },
  merchant: {
    id: 'merchant',
    name: '富商之路',
    subtitle: '商贾 · 巨富',
    icon: '💰',
    desc: '以银子开路，打通商道，垄断贸易。富可敌国之时，天下权贵皆需仰你鼻息，一掷千金，再造乾坤。',
    resources: [
      { key: 'gold',     name: '钱粮', icon: '🌾', color: '#c9a84c', max: 300, displayMax: 150, lowVal: 40, highVal: 100 },
      { key: 'wealth',   name: '财富', icon: '💎', color: '#f1c40f', max: 150, lowVal: 10, highVal: 80 },
      { key: 'routes',   name: '商路', icon: '🛤️', color: '#27ae60', max: 10,  lowVal: 1,  highVal: 5  },
      { key: 'prestige', name: '商誉', icon: '🏮', color: '#e67e22', max: 100 },
      { key: 'vitality', name: '体魄', icon: '💪', color: '#27ae60', max: 100, lowVal: 30, highVal: 80 }
    ],
    winText: '财富 ≥ 100 且 商路 ≥ 3',
    loseText: '钱粮归零 或 商誉归零'
  },
  hero: {
    id: 'hero',
    name: '侠客之路',
    subtitle: '游侠 · 大侠',
    icon: '🗡️',
    desc: '仗剑走天涯，行侠仗义，恩仇必报。当你的名字令奸邪胆寒、百姓安心之时，便是真正的江湖传说。',
    resources: [
      { key: 'gold',     name: '钱粮', icon: '🌾', color: '#c9a84c', max: 300, displayMax: 150, lowVal: 40, highVal: 100 },
      { key: 'martial',  name: '武艺', icon: '⚔️', color: '#e74c3c', max: 100 },
      { key: 'fame',     name: '名望', icon: '⭐', color: '#f39c12', max: 100 },
      { key: 'bonds',    name: '恩义', icon: '🤝', color: '#2980b9', max: 50,  lowVal: 3,  highVal: 25 },
      { key: 'vitality', name: '体魄', icon: '💪', color: '#27ae60', max: 100, lowVal: 30, highVal: 80 }
    ],
    winText: '名望 ≥ 80 且 武艺 ≥ 60',
    loseText: '钱粮归零'
  }
};

// ==================== 官位称号（基于圣眷） ====================

function getCourtTitle(favor, gender) {
  // 男性：朝廷官职；女性：诰命封号（历史上女性通过丈夫/自身功勋获封）
  if (gender === 'female') {
    if (favor >= 85) return '国夫人';
    if (favor >= 70) return '一品诰命';
    if (favor >= 55) return '淑人';
    if (favor >= 40) return '宜人';
    if (favor >= 25) return '安人';
    return '孺人';
  }
  if (favor >= 85) return '宰辅';
  if (favor >= 70) return '尚书';
  if (favor >= 55) return '侍郎';
  if (favor >= 40) return '知府';
  if (favor >= 25) return '县令';
  return '小吏';
}

// ==================== 行动数据 ====================

const ACTIONS = {
  court: [
    {
      id: 'diligent',
      name: '勤勉办差',
      icon: '📜',
      cost: 1,
      desc: '兢兢业业把差事办得漂亮，皇帝都看在眼里。',
      effect: { favor: 18, power: -5 },
      seasonBonus: { season: '秋', keys: { favor: 8 }, hint: '秋日考评，勤政格外受赏识' },
      results: [
        '你将差事办得井井有条，上司连连称赞，皇帝亦有耳闻，圣眷微升。',
        '你夙兴夜寐，终于将积压的公文处理妥当，忠勤之名渐传。',
        '你任劳任怨，名声渐好，同僚们却有些和你疏远了。'
      ]
    },
    {
      id: 'network',
      name: '经营党羽',
      icon: '🤝',
      cost: 1,
      desc: '拉拢同僚，扶植心腹，在朝中构建自己的势力网络。',
      effect: { power: 22, favor: -8, gold: -10, vitality: -5 },
      results: [
        '你广结善缘，暗中许以好处，数位同僚已投入你的麾下，权柄渐盛。',
        '你在官场中编织关系网，皇帝似乎察觉了些什么，但你的势力已成。',
        '你与数位要员秘密会晤，你的党羽又多了几人。'
      ]
    },
    {
      id: 'memorial',
      name: '上奏折',
      icon: '✍️',
      cost: 1,
      desc: '直达天听，表明忠心与立场。天子信任有加，但朝中党羽可能因此疏远，权柄渐失。',
      effect: { favor: 22, power: -8 },
      riskEffect: { favor: -12 },
      riskChance: 0.25,
      results: [
        '你的奏折言辞恳切，皇帝龙颜大悦，当场嘉奖，满朝瞩目。',
        '你仗义执言，奏折写得铿锵有力，皇帝频频点头，圣眷大涨。',
        '你的奏折写得花团锦簇，圣上在朝堂上当众称赞你忠心耿耿。'
      ],
      riskResults: [
        '你的奏折触怒了某位权贵，此人暗中记恨，又在皇帝面前出言不逊，圣眷有损。',
        '奏折被人截下，皇帝未见到真实内容，甚至误会了你的意思，圣眷下滑。'
      ]
    },
    {
      id: 'bribe',
      name: '打点上司',
      icon: '💰',
      cost: 1,
      desc: '花钱消灾，为官之道在于"孝敬"。银子打出去，路子就通了。',
      effect: { gold: -25, favor: 20, power: 8 },
      seasonBonus: { season: '冬', keys: { favor: 8, power: 5 }, hint: '年关节礼，礼重情深' },
      results: [
        '你备好厚礼，登门拜访，上司喜笑颜开，当即为你美言几句，圣眷与权柄皆涨。',
        '白花花的银子送出去，上司的态度立刻软了三分，朝中路子也宽了。',
        '你投桃报李，打点得当，在朝中又多了几分人情，局面大为改善。'
      ]
    },
    {
      id: 'extort',
      name: '搜刮油水',
      icon: '🪙',
      cost: 1,
      desc: '当官不发财，请我来何用？趁机敛财，充实口袋。',
      effect: { gold: 30, favor: -15, power: 5, vitality: -5 },
      results: [
        '你打着"征收"的名目，中饱私囊，百姓敢怒不敢言，钱袋鼓了许多。',
        '你设法在账目上做了手脚，白花花的银子流入口袋，但御史已经开始盯着你了。',
        '一番操作下来，钱袋鼓了，街头已有民怨流传，圣眷有所下滑。'
      ]
    },
    {
      id: 'court_gamble',
      name: '孤注一掷',
      icon: '🎯',
      cost: 2,
      desc: '在皇帝面前正面弹劾政敌，置之死地而后生。成则声名大噪，败则万劫不复。（消耗 2 行动点，胜率 60%）',
      effect: { favor: 42, power: 12, vitality: -10 },
      failEffect: { favor: -30, power: -18 },
      failChance: 0.40,
      isRiskAction: true,
      results: [
        '你当庭慷慨陈词，证据确凿，对手哑口无言。皇帝拍案称赞，满朝震动，圣眷权柄双双飙升。',
        '你孤身站出，以一己之力扭转局面，皇帝龙颜大悦，此后对你格外倚重。',
        '这一搏，你赢了。弹劾铁证如山，政敌当场被贬，你的名字在朝野间传开。'
      ],
      failResults: [
        '局势急转直下，对方早有准备，反将你一军。皇帝龙颜震怒，此番孤注一掷满盘皆输。',
        '你冒险出手，却被对方识破布局，当庭被驳斥得体无完肤，圣眷大损，权柄受创。'
      ]
    }
  ],

  rebel: [
    {
      id: 'recruit',
      name: '招兵买马',
      icon: '⚔️',
      cost: 1,
      desc: '乱世中，兵力就是话语权。花银子，招义士，壮大队伍。',
      effect: { gold: -20, troops: 25, vitality: -5 },
      results: [
        '四方豪杰闻风而来，你的旗下又多了数百兵马，军势大振。',
        '你散尽钱财，广招英雄，队伍又壮大了几分，士气高昂。',
        '新兵入营，战鼓轰鸣，你的军势日渐浩大，令四方侧目。'
      ]
    },
    {
      id: 'relief',
      name: '安民施粥',
      icon: '🍲',
      cost: 1,
      desc: '得民心者得天下。开仓放粮，施粥赈灾，赢得百姓之心。',
      effect: { gold: -15, morale: 25, troops: 5 },
      seasonBonus: { season: '冬', keys: { morale: 15 }, hint: '冬日施粥，恩泽倍显' },
      results: [
        '你开仓放粮，百里之内百姓奔走相告，民心大振，甚至有青壮主动从军。',
        '你设粥棚赈济灾民，百姓感恩戴德，民心渐归，又有壮丁自愿投军。',
        '你仁德之名传遍乡野，民心所向，义军士气大涨。'
      ]
    },
    {
      id: 'attack',
      name: '挥兵攻城',
      icon: '🏯',
      cost: 2,
      desc: '兵锋所指，天下震动。出兵攻打据点，扩大你的地盘。（消耗 2 行动点）',
      effect: { troops: -15, territory: 20, gold: 15, morale: -5, vitality: -10 },
      failEffect: { troops: -22, gold: -10 },
      failChance: 0.28,
      results: [
        '大军压境，城池告破！你的旗帜插上城墙，地盘大涨，缴获颇丰。',
        '一场激战之后，敌军溃败。你掳获大批钱粮，地盘又扩了一圈。',
        '攻城战役胜利！士卒伤亡不小，但新得之地带来了丰厚收益。'
      ],
      failResults: [
        '攻城不利，守军负隅顽抗，你损兵折将，只得鸣金收兵，两手空空。',
        '久攻不下，军中疲惫，你被迫撤兵，折损惨重，士气受挫。'
      ]
    },
    {
      id: 'farm',
      name: '屯田积粮',
      icon: '🌾',
      cost: 1,
      desc: '组织军民屯田，积蓄粮草，为大战做准备。然而士卒耕作期间，军事训练停摆，战力有所削弱。',
      effect: { gold: 25, troops: -8, morale: 8 },
      seasonBonus: { season: '秋', keys: { gold: 15 }, hint: '秋收丰年，屯粮事半功倍' },
      results: [
        '你号令军民屯田，一季之后粮仓渐满，军心稳固，民心也跟着涨了些。',
        '你大力推行屯田，解决了后勤之忧，军队士气因此提振。',
        '粮食堆满仓库，士卒安心，百姓的安居让民心也好了许多。'
      ]
    },
    {
      id: 'rebel_gamble',
      name: '奇袭突进',
      icon: '⚡',
      cost: 2,
      desc: '率轻骑孤军深入，出奇制胜。成则震动天下，败则全军覆没。（消耗 2 行动点，胜率 65%）',
      effect: { territory: 22, troops: 12, morale: 8, vitality: -10 },
      failEffect: { troops: -25, gold: -15, morale: -10 },
      failChance: 0.35,
      isRiskAction: true,
      results: [
        '铁骑奔袭，如天降神兵，敌军措手不及。地盘大涨，军威大振，天下震动。',
        '你亲率精锐奇袭得手，敌军溃败，三军欢呼，你的勇名传遍四方。',
        '出奇制胜！这一战打出了你的威风，各路豪杰闻风来投，声势大涨。'
      ],
      failResults: [
        '深入敌后，却遭四面合围，拼死突围之后损兵折将，元气大伤。',
        '轻骑突进中了埋伏，大败而归，折损精锐无数，士气跌至谷底。'
      ]
    }
  ],

  merchant: [
    {
      id: 'open_shop',
      name: '开张铺面',
      icon: '🏪',
      cost: 1,
      desc: '广开商铺，坐地收财。本钱换商路，商路换财富。',
      effect: { gold: -15, wealth: 25, routes: 1 },
      seasonBonus: { season: '春', keys: { wealth: 10 }, hint: '春季开张大吉，财运旺' },
      results: [
        '你选了个好地段，铺面一开，财源滚滚，路子也越走越宽。',
        '开张大吉，四方客商络绎不绝，财富与商路双双增长。',
        '铺面开张，你的商业版图又扩大了一块。'
      ]
    },
    {
      id: 'hoard',
      name: '囤积居奇',
      icon: '📦',
      cost: 1,
      desc: '趁低买入，高价出售，牟取暴利。但万一风声走漏……',
      effect: { gold: -10, wealth: 45, vitality: -5 },
      riskChance: 0.30,
      riskEffect: { gold: -20, prestige: -15 },
      results: [
        '你判断时机准确，囤积的货物高价出手，财富大涨。',
        '低买高卖，一本万利，这才是做生意的诀窍。',
        '货物高价卖出，钱袋鼓鼓，财富可观。'
      ],
      riskResults: [
        '官府察觉你在哄抬物价，施压重罚，商誉大损，钱财受损。',
        '你的囤货手段被同行揭发，声誉受损，官府也来查验，赔了本钱。'
      ]
    },
    {
      id: 'trade_route',
      name: '打通商路',
      icon: '🛤️',
      cost: 1,
      desc: '打点沿途关卡，开辟新的贸易线路，扩大商业版图。',
      effect: { gold: -25, routes: 2, prestige: 15 },
      results: [
        '银子打出去，路子打通了。新商路畅通，商誉远播四方。',
        '你亲赴各处，疏通关节，新线路开辟，商誉大涨。',
        '打通商路，四面商贾闻名而来，你的大名在商界传开了。'
      ]
    },
    {
      id: 'bribe_official',
      name: '打点权贵',
      icon: '🎁',
      cost: 1,
      desc: '送礼行贿，在朝中搭上关系，为生意铺路。商誉因此大涨。',
      effect: { gold: -30, prestige: 22 },
      seasonBonus: { season: '冬', keys: { prestige: 10 }, hint: '年关礼厚，人情更深' },
      results: [
        '银子送到，笑脸迎来，从此官道畅通，商誉大涨。',
        '礼到，人到，路通了。有了朝中关系，生意更好做了。',
        '打点妥当，朝中关系固若金汤，商誉一时无两。'
      ]
    },
    {
      id: 'lending',
      name: '放贷收息',
      icon: '📜',
      cost: 2,
      desc: '以本金放贷，坐收利息。高回报，但有债主跑路的风险。（消耗 2 行动点）',
      effect: { gold: -20, wealth: 55, vitality: -10 },
      failChance: 0.25,
      failEffect: { prestige: -20 },
      results: [
        '债主如期还款加息，财富暴涨，你已是一方财神。',
        '利钱滚滚而来，这笔贷款让你的财富翻了番。',
        '收债顺利，财富大增，放贷果然是最稳赚的买卖。'
      ],
      failResults: [
        '对方卷款潜逃，血本无归，商誉因此大损。',
        '债主人去楼空，你追讨无门，商界传出你被骗的消息，声誉受损。'
      ]
    },
    {
      id: 'merchant_gamble',
      name: '孤注一铺',
      icon: '🎰',
      cost: 2,
      desc: '倾全部本钱押注一笔大买卖，赢则暴富，输则倾家。（消耗 2 行动点，胜率 60%）',
      effect: { wealth: 55, prestige: 15, vitality: -10 },
      failEffect: { wealth: -25, prestige: -20, gold: -20 },
      failChance: 0.40,
      isRiskAction: true,
      results: [
        '那笔买卖一炮而红，财富如雪崩般涌来，商界惊叹，商誉大振。',
        '你押对了！货物供不应求，高价售出，财富与声望一夜暴涨。',
        '时机把握精准，孤注一掷终于换来满盘皆赢，天下商人皆听闻你的名字。'
      ],
      failResults: [
        '买卖砸了，本钱血亏，商誉大损，同行交头接耳都是你的笑话。',
        '行情突变，货物滞销，押注失败，财富受创，商誉一落千丈。'
      ]
    }
  ],

  hero: [
    {
      id: 'train',
      name: '苦练武艺',
      icon: '🥋',
      cost: 1,
      desc: '闭门苦练，精进拳脚与剑法。宝剑锋从磨砺出，然而深居练功，江湖声名渐淡。',
      effect: { martial: 25, fame: -8, vitality: -5 },
      results: [
        '你每日拂晓起身，苦练至日落，武艺精进，剑势日盛。',
        '寒暑不辍，汗水浸透衣衫，你的剑法已炉火纯青。',
        '一遍又一遍练习招式，你感觉体内有什么东西打通了。'
      ]
    },
    {
      id: 'roam',
      name: '行走江湖',
      icon: '🌍',
      cost: 1,
      desc: '四处游历，结交豪杰，见闻广博。说不准会遇上什么奇遇。',
      effect: { gold: -5, fame: 15 },
      riskChance: 0.25,
      riskEffect: { fame: 25, martial: -8 },
      results: [
        '你走遍山川，结交四方豪杰，名望在江湖中悄悄传扬。',
        '游历途中，见识大涨，江湖中知道你名字的人也多了起来。',
        '一路仗义疏财，豪侠之名渐渐在江湖中传播开来。'
      ],
      riskResults: [
        '途中遭遇强人，你大战一场，虽受了些伤，却以一敌众的壮举，让名望大涨。',
        '你与一位高手过招，不敌受伤，但那场酣畅淋漓的对决让江湖中人刮目相看。'
      ]
    },
    {
      id: 'justice',
      name: '替天行道',
      icon: '⚖️',
      cost: 1,
      desc: '路见不平，拔刀相助。你的名望，是一刀一剑闯出来的。',
      effect: { gold: -8, fame: 20, bonds: 10 },
      seasonBonus: { season: '春', keys: { fame: 10 }, hint: '春暖人和，侠义之名传播更远' },
      results: [
        '你出手惩奸除恶，受益者涕泪横流，当场立誓此生追随。名望大涨。',
        '一刀斩断不平事，百姓奔走相告，你的大名在方圆百里传开。',
        '你仗义援手，结下恩情，受惠者发誓有朝一日必报大恩。'
      ]
    },
    {
      id: 'escort',
      name: '接镖护送',
      icon: '🛡️',
      cost: 1,
      desc: '接受镖局委托，护送货物抵达目的地。安全则有报酬，遭劫则有风险。',
      effect: { gold: 22 },
      seasonBonus: { season: '秋', keys: { gold: 12 }, hint: '秋季商旅繁忙，镖银格外丰厚' },
      riskChance: 0.25,
      riskEffect: { gold: 8, martial: -8 },
      results: [
        '一路平安送达，镖金到手，护镖的好名声也传开了。',
        '你武艺高强，镖队平安抵达，东家大方酬谢。',
        '护送顺利，钱财到手，顺便还结交了些江湖朋友。'
      ],
      riskResults: [
        '途遇劫匪，你力保镖货，却在混战中受了些内伤，武艺暂时受损。',
        '山路遭伏，你浴血奋战，终究保住了货物，只是武艺受伤，需要调养。'
      ]
    },
    {
      id: 'guild',
      name: '组建帮派',
      icon: '🏮',
      cost: 2,
      desc: '广纳门下弟子，建立帮会组织，恩义遍及江湖。（消耗 2 行动点）',
      effect: { gold: -20, bonds: 20, fame: 10 },
      results: [
        '你振臂一呼，四方豪杰纷纷来投，帮会旗帜在城中正式立起。',
        '你以恩义结纳，帮众齐心，帮派日益壮大，江湖名望大涨。',
        '帮派初立，兄弟义气，誓同生死。名望与恩义齐飞。'
      ]
    },
    {
      id: 'hero_gamble',
      name: '生死一搏',
      icon: '🔥',
      cost: 2,
      desc: '单刀赴会，向江湖公认的强者发起挑战。胜则威震四方，败则颜面尽失。（消耗 2 行动点，胜率 65%）',
      effect: { martial: 28, fame: 22, vitality: -10 },
      failEffect: { gold: -18, martial: -8, fame: -12 },
      failChance: 0.35,
      isRiskAction: true,
      results: [
        '一场惊天动地的对决，你险胜！消息传开，江湖无人不知你的名字。',
        '你以弱胜强，武艺精进，名望一夜之间传遍大江南北。',
        '对决持续数百回合，最终你力压对手，武名响彻江湖。'
      ],
      failResults: [
        '强敌面前，你力有不逮，惨败而归，身受内伤，颜面尽失。',
        '对方武艺远在你之上，你败得狼狈，伤了根基，名望受损。'
      ]
    }
  ]
};

// ==================== 个人志向数据 ====================
// 玩家在赛道选择后选定，影响特定行动的额外加成和结局标记
const AMBITIONS = {
  legacy: {
    id: 'legacy',
    name: '功名传世',
    icon: '📜',
    desc: '以学识功绩名垂青史，令后人铭记此生所为。',
    bonusDesc: '每次「读书增智」，额外获得当前赛道主要资源 +8。',
    bonusActionId: 'study',
    bonusKey: 'mainRes',
    bonusVal: 8,
    tag: '✦ 青史留名'
  },
  wealth: {
    id: 'wealth',
    name: '富甲天下',
    icon: '💰',
    desc: '积财万贯，令天下人皆仰慕此富贵。',
    bonusDesc: '每次「游历四方」，额外获得 金钱 +12。',
    bonusActionId: 'wander',
    bonusKey: 'gold',
    bonusVal: 12,
    tag: '✦ 万贯家财'
  },
  martial: {
    id: 'martial',
    name: '以武立身',
    icon: '⚔️',
    desc: '凭真本事在世间立足，强者自有强者的尊严。',
    bonusDesc: '每次「游历四方」，额外获得当前赛道主要资源 +10。',
    bonusActionId: 'wander',
    bonusKey: 'mainRes',
    bonusVal: 10,
    tag: '✦ 强者之道'
  },
  justice: {
    id: 'justice',
    name: '兼济天下',
    icon: '🌿',
    desc: '行仁义于天下，泽被苍生，此生无憾。',
    bonusDesc: '每次「接济百姓」，仁善积累加倍（额外累积 +1 点仁善值）。',
    bonusActionId: 'charity',
    bonusKey: 'benevolent',
    bonusVal: 1,
    tag: '✦ 天下仁心'
  },
  freedom: {
    id: 'freedom',
    name: '逍遥世外',
    icon: '🌐',
    desc: '随遇而安，不为名利所缚，心随天地游。',
    bonusDesc: '每次「休养生息」，额外获得 金钱 +12。',
    bonusActionId: 'rest',
    bonusKey: 'gold',
    bonusVal: 12,
    tag: '✦ 天地逍遥'
  }
};

// ==================== NPC 关系数据 ====================
// 每个 NPC 有 id / name / icon / desc / 关联赛道 / 事件池（按关系层级）
const NPC_DATA = {
  // 权相：官场路核心 NPC，可以是盟友也可以是政敌
  minister: {
    id: 'minister',
    name: '李崇',
    icon: '🎭',
    title: '当朝权相',
    desc: '朝中最有权势之人，表面儒雅，内藏锋芒。与你同朝为官——究竟是盟友还是对手？',
    tracks: ['court'],
    events: {
      // 关系值 < 35：政敌阶段
      hostile: [
        {
          scene: '李崇在皇帝面前暗中参了你一本，言辞颇为犀利。你的圣眷受到波及。',
          choices: [
            { text: '忍气吞声，以退为进',  effect: { favor: -8 },          flag: 'patient',  result: '你选择隐忍，李崇的攻势暂时得手，但你的克制也赢得了部分同僚的好感。' },
            { text: '立即反击，以牙还牙',  effect: { favor: -5, power: -8 }, flag: 'factioner', result: '你当场还击，两人公开交锋，伤敌八百自损一千，但你的强硬让政敌忌惮了几分。' }
          ]
        },
        {
          scene: '李崇借科举舞弊案，暗中牵连你的门生，试图瓦解你的根基。',
          choices: [
            { text: '出手护住门生，正面应对', effect: { gold: -20, power: 8 }, flag: 'loyal',    result: '你以自身政治资本护住了门生，代价不小，但门生们从此对你死心塌地。' },
            { text: '壁上观，不牵连自身',      effect: { favor: 5, power: -10 }, flag: 'patient', result: '你选择暂时置身事外，门生受了些委屈，但你因此保住了与皇帝的关系。' }
          ]
        }
      ],
      // 关系值 35-65：普通相处
      neutral: [
        {
          scene: '李崇私下派人送来一封密信，邀你在府中一叙，言辞暧昧。',
          choices: [
            { text: '赴约，探探他的底细', effect: { power: 12 },            flag: 'factioner', result: '李崇试探了你的立场，你也摸清了他的一些底牌。关系微妙地往前走了一步。' },
            { text: '婉拒，保持距离',     effect: { favor: 5 },             flag: 'loyal',    result: '你礼貌回绝了李崇的邀约。皇帝似乎知道了此事，对你独立的态度颇为欣慰。' }
          ]
        },
        {
          scene: '朝堂上一项政策引发争议，李崇派人来问你的立场，他希望你公开支持他。',
          choices: [
            { text: '公开支持李崇，顺水推舟', effect: { power: 10, favor: -5 }, flag: 'factioner', result: '你在朝堂上表态支持，政策通过，权柄增加，但皇帝隐约察觉你偏向权相。' },
            { text: '以"请圣裁"规避表态',     effect: { favor: 8 },             flag: 'loyal',    result: '你以圣意为由巧妙中立，皇帝欣赏你的分寸，圣眷微涨，李崇略感不满。' }
          ]
        }
      ],
      // 关系值 >= 65：盟友阶段
      ally: [
        {
          scene: '李崇向你传递了一条重要情报：皇帝有意调整朝中布局，你若提前布置可借此大涨权柄。',
          choices: [
            { text: '按他的建议行事',      effect: { power: 20, favor: -5 }, flag: 'factioner', result: '借助李崇的情报，你抢先布置，权柄大涨——但你和他的利益已深度捆绑。' },
            { text: '上报皇帝，彰显忠诚', effect: { favor: 18 },            flag: 'loyal',    result: '你将此事如实上报皇帝，皇帝对你的忠诚大加赞赏，圣眷显著提升。' }
          ]
        },
        {
          scene: '李崇秘密托你主持一场御史考核，这是罕见的信任。你可以借此安插自己的人。',
          choices: [
            { text: '安插亲信，扩大党羽', effect: { power: 25 },            flag: 'factioner', result: '考核结束，你的亲信顺利入仕，你和李崇的政治同盟愈发稳固，权柄大增。' },
            { text: '秉公考核，不营私舞弊', effect: { favor: 15, power: 8 }, flag: 'loyal',    result: '你公正主持，虽无私人收益，但清名大涨，皇帝事后特别嘉奖了你的公正。' }
          ]
        }
      ]
    }
  },

  // 江湖宗主：侠客路核心 NPC，江湖势力的代表
  master: {
    id: 'master',
    name: '燕无双',
    icon: '🗡️',
    title: '武林宗主',
    desc: '一代武林宗主，行事豪气，恩怨分明。你在江湖中的路，早晚要和他有所交集。',
    tracks: ['hero'],
    events: {
      hostile: [
        {
          scene: '燕无双在江湖中散布消息，称你行事不够光明磊落，你的名望因此受损。',
          choices: [
            { text: '公开挑战，当众对决',  effect: { martial: -10, fame: 15 }, flag: 'brave',     result: '你登门挑战，两人大战三百回合，虽败下阵来，却赢得了江湖人的钦佩。' },
            { text: '以行动证明自己',      effect: { fame: 12, bonds: 8 },    flag: 'righteous', result: '你不理会流言，以一次路见不平拔刀的壮举，让江湖人自己做出判断。' }
          ]
        },
        {
          scene: '燕无双的门下弟子公然刁难你，这是宗主的隐晦施压，还是弟子自作主张？',
          choices: [
            { text: '出手教训，立威江湖', effect: { fame: 10, martial: -5 }, flag: 'brave',     result: '你三两下制住弟子，展示了真实武艺，江湖中人纷纷说你有真本事。' },
            { text: '宽以待之，以德服人', effect: { bonds: 12 },            flag: 'righteous', result: '你非但未还手，还资助了弟子回家。此事传开，江湖人对你的义气刮目相看。' }
          ]
        }
      ],
      neutral: [
        {
          scene: '燕无双托人带话，有意与你切磋武艺，既是考验也是结交之意。',
          choices: [
            { text: '欣然应约，全力以赴',  effect: { martial: 12, fame: 10 }, flag: 'brave',  result: '你们大战一场，燕无双颇为满意，江湖中关注你的人越来越多了。' },
            { text: '谦虚推辞，改日再说',  effect: { bonds: 5 },             flag: 'patient', result: '你婉言推辞，表现出谦逊，燕无双反而对你多了几分好奇。' }
          ]
        },
        {
          scene: '武林大会在即，燕无双捎话问你是否参加——这是与各路豪杰同台的机会。',
          choices: [
            { text: '参加，争取好名次', effect: { fame: 15, gold: -10, martial: -5 }, flag: 'brave',  result: '你参加武林大会，在赛场上拼尽全力，虽有些伤在身，但名望大涨。' },
            { text: '婉拒，静待时机', effect: { martial: 8 },                          flag: 'patient', result: '你选择不参加，用这段时间闭门苦练，武艺精进，等待更好的时机。' }
          ]
        }
      ],
      ally: [
        {
          scene: '燕无双愿意在武林大会上公开为你背书，这将极大提升你的江湖名望。',
          choices: [
            { text: '接受，借助宗主之名',  effect: { fame: 25, bonds: 10 },   flag: 'sworn',     result: '武林大会上，燕无双当众称你为江湖豪杰，你的名望一飞冲天。' },
            { text: '婉拒，名望靠自己挣',  effect: { fame: 12, martial: 8 },  flag: 'lone_hero', result: '你独立自强，凭自己的本事赢得江湖人的钦佩，别有一番风骨。' }
          ]
        },
        {
          scene: '燕无双透露：武林中有一方秘传内功，他愿将心法手抄一份赠你——这是江湖中极罕见的信任。',
          choices: [
            { text: '接受，钻研内功心法', effect: { martial: 30 },           flag: 'sworn',   result: '得到内功心法，你闭门苦修，武艺突飞猛进，已是武林中一流高手。' },
            { text: '婉谢，内力还靠自悟', effect: { bonds: 15, fame: 8 },    flag: 'lone_hero', result: '你婉言谢绝了馈赠，燕无双对你的风骨深感折服，情谊反而更进一步。' }
          ]
        }
      ]
    }
  },

  // 巨贾：富商路核心 NPC，竞争对手兼合作者
  tycoon: {
    id: 'tycoon',
    name: '沈万钧',
    icon: '💰',
    title: '天下首富',
    desc: '当今商界执牛耳者，手握半个天下的商路。你若想成为天下首富，迟早要和他正面交锋。',
    tracks: ['merchant'],
    events: {
      hostile: [
        {
          scene: '沈万钧暗中截断了你的一条商路，商誉和财富都受到波及。',
          choices: [
            { text: '正面抗衡，强行打通', effect: { gold: -20, routes: 1 },      flag: 'cunning',  result: '你强行打通了商路，代价不小，但商业版图守住了。沈万钧对你刮目相看。' },
            { text: '另辟蹊径，开发新路', effect: { gold: -15, routes: 1, prestige: 10 }, flag: 'righteous', result: '你开辟了他意想不到的新商路，商誉因此大涨，让对方措手不及。' }
          ]
        },
        {
          scene: '沈万钧在商会会议上公开质疑你的资质，言辞颇为轻蔑，意在打压你的声势。',
          choices: [
            { text: '当场展示账本，以实力说话', effect: { prestige: 12 },          flag: 'cunning',  result: '你拿出实实在在的账本，商会众人刮目相看，沈万钧也不得不收敛。' },
            { text: '以退为进，低调积蓄',       effect: { wealth: 15, gold: -10 }, flag: 'righteous', result: '你没有争辩，默默离开，转而闷头发展——实力才是最好的回应。' }
          ]
        }
      ],
      neutral: [
        {
          scene: '沈万钧派人来洽谈，有意与你合作开发一条新商路，条件颇为优厚。',
          choices: [
            { text: '接受合作，先壮大再说', effect: { routes: 1, wealth: 20 },   flag: 'cunning',  result: '合作顺利，财富与商路双丰收，和沈万钧的关系也进了一步。' },
            { text: '拒绝，避免被他控制',   effect: { prestige: 15 },            flag: 'righteous', result: '你拒绝了合作，商界称你有骨气，商誉因此提升，但沈万钧对你有了戒心。' }
          ]
        },
        {
          scene: '沈万钧邀你参与一笔海上贸易，高风险高回报。但此事若失败，损失惨重。',
          choices: [
            { text: '入股，追求高回报', effect: { gold: -30, wealth: 50 }, flag: 'cunning',   result: '海贸大获全胜，财富暴涨，你在商界的地位也因为这笔冒险大幅提升。' },
            { text: '婉拒，稳健为主',   effect: { prestige: 10 },          flag: 'righteous', result: '你没有参与冒险，以稳健著称的商誉让更多保守派商人愿意与你合作。' }
          ]
        }
      ],
      ally: [
        {
          scene: '沈万钧公开宣布与你联手，向朝廷申请皇商资质。此举将大大提升你的商誉。',
          choices: [
            { text: '全力推进，谋取皇商', effect: { prestige: 25, wealth: 15 }, flag: 'royal_merchant', result: '联手申请成功，皇商之名加持，你的商业版图一跃进入顶层。' },
            { text: '婉拒皇商，保持独立',  effect: { prestige: 18 },            flag: 'righteous',      result: '你谢绝了皇商资质，以一介自由商人的身份立足，商誉反而因此特立独行。' }
          ]
        },
        {
          scene: '沈万钧悄悄告诉你：他打算隐退，并属意将部分商路交托于你。这是千载难逢的机会。',
          choices: [
            { text: '欣然接手，大展宏图', effect: { routes: 2, wealth: 25 },   flag: 'royal_merchant', result: '你接手了沈万钧转让的商路，商业版图一夜之间扩大了一半，声望大震。' },
            { text: '建议他另寻接班人',   effect: { prestige: 20, gold: -10 }, flag: 'righteous',      result: '你婉言谢绝，举荐了更合适的人选，沈万钧对你的人品大为感动，商誉因此大涨。' }
          ]
        }
      ]
    }
  },

  // 义军将领：造反路核心 NPC，一同起兵的盟友
  general: {
    id: 'general',
    name: '徐长风',
    icon: '⚔️',
    title: '义军将领',
    desc: '与你一同起兵的将领，骁勇善战，却也有自己的野心。盟友还是对手，取决于你们之间的信义。',
    tracks: ['rebel'],
    events: {
      hostile: [
        {
          scene: '徐长风暗中争夺你的将士，试图拉拢你麾下的将校，兵力出现动摇。',
          choices: [
            { text: '直接质问，当面对峙',  effect: { troops: -10, morale: -8 },  flag: 'ruthless', result: '你当面质问，徐长风承认了野心，两人关系公开破裂，但你保住了核心将校。' },
            { text: '以恩义笼络自己的人',  effect: { gold: -15, morale: 15 },    flag: 'righteous', result: '你以恩义稳住了将士之心，徐长风的小动作无功而返，你的民心反而上涨。' }
          ]
        },
        {
          scene: '徐长风向你开口，要求独自指挥下一场攻城，理由是他的兵更熟悉地形。',
          choices: [
            { text: '拒绝，联合指挥',      effect: { morale: 8, troops: -5 },    flag: 'ruthless',  result: '你坚持联合指挥，徐长风不满，但攻城因两军协同更为顺利。' },
            { text: '让他全权指挥，观其成', effect: { territory: 10, morale: -5 }, flag: 'cunning', result: '徐长风攻城大获全胜，得意之下，他对你的戒心反而少了几分。' }
          ]
        }
      ],
      neutral: [
        {
          scene: '徐长风提出联合攻城，愿意分兵协助，但胜利后他要求分得三成地盘。',
          choices: [
            { text: '接受条件，共同攻城',  effect: { territory: 15, morale: 8 }, flag: 'cunning',  result: '联合攻城成功，双方各取所需，徐长风开始真正把你当平等的盟友。' },
            { text: '拒绝，独力攻城',      effect: { territory: 8, troops: -8 },  flag: 'ruthless', result: '你独立作战，胜利来得更艰难，但所有地盘归你独有，实力更为集中。' }
          ]
        },
        {
          scene: '徐长风私下告诉你：他手下有一批精锐骑兵愿意归附于你，但前提是你要给他们的家人妥善安置。',
          choices: [
            { text: '答应安置，纳入麾下', effect: { gold: -20, troops: 20 },   flag: 'cunning',  result: '你兑现承诺，精锐骑兵感恩归附，兵力大增，徐长风对你的信义也深信不疑了。' },
            { text: '婉拒，保持现有格局', effect: { morale: 12 },              flag: 'righteous', result: '你婉拒了这批骑兵，说兵在精不在多。徐长风对你的克制很意外，也很敬佩。' }
          ]
        }
      ],
      ally: [
        {
          scene: '徐长风提议歃血为盟，共推你为盟主，统一义军指挥，共谋大业。',
          choices: [
            { text: '接受盟主之位，统一号令', effect: { territory: 10, morale: 20 }, flag: 'righteous', result: '歃血为盟，义军合流，战力大涨。徐长风从此令行禁止，大业有望。' },
            { text: '推辞盟主，保持独立',      effect: { troops: 15 },              flag: 'lone_hero', result: '你谦让盟主之位，让各路义军自由协作，反而赢得更广泛的支持。' }
          ]
        },
        {
          scene: '徐长风秘密来访，告知你有人在义军中策反，他已暗中查出主谋，愿意协助你除掉此患。',
          choices: [
            { text: '授权他处置，果断清除', effect: { morale: 15, troops: -5 },   flag: 'ruthless',  result: '内患被清除，义军重新凝聚，徐长风的果断让你更信赖他。' },
            { text: '亲自审问，以理服人',   effect: { morale: 20, territory: 5 }, flag: 'righteous', result: '你亲自主持审问，以事实说话，被策反者当众悔过，义军士气反而大振。' }
          ]
        }
      ]
    }
  }
};

// ==================== NPC 行动（每条赛道新增的主动互动行动）====================
const NPC_ACTIONS = {
  court: {
    id: 'visit_minister',
    name: '拜访权相',
    icon: '🎭',
    npcId: 'minister',
    cost: 1,
    desc: '主动拜访李崇，投入精力经营关系。关系值提升后可解锁其关系事件。',
    effect: { gold: -10 },
    npcEffect: 18,   // 关系值+18
    results: [
      '你登门拜访，李崇客气相待，席间试探了彼此的底线，关系又近了一步。',
      '你备了礼物登门，李崇笑纳，言谈间互有试探，关系缓和不少。',
      '一番叙谈，你们各取所需，关系微妙地前进了一步。'
    ]
  },
  rebel: {
    id: 'bond_general',
    name: '结义徐长风',
    icon: '⚔️',
    npcId: 'general',
    cost: 1,
    desc: '主动经营与徐长风的义气，把他真正变成你的盟友。',
    effect: { gold: -10 },
    npcEffect: 18,
    results: [
      '你与徐长风把酒言欢，彼此坦诚了几分，义气又深了一层。',
      '你主动化解了一些嫌隙，徐长风感受到了你的诚意，关系好转。',
      '兄弟间的信义，一次次经营中加深——徐长风开始真正信任你了。'
    ]
  },
  merchant: {
    id: 'meet_tycoon',
    name: '会见沈万钧',
    icon: '💰',
    npcId: 'tycoon',
    cost: 1,
    desc: '主动会见天下首富沈万钧，经营商业关系，伺机合作或竞争。',
    effect: { gold: -12 },
    npcEffect: 18,
    results: [
      '你主动拜访，沈万钧态度不冷不热，但话里话外已经在试探你的实力。',
      '会面顺利，沈万钧对你的商业嗅觉颇为赏识，关系有所改善。',
      '你摸清了沈万钧的部分底牌，双方关系变得更加微妙而有趣。'
    ]
  },
  hero: {
    id: 'seek_master',
    name: '拜访燕无双',
    icon: '🗡️',
    npcId: 'master',
    cost: 1,
    desc: '主动拜访武林宗主燕无双，在江湖中建立自己的人脉关系。',
    effect: { gold: -8 },
    npcEffect: 18,
    results: [
      '你登门拜访，燕无双淡淡看了你一眼，但愿意和你说几句话——这已经是不小的面子。',
      '你言谈之间展现了几分侠义，燕无双对你的印象好了不少。',
      '你和燕无双切磋了几招，他点头称道，江湖关系深了一步。'
    ]
  }
};

// ==================== 通用行动池（全赛道可用）====================
const COMMON_ACTIONS = [
  {
    id: 'wander',
    name: '游历四方',
    icon: '🌐',
    cost: 1,
    desc: '走访各地，增广见闻。小幅提升当前赛道主要资源，并随机获得奇遇。',
    effect: { gold: -8 },
    // 各赛道额外加成（应用主资源）
    trackBonus: { court: { favor: 6 }, rebel: { morale: 6 }, merchant: { prestige: 6 }, hero: { fame: 6 } },
    results: [
      '你走访了数十里的村庄，形形色色的人让你心胸愈加宽广，视野豁然开朗。',
      '旅途中遇到一位老者，几句话点醒了你对时势的困惑，受益良多。',
      '游历途中你观察到别人未曾注意的机会，默默记在心里，留待日后布局。',
      '你走过集市、渡口，切实感受到民间真实的脉络，对前行方向更加清晰。'
    ]
  },
  {
    id: 'study',
    name: '读书增智',
    icon: '📚',
    cost: 1,
    desc: '闭门苦读，沉淀学识。在当前赛道的核心领域获得较大提升。',
    effect: { gold: -5 },
    trackBonus: { court: { favor: 10 }, rebel: { morale: 10 }, merchant: { prestige: 10 }, hero: { martial: 10 } },
    results: [
      '你翻阅大量典籍，对时局有了更清醒的认识，行事愈发从容有据。',
      '枯灯夜读，你在某篇文章中找到了解决当下困境的灵感，豁然开朗。',
      '苦读数日，学识增进，气质也为之一变，旁人见了都多了几分敬意。',
      '书中的智慧让你思路大开，明日的棋局在脑中已初见端倪。'
    ]
  },
  {
    id: 'charity',
    name: '接济百姓',
    icon: '🤲',
    cost: 1,
    desc: '散财济贫，积累民间善誉。仁善之名远播，或在关键时刻影响命运走向。',
    effect: { gold: -20 },
    flag: { benevolent: 1 },
    results: [
      '你在集市边开了施粥摊，百姓感恩戴德，仁善之名渐渐传开。',
      '你出钱资助了一座私塾，让贫困孩童也能读书，美名远播乡里。',
      '你散尽些积蓄救助流民，此举虽让你暂时拮据，但义名已立。',
      '你捐资修缮了一段被洪水冲毁的堤坝，百姓无不称颂。'
    ]
  },
  {
    id: 'scout',
    name: '打探消息',
    icon: '🕵️',
    cost: 1,
    desc: '广布耳目，洞悉时局。下回合被动危机事件的触发概率降低五成。',
    effect: { gold: -8 },
    flag: { informed: 1 },
    results: [
      '你花钱雇了几名消息灵通的探子，朝野间的动向尽在掌握之中。',
      '你主动打探对手的近况，提前掌握其意图，心中有了底气。',
      '通过几个渠道，你了解到近期时局的微妙变化，及时调整了部署。',
      '情报即命脉——你花些代价，换来了关键时机的主动权。'
    ]
  },
  {
    id: 'rest',
    name: '休养生息',
    icon: '🌿',
    cost: 1,
    desc: '暂时退出争斗，安心积攒财力。虽无争进，但厚积薄发，来日方长。',
    effect: { gold: 22, vitality: 20 },
    results: [
      '你推掉了所有应酬，在宅中闭门思考，待积累了足够底气再出山。',
      '这段时间你刻意保持低调，专心理财，财力悄然丰厚了许多。',
      '有时候不动才是最好的动——静观时局，养精蓄锐，时机自会到来。',
      '你用这段时日梳理了手中的资源，将各处打点妥当，等待下一次发力。'
    ]
  }
];

// ==================== 被动事件池 ====================


const PASSIVE_EVENTS = {
  court: [
    {
      text: '政敌在背后散布谣言，你的名声受到冲击，如何应对？',
      choices: [
        { desc: '花银子上下打点，把风声压下去', effect: { gold: -18, favor: 8 } },
        { desc: '公开揭发，正面交锋', effect: { power: 12, favor: -10 } }
      ]
    },
    {
      text: '一位官员递来请帖，有意与你深交，你该如何回应？',
      choices: [
        { desc: '热情回应，广结善缘', effect: { power: 12, gold: -10 } },
        { desc: '婉拒，独善其身', effect: { favor: 8, power: -5 } }
      ]
    },
    {
      text: '边境告急，朝廷紧急筹款，你如何表态？',
      choices: [
        { desc: '主动慷慨解囊，忠心表态', effect: { gold: -22, favor: 14 } },
        { desc: '观望推诿，明哲保身', effect: { favor: -8, gold: 5 } }
      ]
    },
    {
      text: '皇帝情绪不佳，朝中气氛压抑，你如何化解？',
      choices: [
        { desc: '主动进言，献策解忧', effect: { favor: 15, power: -8 } },
        { desc: '沉默观望，保留权柄', effect: { power: 6, favor: -8 } }
      ]
    },
    {
      text: '宫廷宴会，你受邀出席，如何行事？',
      choices: [
        { desc: '广交权贵，热络周旋', effect: { gold: -12, power: 10, favor: 5 } },
        { desc: '低调出席，避免树大招风', effect: { favor: 8, power: -4 } }
      ]
    }
  ],
  rebel: [
    {
      text: '一批溃军千里来投，是否全部收编？',
      choices: [
        { desc: '全部收编，扩充兵力', effect: { troops: 20, gold: -12, morale: -8 } },
        { desc: '精选良才，其余遣散', effect: { troops: 8, morale: 6 } }
      ]
    },
    {
      text: '一场时疫在军中蔓延，如何处置？',
      choices: [
        { desc: '花粮草大力救治，稳定军心', effect: { gold: -18, troops: -3, morale: 12 } },
        { desc: '隔离减损，保全主力', effect: { troops: -15, morale: -10 } }
      ]
    },
    {
      text: '当地豪绅愿意献粮归顺，但要求保留部分自治，如何决定？',
      choices: [
        { desc: '接受条件，先得物资再说', effect: { gold: 22, morale: 5, territory: -4 } },
        { desc: '拒绝，坚守主权原则', effect: { territory: 5, morale: 8 } }
      ]
    },
    {
      text: '大旱之年，流民四处逃荒涌来，如何应对？',
      choices: [
        { desc: '开仓赈灾，广收民心', effect: { gold: -22, morale: 18 } },
        { desc: '趁机扩充兵源，壮大队伍', effect: { troops: 18, gold: -8, morale: -5 } }
      ]
    },
    {
      text: '朝廷使节到访，暗示若归降可保留兵权，如何回应？',
      choices: [
        { desc: '假意周旋，刺探消息', effect: { territory: 5, morale: 5 } },
        { desc: '断然拒绝，鼓舞士气', effect: { morale: 15, troops: 5, territory: -3 } }
      ]
    }
  ],
  merchant: [
    {
      text: '一批货物滞销，大量资金被占压，如何处理？',
      choices: [
        { desc: '忍痛低价出售，回笼现金', effect: { wealth: -15, gold: 12 } },
        { desc: '继续持有，等待行情好转', effect: { gold: -8, prestige: 5 } }
      ]
    },
    {
      text: '一位官员公然索贿，否则将刁难你的生意，如何应对？',
      choices: [
        { desc: '如数奉上，买个平安', effect: { gold: -20, prestige: 8 } },
        { desc: '拒绝行贿，公开抗议', effect: { prestige: -10, wealth: 6 } }
      ]
    },
    {
      text: '同行联合排挤，邀你加入他们的价格联盟，如何决定？',
      choices: [
        { desc: '加入联盟，合作共赢', effect: { wealth: 10, routes: 1, gold: -12 } },
        { desc: '拒绝，独走差异化路线', effect: { prestige: 10, wealth: -8 } }
      ]
    },
    {
      text: '市场突然出现商机，需要快速决断投入多少资金？',
      choices: [
        { desc: '倾囊押注，全力投入', effect: { gold: -20, wealth: 35 } },
        { desc: '谨慎试水，小额跟进', effect: { gold: -8, wealth: 15, prestige: 5 } }
      ]
    },
    {
      text: '有消费者公开举报你的商品质量有问题，如何应对？',
      choices: [
        { desc: '主动赔偿，诚信经营', effect: { gold: -15, prestige: 15, wealth: -8 } },
        { desc: '私下压制，秘密处理', effect: { gold: -6, prestige: -12, wealth: 5 } }
      ]
    }
  ],
  hero: [
    {
      text: '江湖中有名号的高手找上门公开叫阵，如何回应？',
      choices: [
        { desc: '应战，全力一搏', effect: { martial: 12, fame: 10 } },
        { desc: '以和为贵，礼让对方', effect: { fame: 5, martial: -5 } }
      ]
    },
    {
      text: '一队遭劫的旅行商人向你求救，你该如何？',
      choices: [
        { desc: '出手相助，护送至安全地带', effect: { fame: 12, bonds: 8, gold: 8 } },
        { desc: '避开纠纷，绕道而行', effect: { gold: 5, martial: 3, fame: -10 } }
      ]
    },
    {
      text: '一位武学前辈提出愿意指点你，但需驻留修炼数日，如何决定？',
      choices: [
        { desc: '虚心拜师，深居苦练', effect: { martial: 18, fame: -8, gold: -8 } },
        { desc: '感谢婉拒，继续行侠', effect: { fame: 10, martial: 5 } }
      ]
    },
    {
      text: '有人要把你的事迹刻书立传，广为流传，你是否配合？',
      choices: [
        { desc: '接受采访，配合宣传', effect: { fame: 18, gold: -5 } },
        { desc: '低调拒绝，不愿张扬', effect: { martial: 5, bonds: 8, fame: -5 } }
      ]
    },
    {
      text: '突遇大雨，被困山中无法出行，如何度过这段时光？',
      choices: [
        { desc: '闭关苦练，磨砺武艺', effect: { martial: 15, fame: -5, gold: -5 } },
        { desc: '与当地人交流，结交朋友', effect: { bonds: 10, gold: -8, fame: 8 } }
      ]
    }
  ]
};

// ==================== 世界记忆事件（条件性被动事件，玩家行为被世界记住并反馈） ====================
// 这些事件在满足条件时被动态加入被动事件池，行为积累越深被抽到的概率越高（可重复加入池）。
const WORLD_EVENTS = {
  court: [
    // 贪腐路：声名外泄
    { cond: (f) => (f.extort_used || 0) >= 3,
      text: '你搜刮的名声已传到御史房，有人递上一份弹劾稿，只是暂未呈递——圣眷悄悄下滑。',
      effect: { favor: -15 } },
    { cond: (f) => (f.extort_used || 0) >= 3,
      text: '民间开始流传关于你的议论，皇帝身边的人也有所耳闻，圣眷受损。',
      effect: { favor: -12 } },
    { cond: (f) => (f.corrupt || 0) >= 2,
      text: '你受贿的消息在小范围内流传，有人暗中盯你的账目——御史尚未动手，但已在等机会，圣眷微损。',
      effect: { favor: -10 } },
    // 忠臣路：好名声积累带来回报
    { cond: (f) => (f.loyal || 0) >= 3,
      text: '你的忠正之名传遍同僚之间，有清流文人撰文称颂，皇帝亦有所耳闻，圣眷微涨。',
      effect: { favor: 12 } },
    { cond: (f) => (f.loyal || 0) >= 3,
      text: '你的忠名使几位寒门同僚主动与你亲近，权柄网络悄悄扩展。',
      effect: { power: 8 } },
    { cond: (f) => (f.diligent_used || 0) >= 3,
      text: '你勤勉的口碑积累日久，有下属自发为你效力，差事愈发顺手，权柄微涨。',
      effect: { power: 8 } },
    // 铁面路：民心所向
    { cond: (f) => (f.judge || 0) >= 2,
      text: '"铁面大人"的名字令民间叫好，百姓的称颂声隐隐传入宫中，皇帝龙颜微展，圣眷微涨。',
      effect: { favor: 10 } },
    // 结党路：派系回报
    { cond: (f) => (f.factioner || 0) >= 2,
      text: '宰相一派越发视你为心腹，私下送来礼物表示赏识——权柄微涨，但打点自然要消耗些钱财。',
      effect: { power: 10, gold: -8 } }
  ],
  rebel: [
    // 义名高涨：民心积累
    { cond: (f) => (f.righteous || 0) >= 3,
      text: '百姓自发为义军编了一首歌谣，在十里八乡广为传唱，民心大振。',
      effect: { morale: 15 } },
    { cond: (f) => (f.righteous || 0) >= 3,
      text: '仁义之名已传到朝廷控制区，有流民冒险越境来投，带来了额外的兵源。',
      effect: { troops: 10, gold: -8 } },
    // 铁腕路：将心离散
    { cond: (f) => (f.ruthless || 0) >= 2,
      text: '军中传言你的铁腕使几位老将心存疑虑，暗中观望——士气稍受影响。',
      effect: { morale: -10 } },
    // 狡计路：主动权增加
    { cond: (f) => (f.cunning || 0) >= 2,
      text: '你的谋略已让朝廷情报混乱，难以预判你的行动——这为你赢得了一分主动权，地盘稳固。',
      effect: { territory: 3, gold: 5 } }
  ],
  merchant: [
    // 清誉路：口碑带客
    { cond: (f) => (f.righteous || 0) >= 2,
      text: '你的清白名声在商界越传越广，一位老主顾主动带来三位新客户，财富与商誉双涨。',
      effect: { wealth: 15, prestige: 8 } },
    // 精明路：双刃效应
    { cond: (f) => (f.cunning || 0) >= 2,
      text: '你的精明在商圈已是公开秘密，有人专程来向你讨教，但也有人开始提防你，商誉有所影响。',
      effect: { wealth: 12, prestige: -6 } },
    // 皇商路：背书效应
    { cond: (f) => (f.royal_merchant || 0) >= 1,
      text: '皇商身份带来的信誉效应发酵，一批大额订单不请自来，财富可观增长。',
      effect: { wealth: 20 } }
  ],
  hero: [
    // 英勇路：高手来访
    { cond: (f) => (f.brave || 0) >= 2,
      text: '你勇武善战的名声令一位落魄高手主动投帖拜访，切磋之后武艺微进，名望也涨了些。',
      effect: { martial: 10, fame: 12 } },
    // 义结金兰路：兄弟援助
    { cond: (f) => (f.sworn || 0) >= 1,
      text: '结义兄弟在远方听到你的近况，专程托人送来盘缠，恩义网络的价值此刻体现出来了。',
      effect: { gold: 15, bonds: 5 } },
    // 仁义路：名望积累
    { cond: (f) => (f.righteous || 0) >= 2,
      text: '曾受过你恩惠的人家在远方提起你的名字，江湖上的陌生人开始对你投以敬意，名望悄悄上升。',
      effect: { fame: 15 } },
    // 孤侠路：因孤而悟
    { cond: (f) => (f.lone_hero || 0) >= 1,
      text: '你孤身行走江湖的姿态令人向往，有人专来切磋，这次倒让你悟出了些门道。',
      effect: { martial: 12, fame: 8 } }
  ]
};

// ==================== 路线专属危机事件（第 10-14 回合随机触发，仅触发一次） ====================
// 危机事件是每条路线唯一的中期考验，flag 积累足够时可化险为夷，否则重创资源。
// 触发机制：round∈[10,14] 且尚未触发，每回合有 40% 概率触发。

const CRISIS_EVENTS = {
  court: {
    id: 'crisis_court',
    title: '太后党逼宫',
    scene: '太后一党借边境战败之机，在朝堂上公然发难，要求彻查军机。消息传来，矛头隐约指向你——有人要拿你当弃子。',
    choices: [
      { text: '联合清流，在朝会上正面揭发太后党结党营私', effect: { favor: -15, power: 20 }, flagSet: { judge: 1 }, result: '你挺身而出，证据确凿。皇帝虽震怒于此等党争，却也因此看清了你的立场，圣眷小降，权柄大涨。' },
      { text: '悄然隐退，以退为进，静待时局变化', effect: { favor: -30, power: -10 }, result: '你选择隐忍，却被太后党视为软弱。你的沉默被解读为默许，圣眷大损，权柄亦缩。' }
    ],
    condScene: [
      {
        cond: (f) => (f.loyal || 0) >= 2,
        scene: '太后一党借边境战败之机在朝堂发难，矛头指向你。然而你的忠直之名已传遍朝野，有三位清流大臣主动登门："大人，我等愿联名上疏，共抗奸党。"',
        choices: [
          { text: '联手清流，以充分证据当庭揭发，让太后党颜面扫地', effect: { favor: 10, power: 25 }, flagSet: { judge: 1 }, result: '清流联盟发力，证据确凿，太后党当庭语塞。皇帝大悦，你的忠名更上一层楼，圣眷、权柄双涨。' },
          { text: '接受支持，但留一手：先观察局势再决定是否动手', effect: { favor: -5, power: 15 }, result: '你稳健周旋，局势略微有利，损失有限。但部分盟友因你迟疑而寒心，权柄增幅减半。' }
        ]
      }
    ],
    condEffect: [
      {
        cond: (f) => (f.judge || 0) >= 1,
        idx: 0,
        effectBonus: { favor: 15, power: 10 },
        resultSuffix: '你此前的断案声誉为你提供了有力背书，局势更加有利。'
      }
    ]
  },
  rebel: {
    id: 'crisis_rebel',
    title: '粮道断绝',
    scene: '朝廷派出精锐截断你的粮道，前线将士已断炊三日。军心浮动，副将私下来报：有两个营已在议论撤退。',
    choices: [
      { text: '亲自突围，以少量精兵强行打通粮道', effect: { troops: -15, morale: 15, territory: 5 }, flagSet: { righteous: 1 }, result: '你身先士卒，以死相拼打通粮道。伤亡不轻，但全军士气因此振奋，民心亦因你的勇气而稳固。' },
      { text: '强征附近村庄粮食，以铁腕稳住军心', effect: { troops: 5, morale: -20, gold: 20 }, flagSet: { ruthless: 1 }, result: '粮食到手，军队暂稳。但强征之举令百姓怨声载道，民心大损，义军的旗号蒙上了阴影。' }
    ],
    condScene: [
      {
        cond: (f) => (f.righteous || 0) >= 2,
        scene: '朝廷截断粮道。然而你此前的仁义之名已深入人心——附近三个县的百姓自发组织，带着粮食主动前来："将军一向厚待百姓，如今轮到我们了。"',
        choices: [
          { text: '接受百姓援助，立誓还清军债，并写下约书', effect: { troops: 10, morale: 20, gold: 10 }, flagSet: { righteous: 1 }, result: '军民一心，危机转机。你的仁义之名传遍周边数县，更多百姓愿意投奔义军。' },
          { text: '接受援助，同时趁机征召青壮入伍', effect: { troops: 20, morale: 10, gold: 5 }, flagSet: { righteous: 1 }, result: '粮荒解除，兵力补充。一举两得，但部分村民觉得被迫，民心略有波动。' }
        ]
      }
    ],
    condEffect: [
      {
        cond: (f) => (f.relief_used || 0) >= 2,
        idx: 0,
        effectBonus: { morale: 15, troops: 5 },
        resultSuffix: '你此前的赈济之举积累了民望，士兵们主动要求跟你一起突围，伤亡更小。'
      }
    ]
  },
  merchant: {
    id: 'crisis_merchant',
    title: '朝廷抄查令',
    scene: '地方官员奉旨彻查"囤积居奇"，你的几处货仓被列入名单。账目清点之下，一旦坐实，财富将被没收过半，商路尽毁。',
    choices: [
      { text: '紧急打点官员，用重金私下摆平此事', effect: { wealth: -25, prestige: -10, routes: 1 }, result: '银子递出去，账目神奇"对上了"。危机消除，但此举让你在官场中留下了行贿的印象，商誉受损。' },
      { text: '主动配合彻查，公开账目，以清白示人', effect: { wealth: -15, prestige: 15 }, flagSet: { righteous: 1 }, result: '账目清白，官员无从发难。你的坦然令商界同行刮目相看，商誉反而因此提升。' }
    ],
    condScene: [
      {
        cond: (f) => (f.righteous || 0) >= 1 || (f.prestige || 0) >= 40,
        scene: '朝廷抄查令下达。然而你此前善名在外，几位与你有往来的官员主动为你说话，查账官员登门时态度客气："听闻您向来童叟无欺，想必账目定然清白。"',
        choices: [
          { text: '配合查账，顺势展示账本中的慈善捐助记录', effect: { wealth: -5, prestige: 20, routes: 1 }, flagSet: { righteous: 1 }, result: '账目清白有加，慈善捐助更令查账官员叹服。你不仅全身而退，商誉还因此大涨。' },
          { text: '以清白之名换取官员支持，趁机拓展一条官府渠道', effect: { wealth: -8, prestige: 15, routes: 2 }, result: '你借势而为，化危机为商机。官府渠道打通，商路扩展迅速，实属意外收获。' }
        ]
      }
    ],
    condEffect: [
      {
        cond: (f) => (f.righteous || 0) >= 2,
        idx: 1,
        effectBonus: { prestige: 10, wealth: 8 },
        resultSuffix: '你多次仁义之举积累的口碑在此刻发酵，商界盛赞你的光明磊落。'
      }
    ]
  },
  hero: {
    id: 'crisis_hero',
    title: '江湖追杀令',
    scene: '你得罪的一个帮派联合另外两家，悬赏三百两白银缉拿你的人头。各处客栈和镖局都贴出了画像，眼下四面楚歌。',
    choices: [
      { text: '主动出击，独闯帮主巢穴，以武力震慑三帮', effect: { martial: -10, fame: 25, gold: -15 }, flagSet: { brave: 1 }, result: '你以少胜多，血战之后三帮折损惨重。此战之名传遍江湖，悬赏自动撤销，名望大涨，但耗尽了积蓄。' },
      { text: '乔装改扮，悄然离开此地，另寻落脚点', effect: { gold: -5, fame: -15 }, result: '你保全了自身，但逃跑的消息难以掩盖，江湖上开始有人议论你的"怯懦"，名望受损。' }
    ],
    condScene: [
      {
        cond: (f) => (f.sworn || 0) >= 1,
        scene: '三帮联合悬赏缉拿你。就在你苦思对策时，门外来了一队人马——是你的结义兄弟，带着粮草和刀兵："大哥，义字当头，我们不会让你一人独战。"',
        choices: [
          { text: '与结义兄弟并肩而战，主动迎击三帮，以兄弟义气震慑江湖', effect: { martial: 5, fame: 30, bonds: 15 }, flagSet: { brave: 1 }, result: '兄弟并肩，大破三帮。此战被江湖人传为义气佳话，你的名望与恩义双双大涨。' },
          { text: '分兵布局，让兄弟引开一帮，你独战另两帮', effect: { fame: 20, bonds: 10, martial: 5 }, flagSet: { brave: 1 }, result: '智勇双全，三帮皆溃。兄弟情义在生死考验中得到升华，恩义网络更为牢固。' }
        ]
      }
    ],
    condEffect: [
      {
        cond: (f) => (f.brave || 0) >= 1 && (f.righteous || 0) >= 1,
        idx: 0,
        effectBonus: { fame: 15, bonds: 10 },
        resultSuffix: '你此前行侠仗义的名声，让更多江湖人主动前来助阵，围观者皆口耳相传。'
      }
    ]
  }
};

// ==================== 主线剧情事件（官场赛道，带玩家选项） ====================
// 每个事件在指定回合结束后触发，触发一次即标记，不重复。
// choices[i].flagSet 里的值会累加到 state.flags（数值型叠加，布尔型直接设true）

// ==================== 轻量级小事件（填充空白回合） ====================
// 格式与 STORY_EVENTS 相同，但文本更短、效果更轻
const MINOR_EVENTS = {
  court: [
    {
      id: 'court_m1',
      triggerRound: 7,
      title: '同僚试探',
      scene: '你在翰林院偶遇老同僚徐文远，他压低声音道："如今大人虽有圣眷，朝中暗流涌动，倒不如与我等结个善缘，日后互为倚靠。"',
      choices: [
        { text: '与其寒暄，虚以委蛇', effect: { favor: 3 },  result: '朝堂人脉，总有一用。' },
        { text: '淡然回应，不卑不亢', effect: { favor: 1 }, flagSet: { loyal: 1 }, result: '君子坦荡，不与小人为伍。' }
      ]
    },
    {
      id: 'court_m2',
      triggerRound: 17,
      title: '立储风波',
      scene: '皇帝龙体违和，朝中两派各立旗帜：嫡长派主张从礼、贤能派欲扶三皇子。两方使者先后登门，各带重礼，均要你明确站队——此刻沉默，便是罪。',
      choices: [
        { text: '坚守中立，以"宗法正统"为由婉辞两方', effect: { favor: 8, power: -8 }, flagSet: { neutral_faction: 1 }, result: '两派均视你为难以拉拢之人，但皇帝知悉，对你少了几分猜忌。' },
        { text: '旗帜鲜明支持嫡长，表明忠义立场', effect: { power: 14, favor: -5 }, flagSet: { court_faction: 1 }, result: '你的表态让嫡长派大喜，权柄悄然增厚，但三皇子的怒火也在积聚。' }
      ]
    }
  ],
  rebel: [
    {
      id: 'rebel_m1',
      triggerRound: 4,
      title: '兵中流言',
      scene: '队伍中流传着关于你出身的谣言。一名老兵找到你，递上一份名单："这些人在散布闲话，大人，如何处置？"',
      choices: [
        { text: '严惩，以儆效尤', effect: { morale: 5, troops: -5 }, flagSet: { iron_rule: 1 }, result: '雷厉风行，从此无人敢小觑。' },
        { text: '公开辩解，以力服人', effect: { morale: 10 }, result: '你一矢穿七叶，全军为之折服。' }
      ]
    },
    {
      id: 'rebel_m2',
      triggerRound: 7,
      title: '异族来使',
      scene: '北方部族的使者悄然抵营，带来丰厚礼物与结盟提议。谋士皱眉："引狼入室，大人需三思。"',
      choices: [
        { text: '接受结盟，借力打力', effect: { troops: 15, morale: -5 }, result: '铁骑助阵，天下为之侧目。' },
        { text: '婉拒结盟，保持独立', effect: { morale: 6, gold: 8 }, result: '你的拒绝赢得了部下的心，也守住了脊梁。' }
      ]
    },
    {
      id: 'rebel_m3',
      triggerRound: 17,
      title: '天下通缉',
      scene: '朝廷颁布《捉拿逆贼告示》，以十万两白银悬赏你的首级。军营里人心惶惶，连最老实的什长都开始偷偷打听撤路。',
      choices: [
        { text: '公开燃烧告示，慷慨激昂：此战不胜，誓不回头', effect: { morale: 18, gold: -10 }, flagSet: { defiant: 1 }, result: '火光之中，士卒高呼，军心凝聚如铁——背水一战，才是枭雄本色。' },
        { text: '化整为零，秘密转移，另寻根据地', effect: { troops: -5, morale: -8, gold: 15 }, result: '你留得青山，保住了大部分兵马，只是士气低落，重建需要时间。' }
      ]
    }
  ],
  merchant: [
    {
      id: 'merchant_m1',
      triggerRound: 4,
      title: '粮价风波',
      scene: '旱灾谣言导致粮价暴涨，坊间商人纷纷囤积居奇。你的掌柜凑上来说："东家，这可是发财的好时机……"',
      choices: [
        { text: '趁势囤积，大赚一笔', effect: { gold: 25, prestige: -5 }, result: '财帛入囊，却有人在背后指指点点。' },
        { text: '平价出售，积累口碑', effect: { prestige: 8 }, flagSet: { benevolent: 1 }, result: '你的仁义之名，从此传遍市井。' }
      ]
    },
    {
      id: 'merchant_m2',
      triggerRound: 7,
      title: '差役登门',
      scene: '县衙差役笑里藏刀地站在铺前："最近生意不错啊，大人说了，这月的孝敬得多备些。"',
      choices: [
        { text: '忍气吞声，破财消灾', effect: { gold: -20 }, result: '这笔钱买了安稳，但你心中有一团火。' },
        { text: '暗中联络同行，集体抵制', effect: { prestige: 10, gold: -10 }, flagSet: { merchant_guild: 1 }, result: '商会的雏形，在这一天悄然成形。' }
      ]
    },
    {
      id: 'merchant_m3',
      triggerRound: 17,
      title: '钦差入城',
      scene: '朝廷钦差持节入城，明面上巡视民情，实则奉旨彻查账目——有人在背后告了你一状，说你私通海外、偷漏税款。账房先生哆嗦着问："东家，怎么办？"',
      choices: [
        { text: '打点上下，重金疏通，顺利过关', effect: { gold: -30, prestige: 5 }, result: '银子开路，钦差大人最终一笔带过。商誉无损，但家底薄了一圈。' },
        { text: '坦然摊开账本，据理力争清白', effect: { prestige: 18 }, flagSet: { clean_merchant: 1 }, result: '钦差查了三天，无一纰漏，不得不公开澄清。你的商誉由此达到新高。' }
      ]
    }
  ],
  hero: [
    {
      id: 'hero_m1',
      triggerRound: 4,
      title: '擂台帖子',
      scene: '一张金色擂台帖送到你手中，某大侠以武会友，邀天下好汉共聚。赴会，还是潜心苦练？',
      choices: [
        { text: '赴擂，一展身手', effect: { martial: 8, fame: 6 }, result: '你的身影出现在擂台，江湖又多了一段传说。' },
        { text: '婉拒，闭关苦练', effect: { martial: 14 }, result: '一月苦练，自此小有所成。' }
      ]
    },
    {
      id: 'hero_m2',
      triggerRound: 7,
      title: '冤案求援',
      scene: '一名少年跪倒在你面前，声称其师父被恶霸诬陷入狱，求你仗义出手。此事棘手，且风险不小。',
      choices: [
        { text: '拔刀相助，替人申冤', effect: { fame: 10, gold: -15 }, flagSet: { righteous: 1 }, result: '江湖皆知，你是那个有求必应的人。' },
        { text: '力有不逮，赠银送行', effect: { gold: -10, fame: 3 }, result: '力所不及，但你赠银相助，算是尽了心。' }
      ]
    },
    {
      id: 'hero_m3',
      triggerRound: 17,
      title: '名剑之约',
      scene: '一封红底白字的战书从千里之外送达："久闻阁下之名，某不才，愿以剑论高下。若你不来，天下人便知——你的名望，不过是欺世盗名。"落款：剑宗掌门，顾空行。',
      choices: [
        { text: '慨然赴约，生死相见', effect: { fame: 18, martial: -5, gold: -10 }, flagSet: { champion: 1 }, result: '一场恶战，你以微弱劣势险胜，但从此"已登绝顶"之名天下皆知，后无来者。' },
        { text: '公开回信：以武压人非江湖正道，以理化解恩怨', effect: { fame: 10 }, flagSet: { righteous: 1 }, result: '江湖人称你"侠义无双"——真正的强者，从不以刀兵证明自己。' }
      ]
    }
  ]
};

// ==================== 战役事件（手动战斗，3轮策略选择） ====================
// 格式：type:'battle'，通过 getBattleEvent() 检测触发条件，优先级高于普通故事事件
const BATTLE_EVENTS = {
  court: [
    {
      id: 'battle_court_1',
      type: 'battle',
      title: '朝堂弹劾',
      flavor: '政敌联合十余名朝官联名上奏，弹劾你结党营私。圣上将折子摔在你面前："卿可有话说？"朝堂一片寂静，此战只能赢，不能输！',
      cond: (f, r, n, round) => round >= 9 && (r.prestige || r.favor || 0) >= 40,
      enemyName: '权臣派系',
      enemyHp: 65,
      playerHp: 80,
      maxRounds: 3,
      moves: [
        { label: '正面上奏', emoji: '📜', desc: '铁证如山，直接反驳政敌罪行，高风险高收益。', pDmg: [15, 25], eDmg: [18, 28] },
        { label: '拉拢中立', emoji: '🤝', desc: '说服骑墙派官员联合声援，稳中求胜。', pDmg: [10, 18], eDmg: [10, 18] },
        { label: '韬光养晦', emoji: '🧘', desc: '暂且认错示弱，积蓄后发之力。', pDmg: [3, 9], eDmg: [5, 11] }
      ],
      winEffect: { prestige: 15, wisdom: 8 },
      loseEffect: { prestige: -12, gold: -10 },
      winStory: '折子雪片飞来，政敌反被查出私吞军饷！圣上龙颜大悦，当众褒奖——此番朝堂之争，你大获全胜。',
      loseStory: '局势对你不利，圣上虽未降罪，却当众训斥，颜面大损，需重振朝中声望。'
    },
    {
      id: 'battle_court_2',
      type: 'battle',
      title: '储位博弈',
      flavor: '两位皇子暗中争嫡，双方都来拉拢你——而最终你必须在朝堂上表明立场，错押宝则万劫不复。',
      cond: (f, r, n, round) => round >= 15 && (r.prestige || r.favor || 0) >= 60,
      enemyName: '对立皇子派',
      enemyHp: 80,
      playerHp: 85,
      maxRounds: 3,
      moves: [
        { label: '陈情请命', emoji: '👑', desc: '直接向圣上陈言，力挺己方皇子，风险极高。', pDmg: [18, 28], eDmg: [20, 30] },
        { label: '结盟朝臣', emoji: '🏛️', desc: '与重臣联合呼吁，借势压人。', pDmg: [12, 20], eDmg: [12, 20] },
        { label: '明哲保身', emoji: '🛡️', desc: '托病不上朝，静观其变。', pDmg: [4, 10], eDmg: [6, 12] }
      ],
      winEffect: { prestige: 20, favor: 15 },
      loseEffect: { prestige: -20, favor: -10 },
      winStory: '皇子顺利入主东宫，你居功至伟——新储位感激涕零，圣上亦对你另眼相看，前途一片光明。',
      loseStory: '站错阵营，政敌趁机打压，圣上颜面尽失，你的朝中地位大受挫伤。'
    }
  ],
  rebel: [
    {
      id: 'battle_rebel_1',
      type: 'battle',
      title: '攻城之战',
      flavor: '一座险关横亘眼前，守将悬旗示威——"此城固若金汤，叛军速速退去！"麾下将士目光炯炯，等你一声令下。',
      cond: (f, r, n, round) => round >= 8 && (r.territory || 0) >= 35,
      enemyName: '守关将领',
      enemyHp: 70,
      playerHp: 80,
      maxRounds: 3,
      moves: [
        { label: '正面强攻', emoji: '⚔️', desc: '全军压上，不计伤亡，猛攻城门。', pDmg: [15, 26], eDmg: [18, 28] },
        { label: '奇袭侧翼', emoji: '🏹', desc: '精锐小队绕后突入，出奇制胜。', pDmg: [12, 22], eDmg: [10, 18] },
        { label: '围城耗敌', emoji: '🏕️', desc: '切断粮道，围而不攻，以逸待劳。', pDmg: [5, 12], eDmg: [6, 12] }
      ],
      winEffect: { territory: 15, morale: 8 },
      loseEffect: { morale: -12, gold: -10 },
      winStory: '旌旗猎猎，城门轰然洞开！此战大胜，三军振奋，地盘又拓一城，声望响彻四方。',
      loseStory: '守将顽抗，攻城折戟。三军伤亡惨重，士气大挫，需重整旗鼓再战。'
    },
    {
      id: 'battle_rebel_2',
      type: 'battle',
      title: '决战中原',
      flavor: '朝廷终于调集大军决战——对方主帅旗帜高张，十万铁甲压境。生死存亡，就在此一役！',
      cond: (f, r, n, round) => round >= 14 && (r.territory || 0) >= 55,
      enemyName: '朝廷大军',
      enemyHp: 90,
      playerHp: 90,
      maxRounds: 3,
      moves: [
        { label: '中军突破', emoji: '⚔️', desc: '亲率精锐直取主帅，险中求胜。', pDmg: [18, 30], eDmg: [22, 32] },
        { label: '两翼包抄', emoji: '🏇', desc: '以骑兵迂回断敌退路，稳步压制。', pDmg: [13, 22], eDmg: [14, 22] },
        { label: '坚守壁垒', emoji: '🛡️', desc: '据险固守，消耗敌军锐气。', pDmg: [6, 13], eDmg: [8, 14] }
      ],
      winEffect: { territory: 20, morale: 15 },
      loseEffect: { territory: -10, morale: -15 },
      winStory: '朝廷主帅阵亡，大军溃散！中原已入囊中，天下大势尽归于你。',
      loseStory: '此战惨败，朝廷趁势反扑，数月辛苦付诸东流，形势万分危急。'
    }
  ],
  merchant: [
    {
      id: 'battle_merchant_1',
      type: 'battle',
      title: '商场角力',
      flavor: '最大的竞争对手宣布低价倾销，意图挤垮你的货路。行会的老人们都在看你——输了就意味着出局。',
      cond: (f, r, n, round) => round >= 9 && (r.wealth || 0) >= 40,
      enemyName: '竞争商号',
      enemyHp: 60,
      playerHp: 80,
      maxRounds: 3,
      moves: [
        { label: '价格压制', emoji: '💰', desc: '砸钱低价抢市，消耗对手资金链。', pDmg: [15, 24], eDmg: [18, 26] },
        { label: '联合行会', emoji: '🤝', desc: '借行会之势，联合排挤竞争者。', pDmg: [10, 18], eDmg: [10, 18] },
        { label: '静观其变', emoji: '⚖️', desc: '保守应对，稳住现有货路。', pDmg: [4, 10], eDmg: [5, 11] }
      ],
      winEffect: { wealth: 20, influence: 10 },
      loseEffect: { wealth: -15, gold: -15 },
      winStory: '竞争对手资金链断裂，宣告歇业！你的货路独占鳌头，财源滚滚而来。',
      loseStory: '商战落败，大批货物滞销，不得不低价抛售，元气大伤。'
    },
    {
      id: 'battle_merchant_2',
      type: 'battle',
      title: '垄断之争',
      flavor: '四大商行联手封锁你的货源，扬言三个月内令你关张——这是一场生死之战，绝不能退！',
      cond: (f, r, n, round) => round >= 15 && (r.wealth || 0) >= 65,
      enemyName: '四大商行联盟',
      enemyHp: 85,
      playerHp: 85,
      maxRounds: 3,
      moves: [
        { label: '奇货居奇', emoji: '💎', desc: '独家控制稀缺货源，以奇制胜。', pDmg: [17, 27], eDmg: [20, 30] },
        { label: '分化瓦解', emoji: '🧩', desc: '收买其中最弱的一家，打破联盟。', pDmg: [12, 20], eDmg: [12, 20] },
        { label: '广结善缘', emoji: '🌐', desc: '扩大人脉，寻找新的合作渠道。', pDmg: [5, 12], eDmg: [6, 12] }
      ],
      winEffect: { wealth: 25, influence: 15 },
      loseEffect: { wealth: -20, influence: -8 },
      winStory: '联盟内讧，最终分崩离析！你趁机全面出击，一举垄断了这条最赚钱的货路，富甲一方。',
      loseStory: '四大商行合力压制，你被迫放弃几条重要货路，元气大伤，需重新布局。'
    }
  ],
  hero: [
    {
      id: 'battle_hero_1',
      type: 'battle',
      title: '江湖宿怨',
      flavor: '一名仇家持帖挑战，说你沽名钓誉——"今日江湖当众见个高下，敢来否？"四周已围满观战的江湖人。',
      cond: (f, r, n, round) => round >= 9 && (r.martial || 0) >= 40,
      enemyName: '仇家高手',
      enemyHp: 65,
      playerHp: 80,
      maxRounds: 3,
      moves: [
        { label: '迅猛出击', emoji: '⚡', desc: '以攻代守，先发制人，全力压制。', pDmg: [15, 25], eDmg: [18, 27] },
        { label: '虚实相生', emoji: '🌀', desc: '声东击西，引对方露出破绽后再反击。', pDmg: [11, 20], eDmg: [10, 18] },
        { label: '以守为攻', emoji: '🛡️', desc: '四两拨千斤，等待最佳时机。', pDmg: [4, 10], eDmg: [5, 10] }
      ],
      winEffect: { fame: 12, martial: 8 },
      loseEffect: { fame: -8, martial: -5 },
      winStory: '仇家大败，当众认输，你的武名从此在江湖中广为传颂，再无人敢轻视。',
      loseStory: '此战落败，颜面大损，江湖上议论纷纷，需苦修内功以雪此耻。'
    },
    {
      id: 'battle_hero_2',
      type: 'battle',
      title: '武林大会决战',
      flavor: '武林大会决出最终擂主——对面站着当世第一人，眼神沉静如渊。台下万目睽睽，这一刻，你就是所有人的焦点。',
      cond: (f, r, n, round) => round >= 15 && (r.martial || 0) >= 60,
      enemyName: '武林第一高手',
      enemyHp: 85,
      playerHp: 85,
      maxRounds: 3,
      moves: [
        { label: '全力出击', emoji: '🔥', desc: '倾尽全力，孤注一掷，以最强一击决胜负。', pDmg: [18, 30], eDmg: [22, 32] },
        { label: '化劲借力', emoji: '🌀', desc: '以柔克刚，引对方之力反制。', pDmg: [12, 22], eDmg: [12, 20] },
        { label: '绵里藏针', emoji: '🌸', desc: '看似守势，实则暗积内力，后发制人。', pDmg: [6, 14], eDmg: [7, 13] }
      ],
      winEffect: { fame: 20, martial: 12 },
      loseEffect: { fame: -12, martial: -6 },
      winStory: '高手含笑抱拳，拱手认输——武林大会，你夺得擂主！掌声雷动，名震天下！',
      loseStory: '高手技高一筹，你败下阵来。但败得光明磊落，江湖人仍以礼相待，只是需要更多磨砺。'
    }
  ]
};

const STORY_EVENTS = {
  court: [
    {
      id: 'court_s1',
      triggerRound: 2,
      title: '初入朝堂',
      scene: '入仕不久，吏部侍郎张大人设宴款待新进官员，席间拉着你的手悄悄道："老夫看你是可造之材，日后朝中互相照应，也是好事……"他的眼神意味深长。',
      choices: [
        {
          text: '婉言谢绝，洁身自好',
          result: '你以身体不适婉拒，张侍郎脸色微变，但你心中坦然。你清廉之名渐渐在同僚中传开——这官儿，是个硬骨头。',
          effect: { favor: 15, power: -8 },
          flagSet: { loyal: 1 }
        },
        {
          text: '顺水推舟，先攀关系再说',
          result: '张侍郎大喜，当即引见了数位朝中要员。你的人脉扩大了，但清楚：这些人情，终究是要还的。',
          effect: { power: 20, gold: 10 },
          flagSet: {}
        }
      ]
    },
    {
      id: 'court_s2',
      triggerRound: 4,
      title: '天颜降临',
      scene: '皇帝微服出巡，偶然撞见你在街头处置一起冤案，正义执法。龙目停在你身上，久久未移，随后开口道："你可知朕是谁？"你心中一惊——',
      choices: [
        {
          text: '跪安请圣，直言奏明冤情',
          result: '你不顾一切，将案情据实上奏。皇帝沉默良久，最后颔首："难得，难得。"圣眷大涨，此后皇帝对你多了几分注意。',
          effect: { favor: 28 },
          flagSet: { loyal: 1 }
        },
        {
          text: '谨慎行事，先护皇帝安全',
          result: '你态度恭谨，处处以皇帝安危为先，令圣上感到安心。皇帝虽未明言称赞，内心却记下了这个沉稳的官员。',
          effect: { favor: 15, power: 8 },
          flagSet: {}
        }
      ]
    },
    {
      id: 'court_s3',
      triggerRound: 6,
      title: '结党之邀',
      scene: '午后独自翻阅公文，宰相门下管家悄悄送来一张拜帖，同附一份价值不菲的珍玩——此乃拉拢之意，人人皆知。你握着拜帖，沉默片刻。',
      choices: [
        {
          text: '当场拒绝，原物退还',
          result: '管家悻悻而去，你从此进了宰相的"不顺眼"名单。但清廉之名反令皇帝对你多了几分信任，圣眷缓缓上升。',
          effect: { favor: 12, power: -10 },
          flagSet: { loyal: 1, against_faction: 1 }
        },
        {
          text: '收下帖子，静观其变',
          result: '你暗中与宰相一派搭上线，人脉进一步扩大，权柄渐增。但你也清楚，你已悄悄跨进了另一个世界。',
          effect: { power: 25, favor: -8 },
          flagSet: { factioner: 1 }
        }
      ]
    },
    {
      id: 'court_s4',
      triggerRound: 9,
      title: '御史弹劾',
      scene: '朝会之上，御史言官突然出列，手持奏折，指名道姓弹劾你"结党营私，中饱私囊"。百官侧目，皇帝龙颜不豫，你跪在殿中，冷汗渗出。',
      choices: [
        {
          text: '起身抗辩，逐条驳斥指控',
          result: '你声音清朗，逐一化解指控。皇帝最终雷声大雨点小，你暂时渡过难关，权柄反因此次风波稍有增长。',
          effect: { favor: -5, power: 10 },
          flagSet: {}
        },
        {
          text: '伏地请罪，以退为进',
          result: '你忠贞之态令皇帝无处发火，反生恻隐。你失了几分实力，却保住了圣眷，用退让换来更长远的空间。',
          effect: { favor: 10, power: -15 },
          flagSet: { loyal: 1 }
        }
      ],
      condScene: [
        {
          // 忠臣路（loyal≥2）：皇帝已知你为人，暗中示意——这是考验，也是机会
          cond: (f) => (f.loyal || 0) >= 2,
          scene: '昨夜，太监总管悄悄捎来一句话："圣上知你为人，沉住气。"今日朝会，御史果然出列弹劾。然而皇帝的目光落在你身上时，并非怒色——而是一种等待。他在看你如何应对这场考验。',
          choices: [
            {
              text: '从容抗辩，逐条揭穿弹劾背后的图谋',
              result: '你条分缕析，将幕后主使的用意一一指出。皇帝拍案叫好，弹劾者反被追究。此后你清名与权柄双双攀升，这一局你不仅守住了，还反手将对方压住。',
              effect: { favor: 30, power: 12 },
              flagSet: { loyal: 1, judge: 1 }
            },
            {
              text: '以忠诚之名伏地请罪，让皇帝来裁决',
              result: '你跪地请罪，言辞恳切。皇帝颔首道："你的为人，朕清楚。"弹劾就此不了了之，皇帝对你的信任再度加深。',
              effect: { favor: 20, power: -5 },
              flagSet: { loyal: 1 }
            }
          ]
        },
        {
          // 结党路（factioner≥1）：宰相派人递话，可借助外力，但代价是进一步绑定
          cond: (f) => (f.factioner || 0) >= 1,
          scene: '朝会之前，宰相的亲信找到你，悄悄递来一张纸条："御史今日参你，丞相可以压下去。但——日后有事，还望互相照应。"帘后的博弈，从未停歇过。',
          choices: [
            {
              text: '接受宰相援手，公开站在他这一边',
              result: '宰相当场出声，将弹劾驳得体无完肤。你安然过关，权柄大涨——但皇帝望了你一眼，那目光意味深长。从此你与宰相派的绑定，又深了一层。',
              effect: { power: 32, favor: -12 },
              flagSet: { factioner: 1 }
            },
            {
              text: '拒绝援手，独自当庭应对弹劾',
              result: '你婉拒纸条，当庭抗辩，勉强渡过难关。宰相一派作壁上观，但你保住了难得的独立性，皇帝对你另眼相看。',
              effect: { favor: 8, power: 10 },
              flagSet: {}
            }
          ]
        },
        {
          // 得罪宰相路（against_faction≥1）：宰相主动推波助澜，落井下石
          cond: (f) => (f.against_faction || 0) >= 1,
          scene: '朝会之上，御史出列弹劾你。你注意到——弹劾折子上的字迹，与宰相幕僚的笔迹极为相似。当初你拒绝宰相的示好，今日，他选择了秋后算账。',
          choices: [
            {
              text: '当庭直指宰相在背后操控，置之死地而后生',
              result: '你当庭点名，皇帝脸色微变。证据不足，宰相矢口否认——但你的胆气令皇帝刮目相看，也令宰相将你列入死敌名单。两败俱伤，但你没有退缩。',
              effect: { favor: 15, power: -12 },
              flagSet: { against_faction: 1, judge: 1 }
            },
            {
              text: '暗忍不发，百般抵辩，先撑过此关再说',
              result: '你百般周旋，仍被扒去半阶官职。宰相冷冷旁观，得偿所愿。你心中清楚：这场博弈，你输了第一局——但还没到终局。',
              effect: { favor: -10, power: -8 },
              flagSet: {}
            }
          ]
        }
      ]
    },
    {
      id: 'court_s4b',
      triggerRound: 10,
      title: '储君密议',
      scene: '皇帝近来龙体欠安，朝中关于皇储的议论甚嚣尘上。大皇子儒雅宽仁，与文官集团亲厚；三皇子勇武果决，深得武将拥护。一日，内监悄悄递来两封拜帖——分别来自两位皇子的幕僚，邀你密谈。',
      choices: [
        {
          text: '与大皇子一派接触，暗中示好立储正统',
          result: '你择机与大皇子幕僚低声交谈，措辞谨慎，表明立场。大皇子一派将你记为可信任之人，日后若大皇子登基，你的仕途将有更大空间。',
          effect: { favor: 12, power: 10 },
          flagSet: { prince1: 1 }
        },
        {
          text: '一概推辞，明哲保身，不卷入储君之争',
          result: '你以事务繁忙为由，礼貌地婉拒了两份拜帖。两边都未得罪，但也未结下善缘。皇帝隐约知晓此事，对你的不偏不倚颇有好感。',
          effect: { favor: 10 },
          flagSet: {}
        }
      ],
      condScene: [
        {
          // 忠臣路（loyal>=2）：皇帝私下召见，直接询问你的意见
          cond: (f) => (f.loyal || 0) >= 2,
          scene: '两封拜帖还未来得及处理，皇帝便私下召你入内殿，屏退左右，温言问道："储君之事，朕想听听你的看法。"此刻，才是真正考验你的时刻。',
          choices: [
            {
              text: '委婉表明"立嫡以长"，尊奉礼法',
              result: '你言辞恳切，以礼法为据，表明立场。皇帝沉吟片刻，颔首称赞："果然忠直。"此后你在储君之争中反而超然，圣眷大涨。',
              effect: { favor: 25, power: 5 },
              flagSet: { loyal: 1 }
            },
            {
              text: '以"此乃陛下家事"委婉推辞，让皇帝自决',
              result: '你叩首道："储君乃国之大事，陛下圣明，臣不敢妄议。"皇帝大悦，反觉得你识大体，圣眷更深。',
              effect: { favor: 30 },
              flagSet: { loyal: 1 }
            }
          ]
        }
      ]
    },
    {
      // NPC 突破事件：官场·权相危机（round 11，minister>=40 触发）
      id: 'court_npc_minister_crisis',
      triggerRound: 11,
      title: '权相求援',
      cond: (f, res, npcs) => (npcs.minister || 0) >= 40,
      scene: '一场突如其来的政争让李崇陷入被动——御史台联署弹劾，矛头直指他的心腹，他在朝中的布局岌岌可危。深夜，他的亲信秘密登门，言辞急切："相爷有急事相求，还望大人援手……"这是李崇第一次真正需要你。',
      choices: [
        {
          text: '全力驰援，与他共进退',
          result: '你调动关系为李崇解围，他事后亲自登门致谢，眼中带着真正的感激。此后，你们之间的关系不再只是政治盟约，而多了几分真正的信义——他欠了你一份人情，这在朝堂上，比什么都值钱。',
          effect: { power: 15, favor: -8 },
          flagSet: { factioner: 1 },
          npcSet: { minister: 25 }
        },
        {
          text: '谨慎站队，借机提条件',
          result: '你帮了忙，但事先谈好了条件。李崇对你的精明感到几分敬佩，也有几分戒备——这种人，是最好的盟友，也是最难控制的对手。他答应了你，语气中带着真实的尊重。',
          effect: { power: 8, favor: 5 },
          flagSet: { cunning: 1 },
          npcSet: { minister: 12 }
        }
      ]
    },
    {
      id: 'court_s5b',
      triggerRound: 13,
      title: '朋党倾轧',
      scene: '宰相与兵部尚书两派的明争暗斗已到白热化。你同时收到两封密信——宰相请你上书参劾兵部"贪腐误国"，兵部尚书请你为他向皇帝美言。两边都是朝中重臣，此事再不表态，两边都将视你为敌。',
      choices: [
        {
          text: '选择宰相一派，联署参劾兵部',
          result: '你的奏折递上，宰相一派当即拍手称道。兵部尚书对你恨之入骨，但宰相的庇护让你权力有所增长。你清楚，这条路走下去，你已深陷党争。',
          effect: { power: 22, favor: -10 },
          flagSet: { factioner: 1 }
        },
        {
          text: '拒绝双方，直接向皇帝禀报两方压迫之事',
          result: '你冒险直谏，将两封密信原样呈交皇帝，陈明利害。皇帝雷霆震怒，两派暂时收敛，你以铁骨直臣之名在朝野一时声望大振——但从此也成了两派共同的眼中钉。',
          effect: { favor: 22, power: -8 },
          flagSet: { loyal: 1, judge: 1 }
        }
      ],
      condScene: [
        {
          // 结党路（factioner>=1）：宰相借此彻底拉你入伙，暗中给你一份"黑料"
          cond: (f) => (f.factioner || 0) >= 1,
          scene: '宰相的使者深夜登门，带来密信和一个沉甸甸的锦盒。信中说：盒内是兵部尚书的受贿证据，只要你公开发难，宰相保你此后飞黄腾达。你打开锦盒，字字属实——但你也注意到，那使者的神情，有几分像是掌握着你的什么把柄。',
          choices: [
            {
              text: '联手宰相，以证据正面弹劾兵部',
              result: '奏折一出，兵部尚书哑口无言。宰相在朝堂上为你背书，你的权柄迅速攀升——但皇帝望向你的目光里，多了一丝警惕。你成为宰相手中最锋利的一把刀，也成为他最难甩掉的把柄。',
              effect: { power: 35, favor: -15 },
              flagSet: { factioner: 1 }
            },
            {
              text: '收下证据，但拒绝被宰相驱使，另行处置',
              result: '你婉拒宰相的驱使，将证据单独呈交皇帝，不替任何一派说话。此举令宰相有些尴尬，皇帝却对你刮目相看，两者之间你走出了第三条路。',
              effect: { favor: 18, power: 8 },
              flagSet: { loyal: 1, judge: 1 }
            }
          ]
        },
        {
          // 忠臣路（loyal>=2）：皇帝已暗中知情，主动给你支持
          cond: (f) => (f.loyal || 0) >= 2,
          scene: '就在你为两封密信左右为难之际，贴身太监悄悄传来一句话："圣上说，若有人拿着这种信来找你，如实禀告就是。"皇帝早就在观察这场角力，而你，是他选定的见证者。',
          choices: [
            {
              text: '径直将两封密信呈交皇帝，不添一字',
              result: '皇帝展信细阅，沉默半晌，缓缓说："你可信任。"两派被敲打，皇帝对你的倚重更进一步，朝堂上下无人再敢轻易向你施压。',
              effect: { favor: 30, power: 10 },
              flagSet: { loyal: 1 }
            },
            {
              text: '借皇帝信任，顺水推舟为自己谋取更多资源',
              result: '你呈信的同时，稍稍加了几句有利于自身的陈述。皇帝信以为真，额外嘉许了你——但心中某条界线，你悄悄跨过去了。',
              effect: { favor: 15, power: 18 },
              flagSet: { corrupt: 1 }
            }
          ]
        }
      ]
    },
    {
      id: 'court_s5',
      triggerRound: 12,
      title: '大案钦差',
      scene: '皇帝钦点你担任钦差，彻查一宗牵连甚广的贪腐大案。案审到一半，涉案官员家属悄然送来一箱金银，家仆跪地低语："大人，通融则两全……"',
      choices: [
        {
          text: '原封退还，铁面执法到底',
          result: '皇帝大悦，当庭嘉奖，你以"铁面钦差"之名震动朝野。此案办毕，圣眷达到前所未有的高度。',
          effect: { favor: 30, power: 10 },
          flagSet: { judge: 1, loyal: 1 }
        },
        {
          text: '悄然收下，案子处理得圆滑',
          result: '金子入手，案子也办得四面周全。此事无人知晓，但你心里清楚——你已悄悄越过了某条线。',
          effect: { gold: 40, favor: -15 },
          flagSet: { corrupt: 1 }
        }
      ],
      condScene: [
        {
          // 曾受贿路（corrupt≥1）：涉案官员拿捏你的把柄，逼你就范
          cond: (f) => (f.corrupt || 0) >= 1,
          scene: '你接下钦差任命，涉案官员家属当场呈上一份密信——上面写着你当年受贿的详情，字字清晰。"大人既然明白这里头的规矩，何不……留些余地？"那笑容令你毛骨悚然。',
          choices: [
            {
              text: '再度妥协，以贿赂换对方沉默',
              result: '你咬牙点头，案子和稀泥了事。皇帝看着结案报告微微蹙眉，没有追究。但那份密信，成了悬在你头顶的一把刀——随时可以落下来。',
              effect: { gold: 25, favor: -22 },
              flagSet: { corrupt: 1 }
            },
            {
              text: '主动向皇帝坦白前事，破釜沉舟',
              result: '你求见皇帝，将旧日受贿之事和盘托出，痛陈悔过。皇帝沉默良久，最终道："你能坦白，还算忠诚。"官职受损，但密信就此销毁，圣眷并未彻底消散。',
              effect: { favor: 12, power: -20, gold: -15 },
              flagSet: { loyal: 1 }
            }
          ]
        }
      ],
      condEffect: [
        {
          // 铁面/至忠路（judge≥1 或 loyal≥3）：皇帝对你额外期待，铁面执法效果翻倍
          cond: (f) => (f.judge || 0) >= 1 || (f.loyal || 0) >= 3,
          idx: 0,
          add: { favor: 18 },
          result: '皇帝接到消息时，已提前备好嘉奖——他对你的铁面早有期待。当庭宣布结案，满朝震动，"铁面钦差"四字彻底刻入朝野，圣眷攀升至前所未有的高度。'
        }
      ]
    },
    {
      id: 'court_s6',
      triggerRound: 15,
      title: '两派之争',
      scene: '太子党与丞相党积怨已久，终于在朝堂上公开决裂。双方各自派人登门，劝你站明立场。这是最关键的选择——墙头草，没有好下场。',
      choices: [
        {
          text: '站在太子一侧，守正不阿',
          result: '太子感激涕零，皇帝暗中颔首。此后你与太子一派互为倚仗，地位愈发稳固，圣眷再度攀升。',
          effect: { favor: 20, power: -5 },
          flagSet: { loyal: 1, side_loyal: 1 }
        },
        {
          text: '站在丞相一侧，把握实权',
          result: '丞相党如虎添翼，你的权柄飞速攀升。但皇帝望了你一眼——那眼神里，你读出了一丝寒意。',
          effect: { power: 28, favor: -12 },
          flagSet: { factioner: 1, side_power: 1 }
        }
      ],
      condChoices: [
        {
          // 铁面+至忠路（judge≥1 且 loyal≥2）：第三选项——绕开两派，密折直达天听
          cond: (f) => (f.judge || 0) >= 1 && (f.loyal || 0) >= 2,
          choices: [
            {
              text: '三缄其口，绕开两派，深夜密折直达天听',
              result: '你避开两派耳目，将两派各自的用心如实陈于皇帝面前。皇帝大悦，赐你密旨，暗中依靠你制衡两边。圣眷急剧攀升，两派都对你忌惮三分，再无人敢轻易拉拢。',
              effect: { favor: 32, power: -12 },
              flagSet: { judge: 1, loyal: 1 }
            }
          ]
        }
      ],
      condEffect: [
        {
          // 至忠路（loyal≥3）：太子早知你的清名，站太子效果加强
          cond: (f) => (f.loyal || 0) >= 3,
          idx: 0,
          add: { favor: 12 },
          result: '太子早就听闻你的忠名，今日你的站队令他感动不已。皇帝亦颔首赞许。此后你与太子一派肝胆相照，圣眷与地位双双攀升，当初每一次坚守都有了回响。'
        },
        {
          // 深度结党路（factioner≥2）：丞相早把你视为核心，站丞相效果加强
          cond: (f) => (f.factioner || 0) >= 2,
          idx: 1,
          add: { power: 12 },
          result: '丞相对你的归附早有期待，你加入后如虎添翼，他当即将更多权柄分与你。你已是丞相党的核心人物，权柄飞速攀升——只是皇帝的目光，愈发令人心寒。'
        }
      ]
    },
    {
      // NPC 二次突破：官场·李崇密谋（round 14，minister>=65 触发）
      id: 'court_npc_minister_bond2',
      triggerRound: 14,
      title: '密室之盟',
      cond: (f, res, npcs) => (npcs.minister || 0) >= 65,
      scene: '深夜，李崇的亲信领你入密室。地图铺开，烛火摇曳——他说出了一件惊天秘密：他准备废太子，扶持三皇子，并需要你在朝中的全力声援。此刻，你们的命运被绑在了同一根绳子上。',
      choices: [
        {
          text: '共谋大事，与他同进退',
          result: '你举起杯，一饮而尽，意味深长地说："既是同谋，荣辱与共。"李崇眼神一亮，说："好，我就知道你是此间最明白人。"此后，你们之间已不是盟友，而是真正的政治共同体。',
          effect: { power: 25, favor: -12 },
          flagSet: { factioner: 2 },
          npcSet: { minister: 20 }
        },
        {
          text: '听完，但劝他三思而后行',
          result: '你没有拒绝，也没有立刻答应，而是冷静地指出其中三处风险。李崇沉默片刻，说："你这人，谨慎得让人放心。"你们的信任更深了一层，但你保留了更大的回旋余地。',
          effect: { favor: 15, power: 8 },
          flagSet: { judge: 1 },
          npcSet: { minister: 10 }
        }
      ]
    },
    {
      id: 'court_s7',
      triggerRound: 18,
      title: '皇帝弥留',
      scene: '皇帝突发重病，弥留之际宫中人心惶惶，储位之争一触即发。太监总管秘密传话，要你表明立场——此刻你的选择，将决定新朝的走向，也决定你自己的命运。',
      choices: [
        {
          text: '辅佐嫡长子，力主正统',
          result: '新皇登基，感念拥立之恩，对你恩遇有加。你成为两朝元老，位极人臣，忠名千古。',
          effect: { favor: 25, power: 15 },
          flagSet: { kingmaker: 1, loyal: 1 }
        },
        {
          text: '趁乱控制局势，独揽大权',
          result: '你以雷霆手段控制内外，新皇不过是你扶持的傀儡。天下大权，尽归于你一身。',
          effect: { power: 35, favor: -20 },
          flagSet: { usurper: 1 }
        }
      ],
      condScene: [
        {
          // 至忠+铁面路（loyal≥3 且 judge≥1）：太子亲自深夜托付，以最大诚意相待
          cond: (f) => (f.loyal || 0) >= 3 && (f.judge || 0) >= 1,
          scene: '皇帝弥留之际，太子深夜亲自来到你的府上，长跪不起："宫中人心惶惶，唯先生忠贞清正，敢请先生出山，辅佐本宫——非为一己之私，乃为社稷苍生。"他的眼神既有诚挚，也有真切的恐惧。',
          choices: [
            {
              text: '慨然接受，以社稷为先，全力辅佐太子登基',
              result: '你连夜部署，清除宫中变数，护送太子登基。新皇感激涕零，拜你为"辅政大臣"，位极人臣。两朝忠名，千古流芳——这一刻，你知道当初每一次坚守都值得。',
              effect: { favor: 38, power: 22 },
              flagSet: { kingmaker: 1, loyal: 1, judge: 1 }
            },
            {
              text: '辅佐，但以君臣之礼相待，不受私恩',
              result: '你答允辅政，但言明只为社稷，不为私恩。太子肃然起敬，以正礼相待。清流名臣之名，自此铁板钉钉——史书将如实记录这段佳话。',
              effect: { favor: 25, power: 20 },
              flagSet: { loyal: 1, judge: 1 }
            }
          ]
        },
        {
          // 权奸/贪腐路（usurper≥1 或 corrupt≥1）：政变派找上门，你是关键人物
          cond: (f) => (f.usurper || 0) >= 1 || (f.corrupt || 0) >= 1,
          scene: '深夜，禁卫军统领亲自来访，压低声音道："皇帝已不行了，太子年幼，此刻握住禁军的人，便可左右新朝。你在朝中的人脉……正是我们所需要的。"',
          choices: [
            {
              text: '加入政变，共谋权位',
              result: '你最终越过了那条线。政变夜，你的人脉发挥了关键作用。新的权力格局建立，你站在顶端——但皇帝的灵位前，你选择不去看。',
              effect: { power: 45, favor: -28 },
              flagSet: { usurper: 1 }
            },
            {
              text: '断然拒绝，将密谋举报给太子',
              result: '你当场拒绝，连夜将密谋告知太子。政变被扼杀于摇篮，太子登基后对你感激涕零——你用一次拒绝，换来了人生最后的洗白。',
              effect: { favor: 30, power: -18 },
              flagSet: { loyal: 1 }
            }
          ]
        }
      ]
    }
  ],
  rebel: [
    {
      id: 'rebel_s1',
      triggerRound: 2,
      title: '揭竿起义',
      scene: '你竖起反旗，揭竿而起。周边百姓驻足观望，有人跃跃欲试，也有人摇头叹息。义军初建，你必须先立一个明确的名分——是义薄云天为民请命，还是单刀直入取天下？',
      choices: [
        {
          text: '高举"替天行道"，发《讨贼檄文》',
          result: '一纸檄文散遍四方，天下苦官久矣，四乡百姓奔走相传。民心大振，投奔者络绎不绝。你的名义，成了你最锋利的武器。',
          effect: { morale: 20, troops: 10 },
          flagSet: { righteous: 1 }
        },
        {
          text: '低调集兵，不张扬名义，暗积实力',
          result: '你不动声色，悄然扩充兵源，囤积粮草。官军一时摸不清你的虚实，你的队伍在暗中急速膨胀。',
          effect: { troops: 20, gold: 15 },
          flagSet: {}
        }
      ]
    },
    {
      id: 'rebel_s2',
      triggerRound: 5,
      title: '军中哗变',
      scene: '连日征战，粮草告急，军中开始有将官私下议论去留。一日深夜，你的副将求见，面色凝重："弟兄们问：这仗，打得赢吗？"他手按刀柄，等着你的答复。',
      choices: [
        {
          text: '慷慨陈词，以大义鼓舞士气',
          result: '你登台振臂高呼，慷慨陈词，历数朝廷罪行。众将士热血沸腾，齐声高喊。民心与士气双双回升，哗变消弭于无形。',
          effect: { morale: 25, troops: -5 },
          flagSet: { righteous: 1 }
        },
        {
          text: '当场斩杀带头闹事者以儆效尤',
          result: '刀光一闪，首恶人头落地，全营噤若寒蝉。威慑立竿见影，再无人敢胡言乱语——但从此军中多了一分寒意。',
          effect: { troops: 8, morale: -12 },
          flagSet: { ruthless: 1 }
        }
      ],
      condEffect: [
        {
          // 义旗高举路（righteous≥1）：你的仁义名声让大义感召效果倍增
          cond: (f) => (f.righteous || 0) >= 1,
          idx: 0,
          add: { morale: 15 },
          result: '你登台慷慨陈词，而"替天行道"的名声让你的话更有分量——士卒们早已传颂过你的仁义之举。欢呼声山呼海啸，连那些动摇者也重新握紧了刀柄。民心与士气双双沸腾。'
        },
        {
          // 铁腕路（ruthless≥1）：军中早知你的行事风格，威慑更有效，反而激起悍勇
          cond: (f) => (f.ruthless || 0) >= 1,
          idx: 1,
          add: { troops: 5, morale: 8 },
          result: '刀光一闪，这次效果格外立竿见影——军中早知你的行事风格，带头者甚至来不及求饶。威慑力远超上次，反倒激起了部分悍卒的狂热之气，士气意外上升了几分。'
        }
      ]
    },
    {
      id: 'rebel_s3',
      triggerRound: 8,
      title: '攻城抉择',
      scene: '大军兵临一座重镇城下，城中守军不过三千，但城内尚有数万百姓。你的谋士进言："可趁夜强攻，必破；然城中难免伤亡。"另一将领道："围而不攻，断其粮道，数日内必降。"',
      choices: [
        {
          text: '围城断粮，等待对方开城投降',
          result: '七日之后，城中守将开城出降。你兵不血刃拿下此城，城中百姓夹道相迎，仁义之名再度远播。',
          effect: { territory: 15, morale: 12, gold: -15 },
          flagSet: { righteous: 1 }
        },
        {
          text: '趁夜强攻，速战速决',
          result: '一夜血战，城破。你以最快速度拿下了这里，兵威大振。但城中的哭声，让军中新招的士卒沉默了很久。',
          effect: { territory: 20, troops: -12, morale: -10 },
          flagSet: { ruthless: 1 }
        }
      ],
      condChoices: [
        {
          // 义名显赫路（righteous≥2）：名声已传入城中，可以以仁义感化守将
          cond: (f) => (f.righteous || 0) >= 2,
          choices: [
            {
              text: '以仁义之名遣使入城，劝说守将归降',
              result: '你的仁义之名已传遍四方，守将竟真的派人出来议和。三日后，城门大开，守军放下武器，城中百姓欢天喜地夹道相迎。这一仗，你用名声换来了代价最小的胜利，民心大振。',
              effect: { territory: 18, morale: 28, gold: -10 },
              flagSet: { righteous: 1 }
            }
          ]
        }
      ]
    },
    {
      id: 'rebel_s3b',
      triggerRound: 10,
      title: '粮草告急',
      scene: '连续征战令粮草渐渐吃紧。军中口粮只剩三十日，而援粮迟迟未到。谋士建议趁夜攻打附近一座尚无防备的乡镇，以掠夺粮草解燃眉之急；另一将领主张撤军休整，安抚军心，等秋收之后再战。军中已有低沉的议论声……',
      choices: [
        {
          text: '出兵掠粮，先解当务之急',
          result: '人马裹挟而去，镇中粮食被搜刮一空，百姓怨声载道。粮草危机暂时化解，但义军"仁义之师"的名声有了第一道裂缝。',
          effect: { gold: 35, territory: 5, morale: -18 },
          flagSet: { ruthless: 1 }
        },
        {
          text: '撤军休整，组织屯田，收缩战线等待秋收',
          result: '义军收缩回营，就地开荒屯田。三个月后，形势好转，将士们反而因为你的决定更加信任你：这位首领，不拿百姓的粮。',
          effect: { morale: 15, gold: -15, troops: -5 },
          flagSet: { righteous: 1 }
        }
      ],
      condScene: [
        {
          // 义名显赫路（righteous>=2）：附近百姓自发送粮，危机提前化解
          cond: (f) => (f.righteous || 0) >= 2,
          scene: '粮草危机刚刚传开，营外便陆续来了一批百姓，推着独轮车，背着粮袋，说是听说义军缺粮，自愿来援。为首的老者说："义军不扰民，我等岂能坐视？"军中将士眼眶泛红，士气反而大振。',
          choices: [
            {
              text: '接受馈赠，发誓日后必以公平价偿还',
              result: '你郑重承诺补偿，百姓摇头婉拒，说这是心甘情愿的。义军声望再次提升，附近更多乡民将你视为天降仁义之师。',
              effect: { gold: 30, morale: 28 },
              flagSet: { righteous: 1 }
            },
            {
              text: '收下粮草，立即记录在册，日后如数偿还',
              result: '你命人逐一登记送粮者姓名，盖上义军印信，承诺日后偿还。百姓将这份"借据"当作传家宝，义军公正的名声从此更盛一层。',
              effect: { gold: 28, morale: 22, prestige: 10 },
              flagSet: { righteous: 1 }
            }
          ]
        }
      ],
      condEffect: [
        {
          // 已有残暴之名（ruthless>=1）：再次掠粮，伤亡更小但民心损失翻倍
          cond: (f) => (f.ruthless || 0) >= 1,
          idx: 0,
          add: { morale: -15 },
          result: '军中已有老兵知道这种事怎么做，行动更加老练，但消息传出去，更多百姓开始害怕你的旗帜，而不是欢迎它。'
        }
      ]
    },
    {
      // NPC 突破事件：造反·徐长风生死之盟（round 11，general>=40 触发）
      id: 'rebel_npc_general_bond',
      triggerRound: 11,
      title: '生死之盟',
      cond: (f, res, npcs) => (npcs.general || 0) >= 40,
      scene: '一场突围战中，你的本阵被敌军重重包围，形势岌岌可危。千钧一发之际，徐长风率部从侧翼突破，将你从重围中救出。脱险之后，他拍着你的肩，大笑道："今日算我欠你一个——不，今日算你欠我一个！"他的眼神里，有战火后的热烈，也有真正的情义。',
      choices: [
        {
          text: '把酒言欢，歃血为盟，共誓义气',
          result: '你们在营帐中把酒，每人划了一刀，以血为誓，共守义气。从此以后，义军上下都知道：你与徐长风已是真正的铁血兄弟，再无猜疑。士气如虹，麾下将士无不振奋。',
          effect: { morale: 20 },
          flagSet: { righteous: 1 },
          npcSet: { general: 25 }
        },
        {
          text: '感谢他，但点到为止，保持一定距离',
          result: '你感谢了他的援助，却没有做过多的承诺。徐长风看出了你的心思，笑道："你这人，精明得很。"语气中既有欣赏，也有几分遗憾——但你们的关系，比之前又深了一步。',
          effect: { troops: 10 },
          flagSet: { cunning: 1 },
          npcSet: { general: 10 }
        }
      ]
    },
    {
      // NPC 二次突破：造反·徐长风请主（round 14，general>=65 触发）
      id: 'rebel_npc_general_pledge',
      triggerRound: 14,
      title: '问鼎之约',
      cond: (f, res, npcs) => (npcs.general || 0) >= 65,
      scene: '大决战前夕，徐长风深夜叩营，把腰间挂了多年的令牌放在案上，单膝跪地，字字铿锵："某愿以麾下三万铁骑，奉明主之命。"帐外，义军号角长鸣。这一刻，所有人都在等你的一句话。',
      choices: [
        {
          text: '扶起他，正式受旗，承担问鼎之责',
          result: '你将令牌收起，扶起了徐长风，说："好，此战之后，天下共见证。"义军欢声雷动，士气直冲云霄。你已不再只是领袖之一，而是义军唯一的旗帜。',
          effect: { morale: 25, territory: 10 },
          flagSet: { sovereign: 1 },
          npcSet: { general: 20 }
        },
        {
          text: '让他起身，说你们平起平坐，共谋天下',
          result: '你将令牌推回，拍着他的肩说："这旗，我们一起扛。"徐长风愣了一下，随即哈哈大笑："也好，比独吞更有意思！"义军无主将独大，反而人心更齐。',
          effect: { morale: 15, troops: 15 },
          flagSet: { righteous: 1 },
          npcSet: { general: 10 }
        }
      ]
    },
    {
      id: 'rebel_s4b',
      triggerRound: 14,
      title: '反王联盟',
      scene: '南方崛起了另一路义军，实力不弱，首领派遣使者来议和——提出两军结盟，共讨朝廷，事成之后以某条山河为界，平分天下。使者措辞恳切，礼物丰厚。然而你知道此人枭雄心性，并不把"盟约"真的当作约束。',
      choices: [
        {
          text: '结盟，获得援军，并肩攻打朝廷',
          result: '盟约签订，对方当即遣来五千援军协防。短期内兵力大增，攻势有所进展——但你心里清楚，盟友迟早会成为对手。',
          effect: { troops: 22, morale: 15, gold: -10 },
          flagSet: { ally_rebel: 1 }
        },
        {
          text: '拒绝结盟，独立经营，不借外力',
          result: '使者无功而返，你在信中回道："义军之道，凭己力开路。"此语传开，天下豪杰对你的独立气节另眼相看，单打独斗的声望令部众更加骄傲。',
          effect: { morale: 18, troops: 5 },
          flagSet: { righteous: 1 }
        }
      ],
      condScene: [
        {
          // 老奸巨猾路（cunning>=1）：你暗中查出这位"盟友"正在和朝廷秘密谈判
          cond: (f) => (f.cunning || 0) >= 1,
          scene: '使者来访的同时，你的探子带回一份截获的密信——那位"义军首领"正在私下与朝廷谈判招安，似乎将你我联盟当作谈判筹码。此人是在利用你。',
          choices: [
            {
              text: '当面摊牌，将密信展示给使者看，逼其表态',
              result: '使者措手不及，脸色骤变，仓皇离去。这条密信很快传遍江湖，那位首领的信誉扫地，部众离心，你反而因此坐收渔翁之利，不少对方将士主动来投。',
              effect: { troops: 12, morale: 20 },
              flagSet: { cunning: 1, righteous: 1 }
            },
            {
              text: '表面答应结盟，暗中布局，以其人之道还治其人之身',
              result: '你签了盟约，私下却以同样的方式将消息散布出去，逼得对方首领无法成功谈判招安，你坐享其成，对方却骑虎难下。',
              effect: { troops: 8, morale: 10, gold: 20 },
              flagSet: { cunning: 1 }
            }
          ]
        }
      ]
    },
    {
      id: 'rebel_s4',
      triggerRound: 12,
      title: '朝廷招安',
      scene: '朝廷派来一位宦官，带着圣旨与大批金银，开出条件：封你为"安抚使"，麾下兵马保留，此后镇守一方，不再相攻。使者一脸谄笑，等待你的答复。',
      choices: [
        {
          text: '断然拒绝，将使者赶出营去',
          result: '使者灰溜溜离去，你的立场传遍天下。四方豪杰纷纷表示敬佩，又有一批人前来投奔，民心大振。',
          effect: { morale: 20, troops: 15, gold: -10 },
          flagSet: { righteous: 1 }
        },
        {
          text: '虚与委蛇，先接受招安装作顺从',
          result: '你面子上接了旨，实则暗中继续扩充兵力、积蓄力量。朝廷暂时放松了对你的警惕——这是一场更大的博弈。',
          effect: { gold: 30, troops: 10, morale: -15 },
          flagSet: { cunning: 1 }
        }
      ],
      condScene: [
        {
          // 老奸巨猾路（cunning≥1）：朝廷已识破把戏，这次来真的了
          cond: (f) => (f.cunning || 0) >= 1,
          scene: '上次虚与委蛇的把戏，朝廷终于识破了。这次来的不是宦官，而是一位老将——你在边境听说过此人的名头。他开门见山："上次的条件作废了。降，则生；不降，三万精兵来会你。"',
          choices: [
            {
              text: '拒绝，整军备战，正面迎击',
              result: '你断然拒绝，整军应战。数日血战，你打赢了，但付出了沉重代价。然而这一战的胜利令天下人明白：你并非虚张声势的草莽，义军士气大振。',
              effect: { troops: -20, territory: 15, morale: 18 },
              flagSet: { righteous: 1 }
            },
            {
              text: '再度虚与委蛇，继续拖延',
              result: '你再度耍滑头，拖延谈判。消息传出后，军中士卒大失所望，不少人议论你的信誉。民心再度动摇——这是你第二次玩把戏的代价，这次有些人走了。',
              effect: { gold: 15, morale: -28, troops: -8 },
              flagSet: { cunning: 1 }
            }
          ]
        }
      ],
      condEffect: [
        {
          // 义名显赫路（righteous≥2）：拒绝招安效果翻倍，四方来投
          cond: (f) => (f.righteous || 0) >= 2,
          idx: 0,
          add: { morale: 20, troops: 12 },
          result: '你的拒绝话音刚落，营外百姓高声欢呼——他们早就守在那里了。"义军不降"的消息如野火燎原，四方豪杰纷纷来投，队伍一夜之间扩大一圈。这份名声，是你最好的军队。'
        }
      ]
    },
    {
      id: 'rebel_s5',
      triggerRound: 16,
      title: '天下问鼎',
      scene: '你的旗帜已飘扬半壁江山，各路诸侯纷纷来信。有人愿意归附，共推你为盟主，号令天下；也有人提出平分天下，各治一方。你知道，这一个决定，将决定你最终的结局。',
      choices: [
        {
          text: '号令群雄，挥师问鼎，统一天下',
          result: '你拒绝妥协，挥军继续北伐。前路艰险，但凡成大事者，从无苟且。你的眼中只有那座九五之尊的位置。',
          effect: { troops: -15, territory: 25, morale: 10 },
          flagSet: { conqueror: 1 }
        },
        {
          text: '割据称王，守住江山，休养生息',
          result: '你宣布建制称王，以所占之地立国，轻徭薄赋，与民休息。百姓安居，江山稳固，开一方太平之地。',
          effect: { territory: 15, morale: 20, gold: 20 },
          flagSet: { ruler: 1 }
        }
      ]
    },
    {
      id: 'rebel_s6',
      triggerRound: 18,
      title: '最后一战',
      scene: '朝廷集结了最后的精锐，誓要将你剿灭于此。大战在即，全军静默，将士们的目光汇聚到你身上——你知道，今日之后，不是改天换地，便是灰飞烟灭。',
      choices: [
        {
          text: '亲率精骑，冲阵破敌，以勇决胜',
          result: '你策马当先，喊杀声中亲自冲入敌阵。敌军见主帅如此勇烈，阵脚大乱，义军趁势掩杀，大获全胜。士气冲天，地盘再扩。',
          effect: { troops: -10, territory: 20, morale: 22 },
          flagSet: { brave: 1 }
        },
        {
          text: '稳守阵线，以持久之战消耗官军',
          result: '你以逸待劳，以坚固的防线拖垮了官军的补给线。数日后官军粮尽而退，你不费一兵一卒守住了全部地盘，还借机扩张。',
          effect: { territory: 15, morale: 12, gold: 18 },
          flagSet: { cunning: 1 }
        }
      ],
      condScene: [
        {
          // 义名显赫路（righteous≥3）：百姓自发加入，敌营有人哗变
          cond: (f) => (f.righteous || 0) >= 3,
          scene: '大战前夜，对面营中突然有三支队伍打出白旗——那是被强征来的民夫兵，听说义军仁义，宁死不愿再替朝廷卖命。百姓自发送来粮草，军中士气沸腾。你的名义，已经变成了真正的力量。',
          choices: [
            {
              text: '接纳哗变之兵，以仁义感化，壮大义军',
              result: '哗变的士卒见你亲自出迎，感激涕零，纷纷愿归义旗之下。你以仁义化戾气，大军士气如虹，官军中更有人动摇，此战以最小代价换来最大胜利。',
              effect: { troops: 20, territory: 25, morale: 30 },
              flagSet: { righteous: 1 }
            },
            {
              text: '当机立断，以攻为守，全线出击',
              result: '你判断此刻敌军军心动摇，立刻下令全线出击。义军以破竹之势撕开官军防线，此战大胜，义旗飘遍新的城池。',
              effect: { troops: -5, territory: 30, morale: 20 },
              flagSet: { brave: 1 }
            }
          ]
        }
      ],
      condEffect: [
        // 老谋深算——持久战更能把握时机，趁乱扩张
        { cond: (f) => (f.cunning || 0) >= 2, idx: 1,
          add: { territory: 10, gold: 8 },
          result: '你的老谋深算让官军的每一步都在你的预料之中。撤退时你趁机出击，不仅守住了地盘，更顺势拿下了两座粮仓，军中存粮充裕，来日之战大有底气。' }
      ]
    }
  ],

  merchant: [
    {
      id: 'merchant_s1',
      triggerRound: 2,
      title: '第一桶金',
      scene: '你的第一家铺面开张后，一位神秘客商登门，愿以远低于市价的价格出售一批珍贵货物，但来历不明，无法追查。买还是不买？',
      choices: [
        {
          text: '照价买入，不追究来历',
          result: '货物到手，你低买高卖，财富暴涨。但你心里清楚，这笔钱来得不那么干净。',
          effect: { gold: -20, wealth: 60 },
          flagSet: { cunning: 1 }
        },
        {
          text: '婉拒，只做清白买卖',
          result: '客商讪讪离去。你放弃了这笔横财，但你的清白名声在商界渐渐传开。',
          effect: { prestige: 15 },
          flagSet: { righteous: 1 }
        }
      ]
    },
    {
      id: 'merchant_s2',
      triggerRound: 5,
      title: '同行竞争',
      scene: '一位强势的竞争对手联合多家商号打压你的生意，压价倾销，甚至贿赂官府阻挠你的商路。你的商誉和财源都受到威胁。',
      choices: [
        {
          text: '以牙还牙，联合小商家反击',
          result: '你迅速整合盟友，以更低的价格和更好的品质反击，最终逼得对手收手，名声更盛。',
          effect: { prestige: 20, gold: -15 },
          flagSet: {}
        },
        {
          text: '以和为贵，主动登门谈合作',
          result: '你主动示好，对方意外地接受了你的提议，双方达成默契，市场重新稳定，各取所需。',
          effect: { prestige: 12, wealth: 20 },
          flagSet: { cunning: 1 }
        }
      ],
      condEffect: [
        // 义商名声——小商家更愿响应号召，反击效果更强
        { cond: (f) => (f.righteous || 0) >= 1, idx: 0,
          add: { prestige: 10 },
          result: '你的仁义名声让小商家无不响应号召，联合之势出乎对手意料，一举将其逼退，商誉大涨。' },
        // 老谋深算——谈判时更能把握对方软肋，条件更优
        { cond: (f) => (f.cunning || 0) >= 1, idx: 1,
          add: { wealth: 15 },
          result: '你洞悉了对方的隐忧，谈判时恰到好处地点出要害，对方心中慌乱，不得不让步更多，双赢之局更加丰厚。' }
      ]
    },
    {
      id: 'merchant_s3',
      triggerRound: 8,
      title: '官府勒索',
      scene: '地方官员亲自登门，以"查账"为名，暗示要你"孝敬"一笔钱才肯放行。这笔"过路费"数目不小，但拒绝了有什么后果，你心里没底。',
      choices: [
        {
          text: '忍气吞声，送上银子',
          result: '银子送出去，官员点头离开，商路暂时通畅。但你知道，这只是开始。',
          effect: { gold: -35, prestige: -5 },
          flagSet: {}
        },
        {
          text: '联合其他商家，向上级投诉',
          result: '此举惊动了上峰，地方官被查，你们获得补偿。你的名声在商界响彻四方——这个商人，不好欺负。',
          effect: { prestige: 25, gold: -10 },
          flagSet: { righteous: 1 }
        }
      ],
      condScene: [
        // 清誉商人：官员提前听过你名字，态度客气了三分，要价也少了些
        { cond: (f, r) => (f.righteous || 0) >= 1 || (r.prestige || 0) >= 40,
          scene: '地方官员带着几分客气登门，措辞比传闻中温和许多——你的名声他早有耳闻，不敢太过放肆。他隐晦地提到"规矩"，要价比平时少了三成。',
          choices: [
            { text: '破财消灾，给得少些，保全商路',
              result: '银子虽出，数目可以接受。官员满意离开，你的商路通畅，也没有闹大。',
              effect: { gold: -18, prestige: -2 }, flagSet: {} },
            { text: '联合商家向上级投诉，借此机会整治一番',
              result: '你的名声让其他商家义无反顾地站出来联署。案子惊动了上峰，地方官被贬，全城百姓拍手称快，商誉大涨。',
              effect: { prestige: 35, gold: -5 }, flagSet: { righteous: 1 } }
          ]
        }
      ],
      condEffect: [
        // 仁义名声让投诉行动更有号召力
        { cond: (f) => (f.righteous || 0) >= 2, idx: 1,
          add: { prestige: 15 },
          result: '你多年积累的清誉使无数商家自发声援，案子迅速引发轰动，上峰雷霆震怒，地方官连夜被拿问，商界秩序焕然一新。' }
      ]
    },
    {
      id: 'merchant_s3b',
      triggerRound: 10,
      title: '同业倾轧',
      scene: '一个外来的大商号近月在你的主要商路上以亏本价格倾销货物，意图挤垮本地商家。你的几家铺面已告急，当地同行纷纷登门求援，问你打算如何应对这场商战。',
      choices: [
        {
          text: '针锋相对，以同样的低价反击，打价格战',
          result: '双方鏖战月余，对方资金同样吃紧，最终选择撤出。你守住了商路，但这一仗伤了元气，财富与钱粮均有亏损。不过，你护住了同行，商誉因此上升。',
          effect: { wealth: -15, gold: -25, prestige: 15 },
          flagSet: {}
        },
        {
          text: '联合本地商家，向官府投诉对方倾销行为',
          result: '你牵头联署，上报官府。此事惊动上峰，对方商号被彻查，竟查出了几项违规，被责令整改撤场。你以团结之道化解危机，在同行中树立了领袖形象。',
          effect: { prestige: 28, wealth: 10 },
          flagSet: { righteous: 1 }
        }
      ],
      condScene: [
        {
          // 老谋深算路（cunning>=1）：你暗中查出背后有达官贵人在撑腰
          cond: (f) => (f.cunning || 0) >= 1,
          scene: '你命人暗查，发现对方商号的背后金主，正是某位想染指本地商路的权贵。那位权贵知道你查到了，派人登门，含糊暗示"合则两利"。这是要你妥协，还是继续抗争？',
          choices: [
            {
              text: '妥协，接受权贵的"合作"，换取倾销停止',
              result: '权贵满意地点头，倾销立即停止。你保住了商路，但也背上了一重靠山——以及靠山的代价。',
              effect: { wealth: 20, prestige: -10 },
              flagSet: { royal_merchant: 1 }
            },
            {
              text: '将幕后黑手连同证据一并向上级举报',
              result: '案子到达上峰，权贵被迫收手，场面一时难看。你得罪了一个厉害人物，但此后再无人敢轻易欺上门来，清誉更胜以往。',
              effect: { prestige: 35, wealth: 5, gold: -10 },
              flagSet: { righteous: 1, judge: 1 }
            }
          ]
        }
      ],
      condEffect: [
        {
          // 清誉商人（righteous>=2）：联署行动更有号召力，效果增强
          cond: (f) => (f.righteous || 0) >= 2,
          idx: 1,
          add: { prestige: 12 },
          result: '你的清誉让众多商家义无反顾地联署，甚至连平日不与你往来的竞争对手也加入其中。一份声势浩大的联名状呈上，官府雷厉风行，你在商界的话语权再上一层台阶。'
        }
      ]
    },
    {
      // NPC 二次突破：富商·沈万钧正式结盟（round 14，tycoon>=65 触发）
      id: 'merchant_npc_tycoon_bond2',
      triggerRound: 14,
      title: '天下同盟',
      cond: (f, res, npcs) => (npcs.tycoon || 0) >= 65,
      scene: '沈万钧在书房摆了两杯茶，把一份协议推到你面前——正式结成商业同盟，共同掌控江南七成的商路，对外统一口径，对内利润共享。这将是天下商界前所未有的格局。他说："只问一句：你信不信我？"',
      choices: [
        {
          text: '接受协议，共建商业帝国',
          result: '你提笔签下名字，说："信。"沈万钧大笑，当场拍桌："好！从今日起，天下商路，我们说了算！"此后，你们联手的消息传遍江南，无数商号争相依附。',
          effect: { routes: 2, prestige: 20, wealth: 25 },
          flagSet: { cunning: 1 },
          npcSet: { tycoon: 20 }
        },
        {
          text: '合作，但保留独立账目和商路自主权',
          result: '你提出了修改条件，沈万钧皱了皱眉，随后点头："你这人，从来不吃亏。行，就按你说的。"修改后的协议，对你更有利，但合作仍然深度展开。',
          effect: { prestige: 25, wealth: 20, routes: 1 },
          flagSet: { righteous: 1 },
          npcSet: { tycoon: 10 }
        }
      ]
    },
    {
      id: 'merchant_s4b',
      triggerRound: 14,
      title: '海外奇货',
      scene: '南海来了一艘陌生商船，带来令人目眩神迷的舶来货物——异域香料、精美琉璃、稀奇宝石。船主操着半生不熟的官话，提出一个大胆的合作：以你的商路和声誉为通道，开辟海外贸易，利润三七分，你得七成。',
      choices: [
        {
          text: '投资入局，开拓海外商路',
          result: '你投入资金，与船主谈妥细节。第一批海货到岸便引发轰动，利润可观。但你也清楚，海路风险远比陆路凶险，日后的收益仍有变数。',
          effect: { wealth: 18, routes: 1, gold: -35 },
          flagSet: { visionary: 1 }
        },
        {
          text: '谢绝合作，稳守成熟商路',
          result: '你礼貌谢绝，船主遗憾离去，说日后若你改变主意可再相谈。你坚守本业，稳中求胜，财富虽无暴增，却胜在踏实稳固。',
          effect: { wealth: 22, prestige: 8 },
          flagSet: {}
        }
      ],
      condEffect: [
        {
          // 清誉路（righteous>=2）：外商主动给出更优厚条件
          cond: (f) => (f.righteous || 0) >= 2,
          idx: 0,
          add: { wealth: 12, gold: 15 },
          result: '船主在码头打听过你的名声，临谈时主动将你的分成提到了八成，说在海外，诚信商人是最稀缺的资产。这笔合作从一开始便比预期更加丰厚。'
        },
        {
          // 老谋深算路（cunning>=1）：谈判时识破船主的套路，多争取了条件
          cond: (f) => (f.cunning || 0) >= 1,
          idx: 0,
          add: { gold: 20 },
          result: '你察觉到船主的报价留有水分，不动声色地以"商路维护成本"为由压价。对方在你的眼神下犹豫片刻，最终答应了更优厚的条件，还补了一批定金。'
        }
      ]
    },
    {
      // NPC 突破事件：富商·沈万钧的第一次妥协（round 11，tycoon>=40 触发）
      id: 'merchant_npc_tycoon_rival',
      triggerRound: 11,
      title: '首富的妥协',
      cond: (f, res, npcs) => (npcs.tycoon || 0) >= 40,
      scene: '一场关键竞标中，你以一步绝杀打破了沈万钧精心布置的局——他输了，而且输得明明白白。事后，他亲自登门，把一封介绍信放在桌上："凭这封信，江南三省的商路，没有人敢刁难你。"他语气平静，眼神却格外认真——这是天下首富第一次真正在乎你。',
      choices: [
        {
          text: '接受，联手布局江南',
          result: '你接过介绍信，两人相视而笑。从此，你们之间的关系从竞争走向了合作。江南商路上，多了一段"双雄并进"的佳话，商界无人敢小觑。',
          effect: { routes: 1, prestige: 15 },
          flagSet: { cunning: 1 },
          npcSet: { tycoon: 25 }
        },
        {
          text: '谢绝，凭实力自己闯',
          result: '你客气地把信推回去，说想靠自己打开局面。沈万钧愣了一下，随后抚掌大笑："好！不愧是对手。"他对你的钦佩，又上了一个台阶——此后在商界，你们虽未并肩，却都明白对方的分量。',
          effect: { prestige: 20 },
          flagSet: { righteous: 1 },
          npcSet: { tycoon: 15 }
        }
      ]
    },
    {
      id: 'merchant_s4',
      triggerRound: 12,
      title: '皇商之邀',
      scene: '你的财富已足以左右当地市场，一家皇商主动登门，邀你入股皇家贸易。这意味着更大的利润，但也意味着政治风险——一旦朝局有变，你将首当其冲。',
      choices: [
        {
          text: '加入皇商，赌一把大的',
          result: '皇商的招牌让你如虎添翼，财富飞速积累。但你也知道，你的命运已和朝廷捆绑在一起。',
          effect: { wealth: 40, prestige: 15, gold: -30 },
          flagSet: { royal_merchant: 1 }
        },
        {
          text: '婉拒，独立经营，不依附权贵',
          result: '你客气地谢绝了，皇商有些意外，但也尊重你的选择。你的商道，始终掌握在自己手中。',
          effect: { prestige: 20, wealth: 20 },
          flagSet: { righteous: 1 }
        }
      ],
      condEffect: [
        // 仁义清誉——拒绝皇商的选择更受商界尊重
        { cond: (f) => (f.righteous || 0) >= 2, idx: 1,
          add: { prestige: 12, wealth: 10 },
          result: '你的清誉已是商界传说，此番拒绝皇商更令人肃然起敬。皇商离去后，多家大商号主动登门寻求合作，财富与商誉双双大涨。' },
        // 老谋深算——入股时谈出更好条件
        { cond: (f) => (f.cunning || 0) >= 1, idx: 0,
          add: { wealth: 15 },
          result: '你不动声色地与皇商周旋，最终谈出比对方预期优厚得多的条件——入股比例更大，风险更小。皇商苦笑着签了字，对你的精明刮目相看。' }
      ]
    },
    {
      id: 'merchant_s5',
      triggerRound: 16,
      title: '富可敌国',
      scene: '你的财富已积累到令朝野侧目的程度。皇帝派遣使者登门，措辞客气，却意味深长："陛下久仰大名，欲请您入京觐见。"是危机，还是机遇？',
      choices: [
        {
          text: '进京觐见，把握机遇，谋求更大舞台',
          result: '皇帝亲见，嘉许你的才干，赐封"皇商总管"。你的财富与地位达到顶峰，却也从此深陷权力漩涡。',
          effect: { wealth: 30, prestige: 25 },
          flagSet: { royal_merchant: 1 }
        },
        {
          text: '称病婉拒，低调行事，守住自己的天地',
          result: '你选择了安全。皇帝未必高兴，但也未曾追究。你在低调中继续积累，岁月静好。',
          effect: { wealth: 20, gold: 15 },
          flagSet: { righteous: 1 }
        }
      ]
    },
    {
      id: 'merchant_s6',
      triggerRound: 18,
      title: '百年商号',
      scene: '你一手创立的商号已屹立商界二十年，如今被人尊称为"天下第一商"。然而两子相争，各有主张——长子欲继续扩张，次子欲守成稳固。你必须做出最后的抉择，决定这份基业将以何种姿态传承下去。',
      choices: [
        {
          text: '立长子为继，扩张是商业的本性',
          result: '长子得令，雄心勃勃地布局新商路，家业版图进一步扩大。你安然退居幕后，看着自己亲手搭建的商业帝国继续生长，富贵延绵。',
          effect: { wealth: 25, routes: 1 },
          flagSet: { legacy: 1 }
        },
        {
          text: '亲自掌舵再十年，不急于传位',
          result: '你决定再亲力亲为十年，将商号的每一个环节打磨得无懈可击。子孙们在你的目光下成长，商号的根基愈发深固。',
          effect: { wealth: 20, prestige: 18 },
          flagSet: { legacy: 1 }
        }
      ],
      condScene: [
        {
          // 义商路（righteous≥2）：地方官员请你出面调解商界纷争，以德服众
          cond: (f) => (f.righteous || 0) >= 2,
          scene: '朝廷钦点你为"天下商务调停使"，各地商贾纷争皆由你一言定夺。你的清誉成了比银子更值钱的东西——一纸书信，胜过千金。此时你需要决定，这份无形的权威，要如何运用。',
          choices: [
            {
              text: '以清誉为本，主持公道，惠及天下商旅',
              result: '你以公正之名调解各方纷争，商界秩序焕然一新。各地商贾感念你的恩德，纷纷奉上礼品与合作，商誉与财富双双达到顶峰。',
              effect: { prestige: 30, wealth: 20, gold: 15 },
              flagSet: { righteous: 1 }
            },
            {
              text: '借此机会整合资源，将天下商路纳入掌控',
              result: '你将这份公信力化为商业优势，悄然整合各地商路，财富版图再度扩张。清誉有所损耗，但家业更加雄厚。',
              effect: { wealth: 35, routes: 2, prestige: -8 },
              flagSet: { cunning: 1 }
            }
          ]
        }
      ],
      condEffect: [
        // 皇商路（royal_merchant≥1）：与朝廷的绑定带来风险与机遇并存
        { cond: (f) => (f.royal_merchant || 0) >= 1, idx: 0,
          add: { wealth: 15 },
          result: '皇商身份为长子的扩张提供了朝廷的庇护，商路无往不利，财富以惊人速度积累，家业已不仅是商号，更成了朝野皆知的财富帝国。' }
      ]
    }
  ],

  hero: [
    {
      id: 'hero_s1',
      triggerRound: 2,
      title: '第一血战',
      scene: '你路遇一伙恶霸正欺压一户人家，为首者刀法凌厉。你上前制止，对方冷笑："小子，你是要找死吗？"——这一战，不知生死。',
      choices: [
        {
          text: '拔剑迎战，以死相拼',
          result: '血战片刻，恶霸落败，你身上也挂了彩，但那户人家对你感激涕零，消息迅速传开，江湖名望大振。',
          effect: { fame: 25, bonds: 10, martial: -5 },
          flagSet: { brave: 1 }
        },
        {
          text: '先周旋谈判，争取不战而胜',
          result: '你言辞犀利，道出对方背后的图谋，令恶霸有所顾忌，最终收手。人家安然无恙，你的名字也传了出去。',
          effect: { fame: 18, bonds: 8 },
          flagSet: { cunning: 1 }
        }
      ]
    },
    {
      id: 'hero_s2',
      triggerRound: 5,
      title: '江湖结拜',
      scene: '一位你久仰的豪侠主动找到你，说听闻你的事迹，愿与你结为兄弟（或姊妹），共行侠道。结义之后，便是一损俱损，一荣俱荣。',
      choices: [
        {
          text: '慨然应允，与其义结金兰',
          result: '你们在月下拜天地，歃血为盟。从此多了一个肝胆相照的同路人，恩义网络大幅扩展，名望也随之高涨。',
          effect: { bonds: 20, fame: 12 },
          flagSet: { sworn: 1 }
        },
        {
          text: '婉言谢绝，江湖路上不愿拖累他人',
          result: '对方有些失望，但也尊重你的决定。你孤独地继续前行，这份执念，让你的剑更为纯粹。',
          effect: { martial: 15, fame: 8 },
          flagSet: { lone_hero: 1 }
        }
      ],
      condScene: [
        // 孤侠在外的名声，使对方格外珍视这份结义
        { cond: (f) => (f.lone_hero || 0) >= 1,
          scene: '那位豪侠远道而来，说早就听说你孤身行侠的名声，特地赶来，语气里带着几分敬意："正因你从不依赖他人，我才更想与你结义——你若愿意，必是我最信任的兄弟。"',
          choices: [
            { text: '为这份理解动容，慨然结义',
              result: '对方的话触动了你。你们在星空下歃血为盟，这份结义比寻常更显珍贵，恩义网络深固，名望大涨。',
              effect: { bonds: 28, fame: 15 }, flagSet: { sworn: 1 } },
            { text: '仍然婉拒，孤行是你的选择',
              result: '对方叹了口气，带着遗憾告别。你在原地驻足良久，最终还是转身离去。这条路，你要一个人走完。',
              effect: { martial: 18, fame: 10 }, flagSet: { lone_hero: 1 } }
          ]
        }
      ],
      condEffect: [
        // 勇名在外——对方更愿深交，结义带来更多恩义
        { cond: (f) => (f.brave || 0) >= 1, idx: 0,
          add: { bonds: 10 },
          result: '你的勇武之名令对方深为佩服，歃血为盟时分外郑重，此后恩义网络更为深广，危难时必能相互支援。' }
      ]
    },
    {
      id: 'hero_s3',
      triggerRound: 8,
      title: '武林大会',
      scene: '天下武林在此相聚，百强高手云集比武，胜者将被尊为"武林盟主"候选。你被邀请参赛，但胜负难料——若败，名望可能受损；若胜，你将名震天下。',
      choices: [
        {
          text: '参赛，放手一搏',
          result: '你连胜数场，最终进入决赛。虽未夺魁，但你的身手让天下英雄刮目相看，名望急剧攀升。',
          effect: { fame: 30, martial: 10, gold: -10 },
          flagSet: { brave: 1 }
        },
        {
          text: '婉拒参赛，在场外结交高手，暗中观摩',
          result: '你在场边结识了数位高手，切磋之中武艺大进。错过了露脸的机会，却实实在在地提升了自己。',
          effect: { martial: 25, bonds: 12 },
          flagSet: {}
        }
      ],
      condScene: [
        // 武艺高强——被列为种子选手，有实际夺魁可能
        { cond: (f, r) => (r.martial || 0) >= 60,
          scene: '天下武林大会，你因近年来声名赫赫，被主办方列为"种子选手"之一。坐在台上的高手们望向你的眼神，已不是打量，而是正视。夺魁，不再只是遥想。',
          choices: [
            { text: '全力出战，争夺盟主之位',
              result: '你势如破竹，一路高歌猛进，最终与一位传说中的高手在决赛相遇。一番苦战，你胜出了。天下武林为之震动，"盟主"之名实至名归，名望狂涨。',
              effect: { fame: 50, martial: 15, gold: -10 }, flagSet: { brave: 1 } },
            { text: '参赛结交，以赛会友，不强求名次',
              result: '你在赛场上展现了超凡的武艺，尽管没有争夺到魁首，但与诸多高手的切磋使你武艺再进一层，场外建立的友谊也让你的恩义网络大幅扩展。',
              effect: { fame: 35, martial: 20, bonds: 15 }, flagSet: { brave: 1 } }
          ]
        }
      ],
      condEffect: [
        // 勇名在外——参赛效果更强（更受瞩目）
        { cond: (f) => (f.brave || 0) >= 2, idx: 0,
          add: { fame: 15 },
          result: '你的勇武之名早已传遍武林，此番参赛一亮相便引来全场瞩目。每一场比试都令观者屏息，名望随着每场胜利急速攀升，令无数江湖人叹为观止。' }
      ]
    },
    {
      id: 'hero_s3b',
      triggerRound: 10,
      title: '武林大会',
      scene: '各大门派在中原联合举办武林大会，公推新一届武林盟主。你的名声已在江湖广泛流传，有人公开点名邀你赴会，更有几家门派私下登门，请你在大会上为他们的候选人摇旗呐喊——附带好处自然丰厚。',
      choices: [
        {
          text: '参加大会，正面角逐，争夺盟主之位',
          result: '你在大会上一展武技，赢得满堂喝彩。虽未能夺得盟主之位，但你不染党派的独立形象令无数侠士折服，名望大涨。',
          effect: { fame: 22, martial: 10, gold: -15 },
          flagSet: { hero_known: 1 }
        },
        {
          text: '拒绝门派拉拢，以公开信表明中立立场',
          result: '你回信婉拒所有门派的邀请，一封言辞坦荡的公开信在江湖中广为传阅——"侠者无党派，只有是非。"此语令无数草莽江湖人击节称赞，仗义之名更盛。',
          effect: { fame: 18, bonds: 12 },
          flagSet: { righteous: 1 }
        }
      ],
      condScene: [
        {
          // 独行侠路（lone_hero>=1）：有人散布谣言说你在大会背后操控局势
          cond: (f) => (f.lone_hero || 0) >= 1,
          scene: '大会前夕，江湖上忽然流传开一则谣言——说你在幕后操控大会，意图扶植自己的傀儡为盟主。你知道这是某人的手段，但谣言已传开，不回应不行，回应不好也不行。',
          choices: [
            {
              text: '只身赴会，当众亮明立场，以行动澄清谣言',
              result: '你在大会上毫无做作地站出来，将流言逐条驳斥，没有门派、没有后台，只凭一剑一身正气。谣言不攻自破，名声反而因此更加响亮。',
              effect: { fame: 28, bonds: 8 },
              flagSet: { righteous: 1, hero_known: 1 }
            },
            {
              text: '无视谣言，不出席大会，以沉默划清界限',
              result: '你选择沉默，不做解释。谣言在时间中自然消散，倒是你独行江湖、不随波逐流的气质，在某些老侠客眼中更具分量。',
              effect: { fame: 12, martial: 8 },
              flagSet: { lone_hero: 1 }
            }
          ]
        }
      ],
      condEffect: [
        {
          // 义名显赫路（righteous>=2）：宣言更具感染力，效果增强
          cond: (f) => (f.righteous || 0) >= 2,
          idx: 1,
          add: { fame: 12, bonds: 10 },
          result: '你的那封公开信在江湖上引发了异乎寻常的反响——有人将它抄录下来，贴在茶馆门口；有人说它是近十年来最有骨气的侠义宣言。你的名声已不再只是"武艺高强"，而是"此人有侠骨"。'
        }
      ]
    },
    {
      // NPC 突破事件：侠客·燕无双的信任（round 11，master>=40 触发）
      id: 'hero_npc_master_trust',
      triggerRound: 11,
      title: '宗主的信任',
      cond: (f, res, npcs) => (npcs.master || 0) >= 40,
      scene: '在一场山间伏击中，你以命相搏救了燕无双的退路。脱险之后，他在山崖上喝了一壶酒，把剩下的半壶扔给你，语气少了往日的审视："你这人，我看了很久了。"月色下，你第一次觉得他是个真正的人，而不只是一个江湖符号。',
      choices: [
        {
          text: '赤诚相待，倾心而谈，打开心扉',
          result: '你们一壶酒，喝了大半夜。从江湖旧事到心中所向，燕无双第一次真正打开了心扉。你知道，从此以后，他是真正的朋友，不只是江湖中的盟友。天下再大，知己难得。',
          effect: { bonds: 15, fame: 10 },
          flagSet: { sworn: 1 },
          npcSet: { master: 25 }
        },
        {
          text: '点到为止，以酒为礼，江湖情义如此',
          result: '你喝了那半壶酒，说："酒够了，情义也够了。"燕无双大笑，说："你这人，真有意思。"你们没有再多言，但彼此都明白了。有些默契，不需要说出来。',
          effect: { fame: 12, martial: 8 },
          flagSet: { lone_hero: 1 },
          npcSet: { master: 12 }
        }
      ]
    },
    {
      // NPC 二次突破：侠客·燕无双提名盟主（round 14，master>=65 触发）
      id: 'hero_npc_master_pledge',
      triggerRound: 14,
      title: '盟主之邀',
      cond: (f, res, npcs) => (npcs.master || 0) >= 65,
      scene: '武林大会在即。燕无双专程来访，说出了让你意外的话："我打算在大会上，公开提名你为候选盟主。"这是武林最高荣誉，也是最重的担子。他说："你有那个义气，也有那个本事。就看你敢不敢接这杆旗。"',
      choices: [
        {
          text: '接受提名，担下武林领袖之责',
          result: '你点头，说："既然是你开口，我接了。"燕无双击掌大笑，说："痛快！"武林大会上，你的名字被宣布，四方豪杰纷纷侧目。从此，你不再只是一名侠客，而是江湖共主的候选人。',
          effect: { fame: 25, bonds: 12 },
          flagSet: { sworn: 1 },
          npcSet: { master: 20 }
        },
        {
          text: '婉拒，只做自己的逍遥侠客',
          result: '你摇头，说："盟主太重，我还是爱自在。"燕无双沉默片刻，说："你这人，真是走不进框的。"他没有失望，反而觉得你更是他理解的那个人——有些人，不需要旗帜，本身就是江湖的传说。',
          effect: { fame: 15, martial: 12 },
          flagSet: { lone_hero: 1 },
          npcSet: { master: 10 }
        }
      ]
    },
    {
      id: 'hero_s4b',
      triggerRound: 14,
      title: '仇家上门',
      scene: '江湖上恩怨最难了结。当年的一段旧事——你手败过的某人，或是你得罪过的某方势力——最终在这一年找上门来。来者带了几位高手，在客栈外摆好了架势，说是要"讨个公道"，言辞之中杀意分明。',
      choices: [
        {
          text: '坦然赴约，以剑说话，了断江湖债',
          result: '一场酣战，来者中两人受伤败退，领头的沉默片刻，拱手道："是我等有眼无珠。"此战之后，再无人敢轻易找上门来，江湖中你的悍名更上一层。',
          effect: { fame: 20, martial: 12, gold: -8 },
          flagSet: { brave: 1 }
        },
        {
          text: '以言化解，寻求另一种了结方式',
          result: '你开门出去，没有拔剑，而是坐下来，好好把旧事说开。最终来者中有一人眼眶发红，说："若当初是这样……"一场血战化为一场长谈，恩怨消弭，甚至多了几分意外的理解。',
          effect: { fame: 14, bonds: 22 },
          flagSet: { righteous: 1 }
        }
      ],
      condScene: [
        {
          // 勇名在外路（brave>=2）：来者中有人认出你，主动劝说同伴放弃
          cond: (f) => (f.brave || 0) >= 2,
          scene: '那几名高手在外等你，其中一人忽然低声对领头者说："等等——你确定要打？这个人……"他的声音有几分颤抖。你的名声，有时候比刀剑更有用。',
          choices: [
            {
              text: '走出门去，不拔剑，让声名先行开路',
              result: '你只是站在那里，几名高手面面相觑，最终领头者深吸一口气，缓缓收了兵器。"今日就此罢手，他日再说。"一场仇杀消于无形，名声替你解决了这个难题。',
              effect: { fame: 25, bonds: 15 },
              flagSet: { brave: 1, righteous: 1 }
            },
            {
              text: '以气势逼退来者，让他们自行撤离',
              result: '你的目光扫过众人，无一言语，只是缓缓地站在原地。气势如山，来者终于一个个悄悄退走，连话都没留下一句。你赢了，连手都未出。',
              effect: { fame: 18, martial: 8 },
              flagSet: { brave: 1 }
            }
          ]
        }
      ]
    },
    {
      id: 'hero_s4',
      triggerRound: 12,
      title: '血债血还',
      scene: '你查明一桩陈年旧案：你曾帮助过的人家，其仇人如今已成当地一霸，继续为非作歹。那家人忍无可忍，恳求你出手。此去，凶险异常。',
      choices: [
        {
          text: '义不容辞，只身前往，了结此恩怨',
          result: '你只身赴险，血战之后，恶霸伏法。受益之家涕泪横流，全村百姓立碑称颂，恩义大涨，名望传遍四方。',
          effect: { fame: 25, bonds: 15, martial: -5 },
          flagSet: { brave: 1, righteous: 1 }
        },
        {
          text: '谋定而后动，联合多方力量一同解决',
          result: '你广发英雄帖，联合各路好汉共同出手，恶霸覆灭，无一伤亡。你的谋略与义气并重，名声大涨。',
          effect: { fame: 20, bonds: 20 },
          flagSet: { cunning: 1, righteous: 1 }
        }
      ],
      condChoices: [
        // 有结义兄弟——可召唤共同出手
        { cond: (f) => (f.sworn || 0) >= 1,
          choices: [
            { text: '召集结义兄弟，以义师之名共赴恩仇',
              result: '你一声召唤，结义兄弟不远千里赶来。兄弟并肩，恶霸见状胆裂，不战而溃。此战之名震动四方，恩义与名望皆大涨。',
              effect: { fame: 30, bonds: 25, martial: 5 },
              flagSet: { righteous: 1 } }
          ]
        }
      ],
      condEffect: [
        // 勇义双全——只身赴险效果更强
        { cond: (f) => (f.brave || 0) >= 1 && (f.righteous || 0) >= 1, idx: 0,
          add: { fame: 10, bonds: 8 },
          result: '你的勇名在前，仁义在后，此番只身赴险令江湖人无不动容。恶霸伏法后，受益之家自发在村口立碑，全城百姓传颂你的名字，名望与恩义同时大幅攀升。' }
      ]
    },
    {
      id: 'hero_s5',
      triggerRound: 16,
      title: '江湖封神',
      scene: '你的名字已令奸邪胆寒、百姓安心。有人邀你出山，官拜武职，入朝效力；也有人劝你留在江湖，继续以自由之身行侠仗义。',
      choices: [
        {
          text: '入仕为官，以体制之力行大义',
          result: '你走上了另一条路。手握官印，你的力量更大，但江湖的自由，已一去不返。名望随官职再涨。',
          effect: { fame: 20, bonds: 10 },
          flagSet: { official: 1 }
        },
        {
          text: '留在江湖，继续浪迹天涯，做一个自由的侠客',
          result: '你笑着婉拒，拍马而去，白衣如风。江湖人说，有你在，这世道多了一分公道。',
          effect: { fame: 25, martial: 10 },
          flagSet: { lone_hero: 1, righteous: 1 }
        }
      ]
    },
    {
      id: 'hero_s6',
      triggerRound: 18,
      title: '一刀封神',
      scene: '江湖上流传着你的传说已整整二十年。今日，一名不知来路的黑衣人将一封战书钉在你门上——上面只有七个字："江湖不死，你我一战。"你知道，这是真正的终局之战。',
      choices: [
        {
          text: '慨然赴约，以生死一战终结江湖传说',
          result: '月明星稀，刀光与剑影在空中交错。这是你此生最艰难的一战，也是最酣畅的一战。黑衣人最终长身而立，抱拳离去——你们彼此都明白，今日之后，江湖再无人能与你平起平坐。',
          effect: { fame: 30, martial: 15, gold: -10 },
          flagSet: { brave: 1 }
        },
        {
          text: '不应约，以一封回信宣告封刀',
          result: '你提笔回信："剑已封，刀已藏，江湖恩怨，不过是一场梦。"此信广为流传，反令你的传说更添神秘色彩——不战而屈人之兵，方为大侠之道。',
          effect: { fame: 22, bonds: 15 },
          flagSet: { righteous: 1 }
        }
      ],
      condScene: [
        {
          // 孤侠路（lone_hero≥2）：黑衣人是你当年败走的昔日对手，来了断夙愿
          cond: (f) => (f.lone_hero || 0) >= 2,
          scene: '那封战书你一眼认出——是当年让你铩羽而归的那个人的字迹。你独自行侠二十年，这是唯一一次你感觉到，那段未了的因缘，今日终须收尾。此刻的你，比二十年前更强。',
          choices: [
            {
              text: '只身赴约，了断二十年的夙愿',
              result: '你们在荒野中相遇，无言对视片刻，同时拔刀。这一战打了整整一夜。黎明时，对方拱手道："今日输得心服口服。"你笑而收刀，这段恩怨，就此了结，名望与武艺同达顶峰。',
              effect: { fame: 40, martial: 20 },
              flagSet: { brave: 1 }
            },
            {
              text: '回信：此生已了，不愿再添杀孽',
              result: '你在回信末尾写道："往事如风，当年之事各有因果，无需再战。"对方沉默良久，最终回信一字："善。"江湖人说，大侠到了最后，总是一样的答案。',
              effect: { fame: 28, bonds: 18 },
              flagSet: { righteous: 1 }
            }
          ]
        }
      ],
      condEffect: [
        // 勇名显赫路（brave≥3）：赴约时声势更大，名震天下
        { cond: (f) => (f.brave || 0) >= 3, idx: 0,
          add: { fame: 15 },
          result: '你的勇名早已传遍四方，黑衣人的挑战反令无数人自发赶来观战。这场终局之战，成了天下人共同见证的一段传奇。大战结束，观战之人无不拜服，你的名字，自此与天地同寿。' }
      ]
    }
  ]
};

// ==================== 结局定义 ====================

const ENDINGS = {
  gold_zero: {
    type: 'defeat',
    title: '断炊之困',
    badge: '✗ 大业未竟',
    story: '钱粮告罄，军心涣散，人心离散。纵有雄心壮志，奈何巧妇难为无米之炊。你的传奇，就此画上了句号。\n\n后世之人提起这段历史，只余一声叹息。'
  },
  favor_zero: {
    type: 'defeat',
    title: '圣怒难逃',
    badge: '✗ 仕途尽毁',
    story: '皇帝龙颜大怒，一纸罪诏送达，你被贬为庶民，永不录用。多年心血付诸东流。\n\n你收拾细软，隐入山野，了此残生。那一段荣光，如今只在梦中重现。'
  },
  power_triumph: {
    type: 'victory',
    title: '权倾天下',
    badge: '✦ 功成名就',
    story: '你以无与伦比的手腕掌控朝堂，满朝文武无不俯首听命。皇帝不过是你手中的棋子，天下权柄，尽归一身。\n\n你的名字，将永载史册——无论忠奸，后人皆要仰视这段传奇。'
  },
  favor_triumph: {
    type: 'victory',
    title: '股肱之臣',
    badge: '✦ 千古名臣',
    story: '皇帝对你信任有加，朝野皆知你是社稷之臣。你辅佐明君，开创盛世，百姓安居乐业。\n\n史书将以最美好的笔墨书写你的一生，你的名字，将与这个盛世永远联结在一起。'
  },
  troops_zero: {
    type: 'defeat',
    title: '兵败身死',
    badge: '✗ 大业覆灭',
    story: '最后一支义军覆灭，你被官军层层围困。你的旗帜倒在了血泊之中，那一声呐喊，就此沉寂。\n\n一场轰轰烈烈的起义，在这一刻成了历史的烟尘。'
  },
  territory_triumph: {
    type: 'victory',
    title: '问鼎天下',
    badge: '✦ 开国之君',
    story: '旌旗半天下，民心归一处。你的铁蹄踏遍故地，山河重整，改朝换代之日，你君临天下，开创新朝。\n\n千百年后，史书将以厚重的笔墨铭记这段波澜壮阔的历史，而开国之君的名字，永不磨灭。'
  },
  survive_court: {
    type: 'survive',
    title: '仕途沉浮',
    badge: '⊙ 传奇未竟',
    story: '二十载宦海沉浮，你历经无数风浪，终于在这片朝堂站稳了脚跟。\n\n你的故事尚未结束——这只是第一章。你已证明自己有在这个世界生存的能力，而更大的波澜，还在前方等待着你。'
  },
  survive_rebel: {
    type: 'survive',
    title: '割据一方',
    badge: '⊙ 枭雄未灭',
    story: '二十年烽火岁月，你在乱世中艰难存活，割据一方，成为不可小觑的一路枭雄。\n\n天下未定，英雄尚在。你已经证明了自己，而问鼎天下之路，还远未结束。'
  },
  power_triumph_usurper: {
    type: 'victory',
    title: '权奸乱国',
    badge: '✦ 位极人臣',
    story: '你以权谋手段架空皇权，满朝文武皆出你门下。百姓私下议论，史书将如何记载你——奸臣，还是权臣？你不在乎。\n\n天下权柄在手，生杀予夺，唯你一言而决。这一段权奸传奇，将令后世既惧且叹。'
  },
  favor_triumph_judge: {
    type: 'victory',
    title: '铁面宰辅',
    badge: '✦ 青史留名',
    story: '你以忠直廉洁著称，以铁面断案闻名。皇帝对你信任如故，百官对你又敬又怕。\n\n你的一生，是一部关于坚守的传奇。史家将你列入"名臣传"首位，千载之下，犹让人肃然起敬。'
  },
  territory_triumph_righteous: {
    type: 'victory',
    title: '仁义开国',
    badge: '✦ 民心所向',
    story: '你一路秉持仁义，不屠城、不强掠，所到之处百姓安堵。天下归心，四方来附。\n\n你建立的新朝，以仁政立国。史书将你誉为"千古仁君"——这是最难得的赞誉，也是你用一生换来的答案。'
  },
  wealth_triumph: {
    type: 'victory',
    title: '天下首富',
    badge: '✦ 富可敌国',
    story: '你的财富横跨万里商路，一掷千金不费吹灰之力。天下权贵皆需仰仗你的钱财，就连皇帝也不得不正视你的存在。\n\n史书虽少记商贾之名，但民间流传着你的传说——那个从无到有、以一己之力撬动天下财富的奇商。'
  },
  wealth_triumph_righteous: {
    type: 'victory',
    title: '儒商典范',
    badge: '✦ 义利双全',
    story: '你富可敌国，却始终未忘义字当先。你资助灾民，扶持弱小，打破垄断，让财富流向更多人。\n\n天下人称你为"儒商"——既有生意头脑，更有侠义胸怀。这是商人所能获得的最高赞誉。'
  },
  prestige_zero: {
    type: 'defeat',
    title: '声名狼藉',
    badge: '✗ 商誉尽毁',
    story: '你的名声在商界彻底烂掉了。无人再与你做生意，铺面一家家倒闭，曾经络绎不绝的商路，如今门可罗雀。\n\n你带着空空如也的账本，从此隐没在市井之间，再也无人提起。'
  },
  survive_merchant: {
    type: 'survive',
    title: '富甲一方',
    badge: '⊙ 商路未竟',
    story: '二十年走南闯北，你积下了相当的家业，在这一方天地算得上名商巨贾。\n\n但你知道，天下首富之路还未走到尽头。更大的商机，正在前方等待。'
  },
  hero_triumph: {
    type: 'victory',
    title: '江湖传说',
    badge: '✦ 名震天下',
    story: '你的名字，令奸邪胆寒，令百姓安心。走过万里山河，留下了无数关于正义的故事。\n\n人们说，这天下虽乱，但有你在，总有一道光不曾熄灭。你的传奇，将在江湖中世代流传。'
  },
  hero_triumph_justice: {
    type: 'victory',
    title: '千古大侠',
    badge: '✦ 恩义无双',
    story: '你用一生积下的恩义，如同巨网般笼罩四方。每一个受你庇护的人，都成了你名声的见证。\n\n后人记录你的传奇时，说的不只是你有多厉害，而是有多少人因你而改变了命运。这才是真正的大侠。'
  },
  survive_hero: {
    type: 'survive',
    title: '江湖浪人',
    badge: '⊙ 侠路未尽',
    story: '二十年仗剑天涯，你留下了数不清的故事，结交了许多江湖好汉。\n\n但传说还未写完，更大的义举还在前方等待。你勒紧马鞍，继续上路——江湖，永远不缺侠客的舞台。'
  },

  // ==================== 自然死亡结局（寿终正寝类）====================
  // 官场：高圣眷/权柄→安享荣华，中等→平淡致仕，低→郁郁而终
  death_court_high: {
    type: 'death',
    title: '安享荣华',
    badge: '✧ 致仕归田',
    story: '二十年宦海，你在朝堂间博弈周旋，终于到了告老还乡的年岁。皇恩浩荡，赐你锦衣玉食，颐养天年。\n\n青山绿水间，你回望这一生的起伏，心中再无遗憾。儿孙绕膝，此生已足。'
  },
  death_court_mid: {
    type: 'death',
    title: '平淡致仕',
    badge: '✧ 归隐林泉',
    story: '二十载仕途，波澜不惊，不曾大起也不曾大落。你以普通官员的身份告老，领了薄薄的养廉银，回到故乡。\n\n邻里依旧认识你，你也记得每一张熟悉的脸。平凡，也是一种圆满。'
  },
  death_court_low: {
    type: 'death',
    title: '郁郁而终',
    badge: '✧ 壮志未酬',
    story: '二十年的挣扎与等待，终究没能等到飞黄腾达的那一天。年岁渐老，圣眷已去，你在一间清冷的官署里结束了这一世的仕途梦。\n\n史书不会记你，但你曾真实地活过，这已是你所能得到的全部。'
  },
  // 造反：地盘/民心高→割据封侯，中等→乱世老兵，低→兵败老死
  death_rebel_high: {
    type: 'death',
    title: '割据封侯',
    badge: '✧ 一方诸侯',
    story: '你未能问鼎天下，却在这片土地上建立了自己的王国。暮年之时，你坐在自己守护的城池之上，看着百姓安居，心中再无憾恨。\n\n后人称你为乱世中少有的仁义诸侯。这一生，值了。'
  },
  death_rebel_mid: {
    type: 'death',
    title: '乱世老兵',
    badge: '✧ 沙场岁月',
    story: '你征战二十年，见过无数生死。最终，既没有君临天下，也没有马革裹尸——你只是老了，回到了营地，把刀交给了下一个年轻人。\n\n这一生，你是乱世的见证者。平凡的英雄，也是英雄。'
  },
  death_rebel_low: {
    type: 'death',
    title: '兵败老死',
    badge: '✧ 壮志难酬',
    story: '兵散粮尽，麾下的儿郎各奔东西。你在残垣断壁间度过了余生，没有繁华，没有荣光。\n\n但你曾经振臂高呼，曾经在这乱世中燃烧过——哪怕火已熄灭，你也真实地存在过。'
  },
  // 富商：财富高→富甲致老，中等→小康晚年，低→薄产终老
  death_merchant_high: {
    type: 'death',
    title: '富甲致老',
    badge: '✧ 家财万贯',
    story: '二十年走南闯北，你积累下了令人艳羡的财富。暮年之时，你把商号交给子侄，在老宅里安享晚年。\n\n子孙满堂，家业长存。商人这一生，你活得比大多数人都要圆满。'
  },
  death_merchant_mid: {
    type: 'death',
    title: '小康晚年',
    badge: '✧ 平稳度日',
    story: '你没能成为天下首富，但也攒下了够用一生的家业。孩子们各有营生，老伴陪在身边，日子虽平淡，却也温暖。\n\n有时你会想，若当年再拼一把，结果会不会不同？但转念一想，这平静的晚年，也是福气。'
  },
  death_merchant_low: {
    type: 'death',
    title: '薄产终老',
    badge: '✧ 浮沉商海',
    story: '商场沉浮，起起落落，最终你带着不多的积蓄回到了最初出发的地方。没有大富大贵，但总算平平安安地走到了终点。\n\n或许，活着本身就已经是答案了。'
  },
  // 侠客：名望/武艺高→名宿归隐，中等→江湖老人，低→无名老侠
  death_hero_high: {
    type: 'death',
    title: '名宿归隐',
    badge: '✧ 一代宗师',
    story: '你的名字在江湖上流传了二十年，年岁渐老，你选择在一处山清水秀之地隐居，收了几个徒弟，把一生所学传授下去。\n\n侠之大者，不在杀伐，而在传承。你的故事，将由后人继续。'
  },
  death_hero_mid: {
    type: 'death',
    title: '江湖老人',
    badge: '✧ 游侠终章',
    story: '二十年仗剑江湖，你见过的风景比大多数人一生都多。老了，走不动了，你在一座小镇上停了下来，开了一间小酒馆。\n\n往来的江湖人偶尔会来讨酒喝，你给他们讲年轻时的故事，讲那些刀光剑影的岁月。'
  },
  death_hero_low: {
    type: 'death',
    title: '无名老侠',
    badge: '✧ 默默无闻',
    story: '你闯荡了二十年，却始终没能留下一个响亮的名字。老了，独自在一处破庙里躺下，回想这一生，心里没有什么遗憾——你做过该做的事，够了。\n\n无名，也是一种自由。'
  },

  // ==================== 积劳而亡结局（体魄耗尽，提前终结）====================
  death_exhaustion_court: {
    type: 'death',
    title: '积劳成疾',
    badge: '✧ 鞠躬尽瘁',
    story: '多年来你在朝堂间博弈、钻营、周旋，从未真正让自己歇过片刻。\n\n那一日，你在官署的灯下批完最后一份公文，便再也没有起来。朝中有人叹惋，有人窃喜——而你，只是先于所有人，放下了这一切。\n\n或许太拼了些。但你曾真实地燃烧过。'
  },
  death_exhaustion_rebel: {
    type: 'death',
    title: '壮志未酬',
    badge: '✧ 沙场耗尽',
    story: '征战多年，你的身体早已在一次次出征中透支殆尽。将士们都说你是铁人，但铁也会锈，也会折。\n\n某个秋日的清晨，你倒在了中军帐里。旗帜还在猎猎作响，问鼎天下的梦却永远停在了这里。\n\n那些随你浴血的兄弟，会记得你的。'
  },
  death_exhaustion_merchant: {
    type: 'death',
    title: '商海力竭',
    badge: '✧ 操劳而终',
    story: '走南闯北、日夜算计，你把全部精力都押在了这片商路上。账目还未结清，新的买卖还在谈判，可身体已经先一步宣告了终结。\n\n你倒在了账房里，手边是半写的账簿。外头还有人催着问货期，没人知道东家再也不会回来。\n\n钱财带不走，但你曾经拼过，这已足够。'
  },
  death_exhaustion_hero: {
    type: 'death',
    title: '侠骨已折',
    badge: '✧ 力竭而逝',
    story: '每一次出剑，你都不曾留力；每一次义举，你都倾尽所有。江湖的代价，终于在此刻一并算清。\n\n你坐在一块山石上，看着最后一缕晚霞，手中的剑再也举不起来了。\n\n有人在远方传唱你的名字，你微微一笑，闭上了眼。这一生，值了。'
  },

  // ==================== NPC 盟友专属结局 ====================
  // 官场路：与权相李崇关系≥70 → 联手登顶
  favor_triumph_npc_minister: {
    type: 'victory',
    title: '相辅相成',
    badge: '✦ 朝中双璧',
    story: '你与权相李崇，从最初的互相试探，到最终成为朝堂上相互支撑的两根柱石。\n\n皇帝倚重你的忠诚，也赖于李崇的才干。你们配合默契，朝政清明，天下称颂"朝中双璧"。\n\n史书上，你们的名字永远并列于同一页。这不是你单独的胜利，但也因此，格外厚重。'
  },

  // 造反路：与徐长风关系≥70 → 义军霸业
  territory_triumph_npc_general: {
    type: 'victory',
    title: '义结金兰',
    badge: '✦ 霸业双雄',
    story: '你与徐长风，从义军中的两股势力，到歃血为盟的生死兄弟。这条路，你们一起走来。\n\n攻城略地之时，你在左，他在右；分配战利之时，他从无异议；建立新政之时，他甘心辅佐。\n\n开国大典上，你封他为第一功臣。史书将你们的情义，作为乱世中最罕见的珍宝，永久传颂。'
  },

  // 富商路：与沈万钧关系≥70 → 商业帝国
  wealth_triumph_npc_tycoon: {
    type: 'victory',
    title: '商界双雄',
    badge: '✦ 天下商路',
    story: '你与沈万钧，从竞争对手，到商业盟友，最终建立起一个横跨天下的商业帝国。\n\n两人商路联通，财富合流，你们共同把控着大半个天下的粮食、绸缎与盐铁。就连皇帝的内库，也不得不仰仗你们的周济。\n\n史书少记商人，但民间流传：那两个把天下变成自家商铺的传奇人物，一个叫沈万钧，另一个，就是你。'
  },

  // 侠客路：与燕无双关系≥70 → 武林盟主
  hero_triumph_npc_master: {
    type: 'victory',
    title: '宗主传承',
    badge: '✦ 武林新主',
    story: '燕无双亲自将武林盟主的位置传给你——这是他在江湖中漂泊数十年后，第一次真正信任一个人。\n\n武林大会上，你接过令牌，江湖中所有门派俯首拜贺。燕无双在台下，罕见地展露了一个真诚的笑容。\n\n你成为了一代宗主。而那段从陌生到知己的情谊，比武艺、比名望，更让你珍视——它让你知道：侠义不是孤独的事。'
  },

  // ==================== 动态分支结局（flag驱动）====================

  // 官场·朝堂棋手：cunning>=2 且 factioner>=2 → 以智谋操控朝局，不同于单纯权臣
  power_triumph_schemer: {
    type: 'victory',
    title: '朝堂棋手',
    badge: '✦ 运筹帷幄',
    story: '你从未出手伤人，却让对手一个个倒在自己的失误里。借力打力，以势压人，满朝文武皆以为自己是你的棋子，却不知你才是那个落子无悔的人。\n\n史书上，你不会被称为"奸臣"，也不会被誉为"忠臣"——你是那种让后世史家研究了千年仍争论不休的谜一样的人物。'
  },

  // 官场·社稷忠魂：loyal>=3，极度忠诚，无铁面之名却有赤胆之心
  favor_triumph_loyal: {
    type: 'victory',
    title: '社稷忠魂',
    badge: '✦ 一代忠臣',
    story: '你以一腔赤忱效忠皇帝，不曾背叛，不曾算计，所得所失皆出于本心。朝堂风云变幻，你始终站在皇帝身边。\n\n皇帝临终前握住你的手说："天下若多几个你这样的人，朕何愁大业不成。"后人称你为"天子第一忠臣"——那是你用一生换来的最高赞誉。'
  },

  // 造反·铁血枭雄：ruthless>=2，以雷霆手段定天下
  territory_triumph_ruthless: {
    type: 'victory',
    title: '铁血枭雄',
    badge: '✦ 杀伐果决',
    story: '你的旗帜之下，从无二心之人，也从无叛逃之将——因为所有人都知道，背叛的代价是什么。你以雷霆之势荡平乱世，问鼎天下之路上，手段冷酷，但每一刀都指向目标。\n\n后世对你褒贬不一：有人说你残暴，有人说你是乱世必须的那把刀。无论如何，天下太平了。那把刀的功过，就由后人去评说吧。'
  },

  // 造反·谋定天下：cunning>=2，以谋略而非蛮力定鼎江山
  territory_triumph_cunning: {
    type: 'victory',
    title: '谋定天下',
    badge: '✦ 谋略无双',
    story: '你很少亲自上战场，却赢得了每一场关键的战争。借刀杀人，以利诱人，以势逼人——当别人还在拼兵力的时候，你已经把结局算好了。\n\n天下归一，史家评你："此人不战而屈人之兵，真正的乱世军师——然而他是主公，不是谋士。"这比任何赞誉都更令人玩味。'
  },

  // 富商·商界枭雄：cunning>=2，以算计横扫商界
  wealth_triumph_cunning: {
    type: 'victory',
    title: '商界枭雄',
    badge: '✦ 市无对手',
    story: '你从不打没把握的仗。情报先行，时机再行，出手必胜。竞争对手们发现，和你做生意，他们总是在不知不觉间落入你布置好的局中。\n\n天下首富，不是靠运气，是靠算计。你的对手中，有人佩服你，有人恨你，但没有人敢轻视你——这，才是商界最真实的尊重。'
  },

  // 侠客·武道宗师：brave>=2，以无畏勇气名震天下
  hero_triumph_brave: {
    type: 'victory',
    title: '武道宗师',
    badge: '✦ 天下无双',
    story: '二十年行侠仗义，你的剑从未斩向无辜，却也从未在强敌面前退缩。每一场硬仗，你都是第一个冲上去的人。\n\n武林中人都说：此人胆气天下第一。燕无双亲口承认："与他交手，我从未在任何人眼中见过那种勇气。"后世将你列为"武道宗师"，不仅因为武艺，更因为那份令人动容的勇气。'
  },

  // 侠客·孤侠传说：lone_hero>=1，无门无派却令天下折服
  hero_triumph_lone: {
    type: 'victory',
    title: '孤侠传说',
    badge: '✦ 独行天下',
    story: '你从不依附任何门派，也不需要任何人为你背书。一人一剑，走遍天下，以实力和德行赢得了整个江湖的尊重。\n\n江湖人说：天下侠客有门派的，也有无门无派的。但无门无派还能令天下人折服的，只有这一个。这种孤绝的风骨，反而成了最令人向往的传说。'
  },

  // 造反路：sovereign>=1 且 general>=70 → 天命所归（最高阶开国结局）
  territory_triumph_sovereign: {
    type: 'victory',
    title: '天命所归',
    badge: '✦ 真命天子',
    story: '徐长风亲手将受降旗交到你手中——这一刻，满营将士皆下跪称主。\n\n你们从生死患难中走来，他的忠诚不是因为你强大，而是因为你值得跟随。攻克京城之日，百姓箪食壶浆，迎接的不只是胜者，而是他们所期盼的天命之主。\n\n开国大典上，徐长风执剑立于你左侧。史书以"天命所归，万民来附"八个字，为你的继位作注脚——这是历史给予的最高背书。'
  },

  // 侠客路：sworn>=1 且 master>=70 → 武林盟主（正式受命，高于宗主传承）
  hero_triumph_master_sworn: {
    type: 'victory',
    title: '武林盟主',
    badge: '✦ 一代宗主',
    story: '燕无双在大会上当众宣布："此人是我启迪的第一个，也是前无古人的最后一个——从此，武林总盟由他监管，江湖共鉴。"\n\n你接过令牌，全场江湖赤人齐声高呼。却记得当初与燕无双第一次相遇，他说："江湖路很宽，但能走到最后的人很少。"\n\n现在你走到了。利剑、名望、义气——这三者都属于你。当年那个骑马一人一剑仗剑走天涯的少年，成了江湖英雄们向往的一代宗主。'
  }
};

// ==================== 游戏状态机 ====================

var Game = (() => {
  let state = null;

  function init() {
    state = {
      phase: 'create',
      player: {
        gender: 'male',
        origin: null,
        track: null,
        ambition: null,  // 个人志向（ambition 阶段选定）
        title: ''
      },
      resources: {},
      actionPoints: 3,
      usedPoints: 0,
      round: 1,
      maxRounds: 20,
      flags: {},
      triggeredStories: [],
      pendingStory: null,
      pendingTransition: null,
      log: [],
      timeline: [],      // 人生时间线（里程碑事件，无上限）
      currentEnding: null,
      // NPC 关系值（0-100），由 setTrack 时按赛道初始化
      npcs: {},
      // NPC 事件冷却（记录已触发事件，防止频繁重复）
      npcCooldown: {},
      // 世界状态指标
      world: {
        stability: 70,  // 天下安定（0-100），高=治世，低=乱世
        unrest: 25      // 民间动荡（0-100），高=民不聊生，低=安居乐业
      },
      // 最近一次行动的资源变化量（用于 UI 浮动数字提示）
      lastResDelta: {},
      // 战役状态（手动战斗进行中时非 null）
      battle: null
    };
    // 防御性调用：init 在 UI 可能尚未加载时执行
    if (typeof UI !== 'undefined') UI.render();
  }

  function setGender(g) {
    state.player.gender = g;
    UI.render();
  }

  function setOrigin(originId) {
    state.player.origin = originId;
    UI.render();
  }

  function confirmCreate() {
    if (!state.player.origin) return;
    state.phase = 'track';
    UI.render();
  }

  function setTrack(trackId) {
    state.player.track = trackId;
    const origin = ORIGINS[state.player.origin];
    state.resources = { ...origin.resources[trackId] };
    // 体魄初始满值（所有赛道共用）
    state.resources.vitality = 100;
    state.player.title = state.player.gender === 'male' ? origin.titleMale : origin.titleFemale;
    // 初始化该赛道的 NPC 关系值（初始 20，代表陌生人但有所耳闻）
    Object.values(NPC_DATA).forEach(npc => {
      if (npc.tracks.includes(trackId)) {
        state.npcs[npc.id] = 20;
      }
    });
    // 进入志向选择阶段（而非直接进入 play）
    state.phase = 'ambition';
    UI.render();
  }

  // ==================== 个人志向选定 ====================
  function setAmbition(ambitionId) {
    if (!AMBITIONS[ambitionId]) return;
    state.player.ambition = ambitionId;
    state.phase = 'play';
    const amb = AMBITIONS[ambitionId];
    const trackName = TRACKS[state.player.track].name;
    addLog('system', `${state.player.title}，志在【${amb.name}】，踏上【${trackName}】。传奇，从此刻开始。`);
    // 人生时间线：开局里程碑
    addTimeline('🌅', `踏上【${trackName}】，立志【${amb.name}】`);
    // 埋点：游戏开始
    if (typeof trackEvent === 'function') {
      trackEvent('game_start', {
        origin: state.player.origin,
        track: state.player.track,
        gender: state.player.gender,
        ambition: ambitionId
      });
    }
    UI.render();
  }

  // ==================== 志向加成辅助函数 ====================
  // 赛道主资源映射（用于 mainRes 类型志向加成）
  const TRACK_MAIN_RES = { court: 'favor', rebel: 'morale', merchant: 'prestige', hero: 'martial' };

  function applyAmbitionBonus(actionId) {
    const amb = state.player.ambition ? AMBITIONS[state.player.ambition] : null;
    if (!amb || amb.bonusActionId !== actionId) return;
    const bonusEffect = {};
    if (amb.bonusKey === 'mainRes') {
      const resKey = TRACK_MAIN_RES[state.player.track] || 'gold';
      bonusEffect[resKey] = amb.bonusVal;
    } else if (amb.bonusKey === 'benevolent') {
      // benevolent 存在 flags 中
      state.flags.benevolent = (state.flags.benevolent || 0) + amb.bonusVal;
    } else {
      bonusEffect[amb.bonusKey] = amb.bonusVal;
    }
    if (Object.keys(bonusEffect).length > 0) applyEffect(bonusEffect);
    addLog('action', `【${amb.name}】顺应志向，额外收获。`);
  }

  function doAction(actionId) {
    state.lastResDelta = {}; // 每次行动前清零 delta
    const npcAction = NPC_ACTIONS[state.player.track];
    if (npcAction && npcAction.id === actionId) {
      const remaining = state.actionPoints - state.usedPoints;
      if (npcAction.cost > remaining) {
        addLog('warn', '行动点不足，无法执行此行动。');
        UI.render();
        return;
      }
      state.usedPoints += npcAction.cost;
      applyEffect(npcAction.effect);
      // 提升 NPC 关系值
      const nid = npcAction.npcId;
      state.npcs[nid] = Math.min(100, (state.npcs[nid] || 0) + npcAction.npcEffect);
      const logText = pick(npcAction.results);
      const npc = NPC_DATA[nid];
      addLog('npc', `【${npc.name}】${logText}`);
      checkEnd();
      UI.render();
      return;
    }

    // 检查是否是通用行动
    const commonAction = COMMON_ACTIONS.find(a => a.id === actionId);
    if (commonAction) {
      const remaining = state.actionPoints - state.usedPoints;
      if (commonAction.cost > remaining) {
        addLog('warn', '行动点不足，无法执行此行动。');
        UI.render();
        return;
      }
      state.usedPoints += commonAction.cost;
      applyEffect(commonAction.effect);
      // 应用赛道专属加成（读书/游历类）
      if (commonAction.trackBonus && commonAction.trackBonus[state.player.track]) {
        applyEffect(commonAction.trackBonus[state.player.track]);
      }
      // 应用 flag 效果（接济百姓/打探消息）
      if (commonAction.flag) {
        Object.entries(commonAction.flag).forEach(([k, v]) => {
          state.flags[k] = (state.flags[k] || 0) + v;
        });
      }
      // 应用个人志向加成
      applyAmbitionBonus(actionId);
      const logText = pick(commonAction.results);
      addLog('action', `【${commonAction.name}】${logText}`);
      checkEnd();
      UI.render();
      return;
    }

    const actions = ACTIONS[state.player.track];
    const action = actions.find(a => a.id === actionId);
    if (!action) return;

    const remaining = state.actionPoints - state.usedPoints;
    if (action.cost > remaining) {
      addLog('warn', '行动点不足，无法执行此行动。');
      UI.render();
      return;
    }

    state.usedPoints += action.cost;

    // 判断是否触发风险或失败
    let isFail = false;
    let isRisk = false;

    if (action.failChance && Math.random() < action.failChance) {
      isFail = true;
    } else if (action.riskChance && Math.random() < action.riskChance) {
      isRisk = true;
    }

    // 应用效果
    if (isFail) {
      applyEffect(action.failEffect || {});
    } else if (isRisk && action.riskEffect) {
      applyEffect(action.riskEffect);
    } else {
      applyEffect(action.effect);
    }

    // 季节加成：成功时才触发（失败/风险不享受当季加成）
    let seasonBonusTriggered = false;
    if (!isFail && !isRisk && action.seasonBonus && action.seasonBonus.season === state.season) {
      applyEffect(action.seasonBonus.keys);
      seasonBonusTriggered = true;
    }

    // 武将特性：征兵额外+5
    const origin = ORIGINS[state.player.origin];
    if (origin.traitBonus && origin.traitBonus.action === actionId) {
      applyEffect({ [origin.traitBonus.key]: origin.traitBonus.val });
    }

    // 选取结果文字
    let logText;
    if (isFail && action.failResults) {
      logText = pick(action.failResults);
    } else if (isRisk && action.riskResults) {
      logText = pick(action.riskResults);
    } else {
      logText = pick(action.results);
    }

    addLog('action', `【${action.name}】${logText}`);

    // 季节加成日志提示
    if (seasonBonusTriggered) {
      addLog('hint', `✦ 当季加成（${action.seasonBonus.season}·${action.seasonBonus.hint}）`);
    }

    // 行为记忆追踪（用于世界记忆事件条件判断）
    const behaviorMap = {
      court:    { extort: 'extort_used', diligent: 'diligent_used', bribe: 'bribe_used', memorial: 'memorial_used' },
      rebel:    { attack: 'attack_used', relief: 'relief_used', recruit: 'recruit_used' },
      merchant: { hoard: 'hoard_used', lending: 'lending_used' },
      hero:     { justice: 'justice_used', train: 'train_used', roam: 'roam_used' }
    };
    const bm = behaviorMap[state.player.track] || {};
    if (bm[actionId]) state.flags[bm[actionId]] = (state.flags[bm[actionId]] || 0) + 1;

    checkEnd();
    UI.render();
  }

  // ==================== 自然死亡结局判定 ====================
  // 根据赛道和主资源水平，判定三级自然死亡结局 ID
  function buildDeathEnding(track, res, flags) {
    // 仁义加成：benevolent >= 3 升一级结局
    const benevolentBonus = (flags.benevolent || 0) >= 3;

    if (track === 'court') {
      const score = (res.favor || 0) + (res.power || 0) * 0.5;
      if (score >= 60 || benevolentBonus && score >= 40) return 'death_court_high';
      if (score >= 25) return 'death_court_mid';
      return 'death_court_low';
    }
    if (track === 'rebel') {
      const score = (res.territory || 0) + (res.morale || 0) * 0.5;
      if (score >= 70 || benevolentBonus && score >= 50) return 'death_rebel_high';
      if (score >= 30) return 'death_rebel_mid';
      return 'death_rebel_low';
    }
    if (track === 'merchant') {
      const score = (res.wealth || 0) + (res.prestige || 0) * 0.3;
      if (score >= 60 || benevolentBonus && score >= 40) return 'death_merchant_high';
      if (score >= 25) return 'death_merchant_mid';
      return 'death_merchant_low';
    }
    if (track === 'hero') {
      const score = (res.fame || 0) + (res.martial || 0) * 0.5;
      if (score >= 70 || benevolentBonus && score >= 50) return 'death_hero_high';
      if (score >= 30) return 'death_hero_mid';
      return 'death_hero_low';
    }
    return 'death_court_mid'; // 兜底
  }

  function endRound() {
    // 若游戏已结束则不执行（防止 story/transition 覆盖结局）
    if (state.phase !== 'play') return;
    // 埋点：回合完成
    if (typeof trackEvent === 'function') {
      trackEvent('round_complete', { round: state.round, track: state.player.track });
    }
    state.lastResDelta = {}; // 每个回合结束前清零 delta
    const origin = ORIGINS[state.player.origin];
    if (origin.traitBonus && !origin.traitBonus.action && !origin.traitBonus.track) {
      applyEffect({ [origin.traitBonus.key]: origin.traitBonus.val });
    }
    // 寒门学子：官场圣眷微增
    if (origin.traitBonus && origin.traitBonus.track === state.player.track) {
      applyEffect({ [origin.traitBonus.key]: origin.traitBonus.val });
    }

    // 随机被动/互动事件
    const passiveChance = (state.flags.informed || 0) > 0 ? 0.32 : 0.65;
    if ((state.flags.informed || 0) > 0) state.flags.informed = 0; // 消耗 informed 状态（一次性）
    if (Math.random() < passiveChance) {
      // 优先检查：世界记忆事件（玩家行为的因果反馈，自动应用）
      const worldEvts = WORLD_EVENTS[state.player.track] || [];
      const matchedWorld = worldEvts.filter(we => we.cond(state.flags, state.resources));
      // 动荡高时，负面世界事件权重加倍
      let worldPool = matchedWorld.slice();
      if ((state.world.unrest || 0) >= 60) {
        worldPool = worldPool.concat(worldPool.filter(e => Object.values(e.effect || {}).some(v => v < 0)));
      }

      if (worldPool.length > 0 && Math.random() < 0.6) {
        // 世界记忆事件：自动应用（行为后果，不需玩家决策）
        const worldEvt = worldPool[Math.floor(Math.random() * worldPool.length)];
        applyEffect(worldEvt.effect);
        addLog('event', `【天下事】${worldEvt.text}`);
      } else {
        // 互动事件：需玩家做选择
        const pool = PASSIVE_EVENTS[state.player.track].slice();
        const evt = pool[Math.floor(Math.random() * pool.length)];
        if (typeof window !== 'undefined') {
          // 浏览器：暂停等待玩家选择，在 chooseReaction() 中继续
          state.pendingEvent = evt;
          state.phase = 'react';
          UI.render();
          return;
        } else {
          // Node.js/测试模式：自动选第一个选项
          applyEffect(evt.choices[0].effect);
          addLog('event', `【天下事】${evt.text}`);
        }
      }
    }

    continueRoundEnd();
  }

  // 玩家对互动事件做出选择后继续回合
  function chooseReaction(choiceIdx) {
    if (state.phase !== 'react') return;
    const evt = state.pendingEvent;
    if (!evt || !evt.choices || !evt.choices[choiceIdx]) return;
    const choice = evt.choices[choiceIdx];
    applyEffect(choice.effect);
    addLog('event', `【天下事】${evt.text}（${choice.desc}）`);
    state.pendingEvent = null;
    state.phase = 'play';
    continueRoundEnd();
  }

  // 回合结束后半程：世界状态更新 → round++ → 结局检查 → 故事/NPC事件
  function continueRoundEnd() {
    const w = state.world;
    // 自然漂移：天下安定随时间略微降低，民间动荡略微升高
    w.stability = Math.max(0, Math.min(100, w.stability + (Math.random() < 0.35 ? -2 : 1)));
    w.unrest    = Math.max(0, Math.min(100, w.unrest    + (Math.random() < 0.25 ? -1 : 2)));
    // 玩家行为影响世界状态
    if (state.player.track === 'court') {
      // 官场玩家圣眷高→稳定天下
      const favLvl = Math.round((state.resources.favor || 0) / 40);
      w.stability = Math.min(100, w.stability + favLvl);
    }
    if (state.player.track === 'rebel') {
      // 造反玩家兵多→天下动乱
      const troopPressure = Math.floor((state.resources.troops || 0) / 25);
      w.stability = Math.max(0, w.stability - troopPressure);
      w.unrest    = Math.min(100, w.unrest + 2);
    }
    // 接济百姓（benevolent）降低民间动荡
    if ((state.flags.benevolent || 0) > 0) {
      w.unrest = Math.max(0, w.unrest - (state.flags.benevolent || 0) * 2);
    }
    // 官场压榨（extort_used）增加民间动荡
    if ((state.flags.extort_used || 0) >= 3) {
      w.unrest = Math.min(100, w.unrest + 2);
    }
    // 官场安定低时，圣眷额外衰减（体现官场高压）
    if (state.player.track === 'court' && w.stability < 35) {
      applyEffect({ favor: -3 });
      addLog('event', '【天下】乱世之象已现，朝廷动荡，圣眷难维。');
    }

    state.round++;
    state.usedPoints = 0;

    // 里程碑年份写入人生时间线（第5/10/15/20年）
    const milestoneYears = { 5: '初识世界', 10: '壮志渐显', 15: '沧桑已半', 20: '人生将暮' };
    const YEAR_CN = ['元','二','三','四','五','六','七','八','九','十',
                     '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十'];
    if (milestoneYears[state.round]) {
      const track = state.player.track;
      const r = state.resources;
      const mainResMap = { court: r.favor, rebel: r.morale || r.troops, merchant: r.prestige, hero: r.fame || r.martial };
      const mainVal = mainResMap[track] || 0;
      const milestone = milestoneYears[state.round];
      const resDesc = mainVal >= 70 ? '声名鹊起' : mainVal >= 40 ? '稳步前行' : '命途多舛';
      const yrCN = YEAR_CN[Math.min(state.round - 1, 19)];
      addTimeline('⭐', `乾明${yrCN}年·${milestone}——${resDesc}`);
    }

    if (state.round > state.maxRounds) {
      // 自然死亡结局：按主资源水平分三级
      triggerEnding(buildDeathEnding(state.player.track, state.resources, state.flags));
      return;
    }

    // 先检查胜负条件（最高优先级）
    checkEnd();
    if (state.phase !== 'play') {
      UI.render();
      return;
    }

    // 再检查是否触发主线剧情事件（含战役事件）
    const storyEvt = getStoryEvent();
    if (storyEvt) {
      state.triggeredStories.push(storyEvt.id);
      // 战役事件：初始化战斗状态并进入战斗界面
      if (storyEvt.type === 'battle') {
        state.battle = {
          event: storyEvt,
          playerHp: storyEvt.playerHp,
          playerMaxHp: storyEvt.playerHp,
          enemyHp: storyEvt.enemyHp,
          enemyMaxHp: storyEvt.enemyHp,
          round: 1,
          maxRounds: storyEvt.maxRounds || 3,
          log: [],
          done: false,
          won: null
        };
        state.pendingStory = storyEvt; // 复用 phase 判断
        state.phase = 'story';
        saveGame();
        UI.render();
        return;
      }
            state.pendingStory = resolveStoryEvent(storyEvt, state.flags, state.resources);
      state.phase = 'story';
      saveGame(); // 自动存档
      UI.render();
      return;
    }

    // 最后检查 NPC 关系事件（优先级最低，不覆盖主线故事）
    checkNpcEvent();

    saveGame(); // 自动存档
    UI.render();
  }

  // ==================== NPC 关系事件触发 ====================
  function checkNpcEvent() {
    if (Math.random() > 0.35) return;  // 35% 概率触发 NPC 事件
    const track = state.player.track;
    // 找到关联当前赛道且关系值 > 0 的 NPC
    const activeNpc = Object.values(NPC_DATA).find(npc =>
      npc.tracks.includes(track) && (state.npcs[npc.id] || 0) > 0
    );
    if (!activeNpc) return;
    const rel = state.npcs[activeNpc.id] || 0;
    // 根据关系值选事件层级
    let tier;
    if (rel < 35)      tier = 'hostile';
    else if (rel < 65) tier = 'neutral';
    else               tier = 'ally';
    const pool = activeNpc.events[tier];
    if (!pool || pool.length === 0) return;
    // 防止同一事件连续触发（冷却2回合）
    const coolKey = `${activeNpc.id}_${tier}`;
    const lastRound = state.npcCooldown[coolKey] || 0;
    if (state.round - lastRound < 3) return;
    state.npcCooldown[coolKey] = state.round;
    const evt = pool[Math.floor(Math.random() * pool.length)];
    // 将 NPC 事件挂入 pendingStory（复用故事事件界面）
    state.pendingStory = {
      isNpcEvent: true,
      npcId: activeNpc.id,
      npcName: activeNpc.name,
      npcTitle: activeNpc.title,
      npcIcon: activeNpc.icon,
      scene: evt.scene,
      choices: evt.choices.map(c => ({ ...c }))
    };
    state.triggeredStories.push(coolKey);
    state.phase = 'story';
  }

  // 处理 NPC 关系事件选择（复用 chooseStory 接口）
  function chooseNpcStory(choiceIndex) {
    const story = state.pendingStory;
    if (!story || !story.isNpcEvent) return;
    const choice = story.choices[choiceIndex];
    if (!choice) return;
    // 应用资源效果
    if (choice.effect) applyEffect(choice.effect);
    // 应用 flag
    if (choice.flag) state.flags[choice.flag] = (state.flags[choice.flag] || 0) + 1;
    // 选择本身会轻微影响 NPC 关系（不同选项关系变化不同）
    const relDelta = choiceIndex === 0 ? 5 : -5;
    const nid = story.npcId;
    state.npcs[nid] = Math.max(0, Math.min(100, (state.npcs[nid] || 0) + relDelta));
    addLog('npc', `【${story.npcName}】${choice.result}`);
    // NPC 关系达到盟友阈值时写入时间线
    const newRel = state.npcs[nid] || 0;
    if (newRel >= 65 && (newRel - relDelta) < 65) {
      addTimeline('🤝', `与【${story.npcName}】结为挚友`);
    }
    state.pendingStory = null;
    state.phase = 'play';
    saveGame();
    UI.render();
  }

  // 根据当前 flags/resources 将故事事件模板解析为最终版本（处理 flag 因果分支）
  function resolveStoryEvent(evt, flags, resources) {
    let scene = evt.scene;
    let choices = evt.choices.map(c => Object.assign({}, c, { effect: Object.assign({}, c.effect) }));

    // 1. 条件场景覆盖（第一个满足条件的生效，替换 scene 和 choices）
    if (evt.condScene) {
      for (const cs of evt.condScene) {
        if (cs.cond(flags, resources)) {
          scene = cs.scene;
          if (cs.choices) choices = cs.choices.map(c => Object.assign({}, c, { effect: Object.assign({}, c.effect) }));
          break;
        }
      }
    }

    // 2. 条件追加选项（满足条件时追加额外选项）
    if (evt.condChoices) {
      for (const cc of evt.condChoices) {
        if (cc.cond(flags, resources)) {
          cc.choices.forEach(c => choices.push(Object.assign({}, c, { effect: Object.assign({}, c.effect) })));
        }
      }
    }

    // 3. 条件效果强化（对指定选项追加效果和文本）
    if (evt.condEffect) {
      for (const ce of evt.condEffect) {
        if (ce.cond(flags, resources)) {
          const c = choices[ce.idx];
          if (!c) continue;
          const newEff = Object.assign({}, c.effect);
          for (const [k, v] of Object.entries(ce.add || {})) newEff[k] = (newEff[k] || 0) + v;
          choices = choices.slice();
          choices[ce.idx] = Object.assign({}, c, { effect: newEff });
          if (ce.result) choices[ce.idx].result = ce.result;
        }
      }
    }

    return { id: evt.id, title: evt.title, scene, choices };
  }

  // 取当前回合对应的未触发主线事件
  function getStoryEvent() {
    const pool = STORY_EVENTS[state.player.track];
    if (!pool) return null;
    // cond 接收 (flags, resources, npcs, round)，全部满足才触发
    const regular = pool.find(e =>
      e.triggerRound === state.round &&
      !state.triggeredStories.includes(e.id) &&
      (!e.cond || e.cond(state.flags, state.resources, state.npcs, state.round))
    ) || null;
    if (regular) return regular;

    // 轻量级小事件（填充空白回合，优先级低于主线）
    const minorPool = MINOR_EVENTS[state.player.track] || [];
    const minor = minorPool.find(e =>
      e.triggerRound === state.round &&
      !state.triggeredStories.includes(e.id)
    ) || null;
    if (minor) return minor;

    // 危机事件：第 10-14 回合之间，40% 概率触发，仅触发一次
    const crisis = CRISIS_EVENTS[state.player.track];
    if (crisis &&
        state.round >= 10 && state.round <= 14 &&
        !state.triggeredStories.includes(crisis.id) &&
        Math.random() < 0.40) {
      return crisis;
    }

    // 战役事件：优先级低于主线/小事件/危机，条件满足且未触发时激活
    const battlePool = BATTLE_EVENTS[state.player.track] || [];
    const battleEvt = battlePool.find(e =>
      !state.triggeredStories.includes(e.id) &&
      e.cond(state.flags, state.resources, state.npcs, state.round)
    );
    if (battleEvt) return battleEvt;

    return null;
  }

  // 玩家在剧情事件中做出选择
  function chooseStory(idx) {
    const story = state.pendingStory;
    // 战役事件由 chooseMove / endBattle 处理，此处直接忽略
    if (!story || story.type === 'battle') return;
    if (!story.choices[idx]) return;
    state.lastResDelta = {}; // 故事选择前清零 delta
    // 埋点：剧情选择
    if (typeof trackEvent === 'function') {
      trackEvent('story_choice', {
        event_id: story.id || story.title,
        choice_index: idx,
        round: state.round,
        track: state.player.track
      });
    }
    // 路由到 NPC 事件处理
    if (story.isNpcEvent) {
      chooseNpcStory(idx);
      return;
    }
    const choice = story.choices[idx];

    applyEffect(choice.effect);

    // 叠加 flag
    for (const [key, val] of Object.entries(choice.flagSet || {})) {
      state.flags[key] = (state.flags[key] || 0) + val;
    }

    // 应用 npcSet（NPC 关系值变化，同时检测是否跨越盟友阈值写入时间线）
    for (const [npcId, delta] of Object.entries(choice.npcSet || {})) {
      const prev = state.npcs[npcId] || 0;
      state.npcs[npcId] = Math.max(0, Math.min(100, prev + delta));
      if (state.npcs[npcId] >= 65 && prev < 65 && NPC_DATA[npcId]) {
        addTimeline('🤝', `与【${NPC_DATA[npcId].name}】结为挚友`);
      }
    }
        addLog('story', `【${story.title}】${choice.result}`);
    // 人生时间线：主线故事完成
    addTimeline('📖', `【${story.title}】${choice.result.slice(0, 22)}${choice.result.length > 22 ? '…' : ''}`);
    state.pendingStory = null;
    state.phase = 'play';

    checkEnd();
    UI.render();
  }

  // ==================== 战役系统（手动战斗） ====================

  // 辅助：随机整数 [min, max]
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // 玩家选择本轮出招（moveIdx: 0/1/2）
  function chooseMove(moveIdx) {
    const b = state.battle;
    if (!b || b.done) return;
    const move = b.event.moves[moveIdx];
    if (!move) return;

    // 计算伤害（随机区间）
    const pDmg = randInt(move.pDmg[0], move.pDmg[1]); // 我方对敌伤害
    const eDmg = randInt(move.eDmg[0], move.eDmg[1]); // 敌方对我伤害

    b.enemyHp  = Math.max(0, b.enemyHp  - pDmg);
    b.playerHp = Math.max(0, b.playerHp - eDmg);

    b.log.push({
      round: b.round,
      move: move.label,
      emoji: move.emoji,
      pDmg,
      eDmg,
      playerHp: b.playerHp,
      enemyHp: b.enemyHp
    });

    b.round++;

    // 判断战斗结束
    if (b.playerHp <= 0 || b.enemyHp <= 0 || b.round > b.maxRounds) {
      b.done = true;
      b.won = b.playerHp > 0 && b.playerHp >= b.enemyHp;
    }

    UI.render();
  }

  // 战役结算：应用效果并返回 play 阶段
  function endBattle() {
    const b = state.battle;
    if (!b || !b.done) return;

    state.lastResDelta = {};
    const effect = b.won ? b.event.winEffect : b.event.loseEffect;
    applyEffect(effect);

    const resultText = b.won ? b.event.winStory : b.event.loseStory;
    addLog('story', `【${b.event.title}】${resultText}`);
    addTimeline(b.won ? '⚔️' : '💔',
      `【${b.event.title}】${resultText.slice(0, 22)}${resultText.length > 22 ? '…' : ''}`);

    // 埋点：战斗结果
    if (typeof trackEvent === 'function') {
      trackEvent('battle_end', {
        battle_id: b.event.id || b.event.title,
        result: b.won ? 'win' : 'lose',
        track: state.player.track,
        round: state.round
      });
    }

    state.battle = null;
    state.pendingStory = null;
    state.phase = 'play';

    checkEnd();
    UI.render();
  }

  function applyEffect(effect) {
    if (!effect) return;
    const res = state.resources;
    const trackDefs = (TRACKS[state.player.track] || {}).resources || [];
    for (const [key, delta] of Object.entries(effect)) {
      if (res[key] !== undefined) {
        const def = trackDefs.find(d => d.key === key);
        const maxVal = (def && def.max != null) ? def.max : 100;
        const oldVal = res[key];
        res[key] = Math.max(0, Math.min(maxVal, res[key] + delta));
        const actual = res[key] - oldVal;
        if (actual !== 0) {
          state.lastResDelta[key] = (state.lastResDelta[key] || 0) + actual;
        }
      }
    }
  }

  function checkEnd() {
    if (state.phase !== 'play') return;
    const r = state.resources;

    if (r.gold <= 0) { triggerEnding('gold_zero'); return; }

    // 体魄归零：积劳而亡（先于其他死亡检测）
    if ((r.vitality || 0) <= 0) { triggerEnding(pickExhaustionEnding()); return; }
    // 体魄低预警（只触发一次）
    if ((r.vitality || 0) <= 30 && !state.flags._vitality_warned) {
      state.flags._vitality_warned = true;
      addLog('warn', '积劳已久，你感到精力大不如前，身体每况愈下……若再不休养，恐有不测。');
    }

    if (state.player.track === 'court') {
      // 圣眷归零但有兵力 → 触发赛道转换提示（仅一次）
      if (r.favor <= 0) {
        if ((r.troops || 0) >= 20 && !state.triggeredStories.includes('_trans_court_rebel')) {
          state.triggeredStories.push('_trans_court_rebel');
          state.pendingTransition = {
            from: 'court', to: 'rebel',
            title: '绝处逢生',
            scene: '圣眷已尽，你在朝中的路已走到尽头。然而，你手下尚有人马……有人夜访帐中，低声道："大人，何不揭竿而起，另立门户？兄弟们愿随大人共赴死生！"',
            confirmText: '弃官从贼，起兵造反',
            declineText: '接受命运，仕途就此终结'
          };
          state.phase = 'transition';
          return;
        }
        triggerEnding('favor_zero'); return;
      }
      if (state.round >= 14 && r.power >= 80 && r.favor >= 85) { triggerEnding(pickEndingByStats()); return; }
      // 寿命上限：40 回合（约59岁）自然寿终
      if (state.round >= 40) { triggerEnding(pickDeathEnding()); return; }
    } else if (state.player.track === 'rebel') {
      if (r.troops <= 0) { triggerEnding('troops_zero'); return; }
      if (state.round >= 8 && r.territory >= 80 && r.morale >= 60) { triggerEnding(pickTerritoryEnding()); return; }
      // 寿命上限：35 回合（战场消耗，约54岁）自然寿终
      if (state.round >= 35) { triggerEnding(pickDeathEnding()); return; }
    } else if (state.player.track === 'merchant') {
      if (r.prestige <= 0) { triggerEnding('prestige_zero'); return; }
      if (state.round >= 8 && r.wealth >= 100 && r.routes >= 3) { triggerEnding(pickWealthEnding()); return; }
      // 寿命上限：40 回合（约59岁）自然寿终
      if (state.round >= 40) { triggerEnding(pickDeathEnding()); return; }
    } else if (state.player.track === 'hero') {
      if (state.round >= 8 && r.fame >= 80 && r.martial >= 60) { triggerEnding(pickHeroEnding()); return; }
      // 寿命上限：35 回合（江湖消耗，约54岁）自然寿终
      if (state.round >= 35) { triggerEnding(pickDeathEnding()); return; }
    }
  }

  function pickEndingByStats() {
    // 行为标记优先：玩家的选择风格决定结局，不被资源快照干扰
    // 权谋路 → 朝堂棋手（cunning+factioner 积累）
    if ((state.flags.cunning || 0) >= 2 && (state.flags.factioner || 0) >= 2) return 'power_triumph_schemer';
    // 篡位路 → 权臣专属
    if ((state.flags.usurper || 0) >= 1) return 'power_triumph_usurper';
    // NPC 盟友：与权相李崇关系>=70 → 专属结局
    if ((state.npcs.minister || 0) >= 70) return 'favor_triumph_npc_minister';
    // 铁面无私 → 断案如神
    if ((state.flags.judge || 0) >= 1) return 'favor_triumph_judge';
    // 赤忱忠诚（loyal>=3，无judge）→ 社稷忠魂
    if ((state.flags.loyal || 0) >= 3) return 'favor_triumph_loyal';
    // 无明显行为积累：资源偏向决定分支（power >= favor 走权柄，否则走圣眷）
    const r = state.resources;
    return r.power >= r.favor ? pickPowerEnding() : pickFavorEnding();
  }
  function pickPowerEnding() {
    // cunning>=2 且 factioner>=2 → 朝堂棋手（智谋操控优先于单纯权臣）
    if ((state.flags.cunning || 0) >= 2 && (state.flags.factioner || 0) >= 2) return 'power_triumph_schemer';
    return (state.flags.usurper || 0) >= 1 ? 'power_triumph_usurper' : 'power_triumph';
  }
  function pickFavorEnding() {
    // NPC 盟友加成：与权相李崇关系值≥70，解锁专属结局
    if ((state.npcs.minister || 0) >= 70) return 'favor_triumph_npc_minister';
    if ((state.flags.judge || 0) >= 1) return 'favor_triumph_judge';
    // loyal>=3 且无judge → 社稷忠魂（赤忱忠诚但不以铁面出名）
    if ((state.flags.loyal || 0) >= 3) return 'favor_triumph_loyal';
    return 'favor_triumph';
  }
  function pickTerritoryEnding() {
    // NPC 盟友 + sovereign flag → 天命所归（最高阶开国结局）
    if ((state.npcs.general || 0) >= 70 && (state.flags.sovereign || 0) >= 1) return 'territory_triumph_sovereign';
    // 仅 NPC 盟友（关系>=70）
    if ((state.npcs.general || 0) >= 70) return 'territory_triumph_npc_general';
    if ((state.flags.righteous || 0) >= 2) return 'territory_triumph_righteous';
    // ruthless>=2 → 铁血枭雄；cunning>=2 → 谋定天下
    if ((state.flags.ruthless || 0) >= 2) return 'territory_triumph_ruthless';
    if ((state.flags.cunning || 0) >= 2) return 'territory_triumph_cunning';
    return 'territory_triumph';
  }
  function pickWealthEnding() {
    // NPC 盟友加成：与沈万钧关系值≥70，解锁专属结局
    if ((state.npcs.tycoon || 0) >= 70) return 'wealth_triumph_npc_tycoon';
    if ((state.flags.righteous || 0) >= 2) return 'wealth_triumph_righteous';
    // cunning>=2 → 商界枭雄（算计横扫商界）
    if ((state.flags.cunning || 0) >= 2) return 'wealth_triumph_cunning';
    return 'wealth_triumph';
  }
  function pickHeroEnding() {
    // NPC 盟友 + sworn flag → 武林盟主（正式受命，最高阶结局）
    if ((state.npcs.master || 0) >= 70 && (state.flags.sworn || 0) >= 1) return 'hero_triumph_master_sworn';
    // 仅 NPC 盟友（关系>=70）
    if ((state.npcs.master || 0) >= 70) return 'hero_triumph_npc_master';
    if ((state.resources.bonds || 0) >= 20) return 'hero_triumph_justice';
    // brave>=2 → 武道宗师；lone_hero>=1 → 孤侠传说
    if ((state.flags.brave || 0) >= 2) return 'hero_triumph_brave';
    if ((state.flags.lone_hero || 0) >= 1) return 'hero_triumph_lone';
    return 'hero_triumph';
  }

  // ==================== 自然死亡结局选择（按资源状态决定品质）====================
  function pickDeathEnding() {
    const track = state.player.track;
    const r = state.resources;
    let level;
    if (track === 'court') {
      const score = (r.power || 0) + (r.favor || 0);
      level = score >= 120 ? 'high' : score >= 60 ? 'mid' : 'low';
    } else if (track === 'rebel') {
      const score = (r.territory || 0) + (r.morale || 0);
      level = score >= 100 ? 'high' : score >= 50 ? 'mid' : 'low';
    } else if (track === 'merchant') {
      const score = (r.wealth || 0) + (r.prestige || 0);
      level = score >= 150 ? 'high' : score >= 80 ? 'mid' : 'low';
    } else if (track === 'hero') {
      const score = (r.fame || 0) + (r.martial || 0);
      level = score >= 100 ? 'high' : score >= 50 ? 'mid' : 'low';
    }
    return `death_${track}_${level}`;
  }

  // ==================== 积劳而亡结局选择（赛道专属）====================
  function pickExhaustionEnding() {
    const track = state.player.track;
    return `death_exhaustion_${track}`;
  }

  function confirmTransition(confirm) {
    const t = state.pendingTransition;
    if (!t) return;
    state.pendingTransition = null;
    if (confirm) {
      const origin = ORIGINS[state.player.origin];
      const oldGold = state.resources.gold;
      state.resources = { ...origin.resources[t.to] };
      state.resources.gold = Math.max(state.resources.gold, oldGold);
      state.resources.troops = Math.max(state.resources.troops, 20);
      state.player.track = t.to;
      state.phase = 'play';
      addLog('system', `【命运转折】你放弃官场，踏上了${TRACKS[t.to].name}。这是一条不归路。`);
    } else {
      triggerEnding('favor_zero');
      return;
    }
    UI.render();
  }

  function triggerEnding(endingId) {
    state.phase = 'result';
    state.currentEnding = Object.assign({ id: endingId }, ENDINGS[endingId]);
    // 根据 flags 追加历史注脚（最多匹配一条，最有代表性的优先）
    state.currentEnding.footnote = buildEndingFootnote(state.flags, state.player);
    // 埋点：游戏结局
    if (typeof trackEvent === 'function') {
      trackEvent('game_end', {
        ending_id: endingId,
        track: state.player.track,
        origin: state.player.origin,
        gender: state.player.gender,
        ambition: state.player.ambition,
        rounds_survived: state.round
      });
    }
    UI.render();
  }

  function buildEndingFootnote(flags, player) {
    const f = flags;
    const isFemale = player.gender === 'female';
    const npcs = state.npcs || {};

    // NPC 关系注脚（优先级最高）
    if (player.track === 'court' && (npcs.minister || 0) >= 70)
      return isFemale
        ? '与权相李崇相交多年，世人皆曰："李崇识人，朝中若无此女，孰能与其并肩？"'
        : '与权相李崇相交多年，世人皆曰："李崇识人，朝中若无此人，孰能与其并肩？"';
    if (player.track === 'rebel' && (npcs.general || 0) >= 70)
      return isFemale
        ? '徐长风后来著书追忆："我见过很多女将军，但她是唯一让我甘心俯首的那一个。"'
        : '徐长风后来著书追忆："我见过很多枭雄，但他是唯一让我心甘情愿跟随的那一个。"';
    if (player.track === 'merchant' && (npcs.tycoon || 0) >= 70)
      return '沈万钧临终前说："商路千里，我最信任的生意伙伴，只有一个人——那便是他。"';
    if (player.track === 'hero' && (npcs.master || 0) >= 70)
      return isFemale
        ? '燕无双写下："江湖人问我，平生最佩服者，我只写了一个名字——她。"'
        : '燕无双写下："江湖人问我，平生最佩服者，我只写了一个名字——他。"';
    if (player.track === 'court') {
      if ((f.loyal || 0) >= 3 && (f.judge || 0) >= 1)
        return isFemale
          ? '史家评曰："此女忠直廉明，身处浊世而不染，巾帼不让须眉，千古罕见。"'
          : '史家评曰："此人忠直廉明，身处浊世而不染，千古罕见。"';
      if ((f.corrupt || 0) >= 2 || (f.extort_used || 0) >= 4)
        return isFemale
          ? '野史记载："此女颇有手腕，私下敛财不少，然于大局无碍，世人褒贬各半。"'
          : '野史记载："此人颇有手腕，私下敛财不少，然于大局无碍，世人褒贬各半。"';
      if ((f.loyal || 0) >= 2)
        return isFemale
          ? '同僚皆云："此女忠正，虽仕途多舛，然始终未曾弯腰媚上，实属难能可贵。"'
          : '同僚皆云："此人忠正，虽仕途多舛，然始终未曾弯腰媚上，难能可贵。"';
      if ((f.factioner || 0) >= 2)
        return isFemale
          ? '政敌称其："深于谋略，善于经营人脉，是个令人忌惮的对手。"'
          : '政敌称其："深于谋略，善于经营人脉，是个可怕的对手。"';
    }
    if (player.track === 'rebel') {
      if ((f.righteous || 0) >= 3)
        return isFemale
          ? '民间歌谣传唱："女将军仁义，爱民如子，天下若有更多此等巾帼，百姓何苦流离。"'
          : '民间歌谣传唱："将军仁义，爱民如子，天下若有更多此等英雄，百姓何苦流离。"';
      if ((f.ruthless || 0) >= 2)
        return isFemale
          ? '史官秉笔："此女雄才大略，手段刚烈，所过之处，民心难附，终成大业亦留骂名。"'
          : '史官秉笔："此人雄才大略，然手段刚烈，所过之处，民心难附，终成大业亦留骂名。"';
      if ((f.cunning || 0) >= 2)
        return isFemale
          ? '谋士赞曰："主公用兵如神，以奇谋破强敌，巾帼英雄，实乃百年难遇之帅才。"'
          : '谋士赞曰："主公用兵如神，以奇谋破强敌，实乃百年难遇之帅才。"';
    }
    if (player.track === 'merchant') {
      if ((f.righteous || 0) >= 2)
        return isFemale
          ? '商界口碑："此女富而不骄，取之有道，是难得的商界清流，令人钦佩。"'
          : '商界口碑："此人富而不骄，取之有道，是难得的商界清流，令人钦佩。"';
      if ((f.cunning || 0) >= 2)
        return isFemale
          ? '竞争对手忆述："此女精于算计，每一笔买卖皆算到极致，与之为敌实属不智。"'
          : '竞争对手忆述："此人精于算计，每一笔买卖皆算到极致，与之为敌实属不智。"';
      if ((f.royal_merchant || 0) >= 1)
        return isFemale
          ? '朝廷档案载："皇商某氏，女中豪杰，为朝廷财政贡献颇巨，赏赐无数，亦是一段佳话。"'
          : '朝廷档案载："皇商某氏，为朝廷财政贡献颇巨，赏赐无数，亦是一段佳话。"';
    }
    if (player.track === 'hero') {
      if ((f.sworn || 0) >= 1 && (f.righteous || 0) >= 2)
        return isFemale
          ? '江湖传说："义字当头，姐妹情深——此女侠的名字，是江湖上最令人敬仰的三个字。"'
          : '江湖传说："义字当头，兄弟情深——此人的名字，是江湖上最值得信任的三个字。"';
      if ((f.brave || 0) >= 2)
        return isFemale
          ? '武林人评："此女胆气无双，从未见过她退缩，无论对手多强，皆敢正面迎战，巾帼英雄。"'
          : '武林人评："此人胆气无双，从未见过他退缩，无论对手多强，皆敢正面迎战。"';
      if ((f.lone_hero || 0) >= 1)
        return isFemale
          ? '过客忆述："曾见一白衣女剑客，孤身行走天涯，不问名利，只问公道——那是真正的女侠。"'
          : '过客忆述："曾见一白衣剑客，孤身行走天涯，不问名利，只问公道——那是真正的侠客。"';
    }
    // 接济百姓积累的仁善注脚（跨赛道，benevolent≥3 时生效）
    if ((f.benevolent || 0) >= 3)
      return isFemale
        ? '民间相传："此女在位之时，常散财济贫，有德者事成——此乃仁者之福报。"'
        : '民间相传："此人在位之时，常散财济贫，有德者事成——此乃仁者之福报。"';
    return null; // 无特别注脚
  }

  // ==================== 存档 / 读档 ====================

  const SAVE_KEY_AUTO = 'grow_save_auto';

  function saveGame() {
    try {
      const saveData = {
        state: JSON.parse(JSON.stringify(state)),
        savedAt: Date.now(),
        version: '0.9'
      };
      localStorage.setItem(SAVE_KEY_AUTO, JSON.stringify(saveData));
      return true;
    } catch (e) {
      return false;
    }
  }

  function loadGame() {
    try {
      const raw = localStorage.getItem(SAVE_KEY_AUTO);
      if (!raw) return false;
      const saveData = JSON.parse(raw);
      if (!saveData.state) return false;
      // 深拷贝还原 state
      Object.keys(saveData.state).forEach(k => { state[k] = saveData.state[k]; });
      UI.render();
      return true;
    } catch (e) {
      return false;
    }
  }

  function getSaveInfo() {
    try {
      const raw = localStorage.getItem(SAVE_KEY_AUTO);
      if (!raw) return null;
      const saveData = JSON.parse(raw);
      if (!saveData.state) return null;
      const p = saveData.state.player;
      const trackNames = { court: '官场之路', rebel: '造反之路', merchant: '富商之路', hero: '侠客之路' };
      const originNames = { scholar: '寒门学子', warrior: '边境武将', merchant: '落魄商贾', wanderer: '游侠少年' };
      return {
        savedAt: saveData.savedAt,
        round: saveData.state.round,
        maxRounds: saveData.state.maxRounds,
        trackName: trackNames[p.track] || p.track,
        originName: originNames[p.origin] || p.origin
      };
    } catch (e) {
      return null;
    }
  }

  function deleteSave() {
    localStorage.removeItem(SAVE_KEY_AUTO);
  }

  // ==================== 时间显示 ====================

  // 将回合数转换为古代时间感（乾明年号 + 季节 + 年龄）
  function getTimeDisplay() {
    const r = state.round;
    const SEASONS = ['春', '夏', '秋', '冬'];
    const NUMS = ['元', '二', '三', '四', '五', '六', '七', '八', '九', '十',
                  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                  '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十',
                  '三十一', '三十二', '三十三', '三十四', '三十五', '三十六', '三十七', '三十八', '三十九', '四十'];
    const year = NUMS[Math.min(r - 1, 39)] || String(r); // 乾明元年→四十年
    const season = SEASONS[(r - 1) % 4];
    const age = 19 + r; // 开局20岁（第1回合），第40回合59岁
    let ageTitle;
    if (age <= 22)      ageTitle = '弱冠';
    else if (age <= 29) ageTitle = '青年';
    else if (age <= 35) ageTitle = '而立';
    else if (age <= 39) ageTitle = '盛年';
    else if (age <= 49) ageTitle = '不惑';
    else if (age <= 59) ageTitle = '知天命';
    else                ageTitle = '耳顺';
    return { year, season, age, ageTitle };
  }

  function addLog(type, text) {
    state.log.unshift({ type, text, round: state.round });
    if (state.log.length > 12) state.log.pop();
  }

  // 人生时间线（里程碑，无上限，贯穿全局）
  function addTimeline(icon, text) {
    state.timeline.push({ round: state.round, icon, text });
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getState() { return state; }

  return { init, setGender, setOrigin, confirmCreate, setTrack, setAmbition, doAction, endRound, chooseReaction, chooseStory, chooseNpcStory, chooseMove, endBattle, confirmTransition, getState, saveGame, loadGame, getSaveInfo, deleteSave, getTimeDisplay, NPC_DATA, NPC_ACTIONS, COMMON_ACTIONS, AMBITIONS };
})();
