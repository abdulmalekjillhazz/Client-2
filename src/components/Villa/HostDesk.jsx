import React, { useEffect, useState } from "react";
import { api } from "../../context/api";

const inputClass = "h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-surface-950";

const HostDesk = ({ villas }) => {
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [villaId, setVillaId] = useState(villas[0] ? String(villas[0].id) : "");
  const [block, setBlock] = useState({ startDate: "", endDate: "", reason: "" });
  const [reply, setReply] = useState({});
  const [error, setError] = useState("");

  const loadBlocks = (id) => {
    if (!id) return;
    api(`/api/availability?villaId=${id}`).then(setBlocks).catch((requestError) => setError(requestError.message));
  };

  const load = () => {
    api("/api/bookings").then(setBookings).catch((requestError) => setError(requestError.message));
    api("/api/inquiries").then(setMessages).catch((requestError) => setError(requestError.message));
    loadBlocks(villaId);
  };

  useEffect(() => {
    if (!villaId && villas[0]) setVillaId(String(villas[0].id));
  }, [villas, villaId]);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    loadBlocks(villaId);
  }, [villaId]);

  const addBlock = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api("/api/availability", { method: "POST", body: JSON.stringify({ villaId: Number(villaId), ...block }) });
      setBlock({ startDate: "", endDate: "", reason: "" });
      loadBlocks(villaId);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const removeBlock = async (id) => {
    await api(`/api/availability/${id}`, { method: "DELETE" });
    loadBlocks(villaId);
  };

  const cancelBooking = async (id) => {
    await api(`/api/bookings/${id}/cancel`, { method: "POST" });
    load();
  };

  const sendReply = async (id) => {
    setError("");
    try {
      await api(`/api/inquiries/${id}/reply`, { method: "POST", body: JSON.stringify({ reply: reply[id] || "" }) });
      load();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-white/15 dark:bg-surface-900">
        <h2 className="font-display text-2xl font-semibold">Bookings</h2>
        {bookings.length === 0 ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">No guest bookings yet.</p> : null}
        <ul className="mt-3 space-y-3 text-sm">
          {bookings.map((item) => (
            <li key={item.id} className="rounded-2xl bg-surface-50 p-3 dark:bg-white/5">
              <p className="font-semibold">{item.villaName}</p>
              <p className="text-slate-600 dark:text-slate-300">{item.startDate} to {item.endDate} · {item.guests} {item.guests === 1 ? "guest" : "guests"} · Rs.{item.total}</p>
              <p className="text-slate-500 dark:text-slate-400">{item.guestName} · {item.status}</p>
              {item.status === "confirmed" ? (
                <button type="button" onClick={() => cancelBooking(item.id)} className="mt-2 text-sm font-semibold text-red-700 dark:text-red-300">Cancel</button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-white/15 dark:bg-surface-900">
        <h2 className="font-display text-2xl font-semibold">Blocked dates</h2>
        <form className="mt-3 space-y-3" onSubmit={addBlock}>
          <div>
            <label htmlFor="desk-villa" className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Villa</label>
            <select id="desk-villa" className={`${inputClass} w-full`} value={villaId} onChange={(event) => setVillaId(event.target.value)}>
              {villas.map((villa) => <option key={villa.id} value={villa.id}>{villa.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <label htmlFor="desk-block-start" className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Block start</label>
              <input id="desk-block-start" className={`${inputClass} w-full`} type="date" value={block.startDate} onChange={(event) => setBlock({ ...block, startDate: event.target.value })} required />
            </div>
            <div>
              <label htmlFor="desk-block-end" className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Block end</label>
              <input id="desk-block-end" className={`${inputClass} w-full`} type="date" value={block.endDate} onChange={(event) => setBlock({ ...block, endDate: event.target.value })} required />
            </div>
          </div>
          <div>
            <label htmlFor="desk-block-reason" className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Reason</label>
            <input id="desk-block-reason" className={`${inputClass} w-full`} placeholder="Maintenance, owner stay..." value={block.reason} onChange={(event) => setBlock({ ...block, reason: event.target.value })} />
          </div>
          <button type="submit" className="inline-flex h-10 items-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">Block dates</button>
        </form>
        <ul className="mt-3 space-y-2 text-sm">
          {blocks.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-2">
              <span>{item.startDate} to {item.endDate}</span>
              <button type="button" onClick={() => removeBlock(item.id)} className="font-semibold text-red-700 dark:text-red-300">Remove</button>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-white/15 dark:bg-surface-900">
        <h2 className="font-display text-2xl font-semibold">Inbox</h2>
        {error ? <p className="mt-2 text-sm text-red-600 dark:text-red-300">{error}</p> : null}
        {messages.length === 0 ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">No guest inquiries yet.</p> : null}
        <ul className="mt-3 space-y-3 text-sm">
          {messages.map((item) => (
            <li key={item.id} className="rounded-2xl bg-surface-50 p-3 dark:bg-white/5">
              <p className="font-semibold">{item.name} · {item.email}</p>
              <p className="mt-1">{item.message}</p>
              {item.reply ? <p className="mt-1 text-slate-600 dark:text-slate-300">Reply: {item.reply}</p> : (
                <div className="mt-2 flex gap-2">
                  <input className={`${inputClass} min-w-0 flex-1`} aria-label={`Reply to ${item.name}`} value={reply[item.id] || ""} onChange={(event) => setReply({ ...reply, [item.id]: event.target.value })} placeholder="Reply" />
                  <button type="button" onClick={() => sendReply(item.id)} className="rounded-full bg-slate-900 px-3 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">Send</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default HostDesk;
