const fs = require("fs");
const kanji = process.argv[2];
const hex = kanji.charCodeAt().toString(16);
const file = `0${hex}.svg`;
const exists = fs.existsSync(`strokes/${file}`);
if(exists) console.log(fs.readFileSync(`strokes/${file}`, "utf8"));