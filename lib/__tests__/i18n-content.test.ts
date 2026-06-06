import { getEntries } from "../i18n-content";

describe("getEntries", () => {
	it("returns the array unchanged when given an array of objects", () => {
		const raw = [{ role: "Engineer" }, { role: "Architect" }];
		expect(getEntries(raw, "experience.entries")).toBe(raw);
	});

	it("accepts an empty array", () => {
		expect(getEntries([], "experience.entries")).toEqual([]);
	});

	it("throws naming the key when the value is not an array", () => {
		expect(() => getEntries(undefined, "experience.entries")).toThrow("experience.entries");
		expect(() => getEntries({ role: "Engineer" }, "education.entries")).toThrow(
			"education.entries",
		);
	});

	it("throws naming the offending index when an item is not an object", () => {
		expect(() => getEntries([{ role: "Engineer" }, "oops"], "academic.entries")).toThrow(
			"academic.entries[1]",
		);
	});
});
