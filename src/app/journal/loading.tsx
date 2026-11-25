import { Header } from "@/components/Header";
import { PageLoader } from "@/components/PageLoader";
import { Footer } from "@/components/sections/Footer";

// Shown while the journal (or an article in it) loads: the real header and
// footer, with a spinner in between.
export default function JournalLoading() {
  return (
    <>
      <Header />
      <main>
        <PageLoader />
      </main>
      <Footer />
    </>
  );
}
