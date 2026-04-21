'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { Container } from '@/components/layout/Container';

const TABS = [
  { id: 'models', label: 'SEIR / ML / Bayesian Models' },
  { id: 'nipad', label: 'NIPAD Platform' },
  { id: 'globalpps', label: 'GlobalPPS & WHONET' },
] as const;

type TabId = (typeof TABS)[number]['id'];

function BulletList({
  heading,
  items,
}: {
  heading: string;
  items: string[];
}) {
  return (
    <div className="mt-4">
      <p className="font-semibold text-navy-950 text-sm uppercase tracking-wide mb-2">
        {heading}
      </p>
      <ul className="list-disc list-inside space-y-1 text-slate-700">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ModelsPanel() {
  return (
    <div className="space-y-10">
      <p className="text-slate-700 leading-relaxed">
        The GGHN STARR initiative uses a layered modeling approach to project how
        antimicrobial resistance spreads, and to forecast the impact of policy
        choices before they are implemented. Rather than relying on a single
        method, STARR combines four complementary techniques so that findings are
        robust and uncertainties are clearly communicated to decision-makers.
      </p>

      {/* SEIR */}
      <div>
        <h3 className="font-bold text-navy-950 text-lg mb-3">
          Compartmental SEIR Models
        </h3>
        <p className="text-slate-700 leading-relaxed mb-3">
          SEIR models divide a population into four groups: Susceptible, Exposed,
          Infected, and Recovered. In the context of AMR, this framework tracks
          how resistant pathogens move through human, animal, and environmental
          reservoirs. By calibrating transmission rates against country-specific
          surveillance data, STARR&apos;s SEIR models reveal which settings and
          behaviors drive resistance most rapidly, and which targeted
          interventions could slow that trajectory.
        </p>
        <p className="text-slate-700 leading-relaxed">
          For policymakers, this means the model can answer: &lsquo;If our
          hospitals implement antibiotic stewardship protocols this year, what is
          the projected AMR mortality reduction by 2030?&rsquo; The answer is
          grounded in real surveillance patterns, not assumptions.
        </p>
        <BulletList
          heading="Policy outputs from SEIR modeling:"
          items={[
            'Projected AMR mortality trajectories under current vs. intervention scenarios',
            'Transmission hotspot identification by setting (hospital, community, livestock)',
            'Estimated impact of stewardship programs and IPC measures over 5–10 year horizons',
          ]}
        />
      </div>

      {/* ML */}
      <div>
        <h3 className="font-bold text-navy-950 text-lg mb-3">
          Machine Learning Risk Prediction
        </h3>
        <p className="text-slate-700 leading-relaxed mb-3">
          STARR applies Random Forest and CART decision-tree algorithms to
          identify high-risk geographies and population groups before resistance
          emerges at crisis levels. These models learn patterns from historical
          surveillance data (antibiotic prescription rates, hospital-acquired
          infection records, community health indicators) to flag where resistant
          strains are most likely to emerge next.
        </p>
        <p className="text-slate-700 leading-relaxed">
          The practical output for ministries is a prioritization map: which
          districts or facilities warrant immediate stewardship investment versus
          which regions can be monitored with standard protocols. This allows
          finite public health resources to be targeted where they will have the
          greatest preventive impact.
        </p>
        <BulletList
          heading="Ministry-level outputs:"
          items={[
            'District-level risk ranking updated with new surveillance data',
            'Facility-specific stewardship investment prioritization',
            'Early warning flags for emerging resistance patterns before clinical confirmation',
          ]}
        />
      </div>

      {/* Bayesian */}
      <div>
        <h3 className="font-bold text-navy-950 text-lg mb-3">
          Bayesian Hierarchical Forecasting
        </h3>
        <p className="text-slate-700 leading-relaxed mb-3">
          Bayesian methods are central to STARR&apos;s approach because they
          explicitly quantify uncertainty, a critical requirement when advising
          policy under incomplete data conditions common across African health
          systems. Bayesian hierarchical models combine evidence from multiple
          countries and surveillance sources, producing probabilistic forecasts
          rather than false-precision point estimates.
        </p>
        <p className="text-slate-700 leading-relaxed">
          This transparency is intentional. Health ministers making multi-year
          investment decisions deserve to know not just the modeled outcome, but
          the confidence range behind it. Bayesian approaches provide that honest
          accounting. For example: &lsquo;70% probability that AMR-attributable
          mortality rises by 15–25% by 2032 under current prescribing
          patterns.&rsquo;
        </p>
        <BulletList
          heading="What Bayesian outputs communicate to decision-makers:"
          items={[
            'Probability distributions over AMR burden projections (not single-point estimates)',
            'Confidence intervals that widen where data are sparse, signalling where surveillance investment is needed',
            'Cross-country pooled estimates that improve projections for countries with limited local data',
          ]}
        />
      </div>

      {/* Agent-Based */}
      <div>
        <h3 className="font-bold text-navy-950 text-lg mb-3">
          Agent-Based Simulations
        </h3>
        <p className="text-slate-700 leading-relaxed mb-3">
          Agent-based models (ABMs) simulate individual actors (patients,
          healthcare workers, prescribers, livestock handlers) and the rules
          governing their interactions. Unlike compartmental models that treat
          populations as homogeneous groups, ABMs capture heterogeneity: the fact
          that a single overprescribing clinician or an under-resourced ward can
          drive resistance dynamics that aggregate models miss.
        </p>
        <p className="text-slate-700 leading-relaxed">
          STARR uses ABMs to stress-test policy interventions at a granular
          level, simulating how a stewardship programme would propagate through a
          network of interconnected facilities and communities under different
          compliance assumptions. This makes ABMs especially valuable for
          modelling real-world implementation gaps between policy intent and
          practice.
        </p>
        <BulletList
          heading="Agent-based simulation applications:"
          items={[
            'Modelling facility-level transmission networks under varied IPC compliance scenarios',
            'Simulating prescriber behaviour change in response to stewardship feedback interventions',
            'Stress-testing national action plan targets against heterogeneous health system conditions',
          ]}
        />
      </div>
    </div>
  );
}

function NipadPanel() {
  return (
    <div className="space-y-6">
      <p className="text-slate-700 leading-relaxed">
        The Nigeria Immunization Predictive Analytics Dashboard (NIPAD) is an
        R/Shiny platform developed by the STARR team that integrates the
        initiative&apos;s modeling approaches into a unified operational system.
        Originally built for immunization forecasting, NIPAD demonstrates how
        predictive analytics can be embedded within national public health
        infrastructure, not as a research tool, but as a routine
        decision-support system used by programme managers.
      </p>
      <p className="text-slate-700 leading-relaxed">
        NIPAD ingests surveillance data, applies SEIR and machine learning
        models, and produces forward-looking district-level risk maps and
        scenario projections. Ministries use it to identify underperforming
        areas, plan resource allocation, and evaluate the likely impact of
        programmatic changes before committing budgets.
      </p>

      <BulletList
        heading="Platform capabilities:"
        items={[
          'District-level risk maps updated from surveillance data feeds',
          'Scenario modelling: compare projected outcomes under 2–4 alternative intervention strategies',
          'Downloadable summary reports formatted for ministry and donor audiences',
          'Role-based access for national programme managers, state-level coordinators, and technical reviewers',
        ]}
      />

      {/* Placeholder image block */}
      <div className="my-8 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center h-64">
        <p className="text-slate-400 text-sm font-medium">
          NIPAD Dashboard Screenshot (to be replaced with live image)
        </p>
      </div>

      <p className="text-slate-700 leading-relaxed">
        Access to NIPAD scenario analyses is available to national health
        ministries and authorised partners. Contact the GGHN STARR team via the
        Contact page to request access or a demonstration.
      </p>
    </div>
  );
}

function GlobalPpsPanel() {
  return (
    <div className="space-y-10">
      <p className="text-slate-700 leading-relaxed">
        All STARR models are only as reliable as the underlying surveillance
        data. The initiative draws on two internationally validated platforms,
        GlobalPPS and WHONET, to ensure that projections reflect the actual
        prescribing and resistance patterns across African health systems.
      </p>

      {/* GlobalPPS */}
      <div>
        <h3 className="font-bold text-navy-950 text-lg mb-3">
          GlobalPPS: Antimicrobial Consumption Surveillance
        </h3>
        <p className="text-slate-700 leading-relaxed mb-3">
          The Global Point Prevalence Survey (GlobalPPS) provides standardized
          data on antibiotic prescribing patterns in hospital inpatient and
          outpatient settings. STARR uses GlobalPPS data to calibrate the
          prescribing inputs in SEIR and machine learning models, ensuring that
          &lsquo;current practice&rsquo; baselines are derived from real
          facility-level behavior rather than national estimates.
        </p>
        <p className="text-slate-700 leading-relaxed">
          STARR team members have directly implemented GlobalPPS in Nigerian and
          Rwandan facilities, training clinical, pharmacy, and data staff on data
          collection and quality assurance. This ground-level experience means
          STARR can identify and account for known data quality patterns in
          African LMIC settings, a critical advantage over models calibrated
          solely on global aggregate data.
        </p>
        <BulletList
          heading="GlobalPPS data contributions to STARR models:"
          items={[
            'Facility-level antibiotic consumption baselines (inpatient and outpatient)',
            'Prescribing indication data enabling appropriateness assessment',
            'Longitudinal trend data for calibrating stewardship intervention scenarios',
          ]}
        />
      </div>

      {/* WHONET */}
      <div>
        <h3 className="font-bold text-navy-950 text-lg mb-3">
          WHONET: Resistance Pattern Tracking
        </h3>
        <p className="text-slate-700 leading-relaxed mb-3">
          WHONET is the WHO-endorsed database system for microbiology laboratory
          data. It captures organism-specific resistance profiles, showing which
          pathogens are resistant to which antibiotics, in which facilities and
          countries. STARR integrates WHONET outputs to calibrate the resistance
          transmission parameters in SEIR models, ensuring that modeled
          resistance trajectories align with laboratory-confirmed patterns.
        </p>
        <p className="text-slate-700 leading-relaxed">
          Together, GlobalPPS (what antibiotics are being used) and WHONET
          (which pathogens are resisting them) provide the two inputs that make
          STARR&apos;s AMR burden projections credible and country-specific.
          Without both data streams, models produce generic estimates; with both,
          they produce actionable intelligence.
        </p>
        <BulletList
          heading="WHONET resistance data applied in STARR analysis:"
          items={[
            'Organism-antibiotic susceptibility profiles by facility and country',
            'Temporal resistance trend data for SEIR transmission parameter calibration',
            'Cross-country comparisons enabling GLASS-compatible reporting',
          ]}
        />
      </div>
    </div>
  );
}

export default function MethodologyPage() {
  const [activeTab, setActiveTab] = useState<TabId>('models');

  return (
    <>
      <section className="bg-white pt-16 pb-4">
        <Container>
          <h1 className="font-serif text-3xl font-bold text-navy-950 mb-4">
            Our Modeling Approach
          </h1>
          <p className="text-slate-600 leading-relaxed max-w-3xl mb-8">
            STARR&apos;s policy briefs are grounded in four interlocking analytical
            methods. Together they answer the questions that matter most to health
            ministers: Where is resistance spreading? How fast? And what happens
            if we act, or don&apos;t?
          </p>

          {/* Tab bar — scrollable on mobile */}
          <div className="overflow-x-auto border-b border-slate-200 mb-8">
            <div className="flex min-w-max">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'px-5 py-3 text-sm whitespace-nowrap transition-colors',
                    activeTab === tab.id
                      ? 'border-b-2 border-teal-600 text-teal-600 font-semibold'
                      : 'text-slate-600 hover:text-navy-950'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active panel */}
          <div className="pb-16">
            {activeTab === 'models' && <ModelsPanel />}
            {activeTab === 'nipad' && <NipadPanel />}
            {activeTab === 'globalpps' && <GlobalPpsPanel />}
          </div>
        </Container>
      </section>

      {/* CTA section — full width bg */}
      <section className="bg-slate-50 mt-16 py-12 text-center">
        <Container>
          <h2 className="font-serif text-2xl text-navy-950">Explore Our Work</h2>
          <div className="flex justify-center gap-4 flex-wrap mt-6">
            <a
              href="/briefs"
              className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded font-medium transition-colors"
            >
              Browse Policy Briefs
            </a>
            <a
              href="/contact"
              className="border border-teal-600 text-teal-600 hover:bg-teal-50 px-6 py-3 rounded font-medium transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
