const fs = require("fs");
const colors = require("colors");
const cArrow = " >".cyan;
require("./ext");

// generate kanji-element readme
console.log(`Generating README files.`.cyan)
const jouyou = require("./data/jouyou.json");

// generate elements readme file
{
	const elements = require("./data/elements.json");
	const elementsMD = "elements.md";
	console.log(`${cArrow} Generating ${elementsMD.blue}`);
	const sections = [];
	{
		let table = "Elements w/o Kanji";
		console.log(`${cArrow} Generating ${elementsMD.blue} table: ${table.yellow}`);
		const lines = [];
		let safe = [];
		for(let element of elements) if(!element.isJouyouKanji) safe.push(element.element);
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
		for(let element of elements) if(!element.isJouyouKanji) lines.push(`| ${element.element} | ${element.appearances.replace(function(a){return "`"+a+"`";}).join(" ")} |`);
		sections.push(lines.join("\n"));
	}

	console.log(`${cArrow} Saving ${elementsMD.blue}`);
	fs.writeFileSync(elementsMD, sections.join("\n\n"));
}

// generate progressive kanji readme file
{
	const progressiveMD = "kanjive.md";
	const sections = [];
	console.log(`${cArrow} Generating ${progressiveMD.blue}`);
	{
		let table = "Progressive Kanji Ordering";
		console.log(`${cArrow} Generating ${progressiveMD.blue} table: ${table.yellow}`);
		let lines = [
			`# ${table}`,
			"* Progressive ordering of kanji.",
			"* Standard ordering of the kanjiVE dataset.",
			"* Kanji only appear when all of the kanji that they are composed of are shown first.",
			"",
			"| Kanji | Elements |",
			"| - | - |"
		];

		const kanjive = require("./data/kanjive.json");
		for(let kanji of kanjive) lines.push(`| ${kanji.kanji} | ${kanji.elements.replace(function(a){return `\`${a}\``;}).join(" ")} |`);
		sections.push(lines.join("\n"));
	}

	console.log(`${cArrow} Saving ${progressiveMD.blue}`);
	fs.writeFileSync(progressiveMD, sections.join("\n\n"));
}

// generate kanji readme file
{
	const kanjiMD = "kanji.md";
	const sections = [];
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

		const kanjive = require("./data/kanjive.json");
		kanjive.sort(function(a,b){
			let akan = [];
			for(let ele of a.elements) if(jouyou.plain.contains(ele)) akan.push(ele);
			let bkan = [];
			for(let ele of b.elements) if(jouyou.plain.contains(ele)) bkan.push(ele);
			return akan.length - bkan.length || a.elements.length - b.elements.length;
		});
		for(let kanji of kanjive) lines.push(`| ${kanji.kanji} | ${kanji.elements.replace(function(a){return `\`${a}\``;}).join(" ")} |`);
		sections.push(lines.join("\n"));
	}

	console.log(`${cArrow} Saving ${kanjiMD.blue}`);
	fs.writeFileSync(kanjiMD, sections.join("\n\n"));
}

// generate kanji readme file
{
	const jouyouMD = "jouyou.md";
	const sections = [];
	console.log(`${cArrow} Generating ${jouyouMD.blue}`);
	{
		let table = "Jouyou Kanji";
		console.log(`${cArrow} Generating ${jouyouMD.blue} table: ${table.yellow}`);
		let lines = [
			`# ${table}`,
			`Jouyou kanji (常用漢字, "regular-use kanji") are a list of kanji provided by the Japanese Ministry of Education. ` +
			`It outlines the 2136 kanji that students are expected to know on completion of compulsory education. ` +
			`It's also used to determine what characters are appropriate for use in government documents.`,
			``,
			`The 2136 Jouyou kanji consist of:`,
			`* 1026 kanji taught in primary school (Grade 1-6)`,
			`* 1110 additional kanji taught in secondary school (Grade 7-9)`
		];

		sections.push(lines.join("\n"));
	}

	let suffix = ["st","nd","rd"];
	let c = 0;
	for(let i=0;i<7;i++){
		let table = i<6 ? `${i+1}${i+1<4?suffix[i]:"th"} Grade` : "7th through 9th Grade";
		console.log(`${cArrow} Generating ${jouyouMD.blue} table: ${table.yellow}`);
		let safe = [];
		let a = 0;
		for(let kanji of jouyou.kanji) if(kanji.grade === i+1) { safe.push(`\`${kanji.kanji}\``); a++; }
		let lines = [
			`## ${table}`,
			`* ${a} out of 2136 Jouyou kanji. (${c+a})`,
			``
		];
		lines.push(safe.join(" "));
		sections.push(lines.join("\n"));
		c+=a;
	}

	console.log(`${cArrow} Saving ${jouyouMD.blue}`);
	fs.writeFileSync(jouyouMD, sections.join("\n\n"));
}