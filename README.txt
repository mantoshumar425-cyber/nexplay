NEXTPLAY NOVA — Modular Website Project

Files:
- index.html: main page structure and links to assets
- css/: separated stylesheets, ordered to preserve the original design
- js/: separated JavaScript files, loaded in the original order

How to edit later:
- Change colors/layout in the relevant CSS file inside css/.
- Change game features, interactions, or AI behavior in the relevant JS file inside js/.
- Add new CSS by creating a file in css/ and adding a <link rel="stylesheet" href="css/your-file.css"> in index.html.
- Add new JS by creating a file in js/ and adding a <script src="js/your-file.js"></script> at the required place in index.html.
- Keep index.html, css/, and js/ together; do not upload index.html alone.

Deployment:
Upload the whole folder/project to your static host (or deploy the ZIP contents) so the relative css/ and js/ paths remain intact.
External dependencies and any configured API keys remain as in the original site. Do not put secret API keys in browser-side JS.

NEW UPDATE — FRACTURE INTERFACE + FULLSCREEN AI
- css/12-gamechanger-interface.css: full visual redesign in angular electric-blue/redline style.
- js/07-ai-fullscreen.js: adds Expand/Restore controls to both NOVA AI and Game Guide AI. Fullscreen fills the mobile/desktop viewport; Escape and Close restore the panel.
- Existing AI endpoints and chat behavior are unchanged. The standard AI still needs /api/chat and Game Guide AI uses /api/game-chat when available.
