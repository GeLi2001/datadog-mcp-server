import {
  createDatadogConfiguration,
  createToolLogger,
  datadogRequest,
  handleApiError,
} from "../lib/index.js";
import type { PostureFindingResponse } from "../lib/types.js";

const log = createToolLogger("get-security-finding");

interface GetSecurityFindingParams {
  findingId: string;
}

// We still need to call initialize() for API compatibility,
// but the configuration is created per-request for the HTTP client
let initialized = false;

export const getSecurityFinding = {
  initialize: () => {
    log.debug("initialize() called");
    // Validate that configuration can be created (this checks env vars)
    createDatadogConfiguration({
      service: "default",
    });
    initialized = true;
  },

  execute: async (params: GetSecurityFindingParams) => {
    if (!initialized) {
      throw new Error("getSecurityFinding not initialized. Call initialize() first.");
    }

    try {
      const { findingId } = params;

      log.debug({ findingId }, "execute() called");

      const path = `/api/v2/posture_management/findings/${encodeURIComponent(findingId)}`;

      const data = await datadogRequest<PostureFindingResponse>({
        service: "default",
        path,
        method: "GET",
      });

      log.info({ findingId }, "get-security-finding completed");
      return data;
    } catch (error: unknown) {
      log.error({ findingId: params.findingId, error }, "get-security-finding failed");
      handleApiError(error, "fetching security finding");
    }
  },
};
