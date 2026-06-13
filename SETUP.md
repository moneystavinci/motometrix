# Motometrix — Complete Setup Guide

## Overview
This guide walks you through setting up all required services to run Motometrix in production. 
Estimated time: ~45 minutes.

---

## Step 1: Clone & Install

```bash
git clone https://github.com/your-username/motometrix.git
cd motometrix
npm install
cp .env.example .env.local
```

---

## Step 2: Neon PostgreSQL (Free Database)

1. Go to **https://neon.tech** and create a free account
2. Click **"New Project"** → give it a name (e.g. `motometrix`)
3. Select a region closest to your users
4. Once created, click **"Connection Details"**
5. Copy the **Connection String** — it looks like:
   ```
   postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
6. Paste it as `DATABASE_URL` in your `.env.local`

**Run database migrations:**
```bash
npx prisma db push
```

---

## Step 3: Google Cloud Console

### 3a. Create a Project
1. Go to **https://console.cloud.google.com**
2. Click the project dropdown → **"New Project"**
3. Name it `Motometrix` → Create

### 3b. Enable Required APIs
In the left sidebar → **APIs & Services → Library**, search for and **Enable** each of:
- ✅ **Google Analytics Data API**
- ✅ **Google Analytics Admin API**
- ✅ **Google Search Console API**
- ✅ **Google+ API** (for profile info)

### 3c. Configure OAuth Consent Screen
1. Go to **APIs & Services → OAuth consent screen**
2. Choose **"External"** → Create
3. Fill in:
   - App name: `Motometrix`
   - User support email: your email
   - Developer contact: your email
4. Click **Save and Continue**
5. On the **Scopes** page, click **"Add or Remove Scopes"** and add:
   - `.../auth/analytics.readonly`
   - `.../auth/webmasters.readonly`
   - `email`, `profile`, `openid`
6. Add your own email to **Test Users** (required while app is in testing)
7. Save

### 3d. Create OAuth Credentials
1. Go to **APIs & Services → Credentials**
2. Click **"+ Create Credentials" → "OAuth Client ID"**
3. Application type: **Web application**
4. Name: `Motometrix Web`
5. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.vercel.app/api/auth/callback/google` (production)
6. Click **Create**
7. Copy the **Client ID** → `GOOGLE_CLIENT_ID` in `.env.local`
8. Copy the **Client Secret** → `GOOGLE_CLIENT_SECRET` in `.env.local`

---

## Step 4: Generate Security Keys

Run these commands in your terminal:

```bash
# NEXTAUTH_SECRET — session encryption
openssl rand -base64 32

# ENCRYPTION_KEY — AES-256 token encryption (must be exactly 64 hex chars)
openssl rand -hex 32

# ADMIN_SECRET_KEY — API protection
openssl rand -base64 32
```

Paste each into the corresponding variable in `.env.local`.

---

## Step 5: Mailchimp Integration

1. Log in to **https://mailchimp.com**
2. Go to your **Profile → Extras → API Keys**
3. Click **"Create A Key"** → copy it → `MAILCHIMP_API_KEY`
4. Note the **server prefix** from your API key (e.g. `us21` from `abc123-us21`) → `MAILCHIMP_SERVER_PREFIX`
5. Go to **Audience → All contacts → Settings → Audience name and defaults**
6. Copy the **Audience ID** → `MAILCHIMP_AUDIENCE_ID`

---

## Step 6: Google Analytics 4 Setup (if not yet done)

1. Go to **https://analytics.google.com**
2. Click **"Admin"** → **"Create Account"** (or use existing)
3. Create a **GA4 Property** for your website
4. Add the **tracking snippet** to your website's `<head>`:
   ```html
   <!-- Google tag (gtag.js) -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```
5. Wait 24–48 hours for data to start appearing

---

## Step 7: Google Search Console Setup (if not yet done)

1. Go to **https://search.google.com/search-console**
2. Click **"Add Property"** → Enter your website URL
3. Verify ownership (choose HTML file, meta tag, or DNS record)
4. Wait up to 72 hours for data to populate

---

## Step 8: Local Development

Fill in your `.env.local` with all values, then:

```bash
npm run dev
```

Open **http://localhost:3000** — you should see the Motometrix landing page.

---

## Step 9: Deploy to Vercel

### 9a. Push to GitHub
```bash
git add .
git commit -m "Initial Motometrix setup"
git push origin main
```

### 9b. Import to Vercel
1. Go to **https://vercel.com** → New Project
2. Import your GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. Click **"Environment Variables"** and add all values from `.env.local`
5. Set `NEXTAUTH_URL` to your Vercel domain: `https://yourapp.vercel.app`
6. Click **Deploy**

### 9c. Update Google OAuth redirect URI
After deployment, go back to **Google Cloud Console → Credentials** and add:
```
https://yourapp.vercel.app/api/auth/callback/google
```

---

## Step 10: Testing the Admin Endpoint

Once deployed, you can fetch your user funnel data:

```bash
curl -H "Authorization: Bearer YOUR_ADMIN_SECRET_KEY" \
  https://yourapp.vercel.app/api/admin/funnel-users
```

Response format:
```json
{
  "total": 42,
  "synced": 38,
  "users": [
    {
      "id": "...",
      "email": "user@example.com",
      "name": "Jane Smith",
      "websiteUrl": "https://janesmith.com",
      "mailchimpSynced": true,
      "createdAt": "2024-01-15T...",
      "lastLoginAt": "2024-01-20T..."
    }
  ]
}
```

---

## Checklist Before Going Live

- [ ] `DATABASE_URL` connected to Neon (run `npx prisma db push`)
- [ ] `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` configured
- [ ] OAuth redirect URIs include your production domain
- [ ] `NEXTAUTH_SECRET` is a random 32-byte value
- [ ] `ENCRYPTION_KEY` is exactly 64 hex characters
- [ ] `MAILCHIMP_API_KEY`, `MAILCHIMP_AUDIENCE_ID`, `MAILCHIMP_SERVER_PREFIX` set
- [ ] `ADMIN_SECRET_KEY` is set and kept private
- [ ] GA4 tag installed on your website
- [ ] Search Console verified for your domain
- [ ] Google OAuth consent screen has your GA4 + Search Console scopes approved

---

## Publishing Your OAuth App (Remove Test Mode)

While in **Testing** mode, only users you manually add as test users can sign in.
To allow any Google user:
1. Go to **Google Cloud Console → OAuth consent screen**
2. Click **"Publish App"**
3. Complete the verification process (may take a few days for sensitive scopes)

For internal/small-team use, staying in Testing mode with approved test users is fine.

---

## Troubleshooting

**"Sign in fails silently"**
→ Check that your redirect URI in Google Console exactly matches your app URL (including https, no trailing slash).

**"Dashboard shows demo data despite being signed in"**
→ Your GA4 property hasn't been linked yet, or the GA4 API isn't enabled in Google Cloud. Check the APIs & Services library.

**"Mailchimp sync failing"**
→ This is fire-and-forget and won't affect login. Check `MAILCHIMP_SERVER_PREFIX` matches your API key prefix.

**"Database connection error"**
→ Ensure `?sslmode=require` is at the end of your `DATABASE_URL`. Neon requires SSL.
