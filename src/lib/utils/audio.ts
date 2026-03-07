// Initialize voices early so they are loaded when needed
if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.getVoices();
}

export const playSound = (type: 'correct' | 'wrong' | 'attack' | 'damage' | 'levelUp' | 'click') => {
    // In a real application, we would load actual audio files and play them here.
    // For the sake of this foundation, we'll log or use minimal browser beeps if possible,
    // or just prepare the structure for when MP3/WAV files are added.
    console.log(`[Audio] Playing sound: ${type}`);

    // Example dummy implementation since we lack audio assets:
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        if (type === 'correct') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } else if (type === 'wrong') {
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } else if (type === 'click') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    } catch (e) {
        console.error("Audio playback error:", e);
    }
};

export const speakEnglish = (text: string) => {
    if (!('speechSynthesis' in window)) {
        console.warn("Speech Synthesis NOT supported in this browser.");
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for kids
    utterance.pitch = 1.1; // Slightly higher pitched, friendly

    // Attempt to find a high quality English voice (native speakers)
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) ||
        voices.find(v => v.lang.startsWith('en-') && (v.name.includes('US') || v.name.includes('UK'))) ||
        voices.find(v => v.lang.startsWith('en'));
    if (enVoice) {
        utterance.voice = enVoice;
    }

    window.speechSynthesis.speak(utterance);
};

export const speakJapanese = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;

    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang === 'ja-JP' && v.name.includes('Google')) ||
        voices.find(v => v.lang === 'ja-JP' && (v.name.includes('Kyoko') || v.name.includes('Otoya') || v.name.includes('Hattori') || v.name.includes('Mei') || v.name.includes('Siri'))) ||
        voices.find(v => v.lang === 'ja-JP');

    if (jaVoice) {
        utterance.voice = jaVoice;
    }

    window.speechSynthesis.speak(utterance);
};
