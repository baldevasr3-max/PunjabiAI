const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: "ਤੁਸੀਂ PunjabiAI Assistant ਹੋ। ਹਮੇਸ਼ਾ ਪੰਜਾਬੀ ਵਿੱਚ ਸੌਖੇ ਅਤੇ ਦੋਸਤਾਨਾ ਤਰੀਕੇ ਨਾਲ ਜਵਾਬ ਦਿਓ।"
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({
        reply: "ਮਾਫ ਕਰਨਾ ਜੀ, AI ਨਾਲ connection ਵਿੱਚ ਸਮੱਸਿਆ ਆ ਗਈ।"
      });
    }

    res.json({
      reply: data.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      reply: "Server error ਆ ਗਿਆ ਜੀ।"
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`PunjabiAI running on port ${PORT}`);
});
