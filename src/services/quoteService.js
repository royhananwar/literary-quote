// src/services/quoteService.js

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
  }
];

function getRandomFallbackQuote() {
  const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
  return fallbackQuotes[randomIndex];
}

async function fetchFromQuotable() {
  const response = await fetch('https://api.quotable.io/random?tags=wisdom,inspirational,literature');
  if (!response.ok) throw new Error('API error');
  const data = await response.json();
  return {
    quoteText: data.content,
    quoteAuthor: data.author || 'Unknown',
    source: 'quotable'
  };
}

async function fetchQuote() {
  try {
    return await fetchFromQuotable();
  } catch (e) {
    return { ...getRandomFallbackQuote(), source: 'fallback' };
  }
}

module.exports = {
  fetchQuote,
  getRandomFallbackQuote,
  fallbackQuotes,
};
