from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import random, string
from database import SessionLocal, Url

app = FastAPI()

def generate_short_code(length=6):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

class UrlIn(BaseModel):
    original_url: str

@app.post("/api/shorten")
def shorten_url(data: UrlIn):
    db = SessionLocal()
    short_code = generate_short_code()
    db_url = Url(short_code=short_code, original_url=data.original_url)
    db.add(db_url)
    db.commit()
    return { "short_url": f"http://localhost:8000/s/{short_code}" }

@app.get("/s/{code}")
def redirect_url(code: str):
    db = SessionLocal()
    url = db.query(Url).filter(Url.short_code == code).first()
    if url:
        return { "original_url": url.original_url }
    raise HTTPException(404, "URL not found")
