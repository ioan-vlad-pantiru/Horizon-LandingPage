import { motion } from "framer-motion";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";

const testimonials = [
    { quote: "I'm really looking forward to seeing how Horizon HUD will transform the riding experience. The idea of having a co-pilot guiding me sounds incredible!", name: "Daria B." },
    { quote: "As a safety-conscious rider, I love the real-time hazard alerts. Horizon is a game-changer.", name: "Razvan R." },
    { quote: "I can't wait to use Horizon for navigation. It would be so much easier to keep my eyes on the road while following directions.", name: "Nicu B." }
];

const Testimonials: React.FC = () => {
    return (
        <section className="bg-black text-gray-200 py-16 px-6" id="testimonials">
            <div className="max-w-5xl mx-auto text-center">
                <motion.h2
                    className="text-3xl font-bold mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Testimonials
                </motion.h2>
                <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={index}
                            className="bg-gray-800 p-6 rounded-lg flex-1"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 text-horizonBlue mb-2 inline-block" />
                            <p className="italic mb-4">&ldquo;{t.quote}&rdquo;</p>
                            <p className="font-semibold text-horizonBlue">– {t.name}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;