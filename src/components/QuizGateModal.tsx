import React, { useState } from 'react';
import { Question } from '../types/game';
import confetti from 'canvas-confetti';
import { ShieldAlert, Lightbulb, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { sound } from '../services/soundFx';

interface QuizGateModalProps {
  isOpen: boolean;
  gateIndex: number;
  question: Question | null;
  onSuccess: () => void;
}

export const QuizGateModal: React.FC<QuizGateModalProps> = ({
  isOpen,
  gateIndex,
  question,
  onSuccess,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isWrong, setIsWrong] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [wrongCount, setWrongCount] = useState<number>(0);

  if (!isOpen || !question) return null;

  const handleChooseOption = (index: number) => {
    if (isCorrect) return;

    setSelectedAnswer(index);

    if (index === question.correctIndex) {
      // CORRECT ANSWER!
      setIsCorrect(true);
      setIsWrong(false);

      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#38bdf8', '#fbbf24', '#f43f5e'],
      });

      setTimeout(() => {
        setIsCorrect(false);
        setIsWrong(false);
        setSelectedAnswer(null);
        setWrongCount(0);
        onSuccess();
      }, 1300);
    } else {
      // WRONG ANSWER!
      sound.playQuizFail();
      setIsWrong(true);
      setWrongCount((prev) => prev + 1);
    }
  };

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-xl bg-slate-900 border-2 rounded-2xl shadow-2xl p-5 md:p-7 text-slate-100 flex flex-col transition-all duration-300 ${
          isWrong
            ? 'border-rose-500 animate-shake shadow-rose-950/50'
            : isCorrect
            ? 'border-emerald-500 shadow-emerald-950/50'
            : 'border-red-500/60 shadow-red-950/50'
        }`}
      >
        {/* Holographic Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-red-400 uppercase block font-bold">
                CỔNG PHONG ẤN THỨ #{gateIndex} • TẠM DỪNG ĐÓNG BĂNG
              </span>
              <h2 className="text-base md:text-lg font-bold text-slate-100 flex items-center gap-2 flex-wrap">
                <span>Thử Thách Mở Khóa Rào Chắn</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {question.topic}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  ✓ Không Lặp Lại
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* Question Statement */}
        <div className="my-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm md:text-base font-semibold leading-relaxed">
          {question.question}
        </div>

        {/* 4 Answer Options */}
        <div className="space-y-2.5">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isThisCorrect = isCorrect && idx === question.correctIndex;
            const isThisWrong = isWrong && isSelected;

            return (
              <button
                key={idx}
                onClick={() => handleChooseOption(idx)}
                disabled={isCorrect}
                className={`w-full p-3 md:p-3.5 rounded-xl border text-left text-xs md:text-sm font-medium flex items-center gap-3 transition-all duration-150 active:scale-[0.98] ${
                  isThisCorrect
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-900/50'
                    : isThisWrong
                    ? 'bg-rose-950/70 border-rose-500 text-rose-200'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 hover:border-amber-400/80 text-slate-200'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg text-xs font-bold font-mono flex items-center justify-center shrink-0 border ${
                    isThisCorrect
                      ? 'bg-white text-emerald-800 border-white'
                      : isThisWrong
                      ? 'bg-rose-500 text-white border-rose-400'
                      : 'bg-slate-900 text-amber-400 border-slate-700'
                  }`}
                >
                  {letters[idx]}
                </span>
                <span className="flex-1">{option}</span>
                {isThisCorrect && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
                {isThisWrong && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Feedback states */}
        {isWrong && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/60 text-xs text-rose-200 space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wide">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Chưa chính xác! Cổng chưa thể mở ra (Số lần thử lại: {wrongCount}).</span>
            </div>

            {/* Hint Box (Requirement: "Trắc nghiệm: Trả lời SAI: Báo lỗi, hiện gợi ý, yêu cầu chọn lại cho đến khi nào đúng") */}
            {question.hint && (
              <div className="pt-2 border-t border-rose-900/60 flex items-start gap-2 text-amber-300">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-400">Gợi ý trợ giúp:</strong> {question.hint}
                </div>
              </div>
            )}
          </div>
        )}

        {isCorrect && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500 text-xs text-emerald-200 flex items-center gap-2 animate-in zoom-in-95">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-bold text-sm">CHÍNH XÁC! CỔNG PHONG ẤN ĐANG NỔ TUNG... TIẾP TỤC CHIẾN ĐẤU!</span>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
          <span>* Trả lời đúng để phá hủy rào chắn và tiếp tục hành trình</span>
          <span className="font-mono text-amber-400">+1000 Điểm thưởng</span>
        </div>
      </div>
    </div>
  );
};
