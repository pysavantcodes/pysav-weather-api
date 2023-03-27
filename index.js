const axios = require("axios");
const express = require("express");
const app = express();
const cors = require("cors");
const cheerio = require("cheerio");

app.use(cors());
app.use(express.json());

const baseURL = "https://google.com/search?q=weather+in+";

app.get("/weather/:id", (req, res) => {
  const { id } = req.params;
  const getHTML = async () => {
    try {
      const { data } = await axios.get(baseURL + id);
      const $ = await cheerio.load(data);
      const temperature = $('div[class="BNeawe iBp4i AP7Wnd"]')
        .eq(0)
        .text()
        .replace(/\D/g, "");
      const location = id;
      const time = $('div[class="BNeawe tAd8D AP7Wnd"]')
        .eq(0)
        .text()
        .trim()
        .split("\n")[0]?.split(" ")[1];
      const status = $('div[class="BNeawe tAd8D AP7Wnd"]')
        .eq(0)
        .text();

      if (temperature) {
        res.json({
          temperature: temperature + "°C",
          location: location.charAt(0).toUpperCase() + location.slice(1),
          time:
            Number(time.split(" ")[1].split(":")[0]) >= 12
              ? time + " PM"
              : time + " AM",
          status,
        });
      } else {
        res.status(400);
        res.json({ message: "Invalid location" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  getHTML();
});

app.listen(5000, () => {
  console.log("server is running");
});
