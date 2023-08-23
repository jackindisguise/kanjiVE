const fs = require("fs");
const kanjivg = require("./kanjivg.json");
const sub = require("./sub.json");
const outJSON = "kanjive.json";
const outTXT = "kanjive.txt";

for(let kanji of kanjivg){
	for(let element of sub){
		if(element.element === kanji){
			kanji.elements = kanji.elements.concat(element.parts);
		}
	}

	for(let element of kanji.elements){
		for(let _element of sub){
			if(_element.element === element){
				kanji.elements = kanji.elements.concat(_element.parts);
			}
		}
	}
}

let lines = [];
for(let kanji of kanjivg){
	lines.push(`${kanji.kanji}\t${kanji.elements.join(",")}\t${kanji.types.join(",")}`)
}

fs.writeFileSync(outTXT, lines.join("\n"));
fs.writeFileSync(outJSON, JSON.stringify(kanjivg, null, "\t"));