import React, { useState, useEffect } from 'react';
import SoundButton from '../components/SoundButton.tsx';

const SoundSettingMode = () => {
  const [chords, setChords] = useState<string[]>([
    'B', 'Em', 
    'D', 'E', 
    'C', 'Am', 
    'G', 'F'
  ]);
  const [activeChord, setActiveChord] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [test, setTest] = useState<string>(''); // テスト用

  useEffect(() => {
    console.log('WebSocketサーバーへ接続中...');
    const socket = new WebSocket(import.meta.env.VITE_SERVER_URL);
    setWs(socket);

    socket.onopen = () => {
      console.log('WebSocketサーバーに接続しました');
      socket.send(JSON.stringify({ type: 'register', role: 'button', room: 'room1' }));
    };

    socket.onmessage = async (event: MessageEvent) => {
      const messageText = await event.data.text();
      console.log('メッセージを受信しました:', messageText);
      setTest(`メッセージを受信しました: ${messageText}`);

      let message;
      try {
        message = JSON.parse(messageText);
      } catch (err) {
        console.error('メッセージのパースエラー:', err);
        return;
      }

      if (message.type === 'process') {
        const processedButton = message.button;
        console.log(`サーバーから処理結果を受信: ${processedButton}`);
        setActiveChord(processedButton);
      }
    };

    socket.onerror = (error: Event) => {
      console.error('WebSocketエラー:', error);
      setTest(`WebSocketエラー: ${error}`);
    };

    socket.onclose = () => {
      console.log('WebSocket接続が切断されました');
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, []);

  const handleClick = (chord: string) => {
    setActiveChord(chord);
    console.log(`Clicked chord: ${chord}`);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'buttonPress', button: chord }));
    }
  };

  return (
    <div className="flex flex-col items-center"
    style={{ backgroundImage: "url('/src/assets/guiter_board.png')" }}
    >  
      <div className="grid grid-cols-2 gap-4 p-4">
        {chords.map((chord) => (
          <button
            key={chord}
            onClick={() => handleClick(chord)}
            className={`w-40 h-40 text-2xl font-bold flex items-center justify-center rounded-lg 
                        bg-gray-100 hover:bg-white-400 transition duration-300 shadow-md 
                        ${activeChord === chord ? 'bg-gray-800 text-white' : ''}`}
            style={{ transform: 'rotate(90deg)' }} // 90度回転
          >
            {chord}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold"></h2>
        <p className="text-gray-600">{test}</p>
      </div>
    </div>
  );
};

export default SoundSettingMode;
