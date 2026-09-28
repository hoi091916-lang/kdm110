import { Question } from '../types/game';

const STORAGE_KEY = 'CONTRA_QUIZ_COMMANDO_QUESTIONS_V3';

export const DEFAULT_TOPICS = ['Tin học', 'Toán học', 'Tiếng Anh', 'Lịch sử', 'Khoa học'];

export const INITIAL_QUESTIONS: Question[] = [
  // =========================================================================
  // 1. TIN HỌC (16 câu hỏi phong phú)
  // =========================================================================
  {
    id: 'tin-1',
    topic: 'Tin học',
    question: 'Thiết bị nào sau đây được ví như "Bộ não" của máy vi tính, chịu trách nhiệm xử lý mọi dữ liệu và câu lệnh?',
    options: ['RAM (Bộ nhớ trong)', 'CPU (Bộ vi xử lý)', 'Ổ cứng (HDD/SSD)', 'Card màn hình (GPU)'],
    correctIndex: 1,
    hint: 'CPU (Central Processing Unit) đóng vai trò trung tâm điều khiển và tính toán toàn bộ hoạt động của hệ thống máy tính.',
    createdAt: Date.now() - 100000,
  },
  {
    id: 'tin-2',
    topic: 'Tin học',
    question: 'Để sao chép (Copy) văn bản hoặc tệp tin trên hệ điều hành Windows, em dùng tổ hợp phím nào?',
    options: ['Ctrl + X', 'Ctrl + V', 'Ctrl + C', 'Ctrl + Z'],
    correctIndex: 2,
    hint: 'Phím tắt Ctrl + C (viết tắt của Copy) dùng để sao chép dữ liệu vào Clipboard.',
    createdAt: Date.now() - 95000,
  },
  {
    id: 'tin-3',
    topic: 'Tin học',
    question: 'Trong lập trình, cấu trúc điều kiện thường được biểu diễn bằng từ khóa nào sau đây?',
    options: ['FOR / WHILE', 'IF / ELSE', 'PRINT / INPUT', 'DEF / CLASS'],
    correctIndex: 1,
    hint: 'Cấu trúc "IF ... ELSE" (Nếu ... Thì ...) dùng để rẽ nhánh thực thi câu lệnh dựa trên điều kiện đúng hoặc sai.',
    createdAt: Date.now() - 90000,
  },
  {
    id: 'tin-4',
    topic: 'Tin học',
    question: '1 Gigabyte (GB) xấp xỉ bằng bao nhiêu Megabyte (MB) theo chuẩn nhị phân máy tính?',
    options: ['100 MB', '1000 MB', '1024 MB', '1048 MB'],
    correctIndex: 2,
    hint: 'Trong hệ đếm nhị phân máy tính, 1 GB = 2^10 MB = 1024 Megabytes.',
    createdAt: Date.now() - 85000,
  },
  {
    id: 'tin-5',
    topic: 'Tin học',
    question: 'Để bảo vệ tài khoản cá nhân trên mạng an toàn nhất, người dùng NÊN làm gì?',
    options: [
      'Dùng mật khẩu đơn giản "123456" cho dễ nhớ',
      'Chia sẻ mật khẩu cho mọi người bạn thân',
      'Bật bảo mật 2 lớp (2FA) và đặt mật khẩu có chữ hoa, số, ký tự đặc biệt',
      'Đăng nhập tài khoản trên các máy tính lạ rồi không đăng xuất',
    ],
    correctIndex: 2,
    hint: 'Bảo mật 2 lớp (2FA) kết hợp mật khẩu mạnh phức tạp là giải pháp tối ưu ngăn ngừa kẻ xấu xâm nhập.',
    createdAt: Date.now() - 80000,
  },
  {
    id: 'tin-6',
    topic: 'Tin học',
    question: 'Ngôn ngữ lập trình nào sau đây rất phổ biến trong học máy, trí tuệ nhân tạo (AI) và khoa học dữ liệu?',
    options: ['HTML', 'CSS', 'Python', 'Pascal'],
    correctIndex: 2,
    hint: 'Python sở hữu hệ sinh thái thư viện AI cực kỳ phong phú như TensorFlow, PyTorch, Scikit-learn.',
    createdAt: Date.now() - 75000,
  },
  {
    id: 'tin-7',
    topic: 'Tin học',
    question: 'Thiết bị nào sau đây vừa là thiết bị vào (input) vừa là thiết bị ra (output)?',
    options: ['Bàn phím cơ', 'Màn hình cảm ứng', 'Chuột quang', 'Loa vi tính'],
    correctIndex: 1,
    hint: 'Màn hình cảm ứng vừa hiển thị hình ảnh (ra) vừa nhận thao tác chạm ngón tay (vào).',
    createdAt: Date.now() - 70000,
  },
  {
    id: 'tin-8',
    topic: 'Tin học',
    question: 'Trong mạng máy tính, giao thức bảo mật URL nào có ổ khóa xanh mã hóa dữ liệu truyền tải giữa người dùng và máy chủ?',
    options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'],
    correctIndex: 1,
    hint: 'HTTPS (Hypertext Transfer Protocol Secure) sử dụng chứng chỉ SSL/TLS để mã hóa đường truyền dữ liệu an toàn.',
    createdAt: Date.now() - 65000,
  },
  {
    id: 'tin-9',
    topic: 'Tin học',
    question: 'Phần mềm độc hại tự động mã hóa dữ liệu của nạn nhân rồi đòi tiền chuộc để giải mã được gọi là gì?',
    options: ['Adware', 'Ransomware', 'Spyware', 'Cookie'],
    correctIndex: 1,
    hint: 'Ransomware (mã độc tống tiền) khóa dữ liệu và yêu cầu người dùng trả tiền chuộc.',
    createdAt: Date.now() - 60000,
  },
  {
    id: 'tin-10',
    topic: 'Tin học',
    question: 'Trong phần mềm soạn thảo Word, tổ hợp phím nào giúp khôi phục (Undo) lại thao tác vừa lỡ tay xóa?',
    options: ['Ctrl + Y', 'Ctrl + Z', 'Ctrl + S', 'Ctrl + P'],
    correctIndex: 1,
    hint: 'Ctrl + Z là tổ hợp phím hoàn tác (Undo) thao tác vừa thực hiện.',
    createdAt: Date.now() - 55000,
  },
  {
    id: 'tin-11',
    topic: 'Tin học',
    question: 'Đơn vị thông tin nhỏ nhất trong máy tính chỉ nhận giá trị 0 hoặc 1 là gì?',
    options: ['Byte', 'Bit', 'Pixel', 'Megahertz'],
    correctIndex: 1,
    hint: 'Bit (Binary digit) là đơn vị nhỏ nhất, 8 bit hợp thành 1 byte.',
    createdAt: Date.now() - 50000,
  },
  {
    id: 'tin-12',
    topic: 'Tin học',
    question: 'Hệ điều hành mã nguồn mở nào được sử dụng làm nền tảng cho hệ điều hành Android trên điện thoại thông minh?',
    options: ['Windows Phone', 'Linux', 'macOS', 'MS-DOS'],
    correctIndex: 1,
    hint: 'Android được Google phát triển dựa trên nhân Linux (Linux Kernel).',
    createdAt: Date.now() - 45000,
  },
  {
    id: 'tin-13',
    topic: 'Tin học',
    question: 'Trong bảng tính Excel, công thức nào sau đây dùng để tính trung bình cộng của dải ô từ A1 đến A5?',
    options: ['=SUM(A1:A5)', '=AVERAGE(A1:A5)', '=COUNT(A1:A5)', '=MAX(A1:A5)'],
    correctIndex: 1,
    hint: 'Hàm AVERAGE được dùng để tính giá trị trung bình cộng trong Excel.',
    createdAt: Date.now() - 40000,
  },
  {
    id: 'tin-14',
    topic: 'Tin học',
    question: 'Phần mềm Scratch thường được dùng trong trường học nhằm mục đích gì?',
    options: [
      'Thiết kế đồ họa 3D kiến trúc',
      'Học lập trình kéo thả khối lệnh trực quan cho học sinh',
      'Soạn thảo văn bản hành chính',
      'Quản lý cơ sở dữ liệu ngân hàng',
    ],
    correctIndex: 1,
    hint: 'Scratch là môi trường lập trình khối lệnh trực quan do MIT phát triển cho trẻ em và học sinh.',
    createdAt: Date.now() - 35000,
  },
  {
    id: 'tin-15',
    topic: 'Tin học',
    question: 'Bộ nhớ RAM khác bộ nhớ ROM ở đặc điểm cơ bản nào?',
    options: [
      'RAM dữ liệu sẽ biến mất khi mất nguồn điện (volatile)',
      'RAM có dung lượng cố định không thể ghi đè',
      'ROM có tốc độ đọc ghi nhanh hơn RAM hàng ngàn lần',
      'ROM chứa các ứng dụng đang chạy của người dùng',
    ],
    correctIndex: 0,
    hint: 'RAM là bộ nhớ tạm thời, mất điện thì toàn bộ dữ liệu lưu trên đó sẽ bị xóa sạch.',
    createdAt: Date.now() - 30000,
  },
  {
    id: 'tin-16',
    topic: 'Tin học',
    question: 'Công nghệ nào cho phép lưu trữ và truy cập dữ liệu, phần mềm thông qua mạng Internet thay vì trên ổ cứng cục bộ?',
    options: ['Điện toán đám mây (Cloud Computing)', 'Ổ đĩa quang CD-ROM', 'Mạng nội bộ LAN', 'Đĩa mềm mềm (Floppy Disk)'],
    correctIndex: 0,
    hint: 'Cloud Computing (Điện toán đám mây) như Google Drive, OneDrive cho phép lưu trữ trực tuyến mọi lúc mọi nơi.',
    createdAt: Date.now() - 25000,
  },

  // =========================================================================
  // 2. TOÁN HỌC (16 câu hỏi phong phú)
  // =========================================================================
  {
    id: 'toan-1',
    topic: 'Toán học',
    question: 'Số nguyên tố nhỏ nhất và cũng là số nguyên tố chẵn duy nhất là số nào?',
    options: ['0', '1', '2', '3'],
    correctIndex: 2,
    hint: 'Số 2 chỉ có đúng 2 ước số là 1 và 2, đồng thời là số nguyên tố chẵn duy nhất trong toán học.',
    createdAt: Date.now() - 70000,
  },
  {
    id: 'toan-2',
    topic: 'Toán học',
    question: 'Tổng ba góc trong của một tam giác bất kỳ luôn bằng bao nhiêu độ?',
    options: ['90 độ', '180 độ', '270 độ', '360 độ'],
    correctIndex: 1,
    hint: 'Theo định lý hình học phẳng Euclid, tổng ba góc trong một tam giác luôn bằng 180°.',
    createdAt: Date.now() - 65000,
  },
  {
    id: 'toan-3',
    topic: 'Toán học',
    question: 'Tính nhanh biểu thức: 15 × 8 + 15 × 2 = ?',
    options: ['120', '135', '150', '180'],
    correctIndex: 2,
    hint: 'Áp dụng tính chất phân phối: 15 × (8 + 2) = 15 × 10 = 150.',
    createdAt: Date.now() - 60000,
  },
  {
    id: 'toan-4',
    topic: 'Toán học',
    question: 'Một hình vuông có chu vi là 36 cm. Diện tích của hình vuông đó bằng bao nhiêu cm²?',
    options: ['81 cm²', '64 cm²', '36 cm²', '72 cm²'],
    correctIndex: 0,
    hint: 'Cạnh hình vuông = 36 : 4 = 9 cm. Diện tích = 9 × 9 = 81 cm².',
    createdAt: Date.now() - 55000,
  },
  {
    id: 'toan-5',
    topic: 'Toán học',
    question: 'Nếu x + 15 = 42, thì giá trị của x là bao nhiêu?',
    options: ['25', '27', '29', '32'],
    correctIndex: 1,
    hint: 'x = 42 - 15 = 27.',
    createdAt: Date.now() - 50000,
  },
  {
    id: 'toan-6',
    topic: 'Toán học',
    question: 'Số nào sau đây vừa chia hết cho 2, vừa chia hết cho 5 và vừa chia hết cho 3?',
    options: ['125', '240', '315', '404'],
    correctIndex: 1,
    hint: 'Số chia hết cho 2 và 5 có chữ số tận cùng là 0. 240 có 2+4+0 = 6 chia hết cho 3.',
    createdAt: Date.now() - 48000,
  },
  {
    id: 'toan-7',
    topic: 'Toán học',
    question: '25% của 200 bằng bao nhiêu?',
    options: ['25', '50', '75', '100'],
    correctIndex: 1,
    hint: '25% = 1/4. Do đó 200 : 4 = 50.',
    createdAt: Date.now() - 46000,
  },
  {
    id: 'toan-8',
    topic: 'Toán học',
    question: 'Một hình tròn có bán kính r = 5 cm. Chu vi của hình tròn xấp xỉ bằng bao nhiêu (với π ≈ 3.14)?',
    options: ['15.7 cm', '31.4 cm', '78.5 cm', '25 cm'],
    correctIndex: 1,
    hint: 'Công thức chu vi hình tròn là C = 2 × π × r = 2 × 3.14 × 5 = 31.4 cm.',
    createdAt: Date.now() - 44000,
  },
  {
    id: 'toan-9',
    topic: 'Toán học',
    question: 'Ước chung lớn nhất (ƯCLN) của 24 và 36 là bao nhiêu?',
    options: ['6', '8', '12', '18'],
    correctIndex: 2,
    hint: '24 = 2³ × 3; 36 = 2² × 3². ƯCLN = 2² × 3 = 12.',
    createdAt: Date.now() - 42000,
  },
  {
    id: 'toan-10',
    topic: 'Toán học',
    question: 'Tìm x biết: 3x - 7 = 14',
    options: ['5', '6', '7', '8'],
    correctIndex: 2,
    hint: '3x = 14 + 7 = 21 => x = 21 : 3 = 7.',
    createdAt: Date.now() - 40000,
  },
  {
    id: 'toan-11',
    topic: 'Toán học',
    question: 'Trong hệ tọa độ Descartes Oxy, điểm M(0; -4) nằm ở vị trí nào?',
    options: ['Nằm trên trục hoành Ox', 'Nằm trên trục tung Oy', 'Nằm ở góc phần tư thứ nhất', 'Tại gốc tọa độ O'],
    correctIndex: 1,
    hint: 'Điểm có hoành độ x = 0 luôn nằm trên trục tung Oy.',
    createdAt: Date.now() - 38000,
  },
  {
    id: 'toan-12',
    topic: 'Toán học',
    question: 'Căn bậc hai số học của 144 bằng bao nhiêu?',
    options: ['11', '12', '13', '14'],
    correctIndex: 1,
    hint: '12 × 12 = 144, do đó √144 = 12.',
    createdAt: Date.now() - 36000,
  },
  {
    id: 'toan-13',
    topic: 'Toán học',
    question: 'Một hình thang có đáy bé 6 cm, đáy lớn 10 cm, chiều cao 4 cm. Diện tích của hình thang là bao nhiêu?',
    options: ['32 cm²', '64 cm²', '24 cm²', '16 cm²'],
    correctIndex: 0,
    hint: 'Diện tích hình thang = (đáy lớn + đáy bé) × chiều cao : 2 = (10 + 6) × 4 : 2 = 32 cm².',
    createdAt: Date.now() - 34000,
  },
  {
    id: 'toan-14',
    topic: 'Toán học',
    question: 'Số tiếp theo trong dãy số quy luật: 2, 4, 8, 16, 32, ... là số nào?',
    options: ['48', '60', '64', '72'],
    correctIndex: 2,
    hint: 'Mỗi số bằng số liền trước nhân với 2 (cấp số nhân công bội q = 2): 32 × 2 = 64.',
    createdAt: Date.now() - 32000,
  },
  {
    id: 'toan-15',
    topic: 'Toán học',
    question: 'Góc bẹt có số đo bằng bao nhiêu độ?',
    options: ['90°', '180°', '270°', '360°'],
    correctIndex: 1,
    hint: 'Góc bẹt là góc tạo bởi hai tia đối nhau và có số đo bằng 180°.',
    createdAt: Date.now() - 30000,
  },
  {
    id: 'toan-16',
    topic: 'Toán học',
    question: 'Một lớp có 40 học sinh, trong đó có 24 học sinh nữ. Tỉ số phần trăm của học sinh nam trong lớp là bao nhiêu?',
    options: ['40%', '60%', '50%', '35%'],
    correctIndex: 0,
    hint: 'Số học sinh nam = 40 - 24 = 16. Tỉ số phần trăm = (16 : 40) × 100% = 40%.',
    createdAt: Date.now() - 28000,
  },

  // =========================================================================
  // 3. TIẾNG ANH (16 câu hỏi phong phú)
  // =========================================================================
  {
    id: 'anh-1',
    topic: 'Tiếng Anh',
    question: 'Chọn từ thích hợp điền vào chỗ trống: "She ______ to school by bicycle every morning."',
    options: ['go', 'goes', 'going', 'gone'],
    correctIndex: 1,
    hint: 'Chủ ngữ ngôi thứ ba số ít (She) ở thì hiện tại đơn đi với động từ thêm -es (goes).',
    createdAt: Date.now() - 45000,
  },
  {
    id: 'anh-2',
    topic: 'Tiếng Anh',
    question: 'Từ nào sau đây là từ đồng nghĩa (synonym) của từ "BRAVE" (dũng cảm)?',
    options: ['Fearful', 'Courageous', 'Weak', 'Shy'],
    correctIndex: 1,
    hint: '"Courageous" mang nghĩa dũng cảm, can trường, đồng nghĩa với "Brave".',
    createdAt: Date.now() - 40000,
  },
  {
    id: 'anh-3',
    topic: 'Tiếng Anh',
    question: 'Dạng so sánh hơn (comparative) của tính từ "GOOD" là gì?',
    options: ['Gooder', 'More good', 'Better', 'Best'],
    correctIndex: 2,
    hint: '"Good" là tính từ bất quy tắc: good -> better -> the best.',
    createdAt: Date.now() - 35000,
  },
  {
    id: 'anh-4',
    topic: 'Tiếng Anh',
    question: 'Thành ngữ "Piece of cake" trong tiếng Anh có ý nghĩa tương đương với điều gì?',
    options: [
      'Một việc rất dễ dàng',
      'Một món ăn đắt tiền',
      'Một thử thách vô cùng khó',
      'Một lời khen ngợi ngọt ngào',
    ],
    correctIndex: 0,
    hint: '"A piece of cake" nghĩa là chuyện dễ như ăn bánh, rất đơn giản.',
    createdAt: Date.now() - 30000,
  },
  {
    id: 'anh-5',
    topic: 'Tiếng Anh',
    question: 'Chọn câu hỏi đuôi chính xác: "You are learning computer science, ______?"',
    options: ['are you', "aren't you", 'do you', "don't you"],
    correctIndex: 1,
    hint: 'Vế trước khẳng định dùng "are" thì câu hỏi đuôi phủ định là "aren\'t you".',
    createdAt: Date.now() - 25000,
  },
  {
    id: 'anh-6',
    topic: 'Tiếng Anh',
    question: 'Quá khứ phân từ (Past Participle - V3) của động từ bất quy tắc "WRITE" là gì?',
    options: ['Wrote', 'Written', 'Writing', 'Writed'],
    correctIndex: 1,
    hint: 'Write -> Wrote (quá khứ đơn) -> Written (quá khứ phân từ).',
    createdAt: Date.now() - 23000,
  },
  {
    id: 'anh-7',
    topic: 'Tiếng Anh',
    question: 'Chọn giới từ thích hợp: "I usually wake up ______ 6 o\'clock in the morning."',
    options: ['in', 'on', 'at', 'for'],
    correctIndex: 2,
    hint: 'Dùng giới từ "at" trước mốc giờ cụ thể (at 6 o\'clock).',
    createdAt: Date.now() - 21000,
  },
  {
    id: 'anh-8',
    topic: 'Tiếng Anh',
    question: 'Từ trái nghĩa (antonym) của từ "EXPENSIVE" (đắt đỏ) là gì?',
    options: ['Cheap', 'Costly', 'High', 'Valuable'],
    correctIndex: 0,
    hint: '"Cheap" nghĩa là rẻ tiền, trái nghĩa với "Expensive".',
    createdAt: Date.now() - 19000,
  },
  {
    id: 'anh-9',
    topic: 'Tiếng Anh',
    question: 'Chọn liên từ thích hợp: "He worked very hard, ______ he passed the exam with flying colors."',
    options: ['so', 'because', 'although', 'but'],
    correctIndex: 0,
    hint: '"so" dùng để chỉ kết quả: Anh ấy chăm chỉ, do đó anh ấy đã đỗ kỳ thi.',
    createdAt: Date.now() - 17000,
  },
  {
    id: 'anh-10',
    topic: 'Tiếng Anh',
    question: 'Thành ngữ "Once in a blue moon" dùng để miêu tả một sự việc như thế nào?',
    options: ['Xảy ra thường xuyên hàng ngày', 'Rất hiếm khi xảy ra', 'Xảy ra vào ban đêm', 'Sự việc nguy hiểm'],
    correctIndex: 1,
    hint: '"Once in a blue moon" ngụ ý việc cực kỳ hiếm khi mới xảy ra một lần.',
    createdAt: Date.now() - 15000,
  },
  {
    id: 'anh-11',
    topic: 'Tiếng Anh',
    question: 'Hoàn thành câu điều kiện loại 1: "If it rains tomorrow, we ______ the picnic."',
    options: ['cancel', 'will cancel', 'cancelled', 'would cancel'],
    correctIndex: 1,
    hint: 'Cấu trúc câu điều kiện loại 1: If + S + V(hiện tại đơn), S + will + V(nguyên mẫu).',
    createdAt: Date.now() - 13000,
  },
  {
    id: 'anh-12',
    topic: 'Tiếng Anh',
    question: 'Đại từ quan hệ nào dùng để thay thế cho danh từ chỉ vật làm chủ ngữ hoặc tân ngữ trong câu?',
    options: ['Who', 'Whom', 'Which', 'Whose'],
    correctIndex: 2,
    hint: '"Which" dùng cho đồ vật, sự vật; còn "Who" dùng cho người.',
    createdAt: Date.now() - 11000,
  },
  {
    id: 'anh-13',
    topic: 'Tiếng Anh',
    question: 'Từ nào sau đây là danh từ không đếm được (uncountable noun)?',
    options: ['Book', 'Apple', 'Water', 'Table'],
    correctIndex: 2,
    hint: '"Water" (nước) là chất lỏng, danh từ không đếm được.',
    createdAt: Date.now() - 9000,
  },
  {
    id: 'anh-14',
    topic: 'Tiếng Anh',
    question: 'Chọn dạng đúng: "English is ______ by millions of people all over the world."',
    options: ['speak', 'spoke', 'spoken', 'speaking'],
    correctIndex: 2,
    hint: 'Câu bị động hiện tại đơn: is/am/are + V3 (spoken).',
    createdAt: Date.now() - 7000,
  },
  {
    id: 'anh-15',
    topic: 'Tiếng Anh',
    question: 'Chọn câu đáp lại lịch sự khi người khác nói "Thank you very much!":',
    options: ["You're welcome!", 'No problem at all!', 'My pleasure!', 'Tất cả các câu trên đều đúng'],
    correctIndex: 3,
    hint: 'Cả "You\'re welcome", "No problem", "My pleasure" đều là những cách đáp lại lời cảm ơn phổ biến và lịch sự.',
    createdAt: Date.now() - 5000,
  },
  {
    id: 'anh-16',
    topic: 'Tiếng Anh',
    question: 'Tính từ sở hữu tương ứng của đại từ nhân xưng "THEY" là gì?',
    options: ['Them', 'Their', 'Theirs', 'They'],
    correctIndex: 1,
    hint: 'They (họ) có tính từ sở hữu là Their (của họ), theo sau là danh từ.',
    createdAt: Date.now() - 3000,
  },

  // =========================================================================
  // 4. LỊCH SỬ (16 câu hỏi phong phú)
  // =========================================================================
  {
    id: 'su-1',
    topic: 'Lịch sử',
    question: 'Chiến thắng lịch sử Điện Biên Phủ "Lừng lẫy năm châu, chấn động địa cầu" diễn ra vào năm nào?',
    options: ['1945', '1954', '1968', '1975'],
    correctIndex: 1,
    hint: 'Chiến dịch Điện Biên Phủ toàn thắng vào ngày 7 tháng 5 năm 1954.',
    createdAt: Date.now() - 20000,
  },
  {
    id: 'su-2',
    topic: 'Lịch sử',
    question: 'Vị anh hùng dân tộc nào đã ba lần đánh tan quân xâm lược Nguyên Mông ở thế kỷ 13?',
    options: ['Lý Thường Kiệt', 'Trần Hưng Đạo (Trần Quốc Tuấn)', 'Quang Trung (Nguyễn Huệ)', 'Lê Lợi'],
    correctIndex: 1,
    hint: 'Hưng Đạo Đại Vương Trần Quốc Tuấn là vị thống soái chỉ huy quân dân Đại Việt 3 lần đại thắng Nguyên Mông.',
    createdAt: Date.now() - 15000,
  },
  {
    id: 'su-3',
    topic: 'Lịch sử',
    question: 'Chủ tịch Hồ Chí Minh đọc bản "Tuyên ngôn Độc lập" tại Quảng trường Ba Đình lịch sử vào ngày tháng năm nào?',
    options: ['19/08/1945', '02/09/1945', '30/04/1975', '07/05/1954'],
    correctIndex: 1,
    hint: 'Ngày 2 tháng 9 năm 1945 là ngày khai sinh ra nước Việt Nam Dân chủ Cộng hòa (nay là Quốc khánh nước ta).',
    createdAt: Date.now() - 10000,
  },
  {
    id: 'su-4',
    topic: 'Lịch sử',
    question: 'Ngô Quyền đã dùng kế cắm cọc ngầm bịt sắt tiêu diệt quân Nam Hán trên dòng sông nào vào năm 938?',
    options: ['Sông Hồng', 'Sông Hương', 'Sông Bạch Đằng', 'Sông Cửu Long'],
    correctIndex: 2,
    hint: 'Trận thủy chiến lừng danh trên sông Bạch Đằng năm 938 đã chấm dứt hơn 1000 năm Bắc thuộc.',
    createdAt: Date.now() - 5000,
  },
  {
    id: 'su-5',
    topic: 'Lịch sử',
    question: 'Ai là người lãnh đạo cuộc khởi nghĩa Lam Sơn chống quân xâm lược nhà Minh giành lại độc lập cho dân tộc?',
    options: ['Lê Lợi', 'Đinh Bộ Lĩnh', 'Nguyễn Trãi', 'Lý Bí'],
    correctIndex: 0,
    hint: 'Bình Định Vương Lê Lợi dựng cờ khởi nghĩa Lam Sơn (1418 - 1427) và sáng lập nhà Hậu Lê.',
    createdAt: Date.now() - 4800,
  },
  {
    id: 'su-6',
    topic: 'Lịch sử',
    question: 'Vua Lý Thái Tổ quyết định dời đô từ Hoa Lư về thành Đại La (đổi tên là Thăng Long) vào năm nào?',
    options: ['Năm 938', 'Năm 1010', 'Năm 1288', 'Năm 1428'],
    correctIndex: 1,
    hint: 'Mùa thu năm Canh Tuất 1010, vua Lý Thái Tổ ban Chiếu dời đô về Thăng Long (Hà Nội ngày nay).',
    createdAt: Date.now() - 4600,
  },
  {
    id: 'su-7',
    topic: 'Lịch sử',
    question: 'Vị vua nào của triều Tây Sơn đã thần tốc hành quân ra Bắc đánh tan 29 vạn quân Thanh vào dịp Tết Kỷ Dậu 1789?',
    options: ['Quang Trung (Nguyễn Huệ)', 'Nguyễn Nhạc', 'Nguyễn Lữ', 'Gia Long (Nguyễn Ánh)'],
    correctIndex: 0,
    hint: 'Hoàng đế Quang Trung - Nguyễn Huệ chỉ huy trận Ngọc Hồi - Đống Đa đại phá 29 vạn quân Thanh.',
    createdAt: Date.now() - 4400,
  },
  {
    id: 'su-8',
    topic: 'Lịch sử',
    question: 'Chiến dịch Hồ Chí Minh lịch sử giải phóng hoàn toàn miền Nam, thống nhất đất nước toàn thắng vào ngày nào?',
    options: ['30 tháng 4 năm 1975', '2 tháng 9 năm 1945', '7 tháng 5 năm 1954', '19 tháng 12 năm 1946'],
    correctIndex: 0,
    hint: 'Trưa ngày 30/4/1975, xe tăng giải phóng tiến vào Dinh Độc Lập, non sông Việt Nam liền một dải.',
    createdAt: Date.now() - 4200,
  },
  {
    id: 'su-9',
    topic: 'Lịch sử',
    question: 'Người anh hùng thiếu niên bóp nát quả cam vì hờn căm giặc ngoại xâm trong hội nghị Bình Than là ai?',
    options: ['Trần Quốc Toản', 'Kim Đồng', 'Võ Thị Sáu', 'Lê Văn Tám'],
    correctIndex: 0,
    hint: 'Trần Quốc Toản tuổi trẻ chí lớn, thêu lá cờ 6 chữ vàng "Phá cường địch, báo hoàng ân".',
    createdAt: Date.now() - 4000,
  },
  {
    id: 'su-10',
    topic: 'Lịch sử',
    question: 'Hai vị nữ anh hùng đầu tiên dựng cờ khởi nghĩa chống ách đô hộ của nhà Đông Hán vào mùa xuân năm 40 là ai?',
    options: ['Hai Bà Trưng (Trưng Trắc, Trưng Nhị)', 'Bà Triệu (Triệu Thị Trinh)', 'Nguyễn Thị Minh Khai', 'Bùi Thị Xuân'],
    correctIndex: 0,
    hint: 'Hai Bà Trưng phất cờ khởi nghĩa tại cửa sông Hát (Mê Linh), đánh đuổi thái thú Tô Định.',
    createdAt: Date.now() - 3800,
  },
  {
    id: 'su-11',
    topic: 'Lịch sử',
    question: 'Bản tuyên ngôn độc lập đầu tiên trong lịch sử dân tộc khẳng định chủ quyền "Nam quốc sơn hà" gắn liền với vị tướng nào?',
    options: ['Lý Thường Kiệt', 'Trần Khánh Dư', 'Phạm Ngũ Lão', 'Yết Kiêu'],
    correctIndex: 0,
    hint: 'Lý Thường Kiệt ngâm bài thơ thần bên bờ phòng tuyến sông Như Nguyệt năm 1077 chống quân Tống.',
    createdAt: Date.now() - 3600,
  },
  {
    id: 'su-12',
    topic: 'Lịch sử',
    question: 'Đinh Bộ Lĩnh đã có công dẹp loạn các thế lực phân tranh lập nên nhà nước Đại Cồ Việt. Đó là loạn gì?',
    options: ['Loạn 12 sứ quân', 'Loạn Kiều Công Tiễn', 'Loạn An Lộc Sơn', 'Loạn Tam Phiên'],
    correctIndex: 0,
    hint: 'Đinh Tiên Hoàng (Đinh Bộ Lĩnh) dẹp yên loạn 12 sứ quân và lên ngôi hoàng đế năm 968.',
    createdAt: Date.now() - 3400,
  },
  {
    id: 'su-13',
    topic: 'Lịch sử',
    question: 'Bác Hồ ra đi tìm đường cứu nước từ bến cảng Nhà Rồng (Sài Gòn) vào ngày tháng năm nào?',
    options: ['05/06/1911', '19/05/1890', '03/02/1930', '28/01/1941'],
    correctIndex: 0,
    hint: 'Ngày 5/6/1911, người thanh niên yêu nước Nguyễn Tất Thành bước lên tàu Amiral Latouche-Tréville ra đi tìm đường cứu nước.',
    createdAt: Date.now() - 3200,
  },
  {
    id: 'su-14',
    topic: 'Lịch sử',
    question: 'Phong trào Đông Du đưa thanh niên Việt Nam sang Nhật Bản học tập đầu thế kỷ 20 do chí sĩ yêu nước nào khởi xướng?',
    options: ['Phan Bội Châu', 'Phan Châu Trinh', 'Hoàng Hoa Thám', 'Huỳnh Thúc Kháng'],
    correctIndex: 0,
    hint: 'Cụ Phan Bội Châu là người sáng lập Hội Duy Tân và phong trào Đông Du.',
    createdAt: Date.now() - 3000,
  },
  {
    id: 'su-15',
    topic: 'Lịch sử',
    question: 'Thành Cổ Loa với kiến trúc hình xoáy trôn ốc độc đáo là kinh đô của nhà nước nào thời cổ đại?',
    options: ['Âu Lạc (thời An Dương Vương)', 'Văn Lang (thời các Vua Hùng)', 'Vạn Xuân (thời Lý Nam Đế)', 'Đại Việt'],
    correctIndex: 0,
    hint: 'Thành Cổ Loa do Thục Phán An Dương Vương xây dựng làm kinh đô nước Âu Lạc.',
    createdAt: Date.now() - 2800,
  },
  {
    id: 'su-16',
    topic: 'Lịch sử',
    question: 'Trận "Điện Biên Phủ trên không" oanh liệt 12 ngày đêm đánh bại máy bay B-52 của đế quốc Mỹ diễn ra vào năm nào?',
    options: ['1972', '1968', '1975', '1973'],
    correctIndex: 0,
    hint: 'Cuối tháng 12/1972, quân dân Hà Nội và miền Bắc đã lập nên kỳ tích đập tan chiến dịch Linebacker II của Mỹ.',
    createdAt: Date.now() - 2600,
  },

  // =========================================================================
  // 5. KHOA HỌC (16 câu hỏi phong phú)
  // =========================================================================
  {
    id: 'kh-1',
    topic: 'Khoa học',
    question: 'Hành tinh nào trong Hệ Mặt Trời được mệnh danh là "Hành tinh Đỏ" vì bề mặt giàu oxit sắt?',
    options: ['Sao Kim (Venus)', 'Sao Thủy (Mercury)', 'Sao Hỏa (Mars)', 'Sao Mộc (Jupiter)'],
    correctIndex: 2,
    hint: 'Sao Hỏa (Mars) chứa nhiều oxit sắt (gỉ sét) trên bề mặt nên phát ra ánh sáng đỏ đặc trưng.',
    createdAt: Date.now() - 4000,
  },
  {
    id: 'kh-2',
    topic: 'Khoa học',
    question: 'Chất khí nào chiếm thể tích lớn nhất (khoảng 78%) trong bầu khí quyển của Trái Đất?',
    options: ['Oxy (O2)', 'Nitơ (N2)', 'Cacbon đioxit (CO2)', 'Khí Heli (He)'],
    correctIndex: 1,
    hint: 'Khí Nitơ chiếm tới gần 78% bầu khí quyển, trong khi Oxy chiếm khoảng 21%.',
    createdAt: Date.now() - 3000,
  },
  {
    id: 'kh-3',
    topic: 'Khoa học',
    question: 'Nước đá bắt đầu nóng chảy chuyển thành thể lỏng ở nhiệt độ nào dưới áp suất khí quyển tiêu chuẩn?',
    options: ['-10 °C', '0 °C', '50 °C', '100 °C'],
    correctIndex: 1,
    hint: 'Nhiệt độ nóng chảy của nước đá (và nhiệt độ đông đặc của nước tinh khiết) là 0°C.',
    createdAt: Date.now() - 2000,
  },
  {
    id: 'kh-4',
    topic: 'Khoa học',
    question: 'Cơ quan nào trong cơ thể con người chịu trách nhiệm lọc máu và tạo ra nước tiểu?',
    options: ['Dạ dày', 'Thận', 'Gan', 'Phổi'],
    correctIndex: 1,
    hint: 'Hai quả thận hoạt động như bộ lọc sinh học, loại bỏ chất cặn bã khỏi máu qua nước tiểu.',
    createdAt: Date.now() - 1800,
  },
  {
    id: 'kh-5',
    topic: 'Khoa học',
    question: 'Hành tinh nào có kích thước và khối lượng lớn nhất trong toàn bộ Hệ Mặt Trời?',
    options: ['Sao Thổ (Saturn)', 'Sao Mộc (Jupiter)', 'Sao Hải Vương (Neptune)', 'Trái Đất (Earth)'],
    correctIndex: 1,
    hint: 'Sao Mộc (Jupiter) là hành tinh khí khổng lồ lớn nhất, có thể chứa hơn 1300 Trái Đất bên trong.',
    createdAt: Date.now() - 1600,
  },
  {
    id: 'kh-6',
    topic: 'Khoa học',
    question: 'Hiện tượng gì xảy ra khi Mặt Trăng đi vào vùng bóng tối của Trái Đất chắn ánh sáng Mặt Trời?',
    options: ['Nhật thực', 'Nguyệt thực', 'Thủy triều đỏ', 'Cực quang'],
    correctIndex: 1,
    hint: 'Nguyệt thực diễn ra khi Trái Đất nằm giữa Mặt Trời và Mặt Trăng, che khuất ánh sáng tới Mặt Trăng.',
    createdAt: Date.now() - 1400,
  },
  {
    id: 'kh-7',
    topic: 'Khoa học',
    question: 'Vận tốc ánh sáng truyền trong môi trường chân không xấp xỉ bằng bao nhiêu km/s?',
    options: ['3.000 km/s', '30.000 km/s', '300.000 km/s', '3.000.000 km/s'],
    correctIndex: 2,
    hint: 'Tốc độ ánh sáng trong chân không là c ≈ 300.000 km/giây (khoảng 3 × 10⁸ m/s).',
    createdAt: Date.now() - 1200,
  },
  {
    id: 'kh-8',
    topic: 'Khoa học',
    question: 'Quá trình cây xanh sử dụng ánh sáng mặt trời để tổng hợp chất hữu cơ và giải phóng khí Oxy gọi là gì?',
    options: ['Hô hấp tế bào', 'Quang hợp', 'Thoát hơi nước', 'Lên men'],
    correctIndex: 1,
    hint: 'Quang hợp (Photosynthesis) nhờ chất diệp lục giúp thực vật hấp thụ CO2 và thải ra O2.',
    createdAt: Date.now() - 1000,
  },
  {
    id: 'kh-9',
    topic: 'Khoa học',
    question: 'Kim loại nào sau đây ở thể lỏng tại điều kiện nhiệt độ phòng thông thường?',
    options: ['Sắt (Fe)', 'Nhôm (Al)', 'Thủy ngân (Hg)', 'Vàng (Au)'],
    correctIndex: 2,
    hint: 'Thủy ngân (Mercury - Hg) là kim loại duy nhất ở dạng lỏng trong điều kiện nhiệt độ phòng.',
    createdAt: Date.now() - 800,
  },
  {
    id: 'kh-10',
    topic: 'Khoa học',
    question: 'Năng lượng nào sau đây là nguồn năng lượng tái tạo, thân thiện với môi trường?',
    options: ['Than đá', 'Dầu mỏ', 'Năng lượng mặt trời và gió', 'Khí đốt tự nhiên'],
    correctIndex: 2,
    hint: 'Năng lượng mặt trời và gió là nguồn năng lượng vô tận, không phát thải khí nhà kính.',
    createdAt: Date.now() - 600,
  },
  {
    id: 'kh-11',
    topic: 'Khoa học',
    question: 'Lực nào giữ cho các hành tinh quay xung quanh Mặt Trời trên quỹ đạo ổn định?',
    options: ['Lực ma sát', 'Lực hấp dẫn', 'Lực từ tính', 'Lực cản không khí'],
    correctIndex: 1,
    hint: 'Lực vạn vật hấp dẫn của Mặt Trời giữ cho các thiên thể chuyển động xung quanh nó.',
    createdAt: Date.now() - 500,
  },
  {
    id: 'kh-12',
    topic: 'Khoa học',
    question: 'Chất nào sau đây cấu tạo nên hơn 70% khối lượng cơ thể người trưởng thành?',
    options: ['Protein', 'Chất béo', 'Nước (H2O)', 'Canxi'],
    correctIndex: 2,
    hint: 'Nước chiếm khoảng 60-75% khối lượng cơ thể và đóng vai trò thiết yếu cho mọi quá trình trao đổi chất.',
    createdAt: Date.now() - 400,
  },
  {
    id: 'kh-13',
    topic: 'Khoa học',
    question: 'Đơn vị đo cường độ dòng điện trong hệ thống đo lường quốc tế (SI) là gì?',
    options: ['Vôn (V)', 'Ampe (A)', 'Ohm (Ω)', 'Watt (W)'],
    correctIndex: 1,
    hint: 'Ampe (ký hiệu A) là đơn vị đo cường độ dòng điện.',
    createdAt: Date.now() - 300,
  },
  {
    id: 'kh-14',
    topic: 'Khoa học',
    question: 'Hiện tượng khúc xạ ánh sáng là nguyên nhân tạo ra cảnh tượng thiên nhiên kỳ thú nào sau cơn mưa?',
    options: ['Cầu vồng bảy sắc', 'Sấm sét', 'Gió lốc xoáy', 'Mưa đá'],
    correctIndex: 0,
    hint: 'Cầu vồng hình thành do ánh sáng mặt trời bị khúc xạ và phản xạ qua các giọt nước mưa lơ lửng.',
    createdAt: Date.now() - 200,
  },
  {
    id: 'kh-15',
    topic: 'Khoa học',
    question: 'Tầng nào của bầu khí quyển có vai trò hấp thụ phần lớn tia tử ngoại (UV) có hại từ Mặt Trời?',
    options: ['Tầng đối lưu', 'Tầng Ozon (thuộc bình lưu)', 'Tầng trung lưu', 'Tầng nhiệt'],
    correctIndex: 1,
    hint: 'Tầng Ozon (O3) đóng vai trò như chiếc khiên bảo vệ sự sống trên Trái Đất khỏi bức xạ cực tím UV.',
    createdAt: Date.now() - 100,
  },
  {
    id: 'kh-16',
    topic: 'Khoa học',
    question: 'Động vật nào sau đây là loài động vật có vú (mammal) lớn nhất từng sống trên Trái Đất?',
    options: ['Voi châu Phi', 'Cá mập trắng', 'Cá voi xanh', 'Khủng long bạo chúa T-Rex'],
    correctIndex: 2,
    hint: 'Cá voi xanh (Blue whale) có thể dài tới 30m và nặng gần 200 tấn, là loài động vật có vú lớn nhất.',
    createdAt: Date.now() - 50,
  },
];

