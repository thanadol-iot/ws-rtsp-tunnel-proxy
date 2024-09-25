// const express = require('express');
// const http = require('http');
// const net = require('net');
// const crypto = require('crypto');
// const WebSocket = require('ws');

// const app = express();
// var port = process.argv[2] || 9999; // Server port
// var host = process.argv[3] || 'giant.me'; // Server hostname
// const bindIp = '127.0.0.1'; // IP to bind

// // Create a HTTP server
// const server = http.createServer(app);

// app.get('/', (req, res) => {
//   if (req.query.port) {
//     port = req.query.port
//   }

//   if (req.query.host) {
//     host = req.query.host
//   }
//   // Create a WebSocket server
//   const wss = new WebSocket.Server({ server });

//   const publicHost = `${newSubdomain()}${host}:${port}`;
//   res.header('X-Public-Host', publicHost);
//   res.header('Connection', 'close');
//   res.status(200).send({ tunnel_link: `ws://${host}:${port}/` });

//   const targetSocket = net.createConnection({ host: host, port: port });
//   // console.log(`ws://${host}:${port}/`);
  
//   wss.on('connection', (clientSocket) => {
//     console.log(`${host} : start session`);

//     clientSocket.on('message', (message) => {
//       const messageString = message.toString(); // แปลง Buffer เป็น string
//       try {
//           // แปลง string เป็น Object (ถ้าข้อมูลคือ JSON)
//           const messageObject = JSON.parse(messageString);
//           console.log('Received from B:', messageObject);
//       } catch (error) {
//           // ถ้าไม่สามารถแปลงเป็น JSON ได้
//           console.log('Received from B (not JSON):', messageString);
//       }
//       targetSocket.write(message);
//     });

//     targetSocket.on('data', (data) => {
//       clientSocket.send(data);
//     });

//     targetSocket.on('end', () => {
//       clientSocket.close();
//       console.log(`${host} : end session`);
//     });

//     clientSocket.on('close', () => {
//       targetSocket.end();
//     });
//   });
// });

// // Function to generate new subdomain
// function newSubdomain() {
//   return crypto.randomBytes(5).toString('hex') + '.';
// }

// // Start the server
// server.listen(port, bindIp, () => {
//   console.log(`groktunnel server [${host}] ready on http://${host}:${port}`);
// });

const express = require('express');
const http = require('http');
const net = require('net');
const crypto = require('crypto');
const WebSocket = require('ws');

const app = express();
const defaultPort = process.argv[2] || 9999; // Default server port
const defaultHost = process.argv[3] || 'giant.me'; // Default server hostname
const bindIp = '127.0.0.1'; // IP to bind

// Function to generate new subdomain
function newSubdomain() {
  return crypto.randomBytes(5).toString('hex') + '.';
}

// Function to create and start a new server
function startNewServer(port, host) {
  const newApp = express(); // Create a new express app for each server

  // Create a new HTTP server
  const newServer = http.createServer(newApp);

  // Create a new WebSocket server
  const wss = new WebSocket.Server({ server: newServer });

  // WebSocket connection handling
  wss.on('connection', (clientSocket) => {
    console.log(`${host}:${port} - start session`);

    // Create a TCP connection to the specified host and port
    const targetSocket = net.createConnection({ host, port }, () => {
      console.log(`Connected to TCP server at ${host}:${port}`);
    });

    clientSocket.on('message', (message) => {
      console.log(message);
      
      // const messageString = message.toString(); // Convert Buffer to string
      // try {
      //   // Parse JSON message
      //   const messageObject = JSON.parse(messageString);
      //   console.log('Received from B:', messageObject);
      // } catch (error) {
      //   console.log('Received from B (not JSON):', messageString);
      // }
      targetSocket.write(message);
    });

    targetSocket.on('data', (data) => {
      clientSocket.send(data);
    });

    // targetSocket.on('end', () => {
    //   clientSocket.close();
    //   console.log(`${host}:${port} - end session`);
    // });

    clientSocket.on('close', () => {
      targetSocket.end();
    });

    targetSocket.on('error', (err) => {
      console.error(`Target socket error on ${host}:${port}:`, err.message);
    });

    clientSocket.on('error', (err) => {
      console.error(`Client socket error on ${host}:${port}:`, err.message);
    });
  });

  // Start the new server
  newServer.listen(port, bindIp, () => {
    console.log(`New server [${host}] ready on http://${bindIp}:${port}`);
  });
}

// API endpoint to dynamically start a new server
app.get('/', (req, res) => {
  let currentPort = defaultPort;
  let currentHost = defaultHost;

  if (req.query.port) {
    currentPort = req.query.port;
  }

  if (req.query.host) {
    currentHost = req.query.host;
  }

  const publicHost = `${newSubdomain()}${currentHost}:${currentPort}`;
  console.log('Generated public host:', publicHost);

  // Start a new server for the specified host and port
  startNewServer(currentPort, currentHost);

  // Respond with the tunnel link
  res.header('X-Public-Host', publicHost);
  res.header('Connection', 'close');
  res.status(200).send({ tunnel_link: `ws://${currentHost}:${currentPort}/` });
});

// Start the default server
const server = http.createServer(app);
server.listen(defaultPort, bindIp, () => {
  console.log(`Default server [${defaultHost}] ready on http://${bindIp}:${defaultPort}`);
});

