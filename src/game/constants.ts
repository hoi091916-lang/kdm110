export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 540;

export const GROUND_Y = 460;
export const GATE_INTERVAL = 1100; // New quiz gate every 1100px
export const BOSS_INTERVAL = 4400; // Boss encounter every 4 gates

// Player physics
export const PLAYER_SPEED = 4.2;
export const GRAVITY = 0.55;
export const JUMP_FORCE = -12.5;

// Day-night cycle period (35 seconds full cycle)
export const DAY_NIGHT_CYCLE_DURATION = 35; // in seconds

export const SKY_PALETTES = {
  DAY: {
    top: '#38bdf8', // sky-400
    bottom: '#93c5fd', // blue-300
    sunMoonColor: '#fef08a',
    isNight: false,
    label: 'Ban Ngày',
  },
  SUNSET: {
    top: '#c026d3', // fuchsia-600
    bottom: '#f97316', // orange-500
    sunMoonColor: '#fb923c',
    isNight: false,
    label: 'Hoàng Hôn',
  },
  NIGHT: {
    top: '#030712', // slate-950
    bottom: '#1e1b4b', // indigo-950
    sunMoonColor: '#e0e7ff',
    isNight: true,
    label: 'Đêm Tối',
  },
  DAWN: {
    top: '#312e81', // indigo-900
    bottom: '#fda4af', // rose-300
    sunMoonColor: '#fde047',
    isNight: false,
    label: 'Bình Minh',
  },
};
