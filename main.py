from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from fastapi.responses import HTMLResponse
import re

app = FastAPI()

# Setup analyzer
analyzer = SentimentIntensityAnalyzer()

class TextPayload(BaseModel):
    text: str

def get_sentiment_category(compound: float):
    if compound >= 0.05:
        return "positive"
    elif compound <= -0.05:
        return "negative"
    return "neutral"

@app.post("/analyze")
def analyze_sentiment(payload: TextPayload):
    text = payload.text.strip()
    if not text:
        return {"sentiment": "neutral", "score": 0.0, "details": {}, "sentences": []}
    
    # Overall score
    overall_scores = analyzer.polarity_scores(text)
    overall_compound = overall_scores['compound']
    overall_sentiment = get_sentiment_category(overall_compound)
    
    # Sentence-level analysis
    # Simple regex split for sentences
    raw_sentences = re.split(r'(?<=[.!?]) +', text)
    sentences_data = []
    
    for s in raw_sentences:
        s = s.strip()
        if s:
            s_score = analyzer.polarity_scores(s)
            sentences_data.append({
                "text": s,
                "score": s_score['compound'],
                "sentiment": get_sentiment_category(s_score['compound'])
            })
            
    return {
        "sentiment": overall_sentiment,
        "score": overall_compound,
        "details": overall_scores,
        "sentences": sentences_data
    }

@app.get("/", response_class=HTMLResponse)
def read_root():
    with open("static/index.html", "r", encoding="utf-8") as f:
        return f.read()

app.mount("/static", StaticFiles(directory="static"), name="static")
