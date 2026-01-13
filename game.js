const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const movesEl = document.getElementById("moves");
const levelEl = document.getElementById("level");
const comboEl = document.getElementById("combo");
const objectiveListEl = document.getElementById("objectiveList");
const levelStatusEl = document.getElementById("levelStatus");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const resetBtn = document.getElementById("resetBtn");
const mapScreenEl = document.getElementById("mapScreen");
const gameScreenEl = document.getElementById("gameScreen");
const mapPathEl = document.getElementById("mapPath");
const playBtn = document.getElementById("playBtn");
const mapSvgEl = document.getElementById("mapSvg");
const mapScrollEl = document.getElementById("mapScroll");
const mapBtn = document.getElementById("mapBtn");
const shopScreenEl = document.getElementById("shopScreen");
const shopBtn = document.getElementById("shopBtn");
const shopCloseBtn = document.getElementById("shopCloseBtn");
const summaryConfettiEl = document.getElementById("summaryConfetti");
const coinsEl = document.getElementById("coins");
const starsTotalEl = document.getElementById("starsTotal");
const streakEl = document.getElementById("streak");
const chestProgressEl = document.getElementById("chestProgress");
const claimChestBtn = document.getElementById("claimChestBtn");
const levelRewardsEl = document.getElementById("levelRewards");
const rewardStarsEl = document.getElementById("rewardStars");
const rewardTextEl = document.getElementById("rewardText");
const backToMapBtn = document.getElementById("backToMapBtn");
const tutorialOverlayEl = document.getElementById("tutorialOverlay");
const tutorialTextEl = document.getElementById("tutorialText");
const tutorialNextBtn = document.getElementById("tutorialNextBtn");
const summaryOverlayEl = document.getElementById("summaryOverlay");
const summaryStarsEl = document.getElementById("summaryStars");
const summaryCoinsEl = document.getElementById("summaryCoins");
const summaryBoostersEl = document.getElementById("summaryBoosters");
const failOverlayEl = document.getElementById("failOverlay");
const continueBtn = document.getElementById("continueBtn");
const failRetryBtn = document.getElementById("failRetryBtn");
const failMapBtn = document.getElementById("failMapBtn");
const failCostEl = document.getElementById("failCost");
const boardToastEl = document.getElementById("boardToast");
const retryBtn = document.getElementById("retryBtn");
const shareBtn = document.getElementById("shareBtn");
const summaryMapBtn = document.getElementById("summaryMapBtn");
const summaryNextBtn = document.getElementById("summaryNextBtn");
const soundToggleBtn = document.getElementById("soundToggle");
const soundVolumeEl = document.getElementById("soundVolume");
const movesBaseEl = document.getElementById("movesBase");
const movesStepEl = document.getElementById("movesStep");
const objBaseEl = document.getElementById("objBase");
const objStepEl = document.getElementById("objStep");
const crateStartEl = document.getElementById("crateStart");
const crateStepEl = document.getElementById("crateStep");
const movesBaseValEl = document.getElementById("movesBaseVal");
const movesStepValEl = document.getElementById("movesStepVal");
const objBaseValEl = document.getElementById("objBaseVal");
const objStepValEl = document.getElementById("objStepVal");
const crateStartValEl = document.getElementById("crateStartVal");
const crateStepValEl = document.getElementById("crateStepVal");
const rampPreviewEl = document.getElementById("rampPreview");
const vipStatusEl = document.getElementById("vipStatus");
const vipBuyBtn = document.getElementById("vipBuyBtn");
const vipClaimBtn = document.getElementById("vipClaimBtn");
const shopCoinsEl = document.getElementById("shopCoins");
const vipRewardEl = document.getElementById("vipReward");
const vipTimerEl = document.getElementById("vipTimer");
const installBtn = document.getElementById("installBtn");
const chapterLabelEl = document.getElementById("chapterLabel");

const boosterButtons = document.querySelectorAll(".booster");
const boostShuffleEl = document.getElementById("boostShuffle");
const boostHammerEl = document.getElementById("boostHammer");
const boostStormEl = document.getElementById("boostStorm");

const gridSize = 7;
const padding = 18;
const cellSize = (canvas.width - padding * 2) / gridSize;
const radius = cellSize * 0.32;

let colors = ["#f37d6b", "#f4bf5f", "#63c2a7", "#6b8df6", "#b57be8"];
const chapterThemes = [
  {
    accent: "#f08e6e",
    glow: "rgba(240, 142, 110, 0.35)",
    vignette: "rgba(72, 44, 28, 0.18)",
    highlight: "rgba(255, 255, 255, 0.65)",
    ambient: ["#f7b089", "#f4bf5f", "#f08e6e"],
    path: "#f0b56a",
    pathGlow: "rgba(240, 142, 110, 0.55)",
  },
  {
    accent: "#5aa7e0",
    glow: "rgba(90, 167, 224, 0.35)",
    vignette: "rgba(30, 42, 64, 0.2)",
    highlight: "rgba(255, 255, 255, 0.7)",
    ambient: ["#63c2a7", "#6b8df6", "#5aa7e0"],
    path: "#6baee7",
    pathGlow: "rgba(90, 167, 224, 0.55)",
  },
];
const chapters = [
  {
    name: "Market Run",
    count: 50,
    intro: "Basics and crates",
    themeIndex: 0,
    rules: { allowIce: false, allowStorm: false, crateStart: 6, hintDelay: 4.5, swapSpeed: 7 },
  },
  {
    name: "Sky Harbor",
    count: 30,
    intro: "Ice, storms, QOL",
    themeIndex: 1,
    rules: { allowIce: true, allowStorm: true, crateStart: 0, hintDelay: 3.3, swapSpeed: 8 },
  },
];
const totalLevels = chapters.reduce((sum, chapter) => sum + chapter.count, 0);

function getChapterIndex(level) {
  let total = 0;
  for (let i = 0; i < chapters.length; i++) {
    total += chapters[i].count;
    if (level < total) return i;
  }
  return Math.max(0, chapters.length - 1);
}

function getChapterStart(index) {
  let start = 0;
  for (let i = 0; i < index; i++) {
    start += chapters[i].count;
  }
  return start;
}

function getChapterForLevel(level) {
  const index = getChapterIndex(level);
  const start = getChapterStart(index);
  return {
    ...chapters[index],
    index,
    start,
    localIndex: level - start,
  };
}

const tuning = {
  movesBase: 24,
  movesStep: 2,
  objBase: 14,
  objStep: 3,
  crateStart: 8,
  crateStep: 2,
};

let levels = buildLevels(totalLevels, tuning);

let grid = [];
let score = 0;
let moves = 0;
let levelIndex = 0;
let objectives = [];
let boosters = { shuffle: 0, hammer: 0, storm: 0 };
let levelBoosters = { shuffle: 0, hammer: 0, storm: 0 };

let selectedCell = null;
let activeBooster = null;
let isResolving = false;
let combo = 0;
let levelComplete = false;
let levelFailed = false;
let continueUsed = false;
let effects = [];
let pulses = new Map();
let screenFlash = 0;
let lastFrame = 0;
let fallSpeed = 6;
let swapSpeed = 7;
let tileId = 0;
let animTime = 0;
let ambient = [];
let shakeTime = 0;
let shakeStrength = 0;
let shakeX = 0;
let shakeY = 0;
let clearQueue = [];
let clearDelay = 0;
let onClearComplete = null;
let swapBack = null;
let swapBackTimer = 0;
let ambientPalette = ["#f7b089", "#f4bf5f"];
let currentTheme = chapterThemes[0];
let deferredInstallPrompt = null;
let unlockedLevels = 1;
let movesStart = 0;
let tutorialActive = false;
let tutorialStep = 0;
const cascadeClearDelay = 0.12;
let hintDelay = 4.5;
let hintCells = null;
let needsMoveCheck = true;
let lastInteractionTime = 0;
let toastTimer = null;
const tutorialSteps = [
  "Swap any two tiles to make a match of 3.",
  "Match 4 to create a line clear powerup.",
  "Match 5 to create a color bomb.",
];
const chestThreshold = 15;
const progress = loadProgress();
unlockedLevels = Math.max(unlockedLevels, progress.unlockedLevels || 1);
let lastSummary = { stars: 0, coins: 0, level: 1 };
let audioContext = null;
let masterGain = null;
let oscillators = [];

function makeTile(color) {
  tileId += 1;
  return {
    color,
    special: null,
    crate: false,
    ice: 0,
    swap: false,
    offsetX: 0,
    offsetY: 0,
    id: tileId,
  };
}

function initLevel(index) {
  levelIndex = index;
  const config = levels[levelIndex];
  moves = config.moves;
  movesStart = config.moves;
  objectives = config.objectives.map((obj) => ({ ...obj, current: 0 }));
  levelBoosters = { ...config.boosters };
  boosters = { ...levelBoosters };
  levelComplete = false;
  levelFailed = false;
  continueUsed = false;
  combo = 0;
  levelStatusEl.classList.add("hidden");
  nextLevelBtn.classList.add("hidden");
  backToMapBtn.classList.add("hidden");
  levelRewardsEl.classList.add("hidden");
  summaryOverlayEl.classList.add("hidden");
  failOverlayEl.classList.add("hidden");
  selectedCell = null;
  activeBooster = null;
  updateBoosterUI();
  applyChapterTheme(levelIndex);
  updateChapterLabel();
  buildGrid(config);
  initAmbient();
  hintCells = null;
  needsMoveCheck = true;
  lastInteractionTime = typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
  updateMetaUI();
  setupTutorial();
  updateHud();
  renderObjectives();
  draw();
}

function buildGrid(config) {
  const crateCount = config.crates || 0;
  const iceCount = config.ice || 0;
  let safety = 0;
  do {
    grid = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => makeTile(randomColor()))
    );
    safety += 1;
  } while (findMatchGroups().length > 0 && safety < 50);

  if (crateCount > 0) {
    placeCrates(crateCount);
  }
  if (iceCount > 0) {
    placeIce(iceCount);
  }
}

