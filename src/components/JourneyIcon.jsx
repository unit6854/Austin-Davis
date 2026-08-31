/**
 * Thin line drawings for the three ways into the writing.
 */
export default function JourneyIcon({ name, className = '' }) {
  const common = {
    className,
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.1,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    focusable: 'false',
  };

  if (name === 'book') {
    return (
      <svg {...common}>
        <path d="M24 13.5v27" />
        <path d="M24 13.5C20.5 10.4 15.2 8.8 8 8.8v26.4c7.2 0 12.5 1.6 16 4.7" />
        <path d="M24 13.5c3.5-3.1 8.8-4.7 16-4.7v26.4c-7.2 0-12.5 1.6-16 4.7" />
        <path d="M12.5 15.6c3 .3 5.7 1 8 2.1" />
        <path d="M12.5 21.4c3 .3 5.7 1 8 2.1" />
        <path d="M35.5 15.6c-3 .3-5.7 1-8 2.1" />
        <path d="M35.5 21.4c-3 .3-5.7 1-8 2.1" />
      </svg>
    );
  }

  if (name === 'feather') {
    return (
      <svg {...common}>
        <path d="M9 40 34.5 14" />
        <path d="M34.5 14c4.6-4.7 5.6-9.6 4.6-11.2-1.7-1-8 .6-14.2 6.2C18 15 14.4 23 13.6 30.2c-.4 3.4-.2 6 .2 7.6 1.7.5 4.6.6 8-.2 7-1.6 14.4-6 19.6-12.6" />
        <path d="M25.6 12.4c.6 4.2.2 8.4-1 12.4" />
        <path d="M19.4 20.6c.4 3.6.2 7.2-.6 10.6" />
        <path d="M32.6 20.2c-3.8 1.4-7.6 2-11.4 2" />
        <path d="M28.6 27.6c-3.4 1.4-7 2.2-10.4 2.4" />
      </svg>
    );
  }

  /* journal */
  return (
    <svg {...common}>
      <path d="M14 8h23a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H14" />
      <path d="M14 8c-1.7 0-3 1.3-3 3v26c0 1.7 1.3 3 3 3" />
      <path d="M11 14h-3M11 20h-3M11 26h-3M11 32h-3" />
      <path d="M20 17h13M20 23h13M20 29h9" />
    </svg>
  );
}
