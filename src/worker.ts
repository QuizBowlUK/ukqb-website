import { isEmail } from "./utils/email.ts";

// Cloudflare Worker: serves the static site from dist/ and handles the one
// dynamic route we need. Runs only for requests that match no static asset.
interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  MAILERLITE_API_KEY?: string;
  MAILERLITE_GROUP_ID?: string;
}

const SUBSCRIBERS_URL = "https://connect.mailerlite.com/api/subscribers";

// Messages are fixed strings, never user input, so no escaping is needed.
const page = (title: string, message: string, status = 200) =>
  new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} • UK Quizbowl</title>
  </head>
  <body style="margin:0;padding:3rem 1.5rem;background:#fffafa;color:#111;font-family:'Atkinson Hyperlegible',sans-serif;font-size:1.25rem;text-align:center">
    <h1 style="color:#aa0000;font-size:2.25rem">${title}</h1>
    <p>${message}</p>
    <p><a href="/" style="color:#aa0000">Back to the website</a></p>
  </body>
</html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } },
  );

async function subscribe(request: Request, env: Env) {
  if (!env.MAILERLITE_API_KEY) {
    console.error("MAILERLITE_API_KEY is not set");
    return page(
      "Mailing list unavailable",
      "Sorry, the mailing list is not available right now. Please try again later.",
      500,
    );
  }

  const form = await request.formData();
  // Honeypot: bots fill every field, humans never see this one.
  if (form.get("company")) {
    return page(
      "Thanks for signing up",
      "We have added you to the mailing list.",
    );
  }

  const email = `${form.get("email") ?? ""}`.trim();
  if (!isEmail(email)) {
    return page(
      "Check your email address",
      "That does not look like an email address. Please go back and try again.",
      400,
    );
  }

  const response = await fetch(SUBSCRIBERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${env.MAILERLITE_API_KEY}`,
    },
    body: JSON.stringify({
      email,
      groups: env.MAILERLITE_GROUP_ID ? [env.MAILERLITE_GROUP_ID] : undefined,
      ip_address: request.headers.get("cf-connecting-ip") ?? undefined,
    }),
  });

  if (!response.ok) {
    console.error(
      `MailerLite subscribe failed: ${response.status} ${await response.text()}`,
    );
    return page(
      "Something went wrong",
      "Sorry, we could not add you to the mailing list. Please try again later.",
      502,
    );
  }

  return page(
    "Thanks for signing up",
    "We have added you to the mailing list. If you get a confirmation email, click the link inside it to finish signing up.",
  );
}

export default {
  async fetch(request: Request, env: Env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/subscribe" && request.method === "POST") {
      return subscribe(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
