// Options Page Logic

const tmdbKeyInput = document.getElementById('tmdb-key');
const geminiKeyInput = document.getElementById('gemini-key');
const optionsForm = document.getElementById('options-form');
const statusDiv = document.getElementById('status');

// Load saved settings
chrome.storage.sync.get(['tmdbApiKey', 'geminiApiKey'], (result) => {
    if (result.tmdbApiKey) {
        tmdbKeyInput.value = result.tmdbApiKey;
    }
    if (result.geminiApiKey) {
        geminiKeyInput.value = result.geminiApiKey;
    }
});

// Save settings
optionsForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const tmdbKey = tmdbKeyInput.value.trim();
    const geminiKey = geminiKeyInput.value.trim();

    if (!tmdbKey || !geminiKey) {
        showStatus('Please fill in all API keys', 'error');
        return;
    }

    chrome.storage.sync.set({
        tmdbApiKey: tmdbKey,
        geminiApiKey: geminiKey
    }, () => {
        showStatus('Settings saved successfully!', 'success');
    });
});

function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';

    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}
