'use strict';

const UI = (() => {

  function render() {
    const s = Game.getState();
    document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
    switch (s.phase) {
      case 'create':     renderCreate(s);     break;
      case 'track':      renderTrack(s);      break;
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
  // 游戏主界面
  // ============================
  function renderPlay(s) {
    show('screen-play');
    const track = TRACKS[s.player.track];
    const remaining = s.actionPoints - s.usedPoints;

    // 顶部信息
    document.getElementById('round-display').textContent =
      `第 ${s.round} 回合 · 共 ${s.maxRounds} 回合`;
    document.getElementById('situation-text').textContent = getSituation(s);
    document.getElementById('ap-display').innerHTML =
      `${'<span class="ap-dot used"></span>'.repeat(s.usedPoints)}` +
      `${'<span class="ap-dot"></span>'.repeat(remaining)}`;

    // 资源面板（含胜利目标进度条）
    const resPanel = document.getElementById('resources-panel');
    const goalHtml = buildGoalProgress(s);
    resPanel.innerHTML = goalHtml + track.resources.map(def => {
      const val = s.resources[def.key] ?? 0;
      const pct = Math.round(val / def.max * 100);
      const isLow  = val < (def.lowVal  !== undefined ? def.lowVal  : 20);
      const isHigh = val >= (def.highVal !== undefined ? def.highVal : 70);
      const extraInfo = def.key === 'favor' && s.player.track === 'court'
        ? `<span class="res-sublabel">${getCourtTitle(val)}</span>` : '';
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

    // 行动列表
    const actPanel = document.getElementById('actions-panel');
    const actions = ACTIONS[s.player.track];
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
    }).join('');

    // 结束回合按钮
    const endBtn = document.getElementById('btn-end-round');
    endBtn.textContent = remaining > 0
      ? `结束回合（剩余 ${remaining} 点行动）`
      : '结束本回合 →';

    // 事件日志
    const logEl = document.getElementById('event-log');
    if (s.log.length === 0) {
      logEl.innerHTML = '<div class="log-empty">事件记录将在此显示……</div>';
    } else {
      logEl.innerHTML = s.log.slice(0, 6).map(entry => `
        <div class="log-entry log-${entry.type}">
          <span class="log-round">第${entry.round}回合</span>
          <span class="log-text">${entry.text}</span>
        </div>`).join('');
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

    document.getElementById('story-title').textContent = story.title;
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
    document.getElementById('result-title').textContent = ending.title;
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
    document.getElementById('result-rounds').textContent =
      `${origin.name} · ${track.name} · 历经 ${s.round - 1} 回合`;

    const statsEl = document.getElementById('result-stats');
    statsEl.innerHTML = track.resources.map(def => {
      const val = s.resources[def.key] ?? 0;
      const extra = def.key === 'favor' && s.player.track === 'court'
        ? ` (${getCourtTitle(val)})` : '';
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
