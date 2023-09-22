/**
 * Generates `data/anki-progressive.tsv`, a list of kanji ordered first by
 * the appearance of elements and second by the jouyou grade.
 * 
 * This works by first generating the kanjiVE.json file, which is sorted
 * purely based on the appearance of elements, with the exception of the
 * order.txt kanji being injected artificially into the ordering
 * (essentially forces the kanji for numbers 1-10 at the start).
 * 
 * Once this list is generated, it then forcibly moves kanji up or down
 * through the list based on the grade of the kanji in the jouyou list,
 * resulting in grade 1 kanji appearing first and secondary school kanji
 * appearing last.
 */
const fs = require("fs");
const colors = require("colors");
require("./ext");
const anki = require("./data/anki.json");
const ankiPath = "data/anki-progressive.tsv";
const lines = [];

// sort by grade
anki.sort(function(a,b){
	return a.grade - b.grade;
});

console.log(`Create progressive jouyou flashcard file for anki.`.cyan)
for(let kanji of anki){
	let named = [];
	for(let element of kanji.elements) named.push(`${element.element}[${element.name}]`);
	let line = [kanji.keyword, kanji.kanji, `grade${kanji.grade === 7 ? "S" : kanji.grade}`, kanji.frequency, named.join(" "), kanji.svg];
	lines.push(line.join("\t"));
}

console.log(` ${">".cyan} Saving ${ankiPath.yellow}`);
fs.writeFileSync(ankiPath, lines.join("\n"));