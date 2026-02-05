import {
  createDatadogConfiguration,
  createToolLogger,
  datadogRequest,
  handleApiError,
} from "../lib/index.js";
import type { SecurityFindingsResponse } from "../lib/types.js";

const log = createToolLogger("search-security-findings");

interface SearchSecurityFindingsParams {
  filter?: {
    query?: string;
  };
  page?: {
    limit?: number;
    cursor?: string;
  };
  limit?: number;
}

// We still need to call initialize() for API compatibility,
// but the configuration is created per-request for the HTTP client
let initialized = false;

export const searchSecurityFindings = {
  initialize: () => {
    log.debug("initialize() called");
    // Validate that configuration can be created (this checks env vars)
    createDatadogConfiguration({
      service: "default",
    });
    initialized = true;
  },

  execute: async (params: SearchSecurityFindingsParams) => {
    if (!initialized) {
      throw new Error("searchSecurityFindings not initialized. Call initialize() first.");
    }

    try {
      const { filter, page, limit } = params;

      log.debug({ query: filter?.query, cursor: page?.cursor }, "execute() called");

      const queryParams = new URLSearchParams();
      if (filter?.query) {
        queryParams.append("filter[query]", filter.query);
      }
      if (page?.limit !== undefined) {
        queryParams.append("page[limit]", String(page.limit));
      }
      if (page?.cursor) {
        queryParams.append("page[cursor]", page.cursor);
      }

      const queryString = queryParams.toString();
      const path = queryString
        ? `/api/v2/security/findings?${queryString}`
        : "/api/v2/security/findings";

      const data = await datadogRequest<SecurityFindingsResponse>({
        service: "default",
        path,
        method: "GET",
      });

      if (limit && data.data && data.data.length > limit) {
        data.data = data.data.slice(0, limit);
      }

      log.info({ resultCount: data.data?.length || 0 }, "search-security-findings completed");
      return data;
    } catch (error: unknown) {
      log.error({ query: params.filter?.query, error }, "search-security-findings failed");
      handleApiError(error, "searching security findings");
    }
  },
};
