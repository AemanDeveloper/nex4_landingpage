type AttemptRecord = {
  count: number;
  resetAt: number;
};

const attempts = new Map<string, AttemptRecord>();
const attemptWindowMs = 15 * 60 * 1000;
const maximumAttempts = 5;

export default defineEventHandler(async (event) => {
  if (!isManagementAuthConfigured(event)) {
    throw createError({
      statusCode: 503,
      statusMessage: "Management login is not configured",
    });
  }

  const clientKey = getRequestIP(event, { xForwardedFor: true }) ?? "unknown";
  const now = Date.now();
  const currentAttempt = attempts.get(clientKey);

  if (currentAttempt && currentAttempt.resetAt > now && currentAttempt.count >= maximumAttempts) {
    throw createError({
      statusCode: 429,
      statusMessage: "Too many login attempts. Try again later.",
    });
  }

  const body = await readBody<{ username?: unknown; password?: unknown }>(event);
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  let user = null;

  if (username.length <= 100 && password.length <= 256) {
    try {
      user = await verifyManagementCredentials(event, username, password);
    } catch {
      throw createError({
        statusCode: 503,
        statusMessage: "Management database is unavailable",
      });
    }
  }

  if (!user) {
    const record = currentAttempt && currentAttempt.resetAt > now
      ? currentAttempt
      : { count: 0, resetAt: now + attemptWindowMs };
    record.count += 1;
    attempts.set(clientKey, record);

    throw createError({
      statusCode: 401,
      statusMessage: "Invalid username or password",
    });
  }

  attempts.delete(clientKey);
  await recordManagementLogin(event, user.id);
  createManagementSession(event, user);

  return { authenticated: true };
});
