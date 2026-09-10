import './Ground.css';

/**
 * The wall the homepage stands on between the road at the top and the field
 * gate at the foot of it. Drawn, not downloaded — see Ground.css for what
 * each layer is doing, and why none of them blend.
 */
export default function Ground({ children }) {
  return (
    <div className="ground">
      <div className="ground__wall" aria-hidden="true">
        <span className="ground__cloud" />
        <span className="ground__cloud ground__cloud--slow" />
        <span className="ground__tooth" />
      </div>

      {/* sticky, so the light stays with the reader without the page being
          repainted underneath it on every frame */}
      <div className="ground__light" aria-hidden="true">
        <span className="ground__lift" />
        <span className="ground__vignette" />
      </div>

      {children}
    </div>
  );
}
