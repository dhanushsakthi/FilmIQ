# FilmIQ - Cinematic Movie Recommendations

FilmIQ is a premium, Netflix-style movie recommendation platform built with **Next.js 14**, **Tailwind CSS**, and **TypeScript**. It leverages AI (Gemini) for voice search intent and TMDB for rich movie data.

## 🚨 Prerequisites

**You do NOT have Node.js installed.** 
To run this project, you must install Node.js first.

1.  **Download Node.js**: Go to [nodejs.org](https://nodejs.org/) and download the **LTS (Long Term Support)** version.
2.  **Install**: Run the installer and follow the on-screen instructions. ensure "Add to PATH" is checked.
3.  **Verify**: Open a new terminal window and run `node -v` and `npm -v` to ensure they are installed.

## 🚀 Getting Started

Once Node.js is installed:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Explore**:
    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🌟 Features

*   **Cinematic Hero Section**: Auto-playing background slideshow of trending movies.
*   **Voice Search**: Click the microphone to search naturally (e.g., "Show me 90s action movies").
*   **Smart Search**: Powered by Google Gemini AI to understand user intent.
*   **Responsive Design**: Mobile-first approach using Tailwind CSS.
*   **Trailer Playback**: Watch trailers instantly in a clean modal overlay.

## 🛠 Tech Stack

*   **Framework**: Next.js 14 (App Router)
*   **Styling**: Tailwind CSS
*   **Language**: TypeScript
*   **APIs**: TMDB (Movies), Google Gemini (AI), YouTube (Trailers)

## 📁 Project Structure

*   **/app**: Routes and Pages (App Router).
*   **/components**: Reusable UI components (Navbar, MovieRow, Hero, etc.).
*   **/lib**: API interactions and utility functions.
*   **/styles**: Global styles and Tailwind directives.

## 🔑 Environment Variables

The `.env.local` file is already pre-configured with the project keys:
*   `NEXT_PUBLIC_TMDB_API_KEY`
*   `NEXT_PUBLIC_GEMINI_API_KEY`
*   `NEXT_PUBLIC_YOUTUBE_API_KEY`
*   `NEXT_PUBLIC_IMDB_API_KEY`

---
**Developed by S. DHANUSH**
