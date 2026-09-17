import { expect, test, describe, beforeAll, afterAll } from "bun:test";
import { startWebserver } from ".";
import type { Server } from "bun";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { parse } from "node-html-parser";

describe("Webserver tests", () => {
  let server: Server<undefined>;
  let distDirectory: string;

  beforeAll(async () => {
    distDirectory = await mkdtemp(path.join(tmpdir(), "dock-cloud-frontend-"));
    await Bun.write(
      path.join(distDirectory, "static/index.html"),
      '<html><head></head><body><div id="root"></div></body></html>',
    );
    await Bun.write(
      path.join(distDirectory, "static/entry.js"),
      "console.log('entry');",
    );
    await Bun.write(
      path.join(distDirectory, "route-manifest.json"),
      JSON.stringify({ routes: {}, entryRoute: "entry.js" }),
    );

    server = startWebserver({ distDirectory });
  });

  afterAll(async () => {
    if (server) {
      server.stop();
    }
    await rm(distDirectory, { recursive: true, force: true });
  });

  test("GET /", async () => {
    const response = await fetch(new URL("/", server.url));
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toContain("<html>");

    const htmlRoot = parse(text);
    const rootDiv = htmlRoot.querySelector("#root");
    expect(rootDiv).toBeDefined();
    expect(rootDiv).not.toBeNull();

    if (rootDiv) {
      expect(rootDiv.innerHTML).not.toBe("");
    }
  });
});
