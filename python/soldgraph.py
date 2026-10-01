"""Minimal Soldgraph API client. Needs `requests` and SOLDGRAPH_KEY in the environment."""

import os
import time
import uuid

import requests

HOST = "https://api.soldgraph.com"
MAX_WAIT = 60  # seconds; quota_exceeded and upstream_daily_limit ask for much longer


def _auth():
    key = os.environ.get("SOLDGRAPH_KEY")
    if not key:
        raise RuntimeError("Set SOLDGRAPH_KEY. Get a free key at https://soldgraph.com/signup?utm_source=github&utm_medium=referral&utm_campaign=soldgraph-examples")
    return {"Authorization": f"Bearer {key}"}


def _call(url, headers, params=None, tries=5):
    for attempt in range(tries):
        res = requests.get(url, params=params, headers=headers, timeout=30)
        try:
            body = res.json()
        except ValueError:
            body = None
        if res.status_code in (200, 202):
            return body
        if body and body.get("status") == "failed":  # replay of a failed search
            return body
        retryable = res.status_code == 429 or res.status_code >= 500
        wait = int(res.headers.get("Retry-After", 0)) or 2 ** attempt
        if not retryable or attempt + 1 == tries or wait > MAX_WAIT:
            code = (body or {}).get("error", {}).get("code")
            raise RuntimeError(f"Soldgraph {res.status_code} {code} (X-Request-Id {res.headers.get('X-Request-Id')})")
        time.sleep(wait)


def search(path, params):
    """Run one search, like search("/ebay/sold", {"q": "sony wh-1000xm5"}), and return its result."""
    auth = _auth()
    key = str(uuid.uuid4())  # one key per search, reused on retries so a retry is never charged twice
    job = _call(f"{HOST}/v1{path}", {**auth, "Idempotency-Key": key}, params)
    deadline = time.time() + 300
    while job["status"] == "pending":
        if time.time() > deadline:
            raise RuntimeError(f"Soldgraph job {job['request_id']} still pending")
        job = _call(f"{HOST}{job['poll_url']}", auth, {"wait": 20})  # poll_url is a path, not under /v1
    if job["status"] == "failed":
        raise RuntimeError(f"Soldgraph job failed: {job['error']['code']}")
    return job["result"]
