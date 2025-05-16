import { motion } from "framer-motion";
import { CpuChipIcon, EyeIcon, MapIcon } from "@heroicons/react/24/outline";
import {JSX} from "react";

interface Feature {
    icon: JSX.Element;
    title: string;
    description: string;
}

const features: Feature[] = [
    {
        icon: <CpuChipIcon className="h-8 w-8 text-horizonBlue" />,
        title: "AI-Powered",
        description: "Advanced AI provides real-time insights and hazard warnings as you ride."
    },
    {
        icon: <EyeIcon className="h-8 w-8 text-horizonBlue" />,
        title: "Augmented Reality HUD",
        description: "Transparent HUD on your visor shows navigation, speed, and more without blocking your view."
    },
    {
        icon: <MapIcon className="h-8 w-8 text-horizonBlue" />,
        title: "Navigation",
        description: "Turn-by-turn directions and maps so you never miss a turn, even on the go."
    },
    // ... add more features as needed
];

const Features: React.FC = () => {
    return (
        <section className="bg-gray-900 text-gray-100 py-16 px-6" id="features">
            <div className="max-w-6xl mx-auto">
                <motion.h2
                    className="text-3xl font-bold mb-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Features
                </motion.h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="p-6 bg-gray-800 rounded-lg shadow flex flex-col items-center text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-300">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;