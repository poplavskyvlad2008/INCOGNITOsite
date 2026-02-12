const express = require("express");
const app = express();

app.use(express.json());

let posts = [];

app.post("/webhook", (req, res) => {
  const message = req.body.message;

  if (message && (message.text || message.caption)) {

    const text = message.text || message.caption;

    posts.unshift({
      text: text,
      link: `https://t.me/IncognitoModeChannel/${message.message_id}`
    });

    posts = posts.slice(0, 5);
  }

  res.sendStatus(200);
});

app.get("/posts", (req, res) => {
  res.json(posts);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
