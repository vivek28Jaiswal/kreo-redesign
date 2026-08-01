import React from "react";
import AnnouncementBar from "./AnnouncementBar";
import HeaderControls from "./HeaderControls";
import PixelDecorations from "./PixelDecorations";
import KeyboardShowcase from "./KeyboardShowcase";
import BottomNavDock from "./BottomNavDock";
import ProductStory from "./ProductStory";
import ScrollIndicator from "./ScrollIndicator";
import HeroLandingHeader from "./HeroLandingHeader";
import Footer from "./Footer";

const HeroSection = ({ onModelLoaded, isRevealed }) => {
    return (
        <div className="relative w-full bg-white select-none">
            {/* 1. Fixed Header Action Controls */}
            <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
                <AnnouncementBar />
                <HeaderControls />
            </div>

            {/* 2. Initial Landing Screen Title & Description */}
            <HeroLandingHeader isRevealed={isRevealed} />

            {/* 3. Minimal Luxury Scroll Prompt */}
            {/* <ScrollIndicator isRevealed={isRevealed} /> */}

            {/* Product Journey Container */}
            <div id="product-journey-container" className="relative z-20 w-full bg-white shadow-2xl">
                {/* 4. Sticky 3D WebGL Canvas Layer */}
                <div className="sticky top-0 left-0 w-full h-screen z-10 overflow-hidden pointer-events-auto">
                    <PixelDecorations />
                    <KeyboardShowcase
                        onModelLoaded={onModelLoaded}
                        isRevealed={isRevealed}
                    />
                </div>

                {/* 5. Product Story Chapters (Sections 01 - 07) */}
                <div className="relative z-20 -mt-[100vh]">
                    {/* Hero View Spacer (first 100vh for pristine Hero landing view) */}
                    <div className="w-full h-screen pointer-events-none" />

                    {/* Editorial Product Story Overlay Chapters */}
                    <ProductStory />
                </div>
            </div>

            {/* 6. Modern Luxury Brand Footer */}
            <Footer />

            {/* 7. Fixed Bottom Action Dock */}
            <div className="fixed bottom-4 left-0 right-0 z-40 pointer-events-none">
                <BottomNavDock isRevealed={isRevealed} />
            </div>
        </div>
    );
};

export default HeroSection;
