# InScien

A local, private app that turns your own [Zotero](https://www.zotero.org) library into a
navigable citation map. It runs on your machine, in your own browser, and reads your library
read-only, so your data stays yours. No model, no account, no cloud.

**Contents:** [What it does](#what-it-does) - [Install](#install) - [First run](#first-run) -
[Using the Map](#using-the-map) - [Settings](#settings) -
[Updating and your data](#updating-and-your-data) - [Troubleshooting](#troubleshooting) -
[Run from source](#run-from-source-development) - [Privacy](#privacy)

## What it does

- **Map.** A citation graph of your Zotero collection from public OpenAlex data: select papers
  and see what they cite (References) and what cites them (Cited by).
- **No model required.** The Map is built from each paper's DOI, so there is nothing to install,
  connect, or pay for - no LLM, no API key, no GPU.
- **Local-first and private.** InScien reads your Zotero library read-only through a private
  snapshot and never modifies it. The only thing that leaves your machine is a public DOI lookup
  when you build a citation map.
- **Read the source.** Open any paper's original PDF inside the app to read it or check it
  against the map.

## Install

InScien runs as a local web app in your own browser - one command, no separate install, works the
same on Windows, macOS, and Linux. All you need is [`uv`](https://docs.astral.sh/uv/): it brings
its own Python, so nothing is installed system-wide.

**1. Install uv** (once).

macOS / Linux:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Windows (PowerShell):

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

On Arch Linux, `sudo pacman -S uv` works too.

**2. Run InScien.** It targets Python 3.12, so pin it - uv then fetches the right Python
automatically:

```bash
uvx --python 3.12 inscien              # try it (ephemeral, isolated)
uv tool install --python 3.12 inscien  # or install the `inscien` command, then run: inscien
```

Either way, InScien starts a local server, opens your browser, and serves the whole app from your
machine.

## First run

1. **Point InScien at Zotero.** Open **Settings** and set your Zotero data folder - the one
   containing `zotero.sqlite` and `storage/`. That is usually `~/Zotero` on macOS and Linux, and
   `C:\Users\you\Zotero` on Windows. InScien reads it read-only through a private snapshot and
   never modifies your library. After changing the folder, refresh the library in the sidebar.
2. **Select papers** in the sidebar - browse your Zotero collections and pick the papers you want
   to map. Optionally hit **Fetch citations** to warm the whole library in the background.
3. **Open the Map** to see the citation graph of your selection.

## Using the Map

The Map turns your selected Zotero papers into a citation graph built from public data on
[OpenAlex](https://openalex.org). It needs no model - just each paper's DOI. Switch between the
two lenses with the toggle in the top bar:

- **References** - what your selected papers cite.
- **Cited by** - the works that cite them.

- **Select papers** (or whole collections) in the sidebar; the map draws the graph for just that
  set and fills in as the data resolves.
- **Open a paper** from the map to read its original PDF in a side panel, without leaving the app.
- **Warm the whole library** with the **Fetch citations** action in the sidebar - it fetches
  references for every paper with a DOI in the background, so later selections render instantly.

A paper is on the map only if it has a **DOI** and OpenAlex has its **references**. Papers without
a DOI, or that OpenAlex has no reference list for (often arXiv preprints), are greyed in the
library - hover one to see why. The citation data is cached locally and reused.

## Settings

There is one setting: the **Zotero data folder**, in the app's **Settings** page. It is stored in
a local SQLite database, not in a file you have to edit, and InScien auto-detects the folder when
it can.

## Updating and your data

```bash
uv tool upgrade inscien      # update to the latest release
uv tool uninstall inscien    # remove it
```

Your data (settings and the citation cache) lives in your OS app-data folder, separate from the
install - so upgrading or reinstalling never touches it.

## Troubleshooting

**The install fails or tries to build something.** Pin the Python version so uv fetches a managed
3.12 and installs prebuilt wheels: `uvx --python 3.12 inscien` (or
`uv tool install --python 3.12 inscien`).

**The browser didn't open.** InScien prints a local URL on startup, for example
`http://127.0.0.1:8000`. Open that URL yourself.

**A paper is greyed out in the library.** It has no DOI, or OpenAlex has no reference list for it
(common for arXiv preprints), so it cannot be placed on the map. Hover it to see which.

## Run from source (development)

InScien is a FastAPI backend plus a Next.js frontend; citation data is cached in a single JSON
file (no database beyond SQLite for settings). Dev runs natively on the host - no Docker, no
`.env` (config lives in the in-app Settings page).

Host prereqs: [`uv`](https://docs.astral.sh/uv/) and Node (on Arch, Node comes from
`nodejs-lts-jod` - keep it; do not let pacman swap in the bleeding-edge `nodejs` package). No
system packages are needed. The backend pins to Python 3.12; `uv` fetches it automatically, so
no system Python 3.12 is needed.

Run `make setup` **first** (once), then start the two servers:

```bash
make setup        # one-time: backend venv + deps, frontend deps - RUN THIS FIRST
make backend      # terminal 1: FastAPI on http://localhost:8000
make frontend     # terminal 2: Next dev server on http://localhost:3000
```

If `make backend` says `.venv/bin/uvicorn: No such file` or `make frontend` says
`Cannot find module 'pdfjs-dist'`, you skipped `make setup` (or deps changed) - run it.

Then open http://localhost:3000 and set your Zotero data folder in Settings. To build the shipped
artifact yourself, run `make wheel`.

More detail: [RUNNING.md](RUNNING.md) (run, serve, and release) and [CLAUDE.md](CLAUDE.md)
(architecture internals).

## Privacy

Your PDFs stay in your Zotero library, read read-only. InScien's own state (a SQLite DB for
settings and the OpenAlex citation cache) lives under a single app-data folder. The only time
anything leaves your machine is when you build the Map - public DOI lookups to
[OpenAlex](https://openalex.org). There is no model, no telemetry, and no account.

## License

MIT - see [LICENSE](LICENSE).
