// Search Facebook Marketplace listings near a ZIP code, then open the first one.
//
//   node facebook-local.mjs "mountain bike" 28202
//
// Prices are the seller's ask, not a sale price.

import { search } from "./soldgraph.mjs";

const [query = "mountain bike", zip = "28202"] = process.argv.slice(2);

const result = await search("/facebook/listings", { q: query, zip, radius: "25", sort: "newest" });
const city = result.location.source_city;
console.log(`Searched from ${city.name}, ${city.state}\n`);

for (const row of result.data) {
  const price = row.displayed_price?.amount ?? "-";
  const miles = row.approx_distance_miles ?? "?";
  const place = [row.city, row.state].filter(Boolean).join(", ");
  console.log(`${String(price).padStart(8)}  ${String(miles).padStart(5)} mi  ${place.padEnd(20)}  ${row.title}`);
}

if (result.data.length) {
  const item = (await search("/facebook/item", { q: result.data[0].id })).data;
  console.log(`\n${item.title} (${item.status}, ${item.condition})`);
  console.log(item.description ?? "");
  console.log(item.link);
}
