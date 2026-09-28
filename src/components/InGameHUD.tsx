import React from 'react';
import { PlayerStats, WeaponType } from '../types/game';
import {
  Heart,
  Zap,
  Volume2,
  VolumeX,
  Pause,
  Sun,
  Sunset,
  Moon,
  Shield,
  Crosshair,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Flame,
} from 'lucide-react';
import { sound } from '../services/soundFx';

interface InGameHUDProps {
  stats: PlayerStats;
  topic: string;
  dayPhase: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  onSkillActivate: () => void;
  onVirtualControl: (action: 'left' | 'right' | 'up' | 'down' | 'jump' | 'shoot' | 'skill', pressed: boolean) => void;
}

export const InGameHUD: React.FC<InGameHUDProps> = ({
  stats,
  topic,
  dayPhase,
  isMuted,
  onToggleMute,
  onPause,
  onSkillActivate,
  onVirtualControl,
}) => {
  const hpPercent = Math.max(0, Math.min(100, (stats.hp / stats.maxHp) * 100));
  const manaPercent = Math.max(0, Math.min(100, (stats.mana / stats.maxMana) * 100));
  const canUseSkill = stats.mana >= 40 && !stats.shieldActive;

  const weaponMeta: Record<WeaponType, { name: string; color: string; badge: string; bg: string }> = {
    NORMAL: {
      name: 'Rifle Tiêu Chuẩn',
      color: 'text-amber-400',
      badge: 'N',
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    },
    SPREAD: {
      name: 'Súng S (Đạn Chùm 3 Tia)',
      color: 'text-orange-400',
      badge: 'S',
      bg: 'bg-orange-500/20 border-orange-500/40 text-orange-300',
    },
    LASER: {
      name: 'Súng L (Laser Xuyên Thấu)',
      color: 'text-cyan-400',
      badge: 'L',
      bg: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
    },
  };

  const currentWeapon = weaponMeta[stats.weapon] || weaponMeta.NORMAL;

  const renderDayPhaseIcon = () => {
    switch (dayPhase) {
      case 'SUNSET':
        return (
          <div className="flex items-center gap-1 text-orange-400">
            <Sunset className="w-4 h-4 animate-pulse" />
            <span className="text-[11px] font-semibold">Hoàng Hôn</span>
          </div>
        );
      case 'NIGHT':
        return (
          <div className="flex items-center gap-1 text-indigo-300">
            <Moon className="w-4 h-4" />
            <span className="text-[11px] font-semibold">Đêm Tối (Quầng sáng)</span>
          </div>
        );
      case 'DAWN':
        return (
          <div className="flex items-center gap-1 text-rose-300">
            <Sun className="w-4 h-4" />
            <span className="text-[11px] font-semibold">Bình Minh</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 text-amber-400">
            <Sun className="w-4 h-4" />
            <span className="text-[11px] font-semibold">Ban Ngày</span>
          </div>
        );
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 select-none">
      {/* Top Status Bar */}
      <div className="flex items-start justify-between gap-3 pointer-events-auto">
        {/* Left Side: HP, MANA & WEAPON */}
        <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl shadow-lg flex flex-col gap-2 min-w-[210px] md:min-w-[260px]">
          {/* HP Bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold flex items-center gap-1.5 text-rose-400 font-mono">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                MÁU (HP)
              </span>
              <span className="font-mono text-xs font-bold text-slate-200">
                {stats.hp} / {stats.maxHp}
              </span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/80 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  stats.hp > 50
                    ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                    : stats.hp > 25
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                    : 'bg-gradient-to-r from-rose-600 to-red-500 animate-pulse'
                }`}
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>

          {/* Mana Bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold flex items-center gap-1.5 text-cyan-400 font-mono">
                <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                MANA (KỸ NĂNG)
              </span>
              <span className="font-mono text-xs font-bold text-slate-200">
                {stats.mana} / {stats.maxMana}
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/80 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-sky-400 transition-all duration-300"
                style={{ width: `${manaPercent}%` }}
              />
            </div>
          </div>

          {/* Current Weapon Badge */}
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded flex items-center justify-center font-mono font-black text-xs border ${currentWeapon.bg}`}
              >
                {currentWeapon.badge}
              </div>
              <span className="text-xs font-bold text-slate-200 truncate max-w-[140px]">
                {currentWeapon.name}
              </span>
            </div>

            {/* Skill Button (K key) */}
            <button
              onClick={onSkillActivate}
              disabled={!canUseSkill}
              className={`px-2 py-1 rounded-lg text-xs font-bold font-mono flex items-center gap-1 transition active:scale-95 ${
                stats.shieldActive
                  ? 'bg-cyan-500 text-slate-950 animate-pulse ring-2 ring-cyan-400'
                  : canUseSkill
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-900/50'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>[K] KHIÊN</span>
              {stats.shieldActive ? (
                <span className="text-[10px] ml-0.5">({stats.shieldDuration}s)</span>
              ) : (
                <span className="text-[10px] text-cyan-200 ml-0.5">40 MP</span>
              )}
            </button>
          </div>
        </div>

        {/* Center: Quiz Gate Progress, Sector & Topic */}
        <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 px-4 py-2 rounded-xl shadow-lg flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Chủ đề:</span>
            <span className="text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
              {topic}
            </span>
            <span className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40">
              KHU VỰC {stats.sector} • {stats.distance}m
            </span>
          </div>

          <div className="flex items-center gap-3 mt-0.5 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-slate-300 font-medium">Cổng đã vượt:</span>
              <span className="font-mono font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/40">
                #{stats.gatesPassed} Cổng
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-300 border-l border-slate-700/80 pl-3">
              <span className="text-slate-400">Câu hỏi ôn tập:</span>
              <span className="font-mono font-bold text-amber-400">
                {stats.uniqueQuestionsAnswered}/{stats.totalQuestionsInTopic}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">(Không lặp)</span>
            </div>
          </div>
        </div>

        {/* Right Side: Score, Day/Night & Controls */}
        <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl shadow-lg flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">ĐIỂM SỐ:</span>
            <span className="text-base font-black text-amber-400 font-mono tracking-wider">
              {stats.score.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1 border-t border-slate-800/80 w-full justify-between">
            {renderDayPhaseIcon()}

            <div className="flex items-center gap-1.5">
              <button
                onClick={onToggleMute}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onPause}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title="Tạm dừng"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Virtual Controls (Great for touch screens / mobile or quick on-screen clicks) */}
      <div className="flex items-end justify-between pointer-events-auto pb-1 px-1">
        {/* D-Pad on the left */}
        <div className="relative w-36 h-36 opacity-75 hover:opacity-100 transition-opacity">
          {/* Up (Aim Up) */}
          <button
            onPointerDown={() => onVirtualControl('up', true)}
            onPointerUp={() => onVirtualControl('up', false)}
            onPointerLeave={() => onVirtualControl('up', false)}
            className="absolute top-0 left-12 w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 flex items-center justify-center active:bg-amber-500 active:text-slate-950 active:scale-95 shadow-md"
          >
            <ArrowUp className="w-6 h-6" />
          </button>

          {/* Left */}
          <button
            onPointerDown={() => onVirtualControl('left', true)}
            onPointerUp={() => onVirtualControl('left', false)}
            onPointerLeave={() => onVirtualControl('left', false)}
            className="absolute top-12 left-0 w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 flex items-center justify-center active:bg-amber-500 active:text-slate-950 active:scale-95 shadow-md"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Center */}
          <div className="absolute top-12 left-12 w-12 h-12 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-mono">
            D-PAD
          </div>

          {/* Right */}
          <button
            onPointerDown={() => onVirtualControl('right', true)}
            onPointerUp={() => onVirtualControl('right', false)}
            onPointerLeave={() => onVirtualControl('right', false)}
            className="absolute top-12 right-0 w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 flex items-center justify-center active:bg-amber-500 active:text-slate-950 active:scale-95 shadow-md"
          >
            <ArrowRight className="w-6 h-6" />
          </button>

          {/* Down (Crouch S) */}
          <button
            onPointerDown={() => onVirtualControl('down', true)}
            onPointerUp={() => onVirtualControl('down', false)}
            onPointerLeave={() => onVirtualControl('down', false)}
            className="absolute bottom-0 left-12 w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 flex items-center justify-center active:bg-amber-500 active:text-slate-950 active:scale-95 shadow-md"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
        </div>

        {/* Action Buttons on the right (Jump, Crouch, Shoot, Skill) */}
        <div className="flex items-center gap-2 opacity-85 hover:opacity-100 transition-opacity">
          {/* Crouch button */}
          <button
            onPointerDown={() => onVirtualControl('down', true)}
            onPointerUp={() => onVirtualControl('down', false)}
            onPointerLeave={() => onVirtualControl('down', false)}
            className="w-13 h-13 rounded-2xl bg-slate-900/90 border border-slate-700 text-amber-400 font-bold text-xs flex flex-col items-center justify-center active:bg-amber-500 active:text-slate-950 active:scale-95 shadow-md"
          >
            <span className="text-[10px] text-slate-400 font-mono">S</span>
            <span className="text-[11px] font-bold">CÚI</span>
          </button>

          {/* Jump button */}
          <button
            onPointerDown={() => onVirtualControl('jump', true)}
            onPointerUp={() => onVirtualControl('jump', false)}
            onPointerLeave={() => onVirtualControl('jump', false)}
            className="w-14 h-14 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500/80 text-emerald-300 font-black text-xs flex flex-col items-center justify-center active:bg-emerald-500 active:text-slate-950 active:scale-95 shadow-lg shadow-emerald-950/40"
          >
            <span className="text-[10px] text-emerald-400 font-mono">W / SPACE</span>
            <span className="text-xs font-bold">NHẢY</span>
          </button>

          {/* Skill button */}
          <button
            onClick={onSkillActivate}
            disabled={!canUseSkill}
            className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center transition active:scale-95 shadow-lg ${
              stats.shieldActive
                ? 'bg-cyan-500 border-cyan-300 text-slate-950 ring-2 ring-cyan-400 animate-pulse'
                : canUseSkill
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-cyan-950/40'
                : 'bg-slate-900 border-slate-800 text-slate-600 opacity-60'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[10px] font-bold font-mono">K (KHIÊN)</span>
          </button>

          {/* Shoot button */}
          <button
            onPointerDown={() => onVirtualControl('shoot', true)}
            onPointerUp={() => onVirtualControl('shoot', false)}
            onPointerLeave={() => onVirtualControl('shoot', false)}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 border-2 border-red-400 text-white font-black text-sm flex flex-col items-center justify-center active:from-red-500 active:to-amber-500 active:scale-95 shadow-xl shadow-red-950/60"
          >
            <Crosshair className="w-6 h-6 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider">BẮN (J)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
