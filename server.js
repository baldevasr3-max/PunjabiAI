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
        reply: "ਕਿਰਪਾ ਕਰਕੇ ਕੋਈ ਸਵਾਲ ਲਿਖੋ ਜੀ।"
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
                "ਤੁਸੀਂ PunjabiAI Assistant ਹੋ। ਹਮੇਸ਼ਾ ਮਦਦਗਾਰ, ਸਪੱਸ਼ਟ ਅਤੇ ਸੁਰੱਖਿਅਤ ਜਵਾਬ ਦਿਓ। ਜੇ ਯੂਜ਼ਰ ਪੰਜਾਬੀ ਵਿੱਚ ਪੁੱਛੇ ਤਾਂ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ।"
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

    console.log("OpenAI response:", data);

    if (!response.ok) {
      return res.status(response.status).json({
        reply: data.error?.message || "AI API Error ਆ ਗਿਆ ਜੀ।"
      });
    }

    res.json({
      reply: data.output_text || "ਮਾਫ ਕਰਨਾ ਜੀ, ਕੋਈ ਜਵਾਬ ਨਹੀਂ ਮਿਲਿਆ।"
    });

  } catch (error) {

    console.error("Server Error:", error);

    res.status(500).json({
      reply: "ਮਾਫ ਕਰਨਾ ਜੀ, Server ਵਿੱਚ ਸਮੱਸਿਆ ਆ ਗਈ।"
    });
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("PunjabiAI server running on port " + PORT);
});
