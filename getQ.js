const puppeteer = require("puppeteer");
const fs = require("fs");
const links = require('./links.json');
const questions = require("./questions.json");

const cmd = `

function answers(){
  let ans = document.getElementsByClassName("answer");
  let arr = [];
  let correct = -1;
  for (answer of ans){
    arr.push(answer.children[1].textContent);
    if(answer.className == "answer otazka_spravne"){
      correct = arr.length - 1;
    }
  }
  return {title: document.getElementsByClassName("question-text")[0].textContent.trim(), answers: arr, correct: correct};
}
answers()`;

let arr = [];
let browser;
let page;

async function init(){
  browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'],
    product: "firefox"
  });
  page = await browser.newPage();
}
async function get(url) {
  

  await page.goto(url, {
    waitUntil: "domcontentloaded"
  });

  // Set screen size
  //await page.setViewport({width: 1080, height: 1024});

  let res = await page.evaluate(cmd);
  res.link = url;

  console.log(res);
  return res
}

async function run(){
await init();
  for(let link of links){
    console.log(link);
    questions.push(await get(link));
    fs.writeFileSync("./questions2.json", JSON.stringify(questions, null, 2), {encoding: 'utf8', flag: "w+"});
  }

}

run();