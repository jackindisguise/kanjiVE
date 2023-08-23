const fs = require("fs");
const colors = require("colors");
const sub = fs.readFileSync("sub.txt", "utf8");
const type = fs.readFileSync("type.txt", "utf8");
const elements = [];
const types = [];

// convert sub.txt to sub.json
console.log(`Converting custom element association data to JSON.`.cyan)
console.log(`${">".cyan} Parsing ${"sub.txt".yellow}`);
for(let line of sub.split("\r\n")){
	let fields = line.split("\t");
	let element = fields[0];
	let subelements = fields[1].split(",");
	elements.push({element:element, parts:subelements});
}

console.log(`${">".cyan} Saving ${"sub.json".yellow}`);
fs.writeFileSync("sub.json", JSON.stringify(elements, null, "\t"));

// convert type.txt to type.json
console.log(`Converting custom stroke type association data to JSON.`.cyan)
console.log(`${">".cyan} Parsing ${"type.txt".yellow}`);
for(let line of type.split("\r\n")){
	let fields = line.split("\t");
	let element = fields[0];
	let strokes = fields[1].split(",");
	types.push({element:element, types:strokes});
}

console.log(`${">".cyan} Saving ${"type.json".yellow}`);
fs.writeFileSync("type.json", JSON.stringify(types, null, "\t"));