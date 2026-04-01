# Deployment Guide

## Quick Deploy to Netlify

This project is a multi-page static website. Deploy from the project root so Netlify can serve `index.html`, `pages/*.html`, `js/`, and `styles/` directly.

### Option 1: Drag & Drop (Easiest)

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag the entire project folder (or just the essential files)
3. Your site will be live instantly!

### Option 2: Connect to Git Repository

1. Push your code to GitHub/GitLab
2. Log in to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `.`
6. Click "Deploy site"

### Netlify 404 Fix (Important)

If you see "Page Not Found", this is usually because Netlify published the wrong folder.

Use the included `netlify.toml` in the project root. It sets:
- Publish directory to project root
- Redirects for extensionless URLs like `/register` to `/pages/register.html`

If your site was already connected before this file existed, trigger a new deploy after pulling latest changes.

## Important Files for Deployment

Make sure these files are included:

```
✅ index.html
✅ pages/ (all HTML files)
✅ styles/main.css
✅ js/ (all JS files)
✅ assets/ (optional - for logo)
```

## Files NOT Needed for Deployment

These can be excluded from manual uploads if needed:

```
❌ node_modules/
❌ .git/
```

## Post-Deployment

After deploying:

1. Test all pages work correctly
2. Test participant registration
3. Test judge login (judge/admin123)
4. Test certificate generation
5. Verify all navigation links work

## Custom Domain (Optional)

1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Follow instructions to connect your domain

## Environment Notes

- This project uses **localStorage** for data persistence
- Data is stored in the user's browser
- No backend or database required
- Each user has their own local data
- Perfect for single-event management

## Testing Locally Before Deploy

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Or just open index.html in browser
```

## Updating the Site

For Netlify deployments:
- **Drag & Drop**: Simply drag the updated folder again
- **Git Connected**: Just push to your repository - auto-deploys!

---

**Your site should be live and fully functional!**
