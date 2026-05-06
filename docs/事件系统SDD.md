# 事件系统 SDD · 权谋录

> 核心系统规格说明文档（v1.3 已实现版本）

---

## 系统概述

- **系统名**：事件系统（Event System）
- **实现版本**：v1.3
- **解决的问题**：提供回合制文字驱动的核心决策体验——通过呈现文字情境和选项，响应玩家选择，更新游戏状态（资源、flag、结局）。

---

## 已确认实现约束

| 项 | 内容 |
|---|---|
| 数据载体 | `js/game.js` 内联常量（STORY_EVENTS / CRISIS_EVENTS / WORLD_EVENTS / ENDINGS）|
| 运行环境 | 浏览器 JS，单线程，无异步 IO |
| 渲染方式 | DOM 操作，无 Canvas，无渲染框架 |
| 主线事件节点 | 每赛道约3-4个节点（含flag条件分支）|
| 资源种类 | 官场3种+造反4种+富商4种+侠客4种+全局钱粮 |
| 回合上限 | 20回合（乾明元年→二十年）|
| 外部依赖 | 无（纯原生 JS）|

---

## 已验证设计决策

- **A1（已验证）**：每个事件节点 2 个选项提供足够决策感。
- **A2（已验证）**：资源数值范围 0-100 覆盖正常游玩。
- **A3（已推翻）**：事件节点使用 flag 条件触发，而非线性顺序——这比线性触发提供更丰富的因果体验。
- **A4（已更新）**：性别选择影响封号体系、独白文本和历史注脚，不止是称呼文字。

---

## 实际状态机设计

```
[create]  选择性别(male/female) + 出身(scholar/warrior/merchant/wanderer)
    ↓
[track]   选择赛道(court/rebel/merchant/hero)，初始化资源
    ↓
[play]    游戏主界面，每回合3个行动点
    ├── 选择行动 → 资源增减 + 结果文字
    ├── 行动点耗尽 → 结束回合按钮
    └── 点击"结束回合"
        ↓
[story]   主线剧情触发（满足回合阈值）
    ├── 显示情境 + 2个选项
    ├── 玩家选择 → flag 变化 + 资源变化
    └── 某些剧情后接危机事件
        ↓
[transition]  回合过渡页（下一回合预告）
    └── 确认进入下一回合
        ↓
[play]    回合自然增减 → round++ → 胜负检查
    ├── 资源归零 → [result: defeat]
    ├── 达成胜利条件 → [result: victory]
    └── round >= 20 → [result: survive]
        ↓
[result]  结局展示（badge + title + story + footnote）
```

---

## 事件数据结构

### STORY_EVENTS（主线剧情）

```javascript
{
  id: 'court_loyal_1',
  track: 'court',       // 赛道筛选
  round: 5,             // 触发回合
  scene: '...',         // 情境描述
  choices: [
    {
      text: '选项A文字',
      effect: { favor: 15, power: -5 },   // 资源变化
      flag: 'loyal',                        // flag 积累
      result: '选A后的叙述文字'
    },
    {
      text: '选项B文字',
      effect: { power: 20, favor: -10 },
      flag: 'corrupt',
      result: '选B后的叙述文字'
    }
  ],
  condition: (flags) => (flags.loyal || 0) >= 1  // 可选：触发前提条件
}
```

### CRISIS_EVENTS（危机事件）

```javascript
{
  id: 'court_crisis_1',
  track: 'court',
  roundRange: [6, 14],   // 触发回合区间
  scene: '危机情境...',
  choices: [
    { text: '应对A', effect: {...}, result: '...' },
    { text: '应对B', effect: {...}, result: '...' }
  ]
}
```

### WORLD_EVENTS（世界背景事件）

```javascript
{
  round: 10,
  text: '乾明十年，中原大旱，粮价飞涨。'   // 世界事件描述文字（显示在过渡页）
}
```

### ENDINGS（结局定义）

```javascript
{
  favor_triumph: {
    type: 'victory',          // victory / defeat / survive
    title: '股肱之臣',
    badge: '✦ 千古名臣',
    story: '...'              // 结局故事文字
    // footnote 由 buildEndingFootnote(flags, player) 动态生成
  }
}
```

---

## Flag 因果链（核心机制）

flag 是游戏的"隐性选择记录器"。玩家的每次故事选择积累 flag，flag 影响：

