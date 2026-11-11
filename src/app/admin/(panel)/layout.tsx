import type { ReactNode } from "react";
import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser, requireUser } from "@/lib/auth";
import { logout } from "../auth-actions";
import AdminNav from "./nav";
import "../admin.css";
import { ConfirmButton } from "@/app/admin/buttons";

// The sidebar hangs off the shell and prerenders; the guarded subtree streams
// in behind a Suspense boundary. Anything that reads cookies() must sit inside
// a boundary (cacheComponents): during prerendering the check aborts it, so no
// page body ever lands in the static shell. At request time the guard re-runs
// and either renders the page or redirects to the login screen.
async function Guard({ children }: { children: ReactNode }) {
  await requireUser();
  return <>{children}</>;
}

// Who is signed in, plus the links that depend on it. Request-time, so it
// streams into the sidebar behind its own boundary.
async function AccountLinks() {
  const user = await getCurrentUser();
  if (!user) return null;
  const links = [...(user.role === "admin" ? [{ href: "/admin/users", label: "Users" }] : []), { href: "/admin/profile", label: "Profile" }];
  return (
    <>
      <AdminNav links={links} label="Account" />
      <span className="a-whoami" title={user.email}>
        {user.email}
      </span>
    </>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="a-shell">
      <aside className="a-side">
        <div className="a-brand">Easytive</div>
        <AdminNav />
        <div className="a-sidetail">
          <Suspense fallback={null}>
            <AccountLinks />
          </Suspense>
          <Link href="/" target="_blank" prefetch={false}>
            View public site
          </Link>
          <form action={logout}>
            <ConfirmButton className="logout-btn" title="Log out?" message="You'll need your email and password to sign back in." confirmLabel="Log out" pendingLabel="Logging out…">
              Log out
            </ConfirmButton>
          </form>
        </div>
      </aside>
      <main className="a-main">
        <Suspense fallback={null}>
          <Guard>{children}</Guard>
        </Suspense>
      </main>
    </div>
  );
}
