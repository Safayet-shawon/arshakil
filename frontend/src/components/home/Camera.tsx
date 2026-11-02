/** Flat grey camera used by the intro. `pressed` pushes the shutter button down. */
export default function Camera({ pressed }: { pressed: boolean }) {
  return (
    <svg viewBox="0 0 240 190" xmlns="http://www.w3.org/2000/svg" className="block h-auto w-full overflow-visible">
      <rect x="170" y={pressed ? 19 : 14} width="30" height="14" rx="5" fill="#808080" style={{ transition: "y .12s" }} />
      <rect x="92" y="18" width="56" height="28" rx="8" fill="#a3a3a3" stroke="#4d4f53" strokeWidth="3" />
      <rect x="10" y="38" width="220" height="140" rx="22" fill="#dedede" stroke="#4d4f53" strokeWidth="4" />
      <rect x="10" y="38" width="220" height="42" rx="22" fill="#c6c6c6" />
      <rect x="30" y="52" width="44" height="22" rx="6" fill="#ffffff" stroke="#4d4f53" strokeWidth="2.5" />
      <circle cx="198" cy="64" r="6" fill="#f7b500" />
      <g>
        <circle cx="120" cy="116" r="54" fill="#a3a3a3" stroke="#4d4f53" strokeWidth="4" />
        <circle cx="120" cy="116" r="40" fill="#666666" />
        <circle cx="120" cy="116" r="26" fill="#4d4f53" />
        <circle cx="108" cy="104" r="8" fill="#ffffff" opacity=".6" />
      </g>
    </svg>
  );
}
