// DOM Elements
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const refreshBtn = document.getElementById('refreshQuote');
const copyBtn = document.getElementById('copyQuote');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const loading = document.getElementById('loading');
const notification = document.getElementById('notification');

// Get saved preferences from storage
chrome.storage.sync.get(['theme'], function(result) {
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
    
    // Fallback in case chrome runtime is not available or fails
    const fallbackTimeout = setTimeout(() => {
        console.log("Fallback timeout triggered");
        quoteText.textContent = "Books are a uniquely portable magic.";
        quoteAuthor.textContent = "— Stephen King";
        quoteText.style.opacity = '1';
        quoteAuthor.style.opacity = '1';
        loading.style.display = 'none';
    }, 5000); // 5 second timeout
    
    try {
        // Send message to background script to fetch quote
        chrome.runtime.sendMessage(
            { action: 'fetchQuote', language: 'en' },
            function(response) {
                // Clear the fallback timeout since we got a response
                clearTimeout(fallbackTimeout);
                
                if (response) {
                    console.log("Quote response received:", response);
                    quoteText.textContent = response.quoteText || "The quieter you become, the more you can hear.";
                    quoteAuthor.textContent = response.quoteAuthor ? `— ${response.quoteAuthor}` : '— Unknown';
                } else {
                    console.error('No response from background script');
                    quoteText.textContent = "Books are a uniquely portable magic.";
                    quoteAuthor.textContent = "— Stephen King";
                }
                
                quoteText.style.opacity = '1';
                quoteAuthor.style.opacity = '1';
                loading.style.display = 'none';
            }
        );
    } catch (error) {
        console.error("Error sending message to background script:", error);
        clearTimeout(fallbackTimeout); // Clear timeout to avoid duplicate fallbacks
        
        quoteText.textContent = "A reader lives a thousand lives before he dies. The man who never reads lives only one.";
        quoteAuthor.textContent = "— George R.R. Martin";
        quoteText.style.opacity = '1';
        quoteAuthor.style.opacity = '1';
        loading.style.display = 'none';
    }
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