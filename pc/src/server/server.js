import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';  
dotenv.config();

const port = process.env.PORT || 8080;
// const wss = new WebSocketServer({ port });
const wss = new WebSocketServer({ port: port });
// ルームごとの状態を保持するオブジェクト
const rooms = {};

/**
 * 各ルームの状態を管理するオブジェクトの型
 * {
 *   buttonClient: WebSocket | null,
 *   boolClient: WebSocket | null,
 *   lastButtonValue: number | null,
 *   lastBoolValue: boolean,
 *   processTimer: NodeJS.Timer | null
 * }
 */

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (data) => {
    const messageStr = data.toString('utf-8');
    console.log('Received:', messageStr);
    
    let message;
    try {
      message = JSON.parse(messageStr);
    } catch (err) {
      console.error('Error parsing message:', err);
      return;
    }

    // クライアントの登録
    if (message.type === 'register') {
      const roomId = message.room;
      if (!roomId) {
        console.error('Room ID is required for registration');
        return;
      }

      // 指定されたルームがなければ新規作成
      if (!rooms[roomId]) {
        rooms[roomId] = {
          buttonClient: null,
          boolClient: null,
          lastButtonValue: null,
          lastBoolValue: false,
          processTimer: null,
        };
      }

      // 各クライアントの役割に応じて登録
      if (message.role === 'button') {
        rooms[roomId].buttonClient = ws;
        ws.roomId = roomId;
        ws.role = 'button';
        console.log(`Registered button client in room: ${roomId}`);
      } else if (message.role === 'bool') {
        rooms[roomId].boolClient = ws;
        ws.roomId = roomId;
        ws.role = 'bool';
        console.log(`Registered bool client in room: ${roomId}`);
      }
      return;
    }

    // 登録されていない場合は処理しない
    const roomId = ws.roomId;
    if (!roomId || !rooms[roomId]) {
      console.error('Client is not registered with a room.');
      return;
    }
    const room = rooms[roomId];

    // ボタン操作の受信
    if (message.type === 'buttonPress') {
      room.lastButtonValue = message.button;
      console.log(`Room ${roomId}: Button pressed: ${message.button}`);
      // ボタンが押されている状態でboolがtrueならタイマー開始
      if (room.lastBoolValue === true && room.processTimer === null) {
        startProcessTimer(roomId);
      }
    }

    // ボタン離された場合の処理
    if (message.type === 'buttonRelease') {
      console.log(`Room ${roomId}: Button released`);
      room.lastButtonValue = null;
      stopProcessTimer(roomId);
    }

    // boolの状態更新
    if (message.type === 'boolState') {
      room.lastBoolValue = message.value;
      console.log(`Room ${roomId}: Bool state updated: ${message.value}`);

      // boolがtrueになった場合、かつボタンが押されていればタイマー開始
      if (room.lastBoolValue === true && room.lastButtonValue !== null && room.processTimer === null) {
        startProcessTimer(roomId);
      }
      // boolがfalseの場合はタイマー停止
      if (room.lastBoolValue === false) {
        stopProcessTimer(roomId);
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    const roomId = ws.roomId;
    if (roomId && rooms[roomId]) {
      if (ws.role === 'button') {
        rooms[roomId].buttonClient = null;
      }
      if (ws.role === 'bool') {
        rooms[roomId].boolClient = null;
      }
      // 両方のクライアントが切断された場合、ルームを削除する
      if (!rooms[roomId].buttonClient && !rooms[roomId].boolClient) {
        // タイマーが動いていればクリア
        stopProcessTimer(roomId);
        delete rooms[roomId];
        console.log(`Room ${roomId} deleted`);
      }
    }
  });
});

// タイマー開始関数
function startProcessTimer(roomId) {
  const room = rooms[roomId];
  if (room.processTimer !== null) return; // 既にタイマーが動作中
  console.log(`Room ${roomId}: Start process timer`);
  // 例として100ms間隔で処理を実行
  room.processTimer = setInterval(() => {
    if (room.lastBoolValue === true && room.lastButtonValue !== null) {
      processEvent(roomId, room.lastButtonValue);
    }
  }, 100);
}

// タイマー停止関数
function stopProcessTimer(roomId) {
  const room = rooms[roomId];
  if (room.processTimer !== null) {
    clearInterval(room.processTimer);
    room.processTimer = null;
    console.log(`Room ${roomId}: Process timer stopped`);
  }
}

// ボタンとboolの条件が揃った場合の処理
// ※ ここでは処理結果をボタンクライアントにのみ送信します
function processEvent(roomId, button) {
  console.log(`Room ${roomId}: Processing event for button: ${button}`);
  const room = rooms[roomId];
  const message = JSON.stringify({ type: 'process', button: button });
  
  if (room.buttonClient && room.buttonClient.readyState === room.buttonClient.OPEN) {
    room.buttonClient.send(message);
    console.log(`Sent process message to button client in room ${roomId}: ${message}`);
  }
}

console.log(`WebSocket server is running on ws://localhost:${port}`);
