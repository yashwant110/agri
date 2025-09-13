// static/js/main.js

// --- Global Text-to-Speech Engine ---
const synth = window.speechSynthesis;

// This function is now globally accessible by being attached to the 'window' object.
// It takes the text to speak and a language code (e.g., 'en-US', 'hi-IN').
window.speakText = function(text, lang) {
    if (synth.speaking) {
        synth.cancel(); // Stop any previous speech
    }
    if (text !== '') {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang; // Set the language for the voice
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.onerror = (event) => console.error('SpeechSynthesisUtterance.onerror', event);
        
        // This is a failsafe to ensure voices are loaded before speaking
        let voices = synth.getVoices();
        if (voices.length === 0) {
            synth.onvoiceschanged = () => {
                synth.speak(utterance);
            };
        } else {
            synth.speak(utterance);
        }
    }
}

// --- All other logic remains inside the DOMContentLoaded listener ---
document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('language-select');

    // Function to play pre-recorded audio cues (unchanged)
    function playAudioCue(audioSrc) {
        const audio = new Audio(audioSrc);
        audio.play();
    }

    // --- Language Switching Engine (unchanged) ---
    const setLanguage = (lang) => {
        const elements = document.querySelectorAll('[data-key]');
        elements.forEach(elem => {
            const key = elem.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                elem.innerHTML = translations[lang][key];
            }
        });
        document.documentElement.lang = lang;
        localStorage.setItem('language', lang);
    };

    // Event listener for the language dropdown (unchanged)
    languageSelect.addEventListener('change', (event) => {
        setLanguage(event.target.value);
    });

    // On page load, set the language (unchanged)
    const savedLang = localStorage.getItem('language') || 'en';
    languageSelect.value = savedLang;
    setLanguage(savedLang);

    // --- Audio Cue Functionality (unchanged, uses the global speakText now) ---
    document.querySelectorAll('[data-audio-cue-key]').forEach(element => {
        element.addEventListener('click', (event) => {
            event.stopPropagation();
            const lang = localStorage.getItem('language') || 'en';
            const translationKey = element.getAttribute('data-audio-cue-key');
            const textToSpeak = translations[lang][translationKey];
            
            // Map our simple codes to the required browser codes
            const langCode = { en: 'en-US', hi: 'hi-IN', te: 'te-IN' }[lang];
            
            window.speakText(textToSpeak, langCode); // Call the global function
        });
    });
});