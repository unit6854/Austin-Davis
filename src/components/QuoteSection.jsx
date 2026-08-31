import Reveal from './Reveal.jsx';
import { QUOTE } from '../content/site.js';
import './QuoteSection.css';

export default function QuoteSection() {
  return (
    <section className="quote section grain" aria-label="A note from Austin">
      <div className="shell quote__inner">
        <Reveal className="quote__mark" aria-hidden="true">
          &ldquo;
        </Reveal>

        <Reveal as="blockquote" className="quote__body" delay={120}>
          <p className="quote__text">{QUOTE.text}</p>
          <footer className="quote__attribution">
            <span className="signature">{QUOTE.attribution}</span>
          </footer>
        </Reveal>
      </div>
    </section>
  );
}
