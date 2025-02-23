import React, { useState, useEffect } from 'react';

class JoyConHID {
  private globalPacketNumber = 0x00; // 0x0 ~ 0xf
  constructor(private joyCon: any) {}

  async sendCommand(subCommand: number, subCommandArguments: number): Promise<void> {
    this.joyCon.sendReport(0x01, this.createQuery(subCommand, subCommandArguments));
  }

  /**
   * create JoyCon sendReport query
   * see: https://github.com/chromium/chromium/blob/ccd149af47315e4c6f2fc45d55be1b271f39062c/device/gamepad/nintendo_controller.cc#L1496
   */
  private createQuery(subCommand: number, subCommandArguments: number): Uint8Array {
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

const JoyConComponent: React.FC = () => {
  const [device, setDevice] = useState<HIDDevice | null>(null);
  const [status, setStatus] = useState<string>('Joy-Con未接続');
  const [ws, setWs] = useState<WebSocket | null>(null);

  // 共通のサブコマンド送信関数
  const sendSubcommand = async (joycon: HIDDevice, subcommand: number, data: number[]) => {
    const header = new Uint8Array(10).fill(0); // ダミーの振動データ
    const body = new Uint8Array([subcommand, ...data]);
    const buf = new Uint8Array(header.length + body.length);
    buf.set(header, 0);
    buf.set(body, header.length);
    await joycon.sendReport(0x01, buf);
    console.log(`サブコマンド 0x${subcommand.toString(16)} を送信しました。`);
  };

  // ジャイロ有効化
  const enableGyro = async (joycon: HIDDevice) => {
    await sendSubcommand(joycon, 0x40, [0x01]);
    console.log('ジャイロ有効化コマンドを送信しました。');
  };

  // 加速度センサー有効化（JoyConHIDクラスを利用）
  const enableAccelerometer = async (joycon: JoyConHID) => {
    await joycon.sendCommand(0x40, 0x01);
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
      devices[0].addEventListener('inputreport', (event: HIDInputReportEvent) => {
        const { reportId, data } = event;
        // デバイスから受信したレポートデータを配列に変換
        const deviceData = Array.from(new Uint8Array(data.buffer));
        console.log('input report 受信:', reportId,
          'X：', deviceData[37], deviceData[38],
          'Y：', deviceData[39], deviceData[40],
          'Z：', deviceData[41], deviceData[42]);
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ reportId, deviceData }));  // レポートデータを送信
        }
      });

      const joyCon = new JoyConHID(devices[0]);
      // 加速度センサー有効化
      await enableAccelerometer(joyCon);
      await delay(500); // センサーが有効になるまで待機
      // ジャイロ有効化
      await enableGyro(devices[0]);
    } catch (error) {
      console.error('接続エラー:', error);
      setStatus(`接続エラー: ${error}`);
    }
  };

  // コンポーネントマウント時にWebSocket接続を確立
  useEffect(() => {
    console.log('WebSocketサーバーへ接続中...');
    const socket = new WebSocket('ws://localhost:8080');
    setWs(socket);

    socket.onopen = () => {
      console.log('WebSocketサーバーに接続しました');
    };

    socket.onmessage = async (event: MessageEvent) => {
      const message = await event.data.text();
      console.log('メッセージを受信しました:', message);
      // 必要に応じて、受信メッセージの処理をここに追加
    };

    socket.onerror = (error: Event) => {
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
    </div>
  );
};

export default JoyConComponent;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
