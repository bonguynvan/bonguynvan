# Nguyen Bo

**I build open-source tools for software that shows a lot of live data:** trading charts,
price boards, data grids and desktop terminals.

I'm a developer in Vietnam. I spent years building securities trading platforms, and most of
what you see below comes out of that work: pieces of a trading screen that I needed and could
not find done well in the open. Each one is measured rather than described, tested in CI, and
documented for people and for coding agents alike (`llms.txt`, agent skills, MCP).

[bonv.dev](https://bonv.dev) · [GitHub Sponsors](https://github.com/sponsors/bonguynvan)

## What I'm building

### [TradeCanvas](https://github.com/bonguynvan/tradecanvas)

[![stars](https://img.shields.io/github/stars/bonguynvan/tradecanvas?style=flat-square&labelColor=0b0e13&color=f2a93b)](https://github.com/bonguynvan/tradecanvas/stargazers) [![npm](https://img.shields.io/npm/v/@tradecanvas/chart?style=flat-square&labelColor=0b0e13&color=f2a93b&label=npm)](https://www.npmjs.com/package/@tradecanvas/chart) [![downloads](https://img.shields.io/npm/dm/@tradecanvas/chart?style=flat-square&labelColor=0b0e13&color=3ccf91)](https://www.npmjs.com/package/@tradecanvas/chart)

[![TradeCanvas, the chart engine for trading apps](https://raw.githubusercontent.com/bonguynvan/tradecanvas/main/.github/assets/banner.png)](https://tradecanvas.dev/chart/)

Trading charts for the web, on Canvas 2D or WebGL, with no third-party dependencies: 18 chart
types, 134 indicators, 69 drawing tools, live exchange feeds, orders you drag on the chart, bar
replay and backtesting. A million bars pan at 60 fps. TypeScript, with React, Vue and Svelte
components.

**[Live demo](https://tradecanvas.dev/chart/)** · [Docs](https://tradecanvas.dev/docs/getting-started/) · [Examples](https://tradecanvas.dev/examples/) · [System audit](https://tradecanvas.dev/audit/)

<table>
  <tr>
    <td width="50%" valign="top">
      <h3><a href="https://github.com/bonguynvan/bo-grid">bo-grid</a></h3>
      <a href="https://github.com/bonguynvan/bo-grid/stargazers"><img src="https://img.shields.io/github/stars/bonguynvan/bo-grid?style=flat-square&labelColor=0b0e13&color=f2a93b" alt="stars"></a>
      <a href="https://www.npmjs.com/package/bo-grid"><img src="https://img.shields.io/npm/v/bo-grid?style=flat-square&labelColor=0b0e13&color=f2a93b&label=npm" alt="npm"></a>
      <br><br>
      <a href="https://bonguynvan.github.io/bo-grid/examples/"><img src="https://raw.githubusercontent.com/bonguynvan/bo-grid/main/docs/media/hero.gif" width="100%" alt="A live price board: prices and volumes flash green or red as they tick"></a>
      <p>The data grid for busy markets. A Svelte 5 grid for live price boards: 1,000 symbols at
      30,000 ticks a second for about 4.5 ms of work a frame, with every changed cell flashing.
      Pivot, tree data, editing and Excel export in about 46 KB gzip, plus a web component for
      React, Vue and Angular.</p>
      <a href="https://bonguynvan.github.io/bo-grid/docs/">Docs</a> ·
      <a href="https://bonguynvan.github.io/bo-grid/examples/">Examples</a> ·
      <a href="https://github.com/bonguynvan/bo-grid/blob/main/BENCHMARKS.md">Benchmarks</a>
    </td>
    <td width="50%" valign="top">
      <h3><a href="https://github.com/densa-rs/densa">densa</a></h3>
      <a href="https://crates.io/crates/densa"><img src="https://img.shields.io/crates/v/densa?style=flat-square&labelColor=0b0e13&color=2f5bea&label=crates.io" alt="crates.io"></a>
      <img src="https://img.shields.io/badge/license-MIT%20or%20Apache--2.0-2f5bea?style=flat-square&labelColor=0b0e13" alt="MIT or Apache-2.0">
      <br><br>
      <a href="https://github.com/densa-rs/densa-studio"><img src="https://raw.githubusercontent.com/densa-rs/densa-studio/main/docs/studio.png" width="100%" alt="densa studio: a live stream of 500 sensors in a grid, a live SQL query over it, and a chart of the result"></a>
      <p>A Rust toolkit for applications that show a lot of live data, from the stream to the
      pixel: live Arrow tables with incrementally maintained views, a GPU data grid and charts,
      flexbox widgets and docking. No allocation per frame, no locks between threads.
      <a href="https://github.com/densa-rs/densa-studio">densa studio</a> (above) opens Parquet,
      CSV and live streams and runs SQL over all of them at once.</p>
      <a href="https://densa.dev">densa.dev</a> ·
      <a href="https://github.com/densa-rs/densa-studio">Studio</a> ·
      <a href="https://github.com/densa-rs/densa-connectors">Connectors</a>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3><a href="https://github.com/sveltier/sveltier">Sveltier</a></h3>
      <img src="https://img.shields.io/badge/status-alpha-ff5a1f?style=flat-square&labelColor=0b0e13" alt="status: alpha">
      <img src="https://img.shields.io/badge/Svelte-5-ff5a1f?style=flat-square&labelColor=0b0e13" alt="Svelte 5">
      <br><br>
      <a href="https://sveltier.com"><img src="https://raw.githubusercontent.com/sveltier/sveltier/main/apps/docs/static/social-card.png" width="100%" alt="Sveltier, the UI framework for AI coding agents"></a>
      <p>The UI framework for AI coding agents, on Svelte 5. One typed prop vocabulary across every
      component, docs generated from the types, and errors that say how to fix them. Five design
      languages behind one zero-dependency theme engine, WAI-ARIA keyboard behaviour, and every
      theme checked for WCAG contrast in light and dark.</p>
      <a href="https://sveltier.com">sveltier.com</a> ·
      <a href="https://sveltier.com/llms.txt">llms.txt</a>
    </td>
    <td width="50%" valign="top">
      <h3><a href="https://github.com/bonguynvan/fansipan">Fansipan</a></h3>
      <img src="https://img.shields.io/badge/Rust%20%C2%B7%20Tauri%20%C2%B7%20Svelte-3ccf91?style=flat-square&labelColor=0b0e13" alt="Rust, Tauri, Svelte">
      <p>An open-source desktop trading terminal for securities, on any market and with any broker.
      Brokers plug in as adapters; lot sizes, tick ladders, price limits and auction sessions come
      in as data, and the engine owns every order's state and its risk checks.</p>
      <p>11 MB to install, under a second from launch to the first prices, and a sandbox with two
      simulated markets, so it runs with <code>docker compose up</code> and no broker account.</p>
      <h3>Also</h3>
      <p><a href="https://github.com/bonguynvan/beacon-parser"><b>beacon-parser</b></a>: parse,
      assert and diff Adobe Analytics hits in Playwright tests, for tag QA in CI.</p>
    </td>
  </tr>
</table>

TradeCanvas and bo-grid make the two halves of a trading desk in the browser, the chart and the
board; Fansipan and densa take the same idea to the desktop.

## Tools I reach for

TypeScript · Svelte 5 · Rust · Canvas 2D, WebGL and wgpu · Apache Arrow · Tauri · Go · Python

---

If one of these saves you time, a star helps other people find it, and
[sponsoring](https://github.com/sponsors/bonguynvan) keeps the work going.
