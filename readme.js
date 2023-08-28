const fs = require("fs");
const colors = require("colors");
const cArrow = " >".cyan;
require("./ext");

// generate kanji-element readme
console.log(`Generating README files.`.cyan)
const jouyou = require("./data/jouyou.json");
const kanjive = require("./data/kanjive.json");
const elements = [];
const elementsSearch = {};
const kanjiSearch = {};
for(let kanji of kanjive) {
	kanjiSearch[kanji.kanji] = kanji.elements;
	for(let element of kanji.elements) {
		if(elementsSearch[element]) {
			elementsSearch[element].appearances.push(kanji.kanji);
		} else {
			elementsSearch[element] = {element:element, appearances:[kanji.kanji]};
			elements.push(elementsSearch[element]);
		}
	}
}

// sort elements descending by appearance count
elements.sort(function(a,b){return b.appearances.length - a.appearances.length;});

// generate elements readme file
{
	const elementsMD = "elements.md";
	console.log(`${cArrow} Generating ${elementsMD.blue}`);
	const sections = ["**All data based on analyzing 2136 Jouyou kanji.**"];
	{
		let table = "Elements w/o Kanji";
		console.log(`${cArrow} Generating ${elementsMD.blue} table: ${table.yellow}`);
		const lines = [];
		let safe = [];
		for(let element of elements) if(!jouyou.contains(element.element)) safe.push(element.element);
		safe = safe.replace(function(a){return `\`${a}\``;});
		lines.push(`# ${table}`);
		lines.push("* Sorted by most used to least used.");
		lines.push("* Does not include kanji used as elements in other kanji.")
		lines.push(`* Total elements: ${safe.length}`, "");
		lines.push(safe.join(" "));
		sections.push(lines.join("\n"));
	}

	{
		let table = "Elements w/ Kanji";
		console.log(`${cArrow} Generating ${elementsMD.blue} table: ${table.yellow}`);
		const lines = [];
		let safe = [];
		for(let element of elements) safe.push(element.element);
		safe = safe.replace(function(a){return `\`${a}\``;});
		lines.push(`# ${table}`);
		lines.push("* Sorted by most used to least used.");
		lines.push("* Includes kanji used as elements in other kanji.")
		lines.push(`* Total elements: ${safe.length}`, "");
		lines.push(safe.join(" "));
		sections.push(lines.join("\n"));
	}

	{
		let table = "Element Usage";
		console.log(`${cArrow} Generating ${elementsMD.blue} table: ${table.yellow}`);
		const lines = [
			`# ${table}`,
			"* Sorted by most used to least used.",
			"* Does not include kanji used as elements in other kanji.",
			"",
			"| Element | Kanji |",
			"| - | - |"
		];
		for(let element of elements) if(!jouyou.contains(element.element)) lines.push(`| ${element.element} | ${element.appearances.replace(function(a){return "`"+a+"`";}).join(" ")} |`);
		sections.push(lines.join("\n"));
	}

	console.log(`${cArrow} Saving ${elementsMD.blue}`);
	fs.writeFileSync(elementsMD, sections.join("\n\n"));
}

// generate kanji readme file
{
	const kanjiMD = "kanji.md";
	const sections = ["**All data based on analyzing 2136 Jouyou kanji.**"];
	console.log(`${cArrow} Generating ${kanjiMD.blue}`);
	{
		let table = "Kanji Elements";
		console.log(`${cArrow} Generating ${kanjiMD.blue} table: ${table.yellow}`);
		let lines = [
			`# ${table}`,
			"* Sorted by number of kanji elements first and total elements second.",
			"",
			"| Kanji | Elements |",
			"| - | - |"
		];

		kanjive.sort(function(a,b){
			let akan = [];
			for(let ele of a.elements) if(jouyou.contains(ele)) akan.push(ele);
			let bkan = [];
			for(let ele of b.elements) if(jouyou.contains(ele)) bkan.push(ele);
			return akan.length - bkan.length || a.elements.length - b.elements.length;
		});
		for(let kanji of kanjive) lines.push(`| ${kanji.kanji} | ${kanji.elements.replace(function(a){return `\`${a}\``;}).join(" ")} |`);
		sections.push(lines.join("\n"));
	}

	console.log(`${cArrow} Saving ${kanjiMD.blue}`);
	fs.writeFileSync(kanjiMD, sections.join("\n\n"));
}