// node includes
const fs = require("fs");

// npm includes
const colors = require("colors");

// local constants
const cArrow = ` ${">".cyan}`;

// load kanjivg files, parse and store data in JSON
// jouyou kanji act as the basis of project
const jouyou = require("./data/jouyou.json");
const kanjivgDir = "strokes";
const outJSONPath = "data/kanjivg.json";
const scraped = [];
console.log(`Converting KanjiVG data to JSON.`.cyan)
console.log(`${cArrow} Reading ${"Jouyou".blue} kanji data from ${"KanjiVG".green}.`);
for(let kanji of jouyou){
	let elements = [];
	let types = [];

	// parse kanjiVG data
	let hex = kanji.charCodeAt().toString(16);
	let fileName = `${kanjivgDir}/0${hex}.svg`;
	if(fs.existsSync(fileName)){
		let data = fs.readFileSync(fileName, "utf8");

		// scrape elements for this kanji
		let elementRule = /kvg:element="(.*?)"/g;
		for(let result=elementRule.exec(data); result; result=elementRule.exec(data)){
			let e = result[1];
			if(e === "CDP-8BC4") e = "泉"; // not correct but close to correct
			if(e === kanji) continue;
			if(elements.indexOf(e) !== -1) continue;
			elements.push(e);
		}

		// scrape types for this kanji
		let typeRule = /kvg:type="(.*?)"/g;
		for(let result=typeRule.exec(data); result; result=typeRule.exec(data)) {
			types.push(result[1]);
		}
	} else {
		console.log(`${cArrow} ${"WARNING".red}: ${"KanjiVG".green} lacks data for ${kanji.red}.`);
	}

	// push scraped data for this kanji
	scraped.push({kanji:kanji, elements:elements, types:types});
}

// sort by element length and types length
console.log(`${cArrow} Sorting kanji by element and types length.`);
scraped.sort(function(a,b){
	return (a.elements.length - b.elements.length) || (a.types.length - b.types.length);
});


// write JSON file
console.log(`${cArrow} Saving ${outJSONPath.yellow}`);
fs.writeFileSync(outJSONPath, JSON.stringify(scraped, null, "\t"));

// create tab-delimited text file
const outTXTPath = "data/kanjivg.txt";
const lines  = [];
for(let kanji of scraped) lines.push(`${kanji.kanji}\t${kanji.elements.join(",")}\t${kanji.types.join(",")}`);
console.log(`${cArrow} Saving ${outTXTPath.yellow}`);
fs.writeFileSync(outTXTPath, lines.join("\n"));