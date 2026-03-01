import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownTrayIcon, CheckIcon, CalendarDaysIcon, ChartPieIcon } from '@heroicons/react/24/outline';
import reportService from '../../../services/reportService';
import { toast } from 'react-hot-toast';

/* ═══════════════════════════ PORTAL DROPDOWN ═══════════════════════════ */
const DropdownPortal = ({ anchorRef, open, options, value, onChange, onClose, colors }) => {
    const [rect, setRect] = useState(null);

    useEffect(() => {
        if (open && anchorRef.current) setRect(anchorRef.current.getBoundingClientRect());
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const handler = (e) => { if (anchorRef.current && !anchorRef.current.contains(e.target)) onClose(); };
        const t = setTimeout(() => document.addEventListener('mousedown', handler), 60);
        return () => { clearTimeout(t); document.removeEventListener('mousedown', handler); };
    }, [open, onClose]);

    if (!open || !rect) return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            <motion.div
                key="dp"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{
                    position: 'fixed',
                    top: rect.bottom + 10,
                    left: rect.left,
                    minWidth: Math.max(rect.width + 16, 190),
                    zIndex: 999999,
                    maxHeight: 272,
                    overflowY: 'auto',
                    borderRadius: 16,
                    background: 'linear-gradient(160deg, #13152e 0%, #0d0f22 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: `0 32px 80px -8px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.07), 0 0 32px -8px ${colors.glow}55`,
                }}
                onMouseDown={e => e.stopPropagation()}
            >
                {/* Top gradient strip */}
                <div style={{
                    height: 2,
                    background: `linear-gradient(90deg, transparent, ${colors.primary}, ${colors.secondary}, transparent)`,
                }} />

                <div style={{ padding: '6px 0 8px' }}>
                    {options.map((opt, i) => {
                        const isActive = String(opt.value) === String(value);
                        return (
                            <motion.button
                                key={opt.value}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.02 }}
                                onMouseDown={e => { e.preventDefault(); onChange(opt.value); onClose(); }}
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center',
                                    justifyContent: 'space-between', padding: '9px 18px',
                                    fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
                                    letterSpacing: '0.15em', cursor: 'pointer', border: 'none',
                                    background: isActive ? `${colors.glow}20` : 'transparent',
                                    color: isActive ? colors.primary : 'rgba(160,165,200,0.9)',
                                    transition: 'all 0.1s',
                                }}
                                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#fff'; } }}
                                onMouseLeave={e => { e.currentTarget.style.background = isActive ? `${colors.glow}20` : 'transparent'; e.currentTarget.style.color = isActive ? colors.primary : 'rgba(160,165,200,0.9)'; }}
                            >
                                <span>{opt.label}</span>
                                {isActive && (
                                    <div style={{
                                        width: 17, height: 17, borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: `0 0 10px ${colors.glow}80`,
                                    }}>
                                        <CheckIcon style={{ width: 9, height: 9, color: '#fff', strokeWidth: 3 }} />
                                    </div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};

/* ═══════════════════════════ FILTER PILL ═══════════════════════════ */
const FilterPill = ({ icon: Icon, colors, options, value, onChange }) => {
    const [open, setOpen] = useState(false);
    const [hov, setHov] = useState(false);
    const btnRef = useRef(null);
    const selected = options.find(o => String(o.value) === String(value)) || options[0];
    const close = useCallback(() => setOpen(false), []);

    const isActive = open || hov;

    return (
        <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
                ref={btnRef}
                onClick={() => setOpen(p => !p)}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 16px',
                    borderRadius: 50,
                    fontSize: 11, fontWeight: 900,
                    textTransform: 'uppercase', letterSpacing: '0.07em',
                    color: '#fff', cursor: 'pointer', border: 'none',
                    transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                    transform: isActive ? 'translateY(-1px) scale(1.03)' : 'scale(1)',
                    background: open
                        ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                        : 'linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.04))',
                    boxShadow: open
                        ? `0 6px 20px -4px ${colors.glow}70, inset 0 1px 0 rgba(255,255,255,0.22)`
                        : `0 2px 12px -4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.25)`,
                    outline: open ? `1px solid ${colors.glow}55` : '1px solid rgba(255,255,255,0.07)',
                }}
            >
                <Icon style={{ width: 13, height: 13, opacity: 0.85 }} />
                <span style={{ whiteSpace: 'nowrap' }}>{selected?.label}</span>
                <motion.svg
                    animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
                    style={{ width: 12, height: 12, opacity: 0.6 }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
            </button>

            {/* Under-glow */}
            {open && (
                <div style={{
                    position: 'absolute', inset: -6, borderRadius: 50,
                    background: `radial-gradient(ellipse, ${colors.glow}35, transparent 70%)`,
                    filter: 'blur(10px)', zIndex: -1, pointerEvents: 'none',
                }} />
            )}

            <DropdownPortal
                anchorRef={btnRef} open={open} options={options}
                value={value} onChange={onChange} onClose={close} colors={colors}
            />
        </div>
    );
};