export const questionStorage = {
  getQuestions(): Question[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.saveAll(INITIAL_QUESTIONS);
        return INITIAL_QUESTIONS;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 10) {
        return parsed;
      }
      this.saveAll(INITIAL_QUESTIONS);
      return INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  },

  saveAll(questions: Question[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    } catch (e) {
      console.error('Failed to save questions to localStorage', e);
    }
  },

  addQuestion(q: Omit<Question, 'id' | 'createdAt'>): Question {
    const questions = this.getQuestions();
    const newQuestion: Question = {
      ...q,
      id: 'q-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: Date.now(),
    };
    questions.unshift(newQuestion);
    this.saveAll(questions);
    return newQuestion;
  },

  updateQuestion(id: string, updated: Partial<Omit<Question, 'id' | 'createdAt'>>): boolean {
    const questions = this.getQuestions();
    const index = questions.findIndex((q) => q.id === id);
    if (index === -1) return false;
    questions[index] = {
      ...questions[index],
      ...updated,
    };
    this.saveAll(questions);
    return true;
  },

  deleteQuestion(id: string): boolean {
    const questions = this.getQuestions();
    const filtered = questions.filter((q) => q.id !== id);
    if (filtered.length === questions.length) return false;
    this.saveAll(filtered);
    return true;
  },

  resetToDefault(): Question[] {
    this.saveAll(INITIAL_QUESTIONS);
    return INITIAL_QUESTIONS;
  },

  getTopics(): string[] {
    const questions = this.getQuestions();
    const topicSet = new Set<string>(DEFAULT_TOPICS);
    questions.forEach((q) => {
      if (q.topic && q.topic.trim()) {
        topicSet.add(q.topic.trim());
      }
    });
    return Array.from(topicSet);
  },

  getQuestionsByTopic(topic: string): Question[] {
    const questions = this.getQuestions();
    if (!topic || topic === 'Tất cả') return questions;
    return questions.filter((q) => q.topic.toLowerCase() === topic.toLowerCase());
  },

  exportJSON(): string {
    const questions = this.getQuestions();
    return JSON.stringify(questions, null, 2);
  },

  importJSON(jsonString: string): { success: boolean; count: number; error?: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!Array.isArray(data)) {
        return { success: false, count: 0, error: 'Dữ liệu không phải là danh sách câu hỏi hợp lệ.' };
      }
      const validQuestions: Question[] = [];
      for (const item of data) {
        if (
          item.question &&
          Array.isArray(item.options) &&
          item.options.length === 4 &&
          typeof item.correctIndex === 'number' &&
          item.topic
        ) {
          validQuestions.push({
            id: item.id || 'q-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
            topic: String(item.topic).trim(),
            question: String(item.question).trim(),
            options: [
              String(item.options[0]),
              String(item.options[1]),
              String(item.options[2]),
              String(item.options[3]),
            ],
            correctIndex: Math.max(0, Math.min(3, item.correctIndex)),
            hint: item.hint ? String(item.hint).trim() : 'Hãy đọc kỹ câu hỏi và các đáp án gợi ý.',
            createdAt: item.createdAt || Date.now(),
          });
        }
      }

      if (validQuestions.length === 0) {
        return { success: false, count: 0, error: 'Không tìm thấy câu hỏi hợp lệ trong tệp JSON.' };
      }

      this.saveAll(validQuestions);
      return { success: true, count: validQuestions.length };
    } catch {
      return { success: false, count: 0, error: 'Tệp định dạng JSON không hợp lệ.' };
    }
  },
};
