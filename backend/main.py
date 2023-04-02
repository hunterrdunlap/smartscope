from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from prompt import Prompt
from generate_text import generate_text
import os
from dotenv import load_dotenv
import openai

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}
    
@app.post("/generate")
def generate_chat(prompt: Prompt):
    try:
        generated_text = generate_text(prompt.text)
        return {"response": generated_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)