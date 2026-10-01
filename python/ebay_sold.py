"""Print recent eBay sold listings for a search, plus the median price.

    pip install requests
    export SOLDGRAPH_KEY=sg_...
    python ebay_sold.py "nintendo switch oled"
"""

import statistics
import sys

from soldgraph import search

query = " ".join(sys.argv[1:]) or "nintendo switch oled"
result = search("/ebay/sold", {"q": query, "condition": "used"})

prices = []
for row in result["data"]:
    price = row["displayed_price"]["amount"] if row["displayed_price"] else None
    if price is not None:
        prices.append(price)
    print(f"{row['sold_date'] or '?':10}  {price if price is not None else '-':>8}  {row['title']}")

print(f"\n{result['count']} sold listings on page {result['page']}")
if prices:
    print(f"Median displayed price: ${statistics.median(prices):.2f}")
