# Church App — React Native + Expo

A full-featured mobile app for Coptic Orthodox churches (or any church), built with React Native, Expo, and Supabase. Includes a web-based admin panel for clergy to manage content from any device.

## Features

### Mobile App
- 📢 **Announcements** — with images, swipeable photo galleries, clickable links
- 📅 **Calendar** — upcoming events with hour-by-hour breakdowns
- 🎙️ **Sermons** — video links and downloadable files/notes
- 🙏 **Confession Booking** — embedded Calendly/Acuity scheduling
- 📋 **Sign-ups** — event registration forms (participant + volunteer) and anonymous Q&A
- 📸 **Photos** — church albums with save-to-camera-roll
- 🔔 **Push Notifications** — with deep linking to specific content
- 🗺️ **Maps Integration** — tap address to open Apple/Google Maps
- 🌐 **Social Links** — all social media in one place
- 🙏 **Prayer Requests** — anonymous submission form
- ⚙️ **Settings** — notification preferences, privacy policy, about

### Admin Panel (Web)
- Post announcements with images
- Add/edit/delete calendar events
- Upload sermons and files
- Send push notifications to all users
- Manage photo albums
- Create sign-up sheets (registration or Q&A)
- View and export sign-up responses by event (CSV)
- Real-time Q&A responses for live events

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native + Expo |
| Backend | Supabase (PostgreSQL + Storage + Realtime) |
| Push Notifications | Expo Push API via Supabase Edge Function |
| Admin Panel | Vanilla HTML/JS (single file) |
| Admin Hosting | Vercel (free) |
| Build/Deploy | EAS Build + EAS Submit |

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [EAS CLI](https://docs.expo.dev/build/setup/) (`npm install -g eas-cli`)
- [Supabase account](https://supabase.com) (free)
- [Expo account](https://expo.dev) (free)
- Apple Developer account ($99/year) for iOS
- Google Play Developer account ($25 one-time) for Android

---

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/church-app.git
cd church-app
npm install
```

### 2. Set up Supabase

Create a new project at [supabase.com](https://supabase.com), then run the SQL in `supabase/schema.sql` in your Supabase SQL Editor.

Update `src/supabase.js` with your project credentials:
```js
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

### 3. Configure the app

Update `src/data/index.js` with your church info:
```js
export const CHURCH_INFO = {
  name: 'Your Church Name',
  address: 'Your Address',
  phone: 'Your Phone',
  email: 'Your Email',
  website: 'https://yourwebsite.com',
  // ...
};
```

Update `app.json`:
```json
{
  "expo": {
    "name": "Your Church",
    "slug": "your-church-app",
    "ios": {
      "bundleIdentifier": "com.yourchurch.app"
    },
    "android": {
      "package": "com.yourchurch.app"
    },
    "extra": {
      "eas": {
        "projectId": "YOUR_EXPO_PROJECT_ID"
      }
    }
  }
}
```

Add your church's app artwork in an `assets/` folder. This template does not include church-specific images, so create these files or update `app.json` to use your own filenames:

- `assets/your-icon.png`
- `assets/your-splash.png`
- `assets/your-adaptive-icon.png`
- `assets/your-favicon.png`

### 4. Set up push notifications Edge Function

In Supabase → Edge Functions, create a function called `send-notification`:

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  const { title, body, tokens, data, image } = await req.json();
  const messages = tokens.map((token: string) => ({
    to: token, title, body, sound: 'default', priority: 'high',
    data: data || {},
    ...(image ? { image } : {}),
  }));
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messages),
  });
  const result = await response.json();
  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
```

**Important:** Turn off JWT verification for this function in Supabase.

### 5. Set up admin panel

Update the constants at the top of `admin/index.html`:
```js
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
const SUPABASE_SERVICE_KEY = 'YOUR_SUPABASE_SERVICE_ROLE_KEY';
const ADMIN_PASSWORD = 'your-secure-password';
```

Deploy to Vercel:
```bash
cd admin
npm install -g vercel
vercel --prod
```

### 6. Run locally
```bash
npx expo start
```

### 7. Build for production
```bash
# iOS
eas build --platform ios
eas submit --platform ios

# Android
eas build --platform android
eas submit --platform android
```

---

## Supabase Schema

Run `supabase/schema.sql` to create all tables and RLS policies.

---

## Admin Panel

The admin panel is a single HTML file at `admin/index.html`. Deploy it to Vercel, Netlify, or any static host.

Default password is set in the HTML file — change it before deploying!

Features:
- Post announcements with card image + detail photo gallery
- Add events with date/time pickers
- Upload sermons and files
- Send push notifications with deep linking
- Manage photo albums
- Create sign-up sheets (event registration or anonymous Q&A)
- View and export responses by event

---

## Confession Booking

The app supports embedded booking via:
- **Calendly** — `https://calendly.com/YOUR_USERNAME/confession`
- **Acuity Scheduling** — `https://YOUR_SUBDOMAIN.as.me/`

Update priest info in `src/screens/ConfessionScreen.js`.

---

## Customization

### Colors
Edit `src/theme/colors.js` to match your church branding.

### Home Cards
Edit the `HOME_CARDS` array in `src/data/index.js` to add/remove/reorder cards.

### Services Tab
Edit `src/screens/ServicesScreen.js` to list your church's ministries.

### Community Tab
Edit `COMMUNITY_CARDS` in `src/data/index.js` for community resources.

---

## License

MIT — free to use, modify, and distribute. Attribution appreciated but not required.

---

## Contributing

Pull requests welcome! This was built for a Coptic Orthodox church but is designed to work for any church or religious organization.
