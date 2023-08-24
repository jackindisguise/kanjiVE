const fs = require("fs");
const colors = require("colors");
const subPath = "data/sub.txt";
const sub = fs.readFileSync(subPath, "utf8");
const subJSONPath = "data/sub.json";
const typePath = "data/type.txt";
const type = fs.readFileSync(typePath, "utf8");
const typeJSONPath = "data/type.json";
const elements = [];
const types = [];

// convert sub.txt to sub.json
console.log(`Converting custom element association data to JSON.`.cyan)
console.log(`${">".cyan} Parsing ${subPath.yellow}`);
for(let line of sub.split("\r\n")){
	let fields = line.split("\t");
	let element = fields[0];
	let subelements = fields[1].split(",");
	elements.push({element:element, parts:subelements});
}

console.log(`${">".cyan} Saving ${subJSONPath.yellow}`);
fs.writeFileSync(subJSONPath, JSON.stringify(elements, null, "\t"));

// convert type.txt to type.json
console.log(`Converting custom stroke type association data to JSON.`.cyan)
console.log(`${">".cyan} Parsing ${typePath.yellow}`);
for(let line of type.split("\r\n")){
	let fields = line.split("\t");
	let element = fields[0];
	let strokes = fields[1].split(",");
	types.push({element:element, types:strokes});
}

console.log(`${">".cyan} Saving ${typeJSONPath.yellow}`);
fs.writeFileSync(typeJSONPath, JSON.stringify(types, null, "\t"));