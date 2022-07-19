require("dotenv").config();
// const puppeteer = require("puppeteer");
// const gTTS = require("gtts");
// var ffmpeg = require("fluent-ffmpeg");

// const numberOfProcesses = 10;
// const maxChapters = 2; //process.env.MAX_CHAPTERS;
// var chaptersDone = 0;

// async function getChapter(chpt) {
//   if (chpt > maxChapters) {
//     return;
//   }
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(`${process.env.NOVEL_URL}${chpt}`);
//   const texts = await page.evaluate(() => {
//     return Array.from(
//       document.querySelectorAll(
//         "body > div.wrap > div > div.site-content > div > div > div > div > div > div > div.c-blog-post > div.entry-content > div > div > div > div > p"
//       )
//     ).map((p) => p.innerText);
//   });
//   await browser.close();
//   Promise.all(texts).then((texts) => {
//     let gtts = new gTTS(texts.join(" "), "en");
//     gtts.save(
//       `./mp3/${process.env.NOVEL_NAME} chapter ${chpt}.mp3`,
//       function (err, result) {
//         if (err) {
//           throw new Error(err);
//         }
//         let command = ffmpeg(process.env.IMAGE_PATH)
//           .setFfmpegPath(process.env.FFMPEG_PATH)
//           .input(`./mp3/${process.env.NOVEL_NAME} chapter ${chpt}.mp3`)
//           .save(`./mp4/${process.env.NOVEL_NAME} chapter ${chpt}.mp4`)
//           .on("end", function () {
//             console.log(`${++chaptersDone} / ${maxChapters}`);
//             getChapter(chpt + numberOfProcesses);
//           })
//           .on("error", function (err) {
//             throw new Error(err);
//           });
//       }
//     );
//   });
// }

// console.log("Starting...");
// for (let i = 1; i <= numberOfProcesses; i++) {
//   getChapter(i);
// }

var videoshow = require('videoshow')
 
var images = [
    process.env.IMAGE_PATH
]
 
var videoOptions = {
  fps: 25,
  videoBitrate: 1024,
  videoCodec: 'libx264',
  size: '640x?',
  audioBitrate: '128k',
  audioChannels: 2,
  format: 'mp4',
  pixelFormat: 'yuv420p'
}
 
videoshow(images, videoOptions)
  .audio('./mp3/Overgeared chapter 1.mp3')
  .save('./mp4/Overgeared chapter 1 Test.mp4')
  .on('start', function (command) {
    console.log('ffmpeg process started:', command)
  })
  .on('error', function (err, stdout, stderr) {
    console.error('Error:', err)
    console.error('ffmpeg stderr:', stderr)
  })
  .on('end', function (output) {
    console.error('Video created in:', output)
  })