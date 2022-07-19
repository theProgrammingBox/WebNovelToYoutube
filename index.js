require("dotenv").config();
const puppeteer = require("puppeteer");
const gTTS = require("gtts");
var ffmpeg = require("fluent-ffmpeg");
const getMP3Duration = require('get-mp3-duration')
const fs = require('fs');

const numberOfProcesses = 1; //10;
const maxChapters = 1; //process.env.MAX_CHAPTERS;
var chaptersDone = 0;

async function getChapter(chpt) {
  if (chpt > maxChapters) { return; }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`${process.env.NOVEL_URL}${chpt}`);
  const texts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(
      "body > div.wrap > div > div.site-content > div > div > div > div > div > div > div.c-blog-post > div.entry-content > div > div > div > div > p"
    )).map((p) => p.innerText);
  });
  await browser.close();
  Promise.all(texts).then((texts) => {
    let gtts = new gTTS(texts.join(" "), "en");
    let mp3Name = `./mp3/${process.env.NOVEL_NAME} chapter ${chpt}.mp3`;
    let mp4Name = `./mp4/${process.env.NOVEL_NAME} chapter ${chpt}.mp4`;
    gtts.save(
      mp3Name,
      function (err, result) {
        if (err) { throw err; }
        let command = ffmpeg(mp3Name)
          .setFfmpegPath(process.env.FFMPEG_PATH)
          .input(process.env.IMAGE_PATH)
          .inputFPS(1)
          .loop(getMP3Duration(fs.readFileSync(mp3Name)) * 0.001)
          .save(mp4Name)
          .on("end", function () {
            fs.unlink(mp3Name, (err) => {
              if (err) { throw err; }
              console.log(`${mp3Name} deleted`);
            });
            console.log(`${++chaptersDone} / ${maxChapters}`);
            getChapter(chpt + numberOfProcesses);
          })
          .on("error", function (err) { throw err; });
      }
    );
  });
}

console.log("Starting...");
for (let i = 1; i <= numberOfProcesses; i++) {
  getChapter(i);
}