'use client';

import Giscus from '@giscus/react';

export function GiscusComments() {
  return (
    <section className="no-print mt-12 pt-8 border-t border-slate-200">
      <h2 className="font-serif text-xl text-navy-950 font-bold mb-6">Discussion</h2>
      <Giscus
        repo="shikaasor/gghnstarr"
        repoId="PLACEHOLDER_REPO_ID"
        category="General"
        categoryId="PLACEHOLDER_CATEGORY_ID"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        lang="en"
        loading="lazy"
      />
    </section>
  );
}
