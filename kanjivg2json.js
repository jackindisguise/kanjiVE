const fs = require("fs");

// use jouyou kanji to search for elements
const jouyou = fs.readFileSync("jouyou.txt", "utf8");
const jouyouList = jouyou.split("\r\n");

// load kanjivg, store data in JSON
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
			if(result[1] === kanji) continue;
			if(elements.indexOf(result[1]) !== -1) continue;
			elements.push(result[1]);
		}

		// scrape types for this kanji
		let typeRule = /kvg:type="(.*?)"/g;
		for(let result=typeRule.exec(data); result; result=typeRule.exec(data)) {
			if(types.indexOf(result[1]) !== -1) continue;
			types.push(result[1]);
		}
	}

	// push scraped data for this kanji
	scraped.push({kanji:kanji, elements:elements, types:types});
}

// sort by element length and types length
scraped.sort(function(a,b){
	return (a.elements.length - b.elements.length) || (a.types.length - b.types.length);
});

// create tab-delimited file
const outTXT = "kanjivg.txt";
const text  = [];
for(let kanji of scraped) text.push(`${kanji.kanji}\t${kanji.elements.join(",")}\t${kanji.types.join(",")}`);

// write files
fs.writeFileSync(outJSON, JSON.stringify(scraped, null, "\t"));
fs.writeFileSync(outTXT, text.join("\n"));