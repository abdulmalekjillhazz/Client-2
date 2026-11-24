import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "../NextLink";
import { Crown, Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const inputClass = "h-11 w-full rounded-[9px] border border-[#e5e7eb] bg-white pl-10 pr-11 text-sm text-[#1f2937] placeholder:text-[#a2aaba] shadow-[0_7px_15px_rgba(20,31,48,.16)] outline-none transition focus:border-[#91a9c2] focus:ring-2 focus:ring-[#dbe7f2]";

const rules = [
  { id: "length", label: "At least 8 characters", test: (value) => value.length >= 8 },
  { id: "letter", label: "Includes a letter", test: (value) => /[A-Za-z]/.test(value) },
  { id: "number", label: "Includes a number", test: (value) => /[0-9]/.test(value) },
];

function safeNext(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/profile";
  if (value.startsWith("/login") || value.startsWith("/register")) return "/profile";
  return value;
}

export default function Register() {
  const router = useRouter();
  const params = useSearchParams();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const checks = useMemo(() => rules.map((rule) => ({ ...rule, ok: rule.test(form.password) })), [form.password]);
  const passwordReady = checks.every((rule) => rule.ok);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!passwordReady) {
      setError("Choose a password that meets every requirement.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await register({ ...form, phone: form.phone.trim() });
      router.replace(safeNext(params.get("next")));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const fieldLabel = "mb-1.5 block text-[11px] font-bold uppercase tracking-[.055em] text-[#202938]";

  return (
    <section className="register-page flex min-h-[calc(100vh-9rem)] items-center justify-center px-4 py-8" aria-labelledby="register-heading">
      <div className="register-card w-full max-w-[440px] rounded-[18px] bg-white px-6 py-7 text-[#202938] shadow-[0_22px_55px_rgba(10,21,36,.23)] sm:px-9 sm:py-8">
        <header className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#edf0f4] bg-white shadow-[0_4px_12px_rgba(22,34,52,.1)]">
            <Crown className="h-6 w-6 text-[#d99d37]" aria-hidden="true" />
          </div>
          <h1 id="register-heading" className="font-display text-[2rem] font-bold leading-tight tracking-[-.035em] text-black">Create account</h1>
          <p className="mt-1 text-sm text-[#596579]">Join RoyalCity today.</p>
        </header>

        <form className="space-y-3.5" onSubmit={onSubmit}>
          <div>
            <label htmlFor="name" className={fieldLabel}>Full name <span className="text-red-600">*</span></label>
            <div className="relative"><UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#526075]" aria-hidden="true" /><input id="name" className={inputClass} required minLength={2} maxLength={80} autoComplete="name" placeholder="Your full name" value={form.name} onChange={update("name")} /></div>
          </div>
          <div>
            <label htmlFor="register-email" className={fieldLabel}>Email address <span className="text-red-600">*</span></label>
            <div className="relative"><Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#526075]" aria-hidden="true" /><input id="register-email" className={inputClass} type="email" required autoComplete="email" placeholder="you@example.com" value={form.email} onChange={update("email")} /></div>
          </div>
          <div>
            <label htmlFor="register-phone" className={fieldLabel}>Mobile number <span className="font-medium normal-case tracking-normal text-[#667085]">(optional)</span></label>
            <div className="relative"><Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#526075]" aria-hidden="true" /><input id="register-phone" className={inputClass} type="tel" autoComplete="tel" maxLength={30} placeholder="01XXXXXXXXX" value={form.phone} onChange={update("phone")} /></div>
            <p className="mt-1.5 text-xs text-[#596579]">For booking confirmations and stay updates.</p>
          </div>
          <div>
            <label htmlFor="register-password" className={fieldLabel}>Password <span className="text-red-600">*</span></label>
            <div className="relative"><LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#526075]" aria-hidden="true" /><input id="register-password" className={inputClass} type={showPassword ? "text" : "password"} required autoComplete="new-password" placeholder="Minimum 8 characters" value={form.password} onChange={update("password")} /><button type="button" className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-[#526075]" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((current) => !current)}>{showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}</button></div>
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1" aria-live="polite">
              {checks.map((rule) => <li key={rule.id} className={`text-[11px] ${rule.ok ? "text-emerald-700" : "text-[#717d8d]"}`}>{rule.ok ? "✓" : "·"} {rule.label}</li>)}
            </ul>
          </div>
          {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}
          <button type="submit" disabled={submitting || !passwordReady} className="mt-1 inline-flex h-11 w-full items-center justify-center rounded-[9px] bg-[#0b2d4b] text-sm font-semibold text-white shadow-[0_8px_18px_rgba(11,45,75,.2)] transition hover:bg-[#123e64] disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <a href="/api/auth/google" className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-[9px] border border-[#d9dee6] bg-white text-sm font-semibold text-[#283548] shadow-[0_4px_12px_rgba(20,31,48,.08)] transition hover:bg-[#f8fafc]">Continue with Google</a>
        <p className="mt-5 text-center text-sm text-[#596579]">Already registered? <Link className="font-semibold text-[#0b2d4b] underline underline-offset-2" to={`/login?next=${encodeURIComponent(safeNext(params.get("next")))}`}>Sign in</Link></p>
      </div>
    </section>
  );
}
