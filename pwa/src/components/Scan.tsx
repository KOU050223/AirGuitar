'use client'
import {useRef,useEffect,useState} from 'react'
import jsQR from 'jsqr'
import { Link } from 'react-router-dom'

// 指定するURLを列挙する（Modeに遷移するURL）
const URL = {
    EasyMode : 'https://172.16.0.42:3000/easy_mode',
    PawerCodeMode : 'https://172.16.0.42:3000/pawer_code_mode',
    SoundSettingMode : 'https://172.16.0.42:3000/sound_setting_mode',
    Connect : 'https://172.16.0.42:3000/connect',
}as const;

// 受け取るURLなどを定義する
// type Props = {
//     url: string
// }
// : React.FC<Props>

const Scan = () => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [result, setResult] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        const constraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: 300 },
            height: { ideal: 300 },
          },
        }
    
        // デバイスのカメラにアクセスする
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => {
            // デバイスのカメラにアクセスすることに成功したら、video要素にストリームをセットする
            if (videoRef.current) {
              videoRef.current.srcObject = stream
              videoRef.current.play()
              scanQrCode()
            }
          })
          .catch((err) => console.error('Error accessing media devices:', err))
    
        const currentVideoRef = videoRef.current
    
        // コンポーネントがアンマウントされたら、カメラのストリームを停止する
        return () => {
          if (currentVideoRef && currentVideoRef.srcObject) {
            const stream = currentVideoRef.srcObject as MediaStream
            const tracks = stream.getTracks()
            tracks.forEach((track) => track.stop())
          }
        }
    }, []);

    useEffect(() => {
        if (result){
            // resultが変更されたら、指定されたURLに遷移する
            window.location.href = result
        }
    }, [result])

    const scanQrCode = () => {
        const video = videoRef.current
        const canvas = canvasRef.current
        if (canvas && video){
            const ctx = canvas.getContext('2d')
            if (ctx){
                // カメラからの映像をcanvasに描画する
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                // QRコードを解析する
                const qrCodeData = jsQR(imageData.data, imageData.width, imageData.height)
                if (qrCodeData){
                    // 内容を確認する
                    if (qrCodeData.data !== URL.EasyMode && qrCodeData.data !== URL.PawerCodeMode && qrCodeData.data !== URL.SoundSettingMode && qrCodeData.data !== URL.Connect){
                        console.log('QR不一致：',qrCodeData.data)       
                        setError('QRコードが一致しません')
                        setTimeout(scanQrCode, 100) // スキャンの頻度を制限
                        return
                    }
                        console.log('QR一致：',qrCodeData.data)
                        setResult(qrCodeData.data)
                        setError('')
                        return 
                }
                setTimeout(scanQrCode, 100) // スキャンの頻度を制限
            }
        }
    }
      
    return (
        <div>
            <h1 className='text-center text-xl font-bold'>QRコードをスキャンしてください</h1>
            <div>
                {!result && (
                    <div className='flex justify-center'>
                    <div className='relative h-[300px] w-[300px]'>
                        <video ref={videoRef} autoPlay playsInline className='absolute left-0 top-0 -z-50 h-[300px] w-[300px]' />
                        <canvas ref={canvasRef} width='300' height='300' className='absolute left-0 top-0' />
                    </div>
                    </div>
                )}
                {result && (
                    <div className='flex justify-center'>
                    <Link to={result}>
                        <button>次の画面へ</button>
                    </Link>
                    </div>
                )}
                {error && <p className='text-center text-xs text-red-500'>{error}</p>}
            </div>
          </div>
      )
}

export default Scan
