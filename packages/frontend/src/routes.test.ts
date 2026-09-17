import { afterEach, test } from "bun:test";
import { loadInitialRouteModules } from "./routes";

test("loading route modules", async () => {
  const originalLocation = Object.getOwnPropertyDescriptor(
    globalThis,
    "location",
  );
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

  afterEach(() => {
    if (originalLocation) {
      Object.defineProperty(globalThis, "location", originalLocation);
    } else {
      delete globalThis.location;
    }
  });
});
