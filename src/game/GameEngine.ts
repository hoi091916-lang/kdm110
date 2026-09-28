import {
  Bullet,
  DropItem,
  Enemy,
  FloatingText,
  FlyingPod,
  Particle,
  Platform,
  PlayerStats,
  Question,
  SealGate,
  WeaponType,
} from '../types/game';
import {
  BOSS_INTERVAL,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  DAY_NIGHT_CYCLE_DURATION,
  GATE_INTERVAL,
  GRAVITY,
  GROUND_Y,
  JUMP_FORCE,
  PLAYER_SPEED,
} from './constants';
import { sound } from '../services/soundFx';

export interface GameCallbacks {
  onTriggerQuiz: (gate: SealGate) => void;
  onUpdateStats: (stats: PlayerStats) => void;
  onGameOver: (score: number) => void;
  onVictory: (score: number, questionsSolved: number) => void;
  onDayNightChange?: (phase: string, progress: number) => void;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private callbacks: GameCallbacks;

  // Game state
  public isRunning: boolean = false;
  public isPausedForQuiz: boolean = false;
  public isGameOver: boolean = false;
  public isVictory: boolean = false;

  // Selected Quiz Topic questions pool & Anti-repetition tracking
  public questionPool: Question[] = [];
  public currentTopic: string = 'Tin học';
  public askedQuestionIds: Set<string> = new Set();

  // Camera
  public cameraX: number = 0;

  // Time & Day-Night cycle
  private gameTime: number = 0; // seconds
  private lastTimestamp: number = 0;
  private animFrameId: number | null = null;

  // Procedural generation progress
  private lastGeneratedRoundIndex: number = 0;
  public gatesPassed: number = 0;

  // Constants for round generation
  public static readonly ROUND_LENGTH = 1100;
  public static readonly MAX_ENEMIES_PER_ROUND = 10;

  // Player
  public player = {
    x: 80,
    y: GROUND_Y - 48,
    vx: 0,
    vy: 0,
    width: 32,
    height: 48,
    baseHeight: 48,
    crouchHeight: 24,
    onGround: true,
    isCrouching: false,
    facing: 'right' as 'left' | 'right',
    aimUp: false,
    hp: 100,
    maxHp: 100,
    mana: 100,
    maxMana: 100,
    weapon: 'NORMAL' as WeaponType,
    shieldActive: false,
    shieldTimer: 0,
    shieldDuration: 5, // 5 seconds
    invulnerableTimer: 0,
    fireCooldown: 0,
    score: 0,
    kills: 0,
    runFrame: 0,
    runAnimTimer: 0,
  };

  // Input states
  public keys: { [key: string]: boolean } = {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    shoot: false,
    skill: false,
  };

  // Entities
  public platforms: Platform[] = [];
  public gates: SealGate[] = [];
  public enemies: Enemy[] = [];
  public flyingPods: FlyingPod[] = [];
  public bullets: Bullet[] = [];
  public dropItems: DropItem[] = [];
  public particles: Particle[] = [];
  public floatingTexts: FloatingText[] = [];

