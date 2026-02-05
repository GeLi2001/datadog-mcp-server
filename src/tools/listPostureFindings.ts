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
      const { filter, page, snapshotTimestamp, detailedFindings, limit } = params;

      log.debug(
        { evaluation: filter?.evaluation, status: filter?.status, cursor: page?.cursor },
        "execute() called",
      );

      const queryParams = new URLSearchParams();

      if (filter?.tags?.length) {
        for (const tag of filter.tags) {
          queryParams.append("filter[tags]", tag);
        }
      }
      if (filter?.evaluation) {
        queryParams.append("filter[evaluation]", filter.evaluation);
      }
      if (filter?.status) {
        queryParams.append("filter[status]", filter.status);
      }
      if (filter?.ruleId) {
        queryParams.append("filter[rule_id]", filter.ruleId);
      }
      if (filter?.ruleName) {
        queryParams.append("filter[rule_name]", filter.ruleName);
      }
      if (filter?.resourceType) {
        queryParams.append("filter[resource_type]", filter.resourceType);
      }
      if (filter?.resourceId) {
        queryParams.append("filter[@resource_id]", filter.resourceId);
      }
      if (filter?.muted !== undefined) {
        queryParams.append("filter[muted]", String(filter.muted));
      }
      if (filter?.evaluationChangedAt) {
        queryParams.append("filter[evaluation_changed_at]", filter.evaluationChangedAt);
      }
      if (filter?.discoveryTimestamp) {
        queryParams.append("filter[discovery_timestamp]", filter.discoveryTimestamp);
      }
      if (page?.limit !== undefined) {
        queryParams.append("page[limit]", String(page.limit));
      }
      if (page?.cursor) {
        queryParams.append("page[cursor]", page.cursor);
      }
      if (snapshotTimestamp !== undefined) {
        queryParams.append("snapshot_timestamp", String(snapshotTimestamp));
      }
      if (detailedFindings !== undefined) {
        queryParams.append("detailed_findings", String(detailedFindings));
      }

      const queryString = queryParams.toString();
      const path = queryString
        ? `/api/v2/posture_management/findings?${queryString}`
        : "/api/v2/posture_management/findings";

      const data = await datadogRequest<PostureFindingsResponse>({
        service: "default",
        path,
        method: "GET",
      });

      if (limit && data.data && data.data.length > limit) {
        data.data = data.data.slice(0, limit);
      }

      log.info({ resultCount: data.data?.length || 0 }, "list-posture-findings completed");
      return data;
    } catch (error: unknown) {
      log.error({ error }, "list-posture-findings failed");
      handleApiError(error, "listing posture findings");
    }
  },
};
