import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, RotateCcw, Home, Award } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  score: number;
  questionsSolved: number;
  topic: string;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  score,
  questionsSolved,
  topic,
  onPlayAgain,
  onGoHome,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Big celebratory fireworks
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400 rounded-3xl shadow-2xl p-6 text-slate-100 flex flex-col items-center text-center">
        {/* Trophy icon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-xl shadow-amber-500/30 mb-4 animate-bounce">
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-amber-400">
            <Trophy className="w-10 h-10" />
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full mb-2">
          NHIỆM VỤ HOÀN THÀNH XUẤT SẮC
        </span>

        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-slate-100 font-sans">
          CHIẾN THẮNG VINH QUANG!
        </h2>

        <p className="text-xs text-slate-300 mt-1 max-w-xs">
          Bạn đã tiêu diệt trùm căn cứ và xuất sắc giải mã toàn bộ các cổng trắc nghiệm thuộc chủ đề{' '}
          <strong className="text-amber-300">{topic}</strong>!
        </p>

        {/* Stats card */}
        <div className="w-full my-5 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-2 gap-3 text-left">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-mono block">TỔNG ĐIỂM CHIẾN ĐẤU</span>
            <span className="text-xl font-black text-amber-400 font-mono">{score.toLocaleString()}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-mono block">CỔNG TRẮC NGHIỆM</span>
            <span className="text-xl font-black text-emerald-400 font-mono flex items-center gap-1">
              <Award className="w-5 h-5 text-emerald-400" />
              {questionsSolved} / {questionsSolved}
            </span>
          </div>
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
            onClick={onPlayAgain}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95 shadow-lg shadow-amber-500/25"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi Lại</span>
          </button>
        </div>
      </div>
    </div>
  );
};
