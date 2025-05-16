import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/solid";
import Countdown from "react-countdown";
import Link from "next/link";

const UNITS_LEFT = 100;

const Preorder: NextPage = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: integrate actual submission endpoint
        alert("Thanks for preordering! We've reserved your spot.");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 text-gray-100">
            <Head>
                <title>Preorder Horizon HUD</title>
            </Head>

            {/* Hero Section */}
            <header className="relative flex-1 flex flex-col justify-center items-center text-center py-20 px-6">
                <Image
                    src="/horizon-logo.png"
                    alt="Horizon HUD in action"
                    width={300}
                    height={300}
                    className="mb-8 animate-pulse"
                />
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-6xl font-extrabold mb-4"
                >
                    See the Ride Differently
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-2xl text-lg text-gray-300 mb-8"
                >
                    Experience real-time stats, navigation, and alerts directly in your line of sight. Preorder today and be among the first to ride into the future.
                </motion.p>

                {/* Countdown Timer */}
                <div className="flex space-x-4 mb-8">
                    <Countdown
                        date={new Date(Date.now() + 4 * 30 * 24 * 60 * 60 * 1000)} // Approximately 4 months
                        renderer={({ days, hours, minutes, seconds }) => (
                            <div className="bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
                                <span className="text-2xl font-bold">{days}</span>d <span className="text-2xl font-bold">{hours}</span>h <span className="text-2xl font-bold">{minutes}</span>m <span className="text-2xl font-bold">{seconds}</span>s
                            </div>
                        )}
                    />
                </div>

                {/* Units Left Bar */}
                <div className="w-full max-w-xl mb-12">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Units left</span>
                        <span>{UNITS_LEFT}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                        <div className="bg-horizonBlue h-3 rounded-full w-full"></div>
                    </div>
                </div>

                {/* Call to Action */}
                <motion.a
                    href="#preorder-form"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-horizonBlue text-white font-semibold py-4 px-10 rounded-full shadow-2xl"
                >
                    Reserve Your Spot
                </motion.a>
            </header>

            <main className="py-12 px-6">
                <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {[
                        { title: "Early-Bird Pricing", desc: "Save 15% off the expected retail price ($699)", icon: <CheckIcon className="h-8 w-8 text-horizonBlue" /> },
                        { title: "Priority Shipping", desc: "First production batch ships out in June 2025", icon: <CheckIcon className="h-8 w-8 text-horizonBlue" /> },
                        { title: "Limited Units", desc: `Only ${UNITS_LEFT} units available for preorder`, icon: <CheckIcon className="h-8 w-8 text-horizonBlue" /> },
                        { title: "Zero Upfront", desc: "No payment required until shipping", icon: <CheckIcon className="h-8 w-8 text-horizonBlue" /> },
                    ].map((f) => (
                        <motion.div
                            key={f.title}
                            whileHover={{ translateY: -5 }}
                            className="bg-gray-800 p-6 rounded-2xl shadow-xl flex items-start space-x-4"
                        >
                            {f.icon}
                            <div>
                                <h3 className="font-semibold text-xl mb-1">{f.title}</h3>
                                <p className="text-gray-400 text-sm">{f.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </section>

                <section id="preorder-form" className="max-w-md mx-auto bg-gray-800 p-8 rounded-2xl shadow-2xl">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Reserve Your Horizon HUD</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm mb-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                required
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-horizonBlue"
                                placeholder="you@example.com"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-horizonBlue text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-opacity-90"
                        >
                            Preorder for $599
                        </button>
                        <p className="text-xs text-gray-500 text-center">*No payment required until shipment. Cancel anytime.</p>
                    </form>
                </section>
            </main>

            <footer className="text-center text-gray-500 py-6">
                <p>
                    Questions? <Link href="/#contact" className="text-horizonBlue hover:underline">Contact Us</Link>
                </p>
                <p className="text-xs mt-2">© 2025 Horizon Technologies. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Preorder;