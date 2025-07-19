# 🌡️ ConvertTemp.com — Smart & Instant Temperature Converter

**ConvertTemp** is a blazing-fast, SEO-optimized, single-page temperature converter built with **React + Vite + Tailwind CSS**. It supports intelligent conversion between Celsius, Fahrenheit, Kelvin, and Rankine, with a minimal design, dark mode, copy-to-clipboard, and region-aware behavior.

> ✅ Live Now: [www.ConvertTemp.com](https://www.converttemp.com)

---

## ✅ Features

### ⚙️ Core Functionality
- Convert °C, °F, K, and °R instantly
- Smart input detection and two-way conversion
- One-click **copy to clipboard**
- Clean, modern UI with debounced input

### 🎨 UI/UX & Accessibility
- Built with **Tailwind CSS**
- Fully responsive and mobile-friendly
- **Dark mode** with toggle + auto system detection

### 🌐 Globalized & Extensible
- Auto-detect browser language (prep for i18n)
- Region-based defaults (°F for US, °C elsewhere)
- Scalable design to support more units later (e.g., Réaumur, Newton)

### 🚀 SEO & PWA-Ready
- `robots.txt` and `sitemap.xml` included
- Custom **OG Image**, **favicon**, and full meta tags
- Progressive Web App (PWA) support (scoped)

### 📊 Analytics & Monetization
- PostHog or Plausible ready (usage tracking)
- Layout optimized for **high CTR AdSense zones**
- Future-ready for affiliate embeds or Pro tools

---

## 🛠️ Tech Stack

- **Frontend:** [React](https://reactjs.org/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Hosting:** [Vercel](https://vercel.com/) or [lovable.dev](https://lovable.dev/)
- **Analytics:** PostHog or Plausible (optional)

---

## 📁 Folder Structure

```bash
src/
├─ components/
│  ├─ Converter.tsx
│  ├─ ThemeToggle.tsx
│  └─ Meta.tsx
├─ assets/
│  └─ favicon.svg / og-image.png
├─ App.tsx
├─ main.tsx
├─ index.css
├─ i18n/ (scoped)
public/
├─ favicon.ico
├─ sitemap.xml
├─ robots.txt
├─ manifest.json (PWA-ready)
vite.config.ts


🚀 Getting Started

# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/ConvertTemp.git

# 2. Install dependencies
cd ConvertTemp
pnpm install

# 3. Start the development server
pnpm dev

Then go to: http://localhost:5173

🔧 Build for Production

pnpm build
pnpm preview
📌 Roadmap

 Language toggle & i18n
 Add unit conversion types (length, weight, volume)
 Export conversions (PDF/CSV)
 Pro version with user history & cloud sync
 Full PWA with offline support
📄 License

MIT License — open source, free to use, contribute, remix.

👤 Author

Built with 💙 by @jeffhonforloco
→ Follow for more tools like this!


---

Let me know if you'd like:

- Badges for GitHub (live preview, license, deploy status)
- Screenshot preview banner for GitHub
- A `vercel.json` or `netlify.toml` for CI/CD

Happy to prep those too.

