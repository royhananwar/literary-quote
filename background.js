// Background script for the Literary Quotes extension

// A collection of fallback quotes to use when API is unavailable
const fallbackQuotes = [
  {
    quoteText: "Books are a uniquely portable magic.",
    quoteAuthor: "Stephen King"
  },
  {
    quoteText: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
    quoteAuthor: "George R.R. Martin"
  },
  {
    quoteText: "Until I feared I would lose it, I never loved to read. One does not love breathing.",
    quoteAuthor: "Harper Lee"
  },
  {
    quoteText: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    quoteAuthor: "Dr. Seuss"
  },
  {
    quoteText: "I have always imagined that Paradise will be a kind of library.",
    quoteAuthor: "Jorge Luis Borges"
  },
  {
    quoteText: "You can never get a cup of tea large enough or a book long enough to suit me.",
    quoteAuthor: "C.S. Lewis"
  },
  {
    quoteText: "If you only read the books that everyone else is reading, you can only think what everyone else is thinking.",
    quoteAuthor: "Haruki Murakami"
  },
  {
    quoteText: "There is more treasure in books than in all the pirate's loot on Treasure Island.",
    quoteAuthor: "Walt Disney"
  },
  {
    quoteText: "The person, be it gentleman or lady, who has not pleasure in a good novel, must be intolerably stupid.",
    quoteAuthor: "Jane Austen"
  },
  {
    quoteText: "Think before you speak. Read before you think.",
    quoteAuthor: "Fran Lebowitz"
  }
];

// Listen for installation or update events
chrome.runtime.onInstalled.addListener(() => {
  console.log('Literary Quotes extension installed or updated');
  
  // Initialize storage with default settings if needed
  chrome.storage.sync.get(['theme'], function(result) {
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
    fetchQuote()
      .then(data => {
        console.log("Quote fetched:", data);
        sendResponse(data);
      })
      .catch(error => {
        console.error('Error in fetchQuote:', error);
        const fallbackQuote = getRandomFallbackQuote();
        sendResponse({ 
          quoteText: fallbackQuote.quoteText,
          quoteAuthor: fallbackQuote.quoteAuthor,
          error: error.message,
          isFallback: true,
          source: 'fallback'
        });
      });
    
    // Return true to indicate we will send a response asynchronously
    return true;
  }
});

// Function to get a random fallback quote
function getRandomFallbackQuote() {
  const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
  return {
    ...fallbackQuotes[randomIndex],
    source: 'fallback'
  };
}

// Function to fetch a quote
async function fetchQuote() {
  try {
    // Try to fetch from the API first
    console.log('Attempting to fetch quote from APIs');
    
    // Try multiple API endpoints/methods
    const quote = await tryMultipleAPIs();
    if (quote) {
      return quote;
    }
    
    // If API fails, try to get from cache
    if (cachedQuotes.length > 0) {
      console.log('Using cached quote');
      return cachedQuotes.pop();
    }
    
    // Last resort: use fallback quotes
    console.log('Using fallback quote');
    return getRandomFallbackQuote();
    
  } catch (error) {
    console.error('Error fetching quote:', error);
    
    // Return a fallback quote
    return getRandomFallbackQuote();
  }
}

// Try multiple API methods to get quotes
async function tryMultipleAPIs() {
  // Method 1: Try Forismatic API with JSONP workaround
  try {
    const forismaticQuote = await fetchFromForismatic();
    if (forismaticQuote) {
      return forismaticQuote;
    }
  } catch (error) {
    console.log('Forismatic API failed:', error.message);
  }
  
  // Method 2: Try alternative quote APIs
  try {
    const altQuote = await fetchFromAlternativeAPI();
    if (altQuote) {
      return altQuote;
    }
  } catch (error) {
    console.log('Alternative API failed:', error.message);
  }
  
  return null;
}

// Fetch from Forismatic API
async function fetchFromForismatic() {
  try {
    // Only use English for Forismatic API
    const apiUrl = `https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en&key=${Date.now()}`;
    
    console.log('Fetching from Forismatic:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    console.log('Forismatic raw response:', text);
    
    // Clean up the response (Forismatic sometimes returns malformed JSON)
    const cleanText = text.replace(/\\/g, '').replace(/"/g, '"').replace(/"/g, '"');
    
    let data;
    try {
      data = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid JSON response');
    }
    
    if (data && data.quoteText) {
      const quote = {
        quoteText: data.quoteText.trim(),
        quoteAuthor: data.quoteAuthor ? data.quoteAuthor.trim() : 'Unknown',
        source: 'forismatic'
      };
      console.log('Successfully fetched from Forismatic:', quote);
      return quote;
    }
    
    throw new Error('No quote data in response');
    
  } catch (error) {
    console.error('Forismatic API error:', error);
    throw error;
  }
}

// Fetch from alternative quote API
async function fetchFromAlternativeAPI() {
  try {
    console.log('Fetching from Quotable API');
    const response = await fetch('https://api.quotable.io/random?tags=wisdom,inspirational,literature', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Quotable response:', data);
    
    if (data && data.content) {
      const quote = {
        quoteText: data.content,
        quoteAuthor: data.author || 'Unknown',
        source: 'quotable'
      };
      console.log('Successfully fetched from Quotable:', quote);
      return quote;
    }
    
    throw new Error('No quote data in response');
    
  } catch (error) {
    console.error('Alternative API error:', error);
    throw error;
  }
}

// Cache quotes for faster access
const cachedQuotes = [];

// We can't use setInterval in service workers
// Instead, use alarms API for periodic background tasks
chrome.alarms.create('preloadQuotes', { periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'preloadQuotes') {
    preloadQuotes();
  }
});

// Preload quotes periodically in the background
async function preloadQuotes() {
  console.log("Preloading quotes...");
  
  try {
    // Try to fetch real quotes and add them to cache
    const quote = await tryMultipleAPIs();
    if (quote) {
      cachedQuotes.push(quote);
      console.log('Cached quote:', quote);
    }
  } catch (error) {
    console.log('Error preloading quotes:', error);
  }
  
  // Always ensure we have fallback quotes in cache
  if (cachedQuotes.length === 0) {
    fallbackQuotes.forEach(quote => {
      cachedQuotes.push({...quote, source: 'fallback'});
    });
  }
  
  console.log(`Quote cache status: ${cachedQuotes.length} quotes`);
}

// Initial preload
preloadQuotes();