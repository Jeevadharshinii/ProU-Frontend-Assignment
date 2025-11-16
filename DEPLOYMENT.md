# Deploying RoastMyCV to Vercel

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/cli) installed (optional, but recommended)
3. A GitHub account (recommended for automatic deployments)

## Environment Variables

Before deploying, you need to set up the following environment variables in Vercel:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_cHJvbXB0LWJlZXRsZS02My5jbGVyay5hY2NvdW50cy5kZXYk
VITE_GEMINI_API_KEY=AIzaSyD22v6uifpB8r8ssZf56ZwHHTx8qkeo3pM
```

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub:**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/ROASTMYCV.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it as a Vite project

3. **Configure Environment Variables:**
   - In the project settings, go to "Environment Variables"
   - Add each variable from above:
     - `VITE_CLERK_PUBLISHABLE_KEY`
     - `VITE_GEMINI_API_KEY`

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your app
   - You'll get a live URL like `https://your-project.vercel.app`

## Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```powershell
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```powershell
   vercel login
   ```

3. **Deploy from project directory:**
   ```powershell
   cd C:\Users\GANES\Downloads\ROASTMYCV-main\ROASTMYCV-main
   vercel
   ```

4. **Follow the prompts:**
   - Link to existing project or create new
   - Confirm settings
   - Wait for deployment

5. **Add Environment Variables:**
   ```powershell
   vercel env add VITE_CLERK_PUBLISHABLE_KEY
   vercel env add VITE_GEMINI_API_KEY
   ```

6. **Redeploy with environment variables:**
   ```powershell
   vercel --prod
   ```

## Option 3: One-Command Deploy

From your project directory:

```powershell
# First time setup
vercel

# Add environment variables in Vercel dashboard

# Production deployment
vercel --prod
```

## Build Settings (Auto-detected by Vercel)

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Post-Deployment

1. **Test your deployment:**
   - Visit the provided URL
   - Test authentication (Clerk)
   - Test resume upload and roasting (Gemini API)
   - Test audio features

2. **Set up custom domain (optional):**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration steps

3. **Enable automatic deployments:**
   - Push to `main` branch = production deployment
   - Push to other branches = preview deployments

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure environment variables are set correctly
- Check build logs in Vercel dashboard

### API Keys Not Working
- Make sure environment variables are prefixed with `VITE_`
- Redeploy after adding/changing environment variables
- Check that keys are valid and have correct permissions

### Clerk Authentication Issues
- Verify your Clerk publishable key
- Add your Vercel domain to Clerk's allowed origins
- Check Clerk dashboard for any domain restrictions

### Audio Not Working
- The Web Speech API works in modern browsers
- No additional configuration needed
- Check browser console for errors

## Security Notes

- Never commit `.env` file to Git (already in `.gitignore`)
- Store sensitive keys only in Vercel environment variables
- Consider using Vercel's preview deployments for testing
- Rotate API keys periodically

## Continuous Deployment

Once connected to GitHub:
- Every push to `main` triggers a production deployment
- Pull requests get automatic preview deployments
- Preview URLs are shareable for testing

## Monitoring

- View deployment logs in Vercel dashboard
- Check analytics for visitor stats
- Monitor API usage in Google Cloud Console (Gemini)
- Monitor authentication in Clerk dashboard

---

**Ready to deploy?** Run `vercel` in your terminal or import via the Vercel dashboard!
