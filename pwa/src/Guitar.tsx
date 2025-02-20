import DeviceSensor from './Device/DeviceSensor.tsx';
import background from './assets/guiter_board.png'


const Guitar = () => {
  return (
    <div className = 'bg-cover h-700' style={{ backgroundImage: `url(${background})` }}>
      <DeviceSensor />
    </div>
  )
}

export default Guitar
