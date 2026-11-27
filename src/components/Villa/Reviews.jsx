import React, { useEffect, useState } from "react";
import { api } from "../../context/api";

const Reviews = ({ villaId, user }) => {
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ bookingId: "", rating: "5", comment: "" });
  const [error, setError] = useState("");

  const load = () => api(`/villas/${villaId}/reviews`).then(setReviews).catch(() => setReviews([]));

  useEffect(() => {
    load();
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    api("/api/bookings")
      .then((items) =>
        setBookings(
          items.filter(
            (item) =>
              item.own &&
              String(item.villaId) === String(villaId) &&
              item.status === "confirmed" &&
              item.endDate <= today
          )
        )
      )
      .catch(() => setBookings([]));
  }, [villaId, user]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api("/api/reviews", {
        method: "POST",
        body: JSON.stringify({ ...form, rating: Number(form.rating) }),
      });
      setForm({ bookingId: "", rating: "5", comment: "" });
      await load();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-soft dark:border-white/15 dark:bg-surface-900/95">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Guest reviews</h2>
      {reviews.length === 0 ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">No reviews yet.</p> : null}
      <ul className="mt-4 space-y-3">
        {reviews.map((review) => (
          <li key={review.id} className="rounded-2xl bg-surface-50 p-3 dark:bg-white/5">
            <p className="text-sm font-semibold">{review.author} · {review.rating}/5</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
          </li>
        ))}
      </ul>
      {user && bookings.length > 0 ? (
        <form className="mt-4 space-y-3" onSubmit={submit}>
          <div>
            <label htmlFor="review-booking" className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Completed stay</label>
            <select id="review-booking" className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-white/15 dark:bg-surface-950" value={form.bookingId} onChange={(event) => setForm({ ...form, bookingId: event.target.value })} required>
              <option value="">Choose a completed stay</option>
              {bookings.map((booking) => (
                <option key={booking.id} value={booking.id}>{booking.startDate} to {booking.endDate}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="review-rating" className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Rating</label>
            <input id="review-rating" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm dark:border-white/15 dark:bg-surface-950" type="number" min="1" max="5" value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })} />
          </div>
          <div>
            <label htmlFor="review-comment" className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Comment</label>
            <textarea id="review-comment" className="h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-white/15 dark:bg-surface-950" placeholder="How was the stay?" value={form.comment} onChange={(event) => setForm({ ...form, comment: event.target.value })} required />
          </div>
          {error ? <p className="text-sm text-red-600 dark:text-red-300">{error}</p> : null}
          <button type="submit" className="inline-flex h-11 items-center rounded-full bg-slate-900 px-4 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">Publish review</button>
        </form>
      ) : null}
    </section>
  );
};

export default Reviews;
