// JoyConComponent.tsx の一部例
import React, { useState } from 'react';

class JoyConHID {
    private globalPacketNumber = 0x00; // 0x0 ~ 0xf. see: https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering/blob/master/bluetooth_hid_notes.md#output-0x01
  
    constructor(private joyCon: any) {}
  
    async sendCommand(subCommand: number, subCommandArguments: number): Promise<void> {
      this.joyCon.sendReport(
        0x01,
        this.createQuery(subCommand, subCommandArguments)
      );
    }
  
    /**
     * create JoyCon sendReport query
     * see: https://github.com/chromium/chromium/blob/ccd149af47315e4c6f2fc45d55be1b271f39062c/device/gamepad/nintendo_controller.cc#L1496
     */
    private createQuery(
      subCommand: number,
      subCommandArguments: number
    ): Uint8Array {
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

  // Joy-Conにサブコマンドを送信する共通関数
  const sendSubcommand = async (joycon: HIDDevice, subcommand: number, data: number[]) => {
    // 先頭の10バイトはダミーの振動データ（ここでは全て0で埋めていますが、適宜調整してください）
    const header = new Uint8Array(10).fill(0);
    // サブコマンド本体：1バイトのサブコマンドID + オプションのパラメータ
    const body = new Uint8Array([subcommand, ...data]);
    // ヘッダーと本体を結合
    const buf = new Uint8Array(header.length + body.length);
    buf.set(header, 0);
    buf.set(body, header.length);

    // サブコマンド送信用のレポートIDは通常 0x01 です
    await joycon.sendReport(0x01, buf);
    console.log(`サブコマンド 0x${subcommand.toString(16)} を送信しました。`);
  };

  // Joy-Conのジャイロを有効にする関数
  const enableGyro = async (joycon: HIDDevice) => {
    // 参考記事に合わせると、サブコマンド 0x40 に 0x01 を渡してジャイロ有効化する例です
    await sendSubcommand(joycon, 0x40, [0x01]);
    console.log('ジャイロ有効化コマンドを送信しました。');
  };

  const enableAccelerometer = async (joycon: JoyConHID)=> {
    await joycon.sendCommand(0x40, 0x01);
    console.log('加速度センサー有効化コマンドを送信しました。');
    };

  const connectJoyCon = async () => {
    try {
        const filters = [{ vendorId: 0x057e }]; // NintendoのベンダーID
        const devices = await navigator.hid.requestDevice({ filters });
        if (devices.length === 0) {
            setStatus('デバイスが選択されませんでした');
            return;
        }
        
        await devices[0].open();
        setDevice(devices[0]);
        setStatus(`接続成功: ${devices[0] ? devices[0].productName : 'null'}`);

        const joyCon = new JoyConHID(device);
        // 加速度センサーを有効にする
        // https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering/blob/master/bluetooth_hid_subcommands_notes.md#subcommand-0x40-enable-imu-6-axis-sensor
        enableAccelerometer(joyCon);
        await delay(500); // 加速度センサーが有効になるまで少し時間がかかるので待つ
        // JoyCon の input report mode を 60Hz の Standard full mode にする
        // https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering/blob/master/bluetooth_hid_subcommands_notes.md#subcommand-0x03-set-input-report-mode
        // await joyCon.sendCommand(0x03, 0x30);

        // 接続後すぐにジャイロ（IMU）を有効化
        //   await enableGyro(joyCon);
    } catch (error) {
        console.error('接続エラー:', error);
        setStatus(`接続エラー: ${error}`);
    }
  };

  return (
    <div>
      <h2>Joy-Con 接続＆ジャイロ有効化テスト</h2>
      <button onClick={connectJoyCon}>Joy-Conを接続</button>
      <p>{status}</p>
    </div>
  );
};

export default JoyConComponent;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

