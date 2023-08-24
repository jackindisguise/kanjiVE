// iterates over the provided array, calling a function that returns a value that will replace the existing value in that position.
function repl(array, fun){
	let replaced = [];
	for(let i=0;i<array.length;i++){
		replaced.push(fun(array[i], i, array));
	}

	return replaced;
}

module.exports = {
	repl: repl
};