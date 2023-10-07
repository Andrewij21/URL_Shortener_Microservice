require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const mongo_uri = process.env.MONGO_URI;
const Url = require("./urlModel");

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", async (req, res) => {
  console.log("tes", req.body);
  const original_url = req.body.url;
  const urlRegex = /^https?:\/\/(www\.)?[\w.-]+\.\w+\/?.*$/;
  if (!urlRegex.test(original_url)) {
    return res.json({ error: "invalid url" });
  }
  const existingUrl = await Url.findOne({ original_url });
  if (existingUrl) {
    console.log("Alredy exist!!!");
    res.json({ original_url, shortUrl: existingUrl.short_url });
  } else {
    console.log("create new");
    const short_url =
      (Math.floor(Date.now() * Math.random()) % 900000) + 100000;
    console.log({ original_url, short_url });
    const url = new Url({ original_url, short_url });
    await url.save();
    res.json({ original_url, short_url });
  }
});
app.get("/api/shorturl/:short_url", async (req, res) => {
  const { short_url } = req.params;
  const url = await Url.findOne({ short_url });

  if (url) {
    res.redirect(url.original_url);
  } else {
    res.status(404).send("Not Found");
  }
});
mongoose
  .connect(mongo_uri)
  .then(() => {
    app.listen(port, function () {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(err.toString());
  });
