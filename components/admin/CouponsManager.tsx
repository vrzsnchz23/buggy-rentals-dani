"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Check } from "lucide-react";

type Coupon = {
  id: string; partnerName: string; title: string; description: string;
  code?: string | null; imageEmoji: string; validUntil?: string | null;
  active: boolean; sortOrder: number;
};

const EMPTY: Omit<Coupon, "id"> = {
  partnerName: "", title: "", description: "", code: "", imageEmoji: "🎟️",
  validUntil: "", active: true, sortOrder: 0,
};

export function CouponsManager({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<Omit<Coupon, "id">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  function openNew() { setEditing({ id: "new", ...EMPTY }); setForm(EMPTY); }
  function openEdit(c: Coupon) { setEditing(c); setForm({ partnerName: c.partnerName, title: c.title, description: c.description, code: c.code || "", imageEmoji: c.imageEmoji, validUntil: c.validUntil ? c.validUntil.split("T")[0] : "", active: c.active, sortOrder: c.sortOrder }); }

  async function save() {
    if (!editing) return;
    setSaving(true);
    const payload = { ...form, validUntil: form.validUntil || null, code: form.code || null };
    if (editing.id === "new") {
      const res = await fetch("/api/admin/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const c = await res.json();
      setCoupons((prev) => [c, ...prev]);
    } else {
      const res = await fetch(`/api/admin/coupons/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const c = await res.json();
      setCoupons((prev) => prev.map((x) => x.id === c.id ? c : x));
    }
    setSaving(false);
    setEditing(null);
  }

  async function remove(id: string) {
    if (!confirm("Delete this coupon?")) return;
    setDeleting(id);
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    setDeleting(null);
  }

  return (
    <div className="space-y-4">
      <button onClick={openNew} className="flex items-center gap-2 bg-[#E8836A] hover:bg-[#d4735c] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors">
        <Plus className="w-4 h-4" /> Add Coupon
      </button>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[#0F2035]">{editing.id === "new" ? "New Coupon" : "Edit Coupon"}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Partner Name</label>
                <input className="form-input mt-1" value={form.partnerName} onChange={(e) => setForm((f) => ({ ...f, partnerName: e.target.value }))} placeholder="Banana Beach Club" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Title / Benefit</label>
                <input className="form-input mt-1" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Free Entry" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                <textarea className="form-input mt-1 h-20 resize-none" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Free beach entry for Buggy Rentals guests. Show this screen at the door." />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Emoji</label>
                <input className="form-input mt-1 text-2xl" value={form.imageEmoji} onChange={(e) => setForm((f) => ({ ...f, imageEmoji: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Code (optional)</label>
                <input className="form-input mt-1 font-mono" value={form.code || ""} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="BUGGY2025" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Valid Until</label>
                <input type="date" className="form-input mt-1" value={form.validUntil || ""} onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort Order</label>
                <input type="number" className="form-input mt-1" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input type="checkbox" id="active" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="rounded" />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">Active (visible to customers)</label>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
              <button onClick={save} disabled={saving || !form.partnerName || !form.title} className="flex items-center gap-2 bg-[#1B4F72] hover:bg-[#154060] text-white px-5 py-2 rounded-xl font-semibold text-sm disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
              </button>
            </div>
          </div>
        </div>
      )}

      {coupons.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm">No coupons yet</div>
      )}

      {coupons.map((c) => (
        <div key={c.id} className={`bg-white rounded-2xl shadow-sm p-5 flex items-start gap-4 ${!c.active ? "opacity-60" : ""}`}>
          <span className="text-3xl shrink-0">{c.imageEmoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-[#0F2035] text-sm">{c.title}</span>
              {!c.active && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Hidden</span>}
            </div>
            <div className="text-xs text-gray-400">{c.partnerName} {c.code && <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded ml-1">{c.code}</span>}</div>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{c.description}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => openEdit(c)} className="p-2 text-gray-400 hover:text-[#1B4F72] hover:bg-gray-100 rounded-lg transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => remove(c.id)} disabled={deleting === c.id} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              {deleting === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
