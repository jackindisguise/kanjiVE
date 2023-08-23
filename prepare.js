const fs = require("fs");
const subs = fs.readFileSync("sub.txt", "utf8");
const elements = [];

// convert sub.txt to sub.json
for(let line of subs.split("\r\n")){
	let fields = line.split("\t");
	let element = fields[0];
	let subelements = fields[1].split(",");
	elements.push({element:element, parts:subelements});
}

fs.writeFileSync("sub.json", JSON.stringify(elements, null, "\t"));