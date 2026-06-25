"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="gt-admin-page-title text-3xl">Admin Error</h1>
        <p className="mt-4 text-muted-foreground">
          {error.message || "An unexpected error occurred in the admin area"}
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-500"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
