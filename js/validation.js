document.addEventListener("DOMContentLoaded", function () {
  // --- Phần 1: Xử lý ẩn/hiện mật khẩu (giữ nguyên) ---
  const togglePasswordIcons = document.querySelectorAll(".toggle-password");
  togglePasswordIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const passwordField = document.getElementById(targetId);
      const type =
        passwordField.getAttribute("type") === "password" ? "text" : "password";
      passwordField.setAttribute("type", type);
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
    });
  });

  // --- Phần 2: Xử lý validation khi submit form ---
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", function (event) {
    // Ngăn form gửi đi theo cách mặc định
    event.preventDefault();

    // Biến để kiểm tra xem toàn bộ form có hợp lệ không
    let isFormValid = true;

    // Lấy tất cả các trường input cần kiểm tra
    const hoInput = document.getElementById("ho");
    const tenInput = document.getElementById("ten");
    const sdtInput = document.getElementById("sdt");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm_password");

    // Lấy các thẻ hiển thị lỗi
    const emailError = document.getElementById("emailError");
    const confirmPasswordError = document.getElementById(
      "confirmPasswordError"
    );

    // Hàm kiểm tra chung cho các trường không được rỗng
    function validateNotEmpty(input) {
      if (input.value.trim() === "") {
        input.classList.add("is-invalid");
        isFormValid = false;
      } else {
        input.classList.remove("is-invalid");
      }
    }

    // Kiểm tra từng trường
    validateNotEmpty(hoInput);
    validateNotEmpty(tenInput);
    validateNotEmpty(sdtInput);
    validateNotEmpty(passwordInput);

    // Kiểm tra Email
    const emailRegex = /^\S+@\S+\.\S+$/; // Regex đơn giản để kiểm tra định dạng email
    if (emailInput.value.trim() === "") {
      emailError.innerHTML =
        '<i class="fas fa-info-circle"></i> Vui lòng nhập nội dung email';
      emailInput.classList.add("is-invalid");
      isFormValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      emailError.innerHTML =
        '<i class="fas fa-info-circle"></i> Địa chỉ email không chính xác';
      emailInput.classList.add("is-invalid");
      isFormValid = false;
    } else {
      emailInput.classList.remove("is-invalid");
    }

    // Kiểm tra Nhập lại mật khẩu
    if (confirmPasswordInput.value.trim() === "") {
      confirmPasswordError.innerHTML =
        '<i class="fas fa-info-circle"></i> Vui lòng nhập nội dung nhập lại mật khẩu';
      confirmPasswordInput.classList.add("is-invalid");
      isFormValid = false;
    } else if (passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordError.innerHTML =
        '<i class="fas fa-info-circle"></i> Mật khẩu nhập lại không khớp';
      confirmPasswordInput.classList.add("is-invalid");
      isFormValid = false;
    } else {
      confirmPasswordInput.classList.remove("is-invalid");
    }

    // Nếu toàn bộ form hợp lệ, bạn có thể thực hiện hành động tiếp theo
    // if (isFormValid) {
    //   alert("Đăng ký thành công!");
    //   // Ở đây bạn có thể cho phép form gửi đi thực sự
    //   // form.submit();
    // }
  });
});
