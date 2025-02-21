import { WebSocketServer, WebSocket } from 'ws';

const port = 8080;
const wss = new WebSocketServer({ port });

// WebSocketの処理
wss.on('connection', (ws) => {
    console.log('New client connected');
  
    ws.on('message', (data) => {
      // 受信したメッセージの処理（例：入力データ、設定変更通知など）
      console.log('Received:', data);
      // 接続している他のクライアントへブロードキャストする例
      // console.log(wss.clients);
      wss.clients.forEach((client) => {
        console.log(client);
        client.send(data);
        // 接続している他のクライアントへブロードキャスト
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          console.log('Broadcasting:', data);
          client.send(data);
        }
      });
    });
  
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

console.log(`WebSocket server is running on ws://localhost:${port}`);