1. **后续事件条件**（某些剧情只在特定 flag 下触发）
2. **结局判定**（不同 flag 组合对应不同结局）
3. **历史注脚**（buildEndingFootnote 根据 flag 生成个性化总结）

```javascript
// 示例：同一个 favor_triumph 结局，flag 不同 → 注脚不同
if (loyal >= 3 && judge >= 1) → '史家评曰："此人忠直廉明..."'
if (corrupt >= 2)             → '野史记载："此人颇有手腕..."'
if (loyal >= 2)               → '同僚皆云："此人忠正..."'
if (factioner >= 2)           → '政敌称其："深于谋略..."'
```

---

## resolveStoryEvent 函数规格

```javascript
// 输入：事件定义 + 玩家选择索引 + 当前 flags + 当前 resources
// 输出：{ result, flagChanges, resourceChanges, nextEvent? }

function resolveStoryEvent(event, choiceIndex, flags, resources) {
  const choice = event.choices[choiceIndex];
  return {
    result: choice.result,           // 叙述文字
    flagChanges: { [choice.flag]: (flags[choice.flag]||0) + 1 },
    resourceChanges: choice.effect,  // 资源增减
  };
}
```

---

## 胜负判定规格（已实现）

| 赛道 | 胜利条件 | 败亡条件 |
|---|---|---|
| 官场 | 圣眷≥85 或 权柄≥80 | 圣眷归零 |
| 造反 | 地盘≥80 或 民心≥60 | 兵力归零 |
| 富商 | 财富≥100 或 商路≥5 | 财富归零 |
| 侠客 | 武艺≥70 或 名望≥60 | 武艺归零 |
| 全局 | - | 钱粮归零 |

---

## 待扩展（M6）

- **历史大事件系统**：每5年在 WORLD_EVENTS 基础上加入影响资源的全局事件
- **NPC 命名系统**：皇帝/劲敌/挚友有专属名字，出现在故事文本中
- **人生时间线**：结局页面按年份展示玩家的关键决策节点


---

## Facts（已确认约束）

| 项 | 内容 |
|---|---|
| 数据载体 | `events.json`，纯 JSON 格式，无需服务器 |
| 运行环境 | 浏览器 JS，单线程，无异步 IO |
| 渲染方式 | DOM 操作，无 Canvas，无渲染框架 |
| 最大事件节点数（MVP） | 每路线 × 每身份组合约 10 个节点，共约 40 个节点 |
| 资源种类 | 5 种：钱粮(gold)、兵力(troops)、声望(honor)、情报(intel)、人脉(network) |
| 回合上限（MVP） | 20 回合（每月 = 1 回合） |
| 外部依赖 | 无（纯原生 JS） |

---

## Assumptions（待验证假设）

- **A1**：每个事件节点只需 2-3 个选项即可提供足够决策感，不需要更多分支。
- **A2**：资源数值范围 0-100 可以覆盖正常游玩场景，不需要无上限数值。
- **A3**：同一路线下的事件节点可以线性排列（顺序触发），MVP 不需要条件分支触发。
- **A4**：性别选择在 MVP 阶段只影响称呼文字，不影响事件内容或数值。

---

## Design Goal

**系统必须稳定实现：**
- 根据玩家角色（身份 + 路线）筛选出对应事件序列。
- 逐回合呈现事件文字和选项。
- 玩家选择后立即更新 5 种资源数值并推进回合计数器。
- 每回合结束后检查胜负条件。
- 提供清晰的视觉反馈（资源变化量高亮显示）。

**系统明确不负责：**
- 地图渲染或地域逻辑。
- 人才独立管理系统。
- 存档（MVP 阶段不做）。
- 多分支条件触发（MVP 简化为顺序触发）。

---

## State And Rules（状态机设计）

### 游戏状态对象

```json
{
  "player": {
    "gender": "male | female",
    "identity": "scholar | general | noble | merchant | hero | royal",
    "route": "civil | military | commerce | jianghu"
  },
  "resources": {
    "gold": 0,
    "troops": 0,
    "honor": 0,
    "intel": 0,
    "network": 0
  },
  "round": 1,
  "maxRounds": 20,
  "phase": "create | route | play | slot_select | crisis | story | result",
  "eventIndex": 0,
  "timeSlots": [
    { "id": "morning", "name": "朔日朝会", "used": false, "bonusType": "political", "multiplier": 1.3 },
    { "id": "noon", "name": "旬中日常", "used": false, "bonusType": "general", "multiplier": 1.0 },
    { "id": "afternoon", "name": "望日交际", "used": false, "bonusType": "social", "multiplier": 1.3 },
    { "id": "evening", "name": "月末私谋", "used": false, "bonusType": "intrigue", "multiplier": 1.3 }
  ],
  "scheduledActions": [],
  "crisisEvent": null,
  "crisisHandled": false,
  "activeBuffs": [],
  "timelineYear": "建元三年",
  "timelineSeason": "春"
}
```

