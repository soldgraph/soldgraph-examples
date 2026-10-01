#!/usr/bin/env bash
# Search eBay sold listings and wait for the result. Needs curl and jq.
#
#   export SOLDGRAPH_KEY=sg_...
#   ./ebay-sold.sh "nintendo switch oled"
set -euo pipefail

HOST="https://api.soldgraph.com"
QUERY="${1:-nintendo switch oled}"
AUTH="Authorization: Bearer ${SOLDGRAPH_KEY:?Set SOLDGRAPH_KEY. Get a free key at https://soldgraph.com/signup}"

body=$(curl -sS -G "$HOST/v1/ebay/sold" \
  --data-urlencode "q=$QUERY" \
  -H "$AUTH" \
  -H "Idempotency-Key: $(uuidgen)")

# A fresh search returns status=pending and a poll_url. poll_url is a path, so join it to $HOST.
while [ "$(jq -r .status <<<"$body")" = "pending" ]; do
  body=$(curl -sS "$HOST$(jq -r .poll_url <<<"$body")?wait=20" -H "$AUTH")
done

if [ "$(jq -r .status <<<"$body")" != "complete" ]; then
  jq . <<<"$body" >&2
  exit 1
fi

jq -r '.result.data[] | [.sold_date, .displayed_price.amount, .title] | @tsv' <<<"$body"
