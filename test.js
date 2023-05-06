
//occurance = (answered * 10) / (1.1 - successRate)



const puppeteer = require("puppeteer");
const fs = require("fs");
const questions = require("./questions.json");


const prompt = require('prompt-sync')();

run();

async function run(){
  await init();
  while (true) {

    let newest = {priority: -Infinity, question: undefined, questionNew: undefined};
  
    for(let question of questions.questions){
      if(question.shown != 0){
        if(newest.priority < questions.shown - (question.shown + question.occurance)){
          newest.priority = questions.shown - (question.shown + question.occurance);
          newest.question = question;
        }
      }else if (newest.questionNew === undefined){
        newest.questionNew = question;
      }
    }
    if(newest.priority > -1){
      await show(newest.question);
    }else if(newest.questionNew != undefined){
      await show(newest.questionNew);
    }else{
      await show(newest.question);
    }
    
  }
  
}



async function init(){
  browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'],
    product: "firefox"
  });
  page = await browser.newPage();
}

async function show(question) {
  
  

  await page.goto(question.link, {
    waitUntil: "domcontentloaded"
  });

  // Set screen size
  //await page.setViewport({width: 1080, height: 1024});  
  let textArr = await page.evaluate('let children = document.getElementById("sekce-answer-container").children; let arr = []; for(let child of children){arr.push(child.children[1].textContent)} arr;');
  let prmpt = `\n${question.title}\n\n`;
  let cnt = 0;

  for(let text of textArr){
    cnt++;
    prmpt += `${cnt}. ${text}\n`;
  }
  console.log(prmpt + "\n");
  let ans = parseInt(prompt(">"));
  const textSelector = await page.waitForSelector(
    `text/${textArr[ans-1]}`
  );
  await (await textSelector.getProperty("parentElement")).click();
  questions.shown++;
  if(ans == question.correct + 1){
    questions.correct++;
    question.shown++;
    question.answered++;
    question.successRate = question.answered/question.shown;
    console.log(question.successRate);
    question.occurance = (question.shown * 10) / (1.1 - question.successRate);
    console.log(`\ncorrect\n\nstats:\n\taccuracy: ${((questions.correct/questions.shown)*100).toFixed(1)}%\n\tanswered: ${questions.shown}\n\tremaining new: ${questions.questions.filter(x => x.shown==0).length}`);
  }else{
    question.shown++;
    question.successRate = question.answered/question.shown;
    question.occurance = (question.shown * 10) / (1.1 - question.successRate);
    console.log(`\nincorrect\n\nstats:\n\taccuracy: ${((questions.correct/questions.shown)*100).toFixed(1)}%\n\tanswered: ${questions.shown}\n\tremaining new: ${questions.questions.filter(x => x.shown==0).length}`);
  }

  questions.questions.forEach((x) => {
    if(x.link == question.link){
      x.answered = question.answered;
      x.shown = question.shown;
      x.successRate = question.successRate;
      x.occurance = question.occurance;
    } 
  });

  fs.writeFileSync("./questions.json", JSON.stringify(questions, null, 2), {encoding: 'utf8', flag: "w+"});

  prompt("\npress enter to continue\n\n");

}




//fs.writeFileSync("./questions.json", JSON.stringify(questions, null, 2), {encoding: 'utf8', flag: "w+"});