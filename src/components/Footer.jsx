import React from "react";

const FooterContent = () => {
    return (
        <div className="w-full h-full bg-white text-neutral-900 pt-16 md:pt-24 pb-8 px-6 sm:px-12 md:px-20 lg:px-28 select-none flex flex-col justify-between border-t border-neutral-100">
            {/* Upper Footer: 3 Columns */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start mb-16 md:mb-24">
                {/* Column 1: Reach out to us */}
                <div className="flex flex-col space-y-4">
                    <h3 className="text-xl font-medium text-neutral-900 tracking-tight">
                        Reach out to us:
                    </h3>
                    <div className="space-y-2 text-sm text-neutral-900">
                        <a
                            href="tel:+919611507877"
                            className="block underline underline-offset-4 hover:opacity-75 transition-opacity font-normal"
                        >
                            +91 9611507877
                        </a>
                        <a
                            href="mailto:help@kreo-tech.com"
                            className="block underline underline-offset-4 hover:opacity-75 transition-opacity font-normal"
                        >
                            help@kreo-tech.com
                        </a>
                    </div>
                </div>

                {/* Column 2: Quick links */}
                <div className="flex flex-col space-y-4">
                    <h3 className="text-xl font-medium text-neutral-900 tracking-tight">
                        Quick links
                    </h3>
                    <ul className="space-y-2 text-sm text-neutral-900 font-normal">
                        {[
                            "Downloads",
                            "FAQs",
                            "Track Order",
                            "Warranty",
                            "Contact Us",
                            "B2B Orders",
                            "Kreator Program",
                            "Campus Ambassador Program",
                            "Blog",
                        ].map((link) => (
                            <li key={link}>
                                <span className="cursor-pointer hover:opacity-70 transition-opacity">
                                    {link}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 3: Socials */}
                <div className="flex flex-col space-y-4">
                    <h3 className="text-xl font-medium text-neutral-900 tracking-tight">
                        Socials
                    </h3>
                    <ul className="space-y-2 text-sm text-neutral-900 font-normal">
                        {["X", "Instagram", "Youtube", "Discord"].map(
                            (social) => (
                                <li key={social}>
                                    <span className="cursor-pointer hover:opacity-70 transition-opacity">
                                        {social}
                                    </span>
                                </li>
                            ),
                        )}
                    </ul>
                </div>
            </div>

            {/* Lower Footer: Giant kreo: typography */}
            <div className="w-full -mb-6 md:-mb-12 pointer-events-none absolute left-0 -bottom-1/3">
                <h1 className="text-[25vw] md:text-[50vw] font-medium text-black leading-none tracking-tighter select-none">
                    kreo:
                </h1>
            </div>
        </div>
    );
};

const Footer = () => {
    return (
        <div
            id="main-footer-wrapper"
            className="relative h-screen w-full"
            style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        >
            <div
                id="main-footer"
                className="fixed bottom-0 h-screen w-full z-10"
            >
                <FooterContent />
            </div>
        </div>
    );
};

export default Footer;
