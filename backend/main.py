import pickle
from typing import Dict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from generate_text import generate_text
from os import environ as env
from dotenv import load_dotenv
from prompt import Prompt
import faiss
from tiktoken import encoding_for_model

load_dotenv()
e = env.get

app = FastAPI()

# set up our index for fast retrieval
index = faiss.read_index("docs.index")
with open("faiss_store.pkl", "rb") as f:
    store = pickle.load(f)
    
store.index = index

@app.get("/")
def read_root():
    return {"Hello": "World"}
    
@app.post("/generate")
def generate_chat(prompt: Prompt):
    try:
        generated_text = generate_text(prompt.text, api_key = e("OPENAI_API_KEY"), model = e("MODEL"), store=store)
        return {"response": generated_text}
    except Exception as ex:
        raise HTTPException(status_code=500, detail=str(ex))
    
@app.post("/count-tokens")
def count_tokens_endpoint(prompt: Prompt):
    if prompt.text is None:
        raise HTTPException(status_code=400, detail="Text is required")

    token_count = count_tokens(prompt.text)
    return {"token_count": token_count}
    

# helper function for counting tokens
def count_tokens(text: str) -> int:
    enc = encoding_for_model(e("MODEL"))
    tokens = enc.encode(text)
    return len(tokens)
    
    
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)