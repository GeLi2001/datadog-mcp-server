import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { searchSecurityFindings } from "./searchSecurityFindings.js";

describe("searchSecurityFindings", () => {
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
      expect(() => searchSecurityFindings.initialize()).not.toThrow();
    });
  });

  describe("execute", () => {
    it("throws if not initialized", async () => {
      vi.resetModules();
      const { searchSecurityFindings: freshSearch } = await import("./searchSecurityFindings.js");

      await expect(freshSearch.execute({})).rejects.toThrow(
        "searchSecurityFindings not initialized",
      );
    });

    it("passes query and cursor parameters", async () => {
      searchSecurityFindings.initialize();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      });

      await searchSecurityFindings.execute({
        filter: { query: "@severity:high" },
        page: { cursor: "abc123", limit: 50 },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("filter%5Bquery%5D=%40severity%3Ahigh"),
        expect.objectContaining({ method: "GET" }),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("page%5Bcursor%5D=abc123"),
        expect.any(Object),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("page%5Blimit%5D=50"),
        expect.any(Object),
      );
    });
  });
});
