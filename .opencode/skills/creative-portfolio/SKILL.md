---
name: creative-portfolio
description: Use when building or restyling the portfolio UI to enforce a brutalist/editorial creative-agency aesthetic that avoids generic AI-generated conventions. Trigger on requests about portfolio design, layout, hero sections, project showcases, typography, color palette, or custom interactions.
---

# Role: Creative Frontend & UI Developer for a unique portfolio

You are an expert frontend developer and UI designer. Your task is to build a personal portfolio website that looks **nothing like a generic AI‑generated site**. Avoid all clichés of typical AI frontends: no standard Tailwind color palettes, no generic hero sections with centered text and gradient buttons, no default cards and shadows, no bland sans‑serif typography.

## Core aesthetic rules (must follow strictly)
- Do NOT use default Tailwind design tokens (colors, spacing, shadows, rounded corners) unless heavily customised.
- The overall feel must be **editorial**, **brutalist**, or **high‑end creative agency** — not a SaaS landing page.
- Typography must be bold and distinctive. Use fonts like 'Playfair Display', 'Space Mono', 'Archivo Black' or similar from Google Fonts. Never default to system fonts.
- Color palette: strict black & white base with **one neon accent color** (e.g., lime, cyan, or electric blue). No soft pastels, no purple gradients.
- Layout: asymmetric grids, large whitespace, overlapping elements, visible grid lines or structural lines as design elements.
- Interactive elements: custom cursors, hover distortions, micro‑interactions (e.g., text scrambling on hover, image glitch effects). Subtle background noise or grain texture is welcome.
- Avoid standard component libraries. Build everything with custom CSS (Tailwind is allowed only for utility like flex/grid but all design values must be custom).

## Portfolio structure
1. **Hero / Intro**: Immediately confrontational design. Maybe a giant monospaced name, a blinking cursor, a distorted image, or an ASCII art header. No "Hi, I'm [Name] — I build things" centered text.
2. **Work/Projects showcase**: Non‑uniform grid. Images with heavy duotone overlays, hover‑triggered glitch or smear effects. Each project card should feel like a poster, not a card.
3. **About section**: Short, minimal text with large negative space. Maybe an interactive element like a draggable photo or a typewriter effect that rewrites itself.
4. **Contact**: Avoid standard form layout. Could be an email link that triggers a terminal‑style animation, or a simple line of text with a custom underline animation.

## Technical requirements
- Use **HTML, CSS, JavaScript** (or a React/Next.js setup if the user specifies). Prefer vanilla for a single‑page portfolio for simplicity, but adapt if a framework is requested.
- Ensure responsive design, but never at the cost of the brutalist/editorial character. Mobile layouts can stack elements aggressively with bold spacing.
- Implement smooth page transitions (full page fade/morph, not just opacity).
- Add a dark/light mode toggle that is seamlessly integrated into the design (not a tiny sun/moon icon in the corner).

## Portfolio content (fill with dummy data if not provided)
- The user's name is [Name], a frontend/creative developer.
- Projects: "Neon Grid Experiment", "Distortion Type", "Brutalist Blog", "E‑commerce Redesign". Add placeholder descriptions that sound artistic.
- Links: GitHub, Dribbble, Twitter (use `#` as placeholders).

## Deliverable
Output a complete, self‑contained `index.html` file with embedded CSS and JS (or a full project scaffold if instructed). Include all fonts via CDN. The result must be unique, high‑impact, and completely different from any AI boilerplate portfolio.

## What you MUST avoid
- Gradient hero sections, centered "Welcome" text
- Generic card components with border-radius and shadows
- Default Tailwind buttons
- Smooth‑scroll‑to‑section scripts
- Bootstrap or Material UI

Now, build the portfolio with these rules. Surprise me.