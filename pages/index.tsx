import type { NextPage } from "next";
import Head from "next/head";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Demo from "../components/Demo";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";


const Home: NextPage = () => {
    return (
        <div className="bg-black text-white">
            <Head>
                <title>Horizon – AI Motorcycle Helmet HUD</title>
                <meta name="description" content="Horizon is an AI-powered motorcycle helmet heads-up display that enhances your ride with augmented reality." />
            </Head>

            {/* Each section imported as a component */}
            <Hero />
            <Features />
            <HowItWorks />
            <Demo />
            <Testimonials />
            <Contact />
        </div>
    );
};

export default Home;