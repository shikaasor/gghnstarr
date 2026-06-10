import { ClipboardList, Pill, DollarSign, Globe, Calendar, Leaf } from 'lucide-react';

const themes = [
  { icon: ClipboardList, text: 'Reviewing progress on the 2024 UNGA Political Declaration on AMR' },
  { icon: Pill,          text: 'Addressing access gaps in antimicrobials, diagnostics, and preventive measures' },
  { icon: ClipboardList, text: 'National Action Plan (NAP) implementation — from documents to lived realities' },
  { icon: Leaf,          text: 'One Health sector collaboration: human, animal, plant, and environmental health' },
  { icon: Globe,         text: 'Action, equity, innovation, and sustainability in Africa\'s AMR response' },
  { icon: Calendar,      text: "Side events: Non-State Actor's Day (Jun 28) · Ministerial session (Jun 29) · Declaration and closing (Jun 30)" },
];

export function ConferenceThemes() {
  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-navy-950 mb-2 text-center">
          Key Themes &amp; Agenda
        </h2>
        <p className="text-slate-500 text-sm text-center mb-8">
          Overarching theme: &ldquo;One Health: Advancing Global AMR Commitments through Local Action&rdquo;
        </p>
        <ul className="space-y-4">
          {themes.map(({ icon: Icon, text }, i) => (
            <li key={i} className="flex items-start gap-4 bg-white rounded-lg px-5 py-4 shadow-sm">
              <Icon className="text-teal-600 mt-0.5 shrink-0" size={22} />
              <span className="text-slate-700">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
