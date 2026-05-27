import { readFileSync } from 'fs';
import { join } from 'path';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import ToolsGrid from '@/components/tools/ToolsGrid';
import type { ToolItem } from '@/lib/types';

export const metadata: Metadata = {
  title: 'One Health Tools Directory | GGHN STARR',
  description:
    'A searchable catalog of 50 One Health tools spanning assessment, prioritisation, implementation, and monitoring — from the Quadripartite, national governments, and leading institutions.',
};

export default function ToolsDirectoryPage() {
  let tools: ToolItem[] = [];
  try {
    tools = JSON.parse(
      readFileSync(join(process.cwd(), 'content/oh-tools.json'), 'utf-8')
    ) as ToolItem[];
  } catch (err) {
    // Log for server-side observability; render gracefully degraded UI
    console.error('[ToolsDirectoryPage] Failed to load oh-tools.json:', err);
    // tools stays [] — ToolsGrid will render "0 tools" rather than crashing
  }

  return (
    <main>
      {/* Hero */}
      <section className="bg-teal-600 text-white py-14">
        <Container>
          <div className="max-w-2xl">
            <span className="inline-block bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              Tools Directory
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              One Health Tools
            </h1>
            <p className="text-teal-100 text-lg leading-relaxed">
              A searchable catalog of 50 One Health tools for assessment, prioritisation,
              implementation, and monitoring — curated for policymakers, public health,
              animal health, environment, and laboratory professionals.
            </p>
          </div>
        </Container>
      </section>

      {/* Search + filters + cards */}
      <section className="py-14 bg-slate-50">
        <Container>
          <ToolsGrid tools={tools} />
        </Container>
      </section>
    </main>
  );
}
