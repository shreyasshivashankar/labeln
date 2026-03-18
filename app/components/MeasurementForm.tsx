'use client';

import { useState, useEffect } from 'react';
import { Measurements } from '../../lib/db';
import Link from 'next/link';

export default function MeasurementForm() {
  const [measurements, setMeasurements] = useState<Measurements | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeasurements = async () => {
      setLoading(true);
      const response = await fetch('/api/measurements');
      if (response.ok) {
        const data = await response.json();
        setMeasurements(data);
      }
      setLoading(false);
    };

    fetchMeasurements();
  }, []);

  if (loading) {
    return <p>Loading measurements...</p>;
  }

  return (
    <div className="bg-gray-100 p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Your Custom Measurements</h2>
      {measurements ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Bust</label>
            <p className="font-bold">{measurements.bust} inches</p>
          </div>
          <div>
            <label className="block text-gray-700">Waist</label>
            <p className="font-bold">{measurements.waist} inches</p>
          </div>
          <div>
            <label className="block text-gray-700">Hips</label>
            <p className="font-bold">{measurements.hips} inches</p>
          </div>
        </div>
      ) : (
        <div>
          <p>You have no saved measurements.</p>
          <Link href="https://calendly.com/your-username" legacyBehavior passHref>
            <a target="_blank" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-full">
              Schedule a Consultation
            </a>
          </Link>
        </div>
      )}
      <div className="mt-8 text-sm text-gray-600">
        <p>To update your measurements, please contact us to schedule a new consultation.</p>
      </div>
    </div>
  );
}
