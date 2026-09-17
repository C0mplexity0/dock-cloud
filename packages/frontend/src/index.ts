import { Glob } from "bun";
import { serve } from "bun-serve-compress";
import path, { basename } from "node:path";
import { render } from "./index-server";

const htmlCache = new Map<string, string>();
const distDirectory = path.join(import.meta.dir, "dist");

async function processRequest(request: Request) {
  const pathname = new URL(request.url).pathname;

  if (htmlCache.get(pathname)) {
    return new Response(htmlCache.get(pathname), {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  const staticDirectory = path.join(distDirectory, "static");
  const filePath = path.resolve(staticDirectory, pathname.slice(1));

  if (filePath.startsWith(`${staticDirectory}${path.sep}`)) {
    const file = Bun.file(filePath);
    if (await file.exists()) {
      return new Response(file, {
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  }

  const htmlFile = Bun.file(path.join(distDirectory, "static/index.html"));
  let html = await htmlFile.text();
  html = await injectModulePreloadLinks(html, request);
  html = await renderSSR(html, request);

  htmlCache.set(pathname, html);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}

function findRequiredModules(
  jsText: string,
  existingModules: string[],
  routes: Record<string, string>,
): string[] {
  const routePaths = Object.values(routes);

  const matches = jsText.match(/chunk-[a-zA-Z0-9]+\.js/g);
  if (!matches) {
    return [];
  }

  const jsModules = [];

  for (const match of matches) {
    if (existingModules.includes(match) && !routePaths.includes(`/${match}`)) {
      jsModules.push(match);
    }
  }

  return jsModules;
}

async function findRequiredModulesFromFile(
  filePath: string,
  jsFiles: string[],
  routes: Record<string, string>,
): Promise<string[]> {
  const staticDirectory = path.join(distDirectory, "static");
  const file = Bun.file(path.join(staticDirectory, filePath));
  const text = await file.text();
  const requiredModules = findRequiredModules(text, jsFiles, routes);
  return requiredModules;
}

async function injectModulePreloadLinks(
  htmlText: string,
  request: Request,
): Promise<string> {
  const staticDirectory = path.join(distDirectory, "static");
  const pathname = new URL(request.url).pathname;

  const manifest = Bun.file(
    path.join(staticDirectory, "../route-manifest.json"),
  );
  const manifestContent = await manifest.text();
  const { routes, entryRoute } = JSON.parse(manifestContent);

  const route = routes[pathname];

  const preloadModules = new Set<string>();

  if (route) {
    preloadModules.add(route);
  }

  const glob = new Glob("**/*.js");
  const relativePaths = await Array.fromAsync(glob.scan(staticDirectory));
  const jsFiles = relativePaths.map((filePath) => basename(filePath));

  const entryRouteRequiredModules = await findRequiredModulesFromFile(
    entryRoute,
    jsFiles,
    routes,
  );
  const routeRequiredModules = route
    ? await findRequiredModulesFromFile(route, jsFiles, routes)
    : [];

  for (const module of entryRouteRequiredModules) {
    preloadModules.add(`/${module}`);
  }

  for (const module of routeRequiredModules) {
    preloadModules.add(`/${module}`);
  }

  const preloadLinks = Array.from(preloadModules)
    .map((module) => `<link rel="modulepreload" href="${module}" />`)
    .join("");

  const rewriter = new HTMLRewriter().on("head", {
    element(element) {
      element.append(preloadLinks, { html: true });
    },
  });

  const newHtml = rewriter.transform(htmlText);
  return newHtml;
}

async function renderSSR(htmlText: string, request: Request): Promise<string> {
  let reactText = await render(request);

  if (reactText instanceof Response) {
    reactText = await reactText.text();
  }

  const rewriter = new HTMLRewriter().on("#root", {
    element(element) {
      element.append(reactText, { html: true });
    },
  });

  const newHtml = rewriter.transform(htmlText);
  return newHtml;
}

const startTime = performance.now();

const server = serve({
  async fetch(request) {
    const initialTime = performance.now();
    const response = await processRequest(request);
    const duration = performance.now() - initialTime;
    console.log(
      `${request.method} ${request.url} - ${response.status} - ${duration.toFixed(2)}ms`,
    );
    return response;
  },
});

console.log(`Server running at ${server.url}`);
console.log(`Startup time: ${(performance.now() - startTime).toFixed(2)}ms`);
