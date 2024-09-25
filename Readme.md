# ws-rtsp-tunnel-proxy

This project is a WebSocket server that acts as a proxy between a WebSocket client (for RTSP streams) and another WebSocket server. The proxy forwards messages between the two WebSocket connections.

## Features
- WebSocket server running on a specified port.
- Establishes connection between a client WebSocket (A) and another WebSocket server (C).
- Forwards messages from the client to the WebSocket server.

## Prerequisites

- Node.js (v12 or later)
- npm (or yarn)

## Installation and test with local

1. Clone the repository: git clone https://github.com/your-username/ws-rtsp-tunnel-proxy.git
2. Direct to folder ws-rtsp-tunnel-proxy and open with vs code 
3. Use "npm install" to install package

## How to test
0. create .env and setting WS_CLIENT.
1. Use command "node server.js" to run server.
2. Setting WS_SERVER, RTSP_URL after that run command "node rtsp.js" to send Buffer ffmpeg to client pass server.
