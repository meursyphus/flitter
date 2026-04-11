import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const baseURL = process.env.STORYBOOK_BASE_URL ?? "http://127.0.0.1:6007";
const renderers = ["svg", "canvas"] as const;
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const evaluationCases = JSON.parse(
  fs.readFileSync(
    path.resolve(currentDir, "../../../docs/public/llm/evaluation-cases.json"),
    "utf8"
  )
) as Array<{ storyExport: string }>;

test.describe("Chart Storybook LLM evaluation", () => {
  test("renders every LLMEvaluation story in svg and canvas", async ({ browser, request }) => {
    test.setTimeout(180000);

    const response = await request.get(`${baseURL}/index.json`);
    expect(response.ok()).toBeTruthy();

    const index = (await response.json()) as {
      entries: Record<string, { id: string; title: string; type: string }>;
    };

    const stories = Object.values(index.entries).filter(
      (entry) => entry.title === "Charts/LLMEvaluation" && entry.type === "story"
    );

    expect(stories).toHaveLength(evaluationCases.length);

    for (const renderer of renderers) {
      for (const story of stories) {
        const page = await browser.newPage();
        const consoleErrors: string[] = [];
        const pageErrors: string[] = [];

        page.on("console", (message) => {
          if (message.type() === "error" && !message.text().includes("favicon")) {
            consoleErrors.push(message.text());
          }
        });

        page.on("pageerror", (error) => {
          pageErrors.push(error.message);
        });

        await page.goto(
          `${baseURL}/iframe.html?id=${story.id}&viewMode=story&args=renderer:${renderer}`,
          { waitUntil: "networkidle" }
        );

        await expect(page.getByTestId("llm-eval-story")).toBeVisible();
        await expect(page.locator("svg, canvas, [data-llm-eval-dom=\"true\"]").first()).toBeVisible();

        expect(pageErrors, `${story.id} emitted page errors`).toEqual([]);
        expect(consoleErrors, `${story.id} emitted console errors`).toEqual([]);

        await page.close();
      }
    }
  });
});
