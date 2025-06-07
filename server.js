const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3000;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

app.use(cors());

app.get("/github/login", (req, res) => {
  const redirect_uri = "http://localhost:3000/github/callback";
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect_uri}&scope=repo`
  );
});

app.get("/github/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      {
        headers: { accept: "application/json" },
      }
    );

    const accessToken = response.data.access_token;

    res.redirect(`http://localhost:5173/?github_token=${accessToken}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("OAuth failed");
  }
});

app.listen(PORT);
