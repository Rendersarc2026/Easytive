import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";

// Any /admin address that isn't a real page: checks the session (so a
// signed-out visitor goes to the login page and learns nothing), then shows
// the admin's own not-found page inside the panel.
export default async function MissingAdminPage() {
  await requireUser();
  notFound();
}
