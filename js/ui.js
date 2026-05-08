'use strict';

var UI = (() => {

  function render() {
    const s = Game.getState();
    document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
    switch (s.phase) {
      case 'create':     renderCreate(s);     break;
      case 'track':      renderTrack(s);      break;
      case 'ambition':   renderAmbition(s);   break;
      case 'play':       renderPlay(s);       break;
      case 'react':      renderReact(s);      break;
      case 'story':
        // 战役事件使用专属渲染
        if (s.battle) { renderBattle(s); break; }
        renderStory(s);
        break;
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

    // 根据出身设置赛道选择情景文本
    const trackIntroTexts = {
      scholar_court: '你凭才华得以入仕。朝堂大门已为你打开，现在要选择：成为一名清廉的忠臣还是权谋高手？',
      scholar_rebel: '当官道无望，或理想幻灭，你或许会走上一条不同的路：揭竿而起，开创属于自己的天地。',
      scholar_merchant: '用你的才智经营生意。以笔杆起家，用银两改变命运——这条路或许比入仕更自由。',
      scholar_hero: '抛弃文人身份，用剑而非笔为武器。有些人的侠义，就在那一刻闪现。',
      warrior_court: '身为武将，朝堂不是陌生之地。圣眷与权柄，你要如何在权力中心立足？',
      warrior_rebel: '你的兵权注定了一条路：要么为朝廷守疆，要么自立为王。选择吧。',
      warrior_merchant: '放下刀剑，用商业改变世界。曾经的武将，如今用银两筑起帝国。',
      warrior_hero: '从军营到江湖，行侠仗义的心从未改变。只是换了战场，换了对手。',
      merchant_court: '金钱开启了朝堂的大门。作为商贾，你的影响力有多大，取决于你如何在官场博弈。',
      merchant_rebel: '金钱能募兵，金钱能收买人心。商人或许是比武将更冷酷的革命者。',
      merchant_merchant: '这是属于你的舞台。财富在流动，商路在延伸，属于商人的帝国呼之欲出。',
      merchant_hero: '弃商从侠，你要用金钱和剑来守护心中的正义。',
      wanderer_court: '从江湖走入朝堂，游侠的身份是你的优势还是束缚？ ',
      wanderer_rebel: '聚义厅、山寨、起义军——江湖出身的你，或许天生就属于这条路。',
      wanderer_merchant: '游侠放下剑，拿起算盘。你的江湖人脉，是最好的商业资本。',
      wanderer_hero: '这是你最自然的归宿。侠义在心，剑在手，江湖由你开创传说。'
    };

    const trackIntroKey = `${s.player.origin}_${s.player.track || 'court'}`;
    const introText = trackIntroTexts[trackIntroKey] || '选择你这一生的方向，命运将从此改写。';
    const introEl = document.getElementById('track-intro-text');
    if (introEl) introEl.textContent = introText;

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

    // 内心独白（每回合固定，关键年份附加成长感悟）
    const monoEl = document.getElementById('monologue-text');
    if (monoEl) {
      const monoText = getMonologue(s);
      if (monoText.includes('\n')) {
        const parts = monoText.split('\n');
        monoEl.innerHTML = parts[0] + '<br><span class="growth-arc">' + parts[1] + '</span>';
      } else {
        monoEl.textContent = monoText;
      }
    }

    // 资源面板（含胜利目标进度条）
    const resPanel = document.getElementById('resources-panel');
    const goalHtml = buildGoalProgress(s);
    const delta = s.lastResDelta || {};
    resPanel.innerHTML = goalHtml + track.resources.map(def => {
      const val = s.resources[def.key] ?? 0;
      const pct = Math.min(100, Math.round(val / (def.displayMax || def.max) * 100));
      const isLow  = val < (def.lowVal  !== undefined ? def.lowVal  : 20);
      const isHigh = val >= (def.highVal !== undefined ? def.highVal : 70);
      const extraInfo = def.key === 'favor' && s.player.track === 'court'
        ? `<span class="res-sublabel">${getCourtTitle(val, s.player.gender)}</span>` : '';
      const d = delta[def.key];
      const deltaHtml = d ? `<span class="res-delta ${d > 0 ? 'res-delta-pos' : 'res-delta-neg'}">${d > 0 ? '+' : ''}${d}</span>` : '';
      // 体魄条颜色动态：高→绿，中→橙，低→红
      let barColor = def.color;
      if (def.key === 'vitality') {
        if (val > 60) barColor = '#27ae60';
        else if (val > 30) barColor = '#e67e22';
        else barColor = '#e74c3c';
      }
      return `
        <div class="res-item ${isLow ? 'res-low' : ''} ${isHigh ? 'res-high' : ''} ${def.key === 'vitality' ? 'res-vitality' : ''}">
          <div class="res-header">
            <span class="res-icon">${def.icon}</span>
            <span class="res-name">${def.name}${extraInfo}</span>
            <span class="res-val">${val}${deltaHtml}</span>
          </div>
          <div class="res-track">
            <div class="res-fill" style="width:${pct}%; background:${barColor}"></div>
          </div>
        </div>`;
    }).join('');

    // 行动列表（原有行动 + NPC 互动行动）
    const actPanel = document.getElementById('actions-panel');
    const actions = ACTIONS[s.player.track];

    // 季节指示器：列出本季强化的行动名
    const seasonIcons = { '春': '🌸', '夏': '☀️', '秋': '🍂', '冬': '❄️' };
    const boostedActions = actions.filter(a => a.seasonBonus && a.seasonBonus.season === s.season);
    const seasonIndicatorHtml = boostedActions.length > 0
      ? `<div class="season-indicator">
           <span class="season-icon">${seasonIcons[s.season] || ''}</span>
           <span class="season-label">${s.season}季强化：</span>
           <span class="season-boosted-list">${boostedActions.map(a => a.name).join('、')}</span>
         </div>` : '';

    // 季节指示器插入（actions-panel 的父级或上方占位元素）
    const actSectionHeader = document.getElementById('actions-section-header');
    if (actSectionHeader) actSectionHeader.innerHTML = seasonIndicatorHtml;

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
      // 当季强化标签
      const isSeasonBonus = act.seasonBonus && act.seasonBonus.season === s.season;
      const seasonTag = isSeasonBonus
        ? `<span class="act-season-badge" title="${act.seasonBonus.hint}">✦ ${act.seasonBonus.season}季强化</span>` : '';
      // 高风险行动：计算胜率，生成悬停详情 tooltip
      const winRate = act.isRiskAction
        ? (() => {
            const chance = Math.round((1 - act.failChance) * 100);
            const winStr = fmtEffect(act.effect);
            const loseStr = fmtEffect(act.failEffect);
            return `<span class="act-risk-badge">⚡ 搏一把</span>
                    <div class="act-risk-tooltip">
                      <div class="risk-tip-row"><span class="risk-tip-win">胜率 ${chance}%</span> 成功：${winStr}</div>
                      <div class="risk-tip-row"><span class="risk-tip-lose">败率 ${100 - chance}%</span> 失败：${loseStr}</div>
                    </div>`;
          })() : '';
      const btnClass = `action-btn${canUse ? '' : ' action-disabled'}${isSeasonBonus ? ' action-season' : ''}${act.isRiskAction ? ' action-risk' : ''}`;
      return `
        <button class="${btnClass}"
                onclick="if(!this.classList.contains('action-disabled')) Game.doAction('${act.id}')">
          <div class="act-top">
            <span class="act-icon">${act.icon}</span>
            <span class="act-name">${act.name}</span>
            <span class="act-cost">${'●'.repeat(act.cost)}</span>
          </div>
          <div class="act-desc">${act.desc}</div>
          <div class="act-effect${act.isRiskAction ? ' act-effect-risk' : ''}">${effectStr}${seasonTag}${winRate}</div>
        </button>`;
    }).join('') + npcActHtml;

    // 通用行动区（全赛道可用）
    const commonPanel = document.getElementById('common-actions-panel');
    if (commonPanel) {
      commonPanel.innerHTML = Game.COMMON_ACTIONS.map(act => {
        const canUse = act.cost <= remaining;
        const effectStr = fmtEffect(act.effect);
        // 当前赛道的适配加成（动态展示）
        const bonus = act.trackBonus && act.trackBonus[s.player.track];
        const bonusStr = bonus ? fmtEffect(bonus) : '';
        return `
          <button class="action-btn common-action-btn${canUse ? '' : ' action-disabled'}"
                  onclick="if(!this.classList.contains('action-disabled')) Game.doAction('${act.id}')">
            <div class="act-top">
              <span class="act-icon">${act.icon}</span>
              <span class="act-name">${act.name}</span>
              <span class="act-cost">${'●'.repeat(act.cost)}</span>
            </div>
            <div class="act-desc">${act.desc}</div>
            <div class="act-effect">${effectStr}${bonusStr ? ' <span class="act-track-bonus">' + bonusStr + '</span>' : ''}</div>
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
          const isAlly = rel >= 65;
          const label = rel < 35 ? '陌生' : rel < 65 ? '相识' : '盟友';
          const barColor = rel < 35 ? '#c0445a' : rel < 65 ? '#e8a04b' : '#2cb87a';
          const allyBadge = isAlly
            ? `<span class="npc-ally-badge">盟</span>` : '';
          return `
            <div class="npc-item${isAlly ? ' npc-ally' : ''}">
              <div class="npc-header">
                <span class="npc-icon">${npc.icon}</span>
                <span class="npc-name">${npc.name}</span>
                <span class="npc-title-label">${npc.title}</span>
                ${allyBadge}
                <span class="npc-rel-label" style="color:${barColor}">${label} ${rel}</span>
              </div>
              <div class="npc-bar-track">
                <div class="npc-bar-fill" style="width:${pct}%;background:${barColor}"></div>
                <div class="npc-ally-line" title="盟友阈值 65"></div>
              </div>
            </div>`;
        }).join('');
      npcPanelEl.innerHTML = npcEntries
        ? `<div class="npc-panel-title">👥 人脉关系</div>${npcEntries}`
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

    // 天下地图面板
    const mapPanelEl = document.getElementById('map-panel');
    if (mapPanelEl) {
      mapPanelEl.innerHTML = renderMapPanel(s);
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
  // 互动事件选择页（react 阶段）
  // ============================
  function renderReact(s) {
    show('screen-react');
    const evt = s.pendingEvent;
    if (!evt) return;
    document.getElementById('react-event-text').textContent = evt.text;
    document.getElementById('react-choices').innerHTML = evt.choices.map((c, i) => {
      const effStr = fmtEffect(c.effect);
      return `
        <button class="react-choice-btn" onclick="Game.chooseReaction(${i})">
          <div class="react-choice-desc">${c.desc}</div>
          <div class="react-choice-effect">${effStr}</div>
        </button>`;
    }).join('');
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
  // 战役事件页（手动战斗）
  // ============================
  function renderBattle(s) {
    show('screen-story');
    const b = s.battle;
    const ev = b.event;

    // 血条百分比
    const playerPct = Math.max(0, Math.round(b.playerHp / b.playerMaxHp * 100));
    const enemyPct  = Math.max(0, Math.round(b.enemyHp  / b.enemyMaxHp  * 100));

    // 战斗日志
    const logHtml = b.log.map(l => `
      <div class="battle-log-row">
        <span class="battle-log-round">第${l.round}轮</span>
        <span class="battle-log-move">${l.emoji} ${l.move}</span>
        <span class="battle-log-dmg">
          <span class="battle-dmg-pos">我方 -${l.eDmg}</span>
          <span class="battle-dmg-neg">敌方 -${l.pDmg}</span>
        </span>
      </div>`).join('');

    // 出招按钮或结算界面
    let actionHtml;
    if (b.done) {
      const won = b.won;
      const effStr = fmtEffect(won ? ev.winEffect : ev.loseEffect);
      actionHtml = `
        <div class="battle-result ${won ? 'battle-win' : 'battle-lose'}">
          <div class="battle-result-icon">${won ? '🏆' : '💔'}</div>
          <div class="battle-result-title">${won ? '胜利' : '败北'}</div>
          <div class="battle-result-story">${won ? ev.winStory : ev.loseStory}</div>
          <div class="battle-result-effect">${effStr}</div>
          <button class="btn-primary battle-continue-btn" onclick="Game.endBattle()">继续 →</button>
        </div>`;
    } else {
      actionHtml = `
        <div class="battle-moves">
          ${ev.moves.map((m, i) => `
            <button class="battle-move-btn" onclick="Game.chooseMove(${i})">
              <span class="move-emoji">${m.emoji}</span>
              <span class="move-label">${m.label}</span>
              <span class="move-desc">${m.desc}</span>
              <span class="move-range">攻 ${m.pDmg[0]}-${m.pDmg[1]} ／ 受 ${m.eDmg[0]}-${m.eDmg[1]}</span>
            </button>`).join('')}
        </div>`;
    }

    document.getElementById('story-title').textContent = `⚔️ ${ev.title}`;
    document.getElementById('story-scene').textContent = ev.flavor;

    document.getElementById('story-choices').innerHTML = `
      <div class="battle-ui">
        <!-- 血条区 -->
        <div class="battle-bars">
          <div class="battle-bar-side">
            <div class="battle-bar-label">你方</div>
            <div class="battle-bar-track">
              <div class="battle-bar-fill battle-bar-player" style="width:${playerPct}%"></div>
            </div>
            <div class="battle-bar-val">${b.playerHp} / ${b.playerMaxHp}</div>
          </div>
          <div class="battle-bar-vs">VS</div>
          <div class="battle-bar-side">
            <div class="battle-bar-label">${ev.enemyName}</div>
            <div class="battle-bar-track">
              <div class="battle-bar-fill battle-bar-enemy" style="width:${enemyPct}%"></div>
            </div>
            <div class="battle-bar-val">${b.enemyHp} / ${b.enemyMaxHp}</div>
          </div>
        </div>

        <!-- 回合指示 -->
        ${!b.done ? `<div class="battle-round-indicator">第 ${b.round} / ${b.maxRounds} 轮 — 请出招</div>` : ''}

        <!-- 战斗日志 -->
        ${b.log.length > 0 ? `<div class="battle-log">${logHtml}</div>` : ''}

        <!-- 出招 / 结算 -->
        ${actionHtml}
      </div>`;
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

    // 人生时间线
    const timelineEl = document.getElementById('result-timeline');
    if (timelineEl && s.timeline && s.timeline.length > 0) {
      const YEAR_NUMS = ['元','二','三','四','五','六','七','八','九','十',
                         '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十'];
      timelineEl.innerHTML = `
        <div class="timeline-title">— 一生轨迹 —</div>
        <ul class="timeline-list">
          ${s.timeline.map(entry => {
            const yr = YEAR_NUMS[Math.min((entry.round || 1) - 1, 19)];
            return `
            <li class="timeline-item">
              <span class="timeline-icon">${entry.icon}</span>
              <span class="timeline-year">乾明${yr}年</span>
              <span class="timeline-text">${entry.text}</span>
            </li>`;
          }).join('')}
        </ul>`;
      timelineEl.classList.remove('hidden');
    } else if (timelineEl) {
      timelineEl.classList.add('hidden');
    }
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
        // 弱冠（1-5年）
        ['初入庙堂，方知人心叵测，一切从头学起。', '寒窗苦读十数载，今日方踏入这是非之地。', '仕途之始，如履薄冰，一步亦不敢轻率。'],
        // 青年/而立（6-12年）
        ['混迹朝堂数载，终于摸清了几分门道。', '在这权谋之地，笑面之下皆是刀锋。', '年岁渐长，方知忠奸之别有时不过一念之差。'],
        // 盛年/不惑（13-25年）
        ['宦海沉浮二十年，悲欢离合已成过眼云烟。', '历经风雨，终知这朝堂从无永远的赢家。', '功名利禄，终归尘土；唯问心无愧，方能安眠。'],
        // 知天命（26年后）
        ['半生已过，回望来路，每一步皆有代价。', '年岁渐老，庙堂依旧，来来去去的人换了一茬又一茬。', '此刻才真正明白，所谓权谋不过是借口，人心才是终极战场。']
      ],
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
        ['兵戈半生，如今看这山河，比年轻时多了几分悲悯。', '征战二十余载，输赢已不重要，活着本身便是答案。', '暮年回望，当年一声令下的豪气，如今化作了沉甸甸的责任。'],
        ['粮草告急，军心动摇，须得速做决断。', '兵力不足，强攻只是送死，需另谋良策。'],
        ['铁骑万里，所向披靡，天下已成囊中之物。', '麾下将士骁勇，此番定能席卷中原。'],
        ['民心所向，胜过千军万马。', '百姓拥戴，方是真正的王者根基。']
      ],
      merchant: [
        ['家道中落，然商道无绝境，从头再来又何妨。', '银子是最诚实的东西，给得到，也要得到。', '一文钱难倒英雄汉，然英雄者，必能生财有道。'],
        ['数载经营，方知商道之深，非只买卖而已。', '诚信为本，人脉为金，此二者缺一不可。', '走南闯北，见识了天下百态，方知财富之道在于人心。'],
        ['富甲一方，然财聚人散，需思长久之计。', '半生积累，终于站稳脚跟，然守业更难于创业。', '天下无不散之筵席，唯有根基稳固，方能传之子孙。'],
        ['年岁渐长，对金银已无年轻时那般执念。', '走过了半辈子，留下的不是银子，而是那些一起拼过的人。', '此刻最想的不是再赚多少，而是盘点这一生，值不值得。'],
        ['账目亏空，若不速寻转机，前功尽弃。', '此番失利，不过磨砺，商场沉浮，早已料及。'],
        ['财富滚滚而来，唯恐引来嫉恨之眼。', '商路畅通，货如轮转，此乃商人之至乐。'],
        ['人无信不立，商无义不远，此理放诸四海皆准。', '善贾者，不必在意一时之得失，需看长远。']
      ],
      hero: [
        ['一介草莽，凭一腔热血行走天下，不知前路几何。', '仗剑江湖，路见不平便拔刀，这便是吾之道。', '初出茅庐，方知江湖深似海，强者如林。'],
        ['走过了生死，方知江湖二字，重于泰山。', '一诺千金，恩怨分明，此乃侠客本色。', '见识了人间百态，愈发明白何为真正的公道。'],
        ['闯荡半生，笑看过多少英雄豪杰，如今仍立于此，幸也。', '侠之大者，非只为一身，更为天下苍生。', '武林中的传说，终将是后人的故事，此生无憾。'],
        ['老了，快刀慢了半分，但眼光却更准了。', '年轻时追求的是赢，如今明白了什么叫作值得。', '江湖走到这一步，早已不在乎名号，只在乎问心无愧。'],
        ['声名狼藉，须得以实际行动证明吾之侠义。', '身陷重围，然侠客从不言退，迎难而上乃是本色。'],
        ['武艺大成，天下强者皆已败于吾剑下。', '一身武艺，行遍天下，无往不胜。'],
        ['结义兄弟情深，纵使刀山火海，亦能共赴。', '侠义之名，已传四方，然吾心仍似初出之时。']
      ]
    };

    const trackPool = pools[r];
    if (!trackPool) return '';

    // 根据回合选早/中/晚期基础独白
    let basePool;
    if (round <= 5)       basePool = trackPool[0];  // 弱冠：初入
    else if (round <= 12) basePool = trackPool[1];  // 青年/而立：摸索
    else if (round <= 25) basePool = trackPool[2];  // 盛年/不惑：沉淀
    else                  basePool = trackPool[3];  // 知天命：回望

    // 根据资源状态覆盖（条件独白优先级高于基础独白）
    // 注意：每个赛道 pool 结构：[0弱冠, 1青年, 2盛年, 3知天命, 4状态条件1, 5状态条件2, 6状态条件3]
    let condPool = null;
    if (r === 'court') {
      if ((res.favor || 0) < 20) condPool = trackPool[4];
      else if ((res.power || 0) >= 60) condPool = trackPool[5];
      else if ((res.gold || 0) < 15) condPool = trackPool[6];
    } else if (r === 'rebel') {
      if ((res.troops || 0) < 20 || (res.morale || 0) < 20) condPool = trackPool[4];
      else if ((res.troops || 0) >= 80) condPool = trackPool[5];
      else if ((res.morale || 0) >= 50) condPool = trackPool[6];
    } else if (r === 'merchant') {
      if ((res.wealth || 0) < 20) condPool = trackPool[4];
      else if ((res.wealth || 0) >= 70) condPool = trackPool[5];
      else if ((res.prestige || 0) >= 40) condPool = trackPool[6];
    } else if (r === 'hero') {
      if ((res.fame || 0) < 20) condPool = trackPool[4];
      else if ((res.martial || 0) >= 50) condPool = trackPool[5];
      else if ((res.bonds || 0) >= 25) condPool = trackPool[6];
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

    // 成长弧感悟：在关键年份（第5/10/15/20年）追加一句基于 flag 的成长感悟
    const growthText = getGrowthArc(s);
    if (growthText) {
      return '「' + text + '」\n' + growthText;
    }
    return '「' + text + '」';
  }

  // 成长弧：关键年份生成基于 flag 的感悟文字
  function getGrowthArc(s) {
    const round = s.round;
    const f = s.flags || {};
    const r = s.player.track;
    const td = Game.getTimeDisplay();
    // 在关键年份触发：5/10/15/20/25/30/35 回合
    if (![5, 10, 15, 20, 25, 30, 35].includes(round)) return null;

    // 年龄称号作为阶段标签
    const stageLabel = td.ageTitle || (round <= 10 ? '青年' : round <= 20 ? '盛年' : '不惑');

    // 基于 flag 优先级生成感悟（先看特殊行为，再看赛道默认）
    if ((f.benevolent || 0) >= 2) {
      const pool = [
        '施恩于人，方知天下并非只有尔虞我诈。',
        '济弱扶倾，此乃吾心中不灭之光。',
        '多行善举，渐觉心中有所沉淀——这比任何功名都让人安心。'
      ];
      return `——${stageLabel}悟：${pool[round % pool.length]}`;
    }
    if (f.loyal) {
      return `——${stageLabel}悟：忠义二字，重若千钧，此生不改。`;
    }
    if (f.corrupt) {
      const corruptPool = [
        '尝过权欲之味，方知人心之深渊难测。',
        '得到的越多，失去的也越多——这个道理来得太晚。',
        '此刻回望，哪些是真正属于自己的，哪些不过是过眼云烟。'
      ];
      return `——${stageLabel}悟：${corruptPool[Math.floor(round / 5) % corruptPool.length]}`;
    }
    if (f.righteous) {
      return `——${stageLabel}悟：秉公执法，得罪了不少人，却问心无愧。`;
    }
    if ((f.informed || 0) >= 2) {
      return `——${stageLabel}悟：凡事多打探，多思量——这个习惯救过我不止一次。`;
    }
    // 赛道默认感悟（按阶段分层）
    const defaults = {
      court: [
        '宦海沉浮，已渐明白进退之道。',
        '庙堂之上，学会了沉默与等待。',
        '朝堂岁月磨去了棱角，留下的是城府。',
        '所有的算计到头来，不过是为了让自己睡得着觉。'
      ],
      rebel: [
        '乱世之中，方知人心所向才是真正的胜负。',
        '征战数载，已不再执着于一城一地之得失。',
        '兵者凶器，然不得不用，此乃乱世之悲。',
        '当年那股冲劲还在，只是多了几分对生死的敬畏。'
      ],
      merchant: [
        '商道即人道，诚信才是立身之本。',
        '走南闯北，财富之外，更懂得了人情冷暖。',
        '富贵浮云，真正留得住的只有口碑与信誉。',
        '数过了太多银子，却越来越明白钱的边界在哪里。'
      ],
      hero: [
        '江湖岁月，早已磨去了少年意气，留下的是沉稳。',
        '行侠仗义，方知路见不平并非只靠拳头。',
        '闯荡已久，明白了强者的责任在于保护弱者。',
        '名声什么的，终究是别人给的——自己知道做了什么，就够了。'
      ]
    };
    const pool = defaults[r] || ['岁月如梭，已渐有所悟。'];
    return `——${stageLabel}悟：${pool[Math.floor(round / 5 - 1) % pool.length]}`;
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

  // ============================
  // 天下地图面板
  // ============================
  // 城市定义：id / 名称 / SVG坐标 / 出身归属 / 赛道标签 / 背景描述
  const MAP_CITIES = [
    { id: 'capital',   name: '燕京', x: 120, y: 52,  origin: null,       tracks: ['court'],           isCapital: true,
      desc: '帝都，天下权柄汇聚之所。百官列朝，圣眷难测，一言可决万人命运。' },
    { id: 'north',     name: '塞外', x: 120, y: 16,  origin: null,       tracks: ['rebel'],           isFrontier: true,
      desc: '边疆荒漠，狼烟不息。草莽英雄最初揭竿之地，战马嘶鸣，刀剑为证。' },
    { id: 'youzhou',   name: '幽州', x: 178, y: 34,  origin: 'warrior',  tracks: ['rebel','court'],   isFrontier: true,
      desc: '东北重镇，三面皆山，易守难攻。将门子弟世代驻守，弓马娴熟，精兵辈出。' },
    { id: 'guanzhong', name: '关中', x: 68,  y: 50,  origin: 'scholar',  tracks: ['court'],           isFrontier: false,
      desc: '古都旧地，四塞之固，人杰地灵。书院林立，士子赴京赶考的必经之路。' },
    { id: 'yangzhou',  name: '扬州', x: 192, y: 90,  origin: 'merchant', tracks: ['merchant'],        isFrontier: false,
      desc: '江南门户，水运要道，商贾云集。天下商货多由此中转，富庶甲于一方。' },
    { id: 'jiangnan',  name: '江南', x: 182, y: 130, origin: null,       tracks: ['merchant','hero'], isFrontier: false,
      desc: '鱼米之乡，丝绸重镇。运河如织，酒楼歌肆间藏着无数侠客与商贾的传奇。' },
    { id: 'jingchu',   name: '荆楚', x: 112, y: 118, origin: null,       tracks: ['rebel','hero'],    isFrontier: false,
      desc: '中原腹地，四通八达，兵家必争之地。义军与朝廷在此拉锯，侠士也在此留名。' },
    { id: 'shudi',     name: '蜀地', x: 54,  y: 110, origin: 'wanderer', tracks: ['hero'],            isFrontier: false,
      desc: '天府之国，山高路险，藏龙卧虎。奇人异士隐居深山，出奇兵之所，游侠故土。' },
    { id: 'lingnan',   name: '岭南', x: 138, y: 158, origin: null,       tracks: ['merchant','hero'], isFrontier: false,
      desc: '南海之滨，异域风物荟萃。海船往来，香料珍宝汇聚于此，海贸通衢。' }
  ];

  // 道路连接
  const MAP_ROADS = [
    ['capital','north'],['capital','youzhou'],['capital','guanzhong'],['capital','yangzhou'],
    ['capital','jingchu'],['youzhou','north'],['guanzhong','shudi'],['yangzhou','jiangnan'],
    ['jiangnan','jingchu'],['jiangnan','lingnan'],['jingchu','shudi'],['jingchu','lingnan']
  ];

  // 当前地图游戏状态缓存（供 mapCityClick 使用）
  let _mapState = null;

  // 根据赛道/资源/当前city状态，生成城市当前状态说明
  function getCityStatusText(city, s) {
    const track = s.player.track;
    const origin = s.player.origin;
    const res = s.resources;
    if (city.origin === origin) {
      return '🏠 你的故土——从这里出发，踏上一生的征途。';
    }
    if (city.isCapital && track === 'court') {
      const fav = res.favor || 0;
      if (fav >= 70) return `★ 帝都核心——你的圣眷已达 ${fav}，皇帝对你青眼有加。`;
      if (fav >= 40) return `★ 帝都——圣眷 ${fav}，在朝堂中尚有立足之地。`;
      return `★ 帝都——圣眷仅余 ${fav}，处境岌岌可危。`;
    }
    if (track === 'rebel') {
      const territory = res.territory || 0;
      const rebelOrder = ['youzhou','north','jingchu','shudi','guanzhong','jiangnan','lingnan','yangzhou','capital'];
      const pos = rebelOrder.indexOf(city.id);
      const controlledCount = Math.floor(territory / 12);
      if (pos < controlledCount) return `⚔️ 已在你麾下——义军地盘 ${territory}，此地已归控制。`;
      return `○ 尚未攻取——地盘 ${territory} 点，此地仍在观望中。`;
    }
    if (track === 'merchant') {
      const routes = res.routes || 0;
      const merchantOrder = ['yangzhou','jiangnan','capital','jingchu','lingnan'];
      const pos = merchantOrder.indexOf(city.id);
      if (pos < routes + 1) return `🛤️ 商路已通——此地已纳入你的贸易网络（共 ${routes} 条商路）。`;
      if (!city.tracks.includes('merchant')) return `○ 暂无商路——此地尚未开拓商业。`;
      return `○ 待开拓——商路 ${routes} 条，此地尚未纳入贸易版图。`;
    }
    if (track === 'hero') {
      const fame = res.fame || 0;
      const heroOrder = ['shudi','jingchu','jiangnan','lingnan'];
      const pos = heroOrder.indexOf(city.id);
      if (pos < Math.floor(fame / 25) + 1) return `🗡️ 侠名已至——名望 ${fame}，此地百姓知晓你的名字。`;
      if (!city.tracks.includes('hero')) return `○ 侠迹未至——此地与你暂无交集。`;
      return `○ 尚未扬名——名望 ${fame}，此地还不知你的存在。`;
    }
    if (track === 'court' && city.tracks.includes('court')) {
      return (res.power || 0) >= 40 ? `✦ 势力已延伸至此——权柄 ${res.power}。` : `○ 尚未渗透——权柄 ${res.power || 0}，力量尚弱。`;
    }
    return '○ 此地与你目前无直接关联。';
  }

  // 城市点击处理（通过 UI.mapCityClick 暴露）
  function mapCityClick(cityId) {
    const city = MAP_CITIES.find(c => c.id === cityId);
    if (!city) return;
    const detailEl = document.getElementById('map-detail');
    if (!detailEl) return;
    const statusText = _mapState ? getCityStatusText(city, _mapState) : '';
    detailEl.innerHTML = `
      <div class="map-detail-name">${city.isCapital ? '★ ' : ''}${city.name}</div>
      <div class="map-detail-desc">${city.desc}</div>
      ${statusText ? `<div class="map-detail-status">${statusText}</div>` : ''}`;
  }

  function renderMapPanel(s) {
    _mapState = s; // 缓存当前状态供点击事件使用
    const track = s.player.track;
    const origin = s.player.origin;
    const res = s.resources;

    // 根据赛道和资源决定每个城市的高亮状态
    function getCityState(city) {
      if (city.origin === origin) return 'origin';
      if (city.isCapital && track === 'court') {
        return (res.favor || 0) >= 50 ? 'active-high' : 'active';
      }
      if (track === 'rebel') {
        const territory = res.territory || 0;
        const controlledCount = Math.floor(territory / 12);
        const rebelOrder = ['youzhou','north','jingchu','shudi','guanzhong','jiangnan','lingnan','yangzhou','capital'];
        const pos = rebelOrder.indexOf(city.id);
        if (pos < controlledCount) return 'active';
        return 'inactive';
      }
      if (track === 'merchant') {
        const routes = res.routes || 0;
        if (!city.tracks.includes('merchant')) return 'inactive';
        const merchantOrder = ['yangzhou','jiangnan','capital','jingchu','lingnan'];
        const pos = merchantOrder.indexOf(city.id);
        if (pos < routes + 1) return routes >= 3 ? 'active-high' : 'active';
        return 'inactive';
      }
      if (track === 'hero') {
        const fame = res.fame || 0;
        if (!city.tracks.includes('hero')) return 'inactive';
        const heroOrder = ['shudi','jingchu','jiangnan','lingnan'];
        const pos = heroOrder.indexOf(city.id);
        if (pos < Math.floor(fame / 25) + 1) return fame >= 70 ? 'active-high' : 'active';
        return 'inactive';
      }
      if (track === 'court' && city.tracks.includes('court')) {
        return (res.power || 0) >= 40 ? 'active' : 'inactive';
      }
      return 'inactive';
    }

    // 生成 SVG（每座城市包含可点击的 <g> 元素）
    const cityElems = MAP_CITIES.map(city => {
      const cityState = getCityState(city);
      const r = city.isCapital ? 7 : 5;
      const fillMap = { origin: '#e8b84b', 'active-high': '#4caf81', active: '#5b8fe8', inactive: '#2e2e2e' };
      const strokeMap = { origin: '#ffd700', 'active-high': '#2c9', active: '#8ab4f8', inactive: '#555' };
      const fill = fillMap[cityState] || '#2e2e2e';
      const stroke = strokeMap[cityState] || '#555';
      const isOrigin = city.origin === origin;
      const starMark = city.isCapital ? `<text x="${city.x}" y="${city.y - 10}" text-anchor="middle" font-size="10" fill="#c9a84c" pointer-events="none">★</text>` : '';
      const originMark = isOrigin ? `<circle cx="${city.x}" cy="${city.y}" r="${r+4}" fill="none" stroke="#e8b84b" stroke-width="1.5" stroke-dasharray="3,2" pointer-events="none"/>` : '';
      // 可点击透明热区（比圆点大，易于触摸）
      const hitArea = `<circle cx="${city.x}" cy="${city.y}" r="${r + 8}" fill="transparent" onclick="UI.mapCityClick('${city.id}')" style="cursor:pointer"/>`;
      return `<g class="map-city-g">
        ${originMark}${starMark}
        <circle cx="${city.x}" cy="${city.y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.5" pointer-events="none"/>
        <text x="${city.x}" y="${city.y + r + 9}" text-anchor="middle" font-size="8.5" fill="${cityState === 'inactive' ? '#666' : '#ccc'}" font-family="serif" pointer-events="none">${city.name}</text>
        ${hitArea}
      </g>`;
    }).join('');

    const roadElems = MAP_ROADS.map(([a, b]) => {
      const ca = MAP_CITIES.find(c => c.id === a);
      const cb = MAP_CITIES.find(c => c.id === b);
      if (!ca || !cb) return '';
      return `<line x1="${ca.x}" y1="${ca.y}" x2="${cb.x}" y2="${cb.y}" stroke="#3a3a3a" stroke-width="1"/>`;
    }).join('');

    const trackLabel = { court: '朝廷势力范围', rebel: '义军控制地盘', merchant: '商贸辐射范围', hero: '侠名所至之地' };

    return `
      <div class="map-panel-title">天下地图</div>
      <div class="map-legend">${trackLabel[track] || ''}</div>
      <svg viewBox="0 0 240 180" width="100%" style="max-height:160px;display:block;" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="180" rx="6" fill="#1a1a1a"/>
        ${roadElems}
        ${cityElems}
      </svg>
      <div id="map-detail" class="map-detail"><span class="map-detail-hint">点击城市查看详情</span></div>
      <div class="map-footer">
        <span class="map-legend-item map-leg-origin">● 出身地</span>
        <span class="map-legend-item map-leg-active">● 势力范围</span>
        <span class="map-legend-item map-leg-high">● 鼎盛之地</span>
      </div>`;
  }

  return { render, mapCityClick };
})();

/* ==========================================
   新手指引逻辑
   ========================================== */
(function() {
  var TUTORIAL_KEY = 'quanmou_tutorial_seen';
  var _currentStep = 1;

  // 在 DOMContentLoaded 后挂载，避免 UI 对象尚未初始化
  window.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem(TUTORIAL_KEY)) {
      _showStep(1);
      document.getElementById('tutorial-overlay').classList.remove('hidden');
    }
  });

  function _showStep(n) {
    _currentStep = n;
    var steps = document.querySelectorAll('.tutorial-step');
    var dots  = document.querySelectorAll('.tutorial-dot');
    steps.forEach(function(el) {
      el.classList.toggle('active', parseInt(el.dataset.step) === n);
    });
    dots.forEach(function(el) {
      el.classList.toggle('active', parseInt(el.dataset.dot) === n);
    });
    var btn = document.getElementById('tutorial-btn-main');
    if (btn) {
      btn.textContent = n >= 3 ? '开始游戏 ✓' : '下一步 →';
    }
  }

  window.UI.tutorialOpen = function() {
    _showStep(1);
    document.getElementById('tutorial-overlay').classList.remove('hidden');
  };

  window.UI.tutorialClose = function() {
    var cb = document.getElementById('tutorial-no-show-cb');
    if (cb && cb.checked) {
      localStorage.setItem(TUTORIAL_KEY, '1');
    }
    document.getElementById('tutorial-overlay').classList.add('hidden');
  };

  window.UI.tutorialNext = function() {
    if (_currentStep >= 3) {
      UI.tutorialClose();
    } else {
      _showStep(_currentStep + 1);
    }
  };

  window.UI.tutorialGoTo = function(n) {
    _showStep(n);
  };
})();