### 状态转换

```
[create] 选择性别 + 身份
    ↓
[route] 选择发展路线
    ↓ （初始化资源 = 身份起始值）
[play] 游戏主界面
    ├── 选择【朔日朝会】时段行动 → 标记 used
    ├── 选择【旬中日常】时段行动 → 标记 used
    ├── 选择【望日交际】时段行动 → 标记 used
    ├── 选择【月末私谋】时段行动 → 标记 used
    └── 点击【结束本月】
        ↓
[crisis] 天下有变（每月65%概率触发）
    ├── 显示被动事件 + 2-3个应对选项
    └── 玩家选择 → 应用选项后果 + 埋入因果种子
        ↓
    月度结算：资源自然增减 + Buff检查 + 大型行动结算
        ↓
    主线剧情检查
        ↓
        - 触发剧情 → 转 [story] 显示剧情 → 玩家选择 → 应用后果
        ↓
    胜负检查：
        - 任意资源 ≤ 0 → 转 [result: defeat]
        - 达成胜利条件 → 转 [result: triumph]
        - round >= maxRounds → 转 [result: ending]
        - 否则 round++ → 时间过渡 → 回到 [play]
[result] 显示结局文字 → 提供重玩按钮
```

### 触发条件

| 条件 | 结果 |
|---|---|
| 任意资源值 ≤ 0 | 立即触发覆灭结局 |
| 任意资源值 ≥ 100 | 触发阶段胜利（但游戏继续，直到回合结束）|
| 回合数达到 maxRounds | 触发"天下未定"终局结算 |

### 被动事件（天下有变）JSON 结构

```json
{
  "crisis": {
    "{track}": [
      {
        "id": "drought_court",
        "title": "大旱之年",
        "scene": "大旱之年，粮食减产，百姓流离。",
        "weight": 10,
        "choices": [
          {
            "text": "开仓赈灾",
            "effect": { "gold": -15, "morale": 20 },
            "seed": "famine_relief",
            "result": "你下令开仓放粮，百里之内百姓奔走相告。"
          },
          {
            "text": "勒紧腰带，军粮优先",
            "effect": { "morale": -10 },
            "seed": null,
            "result": "你优先保证军粮，百姓虽有怨言但军队稳住了。"
          },
          {
            "text": "趁机兼并土地",
            "effect": { "gold": 20, "morale": -25 },
            "seed": "land_grab",
            "risk": 0.1,
            "riskResult": "民变！被你强占土地的百姓聚众闹事。",
            "result": "你暗中低价收购灾民土地，钱袋鼓了但民心大损。"
          }
        ]
      }
    ]
  }
}
```

**被动事件设计原则：**
- 每个事件必须有 **至少1个正向选项、1个保守选项**
- 冒险选项必须有明确的风险概率和后果
- 每个选项应埋入 `seed`（因果种子），影响未来事件
- 选项后果不能全是数值变化，必须有叙事描述

### 时段加成计算

行动效果结算公式：

```
实际效果 = 基础效果 × 时段倍数 × Buff倍数

时段倍数：
- 行动 category 匹配时段 bonusType → 1.3
- 不匹配 → 1.0

Buff倍数：
- 无 Buff → 1.0
- 有对应 Buff → 1.1（可叠加）
```

### 失败条件（系统层面）
- 事件 JSON 中找不到当前身份 × 路线组合的事件序列 → 显示错误提示。
- 事件节点数少于当前回合数 → 循环最后一个节点（兜底策略）。
- 时段选择超出4个 → 拒绝并提示"本月已无可用时段"。

---

## Events JSON 结构定义

```json
{
  "events": {
    "{identity}_{route}": [
      {
        "id": "scholar_civil_01",
        "round": 1,
        "scene": "事件场景描述（1-3句话，渲染时替换{name}为玩家称呼）",
        "choices": [
          {
            "text": "选项文字",
            "effect": {
              "gold": -10,
              "troops": 0,
              "honor": 20,
              "intel": 5,
              "network": 0
            },
            "result": "选择后显示的后果描述文字（1-2句话）"
          },
          {
            "text": "选项文字2",
            "effect": {
              "gold": 15,
              "troops": 0,
              "honor": -10,
              "intel": 0,
              "network": 10
            },
            "result": "后果描述文字2"
          }
        ]
      }
    ]
  }
}
```

