import React, { useState, useEffect } from 'react';
import SoundButton from '../components/SoundButton.tsx';

const SoundSettingMode = () => {
  const [chords, setChords] = useState<string[]>([]);
  const [sounds, setSounds] = useState<string[]>([]);
  const [selectedChord, setSelectedChord] = useState<string | null>(null);
  // サーバーから処理結果として受け取った、条件を満たしたボタン（chord）を保持
  const [activeChord, setActiveChord] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [test,setTest] = useState<string>('') //テスト用のstate


  useEffect(() => {
    console.log('WebSocketサーバーへ接続中...');
    const socket = new WebSocket(import.meta.env.VITE_SERVER_URL);
    setWs(socket);

    socket.onopen = () => {
      console.log('WebSocketサーバーに接続しました');
      // 登録メッセージを送信（buttonクライアントとして登録、ルームIDはroom1としています）
      socket.send(JSON.stringify({ type: 'register', role: 'button', room: 'room1' }));
    };

    socket.onmessage = async (event: MessageEvent) => {
      // サーバーからのメッセージをテキストとして取得
      const messageText = await event.data.text();
      console.log('メッセージを受信しました:', messageText);
    setTest(`メッセージを受信しました:${messageText}`); //テスト用
      let message;
      try {
        message = JSON.parse(messageText);
      } catch (err) {
        console.error('メッセージのパースエラー:', err);
        return;
      }

      // サーバーから初期データ（chordsとsounds）が送られてくる場合の例
      if (message.type === 'init') {
        if (message.chords) setChords(message.chords);
        if (message.sounds) setSounds(message.sounds);
      }

      // サーバーからの処理結果（どのボタンが条件を満たしたか）の場合
      if (message.type === 'process') {
        const processedButton = message.button;
        console.log(`サーバーから処理結果を受信: ${processedButton}`);
        setTest(`サーバーから処理結果を受信: ${processedButton}`); //テスト用
        // activeChordを更新して、SoundButtonのスタイルを変更するために利用
        setActiveChord(processedButton);
      }
    };

    socket.onerror = (error: Event) => {
      console.error('WebSocketエラー:', error);
      setTest(`WebSocketエラー${(error)}`); //テスト用
    };

    socket.onclose = () => {
      console.log('WebSocket接続が切断されました');
    };

    // サーバーから初期データが受信できない場合に備え、初期値を設定しておく例
    setChords(['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Cm']);
    setSounds(['ド', 'レ', 'ミ', 'ファ', 'ソ', 'ラ', 'シ']);

    return () => {
      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close();
      }
    };
  }, []);

  // SoundButtonがクリックされた場合の処理
  const handleClick = (chord: string) => {
    // 選択されたコードを保持
    setSelectedChord(chord);
    console.log(`Clicked chord: ${chord}`);

    // ボタンがクリックされた情報をサーバーへ送信
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'buttonPress', button: chord }));
    }
  };

  return (
    <>
    <div className="flex flex-row overflow-x-auto w-full py-4">
      {chords.map((chord) => (
        <SoundButton
          key={chord}
          label={chord}
          onClick={() => handleClick(chord)}
          // activeプロパティで、サーバーから処理されたボタンを強調表示できるようにする
          active={activeChord === chord}
        />
      ))}
    </div>
    <div>
      <h2>テスト用</h2>
      <p>{test}</p>
    </div>
    </>
  );
};

export default SoundSettingMode;
