<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>PunjabiAI</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #f4f6f8;
    }

    .header {
      background: #111827;
      color: white;
      text-align: center;
      padding: 20px;
      font-size: 24px;
      font-weight: bold;
    }

    #chatBox {
      height: 70vh;
      overflow-y: auto;
      padding: 15px;
    }

    .message {
      padding: 12px 15px;
      margin: 10px 0;
      border-radius: 12px;
      max-width: 80%;
    }

    .user {
      background: #2563eb;
      color: white;
      margin-left: auto;
    }

    .bot {
      background: white;
      color: black;
    }

    .input-area {
      position: fixed;
      bottom: 0;
      width: 100%;
      display: flex;
      padding: 12px;
      background: white;
      border-top: 1px solid #ddd;
    }

    input {
      flex: 1;
      padding: 14px;
      border: 1px solid #ccc;
      border-radius: 25px;
      font-size: 16px;
    }

    button {
      margin-left: 10px;
      padding: 12px 20px;
      border: none;
      border-radius: 25px;
      background: #2563eb;
      color: white;
      font-size: 16px;
    }
  </style>
</head>

<body>

  <div class="header">
    🤖 PunjabiAI Assistant
  </div>

  <div id="chatBox">
    <div class="message bot">
      ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ! ਮੈਂ PunjabiAI ਹਾਂ। ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?
    </div>
  </div>

  <div class="input-area">
    <input
      type="text"
      id="userInput"
      placeholder="ਆਪਣਾ ਸਵਾਲ ਲਿਖੋ..."
      onkeypress="if(event.key === 'Enter') sendMessage()"
    >
    <button onclick="sendMessage()">Send</button>
  </div>

  <script>
    async function sendMessage() {
      const input = document.getElementById("userInput");
      const chatBox = document.getElementById("chatBox");
      const message = input.value.trim();

      if (!message) return;

      chatBox.innerHTML += `
        <div class="message user">${message}</div>
      `;

      input.value = "";

      try {
        const response = await fetch("/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        chatBox.innerHTML += `
          <div class="message bot">${data.reply}</div>
        `;

        chatBox.scrollTop = chatBox.scrollHeight;

      } catch (error) {
        chatBox.innerHTML += `
          <div class="message bot">
            Server connection error.
          </div>
        `;
      }
    }
  </script>

</body>
</html>
