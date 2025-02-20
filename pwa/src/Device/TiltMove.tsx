import React, { useEffect, useState } from 'react';

const TiltMove: React.FC = () => {
  // 傾きの値(beta: 前後, gamma: 左右)
  const [tilt, setTilt] = useState({ beta: 0, gamma: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // 値が null の場合は 0 をセット
      const beta = event.beta ?? 0;   // 前後の傾き
      const gamma = event.gamma ?? 0; // 左右の傾き
      setTilt({ beta, gamma });
    };

    // iOS 13+ 対応: ユーザーの操作後に許可リクエストを行う必要がある
    const requestPermission = async () => {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof (DeviceOrientationEvent as any).requestPermission === 'function'
      ) {
        try {
          const response = await (DeviceOrientationEvent as any).requestPermission();
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          } else {
            setError('センサー利用の許可が得られませんでした');
          }
        } catch (err) {
          console.error(err);
          setError('センサー利用許可のリクエスト中にエラーが発生しました');
        }
      } else {
        // iOS以外のブラウザや許可不要の場合
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };

    // 許可リクエストはユーザー操作後に行うのが望ましいため、
    // 必要であればボタン等で呼び出す設計にするのがベターです
    requestPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // 傾きの値を利用して移動量を決定
  // ここでは単純に倍率をかけていますが、用途に合わせて調整してください
  const translateX = tilt.gamma * 2; // 左右の移動（px 単位）
  const translateY = tilt.beta * 2;  // 前後の移動（px 単位）

  const movingStyle: React.CSSProperties = {
    transform: `translate(${translateX}px, ${translateY}px)`,
    transition: 'transform 0.1s linear',
    width: '200px',
    height: '200px',
    backgroundColor: 'lightblue',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>スマホの傾きに合わせて要素を移動</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Beta (前後): {tilt.beta.toFixed(2)}</p>
      <p>Gamma (左右): {tilt.gamma.toFixed(2)}</p>
      <div style={movingStyle}>
        動く要素
      </div>
    </div>
  );
};

export default TiltMove;
