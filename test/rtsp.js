const WebSocket = require('ws');
const { spawn } = require('child_process');

const ws_server = process.env.WS_SERVER || 'ws://localhost:8081/'
const rtsp_url = process.env.RTSP_URL || 'rtsp://admin:Atop3352@192.168.1.100:554'
const ws = new WebSocket(ws_server);

// เมื่อการเชื่อมต่อ WebSocket เปิดอยู่ ให้ส่งข้อมูล FFmpeg เข้าไป
ws.on('open', () => {
  const ffmpeg = spawn('ffmpeg', [
    '-i', rtsp_url,  // RTSP input URL
    '-f', 'mpegts',
    '-vf', 'scale=1280:720',
    '-preset', 'fast',
    '-r', '24',
    '-q:v', '6',                 
    '-b:v', '2000K',            
    '-maxrate', '2000K',       
    '-bufsize', '4000K',
    '-b:a', '96K',      
    '-codec:v', 'mpeg1video',                      
    '-an',
    '-',
  ]);

  ffmpeg.stdout.on('data', (data) => {
    ws.send(data);  // ส่งข้อมูล FFmpeg ไปยัง WebSocket
  });

  ffmpeg.stderr.on('data', (data) => {
    console.error(`FFmpeg stderr: ${data}`);
  });

  ffmpeg.on('close', (code) => {
    console.log(`FFmpeg ออกจากระบบด้วยรหัส ${code}`);
  });
});