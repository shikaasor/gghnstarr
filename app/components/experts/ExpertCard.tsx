import type { Expert } from '@/lib/types';

interface ExpertCardProps {
  expert: Expert;
}

export function ExpertCard({ expert }: ExpertCardProps) {
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-sm border border-slate-100">
      <div className="aspect-square bg-slate-100 overflow-hidden">
        <img
          src={expert.photoUrl}
          alt={expert.name}
          className="w-full h-full object-cover"
          style={{ objectPosition: expert.photoPosition ?? 'top' }}
        />
      </div>
      <div className="p-5 flex flex-col gap-2">
        <h2 className="font-serif text-lg font-semibold text-navy-950">{expert.name}</h2>
        <p className="text-sm font-medium text-teal-600">{expert.title}</p>
        <p className="text-sm text-slate-500">{expert.organization}</p>
        <ul className="flex flex-wrap gap-1 mt-1">
          {expert.specialties.map((specialty) => (
            <li
              key={specialty}
              className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
            >
              {specialty}
            </li>
          ))}
        </ul>
        <hr className="border-slate-100 my-1" />
        <p className="text-sm text-slate-600 leading-relaxed">{expert.bio}</p>
      </div>
    </article>
  );
}
