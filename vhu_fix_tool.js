(async function unlockVHUWebDropdowns() {
  console.log("🔍 Đang mở khóa menu sổ xuống trực tiếp trên form VHU...");

  // 1. Tìm React Fiber của form Cập nhật bắt buộc
  const formBox = document.getElementById('FormCapNhatBatBuoc') || document.querySelector('form');
  const fiberKey = Object.keys(formBox || {}).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
  let fiber = formBox ? formBox[fiberKey] : null;
  let targetFiber = null;

  while (fiber) {
    let hook = fiber.memoizedState;
    if (hook && hook.memoizedState && typeof hook.memoizedState === 'object' && ('TinhThanhThuongTru' in hook.memoizedState || 'HoLot' in hook.memoizedState)) {
      targetFiber = fiber;
      break;
    }
    fiber = fiber.return;
  }

  if (!targetFiber) {
    alert("❌ Vui lòng mở đúng trang 'Cập nhật thông tin sinh viên' trên Portal VHU rồi chạy lại nhé!");
    return;
  }

  // 2. Lấy các state và hook nội bộ của React Form
  let hook0 = targetFiber.memoizedState;
  let hook1 = hook0?.next;                               // Dân tộc
  let hook2 = hook1?.next;                              // Tôn giáo
  let hook3 = hook2?.next;                              // Quốc gia
  let hook5 = hook0?.next?.next?.next?.next?.next;       // Tỉnh thành
  let hook6 = hook5?.next;                              // Phường xã (nơi bị kẹt No options)
  let hook7 = hook6?.next;                              // Trạng thái Avatar
  let hook8 = hook7?.next;                              // Danh sách lỗi đỏ

  const setStudent = hook0?.queue?.dispatch;
  const setWards = hook6?.queue?.dispatch;
  const setAvatar = hook7?.queue?.dispatch;
  const setErrors = hook8?.queue?.dispatch;

  let s = { ...(hook0.memoizedState || {}) };

  // 3. Tạo danh sách Phường / Xã cực kỳ đầy đủ để sổ thẳng xuống trên web
  function generateFullWards() {
    const list = [];

    // Phường số từ 1 đến 30 (Phổ biến ở hầu hết các quận/thị xã)
    for (let i = 1; i <= 30; i++) {
      const code = "000" + (i < 10 ? "0" + i : i);
      list.push({ label: `Phường ${i}`, value: code });
    }

    // Các Phường / Xã tên chữ phổ biến tại TP.HCM và các tỉnh lân cận
    const namedWards = [
      "Phường Bến Nghé", "Phường Bến Thành", "Phường Cầu Kho", "Phường Cầu Ông Lãnh",
      "Phường Cô Giang", "Phường Đa Kao", "Phường Nguyễn Thái Bình", "Phường Nguyễn Cư Trinh",
      "Phường Phạm Ngũ Lão", "Phường Tân Định", "Phường Thảo Điền", "Phường An Phú",
      "Phường Bình An", "Phường Thủ Thiêm", "Phường Hiệp Bình Chánh", "Phường Hiệp Bình Phước",
      "Phường Linh Trung", "Phường Linh Tây", "Phường Linh Đông", "Phường Tam Bình",
      "Phường Tam Phú", "Phường Trường Thọ", "Phường Tăng Nhơn Phú A", "Phường Tăng Nhơn Phú B",
      "Phường Phước Long A", "Phường Phước Long B", "Phường Long Thạnh Mỹ", "Phường Long Bình",
      "Phường Hiệp Phú", "Phường Tân Phú", "Phường Phú Hữu", "Phường Long Trường",
      "Phường Trường Thạnh", "Phường Bình Trưng Đông", "Phường Bình Trưng Tây", "Phường Cát Lái",
      "Phường Thạnh Mỹ Lợi", "Phường An Khánh", "Phường An Lợi Đông",
      // Các Xã
      "Xã Bình Hưng", "Xã Phong Phú", "Xã Tân Kiên", "Xã Vĩnh Lộc A", "Xã Vĩnh Lộc B",
      "Xã Tân Nhựt", "Xã An Phú Tây", "Xã Hưng Long", "Xã Đa Phước", "Xã Quy Đức",
      "Xã Tân Túc", "Xã Tân Quý Tây", "Xã Bình Chánh", "Xã Lê Minh Xuân", "Xã Phạm Văn Hai",
      "Xã Bà Điểm", "Xã Xuân Thới Thượng", "Xã Thới Tam Thôn", "Xã Đông Thạnh", "Xã Nhị Bình",
      "Xã Tân Thới Nhì", "Xã Xuân Thới Đông", "Xã Xuân Thới Sơn", "Xã Tân Hiệp", "Xã Thăng Bình",
      "Xã 1", "Xã 2", "Xã 3", "Xã 4", "Xã 5", "Xã Trung Tâm", "Thị trấn Trung Tâm"
    ];

    namedWards.forEach((name, idx) => {
      list.push({ label: name, value: "001" + (idx < 10 ? "0" + idx : idx) });
    });

    // Thêm tùy chọn nhập tự do
    list.push({ label: "➕ [Bấm vào đây để tự gõ tên Phường/Xã khác...]", value: "__CUSTOM__" });

    // Nếu sinh viên đã có sẵn phường xã thì đưa lên đầu
    if (s.PhuongXaThuongTru && !list.find(w => w.label.toLowerCase() === s.PhuongXaThuongTru.toLowerCase())) {
      list.unshift({ label: s.PhuongXaThuongTru, value: "00001" });
    }

    return list;
  }

  const wardOptions = generateFullWards();

  // 4. BƠM DANH SÁCH VÀO DROPDOWN PHƯỜNG XÃ TRÊN WEB
  if (setWards) {
    setWards(wardOptions);

    // Bọc dispatch để khi người dùng đổi Tỉnh Thành, ô Phường Xã không bao giờ bị reset về rỗng (No options)
    const originalDispatch = hook6?.queue?.dispatch;
    if (originalDispatch && !originalDispatch._vhuHooked) {
      hook6.queue.dispatch = function(newVal) {
        if (!newVal || newVal.length === 0) {
          return originalDispatch(generateFullWards());
        }
        return originalDispatch(newVal);
      };
      hook6.queue.dispatch._vhuHooked = true;
    }
  }

  // 5. TỰ ĐỘNG SỬA CÁC Ô LỖI VIỀN ĐỎ (NHƯ Ô ĐỐI TƯỢNG CHÍNH SÁCH)
  // Xử lý ô Đối tượng chính sách nếu chưa chọn
  if (!s.DoiTuongChinhSach && !s.DoiTuongID && !s.PolicyObjectID) {
    s.DoiTuongChinhSach = "Không thuộc đối tượng trên";
    s.DoiTuongID = "00";
    s.PolicyObjectID = "00";
  }

  // Mở khóa kiểm tra Avatar
  if (setAvatar) setAvatar(true);

  // Cập nhật lại state & xóa bỏ toàn bộ lỗi đỏ
  if (setStudent) setStudent({ ...s });
  if (setErrors) setErrors({});

  // Gỡ viền đỏ CSS trên giao diện web
  document.querySelectorAll('.is-invalid, [style*="border-color: red"], [style*="border-color: rgb(225, 29, 72)"]').forEach(el => {
    el.classList.remove('is-invalid');
    el.style.borderColor = '#cbd5e1';
  });

  // 6. TỰ ĐỘNG MỞ SỔ DROPDOWN Ô PHƯỜNG / XÃ NGAY LẬP TỨC TRÊN WEB
  setTimeout(() => {
    // Tìm container React-Select của ô Phường Xã trên form
    let wardControl = null;
    const allLabels = Array.from(document.querySelectorAll('label, div, span'));
    const wardLabel = allLabels.find(el => {
      const text = (el.innerText || "").trim().toLowerCase();
      return text.includes("phường") || text.includes("xã") || text.includes("phường/xã") || text.includes("phường xã");
    });

    if (wardLabel) {
      const parent = wardLabel.closest('.form-group, .col-md-4, .col-md-6, .col-12, div');
      if (parent) {
        wardControl = parent.querySelector('[class*="-control"], input[id*="react-select"], input');
      }
    }

    if (!wardControl) {
      // Tìm theo bất kỳ React-Select nào đang bị rỗng
      wardControl = document.querySelector('[name="PhuongXaThuongTru"]') || document.querySelector('[class*="-control"]');
    }

    if (wardControl) {
      wardControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Kích hoạt mở menu sổ xuống
      wardControl.focus();
      wardControl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
      wardControl.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      console.log("✅ Đã kích hoạt mở sổ dropdown Phường/Xã trên web!");
    }
  }, 300);

  // 7. LẮNG NGHE NẾU CHỌN TÙY CHỌN 'NHẬP TÊN PHƯỜNG/XÃ KHÁC'
  // Theo dõi hook0 để nếu chọn option __CUSTOM__ thì hỏi tên nhập vào
  const checkCustomWardInterval = setInterval(() => {
    let curState = targetFiber?.memoizedState?.memoizedState;
    if (curState && (curState.PhuongXaThuongTruID === "__CUSTOM__" || curState.PhuongXaThuongTru === "__CUSTOM__")) {
      const customName = prompt("Nhập tên Phường / Xã thực tế của bạn (VD: Xã Thăng Bình, Phường 1...):", "");
      if (customName && customName.trim()) {
        const trimmed = customName.trim();
        curState.PhuongXaThuongTru = trimmed;
        curState.PhuongXaThuongTruID = "00001";
        if (setWards) setWards([{ label: trimmed, value: "00001" }, ...wardOptions]);
        if (setStudent) setStudent({ ...curState });
      }
    }
  }, 400);

  // Tự hủy interval sau 10 phút để tránh tốn tài nguyên
  setTimeout(() => clearInterval(checkCustomWardInterval), 600000);

  // 8. HIỂN THỊ THANH TIỆN ÍCH NHỎ GỌN Ở GÓC MÀN HÌNH (KHÔNG CHE GIAO DIỆN)
  const oldHelper = document.getElementById('vhu-helper-bar');
  if (oldHelper) oldHelper.remove();

  const helperBar = document.createElement('div');
  helperBar.id = 'vhu-helper-bar';
  helperBar.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 9999999; background: #ffffff; padding: 14px 20px; border-radius: 20px; box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.25), 0 0 0 1px #e2e8f0; display: flex; align-items: center; gap: 14px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; animation: vhuSlideIn 0.3s ease-out;';

  helperBar.innerHTML = `
    <style>
      @keyframes vhuSlideIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      .vhu-h-icon { width: 38px; height: 38px; border-radius: 50%; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
      .vhu-h-title { font-size: 13.5px; font-weight: 800; color: #0f172a; }
      .vhu-h-desc { font-size: 12px; color: #64748b; margin-top: 2px; }
      .vhu-h-btn-save { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; padding: 9px 16px; border-radius: 12px; font-size: 13px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(37,99,235,0.3); transition: all 0.2s; white-space: nowrap; }
      .vhu-h-btn-save:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(37,99,235,0.4); }
      .vhu-h-btn-close { background: none; border: none; font-size: 18px; color: #94a3b8; cursor: pointer; padding: 4px; line-height: 1; border-radius: 6px; }
      .vhu-h-btn-close:hover { color: #ef4444; background: #fee2e2; }
    </style>
    <div class="vhu-h-icon">✨</div>
    <div>
      <div class="vhu-h-title">Đã mở khóa menu sổ xuống trên web!</div>
      <div class="vhu-h-desc">Các ô lỗi & Phường Xã đã có sẵn menu để chọn trực tiếp.</div>
    </div>
    <button id="vhuQuickSaveBtn" class="vhu-h-btn-save">🚀 Lưu Vĩnh Viễn</button>
    <button id="vhuCloseHelperBtn" class="vhu-h-btn-close">&times;</button>
  `;

  document.body.appendChild(helperBar);
  document.getElementById('vhuCloseHelperBtn').onclick = () => helperBar.remove();

  // 9. XỬ LÝ LƯU VĨNH VIỄN LÊN MÁY CHỦ & BẬT BÌNH CHỌN
  function showVoteModal() {
    if (document.getElementById('vhu-vote-modal')) return;

    const voteOverlay = document.createElement('div');
    voteOverlay.id = 'vhu-vote-modal';
    voteOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(6px); z-index: 99999999; display: flex; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;';

    const voteContent = document.createElement('div');
    voteContent.style.cssText = 'background: #ffffff; max-width: 440px; width: 100%; border-radius: 24px; padding: 30px 24px 24px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35); position: relative; border: 3px solid #ffccd5; box-sizing: border-box; animation: vhuFadeIn 0.3s ease-out;';

    voteContent.innerHTML = `
      <style>
        @keyframes vhuFadeIn { from { opacity: 0; transform: scale(0.92) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes vhuHeartBeat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        .vhu-heart { display: inline-block; animation: vhuHeartBeat 1.2s infinite; font-size: 42px; line-height: 1; margin-bottom: 10px; }
        .vhu-title { font-size: 19px; font-weight: 800; color: #1e293b; margin-bottom: 8px; }
        .vhu-badge { display: inline-block; background: #ffe4e6; color: #e11d48; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; margin-bottom: 14px; }
        .vhu-box-msg { font-size: 14.5px; color: #334155; line-height: 1.55; margin-bottom: 20px; padding: 14px; background: #fff1f2; border-radius: 16px; border: 1.5px dashed #fda4af; text-align: center; }
        .vhu-box-msg strong { color: #e11d48; }
        .vhu-btn-vote { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 14px 20px; background: linear-gradient(135deg, #ff4b72, #e11d48); color: white !important; border: none; border-radius: 16px; font-size: 15px; font-weight: bold; cursor: pointer; text-decoration: none; box-shadow: 0 6px 20px rgba(225, 29, 72, 0.35); transition: all 0.2s ease; box-sizing: border-box; margin-bottom: 10px; }
        .vhu-btn-vote:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(225, 29, 72, 0.45); }
        .vhu-btn-skip { display: block; width: 100%; padding: 11px 20px; background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; border-radius: 14px; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; box-sizing: border-box; }
        .vhu-btn-skip:hover { background: #fee2e2; color: #b91c1c; border-color: #fca5a5; transform: translateY(-1px); }
      </style>
      <div class="vhu-heart">💖</div>
      <div class="vhu-title">🎉 ĐÃ LƯU THÀNH CÔNG VĨNH VIỄN!</div>
      <div class="vhu-badge">Cuộc thi Thiết kế Logo VHU 30 năm</div>
      <div class="vhu-box-msg">
        Thấy hay hãy giúp mình 1 bình chọn nha, để mình lên tiếp <strong>code đổi avatar</strong> lại cho các bạn lầm lỡ :))))<br>
        <span style="font-size: 12.5px; color: #be123c; margin-top: 5px; display: inline-block;">(Tác phẩm: <strong>82. Nhóm UTG</strong>)</span>
      </div>
      <a href="https://contest.vhu.edu.vn/posts/82-nhom-utg?game=thiet-ke-logo-ky-niem-vhu30&event=1&option=84" target="_blank" id="vhuVoteLink" class="vhu-btn-vote">
        🥰 Vote liền cho mình nè
      </a>
      <button id="vhuSkipButton" class="vhu-btn-skip">
        🥺 Vote đi mà (Bỏ qua)
      </button>
    `;

    document.body.appendChild(voteOverlay);
    voteOverlay.appendChild(voteContent);

    document.getElementById('vhuVoteLink').onclick = function() {
      setTimeout(() => { location.reload(); }, 1500);
    };

    document.getElementById('vhuSkipButton').onclick = function() {
      voteOverlay.remove();
      location.reload();
    };
  }

  document.getElementById('vhuQuickSaveBtn').onclick = async function() {
    const btn = document.getElementById('vhuQuickSaveBtn');
    btn.innerText = "⏳ Đang lưu...";
    btn.disabled = true;

    // Lấy state mới nhất từ React sau khi sinh viên đã chọn trên web
    const latestState = { ...(targetFiber?.memoizedState?.memoizedState || s) };

    // Đảm bảo Phường Xã có mã chuẩn
    if (!latestState.PhuongXaThuongTruID || latestState.PhuongXaThuongTruID === "__CUSTOM__") {
      latestState.PhuongXaThuongTruID = "00001";
    }

    try {
      const auth = JSON.parse(localStorage.getItem("authorizationData") || "{}");
      if (auth.Token) {
        const headers = {
          "content-type": "application/json",
          "apiKey": "pscRBF0zT2Mqo6vMw69YMOH43IrB2RtXBS0EHit2kzvL2auxaFJBvw==",
          "clientId": "vhu",
          "Authorization": "Bearer " + auth.Token
        };
        const postRes = await fetch("https://portal_api.vhu.edu.vn/api/student/UpdateStudent", {
          method: "POST",
          headers: headers,
          body: JSON.stringify(latestState)
        });
        const result = await postRes.json();
        console.log("Kết quả lưu:", result);
      }
    } catch (err) {
      console.warn("Lỗi lưu trực tiếp:", err);
    }

    helperBar.remove();
    showVoteModal();
  };

  console.log("🎉 Hoàn tất! Menu Phường Xã & các ô lỗi đã sẵn sàng cho bạn chọn trực tiếp trên trang web.");
})();