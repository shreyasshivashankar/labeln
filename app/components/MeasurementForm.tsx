'use client';

import { useState, useEffect } from 'react';
import type { MeasurementRecord } from '../../types/measurements';
import { MEASUREMENT_TABS, MEASUREMENT_UNIT } from '../../lib/measurement-config';
import { useAuth } from './AuthProvider';

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com/labeln';

export default function MeasurementForm() {
  const { session } = useAuth();
  const [record, setRecord] = useState<MeasurementRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(MEASUREMENT_TABS[0]?.id ?? 'upper_body');

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    fetch('/api/measurements', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((r) => (r.ok ? (r.json() as Promise<MeasurementRecord>) : null))
      .then((data) => setRecord(data))
      .finally(() => setLoading(false));
  }, [session]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-surface rounded w-48" />
        <div className="h-4 bg-surface rounded w-full" />
        <div className="h-4 bg-surface rounded w-3/4" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center py-12">
        <h2 className="font-serif text-3xl font-light mb-4">Custom Measurements</h2>
        <p className="text-text-secondary text-sm mb-8 max-w-md mx-auto leading-relaxed">
          You don&apos;t have saved measurements yet. Schedule a consultation and our team will
          guide you through the fitting on a video call.
        </p>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-10 py-3.5 bg-primary text-white text-[11px] font-medium uppercase tracking-[0.25em] hover:bg-secondary transition-colors duration-300"
        >
          Schedule a Consultation
        </a>
      </div>
    );
  }

  const hasCustom = record.custom_fields && record.custom_fields.length > 0;
  const allTabs = [
    ...MEASUREMENT_TABS,
    ...(hasCustom ? [{ id: 'custom', label: 'Custom', fields: [] }] : []),
  ];

  const currentTab = allTabs.find((t) => t.id === activeTab) ?? allTabs[0]!;
  if (!currentTab) return null;

  return (
    <div>
      <div className="flex justify-between items-start mb-10">
        <h2 className="font-serif text-3xl font-light">Your Measurements</h2>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary hover:text-primary transition-colors border-b border-border pb-0.5"
        >
          Update
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border mb-8 overflow-x-auto">
        {allTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-[11px] font-medium uppercase tracking-[0.2em] whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {currentTab.id === 'custom' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border">
          {record.custom_fields.map((field) => (
            <div key={field.key} className="bg-white p-5">
              <p className="text-[10px] uppercase tracking-[0.15em] text-text-secondary mb-2">{field.label}</p>
              <p className="font-serif text-lg">
                {field.value !== null && field.value !== undefined ? (
                  <>{field.value} <span className="text-text-secondary text-sm">{MEASUREMENT_UNIT}</span></>
                ) : (
                  <span className="text-border">&mdash;</span>
                )}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border">
          {currentTab.fields.map(({ key, label }) => {
            const value = record.values[key];
            return (
              <div key={key} className="bg-white p-5">
                <p className="text-[10px] uppercase tracking-[0.15em] text-text-secondary mb-2">{label}</p>
                <p className="font-serif text-lg">
                  {value !== undefined && value !== null ? (
                    <>{value} <span className="text-text-secondary text-sm">{MEASUREMENT_UNIT}</span></>
                  ) : (
                    <span className="text-border">&mdash;</span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {record.notes && (
        <div className="mt-10 pt-8 border-t border-border">
          <p className="text-[10px] uppercase tracking-[0.15em] text-text-secondary mb-3">
            Notes from your stylist
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            {record.notes}
          </p>
        </div>
      )}

      <p className="mt-10 text-[10px] text-text-secondary text-center uppercase tracking-[0.2em]">
        All measurements in inches
      </p>
    </div>
  );
}