function placeCrates(crateCount) {
  const cells = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      cells.push({ row, col });
    }
  }
  shuffleArray(cells);
  for (let i = 0; i < crateCount && i < cells.length; i++) {
    const cell = cells[i];
    grid[cell.row][cell.col].crate = true;
  }
}

function placeIce(iceCount) {
  const cells = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      cells.push({ row, col });
    }
  }
  shuffleArray(cells);
  for (let i = 0; i < iceCount && i < cells.length; i++) {
    const cell = cells[i];
    grid[cell.row][cell.col].ice = 1;
  }
}

function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function applyChapterTheme(index) {
  const chapter = getChapterForLevel(index);
  const theme = chapterThemes[chapter.themeIndex % chapterThemes.length];
  currentTheme = theme;
  ambientPalette = theme.ambient;
  hintDelay = chapter.rules.hintDelay;
  swapSpeed = chapter.rules.swapSpeed;
  const root = document.documentElement;
  root.style.setProperty("--ui-accent", theme.accent);
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--board-glow", theme.glow);
  root.style.setProperty("--board-vignette", theme.vignette);
  root.style.setProperty("--board-highlight", theme.highlight);
  drawRampPreview();
}

function updateChapterLabel() {
  if (!chapterLabelEl) return;
  const chapter = getChapterForLevel(levelIndex);
  chapterLabelEl.textContent = `Chapter ${chapter.index + 1}: ${chapter.name}`;
}

function buildLevels(count, tune) {
  const result = [];
  for (let i = 0; i < count; i++) {
    const chapter = getChapterForLevel(i);
    const tier = Math.floor(chapter.localIndex / 10);
    const moves = tune.movesBase + Math.min(10, tier * tune.movesStep) + (chapter.localIndex % 3);
    const crateStart = Math.max(0, chapter.rules.crateStart + (tune.crateStart - 8));
    const crates = chapter.localIndex < crateStart ? 0 : Math.min(18, 4 + tier * tune.crateStep);
    const allowIce = chapter.rules.allowIce;
    const ice = allowIce && chapter.localIndex > 6 && chapter.localIndex % 4 === 0 ? 6 + tier * 2 : 0;
    const boosters = {
      shuffle: chapter.localIndex % 7 === 0 ? 2 : 1,
      hammer: chapter.localIndex % 5 === 0 ? 2 : 1,
      storm: chapter.rules.allowStorm && chapter.localIndex > 8 && chapter.localIndex % 9 === 0 ? 1 : 0,
    };
    const objectives = [
      { type: "color", color: colors[i % colors.length], target: tune.objBase + tier * tune.objStep },
      { type: "color", color: colors[(i + 2) % colors.length], target: tune.objBase - 2 + tier * tune.objStep },
    ];
    if (crates > 0) {
      objectives.push({ type: "crate", target: crates });
    }
    if (ice > 0) {
      objectives.push({ type: "ice", target: ice });
    }
    result.push({ moves, boosters, objectives, crates, ice, chapterIndex: chapter.index });
  }
  return result;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(shakeX, shakeY);
  drawAmbient();

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const tile = grid[row][col];
      if (!tile) continue;
      const x = padding + col * cellSize + cellSize / 2 + (tile.offsetX || 0);
      const y = padding + row * cellSize + cellSize / 2 + (tile.offsetY || 0);
      const scale = getPulseScale(row, col);
      const drawRadius = radius * scale;

      ctx.beginPath();
      const gradient = ctx.createRadialGradient(
        x - drawRadius * 0.4,
        y - drawRadius * 0.5,
        drawRadius * 0.2,
        x,
        y,
        drawRadius
      );
      gradient.addColorStop(0, lightenColor(tile.color, 0.45));
      gradient.addColorStop(0.7, tile.color);
      gradient.addColorStop(1, darkenColor(tile.color, 0.28));
      ctx.fillStyle = gradient;
      ctx.shadowColor = "rgba(47, 44, 42, 0.18)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 6;
      ctx.arc(x, y, drawRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
      ctx.lineWidth = Math.max(1.2, drawRadius * 0.08);
      ctx.beginPath();
      ctx.arc(x, y, drawRadius - 0.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(x - drawRadius * 0.25, y - drawRadius * 0.3, drawRadius * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (tile.ice > 0) {
        drawIceOverlay(x, y, drawRadius);
      }

      if (tile.special) {
        drawSpecial(tile, x, y);
      }

      if (tile.crate) {
        drawCrate(x, y);
      }
    }
  }

  if (selectedCell) {
    const x = padding + selectedCell.col * cellSize + cellSize / 2;
    const y = padding + selectedCell.row * cellSize + cellSize / 2;
    ctx.beginPath();
    ctx.strokeStyle = "rgba(47, 44, 42, 0.45)";
    ctx.lineWidth = 4;
    ctx.arc(x, y, radius + 6, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (hintCells && !selectedCell) {
    const pulse = 1 + Math.sin(animTime * 4) * 0.08;
    ctx.save();
    ctx.strokeStyle = currentTheme ? currentTheme.accent : "#9eb2b0";
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.7;
    ctx.setLineDash([6, 6]);
    hintCells.forEach((cell) => {
      const x = padding + cell.col * cellSize + cellSize / 2;
      const y = padding + cell.row * cellSize + cellSize / 2;
      ctx.beginPath();
      ctx.arc(x, y, (radius + 6) * pulse, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();
  }

  drawEffects();
  ctx.restore();
}

function drawSpecial(tile, x, y) {
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = 3;
  if (tile.special === "lineH") {
    ctx.beginPath();
    ctx.moveTo(x - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.stroke();
  } else if (tile.special === "lineV") {
    ctx.beginPath();
    ctx.moveTo(x, y - radius);
    ctx.lineTo(x, y + radius);
    ctx.stroke();
  } else if (tile.special === "bomb") {
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 2;
    const pulse = 1 + Math.sin(animTime * 4) * 0.08;
    ctx.arc(x, y, radius * 0.9 * pulse, 0, Math.PI * 2);
    ctx.stroke();
  } else if (tile.special === "wrap") {
    const size = radius * 1.1;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x - size / 2, y - size / 2, size, size, 6);
    } else {
      ctx.rect(x - size / 2, y - size / 2, size, size);
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - size * 0.35, y);
    ctx.lineTo(x + size * 0.35, y);
    ctx.moveTo(x, y - size * 0.35);
    ctx.lineTo(x, y + size * 0.35);
    ctx.stroke();
  }
  ctx.restore();
}

function drawIceOverlay(x, y, r) {
  ctx.save();
  ctx.fillStyle = "rgba(208, 230, 244, 0.45)";
  ctx.beginPath();
  ctx.arc(x, y, r * 0.62, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(160, 200, 220, 0.7)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - r * 0.3, y - r * 0.1);
  ctx.lineTo(x + r * 0.2, y - r * 0.25);
  ctx.lineTo(x + r * 0.32, y + r * 0.1);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x - r * 0.15, y + r * 0.25);
  ctx.lineTo(x + r * 0.12, y + r * 0.05);
  ctx.lineTo(x - r * 0.05, y - r * 0.15);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x - r * 0.05, y - r * 0.45);
  ctx.lineTo(x - r * 0.05, y - r * 0.6);
  ctx.moveTo(x - r * 0.12, y - r * 0.53);
  ctx.lineTo(x + r * 0.02, y - r * 0.53);
  ctx.stroke();
  ctx.restore();
}


function drawCrate(x, y) {
  ctx.save();
  ctx.fillStyle = "rgba(122, 111, 102, 0.5)";
  ctx.strokeStyle = "rgba(47, 44, 42, 0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x - radius * 0.9, y - radius * 0.9, radius * 1.8, radius * 1.8, 6);
  } else {
    ctx.rect(x - radius * 0.9, y - radius * 0.9, radius * 1.8, radius * 1.8);
  }
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "rgba(47, 44, 42, 0.25)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.6, y - radius * 0.6);
  ctx.lineTo(x + radius * 0.6, y + radius * 0.6);
  ctx.moveTo(x - radius * 0.6, y + radius * 0.6);
  ctx.lineTo(x + radius * 0.6, y - radius * 0.6);
  ctx.stroke();
  ctx.restore();
}

function getCellFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  const touch = event.touches ? event.touches[0] : event;
  const x = ((touch.clientX - rect.left) / rect.width) * canvas.width;
  const y = ((touch.clientY - rect.top) / rect.height) * canvas.height;
  const col = Math.floor((x - padding) / cellSize);
  const row = Math.floor((y - padding) / cellSize);

  if (row < 0 || col < 0 || row >= gridSize || col >= gridSize) return null;
  return { row, col };
}

function isAdjacent(a, b) {
  const dr = Math.abs(a.row - b.row);
  const dc = Math.abs(a.col - b.col);
  return dr + dc === 1;
}

function getSwapDuration() {
  return Math.max(0.14, 1 / swapSpeed) + 0.02;
}

function markInteraction() {
  lastInteractionTime = typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
  hintCells = null;
}

function showBoardToast(message) {
  if (!boardToastEl) return;
  boardToastEl.textContent = message;
  boardToastEl.classList.add("show");
  if (toastTimer) {
    clearTimeout(toastTimer);
  }
  toastTimer = setTimeout(() => {
    boardToastEl.classList.remove("show");
  }, 1200);
}

function handleStart(event) {
  if (moves <= 0 || isResolving || levelComplete || levelFailed || tutorialActive) return;
  const cell = getCellFromEvent(event);
  if (!cell) return;
  markInteraction();

  if (activeBooster) {
    useBooster(cell);
    return;
  }

  if (!selectedCell) {
    selectedCell = cell;
    draw();
    return;
  }

  if (cell.row === selectedCell.row && cell.col === selectedCell.col) {
    selectedCell = null;
    draw();
    return;
  }

  if (!isAdjacent(cell, selectedCell)) {
    selectedCell = cell;
    draw();
    return;
  }

  attemptSwap(selectedCell, cell);
}

function attemptSwap(a, b) {
  const tileA = grid[a.row][a.col];
  const tileB = grid[b.row][b.col];
  startSwapAnimation(a, b);

  if (tileA.special && tileB.special) {
    resolveSpecialSwap(a, b);
    return;
  }

  if (tileA.special === "bomb" || tileB.special === "bomb") {
    resolveBombSwap(a, b);
    return;
  }

  swapCells(a, b);
  const groups = findMatchGroups();

  if (groups.length === 0) {
    selectedCell = null;
    isResolving = true;
    swapBack = { a, b, phase: 0 };
    swapBackTimer = getSwapDuration();
    return;
  }

  moves -= 1;
  combo = 1;
  updateHud();
  isResolving = true;
  addPulse(a);
  addPulse(b);
  resolveMatches(groups, [a, b]);
}

function resolveSpecialSwap(a, b) {
  const tileA = grid[a.row][a.col];
  const tileB = grid[b.row][b.col];
  if (!tileA || !tileB) return;
  if (!tileA.special || !tileB.special) return;

  moves -= 1;
  combo = 1;
  updateHud();
  isResolving = true;
  screenFlash = 0.18;
  triggerShake(6, 0.2);
  swapCells(a, b);

  const cells = [];
  const addCell = (row, col) => {
    if (row < 0 || col < 0 || row >= gridSize || col >= gridSize) return;
    cells.push({ row, col });
  };
  const addArea = (center, radius) => {
    for (let row = center.row - radius; row <= center.row + radius; row++) {
      for (let col = center.col - radius; col <= center.col + radius; col++) {
        addCell(row, col);
      }
    }
  };
  const addRow = (row) => {
    for (let col = 0; col < gridSize; col++) {
      addCell(row, col);
    }
  };
  const addCol = (col) => {
    for (let row = 0; row < gridSize; row++) {
      addCell(row, col);
    }
  };

  if (tileA.special === "bomb" && tileB.special === "bomb") {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        addCell(row, col);
      }
    }
    addRing(a, tileA.color, 2.2);
    addRing(b, tileB.color, 2.2);
  } else if (tileA.special === "bomb" || tileB.special === "bomb") {
    const bombCell = tileA.special === "bomb" ? a : b;
    const otherTile = tileA.special === "bomb" ? tileB : tileA;
    const targetColor = otherTile.color;
    const otherType = otherTile.special;
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (grid[row][col].color === targetColor) {
          addCell(row, col);
          if (otherType === "wrap") {
            addArea({ row, col }, 1);
          } else if (otherType === "lineH" || otherType === "lineV") {
            addRow(row);
            addCol(col);
          }
        }
      }
    }
    addRing(bombCell, "#fff5da", 1.9);
  } else if (tileA.special === "wrap" && tileB.special === "wrap") {
    addArea(a, 2);
    addArea(b, 2);
    addRing(a, tileA.color, 1.8);
    addRing(b, tileB.color, 1.8);
  } else if (tileA.special === "wrap" || tileB.special === "wrap") {
    const wrapCell = tileA.special === "wrap" ? a : b;
    const lineCell = tileA.special === "wrap" ? b : a;
    addArea(wrapCell, 1);
    addRow(lineCell.row);
    addCol(lineCell.col);
    addRing(wrapCell, "#fff0d9", 1.5);
  } else {
    addRow(a.row);
    addCol(a.col);
    addRow(b.row);
    addCol(b.col);
    addLineEffect(a, "h", tileA.color);
    addLineEffect(a, "v", tileA.color);
    addLineEffect(b, "h", tileB.color);
    addLineEffect(b, "v", tileB.color);
  }

  clearCellsDirect(cells);
  startCascade();
}

