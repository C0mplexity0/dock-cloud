import { serve } from "bun";
import path from "node:path";
import index from "./index.html";

const isProduction = process.env.NODE_ENV === "production";

const server = isProduction
  ? serve({
      async fetch(request) {
        const distDirectory = path.resolve(import.meta.dir, "../dist");
        const pathname = new URL(request.url).pathname;
        const filePath = path.resolve(distDirectory, pathname.slice(1));

        if (filePath.startsWith(`${distDirectory}${path.sep}`)) {
          const file = Bun.file(filePath);
          if (await file.exists()) {
            return new Response(file, {
              headers: {
                "Cache-Control": "public, max-age=31536000, immutable",
              },
            });
          }
        }

        return new Response(Bun.file(path.join(distDirectory, "index.html")));
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
