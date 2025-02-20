import React, { useEffect, useRef, useState } from 'react';

interface FusionData {
  displacement: { x: number; y: number }; // 移動量（メートル単位）
  orientation: { pitch: number; roll: number }; // 推定した傾き（ラジアン単位）
}

const SensorFusionResponsive: React.FC = () => {
  const [fusionData, setFusionData] = useState<FusionData>({
    displacement: { x: 0, y: 0 },
    orientation: { pitch: 0, roll: 0 },
  });

  // 速度（m/s）を保持
  const velocityRef = useRef({ x: 0, y: 0 });
  // 前回イベントのタイムスタンプ
  const lastTimestampRef = useRef<number | null>(null);
  // 補完フィルタによる推定した傾き（ラジアン単位）
  const orientationRef = useRef({ pitch: 0, roll: 0 });

  // 補完フィルタの係数（0～1。1に近いほどジャイロ側を重視）
  const alphaComplementary = 0.95;

  const handleDeviceMotion = (event: DeviceMotionEvent) => {
    const { acceleration, rotationRate, accelerationIncludingGravity } = event;
    if (
      !acceleration ||
      acceleration.x === null ||
      acceleration.y === null ||
      !rotationRate ||
      !accelerationIncludingGravity ||
      accelerationIncludingGravity.x === null ||
      accelerationIncludingGravity.y === null ||
      accelerationIncludingGravity.z === null
    ) {
      return;
    }

    const currentTime = event.timeStamp;
    let dt = 0;
    if (lastTimestampRef.current !== null) {
      dt = (currentTime - lastTimestampRef.current) / 1000;
    }
    lastTimestampRef.current = currentTime;
    if (dt <= 0) return;

    // ジャイロデータ (deg/s → rad/s)
    const gyroPitchRate = rotationRate.beta ? rotationRate.beta * (Math.PI / 180) : 0;
    const gyroRollRate = rotationRate.gamma ? rotationRate.gamma * (Math.PI / 180) : 0;

    // ジャイロによる傾き積分
    const gyroPitch = orientationRef.current.pitch + gyroPitchRate * dt;
    const gyroRoll = orientationRef.current.roll + gyroRollRate * dt;

    // 加速度（重力含む）から傾きを計算（簡易的な方法）
    const acc = accelerationIncludingGravity;
    const accPitch = Math.atan2(-acc.x, Math.sqrt(acc.y * acc.y + acc.z * acc.z));
    const accRoll = Math.atan2(acc.y, acc.z);

    // 補完フィルタで融合
    const fusedPitch = alphaComplementary * gyroPitch + (1 - alphaComplementary) * accPitch;
    const fusedRoll = alphaComplementary * gyroRoll + (1 - alphaComplementary) * accRoll;
    orientationRef.current = { pitch: fusedPitch, roll: fusedRoll };

    // デバイス座標の加速度（重力除く）を取得
    const accDeviceX = acceleration.x;
    const accDeviceY = acceleration.y;

    // 加速度をワールド座標へ簡易変換（2D回転のみの近似）
    const axWorld = accDeviceX * Math.cos(fusedRoll) - accDeviceY * Math.sin(fusedRoll);
    const ayWorld = accDeviceX * Math.sin(fusedRoll) + accDeviceY * Math.cos(fusedRoll);

    // 感度を上げるために倍率をかける（ここでは2倍）
    const sensitivityMultiplier = 2.0;
    velocityRef.current.x += axWorld * sensitivityMultiplier * dt;
    velocityRef.current.y += ayWorld * sensitivityMultiplier * dt;

    // 軽微な速度を抑えるためにわずかに減衰
    velocityRef.current.x *= 0.99;
    velocityRef.current.y *= 0.99;

    const newDisplacement = {
      x: fusionData.displacement.x + velocityRef.current.x * dt,
      y: fusionData.displacement.y + velocityRef.current.y * dt,
    };

    setFusionData({
      displacement: newDisplacement,
      orientation: { pitch: fusedPitch, roll: fusedRoll },
    });
  };

  useEffect(() => {
    const requestPermission = async () => {
      if (
        typeof DeviceMotionEvent !== 'undefined' &&
        typeof (DeviceMotionEvent as any).requestPermission === 'function'
      ) {
        try {
          const response = await (DeviceMotionEvent as any).requestPermission();
          if (response === 'granted') {
            window.addEventListener('devicemotion', handleDeviceMotion);
          } else {
            console.error('センサー利用の許可が得られませんでした');
          }
        } catch (error) {
          console.error('センサー許可リクエスト中のエラー:', error);
        }
      } else {
        window.addEventListener('devicemotion', handleDeviceMotion);
      }
    };

    requestPermission();
    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, []);

  // 表示上の移動をより大きく見せるため、スケールファクターを増加（例: 1m → 150px）
  const scaleFactor = 15000;
  const movingStyle: React.CSSProperties = {
    transform: `translate(${fusionData.displacement.x * scaleFactor}px, ${fusionData.displacement.y * scaleFactor}px)`,
    transition: 'transform 0.05s linear', // 応答速度を上げるために短いtransition
    width: '150px',
    height: '150px',
    backgroundColor: 'lightblue',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>センサーフュージョン - 高感度移動検出</h1>
      <p>
        移動量: {(fusionData.displacement.x * scaleFactor).toFixed(2)} px, {(fusionData.displacement.y * scaleFactor).toFixed(2)} px
      </p>
      <p>
        傾き (pitch, roll): {(fusionData.orientation.pitch * 180 / Math.PI).toFixed(2)}°, {(fusionData.orientation.roll * 180 / Math.PI).toFixed(2)}°
      </p>
      <div style={movingStyle}>
        移動する要素
      </div>
      <p style={{ fontSize: '0.8rem', color: 'gray' }}>
        ※ このコードは実験的なもので、感度やフィルタパラメータは環境に合わせて調整してください。
      </p>
    </div>
  );
};

export default SensorFusionResponsive;
