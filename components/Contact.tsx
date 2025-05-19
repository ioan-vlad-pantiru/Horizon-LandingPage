import { useState } from "react";
import { motion } from "framer-motion";

const Contact: React.FC = () => {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        success?: boolean;
        message?: string;
    }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus({});
        
        try {
            // Change the URL to your PHP script location
            const response = await fetch('https://horizon-hud.eu/send-email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setSubmitStatus({
                    success: true,
                    message: "Thank you! Your message has been sent."
                });
                setForm({ name: "", email: "", message: "" });
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

    // Rest of the component remains the same
    return (
        <section className="bg-gray-900 text-gray-200 py-16 px-6" id="contact">
            {/* Existing JSX */}
            <div className="max-w-2xl mx-auto">
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
                        value={form.name} 
                        onChange={handleChange} 
                        required
                        disabled={isSubmitting}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        className="px-4 py-3 rounded bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-horizonBlue"
                        value={form.email} 
                        onChange={handleChange} 
                        required
                        disabled={isSubmitting}
                    />
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        rows={4}
                        className="px-4 py-3 rounded bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-horizonBlue"
                        value={form.message} 
                        onChange={handleChange} 
                        required
                        disabled={isSubmitting}
                    />
                    
                    {submitStatus.message && (
                        <div className={`p-3 rounded ${submitStatus.success ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'}`}>
                            {submitStatus.message}
                        </div>
                    )}
                    
                    <button
                        type="submit"
                        className={`bg-horizonBlue hover:bg-horizonBlue/80 text-white font-semibold py-3 px-6 rounded transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </motion.form>
                
                <div className="mt-8 text-center text-gray-400">
                    or email us at <a href="mailto:contact@horizon-hud.eu" className="text-horizonBlue hover:underline">contact@horizon-hud.eu</a>
                </div>
            </div>
        </section>
    );
};

export default Contact;