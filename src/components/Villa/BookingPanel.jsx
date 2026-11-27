import React, { useState } from "react";
import { Link } from "../NextLink";
import { api } from "../../context/api";

const inputClass =
  "mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-surface-950 dark:text-slate-100";

const BookingPanel = ({ villa, user }) => {
  const [form, setForm] = useState({ startDate: "", endDate: "", guests: "2" });
  const [quote, setQuote] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (field) => (event) => {
    setQuote(null);
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const check = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    const params = new URLSearchParams({ ...form });
    try {
      const result = await api(`/villas/${villa.id}/availability?${params}`);
      setQuote(result);
      setMessage(result.available ? `${result.nights} nights · Rs.${result.total}` : result.reason);
    } catch (requestError) {
      setQuote(null);
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const book = async () => {
    setBusy(true);
    setError("");
    try {
      await api("/api/bookings", {
        method: "POST",
        body: JSON.stringify({ villaId: villa.id, ...form, guests: Number(form.guests) }),
      });
      setMessage("Booked. You can see it on your profile.");
      setQuote(null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="booking-panel" className="scroll-mt-24 rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-soft dark:border-white/15 dark:bg-surface-900/95">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Reserve this villa</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Rs.{villa.dailyRent} / night · up to {villa.guests} guests{Number(villa.reviewCount) > 0 ? ` · ${Number(villa.rating).toFixed(1)} from ${villa.reviewCount} reviews` : ""}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="booking-start" className="block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Check-in</label>
          <input id="booking-start" className={inputClass} type="date" value={form.startDate} onChange={update("startDate")} required />
        </div>
        <div>
          <label htmlFor="booking-end" className="block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Check-out</label>
          <input id="booking-end" className={inputClass} type="date" value={form.endDate} onChange={update("endDate")} required />
        </div>
        <div>
          <label htmlFor="booking-guests" className="block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Guests</label>
          <input id="booking-guests" className={inputClass} type="number" min="1" max={villa.guests} value={form.guests} onChange={update("guests")} />
        </div>
      </div>
      {message ? <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-red-600 dark:text-red-300">{error}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={check} disabled={busy} className="inline-flex h-11 items-center rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/10">
          Check dates
        </button>
        {user && quote?.available ? (
          <button type="button" onClick={book} disabled={busy} className="inline-flex h-11 items-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
            Confirm booking
          </button>
        ) : null}
        {!user ? (
          <Link to={`/login?next=${encodeURIComponent(`/villa/${villa.id}`)}`} className="inline-flex h-11 items-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
            Sign in to book
          </Link>
        ) : null}
      </div>
    </section>
  );
};

export default BookingPanel;
