// index.js
const express = require("express");
const fetch = require("node-fetch"); // npm i node-fetch
const app = express();

app.use(express.json());

// ==== ВСТАВ СВОЇ ДАНІ ====
const BOT_TOKEN = "8026365651:AAHE6Db8TtQk7QvAOKMzZtZh6fx6rJ4tQu8"; // твій токен
const CHANNEL_ID = -1001234567890; // твій chat ID каналу (отримав через @userinfo3bot)
// ==========================

let posts = [];

// отримати URL файлу з Telegram
async function getFileURL(file_id) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${file_id}`);
  const data = await res.json();
  if (data.ok) {
    return `https://api.telegram.org/file/bot${BOT_TOKEN}/${data.result.file_path}`;
  }
  return "";
}

// Вебхук для Telegram
app.post("/webhook", async (req, res) => {
  const message = req.body.message;
  if (!message) return res.sendStatus(200);

  // тільки пости з каналу
  if (message.chat && message.chat.id === CHANNEL_ID && (message.text || message.caption || message.photo)) {
    const text = message.text || message.caption || "";
    let imageUrl = "";

    if (message.photo && message.photo.length > 0) {
      const file_id = message.photo[message.photo.length - 1].file_id; // остання якість
      imageUrl = await getFileURL(file_id);
    }

    const postId = message.message_id;

    posts.unshift({
      text,
      image: imageUrl,
      link: `https://t.me/IncognitoModeChannel/${postId}`
    });

    // залишаємо останні 5 постів
    posts = posts.slice(0, 5);
  }

  res.sendStatus(200);
});

// API для сайту
app.get("/posts", (req, res) => {
  res.json(posts);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
