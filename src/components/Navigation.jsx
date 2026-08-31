import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../content/site.js';
import './Navigation.css';

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const sentinelRef = useRef(null);
  const { pathname } = useLocation();

  /* a 1px sentinel at the top tells us when we have left the top of the page */
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* close the menu whenever the route changes */
  useEffect(() => setOpen(false), [pathname]);

  /* lock the page behind the open menu, and let Escape close it */
  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <div ref={sentinelRef} className="nav__sentinel" aria-hidden="true" />

      <header
        className={[
          'nav',
          stuck ? 'nav--stuck' : '',
          open ? 'nav--open' : '',
        ].join(' ')}
      >
        <div className="nav__inner">
          <Link to="/" className="nav__wordmark" aria-label="Austin Davis — home">
            Austin Davis
          </Link>

          <nav className="nav__links" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="nav__link">
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <a href="#newsletter" className="nav__cta">
            Join the Journey
          </a>

          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nav__toggle-line" />
            <span className="nav__toggle-line" />
            <span className="nav__toggle-line" />
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`menu${open ? ' menu--open' : ''}`}
        hidden={!open}
      >
        <nav className="menu__links" aria-label="Primary, mobile">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              className="menu__link"
              style={{ transitionDelay: `${120 + i * 65}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href="#newsletter"
          className="menu__cta"
          style={{ transitionDelay: `${120 + NAV_LINKS.length * 65}ms` }}
          onClick={() => setOpen(false)}
        >
          Join the Journey
        </a>
      </div>
    </>
  );
}
