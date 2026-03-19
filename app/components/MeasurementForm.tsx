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
      <div className="bg-gray-50 p-8 rounded-lg space-y-3 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-3">Custom Measurements</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          You don&apos;t have saved measurements yet. Schedule a consultation and our team will
          guide you through the fitting on a video call.
        </p>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary text-white px-8 py-3 rounded-full hover:opacity-90 transition"
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
    <div className="bg-gray-50 p-8 rounded-lg">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold">Your Measurements</h2>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary underline underline-offset-2"
        >
          Update via consultation
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {allTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {currentTab.id === 'custom' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {record.custom_fields.map((field) => (
            <div key={field.key} className="bg-white p-4 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">{field.label}</p>
              <p className="font-semibold">
                {field.value !== null && field.value !== undefined ? (
                  `${field.value} ${MEASUREMENT_UNIT}`
                ) : (
                  <span className="text-gray-300 font-normal">&mdash;</span>
                )}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {currentTab.fields.map(({ key, label }) => {
            const value = record.values[key];
            return (
              <div key={key} className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="font-semibold">
                  {value !== undefined && value !== null ? (
                    `${value} ${MEASUREMENT_UNIT}`
                  ) : (
                    <span className="text-gray-300 font-normal">&mdash;</span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {record.notes && (
        <div className="mt-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
            Notes from your stylist
          </h3>
          <p className="bg-white p-4 rounded-lg border border-gray-100 text-sm text-gray-700">
            {record.notes}
          </p>
        </div>
      )}

      <p className="mt-8 text-xs text-gray-400 text-center">
        All measurements in inches. Maintained by our team — contact us to update.
      </p>
    </div>
  );
}
