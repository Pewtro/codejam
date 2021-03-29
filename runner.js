const fs = require("fs");
const {performance} = require("perf_hooks");
const {spawn} = require("child_process");

const [name, src = "js"] = process.argv.slice(2);
const testPath = `tests/${name}.in`;
const target = `${src}/${name}`;
const expectedScriptName = `${name}.js`;

// given the file name
if (name) {
	fs.readFile(testPath, "utf-8", (err, tests) => {
		if (err) return console.log("Test file not found", err);

		// check if build/name is a thing
		fs.readdir(`${src}/`, (err, files) => {
			if (err) return console.log("Did you transpile?", err);
			// check if the build has the expected script name
			if (files.includes(expectedScriptName)) {
				// setup spawn
				const startTime = performance.now();
				const child = spawn("node", [target]);
				// prepare the encoding and pipe
				child.stdin.setDefaultEncoding("utf-8");
				child.stdout.pipe(process.stdout);
				// write the actual data
				child.stdin.write(tests);
				// measure memory
				const used = process.memoryUsage().heapUsed / 1024 / 1024;
				console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
				// end process
				child.stdin.end();

				child.stderr.on('data', (data) => {
					console.error(`child stderr:\n${data}`);
				});

				child.on("exit", code => {
					const time = (performance.now() - startTime) / 1000;
					console.log("Run Time:", time, "s");
					console.log("Exit Code:", code);
				});
			} else {
				// Exit, there was a problem with the script name
				console.log(`Make sure the file script exists as ${name}.js`);
			}
		});
	});
} else {
	// Exit, no name was given
	console.log("A name is required.");
}