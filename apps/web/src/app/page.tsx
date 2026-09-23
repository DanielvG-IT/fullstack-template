import { formatServerTime } from "@acme/core";

export default function Home() {
  // TODO(contract-pipeline): replace this with a real call through @acme/api-client:
  //   GET /api/ping → PingResponse { message, serverTime }
  // This is a Server Component, so you can await the client call directly here.
  const serverTime = new Date().toISOString();

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold">Acme</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Server time: <time dateTime={serverTime}>{formatServerTime(serverTime)}</time>
      </p>
    </main>
  );
}
