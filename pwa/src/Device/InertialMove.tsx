import React, { useEffect, useRef, useState } from 'react';

interface Displacement {
  x: number; // 横方向の移動（メートル単位）
  y: number; // 縦方向の移動（メートル単位）
}

const InertialMoveImproved: React.FC = () => {
  // 加速度の積分で求めた移動量（メートル単位）
  const [displacement, setDisplacement] = useState<Displacement>({ x: 0, y: 0 });
  // 現在の速度（メートル/秒）を保持するRef
  const velocityRef = useRef({ x: 0, y: 0 });
  // 前回イベントのタイムスタンプ（ミリ秒単位）
  const lastTimestampRef = useRef<number | null>(null);
  // 加速度バイアス（初期静止状態での補正用）
  const biasRef = useRef({ x: 0, y: 0 });
  // 初期状態の計測回数（バイアス測定用）
  const calibrationCountRef = useRef(0);
  // 低域通過フィルタ用の平滑化係数 (0～1: 低いほど平滑)
  const alpha = 0.1;
  // 前回の加速度値（フィルタ用）
  const filteredAccRef = useRef({ x: 0, y: 0 });
  // ノイズ除去のための閾値（単位: m/s^2）
  const accelerationThreshold = 0.05;

  const handleDeviceMotion = (event: DeviceMotionEvent) => {
    const acc = event.acceleration;
    if (acc && acc.x !== null && acc.y !== null) {
      const currentTime = event.timeStamp;
      let dt = 0;
      if (lastTimestampRef.current !== null) {
        dt = (currentTime - lastTimestampRef.current) / 1000;
      }
      lastTimestampRef.current = currentTime;
      if (dt <= 0) return;

      // 初期静止状態でバイアスを測定する（例: 最初の1秒間）
      if (calibrationCountRef.current < 10) {
        biasRef.current.x = (biasRef.current.x * calibrationCountRef.current + acc.x) / (calibrationCountRef.current + 1);
        biasRef.current.y = (biasRef.current.y * calibrationCountRef.current + acc.y) / (calibrationCountRef.current + 1);
        calibrationCountRef.current++;
        return; // バイアス測定中は処理しない
      }

      // バイアス補正
      const accCorrected = {
        x: acc.x - biasRef.current.x,
        y: acc.y - biasRef.current.y,
      };

      // 低域通過フィルタの適用
      filteredAccRef.current.x = filteredAccRef.current.x * (1 - alpha) + accCorrected.x * alpha;
      filteredAccRef.current.y = filteredAccRef.current.y * (1 - alpha) + accCorrected.y * alpha;

      // ノイズ除去: 小さな加速度はゼロとして扱う
      const filteredAcc = {
        x: Math.abs(filteredAccRef.current.x) > accelerationThreshold ? filteredAccRef.current.x : 0,
        y: Math.abs(filteredAccRef.current.y) > accelerationThreshold ? filteredAccRef.current.y : 0,
      };

      // 積分で速度更新: v = v + a * dt
      velocityRef.current.x += filteredAcc.x * dt;
      velocityRef.current.y += filteredAcc.y * dt;

      // 積分で移動量更新: s = s + v * dt
      setDisplacement(prev => ({
        x: prev.x + velocityRef.current.x * dt,
        y: prev.y + velocityRef.current.y * dt,
      }));

      // ドリフト対策（例: 非常に小さい速度は0にリセット）
      if (Math.abs(velocityRef.current.x) < 0.01) velocityRef.current.x = 0;
      if (Math.abs(velocityRef.current.y) < 0.01) velocityRef.current.y = 0;
    }
  };

  useEffect(() => {
    const requestSensorPermission = async () => {
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
        } catch (err) {
          console.error('センサー許可リクエスト中のエラー:', err);
        }
      } else {
        window.addEventListener('devicemotion', handleDeviceMotion);
      }
    };

    requestSensorPermission();

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, []);

  // 画面上の移動距離の変換スケール（例: 1mの移動を100pxに換算）
  const scaleFactor = 100;

  const movingStyle: React.CSSProperties = {
    transform: `translate(${displacement.x * scaleFactor}px, ${displacement.y * scaleFactor}px)`,
    transition: 'transform 0.1s linear',
    width: '200px',
    height: '200px',
    backgroundColor: 'lightcoral',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2rem',
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>改善版: 微小移動の検出（慣性計測）</h1>
      <p>横方向の移動: {(displacement.x * 100).toFixed(2)} cm</p>
      <p>縦方向の移動: {(displacement.y * 100).toFixed(2)} cm</p>
      <div style={movingStyle}>移動する要素</div>
      <p style={{ fontSize: '0.8rem', color: 'gray' }}>
        ※ この方法でもセンサーのノイズやドリフトの影響は避けがたく、15cm程度の微小移動検出は依然として難しい場合があります。
      </p>
    </div>
  );
};

export default InertialMoveImproved;
