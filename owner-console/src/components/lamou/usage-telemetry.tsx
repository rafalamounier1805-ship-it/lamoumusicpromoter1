import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

import { activityContextForRoute } from "@/lib/lamou/activity-persona-router";
import { classifyLamouRoute, flushLamouUsage, recordLamouUsage } from "@/lib/lamou/usage-telemetry";

function viewportBucket(): string {
  if (typeof window === "undefined") return "ssr";
  if (window.innerWidth <= 480) return "mobile";
  if (window.innerWidth <= 1024) return "tablet";
  return "desktop";
}

function internalPath(control: HTMLElement): string | null {
  if (!(control instanceof HTMLAnchorElement) || !control.href) return null;
  try {
    const url = new URL(control.href, window.location.href);
    return url.origin === window.location.origin ? url.pathname : "external";
  } catch {
    return null;
  }
}

function safeAction(control: HTMLElement): string {
  return (
    control.dataset["lamouAction"] ??
    control.getAttribute("aria-label") ??
    control.getAttribute("title") ??
    control.id ??
    control.tagName.toLowerCase()
  );
}

function routingContext(route: string) {
  const activity = activityContextForRoute(route);
  return {
    activity_key: activity.activityKey,
    personas: activity.personaIds.join(","),
    plugins: activity.plugins.join(","),
  };
}

/**
 * Cross-cutting usage capture for Owner Console.
 * It records the governed activity/persona/plugin routing selected for each surface,
 * but intentionally records no form values, prompt text, document bodies or button text.
 */
export function UsageTelemetry() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const surface = classifyLamouRoute(pathname);
    void recordLamouUsage({
      eventType: "LAMOU_SURFACE_VIEW",
      ...surface,
      route: pathname,
      context: {
        viewport: viewportBucket(),
        online: navigator.onLine,
        ...routingContext(pathname),
      },
    });
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const control = event.target.closest<HTMLElement>(
        "a,button,[role='button'],[data-lamou-action]",
      );
      if (!control) return;

      const route = window.location.pathname;
      const surface = classifyLamouRoute(route);
      void recordLamouUsage({
        eventType: "LAMOU_INTERACTION",
        ...surface,
        route,
        action: safeAction(control),
        context: {
          control_type: control.tagName.toLowerCase(),
          target_path: internalPath(control),
          disabled:
            control instanceof HTMLButtonElement || control instanceof HTMLInputElement
              ? control.disabled
              : false,
          ...routingContext(route),
        },
      });
    };

    const onOnline = () => void flushLamouUsage();
    const onVisibility = () => {
      if (document.visibilityState === "visible") void flushLamouUsage();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("online", onOnline);
    document.addEventListener("visibilitychange", onVisibility);
    void flushLamouUsage();

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("online", onOnline);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return null;
}
