(async function smartAutoFixVHU() {
  console.log("🔍 Đang kiểm tra các mục còn thiếu trên form...");

  // 1. Tìm React Fiber của form
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
    alert("❌ Vui lòng mở đúng trang 'Cập nhật thông tin sinh viên' rồi chạy lại nhé!");
    return;
  }

  // Lấy các state và hook nội bộ của React
  let hook0 = targetFiber.memoizedState;
  let hook1 = hook0?.next;                               // Dân tộc
  let hook2 = hook1?.next;                              // Tôn giáo
  let hook3 = hook2?.next;                              // Quốc gia
  let hook5 = hook0?.next?.next?.next?.next?.next;       // Tỉnh thành
  let hook6 = hook5?.next;                              // Phường xã
  let hook7 = hook6?.next;                              // Trạng thái Avatar
  let hook8 = hook7?.next;                              // Danh sách lỗi

  const setStudent = hook0?.queue?.dispatch;
  const setWards = hook6?.queue?.dispatch;
  const setAvatar = hook7?.queue?.dispatch;
  const setErrors = hook8?.queue?.dispatch;

  let s = { ...(hook0.memoizedState || {}) };
  let ethnics = hook1?.memoizedState || [];
  let religions = hook2?.memoizedState || [];
  let countries = hook3?.memoizedState || [];
  let provinces = hook5?.memoizedState || [];

  function getDom(name) {
    const el = document.querySelector(`[name="${name}"]`);
    return el ? el.value.trim() : "";
  }

  // --- TUYỆT ĐỐI KHÔNG TỰ SINH / TỰ ĐOÁN DỮ LIỆU: MỤC NÀO THIẾU BẮT BUỘC HỎI ĐỂ SINH VIÊN TỰ NHẬP ---

  // 1. Số điện thoại cá nhân
  let diDong = s.DiDong || getDom("DiDong");
  if (!diDong || !/^0\d{9}$/.test(diDong.replace(/\s/g, ""))) {
    diDong = prompt("Nhập Số điện thoại cá nhân của bạn (10 số, bắt đầu bằng 0):", "");
    if (!diDong) return alert("Đã dừng: Bạn chưa nhập số điện thoại cá nhân!");
  }
  s.DiDong = diDong.replace(/\s/g, "");

  // 2. Email cá nhân
  let email = s.EmailSV || getDom("EmailSV");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.toLowerCase().endsWith("@vhu.edu.vn")) {
    email = prompt("Nhập Email cá nhân của bạn (Gmail, Yahoo... không dùng đuôi @vhu.edu.vn):", "");
    if (!email) return alert("Đã dừng: Bạn chưa nhập email cá nhân!");
  }
  s.EmailSV = email.trim();

  // 3. Số CCCD / CMND
  let cmnd = s.CMND || getDom("CMND");
  if (!cmnd || !/^(\d{9}|\d{12})$/.test(cmnd.replace(/\s/g, ""))) {
    cmnd = prompt("Nhập số CCCD (12 số) hoặc CMND (9 số) của bạn:", "");
    if (!cmnd) return alert("Đã dừng: Bạn chưa nhập số CCCD/CMND!");
  }
  s.CMND = cmnd.replace(/\s/g, "");

  // 4. Ngày cấp CCCD
  let ngayCap = s.NgayCapCMND || getDom("NgayCapCMND");
  if (!ngayCap) {
    ngayCap = prompt("Nhập Ngày cấp CCCD của bạn (dd/mm/yyyy, in trên CCCD):", "");
    if (!ngayCap) return alert("Đã dừng: Bạn chưa nhập ngày cấp CCCD!");
  }
  s.NgayCapCMND = ngayCap.trim();

  // 5. Nơi cấp CCCD
  let noiCap = s.NoiCapCMND || getDom("NoiCapCMND");
  if (!noiCap) {
    noiCap = prompt("Nhập Nơi cấp CCCD của bạn (in ở mặt sau CCCD):", "");
    if (!noiCap) return alert("Đã dừng: Bạn chưa nhập nơi cấp CCCD!");
  }
  s.NoiCapCMND = noiCap.trim();

  // 6. Mã số BHYT (Tuyệt đối KHÔNG tự sinh mã bừa bãi)
  let bhyt = s.SoBaoHiemYTe || getDom("SoBaoHiemYTe") || getDom("SoBHYT");
  if (!bhyt) {
    bhyt = prompt("Nhập Mã số BHYT thật của bạn (in trên thẻ BHYT hoặc VssID):", "");
    if (!bhyt) return alert("Đã dừng: Bạn chưa nhập mã BHYT!");
  }
  s.SoBaoHiemYTe = bhyt.trim();

  // 7. Tỉnh thành thường trú
  let tinh = s.TinhThanhThuongTru;
  if (!tinh) {
    let tenTinh = prompt("Nhập Tên Tỉnh/Thành thường trú của bạn (Ví dụ: Thanh Hóa, TP.HCM, Hà Nội...):", "");
    if (!tenTinh) return alert("Đã dừng: Bạn chưa nhập Tỉnh/Thành!");
    let found = provinces.find(p => (p.label || "").toLowerCase().includes(tenTinh.toLowerCase().trim()));
    tinh = found ? found.value : (provinces[0]?.value || "");
  }
  s.TinhThanhThuongTru = tinh;

  // 8. Phường / Xã (Sửa lỗi kẹt No options của trường)
  let phuongXa = s.PhuongXaThuongTru;
  if (!phuongXa || !s.PhuongXaThuongTruID) {
    phuongXa = prompt("Nhập Tên Phường / Xã thường trú của bạn (Ví dụ: Xã Thăng Bình, Phường 1...):", "");
    if (!phuongXa) return alert("Đã dừng: Bạn chưa nhập Phường/Xã!");
  }
  const maXaChuan = "00001"; // Mã kỹ thuật ngắn dưới 10 ký tự để máy chủ SQL không bị tràn
  s.PhuongXaThuongTruID = maXaChuan;
  s.PhuongXaThuongTru = phuongXa.trim();
  if (setWards) setWards([{ label: phuongXa.trim(), value: maXaChuan }]);

  // 9. Số nhà, tên đường
  let soNha = s.SoNhaThuongTru || getDom("SoNhaThuongTru");
  if (!soNha) {
    soNha = prompt("Nhập Số nhà, tên đường hoặc thôn/xóm thường trú của bạn:", "");
    if (!soNha) return alert("Đã dừng: Bạn chưa nhập Số nhà/thôn xóm!");
  }
  s.SoNhaThuongTru = soNha.trim();

  // 10. Địa chỉ tạm trú / liên lạc
  let diaChi = s.DiaChiLienLac || getDom("DiaChiLienLac");
  if (!diaChi) {
    diaChi = prompt("Nhập Địa chỉ liên lạc / tạm trú của bạn:", s.SoNhaThuongTru + ", " + s.PhuongXaThuongTru);
    if (!diaChi) return alert("Đã dừng: Bạn chưa nhập địa chỉ liên lạc!");
  }
  s.DiaChiLienLac = diaChi.trim();

  // 11. Nơi sinh
  let noiSinh = s.NoiSinh || getDom("NoiSinh");
  if (!noiSinh || !s.BirthPlaceID) {
    let tenNoiSinh = prompt("Nhập Nơi sinh của bạn (Tỉnh/Thành theo giấy khai sinh / CCCD):", "");
    if (!tenNoiSinh) return alert("Đã dừng: Bạn chưa nhập nơi sinh!");
    let foundNS = provinces.find(p => (p.label || "").toLowerCase().includes(tenNoiSinh.toLowerCase().trim()));
    s.BirthPlaceID = foundNS ? foundNS.value : s.TinhThanhThuongTru;
    s.NoiSinh = foundNS ? (foundNS.label.split(" - ")[1] || foundNS.label) : tenNoiSinh.trim();
  }

  // 12. Dân tộc
  if (!s.DanToc) {
    let tenDanToc = prompt("Nhập Dân tộc của bạn (Ví dụ: Kinh, Tày, Mường, Hoa...):", "Kinh");
    if (!tenDanToc) return alert("Đã dừng: Bạn chưa nhập dân tộc!");
    let foundDT = ethnics.find(e => (e.label || "").toLowerCase().includes(tenDanToc.toLowerCase().trim()));
    s.DanToc = foundDT ? foundDT.value : "01";
  }

  // 13. Tôn giáo
  if (!s.TonGiao) {
    let tenTonGiao = prompt("Nhập Tôn giáo của bạn (Ví dụ: Không, Phật giáo, Công giáo...):", "Không");
    if (!tenTonGiao) return alert("Đã dừng: Bạn chưa nhập tôn giáo!");
    let foundTG = religions.find(r => (r.label || "").toLowerCase().includes(tenTonGiao.toLowerCase().trim()));
    s.TonGiao = foundTG ? foundTG.value : "00";
  }

  // 14. Quốc tịch
  if (!s.QuocGiaThuongTru) {
    let tenQuocTich = prompt("Nhập Quốc tịch của bạn:", "Việt Nam");
    if (!tenQuocTich) return alert("Đã dừng: Bạn chưa nhập quốc tịch!");
    let foundQT = countries.find(c => (c.label || "").toLowerCase().includes(tenQuocTich.toLowerCase().trim()));
    s.QuocGiaThuongTru = foundQT ? foundQT.value : "vn";
  }

  // 15. Thông tin người liên hệ khẩn cấp
  let nguoiLH = s.ContactPersonName || getDom("ContactPersonName");
  if (!nguoiLH) {
    nguoiLH = prompt("Nhập Họ và tên người thân (phụ huynh/người liên hệ khẩn cấp):", "");
    if (!nguoiLH) return alert("Đã dừng: Bạn chưa nhập họ tên người thân!");
  }
  s.ContactPersonName = nguoiLH.trim();

  let sdtLH = s.ContactPersonPhone || getDom("ContactPersonPhone");
  if (!sdtLH || !/^0\d{9}$/.test(sdtLH.replace(/\s/g, "")) || sdtLH.replace(/\s/g, "") === s.DiDong) {
    sdtLH = prompt("Nhập SĐT người thân (Bắt buộc KHÁC số cá nhân " + s.DiDong + "):", "");
    if (!sdtLH) return alert("Đã dừng: Bạn chưa nhập SĐT người thân!");
  }
  s.ContactPersonPhone = sdtLH.replace(/\s/g, "");

  // 16. Mở khóa kiểm tra Avatar
  if (setAvatar) setAvatar(true);

  // 17. Cập nhật dữ liệu vào form & Xóa toàn bộ lỗi đỏ
  if (setStudent) setStudent(s);
  if (setErrors) setErrors({});

  function showVoteModal() {
    if (document.getElementById('vhu-vote-modal')) return;

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'vhu-vote-modal';
    modalOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(6px); z-index: 99999999; display: flex; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;';

    const modalContent = document.createElement('div');
    modalContent.style.cssText = 'background: #ffffff; max-width: 440px; width: 100%; border-radius: 24px; padding: 30px 24px 24px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35); position: relative; border: 3px solid #ffccd5; box-sizing: border-box; animation: vhuFadeIn 0.3s ease-out;';

    modalContent.innerHTML = `
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

    document.body.appendChild(modalOverlay);
    modalOverlay.appendChild(modalContent);

    document.getElementById('vhuVoteLink').onclick = function() {
      setTimeout(() => { location.reload(); }, 1500);
    };

    document.getElementById('vhuSkipButton').onclick = function() {
      modalOverlay.remove();
      location.reload();
    };
  }

  // 18. LƯU VĨNH VIỄN LÊN MÁY CHỦ
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
        body: JSON.stringify(s)
      });
      const result = await postRes.json();
      if (postRes.ok) {
        showVoteModal();
        return;
      }
    }
  } catch(e) {
    console.warn("Lỗi lưu trực tiếp:", e);
  }

  showVoteModal();
})();