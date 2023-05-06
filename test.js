
//occurance = (answered * 10) / (1.1 - succesRate)



const puppeteer = require("puppeteer");
const fs = require("fs");
const questions = require("./questions.json");


const prompt = require('prompt-sync')();

init();

while (true) {

  let newest = {priority: -Infinity, question, questionNew};

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
    
  }else if(newest.questionNew != undefined){

  }else{
    
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
  let ans = parseInt(prompt(`${question.title}\n\n1. ${question.answers[0]}\n2. ${question.answers[1]}\n3. ${question.answers[2]}\n\n`));
  const textSelector = await page.waitForSelector(
    `text/${question.answers[ans-1]}`
  );
  if(ans == question.correct + 1){
    question.shown++;
    question.answered++;
    question.successRate = question.answered/question.shown;
    question.occurance = (question.shown * 10) / (1.1 - question.succesRate);
    console.log(`\ncorrect\n\nstats:\n\taccuracy: ${((questions.correct/questions.shown)*100).toFixed(1)}%\n\tanswered: ${questions.shown}\n\tremaining new: ${questions.questions.filter(x => x.shown=0).length}`);
  }else{
    question.shown++;
    question.successRate = question.answered/question.shown;
    question.occurance = (question.shown * 10) / (1.1 - question.succesRate);
    console.log(`\nincorrect\n\nstats:\n\taccuracy: ${((questions.correct/questions.shown)*100).toFixed(1)}%\n\tanswered: ${questions.shown}\n\tremaining new: ${questions.questions.filter(x => x.shown=0).length}`);
  }
}




//fs.writeFileSync("./questions.json", JSON.stringify(questions, null, 2), {encoding: 'utf8', flag: "w+"});