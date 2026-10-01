# eBay sold prices in Google Sheets

Type `=SOLDGRAPH_SOLD("nintendo switch oled")` in any cell to fill in recent eBay sold listings: title, price, sold date and link.

1. In your sheet, open **Extensions → Apps Script**.
2. Open **Project Settings → Script properties**. Add `SOLDGRAPH_KEY` with your [API key](https://soldgraph.com/signup?utm_source=github&utm_medium=referral&utm_campaign=soldgraph-examples). Keep it here, not in a cell, so people you share the sheet with can't see it.
3. Paste [`Code.gs`](Code.gs) into the editor and save.
4. In the sheet, type `=SOLDGRAPH_SOLD("nintendo switch oled")`. Add `=MEDIAN(B2:B41)` beside it for a middle price.

For Poshmark or Mercari, change `/v1/ebay/sold` to `/v1/poshmark/sold` or `/v1/mercari/sold`.

Each recalculation is one search. Custom functions time out after 30 seconds, so recalculate the cell if one does. Full guide: [soldgraph.com/docs/guides/google-sheets](https://soldgraph.com/docs/guides/google-sheets?utm_source=github&utm_medium=referral&utm_campaign=soldgraph-examples).
