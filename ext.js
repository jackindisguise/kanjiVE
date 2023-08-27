/** Overloads array functions. Not safe. */

// iterates over the provided array, calling a function that returns a value that will replace the existing value in that position.
// returns a new array
Array.prototype.replace = function(fun){
	let replaced = [];
	for(let i=0;i<this.length;i++){
		replaced.push(fun(this[i], i, this));
	}

	return replaced;
}

// check for all arguments provided within this array
// returns true if all are contained, false otherwise
Array.prototype.contains = function(){
	for(let arg of arguments) if(this.indexOf(arg) === -1) return false;
	return true;
}

// array push
Array.prototype.pushArray = function(array){
	for(let entry of array) this.push(entry);
}