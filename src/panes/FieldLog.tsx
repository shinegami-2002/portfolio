import { photos, fieldNote } from "../content/photos";

export function FieldLog() {
  return (
    <div className="field">
      <p className="field__note" data-stamp>
        {fieldNote}
      </p>
      <div className="field__grid">
        {photos.map((p, i) => (
          <figure className="field__shot" key={p.src} data-stamp style={{ ["--stagger" as never]: String(i % 6) }}>
            <img src={p.src} alt={`${p.caption} — ${p.place}`} loading="lazy" decoding="async" />
            <figcaption className="mono-label">
              <span className="field__place">{p.place}</span>
              <span className="field__cap">{p.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
