import { useState } from 'react';
import Reveal from './Reveal.jsx';
import PageBackground from './PageBackground.jsx';
import { NEWSLETTER } from '../content/site.js';
import './Newsletter.css';

const FORM_NAME = 'newsletter';

/**
 * Where a reader finishes subscribing.
 *
 * NOT `/api/v1/free`. That endpoint was tried first and it answers **403 to
 * any scripted request**, form-encoded or JSON, with or without an Origin —
 * Substack blocks it outright. Worse, the request had to go out `no-cors` to
 * reach it at all, and an opaque response cannot be read: the site said
 * "check your inbox" every time while Substack threw the address away. That
 * is exactly what happened to Austin's own test signup. Do not go back to it.
 *
 * Substack's hosted subscribe page accepts the address as `?email=` and
 * prefills its field, so the reader arrives with one button left to press and
 * the confirmation mail comes from Substack itself, which is the only way it
 * can come. The list stays on Substack; the form here keeps its own face.
 */
const SUBSTACK_SUBSCRIBE = 'https://austinrdavis.substack.com/subscribe';

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

    /* The address goes to Netlify Forms too, so Austin has it even if the
       reader never finishes on Substack — somebody who types their address
       in has asked to hear from him, and that should not be lost in a tab
       they closed. Best effort: there is no Netlify to answer in
       development, and a signup must not look broken because of that. */
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': FORM_NAME, email, 'bot-field': botField }),
    }).catch(() => null);

    /* Opened from inside the click, so it counts as a user gesture and is not
       taken for a popup. If the browser blocks it anyway, `open` returns null
       and the message below gives the reader the link to follow by hand. */
    const opened = window.open(
      `${SUBSTACK_SUBSCRIBE}?email=${encodeURIComponent(email)}`,
      '_blank',
      'noopener,noreferrer',
    );

    setStatus(opened ? 'done' : 'blocked');
    if (opened) setEmail('');
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
            className={`newsletter__message${status !== 'idle' && status !== 'sending' ? ' is-shown' : ''}`}
            role="status"
            aria-live="polite"
          >
            {status === 'done' ? NEWSLETTER.success : null}
            {status === 'error' ? NEWSLETTER.error : null}
            {/* the browser refused the new tab — hand over the link itself */}
            {status === 'blocked' ? (
              <>
                {NEWSLETTER.blocked}{' '}
                <a
                  className="newsletter__link"
                  href={`${SUBSTACK_SUBSCRIBE}?email=${encodeURIComponent(email)}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {NEWSLETTER.blockedLink}
                </a>
              </>
            ) : null}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
