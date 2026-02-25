import React from 'react';
import { motion } from 'framer-motion';
import {
    CpuChipIcon,
    ShieldCheckIcon,
    GlobeAltIcon,
    PaperAirplaneIcon,
    ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const sections = [
        {
            title: "Ecosystem",
            links: ["Directives", "Neural Analytics", "Asset Tracking", "Compliance Hub"]
        },
        {
            title: "Governance",
            links: ["Privacy Protocol", "Service Matrix", "Cyber Security", "Data Sovereignty"]
        },
        {
            title: "Support",
            links: ["Knowledge Base", "System Status", "Developer API", "Executive Desk"]
        }
    ];

    const socials = [
        { icon: GlobeAltIcon, label: "Network", color: "hover:text-blue-400" },
        { icon: PaperAirplaneIcon, label: "Transmission", color: "hover:text-emerald-400" },
        { icon: ChatBubbleBottomCenterTextIcon, label: "Comms", color: "hover:text-indigo-400" },
    ];

    return (
        <footer className="relative mt-20 pb-12 pt-16 px-6 overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-indigo-500/5 blur-[80px] -z-10" />
            <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-emerald-500/5 blur-[100px] -z-10" />

            <div className="max-w-[1500px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

                    {/* Brand Meta Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3 group">
                            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                                <CpuChipIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                                Expense<span className="text-indigo-600 dark:text-indigo-400">Sphere</span>
                            </span>
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                            The definitive protocol for enterprise-grade asset management.
                            Automating financial logic with high-fidelity analytics and neural integration.
                        </p>
                        <div className="flex gap-4">
                            {socials.map((s, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ y: -4, scale: 1.1 }}
                                    className={`p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-400 ${s.color} transition-colors shadow-sm`}
                                >
                                    <s.icon className="w-5 h-5" />
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Nav Link Matrix */}
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 dark:text-indigo-400">
                                {section.title}
                            </h4>
                            <ul className="space-y-4">
                                {section.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <a href="#" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors flex items-center group/link">
                                            <span className="w-0 group-hover/link:w-2 h-[2px] bg-indigo-500 mr-0 group-hover/link:mr-2 transition-all duration-300" />
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Legal Band */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-100 dark:border-white/5 gap-6">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
                        End-to-End Encryption Mode Active
                    </div>

                    <div className="flex flex-col md:items-end gap-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            © {currentYear} ExpenseSphere Operations. All Assets Reserved.
                        </p>
                        <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest text-center md:text-right">
                            v4.2.0-Prime // Neural Core Enabled
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
