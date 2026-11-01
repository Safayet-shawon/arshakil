const words = ["Architecture", "Photography", "Film", "Travel", "Writing", "Enterprise"];

export default function Marquee() {
  const row = [...words, ...words, ...words, ...words];
  return (
    <div aria-hidden className="overflow-hidden whitespace-nowrap bg-ink py-[18px] text-g100">
      <div className="marquee-track inline-flex">
        {row.map((w, i) => (
          <span key={i} className="font-display px-[22px] text-[clamp(22px,3vw,40px)] tracking-[0.04em]">
            {w}<span className="pl-[44px] text-accent">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
