export type SubjectTopic = 'Tin học' | 'Toán học' | 'Tiếng Anh' | 'Lịch sử' | string;

export interface Question {
  id: string;
  topic: string;
  question: string;
  options: [string, string, string, string]; // A, B, C, D
  correctIndex: number; // 0, 1, 2, 3
  hint: string;
  createdAt: number;
}

export type WeaponType = 'NORMAL' | 'SPREAD' | 'LASER';

export type DayTimePhase = 'DAY' | 'SUNSET' | 'NIGHT' | 'DAWN';

export interface DropItem {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'MUSHROOM' | 'SPREAD_GUN' | 'LASER_GUN';
  onGround: boolean;
  collected: boolean;
  pulseTimer: number;
}

export interface FlyingPod {
  id: string;
  x: number;
  y: number;
  baseY: number;
  amplitude: number;
  frequency: number;
  time: number;
  speed: number;
  hp: number;
  alive: boolean;
  itemType: 'MUSHROOM' | 'SPREAD_GUN' | 'LASER_GUN';
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  isPlayer: boolean;
  weaponType?: WeaponType;
  piercing?: boolean;
  hitList?: string[]; // IDs already pierced
  color: string;
  life: number;
}

export interface Enemy {
  id: string;
  type: 'SOLDIER' | 'TURRET' | 'DRONE' | 'BOSS';
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  alive: boolean;
  facing: 'left' | 'right';
  fireCooldown: number;
  maxFireCooldown: number;
  jumpCooldown: number;
  onGround: boolean;
  aimAngle?: number;
  behaviorTimer?: number;
}

export interface SealGate {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  gateIndex: number; // 1, 2, 3...
  solved: boolean;
  active: boolean; // currently triggering quiz
  pulseAnim: number;
  question?: Question;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'SOLID' | 'ONE_WAY' | 'WATER' | 'OBSTACLE';
  color?: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
  gravity?: number;
  type?: 'SPARK' | 'SMOKE' | 'ENERGY' | 'DEBRIS';
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  weapon: WeaponType;
  shieldActive: boolean;
  shieldDuration: number;
  score: number;
  kills: number;
  gatesPassed: number;
  totalGates: number;
  sector: number;
  distance: number;
  uniqueQuestionsAnswered: number;
  totalQuestionsInTopic: number;
}

export type GameStatus = 'MENU' | 'PLAYING' | 'QUIZ_PAUSED' | 'VICTORY' | 'GAMEOVER';
