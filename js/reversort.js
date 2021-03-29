const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

// keeps track of the test case being solved
const caseTracker = {
	problems: [],
	results: [],
	numberOfTests: null,
	count: null,
	inc() {
		this.count = this.count === null ? 1 : this.count + 1;
	},
	set(val) {
		this.numberOfTests = val;
	},
	get() {
		return this.count;
	},
	addProblem(problem) {
		this.problems = [...this.problems, problem];
	},
	addResult(result) {
		this.results = [...this.results, result];
	}
};

const lineTracker = {
	lineCount: 0,
	get() {
		this.increment();
		return this.lineCount;
	},
	increment() {
		this.lineCount += 1;
	}
};

function reversort(numElements, array) {
	let cost = 0;
	let min;
	for (let i = 0; i < array.length - 1; i++) {
		min = i;
		for (let j = i; j < array.length; j++) {
			if (array[j] < array[min]) {
				min = j;
			}
		}
		array = [].concat(array.slice(0, i), array.slice(i, min + 1).reverse(), array.slice(min + 1))
		cost += min - i + 1;
	}
	return cost;

}

function lineToArray(stringLine) {
	let arrayOfNums = []
	const arrayOfChars = stringLine.split(" ")
	arrayOfChars.forEach(char => {
		arrayOfNums.push(parseInt(char))
	})
	return arrayOfNums;
}

let tempLineVal = '';
//For each line of input execute the following
rl.on("line", function (line) {

	const lineNumber = lineTracker.get();
	let caseNumber = caseTracker.get();

	if (lineNumber % 2 === 0) {
		tempLineVal = line;
		caseTracker.inc();
	} else if (lineNumber > 1) {
		caseTracker.addProblem({numElements: tempLineVal, array: line});
	}

	// for the first line, which specifies the number of cases
	if (!caseNumber) {
		const amountOfCases = parseInt(line);
		caseTracker.inc();
		return caseTracker.set(amountOfCases);
	}

	if (caseNumber === caseTracker.numberOfTests + 1) {
		return rl.close();
	}
}).on("close", function () {
	caseTracker.problems.forEach((problem, index) => {
		const initialArray = lineToArray(problem.array)
		const result = reversort(problem.numElements, initialArray);
		return caseTracker.addResult(`Case #${index + 1}: ${result}`);
	});
	// after solving forEach problem
	// print everything in results
	caseTracker.results.forEach(result => console.log(result));
	// exit with code 0
	process.exit(0);
})