function resolveBombSwap(a, b) {
  const tileA = grid[a.row][a.col];
  const tileB = grid[b.row][b.col];
  const bombCell = tileA.special === "bomb" ? a : b;
  const colorCell = tileA.special === "bomb" ? b : a;
  const targetColor = grid[colorCell.row][colorCell.col].color;

  moves -= 1;
  combo = 1;
  updateHud();
  isResolving = true;
  screenFlash = 0.2;
  triggerShake(6, 0.25);

  const cellsToClear = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col].color === targetColor) {
        cellsToClear.push({ row, col });
      }
    }
  }
  cellsToClear.push(bombCell);
  clearCells(cellsToClear);
  startCascade();
}

function swapCells(a, b) {
  const temp = grid[a.row][a.col];
  grid[a.row][a.col] = grid[b.row][b.col];
  grid[b.row][b.col] = temp;
}

function findMatchGroups() {
  const groups = [];

  for (let row = 0; row < gridSize; row++) {
    let runStart = 0;
    for (let col = 1; col <= gridSize; col++) {
      const current = col < gridSize ? grid[row][col].color : null;
      const prev = grid[row][col - 1].color;
      if (current !== prev) {
        const runLength = col - runStart;
        if (prev && runLength >= 3) {
          const cells = [];
          for (let c = runStart; c < col; c++) cells.push({ row, col: c });
          groups.push({ cells, direction: "h" });
        }
        runStart = col;
      }
    }
  }

  for (let col = 0; col < gridSize; col++) {
    let runStart = 0;
    for (let row = 1; row <= gridSize; row++) {
      const current = row < gridSize ? grid[row][col].color : null;
      const prev = grid[row - 1][col].color;
      if (current !== prev) {
        const runLength = row - runStart;
        if (prev && runLength >= 3) {
          const cells = [];
          for (let r = runStart; r < row; r++) cells.push({ row: r, col });
          groups.push({ cells, direction: "v" });
        }
        runStart = row;
      }
    }
  }

  return groups;
}

function wouldSwapMakeMatch(a, b) {
  const tileA = grid[a.row][a.col];
  const tileB = grid[b.row][b.col];
  if (!tileA || !tileB) return false;
  if (tileA.special === "bomb" || tileB.special === "bomb") return true;
  if (tileA.special && tileB.special) return true;
  swapCells(a, b);
  const hasMatch = findMatchGroups().length > 0;
  swapCells(a, b);
  return hasMatch;
}

function findHintMove() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (col < gridSize - 1) {
        const a = { row, col };
        const b = { row, col: col + 1 };
        if (wouldSwapMakeMatch(a, b)) return [a, b];
      }
      if (row < gridSize - 1) {
        const a = { row, col };
        const b = { row: row + 1, col };
        if (wouldSwapMakeMatch(a, b)) return [a, b];
      }
    }
  }
  return null;
}

function isBoardIdle() {
  if (isResolving || clearQueue.length > 0 || swapBack) return false;
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const tile = grid[row][col];
      if (tile && (tile.offsetX || tile.offsetY)) return false;
    }
  }
  return true;
}

function ensurePlayableBoard() {
  if (levelComplete || levelFailed) return;
  let hint = findHintMove();
  if (hint) return;
  let attempts = 0;
  while (!hint && attempts < 6) {
    shuffleBoard();
    attempts += 1;
    hint = findHintMove();
  }
  if (attempts > 0) {
    showBoardToast("Shuffling...");
    screenFlash = 0.15;
    triggerShake(2, 0.18);
    markInteraction();
  }
}

function resolveMatches(groups, swapCellsUsed) {
  const specials = determineSpecials(groups, swapCellsUsed);
  const matchedCells = collectMatchedCells(groups, specials);
  clearCells(matchedCells);
  applySpecials(specials);
  startCascade();
}

function determineSpecials(groups, swapCellsUsed) {
  const specials = [];
  const swapKeys = swapCellsUsed.map((cell) => `${cell.row},${cell.col}`);

  swapCellsUsed.forEach((cell) => {
    const inGroups = groups.filter((group) =>
      group.cells.some((gcell) => gcell.row === cell.row && gcell.col === cell.col)
    );
    if (inGroups.length === 0) return;

    const directions = new Set(inGroups.map((group) => group.direction));
    const maxLength = Math.max(...inGroups.map((group) => group.cells.length));

    let special = null;
    if (maxLength >= 5) {
      special = "bomb";
    } else if (directions.size > 1) {
      special = "wrap";
    } else if (maxLength === 4) {
      special = directions.has("h") ? "lineH" : "lineV";
    }

    if (special) {
      const tile = grid[cell.row][cell.col];
      const color = tile ? tile.color : null;
      specials.push({ cell, special, color });
    }
  });

  return specials.filter((item, index) => {
    const key = `${item.cell.row},${item.cell.col}`;
    return swapKeys.includes(key) && index === specials.findIndex((i) => i.cell.row === item.cell.row && i.cell.col === item.cell.col);
  });
}

function collectMatchedCells(groups, specials) {
  const excluded = new Set(
    specials.map((item) => `${item.cell.row},${item.cell.col}`)
  );
  const matched = new Map();

  groups.forEach((group) => {
    group.cells.forEach((cell) => {
      const key = `${cell.row},${cell.col}`;
      if (!excluded.has(key)) {
        matched.set(key, cell);
      }
    });
  });

  return Array.from(matched.values());
}

function applySpecials(specials) {
  specials.forEach((item) => {
    let tile = grid[item.cell.row][item.cell.col];
    if (!tile) {
      tile = makeTile(item.color || randomColor());
      grid[item.cell.row][item.cell.col] = tile;
    }
    tile.special = item.special;
  });
}

function clearCells(cells) {
  const clearSet = expandSpecialClears(cells);
  clearSet.forEach((cell) => {
    clearSingleCell(cell);
  });
}

function clearCellsDirect(cells) {
  const cleared = new Set();
  cells.forEach((cell) => {
    const key = `${cell.row},${cell.col}`;
    if (cleared.has(key)) return;
    cleared.add(key);
    clearSingleCell(cell);
  });
}

