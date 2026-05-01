const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const gameCardEl = document.querySelector(".game-card");
const dialogueEl = document.getElementById("dialogue");
const dialogueSpeakerEl = document.getElementById("dialogue-speaker");
const dialogueBodyEl = document.getElementById("dialogue-body");
const battleUiEl = document.getElementById("battle-ui");
const battleStageEl = document.getElementById("battle-stage");
const battlePlayerHpTextEl = document.getElementById("battle-player-hp-text");
const battleEnemyHpTextEl = document.getElementById("battle-enemy-hp-text");
const battleLogEl = document.getElementById("battle-log");
const battleTeamListEl = document.getElementById("battle-team-list");
const battleActionEl = document.getElementById("battle-action");
const battlePlayerHpFillEl = document.getElementById("battle-player-hp-fill");
const battleEnemyHpFillEl = document.getElementById("battle-enemy-hp-fill");
const battlePlayerStatusEl = document.getElementById("battle-player-status");
const battleEnemyStatusEl = document.getElementById("battle-enemy-status");
const playerSlotGridEl = document.getElementById("player-slot-grid");
const enemySlotGridEl = document.getElementById("enemy-slot-grid");
const gameMenuEl = document.getElementById("game-menu");
const menuContentEl = document.getElementById("menu-content");
const endingMediaEl = document.getElementById("ending-media");
const endingPromptEl = document.getElementById("ending-prompt");
const loadingScreenEl = document.getElementById("loading-screen");
const loadingProgressTextEl = document.getElementById("loading-progress-text");
const loadingProgressFillEl = document.getElementById("loading-progress-fill");
const loadingStageTextEl = document.getElementById("loading-stage-text");
const testPanelEl = document.getElementById("test-panel");
const instantKillToggleEl = document.getElementById("instant-kill-toggle");
const heroOneHitKoToggleEl = document.getElementById("hero-one-hit-ko-toggle");
const noViolationStreamToggleEl = document.getElementById("no-violation-stream-toggle");
const shellFeeTestButtonEl = document.getElementById("shell-fee-test-button");
const battleAutoToggleEl = document.getElementById("battle-auto-toggle");
const battleSpeedToggleEl = document.getElementById("battle-speed-toggle");
const masterVolumeControlEl = document.getElementById("master-volume-control");
const masterVolumeSliderEl = document.getElementById("master-volume-slider");
const masterVolumeValueEl = document.getElementById("master-volume-value");
const chapterTestButtons = [...document.querySelectorAll("[data-test-chapter]")];
const titleVideo = document.createElement("video");
titleVideo.src = "./assests/title/Main.mp4";
titleVideo.loop = true;
titleVideo.muted = true;
titleVideo.playsInline = true;
titleVideo.preload = "auto";
const uniqueSoundCache = new Map();
const UNIQUE_SKILL_SOUND_SOURCES = {
  hisada_the_world: "./assests/skill_effect/unique_sound/9.mp3",
};
const AUDIO_BASE_PATH = "./assests/sound/";
const BGM_SOURCES = {
  title_loop: "bgm/致丁義-AI蕭政銘_320k.mp3",
  city_loop: "bgm/致丁義-AI蕭政銘_320k.mp3",
  xd_loop: "bgm/致丁義-AI蕭政銘_320k.mp3",
  hotel_loop: "bgm/致丁義-AI蕭政銘_320k.mp3",
  base_loop: "bgm/基地.mp3",
  tower_loop: "bgm/致丁義-AI蕭政銘_320k.mp3",
  live_loop: "bgm/紙上情人-AI蕭政銘(修正版)_320k.mp3",
  battle_loop: "bgm/致丁義-AI蕭政銘_320k.mp3",
  boss_xiao: "bgm/親親幫-AI蕭政銘_320k.mp3",
  boss_vblack: "bgm/閃邊-AI蕭政銘_320k.mp3",
  boss_kiss: "bgm/護貝-AI蕭政銘_320k.mp3",
  ending_loop: "bgm/親親幫-AI蕭政銘_320k.mp3",
};
const SFX_SOURCES = {
  ui_cursor: "effect1/click.wav",
  ui_confirm: null,
  ui_cancel: "effect1/misc_menu.wav",
  ui_popup: "effect1/misc_menu_2.wav",
  slot_row_stop: "effect2/switch1.wav",
  story_hit: "hits/hit01.mp3.flac",
};
const BGM_FADE_TIME = 0.8;
const BGM_DEFAULT_VOLUME = 0.34;
const BGM_VARIANT_SEPARATOR = "::";
const BGM_VARIANT_VOLUME_MULTIPLIERS = {
  dialogue: 0.28,
  battle: 0.48,
};
const BGM_VOLUME_BY_KEY = {
  title_loop: 0.42,
  live_loop: 0.3,
  battle_loop: 0.32,
  boss_xiao: 0.36,
  boss_vblack: 0.36,
  boss_kiss: 0.36,
  ending_loop: 0.36,
};
const SFX_DEFAULT_VOLUME = 0.72;
const SLOT_ROW_STOP_VOLUME = 0.1;
const MASTER_VOLUME_KEY = "kissworld-master-volume-v1";
const DEFAULT_MASTER_VOLUME = 0.5;
const DEBUG_MODE_PARAM = "hamburger";
const DEBUG_MODE_ENABLED = new URLSearchParams(window.location.search).get("debug") === DEBUG_MODE_PARAM;

const WORLD = {
  width: 2600,
  height: canvas.height,
};

const ROAD = {
  left: 120,
  right: WORLD.width - 120,
  top: 575,
  bottom: 700,
};

const keys = new Set();
const CONFIRM_CODE = "KeyZ";
const CANCEL_CODE = "KeyX";
const camera = { x: 0, y: 0 };
const sparkles = [];
const chapter4TeleportEffects = [];
const chapter4ImpactSlashes = [];
const worldFloatingTexts = [];
const shellFeeNotices = [];
const titleUnlockNotices = [];
const battleHelpNotices = [];
let pendingBattleHelpNoticeCompletion = null;
let runtimeErrorNoticeShown = false;
const CHARACTER_FRAME_HEIGHT_LIMITS = { min: 92, max: 132 };
const CHARACTER_WIDE_POSE_RATIO = 1.35;

const FOLLOW_TRAIL_GAP = 18;
const TRAIL_LENGTH = 96;
const FOLLOW_DISTANCE = 44;
const FOLLOW_STOP_RADIUS = 6;
const FOLLOW_SLOW_RADIUS = 34;

const MAP_COUNT = 14;
const MAP_ASSET_KEYS = Array.from({ length: MAP_COUNT }, (_, index) => `scene${index}`);
const EXTRA_CHARACTER_NUMBERS = [...Array.from({ length: 32 }, (_, index) => index + 5), 38, 39, 40];
const EXTRA_CHARACTER_IDS = EXTRA_CHARACTER_NUMBERS.map((number) => `npc${number}`);
const EXTRA_CHARACTER_FRAME_LAYOUTS = {
  5: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 1, cols: [0, 1, 2, 3, 4, 5], flip: true },
    left: { row: 1, cols: [0, 1, 2, 3, 4, 5] },
    up: { row: 2, cols: [7] },
    battle: { attack: [5, 1], hit: [5, 2], ko: [5, 5], victory: [7, 4] },
  },
  6: {
    down: { row: 0, cols: [0, 1, 2, 3, 4] },
    right: { row: 1, cols: [0, 1, 2, 3, 4] },
    left: { row: 1, cols: [0, 1, 2, 3, 4], flip: true },
    up: { row: 2, cols: [7] },
    battle: { attack: [5, 1], hit: [6, 2], ko: [6, 4], victory: [7, 0] },
  },
  7: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 3, cols: [0, 1, 2, 3, 4, 5] },
    left: { row: 1, cols: [0, 1, 2, 3, 4, 5] },
    up: { row: 4, cols: [4, 5, 6, 7] },
    battle: { attack: [5, 1], hit: [5, 2], ko: [6, 2], victory: [6, 6] },
  },
  8: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 1, cols: [0, 1, 2, 3, 4, 5], flip: true },
    left: { row: 1, cols: [0, 1, 2, 3, 4, 5] },
    up: { row: 3, cols: [0, 1, 2, 3, 4, 5] },
    battle: { attack: [5, 3], hit: [128, 855, 129, 146, false, 4], ko: [6, 0], victory: [7, 0] },
  },
  9: {
    down: {
      idleFrame: [704, 231, 132, 177],
      frames: [
        [11, 7, 149, 217],
        [179, 7, 154, 197],
        [352, 7, 149, 217],
        [523, 7, 149, 218],
        [691, 11, 153, 213],
        [864, 7, 149, 197],
      ],
    },
    right: {
      idleFrame: [716, 416, 100, 164],
      frames: [
        [27, 227, 117, 185],
        [192, 224, 120, 188],
        [368, 224, 116, 188],
        [535, 227, 121, 185],
      ],
    },
    left: {
      idleFrame: [888, 416, 104, 164],
      frames: [
        [27, 227, 117, 185, true],
        [192, 224, 120, 188, true],
        [368, 224, 116, 188, true],
        [535, 227, 121, 185, true],
      ],
    },
    up: {
      idleFrame: [872, 228, 132, 180],
      frames: [
        [20, 416, 129, 180],
        [187, 416, 133, 180],
        [360, 416, 128, 180],
        [532, 416, 129, 180],
      ],
    },
    battle: {
      attack: [176, 632, 176, 176],
      hit: [359, 632, 125, 177],
      ko: [684, 707, 164, 97],
      victory: [859, 813, 162, 211],
    },
  },
  10: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 2, cols: [0, 1, 2, 3, 4, 5], flip: true },
    left: { row: 2, cols: [0, 1, 2, 3, 4, 5] },
    up: { row: 1, cols: [7] },
    battle: { attack: [4, 2], hit: [5, 1], ko: [6, 1], victory: [7, 6] },
  },
  38: {
    down: {
      idleFrame: [667, 78, 75, 117],
      frames: [
        [667, 78, 75, 117],
        [794, 180, 76, 145],
        [667, 78, 75, 117],
        [664, 196, 81, 144],
      ],
    },
    left: {
      idleFrame: [929, 336, 61, 149, true],
      frames: [
        [15, 195, 101, 142],
        [155, 195, 70, 142],
        [282, 195, 82, 142],
        [403, 195, 101, 142],
        [536, 195, 73, 142],
        [664, 195, 81, 146],
      ],
    },
    right: {
      idleFrame: [929, 336, 61, 149],
      frames: [
        [15, 195, 101, 142, true],
        [155, 195, 70, 142, true],
        [282, 195, 82, 142, true],
        [403, 195, 101, 142, true],
        [536, 195, 73, 142, true],
        [664, 195, 81, 146, true],
      ],
    },
    up: {
      idleFrame: [923, 180, 75, 145],
      frames: [
        [15, 339, 101, 142],
        [151, 343, 75, 141],
        [280, 341, 84, 144],
        [403, 339, 101, 142],
        [535, 344, 77, 140],
        [664, 343, 81, 146],
      ],
    },
    battle: {
      attack: [400, 500, 135, 195, false, 4],
      hit: [144, 696, 100, 150, false, 4],
      ko: [532, 765, 140, 76, false, 4],
      victory: [396, 850, 112, 156, false, 4],
    },
  },
  39: {
    down: {
      idleFrame: [738, 238, 132, 170],
      frames: [
        [25, 29, 146, 177],
        [199, 29, 141, 179],
        [738, 238, 132, 170],
        [25, 29, 146, 177],
      ],
    },
    left: {
      idleFrame: [892, 448, 103, 164],
      frames: [
        [12, 249, 130, 159, true],
        [159, 249, 128, 159, true],
        [303, 249, 127, 159, true],
        [445, 249, 120, 159, true],
        [582, 249, 129, 159, true],
        [303, 249, 127, 159, true],
      ],
    },
    right: {
      idleFrame: [757, 448, 103, 164],
      frames: [
        [12, 249, 130, 159],
        [159, 249, 128, 159],
        [303, 249, 127, 159],
        [445, 249, 120, 159],
        [582, 249, 129, 159],
        [303, 249, 127, 159],
      ],
    },
    up: {
      idleFrame: [887, 242, 124, 165],
      frames: [
        [13, 445, 126, 168],
        [153, 443, 130, 171],
        [297, 442, 134, 172],
        [450, 443, 130, 171],
        [597, 444, 126, 169],
        [297, 442, 134, 172],
      ],
    },
    battle: {
      attack: [189, 644, 292, 178, false, 4],
      hit: [499, 642, 155, 184, false, 4],
      ko: [824, 718, 184, 106, false, 4],
      victory: [550, 836, 164, 184, false, 4],
    },
  },
  40: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5], idle: [1, 6] },
    left: { row: 1, cols: [0, 1, 2, 3, 4, 5], idle: [1, 1] },
    right: { row: 2, cols: [0, 1, 2, 3, 4, 5], idle: [2, 1] },
    up: { row: 6, cols: [1, 2, 3], idle: [1, 7] },
    battle: {
      attack: [260, 604, 126, 132, false, 4],
      hit: [647, 612, 109, 124, false, 4],
      ko: [688, 775, 136, 73, false, 4],
      victory: [7, 6],
    },
  },
  11: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 2, cols: [0, 1, 2, 3, 4, 5], flip: true },
    left: { row: 2, cols: [0, 1, 2, 3, 4, 5] },
    up: { row: 4, cols: [0, 1, 2, 3, 4, 5] },
    battle: { attack: [6, 1], hit: [6, 2], ko: [6, 4], victory: [7, 4] },
  },
  12: {
    down: { row: 0, cols: [0, 1, 2, 3, 4] },
    right: { row: 1, cols: [0, 1, 3, 4, 5], flip: true, idle: [1, 7] },
    left: { row: 1, cols: [0, 1, 3, 4, 5], idle: [1, 7] },
    up: { row: 2, cols: [7] },
    battle: { attack: [4, 5], hit: [5, 6], ko: [6, 1], victory: [7, 2] },
  },
  13: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 1, cols: [0, 1, 2, 3, 4, 5] },
    left: { row: 1, cols: [0, 1, 2, 3, 4, 5], flip: true },
    up: { row: 3, cols: [0, 1, 2, 3, 4, 5] },
    battle: { attack: [5, 1], hit: [5, 5], ko: [6, 3], victory: [7, 4] },
  },
  14: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: {
      flip: true,
      idleFrame: [791, 248, 74, 117, false],
      frames: [
        [0, 144, 120, 112],
        [128, 144, 120, 112],
        [256, 144, 120, 112],
        [384, 144, 120, 112],
        [512, 144, 120, 112],
        [640, 144, 120, 112],
      ],
    },
    left: {
      idleFrame: [927, 251, 74, 114, false],
      frames: [
        [0, 144, 120, 112],
        [128, 144, 120, 112],
        [256, 144, 120, 112],
        [384, 144, 120, 112],
        [512, 144, 120, 112],
        [640, 144, 120, 112],
      ],
    },
    up: {
      frames: [
        [0, 256, 120, 98],
        [128, 256, 120, 98],
        [256, 256, 120, 98],
        [384, 256, 120, 98],
        [512, 256, 120, 98],
        [640, 256, 120, 98],
      ],
    },
    battle: { attack: [5, 2], hit: [5, 3], ko: [6, 4], victory: [7, 0] },
  },
  15: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 2, cols: [0, 1, 2, 3, 4, 5], flip: true },
    left: { row: 2, cols: [0, 1, 2, 3, 4, 5] },
    up: { row: 4, cols: [0, 1, 2, 3] },
    battle: { attack: [5, 6], hit: [6, 3], ko: [6, 4], victory: [7, 6] },
  },
  16: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: {
      flip: true,
      frames: [
        [0, 145, 120, 120],
        [128, 145, 120, 120],
        [256, 145, 120, 120],
        [384, 145, 120, 120],
        [512, 145, 120, 120],
        [640, 145, 120, 120],
      ],
    },
    left: {
      frames: [
        [0, 145, 120, 120],
        [128, 145, 120, 120],
        [256, 145, 120, 120],
        [384, 145, 120, 120],
        [512, 145, 120, 120],
        [640, 145, 120, 120],
      ],
    },
    up: { row: 0, cols: [7] },
    battle: { attack: [4, 6], hit: [5, 2], ko: [6, 2], victory: [7, 7] },
  },
  17: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 2, cols: [0, 1, 2, 3] },
    left: { row: 2, cols: [0, 1, 2, 3], flip: true },
    up: { row: 2, cols: [4] },
    battle: { attack: [5, 2], hit: [5, 4], ko: [5, 6], victory: [6, 5] },
  },
  18: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 1, cols: [0, 1, 2, 3, 4, 5], flip: true },
    left: { row: 1, cols: [0, 1, 2, 3, 4, 5] },
    up: { row: 1, cols: [7] },
    battle: { attack: [4, 1], hit: [5, 1], ko: [6, 2], victory: [7, 1] },
  },
  19: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 1, cols: [0, 1, 2, 3, 4, 5], flip: true },
    left: { row: 1, cols: [0, 1, 2, 3, 4, 5] },
    up: { row: 2, cols: [7] },
    battle: { attack: [5, 4], hit: [6, 0], ko: [6, 3], victory: [7, 6] },
  },
  20: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 2, cols: [0, 1, 2, 3, 4, 5], flip: true },
    left: { row: 2, cols: [0, 1, 2, 3, 4, 5] },
    up: { row: 1, cols: [7] },
    battle: { attack: [5, 1], hit: [5, 3], ko: [5, 5], victory: [7, 0] },
  },
  21: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 2, cols: [0, 1, 2, 3, 4, 5], flip: true },
    left: { row: 2, cols: [0, 1, 2, 3, 4, 5] },
    up: { row: 2, cols: [7] },
    battle: { attack: [4, 2], hit: [5, 3], ko: [5, 7], victory: [7, 0] },
  },
  22: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 1, cols: [0, 1, 2, 3, 4, 5], flip: true },
    left: { row: 1, cols: [0, 1, 2, 3, 4, 5] },
    up: { row: 1, cols: [7] },
    battle: { attack: [4, 4], hit: [5, 0], ko: [6, 2], victory: [7, 6] },
  },
  23: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 1, cols: [0, 1, 2, 3, 4, 5] },
    left: { row: 1, cols: [0, 1, 2, 3, 4, 5], flip: true },
    up: { row: 2, cols: [0, 1, 2, 3, 4, 5] },
    battle: { attack: [5, 2], hit: [6, 0], ko: [6, 5], victory: [7, 7] },
  },
  24: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 2, cols: [0, 1, 2, 3] },
    left: { row: 2, cols: [0, 1, 2, 3], flip: true },
    up: { row: 3, cols: [0, 1, 2, 3, 4, 5] },
    battle: { attack: [5, 3], hit: [5, 4], ko: [6, 4], victory: [7, 4] },
  },
  25: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 1, cols: [0, 1, 2, 3, 4, 5] },
    left: { row: 1, cols: [0, 1, 2, 3, 4, 5], flip: true },
    up: { row: 2, cols: [0, 1, 2, 3, 4, 5] },
    battle: { attack: [5, 3], hit: [5, 7], ko: [5, 7], victory: [7, 4] },
  },
  26: {
    down: { row: 0, cols: [0, 1, 2, 3] },
    right: { row: 1, cols: [0, 1, 2, 3, 4, 5], flip: true },
    left: { row: 1, cols: [0, 1, 2, 3, 4, 5] },
    up: { row: 3, cols: [0, 1, 2, 3] },
    battle: { attack: [5, 5], hit: [6, 0], ko: [6, 2], victory: [7, 6] },
  },
  27: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 1, cols: [0, 1, 2, 3, 4, 5], flip: true },
    left: { row: 1, cols: [0, 1, 2, 3, 4, 5] },
    up: { row: 1, cols: [4] },
    battle: { attack: [4, 4], hit: [5, 0], ko: [5, 5], victory: [7, 6] },
  },
  28: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 1, cols: [0, 1, 2, 3, 4, 5], flip: true },
    left: { row: 1, cols: [0, 1, 2, 3, 4, 5] },
    up: { row: 2, cols: [0, 1, 2, 3, 4, 5] },
    battle: { attack: [4, 2], hit: [5, 4], ko: [5, 6], victory: [7, 4] },
  },
  29: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 1, cols: [0, 1, 2, 3, 4, 5] },
    left: { row: 1, cols: [0, 1, 2, 3, 4, 5], flip: true },
    up: { cells: [[2, 0], [2, 2], [2, 0], [2, 2]], idle: [7, 7] },
    battle: { attack: [4, 3], hit: [5, 3], ko: [5, 7], victory: [7, 5] },
  },
  30: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 1, cols: [0, 1, 2, 3, 4, 5], flip: true },
    left: { row: 1, cols: [0, 1, 2, 3, 4, 5] },
    up: { row: 2, cols: [0, 1, 2, 3, 4, 5] },
    battle: { attack: [4, 4], hit: [5, 2], ko: [5, 5], victory: [7, 6] },
  },
  31: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 1, cols: [0, 1, 2, 3, 4, 5] },
    left: { row: 1, cols: [0, 1, 2, 3, 4, 5], flip: true },
    up: { row: 2, cols: [0, 1, 2, 3, 4, 5] },
    battle: { attack: [5, 2], hit: [5, 4], ko: [5, 6], victory: [7, 0] },
  },
  32: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 2, cols: [0, 1, 2, 3, 4, 5], idle: [4, 6] },
    left: { row: 2, cols: [0, 1, 2, 3, 4, 5], flip: true, idle: [4, 6] },
    up: { row: 3, cols: [0, 1, 2, 3, 4, 5] },
    battle: { attack: [5, 1], hit: [5, 4], ko: [7, 4], victory: [7, 6] },
  },
  33: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 1, cols: [0, 1, 2, 3, 4, 5], idle: [2, 7] },
    left: { row: 1, cols: [0, 1, 2, 3, 4, 5], flip: true, idle: [2, 6, false] },
    up: { row: 3, cols: [0, 1, 2, 3, 4, 5] },
    battle: { attack: [4, 5], hit: [6, 0], ko: [6, 5], victory: [7, 0] },
  },
  34: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 2, cols: [0, 1, 2, 3, 4, 5], flip: true, idle: [5, 6, false] },
    left: { row: 2, cols: [0, 1, 2, 3, 4, 5], idle: [5, 7] },
    up: { row: 4, cols: [0, 1, 2, 3, 4, 5] },
    battle: { attack: [7, 1], hit: [7, 3], ko: [7, 4], victory: [7, 6] },
  },
  35: {
    down: {
      idleFrame: [795, 75, 74, 154],
      frames: [
        [35, 83, 66, 142],
        [163, 83, 62, 142],
        [287, 83, 62, 146],
        [411, 83, 66, 142],
        [543, 83, 62, 142],
        [675, 76, 62, 149],
      ],
    },
    right: {
      idleFrame: [803, 587, 58, 158],
      frames: [
        [15, 339, 102, 142],
        [151, 343, 70, 142],
        [283, 339, 82, 146],
        [403, 339, 102, 142],
        [539, 343, 70, 142],
        [663, 343, 82, 146],
      ],
    },
    left: {
      idleFrame: [932, 587, 57, 158],
      frames: [
        [15, 339, 102, 142, true],
        [151, 343, 70, 142, true],
        [283, 339, 82, 146, true],
        [403, 339, 102, 142, true],
        [539, 343, 70, 142, true],
        [663, 343, 82, 146, true],
      ],
    },
    up: {
      idleFrame: [923, 75, 74, 154],
      frames: [
        [35, 591, 66, 138],
        [163, 595, 62, 142],
        [287, 591, 63, 150],
        [411, 591, 66, 138],
        [543, 595, 62, 142],
        [675, 591, 62, 150],
      ],
    },
    battle: {
      attack: [279, 851, 98, 150, false, 4],
      hit: [527, 858, 90, 143, false, 4],
      ko: [643, 903, 125, 102, false, 4],
      victory: [931, 851, 62, 154, false, 4],
    },
  },
  36: {
    down: { row: 0, cols: [0, 1, 2, 3, 4, 5] },
    right: { row: 2, cols: [0, 1, 2, 3, 4, 5], flip: true },
    left: { row: 2, cols: [0, 1, 2, 3, 4, 5] },
    up: { row: 4, cols: [0, 1, 2, 3, 4, 5] },
    battle: { attack: [7, 2], hit: [7, 4], ko: [7, 5], victory: [7, 6] },
  },
};

const MAP_ROAD_OVERRIDES = {
  10: { left: 120, right: WORLD.width - 120, top: 520, bottom: 650 },
  11: { left: 470, right: 2190, top: 575, bottom: 700 },
  13: { left: 180, right: WORLD.width - 180, top: 575, bottom: 700 },
};

const MAP_BACKGROUND_CROPS = {
  11: { x: 29, y: 40, width: 1319, height: 640 },
};

const MAPS = MAP_ASSET_KEYS.map((asset, index) => ({
  id: index,
  asset,
  label: `地圖 ${index + 1}`,
  road: MAP_ROAD_OVERRIDES[index] || { left: 120, right: WORLD.width - 120, top: 575, bottom: 700 },
}));

const SHOP_POINTS = [
  {
    id: "street_shop_1",
    mapId: 1,
    x: 470,
    y: 548,
    displayLabel: "超商",
    label: "超商",
    goods: ["stream_mic", "voice_changer", "stream_light", "pipe", "hoodie", "coin_charm", "bebe_flute", "c22_pill"],
  },
];

const HOTEL_ROOM_POINTS = [
  {
    id: "hotel_room_1",
    mapId: 7,
    x: 1880,
    y: 548,
    displayLabel: "房間",
    radius: 86,
  },
  {
    id: "kidney_room",
    mapId: 7,
    x: 2480,
    y: 548,
    displayLabel: "房間",
    radius: 86,
  },
];

const CHAPTER2_REQUIRED_EQUIPMENT = ["stream_mic", "voice_changer", "stream_light"];
const CHAPTER2_ROOM_FEE = 360;
const CHAPTER2_SMOKER_FEE = 100;
const CHAPTER2_MOB_REWARD = 95;
const CHAPTER2_MOB_EXP = 45;
const STALE_DUMPLING_REST_LIMIT = 3;
const XIAO_REVIVE_FEE = 500;
const MAX_EARLY_MOBS_PER_MAP = 3;
const XIAO_XD_POSITION = { x: 1850, y: 638, direction: "left" };
const CHAPTER3_BENTO_FEE = 600;
const CHAPTER3_FLUTE_PRICE = 500;
const CHAPTER3_KINKO_OTAKU_FEE = 500;
const CHAPTER3_DAILY_ACTIVITY_DURATION = 60;
const CHAPTER3_DAILY_ACTIVITY_FEE = 500;
const CHAPTER3_DAILY_POPULARITY_GAIN = 80;
const CHAPTER3_XIAO_XD_EXIT_POSITION = { x: 1300, y: 638, direction: "left" };
const CHAPTER3_XIAO_ROOM_POSITION = { x: 1690, y: 638, direction: "right" };
const CHAPTER3_PIG_POSITION = { x: 610, y: 638, direction: "right" };
const CHAPTER3_FATDUMB_POSITION = { x: 720, y: 638, direction: "left" };
const CHAPTER3_BEBE_POSITION = { x: 2350, y: 638, direction: "down" };
const CHAPTER3_KIDNEY_POSITION = { x: 2430, y: 638, direction: "left" };
const CHAPTER3_KINKO_POSITION = { x: 1930, y: 638, direction: "right" };
const CHAPTER4_POPULARITY_TARGET = 200;
const CHAPTER4_POPULARITY_TARGET_STEP = 200;
const CHAPTER4_C22_PRICE = 1000;
const CHAPTER4_EX_POSITION = { x: 1140, y: 638, direction: "left" };
const CHAPTER4_SECTOR03_ENTRY = { x: 1735, y: 548, direction: "down" };
const CHAPTER4_BASE_ENTRY_POSITION = { x: 190, y: 638, direction: "right" };
const CHAPTER4_BASE_MIDDLE_X = 1320;
const CHAPTER4_BASE_ALARM_FLASH_TIME = 1.35;
const CHAPTER4_CELL_ENTRY_POSITION = { x: 1960, y: 638, direction: "left" };
const CHAPTER4_CELL_DOOR_X = 1960;
const CHAPTER4_CELL_EXIT_POSITION = { x: 1960, y: 592 };
const CHAPTER4_CELL_RESCUE_TRIGGER_X = CHAPTER4_CELL_ENTRY_POSITION.x - 230;
const CHAPTER4_CELL_REST_LIMIT = 2;
const CHAPTER4_XD_VT_POSITIONS = {
  npc1: { x: 1430, y: 638, direction: "right" },
  npc2: { x: 1510, y: 638, direction: "left" },
  npc3: { x: 1590, y: 638, direction: "left" },
};
const CHAPTER5_TOWER_ENTRY_POSITION = { x: 1650, y: 548, direction: "down" };
const CHAPTER5_TOWER_RETURN_POSITION = { x: 1650, y: 638, direction: "down" };
const CHAPTER5_TOWER_EXIT_POSITION = { x: 1320, y: 548, direction: "down" };
const CHAPTER5_TOWER_PLAYER_ENTRY = { x: 1320, y: 638, direction: "down" };
const CHAPTER5_XD_PLAYER_POSITION = { x: 1160, y: 638, direction: "right" };
const CHAPTER5_XD_EXIT_HISADA_START = { x: 1300, y: 638, direction: "left" };
const CHAPTER5_XD_EXIT_HISADA_STOP = { x: 1185, y: 638, direction: "right" };
const CHAPTER5_JAIL_FLASHBACK_POSITIONS = {
  npc39: { x: 1460, y: 638, direction: "left" },
  npc9: { x: 1660, y: 638, direction: "left" },
  npc14: { x: 1845, y: 638, direction: "left" },
};
const CHAPTER5_TOURNAMENT_ROUNDS = [
  {
    id: "street",
    name: "路人娛樂",
    team: ["npc8", "hotel_otaku", "npc35", "npc29"],
    scale: 1,
  },
  {
    id: "vblack",
    name: "V黑娛樂",
    team: ["npc39", "npc40", "npc38", "kinko_ex"],
    scale: 1.08,
  },
  {
    id: "kiss",
    name: "親親娛樂",
    team: ["npc9", "npc12", "npc14", "npc36"],
    scale: 1.16,
  },
];
const CHAPTER5_TOURNAMENT_PLAYABLE_ROSTER_IDS = [
  "hero",
  "npc1",
  "npc2",
  "npc3",
  "npc4",
  "hotel_otaku",
  "npc9",
  "npc12",
  "npc14",
  "npc36",
];
const CHAPTER5_TOURNAMENT_PROXY_IDS = {
  hotel_otaku: "chapter5_otaku_opponent",
  npc9: "chapter5_hisada_opponent",
  npc12: "chapter5_aki_opponent",
  npc14: "chapter5_kidney_opponent",
  npc36: "chapter5_smoker_opponent",
};

const CHAPTER4_MONKEY_WHISPER_LINES = [
  "哪裡還有VT可以綁呢...",
  "裡面的安靜一點...",
  "今天要讓誰畢業呢...",
];

const CHAPTER4_BASE_ACTOR_POSITIONS = {
  npc38: { x: 1560, y: 610, direction: "left" },
  npc39: { x: 1690, y: 650, direction: "left" },
  npc40: { x: 1940, y: 638, direction: "right" },
  kinko_ex: { x: 1810, y: 638, direction: "left" },
};

const CHAPTER4_BASE_REINFORCEMENT_STARTS = {
  npc38: { x: 2110, y: 610, direction: "left" },
  npc39: { x: 2180, y: 650, direction: "left" },
  kinko_ex: { x: 2140, y: 638, direction: "left" },
};

const CHAPTER4_CELL_POSITIONS = {
  hero: { x: 1160, y: 642, direction: "right" },
  npc32: { x: 1280, y: 666, direction: "right" },
  npc1: { x: 1400, y: 638, direction: "left" },
  npc2: { x: 1520, y: 638, direction: "left" },
  npc3: { x: 1640, y: 638, direction: "left" },
  npc14: { x: 1760, y: 638, direction: "left" },
};
const CHAPTER4_RESCUE_XD_POSITIONS = {
  npc4: { x: 760, y: 638, direction: "right" },
  npc9: { x: 880, y: 638, direction: "right" },
  npc36: { x: 1000, y: 638, direction: "right" },
  npc12: { x: 1120, y: 638, direction: "right" },
};
const CHAPTER4_RESCUE_PARTY_IDS = ["npc4", "npc9", "npc36", "npc12"];
const CHAPTER4_HISADA_RECRUIT_POSITIONS = {
  camera: { x: 900, y: 638, direction: "right" },
  npc4: { x: 880, y: 638, direction: "right" },
  npc9: { x: 1080, y: 638, direction: "left" },
};
const CHAPTER4_SMOKER_RECRUIT_POSITIONS = {
  camera: { x: 470, y: 638, direction: "right" },
  npc4: { x: 420, y: 638, direction: "right" },
  npc36: { x: 590, y: 638, direction: "left" },
  npc12: { x: 710, y: 620, direction: "left" },
};
const CHAPTER4_RESCUE_GATE_POSITIONS = {
  npc4: { x: 1450, y: 638, direction: "right" },
  npc36: { x: 1540, y: 638, direction: "right" },
  npc9: { x: 1630, y: 638, direction: "right" },
  npc12: { x: 1720, y: 620, direction: "right" },
};
const CHAPTER4_RESCUE_CELL_POSITIONS = {
  npc4: { x: 690, y: 638, direction: "right" },
  npc9: { x: 800, y: 638, direction: "right" },
  npc36: { x: 910, y: 638, direction: "right" },
  npc12: { x: 1020, y: 638, direction: "right" },
  npc39: { x: 1540, y: 638, direction: "left" },
};
const CHAPTER4_CAPTIVE_PARTY_IDS = ["npc1", "npc2", "npc3", "hotel_otaku", "npc14"];

const FLOOR_MAT_POINTS = [
  {
    id: "xd_floor_mat",
    mapId: 9,
    x: XIAO_XD_POSITION.x + 170,
    y: 638,
    displayLabel: "地舖",
    radius: 72,
  },
  {
    id: "base_cell_mat",
    mapId: 11,
    x: 1080,
    y: 638,
    displayLabel: "地舖",
    radius: 72,
  },
];

const TELEPORT_POINTS = [
  {
    id: "hotel_entry",
    mapId: 0,
    x: 1730,
    y: 608,
    displayLabel: "HOTEL",
    radius: 54,
    targetMapId: 7,
    targetX: 220,
    targetY: 638,
    targetDirection: "down",
  },
  {
    id: "xd_entry",
    mapId: 8,
    x: 945,
    y: 608,
    displayLabel: "XD娛樂",
    radius: 54,
    targetMapId: 9,
    targetX: 1300,
    targetY: 638,
    targetDirection: "down",
    followerPlacement: "near-player",
  },
  {
    id: "xd_exit",
    mapId: 9,
    x: 1300,
    y: 638,
    displayLabel: "出口",
    radius: 54,
    targetMapId: 8,
    targetX: 945,
    targetY: 638,
    targetDirection: "down",
    followerPlacement: "near-player",
  },
  {
    id: "sector03_entry",
    mapId: 2,
    x: CHAPTER4_SECTOR03_ENTRY.x,
    y: CHAPTER4_SECTOR03_ENTRY.y,
    displayLabel: "SECTOR 03",
    radius: 54,
    targetMapId: 10,
    targetX: CHAPTER4_BASE_ENTRY_POSITION.x,
    targetY: CHAPTER4_BASE_ENTRY_POSITION.y,
    targetDirection: CHAPTER4_BASE_ENTRY_POSITION.direction,
    followerPlacement: "near-player",
  },
  {
    id: "base_cell_exit",
    mapId: 11,
    x: CHAPTER4_CELL_EXIT_POSITION.x,
    y: CHAPTER4_CELL_EXIT_POSITION.y,
    displayLabel: "出口",
    radius: 48,
    targetMapId: 10,
    targetX: WORLD.width - 170,
    targetY: 638,
    targetDirection: "left",
    followerPlacement: "near-player",
  },
  {
    id: "strongest_tower_entry",
    mapId: 12,
    x: CHAPTER5_TOWER_ENTRY_POSITION.x,
    y: CHAPTER5_TOWER_ENTRY_POSITION.y,
    displayLabel: "最強",
    radius: 58,
    targetMapId: 13,
    targetX: CHAPTER5_TOWER_PLAYER_ENTRY.x,
    targetY: CHAPTER5_TOWER_PLAYER_ENTRY.y,
    targetDirection: CHAPTER5_TOWER_PLAYER_ENTRY.direction,
    followerPlacement: "near-player",
  },
  {
    id: "strongest_tower_exit",
    mapId: 13,
    x: CHAPTER5_TOWER_EXIT_POSITION.x,
    y: CHAPTER5_TOWER_EXIT_POSITION.y,
    displayLabel: "出口",
    radius: 58,
    targetMapId: 12,
    targetX: CHAPTER5_TOWER_RETURN_POSITION.x,
    targetY: CHAPTER5_TOWER_RETURN_POSITION.y,
    targetDirection: CHAPTER5_TOWER_RETURN_POSITION.direction,
    followerPlacement: "near-player",
  },
];

const SPRITES = {
  ...Object.fromEntries(MAP_ASSET_KEYS.map((key, index) => [key, { src: `./assests/Scene/${index}.png` }])),
  background: { src: "./assests/Scene/0.png" },
  battleBackground: { src: "./assests/Scene/1.png" },
  battleGrid: { src: "./assests/Battle/grid.png" },
  skillIcons: { src: "./assests/Battle/skill.png" },
  titleContinue: { src: "./assests/title/Continue.png" },
  titleStart: { src: "./assests/title/Start.png" },
  titleGuide: { src: "./assests/title/Guild.png" },
  titleSetting: { src: "./assests/title/Setting.png" },
  titleLeave: { src: "./assests/title/Leave.png" },
  skillEffectCast0: { src: "./assests/skill_effect/cast/0.png" },
  skillEffectCast1: { src: "./assests/skill_effect/cast/1.png" },
  skillEffectCast2: { src: "./assests/skill_effect/cast/2.png" },
  skillEffectCast3: { src: "./assests/skill_effect/cast/3.png" },
  skillEffectCast4: { src: "./assests/skill_effect/cast/4.png" },
  skillEffectCast5: { src: "./assests/skill_effect/cast/5.png" },
  skillEffectHit0: { src: "./assests/skill_effect/hit/0.png" },
  skillEffectHit1: { src: "./assests/skill_effect/hit/1.png" },
  skillEffectHit2: { src: "./assests/skill_effect/hit/2.png" },
  skillEffectHit3: { src: "./assests/skill_effect/hit/3.png" },
  skillEffectHit4: { src: "./assests/skill_effect/hit/4.png" },
  uniqueSkill0: { src: "./assests/skill_effect/unique/0.png" },
  uniqueSkill1: { src: "./assests/skill_effect/unique/1.png" },
  uniqueSkill2: { src: "./assests/skill_effect/unique/2.png" },
  uniqueSkill3: { src: "./assests/skill_effect/unique/3.png" },
  uniqueSkill4: { src: "./assests/skill_effect/unique/4.png" },
  uniqueSkill8: { src: "./assests/skill_effect/unique/8.png" },
  uniqueSkill9: { src: "./assests/skill_effect/unique/9.png" },
  uniqueSkill14: { src: "./assests/skill_effect/unique/14.png" },
  uniqueSkill29: { src: "./assests/skill_effect/unique/29.png" },
  uniqueSkill32: { src: "./assests/skill_effect/unique/32.png" },
  uniqueSkill33: { src: "./assests/skill_effect/unique/33.png" },
  uniqueSkill35: { src: "./assests/skill_effect/unique/35.png" },
  uniqueSkill12: { src: "./assests/skill_effect/unique/12.png" },
  uniqueSkill36: { src: "./assests/skill_effect/unique/36.png" },
  uniqueSkill38: { src: "./assests/skill_effect/unique/38.png" },
  uniqueSkill39: { src: "./assests/skill_effect/unique/39.png" },
  uniqueSkill40: { src: "./assests/skill_effect/unique/40.png" },
  chapter4TransformCutin: { src: "./assests/event/4-0.png" },
  chapter4RescueEvent1: { src: "./assests/event/4-1.png" },
  chapter4RescueEvent2: { src: "./assests/event/4-2.png" },
  ...Object.fromEntries(Array.from({ length: 8 }, (_, index) => [
    `chapter4RescueLine${index}`,
    { src: `./assests/event/4/${index}.png` },
  ])),
  hero: createHeroSprite("./assests/Character/Sprite/0.png"),
  npc1: createNpc1Sprite("./assests/Character/Sprite/1.png"),
  npc2: createNpc2Sprite("./assests/Character/Sprite/2.png"),
  npc3: createNpc3Sprite("./assests/Character/Sprite/3.png"),
  npc4: createQuestNpcSprite("./assests/Character/Sprite/4.png"),
  ...Object.fromEntries(EXTRA_CHARACTER_NUMBERS.map((number) => [`npc${number}`, createGenericCharacterSprite(`./assests/Character/Sprite/${number}.png`, number)])),
  headHero: { src: "./assests/Character/Head/0.png" },
  headNpc1: { src: "./assests/Character/Head/1.png" },
  headNpc2: { src: "./assests/Character/Head/2.png" },
  headNpc3: { src: "./assests/Character/Head/3.png" },
  headNpc4: { src: "./assests/Character/Head/4.png" },
  ...Object.fromEntries(EXTRA_CHARACTER_NUMBERS.map((number) => [`headNpc${number}`, { src: `./assests/Character/Head/${number}.png` }])),
  headHotel_otaku: { src: "./assests/Character/Head/32.png" },
};

const CHARACTER_SPRITE_KEYS = ["hero", "npc1", "npc2", "npc3", "npc4", ...EXTRA_CHARACTER_IDS];
const INITIAL_CHARACTER_SPRITE_KEYS = ["hero", "npc1", "npc2", "npc3", "npc4"];
const preparedCharacterSpriteKeys = new Set();

const assets = Object.fromEntries(
  Object.entries(SPRITES).map(([key, sprite]) => [key, loadImage(sprite.src)])
);
assets.liveBg = loadImage("./assests/Live/bg.png");

const STREAM_AVAILABLE_VIDEO_THUMB_FILES = [
  "0a775673f2c93ca0-a4d8b1107612cfb8.png",
  "0b34893d94ae4a398ad5f036cd722d61_1-f2ce2334dfba0cb0.png",
  "0e9f2eb9f0e4ed2b-538e595611151525.png",
  "1-019b331fea03c88e.png",
  "1-588b7941c8781529.png",
  "1-93a66984eda24d29.png",
  "1-cfbeb7aa973eb52b.png",
  "1-dce92423815ae5f7.png",
];
const STREAM_FORBIDDEN_VIDEO_THUMB_FILES = [
  "pixelated-image (1).jpg",
  "pixelated-image (2).jpg",
  "pixelated-image (3).jpg",
  "pixelated-image.png",
];
const STREAM_AVAILABLE_VIDEO_THUMB_KEYS = STREAM_AVAILABLE_VIDEO_THUMB_FILES.map((_, index) => `streamVideoAvailable${index}`);
const STREAM_FORBIDDEN_VIDEO_THUMB_KEYS = STREAM_FORBIDDEN_VIDEO_THUMB_FILES.map((_, index) => `streamVideoForbidden${index}`);
STREAM_AVAILABLE_VIDEO_THUMB_FILES.forEach((file, index) => {
  assets[STREAM_AVAILABLE_VIDEO_THUMB_KEYS[index]] = loadImage(`./assests/Live/avaliable/${file}`);
});
STREAM_FORBIDDEN_VIDEO_THUMB_FILES.forEach((file, index) => {
  assets[STREAM_FORBIDDEN_VIDEO_THUMB_KEYS[index]] = loadImage(`./assests/Live/forbidden/${file}`);
});

const ENDING_MEDIA = {
  ending1: "./assests/ending/ending1.gif",
  ending2: "./assests/ending/ending2.png",
  ending4: "./assests/ending/ending4.png",
  ending5: "./assests/ending/ending5.png",
};

const player = createActor({
  id: "hero",
  label: "親親獸",
  sprite: "hero",
  x: 280,
  y: 644,
  speed: 240,
  direction: "down",
  tint: "#ff7ca0",
});

const vtNpcs = [
  createActor({
    id: "npc1",
    label: "豬鼻醬",
    sprite: "npc1",
    x: 720,
    y: 638,
    speed: 270,
    direction: "down",
    tint: "#e49763",
    patrolOffset: 0.1,
    dialogue: "親親娛樂所屬，豬鼻醬。迷糊又貪吃，鼻尖總是癢癢的，對美食很敏感。",
  }),
  createActor({
    id: "npc2",
    label: "波貝貝",
    sprite: "npc2",
    x: 1280,
    y: 636,
    speed: 285,
    direction: "left",
    tint: "#9ba0aa",
    patrolOffset: 0.45,
    dialogue: "親親娛樂所屬，波貝貝。對吵雜和麻煩最沒耐心，但其實很容易心軟。",
  }),
  createActor({
    id: "npc3",
    label: "親親子",
    sprite: "npc3",
    x: 1840,
    y: 642,
    speed: 275,
    direction: "right",
    tint: "#ff9bc4",
    patrolOffset: 0.8,
    dialogue: "親親娛樂所屬，親親子，人家才不是 VTuber 呢～平時最喜歡玩遊戲跟吃零食。",
  }),
];

const questNpc = createActor({
  id: "npc4",
  label: "蕭政銘",
  sprite: "npc4",
  x: 2230,
  y: 642,
  speed: 0,
  direction: "down",
  tint: "#6f88b8",
  staticNpc: true,
  questGiver: true,
});

const SPECIAL_EXTRA_CHARACTER_DETAILS = {
  8: {
    label: "胖呆親親獸",
    x: 720,
    y: 638,
    speed: 0,
    direction: "left",
    idleDirection: "left",
    tint: "#ffd56f",
    mapId: 99,
    staticNpc: true,
    fixedPlacement: true,
    staticIdleFrame: sourceFrame(923, 587, 74, 158, false, 4),
    dialogueIdleFrames: {
      down: sourceFrame(784, 72, 96, 132, false, 4),
      left: sourceFrame(923, 587, 74, 158, false, 4),
      right: sourceFrame(795, 587, 74, 157, false, 4),
      up: sourceFrame(784, 72, 96, 132, false, 4),
    },
    previewOnly: false,
    fatLunchNpc: true,
  },
  9: {
    label: "久田親親獸",
    x: 520,
    y: 638,
    speed: 0,
    direction: "right",
    idleDirection: "right",
    tint: "#8fd7ff",
    mapId: 99,
    staticNpc: true,
    fixedPlacement: true,
    previewOnly: false,
  },
  12: {
    label: "阿基親親獸",
    x: 760,
    y: 580,
    speed: 0,
    direction: "right",
    idleDirection: "right",
    tint: "#ff8fc4",
    mapId: 8,
    staticNpc: true,
    fixedPlacement: true,
    staticIdleFrame: sourceFrame(147, 332, 85, 145, false, 4),
    dialogueIdleFrames: {
      down: sourceFrame(788, 12, 84, 148, false, 4),
      left: sourceFrame(407, 331, 86, 146, false, 4),
      right: sourceFrame(147, 332, 85, 145, false, 4),
      up: sourceFrame(28, 479, 75, 141, false, 4),
    },
    previewOnly: false,
    smokingDialogue: true,
  },
  14: {
    label: "腰子親親獸",
    x: CHAPTER3_KIDNEY_POSITION.x,
    y: CHAPTER3_KIDNEY_POSITION.y,
    speed: 0,
    direction: "left",
    idleDirection: "left",
    tint: "#fff0a8",
    mapId: 2,
    staticNpc: true,
    fixedPlacement: true,
    previewOnly: false,
    kidneySleeper: true,
    layingDown: true,
  },
  29: {
    label: "九尾親親獸",
    x: 360,
    y: 638,
    speed: 0,
    direction: "right",
    idleDirection: "right",
    tint: "#ffb15f",
    mapId: 99,
    staticNpc: true,
    fixedPlacement: true,
    previewOnly: false,
  },
  35: {
    label: "N先生",
    x: 2090,
    y: 638,
    speed: 235,
    direction: "left",
    idleDirection: "left",
    tint: "#b7f28a",
    mapId: 99,
    staticNpc: true,
    fixedPlacement: true,
    previewOnly: false,
  },
  36: {
    label: "菸頭親親獸",
    x: 1130,
    y: 580,
    speed: 0,
    direction: "left",
    idleDirection: "left",
    tint: "#d7f2a2",
    mapId: 8,
    staticNpc: true,
    fixedPlacement: true,
    staticIdleFrame: sourceFrame(912, 580, 88, 164, false, 4),
    dialogueIdleFrames: {
      down: sourceFrame(663, 67, 82, 158, false, 4),
      left: sourceFrame(912, 580, 88, 164, false, 4),
      right: sourceFrame(792, 580, 73, 164, false, 4),
      up: sourceFrame(923, 324, 74, 160, false, 4),
    },
    previewOnly: false,
    smokingDialogue: true,
  },
  38: {
    label: "青雉RA",
    x: CHAPTER4_BASE_ACTOR_POSITIONS.npc38.x,
    y: CHAPTER4_BASE_ACTOR_POSITIONS.npc38.y,
    speed: 0,
    direction: CHAPTER4_BASE_ACTOR_POSITIONS.npc38.direction,
    idleDirection: CHAPTER4_BASE_ACTOR_POSITIONS.npc38.direction,
    tint: "#91e6ff",
    mapId: 99,
    staticNpc: true,
    fixedPlacement: true,
    previewOnly: false,
  },
  39: {
    label: "蕭犬",
    x: CHAPTER4_BASE_ACTOR_POSITIONS.npc39.x,
    y: CHAPTER4_BASE_ACTOR_POSITIONS.npc39.y,
    speed: 0,
    direction: CHAPTER4_BASE_ACTOR_POSITIONS.npc39.direction,
    idleDirection: CHAPTER4_BASE_ACTOR_POSITIONS.npc39.direction,
    tint: "#ff7a52",
    mapId: 99,
    staticNpc: true,
    fixedPlacement: true,
    previewOnly: false,
  },
  40: {
    label: "偷猿",
    x: CHAPTER4_BASE_ACTOR_POSITIONS.npc40.x,
    y: CHAPTER4_BASE_ACTOR_POSITIONS.npc40.y,
    speed: 0,
    direction: CHAPTER4_BASE_ACTOR_POSITIONS.npc40.direction,
    idleDirection: CHAPTER4_BASE_ACTOR_POSITIONS.npc40.direction,
    tint: "#ffd56f",
    mapId: 99,
    staticNpc: true,
    fixedPlacement: true,
    staticIdleFrame: sourceFrame(270, 490, 92, 118, false, 4),
    dialogueIdleFrames: {
      down: sourceFrame(779, 31, 105, 145, false, 4),
      left: sourceFrame(270, 490, 92, 118, true, 4),
      right: sourceFrame(270, 490, 92, 118, false, 4),
      up: sourceFrame(916, 188, 87, 148, false, 4),
    },
    previewOnly: false,
  },
};

const extraNpcs = EXTRA_CHARACTER_NUMBERS.map((number, index) => createActor({
  id: `npc${number}`,
  label: SPECIAL_EXTRA_CHARACTER_DETAILS[number]?.label || `素材角色 ${number}`,
  sprite: `npc${number}`,
  x: SPECIAL_EXTRA_CHARACTER_DETAILS[number]?.x ?? 220 + (index % 7) * 330,
  y: SPECIAL_EXTRA_CHARACTER_DETAILS[number]?.y ?? 600 + Math.floor(index / 7) * 30,
  speed: SPECIAL_EXTRA_CHARACTER_DETAILS[number]?.speed ?? 230 + (index % 5) * 12,
  direction: SPECIAL_EXTRA_CHARACTER_DETAILS[number]?.direction || (index % 2 ? "left" : "right"),
  tint: SPECIAL_EXTRA_CHARACTER_DETAILS[number]?.tint || ["#7bdff2", "#f7d794", "#c7f464", "#ff9ff3", "#b8a9ff"][index % 5],
  patrolOffset: Math.random(),
  patrolTimer: 0.35 + Math.random() * 1.8,
  patrolHeading: Math.random() < 0.5 ? -1 : 1,
  patrolRise: (Math.random() * 2 - 1) * 0.45,
  dialogue: `我是素材角色 ${number}，目前先在第二張地圖測試移動。`,
  mapId: 99,
  previewOnly: true,
  ...SPECIAL_EXTRA_CHARACTER_DETAILS[number],
}));

const hotelOtakuNpc = createActor({
  id: "hotel_otaku",
  label: "肥宅",
  sprite: "npc32",
  x: 2060,
  y: 638,
  speed: 0,
  direction: "left",
  idleDirection: "left",
  tint: "#f0c070",
  mapId: 7,
  staticNpc: true,
  fixedPlacement: true,
  hotelRoomOwner: true,
});

const chapter5OtakuOpponentNpc = createActor({
  id: "chapter5_otaku_opponent",
  label: hotelOtakuNpc.label,
  sprite: "npc32",
  x: 0,
  y: 0,
  speed: 0,
  direction: "left",
  idleDirection: "left",
  tint: "#f0c070",
  mapId: 99,
  staticNpc: true,
  fixedPlacement: true,
});

function createChapter5TournamentProxy(id, sourceId) {
  const source = extraNpcs.find((actor) => actor.id === sourceId);
  return createActor({
    id,
    label: source?.label || sourceId,
    sprite: source?.sprite || sourceId,
    x: 0,
    y: 0,
    speed: 0,
    direction: "left",
    idleDirection: "left",
    tint: source?.tint || "#ffffff",
    staticIdleFrame: source?.staticIdleFrame,
    dialogueIdleFrames: source?.dialogueIdleFrames,
    useDirectionalDialogueFrame: source?.useDirectionalDialogueFrame,
    mapId: 99,
    staticNpc: true,
    fixedPlacement: true,
  });
}

const chapter5HisadaOpponentNpc = createChapter5TournamentProxy("chapter5_hisada_opponent", "npc9");
const chapter5AkiOpponentNpc = createChapter5TournamentProxy("chapter5_aki_opponent", "npc12");
const chapter5KidneyOpponentNpc = createChapter5TournamentProxy("chapter5_kidney_opponent", "npc14");
const chapter5SmokerOpponentNpc = createChapter5TournamentProxy("chapter5_smoker_opponent", "npc36");

const chapter2MobNpcs = [
  { id: "mob32", label: "宅男1號", sprite: "npc32", x: 760, y: 638, tint: "#f0c070" },
  { id: "mob33", label: "宅男2號", sprite: "npc33", x: 1210, y: 636, tint: "#83d6ff" },
  { id: "mob34", label: "宅女", sprite: "npc34", x: 1660, y: 640, tint: "#ff9bd1" },
  { id: "mob35", label: "N先生", sprite: "npc35", x: 2090, y: 638, tint: "#b7f28a" },
  { id: "mob32_b", label: "宅男1號", sprite: "npc32", x: 980, y: 670, tint: "#f0c070" },
  { id: "mob33_b", label: "宅男2號", sprite: "npc33", x: 1430, y: 672, tint: "#83d6ff" },
  { id: "mob34_b", label: "宅女", sprite: "npc34", x: 1870, y: 668, tint: "#ff9bd1" },
  { id: "mob35_b", label: "N先生", sprite: "npc35", x: 2310, y: 670, tint: "#b7f28a" },
].map((config, index) => createActor({
  ...config,
  homeX: config.x,
  homeY: config.y,
  homeDirection: index % 2 ? "left" : "right",
  speed: 235 + index * 14,
  direction: index % 2 ? "left" : "right",
  patrolOffset: Math.random(),
  patrolTimer: 0.45 + Math.random() * 1.6,
  patrolHeading: Math.random() < 0.5 ? -1 : 1,
  patrolRise: (Math.random() * 2 - 1) * 0.35,
  mapId: 1,
  earlyMob: true,
}));

const kinkoExNpc = createActor({
  id: "kinko_ex",
  label: "小玉",
  sprite: "npc33",
  x: CHAPTER4_EX_POSITION.x,
  y: CHAPTER4_EX_POSITION.y,
  speed: 0,
  direction: CHAPTER4_EX_POSITION.direction,
  idleDirection: CHAPTER4_EX_POSITION.direction,
  tint: "#ff8f8f",
  staticNpc: true,
  fixedPlacement: true,
  mapId: 99,
});

const chapter4HeroProxyNpc = createActor({
  id: "chapter4_hero_proxy",
  label: "親親獸",
  sprite: "hero",
  x: 520,
  y: 638,
  speed: 0,
  direction: "right",
  idleDirection: "right",
  tint: "#ff7ca0",
  staticNpc: true,
  fixedPlacement: true,
  mapId: 99,
});

const npcs = [
  ...vtNpcs,
  questNpc,
  ...extraNpcs,
  hotelOtakuNpc,
  chapter5OtakuOpponentNpc,
  chapter5HisadaOpponentNpc,
  chapter5AkiOpponentNpc,
  chapter5KidneyOpponentNpc,
  chapter5SmokerOpponentNpc,
  ...chapter2MobNpcs,
  kinkoExNpc,
  chapter4HeroProxyNpc,
];
[player, ...npcs].forEach(seedTrail);

const PARTY_STATS = {
  hero: { power: 9800, role: "親親獸", race: "親親獸" },
  npc1: { power: 8600, role: "豬鼻醬", race: "VTuber" },
  npc2: { power: 8200, role: "波貝貝", race: "VTuber" },
  npc3: { power: 9000, role: "親親子", race: "VTuber" },
  npc4: { power: 18888, role: "叉滴娛樂負責人", race: "剪刀人" },
};

EXTRA_CHARACTER_IDS.forEach((id, index) => {
  PARTY_STATS[id] = { power: 6200 + index * 120, role: `素材角色 ${index + 5}`, race: "素材角色" };
});

Object.assign(PARTY_STATS, {
  npc9: { power: 15000, role: "傳說中的台男 1V", race: "親親獸" },
  npc14: { power: 7600, role: "被催眠的白髮生物", race: "親親獸" },
  npc29: { power: 11800, role: "C-22 變身型態", race: "親親獸" },
  npc35: { power: 9800, role: "謎樣詐術師", race: "人類" },
  npc38: { power: 13200, role: "V黑娛樂三大將", race: "海賊親親獸" },
  npc39: { power: 13800, role: "V黑娛樂三大將", race: "海賊親親獸" },
  npc40: { power: 13600, role: "V黑娛樂三大將", race: "海賊親親獸" },
  hotel_otaku: { power: 6200, role: "頭號大乾爹", race: "肥宅" },
  npc12: { power: 8350, role: "子魚計畫歌勢 VTuber／烈焰魔法學系粉紅豹", race: "VTuber" },
  npc36: { power: 7900, role: "羊羊星球羊羊 VTuber", race: "VTuber" },
});
Object.entries(CHAPTER5_TOURNAMENT_PROXY_IDS).forEach(([sourceId, proxyId]) => {
  if (PARTY_STATS[sourceId]) PARTY_STATS[proxyId] = { ...PARTY_STATS[sourceId] };
});

const LEVEL_CURVE_BASE = 100;
const LEVEL_HP_GROWTH = 72;
const LEVEL_ATTACK_GROWTH = 0.08;
const LEVEL_RECOVERY_GROWTH = 0.06;
const POPULARITY_STAT_STEP = 100;
const POPULARITY_STAT_GROWTH = 0.01;
const NO_VIOLATION_STREAM_TEST_POPULARITY_BONUS = 1000;
const BATTLE_EXP_REWARD = {
  recruit: 65,
  boss: 180,
};

const SLOT_SIZE = 5;
const SLOT_LINES = createSlotLines();
const SLOT_ROW_SLIDE_SPEED = 10.5;
const SLOT_LINE_FLASH_TIME = 0.9;
const SLOT_SKILL_STEP_TIME = 0.58;
const UNIQUE_CUTIN_DURATION = 1.55;
const UNIQUE_CASTER_GLOW_DELAY = UNIQUE_CUTIN_DURATION;
const UNIQUE_CASTER_GLOW_TIME = 0.82;
const WORLD_STOP_WARP_TIME = 1.25;
const WORLD_STOP_LINE_COUNT = 1;
const SLOT_MISS_TIME = 0.9;
const SLOT_NEXT_ROUND_DELAY = 0.38;
const AUTO_BATTLE_READY_DELAY = 0.42;
const AUTO_BATTLE_ROW_DELAY = 0.22;
const AUTO_BATTLE_RESULT_DELAY = 0.75;
const BATTLE_CAMERA_EASE = 0.12;
const BATTLE_PLAYER_SPACING_X = 64;
const BATTLE_PLAYER_SPACING_Y = 32;
const BATTLE_ENEMY_SPACING_X = 70;
const BATTLE_ENEMY_SPACING_Y = 66;
const TIMED_STATUS_CONNECTED_ROUNDS = 3;
const TIMED_STATUS_INITIAL_COUNTER = TIMED_STATUS_CONNECTED_ROUNDS + 1;
const BURN_INITIAL_RATIO = 0.08;
const BURN_DECAY_RATE = 0.9;
const BURN_MIN_RATIO = 0.02;
const ROUND_STATUS_DURATION = 3;
const SLEEP_BLOCK_CHANCE = 0.5;
const CHAPTER_COMPLETE_FADE_IN = 0.75;
const CHAPTER_COMPLETE_HOLD = 1.25;
const CHAPTER_COMPLETE_FADE_OUT = 0.75;
const TITLE_UNLOCK_ENDING_ALPHA = 0.42;
const SCENE_FADE_IN_TIME = 1.05;
const MAP_CHANGE_FADE_IN_TIME = 0.62;

const APP_MODE = {
  INTRO: "intro",
  TITLE: "title",
  TITLE_GUIDE: "title-guide",
  TITLE_MESSAGE: "title-message",
  PLAYING: "playing",
};

const OPENING_CUTSCENE_LINES = [
  "這裡是親親世界。",
  "漢堡、護貝、直播與變聲器，把城市泡成了一鍋黏稠的夢。",
  "在這裡，VT 的笑聲可以換成護貝費，護貝費又可以換成更多麻煩。",
  "而某隻粉紅色的生物，什麼都不知道，只是從黑暗裡掉了進來。",
];
const OPENING_TRANSITION_TIME = 1.55;

const TITLE_MENU_ITEMS = [
  { id: "continue", label: "繼續", asset: "titleContinue", glow: "#ffe16f", requiresSave: true },
  { id: "start", label: "開始", asset: "titleStart", glow: "#ff3448" },
  { id: "guide", label: "操作說明", asset: "titleGuide", glow: "#75ff68" },
  { id: "setting", label: "設定", asset: "titleSetting", glow: "#55d8ff", sourceCrop: { x: 41, y: 0, width: 784, height: 288 } },
  { id: "leave", label: "離開", asset: "titleLeave", glow: "#bd6bff" },
];

const TITLE_ITEM_HELP = {
  continue: "讀取目前進度，回到親親世界。",
  start: "從第一天重新開始。若已有存檔，會先詢問是否刪除。",
  guide: "查看基本操作。",
  setting: "音效、BGM 等設定接上後會放在這裡。",
  leave: "前往發發世界。",
};

const TITLE_BUTTON_LAYOUT = {
  x: 660,
  y: 282,
  width: 330,
  height: 108,
  gap: -22,
};

const LEAVE_URL = "https://www.twitch.tv/m989876525";

const SLOT_BOARD = {
  x: 352,
  y: 22,
  width: 576,
  height: 433,
  srcWidth: 577,
  srcHeight: 433,
  cellLeft: 116,
  cellTop: 50,
  cellStepX: 71.25,
  cellStepY: 70,
  cellSize: 58,
};

const SIDE_STYLE = {
  player: { color: "#50d8ff", glow: "rgba(80, 216, 255, 0.72)" },
  enemy: { color: "#ff566c", glow: "rgba(255, 86, 108, 0.72)" },
};

const SKILL_EFFECT_ASSETS = {
  physical: { cast: "skillEffectCast0", hit: "skillEffectHit0", castSize: 138, hitSize: 128 },
  sever: { cast: "skillEffectCast0", hit: "skillEffectHit0", castSize: 160, hitSize: 148 },
  magic: { cast: "skillEffectCast1", hit: "skillEffectHit1", castSize: 150, hitSize: 138 },
  guard: { cast: "skillEffectCast2", hit: null, castSize: 150, hitSize: 0 },
  invincible: { cast: "skillEffectCast2", hit: null, castSize: 170, hitSize: 0 },
  heal: { cast: "skillEffectCast3", hit: "skillEffectHit3", castSize: 150, hitSize: 150 },
  bento: { cast: "skillEffectCast3", hit: "skillEffectHit3", castSize: 168, hitSize: 158 },
  sleep: { cast: "skillEffectCast3", hit: "skillEffectHit3", castSize: 158, hitSize: 148 },
  freeze: { cast: "skillEffectCast1", hit: "skillEffectHit1", castSize: 160, hitSize: 150 },
  reflect: { cast: "skillEffectCast2", hit: "skillEffectHit4", castSize: 160, hitSize: 150 },
  revive: { cast: "skillEffectCast5", hit: "skillEffectHit4", castSize: 170, hitSize: 160 },
  time_stop: { cast: "skillEffectCast5", hit: "skillEffectHit4", castSize: 170, hitSize: 160 },
  beast_bomb: { cast: "skillEffectCast1", hit: "skillEffectHit1", castSize: 185, hitSize: 168 },
  poison: { cast: "skillEffectCast4", hit: "skillEffectHit2", castSize: 145, hitSize: 142 },
  burn: { cast: "skillEffectCast4", hit: "skillEffectHit2", castSize: 150, hitSize: 148 },
  lava_burn: { cast: "skillEffectCast4", hit: "skillEffectHit2", castSize: 170, hitSize: 158 },
  stun: { cast: "skillEffectCast4", hit: "skillEffectHit2", castSize: 145, hitSize: 142 },
  support: { cast: "skillEffectCast5", hit: "skillEffectHit4", castSize: 150, hitSize: 150 },
  cleanse: { cast: "skillEffectCast5", hit: "skillEffectHit4", castSize: 160, hitSize: 150 },
  debuff: { cast: "skillEffectCast4", hit: "skillEffectHit2", castSize: 145, hitSize: 142 },
  charm: { cast: "skillEffectCast5", hit: "skillEffectHit4", castSize: 150, hitSize: 150 },
};

const SKILL_ICON_FRAMES = {
  physical: { x: 0, y: 100, width: 125, height: 140 },
  sever: { x: 0, y: 100, width: 125, height: 140 },
  magic: { x: 125, y: 100, width: 125, height: 140 },
  guard: { x: 249, y: 100, width: 125, height: 140 },
  invincible: { x: 249, y: 100, width: 125, height: 140 },
  heal: { x: 373, y: 100, width: 125, height: 140 },
  bento: { x: 373, y: 100, width: 125, height: 140 },
  sleep: { x: 373, y: 100, width: 125, height: 140 },
  freeze: { x: 125, y: 100, width: 125, height: 140 },
  reflect: { x: 249, y: 100, width: 125, height: 140 },
  revive: { x: 373, y: 100, width: 125, height: 140 },
  time_stop: { x: 249, y: 253, width: 125, height: 140 },
  beast_bomb: { x: 125, y: 100, width: 125, height: 140 },
  poison: { x: 0, y: 253, width: 125, height: 140 },
  burn: { x: 0, y: 253, width: 125, height: 140 },
  lava_burn: { x: 0, y: 253, width: 125, height: 140 },
  stun: { x: 125, y: 253, width: 125, height: 140 },
  support: { x: 249, y: 253, width: 125, height: 140 },
  cleanse: { x: 249, y: 253, width: 125, height: 140 },
  debuff: { x: 373, y: 253, width: 125, height: 140 },
  charm: { x: 249, y: 253, width: 125, height: 140 },
};

const SKILL_TYPES = {
  physical: { label: "物攻", short: "物" },
  sever: { label: "斬擊", short: "斬" },
  magic: { label: "魔攻", short: "魔" },
  guard: { label: "護盾", short: "盾" },
  invincible: { label: "無敵", short: "無" },
  heal: { label: "治療", short: "補" },
  bento: { label: "便當", short: "當" },
  sleep: { label: "睡眠", short: "睡" },
  freeze: { label: "冰凍", short: "冰" },
  reflect: { label: "反射", short: "反" },
  revive: { label: "復活", short: "活" },
  time_stop: { label: "時停", short: "停" },
  beast_bomb: { label: "獸玉", short: "玉" },
  poison: { label: "中毒", short: "毒" },
  burn: { label: "燒傷", short: "燒" },
  lava_burn: { label: "熔岩", short: "熔" },
  stun: { label: "暈眩", short: "暈" },
  support: { label: "增益", short: "增" },
  cleanse: { label: "淨化", short: "淨" },
  debuff: { label: "減益", short: "減" },
  charm: { label: "魅惑", short: "魅" },
  passive: { label: "被動", short: "被" },
};

const PLAYER_SKILLS_BY_ACTOR = {
  hero: [
    { id: "hero_crash", owner: "親親獸", name: "暴衝撞擊", type: "physical" },
    { id: "hero_bite", owner: "親親獸", name: "怪力咬擊", type: "physical" },
    { id: "hero_stubborn", owner: "親親獸", name: "裝沒聽到", type: "guard" },
    { id: "hero_noise", owner: "親親獸", name: "怪聲干擾", type: "stun" },
  ],
  npc1: [
    { id: "pig_food_hunt", owner: "豬鼻醬", name: "美食直覺", type: "physical" },
    { id: "pig_noodle", owner: "豬鼻醬", name: "拉麵補給", type: "heal" },
    { id: "pig_sniff", owner: "豬鼻醬", name: "鼻尖索敵", type: "support" },
    { id: "pig_big_sister_guard", owner: "豬鼻醬", name: "姐姐會保護大家的", type: "invincible", effect: "自己獲得無敵與嘲諷狀態，敵方單體技能會優先指定自己；無敵與嘲諷直到受到敵方攻擊的回合結束才會解除。" },
  ],
  npc2: [
    { id: "bebe_sleep", owner: "波貝貝", name: "水餃休眠", type: "heal" },
    { id: "bebe_ignore", owner: "波貝貝", name: "不耐煩眼神", type: "debuff" },
    { id: "bebe_game", owner: "波貝貝", name: "遊戲集中", type: "magic" },
    { id: "bebe_group_dumpling", owner: "波貝貝", name: "一起水餃吧", type: "sleep", effect: "全體角色獲得睡眠狀態；我方全體獲得美夢，敵方全體獲得噩夢。睡眠中每個技能格有 50% 機率變成睡眠格；美夢每回合回復 5% HP；噩夢每回合失去 5% HP。三者皆持續 3 回合，MISS 也會結算。" },
  ],
  npc3: [
    { id: "kinko_scam", owner: "親親子", name: "騙錢話術", type: "magic" },
    { id: "kinko_card", owner: "親親子", name: "卡牌收集", type: "support" },
    { id: "kinko_tsundere", owner: "親親子", name: "才不喜歡你", type: "debuff" },
    { id: "kinko_love_you", owner: "親親子", name: "最喜歡你了", type: "charm", effect: "使目標魅惑 3 次連線回合；魅惑中受到傷害 +50%、造成傷害 -50%。" },
  ],
};

const PASSIVE_SKILLS_BY_ACTOR = {
  hero: { name: "VT 獵牙", effect: "對 VTuber 造成的傷害 +20%。" },
  npc1: { name: "美食補給線", effect: "隊伍治療、護盾效果 +10%。" },
  npc2: { name: "慵懶節拍", effect: "盤面轉動速度 -10%。" },
  npc3: { name: "甜言號令", effect: "隊伍造成的傷害 +10%。" },
};

EXTRA_CHARACTER_IDS.forEach((id, index) => {
  const label = `素材角色 ${index + 5}`;
  const skillTypes = ["physical", "magic", "guard", "heal", "support", "debuff"];
  PLAYER_SKILLS_BY_ACTOR[id] = [
    { id: `${id}_strike`, owner: label, name: `${label}打擊`, type: skillTypes[index % skillTypes.length] },
    { id: `${id}_trick`, owner: label, name: `${label}應援`, type: skillTypes[(index + 2) % skillTypes.length] },
    { id: `${id}_boost`, owner: label, name: `${label}節奏`, type: skillTypes[(index + 4) % skillTypes.length] },
  ];
  PASSIVE_SKILLS_BY_ACTOR[id] = { name: "素材測試", effect: "測試用被動：小幅提升自己的行動穩定度。" };
});

PLAYER_SKILLS_BY_ACTOR.npc8 = [
  { id: "fat_bento_charge", owner: "胖呆親親獸", name: "便當債衝撞", type: "physical" },
  { id: "fat_table_flip", owner: "胖呆親親獸", name: "翻桌索賠", type: "magic" },
  { id: "fat_full_guard", owner: "胖呆親親獸", name: "飽足防守", type: "guard" },
  { id: "fat_all_you_can_eat", owner: "胖呆親親獸", name: "便當吃到飽", type: "bento", effect: "回復己方全體所有 HP；每場戰鬥最多成功使用 3 次。" },
];

PLAYER_SKILLS_BY_ACTOR.npc12 = [
  { id: "aki_flame_note", owner: "阿基親親獸", name: "烈焰高音", type: "magic" },
  { id: "aki_pink_panther", owner: "阿基親親獸", name: "粉豹突襲", type: "physical" },
  { id: "aki_magic_major", owner: "阿基親親獸", name: "魔法學分", type: "support" },
  { id: "aki_heavenly_voice", owner: "阿基親親獸", name: "天籟之音", type: "cleanse", effect: "解除我方全體負面效果，治療我方全體血量，並使我方全體獲得護盾。" },
];
PASSIVE_SKILLS_BY_ACTOR.npc12 = {
  name: "歌勢燃音",
  effect: "施放魔攻技能時，自己的傷害小幅提升。",
};

PLAYER_SKILLS_BY_ACTOR.npc36 = [
  { id: "butt_smoke_ring", owner: "菸頭親親獸", name: "菸圈迷霧", type: "debuff" },
  { id: "butt_wool_guard", owner: "菸頭親親獸", name: "羊毛護身", type: "guard" },
  { id: "butt_sheep_signal", owner: "菸頭親親獸", name: "羊羊星訊", type: "heal" },
  { id: "butt_burning_butt", owner: "菸頭親親獸", name: "菸頭燙燙燙", type: "burn", effect: "使對方獲得睡眠及燒傷狀態。睡眠中每個技能格有 50% 機率變成睡眠格，持續 3 回合，MISS 也會扣回合；燒傷不會自然解除，回合結束傷害會逐次遞減，再次燒傷會重置傷害。" },
];
PASSIVE_SKILLS_BY_ACTOR.npc36 = {
  name: "羊星菸霧",
  effect: "受到減益時，下一次護盾效果小幅提升。",
};

PLAYER_SKILLS_BY_ACTOR.npc9 = [
  { id: "hisada_time_slash", owner: "久田親親獸", name: "時針斬擊", type: "physical" },
  { id: "hisada_clock_guard", owner: "久田親親獸", name: "秒針防線", type: "guard" },
  { id: "hisada_time_echo", owner: "久田親親獸", name: "時間殘響", type: "support" },
  { id: "hisada_the_world", owner: "久田親親獸", name: "世界The World", type: "time_stop", effect: "時間暫停，兩個包含自己技能的連線回合內只有自己能夠發動技能。" },
];
PASSIVE_SKILLS_BY_ACTOR.npc9 = {
  name: "傳說台男",
  effect: "連線時提高自己的技能穩定度。",
};

PLAYER_SKILLS_BY_ACTOR.npc14 = [
  { id: "kidney_sleep_kick", owner: "腰子親親獸", name: "睡醒踢擊", type: "physical" },
  { id: "kidney_white_breath", owner: "腰子親親獸", name: "白髮祈息", type: "heal" },
  { id: "kidney_soft_guard", owner: "腰子親親獸", name: "棉被護身", type: "guard" },
  { id: "kidney_archangel_breath", owner: "腰子親親獸", name: "大天使的氣息", type: "revive", effect: "復活一名死亡的我方角色，並回復一半 HP。" },
];
PASSIVE_SKILLS_BY_ACTOR.npc14 = {
  name: "睡眠復健",
  effect: "水餃後醒來時，自己的治療效果小幅提升。",
};

PLAYER_SKILLS_BY_ACTOR.npc29 = [
  { id: "kyubi_claw", owner: "九尾親親獸", name: "九尾爪擊", type: "physical" },
  { id: "kyubi_chakra", owner: "九尾親親獸", name: "護貝查克拉", type: "support" },
  { id: "kyubi_tail_guard", owner: "九尾親親獸", name: "尾巴防壁", type: "guard" },
  { id: "kyubi_beast_bomb", owner: "九尾親親獸", name: "親親獸玉", type: "beast_bomb", effect: "對敵方全體造成大量魔法傷害，並使敵方獲得減益。" },
];
PASSIVE_SKILLS_BY_ACTOR.npc29 = {
  name: "C-22 暴走",
  effect: "變身期間物攻與魔攻小幅提升。",
};

PLAYER_SKILLS_BY_ACTOR.npc35 = [
  { id: "n_fake_smile", owner: "N先生", name: "假笑靠近", type: "physical" },
  { id: "n_contract_trap", owner: "N先生", name: "合約陷阱", type: "debuff" },
  { id: "n_empty_promise", owner: "N先生", name: "空頭支票", type: "guard" },
  { id: "n_steal_abduct_scam", owner: "N先生", name: "偷拐搶騙", type: "debuff", effect: "造成傷害並降低對方增幅，典型的又偷又拐又搶又騙。" },
];
PASSIVE_SKILLS_BY_ACTOR.npc35 = {
  name: "不可信任",
  effect: "擅長用話術擾亂對手，戰鬥中以減益技能為主。",
};

PLAYER_SKILLS_BY_ACTOR.npc38 = [
  { id: "aokiji_ice_spear", owner: "青雉RA", name: "冰槍掃射", type: "magic" },
  { id: "aokiji_cold_guard", owner: "青雉RA", name: "寒氣防壁", type: "guard" },
  { id: "aokiji_slow_words", owner: "青雉RA", name: "冷場壓迫", type: "debuff" },
  { id: "aokiji_ice_fall", owner: "青雉RA", name: "冰殞塵風", type: "freeze", effect: "對全體敵方造成傷害，並使其獲得冰凍狀態。" },
];
PASSIVE_SKILLS_BY_ACTOR.npc38 = {
  name: "冷氣外放",
  effect: "敵方受到減益時，追加一點冰冷壓迫感。",
};

PLAYER_SKILLS_BY_ACTOR.npc39 = [
  { id: "lava_dog_punch", owner: "蕭犬", name: "熔岩拳", type: "physical" },
  { id: "lava_dog_bark", owner: "蕭犬", name: "熱血狂吠", type: "support" },
  { id: "lava_dog_armor", owner: "蕭犬", name: "岩漿護甲", type: "guard" },
  { id: "lava_dog_kiss", owner: "蕭犬", name: "熔岩親親", type: "lava_burn", effect: "對全體敵方造成傷害，並使其獲得燒傷狀態。" },
];
PASSIVE_SKILLS_BY_ACTOR.npc39 = {
  name: "岩漿脾氣",
  effect: "造成燒傷時，燒傷起始傷害提高。",
};

const MONKEY_SKILLS = [
  { id: "monkey_flash", owner: "偷猿", name: "閃光挪移", type: "physical" },
  { id: "monkey_bounce", owner: "偷猿", name: "彈跳偷襲", type: "magic" },
  { id: "monkey_trick_guard", owner: "偷猿", name: "猴戲防線", type: "guard" },
  { id: "monkey_reflect_world", owner: "偷猿", name: "彈射世界", type: "reflect", effect: "使我方全體獲得反射狀態。" },
];
PLAYER_SKILLS_BY_ACTOR.npc40 = MONKEY_SKILLS;
PASSIVE_SKILLS_BY_ACTOR.npc40 = {
  name: "閃光猴戲",
  effect: "擅長把攻擊彈回去，反射狀態期間更難處理。",
};

PLAYER_SKILLS_BY_ACTOR.hotel_otaku = [
  { id: "otaku_support_scream", owner: "肥宅", name: "古參吶喊", type: "support" },
  { id: "otaku_keyboard_guard", owner: "肥宅", name: "鍵盤護身", type: "guard" },
  { id: "otaku_throw_wallet", owner: "肥宅", name: "錢包投擲", type: "physical" },
  { id: "otaku_gachi_push", owner: "肥宅", name: "乾爹支援", type: "heal", effect: "回復我方血量。" },
];

const BOSS_SKILLS = [
  { id: "boss_charge", owner: "野豬老大", name: "橫衝直撞", type: "physical" },
  { id: "boss_tusk", owner: "野豬老大", name: "獠牙猛擊", type: "physical" },
  { id: "boss_hide", owner: "野豬老大", name: "厚皮硬扛", type: "guard" },
  { id: "boss_roar", owner: "野豬老大", name: "威嚇咆哮", type: "debuff" },
  { id: "boss_rage", owner: "野豬老大", name: "狂暴蓄力", type: "support" },
];

const XIAO_SKILLS = [
  { id: "xiao_scissor_tax", owner: "蕭政銘", name: "保護貝剪收", type: "physical" },
  { id: "xiao_silver_cut", owner: "蕭政銘", name: "銀剪斷念", type: "magic" },
  { id: "xiao_contract_cut", owner: "蕭政銘", name: "合約裁切", type: "debuff" },
  { id: "xiao_one_cut", owner: "蕭政銘", name: "一刀兩斷", type: "sever", effect: "造成對方當前 HP 一半的傷害。" },
  { id: "xiao_cutting_guard", owner: "蕭政銘", name: "剪影護身", type: "guard" },
  { id: "xiao_final_snip", owner: "蕭政銘", name: "討剪", type: "physical" },
  { id: "xiao_ruler_of_cut", owner: "蕭政銘", name: "剪刀大哥", type: "support" },
];

PLAYER_SKILLS_BY_ACTOR.npc4 = XIAO_SKILLS;
PASSIVE_SKILLS_BY_ACTOR.npc4 = {
  name: "剪刀領域",
  effect: "結算時會強制發動斜對角上的蕭政銘技能。",
};

const KINKO_EX_SKILLS = [
  { id: "ex_loud_accuse", owner: "小玉", name: "門口大吵", type: "physical" },
  { id: "ex_receipt_bomb", owner: "小玉", name: "舊帳爆破", type: "magic" },
  { id: "ex_sour_words", owner: "小玉", name: "酸言酸語", type: "debuff" },
  { id: "ex_clingy_guard", owner: "小玉", name: "死纏爛打", type: "guard" },
];

const FAT_OTAKU_SKILLS = [
  { id: "otaku_keyboard_smash", owner: "肥宅", name: "鍵盤怒敲", type: "physical" },
  { id: "otaku_room_lock", owner: "肥宅", name: "房門反鎖", type: "guard" },
  { id: "otaku_late_night", owner: "肥宅", name: "熬夜凝視", type: "debuff" },
];

const SMOKER_DUO_SKILLS = [
  { id: "smoker_fee_collect", owner: "抽菸二人組", name: "護貝費收取", type: "physical" },
  { id: "smoker_smoke_cloud", owner: "抽菸二人組", name: "煙霧結界", type: "debuff" },
  { id: "smoker_bad_attitude", owner: "抽菸二人組", name: "門口壓迫感", type: "magic" },
  { id: "smoker_second_hand", owner: "抽菸二人組", name: "二手菸護體", type: "guard" },
];

const EARLY_MOB_SKILLS = [
  { id: "mob_wallet_guard", owner: "路人", name: "錢包防守", type: "guard" },
  { id: "mob_scream", owner: "路人", name: "尖叫逃跑", type: "debuff" },
  { id: "mob_counter", owner: "路人", name: "護貝反擊", type: "physical" },
];

const XIAO_DOMAIN_COLOR = "#b45cff";

const PLAYER_TITLES = [
  {
    id: "ending1_black_e",
    name: "黑E組織",
    ending: "結局1 - 發仔...倒了...",
    effect: "攻擊 +25%。",
    type: "attack",
    multiplier: 1.25,
  },
  {
    id: "ending2_dumpling",
    name: "我愛水餃",
    ending: "結局2 - 大水餃",
    effect: "治癒能力 +25%。",
    type: "heal",
    multiplier: 1.25,
  },
  {
    id: "ending3_unemployed",
    name: "無業遊民",
    ending: "結局3 - 出道即畢業／畢業",
    effect: "護盾效果 +25%。",
    type: "shield",
    multiplier: 1.25,
  },
  {
    id: "ending4_trash",
    name: "垃圾",
    ending: "結局4 - 你...有良心嗎",
    effect: "沒有任何效果。",
  },
  {
    id: "ending5_strongest_1v",
    name: "最強台1V",
    ending: "結局5 - 最強台1V",
    effect: "全能力 +10%。",
    type: "all",
    multiplier: 1.1,
  },
];

const MENU_MAIN_ITEMS = [
  { id: "characters", label: "角色" },
  { id: "equipment", label: "裝備" },
  { id: "team", label: "隊伍" },
  { id: "titles", label: "稱號" },
  { id: "dumpling", label: "水餃" },
];

MENU_MAIN_ITEMS.find((item) => item.id === "characters").label = "角色";
MENU_MAIN_ITEMS.find((item) => item.id === "equipment").label = "背包";
MENU_MAIN_ITEMS.find((item) => item.id === "team").label = "隊伍";
MENU_MAIN_ITEMS.find((item) => item.id === "titles").label = "稱號";
MENU_MAIN_ITEMS.find((item) => item.id === "dumpling").label = "水餃";

const MENU_CHARACTER_IDS = ["hero", "npc1", "npc2", "npc3", "npc4", "hotel_otaku", ...EXTRA_CHARACTER_IDS];

const HEAD_SOURCES = {
  hero: "./assests/Character/Head/0.png",
  npc1: "./assests/Character/Head/1.png",
  npc2: "./assests/Character/Head/2.png",
  npc3: "./assests/Character/Head/3.png",
  npc4: "./assests/Character/Head/4.png",
  hotel_otaku: "./assests/Character/Head/32.png",
};

Object.assign(
  HEAD_SOURCES,
  Object.fromEntries(EXTRA_CHARACTER_NUMBERS.map((number) => [`npc${number}`, `./assests/Character/Head/${number}.png`]))
);

const QUEST_STATUS = {
  inactive: "尚未接觸",
  accepted: "任務中",
  ready: "可交付",
  battle: "收尾中",
  completed: "完成",
};

const EQUIPMENT_SLOT_LABELS = {
  weapon: "武器",
  armor: "防具",
  charm: "飾品",
};

const DEFAULT_EQUIPMENT_BY_SLOT = {
  weapon: "bare",
  armor: "cloth",
  charm: "none",
};

const BASIC_EQUIPMENT_IDS = new Set(Object.values(DEFAULT_EQUIPMENT_BY_SLOT));

const EQUIPMENT_SHEETS = {
  weapon: { src: "./assests/Equipment/Weapon.png", width: 1254, height: 1254, cellWidth: 209, cellHeight: 251, stepX: 209, stepY: 251, inset: 0 },
  armor: { src: "./assests/Equipment/Armor.png", width: 1254, height: 1254, cellWidth: 209, cellHeight: 251, stepX: 209, stepY: 251, inset: 0 },
  charm: { src: "./assests/Equipment/Accessories.png", width: 1254, height: 1254, cellWidth: 157, cellHeight: 179, stepX: 157, stepY: 179, inset: 0 },
};

const EMPTY_EQUIPMENT_ICONS = {
  weapon: "./assests/Equipment/Empty_weapon.png",
  armor: "./assests/Equipment/Empty_armor.png",
  charm: "./assests/Equipment/Empty_accessories.png",
};

const ITEM_CATALOG = {
  bebe_flute: {
    id: "bebe_flute",
    name: "波貝貝之笛",
    description: "據說能叫醒睡死的人，但叫不醒裝睡的人。",
    price: CHAPTER3_FLUTE_PRICE,
    icon: "./assests/Character/Head/2.png",
  },
  c22_pill: {
    id: "c22_pill",
    name: "C-22 藥錠",
    description: "超商限定的奇怪藥錠。",
    price: CHAPTER4_C22_PRICE,
    icon: "./assests/Equipment/Icons/accessory_02_04.png",
  },
};

const EQUIPMENT_OPTIONS = {
  weapon: [
    { id: "bare", name: "空手", description: "沒有武器，靠怪力硬撞。", icon: { col: 0, row: 0 }, attackBonus: 0, hpBonus: 0, shieldBonus: 0 },
    { id: "pipe", name: "生鏽水管", description: "攻擊 +12%。", icon: "./assests/Equipment/Icons/pipe.png", attackBonus: 0.12, hpBonus: 0, shieldBonus: 0 },
    { id: "arcade_blade", name: "街機短刀", description: "攻擊 +22%，HP -80。", icon: "./assests/Equipment/Icons/arcade-blade.png", attackBonus: 0.22, hpBonus: -80, shieldBonus: 0 },
    { id: "stream_mic", name: "直播麥克風", description: "成立 VT 部門需要的設備。攻擊 +6%。", icon: "./assests/Equipment/Icons/weapon_01_03.png", attackBonus: 0.06, hpBonus: 0, shieldBonus: 0, price: 160 },
  ],
  armor: [
    { id: "cloth", name: "普通衣服", description: "沒有防具，靠臉接招。", icon: { col: 0, row: 0 }, attackBonus: 0, hpBonus: 0, shieldBonus: 0 },
    { id: "hoodie", name: "厚棉帽T", description: "HP +120。", icon: "./assests/Equipment/Icons/hoodie.png", attackBonus: 0, hpBonus: 120, shieldBonus: 0 },
    { id: "guard_vest", name: "護貝背心", description: "HP +80，護盾 +15%。", icon: "./assests/Equipment/Icons/guard-vest.png", attackBonus: 0, hpBonus: 80, shieldBonus: 0.15 },
  ],
  charm: [
    { id: "none", name: "無飾品", description: "沒有飾品。", icon: { col: 0, row: 0 }, attackBonus: 0, hpBonus: 0, shieldBonus: 0 },
    { id: "coin_charm", name: "保護貝吊飾", description: "HP +180。", icon: "./assests/Equipment/Icons/shell-charm.png", attackBonus: 0, hpBonus: 180, shieldBonus: 0 },
    { id: "neon_badge", name: "霓虹徽章", description: "護盾 +25%。", icon: "./assests/Equipment/Icons/neon-badge.png", attackBonus: 0, hpBonus: 0, shieldBonus: 0.25 },
    { id: "voice_changer", name: "變聲器", description: "成立 VT 部門需要的設備。攻擊 +4%。", icon: "./assests/Equipment/Icons/accessory_02_04.png", attackBonus: 0.04, hpBonus: 0, shieldBonus: 0, price: 180 },
    { id: "stream_light", name: "直播燈", description: "成立 VT 部門需要的設備。HP +90。", icon: "./assests/Equipment/Icons/accessory_03_06.png", attackBonus: 0, hpBonus: 90, shieldBonus: 0, price: 140 },
    { id: "kiss_beast_doll", name: "親親獸娃娃", description: "裝備者每回合第一次施放的技能會變為獨特技能。久田親親獸除外。", icon: "./assests/Character/Head/0.png", attackBonus: 0, hpBonus: 0, shieldBonus: 0, effectText: "每回合首次施放技能變為獨特技能。久田親親獸除外。" },
  ],
};

const STACKABLE_EQUIPMENT_IDS = new Set(["kiss_beast_doll"]);

const SKILL_EFFECTS = {
  physical: "造成物理傷害。",
  sever: "造成目標當前 HP 一半的傷害。",
  magic: "造成魔法傷害。",
  guard: "替血量最低的隊友增加護盾。",
  invincible: "施放者獲得無敵與嘲諷狀態，敵方單體技能會優先指定自己；無敵與嘲諷直到受到敵方攻擊的回合結束才會解除。",
  heal: "治療血量最低的隊友。",
  bento: "回復己方全體所有 HP；每場戰鬥最多成功使用 3 次。",
  sleep: "全體進入睡眠狀態；我方全體獲得美夢，敵方全體獲得噩夢。睡眠中每個技能格有 50% 機率變成睡眠格；美夢每回合回復 5% HP；噩夢每回合失去 5% HP。三者皆持續 3 回合，MISS 也會結算。",
  poison: "造成中毒傷害。",
  burn: "使目標進入睡眠與燒傷狀態；睡眠中每個技能格有 50% 機率變成睡眠格，持續 3 回合，MISS 也會扣回合。燒傷不會自然解除，回合結束傷害會逐次遞減，再次燒傷會重置傷害。",
  stun: "造成傷害，並使目標暈眩。暈眩目標下一次成功連線時無法施放該格技能。",
  support: "提升己方後續傷害 3 次連線回合，角色頭上會出現增幅標誌。",
  cleanse: "解除我方全體負面效果，治療我方全體血量，並使我方全體獲得護盾。",
  debuff: "造成傷害，並削弱對方增幅或造成減益 3 次連線回合。",
  charm: "使目標魅惑 3 次連線回合；魅惑中受到傷害 +50%、造成傷害 -50%。",
  passive: "被動技能，進入戰鬥後自動生效。",
};

let lastTime = performance.now();
let gameLoopStarted = false;
let questState = "inactive";
let questUnlocked = false;
let questNpcDefeated = false;
let chapter2State = createDefaultChapter2State();
let chapter3State = createDefaultChapter3State();
let chapter4State = createDefaultChapter4State();
let chapter5State = createDefaultChapter5State();
let xiaoDeparture = null;
let smokerDeparture = null;
let fatDumbDeparture = null;
let kidneyDeparture = null;
let kinkoExDeparture = null;
let chapter4CutsceneMove = null;
let chapter4AlarmFlash = null;
let chapter4KinkoHitSequence = null;
let cameraFocusActor = null;
const dialogueCameraAnchor = { x: 0, y: 638, hidden: false };
const chapter4CellCameraAnchor = { x: 1570, y: 638, hidden: false };
const chapter5TournamentCameraAnchor = {
  x: CHAPTER5_TOWER_PLAYER_ENTRY.x + 80,
  y: CHAPTER5_TOWER_PLAYER_ENTRY.y,
  hidden: false,
};
let transformCutscene = null;
let chapter4StoryImage = null;
let chapter5EventCutin = null;
let chapter5RuleDocument = null;
let collected = 0;
let currentMapIndex = 0;
let shellFee = 0;
let ownedShopItemCounts = {};
let ownedItems = {};
let currentDay = 1;
let saveEnabled = false;
let appMode = APP_MODE.INTRO;
let introPage = 0;
let introPageStartedAt = 0;
let titleMenuIndex = 0;
let titleMessage = null;
let openingCutscene = null;
let dialogueState = null;
let dialogueChoiceIndex = 0;
let battleState = null;
let battleTutorialState = null;
let battleTutorialSeen = false;
let endingState = null;
let restCutscene = null;
let chapterCompleteTransition = null;
let sceneFade = null;
let streamState = null;
let menuOpen = false;
let menuScreen = "main";
let mainMenuIndex = 0;
let characterMenuIndex = 0;
let selectedCharacterId = "hero";
let characterEquipSlotIndex = 0;
let characterEquipOptionIndex = 0;
let characterEquipListOpen = false;
let equipmentMenuIndex = 0;
let bagTabIndex = 0;
let bagListActive = false;
let shopMenuIndex = 0;
let activeShopId = null;
let honorTitleIndex = 0;
let teamSlotIndex = 0;
let teamCandidateIndex = 0;
let teamCandidateMode = false;
const TEAM_CANDIDATE_VISIBLE_COUNT = 7;
let dumplingRecovery = null;
let unlockedTitles = createDefaultTitleUnlocks();
let staleDumplingState = createDefaultStaleDumplingState();
let battleHelpState = createDefaultBattleHelpState();
let battleAutoEnabled = false;
let battleAutoTimer = 0;
let battleSpeedEnabled = false;
let audioUnlocked = false;
let activeBgm = null;
let bgmSuspendedByWorldStop = false;
let masterVolume = loadMasterVolume();
const fadingBgms = [];
const sfxAudioCache = new Map();

function createDefaultChapter2State() {
  return {
    phase: "locked",
    xiaoDeparted: false,
    reviewDone: false,
    exitReminderShown: false,
    equipment: Object.fromEntries(CHAPTER2_REQUIRED_EQUIPMENT.map((id) => [id, false])),
    roomUnlocked: false,
    smokersCleared: false,
    floorMatIntroShown: false,
    completed: false,
  };
}

function createDefaultChapter3State() {
  return {
    phase: "locked",
    sleptAfterChapter2: false,
    xiaoBriefed: false,
    pigFound: false,
    bebeFound: false,
    kinkoFound: false,
    fluteBought: false,
    fluteUsed: false,
    fatLunchResolved: false,
    lastKinkoOtakuFeeDay: 0,
    kinkoOtakuFeeNeedsMapChange: false,
    lastPigDateDay: 0,
    lastBebeCollabDay: 0,
    fatDumbDaily: { day: 0, mapId: 99, x: 0, y: 0, direction: "left" },
    pigDate: { status: "idle", remaining: 0, day: 0 },
    bebeCollab: { status: "idle", remaining: 0, day: 0 },
    streamIntroDone: false,
    streamTutorialDone: false,
    streamCompleted: false,
    lastLivestreamDay: 0,
    streamAssistLevel: 0,
    completed: false,
  };
}

function createDefaultChapter4State() {
  return {
    phase: "locked",
    startedDay: 0,
    targetReachedDay: 0,
    popularityTarget: 0,
    sawDoorEx: false,
    xiaoJoined: false,
    exDefeated: false,
    kinkoLeft: false,
    postKinkoStreamDone: false,
    postKinkoStreamCount: 0,
    rescueBriefed: false,
    c22Bought: false,
    c22Explained: false,
    transformed: false,
    baseEntryWarned: false,
    baseEncounterDone: false,
    captiveSleepCount: 0,
    captiveDoorTalks: 0,
    captiveWakeSeen: false,
    rescueFlashbackStarted: false,
    rescueSearchStarted: false,
  rescuePartyJoined: false,
    rescueEncounterStarted: false,
    rescueBattleWon: false,
    rescueCellEntered: false,
    rescueCellChecked: [],
    rescueCellFinaleDone: false,
    rescueFinaleDone: false,
  };
}

function createDefaultChapter5State() {
  return {
    phase: "locked",
    introDone: false,
    tournamentRound: 0,
    tournamentRosterUnlocked: false,
    tournamentFailureHintShown: false,
    tournamentSupportGranted: false,
    battleSpeedUnlocked: false,
    completed: false,
  };
}

function createDefaultBattleHelpState() {
  return {
    heroKoHintShown: false,
    partyWipeHintShown: false,
  };
}

const characterEquipment = {
  hero: { ...DEFAULT_EQUIPMENT_BY_SLOT },
  npc1: { ...DEFAULT_EQUIPMENT_BY_SLOT },
  npc2: { ...DEFAULT_EQUIPMENT_BY_SLOT },
  npc3: { ...DEFAULT_EQUIPMENT_BY_SLOT },
  npc4: { ...DEFAULT_EQUIPMENT_BY_SLOT },
  hotel_otaku: { ...DEFAULT_EQUIPMENT_BY_SLOT },
};

EXTRA_CHARACTER_IDS.forEach((id) => {
  characterEquipment[id] = { ...DEFAULT_EQUIPMENT_BY_SLOT };
});

const teamSlots = ["hero", null, null, null];

const characterProgress = Object.fromEntries(
  MENU_CHARACTER_IDS.map((actorId) => [actorId, createDefaultCharacterProgress()])
);

initializeDebugModeUi();
battleActionEl.addEventListener("click", handleBattleAction);
menuContentEl.addEventListener("click", handleMenuContentClick);
canvas.addEventListener("contextmenu", handleCanvasContextMenu);
canvas.addEventListener("click", handleCanvasClick);
canvas.addEventListener("mousemove", handleCanvasMouseMove);
chapterTestButtons.forEach((button) => {
  button.addEventListener("click", () => {
    playSfx("ui_confirm");
    startTestChapter(button.dataset.testChapter);
  });
});
shellFeeTestButtonEl?.addEventListener("click", () => {
  playSfx("ui_confirm");
  grantTestShellFee();
});
battleAutoToggleEl?.addEventListener("click", () => {
  playSfx("ui_confirm");
  toggleBattleAuto();
});
battleSpeedToggleEl?.addEventListener("click", () => {
  playSfx("ui_confirm");
  toggleBattleSpeed();
});
initializeMasterVolumeControl();
canvas.addEventListener("mouseleave", () => {
  if (streamState?.contextMenu) streamState.contextMenu.hoverIndex = -1;
  canvas.style.cursor = "default";
});

window.addEventListener("error", (event) => {
  reportRuntimeError(event.error || event.message || "未知錯誤");
});

window.addEventListener("unhandledrejection", (event) => {
  reportRuntimeError(event.reason || "未知非同步錯誤");
});

loadGameAssetsWithProgress = createBootAssetLoader();
loadGameAssetsWithProgress().catch((error) => {
  console.warn("素材載入流程中斷，改用已載入素材繼續啟動。", error);
  updateLoadingProgress(1, 1, "素材載入略過，繼續啟動");
}).then(() => {
  loadGame();
  updateLoadingProgress(1, 1, "處理初始角色素材");
  prepareCharacterSpriteAssets(INITIAL_CHARACTER_SPRITE_KEYS);
  updateLoadingProgress(1, 1, "啟動遊戲");
  introPage = 0;
  introPageStartedAt = performance.now();
  startGameLoop();
  hideLoadingScreen();
  scheduleExtraCharacterSpritePreparation();
});

window.addEventListener("beforeunload", saveGame);
setInterval(saveGame, 5000);

window.addEventListener("keydown", (event) => {
  unlockAudioByUserGesture();
  const key = event.key.toLowerCase();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", "z", "x"].includes(key) || event.code === CONFIRM_CODE || event.code === CANCEL_CODE) {
    event.preventDefault();
  }

  if (appMode !== APP_MODE.PLAYING) {
    handleTitleKey(event);
    return;
  }

  if (endingState) {
    handleEndingKey(event);
    return;
  }

  if (openingCutscene) {
    if (event.code === CONFIRM_CODE && !event.repeat) {
      advanceOpeningCutscene();
    }
    return;
  }

  if (restCutscene) {
    if (event.code === CONFIRM_CODE && !event.repeat) {
      advanceRestCutscene();
    }
    return;
  }

  if (chapterCompleteTransition) {
    if (event.code === CONFIRM_CODE && !event.repeat) {
      confirmChapterCompleteTransition();
    }
    return;
  }

  if (sceneFade) {
    return;
  }

  if (transformCutscene) {
    if (event.code === CONFIRM_CODE && !event.repeat) {
      advanceTransformCutscene();
    }
    return;
  }

  if (chapter5EventCutin) {
    return;
  }

  if (chapter5RuleDocument) {
    handleChapter5RuleDocumentKey(event);
    return;
  }

  if (battleTutorialState?.active) {
    handleBattleTutorialKey(event);
    return;
  }

  if (streamState?.active) {
    handleLivestreamKey(event);
    return;
  }

  if (chapter4StoryImage && !dialogueState) {
    if (event.code === CONFIRM_CODE && !event.repeat) {
      advanceChapter4StoryCaption();
    }
    return;
  }

  if (hasBattleHelpNoticeAwaitingConfirm()) {
    if (event.code === CONFIRM_CODE && !event.repeat) {
      confirmBattleHelpNotices();
    }
    return;
  }

  if (dialogueState?.choice) {
    handleDialogueChoiceKey(event);
    return;
  }

  if (menuOpen) {
    handleGameMenuKey(event);
    return;
  }

  if (event.code === CANCEL_CODE && !event.repeat) {
    toggleGameMenu();
    return;
  }

  keys.add(key);
  if (event.code === CONFIRM_CODE && !event.repeat) {
    if (battleState?.active) {
      advanceBattleBySpace();
    } else {
      interact();
    }
  }
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

window.addEventListener("pointerdown", unlockAudioByUserGesture, { passive: true });

function loadMasterVolume() {
  try {
    const raw = localStorage.getItem(MASTER_VOLUME_KEY);
    if (raw === null) return DEFAULT_MASTER_VOLUME;
    const stored = Number(raw);
    return Number.isFinite(stored) ? clamp(stored, 0, 1) : DEFAULT_MASTER_VOLUME;
  } catch (error) {
    return DEFAULT_MASTER_VOLUME;
  }
}

function initializeDebugModeUi() {
  if (!testPanelEl) return;
  testPanelEl.hidden = !DEBUG_MODE_ENABLED;
  testPanelEl.setAttribute("aria-hidden", DEBUG_MODE_ENABLED ? "false" : "true");
  testPanelEl.classList.toggle("is-enabled", DEBUG_MODE_ENABLED);
}

function initializeMasterVolumeControl() {
  if (!masterVolumeSliderEl) return;
  updateMasterVolumeUi();
  updateMasterVolumeVisibility();
  masterVolumeSliderEl.addEventListener("pointerdown", unlockAudioByUserGesture, { passive: true });
  masterVolumeSliderEl.addEventListener("input", () => {
    setMasterVolume(Number(masterVolumeSliderEl.value) / 100);
  });
}

function setMasterVolume(value) {
  masterVolume = clamp(Number.isFinite(value) ? value : 1, 0, 1);
  try {
    localStorage.setItem(MASTER_VOLUME_KEY, String(masterVolume));
  } catch (error) {
    // Volume is a convenience setting; keep playing even if storage is unavailable.
  }
  updateMasterVolumeUi();
  applyMasterVolumeToActiveAudio();
}

function updateMasterVolumeUi() {
  const percent = Math.round(masterVolume * 100);
  if (masterVolumeSliderEl) masterVolumeSliderEl.value = String(percent);
  if (masterVolumeValueEl) masterVolumeValueEl.textContent = `${percent}%`;
}

function isStoryImageVisible() {
  const transformStoryPhases = new Set([
    "story-black-fade-in",
    "story-image-fade-in",
    "story-hold",
    "story-fade-out",
  ]);
  const transformStoryVisible = transformCutscene && transformStoryPhases.has(transformCutscene.phase);
  const endingMediaVisible = endingState && endingMediaEl && !endingMediaEl.classList.contains("hidden");
  return Boolean(chapter4StoryImage || chapter5EventCutin || transformStoryVisible || endingMediaVisible);
}

function isExplorationModeForVolumeControl() {
  if (appMode !== APP_MODE.PLAYING) return false;
  return !(
    battleState?.active
    || battleTutorialState?.active
    || streamState?.active
    || menuOpen
    || dialogueState
    || endingState
    || openingCutscene
    || restCutscene
    || chapterCompleteTransition
    || sceneFade
    || transformCutscene
    || chapter4StoryImage
    || chapter5EventCutin
    || chapter5RuleDocument
    || xiaoDeparture
    || smokerDeparture
    || fatDumbDeparture
    || kidneyDeparture
    || kinkoExDeparture
    || chapter4CutsceneMove
    || chapter4AlarmFlash
    || chapter4KinkoHitSequence
    || isStoryImageVisible()
  );
}

function updateMasterVolumeVisibility() {
  if (!masterVolumeControlEl) return;
  masterVolumeControlEl.classList.toggle("is-hidden", !isExplorationModeForVolumeControl());
}

function applyMasterVolumeToActiveAudio() {
  if (activeBgm?.audio) {
    const volume = getBgmVolume(activeBgm.key);
    activeBgm.targetVolume = volume;
    activeBgm.volumeFrom = volume;
    activeBgm.volumeTimer = BGM_FADE_TIME;
    activeBgm.audio.volume = volume;
  }
  uniqueSoundCache.forEach((audio) => {
    audio.volume = getMasterScaledVolume(0.88);
  });
}

function getMasterScaledVolume(volume) {
  return clamp((Number(volume) || 0) * masterVolume, 0, 1);
}

function unlockAudioByUserGesture() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  updateAudio(0.016);
}

function updateAudio(delta = 0.016) {
  if (!audioUnlocked || typeof Audio === "undefined") return;
  const nextKey = resolveBgmKey();
  const nextSource = getBgmSource(nextKey);
  if (nextSource && nextSource === activeBgm?.source) {
    activeBgm.key = nextKey;
    setActiveBgmTargetVolume(getBgmVolume(nextKey));
  } else if (nextKey !== activeBgm?.key) {
    switchBgm(nextKey);
  }
  if (syncWorldStopBgmSuspension()) return;
  updateBgmFades(delta);
}

function shouldSuspendBgmForWorldStop() {
  return Boolean(battleState?.active && battleState.worldStop);
}

function syncWorldStopBgmSuspension() {
  const shouldSuspend = shouldSuspendBgmForWorldStop();
  if (shouldSuspend === bgmSuspendedByWorldStop) {
    if (shouldSuspend) pauseBgmForWorldStop();
    return shouldSuspend;
  }
  bgmSuspendedByWorldStop = shouldSuspend;
  if (shouldSuspend) {
    pauseBgmForWorldStop();
    return true;
  }
  resumeBgmAfterWorldStop();
  return false;
}

function pauseBgmForWorldStop() {
  if (activeBgm?.audio && !activeBgm.audio.paused) activeBgm.audio.pause();
  for (let index = fadingBgms.length - 1; index >= 0; index -= 1) {
    const bgm = fadingBgms[index];
    bgm.audio.pause();
    bgm.audio.src = "";
    fadingBgms.splice(index, 1);
  }
}

function resumeBgmAfterWorldStop() {
  if (!activeBgm?.audio) return;
  const playPromise = activeBgm.audio.play();
  if (playPromise?.catch) playPromise.catch(() => {});
}

function resolveBgmKey() {
  if (appMode !== APP_MODE.PLAYING) {
    return appMode === APP_MODE.TITLE || appMode === APP_MODE.TITLE_GUIDE || appMode === APP_MODE.TITLE_MESSAGE
      ? "title_loop"
      : null;
  }
  if (endingState || chapterCompleteTransition) return "ending_loop";
  if (streamState?.active) return "live_loop";
  if (battleState?.active || battleTutorialState?.active) return createBgmVariantKey(resolveBattleBgmKey(), "battle");
  const exploreKey = resolveExploreBgmKey();
  if (shouldUseDialogueBgmVariant()) return createBgmVariantKey(exploreKey, "dialogue");
  return exploreKey;
}

function resolveExploreBgmKey() {
  if (currentMapIndex === 12 || currentMapIndex === 13) return "tower_loop";
  if (currentMapIndex === 10 || currentMapIndex === 11) return "base_loop";
  if (currentMapIndex === 7) return "hotel_loop";
  if (currentMapIndex === 9) return "xd_loop";
  return "city_loop";
}

function shouldUseDialogueBgmVariant() {
  return Boolean(dialogueState);
}

function resolveBattleBgmKey() {
  const mode = battleState?.mode || "";
  const enemyIds = (battleState?.enemies || []).map((enemy) => enemy.enemyUnitId);
  const enemyText = [
    battleState?.enemyName,
    ...(battleState?.enemies || []).map((enemy) => enemy.enemyName),
  ].filter(Boolean).join(" ");
  if (mode === "xiao" || enemyText.includes("蕭政銘")) return "boss_xiao";
  if (mode === "chapter4-base" || mode === "chapter4-rescue" || mode === "chapter4-ex") return "boss_vblack";
  if (enemyIds.some((id) => ["npc38", "npc39", "npc40", "kinko_ex"].includes(id))) return "boss_vblack";
  if (enemyIds.some((id) => ["npc9", "npc12", "npc14", "npc36", "chapter5_hisada_opponent", "chapter5_aki_opponent", "chapter5_kidney_opponent", "chapter5_smoker_opponent"].includes(id))) return "boss_kiss";
  return "battle_loop";
}

function switchBgm(key) {
  if (activeBgm?.audio) {
    fadingBgms.push({ audio: activeBgm.audio, timer: 0, fromVolume: activeBgm.audio.volume || 0 });
  }
  activeBgm = null;
  const source = getBgmSource(key);
  if (!key || !source) return;
  const audio = new Audio(AUDIO_BASE_PATH + source);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0;
  activeBgm = {
    key,
    source,
    audio,
    timer: 0,
    volumeTimer: 0,
    volumeFrom: 0,
    targetVolume: getBgmVolume(key),
  };
  const playPromise = audio.play();
  if (playPromise?.catch) playPromise.catch(() => {});
}

function updateBgmFades(delta) {
  if (activeBgm?.audio) {
    activeBgm.timer = Math.min(activeBgm.timer + delta, BGM_FADE_TIME);
    activeBgm.volumeTimer = Math.min((activeBgm.volumeTimer ?? BGM_FADE_TIME) + delta, BGM_FADE_TIME);
    const t = BGM_FADE_TIME ? activeBgm.volumeTimer / BGM_FADE_TIME : 1;
    const fromVolume = activeBgm.volumeFrom ?? 0;
    activeBgm.audio.volume = fromVolume + (activeBgm.targetVolume - fromVolume) * easeOutCubic(t);
  }
  for (let index = fadingBgms.length - 1; index >= 0; index -= 1) {
    const bgm = fadingBgms[index];
    bgm.timer += delta;
    const t = BGM_FADE_TIME ? clamp(bgm.timer / BGM_FADE_TIME, 0, 1) : 1;
    bgm.audio.volume = bgm.fromVolume * (1 - easeOutCubic(t));
    if (t >= 1) {
      bgm.audio.pause();
      bgm.audio.src = "";
      fadingBgms.splice(index, 1);
    }
  }
}

function getBgmVolume(key) {
  const { baseKey, variant } = parseBgmKey(key);
  const baseVolume = BGM_VOLUME_BY_KEY[baseKey] ?? BGM_DEFAULT_VOLUME;
  return getMasterScaledVolume(baseVolume * (BGM_VARIANT_VOLUME_MULTIPLIERS[variant] ?? 1));
}

function getBgmSource(key) {
  const { baseKey } = parseBgmKey(key);
  return baseKey ? BGM_SOURCES[baseKey] : null;
}

function setActiveBgmTargetVolume(nextVolume) {
  if (!activeBgm?.audio || Math.abs(activeBgm.targetVolume - nextVolume) < 0.001) return;
  activeBgm.volumeFrom = activeBgm.audio.volume || 0;
  activeBgm.volumeTimer = 0;
  activeBgm.targetVolume = nextVolume;
}

function createBgmVariantKey(key, variant) {
  return key && variant ? `${key}${BGM_VARIANT_SEPARATOR}${variant}` : key;
}

function parseBgmKey(key) {
  if (!key) return { baseKey: null, variant: null };
  const [baseKey, variant = null] = String(key).split(BGM_VARIANT_SEPARATOR);
  return { baseKey, variant };
}

function playSfx(key, options = {}) {
  if (!audioUnlocked || typeof Audio === "undefined") return;
  const source = SFX_SOURCES[key];
  if (!source) return;
  try {
    let base = sfxAudioCache.get(source);
    if (!base) {
      base = new Audio(AUDIO_BASE_PATH + source);
      base.preload = "auto";
      sfxAudioCache.set(source, base);
    }
    const audio = base.cloneNode();
    audio.volume = getMasterScaledVolume(options.volume ?? SFX_DEFAULT_VOLUME);
    const playPromise = audio.play();
    if (playPromise?.catch) playPromise.catch(() => {});
  } catch (error) {
    // Audio is optional; ignore browsers that block unsupported formats or playback.
  }
}

function loop(now) {
  const delta = Math.min((now - lastTime) / 1000, 0.033);
  lastTime = now;
  update(delta, now / 1000);
  updateAudio(delta);
  updateBattleAutoToggleUi();
  updateBattleSpeedToggleUi();
  updateMasterVolumeVisibility();
  render();
  requestAnimationFrame(loop);
}

function drawBootIntroInstructions() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 42px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText("親親世界", canvas.width / 2, 142);
  ctx.font = "24px 'Segoe UI', 'Noto Sans TC', sans-serif";
  [
    "操作說明",
    "方向鍵 / WASD：移動角色或切換選項",
    "Z：確認 / 對話 / 互動 / 戰鬥轉盤停止",
    "X：取消 / 返回 / 開啟選單",
  ].forEach((line, index) => {
    ctx.fillStyle = index === 0 ? "#ffe16f" : "#eaf7ff";
    ctx.fillText(line, canvas.width / 2, 250 + index * 48);
  });
  ctx.restore();
}

function startGameLoop() {
  if (gameLoopStarted) return;
  gameLoopStarted = true;
  lastTime = performance.now();
  requestAnimationFrame(loop);
}

function loadGameAssetsWithProgress() {
  const entries = Object.entries(assets);
  const startedAt = performance.now();
  let loaded = 0;
  updateLoadingProgress(0, entries.length, "載入素材");
  return Promise.all(entries.map(([key, image]) =>
    waitForImage(image).then((ok) => {
      loaded += 1;
      const seconds = ((performance.now() - startedAt) / 1000).toFixed(1);
      updateLoadingProgress(loaded, entries.length, `${ok ? "已載入" : "略過"}：${key} / ${seconds}s`);
      return ok;
    })
  ));
}

function createBootAssetLoader() {
  return async function bootAssetLoader() {
    const entries = Object.entries(assets);
    const spriteKeys = CHARACTER_SPRITE_KEYS;
    const total = entries.length + spriteKeys.length + 1;
    const startedAt = performance.now();
    let loaded = 0;

    const update = (stage) => {
      const seconds = ((performance.now() - startedAt) / 1000).toFixed(1);
      updateLoadingProgress(loaded, total, `${stage} / ${seconds}s`);
    };

    update("載入圖片素材");
    await Promise.all(entries.map(([key, image]) =>
      waitForImage(image).then((ok) => {
        loaded += 1;
        update(`${ok ? "已載入" : "略過"}：${key}`);
        return ok;
      })
    ));

    update("準備主頁影片");
    await waitForVideoReady(titleVideo);
    loaded += 1;
    update("主頁影片已可播放");
    await nextAnimationFrame();

    for (const key of spriteKeys) {
      prepareCharacterSpriteAssets([key]);
      loaded += 1;
      update(`處理角色去背：${key}`);
      await nextAnimationFrame();
    }

    updateLoadingProgress(total, total, "素材準備完成");
  };
}

function updateLoadingProgress(loaded, total, stage) {
  const ratio = total > 0 ? loaded / total : 0;
  if (loadingProgressTextEl) {
    loadingProgressTextEl.textContent = `${loaded}/${total} (${Math.round(ratio * 100)}%)`;
  }
  if (loadingProgressFillEl) {
    loadingProgressFillEl.style.width = `${Math.round(ratio * 100)}%`;
  }
  if (loadingStageTextEl) {
    loadingStageTextEl.textContent = stage || "";
  }
}

function reportRuntimeError(error) {
  console.error("KissWorld runtime error:", error);
  if (runtimeErrorNoticeShown) return;
  runtimeErrorNoticeShown = true;
  const message = "系統提示：偵測到錯誤，已記錄在瀏覽器 console。";
  if (loadingScreenEl && loadingScreenEl.dataset.hidden !== "true") {
    updateLoadingProgress(1, 1, message);
    return;
  }
  addBattleHelpNotice(message, { waitForConfirm: true });
}

function hideLoadingScreen() {
  if (!loadingScreenEl) return;
  if (loadingScreenEl.dataset.hidden === "true") return;
  loadingScreenEl.dataset.hidden = "true";
  loadingScreenEl.classList.add("is-fading");
  window.setTimeout(() => {
    loadingScreenEl.classList.add("is-hidden");
    loadingScreenEl.style.display = "none";
  }, 650);
}

function handleTitleKey(event) {
  if (event.repeat) return;
  const code = event.code;

  if (appMode === APP_MODE.INTRO) {
    if (code === CONFIRM_CODE) {
      playSfx("ui_confirm");
      if (introPage === 0) {
        introPage = 1;
        introPageStartedAt = performance.now();
      } else if (introPage === 1) {
        introPage = 2;
        introPageStartedAt = performance.now();
      } else {
        openTitleMenu();
      }
    }
    return;
  }

  if (appMode === APP_MODE.TITLE) {
    const titleItems = getVisibleTitleMenuItems();
    if (code === "ArrowUp") {
      playSfx("ui_cursor");
      titleMenuIndex = wrapIndex(titleMenuIndex - 1, titleItems.length);
    }
    if (code === "ArrowDown") {
      playSfx("ui_cursor");
      titleMenuIndex = wrapIndex(titleMenuIndex + 1, titleItems.length);
    }
    if (code === CONFIRM_CODE) {
      playSfx("ui_confirm");
      confirmTitleMenuItem();
    }
    return;
  }

  if (appMode === APP_MODE.TITLE_GUIDE) {
    if (code === CONFIRM_CODE || code === CANCEL_CODE) {
      playSfx(code === CANCEL_CODE ? "ui_cancel" : "ui_confirm");
      appMode = APP_MODE.TITLE;
    }
    return;
  }

  if (appMode === APP_MODE.TITLE_MESSAGE) {
    if (code === CANCEL_CODE) {
      playSfx("ui_cancel");
      titleMessage = null;
      appMode = APP_MODE.TITLE;
      return;
    }
  if (code === CONFIRM_CODE) {
    playSfx("ui_confirm");
    if (titleMessage?.url) {
      window.location.href = titleMessage.url;
    } else if (titleMessage?.confirmRestart) {
      deleteSaveGame();
      titleMessage = null;
      titleVideo.pause();
      startNewGameOpening();
    } else {
      titleMessage = null;
      appMode = APP_MODE.TITLE;
      }
    }
  }
}

function openTitleMenu() {
  appMode = APP_MODE.TITLE;
  titleMenuIndex = clampMenuIndex(titleMenuIndex, getVisibleTitleMenuItems().length);
  titleVideo.currentTime = 0;
  titleVideo.play().catch(() => {});
}

function confirmTitleMenuItem() {
  const item = getVisibleTitleMenuItems()[titleMenuIndex];
  if (!item) return;
  if (item.id === "continue") {
    titleVideo.pause();
    continueSavedGame();
    return;
  }
  if (item.id === "start") {
    if (hasSaveGame()) {
      titleMessage = {
        text: "已有存檔。確定要重新開始遊戲嗎？目前存檔將會刪除。",
        confirmRestart: true,
      };
      appMode = APP_MODE.TITLE_MESSAGE;
      return;
    }
    titleVideo.pause();
    startNewGameOpening();
    return;
  }
  if (item.id === "guide") {
    appMode = APP_MODE.TITLE_GUIDE;
    return;
  }
  if (item.id === "setting") {
    titleMessage = {
      lines: [
        "不好意思，沒有東西可以設定喔",
        "音效、BGM、音量等項目接上素材後會放在這裡。",
      ],
    };
    appMode = APP_MODE.TITLE_MESSAGE;
    return;
  }
  if (item.id === "leave") {
    titleMessage = { text: "確定要離開親親世界，進入發發世界嗎?", url: LEAVE_URL };
    appMode = APP_MODE.TITLE_MESSAGE;
  }
}

function getVisibleTitleMenuItems() {
  return TITLE_MENU_ITEMS.filter((item) => !item.requiresSave || hasSaveGame());
}

function hasSaveGame() {
  try {
    return Boolean(localStorage.getItem(SAVE_KEY));
  } catch {
    return false;
  }
}

function deleteSaveGame() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (error) {
    console.warn("Delete save failed", error);
  }
}

function continueSavedGame() {
  appMode = APP_MODE.PLAYING;
  keys.clear();
  hideDialogue();
  menuOpen = false;
  endingState = null;
  battleState = null;
  battleTutorialState = null;
  openingCutscene = null;
  restCutscene = null;
  chapterCompleteTransition = null;
  sceneFade = null;
  transformCutscene = null;
  streamState = null;
  dialogueState = null;
  gameMenuEl.classList.add("hidden");
  saveEnabled = true;
  loadGame();
}

function startNewGameOpening() {
  resetGameStateForNewGame();
  appMode = APP_MODE.PLAYING;
  keys.clear();
  hideDialogue();
  menuOpen = false;
  endingState = null;
  battleState = null;
  restCutscene = null;
  sceneFade = null;
  transformCutscene = null;
  questNpcDefeated = false;
  player.x = 280;
  player.y = 644;
  player.direction = "down";
  player.walkTime = 0;
  seedTrail(player);
  updateCamera();
  openingCutscene = {
    phase: "story",
    timer: 0,
    lineIndex: 0,
    bubbleShown: false,
  };
}

function resetGameStateForNewGame() {
  questState = "inactive";
  questUnlocked = false;
  questNpcDefeated = false;
  chapter2State = createDefaultChapter2State();
  chapter3State = createDefaultChapter3State();
  chapter4State = createDefaultChapter4State();
  chapter5State = createDefaultChapter5State();
  applyChapter4HeroForm();
  xiaoDeparture = null;
  smokerDeparture = null;
  fatDumbDeparture = null;
  kidneyDeparture = null;
  kinkoExDeparture = null;
  chapter4CutsceneMove = null;
  chapter4AlarmFlash = null;
  chapter4KinkoHitSequence = null;
  chapter4ImpactSlashes.length = 0;
  cameraFocusActor = null;
  transformCutscene = null;
  chapter4StoryImage = null;
  chapter5EventCutin = null;
  chapter5RuleDocument = null;
  collected = 0;
  currentMapIndex = 0;
  shellFee = 0;
  ownedShopItemCounts = {};
  ownedItems = {};
  currentDay = 1;
  saveEnabled = false;
  titleMessage = null;
  dialogueState = null;
  battleState = null;
  battleTutorialState = null;
  endingState = null;
  openingCutscene = null;
  restCutscene = null;
  chapterCompleteTransition = null;
  sceneFade = null;
  transformCutscene = null;
  streamState = null;
  battleTutorialSeen = false;
  menuOpen = false;
  menuScreen = "main";
  mainMenuIndex = 0;
  characterMenuIndex = 0;
  selectedCharacterId = "hero";
  characterEquipSlotIndex = 0;
  characterEquipOptionIndex = 0;
  characterEquipListOpen = false;
  equipmentMenuIndex = 0;
  bagTabIndex = 0;
  bagListActive = false;
  shopMenuIndex = 0;
  activeShopId = null;
  honorTitleIndex = 0;
  unlockedTitles = createDefaultTitleUnlocks();
  staleDumplingState = createDefaultStaleDumplingState();
  battleHelpState = createDefaultBattleHelpState();
  battleAutoEnabled = false;
  battleAutoTimer = 0;
  battleSpeedEnabled = false;
  teamSlotIndex = 0;
  teamCandidateIndex = 0;
  teamCandidateMode = false;
  dumplingRecovery = null;
  worldFloatingTexts.length = 0;
  shellFeeNotices.length = 0;
  titleUnlockNotices.length = 0;
  battleHelpNotices.length = 0;
  pendingBattleHelpNoticeCompletion = null;
  sparkles.length = 0;
  chapter4TeleportEffects.length = 0;

  teamSlots.splice(0, teamSlots.length, "hero", null, null, null);
  MENU_CHARACTER_IDS.forEach((actorId) => {
    characterProgress[actorId] = createDefaultCharacterProgress();
    characterEquipment[actorId] = { ...DEFAULT_EQUIPMENT_BY_SLOT };
  });

  const actorResets = {
    hero: { x: 280, y: 644, direction: "down", mapId: 0 },
    npc1: { x: 720, y: 638, direction: "down", mapId: 0 },
    npc2: { x: 1280, y: 636, direction: "left", mapId: 0 },
    npc3: { x: 1840, y: 642, direction: "right", mapId: 0 },
    npc4: { x: 2230, y: 642, direction: "down", mapId: 0 },
  };

  EXTRA_CHARACTER_NUMBERS.forEach((number, index) => {
    const special = SPECIAL_EXTRA_CHARACTER_DETAILS[number] || {};
    actorResets[`npc${number}`] = {
      x: special.x ?? 220 + (index % 7) * 330,
      y: special.y ?? 600 + Math.floor(index / 7) * 30,
      direction: special.direction || (index % 2 ? "left" : "right"),
      mapId: special.mapId ?? 99,
    };
  });

  actorResets.hotel_otaku = { x: 2060, y: 638, direction: "left", mapId: 7 };
  actorResets.chapter5_otaku_opponent = { x: 0, y: 0, direction: "left", mapId: 99 };
  actorResets.chapter5_hisada_opponent = { x: 0, y: 0, direction: "left", mapId: 99 };
  actorResets.chapter5_aki_opponent = { x: 0, y: 0, direction: "left", mapId: 99 };
  actorResets.chapter5_kidney_opponent = { x: 0, y: 0, direction: "left", mapId: 99 };
  actorResets.chapter5_smoker_opponent = { x: 0, y: 0, direction: "left", mapId: 99 };
  actorResets.kinko_ex = { ...CHAPTER4_EX_POSITION, mapId: 99 };
  actorResets.chapter4_hero_proxy = { x: 0, y: 0, direction: "right", mapId: 99 };
  if (isChapter2Started()) {
    actorResets.npc4 = { ...XIAO_XD_POSITION, mapId: 9 };
  }
  chapter2MobNpcs.forEach((mob) => {
    actorResets[mob.id] = { x: mob.homeX, y: mob.homeY, direction: mob.homeDirection, mapId: isChapter2Started() ? 1 : 99 };
  });

  [player, ...npcs].forEach((actor) => {
    const reset = actorResets[actor.id] || { x: 0, y: 0, direction: "down", mapId: 99 };
    actor.x = reset.x;
    actor.y = reset.y;
    actor.direction = reset.direction;
    actor.idleDirection = reset.direction;
    actor.mapId = reset.mapId;
    actor.walkTime = 0;
    actor.followIndex = 0;
    actor.following = false;
    actor.recruitRetry = false;
    actor.hidden = false;
    actor.layingDown = Boolean(actor.kidneySleeper);
    actor.patrolState = Math.random() < 0.35 ? "pause" : "walk";
    actor.patrolTimer = 0.35 + Math.random() * 1.8;
    actor.patrolOffset = Math.random();
    actor.patrolHeading = Math.random() < 0.5 ? -1 : 1;
    actor.patrolRise = (Math.random() * 2 - 1) * 0.45;
    seedTrail(actor);
  });

  questNpc.staticNpc = true;
  questNpc.fixedPlacement = true;
  questNpc.idleDirection = isChapter2Started() ? XIAO_XD_POSITION.direction : "down";
  hotelOtakuNpc.staticNpc = true;
  hotelOtakuNpc.fixedPlacement = true;
  kinkoExNpc.staticNpc = true;
  kinkoExNpc.fixedPlacement = true;
  kinkoExNpc.idleDirection = CHAPTER4_EX_POSITION.direction;

  keys.clear();
  gameMenuEl.classList.add("hidden");
  hideDialogue();
  updateCamera();
}

function startTestChapter(chapterKey) {
  const key = String(chapterKey);
  const isChapterFourPartTwo = key === "4-2";
  const isChapterFourPartThree = key === "4-3";
  const chapterNumber = Number(key);
  if (!isChapterFourPartTwo && !isChapterFourPartThree && (!Number.isInteger(chapterNumber) || chapterNumber < 1 || chapterNumber > 5)) return;
  deleteSaveGame();
  resetGameStateForNewGame();
  appMode = APP_MODE.PLAYING;
  saveEnabled = true;
  titleVideo.pause();
  hideDialogue();
  hideEndingMedia();
  hideEndingPrompt();
  closeGameMenu();
  battleUiEl.classList.add("hidden");
  sceneFade = null;
  keys.clear();

  if (chapterNumber === 1) setupTestChapterOne();
  if (chapterNumber === 2) setupTestChapterTwo();
  if (chapterNumber === 3) setupTestChapterThree();
  if (chapterNumber === 4) setupTestChapterFour();
  if (chapterNumber === 5) setupTestChapterFive();
  if (isChapterFourPartTwo) setupTestChapterFourPartTwo();
  if (isChapterFourPartThree) setupTestChapterFourPartThree();

  restoreChapter2WorldState();
  healAllCharactersToFull();
  syncFollowIndexesFromTeamSlots();
  seedTrail(player);
  getVisibleNpcs().forEach(seedTrail);
  snapCameraToPlayer();
  const label = isChapterFourPartThree ? "第四章之三" : isChapterFourPartTwo ? "第四章之二" : `第${chapterNumber}章起點`;
  addWorldFloatingText(player.x, player.y - 92, `測試：${label}`, "#ffe16f", { life: 2.2, riseSpeed: 16 });
  saveGame();
  if (isChapterFourPartThree) startChapter4XiaoRescueDialogue();
}

function grantTestShellFee() {
  addShellFee(1000, { color: "#8ff5ff" });
  saveGame();
}

function setupTestChapterOne() {
  setTestPlayerPosition(0, 280, 644, "down");
  questState = "inactive";
  questUnlocked = false;
  chapter2State = createDefaultChapter2State();
  chapter3State = createDefaultChapter3State();
  chapter4State = createDefaultChapter4State();
  teamSlots.splice(0, teamSlots.length, "hero", null, null, null);
  vtNpcs.forEach((npc, index) => {
    const starts = [
      { x: 720, y: 638, direction: "down" },
      { x: 1280, y: 636, direction: "left" },
      { x: 1840, y: 642, direction: "right" },
    ];
    placeStaticActor(npc, 0, starts[index], { layingDown: false });
  });
  placeStaticActor(questNpc, 0, { x: 2230, y: 642, direction: "down" }, { layingDown: false });
}

function setupTestChapterTwo() {
  setTestPlayerPosition(8, 850, 638, "right");
  questState = "completed";
  questUnlocked = true;
  collected = vtNpcs.length;
  chapter2State = {
    ...createDefaultChapter2State(),
    phase: "go_xd",
    xiaoDeparted: true,
  };
  chapter3State = createDefaultChapter3State();
  chapter4State = createDefaultChapter4State();
  setTestPartyFollowers(["npc1", "npc2", "npc3"], "right");
  placeXiaoAtXdOffice();
}

function setupTestChapterThree() {
  setTestPlayerPosition(9, FLOOR_MAT_POINTS[0].x - 80, 638, "right");
  questState = "completed";
  questUnlocked = true;
  collected = vtNpcs.length;
  chapter2State = createCompletedChapter2State();
  chapter3State = {
    ...createDefaultChapter3State(),
    phase: "need_rest",
  };
  chapter4State = createDefaultChapter4State();
  CHAPTER2_REQUIRED_EQUIPMENT.forEach((id) => {
    ownedShopItemCounts[id] = 1;
  });
  setTestPartyFollowers(["npc1", "npc2", "npc3"], "right");
  placeXiaoAtXdOffice();
}

function setupTestChapterFour() {
  setTestPlayerPosition(7, 1780, 638, "right");
  questState = "completed";
  questUnlocked = true;
  collected = vtNpcs.length;
  chapter2State = createCompletedChapter2State();
  chapter3State = createCompletedChapter3State();
  chapter4State = {
    ...createDefaultChapter4State(),
    phase: "need_rest",
    startedDay: currentDay,
  };
  CHAPTER2_REQUIRED_EQUIPMENT.forEach((id) => {
    ownedShopItemCounts[id] = 1;
  });
  ownedItems.bebe_flute = 1;
  setTestPartyFollowers(["npc1", "npc2", "npc3"], "right");
  placeXiaoAtXdOffice();
}

function setupTestChapterFourPartTwo() {
  setTestPlayerPosition(7, 1760, 638, "left");
  questState = "completed";
  questUnlocked = true;
  collected = vtNpcs.length;
  chapter2State = createCompletedChapter2State();
  chapter3State = createCompletedChapter3State();
  chapter4State = {
    ...createDefaultChapter4State(),
    phase: "need_c22",
    startedDay: currentDay,
    targetReachedDay: currentDay,
    sawDoorEx: true,
    exDefeated: true,
    kinkoLeft: true,
    postKinkoStreamDone: true,
    postKinkoStreamCount: 2,
    rescueBriefed: true,
  };
  CHAPTER2_REQUIRED_EQUIPMENT.forEach((id) => {
    ownedShopItemCounts[id] = 1;
  });
  ownedItems.bebe_flute = 1;
  ownedItems.c22_pill = 0;
  teamSlots.splice(0, teamSlots.length, "hero", "npc1", "npc2", null);
  hideChapter4Kinko();
  ["npc1", "npc2"].forEach((actorId, index) => {
    const actor = getCharacterById(actorId);
    if (!actor) return;
    actor.following = true;
    actor.staticNpc = false;
    actor.fixedPlacement = false;
    actor.layingDown = false;
    actor.mapId = currentMapIndex;
    actor.x = clamp(player.x - 48 - index * 38, getCurrentRoad().left + 18, getCurrentRoad().right - 18);
    actor.y = clamp(player.y + 26 + index * 26, getCurrentRoad().top + 18, getCurrentRoad().bottom - 18);
    actor.direction = "left";
    actor.idleDirection = "left";
    seedTrail(actor);
  });
  hotelOtakuNpc.following = false;
  hotelOtakuNpc.staticNpc = true;
  hotelOtakuNpc.fixedPlacement = true;
  hotelOtakuNpc.mapId = 7;
  hotelOtakuNpc.x = 2060;
  hotelOtakuNpc.y = 638;
  hotelOtakuNpc.direction = "left";
  hotelOtakuNpc.idleDirection = "left";
  seedTrail(hotelOtakuNpc);
  kinkoExNpc.mapId = 99;
  placeXiaoAtXdOffice();
  hideChapter4BaseEnemies();
  syncFollowIndexesFromTeamSlots();
}

function setupTestChapterFourPartThree() {
  questState = "completed";
  questUnlocked = true;
  collected = vtNpcs.length;
  chapter2State = createCompletedChapter2State();
  chapter3State = createCompletedChapter3State();
  chapter4State = {
    ...createDefaultChapter4State(),
    phase: "rescue_flashback",
    startedDay: currentDay,
    targetReachedDay: currentDay,
    sawDoorEx: true,
    exDefeated: true,
    kinkoLeft: true,
    postKinkoStreamDone: true,
    postKinkoStreamCount: 2,
    rescueBriefed: true,
    c22Bought: true,
    transformed: false,
    baseEntryWarned: true,
    baseEncounterDone: true,
    captiveSleepCount: CHAPTER4_CELL_REST_LIMIT,
    captiveWakeSeen: true,
    rescueFlashbackStarted: true,
    rescueSearchStarted: false,
  };
  CHAPTER2_REQUIRED_EQUIPMENT.forEach((id) => {
    ownedShopItemCounts[id] = 1;
  });
  ownedItems.bebe_flute = 1;
  ownedItems.c22_pill = 1;
  teamSlots.splice(0, teamSlots.length, "npc4", null, null, null);
  prepareChapter4XiaoRescueScene();
}

function setupTestChapterFive() {
  questState = "completed";
  questUnlocked = true;
  collected = vtNpcs.length;
  chapter2State = createCompletedChapter2State();
  chapter3State = createCompletedChapter3State();
  chapter4State = {
    ...createDefaultChapter4State(),
    phase: "completed",
    startedDay: currentDay,
    targetReachedDay: currentDay,
    sawDoorEx: true,
    exDefeated: true,
    kinkoLeft: true,
    postKinkoStreamDone: true,
    postKinkoStreamCount: 2,
    rescueBriefed: true,
    c22Bought: true,
    c22Explained: true,
    transformed: false,
    baseEntryWarned: true,
    baseEncounterDone: true,
    captiveSleepCount: CHAPTER4_CELL_REST_LIMIT,
    captiveDoorTalks: 2,
    captiveWakeSeen: true,
    rescueFlashbackStarted: true,
    rescueSearchStarted: true,
    rescuePartyJoined: true,
    rescueEncounterStarted: true,
    rescueBattleWon: true,
    rescueCellEntered: true,
    rescueCellChecked: ["hero", "npc1", "npc2", "npc3", "hotel_otaku"],
    rescueCellFinaleDone: true,
    rescueFinaleDone: true,
  };
  chapter5State = {
    ...createDefaultChapter5State(),
    phase: "await_exit",
    introDone: false,
    tournamentRound: 0,
    tournamentRosterUnlocked: false,
    tournamentFailureHintShown: false,
    completed: false,
  };
  CHAPTER2_REQUIRED_EQUIPMENT.forEach((id) => {
    ownedShopItemCounts[id] = Math.max(1, Number(ownedShopItemCounts[id]) || 0);
  });
  ownedItems.bebe_flute = Math.max(1, Number(ownedItems.bebe_flute) || 0);
  ownedItems.c22_pill = Math.max(0, Number(ownedItems.c22_pill) || 0);
  setChapter4Transformed(false);
  prepareChapter5XdReturnScene();
}

function createCompletedChapter2State() {
  return {
    ...createDefaultChapter2State(),
    phase: "completed",
    xiaoDeparted: true,
    reviewDone: true,
    exitReminderShown: true,
    equipment: Object.fromEntries(CHAPTER2_REQUIRED_EQUIPMENT.map((id) => [id, true])),
    roomUnlocked: true,
    smokersCleared: true,
    floorMatIntroShown: true,
    completed: true,
  };
}

function createCompletedChapter3State() {
  return {
    ...createDefaultChapter3State(),
    phase: "completed",
    sleptAfterChapter2: true,
    xiaoBriefed: true,
    pigFound: true,
    bebeFound: true,
    kinkoFound: true,
    fluteBought: true,
    fluteUsed: true,
    fatLunchResolved: true,
    streamIntroDone: true,
    streamTutorialDone: true,
    streamCompleted: true,
    lastLivestreamDay: Math.max(0, currentDay - 1),
    completed: true,
  };
}

function setTestPartyFollowers(actorIds, direction = "right") {
  teamSlots.splice(0, teamSlots.length, "hero", ...actorIds.slice(0, 3));
  actorIds.forEach((actorId, index) => {
    const actor = getCharacterById(actorId);
    if (!actor) return;
    actor.following = true;
    actor.staticNpc = false;
    actor.fixedPlacement = false;
    actor.layingDown = false;
    actor.mapId = currentMapIndex;
    actor.x = clamp(player.x - 44 - index * 34, getCurrentRoad().left + 18, getCurrentRoad().right - 18);
    actor.y = clamp(player.y + 24 + index * 26, getCurrentRoad().top + 18, getCurrentRoad().bottom - 18);
    actor.direction = direction;
    actor.idleDirection = direction;
    actor.followIndex = index + 1;
    seedTrail(actor);
  });
  syncFollowIndexesFromTeamSlots();
}

function setTestPlayerPosition(mapId, x, y, direction = "down") {
  currentMapIndex = clamp(mapId, 0, MAP_COUNT - 1);
  const road = getCurrentRoad();
  player.x = clamp(x, road.left, road.right);
  player.y = clamp(y, road.top, road.bottom);
  player.direction = direction;
  player.hidden = false;
  player.walkTime = 0;
  seedTrail(player);
}

function snapCameraToPlayer() {
  camera.x = clamp(player.x - canvas.width * 0.35, 0, WORLD.width - canvas.width);
  camera.y = 0;
}

function updateOpeningCutscene(delta) {
  if (!openingCutscene) return;
  openingCutscene.timer += delta;
  player.walkTime = 0;

  if (openingCutscene.phase === "story") {
    return;
  }

  if (openingCutscene.phase === "transition") {
    if (openingCutscene.timer >= OPENING_TRANSITION_TIME) {
      openingCutscene.phase = "fallen";
      openingCutscene.timer = 0;
      openingCutscene.bubbleShown = false;
    }
    return;
  }

  if (openingCutscene.phase === "fallen") {
    player.direction = "down";
    if (!openingCutscene.bubbleShown) {
      startOpeningBubble("...");
      openingCutscene.bubbleShown = true;
    }
    return;
  }

  if (openingCutscene.phase === "wake") {
    player.direction = "down";
    if (!openingCutscene.bubbleShown) {
      startOpeningBubble("這裡是哪裡");
      openingCutscene.bubbleShown = true;
    }
  }
}

function advanceOpeningCutscene() {
  if (!openingCutscene) return;
  keys.clear();

  if (openingCutscene.phase === "story") {
    if (openingCutscene.lineIndex < OPENING_CUTSCENE_LINES.length - 1) {
      openingCutscene.lineIndex += 1;
      openingCutscene.timer = 0;
      return;
    }
    openingCutscene.phase = "transition";
    openingCutscene.timer = 0;
    openingCutscene.bubbleShown = false;
    return;
  }

  if (openingCutscene.phase === "fallen") {
    hideDialogue();
    dialogueState = null;
    openingCutscene.phase = "wake";
    openingCutscene.timer = 0;
    openingCutscene.bubbleShown = false;
    return;
  }

  if (openingCutscene.phase === "wake") {
    hideDialogue();
    dialogueState = null;
    openingCutscene = null;
    saveEnabled = true;
  }
}

function startOpeningBubble(body) {
  dialogueState = {
    index: 0,
    sequence: [{ actor: player, speaker: player.label, body }],
    onComplete: null,
    anchorActor: null,
    currentActor: player,
    cutscene: true,
  };
  showDialogueEntry(dialogueState.sequence[0]);
}

function startSceneFadeIn(onComplete = null, duration = SCENE_FADE_IN_TIME) {
  sceneFade = {
    timer: 0,
    duration,
    onComplete,
  };
}

function updateSceneFade(delta) {
  if (!sceneFade) return;
  sceneFade.timer += delta;
  if (sceneFade.timer < sceneFade.duration) return;
  const onComplete = sceneFade.onComplete;
  sceneFade = null;
  if (typeof onComplete === "function") onComplete();
}

function update(delta, elapsed) {
  if (appMode !== APP_MODE.PLAYING) return;
  if (openingCutscene) {
    updateOpeningCutscene(delta);
    updateCamera();
    updateDialogueBubblePosition();
    return;
  }
  if (dumplingRecovery) {
    updateDumplingRecovery(delta);
    updateWorldFloatingTexts(delta);
    updateCamera();
    updateDialogueBubblePosition();
    return;
  }
  if (restCutscene) {
    updateRestCutscene(delta);
    updateCamera();
    return;
  }
  if (chapterCompleteTransition) {
    updateChapterCompleteTransition(delta);
    updateCamera();
    return;
  }
  if (sceneFade) {
    updateSceneFade(delta);
    updateCamera();
    updateDialogueBubblePosition();
    return;
  }
  if (transformCutscene) {
    updateTransformCutscene(delta);
    updateSparkles(delta);
    updateChapter4TeleportEffects(delta);
    updateWorldFloatingTexts(delta);
    updateCamera();
    return;
  }
  if (chapter5EventCutin) {
    updateChapter5EventCutin(delta);
    updateSparkles(delta);
    updateWorldFloatingTexts(delta);
    updateCamera();
    return;
  }
  if (chapter5RuleDocument) {
    updateCamera();
    return;
  }
  if (battleTutorialState?.active) {
    updateBattleTutorial(delta);
    updateCamera();
    return;
  }
  if (streamState?.active) {
    updateLivestream(delta);
    return;
  }
  if (battleState?.active) {
    updateBattle(delta);
    return;
  }

  updateDailyActivities(delta);
  updateXiaoDeparture(delta);
  updateSmokerDeparture(delta);
  updateFatDumbDeparture(delta);
  updateKidneyDeparture(delta);
  updateKinkoExDeparture(delta);
  updateChapter4CutsceneMove(delta);
  updateChapter4KinkoHitSequence(delta);
  if (chapter4KinkoHitSequence) {
    updateSparkles(delta);
    updateChapter4ImpactSlashes(delta);
    updateChapter4TeleportEffects(delta);
    updateWorldFloatingTexts(delta);
    updateCamera();
    return;
  }
  if (chapter4AlarmFlash) {
    updateChapter4AlarmFlash(delta);
    updateSparkles(delta);
    updateChapter4ImpactSlashes(delta);
    updateChapter4TeleportEffects(delta);
    updateCamera();
    return;
  }
  updatePlayer(delta);
  updateChapter4BaseTriggers();
  recordTrailPoint(player);
  getVisibleNpcs().forEach((npc) => updateNpc(npc, delta, elapsed));
  updateSparkles(delta);
  updateChapter4ImpactSlashes(delta);
  updateChapter4TeleportEffects(delta);
  updateWorldFloatingTexts(delta);
  updateCamera();
}

function updatePlayer(delta) {
  const playerCutsceneMoving = chapter4CutsceneMove?.actor === player
    || chapter4CutsceneMove?.moves?.some((move) => move.actor === player);
  if (playerCutsceneMoving) {
    return;
  }
  if (menuOpen || dialogueState || endingState || openingCutscene || xiaoDeparture || smokerDeparture || fatDumbDeparture || kidneyDeparture || kinkoExDeparture || chapter4CutsceneMove || chapter4AlarmFlash || chapter4KinkoHitSequence || chapter4StoryImage || chapter5EventCutin || chapter5RuleDocument) {
    player.walkTime = 0;
    return;
  }

  let moveX = 0;
  let moveY = 0;
  if (keys.has("arrowleft") || keys.has("a")) moveX -= 1;
  if (keys.has("arrowright") || keys.has("d")) moveX += 1;
  if (keys.has("arrowup") || keys.has("w")) moveY -= 1;
  if (keys.has("arrowdown") || keys.has("s")) moveY += 1;

  if (moveX || moveY) {
    const length = Math.hypot(moveX, moveY) || 1;
    moveX /= length;
    moveY /= length;
    player.x += moveX * player.speed * delta;
    player.y += moveY * player.speed * delta * 0.72;
    player.direction = axisToDirection(moveX, moveY);
    player.walkTime += delta * 7.6;
  } else {
    player.walkTime = 0;
  }

  const road = getCurrentRoad();
  player.x = clamp(player.x, road.left, road.right);
  player.y = clamp(player.y, road.top, road.bottom);
  tryChangeMap();
}

function updateNpc(npc, delta, elapsed) {
  if (xiaoDeparture && npc === questNpc) {
    recordTrailPoint(npc);
    return;
  }
  if (isSmokerDepartureActor(npc)) {
    return;
  }
  if (fatDumbDeparture && npc.id === "npc8") {
    recordTrailPoint(npc);
    return;
  }
  if (kidneyDeparture && npc.id === "npc14") {
    recordTrailPoint(npc);
    return;
  }
  if (kinkoExDeparture && npc === kinkoExNpc) {
    recordTrailPoint(npc);
    return;
  }
  if (chapter4CutsceneMove?.actor === npc || chapter4CutsceneMove?.moves?.some((move) => move.actor === npc)) {
    recordTrailPoint(npc);
    return;
  }

  if (menuOpen || endingState || openingCutscene) {
    npc.walkTime = 0;
    recordTrailPoint(npc);
    return;
  }

  if (npc.layingDown) {
    npc.walkTime = 0;
    recordTrailPoint(npc);
    return;
  }

  if (npc.staticNpc) {
    npc.walkTime = 0;
    if (dialogueState && dialogueState.anchorActor === npc) {
      npc.direction = axisToDirection(player.x - npc.x, player.y - npc.y);
    } else {
      npc.direction = npc.idleDirection || "down";
    }
    recordTrailPoint(npc);
    return;
  }

  if (dialogueState && dialogueState.anchorActor === npc) {
    npc.walkTime = 0;
    npc.direction = axisToDirection(player.x - npc.x, player.y - npc.y);
    recordTrailPoint(npc);
    return;
  }

  if (npc.following) {
    followLeaderTrail(npc, delta);
    recordTrailPoint(npc);
    return;
  }

  if (dialogueState) {
    npc.walkTime = 0;
    recordTrailPoint(npc);
    return;
  }

  npc.patrolTimer -= delta;
  if (npc.patrolTimer <= 0) {
    if (npc.patrolState === "walk") {
      npc.patrolState = "pause";
      npc.patrolTimer = 0.35 + Math.random() * 1.25 + npc.patrolOffset * 0.35;
      npc.walkTime = 0;
    } else {
      npc.patrolState = "walk";
      npc.patrolTimer = 0.75 + Math.random() * 1.65 + npc.patrolOffset * 0.45;
      npc.patrolHeading = Math.random() < 0.5 ? -1 : 1;
      npc.patrolRise = (Math.random() * 2 - 1) * 0.45;
    }
  }

  if (npc.patrolState === "walk") {
    const driftX = npc.patrolHeading;
    const driftY = npc.patrolRise;
    npc.x += driftX * npc.speed * delta * 0.56;
    npc.y += driftY * npc.speed * delta * 0.08;
    const road = getCurrentRoad();
    if (npc.x <= road.left + 4) npc.patrolHeading = 1;
    if (npc.x >= road.right - 4) npc.patrolHeading = -1;
    npc.direction = axisToDirection(npc.patrolHeading, driftY);
    npc.walkTime += delta * 6;
  } else {
    npc.walkTime = 0;
  }

  const road = getCurrentRoad();
  npc.x = clamp(npc.x, road.left, road.right);
  npc.y = clamp(npc.y, road.top, road.bottom);
  recordTrailPoint(npc);
}

function updateSparkles(delta) {
  for (let i = sparkles.length - 1; i >= 0; i -= 1) {
    const sparkle = sparkles[i];
    sparkle.life -= delta;
    sparkle.x += sparkle.vx * delta;
    sparkle.y += sparkle.vy * delta;
    sparkle.vy -= 30 * delta;
    if (sparkle.life <= 0) sparkles.splice(i, 1);
  }
}

function updateChapter4TeleportEffects(delta) {
  for (let i = chapter4TeleportEffects.length - 1; i >= 0; i -= 1) {
    const effect = chapter4TeleportEffects[i];
    effect.life += delta;
    if (effect.life >= effect.duration) chapter4TeleportEffects.splice(i, 1);
  }
}

function startChapter4KinkoBadHitSequence() {
  const { dog } = getChapter4BaseActors();
  const kinko = vtNpcs[2];
  keys.clear();
  hideDialogue();
  if (dog) dog.redAura = false;
  if (!kinko) {
    unlockPlayerTitle("ending4_trash");
    saveGame();
    startEnding("結局4 - 你...有良心嗎", { mediaKey: "ending4", retryChapter4Choice: true });
    return;
  }
  kinko.layingDown = false;
  kinko.walkTime = 0;
  kinko.storyHitTimer = 0;
  cameraFocusActor = kinko;
  chapter4KinkoHitSequence = {
    timer: 0,
    redFlash: 0.56,
    hitIndex: 0,
    hitTimes: [0.1, 0.24, 0.38, 0.53, 0.7],
    finishAt: 1.08,
  };
}

function updateChapter4KinkoHitSequence(delta) {
  if (!chapter4KinkoHitSequence) return;
  const sequence = chapter4KinkoHitSequence;
  const kinko = vtNpcs[2];
  sequence.timer += delta;
  sequence.redFlash = Math.max(0, sequence.redFlash - delta * 2.15);
  if (kinko?.storyHitTimer > 0) {
    kinko.storyHitTimer = Math.max(0, kinko.storyHitTimer - delta);
  }
  while (sequence.hitIndex < sequence.hitTimes.length && sequence.timer >= sequence.hitTimes[sequence.hitIndex]) {
    addChapter4KinkoHitBurst(kinko || player, sequence.hitIndex);
    if (kinko) kinko.storyHitTimer = 0.18;
    sequence.hitIndex += 1;
  }
  if (sequence.timer < sequence.finishAt) return;
  chapter4KinkoHitSequence = null;
  if (kinko) {
    kinko.storyHitTimer = 0;
    kinko.layingDown = true;
    kinko.walkTime = 0;
    seedTrail(kinko);
  }
  startDialogue(
    [{ actor: kinko || player, speaker: kinko?.label || "親親子", body: "啊啊" }],
    () => {
      unlockPlayerTitle("ending4_trash");
      saveGame();
      startEnding("結局4 - 你...有良心嗎", { mediaKey: "ending4", retryChapter4Choice: true });
    },
    kinko || player
  );
}

function addChapter4KinkoHitBurst(actor, index = 0) {
  if (!actor) return;
  playSfx("story_hit", { volume: 0.86 });
  const centerX = actor.x + (index % 2 ? 14 : -12);
  const centerY = actor.y - 60 + Math.sin(index * 1.7) * 18;
  const colorSet = ["#fff4d7", "#ff4d5f", "#ffb02e", "#ffffff"];
  for (let i = 0; i < 26; i += 1) {
    const angle = -Math.PI * 0.95 + Math.random() * Math.PI * 1.25;
    const speed = 70 + Math.random() * 150;
    sparkles.push({
      x: centerX + (Math.random() - 0.5) * 26,
      y: centerY + (Math.random() - 0.5) * 28,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.46 + Math.random() * 0.34,
      maxLife: 0.8,
      size: 4 + Math.random() * 5,
      color: colorSet[(i + index) % colorSet.length],
    });
  }
  for (let i = 0; i < 4; i += 1) {
    chapter4ImpactSlashes.push({
      x: centerX + (Math.random() - 0.5) * 46,
      y: centerY + (Math.random() - 0.5) * 50,
      angle: -0.72 + i * 0.36 + (Math.random() - 0.5) * 0.18,
      length: 56 + Math.random() * 44,
      width: 6 + Math.random() * 5,
      life: 0.22 + Math.random() * 0.12,
      maxLife: 0.34,
      color: i % 2 ? "#ff4b58" : "#ffe8a3",
    });
  }
}

function updateChapter4ImpactSlashes(delta) {
  for (let i = chapter4ImpactSlashes.length - 1; i >= 0; i -= 1) {
    const slash = chapter4ImpactSlashes[i];
    slash.life -= delta;
    slash.x += Math.cos(slash.angle) * 42 * delta;
    slash.y += Math.sin(slash.angle) * 20 * delta;
    if (slash.life <= 0) chapter4ImpactSlashes.splice(i, 1);
  }
}

function updateCamera() {
  const focusActor = getCameraFocusTarget();
  const targetX = clamp(focusActor.x - canvas.width * 0.35, 0, WORLD.width - canvas.width);
  camera.x += (targetX - camera.x) * 0.12;
  camera.y = 0;
}

function getCameraFocusTarget() {
  if (cameraFocusActor && !cameraFocusActor.hidden) return cameraFocusActor;
  const dialogueFocus = getDialogueCameraFocus();
  if (dialogueFocus) return dialogueFocus;
  return player;
}

function getDialogueCameraFocus() {
  if (!dialogueState || battleState?.active || streamState?.active || openingCutscene || chapter4StoryImage || chapter5EventCutin) return null;
  const actor = dialogueState.currentActor || dialogueState.anchorActor;
  if (!actor || actor === player || actor.hidden) return null;
  if (!actor.following && (actor.mapId ?? 0) !== currentMapIndex) return null;
  const minX = Math.min(player.x, actor.x);
  const maxX = Math.max(player.x, actor.x);
  const span = maxX - minX;
  dialogueCameraAnchor.x = span > canvas.width * 0.58
    ? actor.x
    : (player.x * 0.44 + actor.x * 0.56);
  dialogueCameraAnchor.y = Math.max(player.y, actor.y);
  return dialogueCameraAnchor;
}

function render() {
  if (appMode !== APP_MODE.PLAYING) {
    drawTitleScreen();
    return;
  }

  if (battleState?.active) {
    drawBattleScene();
    return;
  }

  if (streamState?.active) {
    drawLivestreamScene();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawExploreBackground();
  drawMapGateBeams();
  [...getVisibleNpcs(), player].sort((a, b) => a.y - b.y).forEach(drawExploreActor);
  drawShopPoints();
  drawHotelRoomPoints();
  drawFloorMatPoints();
  drawTeleportPoints();
  drawChapter4BaseWhisperBubble();
  sparkles.forEach(drawSparkle);
  drawChapter4ImpactSlashes();
  drawChapter4TeleportEffects();
  if (chapter4StoryImage) {
    drawChapter4StoryImageOverlay();
    updateDialogueBubblePosition();
    return;
  }
  if (transformCutscene) {
    drawTransformCutsceneEffect();
    drawWorldFloatingTexts();
    return;
  }
  if (chapter5EventCutin) {
    drawWorldFloatingTexts();
    drawChapter5EventCutin();
    return;
  }
  drawWorldFloatingTexts();
  drawQuestStatus();
  drawDailyActivityCountdowns();
  if (!openingCutscene && !endingState) drawDayCounter();
  drawShellFeeNotices();
  drawBattleHelpNotices();
  if (battleTutorialState?.active) drawBattleTutorialOverlay();
  if (endingState) drawEndingOverlay();
  if (openingCutscene) drawOpeningCutsceneOverlay();
  if (restCutscene) drawRestCutsceneOverlay();
  if (chapterCompleteTransition) drawChapterCompleteOverlay();
  if (sceneFade) drawSceneFadeOverlay();
  if (chapter5RuleDocument) drawChapter5RuleDocument();
  if (chapter4AlarmFlash) drawChapter4AlarmFlash();
  if (chapter4KinkoHitSequence) drawChapter4KinkoHitOverlay();
  if (canShowTitleUnlockNotices()) drawTitleUnlockNotices();
  updateDialogueBubblePosition();
}

function drawExploreBackground() {
  const image = assets[MAPS[currentMapIndex]?.asset] || assets.background;
  if (!isRenderableImage(image)) {
    ctx.fillStyle = "#1b1e2f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return;
  }
  const crop = MAP_BACKGROUND_CROPS[currentMapIndex];
  if (crop) {
    ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, -camera.x, 0, WORLD.width, canvas.height);
    return;
  }
  ctx.drawImage(image, -camera.x, 0, WORLD.width, canvas.height);
}

function getCurrentRoad() {
  return MAPS[currentMapIndex]?.road || ROAD;
}

function getVisibleNpcs() {
  const earlyMobCounts = new Map();
  return npcs.filter((npc) => {
    if (npc.hidden) return false;
    const visible = npc.following || (npc.mapId ?? 0) === currentMapIndex;
    if (!visible) return false;
    if (npc.earlyMob && !npc.following) {
      const mapId = npc.mapId ?? 0;
      const count = earlyMobCounts.get(mapId) || 0;
      if (count >= MAX_EARLY_MOBS_PER_MAP) return false;
      earlyMobCounts.set(mapId, count + 1);
    }
    return true;
  });
}

function tryChangeMap() {
  const road = getCurrentRoad();
  if (player.x >= road.right - 2) {
    const transition = getMapEdgeTransition("right");
    if (!transition) return;
    if (!canUseMapGateBeforeFirstQuest("right", road)) return;
    if (!canUseKidneyGate("right", road)) return;
    if (!canUseChapter4ConfrontGate(transition.mapId, "right", road)) return;
    const enteringRescueCell = currentMapIndex === 10
      && transition.mapId === 11
      && chapter4State.phase === "base_rescue_victory"
      && !chapter4State.rescueCellEntered;
    changeMap(transition.mapId, transition.x, transition.y, transition.direction, {
      followerPlacement: transition.followerPlacement,
    });
    if (enteringRescueCell) {
      prepareChapter4RescueCellEntry();
    }
  } else if (player.x <= road.left + 2) {
    const transition = getMapEdgeTransition("left");
    if (!transition) return;
    if (!canUseMapGateBeforeFirstQuest("left", road)) return;
    if (!canUseKidneyGate("left", road)) return;
    if (!canUseChapter4ConfrontGate(transition.mapId, "left", road)) return;
    if (transition) changeMap(transition.mapId, transition.x, transition.y, transition.direction, {
      followerPlacement: transition.followerPlacement,
    });
  }
}

function getMapEdgeTransition(side) {
  let targetMapId = null;
  let targetX = null;
  let targetY = null;
  let direction = null;
  let followerPlacement = null;
  if (side === "right") {
    if (currentMapIndex === 2) {
      targetMapId = 12;
    } else if (currentMapIndex >= 0 && currentMapIndex < 6) {
      targetMapId = currentMapIndex + 1;
    }
    if (currentMapIndex === 8) targetMapId = 0;
    if (currentMapIndex === 10) {
      targetMapId = 11;
      targetX = CHAPTER4_CELL_ENTRY_POSITION.x;
      targetY = CHAPTER4_CELL_ENTRY_POSITION.y;
      direction = CHAPTER4_CELL_ENTRY_POSITION.direction;
      followerPlacement = "near-player";
    }
  } else if (side === "left") {
    if (currentMapIndex === 12) targetMapId = 2;
    if (currentMapIndex === 0) targetMapId = 8;
    if (currentMapIndex > 0 && currentMapIndex < 7) targetMapId = currentMapIndex - 1;
    if (currentMapIndex === 7) {
      targetMapId = 0;
      targetX = 1730;
      targetY = 638;
      direction = "down";
      followerPlacement = "near-player";
    }
  }
  if (targetMapId === null) return null;
  const targetRoad = MAPS[targetMapId]?.road || ROAD;
  return {
    mapId: targetMapId,
    x: targetX ?? (side === "right" ? targetRoad.left + 36 : targetRoad.right - 36),
    y: clamp(targetY ?? player.y, targetRoad.top, targetRoad.bottom),
    direction,
    followerPlacement,
  };
}

function canUseMapGateBeforeFirstQuest(side, road, shouldPushBack = true) {
  if (questState === "completed") return true;
  if (shouldPushBack) {
    player.x = side === "right" ? road.right - 58 : road.left + 58;
    player.walkTime = 0;
    player.direction = side === "right" ? "left" : "right";
  }
  questNpc.direction = axisToDirection(player.x - questNpc.x, player.y - questNpc.y);
  startDialogue(
    [
      { actor: questNpc, speaker: questNpc.label, body: "喂，漢堡，事情還沒辦完，想去哪？" },
      { actor: player, speaker: player.label, body: "又怎樣..." },
      { actor: questNpc, speaker: questNpc.label, body: questUnlocked ? "先把三個 VT 找齊，再回來找我。" : "先過來，我有事要交代你。" },
    ],
    null,
    questNpc
  );
  return false;
}

function canUseKidneyGate(side, road) {
  if (currentMapIndex !== 2 || side !== "right" || chapter3State.fluteUsed || chapter3State.bebeFound) return true;
  player.x = road.right - 58;
  player.walkTime = 0;
  player.direction = "left";
  const kidney = getCharacterById("npc14");
  startDialogue(
    [
      { actor: kidney || player, speaker: kidney?.label || "腰子親親獸", body: "Zzz..." },
      { actor: player, speaker: player.label, body: "牠睡到把路擋住了，完全過不去。" },
    ],
    null,
    kidney || player
  );
  return false;
}

function canUseChapter4ConfrontGate(targetMapId, side = "right", road = getCurrentRoad()) {
  if (chapter4State.phase !== "confront_ex") return true;
  if ([8, 9].includes(targetMapId)) return true;
  player.x = side === "right" ? road.right - 58 : road.left + 58;
  player.walkTime = 0;
  player.direction = side === "right" ? "left" : "right";
  startDialogue(
    [
      { actor: questNpc, speaker: questNpc.label, body: "先把門口那個吵著找親親子的傢伙處理掉。" },
      { actor: player, speaker: player.label, body: "好啦，優先處理麻煩。" },
    ],
    null,
    questNpc
  );
  return false;
}

function changeMap(nextMapIndex, nextX, nextY = player.y, forcedDirection = null, options = {}) {
  sceneFade = null;
  currentMapIndex = clamp(nextMapIndex, 0, MAP_COUNT - 1);
  if (chapter3State.kinkoOtakuFeeNeedsMapChange) {
    chapter3State.kinkoOtakuFeeNeedsMapChange = false;
  }
  placeFatDumbDailyNpc();
  applyDailyActivityActorStates();
  const road = getCurrentRoad();
  player.x = clamp(nextX, road.left, road.right);
  player.y = clamp(nextY, road.top, road.bottom);
  const entryDirection = forcedDirection || getMapEntryDirection(player.x, road);
  player.direction = entryDirection;
  player.walkTime = 0;
  if (options.followerPlacement === "near-player") {
    syncFollowersNearPlayer(entryDirection, road);
  } else {
    syncFollowersToMapEntry(entryDirection, road);
  }
  camera.x = clamp(player.x - canvas.width * 0.35, 0, WORLD.width - canvas.width);
  [player, ...getVisibleNpcs()].forEach(seedTrail);
  saveGame();
  if (options.fadeIn !== false) {
    startSceneFadeIn(options.onFadeComplete || null, options.fadeDuration || MAP_CHANGE_FADE_IN_TIME);
  }
}

function getMapEntryDirection(x, road) {
  if (x <= road.left + 90) return "right";
  if (x >= road.right - 90) return "left";
  return player.direction;
}

function syncFollowersToMapEntry(entryDirection, road) {
  const followers = getOrderedFollowers();
  const sideX = entryDirection === "left" ? road.right - 24 : road.left + 24;
  const stepX = entryDirection === "left" ? -30 : 30;
  const yOffsets = [26, -26, 52, -52, 78, -78];

  followers.forEach((npc, index) => {
    const pairIndex = Math.floor(index / 2);
    npc.x = clamp(sideX + pairIndex * stepX, road.left + 18, road.right - 18);
    npc.y = clamp(player.y + yOffsets[index % yOffsets.length], road.top + 18, road.bottom - 18);
    npc.direction = entryDirection;
    npc.walkTime = 0;
    npc.mapId = currentMapIndex;
    seedTrail(npc);
  });
}

function syncFollowersNearPlayer(entryDirection, road) {
  const followers = getOrderedFollowers();
  const offsets = [
    { x: -36, y: -28 },
    { x: 36, y: -28 },
    { x: 0, y: -62 },
    { x: -72, y: -62 },
    { x: 72, y: -62 },
  ];

  followers.forEach((npc, index) => {
    const offset = offsets[index % offsets.length];
    const row = Math.floor(index / offsets.length);
    npc.x = clamp(player.x + offset.x, road.left + 18, road.right - 18);
    npc.y = clamp(player.y + offset.y - row * 34, road.top + 18, road.bottom - 18);
    npc.direction = entryDirection;
    npc.walkTime = 0;
    npc.mapId = currentMapIndex;
    seedTrail(npc);
  });
}

function getVisibleShopPoints() {
  return SHOP_POINTS.filter((point) => point.mapId === currentMapIndex);
}

function getVisibleHotelRoomPoints() {
  return HOTEL_ROOM_POINTS.filter((point) => point.mapId === currentMapIndex);
}

function getVisibleFloorMatPoints() {
  return FLOOR_MAT_POINTS.filter((point) => point.mapId === currentMapIndex);
}

function getVisibleTeleportPoints() {
  return TELEPORT_POINTS.filter((point) => point.mapId === currentMapIndex);
}

function drawShopPoints() {
  for (const point of getVisibleShopPoints()) {
    const x = point.x - camera.x;
    const y = point.y - camera.y;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(255, 225, 111, 0.22)";
    ctx.beginPath();
    ctx.ellipse(0, 18, 34, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffe16f";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.65)";
    ctx.lineWidth = 5;
    ctx.font = "bold 18px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.textAlign = "center";
    const label = point.displayLabel || point.label;
    ctx.strokeText(label, 0, -8);
    ctx.fillText(label, 0, -8);
    ctx.restore();
  }
}

function drawHotelRoomPoints() {
  for (const point of getVisibleHotelRoomPoints()) {
    const x = point.x - camera.x;
    const y = point.y - camera.y;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(117, 244, 178, 0.22)";
    ctx.beginPath();
    ctx.ellipse(0, 18, 34, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#75f4b2";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.65)";
    ctx.lineWidth = 5;
    ctx.font = "bold 18px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.textAlign = "center";
    const label = point.displayLabel || "房間";
    ctx.strokeText(label, 0, -8);
    ctx.fillText(label, 0, -8);
    ctx.restore();
  }
}

function drawFloorMatPoints() {
  for (const point of getVisibleFloorMatPoints()) {
    const x = point.x - camera.x;
    const y = point.y - camera.y;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(255, 195, 112, 0.22)";
    ctx.beginPath();
    ctx.ellipse(0, 18, 42, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffc370";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.65)";
    ctx.lineWidth = 5;
    ctx.font = "bold 18px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.textAlign = "center";
    const label = point.displayLabel || "地舖";
    ctx.strokeText(label, 0, -8);
    ctx.fillText(label, 0, -8);
    ctx.restore();
  }
}

function drawMapGateBeams() {
  const road = getCurrentRoad();
  if (getMapEdgeTransition("left")) {
    drawMapGateBeam(road.left, (road.top + road.bottom) / 2, "left");
  }
  if (getMapEdgeTransition("right")) {
    drawMapGateBeam(road.right, (road.top + road.bottom) / 2, "right");
  }
}

function drawTeleportPoints() {
  const pulse = 0.72 + Math.sin(performance.now() / 240) * 0.18;
  for (const point of getVisibleTeleportPoints()) {
    const x = point.x - camera.x;
    const y = point.y - camera.y;
    ctx.save();
    ctx.translate(x, y);
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = `rgba(255, 118, 210, ${0.12 * pulse})`;
    ctx.beginPath();
    ctx.ellipse(0, 18, 42, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(120, 235, 255, ${0.18 * pulse})`;
    ctx.fillRect(-18, -112, 36, 132);
    ctx.fillStyle = `rgba(255, 255, 230, ${0.2 * pulse})`;
    ctx.fillRect(-8, -102, 16, 116);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#8ff5ff";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.72)";
    ctx.lineWidth = 5;
    ctx.font = "bold 18px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.textAlign = "center";
    const label = point.displayLabel || "入口";
    ctx.strokeText(label, 0, -20);
    ctx.fillText(label, 0, -20);
    ctx.restore();
  }
}

function drawChapter4BaseWhisperBubble() {
  if (currentMapIndex !== 10 || chapter4State.phase !== "base_infiltration" || chapter4State.baseEncounterDone) return;
  if (dialogueState || chapter4AlarmFlash || chapter4CutsceneMove) return;
  const monkey = getCharacterById("npc40");
  if (!monkey || monkey.mapId !== currentMapIndex) return;
  const lineIndex = Math.floor(performance.now() / 2300) % CHAPTER4_MONKEY_WHISPER_LINES.length;
  const text = CHAPTER4_MONKEY_WHISPER_LINES[lineIndex];
  const x = monkey.x - camera.x;
  const y = monkey.y - camera.y - 106;
  ctx.save();
  ctx.font = "bold 18px 'Segoe UI', 'Noto Sans TC', sans-serif";
  const width = Math.min(Math.max(ctx.measureText(text).width + 38, 184), 330);
  const height = 48;
  const bubbleX = clamp(x - width / 2, 12, canvas.width - width - 12);
  const bubbleY = clamp(y - height, 18, canvas.height - height - 16);
  const tailX = clamp(x, bubbleX + 22, bubbleX + width - 22);

  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.strokeStyle = "rgba(255, 185, 210, 0.88)";
  ctx.lineWidth = 2;
  ctx.shadowColor = "rgba(255, 120, 170, 0.35)";
  ctx.shadowBlur = 10;
  roundRect(bubbleX, bubbleY, width, height, 14);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.moveTo(tailX - 10, bubbleY + height - 1);
  ctx.lineTo(tailX + 10, bubbleY + height - 1);
  ctx.lineTo(tailX, bubbleY + height + 13);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#3a3140";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, bubbleX + width / 2, bubbleY + height / 2);
  ctx.restore();
}

function updateChapter4AlarmFlash(delta) {
  if (!chapter4AlarmFlash) return;
  chapter4AlarmFlash.timer += delta;
  if (chapter4AlarmFlash.timer < chapter4AlarmFlash.duration) return;
  const onComplete = chapter4AlarmFlash.onComplete;
  chapter4AlarmFlash = null;
  if (typeof onComplete === "function") onComplete();
}

function drawChapter4AlarmFlash() {
  if (!chapter4AlarmFlash) return;
  const progress = clamp(chapter4AlarmFlash.timer / chapter4AlarmFlash.duration, 0, 1);
  const pulse = 0.45 + Math.abs(Math.sin(chapter4AlarmFlash.timer * 22)) * 0.42;
  const alpha = (1 - progress * 0.35) * pulse;
  ctx.save();
  ctx.fillStyle = `rgba(255, 12, 22, ${alpha})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = `rgba(255, 210, 210, ${alpha * 0.26})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function drawMapGateBeam(worldX, worldY, side) {
  const x = worldX - camera.x;
  const y = worldY - camera.y;
  const pulse = 0.72 + Math.sin(performance.now() / 260) * 0.18;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.translate(x, y);
  ctx.fillStyle = `rgba(120, 235, 255, ${0.18 * pulse})`;
  ctx.fillRect(-24, -142, 48, 164);
  ctx.fillStyle = `rgba(255, 255, 180, ${0.2 * pulse})`;
  ctx.fillRect(-12, -132, 24, 150);
  ctx.fillStyle = `rgba(90, 210, 255, ${0.34 * pulse})`;
  ctx.beginPath();
  ctx.ellipse(0, 22, 42, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `rgba(255, 255, 230, ${0.7 * pulse})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(side === "left" ? 12 : -12, -22);
  ctx.lineTo(side === "left" ? -10 : 10, 0);
  ctx.lineTo(side === "left" ? 12 : -12, 22);
  ctx.stroke();
  ctx.restore();
}

function drawTitleScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (appMode === APP_MODE.INTRO) {
    drawIntroInstructions();
    return;
  }

  drawTitleBackground();
  drawTitleMenuButtons();

  if (appMode === APP_MODE.TITLE_GUIDE) {
    drawTitlePanel("操作說明", [
      "方向鍵 / WASD：移動角色或切換選項",
      "Z：確認、對話、互動、戰鬥轉盤停止",
      "X：取消、返回、開啟/關閉選單",
      "戰鬥時：每按一次 Z 停下一列，五列停止後結算",
      "",
      "按 Z 或 X 返回主選單",
    ]);
  } else if (appMode === APP_MODE.TITLE_MESSAGE) {
    drawTitleMessage();
  }
}

function drawIntroInstructions() {
  ctx.save();
  ctx.globalAlpha = getIntroPageAlpha();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 42px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText("親親世界", canvas.width / 2, 142);

  if (introPage === 1) {
    ctx.fillStyle = "#ffe16f";
    ctx.font = "bold 34px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText("內容聲明", canvas.width / 2, 238);
    ctx.fillStyle = "#eaf7ff";
    ctx.font = "bold 27px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText("此遊戲內容純屬虛構，裡面沒有任何真實的Vtuber", canvas.width / 2, 326);
    ctx.fillText("只有各式各樣的親親獸，如有雷同，純屬巧合", canvas.width / 2, 376);
    ctx.restore();
    return;
  }

  if (introPage === 2) {
    ctx.fillStyle = "#ffe16f";
    ctx.font = "bold 36px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText("感謝素材", canvas.width / 2, 248);
    ctx.fillStyle = "#eaf7ff";
    ctx.font = "bold 28px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText("BGM: 大鳥葛格", canvas.width / 2, 332);
    ctx.fillText("音效: gorbygorby", canvas.width / 2, 386);
    ctx.restore();
    return;
  }

  const lines = [
    "操作說明",
    "↑ ↓ ← →：移動 / 選擇",
    "Z：確認 / 互動 / 推進對話 / 戰鬥操作",
    "X：取消 / 返回 / 開啟選單",
  ];
  ctx.font = "24px 'Segoe UI', 'Noto Sans TC', sans-serif";
  lines.forEach((line, index) => {
    ctx.fillStyle = index === 0 ? "#ffe16f" : "#eaf7ff";
    ctx.fillText(line, canvas.width / 2, 250 + index * 48);
  });
  ctx.restore();
}

function getIntroPageAlpha() {
  if (!introPageStartedAt) return 1;
  return clamp((performance.now() - introPageStartedAt) / 900, 0, 1);
}

function drawTitleBackground() {
  if (titleVideo.readyState >= 2) {
    ctx.drawImage(titleVideo, 0, 0, canvas.width, canvas.height);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#120821");
    gradient.addColorStop(1, "#05070d");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTitleMenuButtons() {
  const titleItems = getVisibleTitleMenuItems();
  titleMenuIndex = clampMenuIndex(titleMenuIndex, titleItems.length);
  titleItems.forEach((item, index) => {
    const rect = getTitleButtonRect(index);
    const selected = index === titleMenuIndex && appMode === APP_MODE.TITLE;
    if (selected) drawTitleButtonGlow(rect, item.glow);
    const image = assets[item.asset];
    if (isRenderableImage(image)) {
      if (item.sourceCrop) {
        ctx.drawImage(
          image,
          item.sourceCrop.x,
          item.sourceCrop.y,
          item.sourceCrop.width,
          item.sourceCrop.height,
          rect.x,
          rect.y,
          rect.width,
          rect.height
        );
      } else {
        ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height);
      }
    } else {
      ctx.fillStyle = "rgba(0, 0, 0, 0.74)";
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      ctx.fillStyle = item.glow;
      ctx.font = "bold 34px 'Segoe UI', 'Noto Sans TC', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(item.label, rect.x + rect.width / 2, rect.y + rect.height / 2);
    }
  });
  drawTitleMetaPanel(titleItems[titleMenuIndex]);
}

function drawTitleMetaPanel(selectedItem) {
  if (!selectedItem) return;
  const summary = getSavedGameSummary();
  const panelX = 74;
  const panelY = 574;
  const panelWidth = 506;
  const panelHeight = 94;
  ctx.save();
  ctx.globalAlpha = 0.94;
  ctx.fillStyle = "rgba(7, 12, 28, 0.74)";
  roundRect(panelX, panelY, panelWidth, panelHeight, 22);
  ctx.fill();
  ctx.strokeStyle = selectedItem.glow || "rgba(255, 255, 255, 0.6)";
  ctx.lineWidth = 2;
  ctx.shadowColor = selectedItem.glow || "rgba(255, 255, 255, 0.35)";
  ctx.shadowBlur = 18;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = selectedItem.glow || "#ffe16f";
  ctx.font = "bold 20px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText(TITLE_ITEM_HELP[selectedItem.id] || selectedItem.label, panelX + 24, panelY + 30);
  ctx.fillStyle = "rgba(234, 255, 255, 0.82)";
  ctx.font = "bold 16px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText(summary || "目前沒有存檔。", panelX + 24, panelY + 64);
  ctx.restore();
}

function getSavedGameSummary() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return "";
    const payload = JSON.parse(raw);
    const day = Math.max(1, Number(payload.currentDay) || 1);
    const chapter = getSavedGameChapterLabel(payload);
    const fee = Math.max(0, Number(payload.shellFee) || 0);
    return `存檔：${chapter}｜第 ${day} 天｜護貝費 ${fee}`;
  } catch (error) {
    return "存檔讀取異常，建議重新開始或檢查瀏覽器儲存。";
  }
}

function getSavedGameChapterLabel(payload = {}) {
  const chapter5 = payload.chapter5State || {};
  const chapter4 = payload.chapter4State || {};
  const chapter3 = payload.chapter3State || {};
  const chapter2 = payload.chapter2State || {};
  if (chapter5.phase && chapter5.phase !== "locked") return "第五章";
  if (chapter4.phase && chapter4.phase !== "locked") return "第四章";
  if (chapter3.phase && chapter3.phase !== "locked") return "第三章";
  if (chapter2.phase && chapter2.phase !== "locked") return "第二章";
  return "第一章";
}

function drawTitleButtonGlow(rect, color) {
  ctx.save();
  const pulse = Math.sin(performance.now() / 180) * 0.5 + 0.5;
  const x = rect.x + 24;
  const y = rect.y + 28;
  const width = rect.width - 48;
  const height = rect.height - 56;

  ctx.globalAlpha = 0.58 + pulse * 0.22;
  ctx.shadowColor = color;
  ctx.shadowBlur = 26 + pulse * 10;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, width, height);

  ctx.globalAlpha = 0.26 + pulse * 0.14;
  ctx.lineWidth = 10;
  ctx.strokeRect(x + 5, y + 5, width - 10, height - 10);

  const shine = ctx.createLinearGradient(x, y, x + width, y);
  shine.addColorStop(0, "rgba(255, 255, 255, 0)");
  shine.addColorStop(0.45, color);
  shine.addColorStop(0.55, "rgba(255, 255, 255, 0.86)");
  shine.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.globalAlpha = 0.16 + pulse * 0.12;
  ctx.fillStyle = shine;
  ctx.fillRect(x + 12, y + 8, width - 24, 6);
  ctx.restore();
}

function getTitleButtonRect(index) {
  return {
    x: TITLE_BUTTON_LAYOUT.x,
    y: TITLE_BUTTON_LAYOUT.y + index * (TITLE_BUTTON_LAYOUT.height + TITLE_BUTTON_LAYOUT.gap),
    width: TITLE_BUTTON_LAYOUT.width,
    height: TITLE_BUTTON_LAYOUT.height,
  };
}

function drawTitlePanel(title, lines) {
  ctx.save();
  const panelX = 170;
  const panelY = 86;
  const panelWidth = 940;
  const panelHeight = 548;
  ctx.fillStyle = "rgba(0, 0, 0, 0.78)";
  roundRect(panelX, panelY, panelWidth, panelHeight, 26);
  ctx.fill();
  ctx.strokeStyle = "rgba(143, 245, 255, 0.42)";
  ctx.lineWidth = 2.5;
  ctx.shadowColor = "rgba(143, 245, 255, 0.28)";
  ctx.shadowBlur = 20;
  ctx.stroke();
  ctx.shadowBlur = 0;
  const glow = ctx.createLinearGradient(panelX + 60, panelY, panelX + panelWidth - 60, panelY);
  glow.addColorStop(0, "rgba(255, 225, 111, 0)");
  glow.addColorStop(0.5, "rgba(255, 225, 111, 0.72)");
  glow.addColorStop(1, "rgba(255, 225, 111, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(panelX + 70, panelY + 86, panelWidth - 140, 2);
  ctx.fillStyle = "#ffe16f";
  ctx.font = "bold 38px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, canvas.width / 2, 156);
  ctx.textAlign = "left";
  ctx.font = "bold 24px 'Segoe UI', 'Noto Sans TC', sans-serif";
  lines.forEach((line, index) => {
    ctx.fillStyle = index === 0 ? "#ffffff" : "rgba(234, 255, 255, 0.86)";
    wrapCanvasText(String(line || ""), 246, 232 + index * 46, 780, 31);
  });
  ctx.restore();
}

function drawTitleMessage() {
  const isLeave = Boolean(titleMessage?.url);
  const isRestart = Boolean(titleMessage?.confirmRestart);
  const lines = titleMessage?.lines || [titleMessage?.text || ""];
  drawTitlePanel(isLeave ? "離開" : isRestart ? "重新開始" : "設定", [
    ...lines,
    "",
    isLeave || isRestart ? "Z 確認，X 取消" : "Z / X 返回主選單",
  ]);
}

function drawExploreActor(actor) {
  if (actor.hidden) return;
  const sprite = SPRITES[actor.sprite];
  const frame = getExploreActorFrame(actor, sprite);
  let screenX = actor.x - camera.x;
  let screenY = actor.y - camera.y;
  if (actor.storyHitTimer > 0) {
    const shake = Math.sin(performance.now() / 18) * 5;
    screenX += shake;
    screenY += Math.cos(performance.now() / 22) * 2;
  }

  ctx.save();
  ctx.translate(screenX, screenY);
  if (actor.redAura) {
    const time = performance.now() / 1000;
    const pulse = 0.5 + Math.sin(time * 7.2) * 0.5;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    const core = ctx.createRadialGradient(0, -34, 6, 0, -34, 62 + pulse * 10);
    core.addColorStop(0, `rgba(255, 244, 196, ${0.32 + pulse * 0.12})`);
    core.addColorStop(0.28, `rgba(255, 52, 64, ${0.24 + pulse * 0.12})`);
    core.addColorStop(1, "rgba(83, 0, 24, 0)");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.ellipse(0, -34, 54 + pulse * 8, 88 + pulse * 12, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(255, 62, 76, ${0.55 + pulse * 0.22})`;
    ctx.lineWidth = 3;
    ctx.shadowColor = "rgba(255, 48, 58, 0.88)";
    ctx.shadowBlur = 18 + pulse * 16;
    for (let i = 0; i < 3; i += 1) {
      const phase = time * 2.3 + i * Math.PI * 0.66;
      const width = 46 + Math.sin(phase) * 7;
      const height = 70 + Math.cos(phase) * 8;
      ctx.beginPath();
      ctx.ellipse(0, -34, width, height, -0.26 + i * 0.26, Math.PI * 1.05, Math.PI * 1.9);
      ctx.stroke();
    }

    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i += 1) {
      const y = -76 + i * 25 + Math.sin(time * 6 + i) * 5;
      const x = Math.sin(time * 4 + i * 1.7) * 14;
      ctx.strokeStyle = `rgba(255, ${95 + i * 24}, ${72 + i * 18}, ${0.34 + pulse * 0.18})`;
      ctx.beginPath();
      ctx.moveTo(x - 24, y + 16);
      ctx.lineTo(x + 24, y - 16);
      ctx.stroke();
    }

    ctx.restore();
  }
  ctx.fillStyle = actor.following ? "rgba(255, 177, 0, 0.18)" : hexToRgba(actor.tint, 0.18);
  ctx.beginPath();
  ctx.ellipse(0, 18, 28, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  drawSpriteFrame(actor.sprite, frame, 0, 0, 1);
  ctx.restore();
}

function getExploreActorFrame(actor, sprite) {
  if (actor.layingDown) {
    return sprite.battleFrames?.ko || getFrame(actor, sprite);
  }
  if (dialogueState?.anchorActor === actor) {
    if (actor.useDirectionalDialogueFrame) {
      return getFrame(actor, sprite);
    }
    if (actor.dialogueIdleFrames) {
      return actor.dialogueIdleFrames[actor.direction] || actor.dialogueIdleFrames.down || getFrame(actor, sprite);
    }
  }
  if (actor.staticIdleFrame && !actor.following && (actor.staticNpc || actor.fixedPlacement || actor.walkTime <= 0)) {
    if (actor.dialogueIdleFrames?.[actor.direction]) {
      return actor.dialogueIdleFrames[actor.direction];
    }
    return actor.staticIdleFrame;
  }
  if (actor === questNpc && questNpcDefeated) {
    return sprite.battleFrames?.ko || getFrame(actor, sprite);
  }
  if (actor === player && dumplingRecovery) {
    return sprite.battleFrames?.ko || getFrame(actor, sprite);
  }
  if (actor === player && openingCutscene) {
    if (openingCutscene.phase === "transition" || openingCutscene.phase === "fallen") {
      return sprite.battleFrames?.ko || getFrame(actor, sprite);
    }
    if (openingCutscene.phase === "wake") {
      return sprite.frames?.down?.idle || getFrame(actor, sprite);
    }
  }
  return getFrame(actor, sprite);
}

function drawOpeningCutsceneOverlay() {
  if (!openingCutscene) return;
  if (openingCutscene.phase === "transition") {
    const progress = clamp(openingCutscene.timer / OPENING_TRANSITION_TIME, 0, 1);
    const eased = progress * progress * (3 - 2 * progress);
    const alpha = 1 - eased;
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    return;
  }
  if (openingCutscene.phase !== "story") return;

  const lineIndex = openingCutscene.lineIndex;
  const alpha = Math.min(openingCutscene.timer / 0.55, 1);

  ctx.save();
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = clamp(alpha, 0, 1);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f7f0df";
  ctx.font = "bold 30px 'Segoe UI', 'Noto Sans TC', sans-serif";
  wrapCanvasText(OPENING_CUTSCENE_LINES[lineIndex], canvas.width / 2, canvas.height / 2, 900, 42);
  ctx.globalAlpha = 0.68;
  ctx.font = "18px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText("按 Z 繼續", canvas.width / 2, canvas.height - 72);
  ctx.restore();
}

function drawSceneFadeOverlay() {
  if (!sceneFade) return;
  const progress = clamp(sceneFade.timer / sceneFade.duration, 0, 1);
  const eased = progress * progress * (3 - 2 * progress);
  const alpha = 1 - eased;
  ctx.save();
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (alpha > 0.08) {
    ctx.globalAlpha = alpha * 0.24;
    ctx.strokeStyle = "rgba(143, 245, 255, 0.34)";
    ctx.lineWidth = 2;
    const offset = (performance.now() / 18) % 72;
    for (let x = -canvas.height; x < canvas.width + canvas.height; x += 72) {
      ctx.beginPath();
      ctx.moveTo(x + offset, canvas.height);
      ctx.lineTo(x + offset + canvas.height * 0.55, 0);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function wrapCanvasText(text, x, y, maxWidth, lineHeight) {
  const chars = [...text];
  const lines = [];
  let line = "";
  for (const char of chars) {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = char;
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((currentLine, index) => {
    ctx.fillText(currentLine, x, startY + index * lineHeight);
  });
}

function getSpriteFrameRenderMetrics(spriteKey, frame, scale = 1) {
  const sprite = SPRITES[spriteKey];
  const image = assets[spriteKey];
  if (!sprite || !frame || !isRenderableImage(image)) return null;
  const source = getFrameSourceRect(sprite, frame, image);
  const usesSourceRect = frame.x !== undefined || frame.autoRow !== undefined;
  const frameScale = frame.scale || 1;
  const baseDrawWidth = usesSourceRect
    ? source.width * (sprite.pixelScale || 1) * frameScale * scale
    : sprite.drawWidth * frameScale * scale;
  const baseDrawHeight = usesSourceRect
    ? source.height * (sprite.pixelScale || 1) * frameScale * scale
    : sprite.drawHeight * frameScale * scale;
  const visibleBounds = usesSourceRect ? getFrameVisibleBounds(image, source) : source;
  const visibleDrawWidth = visibleBounds.width * (baseDrawWidth / source.width);
  const visibleDrawHeight = visibleBounds.height * (baseDrawHeight / source.height);
  const normalizeScale = getCharacterFrameNormalizeScale(visibleDrawWidth, visibleDrawHeight, scale);
  return {
    image,
    source,
    drawWidth: baseDrawWidth * normalizeScale,
    drawHeight: baseDrawHeight * normalizeScale,
    visualHeight: visibleDrawHeight * normalizeScale,
    footOffset: (sprite.footOffset ?? 28) * scale,
  };
}

function getCharacterFrameNormalizeScale(visibleWidth, visibleHeight, drawScale = 1) {
  if (!Number.isFinite(visibleHeight) || visibleHeight <= 0) return 1;
  const minHeight = CHARACTER_FRAME_HEIGHT_LIMITS.min * drawScale;
  const maxHeight = CHARACTER_FRAME_HEIGHT_LIMITS.max * drawScale;
  const isWidePose = visibleWidth > visibleHeight * CHARACTER_WIDE_POSE_RATIO;
  let nextScale = 1;
  if (!isWidePose && visibleHeight < minHeight) {
    nextScale = minHeight / visibleHeight;
  }
  if (visibleHeight * nextScale > maxHeight) {
    nextScale = maxHeight / visibleHeight;
  }
  return nextScale;
}

function getFrameVisibleBounds(image, source) {
  const data = getFrameAlphaData(image);
  if (!data) return source;
  const key = `${source.x}:${source.y}:${source.width}:${source.height}`;
  if (data.bounds.has(key)) return data.bounds.get(key);
  const left = Math.max(0, Math.floor(source.x));
  const top = Math.max(0, Math.floor(source.y));
  const right = Math.min(data.width, Math.ceil(source.x + source.width));
  const bottom = Math.min(data.height, Math.ceil(source.y + source.height));
  let minX = right;
  let minY = bottom;
  let maxX = left - 1;
  let maxY = top - 1;
  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      const alpha = data.alpha[(y * data.width + x) * 4 + 3];
      if (alpha <= 18) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  const bounds = maxX >= minX && maxY >= minY
    ? { x: minX - source.x, y: minY - source.y, width: maxX - minX + 1, height: maxY - minY + 1 }
    : { x: 0, y: 0, width: source.width, height: source.height };
  data.bounds.set(key, bounds);
  return bounds;
}

function getFrameAlphaData(image) {
  if (image.__frameAlphaData) return image.__frameAlphaData;
  if (typeof document === "undefined") return null;
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  if (!width || !height) return null;
  const canvasEl = document.createElement("canvas");
  canvasEl.width = width;
  canvasEl.height = height;
  const buffer = canvasEl.getContext("2d", { willReadFrequently: true });
  buffer.imageSmoothingEnabled = false;
  buffer.drawImage(image, 0, 0);
  image.__frameAlphaData = {
    width,
    height,
    alpha: buffer.getImageData(0, 0, width, height).data,
    bounds: new Map(),
  };
  return image.__frameAlphaData;
}

function drawSpriteFrame(spriteKey, frame, x, y, scale) {
  const metrics = getSpriteFrameRenderMetrics(spriteKey, frame, scale);
  if (!metrics) return;
  const { image, source, drawWidth, drawHeight, footOffset } = metrics;
  ctx.save();
  ctx.translate(x, y);
  if (frame.flip) ctx.scale(-1, 1);
  ctx.drawImage(
    image,
    source.x,
    source.y,
    source.width,
    source.height,
    -drawWidth / 2,
    -drawHeight + footOffset,
    drawWidth,
    drawHeight
  );
  ctx.restore();
}

function drawSparkle(sparkle) {
  const alpha = Math.max(sparkle.life / sparkle.maxLife, 0);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(sparkle.x - camera.x, sparkle.y - camera.y);
  ctx.fillStyle = sparkle.color;
  ctx.beginPath();
  ctx.moveTo(0, -sparkle.size);
  ctx.lineTo(sparkle.size * 0.45, -sparkle.size * 0.2);
  ctx.lineTo(sparkle.size, 0);
  ctx.lineTo(sparkle.size * 0.45, sparkle.size * 0.2);
  ctx.lineTo(0, sparkle.size);
  ctx.lineTo(-sparkle.size * 0.45, sparkle.size * 0.2);
  ctx.lineTo(-sparkle.size, 0);
  ctx.lineTo(-sparkle.size * 0.45, -sparkle.size * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawChapter4ImpactSlashes() {
  chapter4ImpactSlashes.forEach((slash) => {
    const alpha = clamp(slash.life / slash.maxLife, 0, 1);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = "lighter";
    ctx.translate(slash.x - camera.x, slash.y - camera.y);
    ctx.rotate(slash.angle);
    ctx.lineCap = "round";
    ctx.shadowColor = slash.color;
    ctx.shadowBlur = 18;
    ctx.strokeStyle = slash.color;
    ctx.lineWidth = slash.width;
    ctx.beginPath();
    ctx.moveTo(-slash.length / 2, 0);
    ctx.lineTo(slash.length / 2, 0);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = Math.max(2, slash.width * 0.35);
    ctx.beginPath();
    ctx.moveTo(-slash.length / 2 + 7, 0);
    ctx.lineTo(slash.length / 2 - 7, 0);
    ctx.stroke();
    ctx.restore();
  });
}

function drawChapter4KinkoHitOverlay() {
  const sequence = chapter4KinkoHitSequence;
  if (!sequence) return;
  const pulse = Math.abs(Math.sin(sequence.timer * 34));
  const alpha = clamp(sequence.redFlash, 0, 1) * (0.18 + pulse * 0.16);
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = `rgba(255, 0, 42, ${alpha})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const sweep = (sequence.timer * 760) % (canvas.width + 220) - 110;
  const beam = ctx.createLinearGradient(sweep - 120, 0, sweep + 120, 0);
  beam.addColorStop(0, "rgba(255, 42, 64, 0)");
  beam.addColorStop(0.5, `rgba(255, 235, 190, ${alpha * 0.82})`);
  beam.addColorStop(1, "rgba(255, 42, 64, 0)");
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(sweep - 120, 0);
  ctx.lineTo(sweep + 80, 0);
  ctx.lineTo(sweep + 180, canvas.height);
  ctx.lineTo(sweep - 20, canvas.height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawChapter4TeleportEffects() {
  chapter4TeleportEffects.forEach(drawChapter4TeleportEffect);
}

function drawChapter4TeleportEffect(effect) {
  const progress = clamp(effect.life / effect.duration, 0, 1);
  const flash = Math.sin(progress * Math.PI);
  const fromX = effect.fromX - camera.x;
  const fromY = effect.fromY - camera.y - 58;
  const toX = effect.toX - camera.x;
  const toY = effect.toY - camera.y - 58;
  const midX = (fromX + toX) / 2;
  const midY = Math.min(fromY, toY) - 98 - Math.sin(effect.seed) * 24;
  const sourceAlpha = clamp(1 - progress / 0.52, 0, 1);
  const targetAlpha = clamp((progress - 0.18) / 0.44, 0, 1) * clamp((1 - progress) / 0.32, 0, 1);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = flash * 0.13;
  ctx.fillStyle = "#fff7c2";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 5; i += 1) {
    const phase = i / 5;
    const alpha = (0.34 - phase * 0.035) * flash;
    const wobble = Math.sin(effect.seed + progress * 12 + i) * 22;
    const line = ctx.createLinearGradient(fromX, fromY, toX, toY);
    line.addColorStop(0, `rgba(255, 252, 194, ${alpha})`);
    line.addColorStop(0.45, `rgba(255, 216, 77, ${alpha * 0.82})`);
    line.addColorStop(1, `rgba(255, 148, 44, ${alpha})`);
    ctx.strokeStyle = line;
    ctx.lineWidth = 18 - i * 2.6;
    ctx.shadowColor = "rgba(255, 225, 111, 0.96)";
    ctx.shadowBlur = 22 + flash * 24;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.quadraticCurveTo(midX + wobble, midY - phase * 20, toX, toY);
    ctx.stroke();
  }

  drawChapter4TeleportGate(fromX, fromY, sourceAlpha, 0.78 + progress * 0.95, false);
  drawChapter4TeleportGate(toX, toY, targetAlpha, 0.7 + targetAlpha * 1.35, true);
  ctx.restore();
}

function drawChapter4TeleportGate(x, y, alpha, scale, arriving) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  const beamHeight = arriving ? 330 : 270;
  const beamWidth = 78 * scale;
  const beam = ctx.createLinearGradient(x, y - beamHeight * 0.58, x, y + beamHeight * 0.42);
  beam.addColorStop(0, "rgba(255, 246, 166, 0)");
  beam.addColorStop(0.4, "rgba(255, 236, 132, 0.52)");
  beam.addColorStop(0.58, "rgba(255, 158, 54, 0.34)");
  beam.addColorStop(1, "rgba(255, 246, 166, 0)");
  ctx.fillStyle = beam;
  ctx.fillRect(x - beamWidth / 2, y - beamHeight * 0.58, beamWidth, beamHeight);

  for (let i = 0; i < 3; i += 1) {
    const ring = (performance.now() / 620 + i * 0.28) % 1;
    const ringAlpha = (1 - ring) * alpha;
    ctx.globalAlpha = ringAlpha;
    ctx.strokeStyle = i % 2 ? "#fff6b5" : "#ffd447";
    ctx.lineWidth = 5 - ring * 2.2;
    ctx.shadowColor = "rgba(255, 225, 111, 0.95)";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.ellipse(x, y + 18 - ring * 62, (34 + ring * 74) * scale, (10 + ring * 24) * scale, arriving ? -0.22 : 0.22, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.globalAlpha = alpha * 0.75;
  ctx.strokeStyle = "#fffbe0";
  ctx.lineWidth = 3;
  ctx.shadowColor = "rgba(255, 255, 255, 0.92)";
  ctx.shadowBlur = 18;
  for (let i = 0; i < 10; i += 1) {
    const angle = (Math.PI * 2 * i) / 10 + performance.now() / 520;
    const inner = 18 * scale;
    const outer = (62 + (i % 3) * 14) * scale;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * inner, y - 36 + Math.sin(angle) * inner * 0.56);
    ctx.lineTo(x + Math.cos(angle) * outer, y - 36 + Math.sin(angle) * outer * 0.56);
    ctx.stroke();
  }

  ctx.restore();
}

function interact() {
  if (chapterCompleteTransition) return;
  if (menuOpen || endingState || battleState?.active || transformCutscene || chapter5EventCutin || chapter5RuleDocument || xiaoDeparture || smokerDeparture || fatDumbDeparture || kidneyDeparture || kinkoExDeparture || chapter4CutsceneMove || chapter4KinkoHitSequence) return;
  if (dialogueState) {
    advanceDialogue();
    return;
  }

  const priorityNpc = findNearestNpc();
  const priorityNpcDistance = priorityNpc ? Math.hypot(player.x - priorityNpc.x, player.y - priorityNpc.y) : Number.POSITIVE_INFINITY;
  if (priorityNpc && priorityNpcDistance <= 110 && handleChapter5NpcInteraction(priorityNpc)) {
    return;
  }
  if (priorityNpc && priorityNpcDistance <= 110 && handleChapter4NpcInteraction(priorityNpc)) {
    return;
  }
  if (priorityNpc && priorityNpcDistance <= 110 && handleChapter3NpcInteraction(priorityNpc)) {
    return;
  }
  if (priorityNpc?.id === "npc8" && priorityNpcDistance <= 110 && handleFatDumbDailyInteraction(priorityNpc)) {
    return;
  }

  const shopPoint = findNearestShopPoint();
  if (shopPoint && Math.hypot(player.x - shopPoint.x, player.y - shopPoint.y) <= 110) {
    openShopMenu(shopPoint);
    return;
  }
  if (priorityNpc?.hotelRoomOwner && Math.hypot(player.x - priorityNpc.x, player.y - priorityNpc.y) <= 100) {
    startHotelOtakuDialogue();
    return;
  }

  const roomPoint = findNearestHotelRoomPoint();
  if (roomPoint && Math.hypot(player.x - roomPoint.x, player.y - roomPoint.y) <= (roomPoint.radius || 120)) {
    useHotelRoomPoint(roomPoint);
    return;
  }

  const floorMatPoint = findNearestFloorMatPoint();
  if (floorMatPoint && Math.hypot(player.x - floorMatPoint.x, player.y - floorMatPoint.y) <= (floorMatPoint.radius || 72)) {
    useFloorMatPoint(floorMatPoint);
    return;
  }

  const target = findNearestNpc();
  if (!target) {
    const teleportPoint = findNearestTeleportPoint();
    if (teleportPoint && Math.hypot(player.x - teleportPoint.x, player.y - teleportPoint.y) <= (teleportPoint.radius || 54)) {
      useTeleportPoint(teleportPoint);
    }
    return;
  }
  const targetDistance = Math.hypot(player.x - target.x, player.y - target.y);
  if (targetDistance > 100) {
    const teleportPoint = findNearestTeleportPoint();
    if (teleportPoint && Math.hypot(player.x - teleportPoint.x, player.y - teleportPoint.y) <= (teleportPoint.radius || 54)) {
      useTeleportPoint(teleportPoint);
    }
    return;
  }

  if (handleChapter3NpcInteraction(target)) {
    return;
  }
  if (handleChapter5NpcInteraction(target)) {
    return;
  }
  if (handleChapter4NpcInteraction(target)) {
    return;
  }
  if (target.id === "npc8" && handleFatDumbDailyInteraction(target)) {
    return;
  }

  if (target.hotelRoomOwner) {
    startHotelOtakuDialogue();
    return;
  }

  if (target.earlyMob) {
    startDialogue(
      [
        { actor: target, speaker: target.label, body: "等一下，你看起來好像有護貝費。" },
        { actor: player, speaker: player.label, body: "蛤？那是你自己想像的吧。" },
      ],
      () => openEarlyMobBattle(target),
      target
    );
    return;
  }

  if (target.smokingDialogue) {
    if (isChapter2TasksActive() && chapter2State.exitReminderShown && !chapter2State.smokersCleared) {
      startSmokerRequestDialogue(target);
      return;
    }
    startDialogue([
      { actor: target, speaker: target.label, body: "..." },
      { actor: player, speaker: player.label, body: "好像在抽菸..." },
    ], null, target);
    return;
  }

  if (target.previewOnly) {
    startDialogue([{ actor: target, speaker: target.label, body: target.dialogue || "先測試一下移動效果。" }], null, target);
    return;
  }

  if (target.questGiver) {
    startQuestDialogue(target);
    return;
  }

  if (!questUnlocked && !target.questGiver) {
    startDialogue([{ actor: target, speaker: target.label, body: "右邊有個男的怪怪的..." }], null, target);
    return;
  }

  if (questState === "ready" || questState === "battle") {
    startDialogue([{ actor: target, speaker: target.label, body: "先把正事辦完再說。" }], null, target);
    return;
  }

  if (questState === "completed") return;

  if (target.recruitRetry) {
    startDialogue([
      { actor: target, speaker: target.label, body: "到底要幹嘛..." },
    ], () => {
      openRecruitBattle(target);
    }, target);
    burst(target.x, target.y, target.tint);
    return;
  }

  startDialogue([
    { actor: target, speaker: target.label, body: target.dialogue || "..." },
    { actor: player, speaker: player.label, body: "跟我過來" },
    { actor: target, speaker: target.label, body: "你是誰...?" },
    { actor: player, speaker: player.label, body: "過來就對了" },
    { actor: target, speaker: target.label, body: "神經病" },
  ], () => {
    openRecruitBattle(target);
  }, target);
  burst(target.x, target.y, target.tint);
}

function startQuestDialogue(npc) {
  if (shouldOfferXiaoActionMenu()) {
    startXiaoActionMenu(npc);
    return;
  }
  startQuestDialogueContent(npc);
}

function shouldOfferXiaoActionMenu() {
  return isChapter2Started() && !questNpcDefeated;
}

function startXiaoActionMenu(npc) {
  startDialogue(
    [
      {
        actor: npc,
        speaker: npc.label,
        body: "要做什麼？",
        choices: [
          { label: "對話", onSelect: () => startQuestDialogueContent(npc) },
          { label: "挑戰蕭政銘", onSelect: () => startXiaoChallengeDialogue(npc, { reviveAfterEnding: true, playerLine: "蕭政銘，我不爽你很久了" }) },
        ],
      },
    ],
    null,
    npc
  );
}

function startQuestDialogueContent(npc) {
  if (questNpcDefeated) {
    startDialogue(
      [
        { actor: npc, speaker: npc.label, body: "怎麼可能..." },
        {
          actor: npc,
          speaker: npc.label,
          body: "",
          choices: [
            { label: `花費 ${XIAO_REVIVE_FEE} 護貝費復活蕭政銘`, onSelect: () => reviveXiaoFromDialogue(npc) },
          ],
        },
      ],
      null,
      npc
    );
    return;
  }

  if (isChapter4Started()) {
    startChapter4QuestDialogue(npc);
    return;
  }

  if (isChapter3Started()) {
    if (chapter3State.phase === "ask_xiao") {
      startChapter3XiaoBriefing(npc);
      return;
    }
    if (chapter3State.phase === "find_members") {
      startDialogue([{ actor: npc, speaker: npc.label, body: "先把三個失蹤的 VT 找回來，我在直播室等你。" }], null, npc);
      return;
    }
    if (chapter3State.phase === "ready_report") {
      startChapter3ReadyDialogue(npc);
      return;
    }
    if (chapter3State.phase === "ready_stream") {
      startDialogue(
        [
          { actor: npc, speaker: npc.label, body: "直播室在旁邊，趕緊進房間開始直播" },
          { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "親親子我會支持你的" },
          { actor: getCharacterById("npc3") || player, speaker: "親親子", body: "❤️" },
        ],
        null,
        npc
      );
      return;
    }
    if (chapter3State.phase === "completed") {
      startDialogue([{ actor: npc, speaker: npc.label, body: "今天表現還行，明天繼續收護貝費。" }], null, npc);
      return;
    }
  }

  if (isChapter2Started() && currentMapIndex === 9) {
    startChapter2QuestDialogue(npc);
    return;
  }

  if (questState === "inactive") {
    startDialogue(
      [
        {
          actor: npc,
          speaker: npc.label,
          body: "好醜的生物...，對了你知道哪裡有中之人可以幫我賺錢嗎，最好是三個，你去幫我找來。",
        },
        { actor: player, speaker: player.label, body: "我為甚麼要幫你。" },
        { actor: npc, speaker: npc.label, body: "快去辣。" },
        { actor: player, speaker: player.label, body: "嗚..." },
      ],
      () => {
        questState = "accepted";
        questUnlocked = true;
      },
      npc
    );
    return;
  }

  if (questState === "accepted") {
    startDialogue([{ actor: npc, speaker: npc.label, body: "先去把三個 VT 找齊，再回來找我。" }], null, npc);
    return;
  }

  if (questState === "ready") {
    startDialogue(
      [
        { actor: npc, speaker: npc.label, body: "三個 VT 都找齊了？" },
        { actor: player, speaker: player.label, body: "都找到了，大哥" },
        { actor: npc, speaker: npc.label, body: "好，從今以後就讓他們三個來收保護貝，收不到的通通剪掉" },
        {
          actor: player,
          speaker: player.label,
          body: "",
          choices: [
            {
              label: "是的大哥，我會好好教育她們的!",
              onSelect: () => finishQuestObedientEnding(),
            },
            {
              label: "誰理你啊，搞清楚現在是4打1",
              onSelect: () => startXiaoChallengeDialogue(npc),
            },
          ],
        },
      ],
      null,
      npc
    );
    return;
  }

  if (questState === "battle") {
    startDialogue([{ actor: npc, speaker: npc.label, body: "事情都還沒收尾，先別來煩我。" }], null, npc);
    return;
  }

  startDialogue([{ actor: npc, speaker: npc.label, body: "任務已經做完了，去忙你的吧。" }], null, npc);
}

function startChapter2QuestDialogue(npc) {
  if (chapter2State.phase === "go_xd") {
    startDialogue(
      [
        { actor: npc, speaker: npc.label, body: "部門成立審核開始。你們要把 VT 部門掛起來，先把設備跟直播室準備好。" },
        { actor: player, speaker: player.label, body: "我都把中之人找來了，這些東西不該是叉滴娛樂要準備的嗎？" },
        { actor: npc, speaker: npc.label, body: "皮要不要錢、設備要不要錢、發票要不要錢，叫什麼叫？" },
        { actor: npc, speaker: npc.label, body: "叉滴娛樂只是個Line群組，沒空幫你們準備這些東西。" },
        { actor: player, speaker: player.label, body: "這到底是甚麼破公司..." },
        { actor: npc, speaker: npc.label, body: "你說甚麼?" },
        { actor: player, speaker: player.label, body: "沒事..." },
      ],
      () => {
        chapter2State.phase = "tasks";
        chapter2State.reviewDone = true;
        saveGame();
      },
      npc
    );
    return;
  }

  if (chapter2State.phase === "tasks") {
    refreshChapter2Progress();
    if (chapter2State.phase === "ready") {
      startChapter2CompletionDialogue(npc);
      return;
    }
    if (!chapter2State.floorMatIntroShown) {
      chapter2State.floorMatIntroShown = true;
      saveGame();
      startFloorMatIntroDialogue(npc);
      return;
    }
    startDialogue(
      [
        { actor: npc, speaker: npc.label, body: getChapter2XiaoTaskReminderText() },
        { actor: player, speaker: player.label, body: "我會處理的...大哥..." },
      ],
      null,
      npc
    );
    return;
  }

  if (chapter2State.phase === "ready") {
    startChapter2CompletionDialogue(npc);
    return;
  }

  if (chapter2State.phase === "completed") {
    startDialogue([{ actor: npc, speaker: npc.label, body: "VT 部門掛起來了，接下來就是收護貝費。" }], null, npc);
    return;
  }

  startDialogue([{ actor: npc, speaker: npc.label, body: "先去叉滴娛樂報到。" }], null, npc);
}

function startFloorMatIntroDialogue(npc) {
  startDialogue(
    [
      { actor: npc, speaker: npc.label, body: "在還沒找到直播室前，如果中之人累了可以到旁邊的地舖水餃" },
      { actor: player, speaker: player.label, body: "為什麼要一定要在那裏水餃，不是到處都可以水嗎" },
      { actor: vtNpcs[0], speaker: "三個VT", body: "人家是可可愛愛的VT，不能在路邊水餃喔" },
      { actor: player, speaker: player.label, body: "..." },
    ],
    null,
    npc
  );
}

function getChapter2XiaoTaskReminderText() {
  return chapter2State.exitReminderShown
    ? "設備、直播室、門口菸味，三個都處理完再回來。"
    : "設備、直播室，兩個都處理完再回來。";
}

function getChapter2MissingTaskText() {
  const missing = [];
  if (!hasAllChapter2Equipment()) missing.push("設備還沒買齊");
  if (!chapter2State.roomUnlocked) missing.push("直播室還沒處理");
  if (!chapter2State.exitReminderShown) missing.push("離開 XD 前再聽蕭政銘補充");
  else if (!chapter2State.smokersCleared) missing.push("門口抽菸的還沒離開");
  return missing.length ? `還缺：${missing.join("、")}。` : "都好了。";
}

function startChapter2CompletionDialogue(npc) {
  startDialogue(
    [
      { actor: player, speaker: player.label, body: "設備買好了，直播室也搞定了，門口那兩個抽菸的也處理掉了。" },
      { actor: npc, speaker: npc.label, body: "麥克風、變聲器、直播燈，都有？" },
      { actor: player, speaker: player.label, body: "有。只是護貝費花到我眼神都空了。" },
      { actor: npc, speaker: npc.label, body: "直播室呢？" },
      { actor: player, speaker: player.label, body: "有一間 HOTEL 房，來源非常和平，應該吧。" },
      { actor: npc, speaker: npc.label, body: "門口那兩個呢？" },
      { actor: player, speaker: player.label, body: "已經請兩個抽菸的妹妹離開了。" },
      { actor: npc, speaker: npc.label, body: "她們好像是子魚計畫和羊羊星球派來搞事的。" },
      { actor: npc, speaker: npc.label, body: "之後一定給她們好看。" },
      { actor: npc, speaker: npc.label, body: "好，叉滴娛樂 VT 部門今天成立。" },
      { actor: vtNpcs[0], speaker: vtNpcs[0].label, body: "所以成立之後有東西吃嗎？" },
      { actor: vtNpcs[1], speaker: vtNpcs[1].label, body: "我可以去水餃了嗎..." },
      { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "先說好，我只是來騙錢的。" },
      { actor: npc, speaker: npc.label, body: "很好，精神很叉滴。從今天開始，你們就是 VT 部門。" },
      { actor: npc, speaker: npc.label, body: "明天開始準備首播，收不到護貝費的，照規矩處理。" },
      { actor: player, speaker: player.label, body: "這公司真的有問題..." },
      { actor: npc, speaker: npc.label, body: "你說甚麼？" },
      { actor: player, speaker: player.label, body: "我說叉滴娛樂萬歲。" },
      { actor: npc, speaker: npc.label, body: "你們先去水餃，明天到直播室準備初配信。" },
      { actor: player, speaker: player.label, body: "都不用先預告日期?" },
      { actor: npc, speaker: npc.label, body: "沒事，我會帶親親幫過去。" },
      { actor: player, speaker: player.label, body: "什麼跟甚麼..." },
    ],
    () => {
      chapter2State.phase = "completed";
      chapter2State.completed = true;
      chapter3State = {
        ...createDefaultChapter3State(),
        phase: "need_rest",
      };
      saveGame();
      startChapterCompleteTransition("第二章 VT部門成立...完");
    },
    npc
  );
}

function startHotelOtakuDialogue() {
  if (currentMapIndex === 11 && chapter4State.phase === "base_captive") {
    startDialogue(
      [
        { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "親親子在這裡就好...可是我們現在是不是也出不去了。" },
        { actor: player, speaker: player.label, body: "先別吵，想辦法出去。" },
      ],
      null,
      hotelOtakuNpc
    );
    return;
  }
  if (chapter4State.phase === "got_c22") {
    startChapter4C22TransformDialogue();
    return;
  }
  if (chapter4State.phase === "base_entry") {
    startDialogue(
      [
        { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "藥都吃下去了，接下來只能去 SECTOR 03 了吧。" },
        { actor: player, speaker: player.label, body: "看我怎麼把親親子救回來。" },
      ],
      null,
      hotelOtakuNpc
    );
    return;
  }
  if (!chapter2State.reviewDone) {
    startDialogue([{ actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "我只是來睡覺的，不要看我。" }], null, hotelOtakuNpc);
    return;
  }

  if (chapter3State.kinkoFound) {
    startKinkoOtakuDailyFeeDialogue();
    return;
  }

  if (chapter2State.roomUnlocked) {
    startDialogue(
      [
        { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "這樣我要睡哪？" },
        { actor: player, speaker: player.label, body: "你睡門外吧。" },
      ],
      null,
      hotelOtakuNpc
    );
    return;
  }

  if (!chapter2State.reviewDone) {
    startDialogue([{ actor: player, speaker: player.label, body: "這不是我的房間。" }], null, player);
    return;
  }

  startDialogue(
    [
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: `房間可以借你，${CHAPTER2_ROOM_FEE} 護貝費。不要的話就不要吵。` },
      {
        actor: player,
        speaker: player.label,
        body: "",
        choices: [
          {
            label: `付 ${CHAPTER2_ROOM_FEE} 護貝費`,
            onSelect: () => {
              if (shellFee < CHAPTER2_ROOM_FEE) {
                startDialogue([{ actor: player, speaker: player.label, body: "護貝費不夠，錢包比公司制度還空。" }], null, player);
                return;
              }
              shellFee -= CHAPTER2_ROOM_FEE;
              unlockHotelRoomByPayment();
            },
          },
          {
            label: "直接搶房間",
            onSelect: () => openHotelOtakuBattle(),
          },
        ],
      },
    ],
    null,
    hotelOtakuNpc
  );
}

function startKinkoOtakuDailyFeeDialogue() {
  const kinko = getCharacterById("npc3");
  if (!isActorInTeam("npc3")) {
    startDialogue(
      [
        { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "親親子呢，我好想她" },
        { actor: player, speaker: player.label, body: "親親子不在場，看起來騙不到...我是說收不到護貝費。" },
      ],
      null,
      hotelOtakuNpc
    );
    return;
  }

  if (chapter3State.kinkoOtakuFeeNeedsMapChange) {
    startDialogue(
      [{ actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "早安親親子，今天也很可愛喔" }],
      null,
      hotelOtakuNpc
    );
    return;
  }

  if (chapter3State.lastKinkoOtakuFeeDay === currentDay) {
    startDialogue(
      [
        { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "今天已經給過了，頭號大乾爹也是有極限的..." },
        { actor: kinko || player, speaker: kinko?.label || "親親子", body: "明天記得繼續支持喔，哼哼。" },
      ],
      null,
      hotelOtakuNpc
    );
    return;
  }

  addShellFee(CHAPTER3_KINKO_OTAKU_FEE);
  addPopularityReward("npc3", CHAPTER3_DAILY_POPULARITY_GAIN);
  chapter3State.lastKinkoOtakuFeeDay = currentDay;
  saveGame();
  startDialogue(
    [
      { actor: kinko || player, speaker: kinko?.label || "親親子", body: "今天的頭號大乾爹支援方案，開始。" },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "雖然沒地方睡，但我還是會支持你的..." },
      { actor: player, speaker: player.label, body: "這收入模式真的越來越叉滴了。" },
    ],
    null,
    hotelOtakuNpc
  );
}

function handleFatDumbDailyInteraction(fatDumb) {
  if (!isFatDumbDailyEligible()) return false;
  const pig = getCharacterById("npc1");
  if (chapter3State.pigDate?.status === "running") {
    startDialogue(
      [
        { actor: fatDumb, speaker: fatDumb.label, body: "豬鼻醬還在約會中，我正在努力守護我的錢包。" },
        { actor: player, speaker: player.label, body: `再等 ${formatCountdown(chapter3State.pigDate.remaining)} 吧。` },
      ],
      null,
      fatDumb
    );
    return true;
  }
  if (chapter3State.pigDate?.status === "done") {
    finishPigDateActivity(fatDumb, pig);
    return true;
  }
  if (chapter3State.lastPigDateDay === currentDay) {
    startDialogue(
      [
        { actor: fatDumb, speaker: fatDumb.label, body: "今天已經約過了，再約我會先破產。" },
        { actor: pig || player, speaker: pig?.label || "豬鼻醬", body: "明天也可以吃嗎？" },
      ],
      null,
      fatDumb
    );
    return true;
  }
  if (!isActorInTeam("npc1")) {
    startDialogue(
      [
        { actor: fatDumb, speaker: fatDumb.label, body: "豬鼻醬不在嗎？那我便當先收好。" },
        { actor: player, speaker: player.label, body: "你看起來像是在逃過一劫。" },
      ],
      null,
      fatDumb
    );
    return true;
  }

  startDialogue(
    [
      { actor: fatDumb, speaker: fatDumb.label, body: "豬鼻醬今天有空嗎？我想請她去試吃。" },
      { actor: pig, speaker: pig?.label || "豬鼻醬", body: "試吃？姐姐可以。" },
      { actor: player, speaker: player.label, body: "你不怕她吃垮你嗎嗎。" },
      {
        actor: player,
        speaker: player.label,
        body: "",
        choices: [
          { label: "和豬鼻醬約會", onSelect: () => startPigDateActivity(fatDumb) },
          { label: "先不要", onSelect: () => startDialogue([{ actor: player, speaker: player.label, body: "先別讓便當界承受這麼大的壓力。" }], null, player) },
        ],
      },
    ],
    null,
    fatDumb
  );
  return true;
}

function startPigDateActivity(fatDumb) {
  const pig = getCharacterById("npc1");
  startDialogue(
    [
      { actor: fatDumb, speaker: fatDumb.label, body: "那我們去吃點東西吧，我只帶了一點點護貝費。" },
      { actor: pig || player, speaker: pig?.label || "豬鼻醬", body: "一點點也可以很多點點。" },
      { actor: player, speaker: player.label, body: "胖呆，如果你回不來，我會記得你。" },
    ],
    () => {
      chapter3State.pigDate = {
        status: "running",
        remaining: CHAPTER3_DAILY_ACTIVITY_DURATION,
        day: currentDay,
      };
      sendChapter3MemberAway("npc1");
      placePigInFrontOfFatDumb(fatDumb);
      saveGame();
    },
    fatDumb
  );
}

function finishPigDateActivity(fatDumb, pig) {
  chapter3State.pigDate.status = "collecting";
  pig = placePigInFrontOfFatDumb(fatDumb) || pig;
  startDialogue(
    [
      { actor: fatDumb, speaker: fatDumb.label, body: "約會結束了，她吃了三份甜點，帳單也很有份量。" },
      { actor: pig || player, speaker: pig?.label || "豬鼻醬", body: "人家是在做美食調查。" },
      { actor: player, speaker: player.label, body: "調查到胖呆的錢包哭了。" },
      { actor: fatDumb, speaker: fatDumb.label, body: "可是她吃東西真的很有畫面，我願意斗內。" },
    ],
    () => {
      addShellFee(CHAPTER3_DAILY_ACTIVITY_FEE);
      addPopularityReward("npc1", CHAPTER3_DAILY_POPULARITY_GAIN);
      chapter3State.lastPigDateDay = chapter3State.pigDate.day || currentDay;
      chapter3State.pigDate = { status: "idle", remaining: 0, day: 0 };
      returnDailyActivityMember("npc1", "豬鼻醬人氣上升");
      saveGame();
    },
    fatDumb
  );
}

function placePigInFrontOfFatDumb(fatDumb) {
  if (!fatDumb) return null;
  const road = getCurrentRoad();
  const pig = placeDailyActivityMember(
    "npc1",
    fatDumb.x,
    clamp(fatDumb.y + 46, road.top + 18, road.bottom - 18),
    "up"
  );
  fatDumb.direction = "down";
  fatDumb.idleDirection = "down";
  fatDumb.walkTime = 0;
  seedTrail(fatDumb);
  return pig;
}

function startSmokerRequestDialogue(target) {
  startDialogue(
    [
      { actor: player, speaker: player.label, body: "可以請你們離開嗎" },
      { actor: target, speaker: target.label, body: "我們是來收護貝費的，不是來讓路的。" },
      {
        actor: player,
        speaker: player.label,
        body: "所以要怎樣才肯離開？",
        choices: [
          {
            label: `繳 ${CHAPTER2_SMOKER_FEE} 護貝費`,
            onSelect: () => {
              if (shellFee < CHAPTER2_SMOKER_FEE) {
                startDialogue([{ actor: player, speaker: player.label, body: "護貝費不夠，連被勒索都不夠格。" }], null, player);
                return;
              }
              shellFee -= CHAPTER2_SMOKER_FEE;
              clearSmokers("payment");
            },
          },
          {
            label: "直接請她們離開",
            onSelect: () => openSmokerBattle(target),
          },
        ],
      },
    ],
    null,
    target
  );
}

function canStartBattleAgainst(actor, speaker) {
  if (getCharacterCurrentHp("hero") > 0) return true;
  startDialogue([{ actor: actor || player, speaker: speaker || "對方", body: "你沒血了，漢堡" }], null, actor || null);
  return false;
}

function openRecruitBattle(npc) {
  if (!canStartBattleAgainst(npc, npc.label)) return;
  const party = [{ actor: player, key: "hero", name: player.label, ...PARTY_STATS.hero }];
  openSlotBattle({
    mode: "recruit",
    stage: 1,
    recruitNpc: npc,
    enemyActor: npc,
    enemyName: npc.label,
    party,
    enemyUnitId: npc.id,
    enemySkills: buildRecruitEnemySkills(npc),
  });
}

function openBattle() {
  if (!canStartBattleAgainst(null, "野豬老大")) return;
  const party = [
    { actor: player, key: "hero", name: player.label, ...PARTY_STATS.hero },
    ...getOrderedFollowers().map((npc) => ({
      actor: npc,
      key: npc.id,
      name: npc.label,
      ...PARTY_STATS[npc.id],
    })),
  ];

  openSlotBattle({
    mode: "boss",
    stage: 32,
    enemyName: "野豬老大",
    party,
    enemyUnitId: "boss",
    enemySkills: BOSS_SKILLS,
  });
}

function openXiaoBattle(options = {}) {
  if (!canStartBattleAgainst(questNpc, "蕭政銘")) return;
  const party = [
    { actor: player, key: "hero", name: player.label, ...PARTY_STATS.hero },
    ...getOrderedFollowers().map((npc) => ({
      actor: npc,
      key: npc.id,
      name: npc.label,
      ...PARTY_STATS[npc.id],
    })),
  ];

  openSlotBattle({
    mode: "xiao",
    stage: 99,
    enemyActor: questNpc,
    enemyName: "蕭政銘",
    party,
    enemyUnitId: "npc4",
    enemySkills: XIAO_SKILLS,
    enemyMaxHp: 18888,
    enemyDamageScale: 1.85,
    playerDamageScale: 0.82,
    xiaoReviveAfterEnding: Boolean(options.reviveAfterEnding),
  });
}

function getActiveBattleParty() {
  sanitizeTeamSlots();
  return teamSlots
    .map(getCharacterById)
    .filter((actor) => actor && (actor.id === "hero" || actor.following))
    .map((actor) => ({
      actor,
      key: actor.id,
      name: actor.label,
      ...PARTY_STATS[actor.id],
    }));
}

function isActiveBattlePartyFullyHealed() {
  return getActiveBattleParty().every((member) => getCharacterCurrentHp(member.key) >= getCharacterMaxHp(member.key));
}

function createBattlePartyFromIds(actorIds) {
  return actorIds
    .map(getCharacterById)
    .filter(Boolean)
    .map((actor) => ({
      actor,
      key: actor.id,
      name: actor.label,
      ...(PARTY_STATS[actor.id] || {}),
    }));
}

function openHotelOtakuBattle() {
  if (!canStartBattleAgainst(hotelOtakuNpc, hotelOtakuNpc.label)) return;
  openSlotBattle({
    mode: "chapter2-room",
    stage: 2,
    enemyActor: hotelOtakuNpc,
    enemyName: "肥宅",
    party: getActiveBattleParty(),
    enemyUnitId: "hotel_otaku",
    enemySkills: FAT_OTAKU_SKILLS,
    enemyMaxHp: 2100,
    enemyDamageScale: 0.88,
    shellFeeReward: 120,
    expReward: 70,
    onWin: () => unlockHotelRoomByBattle(),
    onLose: () => startDialogue([{ actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "這是我的房間啦，不要亂搶。" }], null, hotelOtakuNpc),
  });
}

function openSmokerBattle(target) {
  if (!canStartBattleAgainst(target, target.label)) return;
  const aki = getCharacterById("npc12");
  const cigarette = getCharacterById("npc36");
  openSlotBattle({
    mode: "chapter2-smokers",
    stage: 2,
    enemyName: "抽菸二人組",
    party: getActiveBattleParty(),
    enemies: [
      {
        enemyActor: aki,
        enemyName: aki?.label || "阿基親親獸",
        enemyUnitId: "npc12",
        enemySkills: [
          ...(PLAYER_SKILLS_BY_ACTOR.npc12 || []),
          { id: "aki_collect_fee", owner: "阿基親親獸", name: "護貝費收取", type: "physical" },
        ],
        enemyMaxHp: 3600,
        targetOffsetX: 0,
        targetOffsetY: -56,
      },
      {
        enemyActor: cigarette,
        enemyName: cigarette?.label || "菸頭親親獸",
        enemyUnitId: "npc36",
        enemySkills: [
          ...(PLAYER_SKILLS_BY_ACTOR.npc36 || []),
          { id: "butt_smoke_cloud", owner: "菸頭親親獸", name: "煙霧結界", type: "debuff" },
        ],
        enemyMaxHp: 3400,
        targetOffsetX: 78,
        targetOffsetY: -4,
      },
    ],
    enemyDamageScale: 1.25,
    playerDamageScale: 0.86,
    shellFeeReward: 160,
    expReward: 125,
    onWin: () => clearSmokers("battle"),
    onLose: () => {
      resetSmokerPositions();
      startSmokerDefeatDialogue(target);
    },
  });
}

function openEarlyMobBattle(target) {
  if (!canStartBattleAgainst(target, target.label)) return;
  const actorSkillId = target.sprite === "npc35" ? "npc35" : target.id;
  const sourceSkills = target.sprite === "npc35" ? PLAYER_SKILLS_BY_ACTOR.npc35 : EARLY_MOB_SKILLS;
  const skills = sourceSkills.map((skill) => ({
    ...skill,
    id: target.sprite === "npc35" ? skill.id : `${target.id}_${skill.id}`,
    owner: target.label,
  }));
  openSlotBattle({
    mode: "chapter2-mob",
    stage: 2,
    enemyActor: target,
    enemyName: target.label,
    party: getActiveBattleParty(),
    enemyUnitId: actorSkillId,
    enemySkills: skills,
    enemyMaxHp: 1280,
    enemyDamageScale: 0.72,
    shellFeeReward: CHAPTER2_MOB_REWARD,
    expReward: CHAPTER2_MOB_EXP,
    onWin: () => finishEarlyMobBattle(target),
    onLose: () => startDialogue([{ actor: target, speaker: target.label, body: "你先去補血啦。" }], null, target),
  });
}

function openKinkoExBattle(target = kinkoExNpc) {
  if (!canStartBattleAgainst(target, target.label)) return;
  openSlotBattle({
    mode: "chapter4-ex",
    stage: 4,
    enemyActor: target,
    enemyName: target.label,
    party: [
      { actor: player, key: "hero", name: player.label, ...PARTY_STATS.hero },
      { actor: questNpc, key: "npc4", name: questNpc.label, ...PARTY_STATS.npc4 },
    ],
    enemyUnitId: "kinko_ex",
    enemySkills: KINKO_EX_SKILLS,
    enemyMaxHp: 2600,
    enemyDamageScale: 0.92,
    playerDamageScale: 1.05,
    shellFeeReward: 80,
    expReward: 90,
    onWin: () => finishKinkoExBattle(),
    onLose: () => {
      startDialogue(
        [
          { actor: target, speaker: target.label, body: "叫親親子出來，不然我每天都來。" },
          { actor: questNpc, speaker: questNpc.label, body: "先去補血，等等再把他攆走。" },
        ],
        null,
        target
      );
    },
  });
}

function finishKinkoExBattle() {
  chapter4State.phase = "post_ex_xd";
  chapter4State.exDefeated = true;
  kinkoExNpc.mapId = currentMapIndex;
  kinkoExNpc.staticNpc = true;
  kinkoExNpc.fixedPlacement = true;
  kinkoExNpc.walkTime = 0;
  questNpc.following = false;
  questNpc.staticNpc = true;
  questNpc.fixedPlacement = true;
  placeStaticActor(questNpc, currentMapIndex, {
    x: clamp(player.x + 72, getCurrentRoad().left + 18, getCurrentRoad().right - 18),
    y: player.y,
    direction: "left",
  }, { layingDown: false });
  saveGame();
  startDialogue(
    [
      { actor: kinkoExNpc, speaker: kinkoExNpc.label, body: "你們等著..." },
      { actor: player, speaker: player.label, body: "門口終於安靜了。" },
      { actor: questNpc, speaker: questNpc.label, body: "哪來的破事...回去吧" },
    ],
    () => {
      startKinkoExDeparture();
      startChapter4XiaoEnterXdDeparture();
    },
    kinkoExNpc
  );
}

function finishQuestObedientEnding(playerLine = "是的大哥，我會好好教育她們的!") {
  questState = "completed";
  startDialogue(
    [
      { actor: player, speaker: player.label, body: playerLine },
      ...vtNpcs.map((npc) => ({ actor: npc, speaker: npc.label, body: "好..." })),
      { actor: questNpc, speaker: questNpc.label, body: "人有了，接下來去叉滴娛樂，把 VT 部門掛起來。" },
      { actor: questNpc, speaker: questNpc.label, body: "我先到叉滴娛樂等你們了。" },
    ],
    () => startChapterCompleteTransition("第一章 3V集結...完", () => startChapter2Departure()),
    questNpc
  );
}

function startChapter2Departure() {
  chapter2State = {
    ...createDefaultChapter2State(),
    phase: "go_xd",
  };
  restoreChapter2MobWorldState();
  questNpc.mapId = 0;
  questNpc.staticNpc = false;
  questNpc.fixedPlacement = false;
  questNpc.direction = "left";
  questNpc.walkTime = 0;
  xiaoDeparture = { speed: 310 };
  saveGame();
}

function finishChapter2Departure() {
  xiaoDeparture = null;
  chapter2State.phase = "go_xd";
  chapter2State.xiaoDeparted = true;
  questNpc.mapId = 9;
  questNpc.x = XIAO_XD_POSITION.x;
  questNpc.y = XIAO_XD_POSITION.y;
  questNpc.direction = XIAO_XD_POSITION.direction;
  questNpc.idleDirection = XIAO_XD_POSITION.direction;
  questNpc.staticNpc = true;
  questNpc.fixedPlacement = true;
  questNpc.walkTime = 0;
  seedTrail(questNpc);
  restoreChapter2MobWorldState();
  saveGame();
}

function startChapter3XiaoDeparture() {
  chapter3State.phase = "find_members";
  chapter3State.xiaoBriefed = true;
  placeChapter3SearchActors();
  questNpc.mapId = currentMapIndex;
  questNpc.staticNpc = false;
  questNpc.fixedPlacement = false;
  questNpc.layingDown = false;
  questNpc.direction = CHAPTER3_XIAO_XD_EXIT_POSITION.direction;
  questNpc.walkTime = 0;
  xiaoDeparture = {
    mode: "chapter3-room",
    speed: 300,
    targetX: CHAPTER3_XIAO_XD_EXIT_POSITION.x,
    targetY: CHAPTER3_XIAO_XD_EXIT_POSITION.y,
  };
  seedTrail(questNpc);
  saveGame();
}

function startChapter4XiaoEnterXdDeparture() {
  const xdEntry = TELEPORT_POINTS.find((point) => point.id === "xd_entry");
  questNpc.following = false;
  questNpc.staticNpc = false;
  questNpc.fixedPlacement = false;
  questNpc.layingDown = false;
  questNpc.mapId = currentMapIndex;
  questNpc.direction = "left";
  questNpc.walkTime = 0;
  xiaoDeparture = {
    mode: "chapter4-xd-entry",
    speed: 300,
    targetX: xdEntry?.x || 945,
    targetY: 638,
  };
  seedTrail(questNpc);
  saveGame();
}

function finishChapter3XiaoDeparture() {
  xiaoDeparture = null;
  placeStaticActor(questNpc, 7, CHAPTER3_XIAO_ROOM_POSITION, { layingDown: false });
  saveGame();
}

function finishChapter4XiaoEnterXdDeparture() {
  xiaoDeparture = null;
  placeXiaoAtXdOffice();
  saveGame();
}

function updateXiaoDeparture(delta) {
  if (!xiaoDeparture) return;
  if (xiaoDeparture.mode === "chapter3-room" || xiaoDeparture.mode === "chapter4-xd-entry") {
    const dx = xiaoDeparture.targetX - questNpc.x;
    const dy = xiaoDeparture.targetY - questNpc.y;
    const distance = Math.hypot(dx, dy);
    const step = xiaoDeparture.speed * delta;
    if (distance <= step) {
      questNpc.x = xiaoDeparture.targetX;
      questNpc.y = xiaoDeparture.targetY;
      if (xiaoDeparture.mode === "chapter4-xd-entry") finishChapter4XiaoEnterXdDeparture();
      else finishChapter3XiaoDeparture();
      return;
    }
    questNpc.x += (dx / distance) * step;
    questNpc.y += (dy / distance) * step;
    questNpc.direction = axisToDirection(dx, dy);
    questNpc.walkTime += delta * 7;
    if (isActorOutsideCameraView(questNpc)) {
      if (xiaoDeparture.mode === "chapter4-xd-entry") finishChapter4XiaoEnterXdDeparture();
      else finishChapter3XiaoDeparture();
    }
    return;
  }

  questNpc.x -= xiaoDeparture.speed * delta;
  questNpc.direction = "left";
  questNpc.walkTime += delta * 7;
  if (questNpc.x < getCurrentRoad().left - 120 || isActorOutsideCameraView(questNpc)) {
    finishChapter2Departure();
  }
}

function isSmokerDepartureActor(npc) {
  return Boolean(smokerDeparture?.ids?.includes(npc.id));
}

function startSmokerDeparture() {
  const ids = ["npc12", "npc36"];
  ids.forEach((id) => {
    const npc = getCharacterById(id);
    if (!npc) return;
    npc.mapId = currentMapIndex;
    npc.staticNpc = false;
    npc.fixedPlacement = false;
    npc.direction = "left";
    npc.walkTime = 0;
    seedTrail(npc);
  });
  smokerDeparture = { ids, speed: 230 };
}

function updateSmokerDeparture(delta) {
  if (!smokerDeparture) return;
  const road = getCurrentRoad();
  const departing = smokerDeparture.ids
    .map((id) => getCharacterById(id))
    .filter(Boolean);

  departing.forEach((npc) => {
    npc.x -= smokerDeparture.speed * delta;
    npc.direction = "left";
    npc.walkTime += delta * 7;
    recordTrailPoint(npc);
  });

  if (departing.every((npc) => npc.x < road.left - 140 || isActorOutsideCameraView(npc))) {
    finishSmokerDeparture();
  }
}

function finishSmokerDeparture() {
  const ids = smokerDeparture?.ids || ["npc12", "npc36"];
  smokerDeparture = null;
  chapter2State.smokersCleared = true;
  ids.forEach((id) => {
    const npc = getCharacterById(id);
    if (!npc) return;
    npc.mapId = 99;
    npc.staticNpc = true;
    npc.fixedPlacement = true;
    npc.walkTime = 0;
    seedTrail(npc);
  });
  refreshChapter2Progress();
  saveGame();
}

function startFatDumbDeparture() {
  const fatDumb = getCharacterById("npc8");
  if (!fatDumb) {
    saveGame();
    return;
  }
  fatDumb.mapId = currentMapIndex;
  fatDumb.staticNpc = false;
  fatDumb.fixedPlacement = false;
  fatDumb.direction = "right";
  fatDumb.walkTime = 0;
  fatDumbDeparture = { speed: 230 };
  seedTrail(fatDumb);
}

function updateFatDumbDeparture(delta) {
  if (!fatDumbDeparture) return;
  const fatDumb = getCharacterById("npc8");
  if (!fatDumb) {
    fatDumbDeparture = null;
    return;
  }
  fatDumb.x += fatDumbDeparture.speed * delta;
  fatDumb.direction = "right";
  fatDumb.walkTime += delta * 7;
  recordTrailPoint(fatDumb);
  if (fatDumb.x > getCurrentRoad().right + 140 || isActorOutsideCameraView(fatDumb)) {
    finishFatDumbDeparture();
  }
}

function finishFatDumbDeparture() {
  const fatDumb = getCharacterById("npc8");
  fatDumbDeparture = null;
  if (fatDumb) {
    fatDumb.mapId = 99;
    fatDumb.staticNpc = true;
    fatDumb.fixedPlacement = true;
    fatDumb.walkTime = 0;
    seedTrail(fatDumb);
  }
  saveGame();
}

function startKidneyDeparture() {
  const kidney = getCharacterById("npc14");
  if (!kidney) {
    saveGame();
    return;
  }
  kidney.mapId = currentMapIndex;
  kidney.staticNpc = false;
  kidney.fixedPlacement = false;
  kidney.layingDown = false;
  kidney.direction = "right";
  kidney.idleDirection = "right";
  kidney.walkTime = 0;
  kidneyDeparture = { speed: 210 };
  seedTrail(kidney);
}

function updateKidneyDeparture(delta) {
  if (!kidneyDeparture) return;
  const kidney = getCharacterById("npc14");
  if (!kidney) {
    kidneyDeparture = null;
    return;
  }
  kidney.x += kidneyDeparture.speed * delta;
  kidney.direction = "right";
  kidney.idleDirection = "right";
  kidney.walkTime += delta * 7;
  recordTrailPoint(kidney);
  if (kidney.x > getCurrentRoad().right + 140 || isActorOutsideCameraView(kidney)) {
    finishKidneyDeparture();
  }
}

function finishKidneyDeparture() {
  const kidney = getCharacterById("npc14");
  kidneyDeparture = null;
  if (kidney) {
    kidney.mapId = 99;
    kidney.staticNpc = true;
    kidney.fixedPlacement = true;
    kidney.layingDown = false;
    kidney.walkTime = 0;
    seedTrail(kidney);
  }
  saveGame();
}

function startKinkoExDeparture() {
  kinkoExNpc.mapId = currentMapIndex;
  kinkoExNpc.staticNpc = false;
  kinkoExNpc.fixedPlacement = false;
  kinkoExNpc.direction = "right";
  kinkoExNpc.idleDirection = "right";
  kinkoExNpc.walkTime = 0;
  kinkoExDeparture = { speed: 250 };
  seedTrail(kinkoExNpc);
}

function updateKinkoExDeparture(delta) {
  if (!kinkoExDeparture) return;
  kinkoExNpc.x += kinkoExDeparture.speed * delta;
  kinkoExNpc.direction = "right";
  kinkoExNpc.idleDirection = "right";
  kinkoExNpc.walkTime += delta * 7;
  recordTrailPoint(kinkoExNpc);
  if (kinkoExNpc.x > getCurrentRoad().right + 140 || isActorOutsideCameraView(kinkoExNpc)) {
    finishKinkoExDeparture();
  }
}

function finishKinkoExDeparture() {
  kinkoExDeparture = null;
  kinkoExNpc.mapId = 99;
  kinkoExNpc.staticNpc = true;
  kinkoExNpc.fixedPlacement = true;
  kinkoExNpc.walkTime = 0;
  seedTrail(kinkoExNpc);
  saveGame();
}

function startChapter4ActorMove(actor, target, onComplete = null, options = {}) {
  if (!actor) {
    if (typeof onComplete === "function") onComplete();
    return;
  }
  chapter4CutsceneMove = createChapter4ActorMove(actor, target, options);
  chapter4CutsceneMove.onComplete = onComplete;
}

function startChapter4ActorGroupMove(entries, onComplete = null) {
  const moves = entries
    .map(({ actor, target, options = {} }) => (actor ? createChapter4ActorMove(actor, target, options) : null))
    .filter(Boolean);
  if (!moves.length) {
    if (typeof onComplete === "function") onComplete();
    return;
  }
  chapter4CutsceneMove = { moves, onComplete };
}

function createChapter4ActorMove(actor, target, options = {}) {
  actor.mapId = currentMapIndex;
  actor.following = false;
  actor.staticNpc = false;
  actor.fixedPlacement = false;
  actor.layingDown = false;
  actor.walkTime = 0;
  const move = {
    actor,
    targetX: target.x,
    targetY: target.y,
    speed: options.speed || 250,
    finalDirection: options.finalDirection || target.direction || actor.direction,
    hideOnArrive: Boolean(options.hideOnArrive),
  };
  seedTrail(actor);
  return move;
}

function finishChapter4ActorMove(move) {
  const actor = move.actor;
  actor.x = move.targetX;
  actor.y = move.targetY;
  actor.walkTime = 0;
  actor.direction = move.finalDirection || actor.direction;
  actor.idleDirection = actor.direction;
  actor.staticNpc = !move.hideOnArrive;
  actor.fixedPlacement = !move.hideOnArrive;
  if (move.hideOnArrive) actor.mapId = 99;
  seedTrail(actor);
}

function isActorOutsideCameraView(actor, margin = 120) {
  if (!actor || actor.mapId !== currentMapIndex) return true;
  const screenX = actor.x - camera.x;
  const screenY = actor.y - camera.y;
  return (
    screenX < -margin ||
    screenX > canvas.width + margin ||
    screenY < -margin ||
    screenY > canvas.height + margin
  );
}

function updateChapter4ActorMoveStep(move, delta) {
  const actor = move.actor;
  const dx = move.targetX - actor.x;
  const dy = move.targetY - actor.y;
  const distance = Math.hypot(dx, dy);
  const step = move.speed * delta;
  if (distance <= step) {
    finishChapter4ActorMove(move);
    return true;
  }
  actor.x += (dx / distance) * step;
  actor.y += (dy / distance) * step;
  actor.direction = axisToDirection(dx, dy);
  actor.walkTime += delta * 7;
  recordTrailPoint(actor);
  if (move.hideOnArrive && isActorOutsideCameraView(actor)) {
    finishChapter4ActorMove(move);
    return true;
  }
  return false;
}

function updateChapter4CutsceneMove(delta) {
  if (!chapter4CutsceneMove) return;
  if (chapter4CutsceneMove.moves) {
    const group = chapter4CutsceneMove;
    let allDone = true;
    group.moves.forEach((move) => {
      if (move.done) return;
      move.done = updateChapter4ActorMoveStep(move, delta);
      if (!move.done) allDone = false;
    });
    if (!allDone) return;
    const onComplete = group.onComplete;
    chapter4CutsceneMove = null;
    if (typeof onComplete === "function") onComplete();
    return;
  }
  const move = chapter4CutsceneMove;
  if (updateChapter4ActorMoveStep(move, delta)) {
    const onComplete = move.onComplete;
    chapter4CutsceneMove = null;
    if (typeof onComplete === "function") onComplete();
  }
}

function isChapter2Started() {
  return questState === "completed" && chapter2State.phase !== "locked";
}

function isChapter3Started() {
  return chapter3State.phase !== "locked";
}

function isChapter3SearchingMembers() {
  return ["find_members", "ready_report"].includes(chapter3State.phase);
}

function hideMissingChapter3Members() {
  const missingIds = new Set([
    !chapter3State.pigFound ? "npc1" : null,
    !chapter3State.bebeFound ? "npc2" : null,
    !chapter3State.kinkoFound ? "npc3" : null,
  ].filter(Boolean));

  vtNpcs.forEach((npc) => {
    if (!missingIds.has(npc.id)) return;
    npc.following = false;
    npc.mapId = 99;
    npc.walkTime = 0;
    seedTrail(npc);
  });
  teamSlots.forEach((actorId, index) => {
    if (missingIds.has(actorId)) teamSlots[index] = null;
  });
  sanitizeTeamSlots();
  syncFollowIndexesFromTeamSlots();
}

function placeChapter3SearchActors() {
  const pig = getCharacterById("npc1");
  const fatDumb = getCharacterById("npc8");
  const bebe = getCharacterById("npc2");
  const kidney = getCharacterById("npc14");
  const kinko = getCharacterById("npc3");

  if (pig && !chapter3State.pigFound) placeStaticActor(pig, 1, CHAPTER3_PIG_POSITION, { layingDown: false });
  if (fatDumb && !chapter3State.pigFound) placeStaticActor(fatDumb, 1, CHAPTER3_FATDUMB_POSITION, { layingDown: false });
  if (bebe && !chapter3State.bebeFound) placeStaticActor(bebe, 2, CHAPTER3_BEBE_POSITION, { layingDown: true });
  if (kidney) {
    if (chapter3State.fluteUsed) {
      kidney.mapId = 99;
      kidney.layingDown = false;
    } else {
      placeStaticActor(kidney, 2, CHAPTER3_KIDNEY_POSITION, { layingDown: true });
    }
  }
  if (kinko && !chapter3State.kinkoFound) placeStaticActor(kinko, 7, CHAPTER3_KINKO_POSITION, { layingDown: false });
}

function placeChapter3PartyAtRoom() {
  const roomPositions = [
    { x: 1540, y: 638, direction: "right" },
    { x: 1460, y: 646, direction: "right" },
    { x: 1385, y: 656, direction: "right" },
  ];
  vtNpcs.forEach((npc, index) => {
    npc.following = true;
    npc.mapId = 7;
    npc.x = roomPositions[index].x;
    npc.y = roomPositions[index].y;
    npc.direction = roomPositions[index].direction;
    npc.idleDirection = roomPositions[index].direction;
    npc.staticNpc = false;
    npc.fixedPlacement = false;
    npc.layingDown = false;
    seedTrail(npc);
    addCharacterToTeam(npc.id);
  });
  placeStaticActor(questNpc, 7, CHAPTER3_XIAO_ROOM_POSITION, { layingDown: false });
}

function placeChapter4VtsInXd() {
  vtNpcs.forEach((npc) => {
    const position = CHAPTER4_XD_VT_POSITIONS[npc.id];
    if (!position) return;
    placeStaticActor(npc, 9, position, { layingDown: false });
  });
}

function placeChapter4ExAtDoor() {
  placeStaticActor(kinkoExNpc, 8, CHAPTER4_EX_POSITION, { layingDown: false });
}

function hideChapter4Kinko() {
  chapter4State.kinkoLeft = true;
  sendChapter3MemberAway("npc3");
  enforceChapter4KinkoUnavailable();
}

function isChapter4KinkoUnavailable() {
  const phase = chapter4State?.phase;
  return Boolean(
    chapter4State?.kinkoLeft
    && !chapter4State.rescueFinaleDone
    && !["base_captive", "rescue_cell_found", "rescue_cell_check", "rescue_cell_finale"].includes(phase)
  );
}

function enforceChapter4KinkoUnavailable() {
  if (!isChapter4KinkoUnavailable()) return;
  const kinko = getCharacterById("npc3");
  if (kinko) {
    kinko.following = false;
    kinko.followIndex = 0;
    kinko.staticNpc = true;
    kinko.fixedPlacement = true;
    kinko.layingDown = false;
    kinko.mapId = 99;
    kinko.walkTime = 0;
  }
  teamSlots.forEach((actorId, index) => {
    if (actorId === "npc3") teamSlots[index] = null;
  });
}

function isChapter4CaptivePartyOffscreen() {
  return ["rescue_flashback", "base_rescue", "base_rescue_victory"].includes(chapter4State?.phase);
}

function isChapter4CaptivePartyHiddenActor(actorId) {
  return isChapter4CaptivePartyOffscreen() && CHAPTER4_CAPTIVE_PARTY_IDS.includes(actorId);
}

function shouldExcludeFromFollowerOrder(actor) {
  if (!actor) return true;
  return Boolean(
    (actor.id === "npc3" && isChapter4KinkoUnavailable())
    || isChapter4CaptivePartyHiddenActor(actor.id)
  );
}

function enforceChapter4CaptivePartyOffscreen() {
  if (!isChapter4CaptivePartyOffscreen()) return;
  CHAPTER4_CAPTIVE_PARTY_IDS.forEach((actorId) => {
    const actor = getCharacterById(actorId);
    if (!actor) return;
    actor.following = false;
    actor.followIndex = 0;
    actor.staticNpc = true;
    actor.fixedPlacement = true;
    actor.layingDown = false;
    actor.mapId = 99;
    actor.walkTime = 0;
    seedTrail(actor);
  });
  teamSlots.forEach((actorId, index) => {
    if (CHAPTER4_CAPTIVE_PARTY_IDS.includes(actorId)) teamSlots[index] = null;
  });
}

function returnChapter4RemainingVts() {
  ["npc1", "npc2"].forEach((actorId, index) => {
    const actor = getCharacterById(actorId);
    if (!actor) return;
    actor.following = true;
    actor.staticNpc = false;
    actor.fixedPlacement = false;
    actor.layingDown = false;
    actor.mapId = currentMapIndex;
    actor.x = clamp(player.x - 42 - index * 32, getCurrentRoad().left + 18, getCurrentRoad().right - 18);
    actor.y = clamp(player.y + 28 + index * 24, getCurrentRoad().top + 18, getCurrentRoad().bottom - 18);
    actor.direction = player.direction;
    actor.idleDirection = player.direction;
    addCharacterToTeam(actor.id);
    seedTrail(actor);
  });
}

function followChapter4RemainingVtsFromCurrentPositions() {
  ["npc1", "npc2"].forEach((actorId) => {
    const actor = getCharacterById(actorId);
    if (!actor) return;
    actor.following = true;
    actor.staticNpc = false;
    actor.fixedPlacement = false;
    actor.layingDown = false;
    actor.mapId = currentMapIndex;
    actor.direction = axisToDirection(player.x - actor.x, player.y - actor.y);
    actor.idleDirection = actor.direction;
    actor.walkTime = 0;
    addCharacterToTeam(actor.id);
    seedTrail(actor);
  });
  syncFollowIndexesFromTeamSlots();
}

function returnChapter4AllVts() {
  ["npc1", "npc2", "npc3"].forEach((actorId, index) => {
    const actor = getCharacterById(actorId);
    if (!actor) return;
    actor.following = true;
    actor.staticNpc = false;
    actor.fixedPlacement = false;
    actor.layingDown = false;
    actor.mapId = currentMapIndex;
    actor.x = clamp(player.x - 42 - index * 30, getCurrentRoad().left + 18, getCurrentRoad().right - 18);
    actor.y = clamp(player.y + 26 + index * 22, getCurrentRoad().top + 18, getCurrentRoad().bottom - 18);
    actor.direction = player.direction;
    actor.idleDirection = player.direction;
    addCharacterToTeam(actor.id);
    seedTrail(actor);
  });
}

function startChapter4XiaoFollowing(syncNearPlayer = true) {
  questNpc.following = true;
  questNpc.staticNpc = false;
  questNpc.fixedPlacement = false;
  questNpc.layingDown = false;
  questNpc.speed = 255;
  questNpc.mapId = currentMapIndex;
  questNpc.direction = player.direction;
  questNpc.idleDirection = player.direction;
  if (syncNearPlayer) {
    questNpc.x = clamp(player.x - 56, getCurrentRoad().left + 18, getCurrentRoad().right - 18);
    questNpc.y = clamp(player.y + 42, getCurrentRoad().top + 18, getCurrentRoad().bottom - 18);
  }
  addCharacterToTeam(questNpc.id, { announce: true });
  syncFollowIndexesFromTeamSlots();
  seedTrail(questNpc);
}

function placeXiaoAtXdOffice() {
  placeStaticActor(questNpc, 9, XIAO_XD_POSITION, { layingDown: false });
  questNpc.speed = 0;
  questNpc.followIndex = 0;
  questNpc.recruitRetry = false;
  seedTrail(questNpc);
}

function placeStaticActor(actor, mapId, position, options = {}) {
  actor.mapId = mapId;
  actor.x = position.x;
  actor.y = position.y;
  actor.hidden = false;
  actor.direction = position.direction || actor.direction || "down";
  actor.idleDirection = position.direction || actor.idleDirection || actor.direction;
  actor.staticNpc = true;
  actor.fixedPlacement = true;
  actor.following = false;
  actor.layingDown = Boolean(options.layingDown);
  actor.walkTime = 0;
  seedTrail(actor);
}

function getXiaoDialoguePlacement() {
  if (isChapter4Started()) {
    return { mapId: 9, position: XIAO_XD_POSITION };
  }
  if (isChapter3Started() && ["find_members", "ready_report", "ready_stream", "completed"].includes(chapter3State.phase)) {
    return { mapId: 7, position: CHAPTER3_XIAO_ROOM_POSITION };
  }
  if (isChapter2Started()) {
    return { mapId: 9, position: XIAO_XD_POSITION };
  }
  return { mapId: 0, position: { x: 2230, y: 642, direction: "down" } };
}

function resetXiaoToDialoguePosition() {
  const placement = getXiaoDialoguePlacement();
  placeStaticActor(questNpc, placement.mapId, placement.position, { layingDown: false });
}

function returnChapter3Member(actorId, options = {}) {
  const actor = getCharacterById(actorId);
  if (!actor) return;
  actor.following = true;
  actor.staticNpc = false;
  actor.fixedPlacement = false;
  actor.layingDown = false;
  actor.mapId = currentMapIndex;
  actor.direction = player.direction;
  addCharacterToTeam(actor.id);
  seedTrail(actor);
  if (options.floatText) addWorldFloatingText(player.x, player.y - 88, options.floatText, "#75f4b2");
  refreshChapter3Progress();
  saveGame();
}

function sendChapter3MemberAway(actorId) {
  const actor = getCharacterById(actorId);
  if (!actor) return;
  actor.following = false;
  actor.staticNpc = true;
  actor.fixedPlacement = true;
  actor.layingDown = false;
  actor.mapId = 99;
  actor.walkTime = 0;
  teamSlots.forEach((id, index) => {
    if (id === actorId) teamSlots[index] = null;
  });
  sanitizeTeamSlots();
  seedTrail(actor);
}

function returnDailyActivityMember(actorId, floatText) {
  const actor = getCharacterById(actorId);
  if (!actor) return;
  actor.following = true;
  actor.staticNpc = false;
  actor.fixedPlacement = false;
  actor.layingDown = false;
  actor.mapId = currentMapIndex;
  actor.x = clamp(player.x + 42, getCurrentRoad().left + 18, getCurrentRoad().right - 18);
  actor.y = clamp(player.y + 24, getCurrentRoad().top + 18, getCurrentRoad().bottom - 18);
  actor.direction = player.direction;
  addCharacterToTeam(actor.id);
  seedTrail(actor);
  if (floatText) addWorldFloatingText(actor.x, actor.y - 92, floatText, "#ffb7f2");
}

function placeDailyActivityMember(actorId, x, y, direction = "down") {
  const actor = getCharacterById(actorId);
  if (!actor) return null;
  actor.following = false;
  actor.staticNpc = true;
  actor.fixedPlacement = true;
  actor.layingDown = false;
  actor.mapId = currentMapIndex;
  actor.x = clamp(x, getCurrentRoad().left + 18, getCurrentRoad().right - 18);
  actor.y = clamp(y, getCurrentRoad().top + 18, getCurrentRoad().bottom - 18);
  actor.direction = direction;
  actor.idleDirection = direction;
  actor.walkTime = 0;
  seedTrail(actor);
  return actor;
}

function addPopularityReward(actorId, amount) {
  addCharacterPopularity(actorId, amount);
  const actor = getCharacterById(actorId);
  addWorldFloatingText(actor?.x || player.x, (actor?.y || player.y) - 110, `人氣 +${amount}`, "#ffb7f2", {
    life: 2.6,
    riseSpeed: 16,
  });
}

function refreshChapter3Progress() {
  if (!isChapter3Started() || chapter3State.completed) return;
  if (chapter3State.pigFound && chapter3State.bebeFound && chapter3State.kinkoFound && chapter3State.phase === "find_members") {
    chapter3State.phase = "ready_report";
  }
}

function normalizeChapter3DailyState() {
  const defaults = createDefaultChapter3State();
  chapter3State.fatDumbDaily = { ...defaults.fatDumbDaily, ...(chapter3State.fatDumbDaily || {}) };
  chapter3State.pigDate = { ...defaults.pigDate, ...(chapter3State.pigDate || {}) };
  chapter3State.bebeCollab = { ...defaults.bebeCollab, ...(chapter3State.bebeCollab || {}) };
  chapter3State.lastPigDateDay = Number(chapter3State.lastPigDateDay) || 0;
  chapter3State.lastBebeCollabDay = Number(chapter3State.lastBebeCollabDay) || 0;
  chapter3State.lastLivestreamDay = Number(chapter3State.lastLivestreamDay) || 0;
}

function normalizeChapter4State() {
  const defaults = createDefaultChapter4State();
  const savedPopularityTarget = Math.max(0, Number(chapter4State?.popularityTarget) || 0);
  chapter4State = { ...defaults, ...(chapter4State || {}) };
  chapter4State.startedDay = Number(chapter4State.startedDay) || 0;
  chapter4State.targetReachedDay = Number(chapter4State.targetReachedDay) || 0;
  chapter4State.popularityTarget = savedPopularityTarget;
  if (chapter4State.phase === "grow_popularity") {
    const currentRuleTarget = calculateChapter4PopularityTarget();
    chapter4State.popularityTarget = savedPopularityTarget
      ? Math.min(savedPopularityTarget, currentRuleTarget)
      : currentRuleTarget;
  }
  chapter4State.captiveSleepCount = Math.max(0, Number(chapter4State.captiveSleepCount) || 0);
  chapter4State.captiveDoorTalks = Math.max(0, Number(chapter4State.captiveDoorTalks) || 0);
  chapter4State.captiveWakeSeen = Boolean(chapter4State.captiveWakeSeen);
  chapter4State.rescueSearchStarted = Boolean(chapter4State.rescueSearchStarted);
  chapter4State.rescuePartyJoined = Boolean(chapter4State.rescuePartyJoined || chapter4State.phase === "base_rescue");
  chapter4State.rescueEncounterStarted = Boolean(chapter4State.rescueEncounterStarted);
  chapter4State.rescueCellChecked = Array.isArray(chapter4State.rescueCellChecked)
    ? chapter4State.rescueCellChecked.filter((id, index, list) => typeof id === "string" && list.indexOf(id) === index)
    : [];
  chapter4State.rescueCellFinaleDone = Boolean(chapter4State.rescueCellFinaleDone);
  chapter4State.postKinkoStreamCount = Math.max(
    0,
    Number(chapter4State.postKinkoStreamCount ?? (chapter4State.postKinkoStreamDone ? 2 : 0)) || 0
  );
  applyChapter4HeroForm();
}

function normalizeChapter5State() {
  const defaults = createDefaultChapter5State();
  chapter5State = { ...defaults, ...(chapter5State || {}) };
  chapter5State.tournamentRound = clamp(Math.floor(Number(chapter5State.tournamentRound) || 0), 0, CHAPTER5_TOURNAMENT_ROUNDS.length);
  chapter5State.tournamentRosterUnlocked = Boolean(chapter5State.tournamentRosterUnlocked);
  chapter5State.tournamentFailureHintShown = Boolean(chapter5State.tournamentFailureHintShown);
  chapter5State.tournamentSupportGranted = Boolean(chapter5State.tournamentSupportGranted);
  chapter5State.battleSpeedUnlocked = Boolean(chapter5State.battleSpeedUnlocked || chapter5State.tournamentSupportGranted);
  chapter5State.completed = Boolean(chapter5State.completed || chapter5State.phase === "completed");
  chapter5State.introDone = Boolean(chapter5State.introDone);
  if (chapter4State.phase === "completed" && chapter4State.rescueFinaleDone && chapter5State.phase === "locked") {
    chapter5State.phase = "await_exit";
  }
  if (["go_tower", "tournament"].includes(chapter5State.phase)) {
    chapter5State.tournamentRosterUnlocked = true;
  }
}

function isChapter4Started() {
  return chapter4State.phase !== "locked";
}

function isChapter5Started() {
  return chapter5State.phase !== "locked";
}

function isChapter5TournamentRosterUnlocked() {
  return Boolean(chapter5State?.tournamentRosterUnlocked)
    && ["go_tower", "tournament"].includes(chapter5State.phase);
}

function getChapter5TournamentRosterActors() {
  return CHAPTER5_TOURNAMENT_PLAYABLE_ROSTER_IDS
    .map(getCharacterById)
    .filter(Boolean);
}

function isChapter4PopularityGoalReached() {
  const target = getChapter4PopularityTarget();
  return ["npc1", "npc2", "npc3"].some((id) => getCharacterPopularity(id) >= target);
}

function getBestVtPopularity() {
  return Math.max(...["npc1", "npc2", "npc3"].map((id) => getCharacterPopularity(id)));
}

function calculateChapter4PopularityTarget() {
  const bestPopularity = getBestVtPopularity();
  const nextStep = (Math.floor(bestPopularity / CHAPTER4_POPULARITY_TARGET_STEP) + 1) * CHAPTER4_POPULARITY_TARGET_STEP;
  return Math.max(CHAPTER4_POPULARITY_TARGET, nextStep);
}

function getChapter4PopularityTarget() {
  return Math.max(CHAPTER4_POPULARITY_TARGET, Number(chapter4State.popularityTarget) || CHAPTER4_POPULARITY_TARGET);
}

function updateDailyActivities(delta) {
  updateDailyActivityTimer("pigDate", delta);
  updateDailyActivityTimer("bebeCollab", delta);
  applyDailyActivityActorStates();
}

function updateDailyActivityTimer(key, delta) {
  const activity = chapter3State[key];
  if (!activity || activity.status !== "running") return;
  activity.remaining = Math.max(0, (Number(activity.remaining) || 0) - delta);
  if (activity.remaining <= 0) {
    activity.status = "done";
    activity.remaining = 0;
    saveGame();
  }
}

function applyDailyActivityActorStates() {
  if (["running", "done"].includes(chapter3State.pigDate?.status)) {
    const fatDumb = getCharacterById("npc8");
    if (fatDumb?.mapId === currentMapIndex) {
      placePigInFrontOfFatDumb(fatDumb);
    } else {
      sendChapter3MemberAway("npc1");
    }
  }
  if (["running", "done"].includes(chapter3State.bebeCollab?.status)) {
    sendChapter3MemberAway("npc2");
  }
}

function isFatDumbDailyEligible() {
  if (!isChapter3Started()) return false;
  if (!chapter3State.pigFound) return false;
  if (fatDumbDeparture) return false;
  return !["locked", "need_rest", "ask_xiao"].includes(chapter3State.phase);
}

function placeFatDumbDailyNpc() {
  const fatDumb = getCharacterById("npc8");
  if (!fatDumb) return;
  if (!isFatDumbDailyEligible()) {
    if (!isChapter3SearchingMembers() || chapter3State.pigFound) fatDumb.mapId = 99;
    return;
  }
  const daily = chapter3State.fatDumbDaily || {};
  if (daily.day !== currentDay || !Number.isFinite(Number(daily.mapId)) || Number(daily.mapId) === 99) {
    chapter3State.fatDumbDaily = createFatDumbDailyPlacement();
  }
  const placement = chapter3State.fatDumbDaily;
  fatDumb.mapId = placement.mapId;
  fatDumb.x = placement.x;
  fatDumb.y = placement.y;
  fatDumb.direction = placement.direction || "left";
  fatDumb.idleDirection = fatDumb.direction;
  fatDumb.staticNpc = true;
  fatDumb.fixedPlacement = true;
  fatDumb.layingDown = false;
  fatDumb.walkTime = 0;
  seedTrail(fatDumb);
}

function createFatDumbDailyPlacement() {
  const mapIds = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const mapId = mapIds[Math.floor(Math.random() * mapIds.length)];
  const road = MAPS[mapId]?.road || ROAD;
  const x = Math.round(road.left + 180 + Math.random() * Math.max(80, road.right - road.left - 360));
  const y = Math.round(road.top + 38 + Math.random() * Math.max(40, road.bottom - road.top - 64));
  return {
    day: currentDay,
    mapId,
    x: clamp(x, road.left + 40, road.right - 40),
    y: clamp(y, road.top + 24, road.bottom - 18),
    direction: Math.random() < 0.5 ? "left" : "right",
  };
}

function startChapter3WakeDialogue() {
  chapter3State.phase = "ask_xiao";
  chapter3State.sleptAfterChapter2 = true;
  hideMissingChapter3Members();
  startDialogue(
    [
      { actor: player, speaker: player.label, body: "......" },
      { actor: player, speaker: player.label, body: "人呢？初配信第一天大家都不見了是怎樣。" },
      { actor: player, speaker: player.label, body: "去問一下蕭政銘好了。" },
    ],
    () => saveGame(),
    player
  );
}

function startChapter4AfterDebut() {
  chapter4State = {
    ...createDefaultChapter4State(),
    phase: "need_rest",
    startedDay: currentDay,
  };
  placeXiaoAtXdOffice();
  saveGame();
}

function startChapter4AfterFirstRest() {
  chapter4State.phase = "ask_xiao";
  placeXiaoAtXdOffice();
  saveGame();
  startDialogue(
    [
      { actor: player, speaker: player.label, body: "天亮了，去叉滴娛樂找蕭政銘吧。" },
    ],
    null,
    player
  );
}

function startChapter4AfterTargetRest() {
  prepareChapter4AfterTargetRestWorld();
  saveGame();
  startChapter4AfterTargetRestDialogue();
}

function prepareChapter4AfterTargetRestWorld() {
  chapter4State.phase = "vt_missing";
  chapter4State.targetReachedDay = currentDay;
  placeChapter4VtsInXd();
  placeChapter4ExAtDoor();
  placeXiaoAtXdOffice();
  vtNpcs.forEach((npc) => {
    teamSlots.forEach((id, index) => {
      if (id === npc.id) teamSlots[index] = null;
    });
  });
  sanitizeTeamSlots();
  syncFollowIndexesFromTeamSlots();
  [player, ...getVisibleNpcs()].forEach(seedTrail);
}

function startChapter4AfterTargetRestDialogue() {
  startDialogue(
    [
      { actor: player, speaker: player.label, body: "人呢？三個 VT 都不見了。" },
      { actor: player, speaker: player.label, body: "她們應該先去叉滴娛樂了吧..." },
    ],
    null,
    player
  );
}

function startChapter4RescueInfoAfterRest() {
  hideChapter4Kinko();
  returnChapter4RemainingVts();
  questNpc.mapId = 99;
  questNpc.following = false;
  questNpc.staticNpc = true;
  questNpc.fixedPlacement = true;
  teamSlots.forEach((id, index) => {
    if (id === questNpc.id) teamSlots[index] = null;
  });
  sanitizeTeamSlots();
  saveGame();
  startDialogue(
    [
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "嗨，叉滴娛樂的，你們有聽說嗎" },
      { actor: player, speaker: player.label, body: "聽說甚麼?" },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "最近外面好像有人開始在針對VT" },
      { actor: player, speaker: player.label, body: "是誰這麼壞?" },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "還有謠言說他們開始把VT綁走了，說是要曝光她們的中之人" },
      { actor: player, speaker: player.label, body: "太誇張了吧" },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "好像叫作什麼V黑娛樂" },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "好幾天沒見到親親子了，我很擔心她的安危" },
      { actor: vtNpcs[0], speaker: vtNpcs[0].label, body: "完蛋了，親親子很有可能被綁走了" },
      { actor: player, speaker: player.label, body: "你知道V黑娛樂在哪嗎，肥宅" },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "好像在一個基地裡面" },
      { actor: player, speaker: player.label, body: "我們趕緊去找親親子" },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "等一下，只有你們三個去會太危險，聽說他們十分暴力，恐怕連蕭政銘都不是他們的對手" },
      { actor: player, speaker: player.label, body: "那也強的太誇張了，那我們該怎麼辦" },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "聽說他們很喜歡cosplay，整天說什麼他們是上將，三大將，像白癡一樣" },
      { actor: vtNpcs[1], speaker: vtNpcs[1].label, body: "那我們cosplay成那些角色混進去吧" },
      { actor: player, speaker: player.label, body: "有人會cosplay嗎?" },
      { actor: vtNpcs[1], speaker: vtNpcs[1].label, body: "..." },
      { actor: vtNpcs[0], speaker: vtNpcs[0].label, body: "..." },
      { actor: player, speaker: player.label, body: "..." },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "我也不會...，但聽說超商最近新進了一款藥，能夠讓人變成心中所想的角色" },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "好像叫作什麼..." },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "C-22藥錠" },
      { actor: player, speaker: player.label, body: "那就好辦了，我們去超商買完C-22藥錠，就混入基地找親親子吧" },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "等一下，你們不通知蕭政銘嗎" },
      { actor: player, speaker: player.label, body: "他沒用啦，這幾天不知道死去哪了" },
      { actor: vtNpcs[0], speaker: vtNpcs[0].label, body: "還是說一下吧..." },
      { actor: player, speaker: player.label, body: "好啦，我打給他" },
      { actor: player, speaker: "電話", body: "鈴鈴鈴..." },
      { actor: player, speaker: player.label, body: "蕭政銘，你死去哪了" },
      { actor: player, speaker: questNpc.label, body: "..." },
      { actor: player, speaker: player.label, body: "我們知道親親子在哪了，現在要去救他，跟你說一聲" },
      { actor: player, speaker: questNpc.label, body: "是喔" },
      { actor: player, speaker: player.label, body: "算了，不指望你" },
      { actor: player, speaker: player.label, body: "我們已經擬出一個計畫，cosplay混進去帶親親子出來" },
      { actor: player, speaker: questNpc.label, body: "你白癡嗎..." },
      { actor: player, speaker: questNpc.label, body: "算了隨便你們，我現在很忙" },
      { actor: player, speaker: "電話", body: "(掛斷)" },
    ],
    () => {
      chapter4State.phase = "need_c22";
      chapter4State.rescueBriefed = true;
      placeXiaoAtXdOffice();
      saveGame();
    },
    hotelOtakuNpc
  );
}

function startChapter4QuestDialogue(npc) {
  if (chapter4State.phase === "need_rest") {
    startDialogue([{ actor: npc, speaker: npc.label, body: "今天先休息，明早再來找我。" }], null, npc);
    return;
  }

  if (chapter4State.phase === "ask_xiao") {
    const popularityTarget = calculateChapter4PopularityTarget();
    startDialogue(
      [
        { actor: npc, speaker: npc.label, body: `今天先直播，把人氣值拚到 ${popularityTarget}。` },
        { actor: npc, speaker: npc.label, body: "看你們三個誰能先達標。人氣夠了，護貝費才會自己長腳走過來。" },
        { actor: player, speaker: player.label, body: "聽起來像在種韭菜..." },
        { actor: npc, speaker: npc.label, body: "叫什麼叫，去直播。" },
      ],
      () => {
        chapter4State.popularityTarget = popularityTarget;
        chapter4State.phase = isChapter4PopularityGoalReached() ? "target_reached_rest" : "grow_popularity";
        if (chapter4State.phase === "target_reached_rest") chapter4State.targetReachedDay = currentDay;
        saveGame();
      },
      npc
    );
    return;
  }

  if (chapter4State.phase === "grow_popularity") {
    if (isChapter4PopularityGoalReached()) {
      finishChapter4PopularityGoal(npc);
      return;
    }
    startDialogue(
      [
        { actor: npc, speaker: npc.label, body: `人氣還不夠，最高才 ${getBestVtPopularity()} / ${getChapter4PopularityTarget()}。繼續播。` },
        { actor: player, speaker: player.label, body: "原來人氣也能像欠債一樣被催..." },
      ],
      null,
      npc
    );
    return;
  }

  if (chapter4State.phase === "target_reached_rest") {
    startDialogue([{ actor: npc, speaker: npc.label, body: "人氣值達標了。我今天有事，明早再來找我。" }], null, npc);
    return;
  }

  if (chapter4State.phase === "vt_missing") {
    startDialogue([{ actor: npc, speaker: npc.label, body: "人怎麼還沒到？去外面看看。" }], null, npc);
    return;
  }

  if (chapter4State.phase === "confront_ex") {
    startDialogue([{ actor: npc, speaker: npc.label, body: "先去門口，把那個吵著找親親子的傢伙處理掉。" }], null, npc);
    return;
  }

  if (chapter4State.phase === "stream_two_vts") {
    startDialogue([{ actor: npc, speaker: npc.label, body: "親親子先不用管，剩下兩個先直播撐住場面。" }], null, npc);
    return;
  }

  if (chapter4State.phase === "post_kinko_stream_rest") {
    startDialogue([{ actor: npc, speaker: npc.label, body: "今天先去水餃，明天再想親親子的事。" }], null, npc);
    return;
  }

  if (chapter4State.phase === "need_c22") {
    startDialogue([{ actor: npc, speaker: npc.label, body: "別來煩我" }], null, npc);
    return;
  }

  if (chapter4State.phase === "got_c22") {
    startDialogue([{ actor: npc, speaker: npc.label, body: "C-22 有了就去問肥宅，他看起來很懂奇怪藥錠。" }], null, npc);
    return;
  }

  if (chapter4State.phase === "base_entry") {
    startDialogue([{ actor: npc, speaker: npc.label, body: "還在這裡幹嘛，趕快去 SECTOR 03。" }], null, npc);
    return;
  }

  if (chapter4State.phase === "base_infiltration") {
    startDialogue([{ actor: npc, speaker: npc.label, body: "你們都進基地了，自己想辦法活著出來。" }], null, npc);
    return;
  }

  if (chapter4State.phase === "base_captive") {
    startDialogue([{ actor: player, speaker: player.label, body: "蕭政銘現在到底在幹嘛..." }], null, player);
    return;
  }

  if (chapter4State.phase === "completed") {
    startDialogue([{ actor: npc, speaker: npc.label, body: "今天不要再給我出事。" }], null, npc);
    return;
  }

  startDialogue([{ actor: npc, speaker: npc.label, body: "先把眼前的事處理完。" }], null, npc);
}

function finishChapter4PopularityGoal(anchor = questNpc) {
  const xiaoActor = questNpc.mapId === currentMapIndex ? questNpc : anchor;
  startDialogue(
    [
      { actor: player, speaker: "電話", body: "鈴鈴鈴..." },
      { actor: xiaoActor, speaker: questNpc.label, body: "我看到大家人氣值達標了。" },
      { actor: xiaoActor, speaker: questNpc.label, body: "可是我今天有事，明早再去叉滴娛樂找我。" },
      { actor: player, speaker: player.label, body: "達標就休息，這公司終於有一點人性了嗎..." },
    ],
    () => {
      chapter4State.phase = "target_reached_rest";
      chapter4State.targetReachedDay = currentDay;
      placeXiaoAtXdOffice();
      saveGame();
    },
    anchor
  );
}

function enterChapter4XdScare(point) {
  const entry = getXdStoryEntryPosition(point);
  changeMap(point.targetMapId, entry.x, entry.y, entry.direction, {
    followerPlacement: point.followerPlacement,
    fadeIn: false,
  });
  placeChapter4VtsInXd();
  placeStaticActor(questNpc, 9, XIAO_XD_POSITION, { layingDown: false });
  chapter4State.sawDoorEx = true;
  saveGame();
  const sequence = [
    { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "......" },
    { actor: vtNpcs[1], speaker: vtNpcs[1].label, body: "門口那個人好吵。" },
    { actor: vtNpcs[0], speaker: vtNpcs[0].label, body: "他一直說要找親親子，姐姐有點怕。" },
    { actor: player, speaker: player.label, body: "你們怎麼都躲在這裡。" },
    { actor: questNpc, speaker: questNpc.label, body: "是誰敢來我們的地盤撒野?" },
    { actor: player, speaker: player.label, body: "說是要找親親子的" },
    { actor: questNpc, speaker: questNpc.label, body: "找她幹嘛?" },
    { actor: player, speaker: player.label, body: "不知道" },
    { actor: questNpc, speaker: questNpc.label, body: "親親子你給我解釋清楚" },
    { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "..." },
    { actor: questNpc, speaker: questNpc.label, body: "算了，親親獸你去把他趕走" },
    { actor: player, speaker: player.label, body: "你是不會一起來?" },
    { actor: questNpc, speaker: questNpc.label, body: "麻煩死了...好啦" },
  ];
  startSceneFadeIn(() => startDialogue(
    sequence,
    () => {
      chapter4State.phase = "confront_ex";
      chapter4State.xiaoJoined = true;
      startChapter4XiaoFollowing(false);
      saveGame();
    },
    questNpc
  ), MAP_CHANGE_FADE_IN_TIME);
}

function enterChapter4XdAfterEx(point) {
  const entry = getXdStoryEntryPosition(point);
  changeMap(point.targetMapId, entry.x, entry.y, entry.direction, {
    followerPlacement: point.followerPlacement,
    fadeIn: false,
  });
  placeChapter4VtsInXd();
  placeStaticActor(questNpc, 9, XIAO_XD_POSITION, { layingDown: false });
  setChapter4PostExSceneFacing();
  saveGame();
  const sequence = [
    { actor: player, speaker: player.label, body: "那個人已經被攆走了。" },
    { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "......" },
    { actor: questNpc, speaker: questNpc.label, body: "對阿，他說什麼他是我們家藝人的男友，我跟他說認錯人了" },
    { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "對不起...謝謝你們..." },
    { actor: questNpc, speaker: questNpc.label, body: "話說回來" },
    { actor: questNpc, speaker: questNpc.label, body: "你是誰? 怎麼在我們公司" },
    { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "你在說什麼?" },
    { actor: questNpc, speaker: questNpc.label, body: "我們公司什麼時候多了一位粉色頭髮的小姊" },
    { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "我是叉滴娛樂的Vtuber阿" },
    { actor: questNpc, speaker: questNpc.label, body: "我們叉滴娛樂的Vtuber只有波貝貝和豬鼻醬，沒有粉色頭髮的人喔" },
    { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "我是親親子阿，你忘了嗎?" },
    { actor: questNpc, speaker: questNpc.label, body: "親親子? 哦..." },
    { actor: questNpc, speaker: questNpc.label, body: "你是說那個洩漏公司機密，被解聘的那個親親子嗎?" },
      { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "蛤? 我洩漏甚麼了" },
    { actor: questNpc, speaker: questNpc.label, body: "小姐，沒什麼事的話請你離開哦" },
    { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "蕭政銘!" },
    { actor: questNpc, speaker: questNpc.label, body: "請你馬上給我離開這家公司，而且永遠不准你再回來！" },
    { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "蕭政銘，我真的看錯你了" },
    { actor: questNpc, speaker: questNpc.label, body: "再不走我要叫保安了" },
    { actor: player, speaker: player.label, body: "我們公司根本沒有保安" },
    { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "算了，老娘現在是叉滴娛樂人氣最高的，還有一堆大乾爹支持，轉生之後隨便都能收到一堆護貝費" },
    { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "而且還不用被公司抽成，不用再分給你任何一毛護貝費了" },
  ];
  startSceneFadeIn(() => startDialogue(
    sequence,
    () => startChapter4PostExKinkoWalkToDoor(),
    null
  ), MAP_CHANGE_FADE_IN_TIME);
}

function getXdStoryEntryPosition(point) {
  const road = MAPS[point.targetMapId]?.road || ROAD;
  return {
    x: clamp((point.targetX ?? 1300) - 92, road.left + 18, road.right - 18),
    y: clamp(point.targetY ?? 638, road.top + 18, road.bottom - 18),
    direction: "right",
  };
}

function setChapter4PostExSceneFacing(options = {}) {
  const kinkoDirection = options.kinkoDirection || "right";
  const faceRightActors = [player, ...vtNpcs];
  faceRightActors.forEach((actor) => {
    if (!actor) return;
    const direction = actor === vtNpcs[2] ? kinkoDirection : "right";
    actor.direction = direction;
    actor.idleDirection = direction;
    actor.walkTime = 0;
  });
  questNpc.direction = "left";
  questNpc.idleDirection = "left";
  questNpc.walkTime = 0;
}

function getXdExitPoint() {
  return TELEPORT_POINTS.find((point) => point.id === "xd_exit") || { x: 1300, y: 638, direction: "down" };
}

function startChapter4PostExKinkoWalkToDoor() {
  const exit = getXdExitPoint();
  startChapter4ActorMove(
    vtNpcs[2],
    { x: exit.x, y: exit.y, direction: "left" },
    startChapter4PostExDoorDialogue,
    { speed: 235, finalDirection: "left" }
  );
}

function startChapter4PostExDoorDialogue() {
  setChapter4PostExSceneFacing({ kinkoDirection: "left" });
  startDialogue(
    [
      { actor: questNpc, speaker: questNpc.label, body: "..." },
    ],
    startChapter4PostExDoorRealizationDialogue,
    null
  );
}

function startChapter4PostExDoorRealizationDialogue() {
  setChapter4PostExSceneFacing();
  startDialogue(
    [
      { actor: questNpc, speaker: questNpc.label, body: "等一下，你剛剛說什麼" },
      { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "我說老娘要轉生了" },
      { actor: questNpc, speaker: questNpc.label, body: "下一句" },
      { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "不用再分給你任何一毛護貝費了" },
      { actor: questNpc, speaker: questNpc.label, body: "..." },
      { actor: questNpc, speaker: questNpc.label, body: "阿...你不是我最喜歡的親親子嗎，剛剛糊塗不小心給忘了，大家都是好麻吉阿" },
      { actor: questNpc, speaker: questNpc.label, body: "什麼男友，我不許任何人碰到我們家親親子一根寒毛!" },
      { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "垃圾，去死啦!" },
    ],
    () => {
      hideChapter4Kinko();
      startChapter4PostExXiaoExitDialogue();
    },
    null
  );
}

function startChapter4PostExXiaoExitDialogue() {
  setChapter4PostExSceneFacing();
  startDialogue(
    [
      { actor: questNpc, speaker: questNpc.label, body: "唉..." },
      { actor: questNpc, speaker: questNpc.label, body: "好吧...你們兩個先去直播吧，我出去抽根菸" },
    ],
    () => {
      const exit = getXdExitPoint();
      startChapter4ActorMove(
        questNpc,
        { x: exit.x, y: exit.y, direction: "down" },
        startChapter4PostExFinalDialogue,
        { speed: 300, finalDirection: "down", hideOnArrive: true }
      );
    },
    null
  );
}

function startChapter4PostExFinalDialogue() {
  setChapter4PostExSceneFacing();
  startDialogue(
    [
      { actor: vtNpcs[0], speaker: vtNpcs[0].label, body: "事情怎麼會變成這樣..." },
      { actor: vtNpcs[1], speaker: vtNpcs[1].label, body: "好好喔...我也想畢業" },
      { actor: vtNpcs[0], speaker: vtNpcs[0].label, body: "波貝貝! 現在是說這種話的時候嗎!" },
      { actor: vtNpcs[1], speaker: vtNpcs[1].label, body: "沒有啦，我也很想繼續和親親子直播" },
      { actor: player, speaker: player.label, body: "親親子一定會回來的，先讓她冷靜一下吧" },
    ],
    () => {
      chapter4State.phase = "stream_two_vts";
      chapter4State.kinkoLeft = true;
      chapter4State.postKinkoStreamCount = 0;
      chapter4State.postKinkoStreamDone = false;
      followChapter4RemainingVtsFromCurrentPositions();
      saveGame();
    },
    null
  );
}

function handleChapter4NpcInteraction(target) {
  if (!isChapter4Started() || !target) return false;
  if (chapter4State.phase === "rescue_cell_check" && currentMapIndex === 11) {
    return handleChapter4RescueCellCheckInteraction(target);
  }
  if (chapter4State.phase === "base_captive" && currentMapIndex === 11) {
    if (target.id === "npc1") {
      startDialogue([
        { actor: target, speaker: target.label, body: "人家肚子餓了...這裡有沒有便當可以吃。" },
        { actor: player, speaker: player.label, body: "我們是被關起來，不是來訂便當的。" },
      ], null, target);
      return true;
    }
    if (target.id === "npc2") {
      startDialogue([
        { actor: target, speaker: target.label, body: "這裡其實滿適合水餃的..." },
        { actor: player, speaker: player.label, body: "不要這麼快適應監獄生活。" },
      ], null, target);
      return true;
    }
    if (target.id === "npc3") {
      startDialogue([
        { actor: target, speaker: target.label, body: "怎麼會變成這樣..." },
        { actor: player, speaker: player.label, body: "先撐住，一定會有人來救我們。" },
      ], null, target);
      return true;
    }
    if (target.id === "hotel_otaku") {
      startDialogue([
        { actor: target, speaker: target.label, body: "親親子在這裡就好...可是我們現在是不是也出不去了。" },
        { actor: player, speaker: player.label, body: "先別吵，想辦法出去。" },
      ], null, target);
      return true;
    }
    if (target.id === "npc14") {
      startDialogue([
        { actor: target, speaker: target.label, body: "Zzz..." },
        { actor: vtNpcs[1], speaker: vtNpcs[1].label, body: "完全叫不醒。" },
      ], null, target);
      return true;
    }
  }
  if (chapter4State.phase === "confront_ex" && ["npc1", "npc2", "npc3"].includes(target.id)) {
    const linesById = {
      npc1: [
        { actor: target, speaker: target.label, body: "姐姐覺得門口那個人好可怕。" },
        { actor: player, speaker: player.label, body: "放心，大哥處理。" },
        { actor: questNpc, speaker: questNpc.label, body: "不要把我講得像保全。" },
      ],
      npc2: [
        { actor: target, speaker: target.label, body: "外面好吵，我可以先水餃嗎。" },
        { actor: questNpc, speaker: questNpc.label, body: "不行，妳們先待在這裡。" },
        { actor: player, speaker: player.label, body: "大哥難得講得像個負責人。" },
      ],
      npc3: [
        { actor: target, speaker: target.label, body: "......" },
        { actor: player, speaker: player.label, body: "那個人是妳的誰？" },
        { actor: target, speaker: target.label, body: "現在不是問這個的時候吧。" },
      ],
    };
    startDialogue(linesById[target.id] || [{ actor: target, speaker: target.label, body: "先處理門口那個人。" }], null, target);
    return true;
  }
  if (target.id !== "kinko_ex") return false;

  if (chapter4State.phase === "vt_missing") {
    chapter4State.sawDoorEx = true;
    saveGame();
    startDialogue(
      [
        { actor: target, speaker: target.label, body: "親親子！妳給我出來！" },
        { actor: player, speaker: player.label, body: "(發生甚麼事了? 先進去吧...)" },
      ],
      null,
      target
    );
    return true;
  }

  if (chapter4State.phase === "confront_ex") {
    startDialogue(
      [
        { actor: target, speaker: target.label, body: "我要找親親子，叫她出來！" },
        { actor: player, speaker: player.label, body: "你誰啊，站在叉滴娛樂門口吵什麼。" },
        { actor: questNpc, speaker: questNpc.label, body: "你叫甚麼名字! who are you啊，nobody啊，你名字報出來啊！" },
        { actor: target, speaker: target.label, body: "我是她男友！她憑什麼說分手就分手！" },
        { actor: questNpc, speaker: questNpc.label, body: "分手了就是前男友，就是陌生人，就是nobody，OK?" },
        { actor: target, speaker: target.label, body: "我們才交往兩個月，他竟然說分就分" },
        { actor: target, speaker: target.label, body: "結果前幾天竟然在直播上看到聲音和她一模一樣的人，親親子肯定就是她" },
        { actor: player, speaker: player.label, body: "會不會是你聽錯了?" },
        { actor: target, speaker: target.label, body: "不可能聽錯，一定就是她! 她竟然...竟然和別人玩得那麼開心，還一直討好觀眾" },
        { actor: questNpc, speaker: questNpc.label, body: "(好煩喔，我只想躺著收錢，趕緊解決吧...)" },
        { actor: questNpc, speaker: questNpc.label, body: "你認錯人了，我們家的VT是沒有男友的，VT是不會交男友的" },
        { actor: target, speaker: target.label, body: "不管啦，我就算用蠻力也要進去和她對質" },
      ],
      () => openKinkoExBattle(target),
      target
    );
    return true;
  }

  return false;
}

function applyChapter4HeroForm() {
  if (isChapter4XiaoControlled()) {
    player.label = questNpc.label;
    player.sprite = "npc4";
    player.tint = questNpc.tint || "#6f88b8";
  } else if (chapter4State?.transformed) {
    player.label = "九尾親親獸";
    player.sprite = "npc29";
    player.tint = "#ffb15f";
  } else {
    player.label = "親親獸";
    player.sprite = "hero";
    player.tint = "#ff7ca0";
  }
}

function isChapter4XiaoControlled() {
  return ["base_rescue", "base_rescue_victory", "rescue_cell_found", "rescue_cell_check", "rescue_cell_finale"].includes(chapter4State?.phase);
}

function isChapter4XiaoRescuePartyActive() {
  return chapter4State?.phase === "base_rescue";
}

function setChapter4Transformed(value) {
  chapter4State.transformed = Boolean(value);
  applyChapter4HeroForm();
}

function startChapter4TransformCutscene(onComplete = null) {
  keys.clear();
  player.walkTime = 0;
  const storyBlackFadeIn = 0.75;
  const storyImageFadeIn = 0.9;
  const storyFadeOut = 0.65;
  const transformDuration = 1.85;
  transformCutscene = {
    phase: "story-black-fade-in",
    timer: 0,
    storyBlackFadeIn,
    storyImageFadeIn,
    storyFadeOut,
    transformDuration,
    swapTime: 0.95,
    swapped: false,
    transformStarted: false,
    sparkleTimer: 0,
    seed: Math.random() * 1000,
    targetTransformed: true,
    startText: "C-22 啟動",
    startColor: "#ffe16f",
    resultText: "九尾親親獸",
    resultColor: "#ffb15f",
    sparkleA: "#ffe16f",
    sparkleB: "#ff8fb8",
    onComplete,
  };
}

function startChapter4TransformBackCutscene(onComplete = null) {
  keys.clear();
  player.walkTime = 0;
  transformCutscene = {
    phase: "transform",
    timer: 0,
    transformDuration: 1.75,
    swapTime: 0.88,
    swapped: false,
    transformStarted: false,
    sparkleTimer: 0,
    seed: Math.random() * 1000,
    targetTransformed: false,
    startText: "藥效消退",
    startColor: "#8ff5ff",
    resultText: "親親獸",
    resultColor: "#ff7ca0",
    sparkleA: "#8ff5ff",
    sparkleB: "#ff8fb8",
    onComplete,
  };
}

function advanceTransformCutscene() {
  if (!transformCutscene || transformCutscene.phase !== "story-hold") return;
  transformCutscene.phase = "story-fade-out";
  transformCutscene.timer = 0;
  keys.clear();
}

function startTransformCutsceneBody() {
  if (!transformCutscene) return;
  transformCutscene.phase = "transform";
  transformCutscene.timer = 0;
  transformCutscene.swapped = false;
  transformCutscene.transformStarted = false;
  transformCutscene.sparkleTimer = 0;
}

function updateTransformCutscene(delta) {
  if (!transformCutscene) return;
  player.walkTime = 0;

  if (transformCutscene.phase === "story-black-fade-in") {
    transformCutscene.timer += delta;
    if (transformCutscene.timer >= transformCutscene.storyBlackFadeIn) {
      transformCutscene.phase = "story-image-fade-in";
      transformCutscene.timer = 0;
    }
    return;
  }

  if (transformCutscene.phase === "story-image-fade-in") {
    transformCutscene.timer += delta;
    if (transformCutscene.timer >= transformCutscene.storyImageFadeIn) {
      transformCutscene.phase = "story-hold";
      transformCutscene.timer = 0;
    }
    return;
  }

  if (transformCutscene.phase === "story-hold") return;

  if (transformCutscene.phase === "story-fade-out") {
    transformCutscene.timer += delta;
    if (transformCutscene.timer >= transformCutscene.storyFadeOut) {
      startTransformCutsceneBody();
    }
    return;
  }

  transformCutscene.timer += delta;
  transformCutscene.sparkleTimer -= delta;

  if (!transformCutscene.transformStarted) {
    transformCutscene.transformStarted = true;
    transformCutscene.sparkleTimer = 0;
    addWorldFloatingText(player.x, player.y - 118, transformCutscene.startText || "C-22 啟動", transformCutscene.startColor || "#ffe16f", {
      life: 1.4,
      riseSpeed: 14,
      font: "bold 26px 'Segoe UI', 'Noto Sans TC', sans-serif",
      stroke: "rgba(80, 45, 0, 0.9)",
    });
  }

  while (transformCutscene.sparkleTimer <= 0) {
    transformCutscene.sparkleTimer += 0.045;
    const angle = Math.random() * Math.PI * 2;
    const radius = 18 + Math.random() * 54;
    sparkles.push({
      x: player.x + Math.cos(angle) * radius,
      y: player.y - 54 + Math.sin(angle) * radius * 0.62,
      vx: Math.cos(angle) * (18 + Math.random() * 36),
      vy: 72 + Math.random() * 72,
      life: 0.48 + Math.random() * 0.36,
      maxLife: 0.84,
      size: 5 + Math.random() * 5,
      color: Math.random() < 0.5 ? (transformCutscene.sparkleA || "#ffe16f") : (transformCutscene.sparkleB || "#ff8fb8"),
    });
  }

  if (!transformCutscene.swapped && transformCutscene.timer >= transformCutscene.swapTime) {
    transformCutscene.swapped = true;
    setChapter4Transformed(transformCutscene.targetTransformed ?? true);
    player.walkTime = 0;
    addWorldFloatingText(player.x, player.y - 128, transformCutscene.resultText || "九尾親親獸", transformCutscene.resultColor || "#ffb15f", {
      life: 1.2,
      riseSpeed: 10,
      font: "bold 30px 'Segoe UI', 'Noto Sans TC', sans-serif",
      stroke: "rgba(70, 24, 0, 0.92)",
    });
  }

  if (transformCutscene.timer < transformCutscene.transformDuration) return;
  const onComplete = transformCutscene.onComplete;
  transformCutscene = null;
  if (typeof onComplete === "function") onComplete();
}

function drawChapter4TransformStoryImage() {
  if (!transformCutscene) return;
  const image = assets.chapter4TransformCutin;
  const phase = transformCutscene.phase;
  const blackFadeIn = phase === "story-black-fade-in"
    ? easeOutCubic(clamp(transformCutscene.timer / transformCutscene.storyBlackFadeIn, 0, 1))
    : 1;
  const imageFadeIn = phase === "story-black-fade-in"
    ? 0
    : phase === "story-image-fade-in"
    ? easeOutCubic(clamp(transformCutscene.timer / transformCutscene.storyImageFadeIn, 0, 1))
    : 1;
  const fadeOut = phase === "story-fade-out"
    ? easeInCubic(clamp(transformCutscene.timer / transformCutscene.storyFadeOut, 0, 1))
    : 0;
  const blackAlpha = clamp(blackFadeIn * (1 - fadeOut), 0, 1);
  const imageAlpha = clamp(imageFadeIn * (1 - fadeOut), 0, 1);

  ctx.save();
  ctx.globalAlpha = blackAlpha;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = imageAlpha;
  if (isRenderableImage(image)) {
    drawImageContain(image, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#fff7b5";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 40px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText("吞下 C-22 藥錠", canvas.width / 2, canvas.height / 2);
  }
  ctx.restore();

}

function showChapter4StoryImage(assetKey, options = {}) {
  const shakeDuration = options.shakeDuration || 620;
  const now = performance.now();
  chapter4StoryImage = {
    assetKey,
    shownAt: now,
    blackFadeIn: options.blackFadeIn ?? 0.65,
    imageFadeIn: options.imageFadeIn ?? 0.75,
    shakeDuration,
    shakeUntil: options.shake ? now + shakeDuration : 0,
    captionEntries: [],
    captionIndex: 0,
    captionVisibleAt: now,
    onComplete: null,
  };
}

function hideChapter4StoryImage() {
  chapter4StoryImage = null;
}

function drawChapter4StoryImageOverlay() {
  if (!chapter4StoryImage) return;
  const image = assets[chapter4StoryImage.assetKey];
  const now = performance.now();
  const elapsed = (now - (chapter4StoryImage.shownAt || now)) / 1000;
  const blackFadeIn = chapter4StoryImage.blackFadeIn ?? 0.65;
  const imageFadeIn = chapter4StoryImage.imageFadeIn ?? 0.75;
  const blackAlpha = blackFadeIn <= 0 ? 1 : clamp(elapsed / blackFadeIn, 0, 1);
  const imageAlpha = imageFadeIn <= 0 ? 1 : clamp((elapsed - blackFadeIn) / imageFadeIn, 0, 1);
  const shaking = chapter4StoryImage.shakeUntil && now < chapter4StoryImage.shakeUntil;
  const shakeRemaining = chapter4StoryImage.shakeUntil - now;
  const shakeProgress = clamp(shakeRemaining / (chapter4StoryImage.shakeDuration || 620), 0, 1);
  const shake = shaking ? 8 * shakeProgress : 0;
  const offsetX = shaking ? (Math.random() - 0.5) * (10 + shake) : 0;
  const offsetY = shaking ? (Math.random() - 0.5) * (8 + shake) : 0;

  ctx.save();
  ctx.fillStyle = `rgba(0, 0, 0, ${blackAlpha})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (imageAlpha <= 0) {
    ctx.restore();
    return;
  }
  ctx.translate(offsetX, offsetY);
  ctx.globalAlpha = imageAlpha;
  let storyRect = { x: 0, y: 0, width: canvas.width, height: canvas.height };
  if (isRenderableImage(image)) {
    storyRect = getImageContainRect(image, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, storyRect.x, storyRect.y, storyRect.width, storyRect.height);
  } else {
    ctx.fillStyle = "#1a0d16";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff7e8";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 38px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText("劇情圖載入中", canvas.width / 2, canvas.height / 2);
  }
  ctx.globalAlpha = 1;
  drawChapter4StoryCaptionOverlay(storyRect);
  ctx.restore();
}

function getImageContainRect(image, x, y, width, height) {
  const imageWidth = image?.naturalWidth || image?.width || width;
  const imageHeight = image?.naturalHeight || image?.height || height;
  if (!imageWidth || !imageHeight) return { x, y, width, height };
  const scale = Math.min(width / imageWidth, height / imageHeight);
  const targetWidth = imageWidth * scale;
  const targetHeight = imageHeight * scale;
  return {
    x: x + (width - targetWidth) / 2,
    y: y + (height - targetHeight) / 2,
    width: targetWidth,
    height: targetHeight,
  };
}

function drawChapter4StoryCaptionOverlay(storyRect) {
  const entry = chapter4StoryImage?.captionEntries?.[chapter4StoryImage.captionIndex];
  if (!entry || performance.now() < (chapter4StoryImage.captionVisibleAt || 0)) return;
  const image = assets[entry.captionKey];
  if (!isRenderableImage(image)) return;
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  if (!sourceWidth || !sourceHeight) return;
  const padding = 34;
  const maxWidth = entry.position === "center" ? storyRect.width * 0.52 : storyRect.width * 0.42;
  const maxHeight = entry.position === "center" ? storyRect.height * 0.52 : storyRect.height * 0.42;
  const scale = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight, 1);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  let x = storyRect.x + padding;
  let y = storyRect.y + padding;
  if (entry.position === "top-right") {
    x = storyRect.x + storyRect.width - width - padding;
    y = storyRect.y + padding;
  } else if (entry.position === "bottom-right") {
    x = storyRect.x + storyRect.width - width - padding;
    y = storyRect.y + storyRect.height - height - padding;
  } else if (entry.position === "center") {
    x = storyRect.x + storyRect.width / 2 - width / 2;
    y = storyRect.y + storyRect.height / 2 - height / 2;
  }
  const minX = storyRect.x + padding;
  const maxX = storyRect.x + storyRect.width - width - padding;
  const minY = storyRect.y + padding;
  const maxY = storyRect.y + storyRect.height - height - padding;
  x = maxX >= minX ? clamp(x, minX, maxX) : x;
  y = maxY >= minY ? clamp(y, minY, maxY) : y;
  ctx.save();
  ctx.beginPath();
  ctx.rect(storyRect.x, storyRect.y, storyRect.width, storyRect.height);
  ctx.clip();
  ctx.drawImage(image, Math.round(x), Math.round(y), Math.round(width), Math.round(height));
  ctx.restore();
}

function getChapter4StoryDialoguePosition(speaker, explicitPosition = null) {
  if (explicitPosition) return explicitPosition;
  if (speaker === "蕭政銘") return "top-right";
  if (speaker === "蕭犬") return "top-left";
  if (speaker === "親親子") return "bottom-right";
  if (speaker === "久田親親獸") return "center";
  return "bottom-center";
}

function createChapter4StoryDialogueAnchor(position = "bottom-center") {
  const marginX = 84;
  const topY = 194;
  const bottomY = canvas.height - 56;
  const positions = {
    "top-left": { x: marginX, y: topY },
    "top-right": { x: canvas.width - marginX, y: topY },
    "bottom-right": { x: canvas.width - marginX, y: bottomY },
    "bottom-center": { x: canvas.width / 2, y: bottomY },
    center: { x: canvas.width / 2, y: canvas.height / 2 + 58 },
  };
  const screen = positions[position] || positions["bottom-center"];
  return {
    x: camera.x + screen.x,
    y: camera.y + screen.y,
    dialogueVisualHeight: 0,
    storyDialogueAnchor: true,
  };
}

function startChapter4StoryImageDialogue(assetKey, sequence, onComplete = null, options = {}) {
  showChapter4StoryImage(assetKey, options);
  chapter4StoryImage.captionEntries = sequence.map((entry) => ({
    captionKey: entry.captionKey,
    position: getChapter4StoryDialoguePosition(entry.speaker, entry.storyPosition),
  }));
  chapter4StoryImage.captionIndex = 0;
  chapter4StoryImage.captionVisibleAt = performance.now() + Math.max(0, options.dialogueDelay ?? 1250);
  chapter4StoryImage.onComplete = onComplete;
}

function advanceChapter4StoryCaption() {
  if (!chapter4StoryImage) return;
  const entries = chapter4StoryImage.captionEntries || [];
  if (!entries.length || performance.now() < (chapter4StoryImage.captionVisibleAt || 0)) return;
  if (chapter4StoryImage.captionIndex < entries.length - 1) {
    chapter4StoryImage.captionIndex += 1;
    chapter4StoryImage.captionVisibleAt = performance.now() + 70;
    return;
  }
  const onComplete = chapter4StoryImage.onComplete;
  hideChapter4StoryImage();
  if (typeof onComplete === "function") onComplete();
}

function focusChapter4CellGroupCamera() {
  cameraFocusActor = chapter4CellCameraAnchor;
  camera.x = clamp(1120, 0, WORLD.width - canvas.width);
  camera.y = 0;
}

function startChapter4BlackTextSequence(lines, onComplete = null, index = 0) {
  const text = lines[index];
  startChapterCompleteTransition(text, () => {
    if (index + 1 < lines.length) {
      startChapter4BlackTextSequence(lines, onComplete, index + 1);
    } else if (typeof onComplete === "function") {
      onComplete();
    }
  }, {
    instantBlack: true,
    noFadeOut: true,
  });
}

function drawTransformCutsceneEffect() {
  if (!transformCutscene) return;
  if (transformCutscene.phase !== "transform") {
    drawChapter4TransformStoryImage();
    return;
  }

  const progress = clamp(transformCutscene.timer / transformCutscene.transformDuration, 0, 1);
  const pulse = Math.sin(progress * Math.PI);
  const screenX = player.x - camera.x;
  const screenY = player.y - camera.y;
  const beamAlpha = 0.18 + pulse * 0.34;
  const ringScale = 0.8 + progress * 1.45;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const beam = ctx.createLinearGradient(screenX, screenY - 180, screenX, screenY + 80);
  beam.addColorStop(0, "rgba(255, 225, 111, 0)");
  beam.addColorStop(0.42, `rgba(255, 225, 111, ${beamAlpha})`);
  beam.addColorStop(0.62, `rgba(255, 128, 184, ${beamAlpha * 0.72})`);
  beam.addColorStop(1, "rgba(255, 225, 111, 0)");
  ctx.fillStyle = beam;
  ctx.fillRect(screenX - 72 - pulse * 28, screenY - 190, 144 + pulse * 56, 300);

  for (let i = 0; i < 3; i += 1) {
    const offset = i * 0.22;
    const local = (progress + offset) % 1;
    const radiusX = 34 + local * 78;
    const radiusY = 10 + local * 24;
    ctx.globalAlpha = (1 - local) * 0.7;
    ctx.strokeStyle = i % 2 ? "#ff8fb8" : "#ffe16f";
    ctx.lineWidth = 4 - local * 1.7;
    ctx.beginPath();
    ctx.ellipse(screenX, screenY + 12 - local * 84, radiusX, radiusY, Math.sin(progress * 8 + i) * 0.38, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.55 + pulse * 0.32;
  ctx.strokeStyle = "#fff0a8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(screenX, screenY + 20, 46 * ringScale, 16 * ringScale, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = pulse * 0.28;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function getChapter4BaseActors() {
  return {
    aokiji: getCharacterById("npc38"),
    dog: getCharacterById("npc39"),
    monkey: getCharacterById("npc40"),
    ex: kinkoExNpc,
  };
}

function placeChapter4BaseActor(actor, key, positionOverride = null) {
  const position = positionOverride || CHAPTER4_BASE_ACTOR_POSITIONS[key];
  if (!actor || !position) return;
  placeStaticActor(actor, 10, position, { layingDown: false });
  actor.direction = position.direction || actor.direction;
  actor.idleDirection = actor.direction;
  actor.speed = 0;
  actor.walkTime = 0;
  seedTrail(actor);
}

function placeChapter4BaseEnemies() {
  const actors = getChapter4BaseActors();
  [
    [actors.aokiji, "npc38"],
    [actors.dog, "npc39"],
    [actors.monkey, "npc40"],
    [actors.ex, "kinko_ex"],
  ].forEach(([actor, key]) => {
    placeChapter4BaseActor(actor, key);
  });
}

function placeChapter4BaseMonkeyOnly() {
  const actors = getChapter4BaseActors();
  [actors.aokiji, actors.dog, actors.ex].forEach((actor) => hideChapter4BaseActor(actor));
  placeChapter4BaseActor(actors.monkey, "npc40", CHAPTER4_BASE_ACTOR_POSITIONS.npc40);
}

function hideChapter4BaseActor(actor) {
  if (!actor) return;
  actor.mapId = 99;
  actor.following = false;
  actor.staticNpc = true;
  actor.fixedPlacement = true;
  actor.walkTime = 0;
}

function hideChapter4BaseEnemies() {
  const actors = getChapter4BaseActors();
  [actors.aokiji, actors.dog, actors.monkey, actors.ex].forEach((actor) => {
    hideChapter4BaseActor(actor);
  });
}

function updateChapter4BaseTriggers() {
  if (dialogueState || menuOpen || battleState?.active || sceneFade || transformCutscene || chapterCompleteTransition || restCutscene || chapter4AlarmFlash || chapter4CutsceneMove) return;
  if (currentMapIndex === 11 && chapter4State.phase === "rescue_cell_found") {
    if (player.x <= CHAPTER4_CELL_RESCUE_TRIGGER_X) startChapter4RescueCellFinale();
    return;
  }
  if (currentMapIndex !== 10) return;
  if (chapter4State.phase === "base_infiltration") {
    if (chapter4State.baseEncounterDone) return;
    if (player.x < CHAPTER4_BASE_MIDDLE_X) return;
    startChapter4BaseEncounter();
    return;
  }
  if (chapter4State.phase === "base_rescue") {
    if (!chapter4State.rescuePartyJoined || chapter4State.rescueEncounterStarted || chapter4State.rescueBattleWon) return;
    if (player.x < CHAPTER4_BASE_MIDDLE_X) return;
    startChapter4RescueBattleIntro();
  }
}

function startChapter4C22TransformDialogue() {
  const hasC22 = getOwnedItemCount("c22_pill") > 0;
  if (!hasC22) {
    startDialogue([{ actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "你們不是要買 C-22 藥錠嗎？先去超商啦。" }], null, hotelOtakuNpc);
    return;
  }
  startDialogue(
    [
      { actor: player, speaker: player.label, body: "肥宅，C-22 藥錠要怎麼用" },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "只要心中想著想要變成的角色，然後把 C-22 藥錠吞下去就可以了。" },
      { actor: vtNpcs[0], speaker: vtNpcs[0].label, body: "你想好要變成什麼角色了嗎" },
      { actor: player, speaker: player.label, body: "上將、三大將，那不就是火影忍者嗎。木葉三將阿。" },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "其實那個比較像..." },
      { actor: player, speaker: player.label, body: "閉嘴，肥宅" },
      { actor: player, speaker: player.label, body: "我是資深動漫豚，火影忍者、鬼滅之刃、咒術迴戰，我老熟的" },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "(媽的...只會看卡通)" },
      { actor: player, speaker: player.label, body: "說不出話來了吧" },
      { actor: player, speaker: player.label, body: "那我要變了(吞下)" },
    ],
    () => startChapter4TransformCutscene(() => {
      chapter4State.c22Explained = true;
      chapter4State.phase = "base_entry";
      hotelOtakuNpc.following = true;
      hotelOtakuNpc.staticNpc = false;
      hotelOtakuNpc.fixedPlacement = false;
      hotelOtakuNpc.mapId = currentMapIndex;
      hotelOtakuNpc.speed = 245;
      addCharacterToTeam("hotel_otaku");
      syncFollowIndexesFromTeamSlots();
      seedTrail(hotelOtakuNpc);
      saveGame();
      startDialogue(
        [
          { actor: player, speaker: player.label, body: "肥宅，你就跟著我們吧，看我怎麼把親親子救回來。" },
          { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "蛤...為什麼我也要去。" },
        ],
        null,
        hotelOtakuNpc
      );
    }),
    hotelOtakuNpc
  );
}

function startChapter4BaseEncounter() {
  const { monkey } = getChapter4BaseActors();
  if (monkey) {
    monkey.walkTime = 0;
    monkey.direction = "right";
    monkey.idleDirection = "right";
  }
  startDialogue(
    [
      { actor: player, speaker: "(石頭)", body: "咕嚕嚕" },
      { actor: player, speaker: player.label, body: "(糟糕...踢到石頭)" },
    ],
    startChapter4MonkeyDiscoveryDialogue,
    null
  );
}

function startChapter4BaseEntryDialogue() {
  if (chapter4State.phase !== "base_infiltration" || chapter4State.baseEncounterDone || chapter4State.baseEntryWarned) return;
  chapter4State.baseEntryWarned = true;
  saveGame();
  startDialogue(
    [{ actor: player, speaker: player.label, body: "小心點，不要被發現了。" }],
    null,
    null
  );
}

function startChapter4MonkeyDiscoveryDialogue() {
  const { monkey } = getChapter4BaseActors();
  if (monkey) {
    monkey.direction = "left";
    monkey.idleDirection = "left";
    monkey.walkTime = 0;
  }
  startDialogue(
    [
      { actor: monkey, speaker: "偷猿", body: "嗯? 是隻狐狸。" },
      { actor: player, speaker: player.label, body: "我叫九尾親親獸。" },
      { actor: monkey, speaker: "偷猿", body: "嗨! 九尾親親獸。" },
      { actor: vtNpcs[0], speaker: vtNpcs[0].label, body: "他一定是把九尾親親獸當作上將了。" },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "唉..." },
      { actor: monkey, speaker: "偷猿", body: "(咔噠)" },
    ],
    startChapter4BaseAlarm,
    monkey
  );
}

function startChapter4BaseAlarm() {
  keys.clear();
  chapter4AlarmFlash = {
    timer: 0,
    duration: CHAPTER4_BASE_ALARM_FLASH_TIME,
    onComplete: startChapter4BaseReinforcements,
  };
}

function startChapter4BaseReinforcements() {
  const { aokiji, dog } = getChapter4BaseActors();
  placeChapter4BaseActor(aokiji, "npc38", CHAPTER4_BASE_REINFORCEMENT_STARTS.npc38);
  placeChapter4BaseActor(dog, "npc39", CHAPTER4_BASE_REINFORCEMENT_STARTS.npc39);
  startChapter4ActorMove(
    aokiji,
    CHAPTER4_BASE_ACTOR_POSITIONS.npc38,
    () => startChapter4ActorMove(
      dog,
      CHAPTER4_BASE_ACTOR_POSITIONS.npc39,
      startChapter4BaseAlarmDialogue,
      { speed: 285, finalDirection: "left" }
    ),
    { speed: 285, finalDirection: "left" }
  );
}

function startChapter4BaseAlarmDialogue() {
  const { aokiji, dog, monkey } = getChapter4BaseActors();
  startDialogue(
    [
      { actor: aokiji, speaker: "青雉RA", body: "發生甚麼事情。" },
      { actor: dog, speaker: "蕭犬", body: "誰按的警鈴。" },
      { actor: monkey, speaker: "偷猿", body: "有奇怪的人跑來了。" },
      { actor: player, speaker: player.label, body: "怎麼了...我們不都是火影的粉絲嗎。" },
      { actor: dog, speaker: "蕭犬", body: "我不認識火影，我只認識二十一世紀最偉大的動漫作品海賊王。" },
    ],
    startChapter4BaseExWalkIn,
    dog
  );
}

function startChapter4BaseExWalkIn() {
  const { ex } = getChapter4BaseActors();
  placeChapter4BaseActor(ex, "kinko_ex", CHAPTER4_BASE_REINFORCEMENT_STARTS.kinko_ex);
  startChapter4ActorMove(
    ex,
    CHAPTER4_BASE_ACTOR_POSITIONS.kinko_ex,
    startChapter4BaseExDialogue,
    { speed: 285, finalDirection: "left" }
  );
}

function startChapter4BaseExDialogue() {
  const { ex } = getChapter4BaseActors();
  startDialogue(
    [
      { actor: ex, speaker: "小玉", body: "他們跟親親子是一夥的，趕快把他們都抓起來。" },
      { actor: player, speaker: player.label, body: "小玉你怎麼在這。" },
      { actor: ex, speaker: "小玉", body: "我說過會讓她付出代價，讓她永遠做不了 VT。" },
      { actor: player, speaker: player.label, body: "完蛋，好像只能逃跑了。" },
    ],
    startChapter4PartyRetreat,
    ex
  );
}

function startChapter4PartyRetreat() {
  const road = getCurrentRoad();
  const target = {
    x: clamp(player.x - 170, road.left + 80, road.right - 80),
    y: player.y,
    direction: "left",
  };
  startChapter4ActorMove(player, target, startChapter4MonkeyBlocksEscape, { speed: 260, finalDirection: "right" });
}

function addChapter4MonkeyTeleportBurst(x, y, intensity = 1) {
  const centerY = y - 58;
  const count = Math.round(54 * intensity);
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 110 + Math.random() * 270 * intensity;
    const startRadius = Math.random() * 38;
    sparkles.push({
      x: x + Math.cos(angle) * startRadius,
      y: centerY + Math.sin(angle) * startRadius * 0.55,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed * 0.42 - 54 - Math.random() * 110,
      life: 0.62 + Math.random() * 0.46,
      maxLife: 1.08,
      size: 5 + Math.random() * 10 * intensity,
      color: Math.random() < 0.36 ? "#fffbe0" : Math.random() < 0.78 ? "#ffe16f" : "#ff9d2e",
    });
  }
}

function addChapter4MonkeyTeleportTrail(fromX, fromY, toX, toY) {
  chapter4TeleportEffects.push({
    fromX,
    fromY,
    toX,
    toY,
    life: 0,
    duration: 0.92,
    seed: Math.random() * 1000,
  });
  addChapter4MonkeyTeleportBurst(fromX, fromY, 1.1);
  addChapter4MonkeyTeleportBurst(toX, toY, 1.55);
  const trailCount = 42;
  for (let i = 1; i < trailCount; i += 1) {
    const t = i / trailCount;
    const arc = Math.sin(t * Math.PI);
    sparkles.push({
      x: fromX + (toX - fromX) * t + (Math.random() - 0.5) * 44,
      y: fromY + (toY - fromY) * t - 58 - arc * 82 + (Math.random() - 0.5) * 26,
      vx: (Math.random() - 0.5) * 70,
      vy: -42 - Math.random() * 92,
      life: 0.38 + Math.random() * 0.44,
      maxLife: 0.82,
      size: 4 + Math.random() * 8,
      color: Math.random() < 0.42 ? "#fffbe0" : Math.random() < 0.75 ? "#ffe16f" : "#ff9d2e",
    });
  }
}

function startChapter4MonkeyBlocksEscape() {
  const { monkey, aokiji } = getChapter4BaseActors();
  const road = getCurrentRoad();
  if (monkey) {
    const fromX = monkey.x;
    const fromY = monkey.y;
    const toX = clamp(player.x - 125, road.left + 56, road.right - 56);
    const toY = clamp(player.y, road.top + 18, road.bottom - 18);
    monkey.x = toX;
    monkey.y = toY;
    monkey.mapId = currentMapIndex;
    monkey.staticNpc = true;
    monkey.fixedPlacement = true;
    monkey.following = false;
    monkey.direction = "right";
    monkey.idleDirection = "right";
    monkey.walkTime = 0;
    seedTrail(monkey);
    addChapter4MonkeyTeleportTrail(fromX, fromY, toX, toY);
  }
  startDialogue(
    [
      { actor: monkey, speaker: "偷猿", body: "是不可能放你們走的，VT 通通給我畢業。" },
      { actor: aokiji, speaker: "青雉RA", body: "讓我把VT通通凍起來" },
      { actor: player, speaker: player.label, body: "波貝貝、豬鼻醬、肥宅，要上了。" },
    ],
    openChapter4BaseBattle,
    monkey
  );
}

function getChapter4EnemyConfigs(scale = 1) {
  const { aokiji, dog, monkey, ex } = getChapter4BaseActors();
  return [
    {
      enemyActor: dog,
      enemyName: "蕭犬",
      enemyUnitId: "npc39",
      enemySkills: PLAYER_SKILLS_BY_ACTOR.npc39,
      enemyMaxHp: Math.round(6200 * scale),
      targetOffsetX: 0,
      targetOffsetY: -36,
    },
    {
      enemyActor: monkey,
      enemyName: "偷猿",
      enemyUnitId: "npc40",
      enemySkills: PLAYER_SKILLS_BY_ACTOR.npc40,
      enemyMaxHp: Math.round(6000 * scale),
      targetOffsetX: 78,
      targetOffsetY: -48,
    },
    {
      enemyActor: aokiji,
      enemyName: "青雉RA",
      enemyUnitId: "npc38",
      enemySkills: PLAYER_SKILLS_BY_ACTOR.npc38,
      enemyMaxHp: Math.round(6000 * scale),
      targetOffsetX: 156,
      targetOffsetY: -112,
    },
    {
      enemyActor: ex,
      enemyName: "小玉",
      enemyUnitId: "kinko_ex",
      enemySkills: KINKO_EX_SKILLS,
      enemyMaxHp: Math.round(4600 * scale),
      targetOffsetX: 234,
      targetOffsetY: -20,
    },
  ];
}

function openChapter4BaseBattle() {
  const monkey = getCharacterById("npc40");
  if (!canStartBattleAgainst(monkey, "偷猿")) return;
  chapter4State.baseEncounterDone = true;
  saveGame();
  const party = createBattlePartyFromIds(["hero", "npc1", "npc2", "hotel_otaku"]);
  openSlotBattle({
    mode: "chapter4-base",
    stage: 4,
    party,
    enemies: getChapter4EnemyConfigs(1),
    enemyDamageScale: 1.18,
    playerDamageScale: 0.76,
    expReward: 0,
    shellFeeReward: 0,
    onLose: () => startChapter4CaptureSequence(false),
    onWin: () => startChapter4CaptureSequence(true),
  });
}

function startChapter4CaptureSequence(won = false) {
  chapter4State.phase = "base_captive";
  chapter4State.captiveSleepCount = 0;
  chapter4State.captiveWakeSeen = false;
  setChapter4BasePartyDefeatedPose(!won);
  saveGame();
  const { aokiji, monkey } = getChapter4BaseActors();
  const lines = won
    ? [
      { actor: monkey, speaker: "偷猿", body: "可惡，還有後援，全部抓起來！" },
      { actor: aokiji, speaker: "青雉RA", body: "把他們關起來。" },
    ]
    : [
      { actor: aokiji, speaker: "青雉RA", body: "把他們關起來。" },
    ];
  startDialogue(lines, () => {
    startChapterCompleteTransition("我們被關起來了...", () => {
      startSceneFadeIn(() => startChapter4CaptiveWakeDialogue(), MAP_CHANGE_FADE_IN_TIME);
    }, {
      onBeforeFadeOut: () => placeChapter4CapturedParty({ initialWake: true }),
    });
  }, aokiji || monkey);
}

function setChapter4BasePartyDefeatedPose(enabled) {
  [player, vtNpcs[0], vtNpcs[1], hotelOtakuNpc].forEach((actor) => {
    if (!actor) return;
    actor.layingDown = Boolean(enabled);
    actor.walkTime = 0;
    seedTrail(actor);
  });
}

function placeChapter4CapturedParty(options = {}) {
  currentMapIndex = 11;
  const road = getCurrentRoad();
  const positions = CHAPTER4_CELL_POSITIONS;
  const initialWake = Boolean(options.initialWake) || !chapter4State.captiveWakeSeen;
  const capturedActors = [
    [player, "hero"],
    [vtNpcs[0], "npc1"],
    [vtNpcs[1], "npc2"],
    [vtNpcs[2], "npc3"],
    [getCharacterById("npc14"), "npc14"],
    [hotelOtakuNpc, "npc32"],
  ];
  capturedActors.forEach(([actor, key]) => {
    const position = positions[key];
    if (!actor || !position) return;
    actor.mapId = 11;
    actor.x = clamp(position.x, road.left + 18, road.right - 18);
    actor.y = clamp(position.y, road.top + 18, road.bottom - 18);
    actor.direction = position.direction;
    actor.idleDirection = position.direction;
    actor.following = false;
    actor.layingDown = key === "npc14" || (initialWake && key !== "npc3");
    const canRoamInCell = actor !== player && key !== "npc14" && !actor.layingDown;
    actor.staticNpc = actor !== player && !canRoamInCell;
    actor.fixedPlacement = actor !== player && !canRoamInCell;
    if (canRoamInCell) prepareChapter4CaptiveRoamer(actor);
    actor.walkTime = 0;
    seedTrail(actor);
  });
  hideChapter4BaseEnemies();
  syncFollowIndexesFromTeamSlots();
  snapCameraToPlayer();
}

function prepareChapter4CaptiveRoamer(actor) {
  if (!actor) return;
  actor.staticNpc = false;
  actor.fixedPlacement = false;
  actor.following = false;
  actor.speed = Math.max(actor.speed || 0, 150);
  actor.patrolState = "pause";
  actor.patrolTimer = 0.3 + Math.random() * 1.2;
  actor.patrolHeading = Math.random() < 0.5 ? -1 : 1;
  actor.patrolRise = (Math.random() * 2 - 1) * 0.35;
}

function wakeChapter4CapturedParty() {
  [player, vtNpcs[0], vtNpcs[1], vtNpcs[2], hotelOtakuNpc].forEach((actor) => {
    if (!actor) return;
    actor.layingDown = false;
    if (actor !== player) prepareChapter4CaptiveRoamer(actor);
    actor.walkTime = 0;
    seedTrail(actor);
  });
  const kidney = getCharacterById("npc14");
  if (kidney) {
    kidney.layingDown = true;
    kidney.walkTime = 0;
    seedTrail(kidney);
  }
  chapter4State.captiveWakeSeen = true;
  saveGame();
}

function faceChapter4CaptiveWakeSpeakers() {
  [player, vtNpcs[0], vtNpcs[1], hotelOtakuNpc].forEach((actor) => {
    if (!actor) return;
    actor.direction = "right";
    actor.idleDirection = "right";
    actor.walkTime = 0;
    seedTrail(actor);
  });
  if (vtNpcs[2]) {
    vtNpcs[2].direction = "left";
    vtNpcs[2].idleDirection = "left";
    vtNpcs[2].walkTime = 0;
    seedTrail(vtNpcs[2]);
  }
}

function startChapter4CaptiveWakeDialogue() {
  wakeChapter4CapturedParty();
  faceChapter4CaptiveWakeSpeakers();
  startDialogue(
    [
      { actor: player, speaker: player.label, body: "這裡是哪裡..." },
      { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "你們終於醒了" },
      { actor: vtNpcs[0], speaker: vtNpcs[0].label, body: "親親子，你果然在這裡" },
      { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "你們怎麼會來..." },
      { actor: vtNpcs[1], speaker: vtNpcs[1].label, body: "當然是來接你回去的" },
      { actor: player, speaker: player.label, body: "我們被關起來了嗎" },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "親親子你沒受傷吧" },
      { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "我還好...不過不知道要關到什麼時候" },
      { actor: vtNpcs[1], speaker: vtNpcs[1].label, body: "至少這裡還有地舖可以水餃" },
      { actor: player, speaker: player.label, body: "腰子親親獸怎麼也在" },
      { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "他不知道為甚麼叫都叫不醒" },
      { actor: vtNpcs[1], speaker: vtNpcs[1].label, body: "在哪裡都睡得這麼好，好羨慕..." },
    ],
    null,
    player
  );
}

function startChapter4CaptiveMorningDialogue() {
  startDialogue(
    [
      { actor: player, speaker: player.label, body: "又過了一天..." },
      { actor: player, speaker: player.label, body: "到底什麼時候才能出去。" },
      { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "先保存體力吧，急也沒用。" },
    ],
    null,
    player
  );
}

function startChapter4CaptiveTransformBackAfterRest() {
  startChapter4TransformBackCutscene(() => {
    saveGame();
    startDialogue(
      [
        { actor: player, speaker: player.label, body: "我怎麼變回來了" },
        { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "C-22藥錠的藥效過了" },
      ],
      null,
      hotelOtakuNpc
    );
  });
}

function startChapter4CaptiveDoorDialogue() {
  chapter4State.captiveDoorTalks = (chapter4State.captiveDoorTalks || 0) + 1;
  saveGame();
  const lines = [
    { actor: getCharacterById("npc40") || player, speaker: "偷猿", body: "外面有人看著，別想逃。" },
    { actor: getCharacterById("npc38") || player, speaker: "青雉RA", body: "安靜一點，等上面決定怎麼處理你們。" },
    { actor: getCharacterById("npc39") || player, speaker: "蕭犬", body: "VT 通通給我畢業，門別亂碰。" },
    { actor: kinkoExNpc, speaker: "小玉", body: "親親子，妳就在裡面好好反省吧。" },
  ];
  startDialogue([lines[Math.floor(Math.random() * lines.length)]], null, player);
}

function startChapter4RescueFlashback() {
  chapter4State.rescueFlashbackStarted = true;
  chapter4State.rescueSearchStarted = false;
  saveGame();
  const outsideAnchor = getChapter4CellExitDialogueAnchor();
  startDialogue(
    [
      { actor: player, speaker: player.label, body: "都兩天了，蕭政銘現在到底在幹嘛..." },
      { actor: outsideAnchor, speaker: "外面", body: "砰！鏘！轟！" },
      { actor: vtNpcs[0], speaker: vtNpcs[0].label, body: "外面好像打起來了。" },
    ],
    () => {
      startChapterCompleteTransition("時間回到兩天前...", () => {
        startChapter4XiaoRescueDialogue();
      }, {
        onBeforeFadeOut: () => prepareChapter4XiaoRescueScene(),
      });
    },
    player
  );
}

function getChapter4CellExitDialogueAnchor() {
  const point = TELEPORT_POINTS.find((teleportPoint) => teleportPoint.id === "base_cell_exit");
  return {
    x: point?.x ?? CHAPTER4_CELL_DOOR_X,
    y: point?.y ?? 575,
    label: "外面",
    dialogueVisualHeight: 72,
  };
}

function startChapter4XiaoRescueCutscene() {
  prepareChapter4XiaoRescueScene();
  startSceneFadeIn(() => {
    startChapter4XiaoRescueDialogue();
  }, MAP_CHANGE_FADE_IN_TIME);
}

function prepareChapter4XiaoRescueScene() {
  chapter4State.phase = "rescue_flashback";
  currentMapIndex = 9;
  setChapter4Transformed(false);
  player.hidden = true;
  [player, ...npcs].forEach((actor) => {
    if (actor === questNpc) return;
    actor.following = false;
    actor.walkTime = 0;
    if (actor !== player) {
      actor.mapId = 99;
      actor.staticNpc = true;
      actor.fixedPlacement = true;
    }
  });
  enforceChapter4CaptivePartyOffscreen();
  placeStaticActor(questNpc, 9, { x: 760, y: 638, direction: "right" }, { layingDown: false });
  player.x = 620;
  player.y = 638;
  player.direction = "right";
  player.idleDirection = "right";
  player.walkTime = 0;
  hideChapter4BaseEnemies();
  [player, questNpc].forEach(seedTrail);
  snapCameraToPlayer();
}

function startChapter4XiaoRescueDialogue() {
  startDialogue(
    [
      { actor: questNpc, speaker: questNpc.label, body: "怎麼到處都沒有親親子的消息..." },
      { actor: questNpc, speaker: "電話", body: "鈴鈴鈴" },
      { actor: questNpc, speaker: "親親幫幫眾", body: "ㄉㄨㄚˇ欸，我們收到親親子的消息了", phoneRemote: true },
      { actor: questNpc, speaker: questNpc.label, body: "真的嗎? 她人在哪裡?" },
      { actor: questNpc, speaker: "親親幫幫眾", body: "有人在基地附近看到她的身影", phoneRemote: true },
      { actor: questNpc, speaker: questNpc.label, body: "基地附近? 那不是V黑娛樂的根據地嗎" },
      { actor: questNpc, speaker: questNpc.label, body: "只有看到她一個人?" },
      { actor: questNpc, speaker: "親親幫幫眾", body: "身旁好像還有穿著海軍衣服的人在", phoneRemote: true },
      { actor: questNpc, speaker: questNpc.label, body: "肯定是被他們拐走了... 好吧，我知道了，謝謝你們" },
      { actor: questNpc, speaker: "親親幫幫眾", body: "ㄉㄨㄚˇ欸，你該不會要自己去吧", phoneRemote: true },
      { actor: questNpc, speaker: questNpc.label, body: "沒事，我再想辦法，先這樣，掰掰" },
      { actor: questNpc, speaker: "電話", body: "(掛斷)" },
      { actor: questNpc, speaker: questNpc.label, body: "怎麼辦呢..." },
      { actor: questNpc, speaker: "電話", body: "鈴鈴鈴" },
      { actor: questNpc, speaker: questNpc.label, body: "怎麼又有電話了，現在沒空啦" },
      { actor: questNpc, speaker: player.label, body: "蕭政銘，你死去哪了", phoneRemote: true },
      { actor: questNpc, speaker: questNpc.label, body: "..." },
      { actor: questNpc, speaker: player.label, body: "我們知道親親子在哪了，現在要去救他，跟你說一聲", phoneRemote: true },
      { actor: questNpc, speaker: questNpc.label, body: "是喔" },
      { actor: questNpc, speaker: player.label, body: "算了，不指望你", phoneRemote: true },
      { actor: questNpc, speaker: player.label, body: "我們已經擬出一個計畫，cosplay混進去帶親親子出來", phoneRemote: true },
      { actor: questNpc, speaker: questNpc.label, body: "你白癡嗎..." },
      { actor: questNpc, speaker: questNpc.label, body: "算了隨便你們，我現在很忙" },
      { actor: questNpc, speaker: "電話", body: "(掛斷)" },
      { actor: questNpc, speaker: questNpc.label, body: "為什麼下面的人一個個都再給我惹麻煩..." },
      { actor: questNpc, speaker: questNpc.label, body: "怎麼辦，應該要找誰來幫忙" },
      { actor: questNpc, speaker: questNpc.label, body: "打給羅傑問問看好了。" },
      { actor: questNpc, speaker: "電話", body: "鈴鈴鈴" },
      { actor: questNpc, speaker: questNpc.label, body: "喂，羅傑，你有沒有空，最近這裡出了點事。" },
      { actor: questNpc, speaker: "羅傑", body: "沒空，自己處理，掰掰。", phoneRemote: true },
      { actor: questNpc, speaker: questNpc.label, body: "認真的啦，我家妹妹被綁走了，可不可以來幫忙。" },
      { actor: questNpc, speaker: "羅傑", body: "我不認識 VT，VT 的事情找 VT 處理就好，掰掰。", phoneRemote: true },
      { actor: questNpc, speaker: "電話", body: "(掛斷)" },
      { actor: questNpc, speaker: questNpc.label, body: "沒路用欸咖小，找什麼 VT 處理..." },
      { actor: questNpc, speaker: questNpc.label, body: "VT...有了，有個傳說中的台男 1V，他應該能夠幫上忙。" },
      { actor: questNpc, speaker: questNpc.label, body: "還有誰是認識的...，難道要找之前來亂抽菸的人嗎..." },
    ],
    () => {
      chapter4State.rescueSearchStarted = true;
      saveGame();
      startChapter4RecruitHisadaScene();
    },
    questNpc
  );
}

function startChapter4RecruitHisadaScene() {
  const hisada = getCharacterById("npc9");
  prepareChapter4RecruitHisadaScene();
  startSceneFadeIn(() => startChapter4RecruitHisadaDialogue(hisada), MAP_CHANGE_FADE_IN_TIME);
}

function prepareChapter4RecruitHisadaScene() {
  const hisada = getCharacterById("npc9");
  currentMapIndex = 12;
  player.hidden = true;
  player.x = CHAPTER4_HISADA_RECRUIT_POSITIONS.camera.x;
  player.y = CHAPTER4_HISADA_RECRUIT_POSITIONS.camera.y;
  player.direction = CHAPTER4_HISADA_RECRUIT_POSITIONS.camera.direction;
  player.walkTime = 0;
  [getCharacterById("npc36"), getCharacterById("npc12")].forEach((actor) => {
    if (!actor) return;
    actor.mapId = 99;
    actor.following = false;
  });
  placeStaticActor(questNpc, 12, CHAPTER4_HISADA_RECRUIT_POSITIONS.npc4, { layingDown: false });
  if (hisada) placeStaticActor(hisada, 12, CHAPTER4_HISADA_RECRUIT_POSITIONS.npc9, { layingDown: false });
  hideChapter4BaseEnemies();
  [player, questNpc, hisada].filter(Boolean).forEach(seedTrail);
  snapCameraToPlayer();
}

function startChapter4RecruitHisadaDialogue(hisada = getCharacterById("npc9")) {
  startDialogue(
    [
      { actor: questNpc, speaker: questNpc.label, body: "久田親親獸大哥，能否幫我一個忙" },
      { actor: hisada || questNpc, speaker: hisada?.label || "久田親親獸", body: "甚麼事?" },
      { actor: questNpc, speaker: questNpc.label, body: "我家VT被拐走了，需要你的力量" },
      { actor: hisada || questNpc, speaker: hisada?.label || "久田親親獸", body: "可以是可以" },
      { actor: hisada || questNpc, speaker: hisada?.label || "久田親親獸", body: "但是我這兩天有露腿直播企劃，可能要等我忙完" },
      { actor: questNpc, speaker: questNpc.label, body: "兩天嗎...好，那兩天後我們在基地門口會合" },
      { actor: hisada || questNpc, speaker: hisada?.label || "久田親親獸", body: "那我先走了，掰掰" },
    ],
    () => {
      if (hisada) {
        hisada.mapId = 99;
        hisada.following = false;
        seedTrail(hisada);
      }
      startDialogue(
        [{ actor: questNpc, speaker: questNpc.label, body: "嗯? 人怎麼突然就消失了，這就是台男1V嗎" }],
        () => {
          startChapterCompleteTransition("一天後...", () => startChapter4RecruitSmokersDialogue(), {
            onBeforeFadeOut: () => prepareChapter4RecruitSmokersScene(),
          });
        },
        questNpc
      );
    },
    hisada || questNpc
  );
}

function startChapter4RecruitSmokersScene() {
  prepareChapter4RecruitSmokersScene();
  startSceneFadeIn(() => startChapter4RecruitSmokersDialogue(), MAP_CHANGE_FADE_IN_TIME);
}

function prepareChapter4RecruitSmokersScene() {
  const aki = getCharacterById("npc12");
  const butt = getCharacterById("npc36");
  currentMapIndex = 1;
  player.hidden = true;
  player.x = CHAPTER4_SMOKER_RECRUIT_POSITIONS.camera.x;
  player.y = CHAPTER4_SMOKER_RECRUIT_POSITIONS.camera.y;
  player.direction = CHAPTER4_SMOKER_RECRUIT_POSITIONS.camera.direction;
  player.walkTime = 0;
  const hisada = getCharacterById("npc9");
  if (hisada) {
    hisada.mapId = 99;
    hisada.following = false;
  }
  placeStaticActor(questNpc, 1, CHAPTER4_SMOKER_RECRUIT_POSITIONS.npc4, { layingDown: false });
  if (aki) placeStaticActor(aki, 1, CHAPTER4_SMOKER_RECRUIT_POSITIONS.npc12, { layingDown: false });
  if (butt) placeStaticActor(butt, 1, CHAPTER4_SMOKER_RECRUIT_POSITIONS.npc36, { layingDown: false });
  hideChapter4BaseEnemies();
  [player, questNpc, aki, butt].filter(Boolean).forEach(seedTrail);
  snapCameraToPlayer();
}

function startChapter4RecruitSmokersDialogue() {
  const aki = getCharacterById("npc12");
  const butt = getCharacterById("npc36");
  startDialogue(
    [
      { actor: butt || questNpc, speaker: butt?.label || "菸頭親親獸", body: "(抽菸中...)" },
      { actor: questNpc, speaker: questNpc.label, body: "嘿，菸頭醬，又在甲婚喔" },
      { actor: butt || questNpc, speaker: butt?.label || "菸頭親親獸", body: "唉唷，這不是差低扛霸子蕭發仔嗎" },
      { actor: questNpc, speaker: questNpc.label, body: "來啦，這包請你" },
      { actor: butt || questNpc, speaker: butt?.label || "菸頭親親獸", body: "怎麼這麼客氣，平常在叉滴門口抽菸不是說很臭嗎" },
      { actor: questNpc, speaker: questNpc.label, body: "亂講，最喜歡聞你抽的菸了，好香好香" },
      { actor: questNpc, speaker: questNpc.label, body: "其實...有事情想請二位幫忙" },
      { actor: aki || questNpc, speaker: aki?.label || "阿基親親獸", body: "你家妹妹的事情對吧，聽說其他兩人還有粉色生物也一起進去了" },
      { actor: questNpc, speaker: questNpc.label, body: "哀...那群白癡" },
      { actor: aki || questNpc, speaker: aki?.label || "阿基親親獸", body: "好啦，幫你一把，但之後我們可還是競爭關係" },
      { actor: butt || questNpc, speaker: butt?.label || "菸頭親親獸", body: "我可沒說要幫忙" },
      { actor: butt || questNpc, speaker: butt?.label || "菸頭親親獸", body: "畢竟你只給我一包菸" },
      { actor: questNpc, speaker: questNpc.label, body: "來來來，店員，店裡的菸讓這隻羊隨便拿，全部我來買單" },
    ],
    () => {
      startChapterCompleteTransition("兩天後...", () => startChapter4RescueGateDialogue(), {
        onBeforeFadeOut: () => prepareChapter4RescueGateScene(false),
      });
    },
    questNpc
  );
}

function prepareChapter4RescueGateScene(activateFollowers = false) {
  const hisada = getCharacterById("npc9");
  const butt = getCharacterById("npc36");
  const aki = getCharacterById("npc12");
  chapter4State.phase = "base_rescue";
  chapter4State.rescueEncounterStarted = false;
  if (!activateFollowers) chapter4State.rescuePartyJoined = false;
  currentMapIndex = 2;
  player.hidden = false;
  player.x = CHAPTER4_RESCUE_GATE_POSITIONS.npc4.x;
  player.y = CHAPTER4_RESCUE_GATE_POSITIONS.npc4.y;
  player.direction = CHAPTER4_RESCUE_GATE_POSITIONS.npc4.direction;
  player.idleDirection = player.direction;
  player.walkTime = 0;
  applyChapter4HeroForm();
  questNpc.mapId = 99;
  questNpc.following = false;
  questNpc.staticNpc = true;
  questNpc.fixedPlacement = true;
  enforceChapter4CaptivePartyOffscreen();
  if (hisada) placeStaticActor(hisada, 2, CHAPTER4_RESCUE_GATE_POSITIONS.npc9, { layingDown: false });
  if (butt) placeStaticActor(butt, 2, CHAPTER4_RESCUE_GATE_POSITIONS.npc36, { layingDown: false });
  if (aki) placeStaticActor(aki, 2, CHAPTER4_RESCUE_GATE_POSITIONS.npc12, { layingDown: false });
  hideChapter4BaseEnemies();
  teamSlots.splice(0, teamSlots.length, ...CHAPTER4_RESCUE_PARTY_IDS);
  [player, hisada, butt, aki].filter(Boolean).forEach(seedTrail);
  if (activateFollowers) activateChapter4RescuePartyFollowers();
  snapCameraToPlayer();
}

function prepareChapter4RescueBaseScene() {
  chapter4State.phase = "base_rescue";
  chapter4State.rescuePartyJoined = true;
  chapter4State.rescueEncounterStarted = false;
  player.hidden = false;
  applyChapter4HeroForm();
  enforceChapter4CaptivePartyOffscreen();
  placeChapter4BaseEnemies();
  activateChapter4RescuePartyFollowers({ syncNearPlayer: true });
  const { aokiji, dog, monkey, ex } = getChapter4BaseActors();
  [aokiji, dog, monkey, ex].forEach((actor) => {
    if (!actor) return;
    actor.direction = "left";
    actor.idleDirection = "left";
    actor.walkTime = 0;
    seedTrail(actor);
  });
  snapCameraToPlayer();
}

function activateChapter4RescuePartyFollowers(options = {}) {
  const syncNearPlayer = Boolean(options.syncNearPlayer);
  chapter4State.rescuePartyJoined = true;
  const rescueFollowers = [getCharacterById("npc9"), getCharacterById("npc36"), getCharacterById("npc12")].filter(Boolean);
  rescueFollowers.forEach((actor) => {
    if (!actor) return;
    actor.mapId = currentMapIndex;
    actor.following = true;
    actor.staticNpc = false;
    actor.fixedPlacement = false;
    actor.layingDown = false;
    actor.direction = player.direction;
    actor.idleDirection = player.direction;
    actor.walkTime = 0;
  });
  syncFollowIndexesFromTeamSlots();
  if (syncNearPlayer) {
    syncFollowersNearPlayer(player.direction, getCurrentRoad());
  } else {
    rescueFollowers.forEach(seedTrail);
  }
}

function startChapter4RescueGateDialogue() {
  const hisada = getCharacterById("npc9");
  const butt = getCharacterById("npc36");
  const aki = getCharacterById("npc12");
  startDialogue(
    [
      { actor: player, speaker: player.label, body: "都到齊了齁，那我們就進去吧" },
      { actor: butt || player, speaker: butt?.label || "菸頭親親獸", body: "讓那些cosplay的憨仔知道我們VT不是好惹的" },
      { actor: hisada || player, speaker: hisada?.label || "久田親親獸", body: "以我台男1V的名義發誓，絕對會讓大家都安全的" },
      { actor: aki || player, speaker: aki?.label || "阿基親親獸", body: "我待會還有歌回，速戰速決吧" },
    ],
    () => {
      activateChapter4RescuePartyFollowers();
      saveGame();
    },
    player
  );
}

function startChapter4RescueBattleIntro(options = {}) {
  chapter4State.rescueEncounterStarted = true;
  player.hidden = false;
  player.direction = "right";
  player.idleDirection = "right";
  player.walkTime = 0;
  const { aokiji, dog, monkey, ex } = getChapter4BaseActors();
  [getCharacterById("npc9"), getCharacterById("npc36"), getCharacterById("npc12")].forEach((actor) => {
    if (!actor) return;
    actor.direction = "right";
    actor.idleDirection = "right";
    actor.walkTime = 0;
    seedTrail(actor);
  });
  [aokiji, dog, monkey, ex].forEach((actor) => {
    if (!actor) return;
    actor.direction = "left";
    actor.idleDirection = "left";
    actor.walkTime = 0;
    seedTrail(actor);
  });
  startDialogue(
    [
      { actor: player, speaker: player.label, body: "把VT通通放出來" },
      { actor: monkey, speaker: monkey?.label || "偷猿", body: "真好，又有VT送上門了" },
      { actor: dog, speaker: dog?.label || "蕭犬", body: "想把人帶走，先問過我們。" },
      { actor: ex, speaker: ex?.label || "小玉", body: "..." },
      { actor: aokiji, speaker: aokiji?.label || "青雉RA", body: "通通抓起來" },
    ],
    openChapter4RescueBattle,
    player
  );
  return;
  currentMapIndex = 10;
  player.hidden = true;
  placeChapter4BaseEnemies();
  Object.entries(CHAPTER4_RESCUE_XD_POSITIONS).forEach(([id, position]) => {
    const actor = getCharacterById(id);
    if (!actor) return;
    placeStaticActor(actor, 10, {
      x: position.x + 130,
      y: position.y,
      direction: position.direction,
    }, { layingDown: false });
  });
  snapCameraToPlayer();
  const showIntro = () => {
    const { aokiji, dog, monkey, ex } = getChapter4BaseActors();
    startDialogue(
      [
        { actor: questNpc, speaker: questNpc.label, body: "都在這裡了。" },
        { actor: monkey, speaker: monkey?.label || "偷猿", body: "還真的找人來救了。" },
        { actor: dog, speaker: dog?.label || "蕭犬", body: "想把人帶走，先問過我們。" },
        { actor: ex, speaker: ex?.label || "小玉", body: "他們跟親親子是一夥的，趕快把他們都抓起來。" },
        { actor: aokiji, speaker: aokiji?.label || "青雉RA", body: "速戰速決吧。" },
      ],
      openChapter4RescueBattle,
      questNpc
    );
  };
  if (options.fromGate) {
    showIntro();
  } else {
    startSceneFadeIn(showIntro, MAP_CHANGE_FADE_IN_TIME);
  }
}

function openChapter4RescueBattle() {
  const rescueParty = createBattlePartyFromIds(["npc4", "npc9", "npc36", "npc12"]);
  const rescueHpById = {
    npc4: 18888,
    npc9: 6000,
    npc36: 6000,
    npc12: 4600,
  };
  rescueParty.forEach((member) => {
    const battleMaxHp = rescueHpById[member.key] || 6000;
    member.battleMaxHp = battleMaxHp;
    member.battleCurrentHp = battleMaxHp;
  });
  openSlotBattle({
    mode: "chapter4-rescue",
    stage: 4,
    party: rescueParty,
    enemies: getChapter4EnemyConfigs(1),
    enemyDamageScale: 1,
    playerDamageScale: 1,
    expReward: 0,
    shellFeeReward: 0,
    onWin: () => startChapter4RescueFinale(),
    onLose: () => {
      startDialogue(
        [
          { actor: questNpc, speaker: questNpc.label, body: "不能倒在這裡，再來一次。" },
        ],
        openChapter4RescueBattle,
        questNpc
      );
    },
  });
}

function startChapter4RescueFinale() {
  chapter4State.phase = "rescue_finale";
  chapter4State.rescueBattleWon = true;
  currentMapIndex = 11;
  player.hidden = false;
  setChapter4Transformed(false);
  const road = getCurrentRoad();
  const actorsToPlace = [
    [player, { x: 560, y: 638, direction: "right" }],
    [vtNpcs[0], { x: 690, y: 638, direction: "right" }],
    [vtNpcs[1], { x: 800, y: 638, direction: "right" }],
    [vtNpcs[2], { x: 930, y: 638, direction: "right" }],
    [hotelOtakuNpc, { x: 440, y: 668, direction: "right" }],
    [getCharacterById("npc14"), { x: 1040, y: 638, direction: "right" }],
    [questNpc, CHAPTER4_RESCUE_CELL_POSITIONS.npc4],
    [getCharacterById("npc9"), CHAPTER4_RESCUE_CELL_POSITIONS.npc9],
    [getCharacterById("npc36"), CHAPTER4_RESCUE_CELL_POSITIONS.npc36],
    [getCharacterById("npc12"), CHAPTER4_RESCUE_CELL_POSITIONS.npc12],
    [getCharacterById("npc39"), CHAPTER4_RESCUE_CELL_POSITIONS.npc39],
  ];
  actorsToPlace.forEach(([actor, position]) => {
    if (!actor || !position) return;
    actor.mapId = 11;
    actor.x = clamp(position.x, road.left + 18, road.right - 18);
    actor.y = clamp(position.y, road.top + 18, road.bottom - 18);
    actor.direction = position.direction;
    actor.idleDirection = position.direction;
    actor.following = false;
    actor.staticNpc = actor !== player;
    actor.fixedPlacement = actor !== player;
    actor.layingDown = actor?.id === "npc14";
    actor.walkTime = 0;
    seedTrail(actor);
  });
  const { dog } = getChapter4BaseActors();
  snapCameraToPlayer();
  saveGame();
  startSceneFadeIn(() => {
    startDialogue(
      [
        { actor: questNpc, speaker: questNpc.label, body: "全部人都在嗎？能走就快走。" },
        { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "蕭政銘...你真的來救我了？" },
        { actor: dog, speaker: "蕭犬", body: "就算打不贏，我也要和玩弄別人感情的 VT 同歸於盡！" },
        { actor: dog, speaker: "蕭犬", body: "熔岩拳！" },
        { actor: questNpc, speaker: questNpc.label, body: "親親子，退後！" },
        { actor: getCharacterById("npc9"), speaker: "久田親親獸", body: "世界The World。" },
        { actor: getCharacterById("npc9"), speaker: "久田親親獸", body: "我來拖住他，你們快跑。" },
        { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "謝謝你..." },
        { actor: questNpc, speaker: questNpc.label, body: "走！不要讓他的時間白白浪費。" },
      ],
      () => {
        const hisada = getCharacterById("npc9");
        const kidney = getCharacterById("npc14");
        if (hisada) {
          hisada.layingDown = true;
          hisada.staticNpc = true;
          hisada.fixedPlacement = true;
        }
        if (kidney) {
          kidney.layingDown = true;
          kidney.staticNpc = true;
          kidney.fixedPlacement = true;
        }
        startChapter4EndingPages();
      },
      questNpc
    );
  }, MAP_CHANGE_FADE_IN_TIME);
}

function startChapter4RescueFinale() {
  chapter4State.phase = "base_rescue_victory";
  chapter4State.rescueBattleWon = true;
  chapter4State.rescuePartyJoined = false;
  chapter4State.rescueCellEntered = false;
  enforceChapter4CaptivePartyOffscreen();
  enforceChapter4KinkoUnavailable();
  player.hidden = false;
  player.direction = "right";
  player.idleDirection = "right";
  player.walkTime = 0;
  applyChapter4HeroForm();
  setChapter4RescueEnemiesDefeatedPose();
  saveGame();
  startDialogue(
    [
      { actor: player, speaker: player.label, body: "趕快進去找他們" },
      { actor: getCharacterById("npc36") || player, speaker: "抽菸二人組", body: "我們還有事要忙，就先離開了" },
    ],
    startChapter4RescueSmokersLeave,
    player
  );
}

function setChapter4RescueEnemiesDefeatedPose() {
  const { aokiji, dog, monkey, ex } = getChapter4BaseActors();
  [aokiji, dog, monkey, ex].forEach((actor) => {
    if (!actor) return;
    actor.mapId = 10;
    actor.following = false;
    actor.staticNpc = true;
    actor.fixedPlacement = true;
    actor.layingDown = true;
    actor.direction = "left";
    actor.idleDirection = "left";
    actor.walkTime = 0;
    seedTrail(actor);
  });
}

function startChapter4RescueSmokersLeave() {
  const butt = getCharacterById("npc36");
  const aki = getCharacterById("npc12");
  const road = getCurrentRoad();
  startChapter4ActorGroupMove(
    [
      {
        actor: butt,
        target: { x: road.left - 160, y: butt?.y || player.y, direction: "left" },
        options: { speed: 280, finalDirection: "left", hideOnArrive: true },
      },
      {
        actor: aki,
        target: { x: road.left - 220, y: aki?.y || player.y, direction: "left" },
        options: { speed: 280, finalDirection: "left", hideOnArrive: true },
      },
    ],
    startChapter4RescueHisadaLeaves
  );
}

function startChapter4RescueHisadaLeaves() {
  const hisada = getCharacterById("npc9");
  startDialogue(
    [{ actor: hisada || player, speaker: hisada?.label || "久田親親獸", body: "告辭" }],
    () => {
      hideChapter4RescueHelper(hisada);
      finishChapter4RescueVictoryFreeRoam();
    },
    hisada || player
  );
}

function hideChapter4RescueHelper(actor) {
  if (!actor) return;
  actor.mapId = 99;
  actor.following = false;
  actor.staticNpc = true;
  actor.fixedPlacement = true;
  actor.layingDown = false;
  actor.walkTime = 0;
  seedTrail(actor);
}

function finishChapter4RescueVictoryFreeRoam() {
  [getCharacterById("npc9"), getCharacterById("npc36"), getCharacterById("npc12")].forEach(hideChapter4RescueHelper);
  teamSlots.splice(0, teamSlots.length, "hero", null, null, null);
  syncFollowIndexesFromTeamSlots();
  applyChapter4HeroForm();
  saveGame();
}

function prepareChapter4RescueVictoryScene() {
  player.hidden = false;
  applyChapter4HeroForm();
  questNpc.mapId = 99;
  questNpc.following = false;
  questNpc.staticNpc = true;
  questNpc.fixedPlacement = true;
  enforceChapter4CaptivePartyOffscreen();
  [getCharacterById("npc9"), getCharacterById("npc36"), getCharacterById("npc12")].forEach(hideChapter4RescueHelper);
  setChapter4RescueEnemiesDefeatedPose();
  snapCameraToPlayer();
}

function placeChapter4RescueCellScene() {
  currentMapIndex = 11;
  setChapter4Transformed(false);
  const road = getCurrentRoad();
  const placements = [
    [questNpc, { x: 370, y: 638, direction: "right" }],
    [player, { x: 520, y: 638, direction: "right" }],
    [hotelOtakuNpc, { x: 650, y: 666, direction: "right" }],
    [vtNpcs[0], { x: 760, y: 638, direction: "left" }],
    [vtNpcs[1], { x: 880, y: 638, direction: "left" }],
    [vtNpcs[2], { x: 1000, y: 638, direction: "left" }],
    [getCharacterById("npc14"), { x: 1100, y: 638, direction: "left" }],
  ];
  placements.forEach(([actor, position]) => {
    if (!actor || !position) return;
    actor.mapId = 11;
    actor.x = clamp(position.x, road.left + 18, road.right - 18);
    actor.y = clamp(position.y, road.top + 18, road.bottom - 18);
    actor.direction = position.direction;
    actor.idleDirection = position.direction;
    actor.following = false;
    actor.staticNpc = actor !== player;
    actor.fixedPlacement = actor !== player;
    actor.layingDown = actor?.id === "npc14";
    actor.walkTime = 0;
    seedTrail(actor);
  });
  [getCharacterById("npc9"), getCharacterById("npc36"), getCharacterById("npc12")].forEach(hideChapter4RescueHelper);
  snapCameraToPlayer();
}

function startChapter4RescueCellFinale() {
  chapter4State.phase = "rescue_cell_found";
  chapter4State.rescueCellEntered = true;
  chapter4State.rescueBattleWon = true;
  placeChapter4RescueCellScene();
  saveGame();
  startDialogue(
    [
      { actor: questNpc, speaker: questNpc.label, body: "全部人都在嗎？能走就快走。" },
      { actor: player, speaker: player.label, body: "蕭政銘？你怎麼現在才來。" },
      { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "外面的人都處理掉了嗎？" },
      { actor: questNpc, speaker: questNpc.label, body: "都倒了，先出去再說。" },
    ],
    null,
    questNpc
  );
}

function startChapter4EndingPages() {
  chapter4State.phase = "completed";
  chapter4State.rescueFinaleDone = true;
  saveGame();
  startChapterCompleteTransition("第四章 公關危機 & VT綁架事件...", () => {
    startChapterCompleteTransition("以及...", () => {
      startChapterCompleteTransition("Thank you 久田...完");
    });
  });
}

function placeChapter4RescueCellScene(options = {}) {
  currentMapIndex = 11;
  setChapter4Transformed(false);
  applyChapter4HeroForm();
  const road = getCurrentRoad();
  const preservePlayer = Boolean(options.preservePlayer) || chapter4State.phase === "rescue_cell_found";
  questNpc.mapId = 99;
  questNpc.following = false;
  questNpc.staticNpc = true;
  questNpc.fixedPlacement = true;
  if (preservePlayer) {
    player.hidden = false;
    player.following = false;
    player.staticNpc = false;
    player.fixedPlacement = false;
    player.layingDown = false;
    player.x = clamp(player.x, road.left + 18, road.right - 18);
    player.y = clamp(player.y, road.top + 18, road.bottom - 18);
    player.walkTime = 0;
  }
  const placements = [
    ...(preservePlayer ? [] : [[player, { x: 330, y: 638, direction: "right" }]]),
    [chapter4HeroProxyNpc, { x: 1320, y: 638, direction: "right" }],
    [hotelOtakuNpc, { x: 1435, y: 666, direction: "right" }],
    [vtNpcs[0], { x: 1545, y: 638, direction: "right" }],
    [vtNpcs[1], { x: 1655, y: 638, direction: "right" }],
    [vtNpcs[2], { x: 1765, y: 638, direction: "right" }],
    [getCharacterById("npc14"), { x: 2130, y: 690, direction: "right" }],
  ];
  placements.forEach(([actor, position]) => {
    if (!actor || !position) return;
    actor.mapId = 11;
    actor.x = clamp(position.x, road.left + 18, road.right - 18);
    actor.y = clamp(position.y, road.top + 18, road.bottom - 18);
    actor.direction = position.direction;
    actor.idleDirection = position.direction;
    actor.following = false;
    actor.staticNpc = actor !== player;
    actor.fixedPlacement = actor !== player;
    actor.layingDown = actor?.id === "npc14";
    actor.hidden = false;
    actor.walkTime = 0;
    seedTrail(actor);
  });
  [getCharacterById("npc9"), getCharacterById("npc36"), getCharacterById("npc12")].forEach(hideChapter4RescueHelper);
  const { aokiji, dog, monkey, ex } = getChapter4BaseActors();
  [aokiji, monkey, ex].forEach((actor) => {
    if (actor) actor.mapId = 99;
  });
  if (dog && chapter4State.phase !== "rescue_cell_finale") {
    dog.mapId = 99;
    dog.redAura = false;
  }
  if (chapter4State.phase === "rescue_cell_found" || chapter4State.phase === "rescue_cell_check") {
    focusChapter4CellGroupCamera();
  } else {
    snapCameraToPlayer();
  }
}

function prepareChapter4RescueCellEntry() {
  chapter4State.phase = "rescue_cell_found";
  chapter4State.rescueCellEntered = true;
  chapter4State.rescueBattleWon = true;
  chapter4State.rescueCellChecked = [];
  placeChapter4RescueCellScene({ preservePlayer: true });
  focusChapter4CellGroupCamera();
  saveGame();
}

function startChapter4RescueCellFinale() {
  chapter4State.phase = "rescue_cell_check";
  chapter4State.rescueCellEntered = true;
  chapter4State.rescueBattleWon = true;
  chapter4State.rescueCellChecked = ["chapter4_hero_proxy"];
  placeChapter4RescueCellScene({ preservePlayer: true });
  focusChapter4CellGroupCamera();
  saveGame();
  startDialogue(
    [
      { actor: chapter4HeroProxyNpc, speaker: chapter4HeroProxyNpc.label, body: "蕭政銘你終於來了" },
    ],
    null,
    chapter4HeroProxyNpc
  );
}

function getChapter4RescueCellCheckIds() {
  return ["chapter4_hero_proxy", "npc1", "npc2", "npc3", "hotel_otaku", "npc14"];
}

function getChapter4RescueCellCheckDialogue(target) {
  const linesById = {
    chapter4_hero_proxy: [
      { actor: target, speaker: "親親獸", body: "蕭政銘你終於來了" },
      { actor: player, speaker: player.label, body: "先確認大家狀況，等等再出去。" },
    ],
    npc1: [
      { actor: target, speaker: target.label, body: "姐姐沒事，只是肚子有點餓。" },
      { actor: player, speaker: player.label, body: "能喊餓代表還活著，很好。" },
    ],
    npc2: [
      { actor: target, speaker: target.label, body: "這裡可以水餃，但我想回去了。" },
      { actor: player, speaker: player.label, body: "等等就帶你們出去。" },
    ],
    npc3: [
      { actor: target, speaker: target.label, body: "我還以為你真的不會來。" },
      { actor: player, speaker: player.label, body: "我們家的VT不能少一個。" },
    ],
    hotel_otaku: [
      { actor: target, speaker: target.label, body: "親親子沒事就好..." },
      { actor: player, speaker: player.label, body: "你也還能走吧？等等跟上。" },
    ],
    npc14: [
      { actor: target, speaker: target.label, body: "Zzz..." },
      { actor: player, speaker: player.label, body: "這隻真的叫不醒。" },
    ],
  };
  return linesById[target.id] || [{ actor: target, speaker: target.label, body: "我沒事。" }];
}

function handleChapter4RescueCellCheckInteraction(target) {
  if (!getChapter4RescueCellCheckIds().includes(target.id)) return false;
  startDialogue(
    getChapter4RescueCellCheckDialogue(target),
    () => markChapter4RescueCellChecked(target.id),
    target
  );
  return true;
}

function markChapter4RescueCellChecked(actorId) {
  chapter4State.rescueCellChecked = Array.isArray(chapter4State.rescueCellChecked)
    ? chapter4State.rescueCellChecked
    : [];
  if (!chapter4State.rescueCellChecked.includes(actorId)) {
    chapter4State.rescueCellChecked.push(actorId);
  }
  saveGame();
  const allChecked = getChapter4RescueCellCheckIds().every((id) => chapter4State.rescueCellChecked.includes(id));
  if (allChecked && !chapter4State.rescueCellFinaleDone) {
    startChapter4DogLastAttackIntro();
  }
}

function startChapter4DogLastAttackIntro() {
  const { dog } = getChapter4BaseActors();
  if (!dog) return;
  chapter4State.phase = "rescue_cell_finale";
  chapter4State.rescueCellFinaleDone = true;
  saveGame();
  const road = getCurrentRoad();
  dog.mapId = 11;
  dog.hidden = false;
  dog.following = false;
  dog.staticNpc = false;
  dog.fixedPlacement = false;
  dog.layingDown = false;
  dog.redAura = false;
  dog.x = clamp(CHAPTER4_CELL_DOOR_X, road.left + 18, road.right - 18);
  dog.y = 638;
  dog.direction = "left";
  dog.idleDirection = "left";
  seedTrail(dog);
  cameraFocusActor = dog;
  camera.x = clamp(dog.x - canvas.width * 0.35, 0, WORLD.width - canvas.width);
  startChapter4ActorMove(
    dog,
    { x: CHAPTER4_CELL_DOOR_X - 92, y: 638, direction: "left" },
    startChapter4DogLastAttackDialogue,
    { speed: 270, finalDirection: "left" }
  );
}

function startChapter4DogLastAttackDialogue() {
  const { dog } = getChapter4BaseActors();
  startDialogue(
    [
      { actor: dog, speaker: "蕭犬", body: "不...不會讓你們走的" },
      { actor: player, speaker: player.label, body: "你不是已經倒了嗎" },
      { actor: dog, speaker: "蕭犬", body: "不要質疑我消滅VT的決心!" },
      { actor: player, speaker: player.label, body: "你已經沒辦法阻止我們在場所有人了!" },
      { actor: dog, speaker: "蕭犬", body: "即便如此...我也要帶一個人上路!" },
    ],
    startChapter4DogRushKinko,
    dog
  );
}

function startChapter4DogRushKinko() {
  const { dog } = getChapter4BaseActors();
  const kinko = vtNpcs[2];
  if (!dog || !kinko) return;
  startChapter4ActorMove(
    dog,
    { x: kinko.x + 82, y: kinko.y, direction: "left" },
    () => {
      dog.redAura = true;
      burst(dog.x, dog.y - 26, "#ff3131");
      startChapter4DogFinalChoice();
    },
    { speed: 420, finalDirection: "left" }
  );
}

function startChapter4DogFinalChoice(options = {}) {
  const { dog } = getChapter4BaseActors();
  const kinko = vtNpcs[2];
  if (dog) {
    const directionToKinko = kinko
      ? axisToDirection(kinko.x - dog.x, kinko.y - dog.y)
      : "left";
    dog.direction = directionToKinko;
    dog.idleDirection = directionToKinko;
    dog.walkTime = 0;
  }
  const sequence = [];
  if (!options.skipThreatLine) {
    sequence.push({ actor: dog, speaker: "蕭犬", body: "去死吧" });
  }
  sequence.push({
    actor: player,
    speaker: player.label,
    body: "",
    choices: [
      { label: "救親親子", onSelect: () => startChapter4SaveKinkoFinale() },
      { label: "不救親親子", onSelect: () => startChapter4AbandonKinkoEnding() },
    ],
  });
  startDialogue(sequence, null, null);
}

function startChapter4AbandonKinkoEnding() {
  const { dog } = getChapter4BaseActors();
  cameraFocusActor = null;
  if (dog) dog.redAura = false;
  startChapter4KinkoBadHitSequence();
}

function startChapter4SaveKinkoFinale() {
  const { dog } = getChapter4BaseActors();
  const kinko = vtNpcs[2];
  if (!kinko) return;
  cameraFocusActor = player;
  if (dog) dog.redAura = false;
  startChapter4ActorMove(
    player,
    { x: kinko.x + 48, y: kinko.y, direction: "left" },
    () => {
      player.direction = "left";
      player.idleDirection = "left";
      if (dog) {
        dog.direction = "left";
        dog.idleDirection = "left";
      }
      startChapter4RescueEventOne();
    },
    { speed: 320, finalDirection: "left" }
  );
}

function startChapter4RescueEventOne() {
  startChapter4StoryImageDialogue(
    "chapter4RescueEvent1",
    [
      { speaker: "親親子", captionKey: "chapter4RescueLine0" },
      { speaker: "蕭政銘", captionKey: "chapter4RescueLine1" },
      { speaker: "蕭犬", captionKey: "chapter4RescueLine2" },
      { speaker: "蕭政銘", captionKey: "chapter4RescueLine3" },
      { speaker: "親親子", captionKey: "chapter4RescueLine4" },
    ],
    startChapter4WorldStopRescueTransition,
    { dialogueDelay: 1450 }
  );
}

function startChapter4WorldStopRescueTransition() {
  playUniqueSkillSound({ id: "hisada_the_world" });
  startChapter4BlackTextSequence(
    ["...", "時間停止了...", "...", "時間再次流動..."],
    startChapter4RescueEventTwo
  );
}

function startChapter4RescueEventTwo() {
  startChapter4StoryImageDialogue(
    "chapter4RescueEvent2",
    [
      { speaker: "久田親親獸", captionKey: "chapter4RescueLine5" },
      { speaker: "蕭政銘", captionKey: "chapter4RescueLine6" },
      { speaker: "久田親親獸", captionKey: "chapter4RescueLine7" },
    ],
    startChapter4EndingPages,
    { shake: true, shakeDuration: 720, blackFadeIn: 0, imageFadeIn: 0.82, dialogueDelay: 1250 }
  );
}

function startChapter4EndingPages() {
  chapter4State.phase = "completed";
  chapter4State.rescueFinaleDone = true;
  saveGame();
  startChapterCompleteTransition("...", () => {
    startChapterCompleteTransition("第四章 VT綁架事件...", () => {
      startChapterCompleteTransition("以及...", () => {
        startChapterCompleteTransition("Thank you 久田...完", () => {
          startChapterCompleteTransition("幾天過後...", () => {
            startSceneFadeIn(startChapter4PostRescueDiscussion, MAP_CHANGE_FADE_IN_TIME);
          }, {
            instantBlack: true,
            onBeforeFadeOut: () => prepareChapter4PostRescueScene(),
          });
        }, { instantBlack: true, noFadeOut: true });
      }, { instantBlack: true, noFadeOut: true });
    }, { instantBlack: true, noFadeOut: true });
  }, { instantBlack: true, noFadeOut: true });
}

function prepareChapter4PostRescueScene() {
  currentMapIndex = 9;
  chapter4State.phase = "completed";
  cameraFocusActor = null;
  setChapter4Transformed(false);
  player.hidden = false;
  player.x = 1050;
  player.y = 638;
  player.direction = "right";
  player.idleDirection = "right";
  player.walkTime = 0;
  placeStaticActor(questNpc, 9, XIAO_XD_POSITION, { layingDown: false });
  const positions = [
    [vtNpcs[0], { x: 1540, y: 638, direction: "right" }],
    [vtNpcs[1], { x: 1655, y: 638, direction: "left" }],
    [vtNpcs[2], { x: 1770, y: 638, direction: "left" }],
  ];
  positions.forEach(([actor, position]) => {
    if (!actor) return;
    placeStaticActor(actor, 9, position, { layingDown: false });
  });
  chapter4HeroProxyNpc.mapId = 99;
  const { aokiji, dog, monkey, ex } = getChapter4BaseActors();
  [aokiji, dog, monkey, ex, hotelOtakuNpc, getCharacterById("npc14"), getCharacterById("npc9"), getCharacterById("npc36"), getCharacterById("npc12")].forEach((actor) => {
    if (!actor) return;
    actor.mapId = 99;
    actor.following = false;
    actor.staticNpc = true;
    actor.fixedPlacement = true;
    actor.layingDown = false;
    actor.redAura = false;
    seedTrail(actor);
  });
  teamSlots.splice(0, teamSlots.length, "hero", null, null, null);
  snapCameraToPlayer();
}

function startChapter4PostRescueDiscussion() {
  startDialogue(
    [
      { actor: player, speaker: player.label, body: "久田親親獸...真的救了大家。" },
      { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "他說會讓大家都安全，真的做到了。" },
      { actor: vtNpcs[0], speaker: vtNpcs[0].label, body: "姐姐會記得他的。" },
      { actor: vtNpcs[1], speaker: vtNpcs[1].label, body: "希望他現在可以好好水餃。" },
      { actor: questNpc, speaker: questNpc.label, body: "活下來的人就繼續往前走吧。" },
      { actor: player, speaker: player.label, body: "嗯...我們會繼續的。" },
    ],
    () => {
      chapter5State.phase = "await_exit";
      chapter5State.introDone = false;
      saveGame();
    },
    questNpc
  );
}

function startChapter5HisadaReturnScene() {
  prepareChapter5XdReturnScene({ preservePlayer: true });
  const hisada = getCharacterById("npc9");
  if (!hisada) {
    startChapter5JailFlashbackTransition();
    return;
  }
  startChapter4ActorMove(
    hisada,
    CHAPTER5_XD_EXIT_HISADA_STOP,
    () => {
      startDialogue(
        [
          { actor: hisada, speaker: "久田親親獸", body: "嗨各位。" },
          { actor: player, speaker: player.label, body: "久田親親獸!? 你怎麼還活著!" },
          { actor: vtNpcs[0], speaker: vtNpcs[0].label, body: "我以為你被打穿了..." },
          { actor: vtNpcs[1], speaker: vtNpcs[1].label, body: "這樣也能活，台男1V也太扯了吧。" },
          { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "所以你到底怎麼回來的?" },
          { actor: hisada, speaker: "久田親親獸", body: "說來話長..." },
        ],
        startChapter5JailFlashbackTransition,
        hisada
      );
    },
    { speed: 250, finalDirection: "right" }
  );
}

function prepareChapter5XdReturnScene(options = {}) {
  const preservePlayer = Boolean(options.preservePlayer);
  currentMapIndex = 9;
  setChapter4Transformed(false);
  player.hidden = false;
  if (!preservePlayer) {
    player.x = CHAPTER5_XD_PLAYER_POSITION.x;
    player.y = CHAPTER5_XD_PLAYER_POSITION.y;
    player.direction = CHAPTER5_XD_PLAYER_POSITION.direction;
    player.idleDirection = player.direction;
  }
  player.walkTime = 0;
  placeStaticActor(questNpc, 9, XIAO_XD_POSITION, { layingDown: false });
  [
    [vtNpcs[0], { x: 1540, y: 638, direction: "right" }],
    [vtNpcs[1], { x: 1655, y: 638, direction: "left" }],
    [vtNpcs[2], { x: 1770, y: 638, direction: "left" }],
  ].forEach(([actor, position]) => {
    if (actor) placeStaticActor(actor, 9, position, { layingDown: false });
  });
  const hisada = getCharacterById("npc9");
  if (hisada) placeStaticActor(hisada, 9, CHAPTER5_XD_EXIT_HISADA_START, { layingDown: false });
  hideChapter5TournamentActors();
  teamSlots.splice(0, teamSlots.length, "hero", null, null, null);
  [player, questNpc, ...vtNpcs, hisada].filter(Boolean).forEach(seedTrail);
  snapCameraToPlayer();
}

function startChapter5JailFlashbackTransition() {
  chapter5State.phase = "flashback";
  saveGame();
  startChapterCompleteTransition("決戰當天過後", () => {
    startSceneFadeIn(startChapter5JailFlashbackScene, MAP_CHANGE_FADE_IN_TIME);
  }, {
    onBeforeFadeOut: prepareChapter5JailFlashbackScene,
  });
}

function prepareChapter5JailFlashbackScene() {
  currentMapIndex = 11;
  player.hidden = true;
  player.x = CHAPTER5_JAIL_FLASHBACK_POSITIONS.npc9.x;
  player.y = CHAPTER5_JAIL_FLASHBACK_POSITIONS.npc9.y;
  player.direction = "right";
  player.walkTime = 0;
  hideChapter5TournamentActors();
  const dog = getCharacterById("npc39");
  const hisada = getCharacterById("npc9");
  const kidney = getCharacterById("npc14");
  [
    [dog, CHAPTER5_JAIL_FLASHBACK_POSITIONS.npc39],
    [hisada, CHAPTER5_JAIL_FLASHBACK_POSITIONS.npc9],
    [kidney, CHAPTER5_JAIL_FLASHBACK_POSITIONS.npc14],
  ].forEach(([actor, position]) => {
    if (!actor || !position) return;
    placeStaticActor(actor, 11, position, { layingDown: true });
  });
  cameraFocusActor = kidney || hisada || dog || player;
  snapCameraToPlayer();
}

function startChapter5JailFlashbackScene() {
  const dog = getCharacterById("npc39");
  const hisada = getCharacterById("npc9");
  const kidney = getCharacterById("npc14");
  window.setTimeout(() => {
    if (kidney) {
      kidney.layingDown = false;
      kidney.direction = "left";
      kidney.idleDirection = "left";
      seedTrail(kidney);
    }
    startDialogue(
      [
        { actor: kidney || player, speaker: "腰子親親獸", body: "這裡是哪裡..." },
        { actor: kidney || player, speaker: "腰子親親獸", body: "怎麼有兩個人倒在地上!" },
        { actor: kidney || player, speaker: "腰子親親獸", body: "這個人...是那天把我抓過來的傢伙。" },
        { actor: kidney || player, speaker: "腰子親親獸", body: "另一個人肯定是為了救我才倒下的。" },
        { actor: kidney || player, speaker: "腰子親親獸", body: "得趕快救他。" },
      ],
      () => startChapter5KidneyReviveCutin(dog, hisada, kidney),
      kidney || player
    );
  }, 380);
}

function startChapter5KidneyReviveCutin(dog, hisada, kidney) {
  startChapter5EventUniqueCutin("大天使的氣息", "uniqueSkill14", () => {
    startChapter5HisadaReviveSequence(hisada, kidney);
  });
}

function startChapter5HisadaReviveSequence(hisada, kidney) {
  if (hisada) {
    addChapter5HealBurst(hisada);
    seedTrail(hisada);
  }
  window.setTimeout(() => {
    if (hisada) {
      hisada.layingDown = false;
      hisada.direction = "right";
      hisada.idleDirection = "right";
      hisada.walkTime = 0;
      seedTrail(hisada);
    }
    window.setTimeout(() => {
      startDialogue(
        [
          { actor: hisada || kidney || player, speaker: "久田親親獸", body: "我怎麼還活著。" },
          { actor: kidney || player, speaker: "腰子親親獸", body: "我們先趕快出去吧。" },
        ],
        () => startChapter5KidneyHisadaLeave(hisada, kidney),
        hisada || kidney || player
      );
    }, 520);
  }, 760);
}

function addChapter5HealBurst(actor, label = "復活") {
  if (!actor) return;
  for (let index = 0; index < 44; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 10 + Math.random() * 48;
    sparkles.push({
      x: actor.x + Math.cos(angle) * radius,
      y: actor.y - 82 + Math.sin(angle) * radius * 0.8,
      vx: Math.cos(angle) * (20 + Math.random() * 50),
      vy: -40 - Math.random() * 70,
      life: 0.65 + Math.random() * 0.5,
      maxLife: 1.15,
      size: 3 + Math.random() * 5,
      color: index % 3 === 0 ? "#ffffff" : index % 3 === 1 ? "#9fffe7" : "#ffe98a",
    });
  }
  if (label) addWorldFloatingText(actor.x, actor.y - 132, label, "#9fffe7", { life: 1.8, riseSpeed: 24 });
}

function startChapter5KidneyHisadaLeave(hisada, kidney) {
  const exitX = CHAPTER4_CELL_EXIT_POSITION.x + 30;
  startChapter4ActorGroupMove(
    [
      {
        actor: hisada,
        target: { x: exitX, y: 638, direction: "right" },
        options: { speed: 270, finalDirection: "right", hideOnArrive: true },
      },
      {
        actor: kidney,
        target: { x: exitX - 65, y: 638, direction: "right" },
        options: { speed: 250, finalDirection: "right", hideOnArrive: true },
      },
    ],
    () => {
      startSceneFadeIn(startChapter5TournamentAnnouncement, MAP_CHANGE_FADE_IN_TIME);
      prepareChapter5XdAfterFlashbackScene();
    }
  );
}

function prepareChapter5XdAfterFlashbackScene() {
  currentMapIndex = 9;
  player.hidden = false;
  player.x = CHAPTER5_XD_PLAYER_POSITION.x;
  player.y = CHAPTER5_XD_PLAYER_POSITION.y;
  player.direction = "right";
  player.idleDirection = "right";
  placeStaticActor(questNpc, 9, XIAO_XD_POSITION, { layingDown: false });
  [
    [vtNpcs[0], { x: 1280, y: 638, direction: "right" }],
    [vtNpcs[1], { x: 1390, y: 638, direction: "left" }],
    [vtNpcs[2], { x: 1500, y: 638, direction: "left" }],
    [getCharacterById("npc9"), CHAPTER5_XD_EXIT_HISADA_STOP],
  ].forEach(([actor, position]) => {
    if (actor) placeStaticActor(actor, 9, position, { layingDown: false });
  });
  cameraFocusActor = null;
  snapCameraToPlayer();
}

function startChapter5TournamentAnnouncement() {
  const hisada = getCharacterById("npc9");
  startDialogue(
    [
      { actor: vtNpcs[1], speaker: vtNpcs[1].label, body: "沒想到腰子這麼厲害。" },
      { actor: hisada || player, speaker: "久田親親獸", body: "對了，我是來帶消息給你們的。" },
      { actor: hisada || player, speaker: "久田親親獸", body: "最強台1V決定賽就要開始了。" },
      { actor: questNpc, speaker: questNpc.label, body: "那是甚麼?" },
      { actor: hisada || player, speaker: "久田親親獸", body: "用來決定親親世界最強台1V的比賽。" },
      { actor: hisada || player, speaker: "久田親親獸", body: "我現在把規則發給你，你看一下吧。" },
    ],
    () => startChapter5RuleDocument(() => {
      startDialogue(
        [
          { actor: questNpc, speaker: questNpc.label, body: "怎麼一堆規則啊，全世界都要遵守你們VT圈的規則是不是?" },
          { actor: hisada || player, speaker: "久田親親獸", body: "不然你不要參加。" },
          { actor: questNpc, speaker: questNpc.label, body: "..." },
          { actor: hisada || player, speaker: "久田親親獸", body: "準備好就到對戰塔吧，我是不會手下留情的。" },
        ],
        finishChapter5Intro,
        hisada || questNpc
      );
    }),
    hisada || questNpc
  );
}

function grantChapter5TournamentSupport(options = {}) {
  const alreadyGranted = Boolean(chapter5State.tournamentSupportGranted);
  const currentDollCount = Math.max(0, Math.floor(Number(ownedShopItemCounts.kiss_beast_doll) || 0));
  if (!alreadyGranted && currentDollCount < 10) {
    addOwnedShopItem("kiss_beast_doll", 10 - currentDollCount);
  }
  CHAPTER5_TOURNAMENT_PLAYABLE_ROSTER_IDS.forEach((actorId) => setCharacterLevelAtLeast(actorId, 50));
  chapter5State.tournamentSupportGranted = true;
  chapter5State.tournamentRosterUnlocked = true;
  chapter5State.battleSpeedUnlocked = true;
  chapter5State.tournamentFailureHintShown = true;
  if (!options.announce) return;
  battleHelpNotices.length = 0;
  pendingBattleHelpNoticeCompletion = null;
  addBattleHelpNotice(
    "最強台1V決定賽已開放所有可使用角色，並將參賽角色提升到 Lv.50。已發放神器 - 親親獸娃娃 10 個到背包中。戰鬥時右上角也會出現 2倍速 開關。",
    { waitForConfirm: true }
  );
}

function finishChapter5Intro() {
  const hisada = getCharacterById("npc9");
  if (hisada) {
    hisada.mapId = 99;
    hisada.following = false;
    hisada.staticNpc = true;
    hisada.fixedPlacement = true;
    seedTrail(hisada);
  }
  chapter5State.phase = "go_tower";
  chapter5State.introDone = true;
  chapter5State.tournamentRound = 0;
  grantChapter5TournamentSupport({ announce: true });
  ["npc1", "npc2", "npc3"].forEach((id) => addCharacterToTeam(id));
  followChapter5MainPartyFromCurrentPositions();
  saveGame();
}

function followChapter5MainPartyFromCurrentPositions() {
  const followerIds = isChapter5TournamentRosterUnlocked()
    ? teamSlots.filter((id) => id && id !== "hero")
    : ["npc1", "npc2", "npc3"];
  followerIds.forEach((id) => {
    const actor = getCharacterById(id);
    if (!actor) return;
    actor.mapId = currentMapIndex;
    actor.following = true;
    actor.staticNpc = false;
    actor.fixedPlacement = false;
    actor.layingDown = false;
    actor.direction = player.direction;
    actor.idleDirection = player.direction;
    actor.walkTime = 0;
    seedTrail(actor);
  });
  syncFollowIndexesFromTeamSlots();
}

function syncChapter5TournamentFollowersNearPlayer() {
  const followers = getOrderedFollowers();
  const road = getCurrentRoad();
  const offsets = [
    { x: -58, y: -28 },
    { x: -108, y: 22 },
    { x: -158, y: -28 },
    { x: -208, y: 22 },
  ];
  followers.forEach((actor, index) => {
    const offset = offsets[index % offsets.length];
    const row = Math.floor(index / offsets.length);
    actor.mapId = currentMapIndex;
    actor.x = clamp(player.x + offset.x - row * 42, road.left + 18, road.right - 18);
    actor.y = clamp(player.y + offset.y + row * 34, road.top + 18, road.bottom - 18);
    actor.direction = player.direction;
    actor.idleDirection = player.direction;
    actor.walkTime = 0;
    seedTrail(actor);
  });
}

function startChapter5RuleDocument(onComplete = null) {
  chapter5RuleDocument = {
    onComplete,
    scroll: 0,
    lines: getChapter5RuleDocumentLines(),
  };
}

function getChapter5RuleDocumentLines() {
  return [
    "【最強台1V決定賽 參賽規章暨現場秩序維護細則】",
    "第一條：本賽事以選出親親世界最強台1V為目的，任何參賽者不得主張自己只是路過、只是睡醒、只是來買便當。",
    "第二條：參賽單位須以四名選手組隊參賽。若隊伍成員於報到時消失、轉生、畢業、睡死或正在抽菸，視同仍須準時上場。",
    "第三條：比賽採連續挑戰制。挑戰者須依序擊敗路人娛樂、V黑娛樂、親親娛樂三隊，中途不得以水餃、開會、歌回、露腿企劃為由暫停。",
    "第四條：戰鬥採拉霸盤面判定。五格同色連線成立時，依序發動連線上的技能；未連線則視為 MISS，但參賽者仍需承擔精神傷害。",
    "第五條：獨特技能視為稀有技能，得於盤面中以特殊標記呈現。若觀眾覺得太帥，主辦單位概不負責。",
    "第六條：參賽者不得於比賽中擅自宣稱對方不是真正的 VT、對方是漢堡、對方只是 Line 群組，除非該內容對劇情推進具有必要性。",
    "第七條：所有護貝費、人氣值、斗內收益、便當錢、香菸錢與奇怪藥錠支出，均不得作為賽後申訴理由。",
    "第八條：若選手於比賽中倒地，視為正常戰鬥表現；若倒地後又爬起，視為更正常的戰鬥表現。",
    "第九條：比賽期間禁止干擾裁判。但若裁判規則寫太長，選手可於心中默念『怎麼一堆規則』，不得大聲講出來。",
    "第十條：最終勝利隊伍將取得『最強台1V』名號。該名號不代表真的最強，也不代表會比較會開台，但聽起來很厲害。",
    "第十一條：本規章若有未盡事宜，由主辦單位以臨時公告、口頭補充、突然改規則、或裝作沒看到的方式處理。",
    "第十二條：參賽即表示同意以上所有規範，包含但不限於被抽成、被剪掉、被說很像卡通角色、以及被迫遵守 VT 圈看不懂的規矩。",
  ];
}

function drawChapter5RuleDocument() {
  if (!chapter5RuleDocument) return;
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const panelX = 72;
  const panelY = 48;
  const panelW = canvas.width - 144;
  const panelH = canvas.height - 96;
  ctx.fillStyle = "#f8f3e9";
  ctx.strokeStyle = "#222636";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(panelX, panelY, panelW, panelH, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#1c2230";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = "bold 28px 'Segoe UI', 'Noto Sans TC', sans-serif";
  const lines = chapter5RuleDocument.lines || [];
  const wrapped = lines.flatMap((line, index) => wrapChapter5DocumentText(line, panelW - 78, index === 0 ? "bold 28px 'Segoe UI', 'Noto Sans TC', sans-serif" : "20px 'Segoe UI', 'Noto Sans TC', sans-serif"));
  let y = panelY + 36;
  wrapped.forEach((line, index) => {
    ctx.font = index === 0 ? "bold 28px 'Segoe UI', 'Noto Sans TC', sans-serif" : "20px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText(line, panelX + 38, y);
    y += index === 0 ? 42 : 30;
  });
  ctx.font = "bold 18px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.textAlign = "right";
  ctx.fillStyle = "#5b6273";
  ctx.fillText("Z", panelX + panelW - 36, panelY + panelH - 34);
  ctx.restore();
}

function wrapChapter5DocumentText(text, maxWidth, font) {
  ctx.save();
  ctx.font = font;
  const chars = String(text || "").split("");
  const lines = [];
  let line = "";
  chars.forEach((char) => {
    const next = line + char;
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line);
      line = char;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  ctx.restore();
  return lines;
}

function handleChapter5RuleDocumentKey(event) {
  if (!chapter5RuleDocument || event.repeat || event.code !== CONFIRM_CODE) return;
  const onComplete = chapter5RuleDocument.onComplete;
  chapter5RuleDocument = null;
  if (typeof onComplete === "function") onComplete();
}

function startChapter5EventUniqueCutin(title, assetKey, onComplete = null) {
  chapter5EventCutin = {
    title,
    assetKey,
    side: "player",
    progress: 0,
    seed: Math.random() * 1000,
    onComplete,
  };
}

function updateChapter5EventCutin(delta) {
  if (!chapter5EventCutin) return;
  chapter5EventCutin.progress += delta / UNIQUE_CUTIN_DURATION;
  if (chapter5EventCutin.progress < 1) return;
  const onComplete = chapter5EventCutin.onComplete;
  chapter5EventCutin = null;
  if (typeof onComplete === "function") onComplete();
}

function drawChapter5EventCutin() {
  if (!chapter5EventCutin) return;
  drawUniqueSkillCutin(chapter5EventCutin);
}

function hideChapter5TournamentActors() {
  [
    "npc8",
    "hotel_otaku",
    "npc35",
    "npc29",
    "npc38",
    "npc39",
    "npc40",
    "kinko_ex",
    "npc9",
    "npc12",
    "npc14",
    "npc36",
    ...Object.values(CHAPTER5_TOURNAMENT_PROXY_IDS),
  ].forEach((id) => {
    const actor = getCharacterById(id);
    if (!actor) return;
    if (actor.following) return;
    actor.mapId = 99;
    actor.staticNpc = true;
    actor.fixedPlacement = true;
    actor.layingDown = false;
    actor.walkTime = 0;
    seedTrail(actor);
  });
}

function getChapter5TournamentVisualActor(id) {
  const proxyId = CHAPTER5_TOURNAMENT_PROXY_IDS[id];
  if (proxyId) return getCharacterById(proxyId) || getCharacterById(id);
  return getCharacterById(id);
}

function getChapter5TournamentEnemyUnitId(id) {
  return CHAPTER5_TOURNAMENT_PROXY_IDS[id] || id;
}

const chapter5TowerDialogueAnchor = {
  id: "chapter5_tower_dialogue_anchor",
  label: "對戰塔",
  x: CHAPTER5_TOWER_ENTRY_POSITION.x,
  y: CHAPTER5_TOWER_ENTRY_POSITION.y,
  direction: "down",
  idleDirection: "down",
  walkTime: 0,
  dialogueVisualHeight: 92,
};

function getChapter5TowerDialogueAnchor(mapId = currentMapIndex) {
  const position = mapId === 13 ? CHAPTER5_TOWER_EXIT_POSITION : CHAPTER5_TOWER_ENTRY_POSITION;
  chapter5TowerDialogueAnchor.x = position.x;
  chapter5TowerDialogueAnchor.y = position.y;
  chapter5TowerDialogueAnchor.direction = position.direction || "down";
  chapter5TowerDialogueAnchor.idleDirection = chapter5TowerDialogueAnchor.direction;
  chapter5TowerDialogueAnchor.walkTime = 0;
  return chapter5TowerDialogueAnchor;
}

function startChapter5TournamentIntro() {
  if (chapter5State.completed || chapter5State.phase === "completed") {
    changeMap(13, CHAPTER5_TOWER_PLAYER_ENTRY.x, CHAPTER5_TOWER_PLAYER_ENTRY.y, CHAPTER5_TOWER_PLAYER_ENTRY.direction, {
      followerPlacement: "near-player",
    });
    return;
  }
  if (chapter5State.phase !== "go_tower" && chapter5State.phase !== "tournament") {
    changeMap(13, CHAPTER5_TOWER_PLAYER_ENTRY.x, CHAPTER5_TOWER_PLAYER_ENTRY.y, CHAPTER5_TOWER_PLAYER_ENTRY.direction, {
      followerPlacement: "near-player",
    });
    return;
  }
  const towerAnchor = getChapter5TowerDialogueAnchor(12);
  startDialogue(
    [
      {
        actor: towerAnchor,
        speaker: "對戰塔",
        body: "最強台1V決定賽即將開始，進入後必須連續挑戰三支隊伍。",
        choices: [
          { label: "開始挑戰", onSelect: beginChapter5Tournament },
          {
            label: "先不要",
            onSelect: () => startDialogue([{ actor: player, speaker: player.label, body: "再準備一下好了。" }], null, player),
          },
        ],
      },
    ],
    null,
    towerAnchor
  );
}

function beginChapter5Tournament() {
  chapter5State.phase = "tournament";
  chapter5State.tournamentRound = 0;
  saveGame();
  changeMap(13, CHAPTER5_TOWER_PLAYER_ENTRY.x, CHAPTER5_TOWER_PLAYER_ENTRY.y, CHAPTER5_TOWER_PLAYER_ENTRY.direction, {
    followerPlacement: "near-player",
    fadeIn: false,
  });
  placeChapter5TournamentRoundActors(0);
  startSceneFadeIn(() => startChapter5TournamentRound(0), MAP_CHANGE_FADE_IN_TIME);
}

function startChapter5TournamentRound(roundIndex) {
  const round = CHAPTER5_TOURNAMENT_ROUNDS[roundIndex];
  if (!round) {
    finishChapter5Tournament();
    return;
  }
  chapter5State.tournamentRound = roundIndex;
  chapter5State.phase = "tournament";
  placeChapter5TournamentRoundActors(roundIndex);
  saveGame();
  const towerAnchor = getChapter5TowerDialogueAnchor(13);
  startDialogue(
    getChapter5TournamentPreBattleDialogue(roundIndex, towerAnchor),
    () => openChapter5TournamentBattle(roundIndex),
    towerAnchor
  );
}

function getChapter5TournamentPreBattleDialogue(roundIndex, towerAnchor) {
  const round = CHAPTER5_TOURNAMENT_ROUNDS[roundIndex];
  const line = (id, body) => {
    const actor = getChapter5TournamentVisualActor(id) || player;
    return { actor, speaker: getChapter5ActorName(id, actor), body };
  };
  const roundLines = [
    [
      line("npc8", "便當錢、護貝費、稱號，我今天全部都要拿。"),
      line("hotel_otaku", "親親子也在看嗎...我不能輸。"),
      line("npc35", "比賽就是情報戰，情報戰就是偷拐搶騙。"),
      line("npc29", "這次讓你們看看真正的親親獸玉。"),
      { actor: player, speaker: player.label, body: "第一隊就全是熟人，這比賽也太小圈子了。" },
    ],
    [
      line("npc39", "VT通通給我畢業。"),
      line("npc40", "今天又有可以彈射的對手了。"),
      line("npc38", "通通凍起來，賽場會安靜很多。"),
      line("kinko_ex", "親親子...我不會再輸一次。"),
      { actor: player, speaker: player.label, body: "這隊怎麼一點都沒有反省的樣子。" },
    ],
    [
      line("npc9", "終於輪到最終戰了，我不會手下留情。"),
      line("npc12", "速戰速決，我待會還有歌回。"),
      line("npc14", "小心不要睡著了哦。"),
      line("npc36", "打完可以出去抽一根嗎。"),
      { actor: player, speaker: player.label, body: "最終戰了，拿下最強台1V。" },
    ],
  ];
  return [
    { actor: towerAnchor, speaker: "對戰塔", body: `第 ${roundIndex + 1} 戰：${round?.name || "對手"}。` },
    ...(roundLines[roundIndex] || [{ actor: player, speaker: player.label, body: "要拿最強台1V，只能一路打上去了。" }]),
  ];
}

function placeChapter5TournamentRoundActors(roundIndex) {
  const round = CHAPTER5_TOURNAMENT_ROUNDS[roundIndex];
  if (!round) return;
  currentMapIndex = 13;
  const road = getCurrentRoad();
  player.hidden = false;
  player.x = clamp(CHAPTER5_TOWER_PLAYER_ENTRY.x - 240, road.left + 18, road.right - 18);
  player.y = CHAPTER5_TOWER_PLAYER_ENTRY.y;
  player.direction = "right";
  player.idleDirection = "right";
  hideChapter5TournamentActors();
  followChapter5MainPartyFromCurrentPositions();
  syncChapter5TournamentFollowersNearPlayer();
  const enemyPositions = [
    { x: CHAPTER5_TOWER_PLAYER_ENTRY.x + 420, y: 650, direction: "left" },
    { x: CHAPTER5_TOWER_PLAYER_ENTRY.x + 540, y: 614, direction: "left" },
    { x: CHAPTER5_TOWER_PLAYER_ENTRY.x + 660, y: 650, direction: "left" },
    { x: CHAPTER5_TOWER_PLAYER_ENTRY.x + 780, y: 614, direction: "left" },
  ];
  round.team.forEach((id, index) => {
    const actor = getChapter5TournamentVisualActor(id);
    const position = enemyPositions[index];
    if (!actor || !position) return;
    placeStaticActor(actor, 13, position, { layingDown: false });
  });
  cameraFocusActor = chapter5TournamentCameraAnchor;
  camera.x = clamp(chapter5TournamentCameraAnchor.x - canvas.width * 0.35, 0, WORLD.width - canvas.width);
  camera.y = 0;
}

function openChapter5TournamentBattle(roundIndex) {
  const round = CHAPTER5_TOURNAMENT_ROUNDS[roundIndex];
  if (!round) return;
  cameraFocusActor = null;
  sanitizeTeamSlots();
  const partyIds = teamSlots.filter(Boolean);
  const party = createBattlePartyFromIds(partyIds.length ? partyIds : ["hero", "npc1", "npc2", "npc3"]);
  openSlotBattle({
    mode: "chapter5-tournament",
    stage: 5,
    party,
    enemies: getChapter5TournamentEnemies(roundIndex),
    enemyDamageScale: 0.96 + roundIndex * 0.07,
    playerDamageScale: 1,
    expReward: [180, 260, 420][roundIndex] || 260,
    shellFeeReward: [300, 480, 800][roundIndex] || 400,
    onWin: (finishedBattle) => finishChapter5TournamentRound(roundIndex, finishedBattle),
    onLose: () => failChapter5Tournament(roundIndex),
  });
}

function getChapter5TournamentEnemies(roundIndex) {
  const round = CHAPTER5_TOURNAMENT_ROUNDS[roundIndex];
  if (!round) return [];
  const hpById = {
    npc8: 5200,
    hotel_otaku: 4800,
    npc35: 5600,
    npc29: 6200,
    npc39: 6200,
    npc40: 6000,
    npc38: 6000,
    kinko_ex: 4600,
    npc9: 7000,
    npc12: 6200,
    npc14: 5800,
    npc36: 6000,
  };
  const offsetY = [-36, -92, -20, -122];
  return round.team.map((id, index) => {
    const actor = getChapter5TournamentVisualActor(id);
    return {
      enemyActor: actor,
      enemyName: getChapter5ActorName(id, actor),
      enemyUnitId: getChapter5TournamentEnemyUnitId(id),
      enemySkills: getChapter5EnemySkills(id),
      enemyMaxHp: Math.round((hpById[id] || 5200) * (round.scale || 1)),
      targetOffsetX: index * 78,
      targetOffsetY: offsetY[index] ?? 0,
    };
  });
}

function getChapter5EnemySkills(id) {
  if (id === "kinko_ex") return KINKO_EX_SKILLS;
  return PLAYER_SKILLS_BY_ACTOR[id] || EARLY_MOB_SKILLS;
}

function getChapter5ActorName(id, actor = null) {
  const names = {
    npc8: "胖呆親親獸",
    hotel_otaku: "肥宅",
    npc35: "N先生",
    npc29: "九尾親親獸",
    npc39: "蕭犬",
    npc40: "偷猿",
    npc38: "青雉RA",
    kinko_ex: "小玉",
    npc9: "久田親親獸",
    npc12: "阿基親親獸",
    npc14: "腰子親親獸",
    npc36: "菸頭親親獸",
  };
  return names[id] || actor?.label || id;
}

function finishChapter5TournamentRound(roundIndex, finishedBattle = null) {
  const round = CHAPTER5_TOURNAMENT_ROUNDS[roundIndex];
  if (roundIndex >= CHAPTER5_TOURNAMENT_ROUNDS.length - 1) {
    startChapter5TournamentFinalCongrats();
    return;
  }
  const partyHadKinko = Array.isArray(finishedBattle?.party)
    ? finishedBattle.party.some((member) => member.key === "npc3")
    : teamSlots.includes("npc3");
  const towerAnchor = getChapter5TowerDialogueAnchor(13);
  startDialogue(
    [
      { actor: towerAnchor, speaker: "對戰塔", body: `${round?.name || "對手"}已擊敗。` },
      ...(partyHadKinko ? [{ actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "下一隊，護貝費和稱號都在前面。" }] : []),
    ],
    () => startChapter5TournamentHeal(() => startChapter5TournamentRound(roundIndex + 1)),
    towerAnchor
  );
}

function startChapter5TournamentFinalCongrats() {
  placeChapter5TournamentRoundActors(CHAPTER5_TOURNAMENT_ROUNDS.length - 1);
  const line = (id, body) => {
    const actor = getChapter5TournamentVisualActor(id) || player;
    return { actor, speaker: getChapter5ActorName(id, actor), body };
  };
  startDialogue(
    [
      line("npc9", "恭喜，你們就是親親世界最強台1V了。"),
      line("npc12", "恭喜，這場真的漂亮。"),
      line("npc14", "恭喜...差點看到睡著，但是很厲害。"),
      line("npc36", "恭喜啦，去抽一根慶祝吧。"),
      { actor: player, speaker: player.label, body: "最強台1V...拿到了。" },
    ],
    finishChapter5Tournament,
    getChapter5TournamentVisualActor("npc9") || player
  );
}

function failChapter5Tournament(roundIndex) {
  cameraFocusActor = null;
  chapter5State.phase = "go_tower";
  chapter5State.tournamentRound = roundIndex;
  const shouldShowRosterHint = !chapter5State.tournamentSupportGranted && !chapter5State.tournamentFailureHintShown;
  if (shouldShowRosterHint) {
    grantChapter5TournamentSupport();
    syncChapter5TournamentRosterFollowers();
  }
  healChapter5TournamentAvailableCharactersToFull();
  saveGame();
  hideChapter5TournamentActors();
  changeMap(12, CHAPTER5_TOWER_RETURN_POSITION.x, CHAPTER5_TOWER_RETURN_POSITION.y, CHAPTER5_TOWER_RETURN_POSITION.direction, {
    followerPlacement: "near-player",
    onFadeComplete: () => startChapter5TournamentDefeatDialogue(shouldShowRosterHint),
  });
}

function startChapter5TournamentDefeatDialogue(shouldShowRosterHint) {
  const towerAnchor = getChapter5TowerDialogueAnchor(12);
  startDialogue(
    [
      { actor: towerAnchor, speaker: "對戰塔", body: "挑戰失敗，補好狀態再來。" },
      { actor: player, speaker: player.label, body: "可惡，最強台1V沒有想像中好拿。" },
    ],
    () => {
      if (!shouldShowRosterHint) return;
      battleHelpNotices.length = 0;
      pendingBattleHelpNoticeCompletion = null;
      addBattleHelpNotice("這一章可能有點難，所以已開放所有可使用角色，請至隊伍搭配你要參賽的角色。已發放神器 - 親親獸娃娃 10 個到背包中，並開放戰鬥 2倍速 開關。", {
        waitForConfirm: true,
      });
    },
    towerAnchor
  );
}

function startChapter5TournamentHeal(onComplete = null) {
  const kidney = getCharacterById("npc14");
  if (!kidney) {
    healChapter5TournamentPartyToFull(player);
    if (typeof onComplete === "function") onComplete();
    return;
  }
  const road = getCurrentRoad();
  const wasInParty = teamSlots.includes("npc14");
  if (!wasInParty) {
    kidney.mapId = currentMapIndex;
    kidney.x = clamp(player.x + 420, road.left + 18, road.right - 18);
    kidney.y = clamp(player.y - 24, road.top + 18, road.bottom - 18);
    kidney.direction = "left";
    kidney.idleDirection = "left";
    kidney.following = false;
    kidney.staticNpc = false;
    kidney.fixedPlacement = false;
    kidney.hidden = false;
    kidney.layingDown = false;
    seedTrail(kidney);
  }
  const target = {
    x: clamp(player.x + 92, road.left + 18, road.right - 18),
    y: clamp(player.y - 8, road.top + 18, road.bottom - 18),
    direction: "left",
  };
  startChapter4ActorMove(kidney, target, () => {
    healChapter5TournamentPartyToFull(kidney);
    window.setTimeout(() => {
      if (wasInParty) {
        kidney.following = true;
        kidney.staticNpc = false;
        kidney.fixedPlacement = false;
        kidney.direction = player.direction;
        kidney.idleDirection = player.direction;
        seedTrail(kidney);
        syncFollowIndexesFromTeamSlots();
      } else {
        kidney.mapId = 99;
        kidney.staticNpc = true;
        kidney.fixedPlacement = true;
        kidney.walkTime = 0;
        seedTrail(kidney);
      }
      saveGame();
      if (typeof onComplete === "function") onComplete();
    }, 760);
  }, { speed: 285, finalDirection: "left" });
}

function healChapter5TournamentPartyToFull(anchor = player) {
  teamSlots.filter(Boolean).forEach((actorId) => {
    if (!characterProgress[actorId]) return;
    setCharacterCurrentHp(actorId, getCharacterMaxHp(actorId));
  });
  addChapter5HealBurst(anchor, "全員 HP 回復");
}

function healChapter5TournamentAvailableCharactersToFull() {
  const actorIds = new Set([
    ...getOwnedCharacters().map((actor) => actor.id),
    ...teamSlots.filter(Boolean),
  ]);
  if (isChapter5TournamentRosterUnlocked()) {
    CHAPTER5_TOURNAMENT_PLAYABLE_ROSTER_IDS.forEach((actorId) => actorIds.add(actorId));
  }
  actorIds.forEach((actorId) => {
    if (!characterProgress[actorId]) return;
    setCharacterCurrentHp(actorId, getCharacterMaxHp(actorId));
  });
}

function finishChapter5Tournament() {
  cameraFocusActor = null;
  chapter5State.phase = "completed";
  chapter5State.completed = true;
  chapter5State.tournamentRound = CHAPTER5_TOURNAMENT_ROUNDS.length;
  placeChapter5PostGameNpcs();
  unlockPlayerTitle("ending5_strongest_1v");
  saveGame();
  startEnding("結局5 - 最強台1V", {
    mediaKey: "ending5",
    continueGame: true,
    continueLabel: "繼續在親親世界走動",
    continueMessage: "恭喜你已成為親親世界最強台1V",
  });
}

function placeChapter5PostGameNpcs() {
  hideChapter5TournamentActors();
  hideChapter4BaseEnemies();
  const placements = [
    ["npc8", 13, { x: 760, y: 650, direction: "right" }],
    ["hotel_otaku", 13, { x: 875, y: 650, direction: "right" }],
    ["npc35", 13, { x: 990, y: 650, direction: "right" }],
    ["npc29", 13, { x: 1105, y: 650, direction: "right" }],
    ["npc39", 13, { x: 1390, y: 650, direction: "left" }],
    ["npc40", 13, { x: 1510, y: 638, direction: "left" }],
    ["npc38", 13, { x: 1630, y: 610, direction: "left" }],
    ["kinko_ex", 13, { x: 1750, y: 650, direction: "left" }],
    ["npc9", 12, { x: 920, y: 638, direction: "right" }],
    ["npc12", 12, { x: 1050, y: 620, direction: "right" }],
    ["npc14", 12, { x: 1180, y: 638, direction: "right" }],
    ["npc36", 12, { x: 1310, y: 638, direction: "right" }],
  ];
  placements.forEach(([id, mapId, position]) => {
    const actor = getCharacterById(id);
    if (!actor) return;
    placeStaticActor(actor, mapId, position, { layingDown: false });
  });
}

function restoreChapter5WorldState() {
  normalizeChapter5State();
  if (!isChapter5Started()) return;
  if (["go_tower", "tournament", "completed"].includes(chapter5State.phase) && !chapter5State.tournamentSupportGranted) {
    grantChapter5TournamentSupport();
  }
  if (chapter5State.phase === "await_exit" || chapter5State.phase === "flashback") {
    prepareChapter5XdReturnScene();
    return;
  }
  if (chapter5State.phase === "go_tower") {
    placeChapter5PostIntroWorld();
    return;
  }
  if (chapter5State.phase === "tournament") {
    placeChapter5TournamentRoundActors(chapter5State.tournamentRound || 0);
    return;
  }
  if (chapter5State.phase === "completed") {
    placeChapter5PostIntroWorld();
    placeChapter5PostGameNpcs();
  }
}

function placeChapter5PostIntroWorld() {
  chapter4State.phase = "completed";
  chapter4State.rescueFinaleDone = true;
  questNpc.mapId = 9;
  questNpc.x = XIAO_XD_POSITION.x;
  questNpc.y = XIAO_XD_POSITION.y;
  questNpc.direction = XIAO_XD_POSITION.direction;
  questNpc.idleDirection = XIAO_XD_POSITION.direction;
  questNpc.staticNpc = true;
  questNpc.fixedPlacement = true;
  ["npc1", "npc2", "npc3"].forEach((id) => addCharacterToTeam(id));
  followChapter5MainPartyFromCurrentPositions();
  ["npc1", "npc2", "npc3"].forEach((id) => {
    const actor = getCharacterById(id);
    if (!actor) return;
    if (actor.following) return;
    placeStaticActor(actor, 9, {
      x: 1280 + ["npc1", "npc2", "npc3"].indexOf(id) * 110,
      y: 638,
      direction: id === "npc1" ? "right" : "left",
    }, { layingDown: false });
  });
}

function handleChapter5NpcInteraction(target) {
  if (!isChapter5Started()) return false;
  if (chapter5State.phase === "await_exit") {
    const awaitExitLines = {
      npc1: "久田親親獸真的沒事嗎...人家還是有點擔心。",
      npc2: "如果沒有事，我可以先在公司裡水餃嗎。",
      npc3: "那個人不會再來公司找我了吧...",
    };
    if (target === questNpc) {
      startDialogue([{ actor: target, speaker: target.label, body: "大家先喘口氣，休息一下。" }], null, target);
      return true;
    }
    if (awaitExitLines[target.id]) {
      startDialogue([{ actor: target, speaker: target.label, body: awaitExitLines[target.id] }], null, target);
      return true;
    }
    return false;
  }
  if (target === questNpc && chapter5State.phase === "go_tower") {
    startDialogue([{ actor: target, speaker: target.label, body: "規則很煩，但稱號聽起來能賣錢。準備好了就去對戰塔。" }], null, target);
    return true;
  }
  if (chapter5State.phase !== "go_tower" && chapter5State.phase !== "completed") return false;
  const lines = {
    npc8: "下一次便當我會先寫名字。",
    hotel_otaku: "親親子是最強的...但我也會努力。",
    npc35: "規則越多，漏洞越多。",
    npc29: "我不是火影，我是九尾親親獸。",
    npc38: "我會把舞台凍起來。",
    npc39: "比賽場上也要讓 VT 畢業。",
    npc40: "彈射世界準備好了。",
    kinko_ex: "我只是路過，不要看我。",
    npc9: "對戰塔見。這次我不會放水。",
    npc12: "上台前先開嗓，這也是比賽禮儀。",
    npc14: "我只是剛好會復活，不要一直倒給我救。",
    npc36: "比賽前抽一根，精神比較好。",
  };
  if (!lines[target.id]) return false;
  startDialogue([{ actor: target, speaker: getChapter5ActorName(target.id, target), body: lines[target.id] }], null, target);
  return true;
}

function startChapter3XiaoBriefing(npc) {
  startDialogue(
    [
      { actor: player, speaker: player.label, body: "大哥，其他三個人都不見了。" },
      { actor: npc, speaker: npc.label, body: "我派豬鼻醬去超商買吃的了，不知道為什麼還沒回來。" },
      { actor: npc, speaker: npc.label, body: "波貝貝不知道跑去哪裡了，可能是躲起來水餃了。" },
      { actor: npc, speaker: npc.label, body: "親親子說要跑去騙錢，也不知道去哪了。" },
      { actor: player, speaker: player.label, body: "初配信第一天就搞失蹤，到底是怎樣。" },
      { actor: npc, speaker: npc.label, body: "你去把她們三個找回來，我先去直播室等你們。" },
    ],
    () => {
      startChapter3XiaoDeparture();
    },
    npc
  );
}

function startChapter3PigDialogue(target) {
  const fatDumb = getCharacterById("npc8") || target;
  const pig = getCharacterById("npc1");
  startDialogue(
    [
      { actor: fatDumb, speaker: fatDumb.label, body: "我把三個便當放在桌上，回來就只剩空盒。被這頭豬全吃完了" },
      { actor: pig, speaker: pig?.label || "豬鼻醬", body: "我以為那是供品..." },
      { actor: fatDumb, speaker: fatDumb.label, body: "你覺得有可能嗎? 不好意思喔，這裡不是凱道，你也不是張家盛" },
      { actor: pig, speaker: pig?.label || "豬鼻醬", body: "張...誰? 而且你買三個便當打算自己吃，你才是豬吧" },
      { actor: fatDumb, speaker: fatDumb.label, body: "別囉嗦，趕緊把便當錢還我" },
      { actor: player, speaker: player.label, body: "叫你來買吃的，你來吃別人便當，我的頭好痛" },
      { actor: pig, speaker: pig?.label || "豬鼻醬", body: "人家就很餓阿" },
      {
        actor: player,
        speaker: player.label,
        body: "這要怎麼處理？",
        choices: [
          {
            label: `付 ${CHAPTER3_BENTO_FEE} 護貝費`,
            onSelect: () => {
              if (shellFee < CHAPTER3_BENTO_FEE) {
                startDialogue([{ actor: player, speaker: player.label, body: "護貝費不夠，便當債比公司還沉重。" }], null, player);
                return;
              }
              shellFee -= CHAPTER3_BENTO_FEE;
              resolveChapter3Pig("payment");
            },
          },
          {
            label: "跟胖呆親親獸戰鬥",
            onSelect: () => openFatDumbBattle(fatDumb),
          },
        ],
      },
    ],
    null,
    target
  );
}

function resolveChapter3Pig(method = "payment") {
  const pig = getCharacterById("npc1");
  const fatDumb = getCharacterById("npc8");
  chapter3State.pigFound = true;
  chapter3State.fatLunchResolved = true;
  startDialogue(
    [
      { actor: fatDumb || pig || player, speaker: fatDumb?.label || "胖呆親親獸", body: method === "battle" ? "便當的仇我記下了..." : "錢拿來就好，便當的事先算了。" },
      { actor: pig || player, speaker: pig?.label || "豬鼻醬", body: "姐姐吃飽了，可以保護大家了！" },
    ],
    () => {
      returnChapter3Member("npc1", { floatText: "豬鼻醬回來了" });
      startFatDumbDeparture();
    },
    pig || player
  );
}

function openFatDumbBattle(target) {
  if (!canStartBattleAgainst(target, target.label)) return;
  openSlotBattle({
    mode: "chapter3-fatdumb",
    stage: 3,
    enemyActor: target,
    enemyName: target.label,
    party: getActiveBattleParty(),
    enemyUnitId: "npc8",
    enemySkills: PLAYER_SKILLS_BY_ACTOR.npc8 || [],
    enemyMaxHp: 2200,
    enemyDamageScale: 0.82,
    shellFeeReward: 80,
    expReward: 90,
    onWin: () => resolveChapter3Pig("battle"),
    onLose: () => startDialogue([{ actor: target, speaker: target.label, body: "先賠便當，再談初配信。" }], null, target),
  });
}

function startChapter3BebeDialogue(target) {
  if (!getOwnedItemCount("bebe_flute")) {
    startDialogue(
      [
        { actor: target, speaker: target.label, body: "Zzz..." },
        { actor: player, speaker: player.label, body: "完全叫不醒，去超商看看有沒有什麼奇怪道具好了。" },
      ],
      null,
      target
    );
    return;
  }

  const kinko = getCharacterById("npc3");
  const bebe = getCharacterById("npc2") || target;
  const kidney = getCharacterById("npc14") || target;
  if (!isActorInTeam("npc3")) {
    startDialogue(
      [
        { actor: player, speaker: player.label, body: "來試試看波貝貝之笛吧" },
        { actor: player, speaker: player.label, body: "靠邀，我沒有手指能吹笛，要找親親子來吹" },
      ],
      null,
      target
    );
    return;
  }

  startDialogue(
    [
      { actor: player, speaker: player.label, body: "來試試看波貝貝之笛吧" },
      { actor: kinko || player, speaker: "親親子", body: "♪～～♬～～♪" },
      { actor: kidney, speaker: "腰子親親獸", body: "嗯...? 我怎麼躺在這裡...?" },
      { actor: kidney, speaker: "腰子親親獸", body: "只記得剛剛看到一個粉紅色的羊角生物，跟他對上眼的瞬間我眼前就一片漆黑" },
      { actor: player, speaker: player.label, body: "羊角生物...? 難道是..." },
      { actor: bebe, speaker: "波貝貝", body: "..." },
      { actor: player, speaker: player.label, body: "波貝貝怎麼還不醒來" },
      { actor: kinko || player, speaker: "親親子", body: "啊! 我看到波貝貝剛剛眼睛眨了一下" },
      { actor: player, speaker: player.label, body: "你根本就沒睡著吧" },
      { actor: bebe, speaker: "波貝貝", body: "我看腰子睡得很甜，想來試一下" },
      { actor: player, speaker: player.label, body: "賣溝歐北木啊，今天初配信，大姊" },
    ],
    () => {
      chapter3State.fluteUsed = true;
      chapter3State.bebeFound = true;
      const kidney = getCharacterById("npc14");
      if (kidney) {
        kidney.layingDown = false;
        startKidneyDeparture();
      }
      returnChapter3Member("npc2", { floatText: "波貝貝回來了" });
    },
    target
  );
}

function startChapter3KinkoDialogue(target) {
  const kinko = getCharacterById("npc3") || target;
  const dialogueAnchor = target === kinko ? hotelOtakuNpc : target;
  if (kinko) {
    kinko.direction = "right";
    kinko.idleDirection = "right";
    kinko.walkTime = 0;
  }
  startDialogue(
    [
      { actor: kinko, speaker: "親親子", body: "那邊的肥宅" },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "是在叫我嗎..." },
      { actor: kinko, speaker: "親親子", body: "從今天起我們會在這間房間作為Vtuber直播" },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "Vtuber..." },
      { actor: kinko, speaker: "親親子", body: "你是第一個知道的喔❤️" },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "嘿嘿...只有我知道..." },
      { actor: kinko, speaker: "親親子", body: "不過Vtuber剛起步很辛苦的呢" },
      { actor: kinko, speaker: "親親子", body: "所以呢，人家想要你的支持" },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "我一定會支持你的，親親子" },
      { actor: kinko, speaker: "親親子", body: "現在斗內就可以成為頭號大乾爹了" },
      { actor: kinko, speaker: "親親子", body: "你會斗內的對吧，我最喜歡肥宅了" },
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "這是真的嗎? 我也喜歡親親子哦，從今以後我會支援你的" },
      { actor: kinko, speaker: "親親子", body: "哼哼，護貝費到手。" },
      { actor: player, speaker: player.label, body: "妳真的很適合叉滴娛樂...，還沒開播就賺到錢了" },
    ],
    () => {
      addShellFee(CHAPTER3_KINKO_OTAKU_FEE);
      addPopularityReward("npc3", CHAPTER3_DAILY_POPULARITY_GAIN);
      chapter3State.kinkoFound = true;
      chapter3State.lastKinkoOtakuFeeDay = currentDay;
      returnChapter3Member("npc3", { floatText: "親親子回來了" });
    },
    dialogueAnchor
  );
  if (kinko) {
    kinko.direction = "right";
    kinko.idleDirection = "right";
    kinko.walkTime = 0;
  }
}

function startChapter3ReadyDialogue(npc) {
  startDialogue(
    [
      { actor: npc, speaker: npc.label, body: "今天初配信，給我把護貝費收起來。" },
      { actor: player, speaker: player.label, body: "這不是出道直播嗎，怎麼聽起來像詐騙現場，我們台V不是來騙錢的吧。" },
      { actor: npc, speaker: npc.label, body: "我不是說台V是騙錢的，我是說所有V都是。" },
      { actor: player, speaker: player.label, body: "這句話問題更大吧..." },
    ],
    () => {
      chapter3State.phase = "ready_stream";
      chapter3State.streamIntroDone = true;
      placeChapter3PartyAtRoom();
      saveGame();
    },
    npc
  );
}

function handleChapter3NpcInteraction(target) {
  if (!target || !isChapter3SearchingMembers()) return false;
  if (!chapter3State.pigFound && (target.id === "npc1" || target.id === "npc8")) {
    startChapter3PigDialogue(target);
    return true;
  }
  if (!chapter3State.bebeFound && (target.id === "npc2" || target.id === "npc14")) {
    startChapter3BebeDialogue(target);
    return true;
  }
  if (!chapter3State.kinkoFound && (target.id === "npc3" || target.hotelRoomOwner)) {
    startChapter3KinkoDialogue(target);
    return true;
  }
  return false;
}

function isChapter2TasksActive() {
  return isChapter2Started() && ["tasks", "ready"].includes(chapter2State.phase);
}

function hasAllChapter2Equipment() {
  return CHAPTER2_REQUIRED_EQUIPMENT.every(hasChapter2RequiredEquipment);
}

function hasChapter2RequiredEquipment(itemId) {
  return Boolean(chapter2State.equipment?.[itemId]) || isEquipmentItemOwned(itemId);
}

function getChapter2RequiredEquipmentCount() {
  return CHAPTER2_REQUIRED_EQUIPMENT.filter(hasChapter2RequiredEquipment).length;
}

function syncChapter2EquipmentFromInventory() {
  if (!chapter2State?.equipment) chapter2State.equipment = {};
  CHAPTER2_REQUIRED_EQUIPMENT.forEach((id) => {
    if (hasChapter2RequiredEquipment(id)) chapter2State.equipment[id] = true;
  });
}

function isChapter2ReadyToSubmit() {
  return hasAllChapter2Equipment() && chapter2State.roomUnlocked && chapter2State.exitReminderShown && chapter2State.smokersCleared;
}

function refreshChapter2Progress() {
  if (!isChapter2Started() || chapter2State.phase === "completed") return;
  syncChapter2EquipmentFromInventory();
  if (isChapter2ReadyToSubmit()) chapter2State.phase = "ready";
  else if (chapter2State.reviewDone) chapter2State.phase = "tasks";
  saveGame();
}

function recordStaleDumplingRestAndShouldTrigger() {
  if (!isChapter2Started()) return false;
  if (chapter2State.phase === "completed" && chapter3State.phase === "completed") return false;
  const signature = getQuestProgressSignature();
  if (!signature) return false;
  if (staleDumplingState.signature === signature) {
    staleDumplingState.count += 1;
  } else {
    staleDumplingState.signature = signature;
    staleDumplingState.count = 1;
  }
  if (staleDumplingState.count < STALE_DUMPLING_REST_LIMIT) return false;
  staleDumplingState.count = 0;
  staleDumplingState.signature = signature;
  return true;
}

function getQuestProgressSignature() {
  return JSON.stringify({
    questState,
    collected,
    chapter2: {
      phase: chapter2State.phase,
      reviewDone: chapter2State.reviewDone,
      exitReminderShown: chapter2State.exitReminderShown,
      equipment: CHAPTER2_REQUIRED_EQUIPMENT.map((id) => Boolean(chapter2State.equipment?.[id])),
      roomUnlocked: chapter2State.roomUnlocked,
      smokersCleared: chapter2State.smokersCleared,
      completed: chapter2State.completed,
    },
    chapter3: {
      phase: chapter3State.phase,
      sleptAfterChapter2: chapter3State.sleptAfterChapter2,
      xiaoBriefed: chapter3State.xiaoBriefed,
      pigFound: chapter3State.pigFound,
      bebeFound: chapter3State.bebeFound,
      kinkoFound: chapter3State.kinkoFound,
      fluteBought: chapter3State.fluteBought,
      fluteUsed: chapter3State.fluteUsed,
      fatLunchResolved: chapter3State.fatLunchResolved,
      streamIntroDone: chapter3State.streamIntroDone,
      streamTutorialDone: chapter3State.streamTutorialDone,
      streamCompleted: chapter3State.streamCompleted,
      completed: chapter3State.completed,
    },
  });
}

function resetStaleDumplingCounter() {
  staleDumplingState = {
    signature: getQuestProgressSignature(),
    count: 0,
  };
}

function startChapter2DumplingEndingPrelude() {
  resetStaleDumplingCounter();
  saveGame();
  startChapterCompleteTransition("蕭政銘好像有事找我們...", () => {
    startChapter2DumplingEndingDialogue();
  }, {
    onBeforeFadeOut: () => {
      movePartyToChapter2DumplingEndingScene();
      saveGame();
    },
  });
}

function movePartyToChapter2DumplingEndingScene() {
  currentMapIndex = 9;
  const road = getCurrentRoad();
  player.x = clamp(XIAO_XD_POSITION.x - 270, road.left, road.right);
  player.y = XIAO_XD_POSITION.y;
  player.direction = "right";
  player.walkTime = 0;
  questNpc.mapId = 9;
  questNpc.x = XIAO_XD_POSITION.x;
  questNpc.y = XIAO_XD_POSITION.y;
  questNpc.direction = "left";
  questNpc.idleDirection = "left";
  questNpc.staticNpc = true;
  questNpc.fixedPlacement = true;
  syncFollowersNearPlayer("right", road);
  [player, ...getVisibleNpcs()].forEach(seedTrail);
  updateCamera();
}

function startChapter2DumplingEndingDialogue() {
  startDialogue(
    [
      { actor: questNpc, speaker: questNpc.label, body: "過三天了...要你們做的事情到底做完了沒?" },
      { actor: player, speaker: player.label, body: "我們只是稍微休息一下..." },
      { actor: questNpc, speaker: questNpc.label, body: "休息? 我看是冬眠吧" },
      { actor: vtNpcs[1], speaker: vtNpcs[1].label, body: "我覺得地舖很有發展性。" },
      { actor: vtNpcs[0], speaker: vtNpcs[0].label, body: "睡醒會餓，餓了再睡，這是永續經營。" },
      { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "如果水餃也能收護貝費，我可以出道。" },
      { actor: questNpc, speaker: questNpc.label, body: "完了，叉滴娛樂的任務還沒推進，先成立睡眠部了。" },
      { actor: player, speaker: player.label, body: "所以今天還要做事嗎？" },
      { actor: questNpc, speaker: questNpc.label, body: "不用了，繼續睡吧。" },
    ],
    () => {
      unlockPlayerTitle("ending2_dumpling");
      saveGame();
      startEnding("結局2 - 大水餃", { mediaKey: "ending2", continueGame: true, continueLabel: "繼續遊戲" });
    },
    questNpc
  );
}

function setChapter2EquipmentBought(itemId) {
  if (!CHAPTER2_REQUIRED_EQUIPMENT.includes(itemId)) return;
  chapter2State.equipment[itemId] = true;
  refreshChapter2Progress();
}

function unlockHotelRoomByBattle() {
  chapter2State.roomUnlocked = true;
  refreshChapter2Progress();
  startDialogue(
    [
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "等等，這是我的房間..." },
      { actor: player, speaker: player.label, body: "現在可以借一下了。" },
    ],
    null,
    hotelOtakuNpc
  );
}

function unlockHotelRoomByPayment() {
  chapter2State.roomUnlocked = true;
  refreshChapter2Progress();
  startDialogue(
    [
      { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "好啦，錢都付了，房間先借你。" },
      { actor: player, speaker: player.label, body: "這間公司終於有一點像公司了。" },
    ],
    null,
    hotelOtakuNpc
  );
}

function healOwnedCharactersToFull() {
  getOwnedCharacters().forEach((actor) => {
    setCharacterCurrentHp(actor.id, getCharacterMaxHp(actor.id));
  });
  addWorldFloatingText(player.x, player.y - 82, "全員 HP 回復", "#75f4b2");
}

function healAllCharactersToFull() {
  MENU_CHARACTER_IDS.forEach((actorId) => {
    getCharacterProgress(actorId).currentHp = getCharacterMaxHp(actorId);
  });
}

function clearSmokers(method = "payment") {
  const aki = getCharacterById("npc12");
  const butt = getCharacterById("npc36");
  if (method === "battle") {
    startDialogue(
      [
        { actor: aki || butt || player, speaker: aki?.label || butt?.label || "抽菸二人組", body: "好啦我們去別的地方抽" },
      ],
      () => startSmokerDeparture(),
      aki || butt || player
    );
    return;
  }

  chapter2State.smokersCleared = true;
  [aki, butt].forEach((actor) => {
    if (!actor) return;
    actor.mapId = 99;
    actor.fixedPlacement = true;
  });
  refreshChapter2Progress();
  const line = method === "payment" ? "錢拿了就走，門口借你。" : "好啦好啦，門口借你。";
  startDialogue(
    [
      { actor: aki || player, speaker: aki?.label || "阿基親親獸", body: line },
      { actor: player, speaker: player.label, body: "終於沒有菸味了。" },
    ],
    null,
    aki || butt || player
  );
}

function resetSmokerPositions() {
  smokerDeparture = null;
  [12, 36].forEach((number) => {
    const npc = getCharacterById(`npc${number}`);
    const details = SPECIAL_EXTRA_CHARACTER_DETAILS[number];
    if (!npc || !details) return;
    npc.mapId = details.mapId;
    npc.x = details.x;
    npc.y = details.y;
    npc.direction = details.direction;
    npc.idleDirection = details.idleDirection || details.direction;
    npc.staticNpc = details.staticNpc ?? true;
    npc.fixedPlacement = details.fixedPlacement ?? true;
    npc.walkTime = 0;
    seedTrail(npc);
  });
}

function startSmokerDefeatDialogue(target) {
  startDialogue(
    [
      { actor: target, speaker: target.label, body: "趕緊去蒐集護貝費給我。" },
      { actor: player, speaker: player.label, body: "我哪來的護貝費啊..." },
      { actor: target, speaker: target.label, body: "HOTEL往右走有一些肥宅，去找他們要吧。" },
      { actor: target, speaker: target.label, body: "順便記得去地舖補血，漢堡。" },
    ],
    null,
    target
  );
}

function finishEarlyMobBattle(target) {
  addWorldFloatingText(target.x, target.y - 88, `護貝費 +${CHAPTER2_MOB_REWARD}`, "#ffe16f");
  target.x += 180 * (Math.random() < 0.5 ? -1 : 1);
  const road = MAPS[target.mapId]?.road || ROAD;
  target.x = clamp(target.x, road.left + 80, road.right - 80);
  seedTrail(target);
  saveGame();
}

function startXiaoChallengeDialogue(npc, options = {}) {
  const playerLine = options.playerLine || "誰理你啊，搞清楚現在是4打1";
  startDialogue(
    [
      { actor: player, speaker: player.label, body: playerLine },
      { actor: npc, speaker: npc.label, body: "討剪?" },
    ],
    () => {
      if (!canStartBattleAgainst(npc, npc.label)) return;
      if (!options.reviveAfterEnding) questState = "battle";
      openXiaoBattle(options);
    },
    npc
  );
}

function openSlotBattle(config) {
  if (!battleTutorialSeen) {
    startFirstBattleTutorial(config);
    return;
  }
  beginSlotBattle(config);
}

function startFirstBattleTutorial(config) {
  battleTutorialSeen = true;
  saveGame();
  keys.clear();
  player.walkTime = 0;
  battleTutorialState = {
    active: true,
    pendingConfig: config,
    step: 0,
    timer: 0,
    stoppedRows: 0,
    rowOffsets: Array(SLOT_SIZE).fill(0),
    rows: createBattleTutorialRollingRows(),
  };
}

function createBattleTutorialSkill(side, unitId, type, name, unique = false) {
  return {
    id: `tutorial_${side}_${unitId}_${type}_${name}`,
    side,
    unitId,
    owner: side === "player" ? "我方" : "敵方",
    name,
    type,
    unique,
  };
}

function createBattleTutorialRollingRows() {
  const p1 = createBattleTutorialSkill("player", "hero", "physical", "暴衝撞擊");
  const p2 = createBattleTutorialSkill("player", "npc1", "guard", "護盾");
  const p3 = createBattleTutorialSkill("player", "npc2", "heal", "治療");
  const e1 = createBattleTutorialSkill("enemy", "npc8", "physical", "便當拳");
  const e2 = createBattleTutorialSkill("enemy", "npc32", "magic", "怪訊息");
  const e3 = createBattleTutorialSkill("enemy", "npc33", "debuff", "死纏爛打");
  return [
    [p1, e1, p2, e2, p3, e3],
    [e2, p1, e3, p2, e1, p3],
    [p1, p2, p3, p1, p2, p3],
    [e1, p3, e2, p1, e3, p2],
    [p2, e3, p1, e1, p3, e2],
  ].map((row) => row.map((skill) => ({ ...skill })));
}

function updateBattleTutorial(delta) {
  if (!battleTutorialState?.active) return;
  battleTutorialState.timer += delta;
  if (battleTutorialState.step !== 2) return;

  for (let row = battleTutorialState.stoppedRows; row < SLOT_SIZE; row += 1) {
    battleTutorialState.rowOffsets[row] += delta * SLOT_ROW_SLIDE_SPEED * 0.82;
    while (battleTutorialState.rowOffsets[row] >= 1) {
      battleTutorialState.rowOffsets[row] -= 1;
      const first = battleTutorialState.rows[row].shift();
      battleTutorialState.rows[row].push({ ...first });
    }
  }
}

function handleBattleTutorialKey(event) {
  if (!battleTutorialState?.active || event.repeat || event.code !== CONFIRM_CODE) return;
  keys.clear();
  battleTutorialState.timer = 0;

  if (battleTutorialState.step < 2) {
    playSfx("ui_confirm");
    battleTutorialState.step += 1;
    return;
  }

  if (battleTutorialState.step === 2) {
    playSfx("slot_row_stop", { volume: SLOT_ROW_STOP_VOLUME });
    const row = battleTutorialState.stoppedRows;
    battleTutorialState.rowOffsets[row] = 0;
    battleTutorialState.stoppedRows += 1;
    burst(camera.x + SLOT_BOARD.x + SLOT_BOARD.width * 0.5, SLOT_BOARD.y + 80 + row * 36, "#ffd56f");
    if (battleTutorialState.stoppedRows >= SLOT_SIZE) {
      battleTutorialState.step = 3;
      battleTutorialState.stoppedRows = SLOT_SIZE;
    }
    return;
  }

  if (battleTutorialState.step < 5) {
    playSfx("ui_confirm");
    battleTutorialState.step += 1;
    return;
  }

  playSfx("ui_confirm");
  const config = battleTutorialState.pendingConfig;
  battleTutorialState = null;
  beginSlotBattle(config);
}

function getBattleTutorialSampleGrid(step = battleTutorialState?.step || 0) {
  const pA = createBattleTutorialSkill("player", "hero", "physical", "撞擊");
  const pB = createBattleTutorialSkill("player", "npc1", "guard", "護盾");
  const pC = createBattleTutorialSkill("player", "npc2", "heal", "治療");
  const pU = createBattleTutorialSkill("player", "npc3", "support", "獨特技能", true);
  const eA = createBattleTutorialSkill("enemy", "npc8", "physical", "攻擊");
  const eB = createBattleTutorialSkill("enemy", "npc32", "magic", "魔攻");
  const eC = createBattleTutorialSkill("enemy", "npc33", "debuff", "減益");

  if (step === 3) {
    return [
      pA, eA, pB, eB, pC,
      pA, pB, pC, pU, pA,
      eB, pC, eC, pB, eA,
      pC, eA, pA, eB, pB,
      eA, pB, eC, pC, eB,
    ];
  }

  if (step === 4) {
    return [
      pA, eA, eB, pB, pC,
      eB, pC, eA, eB, eC,
      pB, eC, eA, pA, pC,
      pC, eB, eA, pB, eA,
      pA, pB, eC, pC, pU,
    ];
  }

  return [
    pA, eA, pB, eB, pC,
    eB, pC, eC, pU, eA,
    pB, eC, eA, pA, eB,
    eA, pB, pC, eB, pB,
    pC, eB, pA, eC, eA,
  ];
}

function getBattleTutorialLine(step = battleTutorialState?.step || 0) {
  if (step === 3) return { side: "player", cells: [5, 6, 7, 8, 9], label: "藍框五格連線時，發動我方連線上的技能" };
  if (step === 4) return { side: "enemy", cells: [2, 7, 12, 17, 22], label: "紅框五格連線時，發動敵方連線上的技能" };
  return null;
}

function beginSlotBattle(config) {
  const playerSkills = buildPlayerSkillPool(config.party);
  const enemyConfigs = getBattleEnemyConfigs(config);
  const enemySkills = enemyConfigs.flatMap((enemy) =>
    buildEnemySkillPool(enemy.enemySkills || [], enemy.enemyUnitId, enemy.enemyName)
  );
  const units = createBattleUnits(config);
  battleState = {
    active: true,
    mode: config.mode,
    stage: config.stage,
    recruitNpc: config.recruitNpc || null,
    enemyActor: enemyConfigs[0]?.enemyActor || null,
    enemyName: config.enemyName || enemyConfigs.map((enemy) => enemy.enemyName).join("、"),
    enemies: enemyConfigs,
    enemyDamageScale: config.enemyDamageScale || null,
    playerDamageScale: config.playerDamageScale || null,
    xiaoReviveAfterEnding: Boolean(config.xiaoReviveAfterEnding),
    onWin: config.onWin || null,
    onLose: config.onLose || null,
    expReward: config.expReward,
    shellFeeReward: config.shellFeeReward,
    party: config.party,
    playerSkills,
    enemySkills,
    skillPool: [...playerSkills, ...enemySkills],
    units,
    playerUnits: units.filter((unit) => unit.side === "player"),
    enemyUnits: units.filter((unit) => unit.side === "enemy"),
    playerBoost: 0,
    enemyBoost: 0,
    playerBoostTurns: 0,
    enemyBoostTurns: 0,
    slotGrid: [],
    slotRows: [],
    rowOffsets: Array(SLOT_SIZE).fill(0),
    stoppedRows: 0,
    matches: [],
    matchedCells: [],
    xiaoDomainCells: [],
    sleepBlockedCells: [],
    skillQueue: [],
    skillIndex: 0,
    activeCell: null,
    effects: [],
    floatingTexts: [],
    uniqueCutins: [],
    skillUseCounts: {},
    dollUniqueUsedByUnit: {},
    enemyUniqueDroughtRounds: 0,
    enemyUniqueFirstLineHandled: false,
    hisadaWorldFirstPlayerLineHandled: false,
    enemyUniqueUsedThisRound: false,
    worldStop: null,
    worldStopRefreshedThisRound: false,
    worldStopImpactTimer: 0,
    worldStopWarpTimer: 0,
    worldStopStartTimer: 0,
    worldStopReleaseTimer: 0,
    worldStopSeed: 0,
    forceRoundEndAfterSkill: false,
    forceRoundEndDelay: 0,
    round: 0,
    phase: "positioning",
    result: null,
    timer: 0,
    spinTick: 0,
    hitFlash: 0,
    cameraX: calculateBattleCameraX(config),
    replayConfig: config,
  };
  refreshActiveSkillPool();
  battleState.slotRows = createSlotRows();
  refreshSlotGridFromRows();
  battleUiEl.classList.add("hidden");
  keys.clear();
  updateBattleUi();
}

function updateBattle(delta) {
  if (!battleState) return;
  const battleDelta = delta * getBattleSpeedMultiplier();
  camera.x += (battleState.cameraX - camera.x) * BATTLE_CAMERA_EASE;
  updateBattleUnits(battleDelta);
  updateBattleEffects(battleDelta);
  updateBattleAuto(battleDelta);
  if (!battleState) return;

  if (battleState.phase === "positioning") {
    advanceSlotRows(battleDelta);
    if (battleState.units.every((unit) => unit.ready)) {
      startBattleRound();
    }
    return;
  }

  if (battleState.phase === "spin") {
    advanceSlotRows(battleDelta);
    return;
  }

  if (battleState.phase === "miss") {
    battleState.timer += battleDelta;
    if (battleState.timer >= SLOT_MISS_TIME) {
      finishBattleRound();
    }
    return;
  }

  if (battleState.phase === "line-flash") {
    battleState.timer += battleDelta;
    if (battleState.timer >= SLOT_LINE_FLASH_TIME) {
      beginSkillExecution();
    }
    return;
  }

  if (battleState.phase === "skill-exec") {
    battleState.timer += battleDelta;
    if (battleState.timer >= SLOT_SKILL_STEP_TIME) {
      executeNextQueuedSkill();
    }
    return;
  }

  if (battleState.phase === "next-delay") {
    battleState.timer += battleDelta;
    if (battleState.timer >= SLOT_NEXT_ROUND_DELAY) {
      startBattleRound();
    }
    return;
  }

}

function handleBattleAction() {
  playSfx("ui_confirm");
  advanceBattleBySpace();
}

function toggleBattleAuto() {
  battleAutoEnabled = !battleAutoEnabled;
  battleAutoTimer = 0;
  updateBattleAutoToggleUi();
  saveGame();
}

function stopBattleAuto() {
  battleAutoEnabled = false;
  battleAutoTimer = 0;
  updateBattleAutoToggleUi();
}

function isBattleSpeedUnlocked() {
  return Boolean(chapter5State?.battleSpeedUnlocked);
}

function getBattleSpeedMultiplier() {
  return battleSpeedEnabled && isBattleSpeedUnlocked() ? 2 : 1;
}

function toggleBattleSpeed() {
  if (!isBattleSpeedUnlocked()) return;
  battleSpeedEnabled = !battleSpeedEnabled;
  updateBattleSpeedToggleUi();
}

function updateBattleAutoToggleUi() {
  if (!battleAutoToggleEl) return;
  const visible = appMode === APP_MODE.PLAYING && Boolean(battleState?.active);
  battleAutoToggleEl.classList.toggle("hidden", !visible);
  battleAutoToggleEl.classList.toggle("is-active", battleAutoEnabled);
  battleAutoToggleEl.textContent = battleAutoEnabled ? "自動 ON" : "自動 OFF";
}

function updateBattleSpeedToggleUi() {
  if (!battleSpeedToggleEl) return;
  const visible = appMode === APP_MODE.PLAYING && Boolean(battleState?.active) && isBattleSpeedUnlocked();
  if (!visible) battleSpeedEnabled = false;
  battleSpeedToggleEl.classList.toggle("hidden", !visible);
  battleSpeedToggleEl.classList.toggle("is-active", battleSpeedEnabled);
  battleSpeedToggleEl.textContent = battleSpeedEnabled ? "2倍速 ON" : "2倍速 OFF";
}

function getBattleAutoDelay() {
  if (!battleState) return AUTO_BATTLE_READY_DELAY;
  if (battleState.phase === "spin") return AUTO_BATTLE_ROW_DELAY;
  return AUTO_BATTLE_READY_DELAY;
}

function canBattleAutoAdvance() {
  if (!battleAutoEnabled || !battleState?.active) return false;
  if (battleState.phase === "victory" || battleState.phase === "defeat") {
    return false;
  }
  return ["ready", "round-ready", "spin"].includes(battleState.phase);
}

function updateBattleAuto(delta) {
  if (!canBattleAutoAdvance()) {
    battleAutoTimer = 0;
    return;
  }
  battleAutoTimer += delta;
  if (battleAutoTimer < getBattleAutoDelay()) return;
  battleAutoTimer = 0;
  advanceBattleBySpace();
}

function advanceBattleBySpace() {
  if (!battleState) return;

  if (battleState.phase === "ready" || battleState.phase === "round-ready") {
    startBattleRound();
    return;
  }

  if (battleState.phase === "spin") {
    stopNextSlotRow();
    return;
  }

  if (battleState.phase === "victory") {
    finishBattleVictory();
    return;
  }

  if (battleState.phase === "defeat") {
    if (battleState.mode === "recruit") {
      finishRecruitBattleDefeat();
      return;
    }
    if (battleState.mode === "xiao") {
      if (battleState.xiaoReviveAfterEnding) {
        finishOptionalXiaoBattleDefeat();
        return;
      }
      finishXiaoBattleDefeat();
      return;
    }
    if (battleState.onLose) {
      const finishedBattle = battleState;
      persistBattlePartyHp(finishedBattle);
      battleState = null;
      battleUiEl.classList.add("hidden");
      keys.clear();
      runBattleHelpHints(finishedBattle, () => finishedBattle.onLose(finishedBattle));
      return;
    }
    const finishedBattle = battleState;
    persistBattlePartyHp(finishedBattle);
    battleState = null;
    battleUiEl.classList.add("hidden");
    keys.clear();
    runBattleHelpHints(finishedBattle, () => openSlotBattle(finishedBattle.replayConfig));
  }
}

function finishBattleVictory() {
  if (!battleState) return;
  const finishedBattle = battleState;
  persistBattlePartyHp(finishedBattle);
  const expReward = getBattleExpReward(finishedBattle);
  grantBattleExp(finishedBattle, expReward);
  addExpNotice(expReward);
  const feeReward = getBattleShellFeeReward(finishedBattle);
  addShellFee(feeReward, { world: false });
  saveGame();
  battleState = null;
  battleUiEl.classList.add("hidden");
  runBattleHelpHints(finishedBattle, () => continueBattleVictory(finishedBattle, expReward, feeReward));
}

function continueBattleVictory(finishedBattle, expReward, feeReward) {
  if (finishedBattle.onWin) {
    finishedBattle.onWin(finishedBattle, { expReward, feeReward });
    return;
  }

  if (finishedBattle.mode === "recruit") {
    const npc = finishedBattle.recruitNpc;
    npc.recruitRetry = false;
    startDialogue(
      [
        { actor: player, speaker: player.label, body: "自討苦吃" },
        { actor: npc, speaker: npc.label, body: "嗚..." },
      ],
      () => {
        startFollowing(npc);
        if (collected === vtNpcs.length) {
          questState = "ready";
        } else {
          questState = "accepted";
        }
      },
      npc
    );
    return;
  }

  if (finishedBattle.mode === "xiao") {
    if (!finishedBattle.xiaoReviveAfterEnding) {
      questState = "completed";
      questNpcDefeated = true;
    }
    unlockPlayerTitle("ending1_black_e");
    saveGame();
    if (finishedBattle.xiaoReviveAfterEnding) questNpcDefeated = true;
    resetXiaoToDialoguePosition();
    startDialogue(
      [{ actor: questNpc, speaker: questNpc.label, body: "怎麼可能..." }],
      () => startEnding("結局1 - 發仔...倒了...", {
        mediaKey: "ending1",
        continueGame: Boolean(finishedBattle.xiaoReviveAfterEnding),
        continueLabel: "繼續遊戲",
      }),
      questNpc
    );
    return;
  }

  questState = "completed";
  startEnding();
}

function finishXiaoBattleDefeat() {
  if (!battleState) return;
  const finishedBattle = battleState;
  persistBattlePartyHp(finishedBattle);
  battleState = null;
  battleUiEl.classList.add("hidden");
  keys.clear();
  runBattleHelpHints(finishedBattle, () => {
    resetXiaoToDialoguePosition();
    saveGame();
    finishQuestObedientEnding("對不起大哥，我會好好教育她們的!");
  });
}

function finishOptionalXiaoBattleDefeat() {
  if (!battleState) return;
  const finishedBattle = battleState;
  persistBattlePartyHp(finishedBattle);
  battleState = null;
  battleUiEl.classList.add("hidden");
  keys.clear();
  runBattleHelpHints(finishedBattle, () => {
    resetXiaoToDialoguePosition();
    saveGame();
    startDialogue(
      [
        { actor: questNpc, speaker: questNpc.label, body: "打不贏就回去做事。" },
        { actor: player, speaker: player.label, body: "可惡..." },
      ],
      null,
      questNpc
    );
  });
}

function getBattleExpReward(finishedBattle) {
  if (Number.isFinite(finishedBattle.expReward)) return finishedBattle.expReward;
  return BATTLE_EXP_REWARD[finishedBattle.mode] || 80;
}

function getBattleShellFeeReward(finishedBattle) {
  if (Number.isFinite(finishedBattle.shellFeeReward)) return finishedBattle.shellFeeReward;
  if (finishedBattle.mode === "recruit") return 60;
  if (finishedBattle.mode === "xiao") return 999;
  if (finishedBattle.mode === "boss") return 220;
  return 80;
}

function persistBattlePartyHp(finishedBattle) {
  finishedBattle.helpHints = collectBattleHelpHints(finishedBattle);
  finishedBattle.units
    .filter((unit) => unit.side === "player" && characterProgress[unit.id])
    .forEach((unit) => setCharacterCurrentHp(unit.id, unit.hp));
}

function collectBattleHelpHints(finishedBattle) {
  const hints = [];
  const playerUnits = (finishedBattle?.units || []).filter((unit) => unit.side === "player");
  const heroUnit = playerUnits.find((unit) => unit.id === "hero");
  if (heroUnit && heroUnit.hp <= 0 && !battleHelpState.heroKoHintShown) {
    battleHelpState.heroKoHintShown = true;
    hints.push("親親獸沒血時，可以用 X 開啟選單，選擇水餃補血。");
  }

  const isFullPartyWipe = playerUnits.length > 1 && playerUnits.every((unit) => unit.hp <= 0);
  if (isFullPartyWipe && !battleHelpState.partyWipeHintShown) {
    battleHelpState.partyWipeHintShown = true;
    hints.push("全員倒下時，可以到叉滴娛樂的地舖睡覺，讓大家回滿 HP。");
  }
  return hints;
}

function runBattleHelpHints(finishedBattle, onComplete) {
  const hints = finishedBattle?.helpHints || [];
  if (!hints.length) {
    if (onComplete) onComplete();
    return;
  }
  saveGame();
  battleHelpNotices.length = 0;
  pendingBattleHelpNoticeCompletion = onComplete || null;
  hints.forEach((hint) => addBattleHelpNotice(hint, { waitForConfirm: true }));
}

function grantBattleExp(finishedBattle, amount) {
  const actorIds = finishedBattle.party.map((member) => member.key).filter((actorId) => characterProgress[actorId]);
  actorIds.forEach((actorId) => addCharacterExp(actorId, amount));
}

function addCharacterExp(actorId, amount) {
  const progress = getCharacterProgress(actorId);
  progress.exp += Math.max(0, Math.round(amount));
  while (progress.exp >= getNextLevelExp(progress.level)) {
    progress.exp -= getNextLevelExp(progress.level);
    progress.level += 1;
  }
}

function setCharacterLevelAtLeast(actorId, level) {
  if (!characterProgress[actorId]) return;
  const progress = getCharacterProgress(actorId);
  const targetLevel = Math.max(1, Math.floor(Number(level) || 1));
  if (progress.level >= targetLevel) return;
  const oldMaxHp = getCharacterMaxHp(actorId);
  const wasFullHp = !Number.isFinite(progress.currentHp) || progress.currentHp >= oldMaxHp;
  progress.level = targetLevel;
  progress.exp = 0;
  if (wasFullHp) {
    progress.currentHp = getCharacterMaxHp(actorId);
  } else {
    progress.currentHp = clamp(Math.round(progress.currentHp), 0, getCharacterMaxHp(actorId));
  }
}

function finishRecruitBattleDefeat() {
  if (!battleState) return;
  const npc = battleState.recruitNpc;
  if (npc) npc.recruitRetry = true;
  const finishedBattle = battleState;
  persistBattlePartyHp(finishedBattle);
  battleState = null;
  battleUiEl.classList.add("hidden");
  keys.clear();

  if (!npc) return;
  runBattleHelpHints(finishedBattle, () => {
    startDialogue([
      { actor: npc, speaker: npc.label, body: "再來我要報警了" },
    ], null, npc);
  });
}

function startBattleRound() {
  refreshActiveSkillPool();
  if (!battleState.skillPool.length) {
    finishBattleRound();
    return;
  }
  battleState.round += 1;
  battleState.phase = "spin";
  battleState.timer = 0;
  battleState.spinTick = 0;
  battleState.hitFlash = 0;
  battleState.stoppedRows = 0;
  battleState.matches = [];
  battleState.matchedCells = [];
  battleState.xiaoDomainCells = [];
  battleState.sleepBlockedCells = [];
  battleState.skillQueue = [];
  battleState.skillIndex = 0;
  battleState.activeCell = null;
  battleState.dollUniqueUsedByUnit = {};
  battleState.enemyUniqueUsedThisRound = false;
  battleState.forceRoundEndAfterSkill = false;
  battleState.forceRoundEndDelay = 0;
  syncBattleStatusUnits("player");
  syncBattleStatusUnits("enemy");
  battleState.slotRows = createSlotRows();
  battleState.rowOffsets = Array(SLOT_SIZE).fill(0);
  refreshSlotGridFromRows();
  updateBattleUi();
}

function stopNextSlotRow() {
  if (!battleState || battleState.phase !== "spin") return;
  if (battleState.stoppedRows >= SLOT_SIZE) return;

  const row = battleState.stoppedRows;
  normalizeSlotRow(row);
  refreshSlotGridFromRows();
  battleState.stoppedRows += 1;
  playSfx("slot_row_stop", { volume: SLOT_ROW_STOP_VOLUME });
  burst(camera.x + SLOT_BOARD.x + SLOT_BOARD.width * 0.5, SLOT_BOARD.y + 80 + row * 36, "#ffd56f");

  if (battleState.stoppedRows >= SLOT_SIZE) {
    prepareBattleResolution();
  }
  updateBattleUi();
}

function prepareBattleResolution() {
  battleState.matches = findFactionLines(battleState.slotGrid);
  guaranteeHisadaWorldOnFirstRescuePlayerLine();
  guaranteeEnemyUniqueSkillOnFirstEnemyLine();
  refreshSleepBlockedCells();
  battleState.xiaoDomainCells = getXiaoDomainForcedCells();
  battleState.matchedCells = [
    ...new Set([
      ...battleState.matches.flatMap((match) => match.cells),
      ...battleState.xiaoDomainCells,
    ]),
  ];
  battleState.phase = battleState.matches.length || battleState.xiaoDomainCells.length ? "line-flash" : "miss";
  battleState.timer = 0;
  battleState.hitFlash = 1;
  updateBattleUi();
}

function updateBattleUi() {
  battleUiEl.classList.add("hidden");
}

function toggleGameMenu() {
  if (menuOpen) {
    closeGameMenu();
    return;
  }
  if (!canOpenGameMenu()) return;
  openGameMenu();
}

function canOpenGameMenu() {
  return !dialogueState && !battleState?.active && !streamState?.active && !endingState && !openingCutscene && !restCutscene && !chapterCompleteTransition && !sceneFade && !transformCutscene && !dumplingRecovery && !xiaoDeparture && !smokerDeparture && !fatDumbDeparture && !kidneyDeparture && !kinkoExDeparture && !chapter4CutsceneMove && !chapter4KinkoHitSequence;
}

function openGameMenu() {
  if (!gameMenuEl) return;
  playSfx("ui_popup");
  menuOpen = true;
  menuScreen = "main";
  mainMenuIndex = 0;
  keys.clear();
  player.walkTime = 0;
  npcs.forEach((npc) => {
    npc.walkTime = 0;
  });
  renderGameMenu();
  gameMenuEl.classList.remove("hidden");
}

function closeGameMenu() {
  if (!gameMenuEl) return;
  menuOpen = false;
  teamCandidateMode = false;
  bagListActive = false;
  keys.clear();
  gameMenuEl.classList.add("hidden");
}

function handleGameMenuKey(event) {
  if (!menuOpen || event.repeat) return;
  const code = event.code;
  const isMoveKey = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(code);
  if (isMoveKey) playSfx("ui_cursor");
  if (code === CONFIRM_CODE) playSfx("ui_confirm");

  if (code === CANCEL_CODE) {
    playSfx("ui_cancel");
    cancelGameMenuScreen();
    renderGameMenu();
    return;
  }

  if (menuScreen === "main") {
    if (code === "ArrowUp") mainMenuIndex = wrapIndex(mainMenuIndex - 1, MENU_MAIN_ITEMS.length);
    if (code === "ArrowDown") mainMenuIndex = wrapIndex(mainMenuIndex + 1, MENU_MAIN_ITEMS.length);
    if (code === CONFIRM_CODE) confirmMainMenuItem();
    renderGameMenu();
    return;
  }

  if (menuScreen === "characters") {
    const owned = getOwnedCharacters();
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(code)) {
      characterMenuIndex = moveGridIndex(characterMenuIndex, code, owned.length, 4);
    }
    if (code === CONFIRM_CODE) {
      selectedCharacterId = owned[characterMenuIndex]?.id || "hero";
      syncCharacterEquipOptionToCurrentItem();
      menuScreen = "character-detail";
    }
    renderGameMenu();
    return;
  }

  if (menuScreen === "character-detail") {
    const actorId = selectedCharacterId;
    const slots = getEquipmentSlots();
    const slot = slots[characterEquipSlotIndex];
    const options = getCharacterEquipOptions(slot);
    if (characterEquipListOpen) {
      if (code === "ArrowUp") characterEquipOptionIndex = wrapIndex(characterEquipOptionIndex - 1, options.length);
      if (code === "ArrowDown") characterEquipOptionIndex = wrapIndex(characterEquipOptionIndex + 1, options.length);
      if (code === CONFIRM_CODE) equipItemToCharacter(actorId, slot, options[characterEquipOptionIndex]?.id);
    } else {
      if (code === "ArrowLeft" || code === "ArrowUp") {
        characterEquipSlotIndex = wrapIndex(characterEquipSlotIndex - 1, slots.length);
        syncCharacterEquipOptionToCurrentItem();
      }
      if (code === "ArrowRight" || code === "ArrowDown") {
        characterEquipSlotIndex = wrapIndex(characterEquipSlotIndex + 1, slots.length);
        syncCharacterEquipOptionToCurrentItem();
      }
      if (code === CONFIRM_CODE) {
        characterEquipListOpen = true;
        syncCharacterEquipOptionToCurrentItem();
      }
    }
    renderGameMenu();
    return;
  }

  if (menuScreen === "equipment") {
    const items = getBagItems();
    if (!bagListActive) {
      if (code === "ArrowLeft") setBagTabIndex(bagTabIndex - 1);
      if (code === "ArrowRight") setBagTabIndex(bagTabIndex + 1);
      if (code === CONFIRM_CODE && items.length) bagListActive = true;
      renderGameMenu();
      return;
    }
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(code)) {
      equipmentMenuIndex = moveGridIndex(equipmentMenuIndex, code, items.length, 2);
    }
    if (code === CONFIRM_CODE) {
      const ownerId = getEquipmentOwner(items[equipmentMenuIndex]?.id);
      if (ownerId) {
        selectedCharacterId = ownerId;
        syncCharacterEquipOptionToCurrentItem();
        menuScreen = "character-detail";
      }
    }
    renderGameMenu();
    return;
  }

  if (menuScreen === "titles") {
    if (code === "ArrowUp" || code === "ArrowLeft") honorTitleIndex = wrapIndex(honorTitleIndex - 1, PLAYER_TITLES.length);
    if (code === "ArrowDown" || code === "ArrowRight") honorTitleIndex = wrapIndex(honorTitleIndex + 1, PLAYER_TITLES.length);
    renderGameMenu();
    return;
  }

  if (menuScreen === "shop") {
    const goods = getCurrentShopGoods();
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(code)) {
      shopMenuIndex = moveGridIndex(shopMenuIndex, code, goods.length, 2);
    }
    if (code === CONFIRM_CODE) buyShopItem(goods[shopMenuIndex]);
    renderGameMenu();
    return;
  }

  if (menuScreen === "team") {
    const candidates = getTeamCandidates();
    if (teamCandidateMode) {
      if (code === "ArrowUp") teamCandidateIndex = wrapIndex(teamCandidateIndex - 1, candidates.length);
      if (code === "ArrowDown") teamCandidateIndex = wrapIndex(teamCandidateIndex + 1, candidates.length);
      if (code === CONFIRM_CODE) {
        assignTeamSlotFromCandidate();
        teamCandidateMode = false;
      }
    } else {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(code)) {
        teamSlotIndex = moveGridIndex(teamSlotIndex, code, teamSlots.length, 2);
      }
      if (code === CONFIRM_CODE && candidates.length) {
        teamCandidateMode = true;
        teamCandidateIndex = clampMenuIndex(teamCandidateIndex, candidates.length);
      }
    }
    renderGameMenu();
  }
}

function cancelGameMenuScreen() {
  if (menuScreen === "main") {
    closeGameMenu();
    return;
  }
  if (menuScreen === "character-detail") {
    if (characterEquipListOpen) {
      characterEquipListOpen = false;
      return;
    }
    menuScreen = "characters";
    return;
  }
  if (menuScreen === "team" && teamCandidateMode) {
    teamCandidateMode = false;
    return;
  }
  if (menuScreen === "equipment" && bagListActive) {
    bagListActive = false;
    return;
  }
  if (menuScreen === "shop") {
    activeShopId = null;
    closeGameMenu();
    return;
  }
  menuScreen = "main";
}

function openMenuScreen(screen) {
  menuScreen = screen;
  if (screen === "characters") {
    characterMenuIndex = clampMenuIndex(characterMenuIndex, getOwnedCharacters().length);
  } else if (screen === "character-detail") {
    characterEquipListOpen = false;
    syncCharacterEquipOptionToCurrentItem();
  } else if (screen === "equipment") {
    bagTabIndex = clampMenuIndex(bagTabIndex, 2);
    equipmentMenuIndex = clampMenuIndex(equipmentMenuIndex, getBagItems().length);
    bagListActive = false;
  } else if (screen === "titles") {
    honorTitleIndex = clampMenuIndex(honorTitleIndex, PLAYER_TITLES.length);
  } else if (screen === "shop") {
    shopMenuIndex = clampMenuIndex(shopMenuIndex, getCurrentShopGoods().length);
  } else if (screen === "team") {
    sanitizeTeamSlots();
    teamSlotIndex = clampMenuIndex(teamSlotIndex, teamSlots.length);
    teamCandidateIndex = clampMenuIndex(teamCandidateIndex, getTeamCandidates().length);
    teamCandidateMode = false;
  }
}

function confirmMainMenuItem() {
  const item = MENU_MAIN_ITEMS[mainMenuIndex];
  if (!item) return;
  if (item.id === "dumpling") {
    startDumplingRecovery();
    return;
  }
  openMenuScreen(item.id);
}

function setBagTabIndex(nextIndex) {
  bagTabIndex = wrapIndex(nextIndex, 2);
  equipmentMenuIndex = 0;
}

function canUseDumpling() {
  return getCharacterCurrentHp("hero") <= 0 && !dumplingRecovery;
}

function startDumplingRecovery() {
  if (!canUseDumpling()) return;
  closeGameMenu();
  keys.clear();
  player.walkTime = 0;
  player.direction = "down";
  dumplingRecovery = {
    elapsed: 0,
    maxHp: getCharacterMaxHp("hero"),
    tickTimer: 0,
  };
}

function updateDumplingRecovery(delta) {
  if (!dumplingRecovery) return;
  dumplingRecovery.elapsed += delta;
  dumplingRecovery.tickTimer += delta;
  player.walkTime = 0;
  player.direction = "down";
  const tickDuration = 0.5;
  const healPerTick = dumplingRecovery.maxHp * 0.1;
  const recovered = healPerTick * (dumplingRecovery.elapsed / tickDuration);
  setCharacterCurrentHp("hero", recovered);
  while (dumplingRecovery?.tickTimer >= tickDuration) {
    dumplingRecovery.tickTimer -= tickDuration;
    addWorldFloatingText(player.x, player.y - 88, `+${Math.round(healPerTick)}`, "#75f4b2");
  }
  if (getCharacterCurrentHp("hero") >= dumplingRecovery.maxHp) {
    setCharacterCurrentHp("hero", dumplingRecovery.maxHp);
    dumplingRecovery = null;
    startDialogue([{ actor: player, speaker: player.label, body: "水飽了" }], null, player);
  }
}

function startFloorMatRestCutscene() {
  startRestCutscene("floorMat");
}

function startHotelRoomRestCutscene() {
  startRestCutscene("hotelRoom");
}

function startRestCutscene(source = "floorMat") {
  if (chapter4State.phase === "base_captive") {
    restCutscene = {
      source: "baseCell",
      lineIndex: 0,
      timer: 0,
      lines: [
        "V黑娛樂的地舖硬得像沒加薪的公司制度。",
        "大家擠在房間裡，想著什麼時候能獲救。",
        `第 ${currentDay + 1} 天`,
      ],
    };
    return;
  }
  if (chapter4State.phase === "confront_ex") {
    startDialogue(
      [
        { actor: questNpc, speaker: questNpc.label, body: "你現在去水餃我真的會扁你" },
        { actor: player, speaker: player.label, body: "做做效果啦" },
        { actor: questNpc, speaker: questNpc.label, body: "有個破事已經很煩了，你還在給我耍憨" },
      ],
      null,
      questNpc
    );
    return;
  }
  const blocker = getRestActivityBlocker();
  if (blocker) {
    startDialogue(
      [
        { actor: blocker.actor || player, speaker: blocker.speaker, body: blocker.body },
        { actor: player, speaker: player.label, body: "等她回來再水餃吧。" },
      ],
      null,
      blocker.actor || player
    );
    return;
  }
  const lines = buildRestCutsceneLines(source);
  keys.clear();
  hideDialogue();
  dialogueState = null;
  restCutscene = {
    source,
    lineIndex: 0,
    timer: 0,
    lines,
  };
}

function buildRestCutsceneLines(source = "floorMat") {
  const mood = chapter4State.phase === "post_kinko_stream_rest"
    ? "postKinko"
    : source === "hotelRoom"
    ? "hotelRoom"
    : "floorMat";
  const openingByMood = {
    postKinko: "少了一個人的房間安靜得有點不自然。",
    hotelRoom: "HOTEL 的房間冷氣有點吵，但至少不是地板。",
    floorMat: "叉滴娛樂的地舖，比發給員工的薪水還薄。",
  };
  const memberLines = getRestCutsceneMemberIds()
    .map((actorId) => getRestCutsceneMemberLine(actorId, mood))
    .filter(Boolean);
  const lines = [openingByMood[mood], ...memberLines];
  if (!memberLines.length) lines.push("親親獸：算了，先水餃。");
  lines.push(`第 ${currentDay + 1} 天`);
  return lines;
}

function getRestCutsceneMemberIds() {
  return teamSlots
    .filter((actorId) => actorId && actorId !== "hero")
    .filter((actorId, index, list) => list.indexOf(actorId) === index)
    .filter((actorId) => {
      const actor = getCharacterById(actorId);
      return actor && actor.following;
    });
}

function getRestCutsceneMemberLine(actorId, mood) {
  const linesByActor = {
    npc1: {
      postKinko: "豬鼻醬：親親子會不會肚子餓...",
      hotelRoom: "豬鼻醬：床邊可以放拉麵嗎...",
      floorMat: "豬鼻醬：如果夢裡有拉麵就好了...",
    },
    npc2: {
      postKinko: "波貝貝：先睡，明天再說。",
      hotelRoom: "波貝貝：房間不錯，先水餃。",
      floorMat: "波貝貝：先不要吵，我要水餃。",
    },
    npc3: {
      postKinko: null,
      hotelRoom: "親親子：這裡直播應該可以騙比較多...我是說互動比較好。",
      floorMat: "親親子：醒來要記得繼續騙...我是說工作。",
    },
    npc4: {
      postKinko: "蕭政銘：少一個人還是要想辦法賺錢。",
      hotelRoom: "蕭政銘：睡 HOTEL 也是成本，記帳記清楚。",
      floorMat: "蕭政銘：地舖不用錢，這就是公司福利。",
    },
  };
  const actor = getCharacterById(actorId);
  return linesByActor[actorId]?.[mood] || (actor ? `${actor.label}：先水餃，醒來再說。` : null);
}

function getRestActivityBlocker() {
  if (["running", "done"].includes(chapter3State.pigDate?.status)) {
    const fatDumb = getCharacterById("npc8");
    const isDone = chapter3State.pigDate.status === "done";
    return {
      actor: fatDumb,
      speaker: fatDumb?.label || "胖呆親親獸",
      body: isDone
        ? "豬鼻醬約會結束了，先來把她接回去。"
        : `豬鼻醬還在約會中，再等 ${formatCountdown(chapter3State.pigDate.remaining)}。`,
    };
  }
  if (["running", "done"].includes(chapter3State.bebeCollab?.status)) {
    const kidney = getCharacterById("npc14");
    const isDone = chapter3State.bebeCollab.status === "done";
    return {
      actor: kidney,
      speaker: kidney?.label || "腰子親親獸",
      body: isDone
        ? "波貝貝聯動結束了，先來把她接回去。"
        : `波貝貝還在聯動中，再等 ${formatCountdown(chapter3State.bebeCollab.remaining)}。`,
    };
  }
  return null;
}

function updateRestCutscene(delta) {
  if (!restCutscene) return;
  restCutscene.timer += delta;
  player.walkTime = 0;
  npcs.forEach((npc) => {
    npc.walkTime = 0;
  });
}

function advanceRestCutscene() {
  if (!restCutscene) return;
  if (restCutscene.lineIndex < restCutscene.lines.length - 1) {
    restCutscene.lineIndex += 1;
    restCutscene.timer = 0;
    return;
  }
  finishRestCutscene();
}

function finishRestCutscene() {
  const wasChapter3Rest = chapter3State.phase === "need_rest";
  const chapter4PhaseBeforeRest = chapter4State.phase;
  const restSource = restCutscene?.source;
  let afterFade = null;
  currentDay += 1;
  healAllCharactersToFull();
  restCutscene = null;
  if (restSource === "hotelRoom") {
    chapter3State.kinkoOtakuFeeNeedsMapChange = true;
    movePlayerAwayFromHotelRoomPoint();
  }
  placeFatDumbDailyNpc();
  applyDailyActivityActorStates();
  if (recordStaleDumplingRestAndShouldTrigger()) {
    afterFade = startChapter2DumplingEndingPrelude;
  } else if (chapter4PhaseBeforeRest === "base_captive" || restSource === "baseCell") {
    chapter4State.captiveSleepCount = Math.max(0, Number(chapter4State.captiveSleepCount) || 0) + 1;
    placeChapter4CapturedParty();
    const shouldTransformBack = chapter4State.transformed && chapter4State.captiveSleepCount === 1;
    afterFade = shouldTransformBack
      ? startChapter4CaptiveTransformBackAfterRest
      : chapter4State.captiveSleepCount >= CHAPTER4_CELL_REST_LIMIT
      ? startChapter4RescueFlashback
      : startChapter4CaptiveMorningDialogue;
  } else if (chapter4PhaseBeforeRest === "need_rest") {
    afterFade = startChapter4AfterFirstRest;
  } else if (chapter4PhaseBeforeRest === "target_reached_rest") {
    prepareChapter4AfterTargetRestWorld();
    afterFade = startChapter4AfterTargetRestDialogue;
  } else if (chapter4PhaseBeforeRest === "post_kinko_stream_rest") {
    afterFade = startChapter4RescueInfoAfterRest;
  } else if (wasChapter3Rest) {
    chapter3State.phase = "ask_xiao";
    chapter3State.sleptAfterChapter2 = true;
    hideMissingChapter3Members();
    afterFade = startChapter3WakeDialogue;
  }
  saveGame();
  startSceneFadeIn(afterFade);
}

function movePlayerAwayFromHotelRoomPoint() {
  if (currentMapIndex !== 7) return;
  const roomPoint = HOTEL_ROOM_POINTS.find((point) => point.id === "hotel_room_1");
  if (!roomPoint) return;
  const road = getCurrentRoad();
  player.x = clamp(roomPoint.x - 150, road.left + 18, road.right - 18);
  player.y = clamp(roomPoint.y + 86, road.top + 18, road.bottom - 18);
  player.direction = "right";
  player.walkTime = 0;
  seedTrail(player);
  syncFollowersNearPlayer("right", road);
  snapCameraToPlayer();
}

function addWorldFloatingText(x, y, text, color, options = {}) {
  const life = options.life ?? 0.95;
  worldFloatingTexts.push({
    x,
    y,
    text,
    color,
    life,
    maxLife: life,
    riseSpeed: options.riseSpeed ?? 34,
  });
}

function addShellFee(amount, options = {}) {
  const gained = Math.max(0, Math.floor(Number(amount) || 0));
  if (!gained) return;
  shellFee += gained;
  if (options.world !== false) {
    addWorldFloatingText(
      options.x ?? player.x,
      options.y ?? player.y - 88,
      `護貝費 +${gained}`,
      options.color || "#ffe16f",
      { life: 2.4, riseSpeed: 18 }
    );
  }
  addShellFeeNotice(gained);
}

function addShellFeeNotice(amount) {
  shellFeeNotices.unshift({
    amount,
    total: shellFee,
    label: `護貝費 +${amount}`,
    subText: `持有 ${shellFee}`,
    color: "#ffe16f",
    borderColor: "rgba(255, 225, 111, 0.82)",
    life: 4,
    maxLife: 4,
  });
  if (shellFeeNotices.length > 3) shellFeeNotices.length = 3;
}

function addExpNotice(amount) {
  const gained = Math.max(0, Math.round(Number(amount) || 0));
  if (!gained) return;
  shellFeeNotices.unshift({
    amount: gained,
    label: `經驗 +${gained}`,
    subText: "參戰成員",
    color: "#8ff5ff",
    borderColor: "rgba(143, 245, 255, 0.82)",
    life: 4,
    maxLife: 4,
  });
  if (shellFeeNotices.length > 3) shellFeeNotices.length = 3;
}

function addTitleUnlockNotice(title) {
  titleUnlockNotices.unshift({
    name: title.name,
    effect: title.effect,
    life: 5.2,
    maxLife: 5.2,
  });
  if (titleUnlockNotices.length > 2) titleUnlockNotices.length = 2;
}

function addBattleHelpNotice(text, options = {}) {
  battleHelpNotices.unshift({
    text,
    age: 0,
    life: 4.2,
    maxLife: 4.2,
    waitForConfirm: Boolean(options.waitForConfirm),
  });
  if (battleHelpNotices.length > 2) battleHelpNotices.length = 2;
}

function hasBattleHelpNoticeAwaitingConfirm() {
  return battleHelpNotices.some((notice) => notice.waitForConfirm);
}

function confirmBattleHelpNotices() {
  if (!hasBattleHelpNoticeAwaitingConfirm()) return false;
  battleHelpNotices.length = 0;
  const onComplete = pendingBattleHelpNoticeCompletion;
  pendingBattleHelpNoticeCompletion = null;
  keys.clear();
  if (onComplete) onComplete();
  return true;
}

function updateWorldFloatingTexts(delta) {
  for (const text of worldFloatingTexts) {
    text.life -= delta;
    text.y -= (text.riseSpeed ?? 34) * delta;
  }
  for (let index = worldFloatingTexts.length - 1; index >= 0; index -= 1) {
    if (worldFloatingTexts[index].life <= 0) worldFloatingTexts.splice(index, 1);
  }
  for (const notice of shellFeeNotices) {
    notice.life -= delta;
  }
  for (let index = shellFeeNotices.length - 1; index >= 0; index -= 1) {
    if (shellFeeNotices[index].life <= 0) shellFeeNotices.splice(index, 1);
  }
  for (const notice of battleHelpNotices) {
    notice.age = (notice.age || 0) + delta;
    if (!notice.waitForConfirm) notice.life -= delta;
  }
  for (let index = battleHelpNotices.length - 1; index >= 0; index -= 1) {
    if (!battleHelpNotices[index].waitForConfirm && battleHelpNotices[index].life <= 0) {
      battleHelpNotices.splice(index, 1);
    }
  }
  if (canShowTitleUnlockNotices()) {
    for (const notice of titleUnlockNotices) {
      notice.life -= delta;
    }
    for (let index = titleUnlockNotices.length - 1; index >= 0; index -= 1) {
      if (titleUnlockNotices[index].life <= 0) titleUnlockNotices.splice(index, 1);
    }
  }
}

function drawWorldFloatingTexts() {
  for (const text of worldFloatingTexts) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, Math.max(text.life / text.maxLife, 0) * 2.2);
    ctx.fillStyle = text.color;
    ctx.font = "bold 24px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.82)";
    ctx.shadowBlur = 8;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(0, 45, 24, 0.82)";
    ctx.strokeText(text.text, text.x - camera.x, text.y - camera.y);
    ctx.fillText(text.text, text.x - camera.x, text.y - camera.y);
    ctx.restore();
  }
}

function drawShellFeeNotices() {
  shellFeeNotices.forEach((notice, index) => {
    const progress = clamp(notice.life / notice.maxLife, 0, 1);
    const alpha = Math.min(1, progress * 3);
    const slide = (1 - Math.min(1, progress * 1.4)) * -18;
    const x = canvas.width / 2;
    const y = 32 + index * 58 + slide;
    const width = 360;
    const height = 48;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x - width / 2, y);
    ctx.fillStyle = "rgba(10, 16, 30, 0.9)";
    roundRect(0, 0, width, height, 16);
    ctx.fill();
    ctx.strokeStyle = notice.borderColor || "rgba(255, 225, 111, 0.82)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = notice.color || "#ffe16f";
    ctx.font = "bold 20px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(notice.label || `護貝費 +${notice.amount}`, 24, height / 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
    ctx.font = "bold 15px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(notice.subText || `持有 ${notice.total}`, width - 24, height / 2 + 1);
    ctx.restore();
  });
}

function drawBattleHelpNotices() {
  battleHelpNotices.forEach((notice, index) => {
    const age = notice.age || 0;
    const progress = notice.waitForConfirm ? clamp(age / 0.34, 0, 1) : 1 - clamp(notice.life / notice.maxLife, 0, 1);
    const fadeIn = clamp(progress / 0.16, 0, 1);
    const fadeOut = notice.waitForConfirm ? 1 : clamp(notice.life / 0.38, 0, 1);
    const alpha = Math.min(fadeIn, fadeOut);
    const width = Math.min(canvas.width - 96, 760);
    const padding = 24;
    const titleHeight = 22;
    const bodyFont = "bold 22px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.save();
    ctx.font = bodyFont;
    const lines = wrapBattleHelpNoticeText(notice.text, width - padding * 2);
    const height = 68 + Math.max(1, lines.length) * 28;
    const x = (canvas.width - width) / 2;
    const y = 100 + index * (height + 14) - (1 - fadeIn) * 16;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(7, 13, 30, 0.93)";
    roundRect(x, y, width, height, 20);
    ctx.fill();
    ctx.strokeStyle = "rgba(143, 245, 255, 0.86)";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.shadowColor = "rgba(143, 245, 255, 0.35)";
    ctx.shadowBlur = 16;
    ctx.strokeStyle = "rgba(255, 225, 111, 0.42)";
    ctx.lineWidth = 1.5;
    roundRect(x + 5, y + 5, width - 10, height - 10, 16);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffe16f";
    ctx.font = "bold 18px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("戰鬥提示", x + padding, y + 18);
    ctx.fillStyle = "#f3fbff";
    ctx.font = bodyFont;
    lines.forEach((line, lineIndex) => {
      ctx.fillText(line, x + padding, y + 18 + titleHeight + 16 + lineIndex * 28);
    });
    ctx.restore();
  });
}

function wrapBattleHelpNoticeText(text, maxWidth) {
  const lines = [];
  let current = "";
  Array.from(String(text || "")).forEach((char) => {
    const next = current + char;
    if (current && ctx.measureText(next).width > maxWidth) {
      lines.push(current);
      current = char;
    } else {
      current = next;
    }
  });
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function canShowTitleUnlockNotices() {
  return Boolean(endingState && endingState.alpha >= TITLE_UNLOCK_ENDING_ALPHA);
}

function drawTitleUnlockNotices() {
  titleUnlockNotices.forEach((notice, index) => {
    const progress = clamp(notice.life / notice.maxLife, 0, 1);
    const alpha = Math.min(1, progress * 3);
    const slide = (1 - Math.min(1, progress * 1.35));
    const width = 430;
    const height = 82;
    const x = canvas.width - width - 28 + slide * 28;
    const y = canvas.height - 118 - index * (height + 12);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(8, 14, 30, 0.94)";
    roundRect(x, y, width, height, 18);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 225, 111, 0.88)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#ffe16f";
    ctx.font = "bold 20px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("獲得稱號", x + 24, y + 22);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 25px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText(`「${notice.name}」`, x + 24, y + 48);
    ctx.fillStyle = "rgba(234,255,255,0.72)";
    ctx.font = "bold 14px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText(notice.effect, x + 24, y + 66);
    ctx.restore();
  });
}

function renderGameMenu() {
  if (!menuContentEl) return;
  const renderers = {
    main: renderMainMenu,
    characters: renderCharacterListMenu,
    "character-detail": renderCharacterDetailMenu,
    equipment: renderEquipmentMenu,
    titles: renderTitlesMenu,
    team: renderTeamMenu,
    shop: renderShopMenu,
  };
  menuContentEl.innerHTML = (renderers[menuScreen] || renderMainMenu)();
  syncMenuSelectionIntoView();
}

function syncMenuSelectionIntoView() {
  const selected = menuContentEl?.querySelector(".is-selected");
  if (!selected || typeof selected.scrollIntoView !== "function") return;
  selected.scrollIntoView({ block: "nearest", inline: "nearest" });
}

function renderMainMenu() {
  return `
    <div class="menu-root">
      <div class="menu-heading">選單</div>
      ${MENU_MAIN_ITEMS.map((item, index) => {
        const disabled = item.id === "dumpling" && !canUseDumpling();
        return `
        <div class="menu-option${index === mainMenuIndex ? " is-selected" : ""}${disabled ? " is-disabled" : ""}" data-menu-screen="${escapeHtml(item.id)}">
          ${escapeHtml(item.label)}
        </div>
      `;
      }).join("")}
      <div class="menu-save-status">自動存檔｜第 ${escapeHtml(currentDay)} 天｜護貝費 ${escapeHtml(shellFee)}</div>
    </div>
  `;
}

function renderCharacterListMenu() {
  const owned = getOwnedCharacters();
  characterMenuIndex = clampMenuIndex(characterMenuIndex, owned.length);
  return `
    <div class="menu-heading">已有角色</div>
    <div class="head-grid">
      ${owned.map((actor, index) => renderHeadCard(actor, index === characterMenuIndex, "data-character-id")).join("")}
    </div>
  `;
}

function renderCharacterDetailMenu() {
  const actor = getCharacterById(selectedCharacterId) || player;
  const displayActorId = getCharacterMenuDisplayActorId(actor.id);
  const stats = getCharacterStats(actor);
  const activeSkills = PLAYER_SKILLS_BY_ACTOR[displayActorId] || [];
  const passiveSkills = getPassiveSkills(displayActorId);
  const slots = getEquipmentSlots();
  const slot = slots[characterEquipSlotIndex];
  const options = getCharacterEquipOptions(slot);
  characterEquipOptionIndex = clampMenuIndex(characterEquipOptionIndex, options.length);
  return `
    <section class="character-detail">
      <div class="character-profile">
        <img class="menu-head large" src="${escapeHtml(getHeadSource(actor.id))}" alt="${escapeHtml(actor.label)}">
        <div class="character-profile-info">
          <div class="menu-title-line">
            <div class="menu-name">${escapeHtml(actor.label)}</div>
            <div class="menu-race">${escapeHtml(stats.race)}</div>
            <div class="menu-level">Lv.${escapeHtml(stats.level)}</div>
          </div>
          <div class="menu-badge">${escapeHtml(getCharacterStatus(actor))}・EXP ${escapeHtml(stats.exp)}/${escapeHtml(stats.nextExp)}・人氣 ${escapeHtml(stats.popularity)}（全能力 +${escapeHtml(stats.popularityBonusPercent)}%）</div>
        </div>
        <div class="character-power-card">
          <span>戰力</span>
          <strong>${escapeHtml(stats.power)}</strong>
        </div>
      </div>
      <div class="menu-stats">
        <div class="menu-stat"><span>HP</span><strong>${escapeHtml(stats.hp)}</strong></div>
        <div class="menu-stat"><span>人氣值</span><strong>${escapeHtml(stats.popularity)}</strong></div>
        <div class="menu-stat"><span>物攻</span><strong>${escapeHtml(stats.physicalAttack)}</strong></div>
        <div class="menu-stat"><span>魔攻</span><strong>${escapeHtml(stats.magicAttack)}</strong></div>
        <div class="menu-stat"><span>護盾效果</span><strong>${escapeHtml(stats.shieldEffect)}</strong></div>
        <div class="menu-stat"><span>治療效果</span><strong>${escapeHtml(stats.healEffect)}</strong></div>
      </div>
      <div class="character-loadout">
        <div class="character-main-panel">
          <div class="menu-heading">裝備</div>
          <div class="equipment-slots">
            ${slots.map((slotId, index) => renderEquipmentSlot(actor.id, slotId, index === characterEquipSlotIndex)).join("")}
          </div>
          <div class="skill-columns">
            <section class="skill-column">
              <div class="menu-heading">主動技能</div>
              <div class="skill-list">
                ${activeSkills.length ? activeSkills.map((skill, index) => renderSkillRow(skill, { unique: isUniqueSkillIndex(index, skill) })).join("") : `<div class="menu-empty">沒有主動技能</div>`}
              </div>
            </section>
            <section class="skill-column">
              <div class="menu-heading">被動技能</div>
              <div class="skill-list">
                ${passiveSkills.length ? passiveSkills.map((skill) => renderSkillRow(skill)).join("") : `<div class="menu-empty">沒有被動技能</div>`}
              </div>
            </section>
          </div>
        </div>
        <aside class="equip-side-panel${characterEquipListOpen ? "" : " is-closed"}">
          ${characterEquipListOpen ? `
            <div class="menu-heading">${escapeHtml(EQUIPMENT_SLOT_LABELS[slot] || slot)}</div>
            <div class="equip-choice-list">
              ${options.map((item, index) => renderCharacterEquipChoice(actor.id, slot, item, index === characterEquipOptionIndex)).join("")}
            </div>
          ` : ""}
        </aside>
      </div>
    </section>
  `;
}

function renderSkillRow(skill, options = {}) {
  const isUnique = Boolean(options.unique || skill.unique);
  const skillName = `${isUnique ? "獨特技能 - " : ""}${skill.name}`;
  return `
    <div class="skill-row${isUnique ? " is-unique" : ""}">
      ${renderSkillIcon(skill.type)}
      <div>
        <strong>${escapeHtml(skillName)}</strong>
        <span>${escapeHtml(SKILL_TYPES[skill.type]?.label || skill.type)}・${escapeHtml(skill.effect || SKILL_EFFECTS[skill.type] || "")}</span>
      </div>
    </div>
  `;
}

function renderSkillIcon(type) {
  const frame = SKILL_ICON_FRAMES[type] || SKILL_ICON_FRAMES.support || SKILL_ICON_FRAMES.physical;
  const scale = 0.34;
  return `<span class="menu-skill-icon" style="background-image: url('./assests/Battle/skill.png'); background-size: ${Math.round(500 * scale)}px ${Math.round(500 * scale)}px; background-position: -${Math.round(frame.x * scale)}px -${Math.round(frame.y * scale)}px;"></span>`;
}

function getPassiveSkills(actorId) {
  const passive = PASSIVE_SKILLS_BY_ACTOR[actorId];
  return passive ? [{ ...passive, id: `${actorId}_passive`, type: "passive" }] : [];
}

function isUniqueSkillIndex(index, skill) {
  return Boolean(skill?.unique || index === 3);
}

function renderEquipmentSlot(actorId, slotId, selected) {
  const item = getEquippedItem(slotId, actorId);
  const isEmpty = item.id === DEFAULT_EQUIPMENT_BY_SLOT[slotId];
  return `
    <article class="equipment-slot${selected ? " is-selected" : ""}${isEmpty ? " is-empty" : ""}" data-character-equipment-slot="${escapeHtml(slotId)}">
      <span class="equipment-slot-label">${escapeHtml(EQUIPMENT_SLOT_LABELS[slotId] || slotId)}</span>
      ${renderEquipmentIcon(item, slotId)}
    </article>
  `;
}

function renderCharacterEquipChoice(actorId, slot, item, selected) {
  const equipped = getEquippedItem(slot, actorId).id === item.id;
  const isStackable = isStackableEquipmentItem(item.id);
  const ownerId = isStackable ? null : getEquipmentOwner(item.id);
  const owner = ownerId ? getCharacterById(ownerId) : null;
  const stackableCount = isStackable
    ? `<span class="equip-stack-count">持有 ${escapeHtml(getStackableEquipmentOwnedCount(item.id))} / 已裝備 ${escapeHtml(getEquippedEquipmentCount(item.id))}</span>`
    : "";
  return `
    <div class="equip-choice${selected ? " is-selected" : ""}${equipped ? " is-equipped" : ""}" data-character-equip-choice="${escapeHtml(item.id)}">
      ${renderEquipmentIcon(item, slot)}
      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <span>${escapeHtml(formatEquipmentEffect(item))}</span>
        ${stackableCount}
      </div>
      ${owner ? `<img class="equipment-owner" src="${escapeHtml(getHeadSource(ownerId))}" alt="${escapeHtml(owner.label)}">` : ""}
    </div>
  `;
}

function renderEquipmentMenuLegacy() {
  const items = getInventoryEquipmentItems();
  equipmentMenuIndex = clampMenuIndex(equipmentMenuIndex, items.length);
  return `
    <div class="menu-heading">持有裝備</div>
    <div class="equipment-inventory">
      ${items.map((item, index) => renderInventoryItem(item, index === equipmentMenuIndex)).join("")}
    </div>
  `;
}

function renderEquipmentMenu() {
  const items = getBagItems();
  equipmentMenuIndex = clampMenuIndex(equipmentMenuIndex, items.length);
  return `
    <div class="bag-header">
      <div>
        <div class="menu-heading">背包</div>
        <div class="bag-currency">護貝費：${escapeHtml(shellFee)}</div>
      </div>
      <div class="bag-tabs${bagListActive ? "" : " is-active"}">
        ${["裝備", "物品"].map((label, index) => `<span class="bag-tab${bagTabIndex === index ? " is-selected" : ""}" data-bag-tab="${index}">${escapeHtml(label)}</span>`).join("")}
      </div>
    </div>
    ${bagTabIndex === 0 ? `
      <div class="equipment-inventory${bagListActive ? " is-active" : " is-locked"}">
        ${items.length ? items.map((item, index) => renderInventoryItem(item, bagListActive && index === equipmentMenuIndex)).join("") : `<div class="menu-empty">目前沒有裝備</div>`}
      </div>
    ` : `
      <div class="equipment-inventory${bagListActive ? " is-active" : " is-locked"}">
        ${items.length ? items.map((item, index) => renderBagItem(item, bagListActive && index === equipmentMenuIndex)).join("") : `<div class="menu-empty">目前沒有物品</div>`}
      </div>
    `}
  `;
}

function getBagItems() {
  return bagTabIndex === 0 ? getInventoryEquipmentItems() : getInventoryConsumableItems();
}

function getInventoryConsumableItems() {
  return [
    { id: "dumpling_item", name: "水餃", description: "倒地時可以慢慢把 HP 補回來。", count: 1 },
    { id: "burger_item", name: "漢堡", description: "一個看起來很可疑的漢堡。", count: 0 },
    ...Object.values(ITEM_CATALOG).map((item) => ({
      ...item,
      count: getOwnedItemCount(item.id),
    })),
  ].filter((item) => item.count > 0);
}

function renderBagItem(item, selected) {
  return `
    <article class="inventory-item${selected ? " is-selected" : ""}" data-item-id="${escapeHtml(item.id)}">
      <strong>${escapeHtml(item.name)} x${escapeHtml(item.count)}</strong>
      <span>${escapeHtml(item.description)}</span>
    </article>
  `;
}

function renderInventoryItem(item, selected) {
  const ownerId = getEquipmentOwner(item.id);
  const owner = ownerId ? getCharacterById(ownerId) : null;
  const countText = isStackableEquipmentItem(item.id)
    ? `<span class="shop-owned-count">持有 ${escapeHtml(getStackableEquipmentOwnedCount(item.id))}</span>`
    : "";
  return `
    <article class="inventory-item${selected ? " is-selected" : ""}" data-equipment-id="${escapeHtml(item.id)}">
      ${renderEquipmentIcon(item, item.slot)}
      <span class="menu-badge">${escapeHtml(EQUIPMENT_SLOT_LABELS[item.slot] || item.slot)}</span>
      <strong>${escapeHtml(item.name)}</strong>
      <span>${escapeHtml(formatEquipmentEffect(item))}</span>
      ${countText}
      ${owner ? `<img class="equipment-owner" src="${escapeHtml(getHeadSource(ownerId))}" alt="${escapeHtml(owner.label)}">` : ""}
    </article>
  `;
}

function renderShopMenu() {
  const goods = getCurrentShopGoods();
  shopMenuIndex = clampMenuIndex(shopMenuIndex, goods.length);
  return `
    <div class="bag-header">
      <div>
        <div class="menu-heading">商店</div>
        <div class="bag-currency">護貝費：${escapeHtml(shellFee)}</div>
      </div>
      <div class="menu-badge">Z 購買 / X 返回</div>
    </div>
    <div class="equipment-inventory">
      ${goods.length ? goods.map((item, index) => renderShopItem(item, index === shopMenuIndex)).join("") : `<div class="menu-empty">商店目前沒東西</div>`}
    </div>
  `;
}

function renderShopItem(item, selected) {
  const price = getShopPrice(item);
  const ownedCount = getShopItemOwnedCount(item);
  const isSoldOut = isShopItemSoldOut(item);
  const label = item.kind === "item" ? "物品" : (EQUIPMENT_SLOT_LABELS[item.slot] || item.slot);
  const effect = item.kind === "item" ? item.description : formatEquipmentEffect(item);
  return `
    <article class="inventory-item${selected ? " is-selected" : ""}" data-shop-item="${escapeHtml(item.id)}">
      ${renderShopIcon(item)}
      <span class="menu-badge">${escapeHtml(label)}</span>
      <strong>${escapeHtml(item.name)}</strong>
      <span>${escapeHtml(effect)}</span>
      <span class="shop-owned-count">持有 ${escapeHtml(ownedCount)}</span>
      <span>${isSoldOut ? "售罄" : `護貝費 ${escapeHtml(price)}`}</span>
    </article>
  `;
}

function renderTitlesMenu() {
  honorTitleIndex = clampMenuIndex(honorTitleIndex, PLAYER_TITLES.length);
  const unlockedCount = PLAYER_TITLES.filter((title) => hasUnlockedTitle(title.id)).length;
  return `
    <div class="bag-header">
      <div>
        <div class="menu-heading">稱號</div>
        <div class="bag-currency">已取得：${escapeHtml(unlockedCount)}/${escapeHtml(PLAYER_TITLES.length)}</div>
      </div>
      <div class="menu-badge">已取得稱號效果會永久生效</div>
    </div>
    <div class="title-list">
      ${PLAYER_TITLES.map((title, index) => renderPlayerTitleCard(title, index === honorTitleIndex)).join("")}
    </div>
  `;
}

function renderPlayerTitleCard(title, selected) {
  const unlocked = hasUnlockedTitle(title.id);
  return `
    <article class="title-card${selected ? " is-selected" : ""}${unlocked ? "" : " is-locked"}" data-title-id="${escapeHtml(title.id)}">
      <div>
        <strong>${escapeHtml(unlocked ? title.name : "未取得的稱號")}</strong>
        <span>${escapeHtml(unlocked ? title.effect : "達成某個結局後解鎖。")}</span>
      </div>
      <em>${escapeHtml(unlocked ? title.ending : "???")}</em>
    </article>
  `;
}

function renderTeamSlot(actorId, index) {
  const actor = actorId ? getCharacterById(actorId) : null;
  return `
    <article class="team-slot${index === teamSlotIndex ? " is-selected" : ""}${actor ? "" : " is-empty"}" data-team-slot="${index}">
      <span class="team-position">${index + 1}</span>
      ${actor ? `<img class="menu-head" src="${escapeHtml(getHeadSource(actor.id))}" alt="${escapeHtml(actor.label)}">` : `<span class="empty-slot"></span>`}
    </article>
  `;
}

function renderCandidate(actor, selected) {
  return `
    <article class="candidate-card${selected ? " is-selected" : ""}" data-team-candidate="${escapeHtml(actor.id)}">
      <img class="menu-head" src="${escapeHtml(getHeadSource(actor.id))}" alt="${escapeHtml(actor.label)}">
      <strong>${escapeHtml(actor.label)}</strong>
    </article>
  `;
}

function getTeamCandidateWindow(candidates) {
  const total = candidates.length;
  const visibleCount = Math.min(TEAM_CANDIDATE_VISIBLE_COUNT, total);
  if (!total || !visibleCount) return { start: 0, end: 0, visible: [] };
  const selected = clampMenuIndex(teamCandidateIndex, total);
  const maxStart = Math.max(0, total - visibleCount);
  const centeredStart = selected - Math.floor(visibleCount / 2);
  const start = Math.min(Math.max(centeredStart, 0), maxStart);
  return {
    start,
    end: start + visibleCount,
    visible: candidates.slice(start, start + visibleCount),
  };
}

function renderTeamMenu() {
  sanitizeTeamSlots();
  const candidates = getTeamCandidates();
  teamSlotIndex = clampMenuIndex(teamSlotIndex, teamSlots.length);
  teamCandidateIndex = clampMenuIndex(teamCandidateIndex, candidates.length);
  const candidateWindow = getTeamCandidateWindow(candidates);
  const candidateBody = candidates.length
    ? candidateWindow.visible.map((actor, offset) =>
      renderCandidate(actor, teamCandidateMode && candidateWindow.start + offset === teamCandidateIndex)
    ).join("")
    : `<div class="menu-empty">尚無可替換角色</div>`;
  const candidateHint = candidates.length > TEAM_CANDIDATE_VISIBLE_COUNT
    ? `
      <div class="candidate-page-hint">
        <span>${candidateWindow.start > 0 ? "▲" : ""}</span>
        <strong>${candidateWindow.start + 1}-${candidateWindow.end} / ${candidates.length}</strong>
        <span>${candidateWindow.end < candidates.length ? "▼" : ""}</span>
      </div>
    `
    : "";
  return `
    <div class="menu-heading">隊伍編成</div>
    <section class="team-menu-layout">
      <div class="team-slots${teamCandidateMode ? "" : " is-active"}">
        ${teamSlots.map((actorId, index) => renderTeamSlot(actorId, index)).join("")}
      </div>
      <div class="candidate-panel">
        ${candidateHint}
        <div class="candidate-list${teamCandidateMode ? " is-active" : " is-locked"}">
          ${candidateBody}
        </div>
      </div>
    </section>
  `;
}

function renderHeadCard(actor, selected, dataName) {
  return `
    <article class="head-card${selected ? " is-selected" : ""}" ${dataName}="${escapeHtml(actor.id)}">
      <img class="menu-head" src="${escapeHtml(getHeadSource(actor.id))}" alt="${escapeHtml(actor.label)}">
    </article>
  `;
}

function handleMenuContentClick(event) {
  const clickable = event.target.closest([
    "[data-menu-screen]",
    "[data-bag-tab]",
    "[data-character-id]",
    "[data-team-slot]",
    "[data-team-candidate]",
    "[data-character-equipment-slot]",
    "[data-character-equip-choice]",
    "[data-equipment-id]",
    "[data-item-id]",
    "[data-title-id]",
  ].join(","));
  if (clickable) playSfx(clickable.matches("[data-bag-tab]") ? "ui_cursor" : "ui_confirm");

  const mainOption = event.target.closest("[data-menu-screen]");
  if (mainOption) {
    const index = MENU_MAIN_ITEMS.findIndex((item) => item.id === mainOption.dataset.menuScreen);
    if (index >= 0) {
      mainMenuIndex = index;
      confirmMainMenuItem();
      renderGameMenu();
    }
    return;
  }

  const bagTab = event.target.closest("[data-bag-tab]");
  if (bagTab) {
    setBagTabIndex(Number(bagTab.dataset.bagTab) || 0);
    bagListActive = false;
    renderGameMenu();
    return;
  }

  const characterCard = event.target.closest("[data-character-id]");
  if (characterCard) {
    const owned = getOwnedCharacters();
    const index = owned.findIndex((actor) => actor.id === characterCard.dataset.characterId);
    if (index >= 0) {
      characterMenuIndex = index;
      selectedCharacterId = owned[index].id;
      characterEquipListOpen = false;
      syncCharacterEquipOptionToCurrentItem();
      menuScreen = "character-detail";
      renderGameMenu();
    }
    return;
  }

  const teamSlot = event.target.closest("[data-team-slot]");
  if (teamSlot) {
    teamSlotIndex = Number(teamSlot.dataset.teamSlot) || 0;
    teamCandidateMode = false;
    renderGameMenu();
    return;
  }

  const candidate = event.target.closest("[data-team-candidate]");
  if (candidate) {
    if (!teamCandidateMode) return;
    const index = getTeamCandidates().findIndex((actor) => actor.id === candidate.dataset.teamCandidate);
    if (index >= 0) {
      teamCandidateIndex = index;
      assignTeamSlotFromCandidate();
      teamCandidateMode = false;
      renderGameMenu();
    }
    return;
  }

  const characterEquipmentSlot = event.target.closest("[data-character-equipment-slot]");
  if (characterEquipmentSlot) {
    const slots = getEquipmentSlots();
    const index = slots.indexOf(characterEquipmentSlot.dataset.characterEquipmentSlot);
    if (index >= 0) {
      characterEquipSlotIndex = index;
      characterEquipListOpen = true;
      syncCharacterEquipOptionToCurrentItem();
      renderGameMenu();
    }
    return;
  }

  const characterEquipChoice = event.target.closest("[data-character-equip-choice]");
  if (characterEquipChoice) {
    const slots = getEquipmentSlots();
    const slot = slots[characterEquipSlotIndex];
    const options = getCharacterEquipOptions(slot);
    const index = options.findIndex((item) => item.id === characterEquipChoice.dataset.characterEquipChoice);
    if (index >= 0) {
      characterEquipOptionIndex = index;
      equipItemToCharacter(selectedCharacterId, slot, options[index].id);
      renderGameMenu();
    }
    return;
  }

  const inventoryItem = event.target.closest("[data-equipment-id]");
  if (inventoryItem) {
    const items = getInventoryEquipmentItems();
    const index = items.findIndex((item) => item.id === inventoryItem.dataset.equipmentId);
    if (index >= 0) {
      equipmentMenuIndex = index;
      bagListActive = true;
      renderGameMenu();
    }
    return;
  }

  const bagItem = event.target.closest("[data-item-id]");
  if (bagItem) {
    const items = getInventoryConsumableItems();
    const index = items.findIndex((item) => item.id === bagItem.dataset.itemId);
    if (index >= 0) {
      equipmentMenuIndex = index;
      bagListActive = true;
      renderGameMenu();
    }
    return;
  }

  const titleCard = event.target.closest("[data-title-id]");
  if (titleCard) {
    const index = PLAYER_TITLES.findIndex((title) => title.id === titleCard.dataset.titleId);
    if (index >= 0) {
      honorTitleIndex = index;
      renderGameMenu();
    }
  }
}

function getCharacterStatus(actor) {
  if (actor.id === "hero") return "主角";
  if (actor.following) return `隊伍 ${actor.followIndex}`;
  if (actor.recruitRetry) return "交涉中";
  return questUnlocked ? "未加入" : "未接觸";
}

function getCharacterStats(actor) {
  const displayActorId = getCharacterMenuDisplayActorId(actor.id);
  const stats = PARTY_STATS[displayActorId] || PARTY_STATS[actor.id] || { power: "-", role: actor.label };
  const progress = getCharacterProgress(actor.id);
  const levelMultiplier = getLevelStatMultiplier(actor.id);
  const recoveryLevelMultiplier = getLevelRecoveryMultiplier(actor.id);
  const popularityMultiplier = getPopularityStatMultiplier(actor.id);
  const maxHp = getCharacterMaxHp(actor.id);
  const currentHp = getCharacterCurrentHp(actor.id);
  const baseHp = getBaseCharacterHp(actor.id);
  const damageMultiplier = getEquipmentDamageMultiplier(actor.id) * getTeamDamagePassiveMultiplier() * getTitleAttackMultiplier() * levelMultiplier * popularityMultiplier;
  const recoveryMultiplier = getMenuRecoveryPassiveMultiplier() * recoveryLevelMultiplier * popularityMultiplier;
  const healMultiplier = recoveryMultiplier * getTitleHealMultiplier();
  const shieldMultiplier = getEquipmentShieldMultiplier(actor.id) * recoveryMultiplier * getTitleShieldMultiplier();
  const physicalAttack = Math.round(150 * damageMultiplier);
  const magicAttack = Math.round(138 * damageMultiplier);
  const shieldEffect = Math.round(110 * shieldMultiplier);
  const healEffect = Math.round(105 * healMultiplier);
  const attackPower = Number(stats.power || 0) * damageMultiplier;
  const hpPower = Math.max(maxHp - baseHp, 0) * 2.4;
  const shieldPower = Number(stats.power || 0) * (shieldMultiplier - 1) * 0.55;
  const power = Math.round(attackPower + hpPower + shieldPower);
  return {
    role: stats.role,
    race: stats.race || "未知",
    level: progress.level,
    exp: progress.exp,
    nextExp: getNextLevelExp(progress.level),
    popularity: progress.popularity,
    popularityBonusPercent: Math.round((popularityMultiplier - 1) * 100),
    hp: `${currentHp}/${maxHp}`,
    currentHp,
    maxHp,
    physicalAttack,
    magicAttack,
    shieldEffect,
    healEffect,
    power,
  };
}

function getTeamDamagePassiveMultiplier() {
  return isActorInTeam("npc3") ? 1.1 : 1;
}

function getMenuRecoveryPassiveMultiplier() {
  return isActorInTeam("npc1") ? 1.1 : 1;
}

function isActorInTeam(actorId) {
  return teamSlots.includes(actorId) && getOwnedCharacters().some((actor) => actor.id === actorId);
}

function getOwnedCharacters() {
  if (isChapter4XiaoRescuePartyActive()) {
    return CHAPTER4_RESCUE_PARTY_IDS.map(getCharacterById).filter(Boolean);
  }
  if (isChapter5TournamentRosterUnlocked()) {
    return getChapter5TournamentRosterActors();
  }
  return MENU_CHARACTER_IDS.map(getCharacterById).filter((actor) => actor && (actor.id === "hero" || actor.following));
}

function getCharacterById(id) {
  if (id === "hero") return player;
  return npcs.find((npc) => npc.id === id) || null;
}

function getHeadSource(actorId) {
  return HEAD_SOURCES[getCharacterMenuDisplayActorId(actorId)] || HEAD_SOURCES[actorId] || HEAD_SOURCES.hero;
}

function getCharacterMenuDisplayActorId(actorId) {
  if (actorId === "hero" && chapter4State?.transformed) return "npc29";
  return actorId;
}

function getEquipmentSlots() {
  return Object.keys(EQUIPMENT_OPTIONS);
}

function getAllEquipmentCatalogItems() {
  return Object.entries(EQUIPMENT_OPTIONS).flatMap(([slot, items]) =>
    items
      .filter((item) => !BASIC_EQUIPMENT_IDS.has(item.id))
      .map((item) => ({ ...item, slot }))
  );
}

function getInventoryEquipmentItems() {
  return getAllEquipmentCatalogItems().filter((item) => isEquipmentItemOwned(item.id));
}

function isEquipmentItemOwned(itemId) {
  if (!itemId || BASIC_EQUIPMENT_IDS.has(itemId)) return false;
  return Math.max(0, Number(ownedShopItemCounts[itemId]) || 0) > 0
    || Boolean(getEquipmentOwner(itemId))
    || Boolean(CHAPTER2_REQUIRED_EQUIPMENT.includes(itemId) && chapter2State.equipment?.[itemId]);
}

function getEquippedItem(slot, actorId = "hero") {
  const equipment = characterEquipment[actorId] || DEFAULT_EQUIPMENT_BY_SLOT;
  return EQUIPMENT_OPTIONS[slot].find((item) => item.id === equipment[slot]) || EQUIPMENT_OPTIONS[slot][0];
}

function renderEquipmentIcon(item, slot) {
  if (item?.id === DEFAULT_EQUIPMENT_BY_SLOT[slot]) {
    const src = EMPTY_EQUIPMENT_ICONS[slot];
    return `<span class="equipment-icon" role="img" aria-label="${escapeHtml(item?.name || EQUIPMENT_SLOT_LABELS[slot] || slot)}" style="background-image: url('${escapeHtml(src)}')"></span>`;
  }

  if (typeof item?.icon === "string") {
    return `<span class="equipment-icon" role="img" aria-label="${escapeHtml(item?.name || EQUIPMENT_SLOT_LABELS[slot] || slot)}" style="background-image: url('${escapeHtml(item.icon)}')"></span>`;
  }

  const sheet = EQUIPMENT_SHEETS[slot];
  const frame = item?.icon || { col: 0, row: 0 };
  if (!sheet) return `<span class="equipment-icon"></span>`;
  const sourceX = frame.col * sheet.stepX + sheet.inset;
  const sourceY = frame.row * sheet.stepY + sheet.inset;
  const sourceWidth = sheet.cellWidth - sheet.inset * 2;
  const sourceHeight = sheet.cellHeight - sheet.inset * 2;
  const iconSize = 42;
  const scaleX = iconSize / sourceWidth;
  const scaleY = iconSize / sourceHeight;
  const style = [
    `background-image: url('${sheet.src}')`,
    `background-size: ${Math.round(sheet.width * scaleX)}px ${Math.round(sheet.height * scaleY)}px`,
    `background-position: -${Math.round(sourceX * scaleX)}px -${Math.round(sourceY * scaleY)}px`,
  ].join("; ");
  return `<span class="equipment-icon" role="img" aria-label="${escapeHtml(item?.name || EQUIPMENT_SLOT_LABELS[slot] || slot)}" style="${escapeHtml(style)}"></span>`;
}

function getEquippedItems(actorId = "hero") {
  return getEquipmentSlots().map((slot) => getEquippedItem(slot, actorId));
}

function getCharacterEquipOptions(slot) {
  return (EQUIPMENT_OPTIONS[slot] || []).filter((item) =>
    BASIC_EQUIPMENT_IDS.has(item.id) || isEquipmentItemOwned(item.id)
  );
}

function getHeroMaxHp() {
  return getCharacterMaxHp("hero");
}

function getBaseCharacterHp(actorId) {
  const baseHp = actorId === "hero" ? 1280 : 920;
  return baseHp + (getCharacterLevel(actorId) - 1) * LEVEL_HP_GROWTH;
}

function getCharacterMaxHp(actorId) {
  const baseAndEquipmentHp = getBaseCharacterHp(actorId) + getEquippedItems(actorId).reduce((total, item) => total + item.hpBonus, 0);
  return Math.max(1, Math.round(baseAndEquipmentHp * getPopularityStatMultiplier(actorId) * getTitleAllMultiplier()));
}

function getCharacterCurrentHp(actorId) {
  const progress = getCharacterProgress(actorId);
  const maxHp = getCharacterMaxHp(actorId);
  if (!Number.isFinite(progress.currentHp)) {
    progress.currentHp = maxHp;
  }
  progress.currentHp = clamp(Math.round(progress.currentHp), 0, maxHp);
  return progress.currentHp;
}

function setCharacterCurrentHp(actorId, hp) {
  const progress = getCharacterProgress(actorId);
  progress.currentHp = clamp(Math.round(hp), 0, getCharacterMaxHp(actorId));
  saveGame();
}

function getCharacterProgress(actorId) {
  if (!characterProgress[actorId]) characterProgress[actorId] = createDefaultCharacterProgress();
  if (!Number.isFinite(characterProgress[actorId].level)) characterProgress[actorId].level = 1;
  if (!Number.isFinite(characterProgress[actorId].exp)) characterProgress[actorId].exp = 0;
  if (!Number.isFinite(characterProgress[actorId].popularity)) characterProgress[actorId].popularity = 0;
  if (!("currentHp" in characterProgress[actorId])) characterProgress[actorId].currentHp = null;
  return characterProgress[actorId];
}

function createDefaultCharacterProgress() {
  return { level: 1, exp: 0, currentHp: null, popularity: 0 };
}

function createDefaultTitleUnlocks() {
  return Object.fromEntries(PLAYER_TITLES.map((title) => [title.id, false]));
}

function createDefaultStaleDumplingState() {
  return { signature: "", count: 0 };
}

function normalizeStaleDumplingState(value) {
  return {
    ...createDefaultStaleDumplingState(),
    ...(value && typeof value === "object" ? value : {}),
    count: Math.max(0, Number(value?.count) || 0),
  };
}

function normalizeBattleHelpState(value) {
  return {
    ...createDefaultBattleHelpState(),
    ...(value && typeof value === "object" ? value : {}),
  };
}

function normalizeTitleUnlocks(value) {
  return {
    ...createDefaultTitleUnlocks(),
    ...(value && typeof value === "object" ? value : {}),
  };
}

function hasUnlockedTitle(titleId) {
  return Boolean(unlockedTitles?.[titleId]);
}

function unlockPlayerTitle(titleId) {
  const title = PLAYER_TITLES.find((entry) => entry.id === titleId);
  if (!title) return false;
  if (hasUnlockedTitle(titleId)) return false;
  unlockedTitles = normalizeTitleUnlocks(unlockedTitles);
  unlockedTitles[titleId] = true;
  addTitleUnlockNotice(title);
  return true;
}

function getTitleMultiplier(type) {
  return PLAYER_TITLES
    .filter((title) => title.type === type && hasUnlockedTitle(title.id))
    .reduce((multiplier, title) => multiplier * (title.multiplier || 1), 1);
}

function getTitleAllMultiplier() {
  return getTitleMultiplier("all");
}

function getTitleAttackMultiplier() {
  return getTitleMultiplier("attack") * getTitleAllMultiplier();
}

function getTitleHealMultiplier() {
  return getTitleMultiplier("heal") * getTitleAllMultiplier();
}

function getTitleShieldMultiplier() {
  return getTitleMultiplier("shield") * getTitleAllMultiplier();
}

function getCharacterLevel(actorId) {
  return getCharacterProgress(actorId).level;
}

function getNextLevelExp(level) {
  return Math.round(LEVEL_CURVE_BASE * Math.pow(level, 1.35));
}

function getLevelStatMultiplier(actorId) {
  return 1 + (getCharacterLevel(actorId) - 1) * LEVEL_ATTACK_GROWTH;
}

function getLevelRecoveryMultiplier(actorId) {
  return 1 + (getCharacterLevel(actorId) - 1) * LEVEL_RECOVERY_GROWTH;
}

function getCharacterPopularity(actorId) {
  return Math.max(0, Math.round(getCharacterProgress(actorId).popularity || 0));
}

function getPopularityStatMultiplier(actorId) {
  return 1 + (getCharacterPopularity(actorId) / POPULARITY_STAT_STEP) * POPULARITY_STAT_GROWTH;
}

function addCharacterPopularity(actorId, amount) {
  const gained = Math.max(0, Math.round(Number(amount) || 0));
  if (!gained) return;
  const oldMaxHp = getCharacterMaxHp(actorId);
  const progress = getCharacterProgress(actorId);
  const wasFullHp = !Number.isFinite(progress.currentHp) || progress.currentHp >= oldMaxHp;
  progress.popularity += gained;
  const newMaxHp = getCharacterMaxHp(actorId);
  if (wasFullHp) {
    progress.currentHp = newMaxHp;
  } else {
    progress.currentHp = clamp(Math.round(progress.currentHp), 0, newMaxHp);
  }
}

function grantCharacterPopularity(actorIds, amount) {
  actorIds.forEach((actorId) => {
    if (characterProgress[actorId]) addCharacterPopularity(actorId, amount);
  });
}

function getEquipmentDamageMultiplier(actorId = "hero") {
  return 1 + getEquippedItems(actorId).reduce((total, item) => total + item.attackBonus, 0);
}

function getEquipmentShieldMultiplier(actorId = "hero") {
  return 1 + getEquippedItems(actorId).reduce((total, item) => total + item.shieldBonus, 0);
}

function isStackableEquipmentItem(itemId) {
  return STACKABLE_EQUIPMENT_IDS.has(itemId);
}

function getEquipmentOwnerIds(itemId) {
  if (!itemId || BASIC_EQUIPMENT_IDS.has(itemId)) return [];
  return MENU_CHARACTER_IDS.filter((actorId) => {
    const equipment = characterEquipment[actorId];
    return equipment && Object.values(equipment).includes(itemId);
  });
}

function getEquippedEquipmentCount(itemId) {
  return getEquipmentOwnerIds(itemId).length;
}

function getStackableEquipmentOwnedCount(itemId) {
  return Math.max(0, Number(ownedShopItemCounts[itemId]) || 0, getEquippedEquipmentCount(itemId));
}

function getEquipmentSlotForOwner(actorId, itemId) {
  const equipment = characterEquipment[actorId];
  if (!equipment) return null;
  return Object.keys(equipment).find((slot) => equipment[slot] === itemId) || null;
}

function getEquipmentOwner(itemId) {
  return getEquipmentOwnerIds(itemId)[0] || null;
}

function equipItemToCharacter(actorId, slot, itemId) {
  if (!getOwnedCharacters().some((actor) => actor.id === actorId)) return;
  if (!getCharacterEquipOptions(slot).some((item) => item.id === itemId)) return;

  if (!BASIC_EQUIPMENT_IDS.has(itemId)) {
    const ownerIds = getEquipmentOwnerIds(itemId).filter((ownerId) => ownerId !== actorId);
    const ownedCount = isStackableEquipmentItem(itemId) ? getStackableEquipmentOwnedCount(itemId) : 1;
    if (ownerIds.length >= ownedCount) {
      const oldOwnerId = ownerIds[0];
      const ownerSlot = getEquipmentSlotForOwner(oldOwnerId, itemId) || slot;
      characterEquipment[oldOwnerId][ownerSlot] = DEFAULT_EQUIPMENT_BY_SLOT[ownerSlot];
    }
  }

  characterEquipment[actorId][slot] = itemId;
  syncCharacterEquipOptionToCurrentItem();
  syncChapter2EquipmentFromInventory();
  saveGame();
}

function syncCharacterEquipOptionToCurrentItem() {
  const slots = getEquipmentSlots();
  characterEquipSlotIndex = clampMenuIndex(characterEquipSlotIndex, slots.length);
  const slot = slots[characterEquipSlotIndex];
  const options = getCharacterEquipOptions(slot);
  const equippedId = characterEquipment[selectedCharacterId]?.[slot] || DEFAULT_EQUIPMENT_BY_SLOT[slot];
  const index = options.findIndex((item) => item.id === equippedId);
  characterEquipOptionIndex = index >= 0 ? index : 0;
}

function getTeamCandidates() {
  return getOwnedCharacters();
}

function canReplaceHeroInTeam() {
  return isChapter5TournamentRosterUnlocked();
}

function assignTeamSlotFromCandidate() {
  const candidate = getTeamCandidates()[teamCandidateIndex];
  if (!candidate) return;

  const oldSlot = teamSlots.indexOf(candidate.id);
  const replacedId = teamSlots[teamSlotIndex];
  if (oldSlot === teamSlotIndex) return;
  if (replacedId === "hero" && oldSlot < 0 && !canReplaceHeroInTeam()) return;

  if (oldSlot >= 0) teamSlots[oldSlot] = replacedId || null;
  teamSlots[teamSlotIndex] = candidate.id;
  sanitizeTeamSlots();
  syncFollowIndexesFromTeamSlots();
}

function syncChapter5TournamentRosterFollowers() {
  if (!isChapter5TournamentRosterUnlocked()) return;
  const activeIds = new Set(teamSlots.filter(Boolean));
  const road = getCurrentRoad();
  getChapter5TournamentRosterActors().forEach((actor) => {
    if (actor.id === "hero") return;
    const isActive = activeIds.has(actor.id);
    actor.following = isActive;
    actor.followIndex = 0;
    if (isActive) {
      const slotIndex = Math.max(1, teamSlots.indexOf(actor.id));
      actor.hidden = false;
      actor.layingDown = false;
      actor.staticNpc = false;
      actor.fixedPlacement = false;
      if ((actor.mapId ?? 99) !== currentMapIndex) {
        actor.mapId = currentMapIndex;
        actor.x = clamp(player.x - 58 - slotIndex * 42, road.left + 18, road.right - 18);
        actor.y = clamp(player.y + (slotIndex % 2 ? 18 : -18), road.top + 18, road.bottom - 18);
        actor.direction = player.direction || "right";
        actor.idleDirection = actor.direction;
      }
    } else if ((actor.mapId ?? 99) === currentMapIndex) {
      actor.mapId = 99;
      actor.staticNpc = true;
      actor.fixedPlacement = true;
      actor.walkTime = 0;
    }
    seedTrail(actor);
  });
}

function sanitizeTeamSlots() {
  enforceChapter4CaptivePartyOffscreen();
  enforceChapter4KinkoUnavailable();
  if (isChapter4XiaoRescuePartyActive()) {
    teamSlots.splice(0, teamSlots.length, ...CHAPTER4_RESCUE_PARTY_IDS);
    syncFollowIndexesFromTeamSlots();
    return;
  }
  const blockedIds = new Set();
  if (isChapter4CaptivePartyOffscreen()) {
    CHAPTER4_CAPTIVE_PARTY_IDS.forEach((actorId) => blockedIds.add(actorId));
  }
  if (isChapter4KinkoUnavailable()) blockedIds.add("npc3");
  const ownedIds = new Set(
    getOwnedCharacters()
      .map((actor) => actor.id)
      .filter((actorId) => !blockedIds.has(actorId))
  );
  const seen = new Set();
  for (let i = 0; i < teamSlots.length; i += 1) {
    const actorId = teamSlots[i];
    if (!actorId || !ownedIds.has(actorId) || seen.has(actorId)) {
      teamSlots[i] = null;
    } else {
      seen.add(actorId);
    }
  }

  if (!seen.has("hero") && !canReplaceHeroInTeam()) {
    const emptyIndex = teamSlots.findIndex((id) => !id);
    if (emptyIndex >= 0) {
      teamSlots[emptyIndex] = "hero";
    } else {
      teamSlots[0] = "hero";
    }
    seen.add("hero");
  }

  for (const actor of getOwnedCharacters()) {
    if (blockedIds.has(actor.id)) continue;
    if (seen.has(actor.id)) continue;
    const emptyIndex = teamSlots.findIndex((id) => !id);
    if (emptyIndex === -1) break;
    teamSlots[emptyIndex] = actor.id;
    seen.add(actor.id);
  }
  syncChapter5TournamentRosterFollowers();
  syncFollowIndexesFromTeamSlots();
}

function getOrderedFollowers() {
  sanitizeTeamSlots();
  const assigned = teamSlots
    .map(getCharacterById)
    .filter((actor) => actor?.following && !shouldExcludeFromFollowerOrder(actor));
  const assignedIds = new Set(assigned.map((actor) => actor.id));
  const followerPool = [...vtNpcs, questNpc, hotelOtakuNpc, ...extraNpcs];
  const unassigned = followerPool.filter((npc) =>
    npc.following && !assignedIds.has(npc.id) && !shouldExcludeFromFollowerOrder(npc)
  );
  return [...assigned, ...unassigned];
}

function syncFollowIndexesFromTeamSlots() {
  const ordered = teamSlots.map(getCharacterById).filter((actor) => actor?.following);
  ordered.forEach((npc, index) => {
    npc.followIndex = index + 1;
  });
}

function addCharacterToTeam(actorId, options = {}) {
  const alreadyInTeam = teamSlots.includes(actorId);
  if (teamSlots.includes(actorId)) {
    syncFollowIndexesFromTeamSlots();
    return;
  }
  const emptyIndex = teamSlots.findIndex((id) => !id);
  if (emptyIndex !== -1) teamSlots[emptyIndex] = actorId;
  syncFollowIndexesFromTeamSlots();
  if (!alreadyInTeam && options.announce) {
    announcePartyChange(actorId, options.label || "加入隊伍", options.color || "#8ff5ff");
  }
}

function announcePartyChange(actorId, label, color = "#8ff5ff") {
  const actor = getCharacterById(actorId);
  if (!actor || actor.hidden) return;
  const isVisible = actor.following || (actor.mapId ?? 0) === currentMapIndex;
  if (!isVisible) return;
  addWorldFloatingText(actor.x, actor.y - 112, `${actor.label} ${label}`, color, { life: 2.4, riseSpeed: 18 });
}

function formatEquipmentEffect(item) {
  const parts = [];
  if (item.attackBonus) parts.push(`攻擊 ${formatSignedPercent(item.attackBonus)}`);
  if (item.hpBonus) parts.push(`HP ${formatSignedNumber(item.hpBonus)}`);
  if (item.shieldBonus) parts.push(`護盾 ${formatSignedPercent(item.shieldBonus)}`);
  if (item.effectText) parts.push(item.effectText);
  return parts.length ? parts.join(" / ") : "沒有加成";
}

function formatMultiplier(value) {
  return `${Math.round(value * 100)}%`;
}

function formatSignedPercent(value) {
  return `${value > 0 ? "+" : ""}${Math.round(value * 100)}%`;
}

function formatSignedNumber(value) {
  return `${value > 0 ? "+" : ""}${value}`;
}

function wrapIndex(index, length) {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

function moveGridIndex(index, code, length, columns) {
  if (length <= 0) return 0;
  const safeColumns = Math.max(1, Math.floor(Number(columns) || 1));
  const current = clampMenuIndex(index, length);
  const row = Math.floor(current / safeColumns);
  const col = current % safeColumns;
  const rowStart = row * safeColumns;
  const rowEnd = Math.min(rowStart + safeColumns - 1, length - 1);
  const rowCount = Math.ceil(length / safeColumns);

  if (code === "ArrowLeft") return current <= rowStart ? rowEnd : current - 1;
  if (code === "ArrowRight") return current >= rowEnd ? rowStart : current + 1;
  if (code !== "ArrowUp" && code !== "ArrowDown") return current;

  const nextRow = code === "ArrowDown"
    ? (row + 1) % rowCount
    : (row - 1 + rowCount) % rowCount;
  const nextRowStart = nextRow * safeColumns;
  const nextRowEnd = Math.min(nextRowStart + safeColumns - 1, length - 1);
  return Math.min(nextRowStart + col, nextRowEnd);
}

function clampMenuIndex(index, length) {
  if (length <= 0) return 0;
  return clamp(index, 0, length - 1);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  }[char]));
}

const SAVE_KEY = "kissworld-save-v1";

function saveGame() {
  if (!saveEnabled || appMode !== APP_MODE.PLAYING || openingCutscene || restCutscene || chapterCompleteTransition || sceneFade || transformCutscene || streamState?.active) return;
  try {
    const npcState = Object.fromEntries(npcs.map((npc) => [npc.id, {
      x: npc.x,
      y: npc.y,
      direction: npc.direction,
      following: npc.following,
      followIndex: npc.followIndex,
      recruitRetry: Boolean(npc.recruitRetry),
      mapId: npc.mapId ?? 0,
    }]));
    const payload = {
      currentMapIndex,
      shellFee,
      ownedShopItemCounts,
      currentDay,
      player: { x: player.x, y: player.y, direction: player.direction },
      questState,
      questUnlocked,
      questNpcDefeated,
      chapter2State,
      chapter3State,
      chapter4State,
      chapter5State,
      battleTutorialSeen,
      battleAutoEnabled,
      unlockedTitles,
      staleDumplingState,
      battleHelpState,
      collected,
      characterProgress,
      characterEquipment,
      teamSlots,
      ownedItems,
      npcState,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn("Save failed", error);
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const payload = JSON.parse(raw);
    currentMapIndex = clamp(Number(payload.currentMapIndex) || 0, 0, MAP_COUNT - 1);
    shellFee = Math.max(0, Number(payload.shellFee) || 0);
    ownedShopItemCounts = normalizeShopItemCounts(payload.ownedShopItemCounts);
    currentDay = Math.max(1, Number(payload.currentDay) || 1);
    questState = payload.questState || questState;
    questUnlocked = Boolean(payload.questUnlocked);
    questNpcDefeated = Boolean(payload.questNpcDefeated);
    chapter2State = {
      ...createDefaultChapter2State(),
      ...(payload.chapter2State || {}),
      equipment: {
        ...createDefaultChapter2State().equipment,
        ...(payload.chapter2State?.equipment || {}),
      },
    };
    unlockedTitles = normalizeTitleUnlocks(payload.unlockedTitles);
    staleDumplingState = normalizeStaleDumplingState(payload.staleDumplingState);
    battleHelpState = normalizeBattleHelpState(payload.battleHelpState);
    const defaultChapter3State = createDefaultChapter3State();
    chapter3State = {
      ...defaultChapter3State,
      ...(payload.chapter3State || {}),
      fatDumbDaily: {
        ...defaultChapter3State.fatDumbDaily,
        ...(payload.chapter3State?.fatDumbDaily || {}),
      },
      pigDate: {
        ...defaultChapter3State.pigDate,
        ...(payload.chapter3State?.pigDate || {}),
      },
      bebeCollab: {
        ...defaultChapter3State.bebeCollab,
        ...(payload.chapter3State?.bebeCollab || {}),
      },
    };
    chapter3State.streamAssistLevel = clamp(Number(chapter3State.streamAssistLevel) || 0, 0, STREAM_CHAT_ASSIST_MAX);
    normalizeChapter3DailyState();
    chapter4State = {
      ...createDefaultChapter4State(),
      ...(payload.chapter4State || {}),
    };
    chapter5State = {
      ...createDefaultChapter5State(),
      ...(payload.chapter5State || {}),
    };
    battleTutorialSeen = Boolean(payload.battleTutorialSeen);
    battleAutoEnabled = Boolean(payload.battleAutoEnabled);
    battleAutoTimer = 0;
    normalizeChapter4State();
    normalizeChapter5State();
    if (chapter2State.completed && chapter3State.phase === "locked") {
      chapter3State.phase = "need_rest";
    }
    if (chapter3State.completed && chapter4State.phase === "locked") {
      chapter4State.phase = "need_rest";
    }
    collected = Number(payload.collected) || collected;
    ownedItems = normalizeItemCounts(payload.ownedItems);
    if (payload.player) {
      player.x = Number(payload.player.x) || player.x;
      player.y = Number(payload.player.y) || player.y;
      player.direction = payload.player.direction || player.direction;
    }
    Object.entries(payload.characterProgress || {}).forEach(([id, progress]) => {
      characterProgress[id] = { ...getCharacterProgress(id), ...progress };
    });
    Object.entries(payload.characterEquipment || {}).forEach(([id, equipment]) => {
      characterEquipment[id] = { ...DEFAULT_EQUIPMENT_BY_SLOT, ...equipment };
    });
    syncChapter2EquipmentFromInventory();
    (payload.teamSlots || []).forEach((id, index) => {
      if (index < teamSlots.length) teamSlots[index] = id || null;
    });
    Object.entries(payload.npcState || {}).forEach(([id, state]) => {
      const npc = getCharacterById(id);
      if (!npc || npc === player) return;
      if (npc.fixedPlacement) return;
      npc.x = Number(state.x) || npc.x;
      npc.y = Number(state.y) || npc.y;
      npc.direction = state.direction || npc.direction;
      npc.following = Boolean(state.following);
      npc.followIndex = Number(state.followIndex) || 0;
      npc.recruitRetry = Boolean(state.recruitRetry);
      npc.mapId = Number.isFinite(Number(state.mapId)) ? Number(state.mapId) : (npc.mapId ?? 0);
    });
    sanitizeTeamSlots();
    restoreChapter2WorldState();
    [player, ...npcs].forEach(seedTrail);
    updateCamera();
    saveEnabled = true;
  } catch (error) {
    console.warn("Load failed", error);
  }
}

function restoreChapter2WorldState() {
  smokerDeparture = null;
  fatDumbDeparture = null;
  kidneyDeparture = null;
  kinkoExDeparture = null;
  restoreChapter2MobWorldState();
  if (isChapter2Started()) {
    xiaoDeparture = null;
    questNpc.mapId = 9;
    questNpc.x = XIAO_XD_POSITION.x;
    questNpc.y = XIAO_XD_POSITION.y;
    questNpc.direction = XIAO_XD_POSITION.direction;
    questNpc.idleDirection = XIAO_XD_POSITION.direction;
    questNpc.staticNpc = true;
    questNpc.fixedPlacement = true;
  }

  if (chapter2State.smokersCleared) {
    ["npc12", "npc36"].forEach((id) => {
      const npc = getCharacterById(id);
      if (npc) npc.mapId = 99;
    });
  }
  restoreChapter3WorldState();
  restoreChapter4WorldState();
  restoreChapter5WorldState();
}

function restoreChapter2MobWorldState() {
  const shouldShowMobs = isChapter2Started();
  chapter2MobNpcs.forEach((mob) => {
    const wasVisible = (mob.mapId ?? 0) === 1;
    mob.mapId = shouldShowMobs ? 1 : 99;
    if (!shouldShowMobs) return;
    if (!wasVisible) {
      if (Number.isFinite(mob.homeX)) mob.x = mob.homeX;
      if (Number.isFinite(mob.homeY)) mob.y = mob.homeY;
      mob.direction = mob.homeDirection || mob.direction || "right";
    }
    mob.idleDirection = mob.direction;
    mob.staticNpc = false;
    mob.fixedPlacement = false;
    mob.layingDown = false;
    seedTrail(mob);
  });
}

function restoreChapter3WorldState() {
  normalizeChapter3DailyState();
  const kidney = getCharacterById("npc14");
  if (kidney) {
    kidney.mapId = chapter3State.fluteUsed ? 99 : 2;
    kidney.x = CHAPTER3_KIDNEY_POSITION.x;
    kidney.y = CHAPTER3_KIDNEY_POSITION.y;
    kidney.staticNpc = true;
    kidney.fixedPlacement = true;
    kidney.layingDown = !chapter3State.fluteUsed;
    kidney.direction = CHAPTER3_KIDNEY_POSITION.direction;
    kidney.idleDirection = CHAPTER3_KIDNEY_POSITION.direction;
  }

  if (!isChapter3Started()) return;

  if (["find_members", "ready_report", "ready_stream", "completed"].includes(chapter3State.phase)) {
    placeStaticActor(questNpc, 7, CHAPTER3_XIAO_ROOM_POSITION, { layingDown: false });
  }

  if (["ask_xiao", "find_members", "ready_report"].includes(chapter3State.phase)) {
    hideMissingChapter3Members();
  }
  if (chapter3State.phase === "find_members" || chapter3State.phase === "ready_report") {
    placeChapter3SearchActors();
  }
  if (chapter3State.phase === "ready_stream" || chapter3State.phase === "completed") {
    placeChapter3PartyAtRoom();
  }
  placeFatDumbDailyNpc();
  applyDailyActivityActorStates();
  refreshChapter3Progress();
}

function restoreChapter4WorldState() {
  normalizeChapter4State();
  applyChapter4HeroForm();
  chapter4CutsceneMove = null;
  chapter4AlarmFlash = null;
  chapter4KinkoHitSequence = null;
  chapter4ImpactSlashes.length = 0;
  player.hidden = false;
  if (!isChapter4Started()) {
    kinkoExNpc.mapId = 99;
    hideChapter4BaseEnemies();
    kinkoExDeparture = null;
    return;
  }

  if (["need_rest", "ask_xiao", "grow_popularity", "target_reached_rest"].includes(chapter4State.phase)) {
    returnChapter4AllVts();
    placeXiaoAtXdOffice();
  }

  if (["vt_missing", "confront_ex", "post_ex_xd"].includes(chapter4State.phase)) {
    placeChapter4VtsInXd();
  }

  if (chapter4State.phase === "vt_missing") {
    placeXiaoAtXdOffice();
  }

  if (chapter4State.phase === "vt_missing" || chapter4State.phase === "confront_ex") {
    placeChapter4ExAtDoor();
  } else {
    kinkoExNpc.mapId = 99;
  }

  if (chapter4State.phase === "confront_ex") {
    startChapter4XiaoFollowing(false);
  }

  if (chapter4State.phase === "stream_two_vts" || chapter4State.phase === "post_kinko_stream_rest") {
    hideChapter4Kinko();
    returnChapter4RemainingVts();
    questNpc.mapId = 99;
    questNpc.following = false;
    questNpc.staticNpc = true;
    questNpc.fixedPlacement = true;
  }

  if (chapter4State.phase === "need_c22" || chapter4State.phase === "got_c22") {
    hideChapter4Kinko();
    returnChapter4RemainingVts();
    placeXiaoAtXdOffice();
  }

  if (chapter4State.phase === "base_entry") {
    hideChapter4Kinko();
    returnChapter4RemainingVts();
    questNpc.mapId = 99;
    if (chapter4State.transformed) {
      hotelOtakuNpc.following = true;
      hotelOtakuNpc.staticNpc = false;
      hotelOtakuNpc.fixedPlacement = false;
      addCharacterToTeam("hotel_otaku");
    }
    hideChapter4BaseEnemies();
  }

  if (chapter4State.phase === "base_infiltration") {
    hideChapter4Kinko();
    returnChapter4RemainingVts();
    questNpc.mapId = 99;
    if (chapter4State.baseEncounterDone) {
      placeChapter4BaseEnemies();
    } else {
      placeChapter4BaseMonkeyOnly();
    }
  }

  if (chapter4State.phase === "base_captive") {
    placeChapter4CapturedParty();
  }

  if (chapter4State.phase === "rescue_flashback") {
    prepareChapter4XiaoRescueScene();
    return;
  }

  if (chapter4State.phase === "base_rescue") {
    if (currentMapIndex === 10 && chapter4State.rescuePartyJoined) {
      prepareChapter4RescueBaseScene();
      return;
    }
    prepareChapter4RescueGateScene(true);
    return;
  }

  if (chapter4State.phase === "base_rescue_victory") {
    if (currentMapIndex === 11 && chapter4State.rescueCellEntered) {
      placeChapter4RescueCellScene();
      return;
    }
    currentMapIndex = 10;
    prepareChapter4RescueVictoryScene();
    return;
  }

  if (["rescue_cell_found", "rescue_cell_check", "rescue_cell_finale"].includes(chapter4State.phase)) {
    placeChapter4RescueCellScene();
    return;
  }

  if (chapter4State.phase === "completed" && chapter4State.rescueFinaleDone) {
    prepareChapter4PostRescueScene();
    return;
  }

  if (chapter4State.phase === "rescue_finale") {
    hideChapter4BaseEnemies();
  }
}

function buildPlayerSkillPool(party) {
  return party.flatMap((member) =>
    (PLAYER_SKILLS_BY_ACTOR[getBattleSkillActorKey(member.key)] || []).map((skill, index) => ({
      ...skill,
      type: skill.type === "stun" && member.key !== "hero" ? "debuff" : skill.type,
      owner: member.key === "hero" && chapter4State.transformed ? "九尾親親獸" : member.name,
      side: "player",
      unitId: member.key,
      unique: isUniqueSkillIndex(index, skill),
    }))
  );
}

function getBattleSkillActorKey(actorId) {
  if (actorId === "hero" && chapter4State.transformed) return "npc29";
  return actorId;
}

function buildEnemySkillPool(skills, unitId, owner) {
  return skills.map((skill, index) => ({
    ...skill,
    type: skill.type === "stun" ? "debuff" : skill.type,
    side: "enemy",
    unitId,
    owner,
    unique: isUniqueSkillIndex(index, skill),
  }));
}

function getBattleEnemyConfigs(config) {
  if (Array.isArray(config.enemies) && config.enemies.length) {
    return config.enemies.map((enemy, index) => ({
      enemyActor: enemy.enemyActor || null,
      enemyName: enemy.enemyName || enemy.enemyActor?.label || `敵人${index + 1}`,
      enemyUnitId: enemy.enemyUnitId || enemy.enemyActor?.id || `enemy_${index}`,
      enemySkills: enemy.enemySkills || config.enemySkills || [],
      enemyMaxHp: enemy.enemyMaxHp || config.enemyMaxHp,
      targetOffsetX: enemy.targetOffsetX,
      targetOffsetY: enemy.targetOffsetY,
    }));
  }

  return [{
    enemyActor: config.enemyActor || null,
    enemyName: config.enemyName,
    enemyUnitId: config.enemyUnitId,
    enemySkills: config.enemySkills || [],
    enemyMaxHp: config.enemyMaxHp,
  }];
}

function refreshActiveSkillPool() {
  if (!battleState) return;
  if (instantKillToggleEl?.checked && battleState.playerSkills.some((skill) => isUnitAlive("player", skill.unitId))) {
    battleState.skillPool = battleState.playerSkills;
    return;
  }
  battleState.skillPool = [...battleState.playerSkills, ...battleState.enemySkills];
}

function buildRecruitEnemySkills(npc) {
  const ownSkills = (PLAYER_SKILLS_BY_ACTOR[npc.id] || []).map((skill) => ({
    ...skill,
    id: `enemy_${skill.id}`,
    owner: npc.label,
  }));
  return [
    ...ownSkills,
    { id: `${npc.id}_panic`, owner: npc.label, name: "反抗", type: "physical" },
    { id: `${npc.id}_keepaway`, owner: npc.label, name: "保持距離", type: "guard" },
  ];
}

function createBattleUnits(config) {
  const cameraX = calculateBattleCameraX(config);
  const playerBaseX = cameraX + 310;
  const enemyBaseX = cameraX + 960;
  const baseY = 650;
  const units = config.party.map((member, index) => {
    const defaultMaxHp = getCharacterMaxHp(member.key);
    const maxHp = Math.max(1, Math.round(member.battleMaxHp || defaultMaxHp));
    const currentHp = Number.isFinite(member.battleCurrentHp)
      ? member.battleCurrentHp
      : getCharacterCurrentHp(member.key);
    return {
      id: member.key,
      side: "player",
      label: member.name,
      actor: member.actor,
      maxHp,
      hp: clamp(Math.round(currentHp), 0, maxHp),
      shield: 0,
      boosted: false,
      debuffed: false,
      stunned: false,
      invincible: false,
      invincibleConsumed: false,
      taunted: false,
      tauntConsumed: false,
      sleeping: false,
      sleepTurns: 0,
      dreaming: false,
      dreamTurns: 0,
      nightmared: false,
      nightmareTurns: 0,
      charmed: false,
      charmTurns: 0,
      frozen: false,
      freezeTurns: 0,
      reflecting: false,
      reflectTurns: 0,
      burning: false,
      burnTurns: 0,
      burnDamageRatio: 0,
      stunConsumed: false,
      targetX: playerBaseX - index * BATTLE_PLAYER_SPACING_X,
      targetY: baseY - index * BATTLE_PLAYER_SPACING_Y,
      actionTimer: 0,
      hitTimer: 0,
      uniqueGlowDelay: 0,
      uniqueGlowTimer: 0,
      ready: false,
    };
  });

  const enemies = getBattleEnemyConfigs(config);
  const ySpread = enemies.length > 1 ? BATTLE_ENEMY_SPACING_Y : 0;
  enemies.forEach((enemy, index) => {
    const enemyMaxHp = enemy.enemyMaxHp || (config.mode === "boss" ? 3600 : 960);
    const centeredIndex = index - (enemies.length - 1) / 2;
    const targetX = enemyBaseX + (enemy.targetOffsetX ?? index * BATTLE_ENEMY_SPACING_X);
    const targetY = baseY - 4 + (enemy.targetOffsetY ?? centeredIndex * ySpread);
    units.push({
      id: enemy.enemyUnitId,
      side: "enemy",
      label: enemy.enemyName,
      actor: enemy.enemyActor || null,
      maxHp: enemyMaxHp,
      hp: enemyMaxHp,
      shield: 0,
      boosted: false,
      debuffed: false,
      stunned: false,
      invincible: false,
      invincibleConsumed: false,
      taunted: false,
      tauntConsumed: false,
      sleeping: false,
      sleepTurns: 0,
      dreaming: false,
      dreamTurns: 0,
      nightmared: false,
      nightmareTurns: 0,
      charmed: false,
      charmTurns: 0,
      frozen: false,
      freezeTurns: 0,
      reflecting: false,
      reflectTurns: 0,
      burning: false,
      burnTurns: 0,
      burnDamageRatio: 0,
      stunConsumed: false,
      x: cameraX + canvas.width + 180 + index * 74,
      y: targetY,
      targetX,
      targetY,
      actionTimer: 0,
      hitTimer: 0,
      uniqueGlowDelay: 0,
      uniqueGlowTimer: 0,
      ready: false,
      placeholder: !enemy.enemyActor,
    });
  });
  return units;
}

function calculateBattleCameraX(config) {
  const enemyActors = getBattleEnemyConfigs(config).map((enemy) => enemy.enemyActor).filter(Boolean);
  const enemyX = enemyActors.length
    ? enemyActors.reduce((total, actor) => total + actor.x, 0) / enemyActors.length
    : config.enemyActor?.x ?? player.x + 650;
  return clamp((player.x + enemyX) / 2 - canvas.width / 2, 0, WORLD.width - canvas.width);
}

function createSlotRows() {
  const rows = [];
  const previousRows = battleState.slotRows;
  battleState.slotRows = rows;
  for (let row = 0; row < SLOT_SIZE; row += 1) {
    const skills = [];
    rows.push(skills);
    for (let col = 0; col < SLOT_SIZE + 1; col += 1) {
      skills.push(pickRandomSkill());
    }
  }
  battleState.slotRows = previousRows;
  return rows;
}

function pickRandomSkill() {
  if (!battleState?.skillPool?.length) {
    return { id: "fallback", side: "player", unitId: "hero", owner: player.label, name: "撞擊", type: "physical" };
  }

  if (!battleState.worldStop && instantKillToggleEl?.checked) {
    const playerPool = battleState.playerSkills.filter((skill) => isUnitAlive("player", skill.unitId));
    return pickFromPoolRespectingUnique(playerPool) || pickFromPool(playerPool) || battleState.skillPool[Math.floor(Math.random() * battleState.skillPool.length)];
  }

  const preferredSide = Math.random() < 0.5 ? "player" : "enemy";
  const preferredPool = getSkillPoolBySide(preferredSide);
  const firstPick = pickFromPool(preferredPool);

  if (!firstPick || isSkillSourceAlive(firstPick)) {
    return enforceUniqueSkillLimit(firstPick) || battleState.skillPool[Math.floor(Math.random() * battleState.skillPool.length)];
  }

  const otherSide = oppositeSide(preferredSide);
  return pickAliveSkillFromSide(preferredSide, true)
    || pickAliveSkillFromSide(otherSide, true)
    || firstPick
    || battleState.skillPool[Math.floor(Math.random() * battleState.skillPool.length)];
}

function getSkillPoolBySide(side) {
  if (!battleState) return [];
  const stop = battleState.worldStop;
  const pool = side === "player" ? battleState.playerSkills : battleState.enemySkills;
  if (stop?.remainingLines > 0 && side === stop.side) {
    return pool.filter((skill) => skill.unitId === stop.unitId);
  }
  return pool;
}

function pickFromPool(pool) {
  if (!pool?.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickFromPoolRespectingUnique(pool) {
  return pickFromPool((pool || []).filter((skill) => canPlaceSkillOnSlotBoard(skill)));
}

function pickAliveSkillFromSide(side, respectUniqueLimit = false) {
  const pool = getSkillPoolBySide(side).filter((skill) =>
    isSkillSourceAlive(skill) && (!respectUniqueLimit || canPlaceSkillOnSlotBoard(skill))
  );
  return pickFromPool(pool);
}

function enforceUniqueSkillLimit(skill) {
  if (!skill) return null;
  if (canPlaceSkillOnSlotBoard(skill)) return skill;
  return pickAliveSkillFromSide(skill.side, true)
    || pickAliveSkillFromSide(oppositeSide(skill.side), true)
    || skill;
}

function canPlaceSkillOnSlotBoard(skill) {
  if (!isUniqueSkill(skill)) return true;
  const key = getUniqueSkillKey(skill);
  return !battleState?.slotRows?.some((row) =>
    row.some((existing) => getUniqueSkillKey(existing) === key)
  );
}

function isUniqueSkill(skill) {
  return Boolean(skill?.unique);
}

function getUniqueSkillKey(skill) {
  if (!isUniqueSkill(skill)) return "";
  return `${skill.side}:${skill.unitId}`;
}

function getUniqueCutinAssetKey(skill) {
  if (skill?.unitId === "hero") return chapter4State.transformed ? "uniqueSkill29" : "uniqueSkill0";
  if (skill?.unitId === "hotel_otaku") return "uniqueSkill32";
  const unitMatch = /^npc(\d+)$/.exec(String(skill?.unitId || ""));
  if (unitMatch) {
    const directKey = `uniqueSkill${unitMatch[1]}`;
    if (assets[directKey]) return directKey;
  }
  const unit = getBattleUnitBySkill(skill);
  const spriteMatch = /^npc(\d+)$/.exec(String(unit?.actor?.sprite || ""));
  return spriteMatch ? `uniqueSkill${spriteMatch[1]}` : "";
}

function addUniqueSkillCutin(skill) {
  if (!battleState || !skill?.name) return;
  scheduleUniqueCasterGlow(skill);
  battleState.uniqueCutins.push({
    title: skill.name,
    owner: skill.owner || "",
    side: skill.side || "player",
    assetKey: getUniqueCutinAssetKey(skill),
    life: UNIQUE_CUTIN_DURATION,
    maxLife: UNIQUE_CUTIN_DURATION,
    progress: 0,
    seed: Math.random() * 1000,
  });
  if (battleState.uniqueCutins.length > 3) {
    battleState.uniqueCutins.splice(0, battleState.uniqueCutins.length - 3);
  }
}

function playUniqueSkillSound(skill) {
  const src = UNIQUE_SKILL_SOUND_SOURCES[skill?.id];
  if (!src || typeof Audio === "undefined") return;
  try {
    let audio = uniqueSoundCache.get(src);
    if (!audio) {
      audio = new Audio(src);
      audio.preload = "auto";
      uniqueSoundCache.set(src, audio);
    }
    audio.pause();
    audio.currentTime = 0;
    audio.volume = getMasterScaledVolume(0.88);
    const playPromise = audio.play();
    if (playPromise?.catch) playPromise.catch(() => {});
  } catch (error) {
    // Some browsers block audio if the action was not user initiated.
  }
}

function scheduleUniqueCasterGlow(skill) {
  const unit = getBattleUnitBySkill(skill);
  if (!unit) return;
  unit.uniqueGlowDelay = UNIQUE_CASTER_GLOW_DELAY;
  unit.uniqueGlowTimer = Math.max(unit.uniqueGlowTimer || 0, 0);
}

function getSkillUseKey(skill) {
  return `${skill?.side || "unknown"}:${skill?.unitId || "unknown"}:${skill?.id || "unknown"}`;
}

function consumeLimitedSkillUse(skill, limit) {
  if (!battleState) return false;
  const key = getSkillUseKey(skill);
  const current = battleState.skillUseCounts[key] || 0;
  if (current >= limit) return false;
  battleState.skillUseCounts[key] = current + 1;
  return true;
}

function advanceSlotRows(delta) {
  const speed = getSlotRowSlideSpeed();
  for (let row = battleState.stoppedRows; row < SLOT_SIZE; row += 1) {
    battleState.rowOffsets[row] += delta * speed;
    while (battleState.rowOffsets[row] >= 1) {
      battleState.rowOffsets[row] -= 1;
      battleState.slotRows[row].shift();
      battleState.slotRows[row].push(pickRandomSkill());
    }
  }
  refreshSlotGridFromRows();
}

function getSlotRowSlideSpeed() {
  return SLOT_ROW_SLIDE_SPEED * (hasPlayerPassive("npc2") ? 0.9 : 1);
}

function normalizeSlotRow(row) {
  while (battleState.rowOffsets[row] >= 0.5) {
    battleState.rowOffsets[row] -= 1;
    battleState.slotRows[row].shift();
    battleState.slotRows[row].push(pickRandomSkill());
  }
  battleState.rowOffsets[row] = 0;
}

function refreshSlotGridFromRows() {
  battleState.slotGrid = [];
  for (let row = 0; row < SLOT_SIZE; row += 1) {
    for (let col = 0; col < SLOT_SIZE; col += 1) {
      battleState.slotGrid.push(battleState.slotRows[row][col] || pickRandomSkill());
    }
  }
}

function updateBattleUnits(delta) {
  for (const unit of battleState.units) {
    unit.actionTimer = Math.max(unit.actionTimer - delta, 0);
    unit.hitTimer = Math.max(unit.hitTimer - delta, 0);
    if ((unit.uniqueGlowDelay || 0) > 0) {
      unit.uniqueGlowDelay = Math.max(unit.uniqueGlowDelay - delta, 0);
      if (unit.uniqueGlowDelay <= 0) {
        unit.uniqueGlowTimer = Math.max(unit.uniqueGlowTimer || 0, UNIQUE_CASTER_GLOW_TIME);
      }
    } else {
      unit.uniqueGlowTimer = Math.max((unit.uniqueGlowTimer || 0) - delta, 0);
    }

    const currentX = unit.actor ? unit.actor.x : unit.x;
    const currentY = unit.actor ? unit.actor.y : unit.y;
    const dx = unit.targetX - currentX;
    const dy = unit.targetY - currentY;
    const distance = Math.hypot(dx, dy);

    if (distance > 1.5) {
      const step = Math.min(distance, 360 * delta);
      const nextX = currentX + (dx / distance) * step;
      const nextY = currentY + (dy / distance) * step;
      if (unit.actor) {
        unit.actor.x = nextX;
        unit.actor.y = nextY;
        unit.actor.direction = axisToDirection(dx, dy);
        unit.actor.walkTime += delta * 7;
      } else {
        unit.x = nextX;
        unit.y = nextY;
      }
      unit.ready = false;
    } else {
      if (unit.actor) {
        unit.actor.x = unit.targetX;
        unit.actor.y = unit.targetY;
        unit.actor.walkTime = unit.actionTimer > 0 ? unit.actionTimer * 16 : 0;
        unit.actor.direction = unit.side === "player" ? "right" : "left";
      } else {
        unit.x = unit.targetX;
        unit.y = unit.targetY;
      }
      unit.ready = true;
    }
  }
}

function updateBattleEffects(delta) {
  for (const effect of battleState.effects) {
    if (effect.delay > 0) {
      effect.delay -= delta;
      continue;
    }
    effect.life -= delta;
    effect.progress = 1 - Math.max(effect.life / effect.maxLife, 0);
  }
  battleState.effects = battleState.effects.filter((effect) => effect.delay > 0 || effect.life > 0);

  for (const text of battleState.floatingTexts) {
    text.life -= delta;
    text.y -= 32 * delta;
  }
  battleState.floatingTexts = battleState.floatingTexts.filter((text) => text.life > 0);

  for (const cutin of battleState.uniqueCutins) {
    cutin.life -= delta;
    cutin.progress = 1 - Math.max(cutin.life / cutin.maxLife, 0);
  }
  battleState.uniqueCutins = battleState.uniqueCutins.filter((cutin) => cutin.life > 0);
  battleState.worldStopImpactTimer = Math.max((battleState.worldStopImpactTimer || 0) - delta, 0);
  battleState.worldStopWarpTimer = Math.max((battleState.worldStopWarpTimer || 0) - delta, 0);
  battleState.worldStopStartTimer = Math.max((battleState.worldStopStartTimer || 0) - delta, 0);
  battleState.worldStopReleaseTimer = Math.max((battleState.worldStopReleaseTimer || 0) - delta, 0);
}

function findFactionLines(grid) {
  const matches = [];
  for (const line of SLOT_LINES) {
    const side = grid[line[0]]?.side;
    if (!side) continue;
    if (line.every((cell) => grid[cell]?.side === side)) {
      matches.push({
        side,
        cells: line,
        skills: line.map((cell) => grid[cell]),
      });
    }
  }
  return matches;
}

function refreshSleepBlockedCells() {
  battleState.sleepBlockedCells = [];
  battleState.slotGrid.forEach((skill, cell) => {
    if (!skill) return;
    const unit = getBattleUnitBySkill(skill);
    if (!unit?.sleeping || !(unit.sleepTurns > 0)) return;
    if (Math.random() < SLEEP_BLOCK_CHANCE) {
      battleState.sleepBlockedCells.push(cell);
    }
  });
}

function recordEnemyUniqueRoundResult(usedEnemyUnique) {
  if (!battleState || !enemyHasUsableUniqueSkill()) {
    if (battleState) battleState.enemyUniqueDroughtRounds = 0;
    return;
  }
  battleState.enemyUniqueDroughtRounds = usedEnemyUnique
    ? 0
    : Math.min((battleState.enemyUniqueDroughtRounds || 0) + 1, 99);
}

function enemyHasUsableUniqueSkill() {
  return getUsableEnemyUniqueSkills().length > 0;
}

function getUsableEnemyUniqueSkills() {
  if (!battleState) return [];
  return battleState.enemySkills.filter((skill) => isUniqueSkill(skill) && isSkillSourceAlive(skill));
}

function guaranteeHisadaWorldOnFirstRescuePlayerLine() {
  if (!battleState || battleState.mode !== "chapter4-rescue" || battleState.hisadaWorldFirstPlayerLineHandled) return;
  const playerMatches = battleState.matches.filter((match) => match.side === "player");
  if (!playerMatches.length) return;
  const worldSkill = battleState.playerSkills.find((skill) =>
    skill.unitId === "npc9" && skill.id === "hisada_the_world" && isUniqueSkill(skill) && isSkillSourceAlive(skill)
  );
  if (!worldSkill) {
    battleState.hisadaWorldFirstPlayerLineHandled = true;
    return;
  }
  if (playerMatches.some((match) => match.skills.some((skill) => skill?.id === "hisada_the_world" && skill.unitId === "npc9"))) {
    battleState.hisadaWorldFirstPlayerLineHandled = true;
    return;
  }

  const match = playerMatches[0];
  const replaceableCells = match.cells.filter((cell) => !isUniqueSkill(battleState.slotGrid[cell]));
  const cells = replaceableCells.length ? replaceableCells : match.cells;
  const cell = cells[Math.floor(Math.random() * cells.length)];
  setSlotSkillAtCell(cell, { ...worldSkill, guaranteedUnique: true });
  removeDuplicateUniqueSkillFromSlotRows(worldSkill, cell);
  refreshSlotGridFromRows();
  battleState.matches = findFactionLines(battleState.slotGrid);
  battleState.hisadaWorldFirstPlayerLineHandled = true;
}

function guaranteeEnemyUniqueSkillOnFirstEnemyLine() {
  if (!battleState || battleState.enemyUniqueFirstLineHandled) return;
  const enemyMatches = battleState.matches.filter((match) => match.side === "enemy");
  if (!enemyMatches.length) return;
  if (enemyMatches.some((match) =>
    match.skills.some((skill) => skill.side === "enemy" && isUniqueSkill(skill) && isSkillSourceAlive(skill))
  )) {
    battleState.enemyUniqueFirstLineHandled = true;
    return;
  }

  const uniqueSkill = pickEnemyUniqueSkillForGuarantee();
  if (!uniqueSkill) return;
  const match = enemyMatches[Math.floor(Math.random() * enemyMatches.length)];
  const replaceableCells = match.cells.filter((cell) => !isUniqueSkill(battleState.slotGrid[cell]));
  const cell = (replaceableCells.length ? replaceableCells : match.cells)[Math.floor(Math.random() * (replaceableCells.length || match.cells.length))];
  setSlotSkillAtCell(cell, { ...uniqueSkill, guaranteedUnique: true });
  removeDuplicateUniqueSkillFromSlotRows(uniqueSkill, cell);
  refreshSlotGridFromRows();
  battleState.matches = findFactionLines(battleState.slotGrid);
  battleState.enemyUniqueFirstLineHandled = true;
  battleState.enemyUniqueGuaranteedThisRound = true;
}

function pickEnemyUniqueSkillForGuarantee() {
  const candidates = getUsableEnemyUniqueSkills();
  if (!candidates.length) return null;
  const notAlreadyVisible = candidates.filter((skill) => !isUniqueSkillKeyOnSlotRows(getUniqueSkillKey(skill)));
  return pickFromPool(notAlreadyVisible.length ? notAlreadyVisible : candidates);
}

function setSlotSkillAtCell(cell, skill) {
  const row = Math.floor(cell / SLOT_SIZE);
  const col = cell % SLOT_SIZE;
  if (!battleState?.slotRows?.[row]) return;
  battleState.slotRows[row][col] = skill;
  battleState.slotGrid[cell] = skill;
}

function isUniqueSkillKeyOnSlotRows(key) {
  if (!key || !battleState?.slotRows) return false;
  return battleState.slotRows.some((row) =>
    row.some((skill) => getUniqueSkillKey(skill) === key)
  );
}

function removeDuplicateUniqueSkillFromSlotRows(skill, keptCell) {
  const key = getUniqueSkillKey(skill);
  if (!key || !battleState?.slotRows) return;
  const keptRow = Math.floor(keptCell / SLOT_SIZE);
  const keptCol = keptCell % SLOT_SIZE;
  for (let row = 0; row < battleState.slotRows.length; row += 1) {
    for (let col = 0; col < battleState.slotRows[row].length; col += 1) {
      if (row === keptRow && col === keptCol) continue;
      if (getUniqueSkillKey(battleState.slotRows[row][col]) !== key) continue;
      const replacement = pickNonUniqueSkillForSide(skill.side) || battleState.slotRows[row][col];
      battleState.slotRows[row][col] = replacement;
    }
  }
}

function pickNonUniqueSkillForSide(side) {
  const pool = getSkillPoolBySide(side).filter((skill) => !isUniqueSkill(skill) && isSkillSourceAlive(skill));
  const fallbackPool = getSkillPoolBySide(side).filter((skill) => !isUniqueSkill(skill));
  const picked = pickFromPool(pool) || pickFromPool(fallbackPool);
  return picked ? { ...picked } : null;
}

function getXiaoDomainForcedCells() {
  if (!battleState) return [];
  const xiaoUnit = battleState.units.find((unit) => unit.id === "npc4" && unit.hp > 0);
  if (!xiaoUnit) return [];
  const diagonalCells = [
    ...Array.from({ length: SLOT_SIZE }, (_, index) => index * SLOT_SIZE + index),
    ...Array.from({ length: SLOT_SIZE }, (_, index) => index * SLOT_SIZE + (SLOT_SIZE - 1 - index)),
  ];
  return [...new Set(diagonalCells)].filter((cell) => {
    const skill = battleState.slotGrid[cell];
    return skill?.side === xiaoUnit.side && skill.unitId === "npc4" && isSkillSourceAlive(skill);
  });
}

function applyWorldStopSkillQueue(queue) {
  const stop = battleState?.worldStop;
  if (!stop?.remainingLines) return queue;
  const ownerQueue = queue.filter((item) =>
    item.skill?.side === stop.side && item.skill?.unitId === stop.unitId
  );
  battleState.worldStopTriggeredThisRound = ownerQueue.length > 0;
  return ownerQueue;
}

function beginSkillExecution() {
  const normalQueue = battleState.matches.flatMap((match) =>
    match.cells.map((cell) => ({ cell, skill: battleState.slotGrid[cell], match }))
  );
  const forcedQueue = (battleState.xiaoDomainCells || []).map((cell) => ({
    cell,
    skill: battleState.slotGrid[cell],
    forcedBy: "xiao-domain",
  }));
  battleState.skillQueue = applyWorldStopSkillQueue([...normalQueue, ...forcedQueue]);
  battleState.skillIndex = 0;
  battleState.activeCell = null;

  if (!battleState.skillQueue.length) {
    finishBattleRound();
    return;
  }
  battleState.phase = "skill-exec";
  battleState.timer = SLOT_SKILL_STEP_TIME;
}

function hasKissBeastDollEquipped(actorId) {
  if (actorId === "npc9") return false;
  return getEquippedItems(actorId).some((item) => item.id === "kiss_beast_doll");
}

function applyKissBeastDollUnique(item) {
  if (!battleState || !item?.skill || item.skill.side !== "player") return;
  const unitId = item.skill.unitId;
  if (!unitId || !hasKissBeastDollEquipped(unitId)) return;
  if (battleState.dollUniqueUsedByUnit?.[unitId]) return;
  battleState.dollUniqueUsedByUnit[unitId] = true;
  const uniqueSkill = battleState.playerSkills.find((skill) =>
    skill.unitId === unitId && isUniqueSkill(skill)
  );
  item.skill = {
    ...(uniqueSkill || item.skill),
    unique: true,
    dollUnique: true,
  };
  if (Number.isInteger(item.cell) && battleState.slotGrid[item.cell]) {
    battleState.slotGrid[item.cell] = item.skill;
  }
}

function executeNextQueuedSkill() {
  battleState.timer = 0;
  if (hasBattleOutcome()) {
    finishBattleRound();
    return;
  }
  if (battleState.skillIndex >= battleState.skillQueue.length) {
    finishBattleRound();
    return;
  }

  const item = battleState.skillQueue[battleState.skillIndex];
  battleState.activeCell = item.cell;
  const canExecuteSkill = isSkillSourceAlive(item.skill);
  const sleepBlockedSkill = canExecuteSkill && isSkillBlockedBySleep(item.skill, item.cell);
  const sourceCanAct = canExecuteSkill
    && !sleepBlockedSkill
    && !isSkillSourceFrozen(item.skill)
    && !isSkillSourceStunned(item.skill);
  if (sourceCanAct) applyKissBeastDollUnique(item);
  const shouldPlayUniqueCutin = canExecuteSkill
    && isUniqueSkill(item.skill)
    && !item.uniqueCutinResolved
    && !sleepBlockedSkill
    && !isSkillSourceFrozen(item.skill)
    && !isSkillSourceStunned(item.skill);
  if (shouldPlayUniqueCutin) {
    item.uniqueCutinResolved = true;
    addUniqueSkillCutin(item.skill);
    battleState.timer = Math.min(battleState.timer, SLOT_SKILL_STEP_TIME - UNIQUE_CUTIN_DURATION);
    return;
  }

  if (sleepBlockedSkill) {
    const source = getBattleUnitBySkill(item.skill);
    addFloatingText(source, "Zzz", "#9fd7ff", {
      yOffset: source?.placeholder ? 162 : 138,
      life: 0.95,
      font: "bold 26px 'Segoe UI', 'Noto Sans TC', sans-serif",
      stroke: "rgba(15, 70, 118, 0.86)",
    });
    addBattleCellBurst(item.cell, "#9fd7ff");
  } else if (canExecuteSkill && isSkillSourceFrozen(item.skill)) {
    const source = getBattleUnitBySkill(item.skill);
    addFloatingText(source, "冰凍", "#9fd7ff", {
      yOffset: source?.placeholder ? 162 : 138,
      life: 0.95,
      font: "bold 26px 'Segoe UI', 'Noto Sans TC', sans-serif",
      stroke: "rgba(15, 70, 118, 0.86)",
    });
    addBattleCellBurst(item.cell, "#9fd7ff");
  } else if (canExecuteSkill) {
    applySkillEffect(item.skill, item.cell, item);
  }
  battleState.skillIndex += 1;
  if (battleState.forceRoundEndAfterSkill) {
    battleState.forceRoundEndAfterSkill = false;
    finishBattleRound();
    return;
  }
  if (hasBattleOutcome()) {
    finishBattleRound();
    return;
  }
}

function applySkillEffect(skill, cell, queueItem = null) {
  const source = getSourceUnit(skill);
  const forcedByXiaoDomain = queueItem?.forcedBy === "xiao-domain";
  const skillType = getEffectiveSkillType(skill);
  const amountScale = skill.side === "player"
    ? battleState.playerDamageScale || 1
    : battleState.enemyDamageScale || (battleState.mode === "boss" ? 0.92 : 0.72);
  const uniqueScale = getUniqueSkillPowerMultiplier(skill);
  if (source) source.actionTimer = 0.36;
  if (source?.stunned) {
    source.stunConsumed = true;
    addFloatingText(source, "暈眩", "#ffe16f", {
      yOffset: source.placeholder ? 162 : 138,
      life: 1.05,
      font: "bold 24px 'Segoe UI', 'Noto Sans TC', sans-serif",
      stroke: "rgba(72, 45, 0, 0.88)",
    });
    addBattleCellBurst(cell, "#ffe16f");
    return;
  }
  if (isUniqueSkill(skill) && !queueItem?.uniqueCutinResolved) {
    addUniqueSkillCutin(skill);
  }
  if (skill.side === "enemy" && isUniqueSkill(skill)) {
    battleState.enemyUniqueUsedThisRound = true;
  }
  if (source && forcedByXiaoDomain) {
    addFloatingText(source, `剪刀領域\n強制發動斜對角技能\n${skill.name}`, "#ff304a", {
      yOffset: source.placeholder ? 178 : 154,
      life: 1.12,
      font: "bold 26px 'Segoe UI', 'Noto Sans TC', sans-serif",
      stroke: "rgba(60, 0, 10, 0.92)",
      flash: true,
    });
    addBattleCellBurst(cell, XIAO_DOMAIN_COLOR);
  } else if (source && skill.name) {
    addFloatingText(source, skill.name, "#fff0a8", {
      yOffset: source.placeholder ? 162 : 138,
      life: 1.05,
      font: "bold 20px 'Segoe UI', 'Noto Sans TC', sans-serif",
      stroke: "rgba(70, 40, 0, 0.82)",
    });
  }

  if (skillType === "physical" || skillType === "magic") {
    const target = getTargetUnit(oppositeSide(skill.side));
    if (!target) return;
    const baseDamage = skillType === "magic" ? 138 : 150;
    const equipmentScale = skill.side === "player"
      ? getEquipmentDamageMultiplier(skill.unitId) * getLevelStatMultiplier(skill.unitId) * getPopularityStatMultiplier(skill.unitId)
      : 1;
    const passiveScale = getDamagePassiveMultiplier(skill, target);
    const outputScale = getUnitDamageOutputMultiplier(source);
    const damage = isHeroInstantKillEnabled(skill)
      ? target.hp + (target.shield || 0)
      : Math.round(baseDamage * amountScale * uniqueScale * (1 + getSideBoost(skill.side)) * equipmentScale * passiveScale * outputScale);
    const taken = damageUnit(target, damage, { attackerSide: skill.side, attackerUnit: source });
    addBattleEffect(skillType, source, target, cell, skill.side);
    addFloatingText(target, taken.invincible ? "免疫" : `-${taken.damage}`, taken.invincible ? "#ffe16f" : SIDE_STYLE[skill.side].color);
    return;
  }

  if (skillType === "sever") {
    const target = getTargetUnit(oppositeSide(skill.side));
    if (!target) return;
    const damage = isHeroInstantKillEnabled(skill)
      ? target.hp + (target.shield || 0)
      : Math.max(1, Math.ceil(target.hp * 0.5 * getUnitDamageOutputMultiplier(source)));
    const taken = damageUnit(target, damage, { attackerSide: skill.side, attackerUnit: source });
    addBattleEffect("sever", source, target, cell, skill.side);
    addFloatingText(target, taken.invincible ? "免疫" : `-${taken.damage}`, taken.invincible ? "#ffe16f" : "#ffeff4", {
      font: "bold 26px 'Segoe UI', 'Noto Sans TC', sans-serif",
      stroke: "rgba(82, 0, 14, 0.88)",
    });
    return;
  }

  if (skillType === "invincible") {
    if (!source) return;
    source.invincible = true;
    source.invincibleConsumed = false;
    source.taunted = true;
    source.tauntConsumed = false;
    addFloatingText(source, "無敵・嘲諷", "#ffe16f");
    addBattleEffect("invincible", source, source, cell, skill.side);
    return;
  }

  if (skillType === "guard") {
    const target = getLowestHpUnit(skill.side);
    if (!target) return;
    const equipmentScale = skill.side === "player"
      ? getEquipmentShieldMultiplier(skill.unitId) * getLevelRecoveryMultiplier(skill.unitId) * getPopularityStatMultiplier(skill.unitId)
      : 1;
    const titleScale = skill.side === "player" ? getTitleShieldMultiplier() : 1;
    const shield = Math.round(110 * amountScale * uniqueScale * equipmentScale * getRecoveryPassiveMultiplier(skill) * titleScale);
    target.shield += shield;
    addBattleEffect("guard", source, source, cell, skill.side);
    addFloatingText(target, `+${shield}盾`, SIDE_STYLE[skill.side].color);
    return;
  }

  if (skillType === "heal") {
    const target = getLowestHpUnit(skill.side);
    if (!target) return;
    const levelScale = skill.side === "player" ? getLevelRecoveryMultiplier(skill.unitId) * getPopularityStatMultiplier(skill.unitId) : 1;
    const titleScale = skill.side === "player" ? getTitleHealMultiplier() : 1;
    const heal = Math.round(105 * amountScale * uniqueScale * levelScale * getRecoveryPassiveMultiplier(skill) * titleScale);
    target.hp = clamp(target.hp + heal, 0, target.maxHp);
    addBattleEffect("heal", source, target, cell, skill.side);
    addFloatingText(target, `+${heal}`, "#75f4b2");
    return;
  }

  if (skillType === "bento") {
    if (!consumeLimitedSkillUse(skill, 3)) {
      addFloatingText(source || getTargetUnit(skill.side), "便當吃完了", "#ffb15f", {
        life: 1,
        font: "bold 24px 'Segoe UI', 'Noto Sans TC', sans-serif",
        stroke: "rgba(80, 28, 0, 0.82)",
      });
      addBattleCellBurst(cell, "#ffb15f");
      return;
    }
    const allies = getAliveUnits(skill.side);
    allies.forEach((unit) => {
      const heal = Math.max(unit.maxHp - unit.hp, 0);
      unit.hp = unit.maxHp;
      addBattleEffect("bento", source, unit, cell, skill.side);
      addFloatingText(unit, `便當 +${heal}`, "#75f4b2");
    });
    return;
  }

  if (skillType === "sleep") {
    const allies = getAliveUnits(skill.side);
    const enemies = getAliveUnits(oppositeSide(skill.side));

    [...allies, ...enemies].forEach((unit) => {
      applySleepStatus(unit);
      if (unit.side === skill.side) {
        applyDreamStatus(unit);
        addBattleEffect("heal", source, unit, cell, skill.side);
        addFloatingText(unit, "睡眠・美夢", "#75f4b2");
      } else {
        applyNightmareStatus(unit);
        addBattleEffect("magic", source, unit, cell, skill.side);
        addFloatingText(unit, "睡眠・噩夢", "#9fd7ff");
      }
    });
    return;
  }

  if (skillType === "time_stop") {
    if (!source) return;
    const refreshedExistingWorld = battleState.worldStop
      && battleState.worldStop.side === skill.side
      && battleState.worldStop.unitId === skill.unitId
      && battleState.worldStop.remainingLines > 0;
    battleState.worldStop = {
      side: skill.side,
      unitId: skill.unitId,
      owner: skill.owner || source.label,
      remainingLines: WORLD_STOP_LINE_COUNT,
    };
    battleState.worldStopRefreshedThisRound = Boolean(refreshedExistingWorld);
    battleState.worldStopImpactTimer = Math.max(battleState.worldStopImpactTimer || 0, refreshedExistingWorld ? 0.62 : 0.95);
    battleState.worldStopWarpTimer = WORLD_STOP_WARP_TIME;
    battleState.worldStopSeed = Math.random() * 1000;
    syncWorldStopBgmSuspension();
    if (!refreshedExistingWorld) {
      battleState.forceRoundEndAfterSkill = true;
      battleState.forceRoundEndDelay = Math.max(battleState.forceRoundEndDelay || 0, WORLD_STOP_WARP_TIME - SLOT_NEXT_ROUND_DELAY);
      battleState.worldStopReleaseTimer = 0;
      battleState.worldStopStartTimer = 1.35;
    }
    playUniqueSkillSound(skill);
    addBattleEffect("time_stop", source, source, cell, skill.side);
    addFloatingText(source, "時間停止", "#f5f7ff", {
      life: 1.25,
      font: "bold 28px 'Segoe UI', 'Noto Sans TC', sans-serif",
      stroke: "rgba(0, 0, 0, 0.92)",
    });
    return;
  }

  if (skillType === "revive") {
    const deadAllies = battleState.units.filter((unit) => unit.side === skill.side && unit.hp <= 0);
    const target = deadAllies[0];
    if (!target) {
      addFloatingText(source || getTargetUnit(skill.side), "沒有人倒下", "#ffe16f");
      addBattleCellBurst(cell, "#ffe16f");
      return;
    }
    target.hp = Math.max(1, Math.round(target.maxHp * 0.5));
    target.shield = Math.max(target.shield || 0, Math.round(target.maxHp * 0.12));
    target.hitTimer = 0;
    addBattleEffect("revive", source, target, cell, skill.side);
    addFloatingText(target, `復活 +${target.hp}`, "#75f4b2", {
      life: 1.1,
      font: "bold 25px 'Segoe UI', 'Noto Sans TC', sans-serif",
      stroke: "rgba(0, 60, 30, 0.86)",
    });
    return;
  }

  if (skillType === "beast_bomb") {
    const targets = getAliveUnits(oppositeSide(skill.side));
    const levelScale = skill.side === "player" ? getLevelStatMultiplier(skill.unitId) * getPopularityStatMultiplier(skill.unitId) : 1;
    const outputScale = getUnitDamageOutputMultiplier(source);
    targets.forEach((target) => {
      const damage = isHeroInstantKillEnabled(skill)
        ? target.hp + (target.shield || 0)
        : Math.round(205 * amountScale * uniqueScale * levelScale * getDamagePassiveMultiplier(skill, target) * outputScale);
      const taken = damageUnit(target, damage, { attackerSide: skill.side, attackerUnit: source });
      addBattleEffect("beast_bomb", source, target, cell, skill.side);
      addFloatingText(target, taken.invincible ? "免疫" : `-${taken.damage}`, taken.invincible ? "#ffe16f" : "#ffdf75", {
        font: "bold 25px 'Segoe UI', 'Noto Sans TC', sans-serif",
        stroke: "rgba(70, 35, 0, 0.9)",
      });
      target.debuffed = true;
    });
    const affectedSide = oppositeSide(skill.side);
    battleState[affectedSide === "player" ? "playerBoost" : "enemyBoost"] = Math.max(getSideBoost(affectedSide) - 0.2, -0.32);
    setSideBoostDuration(affectedSide);
    syncBattleStatusUnits(affectedSide);
    return;
  }

  if (skillType === "freeze") {
    const targets = getAliveUnits(oppositeSide(skill.side));
    targets.forEach((target) => {
      const damage = Math.round(150 * amountScale * uniqueScale * getUnitDamageOutputMultiplier(source));
      const taken = damageUnit(target, damage, { attackerSide: skill.side, attackerUnit: source });
      target.frozen = true;
      target.freezeTurns = ROUND_STATUS_DURATION;
      addBattleEffect("freeze", source, target, cell, skill.side);
      addFloatingText(target, taken.invincible ? "免疫" : `冰凍 -${taken.damage}`, taken.invincible ? "#ffe16f" : "#9fd7ff", {
        font: "bold 23px 'Segoe UI', 'Noto Sans TC', sans-serif",
        stroke: "rgba(10, 50, 90, 0.88)",
      });
    });
    return;
  }

  if (skillType === "lava_burn") {
    const targets = getAliveUnits(oppositeSide(skill.side));
    targets.forEach((target) => {
      const damage = Math.round(158 * amountScale * uniqueScale * getUnitDamageOutputMultiplier(source));
      const taken = damageUnit(target, damage, { attackerSide: skill.side, attackerUnit: source });
      target.burning = true;
      target.burnDamageRatio = skill.unitId === "npc39" ? Math.max(BURN_INITIAL_RATIO * 1.2, BURN_INITIAL_RATIO) : BURN_INITIAL_RATIO;
      target.burnTurns = 0;
      addBattleEffect("lava_burn", source, target, cell, skill.side);
      addFloatingText(target, taken.invincible ? "免疫" : `熔岩 -${taken.damage}`, taken.invincible ? "#ffe16f" : "#ff9b45", {
        font: "bold 23px 'Segoe UI', 'Noto Sans TC', sans-serif",
        stroke: "rgba(80, 28, 0, 0.88)",
      });
    });
    return;
  }

  if (skillType === "reflect") {
    const allies = getAliveUnits(skill.side);
    allies.forEach((unit) => {
      unit.reflecting = true;
      unit.reflectTurns = ROUND_STATUS_DURATION;
      addBattleEffect("reflect", source, unit, cell, skill.side);
      addFloatingText(unit, "反射", "#9fffe5", {
        font: "bold 23px 'Segoe UI', 'Noto Sans TC', sans-serif",
        stroke: "rgba(0, 66, 60, 0.88)",
      });
    });
    return;
  }

  if (skillType === "burn") {
    const target = getStatusPreferredUnit(oppositeSide(skill.side), ["sleeping", "burning"]);
    if (!target) return;
    consumeTauntOnTarget(target, skill.side);
    applySleepStatus(target);
    target.burning = true;
    target.burnDamageRatio = BURN_INITIAL_RATIO;
    target.burnTurns = 0;
    addBattleEffect("burn", source, target, cell, skill.side);
    addFloatingText(target, "睡眠・燒傷", "#ffb15f", {
      life: 1,
      font: "bold 24px 'Segoe UI', 'Noto Sans TC', sans-serif",
      stroke: "rgba(80, 28, 0, 0.82)",
    });
    return;
  }

  if (skillType === "poison" || skillType === "stun" || skillType === "debuff") {
    const statusKeys = getStatusKeysForSkillTarget(skillType);
    const target = statusKeys.length
      ? getStatusPreferredUnit(oppositeSide(skill.side), statusKeys)
      : getLeastStatusUnit(oppositeSide(skill.side));
    if (!target) return;
    const levelScale = skill.side === "player" ? getLevelStatMultiplier(skill.unitId) * getPopularityStatMultiplier(skill.unitId) : 1;
    const outputScale = getUnitDamageOutputMultiplier(source);
    const damage = isHeroInstantKillEnabled(skill)
      ? target.hp + (target.shield || 0)
      : Math.round((skillType === "poison" ? 82 : 62) * amountScale * uniqueScale * levelScale * getDamagePassiveMultiplier(skill, target) * outputScale);
    const taken = damageUnit(target, damage, { attackerSide: skill.side, attackerUnit: source });
    if (skillType === "stun" || skillType === "debuff") {
      const affectedSide = oppositeSide(skill.side);
      battleState[affectedSide === "player" ? "playerBoost" : "enemyBoost"] = Math.max(
        getSideBoost(affectedSide) - 0.18,
        -0.28
      );
      setSideBoostDuration(affectedSide);
      syncBattleStatusUnits(affectedSide);
    }
    if (skillType === "stun") {
      target.stunned = true;
      target.stunConsumed = false;
    }
    addBattleEffect(skillType, source, target, cell, skill.side);
    addFloatingText(target, taken.invincible ? "免疫" : `-${taken.damage}`, taken.invincible ? "#ffe16f" : "#cda2ff");
    return;
  }

  if (skillType === "charm") {
    const target = getStatusPreferredUnit(oppositeSide(skill.side), ["charmed"]);
    if (!target) return;
    consumeTauntOnTarget(target, skill.side);
    target.charmed = true;
    target.charmTurns = TIMED_STATUS_INITIAL_COUNTER;
    addBattleEffect("charm", source, target, cell, skill.side);
    addFloatingText(target, "魅惑", "#ff9fd7", {
      life: 1,
      font: "bold 24px 'Segoe UI', 'Noto Sans TC', sans-serif",
      stroke: "rgba(80, 0, 54, 0.82)",
    });
    return;
  }

  if (skillType === "cleanse") {
    const allies = getAliveUnits(skill.side);
    if (!allies.length) return;
    const boostKey = skill.side === "player" ? "playerBoost" : "enemyBoost";
    if (getSideBoost(skill.side) < 0) {
      battleState[boostKey] = 0;
      clearSideBoostDuration(skill.side);
      syncBattleStatusUnits(skill.side);
    }
    const levelScale = skill.side === "player" ? getLevelRecoveryMultiplier(skill.unitId) * getPopularityStatMultiplier(skill.unitId) : 1;
    const healTitleScale = skill.side === "player" ? getTitleHealMultiplier() : 1;
    const shieldTitleScale = skill.side === "player" ? getTitleShieldMultiplier() : 1;
    const recoveryScale = getRecoveryPassiveMultiplier(skill);
    const baseScale = skill.id === "aki_heavenly_voice" ? 3 : 1;
    const heal = Math.round(92 * baseScale * amountScale * uniqueScale * levelScale * recoveryScale * healTitleScale);
    const shield = Math.round(86 * baseScale * amountScale * uniqueScale * levelScale * recoveryScale * shieldTitleScale);
    allies.forEach((unit) => {
      clearNegativeBattleStatus(unit);
      const before = unit.hp;
      unit.hp = clamp(unit.hp + heal, 0, unit.maxHp);
      unit.shield += shield;
      addBattleEffect("cleanse", source, unit, cell, skill.side);
      addFloatingText(unit, `淨化 +${unit.hp - before} +${shield}盾`, "#ffe16f");
    });
    return;
  }

  if (skillType === "support") {
    const boostKey = skill.side === "player" ? "playerBoost" : "enemyBoost";
    const supportScale = skill.side === "player" ? getPopularityStatMultiplier(skill.unitId) : 1;
    battleState[boostKey] = Math.min(battleState[boostKey] + (isUniqueSkill(skill) ? 0.3 : 0.18) * supportScale, 0.72);
    setSideBoostDuration(skill.side);
    syncBattleStatusUnits(skill.side);
    addBattleEffect("support", source, source, cell, skill.side);
    addFloatingText(source, "增幅", "#ffe16f");
  }
}

function finishBattleRound() {
  battleState.activeCell = null;
  clearConsumedStuns();
  if (!hasBattleOutcome()) {
    applyBurnDamage();
    applyDreamNightmareEffects();
  }
  clearRoundInvincibility();
  tickTimedBattleStatuses();
  tickRoundBasedBattleStatuses();
  tickWorldStopStatus();
  recordEnemyUniqueRoundResult(Boolean(battleState.enemyUniqueUsedThisRound));
  if (getAliveUnits("enemy").length === 0) {
    battleState.phase = "victory";
    battleState.result = "win";
    battleState.timer = 0;
  } else if (getAliveUnits("player").length === 0) {
    battleState.phase = "defeat";
    battleState.result = "lose";
    battleState.timer = 0;
  } else {
    battleState.phase = "next-delay";
    battleState.timer = -Math.max(0, battleState.forceRoundEndDelay || 0);
    battleState.forceRoundEndDelay = 0;
  }
  updateBattleUi();
}

function tickWorldStopStatus() {
  if (!battleState?.worldStop) return;
  if (battleState.worldStopTriggeredThisRound && !battleState.worldStopRefreshedThisRound) {
    battleState.worldStop.remainingLines -= 1;
  }
  battleState.worldStopTriggeredThisRound = false;
  battleState.worldStopRefreshedThisRound = false;
  if (battleState.worldStop.remainingLines <= 0 || !isUnitAlive(battleState.worldStop.side, battleState.worldStop.unitId)) {
    battleState.worldStopReleaseTimer = 1.35;
    battleState.worldStop = null;
  }
}

function hasBattleOutcome() {
  return getAliveUnits("enemy").length === 0 || getAliveUnits("player").length === 0;
}

function isHeroInstantKillEnabled(skill) {
  return Boolean(instantKillToggleEl?.checked && skill?.side === "player");
}

function getEffectiveSkillType(skill) {
  if (skill?.type !== "stun") return skill?.type;
  return skill.side === "player" && skill.unitId === "hero" ? "stun" : "debuff";
}

function isHeroInvincibleEnabled(unit) {
  return Boolean(instantKillToggleEl?.checked && unit?.side === "player" && unit?.id === "hero");
}

function isHeroOneHitKoEnabled(unit) {
  return Boolean(heroOneHitKoToggleEl?.checked && unit?.side === "player" && unit?.id === "hero");
}

function clearConsumedStuns() {
  battleState.units.forEach((unit) => {
    if (unit.stunConsumed) {
      unit.stunned = false;
      unit.stunConsumed = false;
    }
  });
}

function clearRoundInvincibility() {
  battleState.units.forEach((unit) => {
    if (unit.invincibleConsumed) {
      unit.invincible = false;
      unit.invincibleConsumed = false;
      unit.taunted = false;
      unit.tauntConsumed = false;
    } else if (unit.tauntConsumed) {
      unit.taunted = false;
      unit.tauntConsumed = false;
    } else {
      if (!unit.invincible) unit.invincibleConsumed = false;
      if (!unit.taunted) unit.tauntConsumed = false;
    }
  });
}

function tickTimedBattleStatuses() {
  if (!battleState.matches?.length) return;
  tickSideBoostDuration("player");
  tickSideBoostDuration("enemy");
  battleState.units.forEach((unit) => {
    if (!unit.charmed || !(unit.charmTurns > 0)) return;
    unit.charmTurns -= 1;
    if (unit.charmTurns <= 0) {
      unit.charmed = false;
      unit.charmTurns = 0;
    }
  });
}

function tickRoundBasedBattleStatuses() {
  battleState.units.forEach((unit) => {
    tickUnitRoundStatus(unit, "sleeping", "sleepTurns");
    tickUnitRoundStatus(unit, "dreaming", "dreamTurns");
    tickUnitRoundStatus(unit, "nightmared", "nightmareTurns");
    tickUnitRoundStatus(unit, "frozen", "freezeTurns");
    tickUnitRoundStatus(unit, "reflecting", "reflectTurns");
  });
}

function tickUnitRoundStatus(unit, statusKey, turnKey) {
  if (!unit[statusKey] || !(unit[turnKey] > 0)) return;
  unit[turnKey] -= 1;
  if (unit[turnKey] <= 0) {
    unit[statusKey] = false;
    unit[turnKey] = 0;
  }
}

function setSideBoostDuration(side) {
  battleState[getSideBoostTurnKey(side)] = TIMED_STATUS_INITIAL_COUNTER;
}

function clearSideBoostDuration(side) {
  battleState[getSideBoostTurnKey(side)] = 0;
}

function tickSideBoostDuration(side) {
  const boostKey = side === "player" ? "playerBoost" : "enemyBoost";
  const turnKey = getSideBoostTurnKey(side);
  if (!battleState[boostKey]) {
    battleState[turnKey] = 0;
    return;
  }
  battleState[turnKey] = Math.max((battleState[turnKey] || 0) - 1, 0);
  if (battleState[turnKey] <= 0) {
    battleState[boostKey] = 0;
    syncBattleStatusUnits(side);
  }
}

function getSideBoostTurnKey(side) {
  return side === "player" ? "playerBoostTurns" : "enemyBoostTurns";
}

function applyBurnDamage() {
  battleState.units.forEach((unit) => {
    if (!unit.burning || unit.hp <= 0) return;
    const burnRatio = Math.max(unit.burnDamageRatio || BURN_INITIAL_RATIO, BURN_MIN_RATIO);
    const burnDamage = Math.max(1, Math.round(unit.maxHp * burnRatio));
    const taken = damageUnit(unit, burnDamage, { wakeSleeping: false });
    unit.burnDamageRatio = Math.max(burnRatio * BURN_DECAY_RATE, BURN_MIN_RATIO);
    addBattleEffect("burn", unit, unit, null, oppositeSide(unit.side));
    const label = taken.invincible
      ? "免疫"
      : taken.damage > 0
        ? `燒傷 -${taken.damage}`
        : taken.blocked > 0
          ? `燒傷 護盾-${taken.blocked}`
          : "燒傷";
    addFloatingText(unit, label, taken.invincible ? "#ffe16f" : "#ff9b45", {
      life: 0.92,
      font: "bold 22px 'Segoe UI', 'Noto Sans TC', sans-serif",
      stroke: "rgba(80, 28, 0, 0.82)",
    });
  });
}

function applyDreamNightmareEffects() {
  battleState.units.forEach((unit) => {
    if (unit.hp <= 0) return;
    if (unit.dreaming && unit.dreamTurns > 0) {
      const heal = Math.max(1, Math.round(unit.maxHp * 0.05));
      const before = unit.hp;
      unit.hp = clamp(unit.hp + heal, 0, unit.maxHp);
      addBattleEffect("heal", unit, unit, null, unit.side);
      addFloatingText(unit, `美夢 +${unit.hp - before}`, "#75f4b2", {
        life: 0.92,
        font: "bold 22px 'Segoe UI', 'Noto Sans TC', sans-serif",
        stroke: "rgba(0, 80, 44, 0.82)",
      });
    }
    if (unit.nightmared && unit.nightmareTurns > 0 && unit.hp > 0) {
      const damage = Math.max(1, Math.round(unit.maxHp * 0.05));
      const taken = damageUnit(unit, damage, { wakeSleeping: false });
      addBattleEffect("magic", unit, unit, null, oppositeSide(unit.side));
      addFloatingText(unit, taken.invincible ? "免疫" : `噩夢 -${taken.damage}`, taken.invincible ? "#ffe16f" : "#9fd7ff", {
        life: 0.92,
        font: "bold 22px 'Segoe UI', 'Noto Sans TC', sans-serif",
        stroke: "rgba(15, 42, 88, 0.82)",
      });
    }
  });
}

function applySleepStatus(unit) {
  unit.sleeping = true;
  unit.sleepTurns = ROUND_STATUS_DURATION;
}

function applyDreamStatus(unit) {
  unit.dreaming = true;
  unit.dreamTurns = ROUND_STATUS_DURATION;
}

function applyNightmareStatus(unit) {
  unit.nightmared = true;
  unit.nightmareTurns = ROUND_STATUS_DURATION;
}

function clearNegativeBattleStatus(unit) {
  unit.debuffed = false;
  unit.stunned = false;
  unit.stunConsumed = false;
  unit.sleeping = false;
  unit.sleepTurns = 0;
  unit.charmed = false;
  unit.charmTurns = 0;
  unit.frozen = false;
  unit.freezeTurns = 0;
  unit.nightmared = false;
  unit.nightmareTurns = 0;
  unit.burning = false;
  unit.burnTurns = 0;
  unit.burnDamageRatio = 0;
}

function getSourceUnit(skill) {
  return getAliveUnits(skill.side).find((unit) => unit.id === skill.unitId) || getAliveUnits(skill.side)[0] || null;
}

function isSkillSourceAlive(skill) {
  return battleState.units.some((unit) => unit.side === skill.side && unit.id === skill.unitId && unit.hp > 0);
}

function isSkillSourceFrozen(skill) {
  const unit = getBattleUnitBySkill(skill);
  return Boolean(unit?.frozen && unit.freezeTurns > 0);
}

function isUnitAlive(side, unitId) {
  return battleState?.units?.some((unit) => unit.side === side && unit.id === unitId && unit.hp > 0) || false;
}

function getTargetUnit(side) {
  return getAliveUnits(side).sort((a, b) =>
    compareTauntPriority(a, b)
    || a.hp / a.maxHp - b.hp / b.maxHp
  )[0] || null;
}

function getLowestHpUnit(side) {
  return getAliveUnits(side).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0] || null;
}

function getLeastStatusUnit(side) {
  return getAliveUnits(side).sort((a, b) =>
    compareTauntPriority(a, b)
    || countBattleStatuses(a) - countBattleStatuses(b)
    || a.hp / a.maxHp - b.hp / b.maxHp
  )[0] || null;
}

function getStatusPreferredUnit(side, statusKeys = []) {
  const units = getAliveUnits(side);
  if (!units.length) return null;
  const tauntedUnits = units.filter((unit) => unit.taunted);
  const pool = tauntedUnits.length ? tauntedUnits : units;
  const ranked = pool
    .map((unit) => ({
      unit,
      missingCount: statusKeys.filter((statusKey) => !hasBattleStatus(unit, statusKey)).length,
    }));
  const maxMissingCount = Math.max(...ranked.map((entry) => entry.missingCount), 0);
  const candidates = maxMissingCount > 0
    ? ranked.filter((entry) => entry.missingCount === maxMissingCount).map((entry) => entry.unit)
    : pool;
  return pickRandom(candidates) || null;
}

function getStatusKeysForSkillTarget(skillType) {
  if (skillType === "stun") return ["stunned"];
  if (skillType === "debuff") return ["debuffed"];
  if (skillType === "charm") return ["charmed"];
  if (skillType === "burn") return ["sleeping", "burning"];
  return [];
}

function hasBattleStatus(unit, statusKey) {
  if (!unit) return false;
  if (statusKey === "boosted") return Boolean(unit.boosted || getSideBoost(unit.side) > 0);
  if (statusKey === "debuffed") return Boolean(unit.debuffed || getSideBoost(unit.side) < 0);
  return Boolean(unit[statusKey]);
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)] || null;
}

function compareTauntPriority(a, b) {
  return Number(Boolean(b?.taunted)) - Number(Boolean(a?.taunted));
}

function countBattleStatuses(unit) {
  if (!unit) return 0;
  return [
    unit.boosted || getSideBoost(unit.side) > 0,
    unit.debuffed || getSideBoost(unit.side) < 0,
    unit.invincible,
    unit.taunted,
    unit.stunned,
    unit.sleeping,
    unit.dreaming,
    unit.nightmared,
    unit.charmed,
    unit.frozen,
    unit.reflecting,
    unit.burning,
  ].filter(Boolean).length;
}

function getAliveUnits(side) {
  return battleState.units.filter((unit) => unit.side === side && unit.hp > 0);
}

function consumeTauntOnTarget(unit, attackerSide) {
  if (!unit?.taunted) return;
  if (attackerSide && attackerSide !== unit.side) {
    unit.tauntConsumed = true;
  }
}

function damageUnit(unit, amount, options = {}) {
  if (amount > 0) {
    consumeTauntOnTarget(unit, options.attackerSide);
  }
  if (isHeroOneHitKoEnabled(unit) && amount > 0) {
    const blocked = unit.shield || 0;
    const damage = unit.hp;
    unit.shield = 0;
    unit.hp = 0;
    unit.hitTimer = 0.32;
    return { damage, blocked };
  }
  if (isHeroInvincibleEnabled(unit)) {
    unit.hitTimer = 0.18;
    return { damage: 0, blocked: 0 };
  }
  if (unit.invincible && amount > 0) {
    if (options.attackerSide && options.attackerSide !== unit.side) {
      unit.invincibleConsumed = true;
    }
    unit.hitTimer = 0.18;
    return { damage: 0, blocked: 0, invincible: true };
  }
  const incoming = Math.max(Math.round(amount * getDamageTakenMultiplier(unit)), 0);
  const blocked = Math.min(unit.shield || 0, incoming);
  const damage = incoming - blocked;
  unit.shield = Math.max((unit.shield || 0) - blocked, 0);
  unit.hp = clamp(unit.hp - damage, 0, unit.maxHp);
  unit.hitTimer = 0.32;
  if (damage > 0 && unit.reflecting && !options.reflected && options.attackerUnit && options.attackerUnit.hp > 0) {
    const reflected = Math.max(1, Math.round(damage * 0.5));
    const reflectedTaken = damageUnit(options.attackerUnit, reflected, {
      wakeSleeping: false,
      reflected: true,
      attackerSide: unit.side,
    });
    addFloatingText(options.attackerUnit, `反射 -${reflectedTaken.damage}`, "#9fffe5", {
      life: 0.9,
      font: "bold 22px 'Segoe UI', 'Noto Sans TC', sans-serif",
      stroke: "rgba(0, 66, 60, 0.88)",
    });
  }
  return { damage, blocked };
}

function getSideBoost(side) {
  return side === "player" ? battleState.playerBoost : battleState.enemyBoost;
}

function hasPlayerPassive(actorId) {
  return battleState?.party?.some((member) => member.key === actorId) || false;
}

function getDamagePassiveMultiplier(skill, target) {
  if (skill.side !== "player") return 1;
  let multiplier = getTitleAttackMultiplier();
  if (hasPlayerPassive("npc3")) multiplier *= 1.1;
  if (skill.unitId === "hero" && isVtuberUnit(target)) multiplier *= 1.2;
  return multiplier;
}

function getUnitDamageOutputMultiplier(unit) {
  return unit?.charmed ? 0.5 : 1;
}

function getDamageTakenMultiplier(unit) {
  return unit?.charmed ? 1.5 : 1;
}

function getUniqueSkillPowerMultiplier(skill) {
  return isUniqueSkill(skill) ? 1.35 : 1;
}

function getRecoveryPassiveMultiplier(skill) {
  return skill.side === "player" && hasPlayerPassive("npc1") ? 1.1 : 1;
}

function isVtuberUnit(unit) {
  return PARTY_STATS[unit?.id]?.race === "VTuber";
}

function syncBattleStatusUnits(side) {
  const boost = getSideBoost(side);
  const boosted = boost > 0;
  const debuffed = boost < 0;
  battleState.units
    .filter((unit) => unit.side === side)
    .forEach((unit) => {
      unit.boosted = boosted && unit.hp > 0;
      unit.debuffed = debuffed && unit.hp > 0;
    });
}

function oppositeSide(side) {
  return side === "player" ? "enemy" : "player";
}

function addBattleEffect(type, source, target, cell, side) {
  const sourcePoint = getBattleUnitPoint(source);
  const targetPoint = getBattleUnitPoint(target || source);
  const effect = SKILL_EFFECT_ASSETS[type] || SKILL_EFFECT_ASSETS.physical;
  battleState.effects.push(createSkillEffect({
    type,
    side,
    cell,
    assetKey: effect.cast,
    x: sourcePoint.x,
    y: sourcePoint.y - 70,
    tx: sourcePoint.x,
    ty: sourcePoint.y - 70,
    size: effect.castSize,
    life: 0.38,
  }));
  if (effect.hit) {
    battleState.effects.push(createSkillEffect({
      type,
      side,
      cell,
      assetKey: effect.hit,
      x: targetPoint.x,
      y: targetPoint.y - 70,
      tx: targetPoint.x,
      ty: targetPoint.y - 70,
      size: effect.hitSize,
      life: 0.42,
      delay: 0.12,
    }));
  }
}

function createSkillEffect({ type, side, cell, assetKey, x, y, tx, ty, size, life, delay = 0 }) {
  return {
    type,
    side,
    cell,
    assetKey,
    x,
    y,
    tx,
    ty,
    size,
    delay,
    life,
    maxLife: life,
    progress: 0,
  };
}

function addBattleCellBurst(cell, color) {
  const rect = getSlotCellRect(cell);
  burst(camera.x + rect.x + rect.size / 2, camera.y + rect.y + rect.size / 2 + 28, color);
}

function addFloatingText(unit, text, color, options = {}) {
  const point = getBattleUnitPoint(unit);
  const yOffset = options.yOffset ?? 112;
  const life = options.life ?? 0.78;
  battleState.floatingTexts.push({
    text,
    color,
    x: point.x,
    y: point.y - yOffset,
    life,
    maxLife: life,
    font: options.font || "bold 22px 'Segoe UI', 'Noto Sans TC', sans-serif",
    stroke: options.stroke || null,
    flash: Boolean(options.flash),
  });
}

function getBattleUnitPoint(unit) {
  if (!unit) return { x: camera.x + canvas.width / 2, y: 620 };
  return unit.actor ? { x: unit.actor.x, y: unit.actor.y } : { x: unit.x, y: unit.y };
}

function createSlotLines() {
  const lines = [];
  for (let row = 0; row < SLOT_SIZE; row += 1) {
    lines.push(Array.from({ length: SLOT_SIZE }, (_, column) => row * SLOT_SIZE + column));
  }
  for (let column = 0; column < SLOT_SIZE; column += 1) {
    lines.push(Array.from({ length: SLOT_SIZE }, (_, row) => row * SLOT_SIZE + column));
  }
  lines.push(Array.from({ length: SLOT_SIZE }, (_, index) => index * SLOT_SIZE + index));
  lines.push(Array.from({ length: SLOT_SIZE }, (_, index) => index * SLOT_SIZE + (SLOT_SIZE - 1 - index)));
  return lines;
}

function drawBattleScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const stop = battleState?.worldStop;
  const stoppedUnitKey = stop ? `${stop.side}:${stop.unitId}` : "";
  if (stop) ctx.filter = "grayscale(1)";
  drawExploreBackground();
  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (stop) ctx.filter = "none";

  const sortedUnits = battleState.units
    .slice()
    .sort((a, b) => getBattleUnitPoint(a).y - getBattleUnitPoint(b).y);
  sortedUnits.forEach((unit) => {
    if (stop && `${unit.side}:${unit.id}` !== stoppedUnitKey) {
      ctx.save();
      ctx.filter = "grayscale(1)";
      drawBattleUnit(unit);
      ctx.restore();
    } else {
      drawBattleUnit(unit);
    }
  });
  if (stop && (battleState.worldStopWarpTimer || 0) > 0) {
    drawWorldStopColorWindow(stop, sortedUnits);
  }
  battleState.units.forEach((unit) => {
    if (stop && `${unit.side}:${unit.id}` !== stoppedUnitKey) {
      ctx.save();
      ctx.filter = "grayscale(1)";
      drawUnitHealthBar(unit);
      ctx.restore();
    } else {
      drawUnitHealthBar(unit);
    }
  });
  if (stop) drawWorldStopWarpOverlay(stop);
  drawBattleEffects();
  drawSharedSlotBoard();
  if (stop) drawWorldStopCountdownOverlay(stop);
  drawWorldStopStartOverlay();
  drawWorldStopReleaseOverlay();
  drawUniqueSkillCutins();
}

function drawWorldStopOverlay(stop) {
  ctx.save();
  ctx.fillStyle = "rgba(5, 8, 14, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f5f7ff";
  ctx.strokeStyle = "rgba(0, 0, 0, 0.75)";
  ctx.lineWidth = 5;
  ctx.font = "900 30px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  const label = `${stop.owner || "時間停止"} 的世界 ${stop.remainingLines}`;
  ctx.strokeText(label, canvas.width - 34, 34);
  ctx.fillText(label, canvas.width - 34, 34);
  ctx.restore();
}

function drawWorldStopCinematicOverlay(stop) {
  const source = battleState.units.find((unit) => unit.side === stop.side && unit.id === stop.unitId);
  const point = getBattleUnitPoint(source);
  const cx = (point?.x ?? camera.x + canvas.width / 2) - camera.x;
  const cy = (point?.y ?? camera.y + canvas.height / 2) - camera.y - 68;
  const time = performance.now() / 1000;
  const seed = battleState.worldStopSeed || 0;
  const impact = clamp((battleState.worldStopImpactTimer || 0) / 0.95, 0, 1);
  const pulse = Math.sin(time * 9 + seed) * 0.5 + 0.5;

  ctx.save();
  ctx.fillStyle = "rgba(5, 8, 18, 0.26)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const vignette = ctx.createRadialGradient(cx, cy, 40, cx, cy, 820);
  vignette.addColorStop(0, "rgba(255, 244, 168, 0.12)");
  vignette.addColorStop(0.28, "rgba(38, 48, 96, 0.16)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.62)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "screen";
  for (let index = 0; index < 4; index += 1) {
    const radius = 86 + index * 54 + ((time * 52 + index * 19) % 44);
    ctx.strokeStyle = `rgba(255, ${220 - index * 18}, 92, ${0.3 - index * 0.035 + pulse * 0.07})`;
    ctx.lineWidth = 4 - index * 0.45;
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius * 1.35, radius * 0.62, -0.18, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.strokeStyle = `rgba(255, 241, 143, ${0.28 + impact * 0.45})`;
  ctx.lineWidth = 2;
  ctx.shadowColor = "rgba(255, 207, 66, 0.95)";
  ctx.shadowBlur = 12 + impact * 28;
  for (let index = 0; index < 18; index += 1) {
    const angle = (index / 18) * Math.PI * 2 + time * 0.38 + seed;
    const inner = 62 + impact * 20;
    const outer = 260 + impact * 150 + (index % 3) * 28;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner * 0.62);
    ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer * 0.62);
    ctx.stroke();
  }

  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 1;
  for (let y = 0; y < canvas.height; y += 6) {
    ctx.beginPath();
    ctx.moveTo(0, y + Math.sin(time * 10 + y * 0.03) * 2);
    ctx.lineTo(canvas.width, y + Math.sin(time * 10 + y * 0.03) * 2);
    ctx.stroke();
  }

  if (impact > 0) {
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = `rgba(255, 255, 255, ${impact * 0.28})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "difference";
    ctx.fillStyle = `rgba(255, 221, 76, ${impact * 0.12})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
  }

  ctx.save();
  ctx.translate(cx, cy - 18);
  ctx.rotate(-0.08 + Math.sin(time * 13) * 0.012);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 74px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.lineWidth = 12;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.9)";
  ctx.shadowColor = "rgba(255, 216, 76, 0.85)";
  ctx.shadowBlur = 24 + pulse * 18;
  ctx.strokeText("世界", 0, -18);
  const titleGradient = ctx.createLinearGradient(-120, -70, 120, 24);
  titleGradient.addColorStop(0, "#fff8b8");
  titleGradient.addColorStop(0.45, "#ffd64f");
  titleGradient.addColorStop(1, "#ff7b2f");
  ctx.fillStyle = titleGradient;
  ctx.fillText("世界", 0, -18);
  ctx.font = "900 24px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.lineWidth = 6;
  ctx.strokeText("THE WORLD", 0, 34);
  ctx.fillStyle = "#f5f7ff";
  ctx.fillText("THE WORLD", 0, 34);
  ctx.restore();

  ctx.fillStyle = "#fff4a0";
  ctx.strokeStyle = "rgba(0, 0, 0, 0.75)";
  ctx.lineWidth = 5;
  ctx.font = "900 28px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  const label = `${stop.owner || "久田親親獸"} 時停 ${stop.remainingLines}`;
  ctx.strokeText(label, canvas.width - 34, 34);
  ctx.fillText(label, canvas.width - 34, 34);
  ctx.restore();
}

function getWorldStopScreenPoint(stop) {
  const source = battleState.units.find((unit) => unit.side === stop.side && unit.id === stop.unitId);
  const point = getBattleUnitPoint(source);
  return {
    x: point.x - camera.x,
    y: point.y - camera.y - (source?.placeholder ? 72 : 58),
  };
}

function getWorldStopWarpProgress() {
  const remaining = clamp((battleState.worldStopWarpTimer || 0) / WORLD_STOP_WARP_TIME, 0, 1);
  return 1 - remaining;
}

function getWorldStopWarpRadius(progress, delay = 0) {
  const localProgress = clamp(progress - delay, 0, 1);
  const maxRadius = Math.hypot(canvas.width, canvas.height) * 0.92;
  const minRadius = 48;
  return minRadius + (maxRadius - minRadius) * Math.pow(1 - localProgress, 1.72);
}

function drawWorldStopColorWindow(stop, sortedUnits) {
  const { x, y } = getWorldStopScreenPoint(stop);
  const progress = getWorldStopWarpProgress();
  const radius = getWorldStopWarpRadius(progress);

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.clip();
  drawExploreBackground();
  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  sortedUnits.forEach(drawBattleUnit);
  battleState.units.forEach(drawUnitHealthBar);
  ctx.restore();
}

function drawWorldStopWarpOverlay(stop) {
  if (!battleState?.worldStopWarpTimer) return;
  const { x, y } = getWorldStopScreenPoint(stop);
  const progress = getWorldStopWarpProgress();
  const time = performance.now() / 1000;
  const seed = battleState.worldStopSeed || 0;
  const impact = clamp((battleState.worldStopImpactTimer || 0) / 0.95, 0, 1);

  ctx.save();
  ctx.fillStyle = `rgba(0, 0, 0, ${0.08 + progress * 0.12})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "screen";
  for (let index = 0; index < 7; index += 1) {
    const delay = index * 0.055;
    const local = clamp(progress - delay, 0, 1);
    const radius = getWorldStopWarpRadius(progress, delay);
    const alpha = clamp(0.62 - local * 0.44 + Math.sin(time * 13 + index + seed) * 0.06, 0, 0.7);
    const squash = 0.66 + Math.sin(time * 4.7 + index) * 0.035;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.12 + Math.sin(seed + index) * 0.18);
    ctx.strokeStyle = `rgba(255, ${232 - index * 9}, ${118 + index * 10}, ${alpha})`;
    ctx.lineWidth = Math.max(2, 7 - index * 0.65);
    ctx.shadowColor = "rgba(255, 221, 92, 0.92)";
    ctx.shadowBlur = 18 + (1 - local) * 18;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * (1.08 + index * 0.018), radius * squash, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 1;
  for (let line = 0; line < 14; line += 1) {
    const angle = (line / 14) * Math.PI * 2 + time * 0.6;
    const inner = 34 + progress * 24;
    const outer = getWorldStopWarpRadius(progress, line * 0.025);
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * inner, y + Math.sin(angle) * inner);
    ctx.lineTo(x + Math.cos(angle) * outer, y + Math.sin(angle) * outer);
    ctx.stroke();
  }

  if (impact > 0) {
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = `rgba(255, 255, 255, ${impact * 0.18})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.restore();
}

function drawWorldStopCountdownOverlay(stop) {
  const isPlayerSide = stop.side === "player";
  const color = isPlayerSide ? "#64e6ff" : "#ff647d";
  const glow = isPlayerSide ? "rgba(84, 225, 255, 0.8)" : "rgba(255, 90, 118, 0.78)";
  const label = `倒數 ${Math.max(0, stop.remainingLines)} 回合`;
  const x = canvas.width / 2;
  const y = 28;
  const width = 390;
  const height = 54;

  ctx.save();
  ctx.globalAlpha = 0.94;
  ctx.shadowColor = glow;
  ctx.shadowBlur = 16;
  ctx.fillStyle = "rgba(4, 8, 18, 0.82)";
  roundRect(x - width / 2, y, width, height, 16);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  roundRect(x - width / 2, y, width, height, 16);
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 24px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.84)";
  ctx.fillStyle = color;
  ctx.strokeText(label, x, y + height / 2 + 1);
  ctx.fillText(label, x, y + height / 2 + 1);
  ctx.restore();
}

function drawWorldStopStartOverlay() {
  const timer = battleState?.worldStopStartTimer || 0;
  if (timer <= 0) return;
  drawWorldStopCenterMessage("時間停止流動", timer, 1.35, "#fff2a8");
}

function drawWorldStopReleaseOverlay() {
  const timer = battleState?.worldStopReleaseTimer || 0;
  if (timer <= 0) return;
  drawWorldStopCenterMessage("時間再次流動", timer, 1.35, "#f7f7ff");
}

function drawWorldStopCenterMessage(text, timer, duration, color) {
  const progress = 1 - clamp(timer / duration, 0, 1);
  const alpha = Math.sin(progress * Math.PI);
  const scale = 0.88 + easeOutCubic(clamp(progress / 0.42, 0, 1)) * 0.12;
  const x = canvas.width / 2;
  const y = canvas.height * 0.35;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 46px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.lineWidth = 10;
  ctx.shadowColor = "rgba(255, 255, 255, 0.78)";
  ctx.shadowBlur = 24;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.88)";
  ctx.fillStyle = color;
  ctx.strokeText(text, 0, 0);
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function drawSimpleBoar(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = "#7a4b34";
  ctx.beginPath();
  ctx.ellipse(0, 0, 130, 92, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#8f5a41";
  ctx.beginPath();
  ctx.ellipse(-65, -30, 42, 30, -0.2, 0, Math.PI * 2);
  ctx.ellipse(55, -42, 46, 34, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f3e1d6";
  ctx.beginPath();
  ctx.arc(70, 4, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2a1c17";
  ctx.beginPath();
  ctx.arc(64, -2, 3.5, 0, Math.PI * 2);
  ctx.arc(78, -2, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBattleUnit(unit) {
  const point = getBattleUnitPoint(unit);
  const screenX = point.x - camera.x + Math.sin(unit.hitTimer * 42) * unit.hitTimer * 18;
  const screenY = point.y - camera.y;

  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  ctx.beginPath();
  ctx.ellipse(0, 18, unit.placeholder ? 86 : 30, unit.placeholder ? 24 : 12, 0, 0, Math.PI * 2);
  ctx.fill();
  if ((unit.uniqueGlowTimer || 0) > 0) {
    drawBattleUnitUniqueGlow(unit);
  }

  if (unit.actor) {
    const nudge = unit.actionTimer > 0 ? Math.sin(unit.actionTimer * 34) * (unit.side === "player" ? 10 : -10) : 0;
    ctx.translate(nudge, 0);
    drawSpriteFrame(unit.actor.sprite, getBattleFrame(unit), 0, 0, 1);
  } else {
    const nudge = unit.actionTimer > 0 ? Math.sin(unit.actionTimer * 34) * -12 : 0;
    drawSimpleBoar(nudge, 0, 0.72);
  }
  drawBattleUnitName(unit, 0, unit.placeholder ? 74 : 48);
  ctx.restore();
}

function drawBattleUnitUniqueGlow(unit) {
  const remaining = clamp((unit.uniqueGlowTimer || 0) / UNIQUE_CASTER_GLOW_TIME, 0, 1);
  const pulse = Math.sin(performance.now() / 65) * 0.5 + 0.5;
  const visualHeight = unit.placeholder ? 118 : getBattleUnitVisualHeight(unit);
  const centerY = -visualHeight * 0.48;
  const radiusX = unit.placeholder ? 92 : Math.max(48, visualHeight * 0.46);
  const radiusY = unit.placeholder ? 78 : Math.max(48, visualHeight * 0.5);
  const alpha = remaining * (0.58 + pulse * 0.24);

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = alpha;
  const aura = ctx.createRadialGradient(0, centerY, 8, 0, centerY, radiusX * 1.35);
  aura.addColorStop(0, "rgba(255, 255, 255, 0.95)");
  aura.addColorStop(0.28, "rgba(255, 229, 116, 0.82)");
  aura.addColorStop(0.62, unit.side === "player" ? "rgba(98, 233, 255, 0.34)" : "rgba(255, 93, 114, 0.34)");
  aura.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.ellipse(0, centerY, radiusX * (1.05 + pulse * 0.08), radiusY * (1.02 + pulse * 0.1), 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 237, 138, 0.9)";
  ctx.lineWidth = 3;
  ctx.shadowColor = "rgba(255, 211, 90, 0.95)";
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.ellipse(0, 16, radiusX * 0.55, 12 + pulse * 4, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 2;
  for (let index = 0; index < 9; index += 1) {
    const angle = (index / 9) * Math.PI * 2 + performance.now() / 360;
    const start = radiusX * 0.28;
    const end = radiusX * (0.82 + pulse * 0.16);
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * start, centerY + Math.sin(angle) * start);
    ctx.lineTo(Math.cos(angle) * end, centerY + Math.sin(angle) * end);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBattleUnitName(unit, x, y) {
  const text = unit.label;
  ctx.save();
  ctx.font = "bold 18px 'Segoe UI', 'Noto Sans TC', sans-serif";
  const width = Math.max(ctx.measureText(text).width + 24, 72);
  ctx.fillStyle = "rgba(0, 0, 0, 0.58)";
  ctx.fillRect(x - width / 2, y, width, 28);
  ctx.strokeStyle = unit.side === "player" ? "rgba(98, 233, 255, 0.72)" : "rgba(255, 93, 114, 0.72)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x - width / 2 + 0.5, y + 0.5, width - 1, 27);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y + 14);
  ctx.restore();
}

function drawUnitHealthBar(unit) {
  const point = getBattleUnitPoint(unit);
  const screenX = point.x - camera.x;
  const visualHeight = getBattleUnitVisualHeight(unit);
  const screenY = point.y - camera.y - visualHeight - 16;
  const width = unit.placeholder ? 128 : 96;
  const height = 8;
  const ratio = clamp(unit.hp / unit.maxHp, 0, 1);
  const shield = Math.max(unit.shield || 0, 0);
  const shieldRatio = clamp(shield / unit.maxHp, 0, 0.55);
  const totalWidth = width + width * shieldRatio;
  const startX = screenX - totalWidth / 2;

  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.62)";
  ctx.fillRect(startX, screenY, totalWidth, height);
  ctx.fillStyle = unit.side === "player" ? "#62e9ff" : "#ff5d72";
  ctx.fillRect(startX, screenY, width * ratio, height);
  if (shield > 0) {
    ctx.fillStyle = "#ffd86b";
    ctx.fillRect(startX + width, screenY, width * shieldRatio, height);
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.82)";
  ctx.lineWidth = 1;
  ctx.strokeRect(startX + 0.5, screenY + 0.5, totalWidth - 1, height - 1);
  if (shield > 0) {
    ctx.strokeStyle = "rgba(255, 216, 107, 0.9)";
    ctx.strokeRect(startX + width + 0.5, screenY + 0.5, width * shieldRatio - 1, height - 1);
  }
  ctx.fillStyle = shield > 0 ? "#ffd86b" : "#ffffff";
  ctx.font = "bold 17px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.textAlign = "center";
  const label = shield > 0 ? `${Math.ceil(unit.hp + shield)}/${unit.maxHp}` : `${Math.ceil(unit.hp)}/${unit.maxHp}`;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.78)";
  ctx.lineWidth = 4;
  ctx.strokeText(label, screenX, screenY - 7);
  ctx.fillText(label, screenX, screenY - 7);
  drawUnitStatusIcons(unit, screenX, screenY - 34);
  ctx.restore();
}

function getBattleUnitVisualHeight(unit) {
  if (!unit?.actor) return 118;
  const sprite = SPRITES[unit.actor.sprite];
  const frame = getBattleFrame(unit);
  const metrics = getSpriteFrameRenderMetrics(unit.actor.sprite, frame, 1);
  if (metrics) return metrics.visualHeight;
  return sprite?.drawHeight || sprite?.frameHeight || 112;
}

function drawUnitStatusIcons(unit, x, y) {
  if (!unit || unit.hp <= 0) return;
  const icons = [];
  if (unit.boosted || getSideBoost(unit.side) > 0) icons.push("boost");
  if (unit.debuffed || getSideBoost(unit.side) < 0) icons.push("debuff");
  if (unit.invincible) icons.push("invincible");
  if (unit.taunted) icons.push("taunt");
  if (unit.stunned) icons.push("stun");
  if (unit.sleeping) icons.push("sleep");
  if (unit.dreaming) icons.push("dream");
  if (unit.nightmared) icons.push("nightmare");
  if (unit.charmed) icons.push("charm");
  if (unit.frozen) icons.push("freeze");
  if (unit.reflecting) icons.push("reflect");
  if (unit.burning) icons.push("burn");
  const startX = x - ((icons.length - 1) * 26) / 2;
  icons.forEach((type, index) => drawUnitStatusIcon(type, startX + index * 26, y));
}

function drawUnitStatusIcon(type, x, y) {
  const pulse = Math.sin(performance.now() / 120) * 0.5 + 0.5;
  const isBoost = type === "boost";
  const isStun = type === "stun";
  const isInvincible = type === "invincible";
  const isTaunt = type === "taunt";
  const isSleep = type === "sleep";
  const isDream = type === "dream";
  const isNightmare = type === "nightmare";
  const isCharm = type === "charm";
  const isFreeze = type === "freeze";
  const isReflect = type === "reflect";
  const isBurn = type === "burn";
  const color = isInvincible
    ? "#8ff5ff"
    : isTaunt
      ? "#ffb15f"
    : isSleep
      ? "#9fd7ff"
      : isDream
        ? "#8fffc2"
        : isNightmare
          ? "#8fa2ff"
          : isCharm
            ? "#ff9fd7"
            : isFreeze
              ? "#bcecff"
              : isReflect
                ? "#9fffe5"
            : isBurn
              ? "#ff9b45"
              : (isBoost || isStun ? "#ffe16f" : "#cda2ff");
  const darkColor = isInvincible
    ? "#073342"
    : isTaunt
      ? "#4c2100"
    : isSleep
      ? "#12324f"
      : isDream
        ? "#064022"
        : isNightmare
          ? "#111b54"
          : isCharm
            ? "#4a0636"
            : isFreeze
              ? "#10395c"
              : isReflect
                ? "#064238"
            : isBurn
              ? "#4c2100"
              : (isBoost || isStun ? "#4b2f00" : "#24113f");
  const shadowColor = isInvincible
    ? "rgba(143, 245, 255, 0.9)"
    : isTaunt
      ? "rgba(255, 177, 95, 0.9)"
    : isSleep
      ? "rgba(159, 215, 255, 0.9)"
      : isDream
        ? "rgba(143, 255, 194, 0.9)"
        : isNightmare
          ? "rgba(143, 162, 255, 0.9)"
          : isCharm
            ? "rgba(255, 159, 215, 0.9)"
            : isFreeze
              ? "rgba(188, 236, 255, 0.9)"
              : isReflect
                ? "rgba(159, 255, 229, 0.9)"
            : isBurn
              ? "rgba(255, 155, 69, 0.9)"
              : (isBoost || isStun ? "rgba(255, 225, 111, 0.9)" : "rgba(205, 162, 255, 0.9)");
  const strokeColor = isInvincible
    ? "rgba(15, 96, 111, 0.78)"
    : isTaunt
      ? "rgba(116, 60, 12, 0.78)"
    : isSleep
      ? "rgba(15, 70, 118, 0.78)"
      : isDream
        ? "rgba(15, 92, 51, 0.78)"
        : isNightmare
          ? "rgba(32, 42, 112, 0.78)"
          : isCharm
            ? "rgba(92, 12, 69, 0.78)"
            : isFreeze
              ? "rgba(18, 70, 112, 0.78)"
              : isReflect
                ? "rgba(10, 90, 78, 0.78)"
            : isBurn
              ? "rgba(117, 46, 0, 0.78)"
              : (isBoost || isStun ? "rgba(77, 45, 0, 0.72)" : "rgba(48, 21, 82, 0.78)");

  ctx.save();
  ctx.translate(x, y);
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = 10 + pulse * 8;
  ctx.fillStyle = color;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 11 + pulse * 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = darkColor;
  if (isInvincible || isTaunt || isStun || isSleep || isDream || isNightmare || isCharm || isFreeze || isReflect || isBurn) {
    ctx.font = "bold 15px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const label = isInvincible ? "無" : isTaunt ? "嘲" : isStun ? "暈" : isSleep ? "睡" : isDream ? "夢" : isNightmare ? "魘" : isCharm ? "魅" : isFreeze ? "冰" : isReflect ? "反" : "燒";
    ctx.fillText(label, 0, 1);
  } else {
    ctx.beginPath();
    if (isBoost) {
    ctx.moveTo(0, -7);
    ctx.lineTo(7, 1);
    ctx.lineTo(3, 1);
    ctx.lineTo(3, 7);
    ctx.lineTo(-3, 7);
    ctx.lineTo(-3, 1);
    ctx.lineTo(-7, 1);
    } else {
    ctx.moveTo(0, 7);
    ctx.lineTo(7, -1);
    ctx.lineTo(3, -1);
    ctx.lineTo(3, -7);
    ctx.lineTo(-3, -7);
    ctx.lineTo(-3, -1);
    ctx.lineTo(-7, -1);
    }
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawSharedSlotBoard() {
  const grid = assets.battleGrid;
  if (isRenderableImage(grid)) {
    ctx.drawImage(grid, SLOT_BOARD.x, SLOT_BOARD.y, SLOT_BOARD.width, SLOT_BOARD.height);
  } else {
    ctx.fillStyle = "rgba(0, 0, 0, 0.58)";
    ctx.fillRect(SLOT_BOARD.x, SLOT_BOARD.y, SLOT_BOARD.width, SLOT_BOARD.height);
  }

  for (let row = 0; row < SLOT_SIZE; row += 1) {
    drawSlotRow(row);
  }
  drawWinningLines();
  drawXiaoDomainLines();
  if (battleState.phase === "miss") {
    drawBattleMiss();
  }
  drawBattleResultLabel();
}

function drawBattleTutorialOverlay() {
  const state = battleTutorialState;
  if (!state?.active) return;

  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(5, 10, 24, 0.88)";
  roundRect(222, 12, 836, 696, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(117, 244, 178, 0.42)";
  ctx.lineWidth = 2;
  ctx.stroke();

  drawBattleTutorialBoard();
  drawBattleTutorialCaption();
  ctx.restore();
}

function drawBattleTutorialBoard() {
  if (battleTutorialState.step === 0) {
    drawBattleTutorialOpening();
    return;
  }

  if (battleTutorialState.step === 1) {
    drawBattleTutorialTypeIntro();
    return;
  }

  const grid = assets.battleGrid;
  if (isRenderableImage(grid)) {
    ctx.drawImage(grid, SLOT_BOARD.x, SLOT_BOARD.y, SLOT_BOARD.width, SLOT_BOARD.height);
  } else {
    ctx.fillStyle = "rgba(0, 0, 0, 0.58)";
    ctx.fillRect(SLOT_BOARD.x, SLOT_BOARD.y, SLOT_BOARD.width, SLOT_BOARD.height);
  }

  if (battleTutorialState.step === 2) {
    for (let row = 0; row < SLOT_SIZE; row += 1) {
      drawBattleTutorialRollingRow(row);
    }
    drawBattleTutorialStopMarkers();
    return;
  }

  const gridSkills = getBattleTutorialSampleGrid(battleTutorialState.step);
  const line = getBattleTutorialLine(battleTutorialState.step);
  const matchedCells = line?.cells || [];
  const activeCell = matchedCells.length
    ? matchedCells[Math.floor((battleTutorialState.timer / 0.36) % matchedCells.length)]
    : -1;

  gridSkills.forEach((skill, index) => {
    drawBattleTutorialCell(index, skill, getSlotCellRect(index), {
      matched: matchedCells.includes(index),
      active: activeCell === index,
    });
  });

  if (line) {
    drawBattleTutorialLine(line);
  } else {
    drawBattleTutorialMiss();
  }
}

function drawWrappedCenterText(text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const previousAlign = ctx.textAlign;
  ctx.textAlign = "center";
  const lines = [];
  let line = "";
  for (const char of String(text ?? "")) {
    const nextLine = line + char;
    if (line && ctx.measureText(nextLine).width > maxWidth) {
      lines.push(line);
      line = char;
      if (lines.length >= maxLines) break;
    } else {
      line = nextLine;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  lines.forEach((entry, index) => {
    ctx.fillText(entry, x, y + index * lineHeight);
  });
  ctx.textAlign = previousAlign;
}

function drawBattleTutorialOpening() {
  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffe16f";
  ctx.font = "900 42px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText("戰鬥即將開始", 640, 210);

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "bold 28px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText("接下來即將觸發戰鬥", 640, 292);
  ctx.fillText("本遊戲戰鬥將透過拉霸機決定攻擊招式", 640, 334);
  ctx.restore();
}

function drawBattleTutorialTypeIntro() {
  const types = [
    { type: "physical", name: "物攻", note: "造成物理傷害" },
    { type: "magic", name: "魔攻", note: "造成魔法傷害" },
    { type: "guard", name: "護盾", note: "增加護盾值" },
    { type: "heal", name: "治療", note: "回復 HP" },
    { type: "poison", name: "中毒/燒傷", note: "持續扣血" },
    { type: "stun", name: "暈眩", note: "使技能失效一次" },
    { type: "support", name: "增益", note: "強化我方" },
    { type: "debuff", name: "減益", note: "削弱敵方" },
  ];

  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffe16f";
  ctx.font = "900 34px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText("格子種類", 640, 88);

  const startX = 328;
  const startY = 142;
  const gapX = 162;
  const gapY = 176;
  types.forEach((entry, index) => {
    const col = index % 4;
    const row = Math.floor(index / 4);
    const x = startX + col * gapX;
    const y = startY + row * gapY;
    const skill = createBattleTutorialSkill("neutral", "hero", entry.type, entry.name);
    drawBattleTutorialTypeCell(skill, { x, y, size: 74 });
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 21px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText(entry.name, x + 37, y + 104);
    ctx.fillStyle = "rgba(255,255,255,0.64)";
    ctx.font = "16px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText(entry.note, x + 37, y + 130);
  });

  const uniqueSkill = createBattleTutorialSkill("player", "npc3", "support", "獨特技能", true);
  drawBattleTutorialTypeCell(uniqueSkill, { x: 446, y: 494, size: 74 });
  ctx.fillStyle = "#ffd35a";
  ctx.font = "900 22px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText("獨特技能", 483, 590);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "17px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText("盤面上很少出現", 483, 616);

  drawBattleTutorialSideSample("player", 624, 494, "我方");
  drawBattleTutorialSideSample("enemy", 766, 494, "敵方");
  ctx.restore();
}

function drawBattleTutorialTypeCell(skill, rect) {
  ctx.save();
  const fallbackGradient = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.size);
  fallbackGradient.addColorStop(0, "#263247");
  fallbackGradient.addColorStop(1, "#0a1020");
  ctx.fillStyle = fallbackGradient;
  ctx.fillRect(rect.x, rect.y, rect.size, rect.size);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.68)";
  ctx.lineWidth = 3;
  ctx.strokeRect(rect.x + 1, rect.y + 1, rect.size - 2, rect.size - 2);
  drawLargeSkillIcon(skill, rect);
  if (isUniqueSkill(skill)) {
    drawPlayerUniqueSlotHighlight(rect, 0.55, true);
  }
  ctx.restore();
}

function drawBattleTutorialSideSample(side, x, y, label) {
  const skill = createBattleTutorialSkill(side, side === "player" ? "hero" : "npc32", "physical", label);
  const rect = { x, y, size: 74 };
  drawBattleTutorialCell(200 + x, skill, rect, {});
  ctx.fillStyle = side === "player" ? SIDE_STYLE.player.color : SIDE_STYLE.enemy.color;
  ctx.font = "900 22px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText(label, x + 37, y + 96);
}

function drawBattleTutorialRollingRow(row) {
  const state = battleTutorialState;
  const first = getSlotCellRect(row * SLOT_SIZE);
  const step = getSlotStepX();
  const rowIsMoving = row >= state.stoppedRows;
  const offset = rowIsMoving ? state.rowOffsets[row] : 0;
  const rowSkills = state.rows[row] || [];
  const clipPad = 3;

  ctx.save();
  ctx.beginPath();
  ctx.rect(first.x - clipPad, first.y - 4, step * (SLOT_SIZE - 1) + first.size + clipPad * 2, first.size + 8);
  ctx.clip();

  for (let col = 0; col <= SLOT_SIZE; col += 1) {
    const skill = rowSkills[col] || rowSkills[0];
    const rect = {
      ...first,
      x: first.x + (col - offset) * step,
    };
    drawBattleTutorialCell(row * SLOT_SIZE + col, skill, rect, {
      spinning: rowIsMoving && col < SLOT_SIZE,
      matched: row < state.stoppedRows,
      active: row === state.stoppedRows && col < SLOT_SIZE,
    });
  }
  ctx.restore();
}

function drawBattleTutorialCell(index, skill, rect, options = {}) {
  if (!skill) return;
  const isVisibleCell = index >= 0 && index < SLOT_SIZE * SLOT_SIZE;
  const isMatched = isVisibleCell && options.matched;
  const isActive = isVisibleCell && options.active;
  const pulse = Math.sin(performance.now() / 95) * 0.5 + 0.5;
  const style = SIDE_STYLE[skill.side] || SIDE_STYLE.player;
  const isPlayerUniqueCell = skill.side === "player" && isUniqueSkill(skill);
  const isEnemyUniqueCell = skill.side === "enemy" && isUniqueSkill(skill);
  const borderColor = isPlayerUniqueCell ? "#ffd35a" : style.color;

  ctx.save();
  if (isMatched || isActive || isPlayerUniqueCell) {
    ctx.shadowColor = isPlayerUniqueCell ? "rgba(255, 211, 90, 0.96)" : style.glow;
    ctx.shadowBlur = isActive ? 42 : isMatched ? 22 + pulse * 12 : 18 + pulse * 10;
  }
  const worldStoppedOtherSkill = isSkillMutedByWorldStop(skill);
  if (worldStoppedOtherSkill) ctx.filter = "grayscale(1)";
  drawSkillIcon(skill, rect);
  if (worldStoppedOtherSkill) ctx.filter = "none";
  if (isPlayerUniqueCell) {
    drawPlayerUniqueSlotHighlight(rect, pulse, isActive || isMatched);
  } else if (isEnemyUniqueCell) {
    drawEnemyUniqueSlotMark(rect);
  }
  if (isMatched || isActive) {
    ctx.fillStyle = isActive ? "rgba(255, 255, 255, 0.22)" : `${style.glow.replace("0.72", "0.18")}`;
    ctx.fillRect(rect.x + 3, rect.y + 3, rect.size - 6, rect.size - 6);
  }
  ctx.lineWidth = isActive ? 10 : isMatched || isPlayerUniqueCell ? 8 : 6;
  ctx.strokeStyle = borderColor;
  ctx.strokeRect(rect.x + 1, rect.y + 1, rect.size - 2, rect.size - 2);
  if (options.spinning) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(rect.x, rect.y, rect.size, rect.size);
  }
  ctx.restore();
}

function drawBattleTutorialLine(line) {
  const pulse = Math.sin(performance.now() / 80) * 0.5 + 0.5;
  const first = getSlotCellRect(line.cells[0]);
  const last = getSlotCellRect(line.cells[line.cells.length - 1]);
  const style = SIDE_STYLE[line.side] || SIDE_STYLE.player;

  ctx.save();
  ctx.strokeStyle = style.color;
  ctx.lineWidth = 9 + pulse * 7;
  ctx.shadowColor = style.glow;
  ctx.shadowBlur = 26 + pulse * 18;
  ctx.beginPath();
  ctx.moveTo(first.x + first.size / 2, first.y + first.size / 2);
  ctx.lineTo(last.x + last.size / 2, last.y + last.size / 2);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = style.color;
  ctx.strokeStyle = "rgba(0,0,0,0.8)";
  ctx.lineWidth = 6;
  ctx.font = "900 30px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.strokeText(line.label, SLOT_BOARD.x + SLOT_BOARD.width / 2, SLOT_BOARD.y + SLOT_BOARD.height + 48);
  ctx.fillText(line.label, SLOT_BOARD.x + SLOT_BOARD.width / 2, SLOT_BOARD.y + SLOT_BOARD.height + 48);
  ctx.restore();
}

function drawBattleTutorialMiss() {
  const pulse = Math.sin(performance.now() / 100) * 0.5 + 0.5;
  ctx.save();
  ctx.textAlign = "center";
  ctx.font = "900 72px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillStyle = `rgba(255, 255, 255, ${0.76 + pulse * 0.18})`;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.84)";
  ctx.lineWidth = 8;
  ctx.shadowColor = "rgba(255, 255, 255, 0.48)";
  ctx.shadowBlur = 20 + pulse * 16;
  ctx.strokeText("MISS", SLOT_BOARD.x + SLOT_BOARD.width / 2, SLOT_BOARD.y + SLOT_BOARD.height + 56);
  ctx.fillText("MISS", SLOT_BOARD.x + SLOT_BOARD.width / 2, SLOT_BOARD.y + SLOT_BOARD.height + 56);
  ctx.font = "900 28px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.strokeStyle = "rgba(0, 0, 0, 0.84)";
  ctx.lineWidth = 5;
  ctx.strokeText("沒有五格連線時，不會發動技能", SLOT_BOARD.x + SLOT_BOARD.width / 2, SLOT_BOARD.y + SLOT_BOARD.height + 96);
  ctx.fillText("沒有五格連線時，不會發動技能", SLOT_BOARD.x + SLOT_BOARD.width / 2, SLOT_BOARD.y + SLOT_BOARD.height + 96);
  ctx.restore();
}

function drawBattleTutorialStopMarkers() {
  const state = battleTutorialState;
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let row = 0; row < SLOT_SIZE; row += 1) {
    const rect = getSlotCellRect(row * SLOT_SIZE);
    const done = row < state.stoppedRows;
    const current = row === state.stoppedRows;
    ctx.fillStyle = done ? "rgba(117, 244, 178, 0.88)" : current ? "rgba(255, 225, 111, 0.92)" : "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.arc(SLOT_BOARD.x + 78, rect.y + rect.size / 2, current ? 18 : 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = done ? "#04101a" : "#ffffff";
    ctx.font = "900 17px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText(done ? "✓" : row + 1, SLOT_BOARD.x + 78, rect.y + rect.size / 2 + 1);
  }
  ctx.restore();
}

function drawBattleTutorialCaption() {
  const step = battleTutorialState.step;
  if (step < 2 || step >= 3) return;
  const captions = {
    2: { title: "Z", body: `停止第 ${Math.min(battleTutorialState.stoppedRows + 1, SLOT_SIZE)} 排`, color: "#ffe16f" },
  };
  const caption = captions[step] || captions[0];

  ctx.save();
  ctx.fillStyle = "rgba(4, 8, 20, 0.92)";
  roundRect(352, 586, 576, 84, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.fillStyle = caption.color;
  ctx.font = "900 28px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText(caption.title, 640, 618);
  ctx.fillStyle = "rgba(255,255,255,0.86)";
  ctx.font = "bold 22px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText(caption.body, 640, 650);
  ctx.fillStyle = "rgba(255,255,255,0.52)";
  ctx.font = "17px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.restore();
}

function drawSlotRow(row) {
  const first = getSlotCellRect(row * SLOT_SIZE);
  const step = getSlotStepX();
  const rowIsMoving = battleState.phase === "spin" && row >= battleState.stoppedRows;
  const offset = rowIsMoving ? battleState.rowOffsets[row] : 0;
  const rowSkills = battleState.slotRows[row] || [];
  const clipPad = 3;

  ctx.save();
  ctx.beginPath();
  ctx.rect(first.x - clipPad, first.y - 4, step * (SLOT_SIZE - 1) + first.size + clipPad * 2, first.size + 8);
  ctx.clip();

  for (let col = 0; col <= SLOT_SIZE; col += 1) {
    const skill = rowSkills[col] || pickRandomSkill();
    const rect = {
      ...first,
      x: first.x + (col - offset) * step,
    };
    const index = col < SLOT_SIZE ? row * SLOT_SIZE + col : -1;
    drawSlotCell(index, skill, rect, rowIsMoving && col < SLOT_SIZE);
  }
  ctx.restore();
}

function drawSlotCell(index, skill, rect, isSpinning) {
  if (!skill) return;
  const isVisibleCell = index >= 0 && index < SLOT_SIZE * SLOT_SIZE;
  const isMatched = isVisibleCell && battleState.matchedCells.includes(index);
  const isActive = battleState.activeCell === index;
  const isStunnedCell = isVisibleCell && (isMatched || isActive) && isSkillSourceStunned(skill);
  const isSleepBlockedCell = isSkillBlockedBySleep(skill, index);
  const isSleepBlockedActiveCell = isVisibleCell && (isMatched || isActive) && isSleepBlockedCell;
  const isXiaoDomainCell = isVisibleCell && battleState.xiaoDomainCells?.includes(index);
  const isPlayerUniqueCell = skill.side === "player" && isUniqueSkill(skill) && !isSleepBlockedCell;
  const isEnemyUniqueCell = skill.side === "enemy" && isUniqueSkill(skill) && !isSleepBlockedCell;
  const pulse = Math.sin(performance.now() / 95) * 0.5 + 0.5;
  const style = SIDE_STYLE[skill.side];
  const borderColor = isStunnedCell
    ? "#ffe16f"
    : isSleepBlockedActiveCell
      ? "#9fd7ff"
      : isXiaoDomainCell
        ? XIAO_DOMAIN_COLOR
        : isPlayerUniqueCell
          ? "#ffd35a"
          : style.color;
  const glowColor = isStunnedCell
    ? "rgba(255, 225, 111, 0.92)"
    : isSleepBlockedActiveCell
      ? "rgba(159, 215, 255, 0.92)"
      : isXiaoDomainCell
        ? "rgba(180, 92, 255, 0.95)"
        : isPlayerUniqueCell
          ? "rgba(255, 211, 90, 0.96)"
          : style.glow;

  ctx.save();
  if (isMatched || isActive || isPlayerUniqueCell || isSleepBlockedCell) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = isActive ? 42 : isPlayerUniqueCell ? 24 + pulse * 14 : isSleepBlockedCell ? 14 + pulse * 8 : 16 + pulse * 12;
  }
  const worldStoppedOtherSkill = isSkillMutedByWorldStop(skill);
  if (worldStoppedOtherSkill) ctx.filter = "grayscale(1)";
  drawSkillIcon(skill, rect);
  if (worldStoppedOtherSkill) ctx.filter = "none";
  if (isPlayerUniqueCell) {
    drawPlayerUniqueSlotHighlight(rect, pulse, isActive || isMatched);
  } else if (isEnemyUniqueCell) {
    drawEnemyUniqueSlotMark(rect);
  }
  if (isSleepBlockedCell) {
    drawSleepBlockedSlot(rect, pulse, isActive || isMatched);
  }
  if (isXiaoDomainCell) {
    ctx.fillStyle = "rgba(180, 92, 255, 0.22)";
    ctx.fillRect(rect.x + 2, rect.y + 2, rect.size - 4, rect.size - 4);
  }
  if (isActive) {
    ctx.fillStyle = isStunnedCell
      ? "rgba(255, 225, 111, 0.2)"
      : isSleepBlockedActiveCell
        ? "rgba(159, 215, 255, 0.24)"
        : isXiaoDomainCell
          ? "rgba(220, 178, 255, 0.3)"
          : isPlayerUniqueCell
            ? "rgba(255, 211, 90, 0.24)"
            : "rgba(255, 255, 255, 0.18)";
    ctx.fillRect(rect.x + 2, rect.y + 2, rect.size - 4, rect.size - 4);
  }
  ctx.lineWidth = isActive ? 10 : isMatched || isPlayerUniqueCell || isSleepBlockedCell ? 8 : 6;
  ctx.strokeStyle = borderColor;
  ctx.strokeRect(rect.x + 1, rect.y + 1, rect.size - 2, rect.size - 2);
  if (isActive) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.86)";
    ctx.strokeRect(rect.x + 8, rect.y + 8, rect.size - 16, rect.size - 16);
  }
  if (isSpinning) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.09)";
    ctx.fillRect(rect.x, rect.y, rect.size, rect.size);
  }
  ctx.restore();
}

function isSkillSourceStunned(skill) {
  const unit = getBattleUnitBySkill(skill);
  return Boolean(unit?.stunned);
}

function isSkillBlockedBySleep(skill, cell) {
  if (!isSleepBlockedCell(cell)) return false;
  const unit = getBattleUnitBySkill(skill);
  return Boolean(unit?.sleeping && unit.sleepTurns > 0);
}

function isSkillMutedByWorldStop(skill) {
  const stop = battleState?.worldStop;
  if (!stop || !skill) return false;
  return !(skill.side === stop.side && skill.unitId === stop.unitId);
}

function isSleepBlockedCell(cell) {
  return cell >= 0 && battleState?.sleepBlockedCells?.includes(cell);
}

function getBattleUnitBySkill(skill) {
  if (!battleState || !skill) return null;
  return battleState.units.find((unit) => unit.side === skill.side && unit.id === skill.unitId) || null;
}

function drawPlayerUniqueSlotHighlight(rect, pulse, isEmphasized = false) {
  const glowAlpha = isEmphasized ? 0.34 : 0.18 + pulse * 0.12;

  ctx.save();
  ctx.shadowColor = "rgba(255, 211, 90, 0.95)";
  ctx.shadowBlur = 18 + pulse * 10;
  ctx.strokeStyle = `rgba(255, 235, 145, ${0.78 + pulse * 0.18})`;
  ctx.lineWidth = 3;
  ctx.strokeRect(rect.x + 6, rect.y + 6, rect.size - 12, rect.size - 12);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = `rgba(255, 211, 90, ${glowAlpha})`;
  ctx.fillRect(rect.x + 3, rect.y + 3, rect.size - 6, rect.size - 6);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x + 4, rect.y + 4, rect.size - 8, rect.size - 8);
  ctx.clip();
  ctx.translate(rect.x + rect.size / 2, rect.y + rect.size / 2);
  ctx.rotate(-0.64);
  ctx.fillStyle = `rgba(255, 255, 255, ${0.18 + pulse * 0.18})`;
  ctx.fillRect(-rect.size, -rect.size * 0.42 + pulse * rect.size * 0.82, rect.size * 2, rect.size * 0.16);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "rgba(255, 206, 62, 0.96)";
  ctx.strokeStyle = "rgba(87, 45, 0, 0.85)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rect.x + 5, rect.y + 5);
  ctx.lineTo(rect.x + 42, rect.y + 5);
  ctx.lineTo(rect.x + 5, rect.y + 42);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#4a2600";
  ctx.font = "900 17px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.save();
  ctx.translate(rect.x + 17, rect.y + 17);
  ctx.rotate(-0.28);
  ctx.fillText("獨", 0, 1);
  ctx.restore();
  ctx.restore();
}

function drawEnemyUniqueSlotMark(rect) {
  ctx.save();
  ctx.fillStyle = "rgba(122, 8, 24, 0.96)";
  ctx.strokeStyle = "rgba(255, 210, 220, 0.86)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rect.x + 5, rect.y + 5);
  ctx.lineTo(rect.x + 40, rect.y + 5);
  ctx.lineTo(rect.x + 5, rect.y + 40);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#fff0f4";
  ctx.font = "900 16px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.save();
  ctx.translate(rect.x + 17, rect.y + 17);
  ctx.rotate(-0.28);
  ctx.fillText("獨", 0, 1);
  ctx.restore();
  ctx.restore();
}

function drawSleepBlockedSlot(rect, pulse, isEmphasized = false) {
  ctx.save();
  ctx.fillStyle = `rgba(8, 22, 46, ${isEmphasized ? 0.78 : 0.62})`;
  ctx.fillRect(rect.x + 3, rect.y + 3, rect.size - 6, rect.size - 6);
  ctx.strokeStyle = `rgba(159, 215, 255, ${0.78 + pulse * 0.18})`;
  ctx.shadowColor = "rgba(159, 215, 255, 0.82)";
  ctx.shadowBlur = 12 + pulse * 6;
  ctx.lineWidth = 3;
  ctx.strokeRect(rect.x + 7, rect.y + 7, rect.size - 14, rect.size - 14);

  ctx.font = `900 ${Math.round(rect.size * 0.56)}px 'Segoe UI', 'Noto Sans TC', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 7;
  ctx.strokeStyle = "rgba(4, 14, 30, 0.92)";
  ctx.fillStyle = "#d7f0ff";
  ctx.strokeText("Z", rect.x + rect.size / 2, rect.y + rect.size / 2 + 2);
  ctx.fillText("Z", rect.x + rect.size / 2, rect.y + rect.size / 2 + 2);

  ctx.font = "900 15px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.lineWidth = 4;
  ctx.strokeText("睡眠", rect.x + rect.size / 2, rect.y + rect.size - 15);
  ctx.fillText("睡眠", rect.x + rect.size / 2, rect.y + rect.size - 15);
  ctx.restore();
}

function drawSkillIcon(skill, rect) {
  const fallbackGradient = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.size);
  fallbackGradient.addColorStop(0, skill.side === "player" ? "#174a66" : "#63202d");
  fallbackGradient.addColorStop(1, skill.side === "player" ? "#061722" : "#210710");
  ctx.fillStyle = fallbackGradient;
  ctx.fillRect(rect.x, rect.y, rect.size, rect.size);

  const portrait = getSkillPortraitImage(skill);
  if (isRenderableImage(portrait)) {
    const inset = 5;
    ctx.drawImage(portrait, rect.x + inset, rect.y + inset, rect.size - inset * 2, rect.size - inset * 2);
    drawSkillBadge(skill, rect);
    return;
  }

  drawLargeSkillIcon(skill, rect);
}

function drawLargeSkillIcon(skill, rect) {
  const image = assets.skillIcons;
  if (!isRenderableImage(image)) {
    drawFallbackSkillSymbol(skill, rect);
    return;
  }
  const frame = SKILL_ICON_FRAMES[skill.type] || SKILL_ICON_FRAMES.physical;
  ctx.drawImage(
    image,
    frame.x,
    frame.y,
    frame.width,
    frame.height,
    rect.x,
    rect.y,
    rect.size,
    rect.size
  );
}

function drawSkillBadge(skill, rect) {
  const badgeSize = Math.round(rect.size * 0.42);
  const badgeX = rect.x + rect.size - badgeSize - 3;
  const badgeY = rect.y + rect.size - badgeSize - 3;
  ctx.save();
  ctx.fillStyle = "rgba(3, 8, 18, 0.82)";
  ctx.fillRect(badgeX - 2, badgeY - 2, badgeSize + 4, badgeSize + 4);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.78)";
  ctx.lineWidth = 2;
  ctx.strokeRect(badgeX - 1, badgeY - 1, badgeSize + 2, badgeSize + 2);

  const image = assets.skillIcons;
  if (isRenderableImage(image)) {
    const frame = SKILL_ICON_FRAMES[skill.type] || SKILL_ICON_FRAMES.physical;
    ctx.drawImage(image, frame.x, frame.y, frame.width, frame.height, badgeX, badgeY, badgeSize, badgeSize);
  } else {
    drawFallbackSkillSymbol(skill, { x: badgeX, y: badgeY, size: badgeSize });
  }
  ctx.restore();
}

function getSkillPortraitImage(skill) {
  if (skill?.unitId === "hero") return chapter4State.transformed ? assets.headNpc29 : assets.headHero;
  const npcMatch = /^npc(\d+)$/.exec(String(skill?.unitId || ""));
  if (npcMatch && assets[`headNpc${npcMatch[1]}`]) return assets[`headNpc${npcMatch[1]}`];
  const unit = getBattleUnitBySkill(skill);
  const spriteMatch = /^npc(\d+)$/.exec(String(unit?.actor?.sprite || ""));
  if (spriteMatch) return assets[`headNpc${spriteMatch[1]}`];
  return null;
}

function drawFallbackSkillSymbol(skill, rect) {
  ctx.save();
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.translate(rect.x + rect.size / 2, rect.y + rect.size / 2);
  const r = rect.size * 0.27;

  if (skill.type === "guard") {
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r, -r * 0.45);
    ctx.lineTo(r * 0.7, r);
    ctx.lineTo(0, r * 1.25);
    ctx.lineTo(-r * 0.7, r);
    ctx.lineTo(-r, -r * 0.45);
    ctx.closePath();
    ctx.stroke();
  } else if (skill.type === "heal" || skill.type === "bento") {
    ctx.fillRect(-r * 0.28, -r, r * 0.56, r * 2);
    ctx.fillRect(-r, -r * 0.28, r * 2, r * 0.56);
  } else if (skill.type === "sleep") {
    ctx.beginPath();
    ctx.arc(-r * 0.15, -r * 0.05, r * 0.8, Math.PI * 0.25, Math.PI * 1.65);
    ctx.stroke();
    ctx.font = `bold ${Math.round(r * 0.75)}px 'Segoe UI', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Z", r * 0.65, -r * 0.65);
  } else if (skill.type === "magic") {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
  } else if (skill.type === "sever") {
    ctx.beginPath();
    ctx.moveTo(-r, -r);
    ctx.lineTo(r, r);
    ctx.moveTo(r * 0.4, -r);
    ctx.lineTo(-r, r * 0.4);
    ctx.stroke();
  } else if (skill.type === "poison" || skill.type === "burn") {
    ctx.beginPath();
    ctx.arc(0, -r * 0.15, r * 0.8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillRect(-r * 0.45, r * 0.5, r * 0.9, r * 0.28);
  } else if (skill.type === "stun") {
    ctx.beginPath();
    ctx.moveTo(-r * 0.3, -r);
    ctx.lineTo(r * 0.25, -r * 0.2);
    ctx.lineTo(-r * 0.1, -r * 0.2);
    ctx.lineTo(r * 0.35, r);
    ctx.stroke();
  } else if (skill.type === "support" || skill.type === "cleanse") {
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.25, -r * 0.25);
    ctx.lineTo(r, -r * 0.25);
    ctx.lineTo(r * 0.4, r * 0.18);
    ctx.lineTo(r * 0.6, r);
    ctx.lineTo(0, r * 0.55);
    ctx.lineTo(-r * 0.6, r);
    ctx.lineTo(-r * 0.4, r * 0.18);
    ctx.lineTo(-r, -r * 0.25);
    ctx.lineTo(-r * 0.25, -r * 0.25);
    ctx.closePath();
    ctx.stroke();
  } else if (skill.type === "debuff") {
    ctx.beginPath();
    ctx.moveTo(-r, 0);
    ctx.lineTo(r, 0);
    ctx.stroke();
  } else if (skill.type === "charm") {
    ctx.beginPath();
    ctx.moveTo(0, r * 0.85);
    ctx.bezierCurveTo(-r * 1.35, -r * 0.1, -r * 0.7, -r, 0, -r * 0.35);
    ctx.bezierCurveTo(r * 0.7, -r, r * 1.35, -r * 0.1, 0, r * 0.85);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(-r, r);
    ctx.lineTo(r, -r);
    ctx.stroke();
  }
  ctx.restore();
}

function getSlotCellRect(index) {
  const row = Math.floor(index / SLOT_SIZE);
  const col = index % SLOT_SIZE;
  const scaleX = SLOT_BOARD.width / SLOT_BOARD.srcWidth;
  const scaleY = SLOT_BOARD.height / SLOT_BOARD.srcHeight;
  const size = SLOT_BOARD.cellSize * Math.min(scaleX, scaleY);
  return {
    x: SLOT_BOARD.x + (SLOT_BOARD.cellLeft + col * SLOT_BOARD.cellStepX) * scaleX,
    y: SLOT_BOARD.y + (SLOT_BOARD.cellTop + row * SLOT_BOARD.cellStepY) * scaleY,
    size,
  };
}

function getSlotStepX() {
  return SLOT_BOARD.cellStepX * (SLOT_BOARD.width / SLOT_BOARD.srcWidth);
}

function drawWinningLines() {
  if (!battleState.matches.length || !["line-flash", "skill-exec", "next-delay", "victory"].includes(battleState.phase)) return;
  const pulse = Math.sin(performance.now() / 90) * 0.5 + 0.5;

  for (const match of battleState.matches) {
    const first = getSlotCellRect(match.cells[0]);
    const last = getSlotCellRect(match.cells[match.cells.length - 1]);
    const hasStunnedSkill = match.skills.some((skill) => isSkillSourceStunned(skill));
    const color = hasStunnedSkill ? "#ffe16f" : SIDE_STYLE[match.side].color;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 7 + pulse * 5;
    ctx.shadowColor = hasStunnedSkill ? "rgba(255, 225, 111, 0.92)" : SIDE_STYLE[match.side].glow;
    ctx.shadowBlur = 22 + pulse * 14;
    ctx.beginPath();
    ctx.moveTo(first.x + first.size / 2, first.y + first.size / 2);
    ctx.lineTo(last.x + last.size / 2, last.y + last.size / 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawXiaoDomainLines() {
  if (!battleState.xiaoDomainCells?.length || !["line-flash", "skill-exec", "next-delay", "victory"].includes(battleState.phase)) return;
  const pulse = Math.sin(performance.now() / 70) * 0.5 + 0.5;
  const diagonals = [
    Array.from({ length: SLOT_SIZE }, (_, index) => index * SLOT_SIZE + index),
    Array.from({ length: SLOT_SIZE }, (_, index) => index * SLOT_SIZE + (SLOT_SIZE - 1 - index)),
  ];

  for (const diagonal of diagonals) {
    const activeCells = diagonal.filter((cell) => battleState.xiaoDomainCells.includes(cell));
    if (!activeCells.length) continue;
    const first = getSlotCellRect(diagonal[0]);
    const last = getSlotCellRect(diagonal[diagonal.length - 1]);
    ctx.save();
    ctx.strokeStyle = XIAO_DOMAIN_COLOR;
    ctx.lineWidth = 8 + pulse * 5;
    ctx.shadowColor = "rgba(180, 92, 255, 0.98)";
    ctx.shadowBlur = 24 + pulse * 18;
    ctx.beginPath();
    ctx.moveTo(first.x + first.size / 2, first.y + first.size / 2);
    ctx.lineTo(last.x + last.size / 2, last.y + last.size / 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawBattleMiss() {
  const alpha = Math.sin(Math.min(battleState.timer / SLOT_MISS_TIME, 1) * Math.PI);
  ctx.save();
  ctx.globalAlpha = Math.max(alpha, 0.15);
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "rgba(0, 0, 0, 0.85)";
  ctx.lineWidth = 8;
  ctx.font = "bold 86px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const x = SLOT_BOARD.x + SLOT_BOARD.width / 2;
  const y = SLOT_BOARD.y + SLOT_BOARD.height / 2;
  ctx.strokeText("MISS", x, y);
  ctx.fillText("MISS", x, y);
  ctx.restore();
}

function drawBattleResultLabel() {
  if (!["victory", "defeat"].includes(battleState.phase)) return;
  const isVictory = battleState.phase === "victory";
  const label = isVictory ? "勝利" : "落敗";
  const pulse = Math.sin(performance.now() / 150) * 0.5 + 0.5;
  const x = SLOT_BOARD.x + SLOT_BOARD.width / 2;
  const y = SLOT_BOARD.y + SLOT_BOARD.height + 44;
  const width = 250;
  const height = 70;
  const fill = isVictory ? "rgba(58, 40, 5, 0.86)" : "rgba(46, 6, 16, 0.88)";
  const stroke = isVictory ? "#ffe16f" : "#ff6680";
  const glow = isVictory ? "rgba(255, 225, 111, 0.88)" : "rgba(255, 86, 108, 0.86)";

  ctx.save();
  ctx.translate(x, y);
  ctx.shadowColor = glow;
  ctx.shadowBlur = 18 + pulse * 14;
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 4;
  roundRect(-width / 2, -height / 2, width, height, 18);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 12 + pulse * 10;
  ctx.fillStyle = isVictory ? "#fff4a8" : "#ffd4dc";
  ctx.strokeStyle = "rgba(0, 0, 0, 0.82)";
  ctx.lineWidth = 7;
  ctx.font = "bold 46px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeText(label, 0, 1);
  ctx.fillText(label, 0, 1);
  ctx.restore();
}

function drawBattleEffects() {
  for (const effect of battleState.effects) {
    if (effect.delay > 0) continue;
    const color = SIDE_STYLE[effect.side].color;
    const progress = effect.progress;
    const x = effect.x + (effect.tx - effect.x) * progress - camera.x;
    const y = effect.y + (effect.ty - effect.y) * progress - camera.y;
    const alpha = Math.max(effect.life / effect.maxLife, 0);
    const image = assets[effect.assetKey];

    if (isRenderableImage(image)) {
      drawSkillEffectImage(image, effect, x, y, alpha);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 5;
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;

    if (effect.type === "attack" || effect.type === "control") {
      ctx.beginPath();
      ctx.moveTo(effect.x - camera.x, effect.y - camera.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, effect.type === "control" ? 18 : 13, 0, Math.PI * 2);
      ctx.fill();
    } else if (effect.type === "heal" || effect.type === "guard" || effect.type === "support") {
      ctx.beginPath();
      ctx.arc(effect.tx - camera.x, effect.ty - camera.y, 20 + progress * 28, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  for (const text of battleState.floatingTexts) {
    ctx.save();
    const flash = text.flash ? 0.58 + Math.sin(performance.now() / 70) * 0.32 : 1;
    ctx.globalAlpha = Math.max(text.life / text.maxLife, 0) * flash;
    ctx.fillStyle = text.color;
    ctx.font = text.font || "bold 22px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 8;
    const lines = String(text.text).split("\n");
    const lineHeight = text.flash ? 30 : 24;
    const startY = text.y - camera.y - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, index) => {
      const y = startY + index * lineHeight;
      if (text.stroke) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = text.stroke;
        ctx.strokeText(line, text.x - camera.x, y);
      }
      ctx.fillText(line, text.x - camera.x, y);
    });
    ctx.restore();
  }
}

function drawSkillEffectImage(image, effect, x, y, alpha) {
  const progress = effect.progress;
  const fadeIn = clamp(progress / 0.18, 0, 1);
  const fadeOut = clamp(alpha / 0.32, 0, 1);
  const size = effect.size * (0.78 + Math.sin(progress * Math.PI) * 0.28 + progress * 0.08);
  const sideFlip = effect.side === "enemy" ? -1 : 1;

  ctx.save();
  ctx.globalAlpha = fadeIn * fadeOut;
  ctx.globalCompositeOperation = "lighter";
  ctx.translate(x, y);
  ctx.scale(sideFlip, 1);
  ctx.rotate((effect.side === "enemy" ? -1 : 1) * Math.sin(progress * Math.PI) * 0.08);
  ctx.drawImage(image, -size / 2, -size / 2, size, size);
  ctx.restore();
}

function drawUniqueSkillCutins() {
  if (!battleState?.uniqueCutins?.length) return;
  battleState.uniqueCutins.forEach(drawUniqueSkillCutin);
}

function drawUniqueSkillCutin(cutin) {
  const progress = clamp(cutin.progress, 0, 1);
  const enter = easeOutCubic(clamp(progress / 0.26, 0, 1));
  const exit = easeInCubic(clamp((progress - 0.78) / 0.22, 0, 1));
  const side = cutin.side === "enemy" ? "enemy" : "player";
  const direction = side === "player" ? 1 : -1;
  const offset = side === "player"
    ? -canvas.width * (1 - enter) + canvas.width * exit
    : canvas.width * (1 - enter) - canvas.width * exit;
  const alpha = clamp(enter * (1 - exit * 0.92), 0, 1);
  const color = side === "player" ? "#55e5ff" : "#ff5b75";
  const glow = side === "player" ? "rgba(85, 229, 255, 0.92)" : "rgba(255, 91, 117, 0.92)";
  const image = assets[cutin.assetKey];

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(offset, 0);
  createUniqueCutinPath(side);
  ctx.clip();

  const bg = ctx.createLinearGradient(0, canvas.height * 0.16, canvas.width, canvas.height * 0.84);
  bg.addColorStop(0, side === "player" ? "rgba(0, 24, 44, 0.96)" : "rgba(52, 0, 10, 0.96)");
  bg.addColorStop(0.48, side === "player" ? "rgba(10, 112, 145, 0.88)" : "rgba(170, 28, 28, 0.88)");
  bg.addColorStop(1, "rgba(0, 0, 0, 0.98)");
  ctx.fillStyle = bg;
  ctx.fillRect(-60, canvas.height * 0.1, canvas.width + 120, canvas.height * 0.76);

  drawUniqueCutinSpeedLines(cutin, side, color);
  if (isRenderableImage(image)) {
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.filter = "contrast(1.08) saturate(1.15)";
    const imageLayout = getUniqueCutinImageLayout(cutin, side);
    const imageWidth = imageLayout.width;
    const imageHeight = imageLayout.height;
    const imageX = imageLayout.x;
    const imageY = imageLayout.y;
    drawImageCover(image, imageX, imageY, imageWidth, imageHeight);
    ctx.restore();
  }

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const light = ctx.createLinearGradient(0, 0, canvas.width, 0);
  light.addColorStop(0, "rgba(255, 255, 255, 0)");
  light.addColorStop(0.5 + Math.sin(progress * Math.PI) * 0.18, side === "player" ? "rgba(95, 245, 255, 0.34)" : "rgba(255, 190, 84, 0.32)");
  light.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = light;
  ctx.fillRect(-60, canvas.height * 0.1, canvas.width + 120, canvas.height * 0.76);
  ctx.restore();

  ctx.restore();

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(offset, 0);
  drawUniqueCutinFrame(side, color, glow);
  ctx.restore();

  drawUniqueCutinTitle(cutin, side, direction, alpha, progress, color, glow);
}

function getUniqueCutinImageLayout(cutin, side) {
  const base = {
    width: canvas.width * 0.86,
    height: canvas.height * 1.04,
    x: side === "player" ? canvas.width * 0.18 : -canvas.width * 0.04,
    y: -canvas.height * 0.02,
  };
  if (cutin.assetKey === "uniqueSkill14") {
    return {
      width: canvas.width * 0.78,
      height: canvas.height * 0.96,
      x: side === "player" ? canvas.width * 0.1 : -canvas.width * 0.1,
      y: -canvas.height * 0.08,
    };
  }
  return base;
}

function createUniqueCutinPath(side) {
  const w = canvas.width;
  const h = canvas.height;
  ctx.beginPath();
  if (side === "player") {
    ctx.moveTo(-90, h * 0.18);
    ctx.lineTo(w * 0.64, h * 0.08);
    ctx.lineTo(w + 70, h * 0.23);
    ctx.lineTo(w * 0.82, h * 0.72);
    ctx.lineTo(w * 0.22, h * 0.88);
    ctx.lineTo(-90, h * 0.8);
  } else {
    ctx.moveTo(w + 90, h * 0.18);
    ctx.lineTo(w * 0.36, h * 0.08);
    ctx.lineTo(-70, h * 0.23);
    ctx.lineTo(w * 0.18, h * 0.72);
    ctx.lineTo(w * 0.78, h * 0.88);
    ctx.lineTo(w + 90, h * 0.8);
  }
  ctx.closePath();
}

function drawUniqueCutinFrame(side, color, glow) {
  ctx.save();
  ctx.shadowColor = glow;
  ctx.shadowBlur = 20;
  ctx.lineWidth = 5;
  ctx.strokeStyle = color;
  createUniqueCutinPath(side);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 12;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.86)";
  createUniqueCutinPath(side);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
  createUniqueCutinPath(side);
  ctx.stroke();
  ctx.restore();
}

function drawUniqueCutinSpeedLines(cutin, side, color) {
  const w = canvas.width;
  const h = canvas.height;
  const direction = side === "player" ? 1 : -1;
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.lineWidth = 2.4;
  for (let index = 0; index < 26; index += 1) {
    const lane = ((index * 61 + cutin.seed * 17) % (h + 160)) - 80;
    const phase = (cutin.progress * 900 + index * 47) % (w + 260);
    const x = side === "player" ? phase - 180 : w - phase + 180;
    const length = 160 + (index % 5) * 46;
    ctx.globalAlpha = 0.08 + (index % 4) * 0.035;
    ctx.strokeStyle = index % 3 === 0 ? "#ffffff" : color;
    ctx.beginPath();
    ctx.moveTo(x, lane);
    ctx.lineTo(x + direction * length, lane - 34);
    ctx.stroke();
  }
  ctx.restore();
}

function drawUniqueCutinTitle(cutin, side, direction, alpha, progress, color, glow) {
  const title = cutin.title || "";
  const x = side === "player" ? 82 : canvas.width - 82;
  const y = canvas.height * 0.69;
  const align = side === "player" ? "left" : "right";
  const bounce = 1 + Math.sin(clamp(progress / 0.38, 0, 1) * Math.PI) * 0.08;
  const textSlide = direction * (1 - easeOutCubic(clamp(progress / 0.24, 0, 1))) * -88;
  const fontSize = Math.max(32, 56 - Math.max(0, title.length - 5) * 3.4);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x + textSlide, y);
  ctx.scale(bounce, bounce);
  ctx.textAlign = align;
  ctx.textBaseline = "middle";

  const ribbonWidth = Math.min(canvas.width * 0.56, Math.max(300, title.length * fontSize * 0.82));
  const ribbonX = align === "left" ? -20 : -ribbonWidth + 20;
  ctx.save();
  ctx.rotate(side === "player" ? -0.035 : 0.035);
  ctx.fillStyle = "rgba(0, 0, 0, 0.74)";
  ctx.fillRect(ribbonX, -50, ribbonWidth, 92);
  ctx.strokeStyle = color;
  ctx.shadowColor = glow;
  ctx.shadowBlur = 14;
  ctx.lineWidth = 3;
  ctx.strokeRect(ribbonX + 4, -46, ribbonWidth - 8, 84);
  ctx.restore();

  ctx.font = "bold 18px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillStyle = color;
  ctx.shadowColor = glow;
  ctx.shadowBlur = 12;
  ctx.fillText("獨特技能", 0, -46);

  ctx.font = `900 ${fontSize}px 'Segoe UI', 'Noto Sans TC', sans-serif`;
  ctx.lineWidth = 9;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.92)";
  ctx.strokeText(title, 0, 4);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.strokeText(title, 0, 4);
  ctx.fillStyle = side === "player" ? "#fff7b5" : "#ffe2e8";
  ctx.fillText(title, 0, 4);
  ctx.restore();
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function easeInCubic(value) {
  return value * value * value;
}

function drawQuestStatus() {
  if ((questState === "inactive" && !isChapter2Started() && !isChapter3Started() && !isChapter4Started() && !isChapter5Started()) || endingState || battleState?.active || streamState?.active) return;
  if (!isChapter4Started() && !isChapter3Started() && questState === "completed" && (!isChapter2Started() || chapter2State.phase === "completed")) return;
  if (!isChapter5Started() && !isChapter4Started() && (chapter3State.completed || chapter3State.phase === "completed")) return;

  let body = "";
  let bodySegments = null;
  let title = "任務狀態";
  if (isChapter5Started()) {
    title = "第五章";
    if (chapter5State.phase === "await_exit" || chapter5State.phase === "flashback") {
      body = "自由活動";
    } else if (chapter5State.phase === "go_tower") {
      body = "前往對戰塔，挑戰最強台1V決定賽。";
    } else if (chapter5State.phase === "tournament") {
      const round = Math.min((chapter5State.tournamentRound || 0) + 1, CHAPTER5_TOURNAMENT_ROUNDS.length);
      body = `最強台1V決定賽 ${round}/${CHAPTER5_TOURNAMENT_ROUNDS.length}`;
    } else if (chapter5State.phase === "completed") {
      body = "最強台1V...完";
    }
  } else if (isChapter4Started()) {
    title = "第四章";
    if (chapter4State.phase === "need_rest") {
      body = "先水餃，明早去叉滴娛樂找蕭政銘。";
    } else if (chapter4State.phase === "ask_xiao") {
      body = "去叉滴娛樂找蕭政銘。";
    } else if (chapter4State.phase === "grow_popularity") {
      body = `直播時，任一 VT 人氣值達到 ${getChapter4PopularityTarget()}。目前 ${getBestVtPopularity()}/${getChapter4PopularityTarget()}。`;
    } else if (chapter4State.phase === "target_reached_rest") {
      body = "人氣值達標了，先在HOTEL水餃，明早去找蕭政銘。";
    } else if (chapter4State.phase === "vt_missing") {
      body = "三個 VT 不見了，去叉滴娛樂看看。";
    } else if (chapter4State.phase === "confront_ex") {
      body = "蕭政銘加入隊伍，去門口處理吵鬧的人。";
    } else if (chapter4State.phase === "post_ex_xd") {
      body = "回叉滴娛樂內找三個 VT。";
    } else if (chapter4State.phase === "stream_two_vts") {
      body = "繼續直播吧...";
    } else if (chapter4State.phase === "post_kinko_stream_rest") {
      body = "繼續直播吧...";
    } else if (chapter4State.phase === "need_c22") {
      body = "去超商取得 C-22 藥錠。";
    } else if (chapter4State.phase === "got_c22") {
      body = "取得 C-22 藥錠，回去問肥宅使用方法。";
    } else if (chapter4State.phase === "base_entry") {
      body = "前往基地，潛入 V黑娛樂基地。";
    } else if (chapter4State.phase === "base_infiltration") {
      body = "深入 V黑娛樂基地，找到親親子。";
    } else if (chapter4State.phase === "base_rescue") {
      body = chapter4State.rescuePartyJoined ? "進入基地" : "救兵集合，準備進入基地。";
    } else if (chapter4State.phase === "base_rescue_victory") {
      body = "進入牢房，找到大家。";
    } else if (chapter4State.phase === "rescue_cell_check") {
      body = "查看大家狀況";
    } else if (chapter4State.phase === "rescue_cell_finale" || chapter4State.phase === "rescue_cell_found") {
      body = "帶大家離開牢房。";
    } else if (chapter4State.phase === "base_captive") {
      body = "被關起來了，先想辦法撐住幾天，看有沒有人來救援。";
    } else if (chapter4State.phase === "rescue_flashback") {
      body = chapter4State.rescueSearchStarted ? "蕭政銘正在尋找救兵。" : "親親獸進入基地當天...";
    }
  } else if (isChapter3Started()) {
    title = "第三章";
    if (chapter3State.phase === "need_rest") {
      body = "去地舖或 HOTEL 房間水餃。";
    } else if (chapter3State.phase === "ask_xiao") {
      body = "大家都不見了，去問蕭政銘。";
    } else if (chapter3State.phase === "find_members" || chapter3State.phase === "ready_report") {
      bodySegments = [
        { text: `豬鼻醬 ${chapter3State.pigFound ? "OK" : "未找到"}`, done: chapter3State.pigFound },
        { text: `｜波貝貝 ${chapter3State.bebeFound ? "OK" : "未找到"}`, done: chapter3State.bebeFound },
        { text: `｜親親子 ${chapter3State.kinkoFound ? "OK" : "未找到"}`, done: chapter3State.kinkoFound },
      ];
      body = bodySegments.map((segment) => segment.text).join("");
      if (chapter3State.phase === "ready_report") {
        bodySegments = [{ text: "三個 VT 都找回來了，去直播室找蕭政銘。", done: true }];
        body = bodySegments[0].text;
      }
    } else if (chapter3State.phase === "ready_stream") {
      body = "和 HOTEL 房間互動，開始初配信。";
    } else if (chapter3State.phase === "completed") {
      body = "第三章完成";
    }
  } else if (isChapter2Started()) {
    title = "第二章";
    if (chapter2State.phase === "go_xd") {
      body = "進入 XD 娛樂，找到能成立 VT 部門的人。";
    } else if (chapter2State.phase === "tasks" || chapter2State.phase === "ready") {
      const equipmentCount = getChapter2RequiredEquipmentCount();
      if (chapter2State.phase === "ready") {
        bodySegments = [{ text: "回 XD 娛樂找蕭政銘交付。", done: true }];
      } else {
        bodySegments = [
          { text: `設備 ${equipmentCount}/3`, done: equipmentCount >= CHAPTER2_REQUIRED_EQUIPMENT.length },
          { text: `｜直播室 ${chapter2State.roomUnlocked ? "OK" : "未完成"}`, done: chapter2State.roomUnlocked },
        ];
        if (chapter2State.exitReminderShown) {
          bodySegments.push({
            text: `｜門口菸味 ${chapter2State.smokersCleared ? "OK" : "未完成"}`,
            done: chapter2State.smokersCleared,
          });
        }
      }
      body = bodySegments.map((segment) => segment.text).join("");
    } else if (chapter2State.phase === "completed") {
      body = "第二章完成";
    }
  } else if (questState === "accepted") {
    body = "去找三個 VT";
  } else if (questState === "ready") {
    body = "三個 VT 都找齊了，回去找蕭政銘";
  } else if (questState === "battle") {
    body = "跟蕭政銘談完了，準備開打";
  } else if (questState === "completed") {
    body = "任務完成";
  }

  const boxWidth = Math.min(canvas.width - 48, 560);

  ctx.save();
  ctx.fillStyle = "rgba(5, 8, 18, 0.82)";
  ctx.fillRect(24, 24, boxWidth, 74);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
  ctx.lineWidth = 1;
  ctx.strokeRect(24.5, 24.5, boxWidth - 1, 73);
  ctx.fillStyle = "#ffd7ea";
  ctx.font = "bold 20px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText(title, 42, 52);
  ctx.font = "16px 'Segoe UI', 'Noto Sans TC', sans-serif";
  if (bodySegments?.length) {
    let textX = 42;
    for (const segment of bodySegments) {
      ctx.fillStyle = segment.done ? "#75f4b2" : "#ffffff";
      ctx.fillText(segment.text, textX, 80);
      textX += ctx.measureText(segment.text).width;
    }
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.fillText(body, 42, 80);
  }
  ctx.restore();
}

function drawDayCounter() {
  if (battleState?.active || restCutscene) return;
  const text = `第 ${currentDay} 天`;
  ctx.save();
  ctx.font = "bold 18px 'Segoe UI', 'Noto Sans TC', sans-serif";
  const width = Math.max(ctx.measureText(text).width + 32, 110);
  const x = canvas.width - width - 24;
  const y = 24;
  ctx.fillStyle = "rgba(5, 8, 18, 0.78)";
  ctx.fillRect(x, y, width, 42);
  ctx.strokeStyle = "rgba(255, 225, 111, 0.45)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, width - 1, 41);
  ctx.fillStyle = "#ffe16f";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + width / 2, y + 21);
  ctx.restore();
}

function drawDailyActivityCountdowns() {
  if (battleState?.active || restCutscene || streamState?.active || endingState) return;
  const activities = [];
  if (chapter3State.pigDate?.status === "running") {
    activities.push(`豬鼻醬約會中 ${formatCountdown(chapter3State.pigDate.remaining)}`);
  } else if (chapter3State.pigDate?.status === "done") {
    activities.push("豬鼻醬約會結束，去找胖呆親親獸");
  }
  if (chapter3State.bebeCollab?.status === "running") {
    activities.push(`波貝貝聯動中 ${formatCountdown(chapter3State.bebeCollab.remaining)}`);
  } else if (chapter3State.bebeCollab?.status === "done") {
    activities.push("波貝貝聯動結束，去 HOTEL 房間接她");
  }
  if (!activities.length) return;

  ctx.save();
  ctx.font = "bold 18px 'Segoe UI', 'Noto Sans TC', sans-serif";
  activities.forEach((text, index) => {
    const width = Math.max(360, ctx.measureText(text).width + 44);
    const x = canvas.width / 2 - width / 2;
    const y = 92 + index * 50;
    ctx.fillStyle = "rgba(5, 8, 18, 0.84)";
    roundRect(x, y, width, 40, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 183, 242, 0.68)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#ffb7f2";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, y + 21);
  });
  ctx.restore();
}

function formatCountdown(seconds) {
  const total = Math.max(0, Math.ceil(Number(seconds) || 0));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function drawRestCutsceneOverlay() {
  if (!restCutscene) return;
  const line = restCutscene.lines[restCutscene.lineIndex] || "";
  const alpha = clamp(restCutscene.timer / 0.45, 0, 1);
  ctx.save();
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#f7f0df";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 30px 'Segoe UI', 'Noto Sans TC', sans-serif";
  wrapCenteredText(line, canvas.width / 2, canvas.height / 2, canvas.width - 260, 46);
  ctx.globalAlpha = Math.min(alpha, 0.7);
  ctx.font = "18px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText("按 Z 繼續", canvas.width / 2, canvas.height - 92);
  ctx.restore();
}

function startChapterCompleteTransition(text, onComplete = null, options = {}) {
  keys.clear();
  hideDialogue();
  dialogueState = null;
  player.walkTime = 0;
  chapterCompleteTransition = {
    text,
    timer: 0,
    fadeOutTimer: 0,
    confirmed: false,
    onComplete,
    onBeforeFadeOut: options.onBeforeFadeOut || null,
    beforeFadeOutDone: false,
    instantBlack: Boolean(options.instantBlack),
    noFadeOut: Boolean(options.noFadeOut),
  };
}

function confirmChapterCompleteTransition() {
  if (!chapterCompleteTransition || chapterCompleteTransition.confirmed) return;
  if (chapterCompleteTransition.timer < CHAPTER_COMPLETE_FADE_IN) return;
  if (typeof chapterCompleteTransition.onBeforeFadeOut === "function" && !chapterCompleteTransition.beforeFadeOutDone) {
    chapterCompleteTransition.beforeFadeOutDone = true;
    chapterCompleteTransition.onBeforeFadeOut();
  }
  if (chapterCompleteTransition.noFadeOut) {
    completeChapterCompleteTransition();
    keys.clear();
    return;
  }
  chapterCompleteTransition.confirmed = true;
  chapterCompleteTransition.fadeOutTimer = 0;
  keys.clear();
}

function completeChapterCompleteTransition() {
  if (!chapterCompleteTransition) return;
  const onComplete = chapterCompleteTransition.onComplete;
  chapterCompleteTransition = null;
  if (onComplete) onComplete();
}

function updateChapterCompleteTransition(delta) {
  if (!chapterCompleteTransition) return;
  player.walkTime = 0;
  npcs.forEach((npc) => {
    npc.walkTime = 0;
  });

  if (chapterCompleteTransition.confirmed) {
    chapterCompleteTransition.fadeOutTimer += delta;
    if (chapterCompleteTransition.fadeOutTimer >= CHAPTER_COMPLETE_FADE_OUT) {
      completeChapterCompleteTransition();
    }
    return;
  }

  const holdAt = CHAPTER_COMPLETE_FADE_IN + CHAPTER_COMPLETE_HOLD;
  chapterCompleteTransition.timer = Math.min(chapterCompleteTransition.timer + delta, holdAt);
}

function drawChapterCompleteOverlay() {
  if (!chapterCompleteTransition) return;
  const timer = chapterCompleteTransition.timer;
  const fadeOutProgress = chapterCompleteTransition.confirmed
    ? clamp(chapterCompleteTransition.fadeOutTimer / CHAPTER_COMPLETE_FADE_OUT, 0, 1)
    : 0;
  const fadeInAlpha = chapterCompleteTransition.instantBlack
    ? 1
    : timer < CHAPTER_COMPLETE_FADE_IN
      ? clamp(timer / CHAPTER_COMPLETE_FADE_IN, 0, 1)
      : 1;
  const alpha = fadeInAlpha * (1 - fadeOutProgress);
  const textAlpha = clamp((timer - 0.2) / 0.65, 0, 1) * alpha;
  const promptAlpha = chapterCompleteTransition.confirmed
    ? 0
    : clamp((timer - CHAPTER_COMPLETE_FADE_IN) / 0.35, 0, 1) * alpha;
  const titleParts = splitChapterCompleteText(chapterCompleteTransition.text);
  const shimmer = Math.sin(performance.now() / 240) * 0.5 + 0.5;

  ctx.save();
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = textAlpha * 0.52;
  const band = ctx.createLinearGradient(180, 0, canvas.width - 180, 0);
  band.addColorStop(0, "rgba(255, 225, 111, 0)");
  band.addColorStop(0.45, "rgba(255, 225, 111, 0.54)");
  band.addColorStop(0.55, "rgba(143, 245, 255, 0.48)");
  band.addColorStop(1, "rgba(255, 225, 111, 0)");
  ctx.fillStyle = band;
  ctx.fillRect(210, canvas.height / 2 - 66, canvas.width - 420, 3);
  ctx.fillRect(260, canvas.height / 2 + 66, canvas.width - 520, 2);
  ctx.globalAlpha = textAlpha;
  ctx.fillStyle = "#fff7e8";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 46px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.shadowColor = "rgba(255, 225, 111, 0.48)";
  ctx.shadowBlur = 18 + shimmer * 8;
  ctx.fillText(titleParts.title, canvas.width / 2, titleParts.subtitle ? canvas.height / 2 - 15 : canvas.height / 2);
  if (titleParts.subtitle) {
    ctx.globalAlpha = textAlpha * 0.88;
    ctx.fillStyle = "#8ff5ff";
    ctx.font = "bold 28px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.shadowColor = "rgba(143, 245, 255, 0.42)";
    ctx.shadowBlur = 12;
    ctx.fillText(titleParts.subtitle, canvas.width / 2, canvas.height / 2 + 42);
  }
  if (promptAlpha > 0) {
    ctx.globalAlpha = promptAlpha;
    ctx.font = "bold 22px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.shadowColor = "rgba(255, 225, 111, 0.36)";
    ctx.shadowBlur = 10;
    ctx.fillText("按 Z 繼續", canvas.width / 2, canvas.height / 2 + 82);
  }
  ctx.restore();
}

function splitChapterCompleteText(text) {
  const normalized = String(text || "");
  const match = normalized.match(/^(第[一二三四五六七八九十]+章)\s*(.+)$/);
  if (!match) return { title: normalized, subtitle: "" };
  return { title: match[1], subtitle: match[2] };
}

const STREAM_DURATION = 45;
const STREAM_CHAT_ASSIST_STEP = 0.12;
const STREAM_CHAT_ASSIST_MAX = 12;
const STREAM_LAYOUT = {
  video: { x: 42, y: 54, width: 748, height: 594 },
  chat: { x: 820, y: 54, width: 416, height: 594 },
};

const STREAM_CHAT_MESSAGES = [
  { user: "親親幫001", text: "初配信來了！" },
  { user: "路過宅男", text: "三個都好吵，好好看。" },
  { user: "漢堡信徒", text: "親親獸站旁邊好有壓迫感。" },
  { user: "阿基親親獸", text: "這公司看起來好窮喔", bad: true },
  { user: "菸頭親親獸", text: "門口不給抽，聊天室可以吧", bad: true },
  { user: "菸頭燙燙燙", text: "聊天室也可以燙起來吧，燙燙燙", bad: true },
  { user: "羊羊匿名帳", text: "這台是不是在騙護貝費", bad: true },
  { user: "文科鬼", text: "發送了一串被系統遮蔽的歧視言論", bad: true },
  { user: "可愛觀眾", text: "豬鼻醬吃播什麼時候開始？" },
  { user: "水餃民", text: "波貝貝看起來想睡。" },
];

const STREAM_DONATIONS = [
  { user: "護貝大戶", text: "初配信加油！", amount: 2600 },
  { user: "親親幫會長", text: "給大家買水餃", amount: 3200 },
  { user: "阿基親親獸", text: "這筆拿去買滅火器", amount: 1888, bad: true },
  { user: "菸頭親親獸", text: "斗內但我要亂留言", amount: 1666, bad: true },
  { user: "菸頭燙燙燙", text: "這筆拿去買燙傷藥，聊天室燙起來", amount: 2087, bad: true },
  { user: "文科鬼", text: "斗內留言含違規歧視內容，已自動打碼", amount: 2888, bad: true },
];

const STREAM_VIDEO_EVENTS = [
  { title: "漢堡跳舞", amount: 2200, bad: false },
  { title: "護貝費感謝祭", amount: 2600, bad: false },
  { title: "羊羊星球催眠波", amount: 2077, bad: true },
  { title: "子魚計畫亂入廣告", amount: 1888, bad: true },
  { title: "菸頭燙燙燙：高溫亂入影片", amount: 2287, bad: true },
  { title: "文科鬼：已打碼的違規影片", amount: 2888, bad: true },
];

const STREAM_DANCER_LINES = [
  ["聞到護貝費的味道了！", "播完可以吃飯嗎？", "聊天室有拉麵嗎？"],
  ["我可以小聲一點播嗎...", "這個聊天室好吵。", "我想水餃。"],
  ["哼，才不是想被大家看。", "斗內可以再大聲一點。", "這就是我的主場吧？"],
];

const STREAM_DANCER_LINES_BY_ACTOR = {
  npc1: STREAM_DANCER_LINES[0],
  npc2: STREAM_DANCER_LINES[1],
  npc3: STREAM_DANCER_LINES[2],
};

const STREAM_TUTORIAL_STEPS = [
  {
    title: "範例 1：封鎖違規聊天室",
    body: "紅色聊天室是可疑留言。請在這則聊天室上按右鍵，選擇「封鎖」。",
    type: "chat",
    action: "block",
    sample: { user: "羊羊匿名帳", text: "這台是不是在騙護貝費", bad: true },
    feedback: "這則是過激聊天室，要用「封鎖」處理。",
  },
  {
    title: "範例 2：互動正常聊天室",
    body: "正常聊天室可以提升人氣。請在這則聊天室上按右鍵，選擇「互動」。",
    type: "chat",
    action: "interact",
    sample: { user: "可愛觀眾", text: "三個人初配信好可愛！", bad: false },
    feedback: "這是正常聊天室，要用「互動」增加人氣。",
  },
  {
    title: "範例 3：咖掉違禁影片斗內",
    body: "違禁影片會增加違規值。請在紅色影片上按右鍵，選擇「咖掉」。",
    type: "video",
    action: "cut",
    sample: { title: "子魚計畫亂入廣告", amount: 1888, bad: true },
    feedback: "違禁影片不能收錢，要先「咖掉」。",
  },
  {
    title: "範例 4：收取正常影片斗內",
    body: "正常影片斗內是收入來源。請在這則影片上按右鍵，選擇「收錢」。",
    type: "video",
    action: "collect",
    sample: { title: "護貝費感謝祭", amount: 2600, bad: false },
    feedback: "這是正常影片斗內，要用「收錢」。",
  },
  {
    title: "範例 5：退款違規訊息斗內",
    body: "違規訊息斗內不能收。請在紅色斗內訊息上按右鍵，選擇「退款」。",
    type: "donation",
    action: "refund",
    sample: { user: "文科鬼", text: "斗內留言含違規歧視內容，已自動打碼", amount: 2888, bad: true },
    feedback: "違規訊息斗內要用「退款」處理。",
  },
  {
    title: "範例 6：收取正常訊息斗內",
    body: "黃色斗內訊息是正常收入。請在斗內訊息上按右鍵，選擇「收錢」。",
    type: "donation",
    action: "collect",
    sample: { user: "護貝大戶", text: "初配信加油！", amount: 2600, bad: false },
    feedback: "正常斗內要右鍵選「收錢」，護貝費才會入帳。",
  },
];

function startLivestream() {
  closeGameMenu();
  keys.clear();
  hideDialogue();
  dialogueState = null;
  if (!chapter3State.streamTutorialDone) {
    startLivestreamTutorial();
    return;
  }
  beginLivestreamRun();
}

function createBaseStreamState(phase) {
  streamState = {
    active: true,
    phase,
    debut: !chapter3State.streamCompleted,
    performerIds: getLivestreamPerformerIds(),
    timer: 0,
    popularity: 0,
    gross: 0,
    risk: 0,
    riskShake: 0,
    handledBad: 0,
    missedBad: 0,
    chat: [],
    videos: [],
    donations: [],
    hudPopups: [],
    contextMenu: null,
    spawn: { chat: Math.min(0.9, 0.35 * getLivestreamChatDelayScale()), video: 2.4, donation: 1.4 },
    result: null,
    tutorial: null,
  };
}

function isCurrentStreamDebut() {
  return Boolean(streamState?.debut);
}

function getCurrentStreamTitle() {
  return `叉滴娛樂 ${isCurrentStreamDebut() ? "初配信" : "生放送"}`;
}

function getCurrentStreamResultTitle() {
  return `${isCurrentStreamDebut() ? "初配信" : "生放送"}結算`;
}

function getCurrentStreamBannedLine() {
  return isCurrentStreamDebut()
    ? "違規值達到 100，初配信直接畢業。"
    : "違規值達到 100，VT通通畢業。";
}

function formatStreamEraText(text) {
  if (!text || isCurrentStreamDebut()) return text;
  return text.replaceAll("初配信", "生放送");
}

function isNoViolationStreamTestEnabled() {
  return Boolean(noViolationStreamToggleEl?.checked && streamState?.phase === "live");
}

function pickStreamTemplate(list) {
  const pool = isNoViolationStreamTestEnabled() ? list.filter((entry) => !entry.bad) : list;
  const safePool = pool.length ? pool : list;
  return safePool[Math.floor(Math.random() * safePool.length)];
}

function startLivestreamTutorial() {
  createBaseStreamState("tutorial_intro");
  streamState.tutorial = { step: 0, feedback: "", choiceIndex: 1 };
}

function beginLivestreamRun() {
  createBaseStreamState("live");
}

function getLivestreamAssistLevel() {
  return clamp(Math.floor(Number(chapter3State.streamAssistLevel) || 0), 0, STREAM_CHAT_ASSIST_MAX);
}

function getLivestreamChatDelayScale() {
  return 1 + getLivestreamAssistLevel() * STREAM_CHAT_ASSIST_STEP;
}

function getNextStreamChatDelay() {
  return (0.58 + Math.random() * 0.64) * getLivestreamChatDelayScale();
}

function lowerLivestreamDifficulty() {
  chapter3State.streamAssistLevel = clamp(getLivestreamAssistLevel() + 1, 0, STREAM_CHAT_ASSIST_MAX);
  saveGame();
}

function setupStreamTutorialStep(step) {
  if (!streamState?.tutorial) return;
  streamState.tutorial.step = step;
  streamState.tutorial.feedback = "";
  streamState.contextMenu = null;
  streamState.chat = [];
  streamState.videos = [];
  streamState.donations = [];
  const config = STREAM_TUTORIAL_STEPS[step];
  if (!config) {
    streamState.phase = "tutorial_done";
    streamState.tutorial.choiceIndex = 1;
    return;
  }
  const id = `tutorial-${step}`;
  const sample = { ...config.sample, id, age: 0 };
  if (config.type === "chat") {
    streamState.chat = [sample];
  } else if (config.type === "video") {
    streamState.videos = [{ ...sample, thumbnailKey: pickStreamVideoThumbnailKey(Boolean(sample.bad)) }];
  } else if (config.type === "donation") {
    streamState.donations = [sample];
  }
}

function updateLivestream(delta) {
  if (!streamState?.active) return;
  streamState.riskShake = Math.max(0, (streamState.riskShake || 0) - delta);
  updateStreamHudPopups(delta);
  if (streamState.phase !== "live") return;
  streamState.timer += delta;
  streamState.spawn.chat -= delta;
  streamState.spawn.video -= delta;
  streamState.spawn.donation -= delta;

  if (streamState.spawn.chat <= 0) {
    spawnStreamChat();
    streamState.spawn.chat = getNextStreamChatDelay();
  }
  if (streamState.spawn.video <= 0) {
    spawnStreamVideo();
    streamState.spawn.video = 3.4 + Math.random() * 2.7;
  }
  if (streamState.spawn.donation <= 0) {
    spawnStreamDonation();
    streamState.spawn.donation = 2.8 + Math.random() * 2.4;
  }

  ageStreamItems(streamState.chat, delta, 5.5, (item) => {
    if (item.bad) penalizeStreamMistake(13);
    else adjustStreamPopularity(4);
  });
  if (streamState.phase !== "live") return;
  ageStreamItems(streamState.videos, delta, 8.2, (item) => {
    if (item.bad) penalizeStreamMistake(19);
    else adjustStreamPopularity(6);
  });
  if (streamState.phase !== "live") return;
  ageStreamItems(streamState.donations, delta, 7.1, (item) => {
    if (item.bad) penalizeStreamMistake(17);
    else adjustStreamPopularity(4);
  });
  if (streamState.phase !== "live") return;

  if (streamState.timer >= STREAM_DURATION) {
    finishLivestreamRun();
  }
}

function spawnStreamChat() {
  const template = pickStreamTemplate(STREAM_CHAT_MESSAGES);
  streamState.chat.unshift({
    ...template,
    text: formatStreamEraText(template.text),
    id: `chat-${performance.now()}-${Math.random()}`,
    age: 0,
  });
  if (streamState.chat.length > 12) streamState.chat.length = 12;
}

function spawnStreamVideo() {
  if (streamState.videos.length >= 2) return;
  const template = pickStreamTemplate(STREAM_VIDEO_EVENTS);
  streamState.videos.push({
    ...template,
    id: `video-${performance.now()}-${Math.random()}`,
    age: 0,
    thumbnailKey: pickStreamVideoThumbnailKey(Boolean(template.bad)),
  });
}

function pickStreamVideoThumbnailKey(isForbidden) {
  const keys = isForbidden ? STREAM_FORBIDDEN_VIDEO_THUMB_KEYS : STREAM_AVAILABLE_VIDEO_THUMB_KEYS;
  return keys[Math.floor(Math.random() * keys.length)] || null;
}

function getStreamVideoThumbnail(item, index = 0) {
  if (item?.thumbnailKey && isRenderableImage(assets[item.thumbnailKey])) return assets[item.thumbnailKey];
  const keys = item?.bad ? STREAM_FORBIDDEN_VIDEO_THUMB_KEYS : STREAM_AVAILABLE_VIDEO_THUMB_KEYS;
  const fallbackKey = keys[index % Math.max(keys.length, 1)];
  return isRenderableImage(assets[fallbackKey]) ? assets[fallbackKey] : null;
}

function spawnStreamDonation() {
  if (streamState.donations.length >= 2) return;
  const template = pickStreamTemplate(STREAM_DONATIONS);
  streamState.donations.push({
    ...template,
    text: formatStreamEraText(template.text),
    id: `donation-${performance.now()}-${Math.random()}`,
    age: 0,
  });
}

function ageStreamItems(items, delta, maxAge, onExpire) {
  for (let i = items.length - 1; i >= 0; i -= 1) {
    const item = items[i];
    item.age += delta;
    if (item.age >= maxAge) {
      items.splice(i, 1);
      onExpire(item);
    }
  }
}

function penalizeStreamMistake(amount) {
  const beforeRisk = streamState.risk;
  streamState.risk = Math.min(100, streamState.risk + amount);
  const riskDelta = streamState.risk - beforeRisk;
  if (riskDelta) addStreamHudPopup("risk", riskDelta);
  streamState.riskShake = Math.max(streamState.riskShake || 0, 0.34 + Math.min(amount, 24) * 0.012);
  adjustStreamPopularity(-Math.round(amount * 0.45));
  streamState.missedBad += 1;
  if (streamState.risk >= 100) {
    streamState.phase = "banned";
    streamState.contextMenu = null;
  }
}

function adjustStreamPopularity(amount) {
  if (!streamState) return;
  const before = streamState.popularity;
  streamState.popularity = clamp(streamState.popularity + amount, -99, 9999);
  const delta = streamState.popularity - before;
  if (delta) addStreamHudPopup("popularity", delta);
}

function adjustStreamGross(amount) {
  if (!streamState) return;
  const delta = Math.max(0, Math.floor(Number(amount) || 0));
  if (!delta) return;
  streamState.gross += delta;
  addStreamHudPopup("gross", delta);
}

function addStreamHudPopup(kind, amount) {
  if (!streamState?.hudPopups) return;
  const anchors = {
    popularity: { x: 292, y: 672, color: amount >= 0 ? "#75f4b2" : "#ff8fa3" },
    gross: { x: 454, y: 672, color: "#ffe16f" },
    risk: { x: 642, y: 672, color: "#ff6b80" },
  };
  const anchor = anchors[kind] || anchors.popularity;
  streamState.hudPopups.push({
    kind,
    amount,
    x: anchor.x,
    y: anchor.y,
    color: anchor.color,
    life: 1.05,
    maxLife: 1.05,
  });
  if (streamState.hudPopups.length > 10) streamState.hudPopups.shift();
}

function updateStreamHudPopups(delta) {
  if (!streamState?.hudPopups) return;
  for (const popup of streamState.hudPopups) {
    popup.life -= delta;
    popup.y -= 28 * delta;
  }
  for (let i = streamState.hudPopups.length - 1; i >= 0; i -= 1) {
    if (streamState.hudPopups[i].life <= 0) streamState.hudPopups.splice(i, 1);
  }
}

function finishLivestreamRun() {
  const gross = Math.max(0, streamState.gross);
  const playerShare = Math.floor(gross * 0.05);
  const xiaoShare = gross - playerShare;
  const testPopularityBonus = isNoViolationStreamTestEnabled() ? NO_VIOLATION_STREAM_TEST_POPULARITY_BONUS : 0;
  const popularityGain = Math.max(0, Math.round(streamState.popularity)) + testPopularityBonus;
  streamState.phase = "result";
  streamState.result = {
    gross,
    playerShare,
    xiaoShare,
    popularityGain,
    testPopularityBonus,
  };
}

function getLivestreamPerformerIds() {
  const currentTeamPerformers = teamSlots
    .filter((actorId) => actorId && actorId !== "hero")
    .filter((actorId) => {
      if (actorId === "npc3" && chapter4State.kinkoLeft) return false;
      const actor = getCharacterById(actorId);
      return actor && actor.following;
    })
    .slice(0, 3);
  if (currentTeamPerformers.length) return currentTeamPerformers;

  const fallbackIds = ["stream_two_vts", "post_kinko_stream_rest", "need_c22", "got_c22"].includes(chapter4State.phase)
    ? ["npc1", "npc2"]
    : ["npc1", "npc2", "npc3"];
  return fallbackIds.filter((actorId) => !(actorId === "npc3" && chapter4State.kinkoLeft));
}

function getActiveLivestreamPerformerIds() {
  return streamState?.performerIds?.length ? streamState.performerIds : getLivestreamPerformerIds();
}

function getActiveLivestreamPerformerActors() {
  return getActiveLivestreamPerformerIds().map(getCharacterById).filter(Boolean);
}

function advanceLivestream() {
  if (!streamState?.active || streamState.phase !== "result") return;
  const result = streamState.result;
  const isDebutStream = !chapter3State.streamCompleted;
  const performerIds = getActiveLivestreamPerformerIds();
  streamState = null;
  addShellFee(result.playerShare);
  grantCharacterPopularity(performerIds, result.popularityGain);
  chapter3State.phase = "completed";
  chapter3State.streamCompleted = true;
  chapter3State.completed = true;
  chapter3State.lastLivestreamDay = currentDay;
  saveGame();
  startSceneFadeIn(() => continueAfterLivestreamFade(result, isDebutStream), MAP_CHANGE_FADE_IN_TIME);
}

function continueAfterLivestreamFade(result, isDebutStream) {
  if (!isDebutStream && chapter4State.phase === "grow_popularity" && isChapter4PopularityGoalReached()) {
    finishChapter4PopularityGoal(questNpc);
    return;
  }
  if (!isDebutStream && chapter4State.phase === "stream_two_vts") {
    chapter4State.postKinkoStreamCount = Math.max(0, Number(chapter4State.postKinkoStreamCount) || 0) + 1;
    const completedTwoVtStreams = chapter4State.postKinkoStreamCount >= 2;
    if (completedTwoVtStreams) {
      chapter4State.phase = "post_kinko_stream_rest";
      chapter4State.postKinkoStreamDone = true;
    }
    saveGame();
    startDialogue(
      completedTwoVtStreams
        ? [
          { actor: vtNpcs[0], speaker: vtNpcs[0].label, body: "親親子還沒回來嗎..." },
          { actor: vtNpcs[1], speaker: vtNpcs[1].label, body: "等她水飽了，一定會回來的" },
        ]
        : [
          { actor: vtNpcs[0], speaker: vtNpcs[0].label, body: "親親子什麼時候才會回來..." },
          { actor: player, speaker: player.label, body: "她看到我們繼續直播，肯定會回來的" },
        ],
      null,
      player
    );
    return;
  }
  if (!isDebutStream) {
    const xiaoActor = questNpc.mapId === currentMapIndex ? questNpc : player;
    startDialogue(
      [
        { actor: xiaoActor, speaker: questNpc.label, body: `今天的直播收益 ${result.playerShare} 護貝費，明天繼續。` },
        { actor: player, speaker: player.label, body: "每天都播，這裡到底是公司還是直播工廠..." },
      ],
      null,
      xiaoActor
    );
    return;
  }
  startDialogue(
    [
      { actor: questNpc, speaker: questNpc.label, body: "聊天室怎麼一群不正常的人。" },
      { actor: player, speaker: player.label, body: `直播成功了，護貝費入帳 ${result.playerShare}。雖然蕭政銘抽走了 95%。` },
      { actor: vtNpcs[0], speaker: vtNpcs[0].label, body: "原來真的有人在看我們耶。" },
      { actor: vtNpcs[1], speaker: vtNpcs[1].label, body: "聊天室比鬧鐘還吵..." },
      { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "哼，才不是因為有人看我我才高興的。" },
      { actor: questNpc, speaker: questNpc.label, body: "對了，還沒加你們進Line群，QR扣秀出來我掃一下" },
      { actor: vtNpcs[2], speaker: vtNpcs[2].label, body: "...你到底有甚麼用?" },
      { actor: questNpc, speaker: questNpc.label, body: "不錯，明天開始每天播。" },
      { actor: vtNpcs[1], speaker: vtNpcs[1].label, body: "我可以辭職嗎。" },
      { actor: questNpc, speaker: questNpc.label, body: "等你畢業再說吧。" },
      { actor: vtNpcs[1], speaker: vtNpcs[1].label, body: "什麼時候可以畢業。" },
      { actor: questNpc, speaker: questNpc.label, body: "恭喜，永遠不能畢業。" },
      { actor: vtNpcs[0], speaker: vtNpcs[0].label, body: "原來大哥這麼不希望我們畢業，太感動了😭" },
      { actor: vtNpcs[1], speaker: vtNpcs[1].label, body: "他只是想讓我們做到死吧...🙄" },
      { actor: player, speaker: player.label, body: "真的能做起來嗎..." },
      { actor: questNpc, speaker: questNpc.label, body: "今天大家辛苦了先休息吧，我先回叉滴娛樂了，明早再來找我。" },
    ],
    () => {
      startChapter4AfterDebut();
      startChapterCompleteTransition("第三章 初配信...完");
    },
    questNpc
  );
}

function handleLivestreamKey(event) {
  if (!streamState?.active) return;
  const code = event.code;
  if (streamState.phase === "tutorial_intro") {
    if (code === CONFIRM_CODE && !event.repeat) {
      streamState.phase = "tutorial";
      setupStreamTutorialStep(0);
    }
    return;
  }
  if (streamState.phase === "tutorial_done") {
    if (code === "ArrowUp" || code === "ArrowDown") {
      streamState.tutorial.choiceIndex = streamState.tutorial.choiceIndex === 0 ? 1 : 0;
      return;
    }
    if (code === CONFIRM_CODE && !event.repeat) {
      confirmStreamTutorialDoneChoice();
    }
    return;
  }
  if (code === CONFIRM_CODE && !event.repeat) {
    if (streamState.phase === "result") {
      advanceLivestream();
    } else if (streamState.phase === "banned") {
      finishLivestreamBanned();
    }
  }
}

function confirmStreamTutorialDoneChoice() {
  if (!streamState?.active || streamState.phase !== "tutorial_done") return;
  if (streamState.tutorial.choiceIndex === 0) {
    streamState.phase = "tutorial";
    setupStreamTutorialStep(0);
    return;
  }
  chapter3State.streamTutorialDone = true;
  saveGame();
  beginLivestreamRun();
}

function finishLivestreamBanned() {
  const isDebutFailure = isCurrentStreamDebut();
  streamState = null;
  unlockPlayerTitle("ending3_unemployed");
  saveGame();
  startEnding(isDebutFailure ? "結局3 - 出道即畢業" : "結局3 - VT通通畢業", { retryLivestream: true, noticeKey: "ending3ContractNotice" });
}

function drawLivestreamScene() {
  const layout = STREAM_LAYOUT;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#050712";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const shake = getStreamRiskShakeOffset();
  ctx.save();
  ctx.translate(shake.x, shake.y);
  drawStreamVideoPanel(layout.video);
  drawStreamChatPanel(layout.chat);
  drawStreamHud();
  if (["tutorial_intro", "tutorial", "tutorial_done"].includes(streamState.phase)) drawStreamTutorialOverlay();
  drawStreamContextMenu();
  if (streamState.phase === "result") drawStreamResult();
  if (streamState.phase === "banned") drawStreamBannedOverlay();
  ctx.restore();
}

function getStreamRiskShakeOffset() {
  const burst = clamp(streamState?.riskShake || 0, 0, 1);
  if (burst <= 0) return { x: 0, y: 0 };
  const danger = clamp((streamState.risk || 0) / 100, 0, 1);
  const power = (5 + danger * 8) * burst;
  const time = performance.now();
  return {
    x: Math.sin(time / 21) * power + (Math.random() - 0.5) * power,
    y: Math.cos(time / 17) * power * 0.55 + (Math.random() - 0.5) * power * 0.55,
  };
}

function drawStreamVideoPanel(rect) {
  ctx.save();
  ctx.fillStyle = "#11182b";
  roundRect(rect.x, rect.y, rect.width, rect.height, 20);
  ctx.fill();
  ctx.strokeStyle = "rgba(117, 244, 178, 0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();

  const inner = { x: rect.x + 14, y: rect.y + 14, width: rect.width - 28, height: rect.height - 28 };
  ctx.save();
  roundRect(inner.x, inner.y, inner.width, inner.height, 16);
  ctx.clip();
  if (isRenderableImage(assets.liveBg)) {
    drawImageCover(assets.liveBg, inner.x, inner.y, inner.width, inner.height);
  } else {
    const gradient = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.width, rect.y + rect.height);
    gradient.addColorStop(0, "rgba(80,216,255,0.28)");
    gradient.addColorStop(1, "rgba(255,111,145,0.20)");
    ctx.fillStyle = gradient;
    ctx.fillRect(inner.x, inner.y, inner.width, inner.height);
  }
  ctx.fillStyle = "rgba(2, 6, 18, 0.16)";
  ctx.fillRect(inner.x, inner.y, inner.width, inner.height);
  ctx.restore();

  ctx.fillStyle = "#ffe16f";
  ctx.font = "bold 28px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
  ctx.shadowBlur = 8;
  ctx.fillText(getCurrentStreamTitle(), rect.x + 48, rect.y + 52);
  ctx.shadowBlur = 0;

  drawStreamDancers(rect);
  drawStreamHeadCams(rect);
  drawStreamVideoEvents(rect);
  drawStreamDonationBanners(rect);
  ctx.restore();
}

function drawImageCover(image, x, y, width, height) {
  const imageWidth = image.naturalWidth || image.width;
  const imageHeight = image.naturalHeight || image.height;
  if (!imageWidth || !imageHeight) return;
  const scale = Math.max(width / imageWidth, height / imageHeight);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (imageWidth - sourceWidth) / 2;
  const sourceY = (imageHeight - sourceHeight) / 2;
  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

function drawImageContain(image, x, y, width, height) {
  const imageWidth = image.naturalWidth || image.width;
  const imageHeight = image.naturalHeight || image.height;
  if (!imageWidth || !imageHeight) return;
  const scale = Math.min(width / imageWidth, height / imageHeight);
  const targetWidth = imageWidth * scale;
  const targetHeight = imageHeight * scale;
  const targetX = x + (width - targetWidth) / 2;
  const targetY = y + (height - targetHeight) / 2;
  ctx.drawImage(image, targetX, targetY, targetWidth, targetHeight);
}

function drawStreamDancers(rect) {
  const actors = getActiveLivestreamPerformerActors();
  if (!actors.length) return;
  const baseX = rect.x + rect.width / 2;
  const baseY = rect.y + rect.height * 0.58;
  const spacing = actors.length <= 1 ? 0 : Math.min(116, rect.width * 0.24);
  actors.forEach((actor, index) => {
    const sprite = SPRITES[actor.sprite];
    const bank = sprite.frames.down || sprite.frames.right;
    const walkFrames = bank.walk?.length ? bank.walk : [bank.idle];
    const frame = walkFrames[Math.floor((streamState.timer * 7 + index) % walkFrames.length)] || bank.idle;
    const x = baseX + (index - (actors.length - 1) / 2) * spacing;
    const y = baseY + Math.sin(streamState.timer * 5 + index) * 8;
    ctx.save();
    ctx.translate(x, y);
    ctx.shadowColor = hexToRgba(actor.tint, 0.9);
    ctx.shadowBlur = 24;
    ctx.fillStyle = hexToRgba(actor.tint, 0.28);
    ctx.beginPath();
    ctx.ellipse(0, 18, 48, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = "rgba(255, 245, 170, 0.95)";
    ctx.shadowBlur = 18;
    drawSpriteFrame(actor.sprite, frame, 0, 0, 1.08);
    ctx.restore();
    drawStreamDancerBubble(rect, x, y, getStreamDancerLine(index, actor.id, actors.length), actor.tint);
  });
}

function getStreamDancerLine(index, actorId, performerCount) {
  if (streamState?.phase !== "live") return null;
  const cycle = 5.4;
  const activeTime = streamState.timer % cycle;
  const speakerIndex = Math.floor(streamState.timer / cycle) % Math.max(performerCount, 1);
  if (speakerIndex !== index || activeTime > 3.8) return null;
  const lines = STREAM_DANCER_LINES_BY_ACTOR[actorId] || ["今天也要努力播。", "聊天室有點熱鬧。", "護貝費會自己長出來嗎？"];
  const lineIndex = Math.floor(streamState.timer / (cycle * Math.max(performerCount, 1))) % Math.max(lines.length, 1);
  return lines[lineIndex] || null;
}

function drawStreamDancerBubble(rect, x, y, text, tint) {
  if (!text) return;
  const width = 214;
  const height = 48;
  const bubbleX = clamp(x - width / 2, rect.x + 28, rect.x + rect.width - width - 28);
  const bubbleY = Math.max(rect.y + 86, y - 150);
  ctx.save();
  ctx.fillStyle = "rgba(255, 250, 255, 0.94)";
  ctx.shadowColor = hexToRgba(tint, 0.72);
  ctx.shadowBlur = 14;
  roundRect(bubbleX, bubbleY, width, height, 16);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = hexToRgba(tint, 0.72);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 250, 255, 0.94)";
  ctx.beginPath();
  ctx.moveTo(x - 10, bubbleY + height - 1);
  ctx.lineTo(x + 10, bubbleY + height - 1);
  ctx.lineTo(x, bubbleY + height + 12);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#23142a";
  ctx.font = "bold 18px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  drawWrappedLeftText(text, bubbleX + 16, bubbleY + 29, width - 32, 19, 1);
  ctx.restore();
}

function drawStreamHeadCams(rect) {
  const actors = getActiveLivestreamPerformerActors();
  const cams = getStreamHeadCamPositions(rect, actors.length);
  actors.forEach((actor, index) => {
    const cam = cams[index];
    if (!cam) return;
    const image = assets[getHeadAssetKey(actor.id)] || assets.headHero;
    ctx.save();
    ctx.fillStyle = "rgba(5, 12, 28, 0.86)";
    roundRect(cam.x, cam.y, 118, 118, 18);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.34)";
    ctx.stroke();
    if (isRenderableImage(image)) ctx.drawImage(image, cam.x + 15, cam.y + 15, 88, 88);
    ctx.restore();
  });
}

function getStreamHeadCamPositions(rect, count) {
  const corners = [
    { x: rect.x + 24, y: rect.y + 70 },
    { x: rect.x + rect.width - 142, y: rect.y + 70 },
    { x: rect.x + rect.width - 142, y: rect.y + rect.height - 156 },
  ];
  if (count === 1) return [{ x: rect.x + rect.width - 142, y: rect.y + 70 }];
  return corners;
}

function getHeadAssetKey(actorId) {
  if (actorId === "hero") return "headHero";
  return `head${actorId[0].toUpperCase()}${actorId.slice(1)}`;
}

function drawStreamVideoEvents(rect) {
  streamState.videos.forEach((item, index) => {
    const x = rect.x + 34 + index * 286;
    const y = rect.y + rect.height - 146;
    const width = 268;
    const height = 104;
    const thumbX = x + 12;
    const thumbY = y + 36;
    const thumbWidth = 92;
    const thumbHeight = 56;
    item.hit = { x, y, width, height, type: "video", id: item.id };
    ctx.save();
    ctx.fillStyle = item.bad ? "rgba(92, 12, 22, 0.94)" : "rgba(28, 65, 112, 0.92)";
    roundRect(x, y, width, height, 14);
    ctx.fill();
    ctx.strokeStyle = item.bad ? "#ff8fa1" : "#bdefff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = item.bad ? "#ffccd4" : "#9eeaff";
    ctx.font = "bold 17px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText(item.bad ? "違禁影片斗內" : "影片斗內", x + 14, y + 28);

    const thumbnail = getStreamVideoThumbnail(item, index);
    ctx.save();
    roundRect(thumbX, thumbY, thumbWidth, thumbHeight, 8);
    ctx.clip();
    if (thumbnail) {
      drawImageCover(thumbnail, thumbX, thumbY, thumbWidth, thumbHeight);
    } else {
      ctx.fillStyle = item.bad ? "rgba(255, 96, 112, 0.24)" : "rgba(140, 229, 255, 0.22)";
      ctx.fillRect(thumbX, thumbY, thumbWidth, thumbHeight);
    }
    if (item.bad) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.34)";
      ctx.fillRect(thumbX, thumbY, thumbWidth, thumbHeight);
      ctx.fillStyle = "#ffe1e6";
      ctx.font = "bold 15px 'Segoe UI', 'Noto Sans TC', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("違禁", thumbX + thumbWidth / 2, thumbY + thumbHeight / 2);
    }
    ctx.restore();
    ctx.strokeStyle = item.bad ? "#ff9aaa" : "#c6f6ff";
    ctx.lineWidth = 2;
    roundRect(thumbX, thumbY, thumbWidth, thumbHeight, 8);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px 'Segoe UI', 'Noto Sans TC', sans-serif";
    drawWrappedLeftText(item.title, x + 116, y + 56, width - 130, 21, 2);
    ctx.fillStyle = "#ffe16f";
    ctx.font = "bold 16px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText(`護貝費 ${item.amount}`, x + 116, y + height - 13);
    drawStreamSelectedItemFrame(item, 16);
    ctx.restore();
  });
}

function drawStreamDonationBanners(rect) {
  streamState.donations.forEach((item, index) => {
    const x = rect.x + 230;
    const y = rect.y + 76 + index * 68;
    item.hit = { x, y, width: 390, height: 56, type: "donation", id: item.id };
    ctx.save();
    ctx.fillStyle = item.bad ? "rgba(255, 68, 88, 0.9)" : "rgba(255, 225, 111, 0.92)";
    roundRect(x, y, 390, 56, 999);
    ctx.fill();
    ctx.fillStyle = item.bad ? "#ffffff" : "#2f2200";
    ctx.font = "bold 18px 'Segoe UI', 'Noto Sans TC', sans-serif";
    drawWrappedLeftText(`訊息斗內｜${item.user}：${item.text} +${item.amount}`, x + 20, y + 34, 350, 20, 1);
    drawStreamSelectedItemFrame(item, 999);
    ctx.restore();
  });
}

function drawStreamChatPanel(rect) {
  ctx.save();
  ctx.fillStyle = "rgba(8, 13, 28, 0.94)";
  roundRect(rect.x, rect.y, rect.width, rect.height, 20);
  ctx.fill();
  ctx.strokeStyle = "rgba(80, 216, 255, 0.28)";
  ctx.stroke();
  ctx.fillStyle = "#9eeaff";
  ctx.font = "bold 28px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText("聊天室", rect.x + 24, rect.y + 44);

  streamState.chat.forEach((item, index) => {
    const x = rect.x + 20;
    const y = rect.y + 72 + index * 48;
    item.hit = { x, y, width: rect.width - 40, height: 42, type: "chat", id: item.id };
    ctx.fillStyle = item.bad ? "rgba(255, 68, 88, 0.88)" : "rgba(255, 255, 255, 0.08)";
    roundRect(x, y, rect.width - 40, 42, 10);
    ctx.fill();
    ctx.fillStyle = item.bad ? "#ffffff" : "#dffaff";
    ctx.font = "bold 17px 'Segoe UI', 'Noto Sans TC', sans-serif";
    drawWrappedLeftText(`${item.user}：${item.text}`, x + 12, y + 27, rect.width - 64, 19, 1);
    drawStreamSelectedItemFrame(item, 12);
  });
  ctx.restore();
}

function drawStreamSelectedItemFrame(item, radius = 12) {
  if (streamState?.contextMenu?.target?.item !== item || !item.hit) return;
  const hit = item.hit;
  ctx.save();
  ctx.shadowColor = "rgba(255, 225, 111, 0.95)";
  ctx.shadowBlur = 16;
  ctx.strokeStyle = "#ffe16f";
  ctx.lineWidth = 4;
  roundRect(hit.x - 5, hit.y - 5, hit.width + 10, hit.height + 10, radius);
  ctx.stroke();
  ctx.restore();
}

function drawStreamHud() {
  const timeLeft = Math.max(0, Math.ceil(STREAM_DURATION - streamState.timer));
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.58)";
  roundRect(42, 662, 1194, 44, 999);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText(getStreamHudStatusLabel(timeLeft), 66, 690);
  ctx.fillStyle = "#75f4b2";
  ctx.fillText(`人氣 ${formatSignedNumber(Math.round(streamState.popularity))}`, 196, 690);
  ctx.fillStyle = "#ffe16f";
  ctx.fillText(`已收款 ${Math.round(streamState.gross)}`, 350, 690);
  drawStreamRiskHudText(540, 690);
  drawStreamHudPopups();
  ctx.restore();
}

function getStreamHudStatusLabel(timeLeft) {
  if (streamState.phase === "live") return `剩餘 ${timeLeft}s`;
  if (["tutorial_intro", "tutorial", "tutorial_done"].includes(streamState.phase)) return "直播教學";
  if (streamState.phase === "result") return "直播結算";
  if (streamState.phase === "banned") return "直播中斷";
  return "";
}

function drawStreamHudPopups() {
  if (!streamState?.hudPopups?.length) return;
  for (const popup of streamState.hudPopups) {
    const alpha = clamp(popup.life / popup.maxLife, 0, 1);
    ctx.save();
    ctx.globalAlpha = Math.min(1, alpha * 1.6);
    ctx.fillStyle = popup.color;
    ctx.font = "bold 22px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.textAlign = "left";
    ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
    ctx.shadowBlur = 8;
    ctx.fillText(formatSignedNumber(Math.round(popup.amount)), popup.x, popup.y);
    ctx.restore();
  }
}

function drawStreamRiskHudText(x, y) {
  const risk = Math.round(streamState.risk);
  const danger = clamp((streamState.risk - 45) / 55, 0, 1);
  const burst = clamp(streamState.riskShake || 0, 0, 1);
  const time = performance.now();
  const wobble = danger > 0 ? 1.4 + danger * 8 + burst * 8 : 0;
  const dx = Math.sin(time / Math.max(22 - danger * 10, 8)) * wobble + (Math.random() - 0.5) * burst * 7;
  const dy = Math.cos(time / Math.max(19 - danger * 8, 8)) * wobble * 0.42 + (Math.random() - 0.5) * burst * 4;
  const fontSize = 20 + Math.round(danger * 8 + burst * 4);
  ctx.save();
  ctx.translate(x + dx, y + dy);
  if (danger > 0) {
    ctx.shadowColor = danger > 0.72 ? "rgba(255, 40, 72, 0.9)" : "rgba(255, 225, 111, 0.55)";
    ctx.shadowBlur = 8 + danger * 18;
  }
  ctx.fillStyle = streamState.risk >= 85 ? "#ff304a" : streamState.risk >= 70 ? "#ff6b80" : "#cda2ff";
  ctx.font = `bold ${fontSize}px 'Segoe UI', 'Noto Sans TC', sans-serif`;
  ctx.fillText(`違規值 ${risk}`, 0, 0);
  ctx.restore();
}

function drawStreamContextMenu() {
  const menu = streamState.contextMenu;
  if (!menu) return;
  ctx.save();
  ctx.fillStyle = "rgba(4, 8, 18, 0.96)";
  roundRect(menu.x, menu.y, 182, menu.options.length * 42 + 14, 10);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.stroke();
  ctx.font = "bold 20px 'Segoe UI', 'Noto Sans TC', sans-serif";
  menu.options.forEach((option, index) => {
    option.hit = getStreamMenuOptionHit(menu, index);
    const hovered = menu.hoverIndex === index;
    ctx.fillStyle = hovered ? "rgba(255, 225, 111, 0.38)" : (index === 0 ? "rgba(255, 225, 111, 0.18)" : "rgba(255,255,255,0.06)");
    roundRect(option.hit.x, option.hit.y, option.hit.width, option.hit.height, 8);
    ctx.fill();
    if (hovered) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.58)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.fillText(option.label, option.hit.x + 14, option.hit.y + 27);
  });
  ctx.restore();
}

function drawStreamTutorialOverlay() {
  ctx.save();
  if (streamState.phase === "tutorial_intro") {
    ctx.fillStyle = "rgba(0, 0, 0, 0.68)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(8, 14, 30, 0.96)";
    roundRect(344, 206, 592, 260, 24);
    ctx.fill();
    ctx.strokeStyle = "rgba(117, 244, 178, 0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffe16f";
    ctx.font = "bold 40px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText("現在開始直播教學", 640, 286);
    ctx.fillStyle = "#dffaff";
    ctx.font = "bold 24px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText("先練習處理聊天室、影片斗內與訊息斗內。", 640, 338);
    ctx.fillStyle = "rgba(255,255,255,0.66)";
    ctx.font = "21px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText("按 Z 進入範例", 640, 404);
    ctx.restore();
    return;
  }
  if (streamState.phase === "tutorial_done") {
    ctx.fillStyle = "rgba(0, 0, 0, 0.68)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(8, 14, 30, 0.96)";
    roundRect(360, 188, 560, 300, 24);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 225, 111, 0.45)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffe16f";
    ctx.font = "bold 36px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText("直播教學完成", 640, 250);
    ctx.fillStyle = "rgba(255,255,255,0.82)";
    ctx.font = "22px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText("要再練一次，還是直接開始初配信？", 640, 296);
    const options = ["重新教學", "開始直播"];
    options.forEach((label, index) => {
      const selected = streamState.tutorial.choiceIndex === index;
      const hit = getStreamTutorialDoneOptionHit(index);
      ctx.fillStyle = selected ? "rgba(117, 244, 178, 0.24)" : "rgba(255,255,255,0.08)";
      roundRect(hit.x, hit.y, hit.width, hit.height, 12);
      ctx.fill();
      ctx.strokeStyle = selected ? "#75f4b2" : "rgba(255,255,255,0.14)";
      ctx.stroke();
      ctx.fillStyle = selected ? "#ffffff" : "rgba(255,255,255,0.72)";
      ctx.font = "bold 24px 'Segoe UI', 'Noto Sans TC', sans-serif";
      ctx.fillText(label, 640, hit.y + 28);
    });
    ctx.fillStyle = "rgba(255,255,255,0.62)";
    ctx.font = "18px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText("上下或滑鼠選擇，Z / 點擊確認", 640, 456);
    ctx.restore();
    return;
  }

  const tutorial = streamState.tutorial;
  const step = STREAM_TUTORIAL_STEPS[tutorial.step];
  if (!step) {
    ctx.restore();
    return;
  }
  const guideBox = getStreamTutorialGuideBox(step);
  ctx.fillStyle = "rgba(8, 14, 30, 0.92)";
  roundRect(guideBox.x, guideBox.y, guideBox.width, guideBox.height, 20);
  ctx.fill();
  ctx.strokeStyle = "rgba(117, 244, 178, 0.42)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffe16f";
  ctx.font = "bold 28px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText(step.title, guideBox.x + 30, guideBox.y + 42);
  ctx.fillStyle = "#dffaff";
  ctx.font = "21px 'Segoe UI', 'Noto Sans TC', sans-serif";
  drawWrappedLeftText(step.body, guideBox.x + 30, guideBox.y + 78, guideBox.width - 60, 27, 2);
  if (tutorial.feedback) {
    ctx.fillStyle = "#ff9eb3";
    ctx.font = "bold 19px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText(tutorial.feedback, guideBox.x + 30, guideBox.y + guideBox.height - 18);
  }
  const target = getStreamTutorialTarget();
  if (target?.item.hit) {
    const hit = target.item.hit;
    ctx.strokeStyle = "rgba(255, 225, 111, 0.95)";
    ctx.lineWidth = 4;
    ctx.shadowColor = "rgba(255, 225, 111, 0.75)";
    ctx.shadowBlur = 16;
    roundRect(hit.x - 5, hit.y - 5, hit.width + 10, hit.height + 10, 14);
    ctx.stroke();
  }
  ctx.restore();
}

function getStreamTutorialGuideBox(step) {
  if (step?.type === "chat") return { x: 112, y: 82, width: 600, height: 128 };
  if (step?.type === "video") return { x: 112, y: 228, width: 600, height: 128 };
  if (step?.type === "donation") return { x: 292, y: 424, width: 696, height: 132 };
  return { x: 112, y: 82, width: 600, height: 128 };
}

function getStreamTutorialDoneOptionHit(index) {
  return { x: 480, y: 334 + index * 56, width: 320, height: 42 };
}

function drawStreamBannedOverlay() {
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.78)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(70, 8, 18, 0.95)";
  roundRect(340, 210, 600, 260, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 120, 140, 0.72)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffccd4";
  ctx.font = "bold 44px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText("直播被封禁", 640, 292);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText(getCurrentStreamBannedLine(), 640, 348);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "22px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText("按 Z 繼續", 640, 414);
  ctx.restore();
}

function drawStreamResult() {
  const result = streamState.result;
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.78)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(8, 14, 30, 0.96)";
  roundRect(330, 145, 620, 430, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 225, 111, 0.45)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#ffe16f";
  ctx.font = "bold 40px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(getCurrentStreamResultTitle(), 640, 205);
  ctx.textAlign = "left";
  ctx.font = "bold 26px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillStyle = "#75f4b2";
  ctx.fillText(`人氣值上升：+${result.popularityGain}`, 420, 275);
  ctx.fillStyle = "#ffe16f";
  ctx.fillText(`護貝費總收益：${result.gross}`, 420, 325);
  ctx.fillStyle = "#ff9eb3";
  ctx.fillText(`蕭政銘抽成 95%：${result.xiaoShare}`, 420, 375);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`中之人取得 5%：${result.playerShare}`, 420, 425);
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "22px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("按 Z 繼續", 640, 520);
  ctx.restore();
}

function handleCanvasContextMenu(event) {
  if (!streamState?.active || !["live", "tutorial"].includes(streamState.phase)) return;
  event.preventDefault();
  const point = getCanvasPointer(event);
  const target = findStreamItemAt(point.x, point.y);
  if (!target) {
    streamState.contextMenu = null;
    return;
  }
  streamState.contextMenu = createStreamContextMenu(target, point.x, point.y);
  updateStreamContextMenuHover(point.x, point.y);
}

function handleCanvasClick(event) {
  if (!streamState?.active) return;
  const point = getCanvasPointer(event);
  if (streamState.phase === "tutorial_done") {
    const optionIndex = getStreamTutorialDoneOptionIndexAt(point.x, point.y);
    if (optionIndex >= 0) {
      streamState.tutorial.choiceIndex = optionIndex;
      confirmStreamTutorialDoneChoice();
    }
    return;
  }
  if (!streamState.contextMenu) return;
  const option = streamState.contextMenu.options.find((entry, index) => {
    const hit = entry.hit || getStreamMenuOptionHit(streamState.contextMenu, index);
    return point.x >= hit.x && point.x <= hit.x + hit.width && point.y >= hit.y && point.y <= hit.y + hit.height;
  });
  if (option) {
    applyStreamAction(streamState.contextMenu.target, option.action);
  }
  streamState.contextMenu = null;
  canvas.style.cursor = "default";
}

function handleCanvasMouseMove(event) {
  if (!streamState?.active) {
    canvas.style.cursor = "default";
    return;
  }
  const point = getCanvasPointer(event);
  if (streamState.phase === "tutorial_done") {
    const optionIndex = getStreamTutorialDoneOptionIndexAt(point.x, point.y);
    if (optionIndex >= 0) {
      streamState.tutorial.choiceIndex = optionIndex;
      canvas.style.cursor = "pointer";
      return;
    }
    canvas.style.cursor = "default";
    return;
  }
  const hoveringMenu = updateStreamContextMenuHover(point.x, point.y);
  if (hoveringMenu) {
    canvas.style.cursor = "pointer";
    return;
  }
  const hoveringItem = ["live", "tutorial"].includes(streamState.phase) && Boolean(findStreamItemAt(point.x, point.y));
  canvas.style.cursor = hoveringItem ? "context-menu" : "default";
}

function getStreamTutorialDoneOptionIndexAt(x, y) {
  for (let index = 0; index < 2; index += 1) {
    const hit = getStreamTutorialDoneOptionHit(index);
    if (x >= hit.x && x <= hit.x + hit.width && y >= hit.y && y <= hit.y + hit.height) return index;
  }
  return -1;
}

function getCanvasPointer(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height,
  };
}

function findStreamItemAt(x, y) {
  const pools = [
    ...streamState.chat.map((item) => ({ item, pool: streamState.chat })),
    ...streamState.videos.map((item) => ({ item, pool: streamState.videos })),
    ...streamState.donations.map((item) => ({ item, pool: streamState.donations })),
  ];
  return pools.find(({ item }) => {
    const hit = item.hit;
    return hit && x >= hit.x && x <= hit.x + hit.width && y >= hit.y && y <= hit.y + hit.height;
  }) || null;
}

function createStreamContextMenu(target, x, y) {
  const type = target.item.hit?.type;
  const options = type === "donation"
    ? [{ label: "退款", action: "refund" }, { label: "收錢", action: "collect" }]
    : type === "video"
      ? [{ label: "咖掉", action: "cut" }, { label: "收錢", action: "collect" }]
      : [{ label: "封鎖", action: "block" }, { label: "互動", action: "interact" }];
  const menu = {
    x: clamp(x, 20, canvas.width - 202),
    y: clamp(y, 20, canvas.height - options.length * 42 - 22),
    target,
    options,
    hoverIndex: -1,
  };
  menu.options.forEach((option, index) => {
    option.hit = getStreamMenuOptionHit(menu, index);
  });
  return menu;
}

function getStreamMenuOptionHit(menu, index) {
  return { x: menu.x + 7, y: menu.y + 11 + index * 42, width: 168, height: 34 };
}

function updateStreamContextMenuHover(x, y) {
  if (!streamState?.contextMenu) return false;
  const menu = streamState.contextMenu;
  menu.hoverIndex = menu.options.findIndex((entry, index) => {
    const hit = entry.hit || getStreamMenuOptionHit(menu, index);
    return x >= hit.x && x <= hit.x + hit.width && y >= hit.y && y <= hit.y + hit.height;
  });
  return menu.hoverIndex >= 0;
}

function applyStreamAction(target, action) {
  const { item, pool } = target;
  const type = item.hit?.type;
  if (streamState.phase === "tutorial") {
    applyStreamTutorialAction(target, action);
    return;
  }

  if (type === "chat") {
    if (item.bad && action === "block") {
      streamState.handledBad += 1;
      adjustStreamPopularity(4);
    } else if (!item.bad && action === "interact") {
      adjustStreamPopularity(6);
    } else if (!item.bad && action === "block") {
      adjustStreamPopularity(-8);
    } else if (item.bad && action === "interact") {
      penalizeStreamMistake(13);
    } else {
      penalizeStreamMistake(13);
    }
  } else if (type === "video") {
    if (action === "collect") {
      adjustStreamGross(item.amount);
      if (item.bad) penalizeStreamMistake(21);
      else adjustStreamPopularity(14);
    } else if (item.bad && action === "cut") {
      streamState.handledBad += 1;
      adjustStreamPopularity(5);
    } else {
      adjustStreamPopularity(-8);
    }
  } else if (type === "donation") {
    if (action === "collect") {
      adjustStreamGross(item.amount);
      if (item.bad) penalizeStreamMistake(17);
      else adjustStreamPopularity(10);
    } else if (item.bad && action === "refund") {
      streamState.handledBad += 1;
      adjustStreamPopularity(4);
    } else {
      adjustStreamPopularity(-8);
    }
  }

  const index = pool.indexOf(item);
  if (index >= 0) pool.splice(index, 1);
}

function applyStreamTutorialAction(target, action) {
  const tutorial = streamState.tutorial;
  const step = STREAM_TUTORIAL_STEPS[tutorial.step];
  const type = target.item.hit?.type;
  if (type === step.type && action === step.action) {
    const index = target.pool.indexOf(target.item);
    if (index >= 0) target.pool.splice(index, 1);
    setupStreamTutorialStep(tutorial.step + 1);
  } else {
    tutorial.feedback = step.feedback;
  }
}

function getStreamTutorialTarget() {
  const pools = [
    ...streamState.chat.map((item) => ({ item, pool: streamState.chat })),
    ...streamState.videos.map((item) => ({ item, pool: streamState.videos })),
    ...streamState.donations.map((item) => ({ item, pool: streamState.donations })),
  ];
  return pools[0] || null;
}

function startEnding(text = "蒐集到三個VT，可以開始騙宅男了~", options = {}) {
  keys.clear();
  hideDialogue();
  hideEndingPrompt();
  battleUiEl.classList.add("hidden");
  player.walkTime = 0;
  const mediaKey = options.mediaKey || null;
  if (mediaKey) {
    showEndingMedia(mediaKey);
  } else {
    hideEndingMedia();
  }
  endingState = {
    alpha: 0,
    textAlpha: 0,
    text,
    mediaKey,
    noticeKey: options.noticeKey || null,
    retryLivestream: Boolean(options.retryLivestream),
    reviveXiao: Boolean(options.reviveXiao),
    continueGame: Boolean(options.continueGame),
    retryChapter4Choice: Boolean(options.retryChapter4Choice),
    continueLabel: options.continueLabel || "繼續遊戲",
    continueMessage: options.continueMessage || "",
    retryPrompt: false,
    retryChoiceIndex: 0,
  };
}

function handleEndingKey(event) {
  if (!endingState || event.repeat || endingState.textAlpha < 1) return;
  if (endingState.retryPrompt) {
    if (endingState.reviveXiao) {
      if (event.code === CONFIRM_CODE) reviveXiaoFromEnding();
      return;
    }
    if (endingState.continueGame) {
      if (event.code === CONFIRM_CODE) continueGameFromEnding();
      return;
    }
    if (endingState.retryChapter4Choice) {
      if (event.code === CONFIRM_CODE) restartChapter4Ending4Choice();
      return;
    }
    if (event.code === "ArrowUp" || event.code === "ArrowDown") {
      endingState.retryChoiceIndex = endingState.retryChoiceIndex === 0 ? 1 : 0;
      return;
    }
    if (event.code === CONFIRM_CODE) {
      confirmEndingRetryChoice();
    }
    return;
  }
  if (event.code !== CONFIRM_CODE) return;
  if (endingState.retryLivestream || endingState.reviveXiao || endingState.continueGame || endingState.retryChapter4Choice) {
    endingState.retryPrompt = true;
    endingState.retryChoiceIndex = 0;
    return;
  }
  returnToTitleFromEnding();
}

function confirmEndingRetryChoice() {
  if (!endingState?.retryPrompt) return;
  if (endingState.retryLivestream) {
    if (endingState.retryChoiceIndex === 0) lowerLivestreamDifficulty();
    restartLivestreamFromEnding();
    return;
  }
  if (endingState.retryChoiceIndex === 0) {
    restartLivestreamFromEnding();
    return;
  }
  restartLivestreamFromEnding();
}

function restartLivestreamFromEnding() {
  keys.clear();
  hideDialogue();
  hideEndingMedia();
  hideEndingPrompt();
  endingState = null;
  streamState = null;
  chapter3State.streamTutorialDone = true;
  saveGame();
  beginLivestreamRun();
}

function reviveXiaoFromEnding() {
  keys.clear();
  hideDialogue();
  hideEndingMedia();
  hideEndingPrompt();
  endingState = null;
  battleState = null;
  dialogueState = null;
  reviveXiaoState();
  saveGame();
}

function reviveXiaoFromDialogue(npc = questNpc) {
  if (shellFee < XIAO_REVIVE_FEE) {
    startDialogue([{ actor: npc, speaker: npc.label, body: `護貝費不夠，復活要 ${XIAO_REVIVE_FEE}。` }], null, npc);
    return;
  }
  shellFee -= XIAO_REVIVE_FEE;
  addWorldFloatingText(player.x, player.y - 88, `護貝費 -${XIAO_REVIVE_FEE}`, "#ff8fa3", { life: 2.4, riseSpeed: 18 });
  reviveXiaoState();
  startDialogue(
    [
      { actor: npc, speaker: npc.label, body: "咳...剛剛那段不算。" },
      { actor: player, speaker: player.label, body: `花掉 ${XIAO_REVIVE_FEE} 護貝費，感覺更不爽了。` },
    ],
    null,
    npc
  );
}

function reviveXiaoState() {
  questNpcDefeated = false;
  questNpc.layingDown = false;
  questNpc.walkTime = 0;
  restoreChapter2WorldState();
  resetXiaoToDialoguePosition();
  [player, ...getVisibleNpcs()].forEach(seedTrail);
  updateCamera();
}

function continueGameFromEnding() {
  const continueMessage = endingState?.continueMessage || "";
  keys.clear();
  hideDialogue();
  hideEndingMedia();
  hideEndingPrompt();
  endingState = null;
  battleState = null;
  dialogueState = null;
  menuOpen = false;
  gameMenuEl.classList.add("hidden");
  updateCamera();
  if (continueMessage) addBattleHelpNotice(continueMessage);
  saveGame();
}

function restartChapter4Ending4Choice() {
  keys.clear();
  hideDialogue();
  hideEndingMedia();
  hideEndingPrompt();
  endingState = null;
  battleState = null;
  dialogueState = null;
  menuOpen = false;
  gameMenuEl.classList.add("hidden");
  chapter4KinkoHitSequence = null;
  chapter4ImpactSlashes.length = 0;
  chapter4State.phase = "rescue_cell_finale";
  chapter4State.rescueCellEntered = true;
  chapter4State.rescueBattleWon = true;
  chapter4State.rescueCellFinaleDone = true;
  placeChapter4RescueCellScene({ preservePlayer: true });
  const { dog } = getChapter4BaseActors();
  const kinko = vtNpcs[2];
  if (kinko) {
    kinko.layingDown = false;
    kinko.walkTime = 0;
    seedTrail(kinko);
  }
  if (dog && kinko) {
    dog.mapId = 11;
    dog.hidden = false;
    dog.following = false;
    dog.staticNpc = false;
    dog.fixedPlacement = false;
    dog.layingDown = false;
    dog.redAura = true;
    dog.x = kinko.x + 82;
    dog.y = kinko.y;
    dog.direction = "left";
    dog.idleDirection = "left";
    dog.walkTime = 0;
    seedTrail(dog);
  }
  focusChapter4CellGroupCamera();
  saveGame();
  startChapter4DogFinalChoice({ skipThreatLine: true });
}

function returnToTitleFromEnding() {
  keys.clear();
  hideDialogue();
  battleState = null;
  endingState = null;
  hideEndingMedia();
  hideEndingPrompt();
  openingCutscene = null;
  restCutscene = null;
  chapterCompleteTransition = null;
  streamState = null;
  dialogueState = null;
  menuOpen = false;
  gameMenuEl.classList.add("hidden");
  titleMenuIndex = 0;
  appMode = APP_MODE.TITLE;
  titleVideo.currentTime = 0;
  titleVideo.play().catch(() => {});
}

function drawEndingOverlay() {
  endingState.alpha = Math.min(endingState.alpha + 0.012, 0.88);
  if (endingState.alpha > 0.42) {
    endingState.textAlpha = Math.min(endingState.textAlpha + 0.022, 1);
  }

  ctx.save();
  ctx.fillStyle = `rgba(0, 0, 0, ${endingState.alpha})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  updateEndingMediaOpacity();
  if (endingState.noticeKey === "ending3ContractNotice") {
    drawEnding3ContractNotice();
  } else if (endingState.textAlpha > 0) {
    ctx.globalAlpha = endingState.textAlpha;
    ctx.fillStyle = "#fff7fb";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 40px 'Segoe UI', 'Noto Sans TC', sans-serif";
    const y = endingState.mediaKey ? canvas.height - 78 : canvas.height / 2;
    wrapCenteredText(endingState.text || "蒐集到三個VT，可以開始騙宅男了~", canvas.width / 2, y, canvas.width - 220, 56);
  }
  ctx.restore();
  if (endingState.retryPrompt) {
    drawEndingRetryPrompt();
  } else {
    hideEndingPrompt();
  }
}

function drawEnding3ContractNotice() {
  if (endingState.textAlpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = endingState.textAlpha;
  const paper = { x: 224, y: 70, width: 832, height: 468 };
  ctx.fillStyle = "#ffffff";
  roundRect(paper.x, paper.y, paper.width, paper.height, 6);
  ctx.fill();
  ctx.strokeStyle = "#1f2937";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#111827";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = "bold 31px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText("【叉滴娛樂旗下藝人合約解除公告】", canvas.width / 2, paper.y + 34);
  ctx.textAlign = "left";
  ctx.font = "22px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillStyle = "#1f2937";
  drawWrappedLeftText("感謝各位粉絲長久以來對叉滴娛樂的支持。", paper.x + 62, paper.y + 112, paper.width - 124, 34, 2);
  drawWrappedLeftText("本公司旗下藝人親親子、波貝貝、豬鼻醬，", paper.x + 62, paper.y + 178, paper.width - 124, 34, 2);
  ctx.font = "bold 23px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillStyle = "#0f172a";
  drawWrappedLeftText("因直播內容涉及大量違規內容，導致帳號被直播平台封禁，嚴重損害公司利益。", paper.x + 62, paper.y + 222, paper.width - 124, 36, 3);
  ctx.font = "22px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillStyle = "#1f2937";
  drawWrappedLeftText("經公司內部審慎評估並與當事人溝通，認為已無法維持後續合作，雙方於今日起正式終止經紀合約，並停止一切相關演藝活動。", paper.x + 62, paper.y + 340, paper.width - 124, 36, 5);
  ctx.textAlign = "center";
  ctx.font = "bold 22px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillStyle = "#111827";
  ctx.fillStyle = "#fff7fb";
  ctx.fillText(endingState.text || "結局3 - 出道即畢業", canvas.width / 2, paper.y + paper.height + 34);
  if (!endingState.retryPrompt) {
    ctx.font = "18px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.74)";
    ctx.fillText("按 Z 繼續", canvas.width / 2, canvas.height - 54);
  }
  ctx.restore();
}

function drawEndingRetryPrompt() {
  updateEndingPromptDom();
  ctx.save();
  ctx.globalAlpha = 1;
  const isRevivePrompt = Boolean(endingState.reviveXiao);
  const isContinuePrompt = Boolean(endingState.continueGame);
  const isChapter4ChoicePrompt = Boolean(endingState.retryChapter4Choice);
  const isSingleOption = isRevivePrompt || isContinuePrompt || isChapter4ChoicePrompt;
  const panel = isSingleOption
    ? { x: 372, y: 282, width: 536, height: 160 }
    : { x: 372, y: 414, width: 536, height: 210 };
  ctx.fillStyle = "rgba(8, 14, 30, 0.96)";
  roundRect(panel.x, panel.y, panel.width, panel.height, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 225, 111, 0.55)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffe16f";
  ctx.font = "bold 28px 'Segoe UI', 'Noto Sans TC', sans-serif";
  const promptTitle = isRevivePrompt
    ? "要復活蕭政銘嗎？"
    : isContinuePrompt
      ? "要繼續遊戲嗎？"
      : isChapter4ChoicePrompt
        ? "要重來嗎？"
        : endingState.retryLivestream
          ? "要降低直播難度嗎？"
          : "要重新直播挽回嗎？";
  ctx.fillText(promptTitle, 640, isSingleOption ? 324 : 462);
  const options = isRevivePrompt
    ? ["復活蕭政銘"]
    : isContinuePrompt
      ? [endingState.continueLabel || "繼續遊戲"]
      : isChapter4ChoicePrompt
        ? ["重來"]
        : endingState.retryLivestream
          ? ["降低難度後重新直播", "維持難度重新直播"]
          : ["重新直播"];
  options.forEach((label, index) => {
    const selected = endingState.retryChoiceIndex === index;
    const x = 460;
    const y = (isSingleOption ? 364 : 500) + index * 50;
    ctx.fillStyle = selected ? "rgba(117, 244, 178, 0.25)" : "rgba(255, 255, 255, 0.08)";
    roundRect(x, y, 360, 38, 12);
    ctx.fill();
    ctx.strokeStyle = selected ? "#75f4b2" : "rgba(255,255,255,0.16)";
    ctx.stroke();
    ctx.fillStyle = selected ? "#ffffff" : "rgba(255,255,255,0.72)";
    ctx.font = "bold 22px 'Segoe UI', 'Noto Sans TC', sans-serif";
    ctx.fillText(label, 640, y + 20);
  });
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  ctx.font = "17px 'Segoe UI', 'Noto Sans TC', sans-serif";
  ctx.fillText(isSingleOption ? "Z 確認" : "上下選擇，Z 確認", 640, isSingleOption ? 418 : 598);
  ctx.restore();
}

function updateEndingPromptDom() {
  if (!endingPromptEl || !endingState?.retryPrompt) return;
  const isRevivePrompt = Boolean(endingState.reviveXiao);
  const isContinuePrompt = Boolean(endingState.continueGame);
  const isChapter4ChoicePrompt = Boolean(endingState.retryChapter4Choice);
  const isLivestreamPrompt = Boolean(endingState.retryLivestream);
  const title = isRevivePrompt
    ? "要復活蕭政銘嗎？"
    : isContinuePrompt
      ? "要繼續遊戲嗎？"
      : isChapter4ChoicePrompt
        ? "要重來嗎？"
        : isLivestreamPrompt
          ? "要降低直播難度嗎？"
          : "要重新直播挽回嗎？";
  const options = isRevivePrompt
    ? "復活蕭政銘"
    : isContinuePrompt
      ? [endingState.continueLabel || "繼續遊戲"]
      : isChapter4ChoicePrompt
        ? ["重來"]
        : isLivestreamPrompt
          ? ["降低難度後重新直播", "維持難度重新直播"]
          : ["重新直播"];
  const optionList = Array.isArray(options) ? options : [options];
  endingPromptEl.innerHTML = `
    <div class="ending-prompt-title">${escapeHtml(title)}</div>
    ${optionList.map((option, index) => `
      <div class="ending-prompt-option ${endingState.retryChoiceIndex === index ? "is-selected" : "is-muted"}">${escapeHtml(option)}</div>
    `).join("")}
    <div class="ending-prompt-tip">${optionList.length > 1 ? "上下選擇，Z 確認" : "Z 確認"}</div>
  `;
  endingPromptEl.classList.remove("hidden");
}

function hideEndingPrompt() {
  if (!endingPromptEl) return;
  endingPromptEl.classList.add("hidden");
  endingPromptEl.innerHTML = "";
}

function showEndingMedia(mediaKey) {
  if (!endingMediaEl || !ENDING_MEDIA[mediaKey]) return;
  endingMediaEl.classList.remove("hidden");
  endingMediaEl.style.opacity = "0";
  // Refresh the URL so animated GIFs restart and keep playing as a DOM image.
  endingMediaEl.src = `${ENDING_MEDIA[mediaKey]}?play=${Date.now()}`;
}

function updateEndingMediaOpacity() {
  if (!endingMediaEl || !endingState?.mediaKey) return;
  endingMediaEl.style.opacity = String(clamp(endingState.textAlpha, 0, 1));
}

function hideEndingMedia() {
  if (!endingMediaEl) return;
  endingMediaEl.classList.add("hidden");
  endingMediaEl.style.opacity = "0";
  endingMediaEl.removeAttribute("src");
}

function wrapCenteredText(text, x, y, maxWidth, lineHeight) {
  const paragraphs = String(text ?? "").split("\n");
  const lines = [];
  for (const paragraph of paragraphs) {
    if (!paragraph) {
      lines.push("");
      continue;
    }
    let line = "";
    for (const char of paragraph) {
      const nextLine = line + char;
      if (line && ctx.measureText(nextLine).width > maxWidth) {
        lines.push(line);
        line = char;
      } else {
        line = nextLine;
      }
    }
    lines.push(line);
  }

  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => {
    const lineY = startY + index * lineHeight;
    ctx.strokeStyle = "rgba(20, 0, 10, 0.86)";
    ctx.lineWidth = 8;
    ctx.strokeText(line, x, lineY);
    ctx.fillText(line, x, lineY);
  });
}

function drawWrappedLeftText(text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const lines = [];
  let line = "";
  for (const char of String(text ?? "")) {
    const nextLine = line + char;
    if (line && ctx.measureText(nextLine).width > maxWidth) {
      lines.push(line);
      line = char;
      if (lines.length >= maxLines) break;
    } else {
      line = nextLine;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  lines.forEach((entry, index) => {
    ctx.fillText(entry, x, y + index * lineHeight);
  });
}

function startDialogue(sequence, onComplete = null, anchorActor = null) {
  keys.clear();
  player.walkTime = 0;
  if (anchorActor) {
    anchorActor.walkTime = 0;
    player.direction = axisToDirection(anchorActor.x - player.x, anchorActor.y - player.y);
    anchorActor.direction = axisToDirection(player.x - anchorActor.x, player.y - anchorActor.y);
  }

  dialogueState = {
    index: 0,
    sequence,
    onComplete,
    anchorActor,
    currentActor: sequence[0]?.actor || anchorActor || player,
  };
  showDialogueEntry(sequence[0]);
}

function advanceDialogue() {
  if (!dialogueState) return;
  if (dialogueState.choice) return;
  dialogueState.index += 1;
  if (dialogueState.index >= dialogueState.sequence.length) {
    const onComplete = dialogueState.onComplete;
    dialogueState = null;
    hideDialogue();
    if (onComplete) onComplete();
    return;
  }
  showDialogueEntry(dialogueState.sequence[dialogueState.index]);
}

function showDialogueEntry(entry) {
  dialogueState.currentActor = entry.actor;
  dialogueState.choice = entry.choices ? entry : null;
  dialogueChoiceIndex = 0;
  if (entry?.choices?.length) playSfx("ui_popup");
  dialogueSpeakerEl.textContent = entry.speaker;
  dialogueSpeakerEl.classList.toggle("is-xiao-speaker", isXiaoDialogueEntry(entry));
  dialogueSpeakerEl.classList.toggle("is-phone-speaker", entry?.speaker === "電話");
  dialogueSpeakerEl.classList.toggle("is-roger-speaker", isPhoneRemoteDialogueEntry(entry));
  dialogueEl.classList.toggle("is-explosion", Boolean(entry?.explosion));
  dialogueEl.classList.toggle("is-story-image", Boolean(entry?.storyImage));
  dialogueEl.classList.remove("story-pop", "dialogue-pop");
  renderDialogueBody(entry);
  dialogueEl.classList.remove("hidden");
  if (entry?.storyImage) {
    void dialogueEl.offsetWidth;
    dialogueEl.classList.add("story-pop");
  } else {
    void dialogueEl.offsetWidth;
    dialogueEl.classList.add("dialogue-pop");
  }
  updateDialogueBubblePosition();
}

function isXiaoDialogueEntry(entry) {
  return entry?.actor === questNpc || entry?.actor?.id === "npc4" || entry?.speaker === "蕭政銘";
}

function isPhoneRemoteDialogueEntry(entry) {
  return Boolean(entry?.phoneRemote) || ["羅傑", "親親幫幫眾"].includes(entry?.speaker);
}

function renderDialogueBody(entry) {
  if (!entry?.choices?.length) {
    dialogueBodyEl.textContent = entry?.body || "";
    return;
  }
  const body = entry.body ? `<div>${escapeHtml(entry.body)}</div>` : "";
  const choices = entry.choices.map((choice, index) => `
    <div class="dialogue-choice${index === dialogueChoiceIndex ? " is-selected" : ""}">
      ${index === dialogueChoiceIndex ? "▶ " : "　"}${escapeHtml(choice.label)}
    </div>
  `).join("");
  dialogueBodyEl.innerHTML = `${body}<div class="dialogue-choices">${choices}</div>`;
}

function handleDialogueChoiceKey(event) {
  if (event.repeat || !dialogueState?.choice) return;
  const choices = dialogueState.choice.choices || [];
  if (!choices.length) return;

  if (event.code === "ArrowUp") {
    playSfx("ui_cursor");
    dialogueChoiceIndex = wrapIndex(dialogueChoiceIndex - 1, choices.length);
    renderDialogueBody(dialogueState.choice);
    return;
  }
  if (event.code === "ArrowDown") {
    playSfx("ui_cursor");
    dialogueChoiceIndex = wrapIndex(dialogueChoiceIndex + 1, choices.length);
    renderDialogueBody(dialogueState.choice);
    return;
  }
  if (event.code === CONFIRM_CODE) {
    playSfx("ui_confirm");
    const selected = choices[dialogueChoiceIndex];
    dialogueState = null;
    hideDialogue();
    keys.clear();
    if (selected?.onSelect) selected.onSelect();
  }
}

function hideDialogue() {
  dialogueEl.classList.add("hidden");
  dialogueEl.classList.remove("is-explosion", "is-story-image", "story-pop", "dialogue-pop");
  dialogueBodyEl.textContent = "";
}

function updateDialogueBubblePosition() {
  if (dialogueEl.classList.contains("hidden") || !dialogueState || battleState?.active) return;
  const anchor = dialogueState.currentActor || dialogueState.anchorActor;
  if (!anchor) return;

  const sprite = SPRITES[anchor.sprite];
  const scaleX = canvas.clientWidth / canvas.width;
  const scaleY = canvas.clientHeight / canvas.height;
  const bubbleWidth = dialogueEl.offsetWidth || 280;
  const bubbleHeight = dialogueEl.offsetHeight || 120;
  const visualHeight = getActorDialogueVisualHeight(anchor, sprite);
  const screenX = canvas.offsetLeft + (anchor.x - camera.x) * scaleX;
  const screenY = canvas.offsetTop + (anchor.y - camera.y - visualHeight + 6) * scaleY;
  const minX = canvas.offsetLeft + bubbleWidth / 2 + 8;
  const maxX = canvas.offsetLeft + canvas.clientWidth - bubbleWidth / 2 - 8;
  const minBottomY = bubbleHeight + 12;
  const maxBottomY = canvas.offsetTop + canvas.clientHeight - 12;

  dialogueEl.style.left = `${clamp(screenX, minX, maxX)}px`;
  dialogueEl.style.top = `${clamp(screenY - 14, minBottomY, maxBottomY)}px`;
}

function getActorDialogueVisualHeight(actor, sprite) {
  if (Number.isFinite(actor?.dialogueVisualHeight)) return actor.dialogueVisualHeight;
  const frame = sprite ? getExploreActorFrame(actor, sprite) : null;
  const metrics = getSpriteFrameRenderMetrics(actor.sprite, frame, 1);
  if (metrics) return metrics.visualHeight;
  return sprite?.drawHeight || sprite?.frameHeight || 112;
}

function findNearestNpc() {
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const npc of getVisibleNpcs()) {
    if (npc.following) continue;
    const distance = Math.hypot(player.x - npc.x, player.y - npc.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = npc;
    }
  }
  return best;
}

function findNearestShopPoint() {
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const point of getVisibleShopPoints()) {
    const distance = Math.hypot(player.x - point.x, player.y - point.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = point;
    }
  }
  return best;
}

function findNearestHotelRoomPoint() {
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const point of getVisibleHotelRoomPoints()) {
    const distance = Math.hypot(player.x - point.x, player.y - point.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = point;
    }
  }
  return best;
}

function findNearestFloorMatPoint() {
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const point of getVisibleFloorMatPoints()) {
    const distance = Math.hypot(player.x - point.x, player.y - point.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = point;
    }
  }
  return best;
}

function findNearestTeleportPoint() {
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const point of getVisibleTeleportPoints()) {
    const distance = Math.hypot(player.x - point.x, player.y - point.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = point;
    }
  }
  return best;
}

function useHotelRoomPoint(roomPoint = null) {
  if (roomPoint?.id === "kidney_room") {
    useKidneyRoomPoint(roomPoint);
    return;
  }

  if (chapter3State.phase === "ready_stream") {
    startDialogue(
      [
        {
          actor: player,
          speaker: player.label,
          body: "要開始初配信嗎？",
          choices: [
            { label: "開始直播", onSelect: () => startLivestream() },
            { label: "先不要", onSelect: () => startDialogue([{ actor: player, speaker: player.label, body: "再檢查一下好了。" }], null, player) },
          ],
        },
      ],
      null,
      player
    );
    return;
  }

  if (canUseRoomForDailyLivestream()) {
    const alreadyStreamedToday = chapter3State.lastLivestreamDay === currentDay;
    startDialogue(
      [
        {
          actor: player,
          speaker: player.label,
          body: alreadyStreamedToday ? "今天已經播過了，再播下去中之人會壞掉。" : "今天要開直播嗎？",
          choices: [
            ...(alreadyStreamedToday ? [] : [{ label: "開始直播", onSelect: () => startLivestream() }]),
            { label: "一起水餃", onSelect: () => startHotelRoomRestCutscene() },
            {
              label: "先不要",
              onSelect: () => startDialogue([{ actor: player, speaker: player.label, body: "再繼續逛逛吧" }], null, player),
            },
          ],
        },
      ],
      null,
      player
    );
    return;
  }

  if (chapter2State.roomUnlocked) {
    startDialogue(
      [
        {
          actor: player,
          speaker: player.label,
          body: "要在房間一起水餃嗎？",
          choices: [
            { label: "一起水餃", onSelect: () => startHotelRoomRestCutscene() },
            {
              label: "先不要",
              onSelect: () => startDialogue([{ actor: player, speaker: player.label, body: "再繼續逛逛吧" }], null, player),
            },
          ],
        },
      ],
      null,
      player
    );
    return;
  }

  startDialogue(
    [
      { actor: player, speaker: player.label, body: "好像可以當作直播室。" },
      { actor: player, speaker: player.label, body: "旁邊那個肥宅看起來很像房主，問問看好了。" },
    ],
    null,
    player
  );
}

function canUseRoomForDailyLivestream() {
  if (isChapter4Started() && !["grow_popularity", "stream_two_vts"].includes(chapter4State.phase)) return false;
  return chapter2State.roomUnlocked
    && chapter3State.streamCompleted
    && chapter3State.phase === "completed";
}

function useKidneyRoomPoint(roomPoint) {
  const kidney = getCharacterById("npc14");
  const bebe = getCharacterById("npc2");
  if (isChapter4Started()) {
    startDialogue(
      [
        { actor: player, speaker: player.label, body: "敲了半天，房間裡沒有回應。" },
        { actor: player, speaker: player.label, body: "腰子親親獸好像不在。" },
      ],
      null,
      player
    );
    return;
  }
  if (!chapter3State.fluteUsed) {
    startDialogue(
      [
        { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "你們要幹嘛，那可是別人的房間" },
        { actor: player, speaker: player.label, body: "你知道是誰的房間嗎" },
        { actor: hotelOtakuNpc, speaker: hotelOtakuNpc.label, body: "不知道，只知道是一個白髮生物的房間，但是他已經好久都沒回來了" },
      ],
      null,
      hotelOtakuNpc
    );
    return;
  }

  if (chapter3State.bebeCollab?.status === "running") {
    startDialogue(
      [
        { actor: player, speaker: kidney?.label || "腰子親親獸", body: "聯動還在進行中，先讓她們播完。" },
        { actor: player, speaker: player.label, body: `再等 ${formatCountdown(chapter3State.bebeCollab.remaining)} 吧。` },
      ],
      null,
      player
    );
    return;
  }

  if (chapter3State.bebeCollab?.status === "done") {
    finishBebeCollabActivity(roomPoint, kidney, bebe);
    return;
  }

  if (chapter3State.lastBebeCollabDay === currentDay) {
    startDialogue(
      [
        { actor: player, speaker: kidney?.label || "腰子親親獸", body: "今天已經聯動過了，我的嗓子要睡回去。" },
        { actor: bebe || player, speaker: bebe?.label || "波貝貝", body: "我也要睡回去。" },
      ],
      null,
      player
    );
    return;
  }

  if (!isActorInTeam("npc2")) {
    startDialogue(
      [
        { actor: player, speaker: player.label, body: "波貝貝不在，這房間現在只剩一股很想睡的氣息。" },
      ],
      null,
      player
    );
    return;
  }

  startDialogue(
    [
      { actor: roomPoint, speaker: kidney?.label || "腰子親親獸", body: "是誰在敲門，我馬上出來" },
    ],
    () => {
      placeKidneyAtRoomDoor(roomPoint, "left");
      startDialogue(
        [
          { actor: kidney || player, speaker: kidney?.label || "腰子親親獸", body: "是波貝貝阿，是要一起聯動嗎?" },
          { actor: bebe || player, speaker: bebe?.label || "波貝貝", body: "如果可以坐著播，我可以。" },
          { actor: kidney || player, speaker: kidney?.label || "腰子親親獸", body: "小心不要睡著了哦。" },
          {
            actor: player,
            speaker: player.label,
            body: "要讓波貝貝和腰子親親獸聯動嗎？",
            choices: [
              { label: "一起聯動", onSelect: () => startBebeCollabActivity(roomPoint) },
              {
                label: "先不要",
                onSelect: () => startDialogue(
                  [
                    { actor: player, speaker: player.label, body: "今天先不要加班好了。" },
                    { actor: bebe || player, speaker: bebe?.label || "波貝貝", body: "太好了，我可以繼續水餃。" },
                  ],
                  null,
                  bebe || player
                ),
              },
            ],
          },
        ],
        null,
        kidney || player
      );
    },
    roomPoint
  );
}

function placeKidneyAtRoomDoor(roomPoint, direction = "left") {
  const kidney = getCharacterById("npc14");
  if (!kidney) return;
  kidney.mapId = currentMapIndex;
  kidney.x = roomPoint.x;
  kidney.y = clamp(roomPoint.y + 92, getCurrentRoad().top + 18, getCurrentRoad().bottom - 18);
  kidney.direction = direction;
  kidney.idleDirection = direction;
  kidney.staticNpc = true;
  kidney.fixedPlacement = true;
  kidney.layingDown = false;
  kidney.walkTime = 0;
  seedTrail(kidney);
}

function startBebeCollabActivity(roomPoint) {
  chapter3State.bebeCollab = {
    status: "running",
    remaining: CHAPTER3_DAILY_ACTIVITY_DURATION,
    day: currentDay,
  };
  sendChapter3MemberAway("npc2");
  const kidney = getCharacterById("npc14");
  if (kidney) {
    kidney.mapId = 99;
    seedTrail(kidney);
  }
  saveGame();
}

function finishBebeCollabActivity(roomPoint, kidney, bebe) {
  chapter3State.bebeCollab.status = "collecting";
  placeKidneyAtRoomDoor(roomPoint, "left");
  bebe = placeDailyActivityMember("npc2", roomPoint.x - 54, clamp(roomPoint.y + 96, getCurrentRoad().top + 18, getCurrentRoad().bottom - 18), "right") || bebe;
  startDialogue(
    [
      { actor: kidney || player, speaker: kidney?.label || "腰子親親獸", body: "聯動結束，波貝貝中途睡著三次。" },
      { actor: bebe || player, speaker: bebe?.label || "波貝貝", body: "但聊天室很安靜，適合水餃。" },
      { actor: player, speaker: player.label, body: "這樣也能有護貝費？" },
      { actor: kidney || player, speaker: kidney?.label || "腰子親親獸", body: "觀眾說很療癒，所以有。" },
    ],
    () => {
      addShellFee(CHAPTER3_DAILY_ACTIVITY_FEE);
      addPopularityReward("npc2", CHAPTER3_DAILY_POPULARITY_GAIN);
      chapter3State.lastBebeCollabDay = chapter3State.bebeCollab.day || currentDay;
      chapter3State.bebeCollab = { status: "idle", remaining: 0, day: 0 };
      returnDailyActivityMember("npc2", "波貝貝人氣上升");
      const kidneyActor = getCharacterById("npc14");
      if (kidneyActor) {
        kidneyActor.mapId = 99;
        seedTrail(kidneyActor);
      }
      saveGame();
    },
    kidney || player
  );
}

function useFloorMatPoint() {
  if (!isChapter2Started()) {
    startDialogue([{ actor: player, speaker: player.label, body: "地上看起來可以水餃，但現在還不是時候。" }], null, player);
    return;
  }
  if (isInitialStreamDayBeforeLiveFinished()) {
    startDialogue([{ actor: player, speaker: player.label, body: "今天初配信，先不要水餃，趕緊去直播室吧。" }], null, player);
    return;
  }
  startDialogue(
    [
      {
        actor: player,
        speaker: player.label,
        body: "要在地舖一起水餃嗎？",
        choices: [
          { label: "一起水餃", onSelect: () => startFloorMatRestCutscene() },
          {
            label: "先不要",
            onSelect: () => startDialogue([{ actor: player, speaker: player.label, body: "再繼續逛逛吧" }], null, player),
          },
        ],
      },
    ],
    null,
    player
  );
}

function isInitialStreamDayBeforeLiveFinished() {
  return isChapter3Started() && chapter3State.phase === "ready_stream" && !chapter3State.streamCompleted;
}

function useTeleportPoint(point) {
  if (point.id === "base_cell_exit" && chapter4State.phase === "base_captive") {
    startChapter4CaptiveDoorDialogue();
    return;
  }
  if (point.id === "xd_exit" && chapter5State.phase === "await_exit") {
    startChapter5HisadaReturnScene();
    return;
  }
  if (point.id === "strongest_tower_entry" && ["go_tower", "tournament"].includes(chapter5State.phase)) {
    startChapter5TournamentIntro();
    return;
  }
  if (!canUseMapGateBeforeFirstQuest("right", getCurrentRoad(), false)) return;
  if (!canUseChapter4ConfrontGate(point.targetMapId, "right", getCurrentRoad())) return;
  if (point.id === "xd_exit" && isChapter2TasksActive() && !chapter2State.exitReminderShown) {
    chapter2State.exitReminderShown = true;
    saveGame();
    startDialogue([{ actor: questNpc, speaker: questNpc.label, body: "順便請門口兩個抽菸的離開，好臭。" }], null, questNpc);
    return;
  }
  if (point.id === "xd_entry" && chapter4State.phase === "vt_missing") {
    enterChapter4XdScare(point);
    return;
  }
  if (point.id === "xd_entry" && chapter4State.phase === "post_ex_xd") {
    enterChapter4XdAfterEx(point);
    return;
  }
  if (point.id === "sector03_entry") {
    if (!["base_entry", "base_infiltration", "base_rescue"].includes(chapter4State.phase)) {
      startDialogue([{ actor: player, speaker: player.label, body: "那邊看起來不太妙，現在先不要過去。" }], null, player);
      return;
    }
    if (chapter4State.phase === "base_entry") {
      if (!isActiveBattlePartyFullyHealed()) {
        startDialogue([{ actor: player, speaker: player.label, body: "回去補充好體力再來吧。" }], null, player);
        return;
      }
      chapter4State.phase = "base_infiltration";
      chapter4State.baseEntryWarned = false;
      chapter4State.baseEncounterDone = false;
      placeChapter4BaseMonkeyOnly();
      saveGame();
    }
  }
  const mapChangeOptions = {
    followerPlacement: point.followerPlacement,
  };
  if (point.id === "sector03_entry" && chapter4State.phase === "base_infiltration" && !chapter4State.baseEncounterDone && !chapter4State.baseEntryWarned) {
    mapChangeOptions.onFadeComplete = startChapter4BaseEntryDialogue;
  }
  if (point.id === "sector03_entry" && chapter4State.phase === "base_rescue") {
    chapter4State.rescueEncounterStarted = false;
    changeMap(point.targetMapId, point.targetX, point.targetY, point.targetDirection, {
      ...mapChangeOptions,
      fadeIn: false,
    });
    prepareChapter4RescueBaseScene();
    saveGame();
    startSceneFadeIn(null, MAP_CHANGE_FADE_IN_TIME);
    return;
  }
  changeMap(point.targetMapId, point.targetX, point.targetY, point.targetDirection, mapChangeOptions);
}

function openShopMenu(point) {
  activeShopId = point.id;
  shopMenuIndex = 0;
  menuOpen = true;
  menuScreen = "shop";
  keys.clear();
  player.walkTime = 0;
  renderGameMenu();
  gameMenuEl.classList.remove("hidden");
}

function getCurrentShopGoods() {
  const point = SHOP_POINTS.find((shop) => shop.id === activeShopId) || SHOP_POINTS[0];
  const ids = new Set(point?.goods || []);
  const equipment = getAllEquipmentCatalogItems().filter((item) => ids.has(item.id));
  const items = Object.values(ITEM_CATALOG)
    .filter((item) => ids.has(item.id) && shouldShowShopCatalogItem(item.id))
    .map((item) => ({ ...item, kind: "item" }));
  return [...equipment, ...items];
}

function shouldShowShopCatalogItem(itemId) {
  if (itemId === "c22_pill") return chapter4State.phase === "need_c22" && getOwnedItemCount("c22_pill") <= 0;
  return true;
}

function getShopPrice(item) {
  if (!item) return 0;
  if (Number.isFinite(item.price)) return item.price;
  if (item.slot === "weapon") return 120;
  if (item.slot === "armor") return 150;
  return 180;
}

function renderShopIcon(item) {
  if (item.kind === "item") {
    return `<span class="equipment-icon" role="img" aria-label="${escapeHtml(item.name)}" style="background-image: url('${escapeHtml(item.icon)}')"></span>`;
  }
  return renderEquipmentIcon(item, item.slot);
}

function normalizeShopItemCounts(counts = {}) {
  return Object.fromEntries(
    Object.entries(counts || {})
      .map(([id, count]) => [id, Math.max(0, Math.floor(Number(count) || 0))])
      .filter(([, count]) => count > 0)
  );
}

function normalizeItemCounts(counts = {}) {
  return Object.fromEntries(
    Object.entries(counts || {})
      .map(([id, count]) => [id, Math.max(0, Math.floor(Number(count) || 0))])
      .filter(([, count]) => count > 0)
  );
}

function getOwnedItemCount(itemId) {
  return Math.max(0, Number(ownedItems[itemId]) || 0);
}

function addOwnedItem(itemId, amount = 1) {
  if (!itemId) return;
  ownedItems[itemId] = getOwnedItemCount(itemId) + Math.max(1, Math.floor(Number(amount) || 1));
}

function addOwnedShopItem(itemId, amount = 1) {
  if (!itemId) return;
  const current = Math.max(0, Number(ownedShopItemCounts[itemId]) || 0);
  ownedShopItemCounts[itemId] = current + Math.max(1, Math.floor(Number(amount) || 1));
}

function getShopItemOwnedCount(item) {
  if (!item?.id) return 0;
  if (item.kind === "item") return getOwnedItemCount(item.id);
  const counted = Math.max(0, Number(ownedShopItemCounts[item.id]) || 0);
  const boughtRequiredItem = CHAPTER2_REQUIRED_EQUIPMENT.includes(item.id) && chapter2State.equipment?.[item.id];
  const equippedCount = getEquippedEquipmentCount(item.id);
  return Math.max(counted, boughtRequiredItem ? 1 : 0, equippedCount);
}

function isShopItemSoldOut(item) {
  if (item?.id === "bebe_flute") return !canBuyBebeFlute() || getOwnedItemCount("bebe_flute") > 0;
  if (item?.id === "c22_pill") return !canBuyC22Pill() || getOwnedItemCount("c22_pill") > 0;
  return false;
}

function canBuyBebeFlute() {
  return isChapter3Started() && ["find_members", "ready_report", "ready_stream"].includes(chapter3State.phase);
}

function canBuyC22Pill() {
  return chapter4State.phase === "need_c22" || chapter4State.phase === "got_c22";
}

function getSoldOutShopMessage(item) {
  if (item?.id === "bebe_flute" && !canBuyBebeFlute()) return "波貝貝之笛還沒進貨";
  if (item?.id === "c22_pill" && !canBuyC22Pill()) return "C-22 藥錠還沒上架";
  return "這個已經買過了";
}

function buyShopItem(item) {
  if (!item) return;
  if (isShopItemSoldOut(item)) {
    addWorldFloatingText(player.x, player.y - 80, getSoldOutShopMessage(item), "#8ff5ff");
    return;
  }
  if (CHAPTER2_REQUIRED_EQUIPMENT.includes(item.id) && hasChapter2RequiredEquipment(item.id)) {
    addWorldFloatingText(player.x, player.y - 80, "這個設備已經買過了", "#8ff5ff");
    return;
  }
  const price = getShopPrice(item);
  if (shellFee < price) {
    addWorldFloatingText(player.x, player.y - 80, "護貝費不夠", "#ff8fa3");
    return;
  }
  shellFee -= price;
  if (item.kind === "item") {
    addOwnedItem(item.id);
    if (item.id === "bebe_flute") chapter3State.fluteBought = true;
    if (item.id === "c22_pill") {
      chapter4State.phase = "got_c22";
      chapter4State.c22Bought = true;
    }
  } else {
    addOwnedShopItem(item.id);
  }
  addWorldFloatingText(player.x, player.y - 80, item.id === "c22_pill" ? "取得 C-22 藥錠" : `買了 ${item.name}`, "#ffe16f");
  setChapter2EquipmentBought(item.id);
  saveGame();
  if (item.id === "c22_pill") {
    closeGameMenu();
    startDialogue(
      [
        { actor: player, speaker: player.label, body: "買到C-22藥錠了，話說這個要怎麼使用" },
        { actor: vtNpcs[1], speaker: vtNpcs[1].label, body: "回去問肥宅吧" },
      ],
      null,
      null
    );
  }
}

function startFollowing(npc) {
  npc.following = true;
  addCharacterToTeam(npc.id, { announce: true });
  seedTrail(npc);
  collected += 1;
  saveGame();
}

function recordTrailPoint(actor) {
  actor.trail.unshift({ x: actor.x, y: actor.y, direction: actor.direction });
  if (actor.trail.length > TRAIL_LENGTH) actor.trail.length = TRAIL_LENGTH;
}

function seedTrail(actor) {
  actor.trail = [];
  for (let i = 0; i < TRAIL_LENGTH; i += 1) {
    actor.trail.push({ x: actor.x, y: actor.y, direction: actor.direction });
  }
}

function getFollowLeader(npc) {
  if (npc.followIndex <= 1) return player;
  return getOrderedFollowers().find((candidate) => candidate !== npc && candidate.followIndex === npc.followIndex - 1) || player;
}

function followLeaderTrail(npc, delta) {
  const leader = getFollowLeader(npc);
  const trailPoint = leader.trail[Math.min(FOLLOW_TRAIL_GAP, leader.trail.length - 1)] || {
    x: leader.x,
    y: leader.y,
    direction: leader.direction,
  };
  const standPoint = getFollowStandPoint(leader, FOLLOW_DISTANCE);
  const target = getActorMotion(leader) > 10 ? trailPoint : standPoint;
  const dx = target.x - npc.x;
  const dy = target.y - npc.y;
  const distance = Math.hypot(dx, dy);

  if (distance < FOLLOW_STOP_RADIUS) {
    npc.walkTime = 0;
    npc.direction = player.direction;
    return;
  }

  const speedScale = distance < FOLLOW_SLOW_RADIUS ? 0.22 + (distance / FOLLOW_SLOW_RADIUS) * 0.48 : 0.92;
  const followSpeed = Math.max(Number(npc.speed) || 0, 230);
  const step = Math.min(distance, followSpeed * speedScale * delta);
  npc.x += (dx / distance) * step;
  npc.y += (dy / distance) * step;
  npc.direction = axisToDirection(dx, dy);
  npc.walkTime += delta * 8;
  const road = getCurrentRoad();
  npc.x = clamp(npc.x, road.left, road.right);
  npc.y = clamp(npc.y, road.top, road.bottom);
}

function getFollowStandPoint(leader, spacing) {
  if (leader.direction === "up") return { x: leader.x, y: leader.y + spacing, direction: leader.direction };
  if (leader.direction === "down") return { x: leader.x, y: leader.y - spacing, direction: leader.direction };
  if (leader.direction === "left") return { x: leader.x + spacing, y: leader.y, direction: leader.direction };
  return { x: leader.x - spacing, y: leader.y, direction: leader.direction };
}

function getActorMotion(actor) {
  if (actor.trail.length < 7) return 0;
  return Math.hypot(actor.trail[0].x - actor.trail[6].x, actor.trail[0].y - actor.trail[6].y);
}

function getFrame(actor, sprite) {
  const bank = sprite.frames[actor.direction] || sprite.frames.down;
  if (actor.walkTime > 0 && bank.walk.length) {
    return bank.walk[Math.floor(actor.walkTime) % bank.walk.length];
  }
  return bank.idle;
}

function getBattleFrame(unit) {
  const sprite = SPRITES[unit.actor.sprite];
  const battleFrames = sprite.battleFrames || {};
  if (unit.hp <= 0 && battleFrames.ko) return orientBattleFrame(unit, battleFrames.ko);

  const battleEnded = battleState?.phase === "victory" || battleState?.phase === "defeat";
  if (battleEnded && unit.hp > 0) {
    const won = (battleState.phase === "victory" && unit.side === "player") || (battleState.phase === "defeat" && unit.side === "enemy");
    if (won && battleFrames.victory) return battleFrames.victory;
  }

  if (unit.hitTimer > 0 && battleFrames.hit) return orientBattleFrame(unit, battleFrames.hit);
  if (unit.actionTimer > 0 && battleFrames.attack) return orientBattleFrame(unit, battleFrames.attack);
  if (unit.actor?.walkTime <= 0 && unit.actor?.dialogueIdleFrames?.[unit.actor.direction]) {
    return unit.actor.dialogueIdleFrames[unit.actor.direction];
  }
  if (unit.actor?.walkTime <= 0 && unit.actor?.staticIdleFrame) return unit.actor.staticIdleFrame;
  return getFrame(unit.actor, sprite);
}

function orientBattleFrame(unit, frame) {
  if (unit.side !== "enemy") return frame;
  return { ...frame, flip: !frame.flip };
}

function createActor(config) {
  return {
    walkTime: 0,
    followIndex: 0,
    trail: [],
    following: false,
    patrolOffset: 0,
    patrolState: "walk",
    patrolTimer: 1.2,
    patrolHeading: 1,
    patrolRise: 0,
    ...config,
  };
}

function createExpandedGridFrame(row, col, flip = false, scale = 1, options = {}) {
  return {
    autoRow: row,
    autoCol: col,
    flip,
    scale,
    anchorX: options.anchorX,
    anchorY: options.anchorY,
    clampAutoCrop: Boolean(options.clampAutoCrop),
  };
}

function expandedGridFrames(row, columns, flip = false) {
  return columns.map((col) => createExpandedGridFrame(row, col, flip));
}

function createFramesFromRule(rule, fallbackRule = null) {
  const safeRule = rule || fallbackRule || { row: 0, cols: [0] };
  if (safeRule.frames?.length) {
    const frames = safeRule.frames.map(([x, y, width, height, frameFlip]) => sourceFrame(x, y, width, height, frameFlip ?? Boolean(safeRule.flip)));
    const idleFrame = safeRule.idleFrame
      ? sourceFrame(
        safeRule.idleFrame[0],
        safeRule.idleFrame[1],
        safeRule.idleFrame[2],
        safeRule.idleFrame[3],
        safeRule.idleFrame[4] ?? Boolean(safeRule.flip)
      )
      : frames[0];
    return {
      idle: idleFrame,
      walk: frames,
    };
  }
  const cells = safeRule.cells?.length
    ? safeRule.cells
    : (safeRule.cols?.length ? safeRule.cols : [0]).map((col) => [safeRule.row, col]);
  const options = {
    anchorX: safeRule.anchorX,
    anchorY: safeRule.anchorY,
    clampAutoCrop: safeRule.clampAutoCrop,
  };
  const idleOptions = {
    anchorX: safeRule.idleAnchorX ?? safeRule.anchorX,
    anchorY: safeRule.idleAnchorY ?? safeRule.anchorY,
    clampAutoCrop: safeRule.clampAutoCrop,
  };
  const createFrame = ([row, col, cellFlip], frameOptions = options) => createExpandedGridFrame(row, col, cellFlip ?? Boolean(safeRule.flip), 1, frameOptions);
  return {
    idle: createFrame(safeRule.idle || cells[0], idleOptions),
    walk: cells.map(createFrame),
  };
}

function createBattleFrameFromRule(layout, key, fallback) {
  const frame = layout.battle?.[key] || fallback;
  if (frame.length >= 4) {
    return sourceFrame(frame[0], frame[1], frame[2], frame[3], Boolean(frame[4]), frame[5] || 0);
  }
  return createExpandedGridFrame(frame[0], frame[1], Boolean(frame[2]));
}

function createGenericCharacterSprite(src, characterNumber) {
  const layout = EXTRA_CHARACTER_FRAME_LAYOUTS[characterNumber] || {};
  return {
    src,
    pixelScale: 0.72,
    footOffset: 30,
    frames: {
      down: createFramesFromRule(layout.down),
      right: createFramesFromRule(layout.right, layout.down),
      left: createFramesFromRule(layout.left, layout.right),
      up: createFramesFromRule(layout.up, layout.down),
    },
    battleFrames: {
      attack: createBattleFrameFromRule(layout, "attack", [5, 0]),
      hit: createBattleFrameFromRule(layout, "hit", [5, 5]),
      ko: createBattleFrameFromRule(layout, "ko", [6, 3]),
      victory: createBattleFrameFromRule(layout, "victory", [7, 0]),
    },
  };
}

function createHeroSprite(src) {
  return {
    src,
    frameWidth: 128,
    frameHeight: 128,
    frameColumns: createFrameBoundaries(1024, 8),
    frameRows: createFrameBoundaries(1024, 8),
    frameInset: 1,
    drawWidth: 104,
    drawHeight: 104,
    frames: {
      down: { idle: { row: 0, col: 0 }, walk: rangeFrames(0, [0, 1, 2, 3, 4, 5]) },
      right: { idle: { row: 2, col: 6 }, walk: rangeFrames(1, [0, 1, 2, 3, 4, 5]) },
      left: { idle: { row: 2, col: 7 }, walk: rangeFrames(1, [0, 1, 2, 3, 4, 5], true) },
      up: { idle: { row: 2, col: 0 }, walk: rangeFrames(2, [0, 1, 2, 3, 4, 5]) },
    },
    battleFrames: {
      attack: { row: 5, col: 4 },
      hit: { row: 5, col: 7 },
      ko: sourceFrame(651, 944, 106, 80, false, 4),
      victory: { row: 5, col: 1 },
    },
  };
}

function createNpc1Sprite(src) {
  return {
    src,
    pixelScale: 0.82,
    drawWidth: 112,
    drawHeight: 140,
    footOffset: 22,
    frames: {
      down: {
        idle: sourceFrame(795, 31, 94, 166),
        walk: sourceFrames([
          [31, 68, 70, 157],
          [159, 63, 66, 162],
          [287, 63, 66, 166],
          [411, 63, 70, 162],
          [543, 68, 66, 157],
          [671, 63, 66, 162],
        ]),
      },
      right: {
        idle: sourceFrame(775, 579, 86, 165),
        walk: sourceFrames([
          [15, 328, 114, 153],
          [148, 332, 96, 153],
          [276, 328, 97, 157],
          [404, 328, 113, 153],
          [532, 331, 96, 154],
          [660, 332, 96, 157],
        ], true),
      },
      left: {
        idle: sourceFrame(931, 579, 85, 166),
        walk: sourceFrames([
          [15, 328, 114, 153],
          [148, 332, 96, 153],
          [276, 328, 97, 157],
          [404, 328, 113, 153],
          [532, 331, 96, 154],
          [660, 332, 96, 157],
        ]),
      },
      up: {
        idle: sourceFrame(923, 39, 90, 158),
        walk: sourceFrames([
          [35, 583, 73, 146],
          [143, 591, 82, 146],
          [276, 585, 73, 156],
          [411, 583, 86, 146],
          [675, 585, 74, 156],
        ]),
      },
    },
    battleFrames: {
      attack: sourceFrame(264, 844, 124, 157, false, 4),
      hit: sourceFrame(392, 851, 96, 150, false, 4),
      ko: sourceFrame(776, 768, 108, 72, false, 4),
      victory: sourceFrame(667, 843, 97, 161, false, 4),
    },
  };
}

function createNpc2Sprite(src) {
  return {
    src,
    pixelScale: 0.84,
    drawWidth: 112,
    drawHeight: 138,
    footOffset: 22,
    frames: {
      down: {
        idle: sourceFrame(32, 72, 68, 152),
        walk: sourceFrames([
          [32, 72, 68, 152],
          [152, 76, 72, 148],
          [288, 76, 64, 152],
          [412, 76, 68, 148],
          [672, 68, 64, 156],
          [152, 76, 72, 148],
        ]),
      },
      right: {
        idle: sourceFrame(919, 584, 73, 156),
        walk: sourceFrames([
          [16, 332, 112, 148],
          [148, 334, 108, 150],
          [276, 332, 108, 152],
          [404, 332, 112, 148],
          [148, 334, 108, 150],
        ], true),
      },
      left: {
        idle: sourceFrame(804, 584, 72, 156),
        walk: sourceFrames([
          [16, 332, 112, 148],
          [148, 334, 108, 150],
          [276, 332, 108, 152],
          [404, 332, 112, 148],
          [148, 334, 108, 150],
        ]),
      },
      up: {
        idle: sourceFrame(544, 76, 72, 148),
        walk: sourceFrames([
          [544, 76, 72, 148],
          [916, 324, 80, 160],
        ]),
      },
    },
    battleFrames: {
      attack: sourceFrame(12, 828, 104, 172, false, 4),
      hit: sourceFrame(392, 848, 116, 152, false, 4),
      ko: sourceFrame(772, 944, 124, 60, false, 4),
      victory: sourceFrame(139, 840, 113, 160, false, 4),
    },
  };
}

function createNpc3Sprite(src) {
  return {
    src,
    pixelScale: 0.9,
    drawWidth: 112,
    drawHeight: 132,
    footOffset: 22,
    frames: {
      down: {
        idle: sourceFrame(792, 7, 80, 121),
        walk: sourceFrames([
          [23, 7, 83, 121],
          [150, 7, 84, 121],
          [279, 7, 83, 121],
          [406, 7, 84, 121],
          [535, 7, 83, 121],
          [663, 7, 83, 121],
        ]),
      },
      right: {
        idle: sourceFrame(800, 265, 60, 119),
        walk: sourceFrames([
          [144, 137, 93, 119],
          [275, 138, 87, 118],
          [400, 138, 89, 118],
          [275, 138, 87, 118],
        ]),
      },
      left: {
        idle: sourceFrame(932, 265, 60, 119),
        walk: sourceFrames([
          [21, 137, 94, 119],
          [535, 137, 88, 119],
          [663, 137, 88, 119],
          [535, 137, 88, 119],
        ]),
      },
      up: {
        idle: sourceFrame(920, 7, 80, 121),
        walk: sourceFrames([
          [920, 7, 80, 121],
          [920, 7, 80, 121],
        ]),
      },
    },
    battleFrames: {
      attack: { ...sourceFrame(144, 599, 102, 137, false, 4), scale: 0.88 },
      hit: { ...sourceFrame(531, 595, 85, 141, false, 4), scale: 0.86 },
      ko: sourceFrame(528, 771, 125, 60, false, 4),
      victory: { ...sourceFrame(658, 845, 99, 159, false, 4), scale: 0.82 },
    },
  };
}

function createQuestNpcSprite(src) {
  return {
    src,
    pixelScale: 0.86,
    drawWidth: 112,
    drawHeight: 136,
    footOffset: 22,
    frames: {
      down: {
        idle: sourceFrame(799, 11, 66, 142),
        walk: sourceFrames([
          [35, 83, 66, 142],
          [163, 83, 62, 142],
          [287, 83, 62, 146],
          [411, 83, 66, 142],
          [543, 83, 62, 142],
          [675, 79, 62, 146],
        ]),
      },
      right: {
        idle: sourceFrame(931, 171, 58, 146),
        walk: sourceFrames([
          [15, 339, 102, 142],
          [148, 343, 73, 142],
          [279, 339, 86, 146],
          [404, 339, 101, 142],
          [532, 343, 77, 142],
          [660, 343, 84, 146],
        ], true),
      },
      left: {
        idle: sourceFrame(803, 171, 58, 146),
        walk: sourceFrames([
          [15, 339, 102, 142],
          [148, 343, 73, 142],
          [279, 339, 86, 146],
          [404, 339, 101, 142],
          [532, 343, 77, 142],
          [660, 343, 84, 146],
        ]),
      },
      up: {
        idle: sourceFrame(927, 7, 66, 146),
        walk: sourceFrames([
          [927, 7, 66, 146],
          [927, 7, 66, 146],
        ]),
      },
    },
    battleFrames: {
      attack: sourceFrame(784, 500, 108, 112, false, 4),
      hit: sourceFrame(16, 740, 88, 108, false, 4),
      ko: sourceFrame(388, 796, 120, 44, false, 4),
      victory: sourceFrame(404, 856, 96, 148, false, 4),
    },
  };
}

function rangeFrames(row, cols, flip = false) {
  return cols.map((col) => ({ row, col, flip }));
}

function sourceFrames(frames, flip = false) {
  return frames.map(([x, y, width, height]) => sourceFrame(x, y, width, height, flip));
}

function sourceFrame(x, y, width, height, flip = false, pad = 0) {
  return {
    x: x - pad,
    y: y - pad,
    width: width + pad * 2,
    height: height + pad * 2,
    flip,
  };
}

function createFrameBoundaries(size, divisions) {
  const boundaries = [];
  for (let i = 0; i <= divisions; i += 1) {
    boundaries.push(Math.round((size * i) / divisions));
  }
  return boundaries;
}

function getFrameSourceRect(sprite, frame, image) {
  if (frame.autoRow !== undefined) {
    return getAutoGridFrameSourceRect(image, frame);
  }
  if (frame.x !== undefined) {
    const x = Math.max(0, frame.x);
    const y = Math.max(0, frame.y);
    const maxWidth = (image.naturalWidth || image.width) - x;
    const maxHeight = (image.naturalHeight || image.height) - y;
    return {
      x,
      y,
      width: Math.max(1, Math.min(frame.width, maxWidth)),
      height: Math.max(1, Math.min(frame.height, maxHeight)),
    };
  }
  const inset = sprite.frameInset || 0;
  const columns = sprite.frameColumns || createFrameBoundaries(image.width, Math.round(image.width / sprite.frameWidth));
  const rows = sprite.frameRows || createFrameBoundaries(image.height, Math.round(image.height / sprite.frameHeight));
  const x = columns[frame.col] ?? Math.round(frame.col * sprite.frameWidth);
  const y = rows[frame.row] ?? Math.round(frame.row * sprite.frameHeight);
  const w = (columns[frame.col + 1] ?? x + sprite.frameWidth) - x;
  const h = (rows[frame.row + 1] ?? y + sprite.frameHeight) - y;
  return {
    x: x + inset,
    y: y + inset,
    width: Math.max(1, w - inset * 2),
    height: Math.max(1, h - inset * 2),
  };
}

function getAutoGridFrameSourceRect(image, frame) {
  const source = getAutoCropSourceData(image);
  if (!source) {
    return {
      x: frame.autoCol * 128,
      y: frame.autoRow * 128,
      width: 128,
      height: 128,
    };
  }

  const { width, height } = source;
  const cellSize = 128;
  const anchorX = frame.anchorX ?? cellSize / 2;
  const anchorY = frame.anchorY ?? 90;
  const key = `${frame.autoRow}:${frame.autoCol}:${anchorX}:${anchorY}:${frame.clampAutoCrop ? 1 : 0}`;
  if (source.rects.has(key)) return source.rects.get(key);

  const centerX = Math.min(width - 1, Math.max(0, frame.autoCol * cellSize + anchorX));
  const centerY = Math.min(height - 1, Math.max(0, frame.autoRow * cellSize + anchorY));
  const component = findNearestAutoFrameComponent(source.components, width, height, centerX, centerY, cellSize);

  if (!component) {
    const fallback = {
      x: Math.min(width - 1, frame.autoCol * cellSize),
      y: Math.min(height - 1, frame.autoRow * cellSize),
      width: Math.min(cellSize, Math.max(1, width - frame.autoCol * cellSize)),
      height: Math.min(cellSize, Math.max(1, height - frame.autoRow * cellSize)),
    };
    source.rects.set(key, fallback);
    return fallback;
  }

  const pad = 3;
  const cropLeft = frame.clampAutoCrop ? Math.max(0, centerX - 110) : 0;
  const cropRight = frame.clampAutoCrop ? Math.min(width, centerX + 110) : width;
  const cropTop = frame.clampAutoCrop ? Math.max(0, centerY - 120) : 0;
  const cropBottom = frame.clampAutoCrop ? Math.min(height, centerY + 120) : height;
  const rectLeft = Math.max(0, component.minX - pad, cropLeft);
  const rectTop = Math.max(0, component.minY - pad, cropTop);
  const rectRight = Math.min(width, component.maxX + pad + 1, cropRight);
  const rectBottom = Math.min(height, component.maxY + pad + 1, cropBottom);
  const rect = {
    x: rectLeft,
    y: rectTop,
    width: Math.max(1, rectRight - rectLeft),
    height: Math.max(1, rectBottom - rectTop),
  };
  source.rects.set(key, rect);
  return rect;
}

function getAutoCropSourceData(image) {
  if (image.__autoCropSourceData) return image.__autoCropSourceData;
  if (typeof document === "undefined") return null;

  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  if (!width || !height) return null;

  const canvasEl = document.createElement("canvas");
  canvasEl.width = width;
  canvasEl.height = height;
  const buffer = canvasEl.getContext("2d", { willReadFrequently: true });
  buffer.imageSmoothingEnabled = false;
  buffer.drawImage(image, 0, 0);
  const imageData = buffer.getImageData(0, 0, width, height);
  const { data } = imageData;
  const backgroundColors = getSpriteBackgroundColors(data, width, height);
  const foreground = new Uint8Array(width * height);

  for (let i = 0; i < width * height; i += 1) {
    const offset = i * 4;
    const alpha = data[offset + 3];
    if (!alpha) continue;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    if (isSpriteBackgroundPixel(r, g, b, alpha, backgroundColors)) continue;
    foreground[i] = 1;
  }

  image.__autoCropSourceData = {
    width,
    height,
    foreground,
    components: buildForegroundComponents(foreground, width, height),
    rects: new Map(),
  };
  return image.__autoCropSourceData;
}

function buildForegroundComponents(foreground, width, height) {
  const visited = new Uint8Array(width * height);
  const components = [];

  for (let start = 0; start < foreground.length; start += 1) {
    if (!foreground[start] || visited[start]) continue;
    const queue = [start];
    visited[start] = 1;
    let minX = start % width;
    let maxX = minX;
    let minY = Math.floor(start / width);
    let maxY = minY;

    for (let i = 0; i < queue.length; i += 1) {
      const pixel = queue[i];
      const x = pixel % width;
      const y = Math.floor(pixel / width);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);

      for (let yy = Math.max(0, y - 1); yy <= Math.min(height - 1, y + 1); yy += 1) {
        for (let xx = Math.max(0, x - 1); xx <= Math.min(width - 1, x + 1); xx += 1) {
          if (xx === x && yy === y) continue;
          const next = yy * width + xx;
          if (visited[next] || !foreground[next]) continue;
          visited[next] = 1;
          queue.push(next);
        }
      }
    }

    if (queue.length < 12) continue;
    components.push({
      minX,
      minY,
      maxX,
      maxY,
      area: queue.length,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
    });
  }

  return components;
}

function findNearestAutoFrameComponent(components, width, height, centerX, centerY, radius) {
  let best = null;
  let bestDistance = Infinity;
  const left = Math.max(0, Math.floor(centerX - radius));
  const right = Math.min(width - 1, Math.ceil(centerX + radius));
  const top = Math.max(0, Math.floor(centerY - radius));
  const bottom = Math.min(height - 1, Math.ceil(centerY + radius));

  components.forEach((component) => {
    if (component.maxX < left || component.minX > right || component.maxY < top || component.minY > bottom) return;
    const distance = Math.abs(component.centerX - centerX) + Math.abs(component.centerY - centerY);
    if (distance >= bestDistance) return;
    bestDistance = distance;
    best = component;
  });

  if (!best) {
    components.forEach((component) => {
      const distance = Math.abs(component.centerX - centerX) + Math.abs(component.centerY - centerY);
      if (distance >= bestDistance) return;
      bestDistance = distance;
      best = component;
    });
  }

  return best;
}

function axisToDirection(x, y) {
  if (Math.abs(x) >= Math.abs(y)) return x >= 0 ? "right" : "left";
  return y >= 0 ? "down" : "up";
}

function loadImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

function prepareCharacterSpriteAssets(keys = CHARACTER_SPRITE_KEYS) {
  keys.forEach((key) => {
    if (preparedCharacterSpriteKeys.has(key)) return;
    const image = assets[key];
    if (!isRenderableImage(image) || typeof document === "undefined") return;
    try {
      assets[key] = createWhiteBackgroundTransparentCanvas(image);
    } catch (error) {
      console.warn(`角色素材處理失敗，先使用原圖：${key}`, error);
    }
    preparedCharacterSpriteKeys.add(key);
  });
}

function scheduleExtraCharacterSpritePreparation() {
  const pendingKeys = CHARACTER_SPRITE_KEYS.filter((key) => !preparedCharacterSpriteKeys.has(key));
  const runNext = () => {
    const key = pendingKeys.shift();
    if (!key) return;
    prepareCharacterSpriteAssets([key]);
    if (pendingKeys.length) {
      window.setTimeout(runNext, 20);
    }
  };
  window.setTimeout(runNext, 120);
}

function createWhiteBackgroundTransparentCanvas(image) {
  const canvasEl = document.createElement("canvas");
  canvasEl.width = image.naturalWidth || image.width;
  canvasEl.height = image.naturalHeight || image.height;
  const buffer = canvasEl.getContext("2d", { willReadFrequently: true });
  buffer.imageSmoothingEnabled = false;
  buffer.drawImage(image, 0, 0);

  const imageData = buffer.getImageData(0, 0, canvasEl.width, canvasEl.height);
  const { data } = imageData;
  const { width, height } = canvasEl;
  const backgroundColors = getSpriteBackgroundColors(data, width, height);
  const visited = new Uint8Array(width * height);
  const queue = [];

  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const pixel = y * width + x;
    if (visited[pixel]) return;
    const offset = pixel * 4;
    if (!isSpriteBackgroundPixel(data[offset], data[offset + 1], data[offset + 2], data[offset + 3], backgroundColors)) return;
    visited[pixel] = 1;
    queue.push(pixel);
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  for (let i = 0; i < queue.length; i += 1) {
    const pixel = queue[i];
    const offset = pixel * 4;
    data[offset + 3] = 0;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    enqueue(x + 1, y);
    enqueue(x - 1, y);
    enqueue(x, y + 1);
    enqueue(x, y - 1);
  }

  cleanWhiteSpriteFringe(data, width, height, backgroundColors);
  buffer.putImageData(imageData, 0, 0);
  return canvasEl;
}

function getSpriteBackgroundColors(data, width, height) {
  const samplePoints = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
    [Math.floor(width / 2), 0],
    [Math.floor(width / 2), height - 1],
    [0, Math.floor(height / 2)],
    [width - 1, Math.floor(height / 2)],
  ];
  return samplePoints.map(([x, y]) => {
    const offset = (y * width + x) * 4;
    return [data[offset], data[offset + 1], data[offset + 2], data[offset + 3]];
  }).filter((color) => color[3] > 0);
}

function isSpriteBackgroundPixel(r, g, b, alpha, backgroundColors) {
  if (isNearWhitePixel(r, g, b, alpha)) return true;
  return alpha > 0 && backgroundColors.some(([br, bg, bb]) => colorDistance(r, g, b, br, bg, bb) <= 48);
}

function isNearWhitePixel(r, g, b, alpha) {
  return alpha > 0 && r >= 235 && g >= 235 && b >= 230 && Math.max(r, g, b) - Math.min(r, g, b) <= 30;
}

function colorDistance(r1, g1, b1, r2, g2, b2) {
  return Math.hypot(r1 - r2, g1 - g2, b1 - b2);
}

function cleanWhiteSpriteFringe(data, width, height, backgroundColors = []) {
  const alphaUpdates = new Uint8ClampedArray(width * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixel = y * width + x;
      const offset = pixel * 4;
      const alpha = data[offset + 3];
      alphaUpdates[pixel] = alpha;
      if (!alpha) continue;
      if (!hasTransparentNeighbor(data, width, height, x, y, 2)) continue;

      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const spread = max - min;

      const nearTransparent = hasTransparentNeighbor(data, width, height, x, y, 1);
      if (backgroundColors.some(([br, bg, bb]) => colorDistance(r, g, b, br, bg, bb) <= 54)) {
        alphaUpdates[pixel] = 0;
      } else if (min >= 220 && spread <= 56) {
        alphaUpdates[pixel] = 0;
      } else if (nearTransparent && min >= 205 && spread <= 64) {
        alphaUpdates[pixel] = Math.min(alpha, 72);
      }
    }
  }

  for (let i = 0; i < alphaUpdates.length; i += 1) {
    data[i * 4 + 3] = alphaUpdates[i];
  }
}

function hasTransparentNeighbor(data, width, height, x, y, radius) {
  for (let yy = Math.max(0, y - radius); yy <= Math.min(height - 1, y + radius); yy += 1) {
    for (let xx = Math.max(0, x - radius); xx <= Math.min(width - 1, x + radius); xx += 1) {
      if (xx === x && yy === y) continue;
      if (data[(yy * width + xx) * 4 + 3] === 0) return true;
    }
  }
  return false;
}

function nextAnimationFrame() {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(finish);
    if (typeof MessageChannel !== "undefined") {
      const channel = new MessageChannel();
      channel.port1.onmessage = finish;
      channel.port2.postMessage(null);
    } else {
      Promise.resolve().then(finish);
    }
    window.setTimeout(finish, 80);
  });
}

function waitForVideoReady(video) {
  return new Promise((resolve) => {
    if (!video) {
      resolve(false);
      return;
    }
    if (video.readyState >= 2) {
      resolve(true);
      return;
    }

    let settled = false;
    const finish = (loaded) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("canplay", onLoaded);
      video.removeEventListener("error", onError);
      resolve(loaded);
    };
    const onLoaded = () => finish(video.readyState >= 2);
    const onError = () => finish(false);
    const timeout = window.setTimeout(() => finish(video.readyState >= 2), 5000);
    video.addEventListener("loadeddata", onLoaded, { once: true });
    video.addEventListener("canplay", onLoaded, { once: true });
    video.addEventListener("error", onError, { once: true });
    video.load();
  });
}

function waitForImage(image) {
  return new Promise((resolve) => {
    if (image.complete) {
      resolve(image.naturalWidth > 0);
      return;
    }
    let settled = false;
    const finish = (loaded) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      resolve(loaded);
    };
    const timeout = window.setTimeout(() => finish(false), 3500);
    image.addEventListener("load", () => finish(image.naturalWidth > 0), { once: true });
    image.addEventListener("error", () => finish(false), { once: true });
  }).then((loaded) => {
    return loaded;
  });
}

function isRenderableImage(image) {
  return !!image && ((image.complete && image.naturalWidth > 0) || (typeof image.getContext === "function" && image.width > 0 && image.height > 0));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean, 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
}

function roundRect(x, y, width, height, radius = 12) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.lineTo(x + width - safeRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  ctx.lineTo(x + width, y + height - safeRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  ctx.lineTo(x + safeRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  ctx.lineTo(x, y + safeRadius);
  ctx.quadraticCurveTo(x, y, x + safeRadius, y);
  ctx.closePath();
}

function burst(x, y, color) {
  for (let i = 0; i < 16; i += 1) {
    const angle = (Math.PI * 2 * i) / 16;
    sparkles.push({
      x,
      y: y - 28,
      vx: Math.cos(angle) * (40 + Math.random() * 60),
      vy: Math.sin(angle) * (40 + Math.random() * 60),
      life: 0.8 + Math.random() * 0.35,
      maxLife: 1.1,
      size: 5 + Math.random() * 4,
      color,
    });
  }
}
