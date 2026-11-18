import { useState } from 'react';
import Reveal from './Reveal.jsx';
import PageBackground from './PageBackground.jsx';
import { NEWSLETTER } from '../content/site.js';
import './Newsletter.css';

const FORM_NAME = 'newsletter';

/**
 * Substack's own free-subscribe endpoint, on Austin's publication.
 *
 * It sends no CORS headers, so the request goes out `no-cors`: the browser
 * will deliver it and hand back an opaque response that cannot be read. We
 * therefore cannot tell a subscription from a rejection — which is why the
 * address is also posted to Netlify Forms below. Substack is where the list
 * lives; Netlify is the copy that can actually be confirmed, so nobody who
 * signs up is lost if Substack ever turns the endpoint off.
 */
const SUBSTACK = 'https://austinrdavis.substack.com/api/v1/free';

function encode(data) {
  return Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}

/**
 * @param {object} props
 * @param {string} [props.scene]  a PageBackground scene to stand the band on.
 *   Only the homepage passes one — an interior page already has a photograph
 *   of its own and does not want a second one at the foot of it.
 * @param {boolean} [props.ground]  the band lies on a drawn wall
 *   (components/Ground) — About renders it inside its own — so it paints no
 *   ground of its own and the wall shows through.
 */
export default function Newsletter({ scene, ground = false }) {
  const [email, setEmail] = useState('');
  const [botField, setBotField] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'sending' || !email) return;

    /* the honeypot: a bot filled a field no person can see */
    if (botField) {
      setStatus('done');
      setEmail('');
      return;
    }

    setStatus('sending');

    /* Substack first — the list itself. Opaque by nature, so the only thing
       that can fail here is the network. */
    const toSubstack = fetch(SUBSTACK, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email, source: 'cover_page' }),
    });

    /* and the same address to Netlify Forms, so there is a record of it that
       can be read back. Best effort: in development there is no Netlify to
       answer, and a signup must not look broken because of that. */
    const toNetlify = fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': FORM_NAME, email, 'bot-field': botField }),
    }).catch(() => null);

    try {
      await toSubstack;
      await toNetlify;
      setStatus('done');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section
      id="newsletter"
      className={`newsletter${scene ? ' newsletter--scene' : ''}${ground ? ' newsletter--ground' : ''}`}
    >
      {scene ? <PageBackground scene={scene} inline /> : null}

      <div className="shell newsletter__inner">
        <Reveal className="newsletter__plate">
          <h2 className="newsletter__title">
            <span>{NEWSLETTER.title}</span>
          </h2>

          <p className="newsletter__supporting">{NEWSLETTER.supporting}</p>

          <form
            className="newsletter__form"
            name={FORM_NAME}
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="form-name" value={FORM_NAME} />

            <p className="visually-hidden" aria-hidden="true">
              <label>
                Leave this field empty
                <input
                  name="bot-field"
                  tabIndex={-1}
                  autoComplete="off"
                  value={botField}
                  onChange={(e) => setBotField(e.target.value)}
                />
              </label>
            </p>

            <label className="visually-hidden" htmlFor="newsletter-email">
              Your email address
            </label>
            <input
              id="newsletter-email"
              className="newsletter__input"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder={NEWSLETTER.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              type="submit"
              className="newsletter__button"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Sending' : NEWSLETTER.button}
            </button>
          </form>

          <p
            className={`newsletter__message${status === 'done' || status === 'error' ? ' is-shown' : ''}`}
            role="status"
            aria-live="polite"
          >
            {status === 'done' ? NEWSLETTER.success : null}
            {status === 'error' ? NEWSLETTER.error : null}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
