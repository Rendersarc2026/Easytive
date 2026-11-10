// Applies db/migrations/*.sql in filename order, once each.
//   npm run db:migrate
// Each file runs in its own transaction and is recorded in
// easytive.schema_migrations, so re-running is a no-op.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const file of [".env", ".env.local"]) {
  try {
    process.loadEnvFile(path.join(root, file));
  } catch {
    // file absent: fine, the variables may already be in the environment
  }
}

const url = process.env.DATABASE_URL_SESSION ?? process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL_SESSION (or DATABASE_URL) is not set. Add it to .env.");
  process.exit(1);
}

const sql = postgres(url, { max: 1, prepare: false, ssl: "require", onnotice: () => {} });

try {
  await sql`create schema if not exists easytive`;
  await sql`create table if not exists easytive.schema_migrations (
    name text primary key,
    applied_at timestamptz not null default now()
  )`;
  await sql`alter table easytive.schema_migrations enable row level security`;

  const dir = path.join(root, "db", "migrations");
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
  const done = new Set((await sql`select name from easytive.schema_migrations`).map((r) => r.name));

  let applied = 0;
  for (const name of files) {
    if (done.has(name)) continue;
    const body = await fs.readFile(path.join(dir, name), "utf8");
    await sql.begin(async (tx) => {
      await tx.unsafe(body);
      await tx`insert into easytive.schema_migrations (name) values (${name})`;
    });
    console.log(`applied ${name}`);
    applied += 1;
  }
  console.log(applied ? `Done: ${applied} migration(s) applied.` : "Nothing to apply: database is up to date.");
} catch (err) {
  console.error("Migration failed:", err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
