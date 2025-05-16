import { motion } from "framer-motion";
import { DevicePhoneMobileIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import HelmetIcon from "./HelmetIcon";
// Assume HelmetIcon is a custom icon if not in Heroicons (or use a generic icon)

const HowItWorks: React.FC = () => {
    return (
        <section className="bg-black text-gray-200 py-16 px-6" id="how-it-works">
            <div className="max-w-5xl mx-auto text-center">
                <motion.h2
                    className="text-3xl font-bold mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    How It Works
                </motion.h2>
                <div className="grid md:grid-cols-3 gap-8 text-left">
                    <motion.div
                        className="flex flex-col items-center md:items-start"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <HelmetIcon className="h-10 w-10 text-horizonBlue mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Mount on Helmet</h3>
                        <p>Attach the Horizon HUD unit onto your helmet. Its sleek design integrates seamlessly.</p>
                    </motion.div>
                    <motion.div
                        className="flex flex-col items-center md:items-start"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <DevicePhoneMobileIcon className="h-10 w-10 text-horizonBlue mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Connect to App</h3>
                        <p>Pair the HUD with the Horizon mobile app via Bluetooth. Customize your dashboard through the app.</p>
                    </motion.div>
                    <motion.div
                        className="flex flex-col items-center md:items-start"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <LightBulbIcon className="h-10 w-10 text-horizonBlue mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Ride Smart</h3>
                        <p>Hit the road! See turn-by-turn navigation, speed, and AI safety alerts projected in your line of sight.</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;