### 身份起始资源值

| 身份 | 钱粮 | 兵力 | 声望 | 情报 | 人脉 |
|---|---|---|---|---|---|
| 寒门学子 (scholar) | 20 | 5 | 30 | 40 | 20 |
| 边境将领 (general) | 30 | 50 | 20 | 30 | 15 |
| 落魄贵族 (noble) | 15 | 10 | 50 | 20 | 40 |
| 商贾之家 (merchant) | 60 | 5 | 10 | 25 | 30 |
| 江湖豪杰 (hero) | 20 | 30 | 25 | 35 | 25 |
| 皇族旁支 (royal) | 25 | 15 | 60 | 20 | 30 |

### 资源增减约束

| 规则 | 约束 |
|---|---|
| 单次选项 delta 范围 | -30 ～ +30（单项） |
| 单次选项总收益上限 | 净正收益不超过 +50（所有资源之和） |
| 高声望选项必须有代价 | 至少一种资源 delta < 0 |
| 不允许所有 delta 均为正 | 每个选项至少有一个 delta ≤ 0 |

---

## Player Impact（玩家体验影响）

- **决策代价感**：每个选项必须有取舍，避免"明显正确答案"。
- **资源危机感**：用红色高亮显示资源下降，强化紧张感。
- **进程感**：回合计数器 + 当前势力状态描述词（弱小 / 初成 / 壮大 / 一方霸主）。
- **身份差异感**：起始资源差异 + 部分事件文字根据身份差异化称呼。

---

## Reasoning（设计推导）

**为什么用线性事件序列而非树状分支：**
- 树状分支内容量是线性的指数倍，MVP 阶段内容生产成本不可控。
- 线性序列 + 资源增减已足以制造"每次游玩不同"的感觉（因为资源状态不同）。
- 等核心体验验证后再扩展条件分支。

**为什么不用 Ink 叙事引擎：**
- 引入外部依赖会增加学习成本和构建复杂度。
- 纯 JSON + 原生 JS 对当前规模已足够，且完全可控。
- 如果后期内容量大幅增加，可在 v0.3 之后评估迁移到 Ink。

---

## Validation（验收条件）

- [ ] `events.json` 和 `crisis.json` 结构通过 JSON Schema 校验（或手动检查）。
- [ ] 所有 2 个身份 × 2 条路线的事件序列均可完整游玩至第 20 回合。
- [ ] 4 个时段的选择、加成计算、效果结算均正确无误。
- [ ] 大型行动（占2时段）可正常执行，中断惩罚正确触发。
- [ ] 被动事件触发时弹出选择窗口，所有选项均可正常选择并产生对应后果。
- [ ] 每个事件节点的所有选项均满足"资源增减约束"规则。
- [ ] 时段加成不会导致资源数值超出 [0, 100] 范围（需在代码层 clamp）。
- [ ] 3 种结局（覆灭 / 阶段胜利 / 天下未定）均可被触发并正常显示。
- [ ] 至少 2 个 Buff 可正常触发并产生持续效果。

---

## Open Questions

### 需要决策的问题
- **性别差异化**：MVP 仅改称呼，还是某些事件提供性别专属选项？（当前设计：仅改称呼，可在 v0.2 扩展）
- **势力状态描述词阈值**：如何根据综合资源给出描述词？（建议：平均值 <30 = 弱小，30-50 = 初成，50-70 = 壮大，>70 = 一方霸主）
- **时段选择顺序**：是否强制按朔日→旬中→望日→月末顺序选择，还是允许任意顺序？（当前设计：允许任意顺序，但UI按时间轴排列）
- **大型行动中断**：中断后是"继续执行"还是"完全失败"？（当前设计：完全失败并触发惩罚）

### 可延后处理
- 事件触发条件系统（基于资源阈值触发特殊事件）
- 命运种子系统的完整因果链（M1 先实现埋种子，M2 实现种子发芽）
- 人才 NPC 完整关系网（M1 只做1-2个简化版）
- 全部 Buff 类型（M1 只做2个验证）
- 时间过渡语的动态生成（M1 用固定模板池）