function expandSpecialClears(cells) {
  const clearSet = new Map();
  const queue = [...cells];

  while (queue.length > 0) {
    const cell = queue.pop();
    const key = `${cell.row},${cell.col}`;
    if (clearSet.has(key)) continue;
    clearSet.set(key, cell);

    const tile = grid[cell.row][cell.col];
    if (!tile) continue;
    if (tile.special === "lineH") {
      addLineEffect(cell, "h", tile.color);
      addRing(cell, tile.color, 1.2);
      triggerShake(3, 0.15);
      for (let col = 0; col < gridSize; col++) {
        queue.push({ row: cell.row, col });
      }
    } else if (tile.special === "lineV") {
      addLineEffect(cell, "v", tile.color);
      addRing(cell, tile.color, 1.2);
      triggerShake(3, 0.15);
      for (let row = 0; row < gridSize; row++) {
        queue.push({ row, col: cell.col });
      }
    } else if (tile.special === "wrap") {
      addRing(cell, tile.color, 1.4);
      triggerShake(4, 0.18);
      for (let row = cell.row - 1; row <= cell.row + 1; row++) {
        for (let col = cell.col - 1; col <= cell.col + 1; col++) {
          if (row < 0 || col < 0 || row >= gridSize || col >= gridSize) continue;
          queue.push({ row, col });
        }
      }
    } else if (tile.special === "bomb") {
      addRing(cell, tile.color, 1.6);
      triggerShake(5, 0.2);
      const target = tile.color;
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          if (grid[row][col].color === target) {
            queue.push({ row, col });
          }
        }
      }
    }
  }

  return Array.from(clearSet.values());
}

function startCascade() {
  collapseGrid();
  const groups = findMatchGroups();
  if (groups.length === 0) {
    selectedCell = null;
    isResolving = false;
    combo = 0;
    updateHud();
    needsMoveCheck = true;
    checkLevelComplete();
    checkFailState();
    draw();
    return;
  }

  combo += 1;
  if (combo > 1) {
    addComboText(combo);
  }
  const matchedCells = collectMatchedCells(groups, []);
  clearCellsSlow(matchedCells, () => {
    collapseGrid();
    startCascade();
  });
}

function collapseGrid() {
  for (let col = 0; col < gridSize; col++) {
    const columnTiles = [];
    for (let row = gridSize - 1; row >= 0; row--) {
      const tile = grid[row][col];
      if (tile) {
        columnTiles.push({ tile, fromRow: row });
      }
    }

    while (columnTiles.length < gridSize) {
      const newTile = makeTile(randomColor());
      const spawnRow = -1 - columnTiles.length;
      columnTiles.push({ tile: newTile, fromRow: spawnRow });
    }

    for (let row = gridSize - 1; row >= 0; row--) {
      const entry = columnTiles[gridSize - 1 - row];
      const tile = entry.tile;
      const distance = (entry.fromRow - row) * cellSize;
      tile.swap = false;
      tile.offsetY = distance;
      grid[row][col] = tile;
    }
  }
}

function shuffleBoard() {
  const flat = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      flat.push(makeTile(randomColor()));
    }
  }
  shuffleArray(flat);
  let idx = 0;
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      grid[row][col] = flat[idx];
      idx += 1;
    }
  }

  if (findMatchGroups().length > 0) {
    shuffleBoard();
  }
  hintCells = null;
  needsMoveCheck = true;
}

function useBooster(cell) {
  if (activeBooster === "shuffle") {
    if (!consumeBooster("shuffle")) return;
    shuffleBoard();
    moves -= 1;
    screenFlash = 0.12;
    triggerShake(2, 0.12);
    showBoardToast("Shuffled");
    updateBoosterUI();
    updateHud();
    activeBooster = null;
    draw();
    checkFailState();
    return;
  }

  if (activeBooster === "hammer") {
    if (!consumeBooster("hammer")) return;
    moves -= 1;
    clearCells([cell]);
    startCascade();
    screenFlash = 0.1;
    triggerShake(4, 0.18);
    updateBoosterUI();
    activeBooster = null;
    return;
  }

  if (activeBooster === "storm") {
    if (!consumeBooster("storm")) return;
    moves -= 1;
    const color = grid[cell.row][cell.col].color;
    const cells = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (grid[row][col].color === color) {
          cells.push({ row, col });
        }
      }
    }
    clearCells(cells);
    startCascade();
    screenFlash = 0.2;
    triggerShake(6, 0.22);
    updateBoosterUI();
    activeBooster = null;
  }
}

function updateBoosterUI() {
  boostShuffleEl.textContent = getBoosterCount("shuffle");
  boostHammerEl.textContent = getBoosterCount("hammer");
  boostStormEl.textContent = getBoosterCount("storm");

  const chapter = getChapterForLevel(levelIndex);
  boosterButtons.forEach((button) => {
    const type = button.dataset.booster;
    const locked = type === "storm" && !chapter.rules.allowStorm;
    button.classList.toggle("active", type === activeBooster);
    button.classList.toggle("locked", locked);
    button.disabled = locked;
  });
}

function getBoosterCount(type) {
  return (boosters[type] || 0) + (progress.boosterInventory[type] || 0);
}

function consumeBooster(type) {
  if (progress.boosterInventory[type] > 0) {
    progress.boosterInventory[type] -= 1;
    saveProgress();
    return true;
  }
  if (boosters[type] > 0) {
    boosters[type] -= 1;
    return true;
  }
  return false;
}

function updateHud() {
  scoreEl.textContent = score.toLocaleString();
  movesEl.textContent = moves;
  levelEl.textContent = levelIndex + 1;
  if (comboEl) {
    comboEl.textContent = combo > 1 ? `x${combo}` : "x1";
  }
}

function renderObjectives() {
  objectiveListEl.innerHTML = "";
  objectives.forEach((obj) => {
    const item = document.createElement("div");
    item.className = "objective-item";
    if (obj.current >= obj.target) {
      item.classList.add("done");
    }

    const left = document.createElement("div");
    left.className = "objective-left";

    if (obj.type === "color") {
      const swatch = document.createElement("div");
      swatch.className = "swatch";
      swatch.style.background = obj.color;
      left.appendChild(swatch);
      left.appendChild(document.createTextNode("Collect"));
    } else if (obj.type === "crate") {
      const swatch = document.createElement("div");
      swatch.className = "swatch";
      swatch.style.background = "#7a6f66";
      left.appendChild(swatch);
      left.appendChild(document.createTextNode("Crates"));
    } else if (obj.type === "ice") {
      const swatch = document.createElement("div");
      swatch.className = "swatch";
      swatch.style.background = "linear-gradient(135deg, #d8eef7, #b9d7e7)";
      left.appendChild(swatch);
      left.appendChild(document.createTextNode("Ice"));
    }

    const count = document.createElement("div");
    count.className = "objective-count";
    count.textContent = `${obj.current}/${obj.target}`;

    item.appendChild(left);
    item.appendChild(count);

    const progress = document.createElement("div");
    progress.className = "objective-progress";
    const fill = document.createElement("div");
    fill.className = "objective-fill";
    const ratio = Math.min(1, obj.target > 0 ? obj.current / obj.target : 1);
    fill.style.width = `${Math.round(ratio * 100)}%`;
    progress.appendChild(fill);
    item.appendChild(progress);

    objectiveListEl.appendChild(item);
  });
}

function incrementObjective(type, color) {
  objectives.forEach((obj) => {
    if (obj.type === type) {
      if (type === "color" && obj.color !== color) return;
      if (obj.current < obj.target) {
        obj.current += 1;
      }
    }
  });
  renderObjectives();
}

function checkLevelComplete() {
  const allDone = objectives.every((obj) => obj.current >= obj.target);
  if (allDone) {
    levelComplete = true;
    levelStatusEl.classList.remove("hidden");
    nextLevelBtn.classList.remove("hidden");
    backToMapBtn.classList.remove("hidden");
    unlockedLevels = Math.max(unlockedLevels, levelIndex + 2);
    const stars = calculateStars();
    const reward = applyLevelRewards(stars);
    showLevelRewards(stars, reward);
    showLevelSummary(stars, reward);
    renderMap();
  }
}

function calculateStars() {
  if (movesStart <= 0) return 1;
  const ratio = moves / movesStart;
  let stars = 1;
  if (ratio >= 0.5) stars = 3;
  else if (ratio >= 0.25) stars = 2;
  if (continueUsed) {
    stars = Math.min(stars, 2);
  }
  return stars;
}

function getContinueCost() {
  return Math.min(900, 220 + levelIndex * 8);
}

function showFailOverlay() {
  if (!failOverlayEl) return;
  levelFailed = true;
  const cost = getContinueCost();
  if (failCostEl) {
    failCostEl.textContent = `Continue for ${cost} coins (+5 moves)`;
  }
  if (continueBtn) {
    continueBtn.disabled = continueUsed || progress.coins < cost;
  }
  failOverlayEl.classList.remove("hidden");
}

function checkFailState() {
  if (levelComplete || levelFailed) return;
  if (moves > 0) return;
  if (!isBoardIdle()) return;
  showFailOverlay();
}

function getMilestonePack() {
  if ((levelIndex + 1) % 5 !== 0) return null;
  if (progress.milestoneRewards[levelIndex]) return null;
  const chapter = getChapterForLevel(levelIndex);
  const pack = {
    shuffle: 1,
    hammer: 1,
    storm: chapter.rules.allowStorm && levelIndex > 10 ? 1 : 0,
  };
  progress.boosterInventory.shuffle += pack.shuffle;
  progress.boosterInventory.hammer += pack.hammer;
  progress.boosterInventory.storm += pack.storm;
  progress.milestoneRewards[levelIndex] = true;
  return pack;
}

function applyLevelRewards(stars) {
  const previousStars = progress.levelStars[levelIndex] || 0;
  const deltaStars = Math.max(0, stars - previousStars);
  progress.levelStars[levelIndex] = Math.max(previousStars, stars);
  progress.totalStars += deltaStars;
  progress.chestProgress += deltaStars;

  const milestonePack = getMilestonePack();
  const milestoneCoins = milestonePack ? 120 : 0;
  const baseReward = 40;
  const coinReward = baseReward + stars * 30 + Math.max(0, moves) * 2 + milestoneCoins;
  progress.coins += coinReward;

  if (progress.chestProgress >= chestThreshold) {
    progress.chestReady = true;
    progress.chestProgress = progress.chestProgress - chestThreshold;
  }

  saveProgress();
  updateMetaUI();
  updateBoosterUI();
  return { coinReward, milestonePack };
}

function showLevelRewards(stars, reward) {
  rewardStarsEl.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const star = document.createElement("span");
    star.className = i < stars ? "star filled" : "star";
    star.textContent = "★";
    rewardStarsEl.appendChild(star);
  }
  rewardTextEl.textContent = reward.milestonePack
    ? `+${reward.coinReward} coins · Milestone pack`
    : `+${reward.coinReward} coins`;
  levelRewardsEl.classList.remove("hidden");
}

