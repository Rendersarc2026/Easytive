import { MoonLoader } from "react-spinners";

/** Spinner centred in the screen under the header, shown while a page loads. */
export function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <MoonLoader color="#22211f" aria-hidden />
      <span className="sr">Loading…</span>
    </div>
  );
}
