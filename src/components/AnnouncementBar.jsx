import React from 'react';

const AnnouncementBar = () => {
  const items = [
    "Azure V2 New Launch",
    "Freebies on orders above 2000rs.",
    "7 Days Return and Replacement",
    "Azure V2 New Launch",
    "Freebies on orders above 2000rs.",
    "7 Days Return and Replacement",
    "Azure V2 New Launch",
    "Freebies on orders above 2000rs.",
    "7 Days Return and Replacement",
  ];

  return (
    <div className="bg-kreo-purple text-white py-2 overflow-hidden select-none relative z-30 mx-6 mt-6 rounded-[4px]">
      <div className="animate-marquee-slow flex items-center space-x-6 text-[13px] font-[ppnormal] tracking-wide">
        {/* Doubled for seamless infinite scroll loop */}
        {[...items, ...items].map((text, idx) => (
          <React.Fragment key={idx}>
            <span className="shrink-0">{text}</span>
            <span className="opacity-60 text-xs shrink-0">|</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
