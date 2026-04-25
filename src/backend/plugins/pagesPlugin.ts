import { file } from "bun";
import { join } from "node:path";
import { Elysia } from "elysia";
import {
  asset,
  generateHeadElement,
  handleHTMLPageRequest,
  handleHTMXPageRequest,
  handleReactPageRequest,
} from "@absolutejs/absolute";
import { handleAngularPageRequest } from "@absolutejs/absolute/angular";
import { handleSveltePageRequest } from "@absolutejs/absolute/svelte";
import { handleVuePageRequest } from "@absolutejs/absolute/vue";
import { ReactVoiceDemo } from "../../frontend/react/pages/ReactVoiceDemo";
import { FRAMEWORKS } from "../../shared/demo";

export const pagesPlugin = (manifest: Record<string, string>) =>
  new Elysia()
    .get("/", ({ redirect }) => redirect("/react"))
    .get(
      "/assets/png/absolutejs-temp.png",
      () =>
        new Response(
          file(
            join(
              process.cwd(),
              "src",
              "backend",
              "assets",
              "png",
              "absolutejs-temp.png",
            ),
          ),
          {
            headers: {
              "Content-Type": "image/png",
            },
          },
        ),
    )
    .get(
      "/assets/ico/favicon.ico",
      () =>
        new Response(
          file(
            join(
              process.cwd(),
              "src",
              "backend",
              "assets",
              "ico",
              "favicon.ico",
            ),
          ),
          {
            headers: {
              "Content-Type": "image/x-icon",
            },
          },
        ),
    )
    .get(
      "/favicon.ico",
      () =>
        new Response(
          file(
            join(
              process.cwd(),
              "src",
              "backend",
              "assets",
              "ico",
              "favicon.ico",
            ),
          ),
          {
            headers: {
              "Content-Type": "image/x-icon",
            },
          },
        ),
    )
    .get("/demo/frameworks", () => FRAMEWORKS)
    .get(
      "/htmx/htmx.min.js",
      () =>
        new Response(
          file(
            join(
              process.cwd(),
              "node_modules",
              "htmx.org",
              "dist",
              "htmx.min.js",
            ),
          ),
          {
            headers: {
              "Content-Type": "application/javascript; charset=utf-8",
            },
          },
        ),
    )
    .get("/react", () =>
      handleReactPageRequest(
        ReactVoiceDemo,
        asset(manifest, "ReactVoiceDemoIndex"),
        {
          cssPath: asset(manifest, "VoiceDemoCSS"),
        },
      ),
    )
    .get("/svelte", async () => {
      const SvelteVoiceDemo = (
        await import("../../frontend/svelte/pages/SvelteVoiceDemo.svelte")
      ).default;

      return handleSveltePageRequest(
        SvelteVoiceDemo,
        asset(manifest, "SvelteVoiceDemo"),
        asset(manifest, "SvelteVoiceDemoIndex"),
        {
          cssPath: asset(manifest, "VoiceDemoCSS"),
        },
      );
    })
    .get("/vue", async () => {
      const { VueVoiceDemo } = (await import("../vueImporter")).vueImports;

      return handleVuePageRequest(
        VueVoiceDemo,
        asset(manifest, "VueVoiceDemo"),
        asset(manifest, "VueVoiceDemoIndex"),
        generateHeadElement({
          cssPath: asset(manifest, "VoiceDemoCSS"),
          title: "AbsoluteJS Voice Intake - Vue",
        }),
      );
    })
    .get("/html", () => handleHTMLPageRequest(asset(manifest, "HtmlVoiceDemo")))
    .get("/htmx", () => handleHTMXPageRequest(asset(manifest, "HtmxVoiceDemo")))
    .get("/angular", async () =>
      handleAngularPageRequest(
        () => import("../../frontend/angular/pages/angular-voice-demo"),
        asset(manifest, "AngularVoiceDemo"),
        asset(manifest, "AngularVoiceDemoIndex"),
        generateHeadElement({
          cssPath: asset(manifest, "VoiceDemoCSS"),
          title: "AbsoluteJS Voice Intake - Angular",
        }),
      ),
    );
