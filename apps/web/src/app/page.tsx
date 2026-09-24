import { formatServerTime } from "@acme/core";
import { connection } from "next/server";
import { api } from "@/lib/api";

export default async function Home() {
  // Render per request: the API is called at runtime, never during `next build`.
  await connection();

  const { data, error } = await api()
    .GET("/api/ping")
    .catch(() => ({ data: undefined, error: "unreachable" as const }));

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold">Acme</h1>
      {data ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          API says <strong>{data.message}</strong> at{" "}
          <time dateTime={data.serverTime}>{formatServerTime(data.serverTime)}</time>
        </p>
      ) : (
        <p role="alert" className="text-red-700 dark:text-red-400">
          API unavailable{error === "unreachable" ? "" : " (unexpected response)"} — is{" "}
          <code>task dev:api</code> running?
        </p>
      )}
    </main>
  );
}
