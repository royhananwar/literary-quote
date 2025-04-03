// Background script for the Literary Quotes extension

// Listen for installation or update events
chrome.runtime.onInstalled.addListener(() => {
  console.log('Literary Quotes extension installed or updated');
  
  // Initialize storage with default settings if needed
  chrome.storage.sync.get(['language', 'theme'], function(result) {
    if (!result.language) {
      chrome.storage.sync.set({ 'language': 'en' });
    }
    
    if (result.theme === undefined) {
      // In service workers, we can't check system preferences
      // So we'll default to light theme
      chrome.storage.sync.set({ 'theme': 'light' });
    }
  });
});

// Listen for message events from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchQuote') {
    fetchQuote(request.language)
      .then(data => sendResponse(data))
      .catch(error => {
        console.error('Error in fetchQuote:', error);
        sendResponse({ 
          error: error.message,
          quoteText: "Books are a uniquely portable magic.",
          quoteAuthor: "Stephen King"
        });
      });
    
    // Return true to indicate we will send a response asynchronously
    return true;
  }
});

// Function to fetch a quote
async function fetchQuote(language = 'en') {
  try {
    // Use the fetch API to get a quote
    const apiUrl = `https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=${language}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const text = await response.text();
    
    // The Forismatic API sometimes returns malformed JSON with unescaped quotes
    // We need to handle this case
    try {
      const data = JSON.parse(text);
      return data;
    } catch (parseError) {
      // Try to fix common JSON issues
      const fixedText = text
        .replace(/([^\\])"/g, '$1\\"')  // Escape unescaped quotes
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')  // Ensure property names are quoted
        .replace(/\t/g, '\\t');  // Handle tabs
      
      try {
        const data = JSON.parse(fixedText);
        return data;
      } catch (fixError) {
        // If still can't parse, return fallback
        console.error('Cannot parse API response:', text);
        return {
          quoteText: "Books are a uniquely portable magic.",
          quoteAuthor: "Stephen King",
          error: "Could not parse API response"
        };
      }
    }
  } catch (error) {
    console.error('Error fetching quote:', error);
    
    // Return a fallback quote
    return {
      quoteText: "Books are a uniquely portable magic.",
      quoteAuthor: "Stephen King",
      error: error.message
    };
  }
}

// Cache quotes for faster access
let cachedQuotes = {
  en: [],
  ru: []
};

// Preload quotes periodically in the background
async function preloadQuotes() {
  try {
    const enQuote = await fetchQuote('en');
    const ruQuote = await fetchQuote('ru');
    
    if (enQuote && !enQuote.error) {
      cachedQuotes.en.push(enQuote);
      if (cachedQuotes.en.length > 5) {
        cachedQuotes.en.shift(); // Keep cache size reasonable
      }
    }
    
    if (ruQuote && !ruQuote.error) {
      cachedQuotes.ru.push(ruQuote);
      if (cachedQuotes.ru.length > 5) {
        cachedQuotes.ru.shift(); // Keep cache size reasonable
      }
    }
  } catch (error) {
    console.error('Error preloading quotes:', error);
  }
}

// We can't use setInterval in service workers
// Instead, use alarms API for periodic background tasks
chrome.alarms.create('preloadQuotes', { periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'preloadQuotes') {
    preloadQuotes();
  }
});

// Initial preload
preloadQuotes();