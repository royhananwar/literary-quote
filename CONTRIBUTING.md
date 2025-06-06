# Contributing to Literary Quotes Chrome Extension

First off, thank you for considering contributing to Literary Quotes! It's people like you that make the open source community such a fantastic place to learn, inspire, and create.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to see if the problem has already been reported. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs if possible**
- **Include your Chrome version and operating system**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful**
- **Include mockups or examples if applicable**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Setup

1. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/literary-quote.git
   cd literary-quote
   ```

2. **Load the extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked" and select the project folder

3. **Make your changes**
   - Edit the files as needed
   - Test your changes by reloading the extension

4. **Test thoroughly**
   - Test both light and dark themes
   - Test both popup and new tab functionality
   - Test language switching
   - Test copy functionality
   - Test with and without internet connection

## Style Guidelines

### JavaScript

- Use ES6+ features where appropriate
- Use semicolons
- Use 2 spaces for indentation
- Use camelCase for variables and functions
- Use PascalCase for constructors and classes
- Use UPPER_SNAKE_CASE for constants

### HTML

- Use semantic HTML elements
- Use 2 spaces for indentation
- Include alt attributes for images
- Use proper heading hierarchy

### CSS

- Use 2 spaces for indentation
- Use CSS custom properties (variables) for theming
- Follow BEM methodology for class naming when applicable
- Group related properties together

## Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
