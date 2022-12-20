const cluster = require('node:cluster');
const os = require('node:os');
const http = require('node:http');
const process = require('node:process');

const numCPUs = os.cpus().length;

//console.dir(os.freemem(), { depth: 4 });

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('disconnect', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  })

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  })

} else {
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('test');
  }).listen(8000);
  console.log(`worker ${process.pid} started`);
}