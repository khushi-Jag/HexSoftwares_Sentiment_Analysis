document.addEventListener("DOMContentLoaded", () => {
    // 1. Page Transition Animation
    const enterBtn = document.getElementById('enter-btn');
    const welcomeView = document.getElementById('welcome-view');
    const appView = document.getElementById('app-view');

    enterBtn.addEventListener('click', () => {
        welcomeView.classList.add('hide-up');
        setTimeout(() => {
            welcomeView.classList.remove('active');
            appView.classList.add('active', 'show-up');
        }, 800); // match CSS timeout
    });

    // 2. Elements
    const textInput = document.getElementById('text-input');
    const charCount = document.getElementById('char-count');
    const wordCount = document.getElementById('word-count');
    const clearBtn = document.getElementById('clear-btn');
    const loader = document.getElementById('loader');

    const resultCard = document.querySelector('.result-card');
    const overallSentimentEl = document.getElementById('overall-sentiment');
    const overallScoreEl = document.getElementById('overall-score');
    const overallEmoji = document.getElementById('overall-emoji');
    const progressCircle = document.getElementById('progress-ring');
    const messageEl = document.getElementById('motivational-message');
    const sentencesWrapper = document.getElementById('sentences-wrapper');

    const DEFAULT_DASHARRAY = 339.29; // 2 * PI * 54 (cx=60, r=54)
    let debounceTimer;

    progressCircle.style.strokeDasharray = DEFAULT_DASHARRAY;
    progressCircle.style.strokeDashoffset = DEFAULT_DASHARRAY;

    // 3. Logic & UI Updates
    function getEmoji(sentiment, score) {
        if (sentiment === 'positive') return score >= 0.5 ? '🌟' : '😊';
        if (sentiment === 'negative') return score <= -0.5 ? '💔' : '😔';
        return '🧘';
    }

    function getMessage(sentiment, textLength) {
        if (textLength === 0 || sentiment === 'neutral') return "Stay motivated and keep moving forward. You're doing great! 🚀";
        if (sentiment === 'positive') return "It's so good to see you like this! Keep spreading the positivity. ✨";
        if (sentiment === 'negative') return "Hey, don't be sad. Tough times never last, but tough people do. 💙";
        return "Awaiting your thoughts...";
    }

    function resetUI() {
        resultCard.className = 'card result-card is-neutral';
        overallSentimentEl.textContent = 'Neutral';
        overallScoreEl.textContent = '0.00';
        overallEmoji.textContent = '💭';
        progressCircle.style.strokeDashoffset = DEFAULT_DASHARRAY;
        messageEl.style.opacity = '0';
        setTimeout(() => {
            messageEl.textContent = 'Awaiting your thoughts...';
            messageEl.style.opacity = '1';
        }, 400);
        sentencesWrapper.innerHTML = '<div class="empty-list">No sentences analyzed yet.</div>';
    }

    function updateUI(data, textLength) {
        resultCard.className = `card result-card is-${data.sentiment}`;
        overallSentimentEl.textContent = data.sentiment;
        overallScoreEl.textContent = data.score.toFixed(3);
        overallEmoji.textContent = getEmoji(data.sentiment, data.score);

        // Circular Gauge
        // Fill based on absolute intensity (0.0 to 1.0)
        let intensity = Math.abs(data.score);
        // Special case: Neutral 0 should be 0 fill
        if (data.score === 0) intensity = 0;
        const offset = DEFAULT_DASHARRAY - (intensity * DEFAULT_DASHARRAY);
        progressCircle.style.strokeDashoffset = offset;

        // Motivational Message
        messageEl.style.opacity = '0';
        setTimeout(() => {
            messageEl.textContent = getMessage(data.sentiment, textLength);
            messageEl.style.opacity = '1';
        }, 400);

        // Sentences Breakdown
        sentencesWrapper.innerHTML = '';
        if (data.sentences && data.sentences.length > 0) {
            data.sentences.forEach((s, idx) => {
                const row = document.createElement('div');
                row.className = `sentence-row s-row-${s.sentiment}`;
                row.style.animationDelay = `${idx * 0.1}s`;
                row.innerHTML = `
                    <div class="s-text">"${s.text}"</div>
                    <div class="s-score">${s.score.toFixed(2)}</div>
                `;
                sentencesWrapper.appendChild(row);
            });
        } else {
            sentencesWrapper.innerHTML = '<div class="empty-list">No sentences analyzed yet.</div>';
        }
    }

    async function analyzeText(text) {
        if (!text.trim()) {
            resetUI();
            return;
        }
        
        loader.classList.remove('hidden');
        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ text })
            });
            const data = await response.json();
            updateUI(data, text.trim().length);
        } catch (error) {
            console.error("Analysis Error:", error);
        } finally {
            loader.classList.add('hidden');
        }
    }

    // 4. Events
    textInput.addEventListener('input', (e) => {
        const text = e.target.value;
        charCount.textContent = `${text.length} characters`;
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);
        wordCount.textContent = `${words.length} words`;

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            analyzeText(text);
        }, 500);
    });

    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        charCount.textContent = '0 characters';
        wordCount.textContent = '0 words';
        resetUI();
    });
});
