"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-[#050508] px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Something went wrong</h1>
            <p className="mt-4 text-gray-400">{error.message || "A critical error occurred"}</p>
            <button
              onClick={reset}
              className="mt-6 rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-500"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
