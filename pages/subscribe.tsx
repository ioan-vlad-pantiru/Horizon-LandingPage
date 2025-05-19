import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {CheckIcon} from "@heroicons/react/24/solid";

const Subscribe: NextPage = () => {
    // State to manage form inputs
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        intention: "",
        linkedin: ""
    });

    // State to manage form submission
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        success?: boolean;
        message?: string;
    }>({});

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus({});

        try {
            // You'll need to create this endpoint in your API folder
            const response = await fetch('https://horizon-hud.eu/subscribe.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus({
                    success: true,
                    message: "Thank you for subscribing to our updates!"
                });
                setFormData({ name: "", email: "", phone: "", intention: "", linkedin: "" });
            } else {
                setSubmitStatus({
                    success: false,
                    message: data.message || "Something went wrong. Please try again."
                });
            }
        } catch (error: unknown) {
            // Type guard to ensure error is an Error object
            const errorMessage = error instanceof Error 
                ? `${error.name}: ${error.message}` 
                : 'Unknown error occurred';
            
            setSubmitStatus({
                success: false,
                message: errorMessage
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 text-gray-100">
            <Head>
                <title>Subscribe to Horizon Updates</title>
            </Head>

            {/* Hero Section */}
            <header className="relative flex-1 flex flex-col justify-center items-center text-center py-20 px-6">
                <Image
                    src="/horizon-logo.png"
                    alt="Horizon HUD"
                    width={300}
                    height={300}
                    className="mb-8"
                />
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-6xl font-extrabold mb-4"
                >
                    Join the Horizon Journey
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-2xl text-lg text-gray-300 mb-8"
                >
                    Be the first to receive updates about our innovative HUD technology, investment opportunities, and launch dates.
                </motion.p>

                {/* Call to Action */}
                <motion.a
                    href="#subscribe-form"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-horizonBlue text-white font-semibold py-4 px-10 rounded-full shadow-2xl"
                >
                    Subscribe Now
                </motion.a>
            </header>

            <main className="py-12 px-6">

                <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {[
                        { title: "Early-Bird Pricing", desc: "Save 15% off the expected retail price ($599)", icon: <CheckIcon className="h-8 w-8 text-horizonBlue" /> },
                        { title: "Priority Shipping", desc: "First production batch ships out in June 2025", icon: <CheckIcon className="h-8 w-8 text-horizonBlue" /> },
                        { title: "Exclusive Updates", desc: "Be the first to receive product news, launch announcements, and insider previews.", icon: <CheckIcon className="h-8 w-8 text-horizonBlue" /> },
                        { title: "Community access", desc: "Connect with fellow early supporters and join exclusive discussions and events.", icon: <CheckIcon className="h-8 w-8 text-horizonBlue" /> },
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
                <section id="subscribe-form" className="max-w-lg mx-auto bg-gray-800 p-8 rounded-2xl shadow-2xl">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Stay Updated</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm mb-1">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-horizonBlue"
                                placeholder="Alexandru Popescu"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm mb-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-horizonBlue"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm mb-1">Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-horizonBlue"
                                placeholder="+40 123 456 7890"
                            />
                        </div>

                        <div>
                            <label htmlFor="intention" className="block text-sm mb-1">I am interested as a</label>
                            <select
                                id="intention"
                                name="intention"
                                value={formData.intention}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-horizonBlue"
                            >
                                <option value="">Please select...</option>
                                <option value="investor">Investor/Collaborator</option>
                                <option value="rider">Rider</option>
                                <option value="customer">Customer</option>
                                <option value="curious">Just Curious</option>
                            </select>
                        </div>

                        {formData.intention === "investor" && (
                            <div>
                                <label htmlFor="linkedin" className="block text-sm mb-1">LinkedIn Profile</label>
                                <input
                                    type="url"
                                    id="linkedin"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-horizonBlue"
                                    placeholder="https://linkedin.com/in/yourprofile"
                                />
                            </div>
                        )}

                        {submitStatus.message && (
                            <div className={`p-3 rounded ${submitStatus.success ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'}`}>
                                {submitStatus.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`w-full bg-horizonBlue text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-opacity-90 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Subscribe'}
                        </button>
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

export default Subscribe;