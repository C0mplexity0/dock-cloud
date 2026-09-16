import { hydrateRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { routes } from "./routes";
import { App } from "./App";

const router = createBrowserRouter(routes);

const elem = document.getElementById("root")!;
const app = (
  <App router={router} />
);

// https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
const root = import.meta.hot.data.root;

if (root) {
  root.render(app);
} else {
  import.meta.hot.data.root = hydrateRoot(elem, app);
}
