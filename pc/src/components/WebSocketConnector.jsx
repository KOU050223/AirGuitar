import React, { useEffect, useState } from 'react';

const WebSocketConnector = () => {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  var message = ""; 

  //開かれた時に実行されます
  useEffect(() => {
    console.log('WebSocketサーバーへ接続中...');
    const socket = new WebSocket('ws://localhost:8080');
    setWs(socket);

    socket.onopen = () => {
      console.log('WebSocketサーバーに接続しました');
    };

    socket.onmessage = (event) => {
      message = event.data.text();
      console.log('メッセージを受信しました:', message);
      setMessages(prevMessages => [...prevMessages, message]);
    };

    socket.onerror = (error) => {
      console.error('WebSocketエラー:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket接続が切断されました');
    };

    // コンポーネントのアンマウント時にWebSocket接続をクローズ
    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, []);

  // メッセージ送信用の関数
  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log('メッセージ送信中...');
      ws.send('Hello from PC management UI');
      console.log('メッセージ送信完了');
    } else {
      console.log('WebSocketが接続されていません');
    }
  };

  return (
    <div>
      <button onClick={sendMessage}>Send Message</button>
      <h3>受信したメッセージ:</h3>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketConnector;
