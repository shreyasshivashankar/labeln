'use client';

import { useState, useEffect, useCallback } from 'react';
import type { MeasurementRecord, MeasurementStatus } from '@/types/measurements';
import { STATUS_LABELS, STATUS_FLOW } from '@/types/measurements';
import type { ShopifyAdminOrder } from '@/lib/shopify-admin';
import { MEASUREMENT_TABS, MEASUREMENT_UNIT } from '@/lib/measurement-config';

type View = 'orders' | 'measure';

const STATUS_COLORS: Record<MeasurementStatus, string> = {
  pending_measurement: 'bg-amber-50 text-amber-700 border-amber-200',
  measurement_scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  measured: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  in_production: 'bg-purple-50 text-purple-700 border-purple-200',
  ready_to_ship: 'bg-green-50 text-green-700 border-green-200',
};

interface OrderMeasurementInfo {
  status: MeasurementStatus;
  has_measurements: boolean;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  // Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Orders view
  const [orders, setOrders] = useState<ShopifyAdminOrder[]>([]);
  const [orderInfo, setOrderInfo] = useState<Record<string, OrderMeasurementInfo>>({});
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Measurement view
  const [view, setView] = useState<View>('orders');
  const [selectedOrder, setSelectedOrder] = useState<ShopifyAdminOrder | null>(null);
  const [measurement, setMeasurement] = useState<MeasurementRecord | null>(null);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<MeasurementStatus>('pending_measurement');
  const [scheduledDate, setScheduledDate] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/auth')
      .then((r) => { if (r.ok) setAuthed(true); })
      .finally(() => setChecking(false));
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    setOrdersError('');
    try {
      const filter = showAll ? '' : '?filter=custom';
      const res = await fetch(`/api/admin/orders${filter}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrders(data.orders ?? []);

      const orderIds = (data.orders ?? []).map((o: ShopifyAdminOrder) => o.id);
      if (orderIds.length > 0) {
        const bulkRes = await fetch('/api/admin/measurements/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_ids: orderIds }),
        });
        const bulkData = await bulkRes.json();
        const info: Record<string, OrderMeasurementInfo> = {};
        for (const rec of (bulkData.records ?? [])) {
          info[rec.shopify_order_id] = {
            status: rec.status || 'pending_measurement',
            has_measurements: Object.keys(rec.values || {}).length > 0,
          };
        }
        setOrderInfo(info);
      }
    } catch (err) {
      setOrdersError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoadingOrders(false);
    }
  }, [showAll]);

  useEffect(() => {
    if (authed) fetchOrders();
  }, [authed, fetchOrders]);

  const openMeasurement = async (order: ShopifyAdminOrder) => {
    setSelectedOrder(order);
    setView('measure');
    setSaveMsg('');

    const res = await fetch(`/api/admin/measurements?order_id=${encodeURIComponent(order.id)}`);
    const data = await res.json();

    if (data.measurement) {
      setMeasurement(data.measurement);
      setStatus(data.measurement.status || 'pending_measurement');
      setScheduledDate(data.measurement.scheduled_date || '');
      populateForm(data.measurement);
      setEditing(false);
    } else {
      setMeasurement(null);
      setStatus('pending_measurement');
      setScheduledDate('');
      resetForm();
      setEditing(true);
    }
  };

  const populateForm = (m: MeasurementRecord) => {
    const v: Record<string, string> = {};
    for (const [k, val] of Object.entries(m.values)) {
      v[k] = String(val);
    }
    setValues(v);
    setNotes(m.notes || '');
  };

  const resetForm = () => {
    setValues({});
    setNotes('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setSaving(true);
    setSaveMsg('');

    const numericValues: Record<string, number> = {};
    for (const [k, v] of Object.entries(values)) {
      const n = parseFloat(v);
      if (!isNaN(n) && n > 0) numericValues[k] = n;
    }

    const customerName = selectedOrder.customer
      ? [selectedOrder.customer.firstName, selectedOrder.customer.lastName].filter(Boolean).join(' ')
      : '';

    const res = await fetch('/api/admin/measurements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shopify_order_id: selectedOrder.id,
        order_number: selectedOrder.name,
        customer_email: selectedOrder.customer?.email || '',
        customer_name: customerName,
        status,
        scheduled_date: scheduledDate || null,
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
      setOrderInfo((prev) => ({
        ...prev,
        [selectedOrder.id]: {
          status,
          has_measurements: Object.keys(numericValues).length > 0,
        },
      }));
    } else {
      setSaveMsg(`Error: ${data.error}`);
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

  if (view === 'measure' && selectedOrder) {
    const customerName = selectedOrder.customer
      ? [selectedOrder.customer.firstName, selectedOrder.customer.lastName].filter(Boolean).join(' ')
      : 'Unknown';
    const customItems = selectedOrder.lineItems.edges
      .filter((e) => e.node.variantTitle?.toLowerCase().includes('custom'))
      .map((e) => e.node);

    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button onClick={() => { setView('orders'); setSaveMsg(''); }}
          className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary hover:text-primary transition-colors mb-8 inline-block">
          &larr; Back to Orders
        </button>

        {/* Order header */}
        <div className="bg-white border border-border p-8 mb-8">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <h1 className="font-serif text-2xl font-light">Order {selectedOrder.name}</h1>
              <p className="text-text-secondary text-xs mt-1">{customerName}</p>
              <div className="flex items-center gap-4 mt-2">
                {selectedOrder.customer?.email && (
                  <a href={`mailto:${selectedOrder.customer.email}`}
                    className="text-[10px] text-primary border-b border-primary pb-0.5 hover:opacity-50 transition-opacity">
                    {selectedOrder.customer.email}
                  </a>
                )}
                <span className="text-[10px] text-text-secondary">
                  {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-medium uppercase tracking-[0.1em] px-3 py-1.5 border ${STATUS_COLORS[status]}`}>
                {STATUS_LABELS[status]}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.1em] px-3 py-1.5 border border-border">
                {selectedOrder.displayFulfillmentStatus}
              </span>
            </div>
          </div>

