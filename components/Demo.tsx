import { motion } from "framer-motion";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const Demo: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayVideo = () => {
        setIsPlaying(true);
    };

    return (
        <section className="bg-gradient-to-b from-gray-900 to-black py-24 px-6 text-center" id="demo">
            <div className="max-w-5xl mx-auto">
                <motion.h2
                    className="text-4xl font-bold text-white mb-3 tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Experience Horizon
                </motion.h2>
                
                <motion.p 
                    className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    See how our technology transforms your riding experience
                </motion.p>
                
                <motion.div
                    className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] h-64 md:h-[550px] flex items-center justify-center group"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    {!isPlaying ? (
                        <>
                            {/* Video Thumbnail with improved overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-horizonBlue/30 to-purple-900/50 backdrop-blur-sm"></div>
                            <div className="absolute inset-0 bg-black/40"></div>
                            
                            {/* Placeholder image (add your own image path) */}
                            <img 
                                src="/thumbnail.png"
                                alt="Video thumbnail" 
                                className="absolute inset-0 w-full h-full object-cover opacity-90"
                            />
                            
                            {/* Modern play button with hover effects */}
                            <motion.button 
                                onClick={handlePlayVideo}
                                className="relative z-10 flex items-center justify-center bg-white rounded-full p-5 group-hover:bg-horizonBlue transition-all duration-300 group-hover:scale-105"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <PlayIcon className="h-12 w-12 text-gray-900 group-hover:text-white transition-colors duration-300" />
                            </motion.button>
                            
                            {/* Video title overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white text-xl font-medium text-left">
                                    Horizon Technology Preview
                                </p>
                                <p className="text-gray-300 text-left">
                                    Official Demo Video
                                </p>
                            </div>
                        </>
                    ) : (
                        <video
                            className="w-full h-full object-cover"
                            controls
                            autoPlay
                            src="/Horizon-video.mp4"
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}
                </motion.div>
                
                {!isPlaying && (
                    <motion.div
                        className="mt-8 flex items-center justify-center gap-2 text-gray-400"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="inline-block w-1 h-1 rounded-full bg-horizonBlue"></span>
                        <span>Click to play demo video</span>
                        <span className="inline-block w-1 h-1 rounded-full bg-horizonBlue"></span>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Demo;