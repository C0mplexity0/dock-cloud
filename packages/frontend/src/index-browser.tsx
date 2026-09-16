import { hydrateRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { loadInitialRouteModules, routes } from "./routes";
import { App } from "./App";
import { RouterProvider } from "react-router/dom";

await loadInitialRouteModules();

const router = createBrowserRouter(routes);

const elem = document.getElementById("root")!;
const app = (
  <App router={router}>
    <RouterProvider router={router} />
  </App>
);

// https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
const root = import.meta.hot.data.root;

if (root) {
  root.render(app);
} else {
  import.meta.hot.data.root = hydrateRoot(elem, app);
}
