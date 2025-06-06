# 📚 Literary Quotes Chrome Extension

A beautiful Chrome extension that displays inspirational literary quotes from famous books and authors. Transform your new tab page into a source of daily wisdom and replace the default Chrome popup with elegant quote displays.

![Literary Quotes Extension](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Chrome Extension](https://img.shields.io/badge/chrome-extension-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- 🎨 **Beautiful UI**: Clean, modern design with dark/light theme support
- 📋 **Copy to Clipboard**: Easily share your favorite quotes
- 🔄 **Refresh**: Get new quotes with a single click
- 📱 **Responsive**: Works perfectly as both popup and new tab page
- 💾 **Persistent Settings**: Your theme preferences are saved
- 🛡️ **Fallback System**: Works offline with cached quotes when API is unavailable
- 📚 **Literary Focus**: Curated quotes from famous books and authors

## 🚀 Installation

### Method 1: Chrome Web Store (Recommended)
*Coming soon - Extension will be published to Chrome Web Store*

### Method 2: Developer Mode (Manual Installation)

1. **Download the Extension**
   ```bash
   git clone https://github.com/royhananwar/literary-quote.git
   cd literary-quote
   ```

2. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the `literary-quote` folder
   - The extension should now appear in your extensions list

4. **Pin the Extension (Optional)**
   - Click the puzzle piece icon in Chrome toolbar
   - Find "Literary Quotes" and click the pin icon
   - The extension icon will now appear in your toolbar

## 🛠️ Development Setup

### Prerequisites
- Google Chrome browser
- Basic knowledge of HTML, CSS, and JavaScript
- Text editor or IDE (VS Code recommended)

### Local Development

1. **Clone the Repository**
   ```bash
   git clone https://github.com/royhananwar/literary-quote.git
   cd literary-quote
   ```

2. **Project Structure**
   ```
   literary-quote/
   ├── manifest.json          # Extension configuration
   ├── background.js          # Service worker for API calls
   ├── index.html            # New tab page HTML
   ├── index.js              # New tab page JavaScript
   ├── popup.html            # Popup interface HTML
   ├── popup.js              # Popup interface JavaScript
   ├── icons/                # Extension icons
   │   ├── icon16.png
   │   ├── icon48.png
   │   └── icon128.png
   └── README.md
   ```

3. **Load in Chrome**
   - Follow the manual installation steps above
   - After making changes, click the refresh button on the extension card in `chrome://extensions/`

### Making Changes

1. **Edit Files**: Make your changes to HTML, CSS, or JavaScript files
2. **Reload Extension**: Go to `chrome://extensions/` and click the refresh button
3. **Test**: Open a new tab or click the extension icon to test your changes

## 🔧 Configuration

### API Integration
The extension uses the Forismatic API for fetching quotes. If you want to use a different API:

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

- **Storage**: To save user preferences (theme)
- **Clipboard Write**: To copy quotes to clipboard
- **Host Permissions**: To fetch quotes from external APIs
- **Alarms**: For background refresh functionality

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
   ```bash
   git fork https://github.com/royhananwar/literary-quote.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Test your changes thoroughly
   - Update documentation if needed

4. **Commit Your Changes**
   ```bash
   git commit -m "Add some amazing feature"
   ```

5. **Push to Your Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes in detail
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

- **Forismatic API** for providing literary quotes
- **Book lovers and readers** who inspired this project
- **Open source community** for tools and inspiration

**Made with ❤️ for book lovers everywhere**

*Star ⭐ this repo if you found it helpful!*