const questions = require('./questions_checked.json');
let remainingNew = questions.questions.filter(x => x.shown==0).length;
console.log(remainingNew, questions.questions.length)