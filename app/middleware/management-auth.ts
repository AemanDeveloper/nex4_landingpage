export default defineNuxtRouteMiddleware(async () => {
  const headers = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;
  const session = await $fetch<{ authenticated: boolean }>(
    "/api/management/session",
    { headers },
  );

  if (!session.authenticated) {
    return navigateTo("/management/login");
  }
});
