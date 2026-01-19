// Background Service Worker for FilmIQ Chrome Extension

chrome.runtime.onInstalled.addListener(() => {
    console.log('FilmIQ Extension Installed');

    // Set default API keys if not already set
    chrome.storage.sync.get(['tmdbApiKey', 'geminiApiKey'], (result) => {
        if (!result.tmdbApiKey) {
            chrome.storage.sync.set({
                tmdbApiKey: '5f1fcfe4e92b652f168f5ca0025d91f9'
            });
        }
        if (!result.geminiApiKey) {
            chrome.storage.sync.set({
                geminiApiKey: 'AIzaSyDgdb41GI78iidiFjtUw8k9rC4Xw3vOT6g'
            });
        }
    });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getApiKeys') {
        chrome.storage.sync.get(['tmdbApiKey', 'geminiApiKey'], (result) => {
            sendResponse(result);
        });
        return true; // Keep channel open for async response
    }
});
