'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, CheckCircle, Heart, Stethoscope } from 'lucide-react';
import { PledgeForm } from '@/components/take-action/PledgeForm';
import { CommitmentForm } from '@/components/take-action/CommitmentForm';
import { ActionToast } from '@/components/take-action/ActionToast';

type CardId = 'pledge' | 'commitment';

export default function ActionCardGrid() {
  const [expanded, setExpanded] = useState<CardId | null>('pledge');
  const [locked, setLocked] = useState<Set<CardId>>(new Set());
  const [toast, setToast] = useState<{ message: string } | null>(null);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as CardId;
    if (hash === 'pledge' || hash === 'commitment') {
      setExpanded(hash);
    }
  }, []);

  function handleToggle(id: CardId) {
    if (locked.has(id)) return;
    setExpanded((prev) => (prev === id ? null : id));
  }

  function handleSuccess(id: CardId, toastMsg: string) {
    setExpanded(null);
    setLocked((prev) => new Set(prev).add(id));
    setToast({ message: toastMsg });
  }

  const cards = [
    {
      id: 'pledge' as CardId,
      title: 'Sign the Public Pledge',
      description: 'Add your commitment to the fight against AMR across Africa.',
      icon: Heart,
      form: (
        <PledgeForm
          onSuccess={() =>
            handleSuccess('pledge', 'Your pledge contributes to the fight against AMR in Africa.')
          }
        />
      ),
    },
    {
      id: 'commitment' as CardId,
      title: 'Record Your Prescribing Commitment',
      description:
        'Healthcare workers: document your personal commitment to responsible prescribing.',
      icon: Stethoscope,
      form: (
        <CommitmentForm
          onSuccess={() =>
            handleSuccess(
              'commitment',
              'Your commitment to responsible prescribing strengthens AMR stewardship in Africa.'
            )
          }
        />
      ),
    },
  ];

  return (
    <>
      {toast && (
        <ActionToast message={toast.message} onDismiss={() => setToast(null)} />
      )}

      <div className="text-center mb-10">
        <h2 className="font-serif text-2xl md:text-3xl text-navy-950 font-bold">
          Make Your Commitment
        </h2>
        <p className="text-slate-600 mt-2 max-w-xl mx-auto">
          Every action counts. Choose how you want to contribute to the fight against AMR.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          const isExpanded = expanded === card.id;
          const isLocked = locked.has(card.id);

          return (
            <div
              key={card.id}
              id={card.id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm p-6"
            >
              {/* Card header */}
              <button
                type="button"
                onClick={() => handleToggle(card.id)}
                disabled={isLocked}
                className="w-full flex items-start justify-between gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded"
                aria-expanded={isExpanded}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={20} className="text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-serif text-navy-950 font-bold text-lg leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-slate-600 text-sm mt-1">{card.description}</p>
                  </div>
                </div>

                {isLocked ? (
                  <div className="flex items-center gap-1.5 text-teal-600 flex-shrink-0 mt-1">
                    <CheckCircle size={18} />
                    <span className="text-xs font-medium">Submitted</span>
                  </div>
                ) : (
                  <ChevronDown
                    size={20}
                    className={`text-teal-600 flex-shrink-0 transition-transform duration-300 mt-1 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>

              {/* Expandable form region */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'max-h-[2000px]' : 'max-h-0'
                }`}
              >
                <div className="pt-2">{card.form}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
