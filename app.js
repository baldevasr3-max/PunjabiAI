const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

// OpenAI connection
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// AI Chat API
app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({
        reply: "ਕਿਰਪਾ ਕਰਕੇ ਕੋਈ message ਲਿਖੋ ਜੀ।"
      });
    }

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      instructions: `
You are PunjabiAI, a helpful and friendly AI assistant.
You understand Punjabi, English and Hindi.
When the user speaks Punjabi, reply naturally in Punjabi (Gurmukhi script).
Be helpful, clear and respectful.
`,
      input: message
    });

    res.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error("OpenAI Error:", error);

    res.status(500).json({
      reply: "ਮਾਫ ਕਰਨਾ ਜੀ, AI ਨਾਲ connection ਵਿੱਚ ਸਮੱਸਿਆ ਆ ਗਈ।"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
