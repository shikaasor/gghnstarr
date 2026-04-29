'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionSectionProps {
  items: AccordionItem[];
}

export default function AccordionSection({ items }: AccordionSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.title} className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-teal-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            aria-expanded={openIndex === i}
          >
            <span className="font-serif text-navy-950 font-semibold text-base">{item.title}</span>
            <ChevronDown
              size={20}
              className={`text-teal-600 transition-transform duration-300 flex-shrink-0 ml-4 ${openIndex === i ? 'rotate-180' : ''}`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-[2000px]' : 'max-h-0'}`}
          >
            <div className="px-6 py-5 bg-white border-t border-slate-100 text-slate-700 text-sm leading-relaxed space-y-3">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}