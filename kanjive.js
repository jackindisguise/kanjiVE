// node includes
const fs = require("fs");

// npm includes
const colors = require("colors");

// local includes
require("./ext");
const kanjivg = require("./data/kanjivg.json");
const assocs = require("./data/associations.json");
const types = require("./data/type.json");
const order = require("./data/order.json");

// local constants
const cArrow = ` ${">".cyan}`;
const outJSON = "data/kanjive.json";
const outTXT = "data/kanjive.txt";

console.log(`Add visual elements not tracked by KanjiVG.`.cyan)
{
	// use separately compiled data to associate visual elements to kanji
	console.log(`${cArrow} Adding manual kanji associations.`);
	const found = {};
	function find(element){
		if(!found[element.element]) found[element.element] = 1;
		else found[element.element]++;
	}

	for(let kanji of kanjivg){
		// for sorting purposes, create new elements array
		let newElements = [];

		// check if this kanji has custom constituent parts
		for(let element of assocs){
			if(element.element === kanji.kanji){
				newElements = newElements.concat(element.parts);
				find(element);
			}
		}

		// check each element for custom constituent parts
		for(let element of kanji.elements){
			//if(element === "丶") continue; // ignore this...
			if(kanji.kanji === "滝" && element === "龍") continue; // weird case
			newElements.push(element);
			for(let _element of assocs){
				if(_element.element === element){
					newElements = newElements.concat(_element.parts);
					find(_element);
				}
			}
		}

		// replace
		kanji.elements = [...new Set(newElements)];
	}

	for(let sub of assocs){
		console.log(`${cArrow} ${sub.element.red} (${sub.parts.join("").magenta}): found ${found[sub.element]||0} ${(found[sub.element]||0) == 1 ? "instance" : "instances"}.`)
	}
}

{
	console.log(`${cArrow} Adding custom elements using stroke types.`.cyan)
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
			if(kanji.elements.indexOf(type.element) === -1) kanji.elements.push(type.element);
		}

		console.log(`${cArrow} ${type.element.red} (${type.types.replace(function(v){return v.blue}).join(">")}): found ${found[type.element]||0} ${(found[type.element]||0) == 1 ? "instance" : "instances"}.`)
	}
}

// KanjiVG uses 人 instead of 𠆢.
// when we detect 𠆢, 人 will remain.
// remove 人 when it follows 𠆢.
console.log(`${cArrow} Replace all occurrences of 𠆢,人 with 𠆢.`);
for(let kanji of kanjivg){
	let elements = kanji.elements.join(",");
	if(elements.indexOf("𠆢,人") !== -1) kanji.elements = elements.replace("𠆢,人", "𠆢").split(",");
}

console.log(`${cArrow} Sorting kanji by element and type length.`);
function getKanjiElementLength(kanji){
	for(let element of kanji.elements){

	}
}
kanjivg.sort(function(a,b){
	return a.elements.length - b.elements.length || a.types.length - b.types.length;
})

// track kanji
let usedKanji = [];
for(let kanji of kanjivg) usedKanji.push(kanji.kanji);

// track element-only elements
let elementOnly = [];
for(let kanji of kanjivg) for(let element of kanji.elements) if(!usedKanji.contains(element)) elementOnly.push(element);

/** stupid complicated thing cause i dunno how to do a proper dependency list here */
let kanjive = [];
let found = [];

function getKanji(kanji){
	for(let _kanji of kanjivg){
		if(_kanji.kanji === kanji) return _kanji;
	}
}

function addDerivatives(kanji, level){
	let has = false;
	for(let sKanji of kanjivg){
		if(found.contains(sKanji.kanji)) continue; // kanji is found already
		if(!sKanji.elements.contains(kanji.kanji)) continue; // must contain this kanji as an element

		// ensure this kanji only has found elements
		let skip = false;
		let _f = [];
		for(let element of sKanji.elements) {
			if(elementOnly.contains(element)) continue; // don't skip element-only elements
			if(found.contains(element)) { _f.push(element); continue; } // it's a kanji element that was found, don't skip
			skip = true;
		}

		if(skip) continue;
		else if(!has) {
			has = true;
			//console.log(`${"-> ".repeat(level)}Adding derivatives of ${kanji.kanji.red.bold}`);
		}
		
		add(sKanji, level+1);
	}
}

// adds this kanji and any kanji that are derivatives of it
function add(kanji, level){
	if(!kanjive.contains(kanji)) {
		//console.log(`${"-> ".repeat(level?level:1)}Adding ${kanji.kanji.yellow.bold}`)
		kanjive.push(kanji);
	}
	if(!found.contains(kanji.kanji)) found.push(kanji.kanji);
	addDerivatives(kanji, level?level+1:1);

	// if there's a pre-determined order, add the next in the order
	if(order[kanji.kanji] && !found.contains(order[kanji.kanji])) {
		//console.log(`${cArrow} Respecting pre-determined order: ${kanji.kanji.red} > ${order[kanji.kanji].red}`)
		add(getKanji(order[kanji.kanji]), level?level:1);
	}
}

console.log(`${cArrow} Composing kanjiVE list order based on element appearance.`);
while(kanjive.length < kanjivg.length){
	for(let kanji of kanjivg){
		if(found.contains(kanji.kanji)) continue; // ignore found kanji
		let doAdd = true;
		for(let part of kanji.elements){
			if(elementOnly.contains(part)) { continue; } // don't worry about element-only elements
			if(!found.contains(part)) { doAdd = false; break; } // this kanji has kanji elements that haven't been introduced yet
		}

		if(doAdd){
			add(kanji);
			break; // start from scratch on every add
		}
	}
}

// write JSON file
console.log(`${cArrow} Saving ${outJSON.yellow}`);
fs.writeFileSync(outJSON, JSON.stringify(kanjive, null, "\t"));

// create tab-delimited text file
let lines = [];
for(let kanji of kanjive) lines.push(`${kanji.kanji}\t${kanji.elements.join(",")}\t${kanji.types.join(",")}`)
console.log(`${cArrow} Saving ${outTXT.yellow}`);
fs.writeFileSync(outTXT, lines.join("\n"));

{
	// save element data separately
	console.log(`${cArrow} Tracking element usage data.`);
	const jouyouPlain = require("./data/jouyouPlain.json");
	const elementsTXT = "data/elements.txt";
	const elementsJSON = "data/elements.json";
	const elements = [];
	const elementsSearch = {};
	for(let kanji of kanjive) {
		for(let element of kanji.elements) {
			if(elementsSearch[element]) {
				elementsSearch[element].appearances.push(kanji.kanji);
			} else {
				elementsSearch[element] = {element:element, isJouyouKanji:jouyouPlain.contains(element), appearances:[kanji.kanji]};
				elements.push(elementsSearch[element]);
			}
		}
	}

	console.log(`${cArrow} Sorting element list descending by appearance count.`);
	elements.sort(function(a,b){
		return b.appearances.length - a.appearances.length;
	})

	console.log(`${cArrow} Saving ${elementsJSON.yellow}`);
	fs.writeFileSync(elementsJSON, JSON.stringify(elements, null, "\t"));

	const lines = [];
	for(let element of elements) lines.push(`${element.element}\t${element.appearances}`);
	console.log(`${cArrow} Saving ${elementsTXT.yellow}`);
	fs.writeFileSync(elementsTXT, lines.join("\n"));
}