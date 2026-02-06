import {
  createDatadogConfiguration,
  createToolLogger,
  datadogRequest,
  handleApiError,
} from "../lib/index.js";
import type { PostureFindingsResponse } from "../lib/types.js";

const log = createToolLogger("list-posture-findings");

interface ListPostureFindingsParams {
  filter?: {
    tags?: string[];
    evaluation?: "pass" | "fail";
    status?: "open" | "resolved" | "dismissed";
    ruleId?: string;
    ruleName?: string;
    resourceType?: string;
    resourceId?: string;
    muted?: boolean;
    evaluationChangedAt?: string;
    discoveryTimestamp?: string;
  };
  page?: {
    limit?: number;
    cursor?: string;
  };
  snapshotTimestamp?: number;
  detailedFindings?: boolean;
  limit?: number;
}

const FILTER_PARAM_MAP: Record<string, string> = {
  evaluation: "filter[evaluation]",
  status: "filter[status]",
  ruleId: "filter[rule_id]",
  ruleName: "filter[rule_name]",
  resourceType: "filter[resource_type]",
  resourceId: "filter[@resource_id]",
  muted: "filter[muted]",
  evaluationChangedAt: "filter[evaluation_changed_at]",
  discoveryTimestamp: "filter[discovery_timestamp]",
};

function buildQueryParams(params: ListPostureFindingsParams): URLSearchParams {
  const qp = new URLSearchParams();
  const { filter, page, snapshotTimestamp, detailedFindings } = params;

  if (filter?.tags?.length) {
    for (const tag of filter.tags) {
      qp.append("filter[tags]", tag);
    }
  }

  for (const [key, paramName] of Object.entries(FILTER_PARAM_MAP)) {
    const value = filter?.[key as keyof typeof filter];
    if (value !== undefined) {
      qp.append(paramName, String(value));
    }
  }

  if (page?.limit !== undefined) {
    qp.append("page[limit]", String(page.limit));
  }
  if (page?.cursor) {
    qp.append("page[cursor]", page.cursor);
  }
  if (snapshotTimestamp !== undefined) {
    qp.append("snapshot_timestamp", String(snapshotTimestamp));
  }
  if (detailedFindings !== undefined) {
    qp.append("detailed_findings", String(detailedFindings));
  }

  return qp;
}

// We still need to call initialize() for API compatibility,
// but the configuration is created per-request for the HTTP client
let initialized = false;

export const listPostureFindings = {
  initialize: () => {
    log.debug("initialize() called");
    // Validate that configuration can be created (this checks env vars)
    createDatadogConfiguration({
      service: "default",
    });
    initialized = true;
  },

  execute: async (params: ListPostureFindingsParams) => {
    if (!initialized) {
      throw new Error("listPostureFindings not initialized. Call initialize() first.");
    }

    try {
      log.debug(
        {
          evaluation: params.filter?.evaluation,
          status: params.filter?.status,
          cursor: params.page?.cursor,
        },
        "execute() called",
      );

      const queryParams = buildQueryParams(params);
      const queryString = queryParams.toString();
      const path = queryString
        ? `/api/v2/posture_management/findings?${queryString}`
        : "/api/v2/posture_management/findings";

      const data = await datadogRequest<PostureFindingsResponse>({
        service: "default",
        path,
        method: "GET",
      });

      if (params.limit && data.data && data.data.length > params.limit) {
        data.data = data.data.slice(0, params.limit);
      }

      log.info({ resultCount: data.data?.length || 0 }, "list-posture-findings completed");
      return data;
    } catch (error: unknown) {
      log.error({ error }, "list-posture-findings failed");
      handleApiError(error, "listing posture findings");
    }
  },
};
