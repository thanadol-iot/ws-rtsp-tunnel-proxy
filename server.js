const WebSocket = require('ws');
// const axios = require('axios')

const ws_client = process.env.WS_CLIENT || 'wss://rtsp-poc.giantiot.com/ws/server2'
const port = process.env.PORT || 8081
  // สร้าง WebSocket Server บน port 8081
const wssB = new WebSocket.Server({ port });
wssB.on('connection', function connection(wsA) {
    console.log('ws (rtsp) connected');

    // เมื่อได้รับข้อมูลจาก A
    wsA.on('message', function message(data) {
        // ส่งข้อมูลไปยัง C
        wsC.send(data);
    });

    // สร้างการเชื่อมต่อไปยัง WebSocket C
    // const wsC = new WebSocket(response.data.tunnel_link);
    // const wsC = new WebSocket(response.data.tunnel_link);
    const wsC = new WebSocket(ws_client);

    wsC.on('open', function open() {
        console.log('Connected to WebSocket (client)');
    });

    // เมื่อได้รับข้อมูลจาก C
    // wsC.on('message', function message(data) {
    //     console.log('Received from ():', data);
    //     // ส่งข้อมูลกลับไปยัง A
    //     wsA.send(data);
    // });

    // เมื่อเกิดข้อผิดพลาด
    wsC.on('error', function error(err) {
        console.error('WebSocket C error:', err.message);
    });
});

console.log(`WebSocket (server) is running on port ${port}`);
