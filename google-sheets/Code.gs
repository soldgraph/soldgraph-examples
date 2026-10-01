const API = "https://api.soldgraph.com";

/**
 * Recent eBay sold listings for a search.
 * @param {string} query What to search for, like "nintendo switch oled".
 * @customfunction
 */
function SOLDGRAPH_SOLD(query) {
  const key = PropertiesService.getScriptProperties().getProperty("SOLDGRAPH_KEY");
  if (!key) throw new Error("Add SOLDGRAPH_KEY in Project Settings → Script properties.");
  const headers = { Authorization: "Bearer " + key };

  let body = get_(API + "/v1/ebay/sold?q=" + encodeURIComponent(query), headers);
  while (body.status === "pending") body = get_(API + body.poll_url + "?wait=20", headers);
  if (body.status === "failed") throw new Error("Search failed: " + body.error.code);

  const rows = body.result.data.map((r) => [r.title, r.displayed_price ? r.displayed_price.amount : "", r.sold_date || "", r.link]);
  return [["Title", "Price", "Sold", "Link"]].concat(rows);
}

function get_(url, headers) {
  const res = UrlFetchApp.fetch(url, { headers: headers, muteHttpExceptions: true });
  const body = JSON.parse(res.getContentText());
  if (res.getResponseCode() >= 400) throw new Error(body.error ? body.error.code : "HTTP " + res.getResponseCode());
  return body;
}
