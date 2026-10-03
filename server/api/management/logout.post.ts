export default defineEventHandler((event) => {
  clearManagementSession(event);
  return { authenticated: false };
});
