// ==============================================================================
// 1. Interactive Node Canvas Background
// ==============================================================================
const canvas = document.getElementById('node-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const nodes = [];
const maxNodes = 65;
const connectionDist = 120;
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

class Node {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.radius = Math.random() * 2 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off walls
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    // Mouse attraction
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x += (dx / dist) * force * 0.6;
        this.y += (dy / dist) * force * 0.6;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 94, 20, 0.4)';
    ctx.fill();
  }
}

// Initialize nodes
for (let i = 0; i < maxNodes; i++) {
  nodes.push(new Node());
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, width, height);

  // Draw lines
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].update();
    nodes[i].draw();

    for (let j = i + 1; j < nodes.length; j++) {
      const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (dist < connectionDist) {
        const alpha = (1 - dist / connectionDist) * 0.12;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(255, 94, 20, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}
animate();


// ==============================================================================
// 2. Mock Terminal Emulator Controller
// ==============================================================================
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');

function printLine(text, type = 'system') {
  const line = document.createElement('div');
  let colorClass = 'text-slate-300';
  
  if (type === 'input') colorClass = 'text-[#ff5e14] font-bold';
  else if (type === 'error') colorClass = 'text-red-400';
  else if (type === 'success') colorClass = 'text-emerald-400 font-semibold';
  else if (type === 'highlight') colorClass = 'text-amber-400';

  line.className = `${colorClass} leading-relaxed`;
  line.innerHTML = text;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Typing delay helper for automation logs
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main Command Processor
async function processCommand(cmdText) {
  const cmd = cmdText.trim().toLowerCase();
  printLine(`steve@cutnos:~$ ${cmdText}`, 'input');

  if (cmd === '') return;

  switch (cmd) {
    case 'help':
      printLine('Danh sách câu lệnh có sẵn:', 'highlight');
      printLine(' &bull; <strong class="text-orange-400">about</strong> - Giới thiệu về lập trình viên Steve & CUTNOS.');
      printLine(' &bull; <strong class="text-orange-400">start</strong> - Mô phỏng chạy tiến trình tự động đăng bài Tiktok (CusNotAutoPostTiktok).');
      printLine(' &bull; <strong class="text-orange-400">status</strong> - Hiển thị trạng thái các mô-đun và tài nguyên hệ thống.');
      printLine(' &bull; <strong class="text-orange-400">donate</strong> - Hiển thị thông tin quyên góp ủng hộ dự án.');
      printLine(' &bull; <strong class="text-orange-400">clear</strong> - Xóa sạch màn hình console.');
      break;

    case 'about':
      printLine('--- THƯƠNG HIỆU CUTNOS & STEVE ---', 'highlight');
      printLine('Steve là nhà phát triển chuyên viết các công cụ tự động hóa thao tác (RPA), Chrome Extensions và giải pháp vận hành tài khoản an toàn.');
      printLine('Triết lý cốt lõi: Tối giản - Bảo mật - Chống spam tuyệt đối.');
      break;

    case 'status':
      printLine('--- TRẠNG THÁI HỆ THỐNG ---', 'highlight');
      printLine('🔧 Khung lõi (Core Engine): <span class="text-emerald-400 font-bold">READY</span>');
      printLine('🔒 Khối Anti-Detection: <span class="text-emerald-400 font-bold">SECURE</span>');
      printLine('📱 Tiện ích CusNotAutoPostTiktok: <span class="text-amber-400 font-bold">PENDING RELEASE</span>');
      printLine('⚡ Memory usage: Virtualized');
      break;

    case 'clear':
      terminalOutput.innerHTML = '';
      break;

    case 'donate':
      printLine('Đang khởi động bảng Quyên góp...', 'highlight');
      openDonateModal();
      break;

    case 'start':
      terminalInput.disabled = true;
      printLine('⚡ BẮT ĐẦU CHẠY GIẢ LẬP AUTOMATION...', 'highlight');
      await delay(700);
      printLine('[Sys] Đang nạp các Chrome Profiles cô lập...');
      await delay(800);
      printLine('[Sys] Đã nạp profile: <span class="text-orange-400">@kenh_vlog_01</span>');
      await delay(600);
      printLine('[Agent] Khởi động trình duyệt. Anti-detection fingerprint: <span class="text-emerald-400">Secure</span>');
      await delay(1000);
      printLine('[Agent] Điều hướng tới trang upload TikTok...');
      await delay(800);
      printLine('[Agent] Phát hiện tệp: video_kenh_vlog_01.mp4. Bắt đầu kéo thả (DataTransfer simulation)...');
      await delay(1200);
      printLine('[Agent] Tải video thành công! Đang tự động viết mô tả...');
      await delay(1000);
      printLine('[Agent] Gõ mô tả: "Tương tác tự động cùng TikTok Assistant! #trending" (Char delay 80ms)...');
      await delay(1400);
      printLine('[Agent] Thực hiện delay ngẫu nhiên: 8.4s để mô phỏng người thật...');
      await delay(1800);
      printLine('[Agent] Tìm kiếm nút Đăng bài (Publish). Kích hoạt chuột click (x: 421, y: 819)...');
      await delay(1000);
      printLine('[Success] Đăng video tài khoản @kenh_vlog_01 THÀNH CÔNG!', 'success');
      terminalInput.disabled = false;
      terminalInput.focus();
      break;

    default:
      printLine(`Lệnh không hợp lệ: '${cmd}'. Gõ '<span class="text-orange-400">help</span>' để xem danh sách lệnh.`, 'error');
  }
}

terminalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const cmdVal = terminalInput.value;
    terminalInput.value = '';
    processCommand(cmdVal);
  }
});


// ==============================================================================
// 3. Donate Modal and Toggle Tabs Controller
// ==============================================================================
const modal = document.getElementById('donate-modal');

function openDonateModal() {
  modal.classList.remove('hidden');
}

function closeDonateModal() {
  modal.classList.add('hidden');
}

// Close modal when clicking outside content area
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeDonateModal();
  }
});

// Tab Switcher for Donate Modal
function switchDonateTab(tab) {
  const btnBank = document.getElementById('tab-bank');
  const btnMomo = document.getElementById('tab-momo');
  const paneBank = document.getElementById('pane-bank');
  const paneMomo = document.getElementById('pane-momo');

  if (tab === 'bank') {
    // Buttons
    btnBank.className = "flex-1 py-2 text-xs font-bold rounded-lg text-white bg-orange-600 transition duration-200";
    btnMomo.className = "flex-1 py-2 text-xs font-bold rounded-lg text-slate-400 hover:text-slate-200 transition duration-200";
    
    // Panes
    paneBank.classList.remove('hidden');
    paneMomo.classList.add('hidden');
  } else {
    // Buttons
    btnMomo.className = "flex-1 py-2 text-xs font-bold rounded-lg text-white bg-orange-600 transition duration-200";
    btnBank.className = "flex-1 py-2 text-xs font-bold rounded-lg text-slate-400 hover:text-slate-200 transition duration-200";
    
    // Panes
    paneMomo.classList.remove('hidden');
    paneBank.classList.add('hidden');
  }
}
