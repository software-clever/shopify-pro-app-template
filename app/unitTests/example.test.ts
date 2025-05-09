/**
 * @jest-environment node
 */
import { describe, expect, test } from "@jest/globals";
describe("Fake test", () => {
  test("fake test number 1", () => {
    return expect(1).toBe(1);
  });
});
