const fs = require("fs");
const colors = require("colors");
const repl = require("./ext").repl;
const kanjivg = require("./data/kanjivg.json");
const subs = require("./data/sub.json");
const types = require("./data/type.json");
const outJSON = "data/kanjive.json";
const outTXT = "data/kanjive.txt";

console.log(`Add visual elements not tracked by KanjiVG.`.cyan)
{
	console.log(`${">".cyan} Adding custom elements using other elements.`);

	// use separately compiled data to add new visual elements to kanji
	const found = {};
	function find(element){
		if(!found[element.element]) found[element.element] = 1;
		else found[element.element]++;
	}

	for(let kanji of kanjivg){
		// for sorting purposes, create new elements array
		let newElements = [];

		// check if this kanji has custom constituent parts
		for(let element of subs){
			if(element.element === kanji.kanji){
				newElements = newElements.concat(element.parts);
				find(element);
			}
		}

		// check each element for custom constituent parts
		for(let element of kanji.elements){
			if(element === "丶") continue; // ignore this...
			newElements.push(element);
			for(let _element of subs){
				if(_element.element === element){
					newElements = newElements.concat(_element.parts);
					find(_element);
				}
			}
		}

		// replace
		kanji.elements = [...new Set(newElements)];
	}

	for(let sub of subs){
		console.log(`${">".cyan} ${sub.element.red} (${sub.parts.join("").magenta}): found ${found[sub.element]||0} ${(found[sub.element]||0) == 1 ? "instance" : "instances"}.`)
	}
}

{
	console.log(`${">".cyan} Adding custom elements using stroke types.`.cyan)
	const found = {};
	function find(type){
		if(!found[type.element]) found[type.element] = 1;
		else found[type.element]++;
	}

	for(let type of types){
		let tTypes = type.types.join(",");
		for(let kanji of kanjivg){
			let kTypes = kanji.types.join(",");
			if(kTypes.indexOf(tTypes) === -1) continue;
			find(type);
			kanji.elements.push(type.element);
			kanji.elements = [...new Set(kanji.elements)]; // protect against duplicates
		}

		console.log(`${">".cyan} ${type.element.red} (${repl(type.types, function(v){return v.blue}).join(">")}): found ${found[type.element]||0} ${(found[type.element]||0) == 1 ? "instance" : "instances"}.`)
	}
}

// KanjiVG uses 人 instead of 𠆢
// when we add 𠆢 back, 人 remains
// remove 人 when it follows 𠆢
console.log(`${">".cyan} Replace all occurrences of 𠆢,人 with 𠆢.`);
for(let kanji of kanjivg){
	let elements = kanji.elements.join(",");
	if(elements.indexOf("𠆢,人") !== -1) kanji.elements = elements.replace("𠆢,人", "𠆢").split(",");
}

console.log(`${">".blue} Sorting kanji by element and type length.`);
kanjivg.sort(function(a,b){
	return a.elements.length - b.elements.length || a.types.length - b.types.length;
})

let lines = [];
for(let kanji of kanjivg){
	lines.push(`${kanji.kanji}\t${kanji.elements.join(",")}\t${kanji.types.join(",")}`)
}

console.log(`${">".cyan} Saving ${outTXT.yellow}`);
fs.writeFileSync(outTXT, lines.join("\n"));

console.log(`${">".cyan} Saving ${outJSON.yellow}`);
fs.writeFileSync(outJSON, JSON.stringify(kanjivg, null, "\t"));