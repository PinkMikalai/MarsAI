// CountdownClock — affiche un compte à rebours style flip-clock
// Chaque chiffre est une carte individuelle sur fond dégradé

import React, { useEffect, useState } from 'react';

const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

const computeTimeLeft = (targetDate) => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return null;
    const totalSec = Math.floor(diff / 1000);
    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return { d, h, m, s };
};

// Une carte chiffre unique
const DigitCard = ({ digit }) => (
    <span className="cdclock-digit">{digit}</span>
);

// Groupe de deux chiffres (ex: "01") avec label optionnel
const DigitGroup = ({ value, label }) => {
    const digits = pad(value).split('');
    return (
        <div className="cdclock-group">
            <div className="cdclock-digits">
                {digits.map((d, i) => <DigitCard key={i} digit={d} />)}
            </div>
            {label && <span className="cdclock-label">{label}</span>}
        </div>
    );
};

const Colon = () => <span className="cdclock-colon">:</span>;

const CountdownClock = ({ targetDate, showDays = true }) => {
    const [time, setTime] = useState(() => computeTimeLeft(targetDate));

    useEffect(() => {
        setTime(computeTimeLeft(targetDate));
        const timer = setInterval(() => {
            const t = computeTimeLeft(targetDate);
            setTime(t);
            if (!t) clearInterval(timer);
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    if (!time) return null;

    return (
        <div className="cdclock">
            {showDays && time.d > 0 && (
                <>
                    <DigitGroup value={time.d} label="j" />
                    <Colon />
                </>
            )}
            <DigitGroup value={time.h} label="h" />
            <Colon />
            <DigitGroup value={time.m} label="m" />
            <Colon />
            <DigitGroup value={time.s} label="s" />
        </div>
    );
};

export default CountdownClock;
