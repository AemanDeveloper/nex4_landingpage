# NEX4 traffic analytics integration

The management dashboard accepts privacy-minimised events from the NEX4 landing
page, LMS Owner, CRM, and NutriTrack projects. Each source receives a separate
server-only token.

The landing page records page views, section impressions, button/link clicks,
device category, and a short traffic-source label. It never stores an IP address,
full referrer URL, credential, or personal profile data.

## 1. Create a source token

Run this in the NEX4 landing-page project with `NUXT_DATABASE_URL` configured:

```bash
npm run analytics:create-source -- lms-owner
npm run analytics:create-source -- crm
npm run analytics:create-source -- nutritrack
npm run analytics:create-source -- landing
```

Save each generated token in the matching application project as a server-only
environment variable named `NEX4_ANALYTICS_TOKEN`. Never expose it through
`runtimeConfig.public` or client-side code.

Also set this server-only value in each application project:

```text
NEX4_ANALYTICS_ENDPOINT=https://www.nex4.my/api/telemetry/traffic
```

## 2. Forward a page view from the application server

Send the event from a Nuxt server route or server middleware. The browser should
call its own application server, not the central telemetry endpoint directly.

```ts
await $fetch(process.env.NEX4_ANALYTICS_ENDPOINT!, {
  method: "POST",
  headers: {
    authorization: `Bearer ${process.env.NEX4_ANALYTICS_TOKEN}`,
  },
  body: {
    path: "/dashboard",
    visitorId: "anonymous-first-party-id",
    sessionId: "anonymous-session-id",
  },
});
```

Only the path and HMAC-hashed anonymous identifiers are stored centrally. Do not
send names, email addresses, IP addresses, full referrer URLs, or credentials.
