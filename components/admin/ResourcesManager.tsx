"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Check, PlayCircle } from "lucide-react";

type Resource = {
  id: string; title: string; description?: string | null; youtubeUrl: string;
  category: string; active: boolean; sortOrder: number;
};

const EMPTY: Omit<Resource, "id"> = {
  title: "", description: "", youtubeUrl: "", category: "general", active: true, sortOrder: 0,
};

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match?.[1] || null;
}

export function ResourcesManager({ initialResources }: { initialResources: Resource[] }) {
  const [resources, setResources] = useState(initialResources);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [form, setForm] = useState<Omit<Resource, "id">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  function openNew() { setEditing({ id: "new", ...EMPTY }); setForm(EMPTY); }
  function openEdit(r: Resource) { setEditing(r); setForm({ title: r.title, description: r.description || "", youtubeUrl: r.youtubeUrl, category: r.category, active: r.active, sortOrder: r.sortOrder }); }

  async function save() {
    if (!editing) return;
    setSaving(true);
    const payload = { ...form, description: form.description || null };
    if (editing.id === "new") {
      const res = await fetch("/api/admin/resources", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const r = await res.json();
      setResources((prev) => [r, ...prev]);
    } else {
      const res = await fetch(`/api/admin/resources/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const r = await res.json();
      setResources((prev) => prev.map((x) => x.id === r.id ? r : x));
    }
    setSaving(false);
    setEditing(null);
  }

  async function remove(id: string) {
    if (!confirm("Delete this resource?")) return;
    setDeleting(id);
    await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
    setResources((prev) => prev.filter((r) => r.id !== id));
    setDeleting(null);
  }

  const ytId = form.youtubeUrl ? getYouTubeId(form.youtubeUrl) : null;

  return (
    <div className="space-y-4">
      <button onClick={openNew} className="flex items-center gap-2 bg-[#E8836A] hover:bg-[#d4735c] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors">
        <Plus className="w-4 h-4" /> Add Video
      </button>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[#0F2035]">{editing.id === "new" ? "New Resource" : "Edit Resource"}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">YouTube URL</label>
                <input className="form-input mt-1" value={form.youtubeUrl} onChange={(e) => setForm((f) => ({ ...f, youtubeUrl: e.target.value }))} placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              {ytId && (
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  <iframe src={`https://www.youtube-nocookie.com/embed/${ytId}`} className="w-full h-full" allowFullScreen />
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</label>
                <input className="form-input mt-1" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="How to explore Cozumel by buggy" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description (optional)</label>
                <textarea className="form-input mt-1 h-16 resize-none" value={form.description || ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
                  <select className="form-input mt-1" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                    <option value="general">General</option>
                    <option value="buggy tips">Buggy Tips</option>
                    <option value="cozumel">Cozumel</option>
                    <option value="beaches">Beaches</option>
                    <option value="safety">Safety</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort Order</label>
                  <input type="number" className="form-input mt-1" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="res-active" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
                <label htmlFor="res-active" className="text-sm font-medium text-gray-700">Active (visible to customers)</label>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
              <button onClick={save} disabled={saving || !form.title || !form.youtubeUrl} className="flex items-center gap-2 bg-[#1B4F72] hover:bg-[#154060] text-white px-5 py-2 rounded-xl font-semibold text-sm disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
              </button>
            </div>
          </div>
        </div>
      )}

      {resources.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm">
          <PlayCircle className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p>No resources yet</p>
        </div>
      )}

      {resources.map((r) => {
        const id = getYouTubeId(r.youtubeUrl);
        return (
          <div key={r.id} className={`bg-white rounded-2xl shadow-sm overflow-hidden flex gap-4 p-4 ${!r.active ? "opacity-60" : ""}`}>
            {id && (
              <img src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`} alt={r.title} className="w-32 h-20 object-cover rounded-xl shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[#0F2035] text-sm">{r.title}</div>
              <div className="text-xs text-gray-400 mt-0.5 capitalize">{r.category}</div>
              {r.description && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{r.description}</p>}
              {!r.active && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full mt-1 inline-block">Hidden</span>}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(r)} className="p-2 text-gray-400 hover:text-[#1B4F72] hover:bg-gray-100 rounded-lg transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => remove(r.id)} disabled={deleting === r.id} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                {deleting === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
