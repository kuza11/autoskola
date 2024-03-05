const puppeteer = require("puppeteer");
const fs = require("fs");
const links = require('./links.json');


let cmd = `
let rows = document.getElementsByClassName("col")[0].getElementsByTagName("ul")[0].getElementsByTagName("li");
let arr = [];
for(row of rows){
  arr.push(row.children[0].href);
}
arr;
`;


async function a() {
  const browser = await puppeteer.launch({
    headless: "new"
  });
  const page = await browser.newPage();

  await page.goto('https://www.autoskola-testy.cz/prohlizeni_otazek.php?okruh=7', {
    waitUntil: "domcontentloaded"
  });

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

  let arr = await page.evaluate(cmd)

  links.push(...arr);
  console.log(links);



  fs.writeFileSync("./links.json", JSON.stringify(links, null, 2), {encoding: 'utf8'})


  // Wait and click on first result

  // Locate the full title with a unique string

  await browser.close();
  return;
}

a();
