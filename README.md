# 📚 Literary Quotes Chrome Extension

A beautiful Chrome extension that displays inspirational literary quotes from famous books and authors. Transform your new tab page into a source of daily wisdom and manage your favorite quotes with ease.

![Literary Quotes Extension](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Chrome Extension](https://img.shields.io/badge/chrome-extension-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

> **Note:** This project was built with the help of AI. Most of the code was written by an AI agent (GitHub Copilot and similar tools) in collaboration with the project owner.

## ✨ Features

- 🎨 **Beautiful UI**: Clean, modern design with dark/light theme support
- 📋 **Copy to Clipboard**: Easily share your favorite quotes
- 🔄 **Refresh**: Get new quotes with a single click
- 💖 **Favorites**: Save up to 50 favorite quotes, searchable and easily managed
- 🔍 **Favorites Search**: Instantly search your saved quotes by text or author
- 🗑️ **Remove Favorites**: Remove any favorite with a single click
- 📱 **Responsive**: Works perfectly as both popup and new tab page
- 💾 **Persistent Settings**: Your theme and favorites are saved and synced
- 🛡️ **Fallback System**: Works offline with cached quotes when API is unavailable
- 📚 **Literary Focus**: Curated quotes from famous books and authors

## 🚀 Installation

### Method 1: Chrome Web Store (Recommended)

You can install the extension directly from the Chrome Web Store:

[**Download Literary Quotes on Chrome Web Store**](https://chromewebstore.google.com/detail/literary-quotes/cbkfapokindlnbelhogpdikoanaelmkd)

### Method 2: Developer Mode (Manual Installation)

```bash
git clone https://github.com/royhananwar/literary-quote.git
cd literary-quote
```

- Open Google Chrome
- Navigate to `chrome://extensions/`
- Enable "Developer mode" (toggle in top-right corner)
- Click "Load unpacked"
- Select the `literary-quote` folder
- The extension should now appear in your extensions list
- (Optional) Pin the extension for quick access

## 🛠️ Usage & Features

### New Tab Page

- Shows a random literary quote with author
- Buttons for **New Quote**, **Add Favorite**, and **Copy**
- Click the heart button (**Add Favorite**) to save the current quote
- Theme toggle in the upper right corner

### Popup

- **Favorites Tab**: View, search, and remove your favorite quotes (newest at the top)
- **Settings Tab**: Manage extension (disable via Chrome Extensions page)
- Favorites and theme are synced with the new tab page

### Favorites

- Save up to 50 favorite quotes
- Search instantly by quote or author
- Remove any favorite with the × button
- Favorites are stored in Chrome sync storage (persisted and synced across devices)

### Theme Sync

- Changing the theme in the new tab instantly updates the popup theme

## 🔧 Configuration

### API Integration

The extension uses the Forismatic and Quotable APIs for fetching quotes. If you want to use a different API:

1. Edit `background.js`
2. Modify the `fetchQuote` function
3. Update the API endpoint and response parsing

### Adding More Fallback Quotes

To add more offline quotes:

1. Open `background.js`
2. Find the `fallbackQuotes` array
3. Add your quotes in the format:

```javascript
{
    text: "Your quote text here",
    author: "Author Name"
}
```

## 🌐 Browser Compatibility

- ✅ Google Chrome (Manifest V3)
- ✅ Microsoft Edge (Chromium-based)
- ✅ Brave Browser
- ✅ Opera
- ❌ Firefox (different extension format)
- ❌ Safari (different extension format)

## 📝 Permissions

The extension requires the following permissions:

- **Storage**: To save user preferences (theme, favorites)
- **Clipboard Write**: To copy quotes to clipboard
- **Host Permissions**: To fetch quotes from external APIs
- **Alarms**: For background refresh functionality
- **Management**: To allow disabling the extension from the popup

## 🤝 Contributing

We welcome contributions! Please follow these steps:

```bash
git fork https://github.com/royhananwar/literary-quote.git
git checkout -b feature/amazing-feature
```

- Make your changes and test thoroughly
- Update documentation if needed
- Commit your changes:

```bash
git commit -m "Add some amazing feature"
git push origin feature/amazing-feature
```

- Open a Pull Request and describe your changes in detail
- Include screenshots if applicable
- Reference any related issues

### Development Guidelines

- Use semantic commit messages
- Follow JavaScript ES6+ standards
- Maintain cross-browser compatibility
- Test on both light and dark themes
- Ensure responsive design works on all screen sizes

## 🐛 Bug Reports

Found a bug? Please open an issue with:

- Chrome version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## 💡 Feature Requests

Have an idea? Open an issue with:

- Clear description of the feature
- Use case scenarios
- Mockups or examples (if applicable)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Forismatic API** and **Quotable API** for providing literary quotes
- **Book lovers and readers** who inspired this project
- **Open source community** for tools and inspiration

---

Made with ❤️ for book lovers everywhere

Star ⭐ this repo if you found it helpful!
