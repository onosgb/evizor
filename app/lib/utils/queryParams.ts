import { ListQueryParams } from "@/app/models/QueryParams";

/**
 * Builds a clean query object from ListQueryParams, omitting any fields
 * that are undefined, null, or empty string so they are never sent to the API.
 */
export function buildQueryParams(
  params?: ListQueryParams,
): Record<string, string | number> {
  const query: Record<string, string | number> = {};
  if (!params) return query;

  if (params.page)     query.page     = params.page;
  if (params.limit)    query.limit    = params.limit;
  if (params.search)   query.search   = params.search;
  if (params.tenantId) query.tenantId = params.tenantId;
  if (params.status)   query.status   = params.status;
  if (params.role)     query.role     = params.role;
  if (params.from)     query.from     = params.from;
  if (params.to)       query.to       = params.to;

  return query;
}
