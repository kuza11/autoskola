let questions = require('./questions_checked.json');
let fs = require('fs');
questions.correct = 0;
questions.shown = 0;
questions.questions.forEach((question, index) => {
    /*if(questions.questions.slice(index + 1).find(q => q.link == question.link)){
        console.log(question)
        questions.questions.splice(index, 1);
    }*/
    question.lastSeen = 0;
    question.answered = 0;
    question.occurance = 0;
    question.shown = 0;
    question.successRate = 0;
})

fs.writeFileSync("./questions_checked.json", JSON.stringify(questions, null, 2), {encoding: 'utf8', flag: "w+"});