import './Ground.css';

/**
 * The wall the homepage stands on between the road at the top and the field
 * gate at the foot of it. Drawn, not downloaded — see Ground.css for what
 * each layer is doing.
 */
export default function Ground({ children }) {
  return (
    <div className="ground">
      <div className="ground__wall" aria-hidden="true">
        <span className="ground__cloud" />
        <span className="ground__cloud ground__cloud--slow" />
        <span className="ground__tooth" />
      </div>

      <div className="ground__lift" aria-hidden="true" />
      <div className="ground__vignette" aria-hidden="true" />

      {children}
    </div>
  );
}
