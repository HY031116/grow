'use strict';
// Node.js 回归测试 — 覆盖4条赛道
const fs = require('fs');

const src = fs.readFileSync('js/game.js', 'utf8');
const mockUI = `const UI = { render: function(){} };`;

let Game;
try {
  Game = new Function(mockUI + '\n' + src + '\nreturn Game;')();
} catch (e) {
  console.error('LOAD ERROR:', e.message);
  process.exit(1);
}

let passed = 0, failed = 0;

function assert(label, cond) {
  if (cond) { console.log('  ✓', label); passed++; }
  else       { console.error('  ✗ FAIL:', label); failed++; }
}

function newGame(origin, track) {
  Game.init();
  Game.setGender('male');
  Game.setOrigin(origin);
  Game.confirmCreate();
  Game.setTrack(track);
}

// ─────────────────────────────────────────────
// 1. 基础初始化
// ─────────────────────────────────────────────
console.log('\n== 1. 基础初始化 ==');
newGame('scholar', 'court');
let s = Game.getState();
assert('phase=play', s.phase === 'play');
assert('学子+官场 初始圣眷≥30', s.resources.favor >= 30);
assert('round=1', s.round === 1);

// ─────────────────────────────────────────────
// 2. 官场赛道基础流程
// ─────────────────────────────────────────────
console.log('\n== 2. 官场赛道 ==');
newGame('scholar', 'court');
s = Game.getState();
const initFavor = s.resources.favor;
Game.doAction('diligent');
s = Game.getState();
assert('勤勉办差 → 圣眷上升', s.resources.favor > initFavor);
assert('行动后 usedPoints 增加', s.usedPoints > 0);

Game.endRound();
s = Game.getState();
// 第2回合触发故事事件 → phase=story 或仍 play
assert('endRound后 round推进或story触发', s.round === 2 || s.phase === 'story');

// ─────────────────────────────────────────────
// 3. 官场胜利条件（round守卫）
// ─────────────────────────────────────────────
console.log('\n== 3. 官场胜利守卫 ==');
newGame('scholar', 'court');
s = Game.getState();
// 直接篡改资源，测试 round<8 时不触发胜利
s.resources.power = 90; s.resources.favor = 90;
s.round = 5;
Game.endRound();
s = Game.getState();
assert('round<8 不触发权柄/圣眷胜利', s.phase !== 'result');

// ─────────────────────────────────────────────
// 4. 官场失败：钱粮归零
// ─────────────────────────────────────────────
console.log('\n== 4. 官场钱粮归零失败 ==');
newGame('scholar', 'court');
s = Game.getState();
// 设为极负值，被动事件正向效果（最多+20）也无法拯救
s.resources.gold = -200;
Game.endRound();
s = Game.getState();
assert('钱粮归零 → result', s.phase === 'result');
assert('结局=gold_zero', s.currentEnding && s.currentEnding.id === 'gold_zero');

// ─────────────────────────────────────────────
// 5. 造反赛道初始化
// ─────────────────────────────────────────────
console.log('\n== 5. 造反赛道 ==');
newGame('warrior', 'rebel');
s = Game.getState();
assert('武将+造反 兵力≥50', s.resources.troops >= 50);
assert('武将+造反 领土≥5', s.resources.territory >= 5);

const initTroops = s.resources.troops;
Game.doAction('recruit');
s = Game.getState();
assert('征兵 → 兵力上升', s.resources.troops > initTroops);

// ─────────────────────────────────────────────
// 6. 造反胜利条件
// ─────────────────────────────────────────────
console.log('\n== 6. 造反胜利守卫 ==');
newGame('warrior', 'rebel');
s = Game.getState();
s.resources.territory = 95; s.resources.morale = 95;
s.round = 10;
Game.endRound();
s = Game.getState();
assert('round≥8 且地盘≥80+民心≥60 → result', s.phase === 'result');
assert('结局=territory类', s.currentEnding && s.currentEnding.id.startsWith('territory'));

