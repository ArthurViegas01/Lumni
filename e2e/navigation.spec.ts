import { expect, test } from "./fixtures";

test.describe("troca de idioma", () => {
  test.skip(
    ({ isMobile }) => isMobile,
    "o link do header é o do desktop; o mobile é testado abaixo",
  );

  test("leva para a mesma página no outro idioma", async ({ page }) => {
    await page.goto("/pt/servicos/ti-gerenciada");
    await page.getByRole("banner").getByRole("link", { name: "Ver o site em inglês" }).click();
    await expect(page).toHaveURL(/\/en\/services\/managed-it$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    await page
      .getByRole("banner")
      .getByRole("link", { name: "View the site in Portuguese" })
      .click();
    await expect(page).toHaveURL(/\/pt\/servicos\/ti-gerenciada$/);
  });

  test("sem equivalente, cai no hub de serviços", async ({ page }) => {
    await page.goto("/pt/servicos/presenca-digital");
    await page.getByRole("banner").getByRole("link", { name: "Ver o site em inglês" }).click();
    await expect(page).toHaveURL(/\/en\/services$/);
  });
});

test("hub lista as frentes do idioma e cada card abre a página certa", async ({ page }) => {
  await page.goto("/en/services");
  const main = page.getByRole("main");
  await expect(main.getByRole("link", { name: /Managed IT/i }).first()).toBeVisible();
  await expect(main.locator('a[href="/en/services/presenca-digital"]')).toHaveCount(0);

  await main.locator('a[href="/en/services/automation"]').first().click();
  await expect(page).toHaveURL(/\/en\/services\/automation$/);
  await expect(page.locator("h1")).toBeVisible();
});

test("rodapé só linka páginas que existem no idioma", async ({ page, request }) => {
  await page.goto("/en/team");
  const hrefs = await page
    .getByRole("contentinfo")
    .locator("a[href^='/']")
    .evaluateAll((links) => links.map((l) => l.getAttribute("href")!.split("#")[0]!));
  for (const href of new Set(hrefs)) {
    const res = await request.get(href, { maxRedirects: 0 });
    expect(res.status(), href).toBe(200);
  }
});

test.describe("menu mobile", () => {
  test.skip(({ isMobile }) => !isMobile, "só existe no mobile");

  test("abre, prende o foco, fecha com Esc e devolve o foco ao botão", async ({ page }) => {
    await page.goto("/pt");
    // O nome acessível do botão muda ao abrir: localizar pelo aria-controls, não pelo nome.
    const button = page.locator("button[aria-controls]");
    const panel = page.locator(`[id="${await button.getAttribute("aria-controls")}"]`);
    await expect(button).toHaveAccessibleName("Abrir menu");
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(button).toHaveAccessibleName("Fechar menu");
    await expect(panel.getByRole("link", { name: "Serviços" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(button).toBeFocused();
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("link do menu navega e fecha o painel", async ({ page }) => {
    await page.goto("/pt");
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await page.getByRole("link", { name: "Especialidades" }).last().click();
    await expect(page).toHaveURL(/\/pt\/time$/);
    await expect(page.getByRole("button", { name: "Abrir menu" })).toBeVisible();
  });

  test("troca de idioma pelo menu mantém a página", async ({ page }) => {
    await page.goto("/pt/time");
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await page.getByRole("link", { name: "Ver o site em inglês" }).last().click();
    await expect(page).toHaveURL(/\/en\/team$/);
  });
});

test("404 próprio para rota inexistente", async ({ page }) => {
  // O 404 é esperado aqui; o navegador registra o recurso que falhou no console.
  page.removeAllListeners("console");
  const res = await page.goto("/pt/nao-existe");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Page not found");
});
