const fs = require("fs");
const colors = require("colors");
const kanjive = require("./data/kanjive.json");
const lines = [];

console.log(`Create flashcard file for anki.`.cyan)
for(let kanji of kanjive){
	lines.push(`${kanji.kanji}\t${kanji.elements.join("")}`);
}

console.log(` ${">".cyan} Saving ${"data/anki.tsv".yellow}`);
fs.writeFileSync("data/anki.tsv", lines.join("\n"));