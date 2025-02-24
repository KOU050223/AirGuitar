import React, { useState, useImperativeHandle, forwardRef, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setSettings } from '../../features/settings/settingsSlice.js';

class JoyConHID {
  constructor(joyCon) {
    this.joyCon = joyCon;
    this.globalPacketNumber = 0x00;
  }

  async sendCommand(subCommand, subCommandArguments) {
    this.joyCon.sendReport(0x01, this.createQuery(subCommand, subCommandArguments));
  }

  createQuery(subCommand, subCommandArguments) {
    const query = new Array(48).fill(0x00);
    query[0] = this.globalPacketNumber % 0x10;
    query[1] = 0x00;
    query[2] = 0x01;
    query[5] = 0x00;
    query[6] = 0x01;
    query[9] = subCommand;
    query[10] = subCommandArguments;
    this.globalPacketNumber++;
    return Uint8Array.from(query);
  }
}

const JoyConComponent = forwardRef((props, ref) => {
  const [device, setDevice] = useState(null);
  const [status, setStatus] = useState('Joy-Con未接続');
  const wsRef = useRef(null); // WebSocket 接続は useRef で管理
  const [accelerometer, setAccelerometer] = useState({ x: 0, y: 0, z: 0 });
  const [isShake, setIsShake] = useState(false);
  const dispatch = useDispatch();
  const THRESHOLD = 2;
  const BPM = 1000; // 次がなるまでのms

  // WebSocket 接続（1回のみ）
  useEffect(() => {
    console.log('WebSocketサーバーへ接続中...');
    const socket = new WebSocket(import.meta.env.VITE_SERVER_URL);
    wsRef.current = socket;
    socket.onopen = () => {
      console.log('WebSocketサーバーに接続しました');
      // 登録メッセージ作成
      // 通常は role:"bool", room:"room1" を送信
      // mode が "/sound_setting_mode" の場合、soundName, soundFiles も送信する
      const registerMessage = { type: 'register', role: 'bool', room: 'room1', mode: props.mode };
      console.log('props.mode:', props.mode);
      registerMessage.mode = props.mode;
      if (props.mode === '/sound_setting_mode') {
        console.log('音声設定モードのため、音声ファイル情報を送信します');
        console.log('soundName:', props.soundName);
        console.log('soundFiles:', props.soundFiles);
        registerMessage.soundName = props.soundName;
        registerMessage.soundFiles = props.soundFiles;
      }
      console.log('送信するやつ：',registerMessage);
      socket.send(JSON.stringify(registerMessage));
    };
    socket.onmessage = async (event) => {
      // WebSocket サーバーからのメッセージ受信（２つの条件が揃った時にメッセージが来る!!!）
      const messageText = await event.data;
      // Reduxを使って音声ファイルのパスを保存
      const parsedMessage = JSON.parse(messageText);
      const soundPath = parsedMessage.audioFile;
      console.log('soundPath:', soundPath); 
      // !!!Redux!!!
      dispatch(setSettings({ soundPath, isSound: true }));
      console.log('WebSocketサーバーからのメッセージ:', messageText);
      // ???ms後に isSound を false に戻す
      setTimeout(() => {
        dispatch(setSettings({ isSound: false }));
      }, BPM);
    };
    socket.onerror = (error) => {
      console.error('WebSocketエラー:', error);
    };
    socket.onclose = () => {
      console.log('WebSocket接続が切断されました');
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, [props.mode, props.soundName, props.soundFiles]);

  // physical な Joy-Con の接続処理
  const connectJoyCon = async () => {
    try {
      const filters = [{ vendorId: 0x057e }];
      const devices = await navigator.hid.requestDevice({ filters });
      if (devices.length === 0) {
        setStatus('デバイスが選択されませんでした');
        return;
      }
      await devices[0].open();
      setDevice(devices[0]);
      setStatus(`接続成功: ${devices[0].productName}`);

      devices[0].addEventListener('inputreport', (event) => {
        // console.log('input report 受信:', event);
        const { data } = event;
        if (data.byteLength !== 48) {
          console.error('不正なデータ長:', data.byteLength);
          setStatus('不正なデータ長/一度切断して再接続してください');
          return;
        }
        const accelX = data.getInt16(13, true) / 16384;
        const accelY = data.getInt16(15, true) / 16384;
        const accelZ = data.getInt16(17, true) / 16384;
        const accel = Math.sqrt(accelX ** 2 + accelY ** 2 + accelZ ** 2);
        const input_button = data.getInt32(2, true);
        const currentIsShake =
          accelX > THRESHOLD ||
          accelY > THRESHOLD ||
          accelZ > THRESHOLD ||
          accel > THRESHOLD ||
          input_button > 0;

        setIsShake(currentIsShake);
        setAccelerometer({ x: accelX, y: accelY, z: accelZ });

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          const message = JSON.stringify({ type: 'boolState', value: currentIsShake });
          // console.log('WebSocket経由でデータ送信:', message);
          wsRef.current.send(message);
        }
      });

      const joyConHID = new JoyConHID(devices[0]);
      await joyConHID.sendCommand(0x40, 0x01); // 加速度センサー有効化
      await new Promise((resolve) => setTimeout(resolve, 500));
      await sendSubcommand(devices[0], 0x40, [0x01]); // ジャイロ有効化
    } catch (error) {
      console.error('接続エラー:', error);
      setStatus(`接続エラー: ${error}`);
    }
  };

  const sendSubcommand = async (joycon, subcommand, data) => {
    const header = new Uint8Array(10).fill(0);
    const body = new Uint8Array([subcommand, ...data]);
    const buf = new Uint8Array(header.length + body.length);
    buf.set(header, 0);
    buf.set(body, header.length);
    await joycon.sendReport(0x01, buf);
    console.log(`サブコマンド 0x${subcommand.toString(16)} を送信しました。`);
  };

  // 外部から connectJoyCon を呼び出せるようにする
  useImperativeHandle(ref, () => ({
    connectJoyCon,
  }));

  return (
    <div>
      <h2>Joy-Con 接続＆デバイス情報送信テスト</h2>
      <button onClick={connectJoyCon}>Joy-Conを接続</button>
      <p>{status}</p>
      <p>
        加速度: X: {accelerometer.x.toFixed(4)}, Y: {accelerometer.y.toFixed(4)}, Z: {accelerometer.z.toFixed(4)}
      </p>
      {isShake && <p>振動を検知しました！</p>}
    </div>
  );
});

export default JoyConComponent;
