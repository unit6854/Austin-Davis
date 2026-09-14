import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import { glideTo } from '../lib/momentum.js';
import { NAV_LINKS, SOCIAL_LINKS, FOOTER } from '../content/site.js';
import './Footer.css';

const ICONS = {
  instagram: (
    <>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.2" cy="6.8" r="1.05" fill="currentColor" stroke="none" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.2 9.4 15 12l-4.8 2.6V9.4Z" />
    </>
  ),
  email: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
};

/**
 * The foot of every page. Whatever stands above it tears away along a
 * ragged line — the same rip the road has at its foot on a phone — and
 * under the paper is the dark the site is written on, where the name is
 * signed, the way a letter is signed off.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* the wall, masked so it begins on the rip's line — see Footer.css */}
      <div className="footer__ink" aria-hidden="true">
        <span className="footer__cloud" />
        <span className="footer__lamp" />
        <span className="footer__tooth" />
      </div>
      {/* the torn paper between what stands above and the dark below */}
      <div className="footer__rip" aria-hidden="true" />

      {/* One reveal for the whole sign-off, not one per piece: the reveal
          observer ignores the bottom twelfth of the window, and at the foot
          of a page there is nowhere further to scroll, so anything standing
          there on its own would never arrive. */}
      <Reveal className="shell footer__inner">
        <div className="footer__sign">
          <Link to="/" className="footer__name">
            {FOOTER.name}
          </Link>
          <p className="footer__tagline">{FOOTER.tagline}</p>
        </div>

        <nav className="footer__links" aria-label="Footer">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="footer__link">
              {link.label}
            </Link>
          ))}
        </nav>

        {SOCIAL_LINKS.length > 0 ? (
          <ul className="footer__social">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.href}
                  className="footer__social-link"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {ICONS[social.platform] ?? ICONS.email}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </Reveal>

      <div className="shell footer__foot">
        <div className="footer__rule" />
        <div className="footer__line">
          <p className="footer__copyright">
            © {year} <span className="footer__copyright-name">{FOOTER.name}</span>
          </p>
          <button type="button" className="footer__top" onClick={() => glideTo(0)}>
            <span>Back to the top</span>
            <svg width="8" height="24" viewBox="0 0 8 24" fill="none" aria-hidden="true">
              <path d="M4 24V3M1 6.5 4 3l3 3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
