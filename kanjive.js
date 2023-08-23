const fs = require("fs");
const kanjivg = require("./kanjivg.json");
const sub = require("./sub.json");
const outJSON = "kanjive.json";
const outTXT = "kanjive.txt";

// use separately compiled data to add new visual elements to kanji
const added = 0;
for(let kanji of kanjivg){
	// for sorting purposes, create new elements array
	let newElements = [];

	// check if this kanji has custom constituent parts
	for(let element of sub){
		if(element.element === kanji){
			newElements = newElements.concat(element.parts);
			added += element.parts.length;
		}
	}

	// check each element for custom constituent parts
	for(let element of kanji.elements){
		newElements.push(element);
		for(let _element of sub){
			if(_element.element === element){
				newElements = newElements.concat(_element.parts);
				added += element.parts.length;
			}
		}
	}

	// replace
	kanji.elements = newElements;
}

let lines = [];
for(let kanji of kanjivg){
	lines.push(`${kanji.kanji}\t${kanji.elements.join(",")}\t${kanji.types.join(",")}`)
}

fs.writeFileSync(outTXT, lines.join("\n"));
fs.writeFileSync(outJSON, JSON.stringify(kanjivg, null, "\t"));