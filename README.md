# 🛡️ Checker — Live Multi-Platform Mobile Account Verifier

A sleek, ultra-fast, and modern web application built with **Next.js 16 (Turbopack)**, **Tailwind CSS**, and **TypeScript** to verify whether an Indian mobile number is actively registered across 21+ supported platforms in real time.

---

## 🚀 Key Features

- ⚡ **Real-Time Registration Lookup**: Check mobile number registration on Meesho, Flipkart, Swiggy, Blinkit, Amazon, WhatsApp, Telegram, Myntra, Ajio, Oyo, and more.
- 🔑 **Smart Multi-API Key Pool (Auto-Rotation & Failover)**:
  - Server-side in-memory key pool with per-key cooldown tracking (5s rate-limit guard).
  - Round-robin key selection for high throughput.
  - Automatic failover: Immediately switches to the next available key if an upstream 429 or auth error occurs.
  - Dynamic client cooldown scaling (5s for 1 key $\rightarrow$ 2s for 3 keys $\rightarrow$ 1s for 5+ keys).
- 👗 **Number-First & Meesho-Priority Workflow**:
  - Auto-focused phone number input with fixed `🇮🇳 +91` prefix and auto-formatting (`XXXXX XXXXX`).
  - Meesho as the hardcoded #1 default active platform.
  - Compact 2-tier platform selector (Top 5 quick pills + searchable dropdown).
- 🎨 **Authentic Vector Brand Logos**:
  - Pixel-perfect vector brand assets for Meesho, Flipkart, Swiggy, Blinkit, Amazon, WhatsApp, Telegram, etc.
- 🌗 **Light & Dark Themes**:
  - Curated SaaS palette inspired by Linear & Vercel aesthetics with smooth theme toggling.
- 📱 **100% Mobile & Desktop Responsive**:
  - Desktop 2-column command center layout.
  - Compact touch-optimized interface for mobile screens.
- 📥 **Live Activity Feed & CSV Export**:
  - Session verification feed with masked numbers (`+91 98765 •••••`) and 1-click CSV export.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router + Turbopack)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Vanilla CSS
- **Icons**: [Lucide React](https://lucide.dev/) + Custom Vector Brand Logos
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Language**: TypeScript

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ratanlaldhakar/Checker.git
cd Checker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Single Key or Multi-Key Pool (Comma-separated keys for auto-rotation)
SUPERASSETS_API_KEYS="AK_YOUR_KEY_1,AK_YOUR_KEY_2,AK_YOUR_KEY_3"

# Fallback Single Key
SUPERASSETS_API_KEY=AK_YOUR_KEY_1

# App Branding
NEXT_PUBLIC_APP_NAME=Checker
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

---

## 👨‍💻 Developer & Attribution

This project is crafted and maintained with precision by **Vasu**.

- 🌐 **Official Website**: [vasuu.bond](https://vasuu.bond)
- ✈️ **Telegram Channel / Updates**: [@vasu_tricks](https://t.me/vasu_tricks)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
