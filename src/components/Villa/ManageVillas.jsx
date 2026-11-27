import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Link } from "../NextLink";
import { api } from "../../context/api";
import { useAuth } from "../../context/AuthContext";
import HostDesk from "./HostDesk";

const emptyForm = {
  name: "",
  location: "Greece",
  category: "Mountains",
  guests: "4",
  bedrooms: "2",
  bathrooms: "2",
  squareMeter: "120",
  rating: "4.5",
  dailyRent: "180",
  image: "",
  description: "",
  status: "published",
};

const inputClass =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-300 dark:border-white/15 dark:bg-surface-950 dark:text-slate-100";

function Field({ id, label, children, className = "" }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">
        {label}
      </label>
      {children}
    </div>
  );
}

const ManageVillas = () => {
  const router = useRouter();
  const { user, ready, becomeHost } = useAuth();
  const [villas, setVillas] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (ready && !user) router.replace("/login?next=%2Fmanage");
  }, [ready, user, router]);

  const load = async (nextQuery = query, nextSort = sort) => {
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextSort) params.set("sort", nextSort);
    const suffix = params.toString() ? `?${params}` : "";
    setVillas(await api(`/api/villas${suffix}`));
  };

  useEffect(() => {
    if (!user || user.role !== "host") return undefined;
    let ignore = false;
    setLoading(true);
    const timer = window.setTimeout(() => {
      load(query, sort)
        .catch((requestError) => {
          if (!ignore) setError(requestError.message);
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });
    }, 200);
    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
  }, [user, query, sort]);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const payload = {
      ...form,
      guests: Number(form.guests),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      rating: Number(form.rating),
    };
    try {
      if (editingId) {
        await api(`/villas/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
        setNotice("Villa updated.");
      } else {
        await api("/villas", { method: "POST", body: JSON.stringify(payload) });
        setNotice("Villa added.");
      }
      resetForm();
      await load();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const editVilla = (villa) => {
    setEditingId(villa.id);
    setForm({
      name: villa.name,
      location: villa.location,
      category: villa.category,
      guests: String(villa.guests),
      bedrooms: String(villa.bedrooms),
      bathrooms: String(villa.bathrooms),
      squareMeter: String(villa.squareMeter),
      rating: String(villa.rating),
      dailyRent: String(villa.dailyRent),
      image: villa.image,
      description: villa.description || "",
      status: villa.status || "published",
    });
    setNotice("");
    setError("");
  };

  const removeVilla = async (villa) => {
    if (!window.confirm(`Remove ${villa.name}?`)) return;
    setError("");
    try {
      await api(`/villas/${villa.id}`, { method: "DELETE" });
      if (editingId === villa.id) resetForm();
      setNotice(`${villa.name} was removed.`);
      await load();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (!ready || !user) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">Checking your session…</p>;
  }

  if (user.role !== "host") {
    return (
      <section className="mx-auto max-w-xl rounded-card border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-surface-900">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">Host tools</p>
        <h1 className="mt-2 font-display text-[2.6rem] leading-none">Villa management</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          Hosts can add listings, hide them as drafts, and update the details guests see.
        </p>
        <button type="button" onClick={() => becomeHost().catch((requestError) => setError(requestError.message))} className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
          Become a host
        </button>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <form className="space-y-4 rounded-card border border-slate-200 bg-white p-5 shadow-soft dark:border-white/15 dark:bg-surface-900" onSubmit={onSubmit}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a5d19] dark:text-[#f0c76e]">Host tools</p>
          <h1 className="mt-1 font-display text-[2.4rem] leading-none text-slate-900 dark:text-white">{editingId ? "Edit villa" : "Add a villa"}</h1>
        </div>
        <Field id="mv-name" label="Villa name">
          <input id="mv-name" className={inputClass} required placeholder="Villa Lumina" value={form.name} onChange={update("name")} />
        </Field>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field id="mv-location" label="Location">
            <input id="mv-location" className={inputClass} required placeholder="Greece" list="villa-locations" value={form.location} onChange={update("location")} />
          </Field>
          <Field id="mv-category" label="Category">
            <input id="mv-category" className={inputClass} required placeholder="Mountains" list="villa-categories" value={form.category} onChange={update("category")} />
          </Field>
        </div>
        <datalist id="villa-locations">
          <option value="Greece" />
          <option value="Italy" />
        </datalist>
        <datalist id="villa-categories">
          <option value="Mountains" />
          <option value="Seaside" />
        </datalist>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field id="mv-guests" label="Guests">
            <input id="mv-guests" className={inputClass} required type="number" min="1" value={form.guests} onChange={update("guests")} />
          </Field>
          <Field id="mv-bedrooms" label="Bedrooms">
            <input id="mv-bedrooms" className={inputClass} required type="number" min="1" value={form.bedrooms} onChange={update("bedrooms")} />
          </Field>
          <Field id="mv-bathrooms" label="Bathrooms">
            <input id="mv-bathrooms" className={inputClass} required type="number" min="1" value={form.bathrooms} onChange={update("bathrooms")} />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field id="mv-area" label="Area (sq m)">
            <input id="mv-area" className={inputClass} required value={form.squareMeter} onChange={update("squareMeter")} />
          </Field>
          <Field id="mv-rating" label="Rating">
            <input id="mv-rating" className={inputClass} required value={form.rating} onChange={update("rating")} />
          </Field>
          <Field id="mv-rent" label="Daily rent (Rs.)">
            <input id="mv-rent" className={inputClass} required value={form.dailyRent} onChange={update("dailyRent")} />
          </Field>
        </div>
        <Field id="mv-image" label="Image URL">
          <input id="mv-image" className={inputClass} required placeholder="/villa1.jpg or uploaded path" value={form.image} onChange={update("image")} />
        </Field>
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-surface-50 p-3 dark:border-white/20 dark:bg-surface-950/70">
          {form.image ? (
            <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-white/15">
              <Image src={form.image} alt={form.name || "Villa preview"} fill sizes="128px" unoptimized={!form.image.startsWith("/") || form.image.startsWith("/uploads/")} className="object-cover" />
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-2.5">
            <label
              htmlFor="mv-upload"
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-white/20 dark:bg-surface-900 dark:text-slate-100 dark:hover:bg-white/10"
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              Upload photo
            </label>
            <input
              id="mv-upload"
              className="sr-only"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label="Upload villa image"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const body = new FormData();
                body.append("image", file);
                setError("");
                try {
                  const result = await api("/api/uploads", { method: "POST", body });
                  setForm((current) => ({ ...current, image: result.url }));
                  setNotice("Image uploaded.");
                } catch (requestError) {
                  setError(requestError.message);
                }
              }}
            />
            <span className="text-xs text-slate-500 dark:text-slate-400">JPG, PNG, or WebP up to 5 MB</span>
          </div>
        </div>
        <Field id="mv-description" label="Description">
          <textarea id="mv-description" className={`${inputClass} h-24 py-2.5`} placeholder="Describe views, pool access, and nearby beaches" value={form.description} onChange={update("description")} />
        </Field>
        <Field id="mv-status" label="Listing status">
          <select id="mv-status" className={inputClass} value={form.status} onChange={update("status")}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </Field>
        {error ? <p className="text-sm text-red-600 dark:text-red-300">{error}</p> : null}
        {notice ? <p className="text-sm text-emerald-700 dark:text-emerald-300">{notice}</p> : null}
        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={saving} className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white disabled:opacity-70 dark:bg-slate-100 dark:text-slate-900">
            {saving ? "Saving…" : editingId ? "Save changes" : "Add villa"}
          </button>
          {editingId ? (
            <button type="button" onClick={resetForm} className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 px-5 text-sm font-semibold text-slate-800 dark:border-white/20 dark:text-slate-100">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="rounded-card border border-slate-200 bg-white p-5 shadow-soft dark:border-white/15 dark:bg-surface-900">
        <div className="flex flex-wrap items-center gap-2">
          <input className={`${inputClass} min-w-0 flex-1`} aria-label="Search listings" placeholder="Search listings" value={query} onChange={(event) => setQuery(event.target.value)} />
          <select className={`${inputClass} w-auto`} aria-label="Sort listings" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="">Catalog order</option>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
            <option value="price">Price</option>
            <option value="newest">Newest</option>
          </select>
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{loading ? "Loading listings…" : `${villas.length} listings, including drafts`}</p>
        <ul className="mt-4 space-y-3">
          {villas.map((villa) => {
            const thumbSrc = villa.image || "/villa1.jpg";
            const useUnoptimized = !thumbSrc.startsWith("/") || thumbSrc.startsWith("/uploads/");
            return (
              <li key={villa.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 dark:border-white/15">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-surface-950">
                    <Image src={thumbSrc} alt={villa.name} fill sizes="80px" unoptimized={useUnoptimized} className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900 dark:text-white">{villa.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-300">{villa.location} · {villa.category} · {villa.status}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/villa/${villa.id}`} className="inline-flex h-9 items-center px-3 text-sm font-semibold text-slate-700 dark:text-slate-200">View</Link>
                  <button type="button" onClick={() => editVilla(villa)} className="inline-flex h-9 items-center rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-800 dark:border-white/20 dark:text-slate-100">Edit</button>
                  <button type="button" onClick={() => removeVilla(villa)} className="inline-flex h-9 items-center px-3 text-sm font-semibold text-red-700 dark:text-red-300">Remove</button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="lg:col-span-2">
        <HostDesk villas={villas} />
      </div>
    </section>
  );
};

export default ManageVillas;
