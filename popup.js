// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

// Add tab switching and settings logic
document.addEventListener('DOMContentLoaded', () => {
    const favoritesTabBtn = document.getElementById('favoritesTabBtn');
    const settingsTabBtn = document.getElementById('settingsTabBtn');
    const favoritesTab = document.getElementById('favoritesTab');
    const settingsTab = document.getElementById('settingsTab');
    const disableBtn = document.getElementById('disableExtensionBtn');

    // Tab switching
    favoritesTabBtn.addEventListener('click', () => {
        favoritesTabBtn.classList.add('active');
        settingsTabBtn.classList.remove('active');
        favoritesTab.style.display = 'block';
        settingsTab.style.display = 'none';
        renderFavorites();
    });
    settingsTabBtn.addEventListener('click', () => {
        settingsTabBtn.classList.add('active');
        favoritesTabBtn.classList.remove('active');
        settingsTab.style.display = 'block';
        favoritesTab.style.display = 'none';
    });

    // Remove theme toggle logic
    // Only keep disable logic
    disableBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: 'chrome://extensions/?id=' + chrome.runtime.id });
    });

    // Add improved background config UI to settings
    if (settingsTab) {
        // Remove old settings UI if present
        const oldSections = settingsTab.querySelectorAll('.settings-section');
        oldSections.forEach(el => el.remove());

        // Create new grouped settings section
        const section = document.createElement('div');
        section.className = 'settings-section';
        section.innerHTML = `
            <div class="settings-title">Background Customization</div>
            <div class="settings-desc">Change the background color behind the quote section.</div>
            <div class="settings-row">
                <span class="settings-label">Color</span>
                <input type="color" id="quoteBgColor" class="settings-input" />
            </div>
            <hr style="margin:18px 0 10px 0; border:none; border-top:1px solid var(--border-color);">
            <div class="settings-title" style="font-size:1.05rem; margin-bottom:8px;">Extension</div>
            <div class="settings-row">
                <span class="settings-label">Disable Extension</span>
                <button class="btn disable-btn" id="disableExtensionBtn" title="Go to Extensions">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" style="margin-right:8px;"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
                    <span>Manage Extension</span>
                </button>
            </div>
        `;
        settingsTab.prepend(section);

        // Load and show saved config
        chrome.storage.sync.get(['quoteBgColor'], (result) => {
            document.getElementById('quoteBgColor').value = result.quoteBgColor || '#ffffff';
        });

        document.getElementById('quoteBgColor').addEventListener('input', saveBgConfig);

        function saveBgConfig() {
            const color = document.getElementById('quoteBgColor').value;
            chrome.storage.sync.set({ quoteBgColor: color });
        }
    }

    // Initial render
    renderFavorites();
});

// Listen for theme changes from new tab and sync theme in popup
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.theme) {
        if (changes.theme.newValue === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
});

function renderFavorites(searchTerm = '') {
    const favoritesTab = document.getElementById('favoritesTab');
    if (!favoritesTab) return;
    chrome.storage.sync.get(['favorites'], (result) => {
        let favorites = Array.isArray(result.favorites) ? result.favorites : [];
        // Simple case-insensitive substring search on quote and author
        if (searchTerm) {
            const term = searchTerm.trim().toLowerCase();
            favorites = favorites.filter(fav =>
                fav.text.toLowerCase().includes(term) ||
                fav.author.toLowerCase().includes(term)
            );
        } else {
            favorites = favorites.slice().reverse();
        }
        let html = '';
        if (favorites.length === 0) {
            html = `<div class="favorites-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"></path></svg>
                <p style="margin-top: 16px; color: var(--text-color); opacity: 0.7;">No favorites found.</p>
            </div>`;
        } else {
            html = `<div class="favorites-list">` + favorites.map((fav, i) => `
                <div class="favorite-item">
                    <button class="remove-fav" data-index="${i}" title="Remove" aria-label="Remove favorite">&times;</button>
                    <div class="favorite-quote">${fav.text}</div>
                    <div class="favorite-author">— ${fav.author}</div>
                </div>
            `).join('') + `</div>`;
        }
        // Insert search bar and list
        favoritesTab.innerHTML = `
            <div class="favorites-search-bar" style="margin-bottom: 12px;">
                <input type="text" id="favoritesSearch" placeholder="Search favorites..." style="width:100%;padding:8px 12px;border-radius:6px;border:1px solid var(--border-color);background:var(--secondary-color);color:var(--text-color);font-size:1rem;outline:none;" />
            </div>
            ${html}
        `;
        // Add remove handlers
        document.querySelectorAll('.remove-fav').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                chrome.storage.sync.get(['favorites'], (result) => {
                    let favorites = Array.isArray(result.favorites) ? result.favorites : [];
                    favorites.splice(idx, 1);
                    chrome.storage.sync.set({ favorites }, () => renderFavorites(document.getElementById('favoritesSearch').value));
                });
            });
        });
        // Add search handler
        const searchInput = document.getElementById('favoritesSearch');
        if (searchInput) {
            searchInput.value = searchTerm;
            // Focus and move cursor to end
            searchInput.focus();
            searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
            searchInput.addEventListener('input', (e) => {
                renderFavorites(e.target.value);
            });
        }
    });
}