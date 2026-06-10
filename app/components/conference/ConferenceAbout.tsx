export function ConferenceAbout() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-navy-950 mb-6 text-center">
          About the Conference
        </h2>
        <p className="text-slate-700 text-lg leading-relaxed">
          The 5th High-Level Ministerial Conference on Antimicrobial Resistance brings together ministers
          and health leaders to translate global AMR commitments into tangible local implementation —
          marking the first time this flagship ministerial conference is held on the African continent.
          The conference recognises the deep interconnections between human, animal, plant, and
          environmental health sectors under a One Health framework.
        </p>
        <p className="text-slate-700 text-lg leading-relaxed mt-4">
          With microorganisms evolving resistance to life-saving medicines, the &ldquo;silent pandemic&rdquo; of
          AMR demands urgent, coordinated policy response rooted in equity, innovation, and
          sustainability. This meeting, held under the patronage of President Bola Ahmed Tinubu,
          positions Nigeria and Africa at the centre of global health security.
        </p>
        <div className="mt-6 text-center">
          <a
            href="https://www.5thhighlevelministerialng.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-teal-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-teal-500 transition-colors text-sm"
          >
            Official Conference Website
          </a>
        </div>
      </div>
    </section>
  );
}
