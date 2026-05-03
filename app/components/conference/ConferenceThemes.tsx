import { ClipboardList, Pill, DollarSign, Globe, Calendar } from 'lucide-react';

const themes = [
  { icon: ClipboardList, text: 'Tracking implementation of AMR National Action Plans (NAPs)' },
  { icon: Pill,          text: 'Addressing antimicrobial and diagnostic availability gaps' },
  { icon: DollarSign,    text: 'Sustainable financing for AMR response in LMICs' },
  { icon: Globe,         text: 'African leadership in global health security frameworks' },
  { icon: Calendar,      text: "Side events: Non-State Actor's Day (Jun 28) · Ministerial session (Jun 29) · Declaration and closing (Jun 30)" },
];

export function ConferenceThemes() {
  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-navy-950 mb-8 text-center">
          Key Themes &amp; Agenda
        </h2>
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