function showLevelSummary(stars, reward) {
  summaryOverlayEl.classList.remove("hidden");
  lastSummary = { stars, coins: reward.coinReward, level: levelIndex + 1 };
  summaryStarsEl.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const star = document.createElement("span");
    star.className = i < stars ? "star filled" : "star";
    star.textContent = "★";
    summaryStarsEl.appendChild(star);
  }
  summaryCoinsEl.textContent = `+${reward.coinReward} coins`;
  if (reward.milestonePack) {
    summaryBoostersEl.classList.remove("hidden");
    summaryBoostersEl.textContent = `Booster pack: +${reward.milestonePack.shuffle} shuffle, +${reward.milestonePack.hammer} hammer${reward.milestonePack.storm ? ", +1 storm" : ""}`;
  } else {
    summaryBoostersEl.classList.add("hidden");
  }
  const isLast = levelIndex >= levels.length - 1;
  summaryNextBtn.disabled = isLast;
  summaryNextBtn.textContent = isLast ? "Done" : "Next";
  renderSummaryConfetti();
}

function generateShareCard() {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 450;
  const ctxCard = canvas.getContext("2d");

  const gradient = ctxCard.createLinearGradient(0, 0, 800, 450);
  gradient.addColorStop(0, "#f7f2ea");
  gradient.addColorStop(1, "#e8dfd2");
  ctxCard.fillStyle = gradient;
  ctxCard.fillRect(0, 0, 800, 450);

  ctxCard.fillStyle = "#2f2c2a";
  ctxCard.font = "bold 36px 'Trebuchet MS', sans-serif";
  ctxCard.fillText("Drift Dots", 40, 80);

  ctxCard.font = "16px 'Trebuchet MS', sans-serif";
  ctxCard.fillStyle = "#7a6f66";
  ctxCard.fillText("Soft strategy. Big combos.", 40, 110);

  ctxCard.fillStyle = "#2f2c2a";
  ctxCard.font = "bold 48px 'Trebuchet MS', sans-serif";
  ctxCard.fillText(`Level ${lastSummary.level}`, 40, 190);

  ctxCard.fillStyle = "#d6a64c";
  ctxCard.font = "bold 32px 'Trebuchet MS', sans-serif";
  const stars = "★".repeat(lastSummary.stars) + "☆".repeat(3 - lastSummary.stars);
  ctxCard.fillText(stars, 40, 235);

  ctxCard.fillStyle = "#7a6f66";
  ctxCard.font = "bold 24px 'Trebuchet MS', sans-serif";
  ctxCard.fillText(`+${lastSummary.coins} coins`, 40, 280);

  ctxCard.fillStyle = "rgba(47, 44, 42, 0.12)";
  for (let i = 0; i < 6; i++) {
    ctxCard.beginPath();
    ctxCard.arc(560 + i * 35, 140 + i * 30, 40, 0, Math.PI * 2);
    ctxCard.fill();
  }

  ctxCard.fillStyle = "rgba(47, 44, 42, 0.2)";
  ctxCard.font = "14px 'Trebuchet MS', sans-serif";
  ctxCard.fillText("Play the path. Unlock the rewards.", 40, 410);
  return canvas.toDataURL("image/png");
}

function renderSummaryConfetti() {
  if (!summaryConfettiEl) return;
  summaryConfettiEl.innerHTML = "";
  const colors = ["#f37d6b", "#f4bf5f", "#63c2a7", "#6b8df6"];
  for (let i = 0; i < 18; i++) {
    const piece = document.createElement("span");
    const type = i % 3 === 0 ? "coin" : "star";
    piece.className = type;
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    piece.style.setProperty("--x", `${(Math.random() - 0.5) * 80}px`);
    summaryConfettiEl.appendChild(piece);
  }
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function addBurst(cell, color) {
  const x = padding + cell.col * cellSize + cellSize / 2;
  const y = padding + cell.row * cellSize + cellSize / 2;
  for (let i = 0; i < 8; i++) {
    effects.push({
      type: "burst",
      x,
      y,
      vx: (Math.random() - 0.5) * 1.6,
      vy: (Math.random() - 0.7) * 1.6,
      color,
      life: 0.6 + Math.random() * 0.3,
      age: 0,
    });
  }
}

function addLineEffect(cell, direction, color) {
  effects.push({
    type: "line",
    row: cell.row,
    col: cell.col,
    direction,
    color,
    life: 0.4,
    age: 0,
  });
}

function addRing(cell, color, scale) {
  const x = padding + cell.col * cellSize + cellSize / 2;
  const y = padding + cell.row * cellSize + cellSize / 2;
  effects.push({
    type: "ring",
    x,
    y,
    color,
    scale,
    life: 0.35,
    age: 0,
  });
}

function addComboText(value) {
  effects.push({
    type: "text",
    x: canvas.width / 2,
    y: padding + 24,
    text: `Combo x${value}`,
    life: 0.7,
    age: 0,
    vy: -18,
  });
}

function clearCellsSlow(cells, onComplete) {
  const clearSet = expandSpecialClears(cells);
  clearQueue = clearSet;
  clearDelay = cascadeClearDelay;
  onClearComplete = onComplete;
}

function clearSingleCell(cell) {
  const tile = grid[cell.row][cell.col];
  if (!tile) return;
  if (tile.crate) {
    tile.crate = false;
    incrementObjective("crate");
  }
  if (tile.ice > 0) {
    incrementObjective("ice");
  }
  incrementObjective("color", tile.color);
  grid[cell.row][cell.col] = null;
  addBurst(cell, tile.color);
  score += 10 * combo;
  updateHud();
}

function addPulse(cell, strength = 0.15) {
  const key = `${cell.row},${cell.col}`;
  pulses.set(key, { age: 0, strength });
}

function getPulseScale(row, col) {
  const key = `${row},${col}`;
  if (!pulses.has(key)) return 1;
  const pulse = pulses.get(key);
  const age = typeof pulse === "number" ? pulse : pulse.age;
  const strength = typeof pulse === "number" ? 0.15 : pulse.strength;
  const scale = 1 + Math.sin(age * Math.PI) * strength;
  return scale;
}

function drawEffects() {
  if (screenFlash > 0) {
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${screenFlash})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  effects.forEach((effect) => {
    if (effect.type === "burst") {
      ctx.beginPath();
      ctx.fillStyle = effect.color;
      ctx.globalAlpha = Math.max(0, 1 - effect.age / effect.life);
      ctx.arc(effect.x, effect.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    } else if (effect.type === "ring") {
      ctx.save();
      const progress = effect.age / effect.life;
      ctx.globalAlpha = Math.max(0, 1 - progress);
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, radius * effect.scale * (1 + progress), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else if (effect.type === "line") {
      ctx.save();
      ctx.strokeStyle = effect.color;
      ctx.globalAlpha = Math.max(0, 1 - effect.age / effect.life);
      ctx.lineWidth = 8;
      ctx.beginPath();
      if (effect.direction === "h") {
        const y = padding + effect.row * cellSize + cellSize / 2;
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
      } else {
        const x = padding + effect.col * cellSize + cellSize / 2;
        ctx.moveTo(x, padding);
        ctx.lineTo(x, canvas.height - padding);
      }
      ctx.stroke();
      ctx.restore();
    } else if (effect.type === "text") {
      ctx.save();
      const progress = effect.age / effect.life;
      ctx.globalAlpha = Math.max(0, 1 - progress);
      ctx.fillStyle = "rgba(47, 44, 42, 0.75)";
      ctx.font = "700 18px \"Avenir Next\", \"Trebuchet MS\", sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(effect.text, effect.x, effect.y);
      ctx.restore();
    }
  });
}

function updateAnimations(delta) {
  animTime += delta;
  const fallStep = cellSize * fallSpeed * delta;
  const swapStep = cellSize * swapSpeed * delta;
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const tile = grid[row][col];
      if (!tile) continue;
      const wasOffsetY = tile.offsetY;
      const wasOffsetX = tile.offsetX;
      if (tile.offsetY) {
        const step = tile.swap ? swapStep : fallStep;
        if (Math.abs(tile.offsetY) <= step) {
          tile.offsetY = 0;
        } else if (tile.offsetY > 0) {
          tile.offsetY -= step;
        } else {
          tile.offsetY += step;
        }
      }
      if (tile.offsetX) {
        if (Math.abs(tile.offsetX) <= swapStep) {
          tile.offsetX = 0;
        } else if (tile.offsetX > 0) {
          tile.offsetX -= swapStep;
        } else {
          tile.offsetX += swapStep;
        }
      }
      if ((wasOffsetY && tile.offsetY === 0) || (wasOffsetX && tile.offsetX === 0)) {
        const landedFromFall = wasOffsetY && tile.offsetY === 0 && !tile.swap;
        const strength = landedFromFall ? 0.24 : 0.16;
        addPulse({ row, col }, strength);
      }
      if (tile.swap && tile.offsetX === 0 && tile.offsetY === 0) {
        tile.swap = false;
      }
    }
  }

  effects.forEach((effect) => {
    effect.age += delta;
    if (effect.type === "burst") {
      effect.x += effect.vx * 60 * delta;
      effect.y += effect.vy * 60 * delta;
    } else if (effect.type === "text") {
      effect.y += effect.vy * delta;
    }
  });
  effects = effects.filter((effect) => effect.age < effect.life);

  if (swapBack) {
    swapBackTimer -= delta;
    if (swapBackTimer <= 0) {
      if (swapBack.phase === 0) {
        swapCells(swapBack.a, swapBack.b);
        startSwapAnimation(swapBack.a, swapBack.b);
        swapBack.phase = 1;
        swapBackTimer = getSwapDuration();
      } else {
        swapBack = null;
        isResolving = false;
        checkFailState();
      }
    }
  }

  if (clearQueue.length > 0) {
    clearDelay -= delta;
    if (clearDelay <= 0) {
      clearDelay = cascadeClearDelay;
      const cell = clearQueue.shift();
      clearSingleCell(cell);
      if (clearQueue.length === 0 && onClearComplete) {
        const next = onClearComplete;
        onClearComplete = null;
        next();
      }
    }
  }

  pulses.forEach((pulse, key) => {
    const age = typeof pulse === "number" ? pulse : pulse.age;
    const nextAge = age + delta * 3;
    if (nextAge >= 1) {
      pulses.delete(key);
    } else {
      if (typeof pulse === "number") {
        pulses.set(key, nextAge);
      } else {
        pulses.set(key, { ...pulse, age: nextAge });
      }
    }
  });

  if (screenFlash > 0) {
    screenFlash = Math.max(0, screenFlash - delta * 0.8);
  }

  if (shakeTime > 0) {
    shakeTime -= delta;
    const intensity = Math.max(0, shakeTime) * shakeStrength;
    shakeX = (Math.random() - 0.5) * intensity;
    shakeY = (Math.random() - 0.5) * intensity;
  } else {
    shakeX = 0;
    shakeY = 0;
  }

  ambient.forEach((dot) => {
    dot.y += dot.speed * delta;
    if (dot.y > canvas.height + 20) {
      dot.y = -20;
      dot.x = Math.random() * canvas.width;
    }
  });

  const boardIdle = isBoardIdle();
  if (!boardIdle) {
    hintCells = null;
    return;
  }

  if (needsMoveCheck) {
    needsMoveCheck = false;
    ensurePlayableBoard();
  }

  if (!selectedCell && !hintCells && !tutorialActive && !levelComplete && !levelFailed) {
    const now = typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
    if (now - lastInteractionTime > hintDelay * 1000) {
      hintCells = findHintMove();
    }
  }
}

function lightenColor(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    Math.min(255, Math.round(r + (255 - r) * amount)),
    Math.min(255, Math.round(g + (255 - g) * amount)),
    Math.min(255, Math.round(b + (255 - b) * amount))
  );
}

