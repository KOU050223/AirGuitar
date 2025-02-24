import React from 'react';

type SoundButtonProps = {
    label: string;
    onClick: () => void;
    active?: boolean;
  };

const SoundButton: React.FC<SoundButtonProps> = ({label,onClick, active = false}) => {
    
  
    return (
        <button
            onClick={onClick}
            className={`
                w-full h-full flex flex-col items-center justify-center
                px-6 py-4 rounded-lg transition-colors duration-200
                ${active 
                  ? 'bg-green-500 hover:bg-green-600 active:bg-green-700'
                  : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300
                text-2xl
              `} 
      >
        {label}
      </button>
    );
};

export default SoundButton;
