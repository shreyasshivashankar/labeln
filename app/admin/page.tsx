'use client';

import { useState, useEffect } from 'react';
import type { MeasurementRecord } from '@/types/measurements';
import { MEASUREMENT_TABS, MEASUREMENT_UNIT } from '@/lib/measurement-config';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Search
  const [searchEmail, setSearchEmail] = useState('');
  const [measurement, setMeasurement] = useState<MeasurementRecord | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/auth')
      .then((r) => {
        if (r.ok) setAuthed(true);
      })
      .finally(() => setChecking(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setAuthed(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;
    setLoading(true);
    setSearched(false);
    setSaveMsg('');

    const res = await fetch(`/api/admin/measurements?email=${encodeURIComponent(searchEmail)}`);
    const data = await res.json();

    setMeasurement(data.measurement ?? null);
    setSearched(true);
    setLoading(false);

    if (data.measurement) {
      populateForm(data.measurement);
    } else {
      resetForm();
      setCustomerName('');
    }
  };

  const populateForm = (m: MeasurementRecord) => {
    setCustomerName(m.customer_name || '');
    const v: Record<string, string> = {};
    for (const [k, val] of Object.entries(m.values)) {
      v[k] = String(val);
    }
    setValues(v);
    setNotes(m.notes || '');
    setEditing(false);
  };

  const resetForm = () => {
    setValues({});
    setNotes('');
    setEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');

    // Convert string values to numbers
    const numericValues: Record<string, number> = {};
    for (const [k, v] of Object.entries(values)) {
      const n = parseFloat(v);
      if (!isNaN(n) && n > 0) {
        numericValues[k] = n;
      }
    }

    const res = await fetch('/api/admin/measurements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_email: searchEmail.toLowerCase(),
        customer_name: customerName,
        values: numericValues,
        custom_fields: [],
        notes: notes || null,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      setSaveMsg(`Measurements ${data.action} successfully`);
      setMeasurement(data.measurement);
      setEditing(false);
    } else {
      setSaveMsg(`Error: ${data.error}`);
    }
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text-secondary text-sm">Loading...</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-sm px-6">
          <h1 className="font-serif text-3xl font-light text-center mb-8">Admin</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-[0.15em] mb-2" htmlFor="admin-email">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-[0.15em] mb-2" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
            {loginError && <p className="text-red-600 text-xs">{loginError}</p>}
            <button
              type="submit"
              className="w-full py-3.5 bg-primary text-white text-[11px] font-medium uppercase tracking-[0.25em] hover:bg-secondary transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="font-serif text-3xl font-light">Label N Admin</h1>
        <button
          onClick={handleLogout}
          className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary hover:text-primary transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-border p-8 mb-8">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-6">Customer Measurements</h2>
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Customer email address"
            className="flex-1 border border-border bg-surface px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-primary text-white text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Results */}
      {searched && (
        <div className="bg-white border border-border p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="font-serif text-2xl font-light">
                {measurement ? 'Measurements Found' : 'No Measurements'}
              </h2>
              <p className="text-text-secondary text-xs mt-1">{searchEmail}</p>
            </div>
            {measurement && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-2.5 border border-primary text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all"
              >
                Edit
              </button>
            )}
            {!measurement && (
              <button
                onClick={() => {
                  resetForm();
                  setEditing(true);
                }}
                className="px-6 py-2.5 bg-primary text-white text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-secondary transition-colors"
              >
                Add Measurements
              </button>
            )}
          </div>

          {saveMsg && (
            <p className={`text-xs mb-6 ${saveMsg.startsWith('Error') ? 'text-red-600' : 'text-green-700'}`}>
              {saveMsg}
            </p>
          )}

          {(measurement || editing) && (
            <form onSubmit={handleSave}>
              {/* Customer Name */}
              <div className="mb-8">
                <label className="block text-[11px] font-medium uppercase tracking-[0.15em] mb-2">
                  Customer Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full max-w-sm border border-border bg-surface px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                ) : (
                  <p className="text-sm">{customerName || '—'}</p>
                )}
              </div>

              {/* Measurement Tabs */}
              {MEASUREMENT_TABS.map((tab) => (
                <div key={tab.id} className="mb-10">
                  <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-secondary mb-4">
                    {tab.label}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border">
                    {tab.fields.map((field) => (
                      <div key={field.key} className="bg-white p-4">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-text-secondary mb-2">
                          {field.label}
                        </p>
                        {editing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              step="0.25"
                              min="0"
                              value={values[field.key] || ''}
                              onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                              className="w-20 border border-border px-2 py-1.5 text-sm focus:outline-none focus:border-primary transition-colors"
                              placeholder="—"
                            />
                            <span className="text-text-secondary text-xs">{MEASUREMENT_UNIT}</span>
                          </div>
                        ) : (
                          <p className="font-serif text-lg">
                            {values[field.key] ? (
                              <>{values[field.key]} <span className="text-text-secondary text-sm">{MEASUREMENT_UNIT}</span></>
                            ) : (
                              <span className="text-border">&mdash;</span>
                            )}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Notes */}
              <div className="mb-8">
                <label className="block text-[11px] font-medium uppercase tracking-[0.15em] mb-2">
                  Notes
                </label>
                {editing ? (
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border border-border bg-surface px-4 py-3 text-sm h-24 resize-none focus:outline-none focus:border-primary transition-colors"
                    placeholder="Stylist notes, special instructions..."
                  />
                ) : (
                  <p className="text-sm text-text-secondary">{notes || '—'}</p>
                )}
              </div>

              {editing && (
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-10 py-3.5 bg-primary text-white text-[11px] font-medium uppercase tracking-[0.25em] hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Measurements'}
                  </button>
                  {measurement && (
                    <button
                      type="button"
                      onClick={() => {
                        populateForm(measurement);
                        setEditing(false);
                      }}
                      className="px-8 py-3.5 border border-border text-[11px] font-medium uppercase tracking-[0.2em] hover:border-primary transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </form>
          )}

          {measurement && (
            <p className="mt-8 text-[10px] text-text-secondary uppercase tracking-[0.2em]">
              Last updated: {new Date(measurement.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
