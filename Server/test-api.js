const axios = require("axios");

async function testAPI() {
  try {
    const res = await axios.get("http://localhost:3000/api/vacancynotice");
    console.log("✅ API /api/vacancynotice status:", res.status);
    console.log("Data:", res.data);
  } catch (err) {
    console.error("❌ API Error:", err.response?.status, err.response?.data || err.message);
  }
}

testAPI();
