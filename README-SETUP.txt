NEXTPLAY ENHANCED — DEPLOY NOTES

FILES
- index.html: existing site with a 3-dot navigation drawer and redesigned Cosmic Lucky Spin.
- chat-widget.css / chat-widget.js: styled chat panel and robust request/error handling.
- api/chat.js: general-purpose Nextplay AI endpoint.
- game-chat-widget.css / game-chat-widget.js: separate green Game Guide AI widget, limited to NEXTPLAY game help.
- api/game-chat.js: game-only Vercel endpoint, receives visible game titles/categories from the page. Both AI endpoints use the same server-side GROQ_API_KEY.
- vercel.json: function settings.

DEPLOY TO VERCEL
1. Put index.html, chat-widget.css, chat-widget.js, game-chat-widget.css, game-chat-widget.js, vercel.json and the api/ folder in the root of your existing GitHub repo. Replace the old index.html with this one.
2. In Vercel, open your project → Settings → Environment Variables.
3. Add GROQ_API_KEY with a NEW Groq API key. Do not put the key in HTML or JavaScript. Optionally add GROQ_MODEL=llama-3.3-70b-versatile.
4. Apply to Production (and Preview if needed), save, then redeploy the project.
5. Open https://YOUR-SITE/api/chat in a browser: a 405 Method not allowed response is expected for GET. The chat widget sends POST requests. If you see a platform 404 instead, check that api/chat.js is at the repository root under api/ and redeploy.
6. Test both the ✦ Ask Nextplay AI button and the 🎮 Game Guide AI button. The game-only endpoint is /api/game-chat; it shares the same GROQ_API_KEY environment variable. If it reports configuration missing, confirm GROQ_API_KEY exists in the Production environment and redeploy after saving it.

SECURITY
A Groq key was previously pasted into a chat. Treat that key as exposed: revoke/rotate it in the Groq console and only put the replacement in Vercel Environment Variables. Never commit .env files or put provider keys in client-side code.

FEATURES INCLUDED
- Bottom 3-dot menu opens all existing navigation destinations in a responsive drawer.
- Redesigned animated Cosmic Lucky Spin while preserving the existing once-per-day reward logic.
- Chat UI with loading state, readable errors, request timeout handling delegated to the platform, and recent conversation context.
- Secure server-side Groq API call using environment variables; method validation and sanitized user-facing provider errors.

Note: game progress and rewards remain browser-local as in the original project; this update does not pretend to add cloud syncing for them.

GAME GUIDE AI
- The second assistant is intentionally restricted to NEXTPLAY game catalogue and gaming-site features. General-knowledge questions should be redirected to the general Nextplay AI.
- It receives up to 60 currently rendered game titles/categories as context; if no games are loaded, it must not invent titles.
