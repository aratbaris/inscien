# InScien

A local, private app that turns your own [Zotero](https://www.zotero.org) library
into a navigable map and audio narrations. It runs on your machine, in your own browser, and
reads your library read-only, so your data stays yours.

**Contents:** [What it does](#what-it-does) - [Install](#install) -
[A model for narration](#a-model-for-narration) - [First run](#first-run) -
[Using the Map](#using-the-map) - [Narrating a paper](#narrating-a-paper) -
[Settings](#settings) - [Updating and your data](#updating-and-your-data) -
[Troubleshooting](#troubleshooting) - [Run from source](#run-from-source-development) -
[Privacy](#privacy)

## What it does

- **Map.** A citation graph of your Zotero collection from public OpenAlex data: select papers
  and see what they cite (References) and what cites them (Cited by). The Map needs no model.
- **Narrate.** Turn a paper into a spoken-audio narration. A model you connect writes the
  script; a local CPU voice ([Kokoro](https://github.com/thewh1teagle/kokoro-onnx), Apache-2.0)
  reads it aloud and saves an mp3 you can replay. No GPU required.
- **Local-first and private.** InScien reads your Zotero library read-only through a private
  snapshot and never modifies it. Nothing leaves your machine except, optionally, the text you
  send to your own cloud model, or public DOI lookups when you build a citation map.
- **Read the source.** Open any paper's original PDF inside the app to read it or check it
  against the map.

## Install

InScien runs as a local web app in your own browser - one command, no separate install, works the
same on Windows, macOS, and Linux. All you need is [`uv`](https://docs.astral.sh/uv/): it brings
its own Python, and the app carries everything else (the voice engine and audio muxing are
bundled, so nothing is installed system-wide).

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

**2. Run InScien.** It runs on Python 3.12 (its ML dependencies don't publish wheels for newer
Python yet), so pin it - uv then fetches the right Python and uses prebuilt wheels, so you never
need a compiler:

```bash
uvx --python 3.12 inscien              # try it (ephemeral, isolated)
uv tool install --python 3.12 inscien  # or install the `inscien` command, then run: inscien
```

Either way, InScien starts a local server, opens your browser, and serves the whole app from your
machine.

## A model for narration

The **Map needs no model**. **Narration** needs one you connect in the app's Settings page (no
environment variables, no config files):

- **Local Ollama** (private and free). Install [Ollama](https://ollama.com) and pull a model
  before narrating, for example `ollama pull llama3.1:8b`. InScien connects at
  `http://localhost:11434`. A larger model generally writes better narration.
- **OpenAI** (higher quality, paid). Paste your API key and enter a model id. The key is stored
  only on your machine and is never displayed again.

If you select OpenAI without a key, or pick a model your account can't use, InScien tells you
exactly what to fix.

## First run

1. **Point InScien at Zotero.** Open **Settings** and set your Zotero data folder - the one
   containing `zotero.sqlite` and `storage/`. That is usually `~/Zotero` on macOS and Linux, and
   `C:\Users\you\Zotero` on Windows. InScien reads it read-only through a private snapshot and
   never modifies your library. After changing the folder, refresh the library in the sidebar.
2. **Connect a model** (only needed for narration).
3. **Select papers** in the sidebar - browse your Zotero collections and pick the papers you want
   to map. Optionally hit **Fetch citations** to warm the whole library in the background.
4. **Open the Map** to see the citation graph of your selection.
5. **Or narrate a paper.** The first narration downloads the voice model once (about 1 GB), with
   a progress bar.

## Using the Map

The Map turns your selected Zotero papers into a citation graph built from public data on
[OpenAlex](https://openalex.org). It needs no model - just each paper's DOI. Two lenses:

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

## Narrating a paper

**Narrate** turns a paper into a spoken-audio narration: a model you connect writes an explanatory
script, a local CPU voice reads it aloud, and the result is saved as an mp3 you can replay any
time. Generated narrations are saved per paper, so replaying one never regenerates it.

InScien doesn't ship the ~1 GB voice model up front, to keep the install small. The first time you
narrate, it shows a **Download narration voice** button with a progress bar. After that, narration
runs without re-downloading - the voice stays on your machine.

## Settings

Everything is configured in the app's **Settings** page: the Zotero data folder, and the model
used for narration (see [A model for narration](#a-model-for-narration)). Settings are stored in a
local SQLite database, not in files you have to edit.

## Updating and your data

```bash
uv tool upgrade inscien      # update to the latest release
uv tool uninstall inscien    # remove it
```

Your data (settings, the citation cache, narration audio, the voice model) lives in your OS
app-data folder, separate from the install - so upgrading or reinstalling never touches it.

## Troubleshooting

**Narration fails with a PyMuPDF or "DLL load failed" error (Windows).** Narration reads PDFs with
PyMuPDF, a native library that needs the **Microsoft Visual C++ Redistributable**. Most Windows
machines already have it; a clean install may not. Install it once from
[aka.ms/vc_redist](https://aka.ms/vs/17/release/vc_redist.x64.exe) and retry. The Map does not
need this.

**The install tries to compile something ("Rust not found", build errors).** uv picked a Python
newer than 3.12, for which some dependencies publish no wheels. Pin the version so uv fetches a
managed 3.12 and installs prebuilt wheels: `uvx --python 3.12 inscien` (or
`uv tool install --python 3.12 inscien`).

**The browser didn't open.** InScien prints a local URL on startup, for example
`http://127.0.0.1:8000`. Open that URL yourself.

**Narration says no model is configured.** The Map needs no model, but narration does - connect a
local Ollama or an OpenAI key in Settings.

**Audio doesn't play on a minimal Linux setup.** Playback uses your browser's audio stack, which
needs the usual GStreamer plugins installed. Windows and macOS have this built in.

## Run from source (development)

InScien is a FastAPI backend plus a Next.js frontend; citation data is cached in a single JSON
file (no database beyond SQLite for settings). Dev runs natively on the host - no Docker, no
`.env` (config lives in the in-app Settings page).

Host prereqs: [`uv`](https://docs.astral.sh/uv/) and Node (on Arch, Node comes from
`nodejs-lts-jod` - keep it; do not let pacman swap in the bleeding-edge `nodejs` package). TTS is
fully bundled - Kokoro ships espeak via `espeakng-loader` and `ffmpeg` via `imageio-ffmpeg` - so
no system packages are needed. The backend pins to Python 3.12; `uv` fetches it automatically, so
no system Python 3.12 is needed.

Run `make setup` **first** (once), then start the two servers:

```bash
make setup        # one-time: backend venv + deps, frontend deps - RUN THIS FIRST
make backend      # terminal 1: FastAPI on http://localhost:8000
make frontend     # terminal 2: Next dev server on http://localhost:3000
```

If `make backend` says `.venv/bin/uvicorn: No such file` or `make frontend` says
`Cannot find module 'pdfjs-dist'`, you skipped `make setup` (or deps changed) - run it.

Then open http://localhost:3000 and set your Zotero data folder (and, for narration, a model)
in Settings. A local Ollama running on the host (`http://localhost:11434`) covers narration for
free. To build the shipped artifact yourself, run `make wheel`.

More detail: [RUNNING.md](RUNNING.md) (run, serve, and release) and [CLAUDE.md](CLAUDE.md)
(architecture internals).

## Privacy

Your PDFs stay in your Zotero library, read read-only. InScien's own state (a SQLite DB for
settings, the OpenAlex citation cache, and narration audio) lives under a single app-data folder.
The only times anything leaves your machine are if you choose an OpenAI model (the text you send
it) or build the Map (public DOI lookups to [OpenAlex](https://openalex.org)). Everything else,
including narration and the local voice, runs offline.

## License

MIT - see [LICENSE](LICENSE).
