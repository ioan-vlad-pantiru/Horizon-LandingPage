// pages/team.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import Team from '../components/Team';
import Contact from '../components/Contact';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';

const TeamPage: NextPage = () => {
    const joinTeamRef = useRef(null);
    const isJoinTeamInView = useInView(joinTeamRef, { once: true, amount: 0.1 });
    
    // Force scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Head>
                <title>Meet Our Team | Horizon</title>
                <meta name="description" content="Meet the passionate team behind Horizon - revolutionizing motorcycle navigation and safety." />
                <link rel="icon" href="/horizon-logo.ico" />
            </Head>

            <main>
                {/* Hero Section for Team Page */}
                <section className="relative flex items-center justify-center py-32 bg-black text-center overflow-hidden">
                    {/* Background effect */}
                    <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-90"></div>

                    {/* HUD grid overlay effect */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.3)_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>

                    {/* Content overlay */}
                    <div className="absolute inset-0 bg-black opacity-60"></div>

                    <motion.div
                        className="relative z-10 px-6 py-12"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                            The <span className="text-horizonBlue font-black tracking-wide">Team</span> Behind Horizon
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                            Meet the passionate riders, engineers, and innovators building the future of motorcycle navigation and safety.
                        </p>
                    </motion.div>
                </section>

                {/* Team Component */}
                <Team />

                {/* Join Our Team Section */}
                <section ref={joinTeamRef} className="py-20 bg-gray-900">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isJoinTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                                Join the <span className="text-horizonBlue">Horizon</span> Team
                            </h2>
                            <p className="text-gray-300 mb-8">
                                Passionate about motorcycles and technology? We&#39;re always looking for talented individuals to join our mission of making riding safer and more connected.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Contact section */}
                <Contact />
            </main>
        </>
    );
};

export default TeamPage;