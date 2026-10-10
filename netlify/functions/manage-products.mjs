
import { timingSafeEqual } from "node:crypto";

const API_BASE = "https://api.github.com";
const FILE_PATH = "src/data/products.json";

function jsonResponse(statusCode, data) {
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function validPassword(supplied, expected) {
  if (typeof supplied !== "string" || !expected) return false;

  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);

  return a.length === b.length && timingSafeEqual(a, b);
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
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;

  if (origin && origin !== requestOrigin) {
    return jsonResponse(403, { error: "Invalid request origin" });
  }

  if (process.env.CONTEXT !== "production") {
    return jsonResponse(403, {
      error: "Product management is disabled outside production",
    });
  }

  const {
    GITHUB_TOKEN,
    GITHUB_OWNER,
    GITHUB_REPO,
    GITHUB_BRANCH,
    ADMIN_PASSWORD,
  } = process.env;

  if (
    !GITHUB_TOKEN ||
    !GITHUB_OWNER ||
    !GITHUB_REPO ||
    !GITHUB_BRANCH ||
    !ADMIN_PASSWORD
  ) {
    return jsonResponse(500, {
      error: "Server configuration is incomplete",
    });
  }

  try {
    const bodyText = await request.text();

    if (bodyText.length > 1_000_000) {
      return jsonResponse(413, { error: "Request is too large" });
    }

    const body = JSON.parse(bodyText);

    if (!validPassword(body.password, ADMIN_PASSWORD)) {
      return jsonResponse(401, { error: "Invalid admin password" });
    }

    if (!validProducts(body.products)) {
      return jsonResponse(400, {
        error: "Invalid product data",
      });
    }

    const endpoint =
      `${API_BASE}/repos/${encodeURIComponent(GITHUB_OWNER)}/` +
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
      return jsonResponse(502, {
        error: "Could not read the product file from GitHub",
      });
    }

    const currentFile = await currentResponse.json();

    const updatedContent = Buffer.from(
      JSON.stringify(body.products, null, 2) + "\n"
    ).toString("base64");

    const updateResponse = await fetch(endpoint, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: "Update Artiya Studio products from admin",
        content: updatedContent,
        sha: currentFile.sha,
        branch: GITHUB_BRANCH,
      }),
    });

    if (!updateResponse.ok) {
      console.error("GitHub update failed:", updateResponse.status);
      return jsonResponse(502, {
        error: "GitHub could not save the changes. Please try again.",
      });
    }

    return jsonResponse(200, {
      success: true,
      message: "Products saved to GitHub. Netlify will redeploy the site.",
    });
  } catch (error) {
    console.error("Product update failed:", error.message);
    return jsonResponse(400, { error: "Invalid request or update failed" });
  }
};
