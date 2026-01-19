// FilmIQ Chrome Extension - Main Popup Logic

// State
let currentMovies = {
    trending: [],
    topRated: [],
    nowPlaying: []
};
let currentHeroIndex = 0;
let heroInterval = null;
let isListening = false;
let currentSearchQuery = '';

// DOM Elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const voiceBtn = document.getElementById('voice-btn');
const micIcon = document.getElementById('mic-icon');
const searchContainer = document.querySelector('.search-container');

const heroSection = document.getElementById('hero-section');
const heroImage = document.getElementById('hero-image');
const heroTitle = document.getElementById('hero-title');
const heroMatch = document.getElementById('hero-match');
const heroYear = document.getElementById('hero-year');
const heroOverview = document.getElementById('hero-overview');
const heroPlayBtn = document.getElementById('hero-play-btn');

const searchResults = document.getElementById('search-results');
const searchTitle = document.getElementById('search-title');
const searchGrid = document.getElementById('search-grid');
const movieRowsContainer = document.getElementById('movie-rows');

const trendingRow = document.getElementById('trending-row');
const topratedRow = document.getElementById('toprated-row');
const nowplayingRow = document.getElementById('nowplaying-row');

const trailerModal = document.getElementById('trailer-modal');
const modalClose = document.getElementById('modal-close');
const trailerIframe = document.getElementById('trailer-iframe');

// Initialize
async function init() {
    try {
        // Fetch all movie data
        const [trending, topRated, nowPlaying] = await Promise.all([
            getTrendingMovies(),
            getTopRatedMovies(),
            getNowPlayingMovies()
        ]);

        currentMovies.trending = trending;
        currentMovies.topRated = topRated;
        currentMovies.nowPlaying = nowPlaying;

        // Render UI
        renderHero();
        renderMovieRow(trendingRow, trending);
        renderMovieRow(topratedRow, topRated);
        renderMovieRow(nowplayingRow, nowPlaying);

        // Start hero auto-rotation
        startHeroRotation();

        // Setup scroll buttons
        setupScrollButtons();
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to load movies. Please check your API keys in extension options.');
    }
}

// Hero Section
function renderHero() {
    if (currentMovies.trending.length === 0) return;

    const movie = currentMovies.trending[currentHeroIndex];
    heroImage.src = getImageUrl(movie.backdrop_path, 'original');
    heroTitle.textContent = movie.title || movie.original_title;
    heroMatch.textContent = `${Math.round(movie.vote_average * 10)}% Match`;
    heroYear.textContent = movie.release_date?.split('-')[0] || '';
    heroOverview.textContent = movie.overview;

    heroPlayBtn.onclick = () => openTrailer(movie.id);
}

function startHeroRotation() {
    if (heroInterval) clearInterval(heroInterval);

    heroInterval = setInterval(() => {
        if (currentMovies.trending.length > 0) {
            currentHeroIndex = (currentHeroIndex + 1) % currentMovies.trending.length;
            renderHero();
        }
    }, 10000);
}

// Movie Rows
function renderMovieRow(container, movies) {
    container.innerHTML = '';

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.onclick = () => openTrailer(movie.id);

        const img = document.createElement('img');
        img.src = getImageUrl(movie.poster_path, 'w500');
        img.alt = movie.title;
        img.loading = 'lazy';

        card.appendChild(img);
        container.appendChild(card);
    });
}

function setupScrollButtons() {
    const rows = document.querySelectorAll('.movie-row');

    rows.forEach(row => {
        const leftBtn = row.querySelector('.scroll-left');
        const rightBtn = row.querySelector('.scroll-right');
        const content = row.querySelector('.row-content');

        leftBtn.onclick = () => {
            content.scrollBy({ left: -content.clientWidth, behavior: 'smooth' });
        };

        rightBtn.onclick = () => {
            content.scrollBy({ left: content.clientWidth, behavior: 'smooth' });
        };
    });
}

// Search
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        await performSearch(query);
    }
});

async function performSearch(query) {
    try {
        currentSearchQuery = query;
        const results = await searchMovies(query);

        if (results.length > 0) {
            // Hide hero and rows, show search results
            heroSection.style.display = 'none';
            movieRowsContainer.style.display = 'none';
            searchResults.classList.remove('hidden');

            searchTitle.textContent = `Search Results for "${query}"`;
            searchGrid.innerHTML = '';

            results.forEach(movie => {
                const img = document.createElement('img');
                img.src = getImageUrl(movie.poster_path, 'w500');
                img.alt = movie.title;
                img.onclick = () => openTrailer(movie.id);
                searchGrid.appendChild(img);
            });
        }
    } catch (error) {
        console.error('Search error:', error);
        showError('Search failed. Please try again.');
    }
}

function clearSearch() {
    searchInput.value = '';
    currentSearchQuery = '';
    searchResults.classList.add('hidden');
    heroSection.style.display = 'flex';
    movieRowsContainer.style.display = 'block';
}

// Voice Search
voiceBtn.addEventListener('click', startVoiceSearch);

function startVoiceSearch() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Voice search not supported in this browser. Please use Chrome.');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    isListening = true;
    micIcon.classList.add('listening');
    searchContainer.classList.add('listening');
    searchInput.placeholder = 'Listening...';

    recognition.start();

    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Heard:', transcript);

        isListening = false;
        micIcon.classList.remove('listening');
        searchContainer.classList.remove('listening');
        searchInput.placeholder = 'Processing...';

        try {
            const refinedQuery = await processVoiceQuery(transcript);
            searchInput.value = refinedQuery;
            searchInput.placeholder = 'Search...';
            await performSearch(refinedQuery);
        } catch (error) {
            console.error('Voice processing error:', error);
            searchInput.value = transcript;
            searchInput.placeholder = 'Search...';
            await performSearch(transcript);
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        isListening = false;
        micIcon.classList.remove('listening');
        searchContainer.classList.remove('listening');
        searchInput.placeholder = 'Search...';
    };

    recognition.onend = () => {
        isListening = false;
        micIcon.classList.remove('listening');
        searchContainer.classList.remove('listening');
        if (searchInput.placeholder === 'Listening...') {
            searchInput.placeholder = 'Search...';
        }
    };
}

// Trailer Modal
async function openTrailer(movieId) {
    try {
        const videos = await getMovieVideos(movieId);
        const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        const videoKey = trailer ? trailer.key : (videos.length > 0 ? videos[0].key : null);

        if (videoKey) {
            trailerIframe.src = `https://www.youtube.com/embed/${videoKey}?autoplay=1`;
            trailerModal.classList.remove('hidden');
        } else {
            alert('No trailer available for this movie.');
        }
    } catch (error) {
        console.error('Trailer fetch error:', error);
        alert('Failed to load trailer.');
    }
}

function closeTrailer() {
    trailerModal.classList.add('hidden');
    trailerIframe.src = '';
}

modalClose.addEventListener('click', closeTrailer);
trailerModal.querySelector('.modal-backdrop').addEventListener('click', closeTrailer);

// Navbar scroll effect
const navbar = document.getElementById('navbar');
document.body.addEventListener('scroll', () => {
    if (document.body.scrollTop > 0) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Error handling
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position: fixed; top: 60px; left: 50%; transform: translateX(-50%); background: #e50914; color: white; padding: 12px 24px; border-radius: 4px; z-index: 100; font-size: 14px;';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Clear search when clicking logo
document.querySelector('.logo').addEventListener('click', clearSearch);

// Start the app
init();
