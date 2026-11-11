// Invoker commands (<button command commandfor>) aren't in React's types yet.
// React passes these attributes straight through to the DOM.
import "react";

declare module "react" {
  interface ButtonHTMLAttributes<T> {
    command?: "show-modal" | "close" | "request-close" | "show-popover" | "hide-popover" | "toggle-popover" | `--${string}`;
    commandfor?: string;
  }
}
