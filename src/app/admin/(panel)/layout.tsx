import type { ReactNode } from "react";
import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "../auth-actions";
import AdminNav from "./nav";
import "../admin.css";
import { ConfirmButton, Spinner } from "@/app/admin/buttons";

// The sidebar is static and prerenders. Each page checks the session itself
// (`await requireUser()` as its first statement), and each page folder's
// loading.tsx gives it its own Suspense boundary, so a click shows the loading
// state at once instead of waiting on the session lookup. The session read
// also aborts prerendering at that point, so no page body lands in the shell.

// Who is signed in, plus the links that depend on it. Request-time, so it
// streams into the sidebar behind its own boundary.
async function AccountLinks() {
  const user = await getCurrentUser();
  if (!user) return null;
  const links = [{ href: "/admin/profile", label: "Profile" }];
  return (
    <>
      <div className="a-account" title={user.email}>
        <span className="a-avatar" aria-hidden>
          {user.email.charAt(0).toUpperCase()}
        </span>
        <span className="a-accountmeta">
          <span className="a-accountemail">{user.email}</span>
          <span className="a-accountrole">Signed in</span>
        </span>
      </div>
      <AdminNav links={links} label="Account" />
    </>
  );
}

const icon = { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

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
          <div className="a-sideactions">
            <Link className="a-sideaction" href="/" target="_blank" prefetch={false}>
              <svg {...icon}>
                <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
              </svg>
              View site
            </Link>
            <form action={logout}>
              <ConfirmButton className="a-sideaction" title="Log out?" message="You'll need your email and password to sign back in." confirmLabel="Log out" pendingLabel={<span className="a-pending"><Spinner label="Logging out" />Log out</span>}>
                <svg {...icon}>
                  <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10" />
                </svg>
                Log out
              </ConfirmButton>
            </form>
          </div>
        </div>
      </aside>
      <main className="a-main">
        {children}
      </main>
    </div>
  );
}
