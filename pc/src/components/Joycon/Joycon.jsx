
import React, { useState, useEffect } from 'react';

class JoyConHID {
  constructor(joyCon) {
    this.joyCon = joyCon;
    this.globalPacketNumber = 0x00; // 0x0 ~ 0xf
  }

  async sendCommand(subCommand, subCommandArguments) {
    this.joyCon.sendReport(0x01, this.createQuery(subCommand, subCommandArguments));
  }

  // Joy-Con sendReport クエリを作成
  // 参考: https://github.com/chromium/chromium/blob/ccd149af47315e4c6f2fc45d55be1b271f39062c/device/gamepad/nintendo_controller.cc#L1496
  createQuery(subCommand, subCommandArguments) {
    const query = new Array(48).fill(0x00);
    query[0] = this.globalPacketNumber % 0x10; // 0x0 ~ 0xf
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

const JoyConComponent = () => {
  const [device, setDevice] = useState(null);
  const [status, setStatus] = useState('Joy-Con未接続');
  const [ws, setWs] = useState(null);
  const [accelerometer, setAccelerometer] = useState({ x: 0, y: 0, z: 0 });
  const [isShake, setIsShake] = useState(false);
  const THRESHOLD = 2; // 振動検知の閾値

  // 共通のサブコマンド送信関数
  const sendSubcommand = async (joycon, subcommand, data) => {
    const header = new Uint8Array(10).fill(0); // ダミーの振動データ
    const body = new Uint8Array([subcommand, ...data]);
    const buf = new Uint8Array(header.length + body.length);
    buf.set(header, 0);
    buf.set(body, header.length);
    await joycon.sendReport(0x01, buf);
    console.log(`サブコマンド 0x${subcommand.toString(16)} を送信しました。`);
  };

  // ジャイロ有効化
  const enableGyro = async (joycon) => {
    await sendSubcommand(joycon, 0x40, [0x01]);
    console.log('ジャイロ有効化コマンドを送信しました。');
  };

  // 加速度センサー有効化（JoyConHIDクラスを利用）
  const enableAccelerometer = async (joyconHID) => {
    await joyconHID.sendCommand(0x40, 0x01);
    console.log('加速度センサー有効化コマンドを送信しました。');
  };

  // Joy-Con接続処理
  const connectJoyCon = async () => {
    try {
      const filters = [{ vendorId: 0x057e }]; // Nintendo のベンダーID
      const devices = await navigator.hid.requestDevice({ filters });
      if (devices.length === 0) {
        setStatus('デバイスが選択されませんでした');
        return;
      }
      await devices[0].open();
      setDevice(devices[0]);
      setStatus(`接続成功: ${devices[0].productName}`);

      // input report イベントを監視して WebSocket 経由で送信
      devices[0].addEventListener('inputreport', (event) => {
        console.log('input report 受信:', event);
        const { data } = event;
        // if (data.getUint8(0)%0x10 === 0x00) {
          const accelX = data.getInt16(13, true) / 16384;
          const accelY = data.getInt16(15, true) / 16384;
          const accelZ = data.getInt16(17, true) / 16384;
          const accel = Math.sqrt(accelX ** 2 + accelY ** 2 + accelZ ** 2);
          console.log('加速度:', accel);
          const input_button = data.getInt32(2,true);
          console.log('input report 受信:', input_button);
          const currentIsShake = (accelX > THRESHOLD || accelY > THRESHOLD || accelZ > THRESHOLD || accel > THRESHOLD || input_button > 0);
          // 状態を更新（必要であれば）
          setIsShake(currentIsShake);
          setAccelerometer({ x: accelX, y: accelY, z: accelZ });
          // console.log('加速度:', { x: accelX, y: accelY, z: accelZ });
    
          if (ws && ws.readyState === WebSocket.OPEN) {
            console.log('WebSocket経由でデータ送信:', { isShake : currentIsShake });
            ws.send(JSON.stringify({ isShake : currentIsShake })); 
          }

        // }
      // const { reportId, data } = event;
      // // デバイスから受信したレポートデータを配列に変換
      // const deviceData = Array.from(new Uint8Array(data.buffer));
      // console.log('データ:', deviceData);
      // console.log('input report 受信:',
      //   'X:', deviceData[35],deviceData[36],
      //   'Y：', deviceData[37],deviceData[38],
      //   'Z:', deviceData[39],deviceData[40],);
      //   // 'Z:', deviceData[41],deviceData[42]);
      // if (ws && ws.readyState === WebSocket.OPEN) {
      //   ws.send(JSON.stringify({ reportId, deviceData }));
      // }
      });

      const joyConHID = new JoyConHID(devices[0]);
      // 加速度センサー有効化
      await enableAccelerometer(joyConHID);
      await delay(500); // センサーが有効になるまで待機
      // ジャイロ有効化
      await enableGyro(devices[0]);
    } catch (error) {
      console.error('接続エラー:', error);
      setStatus(`接続エラー: ${error}`);
    }
  };

  // コンポーネントマウント時に WebSocket 接続を確立
  useEffect(() => {
    console.log('WebSocketサーバーへ接続中...');
    const socket = new WebSocket('ws://localhost:8080');
    setWs(socket);

    socket.onopen = () => {
      console.log('WebSocketサーバーに接続しました');
    };

    socket.onmessage = async (event) => {
      const message = await event.data.text();
      console.log('メッセージを受信しました:', message);
      // 必要に応じて受信メッセージの処理をここに追加
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
  }, []);

  return (
    <div>
      <h2>Joy-Con 接続＆デバイス情報送信テスト</h2>
      <button onClick={connectJoyCon}>Joy-Conを接続</button>
      <p>{status}</p>
      <p>加速度: X: {accelerometer.x.toFixed(4)}, Y: {accelerometer.y.toFixed(4)}, Z: {accelerometer.z.toFixed(4)}</p>
      {isShake && <p>振動を検知しました！</p>}
    </div>
    );
};

export default JoyConComponent;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));