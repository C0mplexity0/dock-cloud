import { serve } from "bun";
import path from "node:path";
import index from "./index.html";

const isProduction = process.env.NODE_ENV === "production";

const server = isProduction
  ? serve({
    async fetch(request) {
      const staticDirectory = path.resolve(import.meta.dir, "../dist/static");
      const pathname = new URL(request.url).pathname;
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

      const manifest = Bun.file(path.join(staticDirectory, "../route-manifest.json"));
      const manifestContent = await manifest.text();
      const { routes } = JSON.parse(manifestContent);

      const route = routes[pathname];
      if (!route) {
        return new Response(Bun.file(path.join(staticDirectory, "index.html")));
      }

      const html = Bun.file(path.join(staticDirectory, "index.html"));
      const htmlText = await html.text();

      const rewriter = new HTMLRewriter().on("head", {
        element(element) {
          element.append(`<link rel="modulepreload" href="${route}" />`, { html: true });
        },
      });

      const newHtml = rewriter.transform(htmlText);

        return new Response(newHtml, {
          headers: {
            "Content-Type": "text/html",
          },
        });
      },
    })
  : serve({
      routes: {
        "/*": index,
      },
      development: {
    hmr: true,
    console: true,
      },
    });

console.log(`Server running at ${server.url}`);
