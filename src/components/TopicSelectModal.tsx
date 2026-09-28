import React, { useState } from 'react';
import { questionStorage } from '../services/questionStorage';
import { Play, Sparkles, BookOpen, Layers, X } from 'lucide-react';

interface TopicSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topic: string) => void;
}

export const TopicSelectModal: React.FC<TopicSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectTopic,
}) => {
  const topics = questionStorage.getTopics();
  const [chosenTopic, setChosenTopic] = useState<string>(topics[0] || 'Tin học');

  if (!isOpen) return null;

  const topicThemes: Record<string, { iconColor: string; bgGradient: string; badge: string }> = {
    'Tin học': {
      iconColor: 'text-cyan-400',
      bgGradient: 'from-cyan-950/40 to-slate-900 border-cyan-500/40 hover:border-cyan-400',
      badge: 'Công nghệ & Thuật toán',
    },
    'Toán học': {
      iconColor: 'text-amber-400',
      bgGradient: 'from-amber-950/40 to-slate-900 border-amber-500/40 hover:border-amber-400',
      badge: 'Tư duy logic & Phép tính',
    },
    'Tiếng Anh': {
      iconColor: 'text-emerald-400',
      bgGradient: 'from-emerald-950/40 to-slate-900 border-emerald-500/40 hover:border-emerald-400',
      badge: 'Từ vựng & Ngữ pháp quốc tế',
    },
    'Lịch sử': {
      iconColor: 'text-rose-400',
      bgGradient: 'from-rose-950/40 to-slate-900 border-rose-500/40 hover:border-rose-400',
      badge: 'Chiến công & Mốc son vẻ vang',
    },
    'Khoa học': {
      iconColor: 'text-purple-400',
      bgGradient: 'from-purple-950/40 to-slate-900 border-purple-500/40 hover:border-purple-400',
      badge: 'Vũ trụ & Tự nhiên kỳ thú',
    },
  };

  const questionsCount = questionStorage.getQuestionsByTopic(chosenTopic).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-red-500/50 rounded-2xl shadow-2xl overflow-hidden text-slate-100 p-6 flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Nhiệm Vụ Ôn Luyện Kiến Thức
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wider text-slate-100 font-sans">
            Chọn Chủ Đề Chiến Đấu
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Trò chơi sẽ lấy các câu hỏi thuộc chủ đề đã chọn làm chướng ngại vật tại các cổng phong ấn!
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-h-[50vh] overflow-y-auto pr-1">
          {topics.map((top) => {
            const isSelected = chosenTopic === top;
            const theme = topicThemes[top] || {
              iconColor: 'text-indigo-400',
              bgGradient: 'from-indigo-950/40 to-slate-900 border-indigo-500/40 hover:border-indigo-400',
              badge: 'Chủ đề tùy chỉnh',
            };
            const count = questionStorage.getQuestionsByTopic(top).length;

            return (
              <div
                key={top}
                onClick={() => setChosenTopic(top)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 bg-gradient-to-b ${
                  theme.bgGradient
                } ${
                  isSelected
                    ? 'border-amber-400 scale-[1.02] shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/30'
                    : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg bg-slate-950/60 ${theme.iconColor}`}>
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">{top}</h3>
                      <span className="text-[10px] text-slate-400 block">{theme.badge}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-400">
                    {count} câu
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Topic Summary & Start Button */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left w-full sm:w-auto">
            <span className="text-xs text-slate-400">Đã chọn:</span>
            <div className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>{chosenTopic}</span>
              <span className="text-xs text-slate-400">({questionsCount} câu hỏi sẵn sàng)</span>
            </div>
          </div>

          <button
            onClick={() => onSelectTopic(chosenTopic)}
            disabled={questionsCount === 0}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs md:text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-xl ${
              questionsCount === 0
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-red-900/40'
            }`}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Xuất Trận Ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