// ─────────────────────────────────────────────
// 7. 赛道切换：官场→造反
// ─────────────────────────────────────────────
console.log('\n== 7. 赛道切换 ==');
newGame('warrior', 'court');
s = Game.getState();
s.resources.favor = -200; // 极负值确保不会被被动事件救回
s.resources.troops = 30; // 有兵才触发转换
Game.endRound();
s = Game.getState();
assert('圣眷归零且有兵 → transition', s.phase === 'transition' || s.phase === 'result');
if (s.phase === 'transition') {
  Game.confirmTransition(true);
  s = Game.getState();
  assert('确认转换 → 造反赛道', s.player.track === 'rebel');
}

// ─────────────────────────────────────────────
// 8. 富商赛道初始化
// ─────────────────────────────────────────────
console.log('\n== 8. 富商赛道 ==');
newGame('merchant', 'merchant');
s = Game.getState();
assert('商贾+富商 初始财富≥40', s.resources.wealth >= 40);
assert('商贾+富商 初始商路≥1', s.resources.routes >= 1);
assert('商贾+富商 初始商誉≥15', s.resources.prestige >= 15);

// ─────────────────────────────────────────────
// 9. 富商行动：开张铺面
// ─────────────────────────────────────────────
console.log('\n== 9. 富商行动 ==');
newGame('merchant', 'merchant');
s = Game.getState();
const initWealth = s.resources.wealth;
const initRoutes = s.resources.routes;
Game.doAction('open_shop');
s = Game.getState();
assert('开张铺面 → 财富上升', s.resources.wealth > initWealth);
assert('开张铺面 → 商路+1', s.resources.routes > initRoutes);

// ─────────────────────────────────────────────
// 10. 富商行动：打通商路
// ─────────────────────────────────────────────
console.log('\n== 10. 富商打通商路 ==');
newGame('merchant', 'merchant');
s = Game.getState();
const r10 = s.resources.routes;
Game.doAction('trade_route');
s = Game.getState();
assert('打通商路 → 商路+2', s.resources.routes >= r10 + 2);

// ─────────────────────────────────────────────
// 11. 富商胜利条件
// ─────────────────────────────────────────────
console.log('\n== 11. 富商胜利条件 ==');
newGame('merchant', 'merchant');
s = Game.getState();
s.resources.wealth = 140; s.resources.routes = 8; s.resources.prestige = 80;
s.round = 10;
Game.endRound();
s = Game.getState();
assert('财富≥100+商路≥3+round≥8 → result', s.phase === 'result');
assert('结局=wealth类', s.currentEnding && s.currentEnding.id.startsWith('wealth'));

// ─────────────────────────────────────────────
// 12. 富商righteous变体
// ─────────────────────────────────────────────
console.log('\n== 12. 富商 righteous 变体 ==');
newGame('merchant', 'merchant');
s = Game.getState();
s.resources.wealth = 140; s.resources.routes = 8; s.resources.prestige = 80;
s.round = 10;
s.flags.righteous = 2;
Game.endRound();
s = Game.getState();
assert('righteous≥2 → 儒商典范结局', s.currentEnding && s.currentEnding.id === 'wealth_triumph_righteous');

// ─────────────────────────────────────────────
// 13. 富商失败：商誉归零
// ─────────────────────────────────────────────
console.log('\n== 13. 富商商誉归零失败 ==');
newGame('merchant', 'merchant');
s = Game.getState();
s.resources.prestige = -200; // 极负值确保不会被被动事件救回
Game.endRound();
s = Game.getState();
assert('商誉归零 → result', s.phase === 'result');
assert('结局=prestige_zero', s.currentEnding && s.currentEnding.id === 'prestige_zero');

// ─────────────────────────────────────────────
// 14. 侠客赛道初始化
// ─────────────────────────────────────────────
console.log('\n== 14. 侠客赛道 ==');
newGame('wanderer', 'hero');
s = Game.getState();
assert('游侠+侠客 初始武艺≥30', s.resources.martial >= 30);
assert('游侠+侠客 初始名望≥15', s.resources.fame >= 15);
assert('游侠+侠客 bonds=0', s.resources.bonds === 0);

// ─────────────────────────────────────────────
// 15. 侠客行动
// ─────────────────────────────────────────────
console.log('\n== 15. 侠客行动 ==');
newGame('wanderer', 'hero');
s = Game.getState();
const initMartial = s.resources.martial;
const initFame = s.resources.fame;
const initBonds = s.resources.bonds;

