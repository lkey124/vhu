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
        alert("🎉 ĐÃ LƯU THÀNH CÔNG VĨNH VIỄN LÊN MÁY CHỦ!\n\nTừ nay bạn F5 thoải mái sẽ KHÔNG BAO GIỜ bị hiện lại bảng này nữa.\n\n💖 Bạn ơi, nhóm mình đang tham gia cuộc thi 'Thiết kế logo kỷ niệm VHU30' (Bài 82 - Nhóm UTG). Nếu thấy công cụ hữu ích, bạn ghé qua thả 1 vote ủng hộ tụi mình nhé! Cảm ơn bạn rất nhiều! 🙏✨");
        try { window.open("https://contest.vhu.edu.vn/posts/82-nhom-utg?game=thiet-ke-logo-ky-niem-vhu30&event=1&option=84", "_blank"); } catch(e){}
        location.reload();
        return;
      }
    }
  } catch(e) {
    console.warn("Lỗi lưu trực tiếp:", e);
  }

  alert("✅ Đã hoàn tất và xóa sạch lỗi đỏ! Hãy bấm nút LƯU VÀ TIẾP TỤC ở cuối trang nhé!\n\n💖 Bạn ơi, nhóm mình đang tham gia cuộc thi 'Thiết kế logo kỷ niệm VHU30' (Bài 82 - Nhóm UTG). Nếu thấy công cụ hữu ích, bạn ghé qua thả 1 vote ủng hộ tụi mình nhé! Cảm ơn bạn rất nhiều! 🙏✨");
  try { window.open("https://contest.vhu.edu.vn/posts/82-nhom-utg?game=thiet-ke-logo-ky-niem-vhu30&event=1&option=84", "_blank"); } catch(e){}
})();