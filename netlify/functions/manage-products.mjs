
import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

const FILE_PATH = "src/data/products.json";
const COOKIE_NAME = "artiya_admin_session";
const SESSION_SECONDS = 60 * 60 * 8;

function response(status, data, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

function sign(value) {
  return createHmac("sha256", process.env.SESSION_SECRET)
    .update(value)
    .digest("base64url");
}

function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function createSession() {
  const payload = Buffer.from(
    JSON.stringify({
      admin: true,
      expires: Date.now() + SESSION_SECONDS * 1000,
    })
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

function validSession(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));

  if (!cookie) return false;

  const token = cookie.slice(COOKIE_NAME.length + 1);
  const separator = token.lastIndexOf(".");
  if (separator < 1) return false;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  if (!safeEqual(signature, sign(payload))) return false;

  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    return data.admin === true && data.expires > Date.now();
  } catch {
    return false;
  }
}

function cookie(value, maxAge) {
  return `${COOKIE_NAME}=${value}; HttpOnly; Secure; SameSite=Strict; Path=/.netlify/functions/manage-products; Max-Age=${maxAge}`;
}

function validProducts(products) {
  if (!Array.isArray(products) || products.length > 500) return false;

  const ids = new Set();

  return products.every((p) => {
    if (!p || typeof p !== "object" || Array.isArray(p)) return false;

    const valid =
      typeof p.id === "string" &&
      p.id.length > 0 &&
      p.id.length <= 100 &&
      !ids.has(p.id) &&
      typeof p.name === "string" &&
      p.name.trim().length > 0 &&
      p.name.length <= 200 &&
      typeof p.price === "number" &&
      Number.isFinite(p.price) &&
      p.price >= 0 &&
      typeof p.category === "string" &&
      p.category.length <= 100 &&
      typeof p.description === "string" &&
      p.description.length <= 5000 &&
      Array.isArray(p.images) &&
      p.images.length <= 20 &&
      p.images.every(
        (url) =>
          typeof url === "string" &&
          url.length <= 2048 &&
          (url.startsWith("/") || url.startsWith("https://"))
      ) &&
      typeof p.available === "boolean" &&
      typeof p.featured === "boolean" &&
      Array.isArray(p.tags) &&
      p.tags.every((tag) => typeof tag === "string");

    if (valid) ids.add(p.id);
    return valid;
  });
}

export default async (request) => {
  if (request.method !== "POST") {
    return response(405, { error: "Method not allowed" });
  }

  const deployContext =
    process.env.CONTEXT || process.env.NETLIFY_CONTEXT;
  
  // if (deployContext !== "production") {
  //   return response(403, { error: "Production only" });
  // }

  if (
    process.env.CONTEXT !== "production" &&
    process.env.NETLIFY_CONTEXT !== "production"
  ) {
    console.error("Deployment context:", {
      CONTEXT: process.env.CONTEXT,
      NETLIFY_CONTEXT: process.env.NETLIFY_CONTEXT,
    });
  
    return response(403, { error: "Production only" });
  }

  const origin = request.headers.get("origin");
  const expectedOrigin = new URL(request.url).origin;

  if (!origin || origin !== expectedOrigin) {
    return response(403, { error: "Invalid request origin" });
  }

  const {
    GITHUB_TOKEN,
    GITHUB_OWNER,
    GITHUB_REPO,
    GITHUB_BRANCH,
    ADMIN_PASSWORD,
    SESSION_SECRET,
  } = process.env;

  if (
    !GITHUB_TOKEN ||
    !GITHUB_OWNER ||
    !GITHUB_REPO ||
    !GITHUB_BRANCH ||
    !ADMIN_PASSWORD ||
    !SESSION_SECRET
  ) {
    return response(500, { error: "Server configuration is incomplete" });
  }

  try {
    const text = await request.text();

    if (text.length > 1_000_000) {
      return response(413, { error: "Request too large" });
    }

    const body = JSON.parse(text);

    if (body.action === "login") {
      if (!safeEqual(body.password, ADMIN_PASSWORD)) {
        return response(401, { error: "Invalid admin password" });
      }

      return response(
        200,
        { success: true },
        {
          "Set-Cookie": cookie(createSession(), SESSION_SECONDS),
        }
      );
    }

    if (body.action === "logout") {
      return response(
        200,
        { success: true },
        { "Set-Cookie": cookie("", 0) }
      );
    }

    if (!validSession(request)) {
      return response(401, { error: "Please log in again" });
    }

    if (body.action !== "save-products" || !validProducts(body.products)) {
      return response(400, { error: "Invalid product data" });
    }

    const endpoint =
      `https://api.github.com/repos/${encodeURIComponent(GITHUB_OWNER)}/` +
      `${encodeURIComponent(GITHUB_REPO)}/contents/${FILE_PATH}`;

    const headers = {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    };

    const currentResponse = await fetch(
      `${endpoint}?ref=${encodeURIComponent(GITHUB_BRANCH)}`,
      { headers }
    );

    if (!currentResponse.ok) {
      console.error("GitHub read failed:", currentResponse.status);
      return response(502, { error: "Could not read products from GitHub" });
    }

    const currentFile = await currentResponse.json();

    const content = Buffer.from(
      JSON.stringify(body.products, null, 2) + "\n"
    ).toString("base64");

    const updateResponse = await fetch(endpoint, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: "Update Artiya Studio products from admin",
        content,
        sha: currentFile.sha,
        branch: GITHUB_BRANCH,
      }),
    });

    if (!updateResponse.ok) {
      console.error("GitHub update failed:", updateResponse.status);
      return response(502, { error: "GitHub could not save the changes" });
    }

    return response(200, {
      success: true,
      message: "Products saved to GitHub. Netlify will redeploy the site.",
    });
  } catch (error) {
    console.error("Admin function error:", error.message);
    return response(400, { error: "Invalid request or update failed" });
  }
};