function darkenColor(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    Math.max(0, Math.round(r * (1 - amount))),
    Math.max(0, Math.round(g * (1 - amount))),
    Math.max(0, Math.round(b * (1 - amount)))
  );
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("")
  );
}

function triggerShake(strength, duration) {
  shakeStrength = strength;
  shakeTime = duration;
}

function startSwapAnimation(a, b) {
  const dx = (b.col - a.col) * cellSize;
  const dy = (b.row - a.row) * cellSize;
  const tileA = grid[a.row][a.col];
  const tileB = grid[b.row][b.col];
  if (tileA) {
    tileA.offsetX = dx;
    tileA.offsetY = dy;
    tileA.swap = true;
  }
  if (tileB) {
    tileB.offsetX = -dx;
    tileB.offsetY = -dy;
    tileB.swap = true;
  }
}

function initAmbient() {
  const palette = ambientPalette.length > 0 ? ambientPalette : ["#7a6f66"];
  ambient = Array.from({ length: 18 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 1 + Math.random() * 2.4,
    speed: 6 + Math.random() * 10,
    alpha: 0.08 + Math.random() * 0.12,
    color: palette[Math.floor(Math.random() * palette.length)],
  }));
}

function drawAmbient() {
  ctx.save();
  ambient.forEach((dot) => {
    ctx.globalAlpha = dot.alpha;
    ctx.fillStyle = dot.color;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  ctx.restore();
}

function animate(timestamp) {
  if (!lastFrame) lastFrame = timestamp;
  const delta = Math.min(0.05, (timestamp - lastFrame) / 1000);
  lastFrame = timestamp;
  updateAnimations(delta);
  draw();
  requestAnimationFrame(animate);
}

canvas.addEventListener("mousedown", handleStart);
canvas.addEventListener("touchstart", (event) => {
  event.preventDefault();
  handleStart(event);
});

boosterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    markInteraction();
    const type = button.dataset.booster;
    activeBooster = activeBooster === type ? null : type;
    if (type === "shuffle" && activeBooster) {
      useBooster({ row: 0, col: 0 });
    }
    updateBoosterUI();
  });
});

nextLevelBtn.addEventListener("click", () => {
  const next = (levelIndex + 1) % levels.length;
  summaryOverlayEl.classList.add("hidden");
  initLevel(next);
});

resetBtn.addEventListener("click", () => {
  score = 0;
  summaryOverlayEl.classList.add("hidden");
  initLevel(levelIndex);
});

[
  movesBaseEl,
  movesStepEl,
  objBaseEl,
  objStepEl,
  crateStartEl,
  crateStepEl,
].forEach((el) => {
  if (el) el.addEventListener("input", applyTuningFromUI);
});

updateStreak();
syncTuningUI();
armAudioUnlock();
initLevel(0);
requestAnimationFrame(animate);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (installBtn) {
    installBtn.classList.remove("hidden");
  }
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  if (installBtn) {
    installBtn.classList.add("hidden");
  }
});

const initialParams = new URLSearchParams(window.location.search);
const initialScreen = initialParams.get("screen");
if (initialScreen === "game") {
  openGame();
} else {
  openMap();
}

function renderMap() {
  mapPathEl.innerHTML = "";
  mapSvgEl.innerHTML = "";

  const positions = buildMapPositions(levels.length);
  const mapHeight = positions.length > 0 ? positions[positions.length - 1].y + 160 : 900;
  mapSvgEl.setAttribute("viewBox", `0 0 1000 ${mapHeight}`);
  mapSvgEl.style.height = `${mapHeight}px`;
  mapPathEl.style.height = `${mapHeight}px`;
  const pathColor = currentTheme ? currentTheme.path : "#c7c0b7";
  const glowColor = currentTheme ? currentTheme.pathGlow : "rgba(255,255,255,0.7)";
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", buildSvgPath(positions));
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", pathColor);
  path.setAttribute("stroke-width", "10");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  path.setAttribute("stroke-dasharray", "14 16");
  path.setAttribute("class", "map-path-line");
  mapSvgEl.appendChild(path);

  const glow = document.createElementNS("http://www.w3.org/2000/svg", "path");
  glow.setAttribute("d", buildSvgPath(positions));
  glow.setAttribute("fill", "none");
  glow.setAttribute("stroke", glowColor);
  glow.setAttribute("stroke-width", "6");
  glow.setAttribute("stroke-linecap", "round");
  glow.setAttribute("stroke-linejoin", "round");
  mapSvgEl.appendChild(glow);

  positions.forEach((pos) => {
    const bubble = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    bubble.setAttribute("cx", pos.x);
    bubble.setAttribute("cy", pos.y);
    bubble.setAttribute("r", "6");
    bubble.setAttribute("fill", glowColor);
    bubble.setAttribute("opacity", "0.35");
    mapSvgEl.appendChild(bubble);
  });

  for (let i = 0; i < 60; i++) {
    const sparkle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    sparkle.setAttribute("cx", 80 + Math.random() * 840);
    sparkle.setAttribute("cy", 40 + Math.random() * mapHeight);
    sparkle.setAttribute("r", `${2 + Math.random() * 3}`);
    sparkle.setAttribute("fill", glowColor);
    sparkle.setAttribute("opacity", "0.35");
    mapSvgEl.appendChild(sparkle);
  }

  addMapDecor(mapHeight);

  let startIndex = 0;
  chapters.forEach((chapter, chapterIndex) => {
    const anchor = positions[startIndex];
    if (!anchor) {
      startIndex += chapter.count;
      return;
    }
    const rangeStart = startIndex + 1;
    const rangeEnd = startIndex + chapter.count;
    const marker = document.createElement("div");
    marker.className = "map-chapter";
    marker.innerHTML =
      `<div class="chapter-label">Chapter ${chapterIndex + 1}</div>` +
      `<div class="chapter-title">${chapter.name}</div>` +
      `<div class="chapter-range">Levels ${rangeStart}-${rangeEnd}</div>` +
      `<div class="chapter-intro">${chapter.intro}</div>`;
    marker.style.left = "50%";
    marker.style.top = `${Math.max(50, anchor.y - 90)}px`;
    mapPathEl.appendChild(marker);
    startIndex += chapter.count;
  });

  levels.forEach((_, idx) => {
    const node = document.createElement("div");
    node.className = "map-node";
    if (idx + 1 > unlockedLevels) {
      node.classList.add("locked");
    } else if (idx + 1 < unlockedLevels) {
      node.classList.add("completed");
    }
    if ((idx + 1) % 5 === 0) {
      node.classList.add("milestone");
    }
    if (idx === levelIndex) {
      node.classList.add("current");
    }
    node.dataset.level = idx;

    const label = document.createElement("div");
    label.className = "map-label";
    if (idx + 1 > unlockedLevels) {
      label.textContent = "Locked";
    } else if (idx + 1 < unlockedLevels) {
      label.textContent = "Cleared";
    } else {
      label.textContent = "Stage";
    }

    const number = document.createElement("div");
    number.className = "map-level";
    number.textContent = `${idx + 1}`;

    const starRow = document.createElement("div");
    starRow.className = "map-stars";
    const earned = progress.levelStars[idx] || 0;
    starRow.textContent = `${"*".repeat(earned)}${"-".repeat(3 - earned)}`;

    if ((idx + 1) % 5 === 0) {
      const badge = document.createElement("div");
      badge.className = "map-badge";
      badge.textContent = "Reward";
      node.appendChild(badge);
    }

    node.appendChild(label);
    node.appendChild(number);
    node.appendChild(starRow);
    mapPathEl.appendChild(node);

    const pos = positions[idx];
    node.style.left = `calc(${(pos.x / 1000) * 100}% - 46px)`;
    node.style.top = `${pos.y - 48}px`;

    if ((idx + 1) % 5 === 0 && idx + 1 <= unlockedLevels && Math.abs(idx - levelIndex) <= 2) {
      spawnConfetti(pos);
    }
  });

  for (let i = 8; i < positions.length; i += 12) {
    const pos = positions[i];
    const event = document.createElement("div");
    event.className = "map-event";
    event.style.left = `calc(${(pos.x / 1000) * 100}% - 35px)`;
    event.style.top = `${pos.y - 120}px`;
    event.innerHTML = `<div>Event</div><div class="timer">2d</div>`;
    mapPathEl.appendChild(event);
  }

  if (levelIndex < positions.length) {
    const current = positions[levelIndex];
    const scrollTarget = Math.max(0, current.y - 260);
    mapScrollEl.scrollTo({ top: scrollTarget, behavior: "smooth" });
  }
}

