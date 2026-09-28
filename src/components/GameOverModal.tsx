import React from 'react';
import { Skull, RotateCcw, Home, Award, Compass, Zap } from 'lucide-react';
import { PlayerStats } from '../types/game';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  stats?: PlayerStats;
  topic?: string;
  onRetry: () => void;
  onGoHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  stats,
  topic,
  onRetry,
  onGoHome,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-rose-600 rounded-3xl shadow-2xl p-6 text-slate-100 flex flex-col items-center text-center">
        {/* Skull Icon */}
        <div className="w-16 h-16 rounded-full bg-rose-600/20 border-2 border-rose-500/60 flex items-center justify-center text-rose-500 mb-3 shadow-lg shadow-rose-950/60">
          <Skull className="w-9 h-9" />
        </div>

        <span className="text-[11px] font-mono font-bold tracking-widest text-rose-400 uppercase bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full mb-1">
          KẾT THÚC HÀNH TRÌNH VÔ TẬN
        </span>

        <h2 className="text-2xl font-black uppercase tracking-wider text-slate-100 font-sans">
          GAME OVER
        </h2>

        <p className="text-xs text-slate-400 mt-1">
          Bạn đã chiến đấu anh dũng! Hãy tiếp tục rèn luyện phản xạ và củng cố kiến thức để tiến xa hơn nữa!
        </p>

        {/* Detailed Stats Grid */}
        <div className="w-full my-4 grid grid-cols-2 gap-2 text-left">
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 col-span-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">TỔNG ĐIỂM CHIẾN ĐẤU</span>
            <span className="text-2xl font-black text-amber-400 font-mono">{score.toLocaleString()}</span>
          </div>

          {stats && (
            <>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Compass className="w-3 h-3 text-cyan-400" />
                  QUÃNG ĐƯỜNG
                </span>
                <span className="text-base font-bold text-cyan-300 font-mono">
                  {stats.distance} mét
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-400" />
                  CỔNG VƯỢT QUA
                </span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {stats.gatesPassed} Cổng
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 col-span-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">CÂU HỎI ĐÃ GIẢI (KHÔNG LẶP)</span>
                <span className="text-sm font-bold text-amber-300 font-mono">
                  {stats.uniqueQuestionsAnswered} / {stats.totalQuestionsInTopic} câu
                </span>
              </div>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="w-full flex items-center gap-3">
          <button
            onClick={onGoHome}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95 border border-slate-700"
          >
            <Home className="w-4 h-4" />
            <span>Trang Chủ</span>
          </button>

          <button
            onClick={onRetry}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95 shadow-lg shadow-rose-900/40"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi Lại</span>
          </button>
        </div>
      </div>
    </div>
  );
};
