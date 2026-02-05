import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSecurityFinding } from "./getSecurityFinding.js";

describe("getSecurityFinding", () => {
  const originalEnv = process.env;
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      DD_API_KEY: "test-api-key",
      DD_APP_KEY: "test-app-key",
      DD_SITE: "datadoghq.com",
    };
    vi.stubGlobal("fetch", mockFetch);
    mockFetch.mockReset();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.unstubAllGlobals();
  });

  describe("initialize", () => {
    it("sets initialized state", () => {
      expect(() => getSecurityFinding.initialize()).not.toThrow();
    });
  });

  describe("execute", () => {
    it("throws if not initialized", async () => {
      vi.resetModules();
      const { getSecurityFinding: freshGet } = await import("./getSecurityFinding.js");

      await expect(freshGet.execute({ findingId: "abc" })).rejects.toThrow(
        "getSecurityFinding not initialized",
      );
    });

    it("fetches finding by ID", async () => {
      getSecurityFinding.initialize();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { id: "finding-1" } }),
      });

      await getSecurityFinding.execute({ findingId: "finding-1" });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/v2/posture_management/findings/finding-1"),
        expect.objectContaining({ method: "GET" }),
      );
    });
  });
});
