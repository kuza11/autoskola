
//occurance = (answered * 10) / (1.1 - successRate)



import puppeteer from 'puppeteer';
import fs from 'fs';
import questions from './questions.json' assert { type: 'json' };
import chalk from 'chalk';


import prompt from 'prompt-sync';

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


let page;
async function init(){
  let browser = await puppeteer.launch({
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
  let textArr = await page.evaluate('let children = document.getElementById("sekce-answer-container").children; let arr = []; for(let child of children){arr.push(child.children[1].textContent.trim())} arr;');
  let prmpt = `\n${chalk.white.bold(question.title)}\n\n`;
  let cnt = 0;

  for(let text of textArr){
    cnt++;
    prmpt += `${cnt}. ${text}\n`;
  }
  console.log(prmpt + "\n");
  
  
  let res = prompt()(">");

  while(res != "1" && res != "2" && res != "3" && res != "end"){
    res = prompt()(">");
  };

  if(res == "end"){
    return process.exit("end");
  }

  let ans = parseInt(res);
  const textSelector = await page.waitForSelector(
    `text/${textArr[ans-1]}`
  );
  await (await textSelector.getProperty("parentElement")).click();
  questions.shown++;
  if(textArr[ans - 1] == question.answers[question.correct]){
    questions.correct++;
    question.shown++;
    question.answered++;
    question.successRate = question.answered/question.shown;
    question.occurance = (question.shown * 10) / (1.1 - question.successRate);
    console.log(`\n${chalk.green.bold("correct")}\n\n${chalk.yellow.underline("stats:")}\n\t${chalk.yellow(`accuracy: ${((questions.correct/questions.shown)*100).toFixed(1)}%\n\tanswered: ${questions.shown}\n\tremaining new: ${questions.questions.filter(x => x.shown==0).length}`)}`);
  }else{
    question.shown++;
    question.successRate = question.answered/question.shown;
    question.occurance = (question.shown * 10) / (1.1 - question.successRate);
    console.log(`\n${chalk.red.bold("incorrect")}\n${chalk.green("correct: " + question.answers[question.correct])}\n\n\n${chalk.yellow.underline("stats:")}\n\t${chalk.yellow(`accuracy: ${((questions.correct/questions.shown)*100).toFixed(1)}%\n\tanswered: ${questions.shown}\n\tremaining new: ${questions.questions.filter(x => x.shown==0).length}`)}`);
    const textSelector2 = await page.waitForSelector(
      `text/${question.answers[question.correct]}`
    );
    await (await textSelector2.getProperty("parentElement")).click();
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

  prompt()("\npress enter to continue\n\n");

}




//fs.writeFileSync("./questions.json", JSON.stringify(questions, null, 2), {encoding: 'utf8', flag: "w+"});