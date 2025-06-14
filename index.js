document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const quoteText = document.getElementById('quoteText');
  const quoteAuthor = document.getElementById('quoteAuthor');
  const refreshBtn = document.getElementById('refreshQuote');
  const copyBtn = document.getElementById('copyQuote');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const loading = document.getElementById('loading');
  const notification = document.getElementById('notification');
  const favoriteBtn = document.getElementById('favoriteQuote');
  
  // Check for Chrome storage API (for extension)
  if (typeof chrome !== 'undefined' && chrome.storage) {
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

      // Load and apply quote background config (color only)
      chrome.storage.sync.get(['quoteBgColor'], (result) => {
          applyOuterBg(result);
      });

      function applyOuterBg(config) {
          const body = document.body;
          if (!body) return;
          body.style.setProperty('--outer-bg', config.quoteBgColor || '#ffffff');
      }

      // Listen for changes to background config
      chrome.storage.onChanged.addListener((changes, area) => {
          if (area === 'sync' && changes.quoteBgColor) {
              chrome.storage.sync.get(['quoteBgColor'], (result) => {
                  applyOuterBg(result);
              });
          }
      });
  } else {
      // Check user's preferred theme if not in extension context
      const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
      if (prefersDarkScheme.matches) {
          document.body.classList.add("dark-mode");
          themeIcon.setAttribute("d", "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z");
      }
      
      // Fetch initial quote
      fetchQuote();
  }
  
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
  if (themeToggle && themeIcon) {
      themeToggle.addEventListener('click', () => {
          document.body.classList.toggle('dark-mode');
          if (document.body.classList.contains('dark-mode')) {
              themeIcon.setAttribute("d", "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z");
              if (typeof chrome !== 'undefined' && chrome.storage) {
                  chrome.storage.sync.set({ 'theme': 'dark' });
              }
          } else {
              themeIcon.setAttribute("d", "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z");
              if (typeof chrome !== 'undefined' && chrome.storage) {
                  chrome.storage.sync.set({ 'theme': 'light' });
              }
          }
      });
  }

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

  // Add favorites logic
  function getCurrentQuote() {
      return {
          text: quoteText.textContent.trim(),
          author: quoteAuthor.textContent.replace(/^[-–—\s]+/, '').trim()
      };
  }

  function saveFavorite(quote) {
      chrome.storage.sync.get(['favorites'], (result) => {
          let favorites = Array.isArray(result.favorites) ? result.favorites : [];
          // Prevent duplicates
          if (favorites.some(f => f.text === quote.text && f.author === quote.author)) return;
          // Limit to 50
          if (favorites.length >= 50) favorites = favorites.slice(1);
          favorites.push(quote);
          chrome.storage.sync.set({ favorites });
      });
  }

  favoriteBtn.addEventListener('click', () => {
      const quote = getCurrentQuote();
      if (quote.text && quote.author) {
          saveFavorite(quote);
          favoriteBtn.classList.add('active');
          setTimeout(() => favoriteBtn.classList.remove('active'), 800);
      }
  });
});