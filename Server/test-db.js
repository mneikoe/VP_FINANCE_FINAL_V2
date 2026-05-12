const mongoose = require("mongoose");
require("dotenv").config();

async function checkDB() {
  try {
    console.log("Connecting to:", process.env.dbUrl);
    await mongoose.connect(process.env.dbUrl, { tls: true });
    console.log("✅ DB Connected Successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
    process.exit(1);
  }
}

checkDB();