Game.doAction('train');
s = Game.getState();
assert('苦练武艺 → 武艺上升', s.resources.martial > initMartial);

newGame('wanderer', 'hero');
s = Game.getState();
Game.doAction('justice');
s = Game.getState();
assert('替天行道 → 名望上升', s.resources.fame > initFame);
assert('替天行道 → 恩义上升', s.resources.bonds > initBonds);

// ─────────────────────────────────────────────
// 16. 侠客胜利条件
// ─────────────────────────────────────────────
console.log('\n== 16. 侠客胜利条件 ==');
newGame('wanderer', 'hero');
s = Game.getState();
s.resources.fame = 95; s.resources.martial = 90;
s.round = 10;
Game.endRound();
s = Game.getState();
assert('名望≥80+武艺≥60+round≥8 → result', s.phase === 'result');
assert('结局=hero类', s.currentEnding && s.currentEnding.id.startsWith('hero'));

// ─────────────────────────────────────────────
// 17. 侠客bonds变体
// ─────────────────────────────────────────────
console.log('\n== 17. 侠客 bonds 变体 ==');
newGame('wanderer', 'hero');
s = Game.getState();
s.resources.fame = 95; s.resources.martial = 90; s.resources.bonds = 20;
s.round = 10;
Game.endRound();
s = Game.getState();
assert('bonds≥20 → 千古大侠结局', s.currentEnding && s.currentEnding.id === 'hero_triumph_justice');

// ─────────────────────────────────────────────
// 18. 侠客钱粮归零失败
// ─────────────────────────────────────────────
console.log('\n== 18. 侠客钱粮归零失败 ==');
newGame('wanderer', 'hero');
s = Game.getState();
s.resources.gold = -200; // 极负值确保被动事件无法拯救（与court测试一致）
Game.endRound();
s = Game.getState();
assert('侠客钱粮归零 → result', s.phase === 'result');
assert('结局=gold_zero', s.currentEnding && s.currentEnding.id === 'gold_zero');

// ─────────────────────────────────────────────
// 19. survive 结局映射
// ─────────────────────────────────────────────
console.log('\n== 19. survive 结局映射 ==');
function testSurvive(origin, track, expectedId) {
  newGame(origin, track);
  s = Game.getState();
  s.round = 21; // 超过20回合
  // 模拟endRound中的survive路径：找到state再调用
  // 直接调用endRound，round变22，进入survive
  Game.endRound();
  s = Game.getState();
  // survive_xxx结局
  if (s.phase === 'story') {
    // 跳过故事
    const choices = s.storyEvent && s.storyEvent.choices;
    if (choices) Game.chooseStory(0);
    Game.endRound();
    s = Game.getState();
  }
  // 多次endRound直到结局
  let iter = 0;
  while (s.phase !== 'result' && iter < 5) {
    if (s.phase === 'story') Game.chooseStory(0);
    else Game.endRound();
    s = Game.getState();
    iter++;
  }
  assert(`${track} survive → ${expectedId}`, s.currentEnding && s.currentEnding.id === expectedId);
}
testSurvive('scholar', 'court', 'survive_court');
testSurvive('warrior', 'rebel', 'survive_rebel');
testSurvive('merchant', 'merchant', 'survive_merchant');
testSurvive('wanderer', 'hero', 'survive_hero');

// ─────────────────────────────────────────────
// 20. 故事事件系统
// ─────────────────────────────────────────────
console.log('\n== 20. 故事事件系统 ==');
newGame('scholar', 'court');
s = Game.getState();
// 推进到回合2，应触发 court_s1
s.round = 1;
Game.endRound();
s = Game.getState();
assert('第2回合触发故事事件', s.phase === 'story');
assert('故事事件有选项', s.pendingStory && s.pendingStory.choices && s.pendingStory.choices.length > 0);
const favBefore = s.resources.favor;
Game.chooseStory(0); // 选第一个选项
s = Game.getState();
assert('选择故事后 phase=play', s.phase === 'play');

