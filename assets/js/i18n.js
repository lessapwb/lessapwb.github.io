/**
 * Patrick Lessa - Portfolio
 * Internationalization (i18n) System
 * Supports: Portuguese (pt) and English (en)
 */

class I18n {
    constructor() {
        this.translations = {};
        this.currentLang = 'pt';
        this.defaultLang = 'pt';
        this.supportedLangs = ['pt', 'en'];
        this.langToggle = document.getElementById('langToggle');
        this.langFlag = document.getElementById('langFlag');
        this.langCode = document.getElementById('langCode');
        
        this.init();
    }
    
    async init() {
        // Detect language preference
        this.currentLang = this.detectLanguage();
        
        // Load translations
        await this.loadTranslations(this.currentLang);
        
        // Apply translations
        this.applyTranslations();
        
        // Setup language toggle
        this.setupToggle();
        
        // Update HTML lang attribute
        this.updateHtmlLang();
    }
    
    detectLanguage() {
        // Check localStorage first
        const savedLang = localStorage.getItem('portfolio-lang');
        if (savedLang && this.supportedLangs.includes(savedLang)) {
            return savedLang;
        }
        
        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const shortLang = browserLang.split('-')[0].toLowerCase();
        
        if (this.supportedLangs.includes(shortLang)) {
            return shortLang;
        }
        
        // Default to Portuguese
        return this.defaultLang;
    }
    
    async loadTranslations(lang) {
        try {
            const response = await fetch(`lang/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${lang}.json`);
            }
            this.translations = await response.json();
        } catch (error) {
            console.warn(`Could not load translations for ${lang}:`, error);
            // Try loading default language if current fails
            if (lang !== this.defaultLang) {
                try {
                    const fallbackResponse = await fetch(`lang/${this.defaultLang}.json`);
                    this.translations = await fallbackResponse.json();
                    this.currentLang = this.defaultLang;
                } catch (fallbackError) {
                    console.error('Failed to load fallback translations:', fallbackError);
                }
            }
        }
    }
    
    applyTranslations() {
        // Find all elements with data-i18n-key attribute
        const elements = document.querySelectorAll('[data-i18n-key]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n-key');
            const translation = this.getTranslation(key);
            
            if (translation) {
                // Check if translation contains HTML tags
                const hasHtml = /<[^>]+>/.test(translation);
                
                // Use innerHTML if translation contains HTML, otherwise use textContent
                if (hasHtml) {
                    element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Update language toggle display
        this.updateToggleDisplay();
        
        // Update page title
        if (this.translations['page-title']) {
            document.title = this.translations['page-title'];
        }
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && this.translations['meta-description']) {
            metaDesc.setAttribute('content', this.translations['meta-description']);
        }
    }
    
    getTranslation(key) {
        return this.translations[key] || null;
    }
    
    setupToggle() {
        if (this.langToggle) {
            this.langToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }
    }
    
    async toggleLanguage() {
        // Cycle through supported languages
        const currentIndex = this.supportedLangs.indexOf(this.currentLang);
        const nextIndex = (currentIndex + 1) % this.supportedLangs.length;
        this.currentLang = this.supportedLangs[nextIndex];
        
        // Save preference
        localStorage.setItem('portfolio-lang', this.currentLang);
        
        // Load new translations
        await this.loadTranslations(this.currentLang);
        
        // Apply translations
        this.applyTranslations();
        
        // Update HTML lang attribute
        this.updateHtmlLang();
        
        // Dispatch event for other scripts
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { lang: this.currentLang } 
        }));
    }
    
    updateToggleDisplay() {
        if (this.langFlag && this.langCode) {
            const flags = {
                'pt': 'https://flagcdn.com/w20/br.png',
                'en': 'https://flagcdn.com/w20/us.png'
            };
            
            const codes = {
                'pt': 'PT',
                'en': 'EN'
            };
            
            this.langFlag.src = flags[this.currentLang] || flags.pt;
            this.langFlag.alt = this.currentLang.toUpperCase();
            this.langCode.textContent = codes[this.currentLang] || codes.pt;
        }
    }
    
    updateHtmlLang() {
        const langMap = {
            'pt': 'pt-BR',
            'en': 'en'
        };
        
        document.documentElement.lang = langMap[this.currentLang] || 'pt-BR';
    }
    
    // Method to get current language
    getCurrentLang() {
        return this.currentLang;
    }
    
    // Method to manually set language
    async setLanguage(lang) {
        if (this.supportedLangs.includes(lang) && lang !== this.currentLang) {
            this.currentLang = lang;
            localStorage.setItem('portfolio-lang', lang);
            await this.loadTranslations(lang);
            this.applyTranslations();
            this.updateHtmlLang();
        }
    }
}

// Initialize i18n when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.i18n = new I18n();
});

// Listen for language changes to update typing animation
window.addEventListener('languageChanged', (e) => {
    // Reset typing animation with new language
    if (typeof currentStringIndex !== 'undefined') {
        currentStringIndex = 0;
        currentCharIndex = 0;
        isDeleting = false;
    }
});
