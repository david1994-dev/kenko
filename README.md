# KENKO store

Next.js (App Router) storefront for KENKO. Products, orders and customers live in Postgres; product images live in Vercel Blob. Checkout is cash on delivery with no customer login.

## Run locally

```bash
cp .env.example .env.local   # then fill in the values
npm install
npm run db:migrate           # create tables
npm run db:seed              # load the sample catalog (safe to re-run)
npm run dev
```

Without a Blob store connected, images uploaded in `/admin` are saved to `public/uploads` (dev only).

## Environment variables

| Name | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (use the pooled URL on Neon) |
| `ADMIN_PASSWORD` | Password for `/admin` |
| `SESSION_SECRET` | Random string of 32+ characters that signs the admin cookie |
| `BLOB_STORE_ID` / `BLOB_READ_WRITE_TOKEN` | Added automatically when a Blob store is connected in Vercel (new stores use `BLOB_STORE_ID` with OIDC, older ones a read-write token) |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used in sitemap, canonical links and structured data |

## Deploy on Vercel

1. Create a Postgres database (Storage → Neon) and a Blob store (Storage → Blob) and connect both to the project.
2. Add `ADMIN_PASSWORD`, `SESSION_SECRET` and `NEXT_PUBLIC_SITE_URL` in Settings → Environment Variables.
3. Tables are created and updated automatically: the `vercel-build` script runs `drizzle-kit migrate` before `next build`. Load the sample catalog once against the production database (not part of the build, so it never overwrites your edits):

   ```bash
   DATABASE_URL="<production url>" npm run db:seed
   ```

4. Deploy. Manage orders and product images at `/admin`.

## Database

Schema: `src/db/schema.ts`. After changing it, run `npm run db:generate` and commit the new file in `drizzle/`.
