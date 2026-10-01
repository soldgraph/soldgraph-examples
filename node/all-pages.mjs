// Collect several pages of eBay sold listings, removing repeats by listing ID.
//
//   node all-pages.mjs "pokemon 151 booster box" 3

import { search } from "./soldgraph.mjs";

const [query = "pokemon 151 booster box", maxPages = "3"] = process.argv.slice(2);
const rows = new Map();

let page = 1;
while (page && page <= Number(maxPages)) {
  const result = await search("/ebay/sold", { q: query, page: String(page) });
  for (const row of result.data) rows.set(row.id, row);
  console.log(`page ${page}: ${result.count} rows`);
  page = result.next_page; // null on the last page
}

console.log(`${rows.size} unique sold listings`);
