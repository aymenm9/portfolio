# Event Management Platform

A production Django REST Framework backend for large-scale event and workshop management. Deployed on octenium.com via cPanel, it handled 1000+ applications and served a React Native mobile scanner app, a React web landing page, and a Python chatbot service.

## The backend
- Workshop scheduling, speaker/partner management, registration with email confirmation, certificate generation with QR codes, attendance tracking, and reporting.
- JWT authentication (simplejwt) with refresh token rotation.
- OTP-based admin authentication via django-otp.
- Google reCAPTCHA on form endpoints.
- Cloudinary for cloud-based image and certificate storage.
- drf-spectacular OpenAPI documentation, django-filter, pandas/openpyxl for Excel reporting.

## The security story
During the live event the platform came under attack. The response was a multi-layer hardening pass, not a patch:

- **Multi-level rate limiting** — registration, login, and email confirmation throttles (minute, hour, day windows) to stop brute force and spam applications.
- **Input validation** across serializers, email format, and phone number length.
- **Email verification** before registration confirmation is accepted.
- **CORS lockdown** to whitelisted origins only.
- **CSRF protection** and secure token management.
- **Cloudinary upload validation** to reject unsafe file types.

## Mobile-first client surface
The backend was built primarily to serve a **React Native + Expo** mobile app used on-site for QR/barcode attendance scanning. A React + Vite + TailwindCSS landing page handled public registration, countdown, and partner showcase. A Python chatbot service answered event questions.

## Tech stack
- **Backend:** Django 5.2.6, DRF 3.16.1, Gunicorn, PostgreSQL/MySQL/SQLite, Redis, Cloudinary
- **Security:** simplejwt, django-otp, django-recaptcha, django-cors-headers, cryptography
- **Data:** pandas, numpy, openpyxl, qrcode, Pillow
- **Docs:** drf-spectacular (OpenAPI/Swagger)
- **Deployment:** octenium.com (cPanel), Gunicorn + Nginx/Apache
- **Mobile:** React Native + Expo, expo-camera, expo-secure-store, NativeWind
- **Frontend:** React + Vite + TailwindCSS

## Scale
- 1000+ registrations processed end-to-end.
- Mid-event attack mitigated and hardened without downtime.
- Simultaneous mobile + web clients.