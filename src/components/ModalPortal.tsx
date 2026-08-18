import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Renders children into a fixed full-viewport div on document.body,
 * escaping any stacking context, CSS transform, or opacity layer.
 * pointer-events:none on the wrapper — each modal handles its own events.
 */
export function ModalPortal({ children }: { children: React.ReactNode }) {
  const el = useRef<HTMLDivElement | null>(null);

  if (!el.current) {
    const div = document.createElement("div");
    div.style.cssText =
      "position:fixed;inset:0;z-index:900;pointer-events:none;";
    el.current = div;
  }

  useEffect(() => {
    const node = el.current!;
    document.body.appendChild(node);
    return () => {
      document.body.removeChild(node);
    };
  }, []);

  return createPortal(children, el.current);
}