          {/* Custom items */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3">Custom Items</p>
            {customItems.map((item, i) => (
              <p key={i} className="text-sm text-text-secondary">
                {item.title} — <span className="text-primary">{item.variantTitle}</span> &times; {item.quantity}
              </p>
            ))}
          </div>
        </div>

        {/* Status & Scheduling */}
        <div className="bg-white border border-border p-8 mb-8">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-6">Order Status</h2>

          {/* Status progress */}
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

          {/* Schedule date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-[0.15em] mb-2">
                Measurement Session Date
              </label>
              <input type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full border border-border bg-surface px-4 py-3 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-[0.15em] mb-2">
                Quick Actions
              </label>
              <div className="flex gap-2">
                {selectedOrder.customer?.email && (
                  <a href={`mailto:${selectedOrder.customer.email}?subject=Label N — Measurement Session for Order ${selectedOrder.name}&body=Hi ${customerName},%0D%0A%0D%0AThank you for your custom order ${selectedOrder.name}! We'd love to schedule your measurement session.%0D%0A%0D%0APlease let us know a time that works for you, and we'll set up a quick video call to take your measurements.%0D%0A%0D%0AWarm regards,%0D%0ALabel N`}
                    className="px-4 py-3 text-[10px] font-medium uppercase tracking-[0.15em] border border-primary hover:bg-primary hover:text-white transition-all">
                    Email Customer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Measurements */}
        <div className="bg-white border border-border p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.2em]">Measurements</h2>
            {measurement && !editing && (
              <button onClick={() => setEditing(true)}
                className="px-6 py-2.5 border border-primary text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all">
                Edit
              </button>
            )}
          </div>

          {saveMsg && (
            <p className={`text-xs mb-6 ${saveMsg.startsWith('Error') ? 'text-red-600' : 'text-green-700'}`}>{saveMsg}</p>
          )}

          <form onSubmit={handleSave}>
            {MEASUREMENT_TABS.map((tab) => (
              <div key={tab.id} className="mb-10">
                <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-secondary mb-4">{tab.label}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border">
                  {tab.fields.map((field) => (
                    <div key={field.key} className="bg-white p-4">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-text-secondary mb-2">{field.label}</p>
                      {editing ? (
                        <div className="flex items-center gap-2">
                          <input type="number" step="0.25" min="0" value={values[field.key] || ''}
                            onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                            className="w-20 border border-border px-2 py-1.5 text-sm focus:outline-none focus:border-primary"
                            placeholder="—" />
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

            <div className="mb-8">
              <label className="block text-[11px] font-medium uppercase tracking-[0.15em] mb-2">Notes</label>
              {editing ? (
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-border bg-surface px-4 py-3 text-sm h-24 resize-none focus:outline-none focus:border-primary"
                  placeholder="Stylist notes, special instructions..." />
              ) : (
                <p className="text-sm text-text-secondary">{notes || '—'}</p>
              )}
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={saving}
                className="px-10 py-3.5 bg-primary text-white text-[11px] font-medium uppercase tracking-[0.25em] hover:bg-secondary transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Save All'}
              </button>
              {measurement && editing && (
                <button type="button" onClick={() => { populateForm(measurement); setEditing(false); }}
                  className="px-8 py-3.5 border border-border text-[11px] font-medium uppercase tracking-[0.2em] hover:border-primary transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </form>

          {measurement && (
            <p className="mt-8 text-[10px] text-text-secondary uppercase tracking-[0.2em]">
              Last updated: {new Date(measurement.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ─── Orders List ────────────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl font-light">Label N Admin</h1>
        <button onClick={handleLogout}
          className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary hover:text-primary transition-colors">
          Sign Out
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setShowAll(false)}
          className={`text-[11px] font-medium uppercase tracking-[0.2em] pb-1 border-b-2 transition-colors ${
            !showAll ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-primary'
          }`}>
          Custom Orders
        </button>
        <button onClick={() => setShowAll(true)}
          className={`text-[11px] font-medium uppercase tracking-[0.2em] pb-1 border-b-2 transition-colors ${
            showAll ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-primary'
          }`}>
          All Orders
        </button>
        <button onClick={fetchOrders} disabled={loadingOrders}
          className="ml-auto text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary hover:text-primary disabled:opacity-50">
          {loadingOrders ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {ordersError && (
        <div className="bg-red-50 border border-red-200 p-4 mb-6">
          <p className="text-red-700 text-xs">{ordersError}</p>
          <p className="text-red-500 text-[10px] mt-1">Make sure SHOPIFY_ADMIN_ACCESS_TOKEN is set.</p>
        </div>
      )}

      <div className="bg-white border border-border">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border bg-surface">
          <p className="col-span-2 text-[10px] font-medium uppercase tracking-[0.15em] text-text-secondary">Order</p>
          <p className="col-span-3 text-[10px] font-medium uppercase tracking-[0.15em] text-text-secondary">Customer</p>
          <p className="col-span-3 text-[10px] font-medium uppercase tracking-[0.15em] text-text-secondary">Items</p>
          <p className="col-span-2 text-[10px] font-medium uppercase tracking-[0.15em] text-text-secondary">Fulfillment</p>
          <p className="col-span-2 text-[10px] font-medium uppercase tracking-[0.15em] text-text-secondary">Custom Status</p>
        </div>

        {orders.length === 0 && !loadingOrders && (
          <div className="px-6 py-12 text-center">
            <p className="text-text-secondary text-sm">{ordersError ? 'Unable to load orders.' : 'No orders found.'}</p>
          </div>
        )}

        {loadingOrders && orders.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-text-secondary text-sm">Loading orders from Shopify...</p>
          </div>
        )}

        {orders.map((order) => {
          const customerName = order.customer
            ? [order.customer.firstName, order.customer.lastName].filter(Boolean).join(' ') || order.customer.email
            : 'Unknown';
          const isCustomOrder = order.lineItems.edges.some(
            (e) => e.node.variantTitle?.toLowerCase().includes('custom')
          );
          const info = orderInfo[order.id];
          const orderStatus = info?.status || 'pending_measurement';

          return (
            <div key={order.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border last:border-b-0 hover:bg-surface/50 transition-colors">
              <div className="col-span-2">
                <p className="text-sm font-medium">{order.name}</p>
                <p className="text-[10px] text-text-secondary mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="col-span-3">
                <p className="text-sm">{customerName}</p>
                {order.customer?.email && (
                  <p className="text-[10px] text-text-secondary mt-0.5">{order.customer.email}</p>
                )}
              </div>
              <div className="col-span-3">
                {order.lineItems.edges.slice(0, 2).map((e, i) => (
                  <p key={i} className="text-xs text-text-secondary">
                    {e.node.title}
                    {e.node.variantTitle && e.node.variantTitle !== 'Default Title' && (
                      <span className={e.node.variantTitle.toLowerCase().includes('custom') ? ' text-accent font-medium' : ''}>
                        {' '}({e.node.variantTitle})
                      </span>
                    )}
                  </p>
                ))}
                {order.lineItems.edges.length > 2 && (
                  <p className="text-[10px] text-text-secondary">+{order.lineItems.edges.length - 2} more</p>
                )}
              </div>
              <div className="col-span-2">
                <span className="text-[10px] font-medium uppercase tracking-[0.1em]">
                  {order.displayFulfillmentStatus}
                </span>
              </div>
              <div className="col-span-2">
                {isCustomOrder ? (
                  <button onClick={() => openMeasurement(order)}
                    className={`text-[10px] font-medium uppercase tracking-[0.1em] px-3 py-1.5 border transition-colors hover:opacity-80 ${
                      info ? STATUS_COLORS[orderStatus] : STATUS_COLORS.pending_measurement
                    }`}>
                    {info ? STATUS_LABELS[orderStatus] : 'Start'}
                  </button>
                ) : (
                  <span className="text-[10px] text-text-secondary">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
