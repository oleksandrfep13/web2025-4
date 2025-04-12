const { Command } = require('commander');
const fs = require('fs');
const http = require('http');
const path = require('path');

const program = new Command();

program
  .requiredOption('-h, --host <host>', 'Server host')
  .requiredOption('-p, --port <port>', 'Server port')
  .requiredOption('-i, --input <path>', 'Input JSON file path');

program.parse(process.argv);
const options = program.opts();

const inputPath = path.resolve(options.input);

if (!fs.existsSync(inputPath)) {
  console.error('Cannot find input file');
  process.exit(1);
}

const data = fs.readFileSync(inputPath);

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(data);
});

server.listen(options.port, options.host, () => {
  console.log(`Server running at http://${options.host}:${options.port}`);
});

