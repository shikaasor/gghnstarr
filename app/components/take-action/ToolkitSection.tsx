import { DownloadCard } from '@/components/take-action/DownloadCard';

const toolkitAssets = [
  {
    title: 'AMR Fact Sheet',
    description:
      'A one-page overview of antimicrobial resistance in Africa — key statistics, causes, and consequences. Share with your network.',
    format: 'PDF',
    href: '/toolkit/amr-fact-sheet.pdf',
    filename: 'amr-fact-sheet.pdf',
  },
  {
    title: 'Advocacy Letter Template',
    description:
      'A customizable letter template for healthcare workers and advocates to request action from local health authorities on AMR.',
    format: 'DOCX',
    href: '/toolkit/amr-letter-template.docx',
    filename: 'amr-letter-template.docx',
  },
  {
    title: 'Social Media Card',
    description:
      'A shareable graphic for social media platforms promoting AMR awareness. Optimized for WhatsApp, Twitter/X, and LinkedIn.',
    format: 'PNG',
    href: '/toolkit/amr-social-card.png',
    filename: 'amr-social-card.png',
  },
];

export default function ToolkitSection() {
  return (
    <div>
      <h2 className="font-serif text-2xl md:text-3xl text-navy-950 font-bold mb-3">
        Advocacy Toolkit
      </h2>
      <p className="text-slate-600 max-w-2xl mb-10">
        Equip yourself and your community with materials to communicate the urgency of AMR in
        Africa. Download, share, and adapt these resources freely.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {toolkitAssets.map((asset) => (
          <DownloadCard key={asset.filename} {...asset} />
        ))}
      </div>
    </div>
  );
}
