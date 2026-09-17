import { matchRoutes, type RouteObject } from "react-router";

export const routes: RouteObject[] = [
  {
    path: "/",
    lazy: () => import("./pages/index"),
  },
  {
    path: "/login",
    lazy: () => import("./pages/login"),
  },
  {
    path: "/signup",
    lazy: () => import("./pages/signup"),
  },
  {
    path: "*",
    lazy: () => import("./components/ui/page/not-found"),
  },
];

export async function loadInitialRouteModules() {
  const matches = matchRoutes(routes, globalThis.location);

  await Promise.all(
    (matches ?? []).map(async ({ route }) => {
      if (typeof route.lazy !== "function") {
        return;
      }

      const module = await route.lazy();
      Object.assign(route, module, { lazy: undefined });
    }),
  );
}
