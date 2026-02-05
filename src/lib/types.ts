/**
 * Common response types for Datadog API endpoints that use raw HTTP calls.
 * These supplement the types from @datadog/datadog-api-client.
 */

/**
 * Log entry from the Datadog Logs API
 */
export interface LogEntry {
  id?: string;
  type?: string;
  attributes?: {
    timestamp?: string;
    status?: string;
    message?: string;
    service?: string;
    host?: string;
    tags?: string[];
    [key: string]: unknown;
  };
}

/**
 * Response from the logs search endpoint
 */
export interface LogsSearchResponse {
  data?: LogEntry[];
  meta?: {
    page?: {
      after?: string;
    };
    status?: string;
    elapsed?: number;
    request_id?: string;
  };
  links?: {
    next?: string;
  };
}

/**
 * Aggregation bucket from logs analytics
 */
export interface LogsAggregateBucket {
  by?: Record<string, string>;
  computes?: Record<string, number>;
}

/**
 * Response from the logs aggregate endpoint
 */
export interface LogsAggregateResponse {
  data?: {
    buckets?: LogsAggregateBucket[];
  };
  meta?: {
    status?: string;
    elapsed?: number;
    request_id?: string;
    page?: {
      after?: string;
    };
  };
}

/**
 * Span entry from the Datadog Spans API
 */
export interface SpanEntry {
  id?: string;
  type?: string;
  attributes?: {
    timestamp?: string;
    service?: string;
    resource_name?: string;
    span_id?: string;
    trace_id?: string;
    parent_id?: string;
    duration?: number;
    status?: string;
    error?: number;
    meta?: Record<string, string>;
    metrics?: Record<string, number>;
    [key: string]: unknown;
  };
}

/**
 * Response from the spans search endpoint
 */
export interface SpansSearchResponse {
  data?: SpanEntry[];
  meta?: {
    page?: {
      after?: string;
    };
    status?: string;
    elapsed?: number;
    request_id?: string;
  };
  links?: {
    next?: string;
  };
}

/**
 * Aggregation bucket from spans analytics
 */
export interface SpansAggregateBucket {
  by?: Record<string, string>;
  computes?: Record<string, number>;
}

/**
 * Response from the spans aggregate endpoint
 */
export interface SpansAggregateResponse {
  data?: {
    buckets?: SpansAggregateBucket[];
  };
  meta?: {
    status?: string;
    elapsed?: number;
    request_id?: string;
    page?: {
      after?: string;
    };
  };
}

/**
 * Security finding entry from the Datadog Security Findings API
 */
export interface SecurityFindingEntry {
  id?: string;
  type?: string;
  attributes?: Record<string, unknown>;
  relationships?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Response from the security findings list/search endpoint
 */
export interface SecurityFindingsResponse {
  data?: SecurityFindingEntry[];
  meta?: {
    page?: {
      after?: string;
    };
    status?: string;
    elapsed?: number;
    request_id?: string;
  };
  links?: {
    next?: string;
  };
}

/**
 * Legacy CSPM/CIEM finding entry from the posture management findings API
 */
export interface PostureFindingEntry {
  id?: string;
  type?: string;
  attributes?: Record<string, unknown>;
  relationships?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Response from the legacy posture management findings list endpoint
 */
export interface PostureFindingsResponse {
  data?: PostureFindingEntry[];
  meta?: {
    page?: {
      after?: string;
    };
    status?: string;
    elapsed?: number;
    request_id?: string;
  };
  links?: {
    next?: string;
  };
}

/**
 * Response from the legacy posture management get finding endpoint
 */
export interface PostureFindingResponse {
  data?: PostureFindingEntry;
}

/**
 * Service entry from the APM services endpoint
 */
export interface ServiceEntry {
  name: string;
  env?: string;
}

/**
 * Response from the services list endpoint (v1 API)
 */
export interface ServicesResponse {
  [serviceName: string]: {
    [envName: string]: unknown;
  };
}
