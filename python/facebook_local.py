"""Search Facebook Marketplace listings near a ZIP code, then open the first one.

    python facebook_local.py "mountain bike" 28202

Prices are the seller's ask, not a sale price.
"""

import sys

from soldgraph import search

query = sys.argv[1] if len(sys.argv) > 1 else "mountain bike"
zip_code = sys.argv[2] if len(sys.argv) > 2 else "28202"

result = search("/facebook/listings", {"q": query, "zip": zip_code, "radius": 25, "sort": "newest"})
print(f"Searched from {result['location']['source_city']['name']}, {result['location']['source_city']['state']}\n")

for row in result["data"]:
    price = row["displayed_price"]["amount"] if row["displayed_price"] else "-"
    miles = row["approx_distance_miles"] if row["approx_distance_miles"] is not None else "?"
    place = ", ".join(p for p in (row["city"], row["state"]) if p)
    print(f"{price:>8}  {miles:>5} mi  {place:20}  {row['title']}")

if result["data"]:
    item = search("/facebook/item", {"q": result["data"][0]["id"]})["data"]
    print(f"\n{item['title']} ({item['status']}, {item['condition']})")
    print(item["description"] or "")
    print(item["link"])
