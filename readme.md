<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/board-dark.svg">
  <img alt="Nguyen Bo: open-source tools for apps full of live data. A live price board of my projects, and a cat in sunglasses." src="assets/board-light.svg" width="100%">
</picture>

### Hi, I'm Bo

I'm a developer in Vietnam. I've spent most of my career on securities trading platforms, and
these days I mostly work on open-source tools for apps that show a lot of live data.

I build with AI agents every day, mostly [Claude Code](https://claude.com/claude-code): it
writes a lot of the code, I decide what gets built and what ships. So my projects are made for
agents too: most come with `llms.txt`, agent skills and, for TradeCanvas, an MCP server.

They also trade on their own little exchange:

<!-- board:start -->
```diff
@@ BO EXCHANGE · SESSION 2026-10-25 · OPEN 24/7 @@
  CODE      LAST   CHG       %  VOL/WK   VER      LISTING
+ BO-INDEX    36    +4  +12.5%     574            all listings
+ TCV         28    +3  +12.0%     485   1.44.0   TradeCanvas · trading charts
+ BOG          8    +1  +14.3%      40   2.9.0    bo-grid · price-board grid
! DSA          0     0    0.0%      49   0.2.3    densa · live-data toolkit, Rust
! FSP          0     0    0.0%       -   dev      Fansipan · desktop terminal
! SVT          0     0    0.0%       -   alpha    Sveltier · UI kit for AI agents
! BCN          0     0    0.0%       -   dev      beacon-parser · analytics tag QA
- BUG      9999+    -1   -0.0%       -   main     bugs · one fewer every day
```
<!-- board:end -->

<sub>LAST is stars, CHG is new stars in the last 7 days, VOL is downloads last week on npm or
crates.io. Refreshed every morning, Vietnam time. Not investment advice.</sub>

**Listings**

- **TCV** · [TradeCanvas](https://github.com/bonguynvan/tradecanvas): trading charts for the web,
  on Canvas 2D or WebGL, with no dependencies. Indicators, drawing tools, live feeds and orders on
  the chart. Live demo at [tradecanvas.dev](https://tradecanvas.dev).
- **BOG** · [bo-grid](https://github.com/bonguynvan/bo-grid): a fast Svelte 5 data grid for live
  price boards, with a web component for other frameworks.
- **DSA** · [densa](https://github.com/densa-rs/densa): a Rust toolkit for apps that show a lot of
  live data: live Arrow tables, a GPU data grid and charts, widgets and docking. Try it in
  [densa studio](https://github.com/densa-rs/densa-studio).
- **FSP** · [Fansipan](https://github.com/bonguynvan/fansipan): an open-source desktop trading
  terminal for securities, for any market and any broker. Rust, Tauri and Svelte.
- **SVT** · [Sveltier](https://github.com/sveltier/sveltier): a UI framework for Svelte 5,
  designed to be easy for AI coding agents to use. Still alpha.
- **BCN** · [beacon-parser](https://github.com/bonguynvan/beacon-parser): parse, assert and diff
  Adobe Analytics hits in Playwright tests.

You can find me at [bonv.dev](https://bonv.dev). If any of this is useful to you, a star moves
the board, and [sponsoring](https://github.com/sponsors/bonguynvan) keeps the exchange open.
