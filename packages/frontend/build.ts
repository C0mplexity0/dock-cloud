import tailwind from "bun-plugin-tailwind";
import { rm } from "node:fs/promises";
import path from "node:path";
import { minify } from "html-minifier-terser";

const outdir = path.join(process.cwd(), "dist");
await rm(outdir, { recursive: true, force: true });

const entrypoints = [...new Bun.Glob("src/**/*.html").scanSync()];

const result = await Bun.build({
  entrypoints,
  outdir,
  plugins: [tailwind],
  minify: true,
  treeShaking: true,
  target: "browser",
  sourcemap: "none",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  splitting: true,
});

const htmlFile = Bun.file("./dist/index.html");
const htmlContent = await htmlFile.text();

const compressedHtml = await minify(htmlContent, {
  collapseWhitespace: true,
  removeComments: true,
  minifyCSS: true,
  minifyJS: true,
});

await Bun.write("./dist/index.html", compressedHtml);

for (const output of result.outputs) {
  console.log(` ${path.relative(process.cwd(), output.path)}  ${(output.size / 1024).toFixed(1)} KB`);
}
