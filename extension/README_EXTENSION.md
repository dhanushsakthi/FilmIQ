# FilmIQ Chrome Extension - Installation Guide

You have successfully converted FilmIQ into a Chrome extension! Follow these steps to "run" it in your browser.

## 🚀 How to Load the Extension

1.  Open **Google Chrome**.
2.  Navigate to `chrome://extensions/` by typing it in the address bar.
3.  Enable **Developer mode** using the toggle in the top right corner.
4.  Click the **Load unpacked** button.
5.  Select the folder: `d:\FilmIQ\extension`.

## ⚙️ Configuration

Once loaded:
1.  Click the **FilmIQ** icon in your extension toolbar (you might need to pin it first).
2.  Right-click the icon and select **Options**.
3.  Ensure your **TMDB** and **Gemini** API keys are entered (defaults are already included).
4.  Click **Save Settings**.

## 🎥 Features
- **AI-Powered Search**: Type any movie name or description.
- **Voice Search**: Click the microphone and speak (e.g., "Find me 90s thriller movies").
- **Trailer Previews**: Click any movie poster to watch the trailer instantly.
- **Auto-Trending**: Hero section rotates through trending movies every 10 seconds.

## 📂 Project Structure
- `manifest.json`: Configuration and permissions.
- `popup.html/js/css`: The main interface you see when clicking the icon.
- `options.html/js`: Settings page for API keys.
- `utils/`: API clients for TMDB and Gemini.
- `icons/`: Extension icons.

Enjoy your smart movie recommendation platform directly in your browser!
