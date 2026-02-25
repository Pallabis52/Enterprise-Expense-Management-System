import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Toggle = ({ checked, onChange, label, disabled = false, className }) => {
    const [hovered, setHovered] = useState(false);

    const trackOn = {
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
        boxShadow: hovered
            ? '0 0 20px rgba(139,92,246,0.7), 0 0 40px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)'
            : '0 0 12px rgba(139,92,246,0.5), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.2)',
    };

    const trackOff = {
        background: 'linear-gradient(135deg, #1e1f2e 0%, #2a2b3d 100%)',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
    };

    return (
        <div
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            className={className}
        >
            {/* Track */}
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => !disabled && onChange(!checked)}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    width: 52,
                    height: 28,
                    borderRadius: 999,
                    border: 'none',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    outline: 'none',
                    flexShrink: 0,
                    opacity: disabled ? 0.45 : 1,
                    transition: 'all 0.3s ease',
                    ...(checked ? trackOn : trackOff),
                }}
            >
                {/* Outer ring glow when ON */}
                {checked && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            position: 'absolute',
                            inset: -3,
                            borderRadius: 999,
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            opacity: hovered ? 0.35 : 0.18,
                            filter: 'blur(6px)',
                            zIndex: 0,
                            pointerEvents: 'none',
                        }}
                    />
                )}

                {/* Thumb */}
                <motion.div
                    layout
                    animate={{ x: checked ? 26 : 2 }}
                    transition={{ type: 'spring', stiffness: 600, damping: 32 }}
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: checked
                            ? 'linear-gradient(145deg, #ffffff, #e0e7ff)'
                            : 'linear-gradient(145deg, #6b7280, #4b5563)',
                        boxShadow: checked
                            ? '0 2px 8px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.9)'
                            : '0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
                        flexShrink: 0,
                    }}
                >
                    {/* Inner shine dot */}
                    <div style={{
                        position: 'absolute',
                        top: 4,
                        left: 4,
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: checked
                            ? 'rgba(99,102,241,0.5)'
                            : 'rgba(255,255,255,0.12)',
                    }} />
                </motion.div>
            </button>

            {/* Label */}
            {label && (
                <span
                    onClick={() => !disabled && onChange(!checked)}
                    style={{
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        color: checked ? '#a5b4fc' : '#6b7280',
                        transition: 'color 0.3s',
                        userSelect: 'none',
                    }}
                >
                    {label}
                </span>
            )}
        </div>
    );
};

export default Toggle;
