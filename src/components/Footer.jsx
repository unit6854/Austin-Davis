import { Link } from 'react-router-dom';
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

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <span className="footer__tear" aria-hidden="true" />

      <div className="shell footer__inner">
        <p className="footer__copyright">
          © {year} <span className="footer__name">{FOOTER.name}</span>
          <span className="footer__tagline"> · {FOOTER.tagline}</span>
        </p>

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
        ) : (
          <span className="footer__spacer" aria-hidden="true" />
        )}
      </div>
    </footer>
  );
}
