const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({
        reply: "ਕਿਰਪਾ ਕਰਕੇ ਕੋਈ ਸੁਨੇਹਾ ਲਿਖੋ ਜੀ।"
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
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
              content:
                "ਤੁਸੀਂ PunjabiAI Assistant ਹੋ। ਹਮੇਸ਼ਾ ਸਧਾਰਨ ਪੰਜਾਬੀ ਵਿੱਚ ਮਦਦਗਾਰ ਜਵਾਬ ਦਿਓ।"
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI Error:", data);

      return res.status(500).json({
        reply: "AI server ਨਾਲ connection ਵਿੱਚ ਸਮੱਸਿਆ ਆ ਗਈ।"
      });
    }

    res.json({
      reply: data.output_text || "ਮਾਫ ਕਰਨਾ ਜੀ, ਕੋਈ ਜਵਾਬ ਨਹੀਂ ਮਿਲਿਆ।"
    });

  } catch (error) {
    console.error("Server Error:", error);

    res.status(500).json({
      reply: "Server ਵਿੱਚ ਸਮੱਸਿਆ ਆ ਗਈ ਜੀ।"
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("PunjabiAI server running");
});
