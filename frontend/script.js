/**
 * Terminal Typing Animation
 * Simulates realistic typing effect with blinking cursor
 */

const TypingAnimation = {
    currentLanguage: 'en',
    texts: {
        en: [
            'Hello, I am Shota',
            'DevOps Engineer in Progress...'
        ],
        ge: [
            'გამარჯობა, მე ვარ შოთა',
            'DevOps ინჟინერი განვითარების პროცესში...'
        ]
    },
    typingSpeed: 100, // milliseconds per character
    deletingSpeed: 50, // milliseconds per character when deleting
    pauseBetweenLines: 2000, // pause between lines
    pauseAfterComplete: 3000, // pause before restarting

    init: function() {
        this.typingElement = document.getElementById('typing-animation');
        this.cursorElement = document.getElementById('typing-cursor');
        
        if (!this.typingElement) return;

        // Load saved language or default to English
        this.currentLanguage = localStorage.getItem('language') || 'en';
        
        // Start typing animation
        this.startTyping();
    },

    setLanguage: function(lang) {
        if (lang !== this.currentLanguage) {
            this.currentLanguage = lang;
            // Restart animation with new language
            this.startTyping();
        }
    },

    startTyping: function() {
        if (!this.typingElement) return;

        const texts = this.texts[this.currentLanguage] || this.texts.en;
        let lineIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let currentText = '';

        const type = () => {
            const currentLine = texts[lineIndex];

            if (isDeleting) {
                // Delete characters
                currentText = currentLine.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    lineIndex = (lineIndex + 1) % texts.length;
                }
            } else {
                // Type characters
                currentText = currentLine.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === currentLine.length) {
                    // Finished typing current line
                    isDeleting = true;
                    setTimeout(type, this.pauseBetweenLines);
                    return;
                }
            }

            // Update display
            this.typingElement.textContent = currentText;

            // Continue typing/deleting
            const speed = isDeleting ? this.deletingSpeed : this.typingSpeed;
            setTimeout(type, speed);
        };

        // Start typing
        this.typingElement.textContent = '';
        type();
    },

    // Blinking cursor animation
    initCursor: function() {
        if (!this.cursorElement) return;

        setInterval(() => {
            this.cursorElement.style.opacity = this.cursorElement.style.opacity === '0' ? '1' : '0';
        }, 530);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    TypingAnimation.init();
    TypingAnimation.initCursor();

    // Listen for language changes from buttons
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            TypingAnimation.setLanguage(lang);
        });
    });

    // Monitor for language changes via localStorage
    window.addEventListener('storage', function(e) {
        if (e.key === 'language') {
            TypingAnimation.setLanguage(e.newValue);
        }
    });
});
