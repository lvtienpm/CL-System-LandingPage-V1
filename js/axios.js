// 1. Tạo axios instance
// const api = axios.create({
//   baseURL: "http://aregister.csoftlife.com",
//   timeout: 5000,
//   headers: { "Content-Type": "application/json" },
// });

// 2. Khai báo hàm gọi API
// async function createRegister(data) {
//   return api.post("/SoftwareRegisterApi/insert", data);
// }

// 1. Tạo axios instance
const api = axios.create({
  baseURL: "http://localhost:3002", // ✅ đổi sang Node.js backend
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

// 2. Khai báo hàm gọi API
async function createRegister(data) {
  return api.post("/api/save-contact", data); // ✅ đổi path
}

// 3. Lắng nghe sự kiện submit và xử lý validate + gọi API
document
  .getElementById("contactForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const serviceSelect = document.getElementById("serviceSelect").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const vnPhoneRegex =
      /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-689]|9[0-9])[0-9]{7}$/;

    const missingFields = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName) missingFields.push("Họ và tên");

    if (!phone) {
      missingFields.push("Số điện thoại");
    } else if (!vnPhoneRegex.test(phone)) {
      missingFields.push("Số điện thoại không đúng định dạng Việt Nam");
    }
    if (!email) {
      missingFields.push("Email");
    } else if (!emailRegex.test(email)) {
      missingFields.push("Email không đúng định dạng");
    }

    if (!serviceSelect) missingFields.push("Bạn quan tâm đến");

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

    const message = document.getElementById("message").value.trim();

    const data = {
      fullName,
      phone,
      email,
      serviceSelect,
      message,
      createdTime: new Date().toISOString(),
      flag: "",
    };

    Swal.fire({
      title: "Đang gửi dữ liệu...",
      text: "Vui lòng chờ trong giây lát.",
      icon: "info",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();

        try {
          await createRegister(data);
          Swal.fire({
            title: "Gửi thành công!",
            text: "Cảm ơn bạn đã gửi liên hệ, chúng tôi sẽ liên hệ sớm.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            document.getElementById("contactForm").reset();
          });
        } catch (error) {
          console.error("Lỗi:", error);
          Swal.fire({
            title: "Gửi thất bại!",
            text: "Có lỗi xảy ra khi gửi dữ liệu, vui lòng thử lại.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      },
    });
  });
