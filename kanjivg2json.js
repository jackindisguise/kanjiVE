const fs = require("fs");
const colors = require("colors");

// use jouyou kanji to search for elements
const jouyou = fs.readFileSync("jouyou.txt", "utf8");
const jouyouList = jouyou.split("\r\n");

// load kanjivg, store data in JSON
console.log(`Converting KanjiVG data to JSON.`.cyan)
console.log(`${">".cyan} Reading ${"Jouyou".blue} kanji data from ${"KanjiVG".green}.`);
const kanjivgDir = "strokes";
const outJSON = "kanjivg.json";
const scraped = [];
for(let kanji of jouyouList){
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
			if(e === "CDP-8BC4") e = "泉";
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
		console.log(`${">".cyan} ${"WARNING".red}: ${"KanjiVG".green} lacks data for ${kanji.red}.`);
	}

	// push scraped data for this kanji
	scraped.push({kanji:kanji, elements:elements, types:types});
}

// sort by element length and types length
console.log(`${">".cyan} Sorting scraped data by element and type length.`);
scraped.sort(function(a,b){
	return (a.elements.length - b.elements.length) || (a.types.length - b.types.length);
});

// create tab-delimited file
console.log(`${">".cyan} Generating tab-delimited text file of KanjiVG data.`);
const outTXT = "kanjivg.txt";
const text  = [];
for(let kanji of scraped) text.push(`${kanji.kanji}\t${kanji.elements.join(",")}\t${kanji.types.join(",")}`);

// write files
console.log(`${">".cyan} Saving ${outJSON.yellow}`);
fs.writeFileSync(outJSON, JSON.stringify(scraped, null, "\t"));

console.log(`${">".cyan} Saving ${outTXT.yellow}`);
fs.writeFileSync(outTXT, text.join("\n"));