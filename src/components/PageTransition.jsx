import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

const DURATION = 420;

/**
 * Turns the page rather than cutting to it: the outgoing view settles down and
 * fades, the incoming one rises. Nothing flashes.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const [shown, setShown] = useState(location);
  const [stage, setStage] = useState('in');
  const timer = useRef();

  useEffect(() => {
    if (location.pathname === shown.pathname) return;

    setStage('out');
    window.clearTimeout(timer.current);

    timer.current = window.setTimeout(() => {
      setShown(location);
      setStage('in');
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, DURATION);

    return () => window.clearTimeout(timer.current);
  }, [location, shown.pathname]);

  return (
    <div className={`page-transition page-transition--${stage}`}>
      {typeof children === 'function' ? children(shown) : children}
    </div>
  );
}
