# HCL Model Test Paper 1 (Vercel Ready)

A self-contained React application for HCL Campus Drive practice with **Model Test Paper 1** (30 Section A MCQs across Quant, Logical Reasoning, and Computer Fundamentals + 1 Section B Coding Problem with Java & Python solutions and test cases).

---

## 🛠️ Modifications Made

1. **Renamed / Updated all Test Paper 6 references to Test Paper 1**:
   - All 30 MCQ identifiers changed from `P6-Q01..P6-Q30` to `P1-Q01..P1-Q30`.
   - Coding item identifier changed from `P6-B` to `P1-B`.
   - All question objects have `"paper": 1`.
   - Component exported as `HCLModelTestPaper1`.
   - LocalStorage key updated to `hcl-model-paper-1-progress-v1`.
   - Heading, tab metadata, and instructions updated to **Model Test Paper 1**.
2. **Extracted Static JSON**:
   - The question bank is exported to [`public/questions.json`](./public/questions.json) and [`src/data/questions.json`](./src/data/questions.json). When deployed to Vercel, it is directly accessible as an API endpoint at `/questions.json`.
3. **Configured for Vercel Deployment**:
   - Added `package.json` with Vite + React 18 configuration.
   - Added `vite.config.js`, `index.html`, and `vercel.json` with SPA routing rewrites.
   - Tested and verified production build with `npm run build`.

---

## 🚀 How to Host on Vercel

### Option 1: Deploy with GitHub & Vercel Dashboard (Recommended)

1. Initialize git (if not already done) and push this folder to your GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - HCL Model Test Paper 1"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** > **"Project"**.
4. Import your GitHub repository.
5. Vercel will automatically detect **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**. Your site and `/questions.json` endpoint will be live in seconds!

---

### Option 2: Deploy Using Vercel CLI

1. Install the Vercel CLI globally (or run with npx):
   ```bash
   npm i -g vercel
   ```
2. In this folder (`HCL-P1`), run:
   ```bash
   vercel
   ```
3. Follow the CLI prompts to link and deploy to production:
   ```bash
   vercel --prod
   ```

---

## 💻 Local Development

- Run dev server:
  ```bash
  npm run dev
  ```
- Build for production:
  ```bash
  npm run build
  ```
- Preview production build:
  ```bash
  npm run preview
  ```
