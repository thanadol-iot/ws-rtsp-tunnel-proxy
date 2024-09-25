const WebSocket = require('ws');

// สร้าง WebSocket Server บน port 8082
const wssC = new WebSocket.Server({ port: 8082 });

wssC.on('connection', function connection(wsB) {
    console.log('Client (server) connected');

    // เมื่อได้รับข้อมูลจาก B
    wsB.on('message', function message(data) {
        console.log('Received from (server):', data);
        // ส่งข้อมูลกลับไปยัง B
        const messageString = data.toString(); // แปลง Buffer เป็น string

        try {
            // แปลง string เป็น Object (ถ้าข้อมูลคือ JSON)
            const messageObject = JSON.parse(messageString);
            console.log('Received from B:', messageObject);
        } catch (error) {
            // ถ้าไม่สามารถแปลงเป็น JSON ได้
            console.log('Received from B (not JSON):', messageString);
        }
    
        // wsB.send(`Echo from C: ${data}`);
    });

    // เมื่อเกิดข้อผิดพลาด
    wsB.on('error', function error(err) {
        console.error('WebSocket (server) error:', err.message);
    });
});

console.log('WebSocket (client) is running on ws://localhost:8082');
