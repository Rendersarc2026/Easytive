// Postgres client (Supabase). Every query goes through tagged templates, so
// values are always sent as bound parameters, never spliced into SQL text.
//
// The app talks to the transaction pooler (DATABASE_URL, port 6543), which
// does not keep prepared statements between queries: hence `prepare: false`.

import postgres from "postgres";

type Sql = ReturnType<typeof postgres>;

// One client per server process. Stored on globalThis so dev hot reloads
// reuse the pool instead of leaking a new one on every edit.
const holder = globalThis as typeof globalThis & { __easytiveSql?: Sql };

export function db(): Sql {
  if (!holder.__easytiveSql) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL is not set. Add it to .env and restart the server.");
    }
    holder.__easytiveSql = postgres(url, {
      prepare: false,
      ssl: "require",
      max: 5,
      // Seconds. Opening a connection to the pooler costs far more than
      // keeping an idle one, so hold on to them for a while.
      idle_timeout: 300,
      connect_timeout: 10,
      onnotice: () => {},
    });
  }
  return holder.__easytiveSql;
}
