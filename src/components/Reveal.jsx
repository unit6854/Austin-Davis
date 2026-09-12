import { cloneElement, useEffect, useRef } from 'react';
import { observeReveal } from '../lib/reveal.js';

/**
 * Fades its child upward as it enters the viewport.
 * `as` lets a caller keep the correct semantic element; `delay` staggers a group.
 */
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  className = '',
  children,
  asChild = false,
  style: own,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => observeReveal(ref.current), []);

  /* a caller's own inline style rides along with the stagger */
  const style = delay || own ? { ...own, ...(delay ? { transitionDelay: `${delay}ms` } : null) } : undefined;

  if (asChild) {
    return cloneElement(children, { ref, 'data-reveal': '', style });
  }

  return (
    <Tag ref={ref} data-reveal="" className={className} style={style} {...rest}>
      {children}
    </Tag>
  );
}
