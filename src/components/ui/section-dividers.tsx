export function WaveDivider({ flip }: { flip?: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 ${flip ? "top-0 rotate-180" : "bottom-0"} h-16 sm:h-24`}
    >
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="h-full w-full">
        <path d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z" fill="rgba(147,51,234,0.03)" />
        <path d="M0,60 C360,110 1080,10 1440,60 L1440,100 L0,100 Z" fill="rgba(99,102,241,0.02)" />
      </svg>
    </div>
  );
}

export function AngleDivider({ flip }: { flip?: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 ${flip ? "top-0" : "bottom-0"} h-20 sm:h-32`}
    >
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="h-full w-full">
        <polygon
          points={flip ? "1440,0 0,120 1440,120" : "0,0 0,120 1440,0"}
          fill="rgba(147,51,234,0.03)"
        />
      </svg>
    </div>
  );
}

export function CurvedDivider({ flip }: { flip?: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 ${flip ? "top-0 -scale-y-100" : "bottom-0"} h-24 sm:h-36`}
    >
      <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="h-full w-full">
        <path d="M0,70 C360,140 1080,0 1440,70 L1440,140 L0,140 Z" fill="rgba(147,51,234,0.02)" />
      </svg>
    </div>
  );
}

export function BlobShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        fill="rgba(147,51,234,0.08)"
        d="M44.5,-72.3C59.3,-66.3,74.1,-55.5,80.1,-41.4C86.1,-27.2,83.3,-9.8,79.2,6.9C75.1,23.6,69.7,39.6,59.4,51.9C49.2,64.2,34.1,72.8,17.6,77.5C1.1,82.2,-16.7,83,-31.6,76.5C-46.5,70,-58.5,56.2,-66.6,40.5C-74.7,24.8,-78.9,7.2,-76.5,-9.4C-74.1,-26,-65.1,-41.6,-52.6,-50.6C-40.1,-59.7,-24.1,-62.2,-8.6,-67.6C6.9,-73.1,29.6,-78.3,44.5,-72.3Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}
