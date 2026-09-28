import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/GameEngine';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './game/constants';
import { PlayerStats, Question, SealGate } from './types/game';
import { questionStorage } from './services/questionStorage';
import { sound } from './services/soundFx';
import { QuestionManagerModal } from './components/QuestionManagerModal';
import { TopicSelectModal } from './components/TopicSelectModal';
import { QuizGateModal } from './components/QuizGateModal';
import { InGameHUD } from './components/InGameHUD';
import { HowToPlayModal } from './components/HowToPlayModal';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import {
  Play,
  Settings,
  HelpCircle,
  Volume2,
  VolumeX,
  Shield,
  Zap,
  Crosshair,
  Sparkles,
  BookOpen,
  Award,
} from 'lucide-react';

export default function App() {
  // Screen and Modals
  const [screen, setScreen] = useState<'MENU' | 'PLAYING'>('MENU');
  const [showQuestionManager, setShowQuestionManager] = useState<boolean>(false);
  const [showTopicSelect, setShowTopicSelect] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [showVictory, setShowVictory] = useState<boolean>(false);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);

  // Sound
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted());

  // Active topic & questions
  const [currentTopic, setCurrentTopic] = useState<string>('Tin học');
  const [dayPhase, setDayPhase] = useState<string>('DAY');

  // Active Quiz Gate & Question
  const [activeGate, setActiveGate] = useState<SealGate | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);

  // Player Stats
  const [stats, setStats] = useState<PlayerStats>({
    hp: 100,
    maxHp: 100,
    mana: 100,
    maxMana: 100,
    weapon: 'NORMAL',
    shieldActive: false,
    shieldDuration: 0,
    score: 0,
    kills: 0,
    gatesPassed: 0,
    totalGates: 3,
    sector: 1,
    distance: 0,
    uniqueQuestionsAnswered: 0,
    totalQuestionsInTopic: 16,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Toggle Mute
  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  // Start game with selected topic
  const handleStartGameWithTopic = (topic: string) => {
    setCurrentTopic(topic);
    setShowTopicSelect(false);
    setScreen('PLAYING');
    setShowVictory(false);
    setShowGameOver(false);
    setShowQuizModal(false);

    const questions = questionStorage.getQuestionsByTopic(topic);

    // Give react time to mount canvas
    setTimeout(() => {
      if (canvasRef.current) {
        if (!engineRef.current) {
          engineRef.current = new GameEngine(canvasRef.current, {
            onTriggerQuiz: (gate) => {
              setActiveGate(gate);
              setActiveQuestion(gate.question || null);
              setShowQuizModal(true);
            },
            onUpdateStats: (newStats) => {
              setStats(newStats);
            },
            onGameOver: () => {
              setShowGameOver(true);
            },
            onVictory: () => {
              setShowVictory(true);
            },
            onDayNightChange: (phase) => {
              setDayPhase(phase);
            },
          });
        }
        engineRef.current.init(topic, questions);
        engineRef.current.start();
      }
    }, 50);
  };

  // Handle Success on Quiz
  const handleQuizSuccess = () => {
    setShowQuizModal(false);
    setActiveGate(null);
    setActiveQuestion(null);
    if (engineRef.current) {
      engineRef.current.resumeAfterQuizSuccess();
    }
  };

  // Skill trigger
  const handleSkillActivate = () => {
    if (engineRef.current) {
      engineRef.current.activateSkill();
    }
  };

  // Pause
  const handlePause = () => {
    if (engineRef.current) {
      engineRef.current.isPausedForQuiz = !engineRef.current.isPausedForQuiz;
    }
  };

  // Virtual control inputs
  const handleVirtualControl = useCallback(
    (action: 'left' | 'right' | 'up' | 'down' | 'jump' | 'shoot' | 'skill', pressed: boolean) => {
      if (engineRef.current) {
        engineRef.current.handleKeyInput(action, pressed);
      }
    },
    [],
  );

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screen !== 'PLAYING' || showQuizModal || showVictory || showGameOver) return;

      const code = e.code;
      if (code === 'KeyA' || code === 'ArrowLeft') {
        engineRef.current?.handleKeyInput('left', true);
      } else if (code === 'KeyD' || code === 'ArrowRight') {
        engineRef.current?.handleKeyInput('right', true);
      } else if (code === 'KeyW' || code === 'ArrowUp') {
        engineRef.current?.handleKeyInput('up', true);
        engineRef.current?.handleKeyInput('jump', true);
      } else if (code === 'Space') {
        e.preventDefault();
        engineRef.current?.handleKeyInput('jump', true);
      } else if (code === 'KeyS' || code === 'ArrowDown') {
        engineRef.current?.handleKeyInput('down', true);
      } else if (code === 'KeyJ') {
        engineRef.current?.handleKeyInput('shoot', true);
      } else if (code === 'KeyK') {
        engineRef.current?.handleKeyInput('skill', true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (screen !== 'PLAYING') return;

      const code = e.code;
      if (code === 'KeyA' || code === 'ArrowLeft') {
        engineRef.current?.handleKeyInput('left', false);
      } else if (code === 'KeyD' || code === 'ArrowRight') {
        engineRef.current?.handleKeyInput('right', false);
      } else if (code === 'KeyW' || code === 'ArrowUp') {
        engineRef.current?.handleKeyInput('up', false);
        engineRef.current?.handleKeyInput('jump', false);
      } else if (code === 'Space') {
        engineRef.current?.handleKeyInput('jump', false);
      } else if (code === 'KeyS' || code === 'ArrowDown') {
        engineRef.current?.handleKeyInput('down', false);
      } else if (code === 'KeyJ') {
        engineRef.current?.handleKeyInput('shoot', false);
      } else if (code === 'KeyK') {
        engineRef.current?.handleKeyInput('skill', false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [screen, showQuizModal, showVictory, showGameOver]);

  // Clean up engine on unmount
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* --- MAIN MENU SCREEN --- */}
      {screen === 'MENU' && (
        <div className="flex-1 flex flex-col items-center justify-between p-4 md:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black relative overflow-hidden">
          {/* Decorative Cyber Grid Background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] bg-[size:4rem_4rem]" />

          {/* Top Bar with Audio & Question Bank count */}
          <div className="w-full max-w-5xl flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                HỆ THỐNG TRẮC NGHIỆM ĐÃ SẴN SÀNG
              </span>
            </div>

            <button
              onClick={handleToggleMute}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-2 text-xs font-mono"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span>{isMuted ? 'Âm thanh: TẮT' : 'Âm thanh: BẬT'}</span>
            </button>
          </div>

          {/* Center Title & Hero Banner */}
          <div className="max-w-3xl text-center z-10 my-auto py-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/15 border border-red-500/40 text-red-400 text-xs font-mono uppercase tracking-widest mb-4 shadow-lg shadow-red-950/40">
              <Sparkles className="w-3.5 h-3.5" />
              Game Hành Động Kết Hợp Giáo Dục Trực Quan
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-red-600 drop-shadow-[0_5px_15px_rgba(239,68,68,0.4)] leading-none">
              CONTRA QUIZ
            </h1>
            <h2 className="text-xl sm:text-3xl font-extrabold uppercase tracking-widest text-slate-200 mt-2 font-mono drop-shadow">
              ĐẤU TRƯỜNG TRI THỨC
            </h2>

            <p className="mt-3 text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Nhập vai chiến binh Bill dũng mãnh, vượt qua mưa bom bão đạn, nhặt Nấm hồi máu, nâng cấp Súng Spread/Laser và phá hủy các Cổng phong ấn trắc nghiệm để giải cứu thế giới!
            </p>

            {/* Main Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
              <button
                onClick={() => setShowTopicSelect(true)}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-red-950/60 flex items-center justify-center gap-2.5 transition active:scale-95 group"
              >
                <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                <span>VÀO CHIẾN ĐẤU (CHỌN CHỦ ĐỀ)</span>
              </button>

              <button
                onClick={() => setShowQuestionManager(true)}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border-2 border-amber-500/50 hover:border-amber-400 text-amber-300 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Settings className="w-4 h-4 text-amber-400" />
                <span>QUẢN LÝ CÂU HỎI & ĐỀ THI</span>
              </button>
            </div>

            <div className="mt-3">
              <button
                onClick={() => setShowHowToPlay(true)}
                className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4 transition inline-flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Xem hướng dẫn phím điều khiển & hệ thống vật phẩm</span>
              </button>
            </div>
          </div>

          {/* Bottom Features Cards */}
          <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-3 z-10 mt-auto pt-4">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs mb-1">
                <Crosshair className="w-4 h-4" />
                <span>Điều Khiển Contra</span>
              </div>
              <p className="text-[11px] text-slate-400">
                A/D chạy, W nhảy, S cúi né đạn, J bắn thẳng/chéo, K khiên hộ thể.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
                <BookOpen className="w-4 h-4" />
                <span>Rào Cản Trắc Nghiệm</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Chạm cổng phong ấn game tự động Pause; trả lời đúng để nổ cổng!
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                <span className="text-sm">🍄</span>
                <span>Hộp Tiếp Tế Bay</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Bắn vỡ rơi Nấm hồi 100% HP & Mana, Súng Spread chùm, Súng Laser.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Chu Kỳ Ngày - Đêm</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Bầu trời đổi màu mỗi 35s; ban đêm có quầng sáng bảo vệ quanh Bill.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- PLAYING GAME SCREEN --- */}
      {screen === 'PLAYING' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-black relative overflow-hidden">
          {/* Game Canvas Container (Maintains 16:9 arcade aspect ratio) */}
          <div className="relative w-full max-w-[1100px] aspect-[16/9] max-h-[92vh] bg-slate-950 shadow-2xl overflow-hidden border border-slate-800/60">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="w-full h-full block object-contain"
            />

            {/* In-Game Retro Arcade HUD Overlay */}
            <InGameHUD
              stats={stats}
              topic={currentTopic}
              dayPhase={dayPhase}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              onPause={handlePause}
              onSkillActivate={handleSkillActivate}
              onVirtualControl={handleVirtualControl}
            />
          </div>
        </div>
      )}

      {/* --- MODALS & DIALOGS --- */}
      {/* 1. Question Manager CRUD Modal (Requirement 1) */}
      <QuestionManagerModal
        isOpen={showQuestionManager}
        onClose={() => setShowQuestionManager(false)}
        onQuestionsUpdated={() => {
          // Sync questions if game is running
          if (engineRef.current) {
            engineRef.current.questionPool = questionStorage.getQuestionsByTopic(currentTopic);
          }
        }}
      />

      {/* 2. Topic Selection Modal (Requirement 2) */}
      <TopicSelectModal
        isOpen={showTopicSelect}
        onClose={() => setShowTopicSelect(false)}
        onSelectTopic={handleStartGameWithTopic}
      />

      {/* 3. Quiz Gate Freeze Modal (Requirement 4) */}
      <QuizGateModal
        isOpen={showQuizModal}
        gateIndex={activeGate?.gateIndex || 1}
        question={activeQuestion}
        onSuccess={handleQuizSuccess}
      />

      {/* 4. How To Play Modal */}
      <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />

      {/* 5. Victory Modal */}
      <VictoryModal
        isOpen={showVictory}
        score={stats.score}
        questionsSolved={stats.gatesPassed}
        topic={currentTopic}
        onPlayAgain={() => handleStartGameWithTopic(currentTopic)}
        onGoHome={() => {
          setShowVictory(false);
          setScreen('MENU');
        }}
      />

      {/* 6. Game Over Modal */}
      <GameOverModal
        isOpen={showGameOver}
        score={stats.score}
        stats={stats}
        topic={currentTopic}
        onRetry={() => handleStartGameWithTopic(currentTopic)}
        onGoHome={() => {
          setShowGameOver(false);
          setScreen('MENU');
        }}
      />
    </div>
  );
}
