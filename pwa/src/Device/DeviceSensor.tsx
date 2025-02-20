import React, { useEffect, useState } from 'react';

interface MotionData {
  加速度: { x: number | null; y: number | null; z: number | null };
  重力を含む加速度: { x: number | null; y: number | null; z: number | null };
  回転速度: { alpha: number | null; beta: number | null; gamma: number | null };
  間隔: number | null;
}

const THRESHOLD = 2; // 加点のしきい値
const SCORE_INCREMENT = 10; // 加点の増加量

const DeviceSensor: React.FC = () => {
  const [motionData, setMotionData] = useState<MotionData>({
    加速度: { x: null, y: null, z: null },
    重力を含む加速度: { x: null, y: null, z: null },
    回転速度: { alpha: null, beta: null, gamma: null },
    間隔: null,
  });

  const [prevAcceleration, setPrevAcceleration] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const [score, setScore] = useState<number>(0);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);

  const handleMotionEvent = (event: DeviceMotionEvent) => {
    if (!isMeasuring) return;
  
    const newAcceleration = {
      x: event.acceleration?.x ?? 0,
      y: event.acceleration?.y ?? 0,
      z: event.acceleration?.z ?? 0,
    };
  
    setMotionData((prevData) => ({
      ...prevData,
      加速度: newAcceleration,
    }));
  
    // ここでスクロール処理を追加
    const scrollFactor = -100000; // 必要に応じて調整
    if (newAcceleration.y !== null) {
      // yが正なら下へ、負なら上へスクロールする
      window.scrollBy({
        top: newAcceleration.y * scrollFactor,
        behavior: 'smooth',
      });
    }
  
    const deltaX = Math.abs(newAcceleration.x - prevAcceleration.x);
    const deltaY = Math.abs(newAcceleration.y - prevAcceleration.y);
    const deltaZ = Math.abs(newAcceleration.z - prevAcceleration.z);
  
    console.log(`deltaX: ${deltaX}, deltaY: ${deltaY}, deltaZ: ${deltaZ}`);
  
    if (deltaX > THRESHOLD || deltaY > THRESHOLD || deltaZ > THRESHOLD) {
      setScore((prevScore) => {
        const newScore = prevScore + SCORE_INCREMENT;
  
        return newScore;
      });
    }
    setPrevAcceleration(newAcceleration);
  };
  
  
  const handleOrientationEvent = (event: DeviceOrientationEvent) => {
    console.log('Orientation data:', event);
  };

  const requestPermissions = async () => {
    try {
      if (typeof DeviceMotionEvent !== 'undefined' && 'requestPermission' in DeviceMotionEvent) {
        const response = await (DeviceMotionEvent as unknown as { requestPermission(): Promise<'granted' | 'denied'> }).requestPermission();
        if (response === 'granted') {
          window.addEventListener('devicemotion', handleMotionEvent);
        } else {
          alert('DeviceMotionEvent permission denied');
        }
      } else {
        window.addEventListener('devicemotion', handleMotionEvent);
      }

      if (typeof DeviceOrientationEvent !== 'undefined' && 'requestPermission' in DeviceOrientationEvent) {
        const response = await (DeviceOrientationEvent as unknown as { requestPermission(): Promise<'granted' | 'denied'> }).requestPermission();
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientationEvent);
        } else {
          alert('DeviceOrientationEvent permission denied');
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientationEvent);
      }
    } catch (error) {
      console.error('Error requesting sensor permissions:', error);
    }
  };

  const stopMeasurement = () => {
    setIsMeasuring(false);
    window.removeEventListener('devicemotion', handleMotionEvent);
    window.removeEventListener('deviceorientation', handleOrientationEvent);
    console.log('Measurement stopped.');
  };

  useEffect(() => {
    if (isMeasuring) {
      requestPermissions();
    } else {
      stopMeasurement();
    }

    return () => {
      stopMeasurement();
    };
  }, [isMeasuring]);

  const handleButtonClick = () => {
    if (!isMeasuring) {
      setIsMeasuring(true);
    }
  };

  const formatNumber = (num: number | null) => (num !== null ? num.toFixed(2) : 'N/A');

  return (
    <div>
      <h2>デバイスデータ取得</h2>
      <button onClick={handleButtonClick}>{isMeasuring ? '計測中...' : 'リクエストを許可'}</button>
      <div>
        <h3>加速度 (Acceleration)</h3>
        <p>X: {formatNumber(motionData.加速度.x)}</p>
        <p>Y: {formatNumber(motionData.加速度.y)}</p>
        <p>Z: {formatNumber(motionData.加速度.z)}</p>
        <h3>スコア (Score): {score}</h3>
      </div>
    </div>
  );
};

export default DeviceSensor;