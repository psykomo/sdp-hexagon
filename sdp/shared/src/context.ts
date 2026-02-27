export interface RequestContext {
  userId?: string;
  userRoles: string[];
  permissions: string[];
  requestId: string;
  startedAt: Date;
  ip?: string;
  userAgent?: string;
}
