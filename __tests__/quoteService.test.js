const { fetchQuote, getRandomFallbackQuote, fallbackQuotes } = require('../src/services/quoteService');

describe('Quote Service', () => {
  test('getRandomFallbackQuote returns a valid quote', () => {
    const quote = getRandomFallbackQuote();
    expect(quote).toHaveProperty('quoteText');
    expect(quote).toHaveProperty('quoteAuthor');
    expect(fallbackQuotes).toContainEqual(
      expect.objectContaining({
        quoteText: quote.quoteText,
        quoteAuthor: quote.quoteAuthor
      })
    );
  });

  test('fetchQuote returns a quote (fallback if API fails)', async () => {
    // Simulate offline by mocking fetch to throw
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
    const quote = await fetchQuote();
    expect(quote).toHaveProperty('quoteText');
    expect(quote).toHaveProperty('quoteAuthor');
    expect(quote.source).toBe('fallback');
  });

  test('fetchQuote returns a quote from API (if online)', async () => {
    const mockApiQuote = {
      content: 'Test API quote',
      author: 'API Author'
    };
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockApiQuote)
    }));
    const quote = await fetchQuote();
    expect(quote.quoteText).toBe('Test API quote');
    expect(quote.quoteAuthor).toBe('API Author');
    expect(quote.source).toBe('quotable');
  });
});
