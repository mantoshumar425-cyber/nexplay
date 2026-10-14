NEXTPLAY — Game Loading Fix + Game of the Day

FILES TO UPLOAD TO YOUR GITHUB REPOSITORY ROOT:
- index.html (replace the old file)
- sw.js (replace the old file; updates the PWA cache)
- manifest.webmanifest (keep/replace with included copy)
- app-icon.svg (keep/replace with included copy)
- api/games.js (IMPORTANT: create an `api` folder in the repository root and place games.js inside it)

WHY api/games.js MATTERS:
The page now calls /api/games?page=1 on your own Vercel domain. The serverless function fetches GamePix server-side, avoiding browser CORS restrictions, and tries the official GamePix catalogue endpoint if the publisher feed is unavailable. Vercel automatically deploys JavaScript files in the root `api` folder as functions.

DEPLOY:
1. Upload the files, preserving the api/games.js folder path.
2. Commit to the branch connected to Vercel.
3. Wait for deployment to show Ready.
4. Open https://nextplay-taupe.vercel.app/api/games?page=1. A successful response should be JSON containing an `items` array.
5. Refresh NEXTPLAY. If an old installed PWA view remains, fully close it and reopen; the service-worker cache version is bumped.

NEW FEATURE:
Game of the Day chooses a daily spotlight from the loaded catalogue and opens it with the existing game player.

Note: This package prepares the fix but does not publish to your Vercel account automatically.
