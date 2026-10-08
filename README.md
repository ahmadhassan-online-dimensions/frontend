# VUE & OR — landing page (React + Vite)

```
npm install
npm run dev          # http://localhost:5173  (backend must run on :8080)
```

API address: `VITE_API_URL` in `.env` (default `http://localhost:8080/api`).

## Photos

The photos are not in the repo. Put them in `public/images/` with these names; until a file exists a warm placeholder is shown.

| File | Where it appears |
|---|---|
| hero.jpg | Hero background (woman, necklace) |
| necklace-closed.jpg / eyewear-open.jpg | 02 slider, left / right |
| model01-lifestyle.jpg, m1-closed.jpg, m1-open.jpg | 03 Model 01 |
| model02-lifestyle.jpg, m2-closed.jpg, m2-open.jpg | 03 Model 02 |
| finish-gold.jpg / finish-plated.jpg | 04 finish panel |
| beautiful.jpg | 05 pendant |
| uae.jpg | 06 full-width photo |
| piece1.jpg, piece1-inset.jpg, piece2.jpg, piece2-inset.jpg | 07 product cards |
| closing.jpg | closing banner |

## Backend connection

| UI | API |
|---|---|
| Product cards | `GET /products` |
| Sign in / Register | `POST /users/login`, `/users/register`, `GET /users/profile` |
| Shop now, bag | `POST /cart`, `GET /cart`, `PUT /cart/:id`, `DELETE /cart/:id` |
| Pay securely | `POST /orders/checkout` → redirect to the returned `paymentUrl` |
| Newsletter | `POST /newsletter` |

Backend: run `npm run seed` once to create Model 01 / Model 02.

## Sign in with Google / Apple

Both buttons are in the sign-in popup. Fill these in `.env` **before building** (Vite bakes them into the bundle) and set the matching
`GOOGLE_CLIENT_ID` / `APPLE_CLIENT_ID` in the backend `.env`:

| Variable | Where it comes from |
|---|---|
| `VITE_GOOGLE_CLIENT_ID` | Google Cloud Console → APIs & Services → Credentials → OAuth client ID (type *Web application*). Add your site (and `http://localhost:5173`) under *Authorized JavaScript origins*. |
| `VITE_APPLE_CLIENT_ID` | Apple Developer → Identifiers → **Services ID** (needs Sign in with Apple enabled, your domain and the return URL registered). |
| `VITE_APPLE_REDIRECT_URI` | The return URL you registered with Apple, e.g. `https://yourdomain.com/` (must be HTTPS and a real domain; Apple does not work on localhost). |
