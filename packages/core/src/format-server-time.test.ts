import { describe, expect, it } from "vitest";
import { formatServerTime } from "./format-server-time";

describe("formatServerTime", () => {
  it("formats an ISO timestamp for the given locale", () => {
    expect(formatServerTime("2026-01-02T03:04:05Z", "en-GB")).toContain("2026");
  });
});