  // Active quiz gate
  public activeGate: SealGate | null = null;
  public questionsAnswered: number = 0;

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.callbacks = callbacks;
  }

  public init(topic: string, questions: Question[]) {
    this.currentTopic = topic;
    this.questionPool = [...questions];
    this.askedQuestionIds.clear();
    this.resetGame();
  }

  public resetGame() {
    this.gameTime = 0;
    this.isPausedForQuiz = false;
    this.isGameOver = false;
    this.isVictory = false;
    this.cameraX = 0;
    this.questionsAnswered = 0;
    this.gatesPassed = 0;
    this.lastGeneratedRoundIndex = 0;

    // Reset player
    this.player.x = 80;
    this.player.y = GROUND_Y - 48;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.height = this.player.baseHeight;
    this.player.hp = 100;
    this.player.mana = 100;
    this.player.weapon = 'NORMAL';
    this.player.shieldActive = false;
    this.player.shieldTimer = 0;
    this.player.invulnerableTimer = 0;
    this.player.score = 0;
    this.player.kills = 0;
    this.player.facing = 'right';
    this.player.isCrouching = false;
    this.player.aimUp = false;

    // Clear all entities
    this.platforms = [];
    this.gates = [];
    this.enemies = [];
    this.flyingPods = [];
    this.bullets = [];
    this.dropItems = [];
    this.particles = [];
    this.floatingTexts = [];

    // Pre-generate the initial rounds (Round 1 and Round 2)
    this.generateRoundsAhead(2400);

    this.notifyStats();
  }

  /**
   * Endless Procedural Round Generation:
   * Generates discrete rounds (1100px each) ahead of the player.
   * STRICT REQUIREMENT: Limit enemy spawns in each round (after answering 1 question) to EXACTLY 10 enemies!
   */
  private generateRoundsAhead(targetX: number) {
    while ((this.lastGeneratedRoundIndex * GameEngine.ROUND_LENGTH) < targetX) {
      this.lastGeneratedRoundIndex++;
      const roundIdx = this.lastGeneratedRoundIndex;
      const startX = (roundIdx - 1) * GameEngine.ROUND_LENGTH;
      const endX = roundIdx * GameEngine.ROUND_LENGTH;

      // 1. Ground platform with small tactical gap at the end
      const gapWidth = roundIdx === 1 ? 0 : 80;
      this.platforms.push({
        x: startX,
        y: GROUND_Y,
        width: GameEngine.ROUND_LENGTH - gapWidth,
        height: CANVAS_HEIGHT - GROUND_Y,
        type: 'SOLID',
      });

      // 2. Elevated catwalk platforms
      const elevates: Platform[] = [
        { x: startX + 200, y: 380, width: 150, height: 16, type: 'ONE_WAY' },
        { x: startX + 420, y: 310, width: 170, height: 16, type: 'ONE_WAY' },
        { x: startX + 640, y: 370, width: 160, height: 16, type: 'ONE_WAY' },
        { x: startX + 830, y: 290, width: 160, height: 16, type: 'ONE_WAY' },
      ];
      this.platforms.push(...elevates);

      // 3. STRICT REQUIREMENT: Capped at EXACTLY 10 enemies in this round!
      const isBossRound = roundIdx % 4 === 0;

      if (isBossRound) {
        // 6 soldiers + 3 turrets + 1 boss = 10 enemies total!
        const soldierOffsets = [200, 340, 480, 620, 760, 880];
        soldierOffsets.forEach((offsetX, sIdx) => {
          this.enemies.push({
            id: `soldier-r${roundIdx}-${sIdx}`,
            type: 'SOLDIER',
            x: startX + offsetX,
            y: GROUND_Y - 44,
            width: 28,
            height: 44,
            vx: -1.3,
            vy: 0,
            hp: 35 + Math.min(25, this.gatesPassed * 2),
            maxHp: 35 + Math.min(25, this.gatesPassed * 2),
            alive: true,
            facing: 'left',
            fireCooldown: 50 + sIdx * 15,
            maxFireCooldown: 110,
            jumpCooldown: 90,
            onGround: true,
            behaviorTimer: sIdx * 10,
          });
        });

        // 3 Turrets on elevated catwalks
        const turretOffsets = [
          { x: startX + 250, y: 345 },
          { x: startX + 480, y: 275 },
          { x: startX + 700, y: 335 },
        ];
        turretOffsets.forEach((pos, tIdx) => {
          this.enemies.push({
            id: `turret-r${roundIdx}-${tIdx}`,
            type: 'TURRET',
            x: pos.x,
            y: pos.y,
            width: 32,
            height: 35,
            vx: 0,
            vy: 0,
            hp: 50,
            maxHp: 50,
            alive: true,
            facing: 'left',
            fireCooldown: 70 + tIdx * 25,
            maxFireCooldown: 130,
            jumpCooldown: 9999,
            onGround: true,
          });
        });

        // 1 Boss
        this.spawnBossAt(startX + 880);
      } else {
        // Regular round: 7 Patrol Soldiers + 3 Turrets = EXACTLY 10 enemies!
        const soldierOffsets = [180, 300, 420, 540, 660, 780, 900];
        soldierOffsets.forEach((offsetX, sIdx) => {
          this.enemies.push({
            id: `soldier-r${roundIdx}-${sIdx}`,
            type: 'SOLDIER',
            x: startX + offsetX,
            y: GROUND_Y - 44,
            width: 28,
            height: 44,
            vx: -1.3,
            vy: 0,
            hp: 35 + Math.min(25, this.gatesPassed * 2),
            maxHp: 35 + Math.min(25, this.gatesPassed * 2),
            alive: true,
            facing: 'left',
            fireCooldown: 50 + sIdx * 12,
            maxFireCooldown: 110,
            jumpCooldown: 90,
            onGround: true,
            behaviorTimer: sIdx * 10,
          });
        });

        // 3 Turrets on elevated platforms
        const turretOffsets = [
          { x: startX + 250, y: 345 },
          { x: startX + 480, y: 275 },
          { x: startX + 860, y: 255 },
        ];
        turretOffsets.forEach((pos, tIdx) => {
          this.enemies.push({
            id: `turret-r${roundIdx}-${tIdx}`,
            type: 'TURRET',
            x: pos.x,
            y: pos.y,
            width: 32,
            height: 35,
            vx: 0,
            vy: 0,
            hp: 50,
            maxHp: 50,
            alive: true,
            facing: 'left',
            fireCooldown: 70 + tIdx * 25,
            maxFireCooldown: 130,
            jumpCooldown: 9999,
            onGround: true,
          });
        });
      }

      // 4. Exactly 1 Flying Supply Pod in this round
      const podItems: ('MUSHROOM' | 'SPREAD_GUN' | 'LASER_GUN')[] = ['MUSHROOM', 'SPREAD_GUN', 'LASER_GUN'];
      const chosenItem = podItems[(roundIdx - 1) % podItems.length];
      this.flyingPods.push({
        id: `pod-r${roundIdx}`,
        x: startX + 540,
        y: 150,
        baseY: 150 + ((roundIdx % 2 === 0) ? 20 : -20),
        amplitude: 28,
        frequency: 0.04,
        time: roundIdx * 1.5,
        speed: 0.85,
        hp: 1,
        alive: true,
        itemType: chosenItem,
      });

      // 5. Place 1 Seal Gate at the end of this round (x = startX + 1040)
      this.gates.push({
        id: `gate-${roundIdx}`,
        x: startX + 1040,
        y: 60,
        width: 32,
        height: GROUND_Y - 60,
        gateIndex: roundIdx,
        solved: false,
        active: false,
        pulseAnim: 0,
      });
    }
  }

  /**
   * Clean up entities far behind the camera to keep performance blazing fast infinitely!
   */
  private cleanupOldEntities() {
    const minX = this.cameraX - 600;

    // Keep active or unsolved gates, prune distant solved gates
    this.gates = this.gates.filter((g) => !g.solved || g.x > minX);

    // Prune distant platforms
    this.platforms = this.platforms.filter((p) => p.x + p.width > minX);

    // Prune dead or distant enemies
    this.enemies = this.enemies.filter((e) => e.alive && e.x > minX);

    // Prune distant flying pods
    this.flyingPods = this.flyingPods.filter((pod) => pod.alive && pod.x > minX - 200);

    // Prune drop items
    this.dropItems = this.dropItems.filter((d) => !d.collected && d.x > minX);
  }

  public start() {
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.loop(this.lastTimestamp);
  }

  public stop() {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public handleKeyInput(action: 'left' | 'right' | 'up' | 'down' | 'jump' | 'shoot' | 'skill', pressed: boolean) {
    this.keys[action] = pressed;

    if (action === 'skill' && pressed) {
      this.activateSkill();
    }
  }

  public activateSkill() {
    if (this.isPausedForQuiz || this.isGameOver || this.isVictory) return;

    if (this.player.mana >= 40 && !this.player.shieldActive) {
      this.player.mana -= 40;
      this.player.shieldActive = true;
      this.player.shieldTimer = this.player.shieldDuration;
      sound.playShield();

      this.spawnShockwave(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);

      this.bullets = this.bullets.filter((b) => {
        if (!b.isPlayer) {
          const dx = b.x - (this.player.x + 16);
          const dy = b.y - (this.player.y + 24);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            this.spawnExplosion(b.x, b.y, '#38bdf8', 6);
            return false;
          }
        }
        return true;
      });

      this.addFloatingText('KHIÊN ĐIỆN TỪ (BẤT TỬ 5S)!', this.player.x - 20, this.player.y - 20, '#38bdf8');
      this.notifyStats();
    }
  }

  /**
   * Resumes game after student correctly solves a Quiz Gate.
   * Continues endlessly!
   */
  public resumeAfterQuizSuccess() {
    if (!this.activeGate) return;

    sound.playQuizSuccess();
    this.activeGate.solved = true;
    this.activeGate.active = false;
    this.questionsAnswered++;
    this.gatesPassed++;
    this.player.score += 1000;

    // Trigger explosive disintegration of the gate
    this.spawnGateDestruction(this.activeGate);

    this.addFloatingText(`+1000 ĐIỂM! VƯỢT CỔNG #${this.gatesPassed}!`, this.activeGate.x - 50, 180, '#22c55e');

    this.activeGate = null;
    this.isPausedForQuiz = false;
    this.notifyStats();
  }

  private spawnBossAt(xLoc: number) {
    const boss: Enemy = {
      id: `boss-${Date.now()}`,
      type: 'BOSS',
      x: xLoc + 150,
      y: 180,
      width: 90,
      height: 120,
      vx: 0,
      vy: 0.8,
      hp: 350 + this.gatesPassed * 25,
      maxHp: 350 + this.gatesPassed * 25,
      alive: true,
      facing: 'left',
      fireCooldown: 40,
      maxFireCooldown: 75,
      jumpCooldown: 9999,
      onGround: false,
      behaviorTimer: 0,
    };
    this.enemies.push(boss);
    sound.playSealAlert();
    this.addFloatingText('CẢNH BÁO: TRÙM ĐẠI CĂN CỨ XUẤT HIỆN!', xLoc - 100, 120, '#ef4444');
  }

  private loop = (timestamp: number) => {
    if (!this.isRunning) return;

    const delta = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1);
    this.lastTimestamp = timestamp;

    if (!this.isPausedForQuiz) {
      this.update(delta);
    }

    this.render();

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    if (this.isGameOver) return;

    this.gameTime += dt;

    // Day/Night cycle
    const cycleProgress = (this.gameTime % DAY_NIGHT_CYCLE_DURATION) / DAY_NIGHT_CYCLE_DURATION;
    let phase = 'DAY';
    if (cycleProgress >= 0.35 && cycleProgress < 0.5) phase = 'SUNSET';
    else if (cycleProgress >= 0.5 && cycleProgress < 0.85) phase = 'NIGHT';
    else if (cycleProgress >= 0.85) phase = 'DAWN';

    if (this.callbacks.onDayNightChange) {
      this.callbacks.onDayNightChange(phase, cycleProgress);
    }

    // Auto-regen Mana slightly (2.2/s)
    if (this.player.mana < this.player.maxMana) {
      this.player.mana = Math.min(this.player.maxMana, this.player.mana + dt * 2.2);
    }

    // Shield timer
    if (this.player.shieldActive) {
      this.player.shieldTimer -= dt;
      if (this.player.shieldTimer <= 0) {
        this.player.shieldActive = false;
        this.player.shieldTimer = 0;
      }
    }

    // Invulnerability timer
    if (this.player.invulnerableTimer > 0) {
      this.player.invulnerableTimer -= dt;
    }

    // Fire cooldown
    if (this.player.fireCooldown > 0) {
      this.player.fireCooldown -= dt;
    }

    this.updatePlayer(dt);
    this.updateCamera();

    // Generate upcoming world rounds dynamically (capped at 10 enemies per round)
    this.generateRoundsAhead(this.player.x + 2200);
    this.cleanupOldEntities();

    this.updateFlyingPods(dt);
    this.updateEnemies(dt);
    this.updateBullets(dt);
    this.updateDropItems(dt);
    this.updateGates(dt);
    this.updateParticles(dt);
    this.updateFloatingTexts(dt);

    this.notifyStats();
  }

  private updatePlayer(dt: number) {
    const p = this.player;

    // Horizontal movement
    p.vx = 0;
    if (this.keys.left) {
      p.vx = -PLAYER_SPEED;
      p.facing = 'left';
    }
    if (this.keys.right) {
      p.vx = PLAYER_SPEED;
      p.facing = 'right';
    }

    // Aim up check
    p.aimUp = !!this.keys.up;

    // Crouch check (S or Down arrow)
    if (this.keys.down && p.onGround) {
      p.isCrouching = true;
      p.height = p.crouchHeight;
      p.vx *= 0.3;
    } else {
      p.isCrouching = false;
      p.height = p.baseHeight;
    }

    // Jump (W or Space or Up)
    if (this.keys.jump && p.onGround && !p.isCrouching) {
      p.vy = JUMP_FORCE;
      p.onGround = false;
      sound.playJump();
      this.spawnJumpPuff(p.x + p.width / 2, p.y + p.height);
    }

    // Gravity
    p.vy += GRAVITY;

    // Move X
    p.x += p.vx;
    // Cannot walk off left edge
    p.x = Math.max(0, p.x);

    // Move Y & Platform collisions
    p.y += p.vy;

    // Check collision with platforms
    p.onGround = false;
    for (const plat of this.platforms) {
      if (plat.type === 'ONE_WAY') {
        const prevBottom = p.y - p.vy + p.height;
        if (
          p.vy >= 0 &&
          p.x + p.width > plat.x &&
          p.x < plat.x + plat.width &&
          prevBottom <= plat.y + 4 &&
          p.y + p.height >= plat.y
        ) {
          p.y = plat.y - p.height;
          p.vy = 0;
          p.onGround = true;
          break;
        }
      } else if (plat.type === 'SOLID') {
        if (
          p.x + p.width > plat.x &&
          p.x < plat.x + plat.width &&
          p.y + p.height >= plat.y &&
          p.y + p.height <= plat.y + plat.height + 15 &&
          p.vy >= 0
        ) {
          p.y = plat.y - p.height;
          p.vy = 0;
          p.onGround = true;
          break;
        }
      }
    }

    // Fallen into pits: take damage and respawn slightly behind
    if (p.y > CANVAS_HEIGHT + 30) {
      this.damagePlayer(35);
      p.y = GROUND_Y - p.height - 20;
      p.x = Math.max(50, p.x - 120);
      p.vy = 0;
    }

    // Running animation timer
    if (Math.abs(p.vx) > 0.1 && p.onGround) {
      p.runAnimTimer += dt * 12;
      p.runFrame = Math.floor(p.runAnimTimer) % 4;
    } else {
      p.runFrame = 0;
    }

    // Shooting
    if (this.keys.shoot && p.fireCooldown <= 0) {
      this.firePlayerWeapon();
    }
  }

  private firePlayerWeapon() {
    const p = this.player;
    const bulletSpeed = 9.5;
    const gunX = p.facing === 'right' ? p.x + p.width + 4 : p.x - 4;
    const gunY = p.isCrouching ? p.y + 12 : p.aimUp ? p.y - 8 : p.y + 18;

    let dirX = p.facing === 'right' ? 1 : -1;
    let dirY = 0;

    if (p.aimUp) {
      if (Math.abs(p.vx) > 0) {
        dirX = p.facing === 'right' ? 0.707 : -0.707;
        dirY = -0.707;
      } else {
        dirX = 0;
        dirY = -1;
      }
    }

    if (p.weapon === 'NORMAL') {
      p.fireCooldown = 0.16;
      sound.playShoot('NORMAL');
      this.bullets.push({
        id: 'b-' + Math.random(),
        x: gunX,
        y: gunY,
        vx: dirX * bulletSpeed,
        vy: dirY * bulletSpeed,
        radius: 3.5,
        damage: 25,
        isPlayer: true,
        weaponType: 'NORMAL',
        color: '#facc15',
        life: 1.5,
      });
      this.spawnMuzzleFlash(gunX, gunY, '#fde047');
    } else if (p.weapon === 'SPREAD') {
      p.fireCooldown = 0.28;
      sound.playShoot('SPREAD');

      const baseAngle = Math.atan2(dirY, dirX);
      const angles = [baseAngle - 0.25, baseAngle, baseAngle + 0.25];

      angles.forEach((angle) => {
        this.bullets.push({
          id: 'b-' + Math.random(),
          x: gunX,
          y: gunY,
          vx: Math.cos(angle) * (bulletSpeed * 0.95),
          vy: Math.sin(angle) * (bulletSpeed * 0.95),
          radius: 5.5,
          damage: 32,
          isPlayer: true,
          weaponType: 'SPREAD',
          color: '#fb923c',
          life: 1.2,
        });
      });
      this.spawnMuzzleFlash(gunX, gunY, '#fb923c');
    } else if (p.weapon === 'LASER') {
      p.fireCooldown = 0.22;
      sound.playShoot('LASER');

      this.bullets.push({
        id: 'b-' + Math.random(),
        x: gunX,
        y: gunY,
        vx: dirX * (bulletSpeed * 1.35),
        vy: dirY * (bulletSpeed * 1.35),
        radius: 4,
        damage: 55,
        isPlayer: true,
        weaponType: 'LASER',
        piercing: true,
        hitList: [],
        color: '#38bdf8',
        life: 1.8,
      });
      this.spawnMuzzleFlash(gunX, gunY, '#38bdf8');
    }
  }

  private updateCamera() {
    const targetCameraX = this.player.x - CANVAS_WIDTH * 0.35;
    this.cameraX = Math.max(this.cameraX, targetCameraX);
    if (this.player.x < this.cameraX) {
      this.player.x = this.cameraX;
    }
  }

  private updateFlyingPods(dt: number) {
    this.flyingPods.forEach((pod) => {
      if (!pod.alive) return;
      pod.time += dt * 2.5;
      pod.x -= pod.speed;
      pod.y = pod.baseY + Math.sin(pod.time) * pod.amplitude;
    });
  }

  private updateEnemies(dt: number) {
    const p = this.player;

    this.enemies.forEach((enemy) => {
      if (!enemy.alive) return;

      if (enemy.x < this.cameraX - 200 || enemy.x > this.cameraX + CANVAS_WIDTH + 350) {
        return;
      }

      if (enemy.type === 'SOLDIER') {
        const distToPlayer = p.x - enemy.x;
        enemy.facing = distToPlayer > 0 ? 'right' : 'left';

        if (Math.abs(distToPlayer) < 550) {
          enemy.vx = distToPlayer > 0 ? 1.4 : -1.4;
        } else {
          enemy.vx = 0;
        }

        enemy.jumpCooldown -= 1;
        if (enemy.jumpCooldown <= 0 && enemy.onGround && Math.random() < 0.02) {
          enemy.vy = -9;
          enemy.onGround = false;
          enemy.jumpCooldown = 120;
        }

        enemy.vy += GRAVITY;
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;

        enemy.onGround = false;
        for (const plat of this.platforms) {
          if (
            enemy.x + enemy.width > plat.x &&
            enemy.x < plat.x + plat.width &&
            enemy.y + enemy.height >= plat.y &&
            enemy.y + enemy.height <= plat.y + 20 &&
            enemy.vy >= 0
          ) {
            enemy.y = plat.y - enemy.height;
            enemy.vy = 0;
            enemy.onGround = true;
            break;
          }
        }

        enemy.fireCooldown -= dt * 60;
        if (enemy.fireCooldown <= 0 && Math.abs(distToPlayer) < 420) {
          enemy.fireCooldown = enemy.maxFireCooldown;
          sound.playEnemyShoot();
          const bDir = enemy.facing === 'right' ? 1 : -1;
          this.bullets.push({
            id: 'eb-' + Math.random(),
            x: enemy.facing === 'right' ? enemy.x + enemy.width + 4 : enemy.x - 4,
            y: enemy.y + 16,
            vx: bDir * 4.8,
            vy: (p.y - enemy.y) * 0.005,
            radius: 4,
            damage: 15,
            isPlayer: false,
            color: '#ef4444',
            life: 2.5,
          });
        }
      } else if (enemy.type === 'TURRET') {
        const dx = p.x - enemy.x;
        const dy = p.y - enemy.y;
        enemy.aimAngle = Math.atan2(dy, dx);

        enemy.fireCooldown -= dt * 60;
        if (enemy.fireCooldown <= 0 && Math.hypot(dx, dy) < 480) {
          enemy.fireCooldown = enemy.maxFireCooldown;
          sound.playEnemyShoot();

          const spd = 4.2;
          this.bullets.push({
            id: 'eb-' + Math.random(),
            x: enemy.x + 16 + Math.cos(enemy.aimAngle) * 20,
            y: enemy.y + 16 + Math.sin(enemy.aimAngle) * 20,
            vx: Math.cos(enemy.aimAngle) * spd,
            vy: Math.sin(enemy.aimAngle) * spd,
            radius: 5,
            damage: 20,
            isPlayer: false,
            color: '#f87171',
            life: 3,
          });
        }
      } else if (enemy.type === 'BOSS') {
        enemy.behaviorTimer = (enemy.behaviorTimer || 0) + dt;
        enemy.y = 160 + Math.sin(enemy.behaviorTimer * 1.5) * 80;

        enemy.fireCooldown -= dt * 60;
        if (enemy.fireCooldown <= 0) {
          enemy.fireCooldown = enemy.maxFireCooldown;
          sound.playEnemyShoot();

          [-0.3, -0.1, 0.1, 0.3].forEach((angOffset) => {
            const dx = p.x - enemy.x;
            const dy = p.y - enemy.y;
            const ang = Math.atan2(dy, dx) + angOffset;
            this.bullets.push({
              id: 'boss-b-' + Math.random(),
              x: enemy.x,
              y: enemy.y + 50,
              vx: Math.cos(ang) * 5.2,
              vy: Math.sin(ang) * 5.2,
              radius: 6,
              damage: 22,
              isPlayer: false,
              color: '#dc2626',
              life: 3,
            });
          });
        }
      }
    });
  }

  private updateBullets(dt: number) {
    const p = this.player;

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx;
      b.y += b.vy;
      b.life -= dt;

      if (b.life <= 0 || b.x < this.cameraX - 100 || b.x > this.cameraX + CANVAS_WIDTH + 100) {
        this.bullets.splice(i, 1);
        continue;
      }

      // Check collision with Seal Gates
      let blockedByGate = false;
      for (const gate of this.gates) {
        if (!gate.solved) {
          if (b.x >= gate.x && b.x <= gate.x + gate.width && b.y >= gate.y && b.y <= gate.y + gate.height) {
            this.spawnExplosion(b.x, b.y, '#60a5fa', 4);
            blockedByGate = true;
            break;
          }
        }
      }
      if (blockedByGate) {
        this.bullets.splice(i, 1);
        continue;
      }

      // Player bullet collisions
      if (b.isPlayer) {
        // Hit Flying Pods?
        for (const pod of this.flyingPods) {
          if (pod.alive && Math.hypot(b.x - pod.x, b.y - pod.y) < 26) {
            pod.alive = false;
            sound.playExplosion();
            this.spawnExplosion(pod.x, pod.y, '#f59e0b', 16);
            this.dropItemFromPod(pod);

            if (!b.piercing) {
              this.bullets.splice(i, 1);
              break;
            }
          }
        }

        // Hit Enemies?
        let hitEnemy = false;
        for (const enemy of this.enemies) {
          if (!enemy.alive) continue;
          if (b.piercing && b.hitList && b.hitList.includes(enemy.id)) continue;

          if (
            b.x >= enemy.x &&
            b.x <= enemy.x + enemy.width &&
            b.y >= enemy.y &&
            b.y <= enemy.y + enemy.height
          ) {
            enemy.hp -= b.damage;
            this.spawnDamageNumber(enemy.x + enemy.width / 2, enemy.y, b.damage);
            this.spawnExplosion(b.x, b.y, b.color, 6);

            if (b.piercing && b.hitList) {
              b.hitList.push(enemy.id);
            } else {
              hitEnemy = true;
            }

            if (enemy.hp <= 0) {
              enemy.alive = false;
              sound.playExplosion();
              this.spawnExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#f97316', 22);

              if (enemy.type === 'BOSS') {
                p.score += 5000;
                p.kills++;
                // Drops double items upon Boss defeat!
                this.dropItems.push({
                  id: 'boss-drop-1',
                  x: enemy.x,
                  y: enemy.y + 20,
                  vx: -1,
                  vy: -3,
                  type: 'MUSHROOM',
                  onGround: false,
                  collected: false,
                  pulseTimer: 0,
                });
                this.addFloatingText('ĐÃ HẠ GỤC TRÙM ĐẠI CĂN CỨ! +5000 ĐIỂM!', enemy.x - 50, 140, '#f59e0b');
              } else {
                p.score += enemy.type === 'TURRET' ? 250 : 150;
                p.kills++;
              }
            }
            break;
          }
        }

        if (hitEnemy) {
          this.bullets.splice(i, 1);
          continue;
        }
      } else {
        // Enemy bullet -> hits Player?
        if (
          b.x >= p.x &&
          b.x <= p.x + p.width &&
          b.y >= p.y &&
          b.y <= p.y + p.height
        ) {
          if (p.shieldActive) {
            sound.playShield();
            this.spawnExplosion(b.x, b.y, '#38bdf8', 8);
          } else {
            this.damagePlayer(b.damage);
            this.spawnExplosion(b.x, b.y, '#ef4444', 6);
          }
          this.bullets.splice(i, 1);
          continue;
        }
      }
    }
  }

  private damagePlayer(amount: number) {
    if (this.player.shieldActive || this.player.invulnerableTimer > 0) return;

    this.player.hp = Math.max(0, this.player.hp - amount);
    this.player.invulnerableTimer = 1.0;
    sound.playExplosion();

    this.addFloatingText(`-${amount} HP`, this.player.x + 10, this.player.y - 10, '#ef4444');

    if (this.player.hp <= 0) {
      this.handleGameOver();
    }
  }

  private dropItemFromPod(pod: FlyingPod) {
    this.dropItems.push({
      id: 'drop-' + Math.random(),
      x: pod.x,
      y: pod.y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -2.5,
      type: pod.itemType,
      onGround: false,
      collected: false,
      pulseTimer: 0,
    });
  }

  private updateDropItems(dt: number) {
    const p = this.player;

    for (let i = this.dropItems.length - 1; i >= 0; i--) {
      const item = this.dropItems[i];
      item.pulseTimer += dt * 4;

      if (!item.onGround) {
        item.vy += GRAVITY * 0.8;
        item.x += item.vx;
        item.y += item.vy;

        for (const plat of this.platforms) {
          if (
            item.x >= plat.x &&
            item.x <= plat.x + plat.width &&
            item.y + 16 >= plat.y &&
            item.y + 16 <= plat.y + 20
          ) {
            item.y = plat.y - 16;
            item.vy = 0;
            item.vx = 0;
            item.onGround = true;
            break;
          }
        }
      }

      if (
        p.x + p.width >= item.x - 12 &&
        p.x <= item.x + 28 &&
        p.y + p.height >= item.y - 12 &&
        p.y <= item.y + 28
      ) {
        this.collectItem(item);
        this.dropItems.splice(i, 1);
      }
    }
  }

  private collectItem(item: DropItem) {
    sound.playPowerUp();
    this.spawnExplosion(item.x, item.y, '#eab308', 14);

    if (item.type === 'MUSHROOM') {
      this.player.hp = this.player.maxHp;
      this.player.mana = this.player.maxMana;
      this.player.score += 500;
      this.addFloatingText('+100% MÁU & MANA TỐI ĐA! 🍄', this.player.x - 30, this.player.y - 30, '#10b981');
    } else if (item.type === 'SPREAD_GUN') {
      this.player.weapon = 'SPREAD';
      this.player.score += 300;
      this.addFloatingText('SÚNG S: ĐẠN CHÙM 3 TIA! 🔴', this.player.x - 20, this.player.y - 30, '#f97316');
    } else if (item.type === 'LASER_GUN') {
      this.player.weapon = 'LASER';
      this.player.score += 400;
      this.addFloatingText('SÚNG L: TIA LASER XUYÊN THẤU! 🔵', this.player.x - 20, this.player.y - 30, '#06b6d4');
    }

    this.notifyStats();
  }

  private updateGates(dt: number) {
    const p = this.player;

    for (const gate of this.gates) {
      gate.pulseAnim += dt * 3;

      if (!gate.solved && !gate.active) {
        const dist = Math.abs(p.x + p.width - gate.x);
        if (dist < 42 && p.y + p.height > gate.y && p.y < gate.y + gate.height) {
          this.triggerQuiz(gate);
          break;
        }
      }
    }
  }

  /**
   * Requirement: "hạn chế bị lặp câu hỏi"
   * Filters out already asked questions. Only recycles when all questions in the bank are exhausted!
   */
  private triggerQuiz(gate: SealGate) {
    gate.active = true;
    this.activeGate = gate;
    this.isPausedForQuiz = true;

    // Filter unasked questions
    let unasked = this.questionPool.filter((q) => !this.askedQuestionIds.has(q.id));

    // If all questions in this topic have been asked, reset history and start new cycle
    if (unasked.length === 0) {
      this.askedQuestionIds.clear();
      unasked = [...this.questionPool];
      this.addFloatingText('ĐÃ CHINH PHỤC TOÀN BỘ CÂU HỎI! BẮT ĐẦU VÒNG ÔN TẬP TIẾP THEO!', this.player.x - 100, 160, '#38bdf8');
    }

    let q: Question;
    if (unasked.length > 0) {
      const randIdx = Math.floor(Math.random() * unasked.length);
      q = unasked[randIdx];
      // Mark as asked to guarantee NO repetition until all have been answered!
      this.askedQuestionIds.add(q.id);
    } else {
      q = {
        id: 'fallback-1',
        topic: this.currentTopic,
        question: 'Câu hỏi mặc định: Phím tắt sao chép văn bản trong máy tính là gì?',
        options: ['Ctrl + X', 'Ctrl + V', 'Ctrl + C', 'Ctrl + Z'],
        correctIndex: 2,
        hint: 'Ctrl + C là phím tắt phổ biến nhất để Copy dữ liệu.',
        createdAt: Date.now(),
      };
    }

    gate.question = q;
    sound.playSealAlert();
    this.callbacks.onTriggerQuiz(gate);
  }

  private handleGameOver() {
    this.isGameOver = true;
    sound.playGameOver();
    this.callbacks.onGameOver(this.player.score);
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.gravity) p.vy += p.gravity;
      p.alpha -= p.decay * dt;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private updateFloatingTexts(dt: number) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.alpha -= 0.65 * dt;
      if (ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  private spawnExplosion(x: number, y: number, color: string, count: number = 10) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.5 + 1;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() * 4 + 2,
        alpha: 1,
        decay: Math.random() * 2 + 1.5,
        gravity: 0.1,
      });
    }
  }

  private spawnGateDestruction(gate: SealGate) {
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.particles.push({
        x: gate.x + 16,
        y: gate.y + Math.random() * gate.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: i % 2 === 0 ? '#38bdf8' : '#22c55e',
        size: Math.random() * 6 + 3,
        alpha: 1,
        decay: 1.2,
        gravity: 0.15,
      });
    }
  }

  private spawnShockwave(x: number, y: number) {
    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * 7.5,
        vy: Math.sin(angle) * 7.5,
        color: '#67e8f9',
        size: 4,
        alpha: 1,
        decay: 2.2,
      });
    }
  }

  private spawnMuzzleFlash(x: number, y: number, color: string) {
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        color,
        size: 3,
        alpha: 1,
        decay: 6,
      });
    }
  }

  private spawnJumpPuff(x: number, y: number) {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 1.5,
        color: '#cbd5e1',
        size: 3,
        alpha: 0.8,
        decay: 3,
      });
    }
  }

  private spawnDamageNumber(x: number, y: number, amount: number) {
    this.addFloatingText(`${amount}`, x, y - 10, '#f87171');
  }

  private addFloatingText(text: string, x: number, y: number, color: string) {
    this.floatingTexts.push({
      id: 'ft-' + Math.random(),
      x,
      y,
      text,
      color,
      alpha: 1,
      vy: -25,
    });
  }

  public notifyStats() {
    const sector = Math.floor(this.gatesPassed / 3) + 1;
    const distanceMeters = Math.floor(this.player.x / 10);

    this.callbacks.onUpdateStats({
      hp: Math.round(this.player.hp),
      maxHp: this.player.maxHp,
      mana: Math.round(this.player.mana),
      maxMana: this.player.maxMana,
      weapon: this.player.weapon,
      shieldActive: this.player.shieldActive,
      shieldDuration: Math.max(0, Math.ceil(this.player.shieldTimer)),
      score: this.player.score,
      kills: this.player.kills,
      gatesPassed: this.gatesPassed,
      totalGates: Math.max(3, this.lastGeneratedRoundIndex),
      sector,
      distance: distanceMeters,
      uniqueQuestionsAnswered: this.askedQuestionIds.size,
      totalQuestionsInTopic: this.questionPool.length,
    });
  }

  // --- RENDERING ---
  private render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 1. Sky & Day-Night cycle background
    this.renderSky(ctx);

    // Save camera translation
    ctx.save();
    ctx.translate(-this.cameraX, 0);

    // 2. Parallax Mountains / Ruins in background
    this.renderBackgroundLayers(ctx);

    // 3. Platforms & Ground
    this.renderPlatforms(ctx);

    // 4. Seal Gates
    this.renderSealGates(ctx);

    // 5. Drop Items (Mushroom, Weapons)
    this.renderDropItems(ctx);

    // 6. Flying Pods
    this.renderFlyingPods(ctx);

    // 7. Enemies & Boss
    this.renderEnemies(ctx);

    // 8. Player Commando
    this.renderPlayer(ctx);

    // 9. Bullets
    this.renderBullets(ctx);

    // 10. Particles & Floating numbers
    this.renderParticles(ctx);
    this.renderFloatingTexts(ctx);

    ctx.restore();

    // 11. Night Darkness & Player Flashlight/Aura Overlay
    this.renderNightDarknessOverlay(ctx);
  }

  private renderSky(ctx: CanvasRenderingContext2D) {
    const cycleProgress = (this.gameTime % DAY_NIGHT_CYCLE_DURATION) / DAY_NIGHT_CYCLE_DURATION;

    let topColor = '#38bdf8';
    let bottomColor = '#93c5fd';
    let isNight = false;

    if (cycleProgress < 0.35) {
      topColor = '#38bdf8';
      bottomColor = '#bae6fd';
    } else if (cycleProgress < 0.5) {
      const t = (cycleProgress - 0.35) / 0.15;
      topColor = this.lerpColor('#38bdf8', '#7c3aed', t);
      bottomColor = this.lerpColor('#bae6fd', '#f97316', t);
    } else if (cycleProgress < 0.85) {
      isNight = true;
      topColor = '#030712';
      bottomColor = '#1e1b4b';
    } else {
      const t = (cycleProgress - 0.85) / 0.15;
      topColor = this.lerpColor('#030712', '#38bdf8', t);
      bottomColor = this.lerpColor('#1e1b4b', '#bae6fd', t);
    }

    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    grad.addColorStop(0, topColor);
    grad.addColorStop(1, bottomColor);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const sunMoonProgress = (cycleProgress * Math.PI * 2) - Math.PI / 2;
    const orbX = (CANVAS_WIDTH / 2) + Math.cos(sunMoonProgress) * (CANVAS_WIDTH * 0.42);
    const orbY = (CANVAS_HEIGHT * 0.5) + Math.sin(sunMoonProgress) * 160;

    if (isNight) {
      ctx.save();
      ctx.fillStyle = '#f8fafc';
      ctx.shadowColor = '#e2e8f0';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(orbX, orbY, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 35; i++) {
        const starX = (i * 123 + Math.sin(this.gameTime + i) * 4) % CANVAS_WIDTH;
        const starY = (i * 77) % (CANVAS_HEIGHT * 0.65);
        const starSize = (i % 3 === 0) ? 2 : 1.2;
        ctx.fillRect(starX, starY, starSize, starSize);
      }
      ctx.restore();
    } else {
      ctx.save();
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(orbX, orbY, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private renderBackgroundLayers(ctx: CanvasRenderingContext2D) {
    const px1 = this.cameraX * 0.2;
    ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.beginPath();
    ctx.moveTo(this.cameraX, CANVAS_HEIGHT);
    for (let x = -50; x <= CANVAS_WIDTH + 150; x += 120) {
      const worldX = x + px1;
      const peakY = 280 + Math.sin(worldX * 0.003) * 60;
      ctx.lineTo(this.cameraX + x, peakY);
    }
    ctx.lineTo(this.cameraX + CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fill();

    const px2 = this.cameraX * 0.5;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    const startBunker = Math.floor((this.cameraX - 200) / 380) * 380;
    for (let bx = startBunker; bx < this.cameraX + CANVAS_WIDTH + 200; bx += 380) {
      const screenX = bx - px2 * 0.4;
      ctx.fillRect(screenX, GROUND_Y - 90, 110, 90);
      ctx.fillRect(screenX + 45, GROUND_Y - 140, 6, 50);

      ctx.fillStyle = Math.sin(this.gameTime * 4) > 0 ? '#ef4444' : '#7f1d1d';
      ctx.beginPath();
      ctx.arc(screenX + 48, GROUND_Y - 142, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    }
  }

  private renderPlatforms(ctx: CanvasRenderingContext2D) {
    for (const plat of this.platforms) {
      if (plat.x + plat.width < this.cameraX - 50 || plat.x > this.cameraX + CANVAS_WIDTH + 50) {
        continue;
      }

      if (plat.type === 'SOLID') {
        ctx.fillStyle = '#334155';
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

        ctx.fillStyle = '#64748b';
        ctx.fillRect(plat.x, plat.y, plat.width, 6);

        ctx.fillStyle = '#eab308';
        for (let ix = plat.x; ix < plat.x + plat.width; ix += 24) {
          ctx.fillRect(ix, plat.y + 6, 8, 4);
        }
      } else if (plat.type === 'ONE_WAY') {
        ctx.fillStyle = '#475569';
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(plat.x, plat.y, plat.width, 3);

        ctx.fillStyle = '#0f172a';
        for (let bx = plat.x + 8; bx < plat.x + plat.width; bx += 20) {
          ctx.fillRect(bx, plat.y + 6, 4, 6);
        }
      }
    }
  }

  private renderSealGates(ctx: CanvasRenderingContext2D) {
    for (const gate of this.gates) {
      if (gate.x < this.cameraX - 100 || gate.x > this.cameraX + CANVAS_WIDTH + 100) {
        continue;
      }

      if (gate.solved) {
        ctx.fillStyle = '#475569';
        ctx.fillRect(gate.x - 4, GROUND_Y - 18, 40, 18);
        ctx.fillStyle = '#22c55e';
        ctx.font = '10px "Chakra Petch", sans-serif';
        ctx.fillText(`CỔNG #${gate.gateIndex} ĐÃ MỞ`, gate.x - 14, GROUND_Y - 24);
        continue;
      }

      const pulse = Math.sin(gate.pulseAnim * 3) * 0.25 + 0.75;

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(gate.x - 6, gate.y, 44, 24);
      ctx.fillRect(gate.x - 6, GROUND_Y - 24, 44, 24);

      ctx.save();
      const beamGrad = ctx.createLinearGradient(gate.x, 0, gate.x + gate.width, 0);
      beamGrad.addColorStop(0, `rgba(56, 189, 248, ${pulse * 0.4})`);
      beamGrad.addColorStop(0.5, `rgba(244, 63, 94, ${pulse * 0.95})`);
      beamGrad.addColorStop(1, `rgba(56, 189, 248, ${pulse * 0.4})`);
      ctx.fillStyle = beamGrad;
      ctx.fillRect(gate.x, gate.y + 24, gate.width, gate.height - 48);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      let arcY = gate.y + 28;
      ctx.moveTo(gate.x + 16, arcY);
      while (arcY < GROUND_Y - 28) {
        arcY += 25;
        const jiggle = (Math.random() - 0.5) * 20;
        ctx.lineTo(gate.x + 16 + jiggle, arcY);
      }
      ctx.stroke();

      const midY = gate.y + (gate.height / 2);
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(gate.x + 16, midY, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(gate.x + 10, midY - 4, 12, 12);
      ctx.beginPath();
      ctx.arc(gate.x + 16, midY - 6, 5, Math.PI, 0, false);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px "Chakra Petch", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`CỔNG KHÓA #${gate.gateIndex}`, gate.x + 16, midY + 36);
      ctx.fillText('TRẮC NGHIỆM', gate.x + 16, midY + 50);

      ctx.restore();
    }
  }

  private renderFlyingPods(ctx: CanvasRenderingContext2D) {
    for (const pod of this.flyingPods) {
      if (!pod.alive) continue;

      ctx.save();
      const grad = ctx.createLinearGradient(pod.x - 22, pod.y - 12, pod.x + 22, pod.y + 12);
      grad.addColorStop(0, '#f43f5e');
      grad.addColorStop(0.5, '#ffffff');
      grad.addColorStop(1, '#f43f5e');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(pod.x, pod.y, 22, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0284c7';
      ctx.fillRect(pod.x - 14, pod.y - 14, 8, 4);
      ctx.fillRect(pod.x + 6, pod.y - 14, 8, 4);
      ctx.fillRect(pod.x - 14, pod.y + 10, 8, 4);
      ctx.fillRect(pod.x + 6, pod.y + 10, 8, 4);

      ctx.fillStyle = Math.sin(pod.time * 10) > 0 ? '#fbbf24' : '#ef4444';
      ctx.beginPath();
      ctx.moveTo(pod.x + 22, pod.y);
      ctx.lineTo(pod.x + 32, pod.y - 4);
      ctx.lineTo(pod.x + 32, pod.y + 4);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 9px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      const label = pod.itemType === 'MUSHROOM' ? 'M' : pod.itemType === 'SPREAD_GUN' ? 'S' : 'L';
      ctx.fillText(label, pod.x, pod.y + 3);

      ctx.restore();
    }
  }

  private renderDropItems(ctx: CanvasRenderingContext2D) {
    for (const item of this.dropItems) {
      ctx.save();
      const bounce = Math.sin(item.pulseTimer) * 4;

      if (item.type === 'MUSHROOM') {
        const mx = item.x;
        const my = item.y + bounce;

        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(mx + 4, my + 10, 10, 10);

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(mx + 9, my + 9, 12, Math.PI, 0, false);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(mx + 5, my + 5, 2.5, 0, Math.PI * 2);
        ctx.arc(mx + 13, my + 5, 2.5, 0, Math.PI * 2);
        ctx.arc(mx + 9, my + 2, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(mx + 9, my + 9, 16, 0, Math.PI * 2);
        ctx.stroke();
      } else if (item.type === 'SPREAD_GUN' || item.type === 'LASER_GUN') {
        const ox = item.x + 9;
        const oy = item.y + 9 + bounce;
        const isSpread = item.type === 'SPREAD_GUN';
        const ringColor = isSpread ? '#f97316' : '#06b6d4';

        ctx.fillStyle = ringColor;
        ctx.shadowColor = ringColor;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(ox, oy, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ox, oy, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isSpread ? '#c2410c' : '#0e7490';
        ctx.font = 'bold 11px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(isSpread ? 'S' : 'L', ox, oy + 4);
      }
      ctx.restore();
    }
  }

  private renderEnemies(ctx: CanvasRenderingContext2D) {
    for (const enemy of this.enemies) {
      if (!enemy.alive) continue;

      if (enemy.x < this.cameraX - 100 || enemy.x > this.cameraX + CANVAS_WIDTH + 100) {
        continue;
      }

      ctx.save();

      if (enemy.type === 'SOLDIER') {
        const ex = enemy.x;
        const ey = enemy.y;

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(ex, ey - 10, enemy.width, 4);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(ex, ey - 10, (enemy.hp / enemy.maxHp) * enemy.width, 4);

        ctx.fillStyle = '#dc2626';
        ctx.fillRect(ex + 4, ey + 14, 20, 18);

        ctx.fillStyle = '#fca5a5';
        ctx.fillRect(ex + 8, ey + 4, 12, 10);
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(ex + 6, ey, 16, 6);

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(ex + 5, ey + 32, 7, 12);
        ctx.fillRect(ex + 16, ey + 32, 7, 12);

        ctx.fillStyle = '#0f172a';
        if (enemy.facing === 'left') {
          ctx.fillRect(ex - 8, ey + 18, 14, 5);
        } else {
          ctx.fillRect(ex + 20, ey + 18, 14, 5);
        }
      } else if (enemy.type === 'TURRET') {
        ctx.fillStyle = '#334155';
        ctx.fillRect(enemy.x, enemy.y + 16, enemy.width, 19);

        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(enemy.x + 16, enemy.y + 16, 14, Math.PI, 0, false);
        ctx.fill();

        const ang = enemy.aimAngle || 0;
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(enemy.x + 16, enemy.y + 16);
        ctx.lineTo(enemy.x + 16 + Math.cos(ang) * 22, enemy.y + 16 + Math.sin(ang) * 22);
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(enemy.x + 16, enemy.y + 13, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (enemy.type === 'BOSS') {
        const bx = enemy.x;
        const by = enemy.y;

        ctx.fillStyle = '#000000';
        ctx.fillRect(bx - 20, by - 24, enemy.width + 40, 10);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(bx - 18, by - 22, (enemy.hp / enemy.maxHp) * (enemy.width + 36), 6);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`CĂN CỨ ĐẠI TRÙM: ${Math.round((enemy.hp / enemy.maxHp) * 100)}%`, bx + enemy.width / 2, by - 28);

        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(bx, by, enemy.width, enemy.height);

        const heartPulse = Math.sin(this.gameTime * 6) * 6 + 28;
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#e11d48';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(bx + enemy.width / 2, by + enemy.height / 2, heartPulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#475569';
        ctx.fillRect(bx - 14, by + 15, 18, 12);
        ctx.fillRect(bx - 18, by + 54, 22, 14);
        ctx.fillRect(bx - 14, by + 95, 18, 12);
      }

      ctx.restore();
    }
  }

  private renderPlayer(ctx: CanvasRenderingContext2D) {
    const p = this.player;

    ctx.save();

    if (p.invulnerableTimer > 0 && Math.floor(p.invulnerableTimer * 20) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    if (p.shieldActive) {
      const shieldTime = this.gameTime * 4;
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(p.x + p.width / 2, p.y + p.height / 2, 38, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < 3; i++) {
        const ang = shieldTime + (i * Math.PI * 2) / 3;
        const sx = p.x + p.width / 2 + Math.cos(ang) * 38;
        const sy = p.y + p.height / 2 + Math.sin(ang) * 38;
        ctx.fillStyle = '#67e8f9';
        ctx.beginPath();
        ctx.arc(sx, sy, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    const px = p.x;
    const py = p.y;
    const isFacingRight = p.facing === 'right';

    if (p.isCrouching) {
      ctx.fillStyle = '#fbcfe8';
      ctx.fillRect(isFacingRight ? px + 14 : px + 4, py + 2, 14, 10);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(isFacingRight ? px + 12 : px + 2, py + 3, 18, 3);
      ctx.fillRect(isFacingRight ? px + 6 : px + 20, py + 4, 8, 2);

      ctx.fillStyle = '#15803d';
      ctx.fillRect(isFacingRight ? px + 6 : px + 10, py + 12, 18, 10);

      ctx.fillStyle = '#0f172a';
      if (isFacingRight) {
        ctx.fillRect(px + 18, py + 14, 22, 6);
      } else {
        ctx.fillRect(px - 10, py + 14, 22, 6);
      }
    } else {
      ctx.fillStyle = '#ef4444';
      const tailOffset = Math.sin(this.gameTime * 15) * 3;
      if (isFacingRight) {
        ctx.fillRect(px - 6, py + 6 + tailOffset, 10, 3);
      } else {
        ctx.fillRect(px + p.width - 4, py + 6 + tailOffset, 10, 3);
      }

      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(px + 8, py + 4, 16, 12);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(px + 6, py + 6, 20, 4);

      ctx.fillStyle = '#78350f';
      ctx.fillRect(px + 8, py + 1, 16, 4);

      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(px + 7, py + 16, 18, 16);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px + 8, py + 18, 16, 4);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(px + 10, py + 18, 3, 4);
      ctx.fillRect(px + 15, py + 18, 3, 4);
      ctx.fillRect(px + 20, py + 18, 3, 4);

      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(px + 6, py + 30, 20, 8);

      ctx.fillStyle = '#0f172a';
      if (p.onGround) {
        if (p.runFrame === 0 || p.runFrame === 2) {
          ctx.fillRect(px + 6, py + 38, 7, 10);
          ctx.fillRect(px + 18, py + 38, 7, 10);
        } else if (p.runFrame === 1) {
          ctx.fillRect(px + 4, py + 37, 7, 10);
          ctx.fillRect(px + 21, py + 39, 7, 9);
        } else {
          ctx.fillRect(px + 9, py + 39, 7, 9);
          ctx.fillRect(px + 16, py + 37, 7, 10);
        }
      } else {
        ctx.fillRect(px + 8, py + 36, 7, 8);
        ctx.fillRect(px + 17, py + 36, 7, 8);
      }

      ctx.fillStyle = '#0f172a';
      if (p.aimUp) {
        if (Math.abs(p.vx) > 0) {
          if (isFacingRight) {
            ctx.fillRect(px + 18, py + 8, 16, 6);
            ctx.fillRect(px + 24, py - 4, 6, 14);
          } else {
            ctx.fillRect(px - 4, py + 8, 16, 6);
            ctx.fillRect(px - 2, py - 4, 6, 14);
          }
        } else {
          ctx.fillRect(isFacingRight ? px + 18 : px + 8, py - 14, 6, 26);
        }
      } else {
        if (isFacingRight) {
          ctx.fillRect(px + 18, py + 18, 22, 6);
        } else {
          ctx.fillRect(px - 10, py + 18, 22, 6);
        }
      }
    }

    ctx.restore();
  }

  private renderBullets(ctx: CanvasRenderingContext2D) {
    for (const b of this.bullets) {
      ctx.save();
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 8;

      if (b.weaponType === 'LASER') {
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(b.x - b.vx * 2.2, b.y - b.vy * 2.2);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  private renderParticles(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      ctx.restore();
    }
  }

  private renderFloatingTexts(ctx: CanvasRenderingContext2D) {
    for (const ft of this.floatingTexts) {
      ctx.save();
      ctx.globalAlpha = ft.alpha;
      ctx.fillStyle = ft.color;
      ctx.font = 'bold 12px "Chakra Petch", sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }
  }

  private renderNightDarknessOverlay(ctx: CanvasRenderingContext2D) {
    const cycleProgress = (this.gameTime % DAY_NIGHT_CYCLE_DURATION) / DAY_NIGHT_CYCLE_DURATION;
    let nightAlpha = 0;
    if (cycleProgress >= 0.45 && cycleProgress < 0.52) {
      nightAlpha = (cycleProgress - 0.45) / 0.07 * 0.75;
    } else if (cycleProgress >= 0.52 && cycleProgress < 0.82) {
      nightAlpha = 0.78;
    } else if (cycleProgress >= 0.82 && cycleProgress < 0.88) {
      nightAlpha = (1 - (cycleProgress - 0.82) / 0.06) * 0.75;
    }

    if (nightAlpha <= 0.01) return;

    const playerScreenX = this.player.x - this.cameraX + this.player.width / 2;
    const playerScreenY = this.player.y + this.player.height / 2;

    ctx.save();
    const rad = ctx.createRadialGradient(
      playerScreenX,
      playerScreenY,
      35,
      playerScreenX,
      playerScreenY,
      230,
    );

    rad.addColorStop(0, 'rgba(3, 7, 18, 0)');
    rad.addColorStop(0.4, `rgba(3, 7, 18, ${nightAlpha * 0.4})`);
    rad.addColorStop(1, `rgba(3, 7, 18, ${nightAlpha})`);

    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.strokeStyle = `rgba(253, 224, 71, ${nightAlpha * 0.45})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(playerScreenX, playerScreenY, 80, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  private lerpColor(c1: string, c2: string, t: number): string {
    const parse = (hex: string) => {
      const cleaned = hex.replace('#', '');
      const num = parseInt(cleaned, 16);
      return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    };
    const [r1, g1, b1] = parse(c1);
    const [r2, g2, b2] = parse(c2);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${r}, ${g}, ${b})`;
  }
}
