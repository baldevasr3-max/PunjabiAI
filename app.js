const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Punjabi AI Assistant is running!"
  });
});

app.post("/chat", (req, res) => {
  const message = req.body.message;

  res.json({
    reply: `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ! ਤੁਸੀਂ ਕਿਹਾ: ${message}`
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
