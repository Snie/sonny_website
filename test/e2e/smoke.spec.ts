import { expect, test } from "@playwright/test";

test.describe("Smoke test", () => {
	test("renders homepage with all sections and switches locale", async ({ page }) => {
		await page.goto("/en");

		// Verify page title
		await expect(page).toHaveTitle(/Sonny Monti/);

		// Verify all section headings are visible
		const headings = [
			"About",
			"Stack",
			"Work Experience",
			"Education",
			"Academic Work",
			"Languages",
			"Elsewhere",
		];

		for (const heading of headings) {
			await expect(page.getByRole("heading", { name: heading, level: 2 })).toBeVisible();
		}

		// Click locale switcher to IT
		await page.getByRole("button", { name: /EN/i }).click();
		await page.getByRole("menuitem", { name: "IT" }).click();

		// Verify URL changes to /it
		await expect(page).toHaveURL(/\/it/);
	});
});
