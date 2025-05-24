import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect } from "react";

type TeamMember = {
    id: number;
    name: string;
    title?: string;
    role: string;
    bio: string;
    imageUrl: string;
    social?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
        instagram?: string;
    };
};

type Advisor = {
    id: number;
    name: string;
    title: string;
    role?: string;
    bio: string;
    imageUrl: string;
    social?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
        instagram?: string;
    };
};

const teamMembers: TeamMember[] = [
    {
        id: 1,
        name: "Pantiru Ioan-Vlad",
        role: "Co-Founder and AI Engineer",
        bio: "Rider for 5+ years and student at UBB Cluj. Co-Founded Horizon to revolutionize the riding experience.",
        imageUrl: "/team/pantiru-vlad.jpg",
        social: {
            linkedin: "https://linkedin.com/in/ioan-vlad-pantiru",
            github: "https://github.com/Penzero",
            instagram: "https://www.instagram.com/vlaaad_1802/"
        }
    },
    {
        id: 2,
        name: "George Dan Cristian",
        role: "Co-founder and Software Engineer",
        bio: "2+ years of experience in software development and student at UBB Cluj. Passionate about creating innovative solutions for riders.",
        imageUrl: "/team/cristian-george.jpeg",
        social: {
            linkedin: "https://linkedin.com/in/dan-cristian-george-2a000620a",
            // github: "https://github.com/CristiG21"
        }
    },
];

const advisors: Advisor[] = [
    {
        id: 1,
        name: "Calin Sipos",
        title: "Business Advisor",
        bio: "Software Project Manager with international experience and a Java development background. President of Cluj Startups.",
        imageUrl: "/team/calin-sipos.jpeg",
        social: {
            linkedin: "https://www.linkedin.com/in/calin-sipos/"
        }
    },
    {
        id: 2,
        name: "Mihai Ionut Suciu",
        title: "Hardware Advisor",
        bio: "Senior Hardware Engineer for 9+ years. Specialist in embedded systems and IoT.",
        imageUrl: "/team/mihai-suciu.jpg",
        social: {
            linkedin: "https://www.linkedin.com/in/mihai-ionut-suciu/",
        }
    },
    {
        id: 3,
        name: "Alexandru Kiraly",
        title: "Hardware Advisor",
        bio: "PhD in Computer Science and expert in embedded systems. Passionate about IoT and smart devices.",
        imageUrl: "/team/alexandru-kiraly.jpg",
        social: {
        }
    },
    {
        id: 4,
        name: "Nicu Bocanet",
        title: "Marketing Advisor",
        bio: "13 years of experience in sales and marketing. Expert in business development and strategic partnerships.",
        imageUrl: "/team/nicu-bocanet.jpeg",
        social: {
            instagram: "https://www.instagram.com/nicubocanet/",
        }
    },
];

const Team: React.FC = () => {
    const teamRef = useRef(null);
    const advisorRef = useRef(null);
    const isTeamInView = useInView(teamRef, { once: true, amount: 0.1 });
    const isAdvisorInView = useInView(advisorRef, { once: true, amount: 0.1 });

    // Force scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Function to render member/advisor cards
    const renderPersonCard = (
        person: TeamMember | Advisor,
        index: number,
        isInView: boolean
    ) => (
        <motion.div
            key={person.id}
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-gray-900 rounded-lg overflow-hidden hover:shadow-[0_0_15px_rgba(0,157,255,0.3)] transition-shadow flex flex-col items-center max-w-[300px] w-full mx-auto"
        >
            {/* Image: always 200px wide, card is 250px wide */}
            <div className="relative max-w-[250px] w-[250px] aspect-[3/4] mx-auto mt-4 bg-gray-800 overflow-hidden rounded">
                <Image
                    src={person.imageUrl}
                    alt={person.name}
                    fill
                    sizes="200px"
                    className="object-cover object-center"
                    style={{ minWidth: 0, minHeight: 0 }}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/400x500/171717/009dff?text=Horizon+Team";
                    }}
                />
            </div>
            <div className="p-6 flex flex-col flex-grow w-full">
                <div>
                    <h3 className="text-xl font-bold text-horizonBlue">{person.name}</h3>
                    <p className="text-gray-400 mb-4">{person.role || person.title}</p>
                    <p className="text-gray-300 mb-5">{person.bio}</p>
                </div>
                {/* Social links */}
                <div className="mt-auto">
                    {person.social && Object.keys(person.social).length > 0 && (
                        <div className="flex space-x-4">
                            {person.social.linkedin && (
                                <a
                                    href={person.social.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-horizonBlue transition-colors"
                                >
                                    {/* LinkedIn SVG */}
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                                    </svg>
                                </a>
                            )}
                            {person.social.twitter && (
                                <a
                                    href={person.social.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-horizonBlue transition-colors"
                                >
                                    {/* Twitter SVG */}
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.16a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                                    </svg>
                                </a>
                            )}
                            {person.social.github && (
                                <a
                                    href={person.social.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-horizonBlue transition-colors"
                                >
                                    {/* GitHub SVG */}
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            )}
                            {person.social.instagram && (
                                <a
                                    href={person.social.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-horizonBlue transition-colors"
                                >
                                    {/* Instagram SVG */}
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M12 2.163c3.203 0 3.584.012 4.85.07 1.267.058 2.15.27 2.65.57a4.92 4.92 0 011.77 1.77c.3.5.512 1.383.57 2.65.058 1.266.07 1.647.07 4.85s-.012 3.584-.07 4.85c-.058 1.267-.27 2.15-.57 2.65a4.92 4.92 0 01-1.77 1.77c-.5.3-1.383.512-2.65.57-1.266.058-1.647.07-4.85.07s-3.584-.012-4.85-.07c-1.267-.058-2.15-.27-2.65-.57a4.92 4.92 0 01-1.77-1.77c-.3-.5-.512-1.383-.57-2.65C2.175 15.584 2.163 15.203 2.163 12s.012-3.584.07-4.85c.058-1.267.27-2.15.57-2.65a4.92 4.92 0 011.77-1.77c.5-.3 1.383-.512 2.65-.57C8.417 2.175 8.798 2.163 12 2.163zM12 0C8.74 0 8.333.014 7.053.072 5.775.131 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.059 1.278.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.74 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.635.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.014 15.26 0 12 0z" />
                                        <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z" />
                                        <circle cx="18.406" cy="5.594" r="1.44" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );

    return (
        <section className="py-20 bg-black text-white">
            <div className="container mx-auto px-4">
                {/* Team section */}
                <div className="mb-20">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-center mb-16 text-horizonBlue"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Our Team
                    </motion.h2>
                    <div
                        ref={teamRef}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-40 max-w-4xl mx-auto justify-items-center"
                    >
                        {teamMembers.map((member, index) =>
                            renderPersonCard(member, index, isTeamInView)
                        )}
                    </div>
                </div>
                {/* Advisors section */}
                <div>
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-center mb-16 text-horizonBlue"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        Our Advisors
                    </motion.h2>
                    <div
                        ref={advisorRef}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto justify-items-center"
                    >
                        {advisors.map((advisor, index) =>
                            renderPersonCard(advisor, index, isAdvisorInView)
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Team;