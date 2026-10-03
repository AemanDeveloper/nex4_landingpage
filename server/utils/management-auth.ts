import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import type { H3Event } from "h3";
import type { ManagementUser } from "./database";

const sessionCookieName = "nex4_management_session";
const sessionDurationSeconds = 60 * 60 * 8;

function getSessionSecret(event: H3Event) {
  return useRuntimeConfig(event).managementSessionSecret.trim();
}

export function isManagementAuthConfigured(event: H3Event) {
  const config = useRuntimeConfig(event);
  return Boolean(config.databaseUrl.trim() && getSessionSecret(event));
}

export async function verifyManagementCredentials(
  event: H3Event,
  username: string,
  password: string,
) {
  const user = await findManagementUserByUsername(event, username.toLowerCase());
  if (!user) return null;

  const [, algorithm, salt, expectedHex] = user.password_hash.split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHex) return null;

  try {
    const expected = Buffer.from(expectedHex, "hex");
    const actual = scryptSync(password, salt, expected.length);

    return expected.length > 0 && timingSafeEqual(actual, expected) ? user : null;
  } catch {
    return null;
  }
}

function signSession(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function requestUsesHttps(event: H3Event) {
  const forwardedProtocol = getHeader(event, "x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();

  return forwardedProtocol === "https" || getRequestURL(event).protocol === "https:";
}

export function createManagementSession(
  event: H3Event,
  user: Pick<ManagementUser, "id" | "username">,
) {
  const sessionSecret = getSessionSecret(event);
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      username: user.username,
      exp: Math.floor(Date.now() / 1000) + sessionDurationSeconds,
    }),
  ).toString("base64url");
  const token = `${payload}.${signSession(payload, sessionSecret)}`;

  setCookie(event, sessionCookieName, token, {
    httpOnly: true,
    secure: requestUsesHttps(event),
    sameSite: "strict",
    path: "/",
    maxAge: sessionDurationSeconds,
  });
}

export function clearManagementSession(event: H3Event) {
  deleteCookie(event, sessionCookieName, {
    httpOnly: true,
    secure: requestUsesHttps(event),
    sameSite: "strict",
    path: "/",
  });
}

export async function hasValidManagementSession(event: H3Event) {
  const sessionSecret = getSessionSecret(event);
  const token = getCookie(event, sessionCookieName);

  if (!token || !sessionSecret) return false;

  const separatorIndex = token.lastIndexOf(".");
  if (separatorIndex < 1) return false;

  const payload = token.slice(0, separatorIndex);
  const suppliedSignature = token.slice(separatorIndex + 1);
  const expectedSignature = signSession(payload, sessionSecret);

  try {
    const supplied = Buffer.from(suppliedSignature, "base64url");
    const expected = Buffer.from(expectedSignature, "base64url");
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
      return false;
    }

    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      sub?: string;
      username?: string;
      exp?: number;
    };

    if (
      !session.sub ||
      !session.username ||
      typeof session.exp !== "number" ||
      session.exp <= Math.floor(Date.now() / 1000)
    ) {
      return false;
    }

    const user = await findActiveManagementUserById(event, session.sub);
    return user?.username === session.username;
  } catch {
    return false;
  }
}
