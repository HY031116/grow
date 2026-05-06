'use strict';

const UI = (() => {

  function render() {
    const s = Game.getState();
    document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
    switch (s.phase) {
      case 'create':     renderCreate(s);     break;
      case 'track':      renderTrack(s);      break;
      case 'ambition':   renderAmbition(s);   break;
      case 'play':       renderPlay(s);       break;
      case 'story':      renderStory(s);      break;
      case 'transition': renderTransition(s); break;
      case 'result':     renderResult(s);     break;
    }
  }

  // ============================
  // 创建角色页
  // ============================
  function renderCreate(s) {
    show('screen-create');

    // 性别按钮
    document.querySelectorAll('.gender-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.gender === s.player.gender);
    });

    // 出身卡片
    document.querySelectorAll('.origin-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.origin === s.player.origin);
    });

    // 开始按钮
    const btn = document.getElementById('btn-create');
    btn.disabled = !s.player.origin;
    btn.textContent = s.player.origin ? '踏上人生之路 →' : '请先选择出身';

    // 存档检查：如有存档则显示"继续游戏"区域
    const continueSection = document.getElementById('continue-section');
    const saveInfo = Game.getSaveInfo();
    if (saveInfo && continueSection) {
      const d = new Date(saveInfo.savedAt);
      const dateStr = `${d.getMonth()+1}/${d.getDate()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
      const NUMS_S = ['元','二','三','四','五','六','七','八','九','十',
                      '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十'];
      const yrStr = NUMS_S[Math.min(saveInfo.round - 1, 19)];
      document.getElementById('continue-info').textContent =
        `${saveInfo.originName} · ${saveInfo.trackName} · 乾明${yrStr}年 · ${dateStr}`;
      continueSection.classList.remove('hidden');
    } else if (continueSection) {
      continueSection.classList.add('hidden');
    }
  }

  // ============================
  // 赛道选择页
  // ============================
  function renderTrack(s) {
    show('screen-track');
    const origin = ORIGINS[s.player.origin];
    document.getElementById('track-origin-name').textContent = origin.name;

    document.querySelectorAll('.track-card').forEach(card => {
      const trackId = card.dataset.track;
      card.classList.toggle('selected', trackId === s.player.track);
      const badge = card.querySelector('.recommend-badge');
      if (badge) badge.style.display = origin.recommended === trackId ? 'block' : 'none';
    });
  }

  // ============================
  // 个人志向选择页
  // ============================
  function renderAmbition(s) {
    show('screen-ambition');
    const track = TRACKS[s.player.track];
    document.getElementById('ambition-track-name').textContent = track.name;
    const ambitions = Game.AMBITIONS;
    const container = document.getElementById('ambition-list');
    container.innerHTML = Object.values(ambitions).map(amb => `
      <div class="ambition-card" onclick="Game.setAmbition('${amb.id}')">
        <div class="amb-icon">${amb.icon}</div>
        <div class="amb-body">
          <div class="amb-name">${amb.name}</div>
          <div class="amb-desc">${amb.desc}</div>
          <div class="amb-bonus">⚡ ${amb.bonusDesc}</div>
          <div class="amb-tag">${amb.tag}</div>
        </div>
      </div>`).join('');
  }

  // ============================
  // 游戏主界面
  // ============================
  function renderPlay(s) {
    show('screen-play');
    const track = TRACKS[s.player.track];
    const remaining = s.actionPoints - s.usedPoints;

    // 顶部信息（时间感沉浸式展示）
    const td = Game.getTimeDisplay();
    document.getElementById('round-display').innerHTML =
      `乾明${td.year}年 · ${td.season} <span class="time-age">（${td.ageTitle}，${td.age}岁）</span>`;
    document.getElementById('situation-text').textContent = getSituation(s);
    document.getElementById('ap-display').innerHTML =
      `${'<span class="ap-dot used"></span>'.repeat(s.usedPoints)}` +
      `${'<span class="ap-dot"></span>'.repeat(remaining)}`;

    // 内心独白（每回合固定）
    const monoEl = document.getElementById('monologue-text');
    if (monoEl) monoEl.textContent = getMonologue(s);

    // 资源面板（含胜利目标进度条）
    const resPanel = document.getElementById('resources-panel');
    const goalHtml = buildGoalProgress(s);
    resPanel.innerHTML = goalHtml + track.resources.map(def => {
      const val = s.resources[def.key] ?? 0;
      const pct = Math.round(val / def.max * 100);
      const isLow  = val < (def.lowVal  !== undefined ? def.lowVal  : 20);
      const isHigh = val >= (def.highVal !== undefined ? def.highVal : 70);
      const extraInfo = def.key === 'favor' && s.player.track === 'court'
        ? `<span class="res-sublabel">${getCourtTitle(val, s.player.gender)}</span>` : '';
      return `
        <div class="res-item ${isLow ? 'res-low' : ''} ${isHigh ? 'res-high' : ''}">
          <div class="res-header">
            <span class="res-icon">${def.icon}</span>
            <span class="res-name">${def.name}${extraInfo}</span>
            <span class="res-val">${val}</span>
          </div>
          <div class="res-track">
            <div class="res-fill" style="width:${pct}%; background:${def.color}"></div>
          </div>
        </div>`;
    }).join('');

    // 行动列表（原有行动 + NPC 互动行动）
    const actPanel = document.getElementById('actions-panel');
    const actions = ACTIONS[s.player.track];
    const npcAction = Game.NPC_ACTIONS[s.player.track];
    const npcActHtml = npcAction ? (() => {
      const canUse = npcAction.cost <= remaining;
      const npcDef = Game.NPC_DATA[npcAction.npcId];
      const curRel = s.npcs[npcAction.npcId] || 0;
      const relLabel = curRel < 35 ? '陌生' : curRel < 65 ? '相识' : '盟友';
      return `
        <button class="action-btn npc-action-btn${canUse ? '' : ' action-disabled'}"
                onclick="if(!this.classList.contains('action-disabled')) Game.doAction('${npcAction.id}')">
          <div class="act-top">
            <span class="act-icon">${npcAction.icon}</span>
            <span class="act-name">${npcAction.name}</span>
            <span class="act-cost">${'●'.repeat(npcAction.cost)}</span>
          </div>
          <div class="act-desc">${npcAction.desc}</div>
          <div class="act-effect npc-rel-status">${npcDef ? npcDef.name + '（' + relLabel + ' ' + curRel + '/100）' : ''} +关系${npcAction.npcEffect}</div>
        </button>`;
    })() : '';
    actPanel.innerHTML = actions.map(act => {
      const canUse = act.cost <= remaining;
      const effectStr = fmtEffect(act.effect);
      return `
        <button class="action-btn${canUse ? '' : ' action-disabled'}"
                onclick="if(!this.classList.contains('action-disabled')) Game.doAction('${act.id}')">
          <div class="act-top">
            <span class="act-icon">${act.icon}</span>
            <span class="act-name">${act.name}</span>
            <span class="act-cost">${'●'.repeat(act.cost)}</span>
          </div>
          <div class="act-desc">${act.desc}</div>
          <div class="act-effect">${effectStr}</div>
        </button>`;
    }).join('') + npcActHtml;

    // 通用行动区（全赛道可用）
    const commonPanel = document.getElementById('common-actions-panel');
    if (commonPanel) {
      commonPanel.innerHTML = Game.COMMON_ACTIONS.map(act => {
        const canUse = act.cost <= remaining;
        const effectStr = fmtEffect(act.effect);
        return `
          <button class="action-btn common-action-btn${canUse ? '' : ' action-disabled'}"
                  onclick="if(!this.classList.contains('action-disabled')) Game.doAction('${act.id}')">
            <div class="act-top">
              <span class="act-icon">${act.icon}</span>
              <span class="act-name">${act.name}</span>
              <span class="act-cost">${'●'.repeat(act.cost)}</span>
            </div>
            <div class="act-desc">${act.desc}</div>
            <div class="act-effect">${effectStr}</div>
          </button>`;
      }).join('');
    }

    // NPC 关系面板（资源面板下方）
    const npcPanelEl = document.getElementById('npc-panel');
    if (npcPanelEl) {
      const npcEntries = Object.values(Game.NPC_DATA)
        .filter(npc => npc.tracks.includes(s.player.track))
        .map(npc => {
          const rel = s.npcs[npc.id] || 0;
          const pct = rel;
          const label = rel < 35 ? '陌生' : rel < 65 ? '相识' : '盟友';
          const barColor = rel < 35 ? '#e07' : rel < 65 ? '#fa0' : '#2c9';
          return `
            <div class="npc-item">
              <div class="npc-header">
                <span class="npc-icon">${npc.icon}</span>
                <span class="npc-name">${npc.name}</span>
                <span class="npc-title-label">${npc.title}</span>
                <span class="npc-rel-label" style="color:${barColor}">${label} ${rel}</span>
              </div>
              <div class="npc-bar-track">
                <div class="npc-bar-fill" style="width:${pct}%;background:${barColor}"></div>
              </div>
            </div>`;
        }).join('');
      npcPanelEl.innerHTML = npcEntries
        ? `<div class="npc-panel-title">人脉关系</div>${npcEntries}`
        : '';
    }

    // 世界状态面板（NPC面板下方）
    const worldPanelEl = document.getElementById('world-panel');
    if (worldPanelEl && s.world) {
      const stab = s.world.stability || 0;
      const unr  = s.world.unrest    || 0;
      const stabLabel = stab >= 70 ? '治世' : stab >= 40 ? '动荡' : '乱世';
      const unrLabel  = unr  <= 30 ? '安居' : unr  <= 60 ? '不安' : '动乱';
      const stabColor = stab >= 70 ? '#4caf81' : stab >= 40 ? '#e8a04b' : '#d94f5c';
      const unrColor  = unr  <= 30 ? '#4caf81' : unr  <= 60 ? '#e8a04b' : '#d94f5c';
      worldPanelEl.innerHTML = `
        <div class="world-panel-title">天下格局</div>
        <div class="world-item">
          <div class="world-row">
            <span class="world-label">🌐 天下安定</span>
            <span class="world-val" style="color:${stabColor}">${stabLabel} ${stab}</span>
          </div>
          <div class="world-bar-track">
            <div class="world-bar-fill" style="width:${stab}%;background:${stabColor}"></div>
          </div>
        </div>
        <div class="world-item">
          <div class="world-row">
            <span class="world-label">⚡ 民间动荡</span>
            <span class="world-val" style="color:${unrColor}">${unrLabel} ${unr}</span>
          </div>
          <div class="world-bar-track">
            <div class="world-bar-fill" style="width:${unr}%;background:${unrColor}"></div>
          </div>
        </div>`;
    }
    }

    // 结束回合按钮
    const endBtn = document.getElementById('btn-end-round');
    endBtn.textContent = remaining > 0
      ? `结束回合（剩余 ${remaining} 点行动）`
      : '结束本回合 →';

    // 事件日志
    const logEl = document.getElementById('event-log');
    const NUMS_SHORT = ['元','二','三','四','五','六','七','八','九','十',
                        '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十'];
    if (s.log.length === 0) {
      logEl.innerHTML = '<div class="log-empty">事件记录将在此显示……</div>';
    } else {
      logEl.innerHTML = s.log.slice(0, 6).map(entry => {
        const yr = NUMS_SHORT[Math.min((entry.round || 1) - 1, 19)];
        return `
        <div class="log-entry log-${entry.type}">
          <span class="log-round">乾明${yr}年</span>
          <span class="log-text">${entry.text}</span>
        </div>`;
      }).join('');
    }
  }

  // ============================
  // 赛道转换确认页
  // ============================
  function renderTransition(s) {
    show('screen-transition');
    const t = s.pendingTransition;
    if (!t) return;
    document.getElementById('transition-title').textContent = t.title;
    document.getElementById('transition-scene').textContent = t.scene;
    document.getElementById('transition-confirm-text').textContent = t.confirmText;
    document.getElementById('transition-decline-text').textContent = t.declineText;
  }

  // ============================
  // 主线剧情事件页
  // ============================
  function renderStory(s) {
    show('screen-story');
    const story = s.pendingStory;
    if (!story) return;

    // NPC 关系事件：特殊头部（显示 NPC 名称和图标）
    if (story.isNpcEvent) {
      document.getElementById('story-title').textContent =
        `${story.npcIcon} ${story.npcName} · ${story.npcTitle}`;
    } else {
      document.getElementById('story-title').textContent = story.title;
    }
    document.getElementById('story-scene').textContent = story.scene;

    const choicesEl = document.getElementById('story-choices');
    choicesEl.innerHTML = story.choices.map((c, i) => {
      const effStr = fmtEffect(c.effect);
      return `
        <button class="story-choice-btn" onclick="Game.chooseStory(${i})">
          <div class="choice-text">${c.text}</div>
          <div class="choice-effect">${effStr}</div>
        </button>`;
    }).join('');
  }

  // ============================
  // 结局页
  // ============================
  function renderResult(s) {
    show('screen-result');
    const ending = s.currentEnding;
    const track = TRACKS[s.player.track];
    const origin = ORIGINS[s.player.origin];

    document.getElementById('result-badge').textContent = ending.badge;
    document.getElementById('result-badge').className =
      `result-badge result-${ending.type}`;
    // 女性玩家官场路的 badge 使用女性称谓
    let resultTitle = ending.title;
    if (s.player.gender === 'female') {
      if (ending.id === 'favor_triumph')       resultTitle = '巾帼名臣';
      if (ending.id === 'favor_triumph_judge') resultTitle = '铁面诰命';
      if (ending.id === 'power_triumph')       resultTitle = '权倾天下';
      if (ending.id === 'power_triumph_usurper') resultTitle = '权妃乱国';
    }
    document.getElementById('result-title').textContent = resultTitle;
    document.getElementById('result-story').textContent = ending.story;
    // 历史注脚（flag 相关，有则显示）
    const footnoteEl = document.getElementById('result-footnote');
    if (footnoteEl) {
      if (ending.footnote) {
        footnoteEl.textContent = ending.footnote;
        footnoteEl.classList.remove('hidden');
      } else {
        footnoteEl.classList.add('hidden');
      }
    }
    const tdEnd = Game.getTimeDisplay();
    document.getElementById('result-rounds').textContent =
      `${origin.name} · ${track.name} · 乾明${tdEnd.year}年 · 享年${tdEnd.age}岁`;

    // 个人志向标记
    const ambEl = document.getElementById('result-ambition');
    if (ambEl && s.player.ambition && Game.AMBITIONS[s.player.ambition]) {
      const amb = Game.AMBITIONS[s.player.ambition];
      ambEl.textContent = `${amb.icon} ${amb.name} · ${amb.tag}`;
      ambEl.classList.remove('hidden');
    } else if (ambEl) {
      ambEl.classList.add('hidden');
    }

    const statsEl = document.getElementById('result-stats');
    statsEl.innerHTML = track.resources.map(def => {
      const val = s.resources[def.key] ?? 0;
      const extra = def.key === 'favor' && s.player.track === 'court'
        ? ` (${getCourtTitle(val, s.player.gender)})` : '';
      return `
        <div class="stat-row">
          <span class="stat-label">${def.icon} ${def.name}</span>
          <span class="stat-val">${val}${extra}</span>
        </div>`;
    }).join('');
  }

  // ============================
  // 辅助函数
  // ============================

  function show(id) {
    document.getElementById(id).classList.remove('hidden');
  }

  // 胜利目标进度条
  function buildGoalProgress(s) {
    const r = s.resources;
    const t = s.player.track;
    let goals = [];

    if (t === 'court') {
      const favPct = Math.min(100, Math.round(r.favor / 85 * 100));
      const powPct = Math.min(100, Math.round(r.power / 80 * 100));
      goals = [
        { label: '圣眷目标', pct: favPct, done: r.favor >= 85, color: '#e8c45a' },
        { label: '权柄目标', pct: powPct, done: r.power >= 80, color: '#9b59b6' }
      ];
    } else if (t === 'rebel') {
      const terPct = Math.min(100, Math.round(r.territory / 80 * 100));
      const morPct = Math.min(100, Math.round(r.morale / 60 * 100));
      goals = [
        { label: '地盘目标', pct: terPct, done: r.territory >= 80, color: '#e67e22' },
        { label: '民心目标', pct: morPct, done: r.morale >= 60,    color: '#2ecc71' }
      ];
    } else if (t === 'merchant') {
      const weaPct = Math.min(100, Math.round(r.wealth / 100 * 100));
      const routesDone = r.routes >= 3;
      goals = [
        { label: '财富目标', pct: weaPct,            done: r.wealth >= 100, color: '#f1c40f' },
        { label: '商路目标', pct: Math.min(100, Math.round(r.routes / 3 * 100)), done: routesDone, color: '#27ae60' }
      ];
    } else if (t === 'hero') {
      const famPct = Math.min(100, Math.round(r.fame / 80 * 100));
      const marPct = Math.min(100, Math.round(r.martial / 60 * 100));
      goals = [
        { label: '名望目标', pct: famPct, done: r.fame >= 80,    color: '#f39c12' },
        { label: '武艺目标', pct: marPct, done: r.martial >= 60, color: '#e74c3c' }
      ];
    }

    if (!goals.length) return '';
    const bars = goals.map(g => `
      <div class="goal-item">
        <span class="goal-label${g.done ? ' goal-done' : ''}">${g.label}${g.done ? ' ✓' : ''}</span>
        <div class="goal-track">
          <div class="goal-fill" style="width:${g.pct}%;background:${g.color}"></div>
        </div>
        <span class="goal-pct">${g.pct}%</span>
      </div>`).join('');
    return `<div class="goal-panel">${bars}</div>`;
  }

  function getSituation(s) {
    const courtSituations = [
      '朝堂波云诡谲，风雨欲来。',
      '圣上勤政，百官各怀心思。',
      '朝中党争渐烈，需步步为营。',
      '皇威浩荡，忠奸之分愈发分明。',
      '权贵相争，鹿死谁手，尚未可知。',
      '朝堂风平浪静，暗流却在涌动。'
    ];
    const rebelSituations = [
      '天下烽烟四起，英雄各据一方。',
      '乱世之中，刀剑才是真理。',
      '官军在四处集结，局势不容乐观。',
      '各路枭雄雄起，逐鹿中原之时已近。',
      '民心思变，正是英雄用武之地。',
      '战鼓隆隆，山河动荡，谁主沉浮？'
    ];
    const merchantSituations = [
      '商场如战场，机遇稍纵即逝。',
      '銀子开路，路路通畅。',
      '天下熙熙，皆为利来；天下围围，皆为利往。',
      '商路波澜四起，财富暗流涌动。',
      '富可敌国之路，就在眼前。',
      '一分耕耗，十分收获，这便是商道。'
    ];
    const heroSituations = [
      '江湖险恶，然而侠义常在。',
      '仗剑走天涯，路见不平拔刀相助。',
      '名望如剑，刺破黑暗。',
      '恩怨分明，是非自有公论。',
      '江湖儿女，豪情万丈。',
      '大侠之路，九死一生，却无怨无悔。'
    ];
    const pools = { court: courtSituations, rebel: rebelSituations, merchant: merchantSituations, hero: heroSituations };
    const pool = pools[s.player.track] || courtSituations;
    return pool[s.round % pool.length];
  }

  // ============================
  // 内心独白（每回合固定一句，基于状态确定性选取）
  // ============================
  function getMonologue(s) {
    const r = s.player.track;
    const res = s.resources;
    const round = s.round;
    // 每个赛道：[早期, 中期, 危困, 顺境, 晚期, 反思] 各选一条
    const pools = {
      court: [
        // 早期（1-5年）
        ['初入庙堂，方知人心叵测，一切从头学起。', '寒窗苦读十数载，今日方踏入这是非之地。', '仕途之始，如履薄冰，一步亦不敢轻率。'],
        // 中期（6-12年）
        ['混迹朝堂数载，终于摸清了几分门道。', '在这权谋之地，笑面之下皆是刀锋。', '年岁渐长，方知忠奸之别有时不过一念之差。'],
        // 晚期（13年后）
        ['宦海沉浮二十年，悲欢离合已成过眼云烟。', '历经风雨，终知这朝堂从无永远的赢家。', '功名利禄，终归尘土；唯问心无愧，方能安眠。'],
        // 圣眷危困
        ['圣颜不悦，此刻如芒在背，须得寻一良策。', '失了圣眷，便如无根之萍，随时可被倾覆。'],
        // 权柄雄厚
        ['权柄在手，方知天下何物不可为。', '朝中党羽已聚，然功高震主之忧，时时萦绕心头。'],
        // 钱粮紧张
        ['囊中羞涩，官场人情却一分不能少。', '为官者若连打点之资都无，处处碰壁，实属难堪。']
      ],
      rebel: [
        ['揭竿而起，前路茫茫，然已无退路。', '大丈夫立于天地间，岂能任人宰割，当奋起一战！', '振臂高呼，应者寥寥，然吾心不改。'],
        ['数载征战，麾下儿郎已见生死，情谊愈深。', '战场磨砺，方知何为真正的生死兄弟。', '攻城掠地，然百姓之苦，日日难忘。'],
        ['谋定天下，此生或不能见，然后人自当续我未竟之志。', '成王败寇，此刻已无暇多想，唯有向前。', '半生征战，山河已改，吾之名，或将永载史册。'],
        ['粮草告急，军心动摇，须得速做决断。', '兵力不足，强攻只是送死，需另谋良策。'],
        ['铁骑万里，所向披靡，天下已成囊中之物。', '麾下将士骁勇，此番定能席卷中原。'],
        ['民心所向，胜过千军万马。', '百姓拥戴，方是真正的王者根基。']
      ],
      merchant: [
        ['家道中落，然商道无绝境，从头再来又何妨。', '银子是最诚实的东西，给得到，也要得到。', '一文钱难倒英雄汉，然英雄者，必能生财有道。'],
        ['数载经营，方知商道之深，非只买卖而已。', '诚信为本，人脉为金，此二者缺一不可。', '走南闯北，见识了天下百态，方知财富之道在于人心。'],
        ['富甲一方，然财聚人散，需思长久之计。', '半生积累，终于站稳脚跟，然守业更难于创业。', '天下无不散之筵席，唯有根基稳固，方能传之子孙。'],
        ['账目亏空，若不速寻转机，前功尽弃。', '此番失利，不过磨砺，商场沉浮，早已料及。'],
        ['财富滚滚而来，唯恐引来嫉恨之眼。', '商路畅通，货如轮转，此乃商人之至乐。'],
        ['人无信不立，商无义不远，此理放诸四海皆准。', '善贾者，不必在意一时之得失，需看长远。']
      ],
      hero: [
        ['一介草莽，凭一腔热血行走天下，不知前路几何。', '仗剑江湖，路见不平便拔刀，这便是吾之道。', '初出茅庐，方知江湖深似海，强者如林。'],
        ['走过了生死，方知江湖二字，重于泰山。', '一诺千金，恩怨分明，此乃侠客本色。', '见识了人间百态，愈发明白何为真正的公道。'],
        ['闯荡半生，笑看过多少英雄豪杰，如今仍立于此，幸也。', '侠之大者，非只为一身，更为天下苍生。', '武林中的传说，终将是后人的故事，此生无憾。'],
        ['声名狼藉，须得以实际行动证明吾之侠义。', '身陷重围，然侠客从不言退，迎难而上乃是本色。'],
        ['武艺大成，天下强者皆已败于吾剑下。', '一身武艺，行遍天下，无往不胜。'],
        ['结义兄弟情深，纵使刀山火海，亦能共赴。', '侠义之名，已传四方，然吾心仍似初出之时。']
      ]
    };

    const trackPool = pools[r];
    if (!trackPool) return '';

    // 根据回合选早/中/晚期基础独白
    let basePool;
    if (round <= 5)       basePool = trackPool[0];
    else if (round <= 12) basePool = trackPool[1];
    else                  basePool = trackPool[2];

    // 根据资源状态覆盖（条件独白优先级高于基础独白）
    let condPool = null;
    if (r === 'court') {
      if ((res.favor || 0) < 20) condPool = trackPool[3];
      else if ((res.power || 0) >= 60) condPool = trackPool[4];
      else if ((res.gold || 0) < 15) condPool = trackPool[5];
    } else if (r === 'rebel') {
      if ((res.troops || 0) < 20 || (res.morale || 0) < 20) condPool = trackPool[3];
      else if ((res.troops || 0) >= 80) condPool = trackPool[4];
      else if ((res.morale || 0) >= 50) condPool = trackPool[5];
    } else if (r === 'merchant') {
      if ((res.wealth || 0) < 20) condPool = trackPool[3];
      else if ((res.wealth || 0) >= 70) condPool = trackPool[4];
      else if ((res.prestige || 0) >= 40) condPool = trackPool[5];
    } else if (r === 'hero') {
      if ((res.fame || 0) < 20) condPool = trackPool[3];
      else if ((res.martial || 0) >= 50) condPool = trackPool[4];
      else if ((res.bonds || 0) >= 25) condPool = trackPool[5];
    }

    const chosen = condPool || basePool;
    // 用 round 作为确定性索引，同一回合独白不变
    let text = chosen[round % chosen.length];
    // 女性玩家替换含男性称谓的文本
    if (s.player.gender === 'female') {
      text = text
        .replace('大丈夫立于天地间，岂能任人宰割，当奋起一战！', '女子岂可任人宰割？立于天地间，巾帼亦要奋起一战！')
        .replace('半生征战，山河已改，吾之名，或将永载史册。', '半生征战，山河已改，巾帼女将之名，或将永载史册。')
        .replace('结义兄弟情深', '结义姐妹情深');
    }
    return '「' + text + '」';
  }

  function fmtEffect(effect) {
    if (!effect) return '';
    const names = {
      gold: '钱粮', favor: '圣眷', power: '权柄',
      troops: '兵力', morale: '民心', territory: '地盘',
      wealth: '财富', routes: '商路', prestige: '商誉',
      martial: '武艺', fame: '名望', bonds: '恩义'
    };
    return Object.entries(effect)
      .filter(([, v]) => v !== 0)
      .map(([k, v]) => {
        const cls = v > 0 ? 'eff-pos' : 'eff-neg';
        const sign = v > 0 ? '+' : '';
        return `<span class="${cls}">${sign}${v}${names[k] || k}</span>`;
      }).join(' ');
  }

  return { render };
})();
