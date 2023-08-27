// node includes
const fs = require("fs");

// local includes
const colors = require("colors");
require("./ext");

// local constants
const cArrow = ` ${">".cyan}`;

// convert jouyou.txt to jouyou.json
const jouyouPath = "data/jouyou.txt";
console.log(`Converting Jouyou data to JSON.`.cyan);
console.log(`${cArrow} Parsing ${jouyouPath.yellow}`);
const jouyouData = fs.readFileSync(jouyouPath, "utf8");
const jouyouList = jouyouData.split("\r\n");
const jouyouJSONPath = "data/jouyou.json";
console.log(`${cArrow} Saving ${jouyouJSONPath.yellow}`);
fs.writeFileSync(jouyouJSONPath, JSON.stringify(jouyouList));

// convert keywords.txt to keywords.json
const keywordsPath = "data/keywords.txt";
const keywordsJSONPath = "data/keywords.json";
const keywordsData = fs.readFileSync(keywordsPath, "utf8");
const keywordsLines = keywordsData.split("\r\n");
const keywords = {};
const _keywords = {};
console.log(`Converting keyword data to JSON.`.cyan);
console.log(`${cArrow} Parsing ${keywordsPath.yellow}`);
for(let line of keywordsLines){
	let fields = line.split("\t");
	if(_keywords[fields[1]]) console.log(`${cArrow} ${"WARNING".red.bold}: Duplicate keyword ${fields[1].blue} (${fields[0].blue} and ${_keywords[fields[1]].blue})`);
	keywords[fields[0]] = fields[1];
	_keywords[fields[1]] = fields[0];
}
console.log(`${cArrow} Saving ${keywordsJSONPath.yellow}`);
fs.writeFileSync(keywordsJSONPath, JSON.stringify(keywords));

// convert element.txt to element.json
const subPath = "data/element.txt";
const sub = fs.readFileSync(subPath, "utf8");
const subJSONPath = "data/element.json";
const elements = [];
const elementSearch = {};
console.log(`Converting custom element association data to JSON.`.cyan);
console.log(`${cArrow} Parsing ${subPath.yellow}`);
let subSplit = sub.split("\r\n");
for(let i=0;i<subSplit.length;i++){
	let line = subSplit[i];
	let fields = line.split("\t");
	let element = fields[0];
	let subelements = fields[1].split(",");
	if(!elementSearch[element]){
		let entry = {element:element, parts:subelements}
		elements.push(entry);
		elementSearch[element] = entry;
	} else {
		console.log(`${"WARNING".red.bold}: Duplicate entry for ${element.red}.`)
		elementSearch[element].parts.pushArray(subelements);
	}
}

// handle recursive element inclusion
function include(array, part){
	if(elementSearch[part]){
		array.push(part);
		for(let _part of elementSearch[part].parts) include(array, _part);
	} else array.push(part);
}

console.log(`${cArrow} Recursive inclusion of parts.`);
for(let element of elements){
	let safe = [];
	for(let part of element.parts) include(safe, part);
	element.parts = safe;
}

console.log(`${cArrow} Saving ${subJSONPath.yellow}`);
fs.writeFileSync(subJSONPath, JSON.stringify(elements, null, "\t"));

// convert type.txt to type.json
const typePath = "data/type.txt";
const type = fs.readFileSync(typePath, "utf8");
const typeJSONPath = "data/type.json";
const types = [];
console.log(`Converting custom stroke type association data to JSON.`.cyan)
console.log(`${cArrow} Parsing ${typePath.yellow}`);
for(let line of type.split("\r\n")){
	let fields = line.split("\t");
	let element = fields[0];
	let strokes = fields[1].split(",");
	types.push({element:element, types:strokes});
}

console.log(`${cArrow} Saving ${typeJSONPath.yellow}`);
fs.writeFileSync(typeJSONPath, JSON.stringify(types, null, "\t"));

const orderPath = "data/order.txt";
const orderData = fs.readFileSync(orderPath, "utf8");
const orderJSONPath = "data/order.json";
const order = {};
console.log(`Converting customer order data to JSON.`.cyan);
console.log(`${cArrow} Parsing ${orderPath.yellow}`);
for(let line of orderData.split("\r\n")){
	let fields = line.split("\t");
	order[fields[0]] = fields[1];
}

console.log(`${cArrow} Saving ${orderJSONPath.yellow}`);
fs.writeFileSync(orderJSONPath, JSON.stringify(order, null, "\t"));

const frequencyPath = "data/frequency.txt";
const frequencyData = fs.readFileSync(frequencyPath, "utf8");
const frequencyJSONPath = "data/frequency.json";
const frequency = {};
console.log(`Converting frequency data to JSON.`.cyan);
console.log(`${cArrow} Parsing ${frequencyPath.yellow}`);
for(let line of frequencyData.split("\r\n")){
	let fields = line.split("\t");
	frequency[fields[0]] = Number(fields[1]);
}

console.log(`${cArrow} Saving ${frequencyJSONPath.yellow}`);
fs.writeFileSync(frequencyJSONPath, JSON.stringify(frequency, null, "\t"));