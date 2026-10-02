import { THEME_STORAGE_KEY } from "../src/lib/theme";
import { expect, test } from "./fixtures";

const toDark = "Mudar para fundo preto";
const toLight = "Mudar para fundo branco";

const bgOf = (page: import("@playwright/test").Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);

test.describe("modo de cor", () => {
  test("sem escolha salva, segue o sistema", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/pt");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(await bgOf(page)).toBe("rgb(255, 255, 255)");

    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/pt");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await bgOf(page)).toBe("rgb(10, 10, 10)");
  });

  test("o botão inverte, a escolha sobrevive à navegação e vence o sistema", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/pt");
    await page.getByRole("button", { name: toDark }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await page.evaluate((k) => localStorage.getItem(k), THEME_STORAGE_KEY)).toBe("dark");

    await page.goto("/pt/servicos");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("button", { name: toLight })).toBeVisible();

    await page.getByRole("button", { name: toLight }).click();
    await page.emulateMedia({ colorScheme: "dark" });
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("o modo é aplicado antes do primeiro paint (sem piscar)", async ({ page }) => {
    // O script do <head> roda antes de qualquer CSS pintar: no primeiro evento em que o
    // documento existe, o atributo já tem de estar lá.
    await page.addInitScript((key) => {
      localStorage.setItem(key, "dark");
      document.addEventListener("readystatechange", () => {
        if (document.readyState === "interactive") {
          (window as unknown as { themeAtParse: string | null }).themeAtParse =
            document.documentElement.getAttribute("data-theme");
        }
      });
    }, THEME_STORAGE_KEY);
    await page.goto("/pt");
    expect(
      await page.evaluate(() => (window as unknown as { themeAtParse: string }).themeAtParse),
    ).toBe("dark");
  });

  test("blocos invertidos invertem junto com o site", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/pt");
    const footer = page.getByRole("contentinfo");
    const footerBg = () => footer.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(await footerBg()).toBe("rgb(10, 10, 10)");
    await page.getByRole("button", { name: toDark }).click();
    expect(await footerBg()).toBe("rgb(242, 242, 240)");
  });
});
