// Minimal Soldgraph API client. Node 18+ (built-in fetch), no dependencies.

import { randomUUID } from "node:crypto";

const HOST = "https://api.soldgraph.com";
const MAX_WAIT = 60; // seconds; quota_exceeded and upstream_daily_limit ask for much longer
const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000));

function auth() {
  const key = process.env.SOLDGRAPH_KEY;
  if (!key) throw new Error("Set SOLDGRAPH_KEY. Get a free key at https://soldgraph.com/signup?utm_source=github&utm_medium=referral&utm_campaign=soldgraph-examples");
  return { Authorization: `Bearer ${key}` };
}

async function call(url, headers, tries = 5) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers });
    const body = await res.json().catch(() => null);
    if (res.status === 200 || res.status === 202) return body;
    if (body?.status === "failed") return body; // replay of a failed search
    const retryable = res.status === 429 || res.status >= 500;
    const wait = Number(res.headers.get("Retry-After")) || 2 ** attempt;
    if (!retryable || attempt + 1 >= tries || wait > MAX_WAIT) {
      throw new Error(`Soldgraph ${res.status} ${body?.error?.code ?? ""} (X-Request-Id ${res.headers.get("X-Request-Id")})`);
    }
    await sleep(wait);
  }
}

/** Run one search, like search("/ebay/sold", { q: "sony wh-1000xm5" }), and return its result. */
export async function search(path, params) {
  const headers = auth();
  const key = randomUUID(); // one key per search, reused on retries so a retry is never charged twice
  let job = await call(`${HOST}/v1${path}?${new URLSearchParams(params)}`, { ...headers, "Idempotency-Key": key });
  const deadline = Date.now() + 5 * 60_000;
  while (job.status === "pending") {
    if (Date.now() > deadline) throw new Error(`Soldgraph job ${job.request_id} still pending`);
    job = await call(`${HOST}${job.poll_url}?wait=20`, headers); // poll_url is a path, not under /v1
  }
  if (job.status === "failed") throw new Error(`Soldgraph job failed: ${job.error.code}`);
  return job.result;
}
