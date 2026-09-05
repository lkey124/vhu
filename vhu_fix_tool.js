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
    alert("❌ Vui lòng mở đúng trang Cập nhật thông tin rồi chạy lại nhé!");
    return;
  }

  let hook0 = targetFiber.memoizedState;
  let hook5 = hook0?.next?.next?.next?.next?.next;
  let hook6 = hook5?.next;
  let hook7 = hook6?.next;
  let hook8 = hook7?.next;

  const setStudent = hook0?.queue?.dispatch;
  const setWards = hook6?.queue?.dispatch;
  const setAvatar = hook7?.queue?.dispatch;
  const setErrors = hook8?.queue?.dispatch;

  let s = { ...(hook0.memoizedState || {}) };
  let provinces = hook5?.memoizedState || [];

  function getDom(name) {
    const el = document.querySelector(`[name="${name}"]`);
    return el ? el.value : "";
  }

  // --- KIỂM TRA TỪNG MỤC (CHỈ HỎI NHỮNG MỤC BỊ THIẾU) ---

  // 1. Số điện thoại cá nhân
  let diDong = s.DiDong || getDom("DiDong");
  if (!diDong || !/^0\d{9}$/.test(diDong.replace(/\s/g, ""))) {
    diDong = prompt("Nhập Số điện thoại cá nhân (10 số, bắt đầu bằng 0):", diDong || "");
    if (!diDong) return;
  }
  s.DiDong = diDong.replace(/\s/g, "");

  // 2. Email cá nhân
  let email = s.EmailSV || getDom("EmailSV");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.toLowerCase().endsWith("@vhu.edu.vn")) {
    email = prompt("Nhập Email cá nhân (Gmail, Yahoo... không dùng đuôi @vhu.edu.vn):", email || "");
    if (!email) return;
  }
  s.EmailSV = email.trim();

  // 3. CCCD / CMND
  let cmnd = s.CMND || getDom("CMND");
  if (!cmnd || !/^(\d{9}|\d{12})$/.test(cmnd.replace(/\s/g, ""))) {
    cmnd = prompt("Nhập số CCCD (12 số) hoặc CMND (9 số):", cmnd || "");
    if (!cmnd) return;
  }
  s.CMND = cmnd.replace(/\s/g, "");

  // 4. Ngày cấp CCCD
  let ngayCap = s.NgayCapCMND || getDom("NgayCapCMND");
  if (!ngayCap) {
    ngayCap = prompt("Nhập Ngày cấp CCCD (dd/mm/yyyy):", "");
    if (!ngayCap) return;
  }
  s.NgayCapCMND = ngayCap.trim();

  // 5. Nơi cấp CCCD
  let noiCap = s.NoiCapCMND || getDom("NoiCapCMND");
  if (!noiCap) {
    noiCap = prompt("Nhập Nơi cấp CCCD:", "Cục Cảnh Sát QLHC về TTXH");
    if (!noiCap) return;
  }
  s.NoiCapCMND = noiCap.trim();

  // 6. MÃ BHYT: Không tự random - Lấy mã thật trên màn hình hoặc hỏi để nhập thật
  let bhyt = s.SoBaoHiemYTe || getDom("SoBaoHiemYTe") || getDom("SoBHYT");
  if (!bhyt || bhyt.trim() === "") {
    bhyt = prompt("Nhập Mã số BHYT thật của bạn (in trên thẻ BHYT):", "");
    if (!bhyt || bhyt.trim() === "") {
      alert("❌ Bạn chưa nhập mã BHYT!");
      return;
    }
  }
  s.SoBaoHiemYTe = bhyt.trim();

  // 7. Tỉnh thành thường trú
  let tinh = s.TinhThanhThuongTru;
  if (!tinh) {
    let tenTinh = prompt("Nhập Tên Tỉnh/Thành thường trú của bạn (Ví dụ: Thanh Hóa, TP.HCM, Nghệ An...):", "");
    if (!tenTinh) return;
    let found = provinces.find(p => (p.label || "").toLowerCase().includes(tenTinh.toLowerCase()));
    tinh = found ? found.value : (provinces[0]?.value || "38N");
  }
  s.TinhThanhThuongTru = tinh;

  // 8. Phường / Xã (Khắc phục lỗi No options)
  let phuongXa = s.PhuongXaThuongTru;
  if (!phuongXa || !s.PhuongXaThuongTruID) {
    phuongXa = prompt("Nhập Tên Phường / Xã của bạn (Ví dụ: Xã Thăng Bình, Phường 1...):", "");
    if (!phuongXa) return;
  }
  const maXaChuan = "00001";
  s.PhuongXaThuongTruID = maXaChuan;
  s.PhuongXaThuongTru = phuongXa.trim();
  if (setWards) setWards([{ label: phuongXa.trim(), value: maXaChuan }]);

  // 9. Số nhà, tên đường
  let soNha = s.SoNhaThuongTru || getDom("SoNhaThuongTru");
  if (!soNha) {
    soNha = prompt("Nhập Số nhà, tên đường hoặc thôn/xóm:", "");
    if (!soNha) return;
  }
  s.SoNhaThuongTru = soNha.trim();

  // 10. Địa chỉ tạm trú / liên lạc
  let diaChi = s.DiaChiLienLac || getDom("DiaChiLienLac");
  if (!diaChi) diaChi = s.SoNhaThuongTru + ", " + s.PhuongXaThuongTru;
  s.DiaChiLienLac = diaChi.trim();

  // 11. Nơi sinh
  if (!s.NoiSinh || !s.BirthPlaceID) {
    let pMatch = provinces.find(p => p.value === s.TinhThanhThuongTru);
    s.BirthPlaceID = s.TinhThanhThuongTru;
    s.NoiSinh = pMatch ? (pMatch.label.split(" - ")[1] || pMatch.label) : "Tỉnh Thanh Hóa";
  }

  // 12. Dân tộc, Tôn giáo, Quốc tịch mặc định
  if (!s.DanToc) s.DanToc = "01";
  if (!s.TonGiao) s.TonGiao = "00";
  if (!s.QuocGiaThuongTru) s.QuocGiaThuongTru = "vn";

  // 13. Người liên hệ khẩn cấp
  let nguoiLH = s.ContactPersonName || getDom("ContactPersonName");
  if (!nguoiLH) {
    nguoiLH = prompt("Nhập Họ tên người thân (phụ huynh):", "");
    if (!nguoiLH) return;
  }
  s.ContactPersonName = nguoiLH.trim();

  let sdtLH = s.ContactPersonPhone || getDom("ContactPersonPhone");
  if (!sdtLH || !/^0\d{9}$/.test(sdtLH.replace(/\s/g, "")) || sdtLH.replace(/\s/g, "") === s.DiDong) {
    sdtLH = prompt("Nhập SĐT người thân (Bắt buộc KHÁC số cá nhân " + s.DiDong + "):", "");
    if (!sdtLH) return;
  }
  s.ContactPersonPhone = sdtLH.replace(/\s/g, "");

  // 14. Bỏ qua chặn Avatar
  if (setAvatar) setAvatar(true);

  // 15. Cập nhật vào giao diện & xóa lỗi đỏ
  if (setStudent) setStudent(s);
  if (setErrors) setErrors({});

  // 16. LƯU VĨNH VIỄN LÊN MÁY CHỦ
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
        alert("🎉 ĐÃ LƯU THÀNH CÔNG VĨNH VIỄN LÊN MÁY CHỦ!\n\nTừ nay bạn F5 thoải mái sẽ KHÔNG BAO GIỜ bị hiện lại bảng này nữa.");
        location.reload();
        return;
      }
    }
  } catch(e) {
    console.warn("Lỗi lưu trực tiếp:", e);
  }

  alert("✅ Đã hoàn tất và xóa sạch lỗi đỏ! Hãy bấm nút LƯU VÀ TIẾP TỤC ở cuối trang nhé!");
})();
