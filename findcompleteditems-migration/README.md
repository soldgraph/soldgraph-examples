# Replace eBay `findCompletedItems`

eBay decommissioned the Finding API, including `findCompletedItems`, in February 2025. The Browse API only returns active listings, and Marketplace Insights (eBay's sold-data API) isn't open to new developers.

[Soldgraph](https://soldgraph.com?utm_source=github&utm_medium=referral&utm_campaign=soldgraph-examples) returns eBay US sold listings as JSON with one API key. No eBay developer account or partner approval.

## Before: Finding API (retired)

```python
from ebaysdk.finding import Connection

api = Connection(appid="YOUR_APP_ID", config_file=None)
resp = api.execute("findCompletedItems", {
    "keywords": "nintendo switch oled",
    "itemFilter": [
        {"name": "SoldItemsOnly", "value": "true"},
        {"name": "Condition", "value": "3000"},
    ],
})
for item in resp.reply.searchResult.item:
    print(item.title, item.sellingStatus.currentPrice.value)
```

## After: Soldgraph

```python
from soldgraph import search  # ../python/soldgraph.py

result = search("/ebay/sold", {"q": "nintendo switch oled", "condition": "used"})
for row in result["data"]:
    print(row["title"], row["displayed_price"]["amount"] if row["displayed_price"] else None)
```

Node:

```js
import { search } from "../node/soldgraph.mjs";

const result = await search("/ebay/sold", { q: "nintendo switch oled", condition: "used" });
for (const row of result.data) console.log(row.title, row.displayed_price?.amount);
```

Every result is sold, so there's no `SoldItemsOnly` filter.

## Field mapping

| Finding API | Soldgraph `GET /v1/ebay/sold` |
| --- | --- |
| `keywords` | `q` |
| `itemFilter` `Condition` 1000 | `condition=new` |
| `itemFilter` `Condition` 1500 | `condition=open_box` |
| `itemFilter` `Condition` 2000–2500 | `condition=refurbished` |
| `itemFilter` `Condition` 3000 | `condition=used` |
| `itemFilter` `Condition` 7000 | `condition=for_parts` |
| `itemFilter` `MinPrice` / `MaxPrice` | `min_price` / `max_price` (whole US dollars) |
| `paginationInput.pageNumber` | `page` (follow `result.next_page`) |
| `item.itemId` | `row.id` |
| `item.title` | `row.title` |
| `item.viewItemURL` | `row.link` |
| `item.sellingStatus.currentPrice` | `row.displayed_price` (`{ amount, currency }`) |
| `item.shippingInfo.shippingServiceCost` | `row.displayed_shipping` |
| `item.listingInfo.endTime` | `row.sold_date` (`YYYY-MM-DD`) |
| `item.condition.conditionDisplayName` | `row.condition` |
| `item.galleryURL` | `row.image` |

Combine conditions with commas, like `condition=new,open_box`.

## Differences to plan for

- **Search jobs.** A new search returns `202` with a `poll_url`. Long-poll it with `?wait=20` until `status` is `complete`. The clients in this repo do that for you.
- **One page per request.** Up to 40 rows a page, up to 100 pages. Not a full sales history.
- **Displayed prices.** The price the listing showed. An accepted best offer can be lower.
- **US only.** eBay US today.
- **Other marketplaces.** The same call shape works for Poshmark and Mercari sold listings: `/v1/poshmark/sold`, `/v1/mercari/sold`.

100 free requests to start, no credit card required. [Get a key](https://soldgraph.com/signup?utm_source=github&utm_medium=referral&utm_campaign=soldgraph-examples) · [Full guide](https://soldgraph.com/docs/compare/ebay-finding-api?utm_source=github&utm_medium=referral&utm_campaign=soldgraph-examples)
