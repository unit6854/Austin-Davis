import { useState } from 'react';
import Reveal from './Reveal.jsx';
import { NEWSLETTER } from '../content/site.js';
import './Newsletter.css';

const FORM_NAME = 'newsletter';

function encode(data) {
  return Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [botField, setBotField] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'sending' || !email) return;

    setStatus('sending');

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': FORM_NAME, email, 'bot-field': botField }),
      });

      if (!response.ok) throw new Error(String(response.status));

      setStatus('done');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="newsletter" className="newsletter">
      <div className="newsletter__tear" aria-hidden="true" />

      <div className="shell newsletter__inner">
        <Reveal as="h2" className="newsletter__title">
          {NEWSLETTER.title}
        </Reveal>

        <Reveal as="p" className="newsletter__supporting" delay={100}>
          {NEWSLETTER.supporting}
        </Reveal>

        <Reveal delay={190} className="newsletter__form-slot">
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
        </Reveal>

        <p
          className={`newsletter__message${status === 'done' || status === 'error' ? ' is-shown' : ''}`}
          role="status"
          aria-live="polite"
        >
          {status === 'done' ? NEWSLETTER.success : null}
          {status === 'error' ? NEWSLETTER.error : null}
        </p>
      </div>
    </section>
  );
}
