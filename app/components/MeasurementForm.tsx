'use client';

import { useState, useEffect } from 'react';
import type { Measurements } from '../../types/measurements';
import { useAuth } from './AuthProvider';

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com/labeln';

const MEASUREMENT_GROUPS: {
  label: string;
  fields: { key: keyof Measurements; label: string; unit: string }[];
}[] = [
  {
    label: 'Upper Body',
    fields: [
      { key: 'bust', label: 'Bust / Chest', unit: 'in' },
      { key: 'waist', label: 'Waist', unit: 'in' },
      { key: 'hips', label: 'Hips', unit: 'in' },
      { key: 'shoulder', label: 'Shoulder Width', unit: 'in' },
      { key: 'sleeveLength', label: 'Sleeve Length', unit: 'in' },
    ],
  },
  {
    label: 'Lower Body',
    fields: [
      { key: 'height', label: 'Height', unit: 'in' },
      { key: 'inseam', label: 'Inseam', unit: 'in' },
    ],
  },
  {
    label: 'Garment Lengths',
    fields: [
      { key: 'blouseLength', label: 'Blouse Length', unit: 'in' },
      { key: 'lehenggaLength', label: 'Lehengga Length', unit: 'in' },
      { key: 'anarkaliLength', label: 'Anarkali / Suit Length', unit: 'in' },
    ],
  },
];

export default function MeasurementForm() {
  const { session } = useAuth();
  const [measurements, setMeasurements] = useState<Measurements | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    fetch('/api/measurements', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((r) => (r.ok ? (r.json() as Promise<Measurements>) : null))
      .then((data) => setMeasurements(data))
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

  if (!measurements) {
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

      <div className="space-y-8">
        {MEASUREMENT_GROUPS.map((group) => (
          <div key={group.label}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              {group.label}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {group.fields.map(({ key, label, unit }) => {
                const value = measurements[key];
                return (
                  <div key={key} className="bg-white p-4 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    <p className="font-semibold">
                      {value !== undefined && value !== null ? (
                        `${String(value)} ${unit}`
                      ) : (
                        <span className="text-gray-300 font-normal">&mdash;</span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {measurements.notes && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              Notes from your stylist
            </h3>
            <p className="bg-white p-4 rounded-lg border border-gray-100 text-sm text-gray-700">
              {measurements.notes}
            </p>
          </div>
        )}
      </div>

      <p className="mt-8 text-xs text-gray-400 text-center">
        Measurements are maintained by our team. Contact us to update any field.
      </p>
    </div>
  );
}
