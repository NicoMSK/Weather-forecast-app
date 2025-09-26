import { expect, test } from "vitest";
import { formatDate } from "@/model/formatDate";

test("date current", () => {
  expect(formatDate(new Date(2025, 8, 3))).toBe("Сент 3, Ср");
});
