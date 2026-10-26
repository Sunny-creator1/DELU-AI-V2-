# DELU™ Commerce Platform

This repository contains a production-oriented DELU storefront and admin foundation built in Next.js with Prisma and SQLite for local development.

## What is included
- Premium public storefront and brand identity for DELU™
- Product catalogue, cart, checkout and order workflow
- Account sign-in, registration and order history
- Protected admin portal for operational management
- Configurable payment account and support email settings
- Bank-transfer payment verification flow with server-side validation
- Support ticket submission workflow
- Baseline security model with protected admin routes and server-side role checks

## Official account details
The configured official support email is stored in the admin settings and environment file as a configurable value, not hard-coded into the frontend:

- deluhq.official@gmail.com

This can be changed later through the admin settings page. New orders retain the active payment account snapshot so existing pending orders remain traceable.

## Local setup
1. Copy `.env.example` to `.env`
2. Run: `npm install`
3. Run: `npx prisma db push`
4. Run: `npm run db:seed`
5. Start: `npm run dev`

## Default admin login
- Email: `admin@delu.example`
- Password: set in `.env` via `ADMIN_PASSWORD`

## Notes
- The app is designed for deployment readiness with environment separation and security-minded admin controls.
- Real Gmail, bank-account verification and payment-provider integrations still require external credentials and provider configuration.
- The current app includes functional local workflows and protected admin access, but no live external payment provider or Gmail API is connected unless configured.
