# Emotion AI - Sentiment Analyzer 🧠✨

A premium, highly-interactive Sentiment Analysis Web Application built for the **Hex Softwares Machine Learning Internship (Task 1)**, created by **Khushi Jagwani**.

## 🌟 Features
- **Ultra-Aesthetic UI**: Smooth page transitions, glassmorphism cards, glowing gradients, and an animated ambient background.
- **Real-Time Analysis**: Debounced API requests instantly track and compute textual emotions locally.
- **Sentence-Level Breakdown**: Intelligently dissects full paragraphs, scoring each sentence independently in an elegant breakdown list.
- **Motivational Companion**: The UI dynamically alters its messaging based on your mood—offering uplifting quotes if you feel sad, praising positivity, and keeping you motivated during a neutral state.
- **Dynamic Visuals**: Equipped with an animated SVG progress ring that fills and changes colors to represent absolute emotion intensity perfectly.

## 🛠️ Tech Stack
- **Backend**: Python 3, FastAPI, Uvicorn, `vaderSentiment`
- **Frontend**: Vanilla HTML5, CSS3 (Keyframe Animations), Modern JS (ES6+ & Fetch APIs)

## 🚀 Getting Started

### 1. Requirements
Ensure you have Python installed, then download the dependencies:
```bash
pip install -r requirements.txt
```
*(Or install manually: `pip install fastapi uvicorn vaderSentiment pydantic`)*

### 2. Start the Backend Server
Launch the application locally in your terminal:
```bash
python -m uvicorn main:app --port 8000
```

### 3. View the Result 
Open your preferred web browser and navigate to:
**[http://localhost:8000](http://localhost:8000)** 

---

*Made with ❤️ by Khushi Jagwani*
