# Booking App

A simple booking application built with Next.js 15, TypeScript, Tailwind CSS, Prisma, React Hook Form, Zod, and Google Maps integration.

## Features

- One-way booking flow with hourly placeholder
- Google Places autocomplete for pickup, stops, and destination
- Google Distance Matrix integration for travel distance and duration
- Customer lookup by phone number
- Conditional contact fields for returning or new customers
- Responsive mobile-first layout matching the provided screenshot
- PostgreSQL database via Prisma
- Booking summary and mock booking reference

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Set the `DATABASE_URL` and `GOOGLE_MAPS_API_KEY` values in `.env`.

4. Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

5. Start the development server:

```bash
npm run dev
```

## Notes

- The UI is built using Tailwind CSS and mirrors the attached screenshot.
- The app uses `@react-google-maps/api` for Google Places autocomplete and Distance Matrix.
- Make sure the Google Cloud project has the following APIs enabled:
  - Places API (New)
  - Routes API or Distance Matrix API
- The POST endpoints for `/api/bookings` and `/api/mock-booking` are implemented.
