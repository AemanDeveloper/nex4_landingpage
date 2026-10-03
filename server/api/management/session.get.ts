export default defineEventHandler(async (event) => ({
  authenticated: await hasValidManagementSession(event),
  configured: isManagementAuthConfigured(event),
}));
