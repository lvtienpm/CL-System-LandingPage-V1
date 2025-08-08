// server.js

// --- CÁC THƯ VIỆN CẦN THIẾT ---
const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const bodyParser = require("body-parser");

// --- THIẾT LẬP BAN ĐẦU ---
const keys = require("./google-service-account.json"); // Key xác thực của bạn
const app = express();
const port = 3002;

app.use(cors());
app.use(bodyParser.json());

// --- KHAI BÁO CÁC ID CỦA GOOGLE SHEET ---
// Thay thế bằng ID thực tế của bạn
const SPREADSHEET_ID_CONTACT = "1rAiFgIBCbHGs1YkmDSvfyF742jhB_7um1DqyhQB0F6s";
const SPREADSHEET_ID_REGISTER = "1zF7jciql2i-DldrdITFL54uN4KpNk6mqgTf4RKEeXn4";

// =============================================================================
// HÀM GHI DỮ LIỆU CHUNG (ĐÃ ĐƯỢC TÁI CẤU TRÚC)
// Hàm này có thể ghi vào bất kỳ sheet nào bạn muốn
// =============================================================================
async function genericAppendToSheet(spreadsheetId, range, data) {
  // 1. Xác thực với Google
  const auth = new google.auth.GoogleAuth({
    credentials: keys,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  // 2. Chuẩn bị dữ liệu để ghi
  const resource = {
    values: [data], // data bây giờ là một mảng các giá trị
  };

  // 3. Thực hiện ghi dữ liệu
  const result = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    resource,
  });

  return result.data;
}

// =============================================================================
// API ENDPOINT SỐ 1: DÀNH CHO FORM LIÊN HỆ
// =============================================================================
app.post("/api/save-contact", async (req, res) => {
  try {
    // Chuẩn bị dữ liệu theo đúng thứ tự cột của Sheet Liên hệ
    const contactData = [
      req.body.fullName,
      req.body.phone,
      req.body.email,
      req.body.serviceSelect,
      req.body.message,
      new Date().toISOString(),
    ];

    // Gọi hàm chung với ID và range của Sheet Liên hệ
    const response = await genericAppendToSheet(
      SPREADSHEET_ID_CONTACT,
      "Sheet1!A1",
      contactData
    );

    res.json({ success: true, message: "Gửi liên hệ thành công!", response });
  } catch (error) {
    console.error("Lỗi khi lưu form liên hệ:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================================================
// API ENDPOINT SỐ 2: DÀNH CHO FORM ĐĂNG KÝ (CÁI CỬA MỚI)
// =============================================================================
app.post("/api/save-registration", async (req, res) => {
  try {
    // Chuẩn bị dữ liệu theo đúng thứ tự cột của Sheet Đăng ký
    // Ví dụ: họ, tên, sdt, email, ngày đăng ký
    const registrationData = [
      req.body.ho,
      req.body.ten,
      req.body.sdt,
      req.body.email,
      new Date().toISOString(),
    ];

    // Gọi hàm chung với ID và range của Sheet Đăng ký
    const response = await genericAppendToSheet(
      SPREADSHEET_ID_REGISTER,
      "Sheet1!A1", // Giả sử sheet cũng tên là Sheet1
      registrationData
    );

    res.json({
      success: true,
      // message: "Đăng ký tài khoản thành công!",
      response,
    });
  } catch (error) {
    // console.error("Lỗi khi lưu form đăng ký:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const querystring = require("querystring");

app.get("/auth/google", (req, res) => {
  const redirect_uri = "http://localhost:3002/auth/google/callback";
  const params = querystring.stringify({
    client_id:
      "348285572284-v33al3e3ttjc0g31rsih0kpklpc9uk9s.apps.googleusercontent.com",
    redirect_uri,
    response_type: "code",
    scope: "profile email",
    access_type: "offline",
    prompt: "consent",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

const axios = require("axios");

app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;

  try {
    // 1. Gửi mã code để lấy token
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id:
        "348285572284-v33al3e3ttjc0g31rsih0kpklpc9uk9s.apps.googleusercontent.com",
      client_secret: "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",
      redirect_uri: "http://localhost:3002/auth/google/callback",
      grant_type: "authorization_code",
    });

    const access_token = tokenRes.data.access_token;

    // 2. Dùng access_token để lấy thông tin người dùng
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const user = userRes.data;
    console.log("Google User Info:", user); // 🪪 Xem thông tin user

    // 3. Chuyển hướng về trang chủ hoặc dashboard
    res.redirect(
      `http://127.0.0.1:5503/csoftlife.html?name=${encodeURIComponent(
        user.name
      )}`
    );

    // res.redirect("http://127.0.0.1:5503/csoftlife.html");
  } catch (err) {
    console.error("Google Login Error:", err);
    res.send("Đăng nhập Google thất bại!");
  }
});

app.get("/auth/google/logout", (req, res) => {
  res.json({ success: true, message: "Đăng xuất thành công" });
});

// --- KHỞI ĐỘNG SERVER ---
app.listen(port, () => {
  console.log(
    `✅ Server đang chạy và lắng nghe cả hai form tại http://localhost:${port}`
  );
});
