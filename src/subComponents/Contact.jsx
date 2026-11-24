import React, { useState } from "react";

const inputClass =
  "contact-form-control h-11 w-full rounded-xl bg-white/95 px-4 text-sm text-slate-800 placeholder:text-slate-500 shadow-[0_5px_14px_rgba(10,24,42,.16)] outline-none transition-shadow focus:shadow-[0_7px_18px_rgba(10,24,42,.24)] dark:bg-[#101b30] dark:text-slate-100 dark:placeholder:text-slate-400 dark:shadow-[0_5px_14px_rgba(0,0,0,.3)] dark:focus:shadow-[0_7px_18px_rgba(0,0,0,.42)]";

const SubContact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus("");

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
      setStatus("Message sent.");
    } catch (error) {
      setStatus(error.message || "Unable to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section aria-labelledby="contact-mini-heading" className="py-5 text-shadow-soft md:py-8">
      <div className="mx-auto max-w-3xl">
        <h2 id="contact-mini-heading" className="font-display text-[2rem] leading-tight md:text-[2.4rem]">Send us a message</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-700 dark:text-slate-300">Ask about a villa, your travel dates, or a property listing. Our team will follow up using your email.</p>
        <form className="mt-5 space-y-4" onSubmit={onSubmit} aria-label="Contact RoyalCity">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input className={inputClass} type="text" name="name" placeholder="Your Name" value={form.name} onChange={updateField("name")} required />
            <input className={inputClass} type="email" name="email" placeholder="Email" value={form.email} onChange={updateField("email")} required />
          </div>
          <textarea className={inputClass} rows={5} name="message" placeholder="How can we help?" value={form.message} onChange={updateField("message")} required />
          <button
            type="submit"
            disabled={sending}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#edbd62] px-6 text-sm font-bold text-[#13263a] shadow-[0_5px_14px_rgba(0,0,0,.16)] transition hover:-translate-y-0.5 hover:bg-[#f3ca79] disabled:cursor-wait disabled:opacity-70"
          >
            {sending ? "Sending..." : "Send"}
          </button>
          {status ? <p className="text-sm text-slate-600 dark:text-slate-300">{status}</p> : null}
        </form>
      </div>
    </section>
  );
};

export default SubContact;

