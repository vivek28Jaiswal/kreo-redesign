import React, { useState } from 'react';
import { Volume2, VolumeX, Menu } from 'lucide-react';

const HeaderControls = () => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <header className="w-full px-6 md:px-6 mt-4 flex items-center justify-between relative z-20 pointer-events-auto">
      {/* Left: Esc Badge */}
      <button 
        aria-label="Escape key indicator"
        className="bg-kreo-dark hover:bg-black text-white text-xs  px-3 py-2 rounded-[4px] shadow-sm transition-transform active:scale-95 duration-150 flex items-center justify-center cursor-pointer"
      >
        Esc
      </button>

      {/* Right Controls: Mute & Menu */}
      <div className="flex items-center gap-3">
        {/* Mute/Sound Toggle Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          aria-label="Toggle Sound"
          className="w-10 h-10 bg-kreo-dark hover:bg-black text-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white/90" />
          ) : (
            <Volume2 className="w-4 h-4 text-white/90" />
          )}
        </button>

        {/* Menu Button */}
        <button
          aria-label="Open Menu"
          className="w-10 h-10 bg-kreo-dark hover:bg-black text-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Menu className="w-4 h-4 text-white/90" />
        </button>
      </div>
    </header>
  );
};

export default HeaderControls;
