let questions = require('./questions.json');
let fs = require('fs');
questions.questions.forEach((question, index) => {
    if(questions.questions.slice(index + 1).find(q => q.link == question.link)){
        console.log(question)
        questions.questions.splice(index, 1);
    }
})

fs.writeFileSync("./questions.json", JSON.stringify(questions, null, 2), {encoding: 'utf8', flag: "w+"});