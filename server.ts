import fs from "node:fs/promises";
import express, { type Request, type Response } from "express";
import type { ViteDevServer } from "vite";

// Configuration constants
const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT) || 3000;
const base = process.env.BASE || "/";
const host = process.env.HOSTNAME || "0.0.0.0";

// HTML template placeholders
const PLACEHOLDERS = {
  APP_HEAD: "<!--app-head-->",
  APP_HTML: "<!--app-html-->",
  SSR_DATA: "<!--ssr-data-->",
} as const;

// File paths
const PATHS = {
  DEV_TEMPLATE: "./index.html",
  PROD_TEMPLATE: "./dist/client/index.html",
  ENTRY_SERVER: "/src/entry-server.ts",
  PROD_ENTRY: "./dist/server/entry-server.js",
} as const;

/**
 * Inject SSR data into HTML template
 */
const injectSSRData = (
  template: string,
  theme: string,
  html: string | undefined,
  head: string | undefined,
  ssrData: Record<string, string>
): string => {
  return template
    .replace(/<html([^>]*)>/, `<html$1 data-theme="${theme}">`)
    .replace(PLACEHOLDERS.APP_HEAD, head ?? "")
    .replace(PLACEHOLDERS.APP_HTML, html ?? "")
    .replace(
      PLACEHOLDERS.SSR_DATA,
      `<script id="ssr-data">window.__SSR_DATA__ = ${JSON.stringify(
        ssrData
      )}</script>`
    );
};

/**
 * Setup Vite dev server middleware
 */
const setupDevMiddleware = async (
  app: express.Application,
  base: string
): Promise<ViteDevServer> => {
  const { createServer } = await import("vite");
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
  return vite;
};

/**
 * Setup production static file serving
 */
const setupProdMiddleware = async (
  app: express.Application,
  base: string
): Promise<void> => {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
};

// Cached production template
const templateHtml = isProduction
  ? await fs.readFile(PATHS.PROD_TEMPLATE, "utf-8")
  : "";

// Create Express app
const app = express();

// Setup middleware based on environment
let vite: ViteDevServer | undefined;
if (!isProduction) {
  vite = await setupDevMiddleware(app, base);
} else {
  await setupProdMiddleware(app, base);
}

/**
 * Main request handler - renders Vue app and injects SSR data
 */
app.use("*all", async (req: Request, res: Response) => {
  try {
    const url = req.originalUrl.replace(base, "");

    // Load template and render function based on environment
    let template: string;
    let render: (
      url: string,
      cookies?: string | object | null
    ) => Promise<{
      html: string;
      ctx: { theme: string; ssrContext: { data: Record<string, string> } };
      head?: string;
    }>;

    if (!isProduction && vite) {
      template = await fs.readFile(PATHS.DEV_TEMPLATE, "utf-8");
      template = await vite.transformIndexHtml(url, template);
      const module = await vite.ssrLoadModule(PATHS.ENTRY_SERVER);
      render = module.render;
    } else {
      template = templateHtml;
      const module = await import(PATHS.PROD_ENTRY);
      render = module.render;
    }

    // Render Vue app
    const rendered = await render(url, req.headers.cookie);
    const { theme, ssrContext } = rendered.ctx;
    const data = ssrContext?.data || {};

    // Inject SSR data into template
    const html = injectSSRData(
      template,
      theme,
      rendered.html,
      rendered.head,
      data
    );

    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  } catch (error) {
    // Fix stack traces in development
    vite?.ssrFixStacktrace(error as Error);
    console.error("SSR Error:", error);
    const errorMessage = error instanceof Error ? error.stack : String(error);
    res.status(500).end(isProduction ? "Internal Server Error" : errorMessage);
  }
});

// Start server
const serverUrl = `http://${host === "0.0.0.0" ? "localhost" : host}:${port}`;
app.listen({ port, hostname: host }, () => {
  console.log(`Server started at ${serverUrl}`);
});
