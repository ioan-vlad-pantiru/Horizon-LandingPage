import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect } from "react";

type TeamMember = {
    id: number;
    name: string;
    role: string;
    bio: string;
    imageUrl: string;
    social?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
    };
};

const teamMembers: TeamMember[] = [
    {
        id: 1,
        name: "Pantiru Ioan-Vlad",
        role: "Co-Founder and AI engineer",
        bio: "Rider for 5+ years and student at UBB Cluj. Founded Horizon to revolutionize the riding experience.",
        imageUrl: "/team/pantiru-vlad.jpg",
        social: {
            linkedin: "https://linkedin.com/in/ioan-vlad-pantiru",
            github: "https://github.com/Penzero"
        }
    },
    {
        id: 2,
        name: "George Dan Cristian",
        role: "Co-founder and Software Engineer",
        bio: "Software architect specialized in IoT and real-time data processing. Leads our technical innovation and development.",
        imageUrl: "/team/cristian-george.jpeg",
        social: {
            linkedin: "https://linkedin.com/in/dan-cristian-george-2a000620a",
            github: "https://github.com/CristiG21"
        }
    },
];

const Team: React.FC = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });
    
    // Force scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <section ref={ref} className="py-20 bg-black text-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Meet the <span className="text-horizonBlue">Team</span>
                    </h2>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        The passionate riders and innovators behind Horizon, dedicated to revolutionizing your experience on the road.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 25}}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="bg-gray-900 rounded-lg overflow-hidden hover:shadow-[0_0_15px_rgba(0,157,255,0.3)] transition-shadow"
                        >
                            <div className="relative h-72 w-full bg-gray-800">
                                {/* Replace with actual team member images or use placeholders */}
                                <Image
                                    src={member.imageUrl}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                        // Fallback to a placeholder if image fails to load
                                        const target = e.target as HTMLImageElement;
                                        target.src = "https://placehold.co/400x500/171717/009dff?text=Horizon+Team";
                                    }}
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-horizonBlue">{member.name}</h3>
                                <p className="text-gray-400 mb-4">{member.role}</p>
                                <p className="text-gray-300 mb-5">{member.bio}</p>

                                {/* Social links */}
                                {member.social && (
                                    <div className="flex space-x-4">
                                        {member.social.linkedin && (
                                            <a
                                                href={member.social.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-horizonBlue transition-colors"
                                            >
                                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                                                </svg>
                                            </a>
                                        )}
                                        {member.social.twitter && (
                                            <a
                                                href={member.social.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-horizonBlue transition-colors"
                                            >
                                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.16a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                                                </svg>
                                            </a>
                                        )}
                                        {member.social.github && (
                                            <a
                                                href={member.social.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-horizonBlue transition-colors"
                                            >
                                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;