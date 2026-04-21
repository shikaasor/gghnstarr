'use client';

import { useState, useEffect } from 'react';
import { CalendarDays } from 'lucide-react';

interface ConferenceBadgeProps {
  conferenceDate: string;
}

const TARGET_DATE = new Date('2026-06-28T00:00:00');

export default function ConferenceBadge({ conferenceDate: _conferenceDate }: ConferenceBadgeProps) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    function computeDays() {
      const now = new Date();
      const diff = Math.ceil((TARGET_DATE.getTime() - now.getTime()) / 86400000);
      return Math.max(0, diff);
    }

    setDaysLeft(computeDays());

    const interval = setInterval(() => {
      setDaysLeft(computeDays());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-flex items-center gap-2 bg-white/15 border border-white/40 text-white px-6 py-3 rounded-full text-base font-medium">
      <CalendarDays size={20} />
      {daysLeft === null
        ? 'Road to the 5th Inter-Ministerial Conference \u2022 June 28, 2026'
        : `${daysLeft} days to June 28, 2026 \u2014 5th Inter-Ministerial Conference`}
    </span>
  );
}
