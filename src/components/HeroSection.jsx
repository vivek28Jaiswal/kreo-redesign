import React from "react";
import AnnouncementBar from "./AnnouncementBar";
import HeaderControls from "./HeaderControls";
import PixelDecorations from "./PixelDecorations";
import KeyboardShowcase from "./KeyboardShowcase";
import BottomNavDock from "./BottomNavDock";
import ProductStory from "./ProductStory";

const HeroSection = ({ onModelLoaded, isRevealed }) => {
    return (
        <div id="product-journey-container" className="relative w-full bg-white select-none">
            {/* 1. Fixed Header Action Controls */}
            <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
                <AnnouncementBar />
                <HeaderControls />
            </div>

            {/* 2. Sticky 3D WebGL Canvas Layer (Fixed position during story scroll) */}
            <div className="sticky top-0 left-0 w-full h-screen z-10 overflow-hidden pointer-events-auto">
                <PixelDecorations />
                <KeyboardShowcase
                    onModelLoaded={onModelLoaded}
                    isRevealed={isRevealed}
                />
            </div>

            {/* 3. Scrollable Product Story Chapters (Sections 01 - 07) */}
            <div className="relative z-20 -mt-[100vh]">
                {/* Hero Spacer (first 100vh for pristine Hero View) */}
                <div className="w-full h-screen pointer-events-none" />

                {/* Editorial Product Story Overlay */}
                <ProductStory />
            </div>

            {/* 4. Fixed Bottom Action Dock */}
            <div className="fixed bottom-4 left-0 right-0 z-40 pointer-events-none">
                <BottomNavDock isRevealed={isRevealed} />
            </div>
        </div>
    );
};

export default HeroSection;
