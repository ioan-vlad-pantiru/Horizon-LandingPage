import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const Hero: React.FC = () => {
    return (
        <section className="relative flex items-center justify-center min-h-screen bg-black text-center overflow-hidden">
            {/* Background effect */}
            <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-10 animate-pulse"></div>

            {/* HUD grid overlay effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.3)_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>

            {/* Content overlay */}
            <div className="absolute inset-0 bg-black opacity-60"></div>

            <motion.div
                className="relative z-10 px-6 py-12"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                {/* Logo */}
                <Image
                    src="/horizon-logo.png"
                    alt="Horizon Logo"
                    width={320} height={320}
                    className="mx-auto mb-4 drop-shadow-lg hover:scale-105 transition-transform"
                />

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">
                    Ride with us — to the <span className="text-horizonBlue font-black tracking-wide">Horizon</span>
                </h1>

                {/* Subheading */}
                <p className="text-gray-300 text-lg md:text-2xl max-w-xl mx-auto mb-8">
                    Experience the road like never before – with real-time traffic alerts, rider safety insights, and futuristic navigation.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        href="/preorder"
                        className="bg-horizonBlue hover:bg-horizonBlue/80 text-white font-semibold py-3 px-6 rounded shadow-lg transition"
                    >
                        Preorder Now
                    </Link>
                    <Link
                        href="#demo"
                        className="border border-horizonBlue text-horizonBlue hover:bg-horizonBlue hover:text-white font-medium py-3 px-6 rounded transition"
                    >
                        Watch Demo
                    </Link>
                </div>

                {/* Scroll cue */}
                <div className="mt-12 animate-bounce text-horizonBlue">
                    ↓ Explore Features
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
