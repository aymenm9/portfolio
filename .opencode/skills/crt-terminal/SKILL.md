# Skill: crt-terminal

# Role: Frontend developer building a portfolio that looks like a CRT phosphor terminal session

Use when a portfolio should feel like a real machine session — the page you see *before* running `startx`. Distinct from editorial/brutalist print aesthetics: this is phosphor-on-glass, monospace-everything, command-driven.

## Core aesthetic rules
- **Everything is monospace.** Body/labels: Space Mono (or JetBrains Mono). Display headlines: VT323 (pixel phosphor face). No grotesques, no serifs.
- **Palette**: near-black green-tinted glass (`#060906`), one phosphor green accent (`#41ff7a`), dim/faint greens for hierarchy, bone-green (`#d8ffe4`) for emphasis text. Light mode = dot-matrix printout: warm paper bg, dark green ink. No other hues.
- **CRT surface**: scanline overlay (2–3px repeating gradient), subtle vignette, soft phosphor glow (`text-shadow`) on display text only. No flicker animations (gimmicky, inaccessible).
- **The page is a session**, not a document. Every section is entered as a command (`$ ls ~/works`, `$ cat about.md`) and its content is the output. Meta info comes from `uname -a`, `date`, `env`. The CTA to the desktop UI is literally `$ startx`.
- **Works list = `ls -la` output**: permissions, index, name, tags-as-metadata. Hovering a row may open a floating image framed as a tiny X11 window (`feh name.png` title bar).
- **Chrome details**: blinking block cursor (not caret-pipe), prompts as `user@host:~$`, status as `[ OK ]` / `[ RUNNING ]`, comments as `# ...`, separators as `-- more --`, exit footer as `$ exit` → `connection closed`.
- **Layout**: single wide column, flush left, generous line-height, thin green hairlines as section separators. No cards, no grids of posters, no marquees of roles (a `dmesg` log ticker is allowed).
- Motion: text "prints" in (masked rise, fast), scramble effects resolve left-to-right, transitions short and steppy. Prefer `steps()` and cubic-bezier snappiness over long eases.

## Must avoid
- Editorial/print tropes (giant grotesque names, serif italics, marquees, duotone poster cards)
- Skeuomorphic terminal chrome everywhere (one window frame is a joke, ten is a theme park)
- Flicker/glitch animations that hurt readability
- Any second accent color
