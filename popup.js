// DOM Elements
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const refreshBtn = document.getElementById('refreshQuote');
const copyBtn = document.getElementById('copyQuote');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const langToggle = document.getElementById('langToggle');
const langText = document.getElementById('langText');
const loading = document.getElementById('loading');
const notification = document.getElementById('notification');

// Default language
let language = 'en';

// Get saved preferences from storage
chrome.storage.sync.get(['language', 'theme'], function(result) {
    // Set language from storage or default to English
    language = result.language || 'en';
    langText.textContent = language.toUpperCase();
    
    // Set theme from storage or default based on system preference
    if (result.theme === 'dark' || 
       (result.theme === undefined && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
        themeIcon.setAttribute("d", "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z");
    }
    
    // Fetch initial quote
    fetchQuote();
});

// Function to fetch a quote using the background script
function fetchQuote() {
    loading.style.display = 'block';
    quoteText.style.opacity = '0.3';
    quoteAuthor.style.opacity = '0.3';
    
    // Send message to background script to fetch quote
    chrome.runtime.sendMessage(
        { action: 'fetchQuote', language: language },
        function(response) {
            if (response && !response.error) {
                quoteText.textContent = response.quoteText || "The quieter you become, the more you can hear.";
                quoteAuthor.textContent = response.quoteAuthor ? `— ${response.quoteAuthor}` : '— Unknown';
            } else {
                console.error('Error fetching quote:', response ? response.error : 'No response');
                quoteText.textContent = "Books are a uniquely portable magic.";
                quoteAuthor.textContent = "— Stephen King";
            }
            
            quoteText.style.opacity = '1';
            quoteAuthor.style.opacity = '1';
            loading.style.display = 'none';
        }
    );
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.setAttribute("d", "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z");
        
        // Save preference
        chrome.storage.sync.set({ 'theme': 'dark' });
    } else {
        themeIcon.setAttribute("d", "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z");
        
        // Save preference
        chrome.storage.sync.set({ 'theme': 'light' });
    }
});

// Toggle language
langToggle.addEventListener('click', () => {
    language = language === 'en' ? 'ru' : 'en';
    langText.textContent = language.toUpperCase();
    
    // Save preference
    chrome.storage.sync.set({ 'language': language });
    
    fetchQuote();
});

// Copy quote to clipboard
copyBtn.addEventListener('click', () => {
    const textToCopy = `${quoteText.textContent} ${quoteAuthor.textContent}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        notification.classList.add('fade-in');
        setTimeout(() => {
            notification.classList.remove('fade-in');
        }, 2000);
    });
});

// Refresh quote
refreshBtn.addEventListener('click', fetchQuote);