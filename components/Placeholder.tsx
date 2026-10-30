import type { ObjectKind } from '@/lib/data';

// Clean placeholder drawn as a soft 3D-ish object. Used everywhere a real photo is missing.
// Real photos: drop them into public/images/... (see IMAGES.md) and they replace this automatically.
const G = (
  <defs>
    <linearGradient id="phg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#8fb2ee" />
      <stop offset="0.5" stopColor="#1558c9" />
      <stop offset="1" stopColor="#0a2c6b" />
    </linearGradient>
    <linearGradient id="phl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#f2ffa8" />
      <stop offset="1" stopColor="#d4ff24" />
    </linearGradient>
  </defs>
);

function shape(kind: ObjectKind) {
  switch (kind) {
    case 'pipe':
      return (<><rect x="14" y="40" width="92" height="40" rx="6" fill="url(#phg)" /><rect x="8" y="34" width="14" height="52" rx="5" fill="url(#phl)" /><rect x="98" y="34" width="14" height="52" rx="5" fill="url(#phl)" /></>);
    case 'elbow':
      return (<><path d="M20 30h34a30 30 0 0 1 30 30v36H48V74a8 8 0 0 0-8-8H20z" fill="url(#phg)" /><rect x="10" y="26" width="12" height="44" rx="4" fill="url(#phl)" /><rect x="44" y="92" width="48" height="12" rx="4" fill="url(#phl)" /></>);
    case 'tee':
      return (<><rect x="8" y="26" width="104" height="36" rx="6" fill="url(#phg)" /><rect x="42" y="56" width="36" height="52" rx="6" fill="url(#phg)" /><rect x="36" y="100" width="48" height="12" rx="4" fill="url(#phl)" /></>);
    case 'valve':
      return (<><rect x="10" y="52" width="100" height="32" rx="6" fill="url(#phg)" /><circle cx="60" cy="64" r="24" fill="url(#phg)" /><rect x="54" y="20" width="12" height="30" rx="4" fill="#0a2c6b" /><rect x="30" y="14" width="60" height="12" rx="6" fill="url(#phl)" /></>);
    case 'faucet':
      return (<><rect x="46" y="62" width="28" height="46" rx="8" fill="url(#phg)" /><path d="M60 64V40a26 26 0 0 1 52 0v6" fill="none" stroke="url(#phg)" strokeWidth="16" strokeLinecap="round" /><rect x="96" y="40" width="16" height="14" rx="4" fill="url(#phl)" /><rect x="24" y="52" width="24" height="12" rx="6" fill="url(#phl)" /></>);
    case 'tank':
      return (<><rect x="22" y="30" width="76" height="78" rx="14" fill="url(#phg)" /><rect x="30" y="18" width="60" height="16" rx="8" fill="url(#phl)" /><rect x="22" y="56" width="76" height="6" fill="#0a2c6b" opacity=".5" /><rect x="22" y="78" width="76" height="6" fill="#0a2c6b" opacity=".5" /></>);
    case 'socket':
      return (<><rect x="30" y="34" width="60" height="52" rx="10" fill="url(#phg)" /><rect x="20" y="28" width="16" height="64" rx="5" fill="url(#phl)" /><rect x="84" y="28" width="16" height="64" rx="5" fill="url(#phl)" /></>);
    case 'bowl':
      return (<><path d="M12 48h96a48 48 0 0 1-96 0z" fill="url(#phg)" /><rect x="8" y="40" width="104" height="12" rx="6" fill="url(#phl)" /><rect x="48" y="92" width="24" height="14" rx="4" fill="#0a2c6b" /></>);
    case 'lock':
      return (<><rect x="28" y="52" width="64" height="54" rx="12" fill="url(#phg)" /><path d="M42 54V40a18 18 0 0 1 36 0v14" fill="none" stroke="url(#phl)" strokeWidth="10" strokeLinecap="round" /><circle cx="60" cy="78" r="7" fill="url(#phl)" /></>);
    default:
      return (<><rect x="22" y="26" width="76" height="76" rx="16" fill="url(#phg)" /><rect x="34" y="40" width="52" height="10" rx="5" fill="url(#phl)" /></>);
  }
}

export default function Placeholder({ kind = 'box', label = true }: { kind?: ObjectKind; label?: boolean }) {
  return (
    <div className="ph" role="img" aria-label="Product photo coming soon">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        {G}
        {shape(kind)}
      </svg>
      {label && <span className="cap">Photo coming soon</span>}
    </div>
  );
}