function openMap() {
  mapScreenEl.classList.remove("hidden");
  gameScreenEl.classList.add("hidden");
  shopScreenEl.classList.add("hidden");
  tutorialOverlayEl.classList.add("hidden");
  tutorialActive = false;
  summaryOverlayEl.classList.add("hidden");
  failOverlayEl.classList.add("hidden");
  renderMap();
}

function openGame() {
  mapScreenEl.classList.add("hidden");
  gameScreenEl.classList.remove("hidden");
  shopScreenEl.classList.add("hidden");
  summaryOverlayEl.classList.add("hidden");
  if (levelFailed) {
    failOverlayEl.classList.remove("hidden");
  } else {
    failOverlayEl.classList.add("hidden");
  }
  markInteraction();
}

function openShop() {
  mapScreenEl.classList.add("hidden");
  gameScreenEl.classList.add("hidden");
  shopScreenEl.classList.remove("hidden");
  failOverlayEl.classList.add("hidden");
  updateMetaUI();
}

mapPathEl.addEventListener("click", (event) => {
  const node = event.target.closest(".map-node");
  if (!node || node.classList.contains("locked")) return;
  const idx = Number(node.dataset.level);
  initLevel(idx);
  openGame();
});

playBtn.addEventListener("click", () => {
  openGame();
});

mapBtn.addEventListener("click", () => {
  openMap();
});

shopBtn.addEventListener("click", () => {
  openShop();
});

shopCloseBtn.addEventListener("click", () => {
  openMap();
});

soundToggleBtn.addEventListener("click", () => {
  setAudioEnabled(!progress.audioEnabled);
});

soundVolumeEl.addEventListener("input", () => {
  setAudioVolume(Number(soundVolumeEl.value));
});

vipBuyBtn.addEventListener("click", () => {
  if (progress.vipActive) return;
  const price = 800;
  if (progress.coins < price) return;
  progress.coins -= price;
  progress.vipActive = true;
  saveProgress();
  updateMetaUI();
});

vipClaimBtn.addEventListener("click", () => {
  claimVipReward();
});

document.querySelectorAll("[data-pack]").forEach((button) => {
  button.addEventListener("click", () => {
    const pack = button.dataset.pack;
    const costs = {
      shuffle: { price: 150, reward: { shuffle: 4, hammer: 0, storm: 0 } },
      hammer: { price: 180, reward: { shuffle: 0, hammer: 3, storm: 0 } },
      storm: { price: 220, reward: { shuffle: 0, hammer: 0, storm: 2 } },
      bundle: { price: 320, reward: { shuffle: 2, hammer: 2, storm: 2 } },
      bigbundle: { price: 520, reward: { shuffle: 6, hammer: 4, storm: 3 } },
    };
    const item = costs[pack];
    if (!item) return;
    if (progress.coins < item.price) return;
    progress.coins -= item.price;
    progress.boosterInventory.shuffle += item.reward.shuffle;
    progress.boosterInventory.hammer += item.reward.hammer;
    progress.boosterInventory.storm += item.reward.storm;
    saveProgress();
    updateMetaUI();
    updateBoosterUI();
  });
});

backToMapBtn.addEventListener("click", () => {
  openMap();
});

claimChestBtn.addEventListener("click", () => {
  if (!progress.chestReady) return;
  const reward = 250;
  progress.coins += reward;
  progress.boosterInventory.shuffle += 1;
  progress.boosterInventory.hammer += 1;
  progress.chestReady = false;
  saveProgress();
  updateMetaUI();
  updateBoosterUI();
});

tutorialNextBtn.addEventListener("click", () => {
  tutorialStep += 1;
  if (tutorialStep < tutorialSteps.length) {
    tutorialTextEl.textContent = tutorialSteps[tutorialStep];
    return;
  }
  tutorialActive = false;
  tutorialOverlayEl.classList.add("hidden");
  progress.tutorialDone = true;
  saveProgress();
});

retryBtn.addEventListener("click", () => {
  summaryOverlayEl.classList.add("hidden");
  initLevel(levelIndex);
});

summaryNextBtn.addEventListener("click", () => {
  summaryOverlayEl.classList.add("hidden");
  const next = Math.min(levels.length - 1, levelIndex + 1);
  initLevel(next);
});

summaryMapBtn.addEventListener("click", () => {
  summaryOverlayEl.classList.add("hidden");
  openMap();
});

if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    try {
      await deferredInstallPrompt.userChoice;
    } catch (error) {
      // Ignore prompt errors.
    }
    deferredInstallPrompt = null;
    installBtn.classList.add("hidden");
  });
}

if (continueBtn) {
  continueBtn.addEventListener("click", () => {
    if (continueUsed) return;
    const cost = getContinueCost();
    if (progress.coins < cost) {
      showBoardToast("Not enough coins");
      return;
    }
    progress.coins -= cost;
    continueUsed = true;
    moves += 5;
    levelFailed = false;
    saveProgress();
    updateMetaUI();
    updateHud();
    failOverlayEl.classList.add("hidden");
    showBoardToast("Extra moves");
    markInteraction();
  });
}

if (failRetryBtn) {
  failRetryBtn.addEventListener("click", () => {
    failOverlayEl.classList.add("hidden");
    initLevel(levelIndex);
  });
}

if (failMapBtn) {
  failMapBtn.addEventListener("click", () => {
    failOverlayEl.classList.add("hidden");
    openMap();
  });
}

shareBtn.addEventListener("click", async () => {
  const text = `I just cleared stage ${lastSummary.level} in Drift Dots!`;
  const dataUrl = generateShareCard();
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `drift-dots-stage-${lastSummary.level}.png`;
  link.click();
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
  } catch (error) {
    console.log(text);
  }
});


function buildMapPositions(count) {
  const positions = [];
  const width = 900;
  const step = 120;
  const chapterGap = 90;
  const startX = 160;
  const endX = 840;
  const top = 120;

  for (let i = 0; i < count; i++) {
    const t = i / 6;
    const chapter = getChapterIndex(i);
    const y = top + i * step + chapter * chapterGap;
    const wave = Math.sin(t) * 180;
    const drift = Math.sin(t * 0.7 + 1.4) * 60;
    const x = startX + (endX - startX) * (0.5 + 0.4 * Math.sin(t * 0.6)) + wave * 0.15 + drift * 0.2;
    positions.push({ x, y });
  }

  return positions;
}

function addMapDecor(mapHeight) {
  const signs = ["Soda", "Pretzels", "Bakery", "Market", "Juice", "Cafe", "Pizza", "Taco"];
  const spacing = 320;
  const count = Math.max(4, Math.floor(mapHeight / spacing));
  for (let i = 0; i < count; i++) {
    const decor = document.createElement("div");
    decor.className = "map-decor";
    const label = signs[i % signs.length];
    decor.textContent = label;
    const isLeft = i % 2 === 0;
    const x = isLeft ? 80 : 760;
    const y = 180 + i * spacing;
    decor.style.left = `${x}px`;
    decor.style.top = `${y}px`;
    mapPathEl.appendChild(decor);
  }
}

function buildSvgPath(points) {
  if (points.length === 0) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    d += ` Q ${midX} ${prev.y} ${curr.x} ${curr.y}`;
  }
  return d;
}

function spawnConfetti(pos) {
  const colors = ["#f37d6b", "#f4bf5f", "#63c2a7", "#6b8df6"];
  const container = document.createElement("div");
  container.className = "confetti";
  container.style.left = `calc(${(pos.x / 1000) * 100}% - 24px)`;
  container.style.top = `${pos.y - 50}px`;
  for (let i = 0; i < 8; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.setProperty("--x", `${(Math.random() - 0.5) * 60}px`);
    piece.style.setProperty("--delay", `${Math.random() * 0.6}s`);
    piece.style.setProperty("--color", colors[i % colors.length]);
    piece.style.setProperty("--rot", `${Math.random() * 180}deg`);
    container.appendChild(piece);
  }
  mapPathEl.appendChild(container);
}

function loadProgress() {
  const defaults = {
    coins: 0,
    totalStars: 0,
    levelStars: Array.from({ length: levels.length }, () => 0),
    chestProgress: 0,
    chestReady: false,
    boosterInventory: { shuffle: 0, hammer: 0, storm: 0 },
    milestoneRewards: Array.from({ length: levels.length }, () => false),
    audioEnabled: false,
    audioVolume: 50,
    vipActive: false,
    vipLastClaim: "",
    streak: 1,
    lastPlayDate: "",
    tutorialDone: false,
    unlockedLevels: 1,
  };
  try {
    const raw = localStorage.getItem("drift_progress");
    if (!raw) return defaults;
    const data = JSON.parse(raw);
    const merged = { ...defaults, ...data };
    if (!merged.boosterInventory) {
      merged.boosterInventory = { ...defaults.boosterInventory };
    }
    if (!Array.isArray(merged.milestoneRewards)) {
      merged.milestoneRewards = defaults.milestoneRewards;
    }
    if (merged.milestoneRewards.length < levels.length) {
      merged.milestoneRewards = merged.milestoneRewards.concat(
        Array.from({ length: levels.length - merged.milestoneRewards.length }, () => false)
      );
    } else if (merged.milestoneRewards.length > levels.length) {
      merged.milestoneRewards = merged.milestoneRewards.slice(0, levels.length);
    }
    if (typeof merged.audioEnabled !== "boolean") {
      merged.audioEnabled = defaults.audioEnabled;
    }
    if (typeof merged.audioVolume !== "number") {
      merged.audioVolume = defaults.audioVolume;
    }
    if (typeof merged.vipActive !== "boolean") {
      merged.vipActive = defaults.vipActive;
    }
    if (!merged.vipLastClaim) {
      merged.vipLastClaim = defaults.vipLastClaim;
    }
    ["shuffle", "hammer", "storm"].forEach((key) => {
      if (typeof merged.boosterInventory[key] !== "number") {
        merged.boosterInventory[key] = 0;
      }
    });
    if (!Array.isArray(merged.levelStars)) {
      merged.levelStars = defaults.levelStars;
    }
    if (merged.levelStars.length < levels.length) {
      merged.levelStars = merged.levelStars.concat(
        Array.from({ length: levels.length - merged.levelStars.length }, () => 0)
      );
    }
    if (merged.levelStars.length > levels.length) {
      merged.levelStars = merged.levelStars.slice(0, levels.length);
    }
    merged.totalStars = merged.levelStars.reduce((sum, value) => sum + value, 0);
    if (!merged.unlockedLevels || merged.unlockedLevels < 1) {
      let lastCleared = -1;
      for (let i = 0; i < merged.levelStars.length; i++) {
        if (merged.levelStars[i] > 0) lastCleared = i;
      }
      merged.unlockedLevels = Math.min(levels.length, Math.max(1, lastCleared + 2));
    } else if (merged.unlockedLevels > levels.length) {
      merged.unlockedLevels = levels.length;
    }
    return merged;
  } catch (error) {
    return defaults;
  }
}

