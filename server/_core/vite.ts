import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath, { redirect: false, index: false }));

  app.get("*", (req, res) => {
    const pathname = req.path.replace(/\/+$/, "") || "/";
    const candidate = path.resolve(distPath, `.${pathname}`, "index.html");
    if (pathname === "/404") {
      res.status(404).sendFile(path.resolve(distPath, "404/index.html"));
      return;
    }
    if (
      candidate.startsWith(`${path.resolve(distPath)}${path.sep}`) &&
      fs.existsSync(candidate)
    ) {
      res.sendFile(candidate);
      return;
    }
    if (/\.[a-z0-9]+$/i.test(pathname) || pathname.startsWith("/api/")) {
      res.status(404).type("text").send("Not found");
      return;
    }
    res.status(404).sendFile(path.resolve(distPath, "404/index.html"));
  });
}
