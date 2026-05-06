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
    trait: '博学多才：每回合情报+5（声望微增）',
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
      { key: 'gold',  name: '钱粮', icon: '🌾', color: '#c9a84c', max: 100 },
      { key: 'favor', name: '圣眷', icon: '👑', color: '#e8c45a', max: 100 },
      { key: 'power', name: '权柄', icon: '⚖️', color: '#9b59b6', max: 100 }
    ],
    winText: '权柄 ≥ 80 或 圣眷 ≥ 85',
    loseText: '钱粮归零 或 圣眷归零'
  },
  rebel: {
    id: 'rebel',
    name: '造反之路',
    subtitle: '诸侯 · 枭雄',
    icon: '⚔️',
    desc: '揭竿而起，招募义军，攻城略地。有朝一日问鼎天下——或者兵败身死，身首异处。',
    resources: [
      { key: 'gold',      name: '钱粮', icon: '🌾', color: '#c9a84c', max: 100 },
      { key: 'troops',    name: '兵力', icon: '⚔️', color: '#e74c3c', max: 100 },
      { key: 'morale',    name: '民心', icon: '❤️', color: '#2ecc71', max: 100 },
      { key: 'territory', name: '地盘', icon: '🏯', color: '#e67e22', max: 100 }
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
      { key: 'gold',     name: '钱粮', icon: '🌾', color: '#c9a84c', max: 100 },
      { key: 'wealth',   name: '财富', icon: '💎', color: '#f1c40f', max: 150, lowVal: 10, highVal: 80 },
      { key: 'routes',   name: '商路', icon: '🛤️', color: '#27ae60', max: 10,  lowVal: 1,  highVal: 5  },
      { key: 'prestige', name: '商誉', icon: '🏮', color: '#e67e22', max: 100 }
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
      { key: 'gold',    name: '钱粮', icon: '🌾', color: '#c9a84c', max: 100 },
      { key: 'martial', name: '武艺', icon: '⚔️', color: '#e74c3c', max: 100 },
      { key: 'fame',    name: '名望', icon: '⭐', color: '#f39c12', max: 100 },
      { key: 'bonds',   name: '恩义', icon: '🤝', color: '#2980b9', max: 50,  lowVal: 3,  highVal: 25 }
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
      effect: { power: 22, favor: -8, gold: -10 },
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
      desc: '直达天听，表明忠心与立场。可能大涨圣眷，也可能引火烧身。',
      effect: { favor: 25, power: 5 },
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
      effect: { gold: 30, favor: -15, power: 5 },
      results: [
        '你打着"征收"的名目，中饱私囊，百姓敢怒不敢言，钱袋鼓了许多。',
        '你设法在账目上做了手脚，白花花的银子流入口袋，但御史已经开始盯着你了。',
        '一番操作下来，钱袋鼓了，街头已有民怨流传，圣眷有所下滑。'
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
      effect: { gold: -20, troops: 25 },
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
      effect: { troops: -15, territory: 20, gold: 15, morale: -5 },
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
      desc: '兵马未动，粮草先行。组织屯田，积蓄粮草，为大战做准备。',
      effect: { gold: 28, morale: 5 },
      results: [
        '你号令军民屯田，一季之后粮仓渐满，军心稳固，民心也跟着涨了些。',
        '你大力推行屯田，解决了后勤之忧，军队士气因此提振。',
        '粮食堆满仓库，士卒安心，百姓的安居让民心也好了许多。'
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
      effect: { gold: -10, wealth: 45 },
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
      effect: { gold: -20, wealth: 55 },
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
    }
  ],

  hero: [
    {
      id: 'train',
      name: '苦练武艺',
      icon: '🥋',
      cost: 1,
      desc: '闭门苦练，精进拳脚与剑法。宝剑锋从磨砺出。',
      effect: { martial: 25 },
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
    bonusDesc: '每次「接济百姓」，仁善积累加倍（额外 +1 benevolent）。',
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
    effect: { gold: 22 },
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
    { text: '朝中突发政争，皇帝召见，你随机应变，化险为夷，圣眷微涨。', effect: { favor: 10 } },
    { text: '一位同僚在皇帝面前为你美言，龙颜欣慰。', effect: { favor: 8 } },
    { text: '御史弹劾你的党羽，你花银子上下打点，才压了下去。', effect: { gold: -15, power: -5 } },
    { text: '皇帝偶然发现你一份旧日政绩，龙颜大悦，大加赞赏。', effect: { favor: 10 } },
    { text: '政敌散布谣言，你的名声受损，圣眷有所下滑。', effect: { favor: -12 } },
    { text: '朝廷大赦，你的一名党羽得以脱罪，权柄微涨。', effect: { power: 8 } },
    { text: '边境告急，朝廷紧急筹款，你趁机从中获利。', effect: { gold: 15 } },
    { text: '一场宫廷宴会，你举止得体，大获皇帝赞誉。', effect: { favor: 12, power: 5 } },
    { text: '皇帝心情不佳，无故斥责几位大臣，你也未能幸免，圣眷受损。', effect: { favor: -10 } },
    { text: '你成功帮皇帝处置了一桩棘手案件，龙颜大悦，重重嘉奖。', effect: { favor: 12, gold: 10 } }
  ],
  rebel: [
    { text: '附近一支溃军来投，你收编残部，兵力大涨。', effect: { troops: 15, gold: -10 } },
    { text: '一场时疫在军中蔓延，士卒减员，民心也受影响。', effect: { troops: -12, morale: -8 } },
    { text: '当地豪绅献粮投诚，粮仓大有充实，百姓欢欣鼓舞。', effect: { gold: 20, morale: 8 } },
    { text: '朝廷大军在附近集结，军中人心惶惶，民心动摇。', effect: { morale: -15 } },
    { text: '大旱之年，粮食减产，军粮吃紧。', effect: { gold: -18 } },
    { text: '一位名将率部来投，军队战斗力大增，士气沸腾。', effect: { troops: 20, morale: 10 } },
    { text: '附近村民自发加入义军，兵力与民心齐涨。', effect: { troops: 10, morale: 12 } },
    { text: '与邻近势力发生小冲突，损兵折将，但缴获了一批粮草。', effect: { troops: -8, gold: 15 } },
    { text: '你的仁义之名传开，有流民扶老携幼前来投奔。', effect: { morale: 15, gold: -5 } },
    { text: '军中爆发哗变，你及时镇压，但元气大伤。', effect: { troops: -10, morale: -10 } }
  ],
  merchant: [
    { text: '一批货物滞销，占压了大量资金，你不得不忍痛低价出售。', effect: { wealth: -15 } },
    { text: '商道遭遇土匪，押运钱粮受损，所幸损失不大。', effect: { gold: -12 } },
    { text: '朝廷开辟新的贸易路线，你得到内部消息，先一步布局，大获其利。', effect: { wealth: 20, prestige: 8 } },
    { text: '一位老客户大量进货，财富一下子涨了不少。', effect: { wealth: 18 } },
    { text: '同行散布谣言，说你货品掺假，商誉受损。', effect: { prestige: -12 } },
    { text: '你资助了当地灾民，善名远播，商誉在商界大涨。', effect: { gold: -10, prestige: 15 } },
    { text: '节庆将至，你提前备货，高价出手，财富暴涨。', effect: { gold: -5, wealth: 22 } },
    { text: '一位官员欣赏你的生意头脑，主动为你疏通一条商路。', effect: { prestige: 10, routes: 1 } },
    { text: '账房先生结算，发现一笔闲置资金，你顺势再度投入，财富微涨。', effect: { wealth: 12 } },
    { text: '货物运输途中遭遇大雨，损毁不少，这笔损失只得自认了。', effect: { wealth: -18, gold: -8 } }
  ],
  hero: [
    { text: '你救了一名路人，对方原来是当地富绅，感激之下赠你钱财。', effect: { gold: 15, bonds: 5 } },
    { text: '江湖中流传起你的事迹，慕名拜访者络绎不绝，名望大涨。', effect: { fame: 12 } },
    { text: '比武切磋中输给一位高手，对方指点你一番，武艺微进，但挫败感难免影响名声。', effect: { martial: 8, fame: -5 } },
    { text: '有人假借你的名义行骗，你四处解释，声誉受损。', effect: { fame: -10 } },
    { text: '旅途中盘缠告急，你只能低调行路，不得张扬。', effect: { gold: -12 } },
    { text: '你主动帮助一个小村庄解决了纷争，当地人将你的名字编入歌谣。', effect: { fame: 15, bonds: 8 } },
    { text: '一次宴请结交了几位江湖豪杰，钱财散出去不少，但朋友多了几个。', effect: { gold: -10, bonds: 10 } },
    { text: '你拾金不昧，将一笔巨款悉数归还失主，侠义之名传遍方圆百里。', effect: { fame: 15 } },
    { text: '闭关苦练，偶然领悟一门绝技，武艺大进。', effect: { martial: 15 } },
    { text: '陈年旧伤复发，你不得不停下来调养，耗了不少盘缠。', effect: { gold: -8, martial: -5 } }
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
      currentEnding: null,
      // NPC 关系值（0-100），由 setTrack 时按赛道初始化
      npcs: {},
      // NPC 事件冷却（记录已触发事件，防止频繁重复）
      npcCooldown: {},
      // 世界状态指标
      world: {
        stability: 70,  // 天下安定（0-100），高=治世，低=乱世
        unrest: 25      // 民间动荡（0-100），高=民不聊生，低=安居乐业
      }
    };
    UI.render();
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
    addLog('system', `${state.player.title}，志在【${amb.name}】，踏上【${trackName}】之路。传奇，从此刻开始。`);
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
    // 优先检查是否是 NPC 互动行动
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

  function endRound() {
    // 若游戏已结束则不执行（防止 story/transition 覆盖结局）
    if (state.phase !== 'play') return;
    const origin = ORIGINS[state.player.origin];
    if (origin.traitBonus && !origin.traitBonus.action && !origin.traitBonus.track) {
      applyEffect({ [origin.traitBonus.key]: origin.traitBonus.val });
    }
    // 寒门学子：官场圣眷微增
    if (origin.traitBonus && origin.traitBonus.track === state.player.track) {
      applyEffect({ [origin.traitBonus.key]: origin.traitBonus.val });
    }

    // 随机被动事件——打探消息可将触发概率减半
    const passiveChance = (state.flags.informed || 0) > 0 ? 0.32 : 0.65;
    if ((state.flags.informed || 0) > 0) state.flags.informed = 0; // 消耗 informed 状态（一次性）
    if (Math.random() < passiveChance) {
      let pool = PASSIVE_EVENTS[state.player.track].slice();
      // 满足条件的世界记忆事件加入池（行为积累越深，占比越高，被抽概率越大）
      const worldEvts = WORLD_EVENTS[state.player.track] || [];
      worldEvts.forEach(we => {
        if (we.cond(state.flags, state.resources)) pool.push(we);
      });
      // 世界动荡高时，额外增加负面事件权重（将负面事件再入池一次）
      if ((state.world.unrest || 0) >= 60) {
        const negEvts = pool.filter(e =>
          Object.values(e.effect || {}).some(v => v < 0));
        pool = pool.concat(negEvts);
      }
      // 造反赛道+天下大乱时，正面事件概率提升（额外入池）
      if (state.player.track === 'rebel' && (state.world.stability || 70) <= 40) {
        const posEvts = pool.filter(e =>
          Object.values(e.effect || {}).every(v => v >= 0));
        pool = pool.concat(posEvts);
      }
      const evt = pool[Math.floor(Math.random() * pool.length)];
      applyEffect(evt.effect);
      addLog('event', `【天下事】${evt.text}`);
    }

    // ========== 世界状态更新 ==========
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

    if (state.round > state.maxRounds) {
      const surviveMap = { court: 'survive_court', rebel: 'survive_rebel', merchant: 'survive_merchant', hero: 'survive_hero' };
      const endingId = surviveMap[state.player.track] || 'survive_court';
      triggerEnding(endingId);
      return;
    }

    // 先检查胜负条件（最高优先级）
    checkEnd();
    if (state.phase !== 'play') {
      UI.render();
      return;
    }

    // 再检查是否触发主线剧情事件
    const storyEvt = getStoryEvent();
    if (storyEvt) {
      state.pendingStory = resolveStoryEvent(storyEvt, state.flags, state.resources);
      state.triggeredStories.push(storyEvt.id);
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
    const regular = pool.find(e =>
      e.triggerRound === state.round &&
      !state.triggeredStories.includes(e.id)
    ) || null;
    if (regular) return regular;

    // 危机事件：第 10-14 回合之间，40% 概率触发，仅触发一次
    const crisis = CRISIS_EVENTS[state.player.track];
    if (crisis &&
        state.round >= 10 && state.round <= 14 &&
        !state.triggeredStories.includes(crisis.id) &&
        Math.random() < 0.40) {
      return crisis;
    }
    return null;
  }

  // 玩家在剧情事件中做出选择
  function chooseStory(idx) {
    const story = state.pendingStory;
    if (!story || !story.choices[idx]) return;
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

    addLog('story', `【${story.title}】${choice.result}`);
    state.pendingStory = null;
    state.phase = 'play';

    checkEnd();
    UI.render();
  }

  function applyEffect(effect) {
    if (!effect) return;
    const res = state.resources;
    for (const [key, delta] of Object.entries(effect)) {
      if (res[key] !== undefined) {
        res[key] = Math.max(0, Math.min(100, res[key] + delta));
      }
    }
  }

  function checkEnd() {
    if (state.phase !== 'play') return;
    const r = state.resources;

    if (r.gold <= 0) { triggerEnding('gold_zero'); return; }

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
      if (state.round >= 8 && r.power >= 80) { triggerEnding(pickPowerEnding()); return; }
      if (state.round >= 8 && r.favor >= 85) { triggerEnding(pickFavorEnding()); return; }
    } else if (state.player.track === 'rebel') {
      if (r.troops <= 0) { triggerEnding('troops_zero'); return; }
      if (state.round >= 8 && r.territory >= 80 && r.morale >= 60) { triggerEnding(pickTerritoryEnding()); return; }
    } else if (state.player.track === 'merchant') {
      if (r.prestige <= 0) { triggerEnding('prestige_zero'); return; }
      if (state.round >= 8 && r.wealth >= 100 && r.routes >= 3) { triggerEnding(pickWealthEnding()); return; }
    } else if (state.player.track === 'hero') {
      if (state.round >= 8 && r.fame >= 80 && r.martial >= 60) { triggerEnding(pickHeroEnding()); return; }
    }
  }

  function pickPowerEnding() {
    return (state.flags.usurper || 0) >= 1 ? 'power_triumph_usurper' : 'power_triumph';
  }
  function pickFavorEnding() {
    // NPC 盟友加成：与权相李崇关系值≥70，解锁专属结局
    if ((state.npcs.minister || 0) >= 70) return 'favor_triumph_npc_minister';
    return (state.flags.judge || 0) >= 1 ? 'favor_triumph_judge' : 'favor_triumph';
  }
  function pickTerritoryEnding() {
    // NPC 盟友加成：与徐长风关系值≥70，解锁专属结局
    if ((state.npcs.general || 0) >= 70) return 'territory_triumph_npc_general';
    return (state.flags.righteous || 0) >= 2 ? 'territory_triumph_righteous' : 'territory_triumph';
  }
  function pickWealthEnding() {
    // NPC 盟友加成：与沈万钧关系值≥70，解锁专属结局
    if ((state.npcs.tycoon || 0) >= 70) return 'wealth_triumph_npc_tycoon';
    return (state.flags.righteous || 0) >= 2 ? 'wealth_triumph_righteous' : 'wealth_triumph';
  }
  function pickHeroEnding() {
    // NPC 盟友加成：与燕无双关系值≥70，解锁专属结局
    if ((state.npcs.master || 0) >= 70) return 'hero_triumph_npc_master';
    return (state.resources.bonds || 0) >= 20 ? 'hero_triumph_justice' : 'hero_triumph';
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
                  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'];
    const year = NUMS[Math.min(r - 1, 19)] || String(r); // 乾明元年→二十年
    const season = SEASONS[(r - 1) % 4];
    const age = 19 + r; // 开局20岁（第1回合），第20回合39岁
    let ageTitle;
    if (age <= 22)      ageTitle = '弱冠';
    else if (age <= 29) ageTitle = '青年';
    else if (age <= 35) ageTitle = '而立';
    else if (age <= 39) ageTitle = '盛年';
    else                ageTitle = '不惑';
    return { year, season, age, ageTitle };
  }

  function addLog(type, text) {
    state.log.unshift({ type, text, round: state.round });
    if (state.log.length > 12) state.log.pop();
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getState() { return state; }

  return { init, setGender, setOrigin, confirmCreate, setTrack, setAmbition, doAction, endRound, chooseStory, chooseNpcStory, confirmTransition, getState, saveGame, loadGame, getSaveInfo, deleteSave, getTimeDisplay, NPC_DATA, NPC_ACTIONS, COMMON_ACTIONS, AMBITIONS };
})();
