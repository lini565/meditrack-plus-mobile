# MediTrack+ Mobile

An isolated Expo Router and React Native TypeScript client for MediTrack+. The existing Next.js website remains outside this project and is not modified by the mobile app.

## Setup

1. Copy `.env.example` to `.env.local` inside this directory.
2. Set the Supabase URL and anon key.
3. Set `EXPO_PUBLIC_API_BASE_URL` to the deployed Next.js URL for chatbot and pharmacy API calls.
4. Install and start:

```bash
npm install
npm start
```

Use Expo Go for device testing, or `npm run android` / `npm run ios` for native development.

## Included

- Supabase email registration, login, persisted sessions, and logout
- Dashboard with today's medicines and refresh state
- Medicine add, edit, delete, and stock details
- Daily native reminders through `expo-notifications`
- Prescription photo capture/library selection with review before saving
- Location permission, nearby pharmacy API lookup, native map markers, and directions
- Profile/settings and privacy information

## Backend note

The current web medicine API is not authenticated and does not filter records by `user_id`. The mobile app uses the Supabase client for medicine CRUD, but production use requires Supabase Auth policies and Row Level Security on the `medicines` table. The existing web pages and routes were intentionally not changed to avoid affecting the deployed website.

The existing web OCR is client-side Tesseract, so this app provides image review and manual confirmation until a server-side OCR endpoint is added. OpenAI, Twilio, and other server secrets are never placed in this app.
