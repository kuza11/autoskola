const links = require('./links.json');
const linksB = require('./links_backup.json');
const fs = require('fs');
let linksOut = [];

linksB.forEach((link) => {
    if(!links.includes(link)){
        linksOut.push(link);
    }
});

fs.writeFileSync("./links_rest.json", JSON.stringify(linksOut, null, 2), {encoding: 'utf8', flag: "w+"});