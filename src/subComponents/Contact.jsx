import React, { useState } from "react";
import Image from "next/image";

const inputClass =
  "contact-form-control mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-500 shadow-[0_5px_14px_rgba(10,24,42,.12)] outline-none transition focus:border-sky-600/50 focus:shadow-[0_7px_18px_rgba(10,24,42,.2)] dark:border-white/15 dark:bg-[#0f1b30] dark:text-slate-100 dark:placeholder:text-slate-400 dark:shadow-[0_5px_14px_rgba(0,0,0,.3)] dark:focus:border-[#f4c66b]/60 dark:focus:shadow-[0_7px_18px_rgba(0,0,0,.42)]";

const SubContact = ({ hideHeading = false }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [sending, setSending] = useState(false);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus("");
    setIsError(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body.message || "Unable to send message.");
      }
      setForm({ name: "", email: "", message: "" });
      setStatus("Message sent. Our villa desk will reply via email.");
    } catch (error) {
      setIsError(true);
      setStatus(error.message || "Unable to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section aria-labelledby={hideHeading ? undefined : "contact-mini-heading"} className="py-4 md:py-6">
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-stretch gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <figure className="group/contact relative aspect-[4/3] w-full min-w-0 overflow-hidden rounded-[2rem] border border-slate-900/10 bg-slate-950 shadow-[0_24px_60px_rgba(0,10,25,.24)] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[430px] dark:border-white/15">
          <Image
            src="/contact.jpg"
            alt="Sunlit coastal villa pool and lounge terrace overlooking the Mediterranean sea"
            fill
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-cover object-center transition duration-700 ease-out group-hover/contact:scale-[1.025]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/88 via-slate-950/30 to-transparent" aria-hidden="true" />
          <figcaption className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ffe3a0]">Villa concierge</p>
            <p className="mt-1 font-display text-xl leading-tight text-white sm:mt-1.5 sm:text-2xl">Tailored dates, honest availability</p>
            <p className="mt-1.5 max-w-md text-xs leading-5 text-slate-200 sm:mt-2 sm:text-sm sm:leading-6">
              Send your preferred dates or property questions and we will reply directly to your email address.
            </p>
          </figcaption>
        </figure>

        <div className="flex min-w-0 flex-col justify-center rounded-[2rem] border border-slate-200/85 bg-white/95 p-5 shadow-soft dark:border-white/15 dark:bg-surface-900/95 sm:p-8">
          {!hideHeading ? (
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a5d19] dark:text-[#f0c76e]">Get in touch</p>
              <h2 id="contact-mini-heading" className="mt-1.5 font-display text-[2rem] leading-tight text-[#102b43] dark:text-white md:text-[2.35rem]">
                Send us a message
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Ask about a villa, your travel dates, or a property listing.
              </p>
            </div>
          ) : (
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a5d19] dark:text-[#f0c76e]">Direct inquiry</p>
              <h2 className="mt-1 font-display text-2xl leading-tight text-[#102b43] dark:text-white">
                Send us a message
              </h2>
            </div>
          )}

          <form className="space-y-4" onSubmit={onSubmit} aria-label="Contact RoyalCity">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">
                  Your name
                </label>
                <input
                  id="contact-name"
                  className={inputClass}
                  type="text"
                  name="name"
                  placeholder="Alex Morgan"
                  value={form.name}
                  onChange={updateField("name")}
                  required
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">
                  Email address
                </label>
                <input
                  id="contact-email"
                  className={inputClass}
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={updateField("email")}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">
                Message
              </label>
              <textarea
                id="contact-message"
                className={`${inputClass} min-h-[132px] py-3`}
                rows={5}
                name="message"
                placeholder="Share the villa name, preferred dates, or hosting question..."
                value={form.message}
                onChange={updateField("message")}
                required
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#edbd62] px-6 text-sm font-bold text-[#13263a] shadow-[0_5px_14px_rgba(0,0,0,.16)] transition hover:-translate-y-0.5 hover:bg-[#f3ca79] disabled:cursor-wait disabled:opacity-70"
              >
                {sending ? "Sending..." : "Send message"}
              </button>
              {status ? (
                <p role="status" className={`text-sm ${isError ? "text-red-600 dark:text-red-300" : "text-emerald-700 dark:text-emerald-300"}`}>
                  {status}
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SubContact;

