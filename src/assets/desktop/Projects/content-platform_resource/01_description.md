# Content Delivery Platform

A scalable content management and delivery platform built for unreliable internet conditions. Three components: a Django 6.0 + DRF + Channels backend (REST API + WebSocket server), a SvelteKit admin/moderator dashboard, and a mobile app (external team).

## Core Engineering
- **Resumable large file uploads** — multipart S3 uploads with pause/resume, designed for unstable connections. Each chunk independently tracked with ETag verification.
- **Real-time WebSocket chat** — Django Channels + Redis pub/sub, JWT-authenticated, rate-limited, with file attachments.
- **Push notifications** — Firebase FCM via Huey background task queue (4 workers, Redis broker).
- **Direct-to-storage uploads** — browser ↔ Cloudflare R2 via presigned URLs; file data never touches the Django server.

## Tech Stack
- **Backend:** Python 3.12, Django 6.0, DRF 3.16, Django Channels 4.3, Huey 2.6, PostgreSQL 16, Redis, Cloudflare R2 (S3), Firebase FCM, drf-spectacular (OpenAPI)
- **Dashboard:** SvelteKit 2.50, Svelte 5, Vite 7, TailwindCSS 4, Chart.js 4.5
- **Bilingual:** Arabic (RTL) + English (LTR), 230+ translation keys

## Roles
- **Super Admin** — full CRUD, statistics dashboard, moderator/ban management
- **Moderator** — manages own content/sections, participates in real-time chat
- **Regular User** — public API consumption (mobile app)