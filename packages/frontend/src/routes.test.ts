import "../happy-dom-env";

import { test } from "bun:test";
import { loadInitialRouteModules } from "./routes";

test("loading route modules", async () => {
  const mockLocation = {
    href: "https://example.com",
    pathname: "/",
    origin: "https://example.com",
  };

  Object.defineProperty(globalThis, "location", {
    value: mockLocation,
    writable: true,
    configurable: true,
  });

  await loadInitialRouteModules();
});
