const fs = require("fs");
const colors = require("colors");
require("./ext");
const kanjive = require("./data/kanjive.json");
const frequency = require("./data/frequency.json");
const keywords = require("./data/keywords.json");
const lines = [];

kanjive.sort(function(a,b){
	return frequency[a.kanji] - frequency[b.kanji];
});

console.log(`Create flashcard file for anki.`.cyan)
const usedKeywords = [];
for(let kanji of kanjive){
	if(!keywords[kanji.kanji]){
		console.log(`${"WARNING".red.bold}: ${kanji.kanji.red} has no keyword!`)
		continue;
	}
	if(usedKeywords.contains(keywords[kanji.kanji])) console.log(`${"WARNING".bold.red}: Duplicate keyword ${keywords[kanji.kanji].red}`);
	else usedKeywords.push(keywords[kanji.kanji]);
	let line = [keywords[kanji.kanji], kanji.kanji, kanji.elements.join("")];
	/** personal testing stuff */
//	if(kanji.kanji !== "𠮟") line.push(`"<img src=""0${kanji.kanji.charCodeAt().toString(16)}.svg"">"`); /// 𠮟 has no SVG file
//	else line.push("");
	lines.push(line.join("\t"));
}

console.log(` ${">".cyan} Saving ${"data/anki.tsv".yellow}`);
fs.writeFileSync("data/anki.tsv", lines.join("\n"));