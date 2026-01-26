"use client";
export const dynamic = "force-dynamic";

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
        <h2>Une erreur est survenue</h2>
        <p>{error?.message ?? "Veuillez réessayer."}</p>
        <button onClick={() => reset()}>Réessayer</button>
      </body>
    </html>
  );
}
