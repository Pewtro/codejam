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

function splitInput(line) {
	const array = line.split(" ");
	return {cjCost: parseInt(array[0]), jcCost: parseInt(array[1]), string: array[2]};
}

function replaceAt(string, index, replace) {
	return string.slice(0, index) + replace + string.slice(index + 1);
}

function searchIndex(str) {
	const matches = [];
	let startIndex = 0;
	const arr = str.match(/\?/g);

	[].forEach.call(arr, function (element) {
		startIndex = str.indexOf(element, startIndex);
		matches.push(startIndex++);
	});

	return matches;
}

function findPermutations(muralString) {
	const regexp = /\?/g;
	const permutationArray = [];
	const questionMarks = (muralString.match(regexp) || []).length;
	let questionMarkIndices = [];
	if (questionMarks > 0) {
		questionMarkIndices = searchIndex(muralString)
	}
	//Works in NodeJS 12++
	/**[...muralString.matchAll(regexp)].forEach((match) => {
		questionMarkIndices.push(match.index);
	});**/
	let currentIteration = muralString.replace(regexp, 'C');
	permutationArray.push(currentIteration);
	for (let i = 0; i < questionMarks; i++) {
		const questionMarkIndex = questionMarkIndices[i];
		currentIteration = replaceAt(currentIteration, questionMarkIndex, 'J');
		permutationArray.push(currentIteration);
	}
	for (let i = 0; i < questionMarks; i++) {
		const questionMarkIndex = questionMarkIndices[i];
		currentIteration = replaceAt(currentIteration, questionMarkIndex, 'C');
		if (!permutationArray.includes(currentIteration)) {
			permutationArray.push(currentIteration);
		}
	}
	return permutationArray;
}

function findMinimalCost(problemObj) {
	const differentCosts = [];
	const permutations = findPermutations(problemObj.mural);
	permutations.forEach(permutation => {
		let cost = 0;
		cost += (permutation.match(/CJ/g) || []).length * problemObj.cjCost;
		cost += (permutation.match(/JC/g) || []).length * problemObj.jcCost;
		differentCosts.push(cost);
	});
	return Math.min(...differentCosts);
}


//For each line of input execute the following
rl.on("line", function (line) {
	let caseNumber = caseTracker.get();

	// for the first line, which specifies the number of cases
	if (!caseNumber) {
		const amountOfCases = parseInt(line);
		caseTracker.inc();
		return caseTracker.set(amountOfCases);
	}

	const {cjCost, jcCost, string} = splitInput(line);
	caseTracker.addProblem({cjCost: cjCost, jcCost: jcCost, mural: string});

	caseTracker.inc();
	if (caseNumber === caseTracker.numberOfTests) {
		return rl.close();
	}
}).on("close", function () {
	caseTracker.problems.forEach((problem, index) => {
		const result = findMinimalCost(problem);
		return caseTracker.addResult(`Case #${index + 1}: ${result}`);
	});
	// after solving forEach problem
	// print everything in results
	caseTracker.results.forEach(result => console.log(result));
	// exit with code 0
	process.exit(0);
});