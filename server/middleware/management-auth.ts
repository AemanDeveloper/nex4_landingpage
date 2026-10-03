export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;
  const isManagementPage =
    path === "/management" ||
    (path.startsWith("/management/") && path !== "/management/login");
  const isProtectedApi =
    path.startsWith("/api/management/") &&
    ![
      "/api/management/login",
      "/api/management/session",
    ].includes(path);

  if (!isManagementPage && !isProtectedApi) return;
  if (await hasValidManagementSession(event)) return;

  if (isProtectedApi) {
    throw createError({ statusCode: 401, statusMessage: "Authentication required" });
  }

  return sendRedirect(event, "/management/login", 302);
});
