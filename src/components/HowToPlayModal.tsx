import React from 'react';
import { X, Gamepad2, Shield, Heart, Zap, Crosshair, HelpCircle, Sun, Moon } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 p-5 md:p-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider text-amber-400">
                Hướng Dẫn Chơi & Phím Điều Khiển
              </h2>
              <p className="text-xs text-slate-400">
                Luật chơi Contra kết hợp vượt chướng ngại vật trắc nghiệm tri thức!
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

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
          {/* Controls Table */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
            <h3 className="font-bold text-amber-400 text-sm flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              1. Bảng Phím Điều Khiển Nhân Vật Contra
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
              <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-amber-300 font-bold">
                  A / D hoặc ◄ / ►
                </span>
                <span>Chạy sang trái / phải</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-amber-300 font-bold">
                  W / Space / ▲
                </span>
                <span>Nhảy lên các bậc địa hình</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-amber-300 font-bold">
                  S hoặc ▼
                </span>
                <span>Cúi người nằm né đường đạn</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-amber-300 font-bold">
                  J hoặc Chuột Trái
                </span>
                <span>Bắn đạn thẳng / bắn chéo</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800 sm:col-span-2">
                <span className="px-2 py-1 rounded bg-cyan-900/40 border border-cyan-500/40 font-mono text-cyan-300 font-bold">
                  Phím K (40 MP)
                </span>
                <span>Kích hoạt Khiên Hộ Thể Bất Tử (5 giây) + Sóng Chấn Động</span>
              </div>
            </div>
          </div>

          {/* Drops & Weapons */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
            <h3 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
              <Crosshair className="w-4 h-4" />
              2. Hộp Tiếp Tế Bay & Nâng Cấp Vũ Khí
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Bắn vỡ hộp tiếp tế elip bay trên trời để rơi các vật phẩm quý giá:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-emerald-500/30">
                <div className="text-emerald-400 font-bold text-xs flex items-center gap-1 mb-1">
                  <span className="text-base">🍄</span> Nấm Thần Kỳ
                </div>
                <p className="text-slate-400 text-[11px]">
                  Hồi phục 100% thanh Máu (HP = 100) và đầy cây Mana năng lượng!
                </p>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-xl border border-orange-500/30">
                <div className="text-orange-400 font-bold text-xs flex items-center gap-1 mb-1">
                  <span className="font-mono bg-orange-500/20 px-1 rounded text-[10px]">S</span> Súng Spread (Chùm)
                </div>
                <p className="text-slate-400 text-[11px]">
                  Bắn tỏa 3 tia hình quạt uy lực, quét sạch kẻ địch trên diện rộng!
                </p>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-xl border border-cyan-500/30">
                <div className="text-cyan-400 font-bold text-xs flex items-center gap-1 mb-1">
                  <span className="font-mono bg-cyan-500/20 px-1 rounded text-[10px]">L</span> Súng Laser
                </div>
                <p className="text-slate-400 text-[11px]">
                  Tia laser xuyên thấu cực mạnh, bắn xuyên qua nhiều kẻ thù liên tiếp!
                </p>
              </div>
            </div>
          </div>

          {/* Quiz Gate Mechanics */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
            <h3 className="font-bold text-rose-400 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              3. Cổng Phong Ấn & Chống Lặp Câu Hỏi Tuyệt Đối
            </h3>
            <ul className="list-disc pl-4 space-y-1.5 text-slate-300">
              <li>
                Khi nhân vật chạm cổng, game <strong>LẬP TỨC TẠM DỪNG (Freeze)</strong>, quái vật và đạn đóng băng hoàn toàn.
              </li>
              <li>
                <strong>Cơ chế chống lặp câu hỏi:</strong> Hệ thống tự động ghi nhớ và loại trừ các câu đã xuất hiện. Bạn sẽ <strong>không bao giờ bị trùng câu hỏi</strong> cho tới khi giải hết tất cả các câu trong chủ đề đó!
              </li>
              <li>
                Nếu trả lời <strong>SAI</strong>, game báo lỗi, hiển thị <strong>gợi ý giải thích</strong> và yêu cầu làm lại cho tới khi chính xác.
              </li>
              <li>
                Trả lời <strong>ĐÚNG</strong>: Cổng nổ tung với hiệu ứng ánh sáng, nhận +1000 điểm và màn chơi tiếp tục vô tận!
              </li>
            </ul>
          </div>

          {/* Endless Survival Mode */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h3 className="font-bold text-amber-400 text-sm flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-amber-400" />
              4. Chế Độ Sinh Tồn Vô Tận (Endless Adventure)
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Chiến trường Contra giờ đây mở rộng <strong>vô tận không giới hạn</strong>! Bạn sẽ tiến qua từng Khu vực (Khu vực 1, 2, 3... Sector N), đối mặt với các cổng phong ấn liên tục, tiêu diệt trùm đại bản doanh và thiết lập kỷ lục quãng đường (mét) cùng số điểm cao nhất!
            </p>
          </div>

          {/* Day Night Cycle */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h3 className="font-bold text-indigo-400 text-sm flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <Moon className="w-4 h-4 text-indigo-400" />
              4. Chu Kỳ Ngày Sang Đêm & Quầng Sáng Bảo Vệ
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Mỗi 35 giây, bầu trời sẽ chuyển đổi mượt mà từ Ban Ngày rực rỡ sang Hoàng Hôn đỏ cam và Đêm Tối tĩnh mịch. Khi trời tối, màn hình tối lại và quanh chiến binh Bill luôn tỏa ra <strong>quầng sáng bảo vệ</strong> soi đường tiêu diệt kẻ địch!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-md shadow-amber-500/20"
          >
            Đã Rõ, Vào Trận!
          </button>
        </div>
      </div>
    </div>
  );
};
