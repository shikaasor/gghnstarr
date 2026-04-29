'use client';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface Infographic {
  src: string;
  title: string;
  description: string;
}

interface InfographicGridProps {
  infographics: Infographic[];
}

export default function InfographicGrid({ infographics }: InfographicGridProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const slides = infographics.map(i => ({ src: i.src, alt: i.title }));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {infographics.map((item, i) => (
          <button
            key={item.src}
            onClick={() => { setIndex(i); setOpen(true); }}
            className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-lg"
            aria-label={`View enlarged: ${item.title}`}
          >
            <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm group-hover:shadow-md transition-shadow">
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-3 px-1">
              <h3 className="font-serif text-navy-950 font-semibold text-sm leading-snug mb-1">
                {item.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">{item.description}</p>
            </div>
          </button>
        ))}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
      />
    </>
  );
}