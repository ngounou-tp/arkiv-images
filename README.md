# Arkiv — Object Collection Manager

A full-stack application to manage a collection of "Objects" with real-time updates via Socket.IO.

## Stack

| Layer | Technology |
|---|---|
| **API** | NestJS + TypeScript |
| **Database** | MongoDB (Atlas free tier) |
| **Storage** | Any S3-compatible service (Cloudflare R2, Backblaze B2, MinIO) |
| **Web** | Next.js 14 + Tailwind CSS |
| **Mobile** | React Native + Expo |
| **Real-time** | Socket.IO |
| **Deployment** | Render.com (free tier) |

---

## Project Structure

```
project/
├── api/               # NestJS REST API + WebSocket
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── objects/
│   │       ├── object.schema.ts
│   │       ├── objects.service.ts    # S3 upload + CRUD
│   │       ├── objects.controller.ts # REST endpoints
│   │       ├── objects.gateway.ts    # Socket.IO gateway
│   │       └── objects.module.ts
│   ├── .env.example
│   └── Dockerfile
│
├── web/               # Next.js web app
│   ├── app/
│   │   ├── page.tsx               # Collection grid (real-time)
│   │   └── objects/[id]/page.tsx  # Object detail
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── ObjectCard.tsx
│   │   ├── CreateModal.tsx
│   │   └── Toaster.tsx
│   ├── lib/
│   │   ├── api.ts         # API client helpers
│   │   └── useSocket.ts   # Socket.IO hook
│   ├── .env.local.example
│   └── Dockerfile
│
└── render.yaml        # Render.com deployment blueprint
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/objects` | Create object (multipart: `title`, `description`, `image`) |
| `GET` | `/objects` | List all objects |
| `GET` | `/objects/:id` | Get single object |
| `DELETE` | `/objects/:id` | Delete object + removes image from S3 |

### Socket.IO Events

| Event | Direction | Payload |
|---|---|---|
| `object:created` | Server → Clients | Full object document |
| `object:deleted` | Server → Clients | `{ id: string }` |

---

## Local Development

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- An S3-compatible bucket (see Storage section)

### 1. Setup the API

```bash
cd api
cp .env.example .env
# Edit .env with your credentials
npm install
npm run start:dev
```

API runs on http://localhost:3001

### 2. Setup the Web

```bash
cd web
cp .env.local.example .env.local
# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:3001
npm install
npm run dev
```

Web runs on http://localhost:3000

---

## Storage Setup (S3-compatible, NOT AWS)

### Option A — Cloudflare R2 (Recommended, generous free tier)

1. Go to https://dash.cloudflare.com → R2
2. Create a bucket (e.g. `arkiv-objects`)
3. Enable **Public access** on the bucket
4. Create an API token with R2 read+write permissions
5. Set these env vars:

```env
S3_BUCKET_NAME=arkiv-objects
S3_REGION=auto
S3_ACCESS_KEY=<your-r2-access-key-id>
S3_SECRET_KEY=<your-r2-secret-access-key>
S3_ENDPOINT=https://<your-account-id>.r2.cloudflarestorage.com
S3_FORCE_PATH_STYLE=false
S3_CUSTOM_URL=https://pub-<hash>.r2.dev
```

### Option B — Backblaze B2

1. Create a B2 bucket at https://backblaze.com
2. Set public access
3. Create application key

```env
S3_BUCKET_NAME=arkiv-objects
S3_REGION=us-west-004          # your region
S3_ACCESS_KEY=<keyID>
S3_SECRET_KEY=<applicationKey>
S3_ENDPOINT=https://s3.us-west-004.backblazeb2.com
S3_FORCE_PATH_STYLE=false
```

---

## Database Setup (MongoDB Atlas — Free)

1. Go to https://cloud.mongodb.com
2. Create a free M0 cluster
3. Create a database user
4. Whitelist `0.0.0.0/0` (for Render.com)
5. Get your connection string:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/objects-db?retryWrites=true&w=majority
```

---

## Deployment on Render.com (Free Tier)

Render.com offers free Web Services (sleep after 15min inactivity on free tier).

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/<you>/arkiv.git
git push -u origin main
```

### Step 2 — Deploy via Blueprint

1. Go to https://dashboard.render.com
2. Click **New → Blueprint**
3. Connect your GitHub repo
4. Render will detect `render.yaml` and create both services

### Step 3 — Set Environment Variables

In the Render dashboard, for the **arkiv-api** service, set:

| Key | Value |
|---|---|
| `MONGODB_URI` | Your Atlas connection string |
| `S3_BUCKET_NAME` | Your bucket name |
| `S3_REGION` | e.g. `auto` (R2) |
| `S3_ACCESS_KEY` | Your S3 access key |
| `S3_SECRET_KEY` | Your S3 secret key |
| `S3_ENDPOINT` | Your S3 endpoint URL |
| `S3_CUSTOM_URL` | Your public bucket URL |

For the **arkiv-web** service, set:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://arkiv-api.onrender.com` (your API URL) |

### Step 4 — Deploy

Click **Deploy** on both services. First deploy takes ~3-5 minutes.

Your app will be live at:
- **Web**: `https://arkiv-web.onrender.com`
- **API**: `https://arkiv-api.onrender.com`

> ⚠️ **Free tier note**: Render free services spin down after 15 minutes of inactivity. First request after sleep takes ~30s. Upgrade to Starter ($7/mo) to avoid this.

---

## Manual Render Deploy (without Blueprint)

If you prefer to set up services manually:

### API Service

- **Type**: Web Service
- **Runtime**: Node
- **Root Directory**: `api`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`
- **Health Check Path**: `/objects`

### Web Service

- **Type**: Web Service
- **Runtime**: Node
- **Root Directory**: `web`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`

---

## Mobile App (Expo)

The mobile app lives in the `mobile/` directory (React Native + Expo).

```bash
cd mobile
npm install
npx expo start
```

It connects to the same API and uses the same Socket.IO events for real-time updates.

---

## Testing the API

```bash
# List objects
curl http://localhost:3001/objects

# Create object
curl -X POST http://localhost:3001/objects \
  -F "title=My Object" \
  -F "description=A test object" \
  -F "image=@/path/to/image.jpg"

# Get single object
curl http://localhost:3001/objects/<id>

# Delete object
curl -X DELETE http://localhost:3001/objects/<id>
```
