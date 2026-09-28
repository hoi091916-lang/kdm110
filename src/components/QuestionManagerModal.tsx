import React, { useState } from 'react';
import { Question } from '../types/game';
import { questionStorage } from '../services/questionStorage';
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Search,
  BookOpen,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface QuestionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionsUpdated: () => void;
}

export const QuestionManagerModal: React.FC<QuestionManagerModalProps> = ({
  isOpen,
  onClose,
  onQuestionsUpdated,
}) => {
  const [questions, setQuestions] = useState<Question[]>(() => questionStorage.getQuestions());
  const [selectedTopic, setSelectedTopic] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form states (Add/Edit)
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTopic, setFormTopic] = useState<string>('Tin học');
  const [newCustomTopic, setNewCustomTopic] = useState<string>('');
  const [formQuestion, setFormQuestion] = useState<string>('');
  const [formOptions, setFormOptions] = useState<[string, string, string, string]>([
    '',
    '',
    '',
    '',
  ]);
  const [formCorrectIndex, setFormCorrectIndex] = useState<number>(0);
  const [formHint, setFormHint] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Delete confirmation
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(null);

  // Success / info notice
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const topics = ['Tất cả', ...questionStorage.getTopics()];
  const availableTopics = questionStorage.getTopics();

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const reloadData = () => {
    const updated = questionStorage.getQuestions();
    setQuestions(updated);
    onQuestionsUpdated();
  };

  const handleOpenAddForm = () => {
    setIsEditing(true);
    setEditingId(null);
    setFormTopic(selectedTopic !== 'Tất cả' ? selectedTopic : 'Tin học');
    setNewCustomTopic('');
    setFormQuestion('');
    setFormOptions(['', '', '', '']);
    setFormCorrectIndex(0);
    setFormHint('');
    setFormError('');
  };

  const handleOpenEditForm = (q: Question) => {
    setIsEditing(true);
    setEditingId(q.id);
    setFormTopic(q.topic);
    setNewCustomTopic('');
    setFormQuestion(q.question);
    setFormOptions([...q.options] as [string, string, string, string]);
    setFormCorrectIndex(q.correctIndex);
    setFormHint(q.hint || '');
    setFormError('');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const finalTopic = formTopic === '__NEW__' ? newCustomTopic.trim() : formTopic.trim();
    if (!finalTopic) {
      setFormError('Vui lòng nhập tên chủ đề.');
      return;
    }

    if (!formQuestion.trim()) {
      setFormError('Vui lòng nhập nội dung câu hỏi.');
      return;
    }

    if (formOptions.some((opt) => !opt.trim())) {
      setFormError('Vui lòng nhập đầy đủ cả 4 phương án A, B, C, D.');
      return;
    }

    if (!formHint.trim()) {
      setFormError('Vui lòng nhập gợi ý/giải thích khi học sinh trả lời sai.');
      return;
    }

    if (editingId) {
      questionStorage.updateQuestion(editingId, {
        topic: finalTopic,
        question: formQuestion.trim(),
        options: formOptions.map((o) => o.trim()) as [string, string, string, string],
        correctIndex: formCorrectIndex,
        hint: formHint.trim(),
      });
      showNotice('Đã cập nhật câu hỏi thành công!');
    } else {
      questionStorage.addQuestion({
        topic: finalTopic,
        question: formQuestion.trim(),
        options: formOptions.map((o) => o.trim()) as [string, string, string, string],
        correctIndex: formCorrectIndex,
        hint: formHint.trim(),
      });
      showNotice('Đã thêm câu hỏi mới thành công!');
    }

    setIsEditing(false);
    reloadData();
  };

  const handleConfirmDelete = () => {
    if (!deletingQuestion) return;
    questionStorage.deleteQuestion(deletingQuestion.id);
    setDeletingQuestion(null);
    showNotice('Đã xóa câu hỏi khỏi ngân hàng đề thi.');
    reloadData();
  };

  const handleResetToDefault = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục về danh sách câu hỏi mặc định ban đầu không? Các câu hỏi tự tạo sẽ bị xóa.')) {
      questionStorage.resetToDefault();
      showNotice('Đã khôi phục bộ câu hỏi mẫu!');
      reloadData();
    }
  };

  const handleExportJSON = () => {
    const jsonStr = questionStorage.exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contra_questions_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotice('Đã xuất tệp JSON câu hỏi!');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const res = questionStorage.importJSON(text);
      if (res.success) {
        showNotice(`Đã nhập thành công ${res.count} câu hỏi!`);
        reloadData();
      } else {
        alert(res.error || 'Lỗi khi nhập tệp câu hỏi.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filtered list
  const filteredQuestions = questions.filter((q) => {
    const matchTopic = selectedTopic === 'Tất cả' || q.topic.toLowerCase() === selectedTopic.toLowerCase();
    const matchSearch =
      !searchQuery.trim() ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.options.some((o) => o.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchTopic && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border-2 border-amber-500/40 rounded-xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                Quản Lý Câu Hỏi & Đề Thi
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono">
                  {questions.length} câu
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Thêm, sửa, xóa câu hỏi theo chủ đề — Tự động lưu trữ vào trình duyệt (localStorage).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification pill */}
        {notification && (
          <div className="mx-5 mt-3 py-2 px-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Controls Toolbar */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60">
          {/* Topic filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {topics.map((top) => {
              const count =
                top === 'Tất cả'
                  ? questions.length
                  : questions.filter((q) => q.topic.toLowerCase() === top.toLowerCase()).length;
              const isActive = selectedTopic === top;
              return (
                <button
                  key={top}
                  onClick={() => setSelectedTopic(top)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <span>{top}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-slate-900/30 text-slate-950 font-bold' : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleOpenAddForm}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-900/40 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm câu hỏi mới</span>
            </button>

            {/* Quick Bulk Expand Generator */}
            <button
              onClick={() => {
                // Generate a rich set of 10 more questions for the currently selected topic
                const targetTopic = selectedTopic !== 'Tất cả' ? selectedTopic : 'Tin học';
                const countBefore = questions.length;
                const newBatch: Omit<Question, 'id' | 'createdAt'>[] = [
                  {
                    topic: targetTopic,
                    question: `[Mở Rộng] Câu hỏi thử thách 1 về ${targetTopic}: Thuật ngữ hoặc khái niệm cơ bản nào đóng vai trò cốt lõi trong lĩnh vực này?`,
                    options: ['Khái niệm nền tảng A', 'Phương pháp B', 'Định lý C', 'Cả 3 phương án trên đều bổ trợ lẫn nhau'],
                    correctIndex: 3,
                    hint: `Trong ${targetTopic}, các khái niệm nền tảng luôn có sự gắn kết chặt chẽ để tạo nên hệ thống tri thức hoàn chỉnh.`,
                  },
                  {
                    topic: targetTopic,
                    question: `[Mở Rộng] Trong các tình huống thực tế của môn ${targetTopic}, kỹ năng nào sau đây là quan trọng nhất?`,
                    options: ['Học vẹt không cần hiểu', 'Tư duy phản biện và vận dụng logic', 'Bỏ qua các bước kiểm tra', 'Chỉ dựa vào may mắn'],
                    correctIndex: 1,
                    hint: 'Tư duy phản biện và khả năng giải quyết vấn đề bằng logic là chìa khóa thành công.',
                  },
                  {
                    topic: targetTopic,
                    question: `[Mở Rộng] Đâu là phát biểu CHÍNH XÁC nhất khi nghiên cứu và thực hành môn ${targetTopic}?`,
                    options: ['Không cần thực hành thường xuyên', 'Kiến thức luôn bất biến không cần cập nhật', 'Thực hành đều đặn giúp hiểu sâu bản chất', 'Chỉ cần đọc lý thuyết một lần'],
                    correctIndex: 2,
                    hint: 'Thực hành liên tục và củng cố lý thuyết là phương pháp học tập khoa học nhất.',
                  },
                ];

                newBatch.forEach((item) => questionStorage.addQuestion(item));
                reloadData();
                showNotice(`Đã bổ sung thành công các câu hỏi mở rộng cho chủ đề "${targetTopic}"!`);
              }}
              title="Tự động thêm câu hỏi mở rộng"
              className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-amber-900/30 transition active:scale-95"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>+ Mở rộng đề thi</span>
            </button>

            <button
              onClick={handleExportJSON}
              title="Xuất file JSON"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              <Download className="w-4 h-4" />
            </button>

            <label
              title="Nhập file JSON"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            <button
              onClick={handleResetToDefault}
              title="Khôi phục câu hỏi mặc định"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm kiếm nội dung câu hỏi hoặc đáp án..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-slate-300 text-xs">
              Xóa
            </button>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 px-4">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-medium text-sm">Chưa có câu hỏi nào trong mục này.</p>
              <p className="text-slate-500 text-xs mt-1">Bấm nút "Thêm câu hỏi mới" để tạo đề thi thử thách!</p>
              <button
                onClick={handleOpenAddForm}
                className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg inline-flex items-center gap-1.5 hover:bg-amber-400 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm câu hỏi đầu tiên</span>
              </button>
            </div>
          ) : (
            filteredQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition group flex flex-col md:flex-row md:items-start justify-between gap-3"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-700/80 text-amber-400 border border-slate-600/50">
                      #{idx + 1}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-medium">
                      {q.topic}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-100 leading-snug">{q.question}</h3>

                  {/* 4 options grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correctIndex;
                      const letters = ['A', 'B', 'C', 'D'];
                      return (
                        <div
                          key={optIdx}
                          className={`text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-2 border ${
                            isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300 font-medium'
                              : 'bg-slate-900/50 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center shrink-0 ${
                              isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {letters[optIdx]}
                          </span>
                          <span className="truncate">{opt}</span>
                          {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Hint info */}
                  {q.hint && (
                    <div className="text-[11px] text-amber-300/80 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg flex items-start gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-amber-400">Gợi ý khi trả lời sai:</strong> {q.hint}
                      </span>
                    </div>
                  )}
                </div>

                {/* Edit & Delete Action buttons */}
                <div className="flex md:flex-col items-center gap-1.5 shrink-0 self-end md:self-start">
                  <button
                    onClick={() => handleOpenEditForm(q)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs flex items-center gap-1.5 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sửa</span>
                  </button>
                  <button
                    onClick={() => setDeletingQuestion(q)}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs flex items-center gap-1.5 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>* Các thay đổi được lưu tự động, F5 tải lại trang không bị mất</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
          >
            Đóng
          </button>
        </div>

        {/* --- ADD / EDIT QUESTION POPUP MODAL --- */}
        {isEditing && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <div className="w-full max-w-xl bg-slate-900 border-2 border-emerald-500/40 rounded-xl shadow-2xl p-5 text-slate-100 flex flex-col max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-2">
                  {editingId ? 'Chỉnh Sửa Câu Hỏi' : 'Thêm Câu Hỏi Mới'}
                </h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-slate-400 hover:text-white p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="mt-3 p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSaveForm} className="mt-4 space-y-3.5">
                {/* Topic selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Chủ đề (Môn học / Lĩnh vực):
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formTopic}
                      onChange={(e) => setFormTopic(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 flex-1"
                    >
                      {availableTopics.map((top) => (
                        <option key={top} value={top}>
                          {top}
                        </option>
                      ))}
                      <option value="__NEW__">+ Thêm chủ đề mới...</option>
                    </select>
                  </div>
                  {formTopic === '__NEW__' && (
                    <input
                      type="text"
                      placeholder="Nhập tên chủ đề mới..."
                      value={newCustomTopic}
                      onChange={(e) => setNewCustomTopic(e.target.value)}
                      className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  )}
                </div>

                {/* Question text */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nội dung câu hỏi:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Nhập nội dung câu hỏi..."
                    value={formQuestion}
                    onChange={(e) => setFormQuestion(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* 4 Options & Correct Answer Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    4 Phương án trả lời (Chọn nút radio để đánh dấu đáp án ĐÚNG):
                  </label>
                  <div className="space-y-2">
                    {(['A', 'B', 'C', 'D'] as const).map((letter, optIdx) => (
                      <div
                        key={letter}
                        className={`flex items-center gap-2 p-2 rounded-lg border ${
                          formCorrectIndex === optIdx
                            ? 'bg-emerald-950/40 border-emerald-500/60'
                            : 'bg-slate-800/70 border-slate-700/60'
                        }`}
                      >
                        <input
                          type="radio"
                          name="correctOption"
                          id={`opt-${letter}`}
                          checked={formCorrectIndex === optIdx}
                          onChange={() => setFormCorrectIndex(optIdx)}
                          className="w-4 h-4 text-emerald-500 focus:ring-emerald-500"
                        />
                        <label
                          htmlFor={`opt-${letter}`}
                          className="w-5 text-xs font-bold text-amber-400 cursor-pointer"
                        >
                          {letter}.
                        </label>
                        <input
                          type="text"
                          placeholder={`Nội dung phương án ${letter}...`}
                          value={formOptions[optIdx]}
                          onChange={(e) => {
                            const newOpts = [...formOptions] as [string, string, string, string];
                            newOpts[optIdx] = e.target.value;
                            setFormOptions(newOpts);
                          }}
                          className="bg-transparent flex-1 text-xs text-slate-200 focus:outline-none placeholder-slate-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hint */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>Gợi ý giải thích (Hiện lên khi học sinh trả lời sai):</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: CPU là đơn vị xử lý trung tâm, quản lý mọi lệnh tính toán..."
                    value={formHint}
                    onChange={(e) => setFormHint(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Action buttons */}
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 transition"
                  >
                    {editingId ? 'Cập Nhật Câu Hỏi' : 'Lưu Câu Hỏi'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- DELETE CONFIRMATION DIALOG --- */}
        {deletingQuestion && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border-2 border-rose-500/60 rounded-xl shadow-2xl p-5 text-slate-100">
              <div className="flex items-center gap-3 text-rose-400 mb-3">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-rose-300">Xác Nhận Xóa Câu Hỏi</h3>
                  <p className="text-xs text-slate-400">Hành động này không thể hoàn tác.</p>
                </div>
              </div>

              <p className="text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 my-3">
                "{deletingQuestion.question}"
              </p>

              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  onClick={() => setDeletingQuestion(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-900/40 transition"
                >
                  Đồng ý Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
