const express = require("express");
const path = require("path");
const OpenAI = require("openai");

const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "ਕਿਰਪਾ ਕਰਕੇ ਕੋਈ ਸੁਨੇਹਾ ਲਿਖੋ ਜੀ।",
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY missing");
      return res.status(500).json({
        error: "OpenAI API key ਨਹੀਂ ਮਿਲੀ।",
      });
    }

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      instructions: `
ਤੁਸੀਂ PunjabiAI ਨਾਮ ਦੇ ਇੱਕ ਮਦਦਗਾਰ AI Assistant ਹੋ।
ਹਮੇਸ਼ਾ ਦੋਸਤਾਨਾ ਅਤੇ ਸਧਾਰਨ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ।
ਜੇ ਯੂਜ਼ਰ English ਜਾਂ Hindi ਵਿੱਚ ਪੁੱਛੇ ਤਾਂ ਉਸੇ ਭਾਸ਼ਾ ਵਿੱਚ ਵੀ ਜਵਾਬ ਦੇ ਸਕਦੇ ਹੋ।
ਤੁਹਾਡਾ ਮਕਸਦ ਮਦਦਗਾਰ ਅਤੇ ਸਪੱਸ਼ਟ ਜਵਾਬ ਦੇਣਾ ਹੈ।
      `,
      input: message,
    });

    const reply =
      response.output_text ||
      "ਮਾਫ ਕਰਨਾ ਜੀ, ਮੈਨੂੰ ਇਸ ਵੇਲੇ ਜਵਾਬ ਨਹੀਂ ਮਿਲਿਆ।";

    res.json({
      reply: reply,
    });

  } catch (error) {
    console.error("OPENAI ERROR:", error);

    res.status(500).json({
      error: "AI ਨਾਲ connection ਵਿੱਚ ਸਮੱਸਿਆ ਆ ਗਈ।",
      details: error.message,
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
