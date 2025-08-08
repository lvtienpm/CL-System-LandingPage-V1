// Đợi cho đến khi toàn bộ cấu trúc HTML được tải xong thì mới chạy script
document.addEventListener("DOMContentLoaded", function () {
  // --- PHẦN 1: THIẾT LẬP "TỔNG ĐÀI" AXIOS ---
  // Tạo một axios instance để giao tiếp với backend
  const api = axios.create({
    baseURL: "http://localhost:3002",
    timeout: 5000,
    headers: { "Content-Type": "application/json" },
  });

  // --- PHẦN 2: ĐỊNH NGHĨA HÀM GỌI API ĐĂNG KÝ ---
  async function createRegistration(data) {
    // Gọi đến đúng endpoint của Form Đăng ký trên server
    return api.post("/api/save-registration", data);
  }

  const registerForm = document.getElementById("registerForm");
  if (!registerForm) return; // Nếu không tìm thấy form thì không làm gì cả

  const ho = document.getElementById("ho");
  const ten = document.getElementById("ten");
  const sdt = document.getElementById("sdt");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirm_password = document.getElementById("confirm_password");

  // --- PHẦN 4: LẮNG NGHE SỰ KIỆN SUBMIT CỦA FORM ĐĂNG KÝ ---
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Ngăn trang web tải lại

    const missingFields = [];
    const hoValue = ho.value.trim();
    const tenValue = ten.value.trim();
    const sdtValue = sdt.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const confirmPasswordValue = confirm_password.value.trim();

    if (!hoValue) missingFields.push("Họ");
    if (!tenValue) missingFields.push("Tên");
    if (!sdtValue) missingFields.push("Số điện thoại");
    if (!emailValue) missingFields.push("Email");
    if (!passwordValue) missingFields.push("Mật khẩu");
    if (!confirmPasswordValue) missingFields.push("Nhập lại mật khẩu");

    if (passwordValue && passwordValue !== confirmPasswordValue) {
      Swal.fire("Lỗi!", "Mật khẩu và xác nhận mật khẩu không khớp.", "error");
      return;
    }

    // Kiểm tra reCAPTCHA (nếu có)
    // const recaptchaResponse = grecaptcha.getResponse();
    // if (recaptchaResponse.length === 0) {
    //     missingFields.push("xác nhận reCAPTCHA");
    // }

    if (missingFields.length > 0) {
      Swal.fire({
        title: "Thiếu thông tin!",
        html: `Vui lòng điền các trường sau:<br><strong>${missingFields.join(
          ", "
        )}</strong>`,
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    // === BƯỚC B: CHUẨN BỊ "BƯU PHẨM" ĐỂ GỬI ĐI ===
    const data = {
      ho: hoValue,
      ten: tenValue,
      sdt: sdtValue,
      email: emailValue,
      // Không bao giờ gửi mật khẩu đến server để lưu trữ trực tiếp.
      // Server nên nhận và mã hóa nó.
    };

    // === BƯỚC C: GỬI "BƯU PHẨM" VÀ XỬ LÝ KẾT QUẢ ===
    Swal.fire({
      title: "Đang xử lý...",
      text: "Vui lòng chờ trong giây lát.",
      icon: "info",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();
        try {
          // Gọi hàm gửi API đăng ký
          await createRegistration(data);

          Swal.fire({
            title: "Đăng ký thành công!",
            text: "Tài khoản của bạn đã được tạo.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            registerForm.reset(); // Xóa sạch form
            window.location.href = "login.html";
          });
        } catch (error) {
          console.error("Lỗi khi đăng ký:", error);
          Swal.fire({
            title: "Đăng ký thất bại!",
            text: "Có lỗi xảy ra, vui lòng thử lại sau.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      },
    });
  });
});
