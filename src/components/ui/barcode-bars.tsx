"use client";

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateBars(key: string, count: number): Array<{ w: number; h: number }> {
  const h = hashCode(key);
  const bars: Array<{ w: number; h: number }> = [];
  // Code-128-like pattern: alternating thin/thick bars with quiet zones
  const widths = [1, 2, 3, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 3, 1, 2, 1, 1];
  for (let i = 0; i < count; i++) {
    const seed = ((h >> (i % 16)) & 0xff) + i;
    bars.push({
      w: widths[i % widths.length],
      h: 6 + (seed % 18),
    });
  }
  return bars;
}

export function BarcodeBars({ value, className }: { value: string; className?: string }) {
  const bars = generateBars(value, 28);

  return (
    <div className={`flex items-end gap-[1px] ${className || ""}`}>
      {bars.map((bar, i) => (
        <div
          key={i}
          className="rounded-[1px] bg-white/70"
          style={{
            width: `${bar.w * 2}px`,
            height: `${bar.h * 2}px`,
          }}
        />
      ))}
    </div>
  );
}
