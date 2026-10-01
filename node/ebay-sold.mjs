// Print recent eBay sold listings for a search, plus the median price.
//
//   export SOLDGRAPH_KEY=sg_...
//   node ebay-sold.mjs "nintendo switch oled"

import { search } from "./soldgraph.mjs";

const query = process.argv.slice(2).join(" ") || "nintendo switch oled";
const result = await search("/ebay/sold", { q: query, condition: "used" });

const prices = [];
for (const row of result.data) {
  const price = row.displayed_price?.amount ?? null;
  if (price !== null) prices.push(price);
  console.log(`${(row.sold_date ?? "?").padEnd(10)}  ${String(price ?? "-").padStart(8)}  ${row.title}`);
}

console.log(`\n${result.count} sold listings on page ${result.page}`);
if (prices.length) {
  prices.sort((a, b) => a - b);
  const mid = Math.floor(prices.length / 2);
  const median = prices.length % 2 ? prices[mid] : (prices[mid - 1] + prices[mid]) / 2;
  console.log(`Median displayed price: $${median.toFixed(2)}`);
}
