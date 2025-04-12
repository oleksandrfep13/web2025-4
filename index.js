const { Command } = require('commander');
const fs = require('fs');
const http = require('http');
const path = require('path');
const xml2js = require('xml2js'); 

const program = new Command();

program
  .requiredOption('-h, --host <host>', 'Server host')
  .requiredOption('-p, --port <port>', 'Server port')
  .requiredOption('-i, --input <path>', 'Input JSON file path');

program.parse(process.argv);
const options = program.opts();

const inputPath = path.resolve(options.input);

async function readFile() {
  try {
    const data = await fs.promises.readFile(inputPath, 'utf-8');
    return JSON.parse(data); // Парсимо JSON
  } catch (error) {
    console.error('Cannot find input file');
    process.exit(1);
  }
}

async function convertJsonToXml(jsonData) {
  const builder = new xml2js.Builder({ headless: true, renderOpts: { pretty: true } });
  const xml = builder.buildObject(jsonData);
  return xml;
}

const server = http.createServer(async (req, res) => {
  try {
    const jsonData = await readFile(); // Читання JSON
    const xmlData = await convertJsonToXml(jsonData); // Перетворення в XML
    res.writeHead(200, { 'Content-Type': 'application/xml' });
    res.end(xmlData); // Відправка XML
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server Error');
  }
});

server.listen(options.port, options.host, () => {
  console.log(`Server running at http://${options.host}:${options.port}`);
});
