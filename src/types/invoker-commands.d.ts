// Invoker commands (<button command commandfor>) aren't in React's types yet.
// React passes these attributes straight through to the DOM.
import "react";

declare module "react" {
  // The type parameter must match React's declaration for the interfaces to merge.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ButtonHTMLAttributes<T> {
    command?: "show-modal" | "close" | "request-close" | "show-popover" | "hide-popover" | "toggle-popover" | `--${string}`;
    commandfor?: string;
  }
}
