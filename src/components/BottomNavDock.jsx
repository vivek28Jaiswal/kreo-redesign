import React, { useRef, useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BottomNavDock = ({ isRevealed }) => {
    const dockRef = useRef(null);
    const [isAtFooter, setIsAtFooter] = useState(false);

    useEffect(() => {
        if (!dockRef.current) return;

        if (!isRevealed) {
            // Initial hidden state while loader is active
            gsap.set(dockRef.current, {
                y: 50,
                opacity: 0,
                scale: 0.95,
            });
        } else {
            // Smooth entrance animation staggered after keyboard reveal
            gsap.to(dockRef.current, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1.2,
                delay: 0.85,
                ease: "power3.out",
            });
        }
    }, [isRevealed]);

    useEffect(() => {
        const footerEl = document.getElementById("main-footer-wrapper");
        if (!footerEl) return;

        const st = ScrollTrigger.create({
            trigger: footerEl,
            start: "top 75%",
            end: "bottom bottom",
            onEnter: () => setIsAtFooter(true),
            onLeaveBack: () => setIsAtFooter(false),
        });

        return () => st.kill();
    }, []);

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
            {isAtFooter ? (
                /* Footer-Specific Dock Pills matching Screenshot 3 */
                <div
                    ref={dockRef}
                    className="flex items-center gap-3 sm:gap-4 select-none"
                >
                    {/* Left Pill: © 2026 Kreo */}
                    <div className="bg-neutral-100/90 text-neutral-800 text-xs sm:text-sm font-medium px-4 py-2 rounded-full border border-neutral-300/80 backdrop-blur-md shadow-sm">
                        © 2026 Kreo
                    </div>

                    {/* Center Pill: Ask Krea */}
                    <button className="bg-kreo-purple hover:bg-kreo-purple-dark text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg active:scale-95 cursor-pointer whitespace-nowrap">
                        Ask Krea
                    </button>

                    {/* Right Pill: Explore Kreo */}
                    <button className="bg-kreo-purple hover:bg-kreo-purple-dark text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg active:scale-95 cursor-pointer whitespace-nowrap">
                        Explore Kreo
                    </button>
                </div>
            ) : (
                /* Standard Main Hero Navigation Dock */
                <div
                    ref={dockRef}
                    className="bg-[#111113]/95 backdrop-blur-md text-white px-2.5 py-2 rounded-[4px] flex items-center justify-between gap-6 sm:gap-12 md:gap-24 shadow-2xl border border-white/10"
                >
                    {/* Left Pill: Explore Products */}
                    <button className="bg-kreo-purple hover:bg-kreo-purple-dark text-white text-xs sm:text-sm font-medium px-4 sm:px-5 py-2.5 rounded-[4px] transition-all duration-200 hover:shadow-lg active:scale-95 cursor-pointer whitespace-nowrap">
                        Explore Products
                    </button>

                    {/* Center: Kreo Logo */}
                    <div className="flex items-center justify-center">
                        <img src="/images/kreologo.svg" alt="Kreo Logo" className="w-14" />
                    </div>

                    {/* Right Pill: Buy Now */}
                    <button className="group bg-white hover:bg-gray-100 text-kreo-dark text-xs sm:text-sm font-medium pl-4 sm:pl-5 pr-2 py-2 rounded-[6px] flex items-center gap-3 transition-all duration-300 hover:shadow-lg active:scale-95 cursor-pointer whitespace-nowrap">
                        <span className="text-[15px] tracking-tight">Buy now</span>
                        
                        {/* Dark badge enclosing the arrow with diagonal duplicate slide animation */}
                        <div className="w-7 h-7 bg-[#141414] text-white rounded-[6px] flex items-center justify-center relative overflow-hidden shadow-sm">
                            {/* Main Arrow */}
                            <ArrowUpRight className="w-4 h-4 stroke-[2] transition-transform duration-300 ease-in-out group-hover:translate-x-full group-hover:-translate-y-full" />
                            
                            {/* Duplicate Arrow */}
                            <ArrowUpRight className="w-4 h-4 stroke-[2] absolute -translate-x-full translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0" />
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default BottomNavDock;
