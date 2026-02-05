import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { listPostureFindings } from "./listPostureFindings.js";

describe("listPostureFindings", () => {
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
      expect(() => listPostureFindings.initialize()).not.toThrow();
    });
  });

  describe("execute", () => {
    it("throws if not initialized", async () => {
      vi.resetModules();
      const { listPostureFindings: freshList } = await import("./listPostureFindings.js");

      await expect(freshList.execute({})).rejects.toThrow("listPostureFindings not initialized");
    });

    it("passes filters and pagination parameters", async () => {
      listPostureFindings.initialize();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      });

      await listPostureFindings.execute({
        filter: {
          evaluation: "fail",
          status: "open",
          tags: ["env:prod"],
          resourceId: "i-123",
          muted: false,
        },
        page: { limit: 20, cursor: "next-page" },
        detailedFindings: true,
        snapshotTimestamp: 1720000000,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("filter%5Bevaluation%5D=fail"),
        expect.objectContaining({ method: "GET" }),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("filter%5Bstatus%5D=open"),
        expect.any(Object),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("filter%5Btags%5D=env%3Aprod"),
        expect.any(Object),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("filter%5B%40resource_id%5D=i-123"),
        expect.any(Object),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("filter%5Bmuted%5D=false"),
        expect.any(Object),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("page%5Blimit%5D=20"),
        expect.any(Object),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("page%5Bcursor%5D=next-page"),
        expect.any(Object),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("snapshot_timestamp=1720000000"),
        expect.any(Object),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("detailed_findings=true"),
        expect.any(Object),
      );
    });
  });
});