/* ═══════════════════════════ MAIN ═══════════════════════════ */
const ReportFilters = ({ filters, onChange }) => {
    const currentYear = new Date().getFullYear();

    const yearOptions = useMemo(() =>
        Array.from({ length: 5 }, (_, i) => ({ label: String(currentYear - i), value: currentYear - i })),
        [currentYear]);

    const monthOptions = useMemo(() => [
        { label: 'All Months', value: 'all' },
        ...Array.from({ length: 12 }, (_, i) => ({
            label: new Date(0, i).toLocaleString('default', { month: 'long' }),
            value: i + 1,
        }))
    ], []);

    const categoryOptions = [{ label: 'All Categories', value: 'all' }];

    const sep = (
        <div style={{ width: 1, height: 20, flexShrink: 0, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)' }} />
    );

    return (
        <div style={{ position: 'relative' }}>
            {/* Animated rainbow ring */}
            <div style={{
                position: 'absolute', inset: -1.5, borderRadius: 999,
                background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899, #f59e0b, #10b981, #6366f1)',
                backgroundSize: '300% 100%',
                animation: 'filterShift 4s linear infinite',
                filter: 'blur(3px)', opacity: 0.55, zIndex: 0,
            }} />

            {/* 3D pill body */}
            <div style={{
                position: 'relative', zIndex: 1,
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '8px 16px',
                borderRadius: 999,
                background: 'linear-gradient(160deg, #191c34 0%, #0f1228 60%, #090b1c 100%)',
                boxShadow: `
                    0 16px 48px -8px rgba(0,0,0,0.75),
                    0 6px 16px -4px rgba(0,0,0,0.5),
                    inset 0 1px 0 rgba(255,255,255,0.1),
                    inset 0 -2px 0 rgba(0,0,0,0.35)
                `,
                border: '1px solid rgba(255,255,255,0.06)',
            }}>
                <FilterPill
                    icon={CalendarDaysIcon}
                    colors={{ primary: '#6366f1', secondary: '#8b5cf6', glow: '#6366f1' }}
                    options={yearOptions}
                    value={filters.year}
                    onChange={(val) => onChange({ ...filters, year: Number(val) })}
                />

                {sep}

                <FilterPill
                    icon={CalendarDaysIcon}
                    colors={{ primary: '#f59e0b', secondary: '#f97316', glow: '#f59e0b' }}
                    options={monthOptions}
                    value={filters.month}
                    onChange={(val) => onChange({ ...filters, month: val === 'all' ? 'all' : Number(val) })}
                />

                {sep}

                <FilterPill
                    icon={ChartPieIcon}
                    colors={{ primary: '#10b981', secondary: '#14b8a6', glow: '#10b981' }}
                    options={categoryOptions}
                    value={filters.category ?? 'all'}
                    onChange={(val) => onChange({ ...filters, category: val })}
                />

                {sep}

                {/* Export button */}
                <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={async () => {
                        try {
                            if (filters.month === 'all') {
                                await reportService.exportExpensesToCsv();
                            } else {
                                await reportService.exportMonthlyExpensesToCsv(filters.month, filters.year);
                            }
                            toast.success('Intelligence Exported', {
                                style: { borderRadius: '12px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
                            });
                        } catch (err) {
                            toast.error('Export failed');
                        }
                    }}
                    style={{
                        flexShrink: 0,
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '8px 18px', borderRadius: 999,
                        fontSize: 10, fontWeight: 900,
                        textTransform: 'uppercase', letterSpacing: '0.15em',
                        color: '#fff', border: 'none', cursor: 'pointer',
                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #9333ea)',
                        boxShadow: '0 6px 20px -4px rgba(99,102,241,0.55), inset 0 1px 0 rgba(255,255,255,0.18)',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <ArrowDownTrayIcon style={{ width: 13, height: 13 }} />
                    Export
                </motion.button>
            </div>

            <style>{`
                @keyframes filterShift {
                    0%   { background-position: 0% 50%; }
                    100% { background-position: 300% 50%; }
                }
            `}</style>
        </div>
    );
};

export default ReportFilters;
