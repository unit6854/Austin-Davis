import { formatDate } from '../content/site.js';
import './Dateline.css';

/**
 * The dateline for a piece of writing: the day set large in the display serif,
 * the month and year beside it in small caps, and a hairline that draws itself
 * across the rest of the measure.
 */
export default function Dateline({ iso, className = '' }) {
  if (!iso) return null;

  const { day, month, year } = formatDate(iso);

  return (
    <div className={`dateline ${className}`.trim()}>
      <time
        className="dateline__time"
        dateTime={iso}
        aria-label={`${month} ${day}, ${year}`}
      >
        <span className="dateline__day">{day}</span>
        <span className="dateline__stack">
          <span className="dateline__month">{month}</span>
          <span className="dateline__year">{year}</span>
        </span>
      </time>
      <span className="dateline__rule" />
    </div>
  );
}
