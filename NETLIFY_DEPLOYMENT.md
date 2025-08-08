# Deploying DroneFlow to Netlify

## Prerequisites
- GitHub account
- Netlify account (free tier available)
- Your DroneFlow project code

## Step-by-Step Deployment Guide

### 1. Prepare Your Project for Netlify

**Create build configuration file:**
Create a `netlify.toml` file in your project root:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  command = "npm run dev"
  port = 5000
  publish = "dist"
```

**Update package.json scripts (if needed):**
Ensure your build script creates a static build:
```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 2. Push Code to GitHub

1. **Create a new GitHub repository:**
   - Go to github.com and click "New repository"
   - Name it "droneflow" or similar
   - Make it public (required for free Netlify deployments)
   - Don't initialize with README (you already have files)

2. **Push your local code:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - DroneFlow drone survey management system"
   git branch -M main
   git remote add origin https://github.com/yourusername/droneflow.git
   git push -u origin main
   ```

### 3. Deploy on Netlify

#### Option A: GitHub Integration (Recommended)

1. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com) and sign up/login
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub account

2. **Configure deployment:**
   - Select your DroneFlow repository
   - Branch to deploy: `main`
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

#### Option B: Manual Deployment

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com) and login
   - Drag and drop your `dist` folder onto the deploy area
   - Your site will be deployed instantly

### 4. Configure Custom Domain (Optional)

1. **In Netlify dashboard:**
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Follow DNS configuration instructions

### 5. Environment Variables (If Needed)

1. **In Netlify dashboard:**
   - Go to Site settings → Environment variables
   - Add any required environment variables
   - For DroneFlow, you might need:
     - `VITE_API_BASE_URL` (if using external APIs)

### 6. Enable Forms (If Using Contact Forms)

1. **In Netlify dashboard:**
   - Go to Site settings → Forms
   - Enable form processing if your app uses forms

## Important Notes for DroneFlow

### Backend Considerations
**⚠️ Important:** Your current DroneFlow setup includes an Express.js backend, but Netlify only hosts static sites. You have two options:

#### Option 1: Frontend-Only Deployment (Recommended for Demo)
- Deploy only the frontend to Netlify
- Mock data will work perfectly for demonstration
- All UI functionality will be available
- This is ideal for the FlytBase submission

#### Option 2: Full-Stack Deployment
- Frontend on Netlify
- Backend on a service like:
  - Railway.app
  - Render.com
  - Vercel (supports both)
  - Heroku

### Build Optimization

Add these optimizations to your `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select'],
        },
      },
    },
  },
});
```

## Expected Results

After deployment:
- **Build time:** ~2-3 minutes
- **URL:** You'll get a random URL like `https://amazing-pastry-123456.netlify.app`
- **Custom domain:** Available with free plan
- **SSL:** Automatic HTTPS
- **CDN:** Global content delivery

## Troubleshooting

**Build fails?**
- Check that all dependencies are in `package.json`
- Ensure Node.js version compatibility
- Review build logs in Netlify dashboard

**404 errors on refresh?**
- Make sure `netlify.toml` includes the redirect rule
- Or add `_redirects` file: `/* /index.html 200`

**Environment variables not working?**
- Prefix frontend variables with `VITE_`
- Add them in Netlify dashboard under Site settings

Your DroneFlow application will be live and accessible worldwide within minutes of deployment!