function saveProgress() {
  progress.unlockedLevels = unlockedLevels;
  localStorage.setItem("drift_progress", JSON.stringify(progress));
}

function updateMetaUI() {
  coinsEl.textContent = progress.coins.toLocaleString();
  if (shopCoinsEl) {
    shopCoinsEl.textContent = progress.coins.toLocaleString();
  }
  starsTotalEl.textContent = progress.totalStars.toLocaleString();
  streakEl.textContent = progress.streak;
  chestProgressEl.textContent = progress.chestReady
    ? "Ready"
    : `${progress.chestProgress}/${chestThreshold}`;
  claimChestBtn.classList.toggle("hidden", !progress.chestReady);
  updateSoundUI();
  updateVipUI();
  if (failOverlayEl && !failOverlayEl.classList.contains("hidden")) {
    const cost = getContinueCost();
    if (failCostEl) {
      failCostEl.textContent = `Continue for ${cost} coins (+5 moves)`;
    }
    if (continueBtn) {
      continueBtn.disabled = continueUsed || progress.coins < cost;
    }
  }
}

function updateSoundUI() {
  if (!soundToggleBtn || !soundVolumeEl) return;
  soundToggleBtn.textContent = progress.audioEnabled ? "Sound On" : "Sound Off";
  soundVolumeEl.value = progress.audioVolume;
  soundVolumeEl.disabled = !progress.audioEnabled;
}

function ensureAudio() {
  if (audioContext) return;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return;
  audioContext = new AudioCtor();
  masterGain = audioContext.createGain();
  masterGain.gain.value = (progress.audioVolume / 100) * 0.2;
  masterGain.connect(audioContext.destination);

  const base = [220, 277, 330];
  oscillators = base.map((freq, index) => {
    const osc = audioContext.createOscillator();
    osc.type = index === 0 ? "sine" : "triangle";
    osc.frequency.value = freq;
    osc.detune.value = (index - 1) * 6;
    osc.connect(masterGain);
    osc.start();
    return osc;
  });
}

function setAudioEnabled(enabled) {
  progress.audioEnabled = enabled;
  saveProgress();
  if (enabled) {
    ensureAudio();
    if (audioContext && audioContext.state === "suspended") {
      audioContext.resume();
    }
    if (masterGain) {
      masterGain.gain.value = (progress.audioVolume / 100) * 0.2;
    }
  } else if (masterGain) {
    masterGain.gain.value = 0;
  }
  updateSoundUI();
}

function setAudioVolume(value) {
  progress.audioVolume = value;
  saveProgress();
  if (masterGain) {
    masterGain.gain.value = (value / 100) * 0.2;
  }
  updateSoundUI();
}

function updateVipUI() {
  if (!vipStatusEl || !vipBuyBtn || !vipClaimBtn) return;
  if (!progress.vipActive) {
    vipStatusEl.textContent = "Unlock daily rewards";
    vipBuyBtn.disabled = false;
    vipClaimBtn.classList.add("hidden");
    if (vipRewardEl) {
      vipRewardEl.textContent = "Daily: +160 coins +1 each";
    }
    if (vipTimerEl) {
      vipTimerEl.textContent = "Claim ready";
    }
    return;
  }
  vipStatusEl.textContent = "VIP Active";
  vipBuyBtn.disabled = true;
  vipClaimBtn.classList.remove("hidden");
  const claimable = canClaimVip();
  vipClaimBtn.disabled = !claimable;
  vipClaimBtn.textContent = claimable ? "Claim Daily" : "Claimed";
  const reward = getVipReward();
  if (vipRewardEl) {
    vipRewardEl.textContent = `Daily: +${reward.coins} coins +${reward.boosters.shuffle} S +${reward.boosters.hammer} H +${reward.boosters.storm} C`;
  }
  if (vipTimerEl) {
    vipTimerEl.textContent = claimable ? "Claim ready" : "Come back tomorrow";
  }
}

function canClaimVip() {
  const today = new Date().toISOString().slice(0, 10);
  return progress.vipLastClaim !== today;
}

function claimVipReward() {
  if (!progress.vipActive || !canClaimVip()) return;
  progress.vipLastClaim = new Date().toISOString().slice(0, 10);
  const reward = getVipReward();
  progress.coins += reward.coins;
  progress.boosterInventory.shuffle += reward.boosters.shuffle;
  progress.boosterInventory.hammer += reward.boosters.hammer;
  progress.boosterInventory.storm += reward.boosters.storm;
  saveProgress();
  updateMetaUI();
  updateBoosterUI();
}

function getVipReward() {
  const day = new Date().getDay();
  const table = [
    { coins: 140, boosters: { shuffle: 1, hammer: 1, storm: 0 } },
    { coins: 160, boosters: { shuffle: 1, hammer: 0, storm: 1 } },
    { coins: 180, boosters: { shuffle: 0, hammer: 2, storm: 0 } },
    { coins: 150, boosters: { shuffle: 1, hammer: 1, storm: 1 } },
    { coins: 200, boosters: { shuffle: 0, hammer: 1, storm: 1 } },
    { coins: 220, boosters: { shuffle: 2, hammer: 1, storm: 0 } },
    { coins: 240, boosters: { shuffle: 1, hammer: 1, storm: 1 } },
  ];
  return table[day];
}

function armAudioUnlock() {
  if (!progress.audioEnabled) return;
  const unlock = () => {
    setAudioEnabled(true);
  };
  window.addEventListener("pointerdown", unlock, { once: true });
}

function syncTuningUI() {
  if (!movesBaseEl) return;
  movesBaseEl.value = tuning.movesBase;
  movesStepEl.value = tuning.movesStep;
  objBaseEl.value = tuning.objBase;
  objStepEl.value = tuning.objStep;
  crateStartEl.value = tuning.crateStart;
  crateStepEl.value = tuning.crateStep;
  movesBaseValEl.textContent = tuning.movesBase;
  movesStepValEl.textContent = tuning.movesStep;
  objBaseValEl.textContent = tuning.objBase;
  objStepValEl.textContent = tuning.objStep;
  crateStartValEl.textContent = tuning.crateStart;
  crateStepValEl.textContent = tuning.crateStep;
  drawRampPreview();
}

function applyTuningFromUI() {
  if (!movesBaseEl) return;
  tuning.movesBase = Number(movesBaseEl.value);
  tuning.movesStep = Number(movesStepEl.value);
  tuning.objBase = Number(objBaseEl.value);
  tuning.objStep = Number(objStepEl.value);
  tuning.crateStart = Number(crateStartEl.value);
  tuning.crateStep = Number(crateStepEl.value);
  syncTuningUI();
  levels = buildLevels(totalLevels, tuning);
  initLevel(Math.min(levelIndex, levels.length - 1));
  renderMap();
}

function drawRampPreview() {
  if (!rampPreviewEl) return;
  const ctxPreview = rampPreviewEl.getContext("2d");
  const width = rampPreviewEl.width;
  const height = rampPreviewEl.height;
  ctxPreview.clearRect(0, 0, width, height);
  ctxPreview.fillStyle = "#fffaf2";
  ctxPreview.fillRect(0, 0, width, height);

  const sample = buildLevels(20, tuning);
  const movesValues = sample.map((lvl) => lvl.moves);
  const objValues = sample.map((lvl) => lvl.objectives[0].target);
  const maxVal = Math.max(...movesValues, ...objValues) + 5;
  const minVal = Math.min(...movesValues, ...objValues) - 5;

  const drawLine = (values, color) => {
    ctxPreview.strokeStyle = color;
    ctxPreview.lineWidth = 3;
    ctxPreview.beginPath();
    values.forEach((value, index) => {
      const x = (index / (values.length - 1)) * (width - 20) + 10;
      const y = height - ((value - minVal) / (maxVal - minVal)) * (height - 20) - 10;
      if (index === 0) ctxPreview.moveTo(x, y);
      else ctxPreview.lineTo(x, y);
    });
    ctxPreview.stroke();
  };

  const primary = currentTheme ? currentTheme.accent : "#f08e6e";
  drawLine(movesValues, primary);
  drawLine(objValues, "#6b8df6");

  ctxPreview.fillStyle = "rgba(47, 44, 42, 0.6)";
  ctxPreview.font = "12px Nunito, sans-serif";
  ctxPreview.fillText("Moves", 12, 16);
  ctxPreview.fillText("Objectives", 70, 16);
}

function updateStreak() {
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  if (progress.lastPlayDate !== todayKey) {
    if (progress.lastPlayDate) {
      const prev = new Date(progress.lastPlayDate);
      const diff = Math.floor((today - prev) / (1000 * 60 * 60 * 24));
      progress.streak = diff === 1 ? progress.streak + 1 : 1;
    }
    progress.lastPlayDate = todayKey;
    saveProgress();
  }
  updateMetaUI();
}

function setupTutorial() {
  if (progress.tutorialDone || levelIndex !== 0) {
    tutorialActive = false;
    tutorialOverlayEl.classList.add("hidden");
    return;
  }
  tutorialActive = true;
  tutorialOverlayEl.classList.remove("hidden");
  tutorialStep = 0;
  tutorialTextEl.textContent = tutorialSteps[tutorialStep];
}
