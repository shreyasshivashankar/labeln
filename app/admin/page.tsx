'use client';

import { useState, useEffect, useCallback } from 'react';
import type { MeasurementRecord, MeasurementStatus, CustomField } from '@/types/measurements';
import { STATUS_LABELS, STATUS_FLOW } from '@/types/measurements';
import { BRAND } from '@/lib/constants';

type View = 'list' | 'measure';

const STATUS_COLORS: Record<MeasurementStatus, string> = {
  pending_measurement: 'bg-amber-50 text-amber-700 border-amber-200',
  measurement_scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  measured: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  in_production: 'bg-purple-50 text-purple-700 border-purple-200',
  ready_to_ship: 'bg-green-50 text-green-700 border-green-200',
  expired: 'bg-gray-50 text-gray-500 border-gray-200',
};

/** Common measurement types for quick-add */
const COMMON_MEASUREMENTS = [
  'Bust', 'Waist', 'Hips', 'Shoulder Width', 'Sleeve Length',
  'Arm Circumference', 'Neck', 'Height', 'Inseam', 'Outseam',
  'Thigh', 'Calf', 'Blouse Length', 'Lehenga Length',
  'Anarkali Length', 'Saree Blouse Length', 'Kurta Length', 'Sharara Length',
];

/** Convert label to storage key */
function toKey(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  // Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // List view
  const [records, setRecords] = useState<MeasurementRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'active' | 'expired'>('active');

  // New order form
  const [showNewForm, setShowNewForm] = useState(false);
  const [newOrderNumber, setNewOrderNumber] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');

  // Measurement view
  const [view, setView] = useState<View>('list');
  const [selectedRecord, setSelectedRecord] = useState<MeasurementRecord | null>(null);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<MeasurementStatus>('pending_measurement');
  const [scheduledDate, setScheduledDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Measurements as key-value pairs
  const [measurements, setMeasurements] = useState<Array<{ key: string; label: string; value: string }>>([]);

  // Custom measurement widget
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [showCommonPicker, setShowCommonPicker] = useState(false);

  useEffect(() => {
    fetch('/api/admin/auth')
      .then((r) => { if (r.ok) setAuthed(true); })
      .finally(() => setChecking(false));
  }, []);

  const fetchRecords = useCallback(async () => {
    setLoadingRecords(true);
    try {
      const res = await fetch('/api/admin/measurements/all');
      const data = await res.json();
      setRecords(data.records ?? []);
    } catch {
      // silently fail
    } finally {
      setLoadingRecords(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchRecords();
  }, [authed, fetchRecords]);

  /** Build measurements array from a record's values + custom_fields */
  const loadMeasurements = (record: MeasurementRecord) => {
    const items: Array<{ key: string; label: string; value: string }> = [];

    // Load predefined values
    for (const [key, val] of Object.entries(record.values)) {
      const commonLabel = COMMON_MEASUREMENTS.find((m) => toKey(m) === key);
      items.push({ key, label: commonLabel || key, value: String(val) });
    }

    // Load custom fields that aren't already in values
    for (const cf of (record.custom_fields || [])) {
      if (!items.some((i) => i.key === cf.key)) {
        items.push({ key: cf.key, label: cf.label, value: cf.value != null ? String(cf.value) : '' });
      }
    }

    setMeasurements(items);
  };

  const openRecord = (record: MeasurementRecord) => {
    setSelectedRecord(record);
    setView('measure');
    setSaveMsg('');
    setStatus(record.status || 'pending_measurement');
    setScheduledDate(record.scheduled_date || '');
    setCustomerName(record.customer_name || '');
    setCustomerEmail(record.customer_email || '');
    setOrderNumber(record.order_number || '');
    setNotes(record.notes || '');
    loadMeasurements(record);
    setEditing(false);
    setShowAddField(false);
    setShowCommonPicker(false);
  };

  const startNewOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderNumber.trim()) return;
    setSaving(true);

    const res = await fetch('/api/admin/measurements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shopify_order_id: `order-${newOrderNumber.replace(/^#/, '')}`,
        order_number: newOrderNumber.startsWith('#') ? newOrderNumber : `#${newOrderNumber}`,
        customer_email: newCustomerEmail.toLowerCase(),
        customer_name: newCustomerName,
        status: 'pending_measurement',
        values: {},
        custom_fields: [],
        notes: null,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      setShowNewForm(false);
      setNewOrderNumber('');
      setNewCustomerName('');
      setNewCustomerEmail('');
      openRecord(data.measurement);
      setEditing(true);
      fetchRecords();
    }
  };

  const addMeasurementField = (label: string) => {
    const key = toKey(label);
    if (measurements.some((m) => m.key === key)) return;
    setMeasurements((prev) => [...prev, { key, label, value: '' }]);
    setNewFieldLabel('');
    setShowAddField(false);
    setShowCommonPicker(false);
  };

  const removeMeasurementField = (key: string) => {
    setMeasurements((prev) => prev.filter((m) => m.key !== key));
  };

  const updateMeasurementValue = (key: string, value: string) => {
    setMeasurements((prev) => prev.map((m) => m.key === key ? { ...m, value } : m));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    setSaving(true);
    setSaveMsg('');

    // Split measurements into predefined values and custom_fields
    const numericValues: Record<string, number> = {};
    const customFields: CustomField[] = [];

    for (const m of measurements) {
      const n = parseFloat(m.value);
      const isCommon = COMMON_MEASUREMENTS.some((cm) => toKey(cm) === m.key);
      if (isCommon) {
        if (!isNaN(n) && n > 0) numericValues[m.key] = n;
      } else {
        customFields.push({ key: m.key, label: m.label, value: !isNaN(n) && n > 0 ? n : null });
      }
    }

    const res = await fetch('/api/admin/measurements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shopify_order_id: selectedRecord.shopify_order_id,
        order_number: orderNumber,
        customer_email: customerEmail.toLowerCase(),
        customer_name: customerName,
        status,
        scheduled_date: scheduledDate || null,
        values: numericValues,
        custom_fields: customFields,
        notes: notes || null,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      setSaveMsg('Saved successfully');
      setSelectedRecord(data.measurement);
      setEditing(false);
      fetchRecords();
    } else {
      setSaveMsg(`Error: ${data.error}`);
    }
  };

  const handleMarkExpired = async () => {
    if (!selectedRecord) return;
    setSaving(true);

    const res = await fetch('/api/admin/measurements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shopify_order_id: selectedRecord.shopify_order_id,
        order_number: selectedRecord.order_number,
        customer_email: selectedRecord.customer_email,
        customer_name: selectedRecord.customer_name,
        status: 'expired',
        scheduled_date: selectedRecord.scheduled_date,
        values: selectedRecord.values,
        custom_fields: selectedRecord.custom_fields,
        notes: selectedRecord.notes,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      setStatus('expired');
      setSelectedRecord(data.measurement);
      fetchRecords();
      setSaveMsg('Order marked as expired');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) setAuthed(true);
    else setLoginError('Invalid credentials');
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setAuthed(false);
  };

  // ─── Login ──────────────────────────────────────────────────────────────────

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
              <label className="block text-[11px] font-medium uppercase tracking-[0.15em] mb-2" htmlFor="admin-email">Email</label>
              <input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:border-primary" required />
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-[0.15em] mb-2" htmlFor="admin-password">Password</label>
              <input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:border-primary" required />
            </div>
            {loginError && <p className="text-red-600 text-xs">{loginError}</p>}
            <button type="submit" className="w-full py-3.5 bg-primary text-white text-[11px] font-medium uppercase tracking-[0.25em] hover:bg-secondary transition-colors">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Measurement View ───────────────────────────────────────────────────────

  if (view === 'measure' && selectedRecord) {
    const isExpired = status === 'expired';
    const availableCommon = COMMON_MEASUREMENTS.filter(
      (label) => !measurements.some((m) => m.key === toKey(label))
    );

    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button onClick={() => { setView('list'); setSaveMsg(''); }}
          className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary hover:text-primary transition-colors mb-8 inline-block">
          &larr; Back to Orders
        </button>

        {/* Order header */}
        <div className="bg-white border border-border p-8 mb-8">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="font-serif text-2xl font-light">Order {selectedRecord.order_number}</h1>
              <p className="text-text-secondary text-xs mt-1">{selectedRecord.customer_name || '—'}</p>
              {selectedRecord.customer_email && (
                <a href={`mailto:${selectedRecord.customer_email}`}
                  className="text-[10px] text-primary border-b border-primary pb-0.5 hover:opacity-50 transition-opacity mt-1 inline-block">
                  {selectedRecord.customer_email}
                </a>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-medium uppercase tracking-[0.1em] px-3 py-1.5 border ${STATUS_COLORS[status]}`}>
                {STATUS_LABELS[status]}
              </span>
              {!isExpired && (
                <button onClick={handleMarkExpired} disabled={saving}
                  className="text-[10px] font-medium uppercase tracking-[0.1em] px-3 py-1.5 border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors">
                  Mark Expired
                </button>
              )}
            </div>
          </div>
        </div>

        {isExpired && (
          <div className="bg-gray-50 border border-gray-200 px-6 py-4 mb-8 text-center">
            <p className="text-gray-500 text-sm">This order has been marked as expired. Measurements are read-only.</p>
          </div>
        )}

        {/* Status & Customer Info */}
        {!isExpired && (
          <div className="bg-white border border-border p-8 mb-8">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-6">Order Status</h2>

            <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
              {STATUS_FLOW.map((s, i) => {
                const currentIdx = STATUS_FLOW.indexOf(status);
                const isActive = i <= currentIdx;
                const isCurrent = s === status;
                return (
                  <button key={s} onClick={() => setStatus(s)}
                    className={`flex-1 min-w-0 px-2 py-2.5 text-[9px] font-medium uppercase tracking-[0.1em] text-center border transition-all ${
                      isCurrent
                        ? STATUS_COLORS[s]
                        : isActive
                          ? 'bg-surface text-primary border-border'
                          : 'bg-white text-text-secondary border-border hover:bg-surface'
                    }`}>
                    {STATUS_LABELS[s]}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.15em] mb-2">Measurement Session Date</label>
                <input type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full border border-border bg-surface px-4 py-3 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.15em] mb-2">Quick Actions</label>
                <div className="flex gap-2">
                  {customerEmail && (
                    <a href={`mailto:${customerEmail}?subject=${BRAND.name} — Measurement Session for Order ${orderNumber}&body=Hi ${customerName || 'there'},%0D%0A%0D%0AThank you for your custom order ${orderNumber}! We'd love to schedule your measurement session.%0D%0A%0D%0APlease let us know a time that works for you, and we'll set up a quick video call to take your measurements.%0D%0A%0D%0AWarm regards,%0D%0A${BRAND.name}`}
                      className="px-4 py-3 text-[10px] font-medium uppercase tracking-[0.15em] border border-primary hover:bg-primary hover:text-white transition-all">
                      Email Customer
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Editable customer info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.15em] mb-2">Order #</label>
                <input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full border border-border bg-surface px-4 py-3 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.15em] mb-2">Customer Name</label>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-border bg-surface px-4 py-3 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.15em] mb-2">Customer Email</label>
                <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full border border-border bg-surface px-4 py-3 text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
          </div>
        )}

        {/* Measurements — key-value pairs */}
        <div className="bg-white border border-border p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.2em]">Measurements <span className="text-text-secondary font-normal">(inches)</span></h2>
            {!isExpired && !editing && (
              <button onClick={() => setEditing(true)}
                className="px-6 py-2.5 border border-primary text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all">
                {measurements.length > 0 ? 'Edit' : 'Add Measurements'}
              </button>
            )}
          </div>

          {saveMsg && (
            <p className={`text-xs mb-6 ${saveMsg.startsWith('Error') ? 'text-red-600' : 'text-green-700'}`}>{saveMsg}</p>
          )}

          <form onSubmit={handleSave}>
            {measurements.length === 0 && !editing && (
              <p className="text-text-secondary text-sm py-8 text-center">No measurements recorded yet.</p>
            )}

            {measurements.length > 0 && (
              <div className="border border-border divide-y divide-border mb-6">
                {measurements.map((m) => (
                  <div key={m.key} className="flex items-center px-4 py-3 gap-4">
                    <p className="flex-1 text-sm text-text-secondary">{m.label}</p>
                    {editing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          value={m.value}
                          onChange={(e) => updateMeasurementValue(m.key, e.target.value)}
                          className="w-24 border border-border px-3 py-2 text-sm text-right focus:outline-none focus:border-primary"
                          placeholder="0"
                        />
                        <span className="text-text-secondary text-xs w-4">in</span>
                        <button type="button" onClick={() => removeMeasurementField(m.key)}
                          className="text-gray-400 hover:text-red-500 transition-colors ml-1 text-lg leading-none"
                          title="Remove field">&times;</button>
                      </div>
                    ) : (
                      <p className="font-serif text-lg tabular-nums">
                        {m.value ? (
                          <>{m.value} <span className="text-text-secondary text-sm">in</span></>
                        ) : (
                          <span className="text-border">&mdash;</span>
                        )}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add measurement widget */}
            {editing && (
              <div className="mb-8">
                {!showAddField && !showCommonPicker && (
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowCommonPicker(true)}
                      className="text-[11px] font-medium uppercase tracking-[0.15em] text-primary hover:text-secondary transition-colors">
                      + Add Common
                    </button>
                    <span className="text-border">|</span>
                    <button type="button" onClick={() => setShowAddField(true)}
                      className="text-[11px] font-medium uppercase tracking-[0.15em] text-primary hover:text-secondary transition-colors">
                      + Add Custom
                    </button>
                  </div>
                )}

                {/* Common measurements picker */}
                {showCommonPicker && (
                  <div className="border border-border p-4">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[11px] font-medium uppercase tracking-[0.15em]">Select Measurements</p>
                      <button type="button" onClick={() => setShowCommonPicker(false)}
                        className="text-text-secondary hover:text-primary text-sm">&times;</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableCommon.length === 0 && (
                        <p className="text-text-secondary text-xs">All common measurements have been added.</p>
                      )}
                      {availableCommon.map((label) => (
                        <button key={label} type="button" onClick={() => addMeasurementField(label)}
                          className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.1em] border border-border hover:border-primary hover:text-primary transition-colors">
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom measurement input */}
                {showAddField && (
                  <div className="flex items-center gap-3 border border-border p-4">
                    <input
                      type="text"
                      value={newFieldLabel}
                      onChange={(e) => setNewFieldLabel(e.target.value)}
                      placeholder="e.g. Dupatta Length"
                      className="flex-1 border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newFieldLabel.trim()) addMeasurementField(newFieldLabel.trim());
                        }
                      }}
                    />
                    <button type="button"
                      onClick={() => { if (newFieldLabel.trim()) addMeasurementField(newFieldLabel.trim()); }}
                      className="px-4 py-2 bg-primary text-white text-[11px] font-medium uppercase tracking-[0.15em] hover:bg-secondary transition-colors">
                      Add
                    </button>
                    <button type="button" onClick={() => { setShowAddField(false); setNewFieldLabel(''); }}
                      className="text-text-secondary hover:text-primary text-sm">&times;</button>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            <div className="mb-8 pt-6 border-t border-border">
              <label className="block text-[11px] font-medium uppercase tracking-[0.15em] mb-2">Notes</label>
              {editing ? (
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-border bg-surface px-4 py-3 text-sm h-24 resize-none focus:outline-none focus:border-primary"
                  placeholder="Stylist notes, special instructions..." />
              ) : (
                <p className="text-sm text-text-secondary">{notes || '—'}</p>
              )}
            </div>

            {/* Actions */}
            {!isExpired && (
              <div className="flex gap-4">
                <button type="submit" disabled={saving}
                  className="px-10 py-3.5 bg-primary text-white text-[11px] font-medium uppercase tracking-[0.25em] hover:bg-secondary transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save All'}
                </button>
                {editing && (
                  <button type="button" onClick={() => { loadMeasurements(selectedRecord); setEditing(false); setShowAddField(false); setShowCommonPicker(false); }}
                    className="px-8 py-3.5 border border-border text-[11px] font-medium uppercase tracking-[0.2em] hover:border-primary transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            )}
          </form>

          <p className="mt-8 text-[10px] text-text-secondary uppercase tracking-[0.2em]">
            Last updated: {new Date(selectedRecord.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    );
  }

  // ─── Orders List ────────────────────────────────────────────────────────────

  const filteredRecords = records.filter((r) =>
    filterStatus === 'expired' ? r.status === 'expired' : r.status !== 'expired'
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl font-light">{BRAND.name} Admin</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowNewForm(true)}
            className="px-6 py-2.5 bg-primary text-white text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-secondary transition-colors">
            + New Custom Order
          </button>
          <button onClick={handleLogout}
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary hover:text-primary transition-colors">
            Sign Out
          </button>
        </div>
      </div>

      {/* New order form */}
      {showNewForm && (
        <div className="bg-white border border-border p-8 mb-8">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-6">Add Custom Order</h2>
          <p className="text-text-secondary text-xs mb-6">Enter the Shopify order number and customer details to start tracking measurements.</p>
          <form onSubmit={startNewOrder} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.15em] mb-1.5">Order # *</label>
              <input type="text" value={newOrderNumber} onChange={(e) => setNewOrderNumber(e.target.value)}
                placeholder="1001" className="w-full border border-border bg-surface px-4 py-3 text-sm focus:outline-none focus:border-primary" required />
            </div>
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.15em] mb-1.5">Customer Name</label>
              <input type="text" value={newCustomerName} onChange={(e) => setNewCustomerName(e.target.value)}
                placeholder="Jane Doe" className="w-full border border-border bg-surface px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.15em] mb-1.5">Customer Email</label>
              <input type="email" value={newCustomerEmail} onChange={(e) => setNewCustomerEmail(e.target.value)}
                placeholder="jane@example.com" className="w-full border border-border bg-surface px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div className="flex items-end gap-2">
              <button type="submit" disabled={saving}
                className="px-6 py-3 bg-primary text-white text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-secondary transition-colors disabled:opacity-50">
                {saving ? 'Creating...' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowNewForm(false)}
                className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary hover:text-primary transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-6 mb-6">
        <button
          onClick={() => setFilterStatus('active')}
          className={`text-[11px] font-medium uppercase tracking-[0.2em] pb-1 border-b-2 transition-colors ${
            filterStatus === 'active' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-primary'
          }`}>
          Active
        </button>
        <button
          onClick={() => setFilterStatus('expired')}
          className={`text-[11px] font-medium uppercase tracking-[0.2em] pb-1 border-b-2 transition-colors ${
            filterStatus === 'expired' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-primary'
          }`}>
          Expired
        </button>
      </div>

      {/* Orders table */}
      <div className="bg-white border border-border">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border bg-surface">
          <p className="col-span-2 text-[10px] font-medium uppercase tracking-[0.15em] text-text-secondary">Order</p>
          <p className="col-span-3 text-[10px] font-medium uppercase tracking-[0.15em] text-text-secondary">Customer</p>
          <p className="col-span-3 text-[10px] font-medium uppercase tracking-[0.15em] text-text-secondary">Status</p>
          <p className="col-span-2 text-[10px] font-medium uppercase tracking-[0.15em] text-text-secondary">Measurements</p>
          <p className="col-span-2 text-[10px] font-medium uppercase tracking-[0.15em] text-text-secondary">Updated</p>
        </div>

        {filteredRecords.length === 0 && !loadingRecords && (
          <div className="px-6 py-12 text-center">
            <p className="text-text-secondary text-sm mb-2">
              {filterStatus === 'expired' ? 'No expired orders.' : 'No custom orders yet.'}
            </p>
            {filterStatus === 'active' && (
              <p className="text-text-secondary text-xs">Click &ldquo;+ New Custom Order&rdquo; to add one when a customer orders a custom size.</p>
            )}
          </div>
        )}

        {loadingRecords && records.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-text-secondary text-sm">Loading...</p>
          </div>
        )}

        {filteredRecords.map((record) => {
          const measurementCount = Object.keys(record.values).length + (record.custom_fields?.length || 0);
          const recordStatus = record.status || 'pending_measurement';

          return (
            <div key={record.id}
              onClick={() => openRecord(record)}
              className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border last:border-b-0 hover:bg-surface/50 transition-colors cursor-pointer">
              <div className="col-span-2">
                <p className="text-sm font-medium">{record.order_number}</p>
              </div>
              <div className="col-span-3">
                <p className="text-sm">{record.customer_name || '—'}</p>
                {record.customer_email && (
                  <p className="text-[10px] text-text-secondary mt-0.5">{record.customer_email}</p>
                )}
              </div>
              <div className="col-span-3">
                <span className={`text-[10px] font-medium uppercase tracking-[0.1em] px-3 py-1.5 border inline-block ${STATUS_COLORS[recordStatus]}`}>
                  {STATUS_LABELS[recordStatus]}
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-text-secondary">
                  {measurementCount > 0 ? `${measurementCount} fields` : 'None'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-text-secondary">
                  {new Date(record.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
