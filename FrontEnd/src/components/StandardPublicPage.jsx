import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useLocation } from 'react-router-dom';
import PageTransition from './layout/PageTransition';
import PublicNavbar from '../pages/Public/PublicNavbar';
import Footer from './layout/Footer';
import { Shield, Cpu, Zap, Globe, Lock, Activity, Terminal, LayoutGrid, Database } from 'lucide-react';

const StandardPublicPage = ({ title: propTitle, description, icon: propIcon }) => {
    const { id } = useParams();
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id, pathname]);

    const icons = {
        'directives': Terminal,
        'neural-analytics': Activity,
        'asset-tracking': Database,
        'compliance-hub': LayoutGrid,
        'privacy-protocol': Shield,
        'service-matrix': Cpu,
        'cyber-security': Lock,
        'data-sovereignty': Globe,
        'knowledge-base': Zap,
        'system-status': Activity,
        'developer-api': Terminal,
        'executive-desk': Shield
    };

    const pageContent = {
        'directives': {
            title: 'Directives',
            description: 'Core operational mandates for the Antigravity ecosystem, defining the structural logic of financial execution.',
            details: [
                { id: 'PRIO', label: 'Priority Level', value: 'ALPHA_01' },
                { id: 'TYPE', label: 'Mandate Type', value: 'CORE_EXECUTION' },
                { id: 'VER', label: 'Policy Version', value: 'v9.4.2' },
                { id: 'STAT', label: 'Compliance Status', value: 'ACTIVE' }
            ]
        },
        'neural-analytics': {
            title: 'Neural Analytics',
            description: 'Advanced predictive modeling and pattern recognition for enterprise-wide fiscal trajectory analysis.',
            details: [
                { id: 'SYNC', label: 'Neural Sync', value: 'OPTIMAL' },
                { id: 'DATA', label: 'Data Points', value: '8.4B / SEC' },
                { id: 'ACC', label: 'Model Accuracy', value: '99.98%' },
                { id: 'LAT', label: 'Inference Latency', value: '< 1MS' }
            ]
        },
        'asset-tracking': {
            title: 'Asset Tracking',
            description: 'Real-time telemetry for every financial asset within the operational grid, ensuring total visibility.',
            details: [
                { id: 'MODE', label: 'Tracking Mode', value: 'REAL_TIME' },
                { id: 'COUNT', label: 'Asset Count', value: 'UNLIMITED' },
                { id: 'FID', label: 'Sync Fidelity', value: 'HIGH' },
                { id: 'GHOST', label: 'Ghost Detection', value: 'ENABLED' }
            ]
        },
        'compliance-hub': {
            title: 'Compliance Hub',
            description: 'Centralized governance for multi-jurisdictional financial regulations and autonomous audit trails.',
            details: [
                { id: 'AUDIT', label: 'Audit Status', value: 'VERIFIED' },
                { id: 'RISK', label: 'Risk Vector', value: 'MINIMAL' },
                { id: 'ENG', label: 'Policy Engine', value: 'AUTO_SYNC' },
                { id: 'LOCK', label: 'Regulatory Lock', value: 'ACTIVE' }
            ]
        },
        'privacy-protocol': {
            title: 'Privacy Protocol',
            description: 'Lattice-based encryption and zero-knowledge proof systems for total identity sovereignty.',
            details: [
                { id: 'ENCR', label: 'Encryption', value: 'LATTICE_512' },
                { id: 'ZKP', label: 'Anonymization', value: 'ZERO_KNOWLEDGE' },
                { id: 'SHIELD', label: 'Breach Shield', value: 'ACTIVE' },
                { id: 'TIER', label: 'Privacy Tier', value: 'MAXIMUM' }
            ]
        },
        'service-matrix': {
            title: 'Service Matrix',
            description: 'The interconnected grid of microservices and automated workflows powering the platform.',
            details: [
                { id: 'UP', label: 'Uptime', value: '99.999%' },
                { id: 'MESH', label: 'Mesh Status', value: 'STABLE' },
                { id: 'NODE', label: 'Nodes Active', value: '4,096' },
                { id: 'FLOW', label: 'Traffic Flow', value: 'BALANCED' }
            ]
        },
        'cyber-security': {
            title: 'Cyber Security',
            description: 'Defensive infrastructure designed to neutralize sophisticated threats through autonomous countermeasures.',
            details: [
                { id: 'THR', label: 'Threat Level', value: 'STABLE' },
                { id: 'FIRE', label: 'Firewall', value: 'QUANTUM_RESISTANT' },
                { id: 'IPS', label: 'IPS Status', value: 'MAX_ALERT' },
                { id: 'BUNK', label: 'Bunker Mode', value: 'READY' }
            ]
        },
        'data-sovereignty': {
            title: 'Data Sovereignty',
            description: 'Ensuring absolute ownership and jurisdictional control over enterprise data repositories.',
            details: [
                { id: 'OWN', label: 'Ownership Type', value: 'ABSOLUTE' },
                { id: 'SEC', label: 'Storage Sector', value: 'PRIMARY_RESERVE' },
                { id: 'LOC', label: 'Data Locality', value: 'ENFORCED' },
                { id: 'MIG', label: 'Migration Lock', value: 'SECURE' }
            ]
        },
        'knowledge-base': {
            title: 'Knowledge Base',
            description: 'The collective intelligence repository for system documentation, best practices, and technical guides.',
            details: [
                { id: 'ART', label: 'Articles', value: '1,250+' },
                { id: 'IDX', label: 'Indexing', value: 'NEURAL' },
                { id: 'SPD', label: 'Search Speed', value: 'INSTANT' },
                { id: 'ACC', label: 'Contributor Access', value: 'LEVEL_03' }
            ]
        },
        'system-status': {
            title: 'System Status',
            description: 'Real-time heartbeat monitoring of the entire Antigravity technical infrastructure.',
            details: [
                { id: 'HLTH', label: 'Health Score', value: '98/100' },
                { id: 'BEAT', label: 'Service Heartbeat', value: 'NORMAL' },
                { id: 'WIN', label: 'Maintenance Window', value: 'NONE' },
                { id: 'LOAD', label: 'Load Balancer', value: 'NOMINAL' }
            ]
        },
        'developer-api': {
            title: 'Developer API',
            description: 'Exposing high-fidelity REST endpoints and streaming hooks for seamless ecosystem integration.',
            details: [
                { id: 'VER', label: 'API Version', value: 'v6.2.0' },
                { id: 'METH', label: 'Auth Method', value: 'JWT_BEARER' },
                { id: 'RATE', label: 'Rate Limit', value: '10,000 / MIN' },
                { id: 'LAG', label: 'Webhook Lag', value: '< 5MS' }
            ]
        },
        'executive-desk': {
            title: 'Executive Desk',
            description: 'The mission control interface for high-level fiscal governance and executive decision support.',
            details: [
                { id: 'SEAT', label: 'Seat Status', value: 'OCCUPIED' },
                { id: 'GOV', label: 'Gov Power', value: 'EXECUTIVE' },
                { id: 'REP', label: 'Report Status', value: 'READY' },
                { id: 'TIER', label: 'Access Tier', value: 'PRIME' }
            ]
        }
    };

    const currentContent = pageContent[id] || {};
    const displayTitle = propTitle || currentContent.title || id?.split('-').map(word => word.toUpperCase()).join(' ') || 'PROTOCOL_NULL';
    const Icon = propIcon || icons[id] || Shield;
    const displayDescription = description || currentContent.description || 'Establishing secure connection to encrypted asset classification... Execution of high-fidelity financial logic in progress.';
    const hudDetails = currentContent.details || [
        { id: 'SYNC', label: 'Operational Sync Status', value: 'OPTIMAL' },
        { id: 'LOAD', label: 'Processing Throughput', value: '4.2 TB/s' },
        { id: 'AUTH', label: 'Authorization Layer', value: 'LEVEL_07' },
        { id: 'KERN', label: 'Core Version', value: 'v6.0.4-Prime' }
    ];

    return (
        <PageTransition className="bg-[#05070a] min-h-screen text-white font-sans overflow-x-hidden selection:bg-indigo-500/30">
            <PublicNavbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-600/5 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-20 h-20 bg-indigo-600/10 border border-indigo-500/10 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/10">
                            <Icon className="w-10 h-10 text-indigo-400" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 italic uppercase">
                            {displayTitle}
                        </h1>
                        <p className="text-white/40 max-w-2xl font-semibold leading-relaxed text-lg italic">
                            {displayDescription}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Tactical Content Area */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto group">
                    <div className="relative p-12 bg-white/[0.01] border border-white/5 rounded-[48px] overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] -z-10" />

                        <div className="space-y-12">
                            <div className="flex items-start gap-8">
                                <div className="text-[10px] font-black text-indigo-500 tracking-[5px] mt-1.5 uppercase">DECRYPTED_INTEL</div>
                                <div className="space-y-6 flex-1">
                                    <h2 className="text-2xl font-black italic tracking-tight uppercase">Strategic Overview</h2>
                                    <p className="text-white/50 leading-loose font-medium">
                                        This protocol orchestrates the high-fidelity synchronization of enterprise assets within the Antigravity ecosystem.
                                        By leveraging lattice-based cryptographic structures and neural-network forensics, we ensure
                                        total sovereignty over every financial vector.
                                        Our systems are designed to operate at the edge of possibility, neutralizing risks before they materialize.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {hudDetails.map((stat) => (
                                    <div key={stat.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                                        <div className="text-[9px] font-black text-white/20 tracking-[4px] mb-2 uppercase">{stat.label}</div>
                                        <div className="text-lg font-black text-indigo-400 italic uppercase tracking-tighter">{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                    </div>
                </div>
            </section>

            <Footer />
        </PageTransition>
    );
};

export default StandardPublicPage;
