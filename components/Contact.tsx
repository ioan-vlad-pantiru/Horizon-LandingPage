import { useState } from "react";
import { motion } from "framer-motion";

const Contact: React.FC = () => {
    // Simple local state for form (just to demonstrate controlled inputs)
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // For now, just log the form or alert (in real site, send to API or use mailto)
        console.log("Contact Form Submission:", form);
        alert("Thank you! We will be in touch.");
        setForm({ name: "", email: "", message: "" });
    };

    return (
        <section className="bg-gray-900 text-gray-200 py-16 px-6" id="contact">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    className="text-3xl font-bold mb-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Contact Us
                </motion.h2>
                <motion.form
                    onSubmit={handleSubmit}
                    className="flex flex-col space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        className="px-4 py-3 rounded bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-horizonBlue"
                        value={form.name} onChange={handleChange} required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        className="px-4 py-3 rounded bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-horizonBlue"
                        value={form.email} onChange={handleChange} required
                    />
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        rows={4}
                        className="px-4 py-3 rounded bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-horizonBlue"
                        value={form.message} onChange={handleChange} required
                    />
                    <button
                        type="submit"
                        className="bg-horizonBlue hover:bg-horizonBlue/80 text-white font-semibold py-3 px-6 rounded"
                    >
                        Send Message
                    </button>
                </motion.form>
                {/* Alternatively, provide contact info */}
                <div className="mt-8 text-center text-gray-400">
                    or email us at <a href="mailto:info@horizonhud.example" className="text-horizonBlue hover:underline">info@horizonhud.example</a>
                </div>
            </div>
        </section>
    );
};

export default Contact;