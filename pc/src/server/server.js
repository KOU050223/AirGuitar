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
 *   processTimer: NodeJS.Timer | null,
 *   buttons: Array(8),
 *   audioFiles: Array(8)
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
          buttons: new Array(8).fill(null), // 8つのボタン情報を格納
          audioFiles: new Array(8).fill(null) // 8つの音声ファイルのパスやデータなど
        };
      }

      // 各クライアントの役割に応じて登録
      if (message.role === 'button') {
        rooms[roomId].buttonClient = ws;
        ws.roomId = roomId;
        ws.role = 'button';
        console.log(`Registered button client in room: ${roomId}`);
      }
      if (message.role === 'bool') {
        rooms[roomId].boolClient = ws;
        ws.roomId = roomId;
        ws.role = 'bool';
        console.log(`Registered bool client in room: ${roomId}`);
        // mode が /sound_setting_mode の場合、初期データを登録する
        if (message.mode === '/sound_setting_mode') {
          console.log('message:', message);
          console.log('ws:', ws);
          rooms[roomId].buttons = message.soundName;
          rooms[roomId].audioFiles = message.soundFiles;
          console.log(`Room ${roomId} 初期化：buttons と audioFiles を登録しました。`);
        }
      }
      console.log('rooms:', rooms[roomId]);
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
  if (room.processTimer !== null) return; // 既にタイマーが動作中の場合は何もしない
  console.log(`Room ${roomId}: Start process timer`);
  // 100ms毎に処理を実行
  room.processTimer = setInterval(() => {
    if (room.lastBoolValue === true && room.lastButtonValue !== null) {
      // 押されたボタンの名前が buttons 配列のどのインデックスにあるかを取得
      const index = room.buttons.indexOf(room.lastButtonValue);
      if (index !== -1) {
        // 対応する audioFiles の音声ファイルを取得
        const audioFile = room.audioFiles[index];
        processEvent(roomId, room.lastButtonValue, audioFile);
      } else {
        console.log('buttons 配列内に押されたボタンが見つかりません。');
      }
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
function processEvent(roomId, button, audioFile) {
  console.log(`Room ${roomId}: Processing event for button: ${button}`);
  const room = rooms[roomId];
  const message = JSON.stringify({ type: 'process', button: button, audioFile: audioFile });
  console.log(message);
  if (room.boolClient && room.buttonClient.readyState === room.boolClient.OPEN) {
    room.boolClient.send(message);
    console.log(`【process room ${roomId}: ${message}】`);
  }
}

console.log(`WebSocket server is running on ws://localhost:${port}`);
