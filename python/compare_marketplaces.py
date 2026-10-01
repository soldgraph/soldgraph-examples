"""Compare median sold prices for one item on eBay, Poshmark and Mercari.

    python compare_marketplaces.py "lululemon define jacket"

Poshmark shows the listing's asking price, not what the buyer paid.
"""

import statistics
import sys

from soldgraph import search

query = " ".join(sys.argv[1:]) or "lululemon define jacket"

for marketplace in ("ebay", "poshmark", "mercari"):
    result = search(f"/{marketplace}/sold", {"q": query})
    prices = [r["displayed_price"]["amount"] for r in result["data"] if r["displayed_price"]]
    median = f"${statistics.median(prices):.2f}" if prices else "no prices"
    print(f"{marketplace:9} {len(prices):3} sold  median {median}")
