const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const bodyParser = require("body-parser");
const keys = require("./google-service-account.json");

const app = express();
const port = 3002;

app.use(cors());
app.use(bodyParser.json());

async function appendToSheet(data) {
  const auth = new google.auth.GoogleAuth({
    credentials: keys,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1rAiFgIBCbHGs1YkmDSvfyF742jhB_7um1DqyhQB0F6s";
  const range = "Sheet1!A1";

  const resource = {
    values: [
      [
        data.fullName,
        data.phone,
        data.email,
        data.serviceSelect,
        data.message,
        new Date().toISOString(),
      ],
    ],
  };

  const result = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    resource,
  });

  return result.data;
}

app.post("/api/save-to-sheet", async (req, res) => {
  try {
    const response = await appendToSheet(req.body);
    res.json({ success: true, response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${port}`);
});
