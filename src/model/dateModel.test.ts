import { expect, test } from "vitest";
import { dateCurrent } from "@/model/dateModel";

test("date current", () => {
  expect(dateCurrent(new Date(2025, 8, 3))).toBe("Сент 3, Ср");
});
