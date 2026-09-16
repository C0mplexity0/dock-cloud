import { serve } from "bun";
import path from "node:path";
import { render } from "./index-server";

const htmlCache = new Map<string, string>();

async function processRequest(request: Request) {
  const staticDirectory = path.resolve(import.meta.dir, "../dist/static");
  const pathname = new URL(request.url).pathname;
  const filePath = path.resolve(staticDirectory, pathname.slice(1));

  if (htmlCache.get(pathname)) {
    return new Response(htmlCache.get(pathname), {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

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

  const htmlFile = Bun.file(path.join(import.meta.dir, "../dist/static/index.html"));
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

async function injectModulePreloadLinks(htmlText: string, request: Request): Promise<string> {
  const staticDirectory = path.resolve(import.meta.dir, "../dist/static");
  const pathname = new URL(request.url).pathname;

  const manifest = Bun.file(path.join(staticDirectory, "../route-manifest.json"));
  const manifestContent = await manifest.text();
  const { routes } = JSON.parse(manifestContent);

  const route = routes[pathname];
  if (!route) {
    return htmlText;
  }

  const rewriter = new HTMLRewriter().on("head", {
    element(element) {
      element.append(`<link rel="modulepreload" href="${route}" />`, { html: true });
    },
  });

  const newHtml = rewriter.transform(htmlText);
  return newHtml;
}

async function renderSSR(htmlText: string, request: Request): Promise<string> {
  let reactText = await render(request)

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

const server = serve({
  async fetch(request) {
    return await processRequest(request);
  }
});

console.log(`Server running at ${server.url}`);
