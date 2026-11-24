import React from "react";
import { Link } from "../NextLink";

const Footer = ({ hideContactCta = false }) => {
  return (
    <footer className="relative z-10 px-pagex pb-6 pr-6 text-slate-300 md:px-pagexl xl:pr-[190px]">
      <div className={`mx-auto grid w-full max-w-[1200px] gap-10 px-6 py-10 text-shadow-soft md:px-10 ${hideContactCta ? "grid-cols-1" : "md:grid-cols-[1.5fr_1fr]"}`}>
        <section aria-labelledby="footer-brand">
          <h2 id="footer-brand" className="font-display text-3xl font-semibold tracking-tight text-white">
            Royal<span className="text-brand-400">City</span>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
            Browse available villas and review the listing details before you choose a stay.
          </p>
          <nav className="mt-6" aria-label="Footer links">
            <ul className="flex flex-wrap items-center gap-4 text-sm font-semibold tracking-wide">
              <li>
                <Link className="transition hover:text-white" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-white" to="/termsandconditions">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-white" to="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </section>

        {!hideContactCta ? <section aria-labelledby="footer-contact">
          <h2 id="footer-contact" className="font-display text-3xl font-semibold tracking-tight text-white">
            Connect with us
          </h2>
          <p className="mt-4 max-w-sm text-base leading-7 text-slate-400">Have a question about a stay? Send us a message.</p>
          <Link className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-[#edbd62] px-5 text-sm font-semibold text-slate-900 shadow-[0_8px_22px_rgba(0,0,0,.2)] transition hover:bg-[#f3ca79]" to="/contact">
            Contact us
          </Link>
        </section> : null}
      </div>
    </footer>
  );
};

export default Footer;
