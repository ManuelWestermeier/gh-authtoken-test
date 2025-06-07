const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3000;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

app.use(cors());

// Step 1: Redirect to GitHub
app.get("/github/login", (req, res) => {
  const appUrl = req.query.appUrl || "http://localhost:5173";

  const redirect_uri = "https://gh-authtoken-test.onrender.com/github/callback";

  // `state` will carry appUrl across redirects
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect_uri}&scope=repo&state=${encodeURIComponent(
      appUrl
    )}`
  );
});

// Step 2: GitHub redirects here
app.get("/github/callback", async (req, res) => {
  const code = req.query.code;
  const appUrl = req.query.state; // carry forward app URL

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

    const url = new URL(appUrl);
    url.searchParams.set("token", accessToken);

    res.redirect(url.toString());
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("OAuth failed");
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
