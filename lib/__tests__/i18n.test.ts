vi.mock("next-intl/server", () => ({
  getRequestConfig: (fn: unknown) => fn,
}));

import { locales, defaultLocale } from "../i18n";
import enMessages from "../../messages/en.json";
import itMessages from "../../messages/it.json";
import deMessages from "../../messages/de.json";
import frMessages from "../../messages/fr.json";

const expectedKeys = [
  "hero",
  "about",
  "experience",
  "education",
  "academic",
  "languages",
  "skills",
  "elsewhere",
  "authorNote",
];

describe("i18n", () => {
  it("exports locales as [en, it, de, fr]", () => {
    expect(locales).toEqual(["en", "it", "de", "fr"]);
  });

  it("exports defaultLocale as 'en'", () => {
    expect(defaultLocale).toBe("en");
  });

  it.each([
    ["en", enMessages],
    ["it", itMessages],
    ["de", deMessages],
    ["fr", frMessages],
  ] as const)("%s locale file contains expected top-level keys", (_name, messages) => {
    for (const key of expectedKeys) {
      expect(messages).toHaveProperty(key);
    }
  });
});