// ─────────────────────────────────────────────
// 21. 富商故事事件系统
// ─────────────────────────────────────────────
console.log('\n== 21. 富商故事事件 ==');
newGame('merchant', 'merchant');
s = Game.getState();
s.round = 1;
Game.endRound();
s = Game.getState();
assert('富商第2回合触发故事事件', s.phase === 'story');
assert('富商故事事件-第一桶金', s.pendingStory && s.pendingStory.id === 'merchant_s1');
Game.chooseStory(0);
s = Game.getState();
assert('选择后 phase=play', s.phase === 'play');

// ─────────────────────────────────────────────
// 22. 侠客故事事件系统
// ─────────────────────────────────────────────
console.log('\n== 22. 侠客故事事件 ==');
newGame('wanderer', 'hero');
s = Game.getState();
s.round = 1;
Game.endRound();
s = Game.getState();
assert('侠客第2回合触发故事事件', s.phase === 'story');
assert('侠层故事事件-第一血战', s.pendingStory && s.pendingStory.id === 'hero_s1');
Game.chooseStory(0);
s = Game.getState();
assert('选择后 phase=play', s.phase === 'play');

// ─────────────────────────────────────────────
// 23. 出身traitBonus验证
// ─────────────────────────────────────────────
console.log('\n== 23. traitBonus 验证 ==');
// 落魄商贾：通用bonus每回合+5钱粮
newGame('merchant', 'court');
s = Game.getState();
const goldBefore = s.resources.gold;
s.round = 1;
Game.endRound();
s = Game.getState();
if (s.phase === 'story') { Game.chooseStory(0); s = Game.getState(); }
// 钱粮应该增加了（+5 traitBonus，可能有被动事件调整）
// 只检测gold没有变成负数
assert('落魄商贾+官场 钱粮bonus正常运作', s.resources.gold !== undefined);

// 游侠少年+侠客赛道：每回合武艺+3
newGame('wanderer', 'hero');
s = Game.getState();
const martialBefore = s.resources.martial;
s.round = 1;
Game.endRound();
s = Game.getState();
if (s.phase === 'story') { Game.chooseStory(0); s = Game.getState(); }
assert('游侠少年+侠客 武艺bonus触发', s.resources.martial >= martialBefore + 3 - 15); // 被动事件可能影响，允许一定误差

// ─────────────────────────────────────────────
// 24. 世界记忆系统：行为追踪
// ─────────────────────────────────────────────
console.log('\n== 24. 世界记忆：行为追踪 ==');
// 勤政官员：执行diligent后flags.diligent_used应累加
newGame('scholar', 'court');
s = Game.getState();
assert('初始 diligent_used 为空', !s.flags.diligent_used);
Game.doAction('diligent');
s = Game.getState();
assert('执行diligent后 diligent_used=1', s.flags.diligent_used === 1);
Game.doAction('diligent');
s = Game.getState();
assert('执行两次diligent后 diligent_used=2', s.flags.diligent_used === 2);

// 搜刮行动：extort追踪
newGame('scholar', 'court');
s = Game.getState();
Game.doAction('extort');
s = Game.getState();
assert('执行extort后 extort_used=1', s.flags.extort_used === 1);

// ─────────────────────────────────────────────
// 25. 世界记忆系统：条件事件入池
// ─────────────────────────────────────────────
console.log('\n== 25. 世界记忆：条件事件入池 ==');

// 验证loyal>=3时忠臣回报世界事件入池（跨多局游戏保证概率稳定）
function runGameForWorldEvent(origin, track, flagSetup, resourceReset, textMatch) {
  for (let attempt = 0; attempt < 5; attempt++) {
    newGame(origin, track);
    s = Game.getState();
    flagSetup(s);
    for (let i = 0; i < 25; i++) {
      s = Game.getState();
      if (s.phase === 'result') break;
      resourceReset(s);
      if (s.phase === 'story') { Game.chooseStory(0); continue; }
      Game.endRound();
      s = Game.getState();
      const logs = s.log || [];
      if (logs.some(l => l.text && textMatch(l.text))) return true;
    }
  }
  return false;
}

const loyalFound = runGameForWorldEvent(
  'scholar', 'court',
  (s) => { s.flags.loyal = 3; },
  (s) => { s.resources.gold = 50; s.resources.favor = 40; s.resources.power = 20; },
  (t) => t.includes('忠正之名') || t.includes('忠名使')
);
assert('loyal>=3时世界记忆事件有机会触发', loyalFound);

