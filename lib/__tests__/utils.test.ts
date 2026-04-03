import { cn } from "../utils";

describe("cn", () => {
  it("merges normal classes", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("resolves Tailwind conflicts", () => {
    const result = cn("px-2", "px-4");
    expect(result).toBe("px-4");
  });

  it("filters conditional values", () => {
    expect(cn(false, undefined, null, "valid")).toBe("valid");
  });

  it("returns empty string when called with no args", () => {
    expect(cn()).toBe("");
  });
});