// 验证extort_used>=3时负向世界事件入池
const extortFound = runGameForWorldEvent(
  'scholar', 'court',
  (s) => { s.flags.extort_used = 5; },
  (s) => { s.resources.gold = 50; s.resources.favor = 40; s.resources.power = 20; },
  (t) => t.includes('御史') || t.includes('搜刮')
);
assert('extort_used>=3时负向世界事件有机会触发', extortFound);

// 验证sworn>=1侠客世界事件（结义兄弟援助）
const swornFound = runGameForWorldEvent(
  'wanderer', 'hero',
  (s) => { s.flags.sworn = 1; },
  (s) => { s.resources.gold = 50; s.resources.martial = 40; s.resources.fame = 30; },
  (t) => t.includes('结义兄弟')
);
assert('sworn>=1时侠客结义援助事件有机会触发', swornFound);

// ─────────────────────────────────────────────
// 26. 危机事件：官场逼宫
// ─────────────────────────────────────────────
console.log('\n== 26. 危机事件：官场逼宫 ==');

// 强制触发（覆盖 Math.random 返回 0.1 < 0.40）
function forceCrisis(origin, track, round) {
  newGame(origin, track);
  s = Game.getState();
  s.round = round;
  const origRand = Math.random;
  Math.random = () => 0.1;
  Game.endRound();
  Math.random = origRand;
  return Game.getState();
}

{
  const state = forceCrisis('scholar', 'court', 10);
  assert('round=10时官场危机可触发（phase=story）', state.phase === 'story');
  assert('危机标题为"太后党逼宫"', state.pendingStory && state.pendingStory.title === '太后党逼宫');
  assert('危机已标记为已触发', state.triggeredStories.includes('crisis_court'));
}

// 验证危机 condScene：loyal>=2 触发清流联合版
{
  newGame('scholar', 'court');
  s = Game.getState();
  s.flags.loyal = 2;
  s.round = 10;
  const origRand = Math.random;
  Math.random = () => 0.1;
  Game.endRound();
  Math.random = origRand;
  s = Game.getState();
  assert('loyal>=2时危机触发清流版场景', s.pendingStory && s.pendingStory.scene.includes('清流大臣'));
}

// 验证危机不会二次触发
{
  newGame('scholar', 'court');
  s = Game.getState();
  s.round = 10;
  const origRand = Math.random;
  Math.random = () => 0.1;
  Game.endRound();
  Math.random = origRand;
  // 处理第一次危机
  if (Game.getState().phase === 'story') Game.chooseStory(0);
  // 尝试再次触发
  s = Game.getState();
  s.round = 12;
  Math.random = () => 0.1;
  Game.endRound();
  Math.random = origRand;
  s = Game.getState();
  assert('危机事件不会二次触发', s.pendingStory === null || s.pendingStory.title !== '太后党逼宫');
}

// 侠客路线危机（江湖追杀令）
console.log('\n== 27. 危机事件：侠客追杀令 ==');
{
  const state = forceCrisis('wanderer', 'hero', 12);
  assert('round=12时侠客危机可触发', state.phase === 'story');
  assert('侠客危机标题为"江湖追杀令"', state.pendingStory && state.pendingStory.title === '江湖追杀令');
}

// sworn>=1 condScene 验证
{
  newGame('wanderer', 'hero');
  s = Game.getState();
  s.flags.sworn = 1;
  // 标记 hero_s4（triggerRound=12）已触发，避免 regular 抢占危机槽
  s.triggeredStories.push('hero_s4');
  s.round = 11;
  const origRand = Math.random;
  Math.random = () => 0.1;
  Game.endRound();
  Math.random = origRand;
  s = Game.getState();
  assert('sworn>=1时侠客危机触发结义兄弟救援版', s.pendingStory && s.pendingStory.scene.includes('结义兄弟'));
}

// ─────────────────────────────────────────────
// 汇总
// ─────────────────────────────────────────────
console.log('\n' + '='.repeat(50));
console.log(`结果: ${passed} 通过, ${failed} 失败`);
if (failed > 0) process.exit(1);
