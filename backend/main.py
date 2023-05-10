import logging
import pickle
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from generate_text import generate_sources, generate_text, generate_prompt
from os import environ as env
from dotenv import load_dotenv
from prompt import Prompt
import faiss

from langchain.docstore import InMemoryDocstore
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.memory import VectorStoreRetrieverMemory

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)


load_dotenv()
e = env.get

logger = logging.getLogger(__name__)

app = FastAPI()

# set up our index for fast retrieval
index = faiss.read_index("docs.index")
with open("faiss_store.pkl", "rb") as f:
    store = pickle.load(f)
    
store.index = index

# more set up
embedding_size = 1536 # Dimensions of the OpenAIEmbeddings
index = faiss.IndexFlatL2(embedding_size)
embedding_fn = OpenAIEmbeddings().embed_query
vectorstore = FAISS(embedding_fn, index, InMemoryDocstore({}), {})
retriever = vectorstore.as_retriever(search_kwargs=dict(k=3))
memory = VectorStoreRetrieverMemory(retriever=retriever, memory_key="chat_history", input_key="question")

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/reset-memory")
def reset_memory():
    global memory
    vectorstore = FAISS(embedding_fn, index, InMemoryDocstore({}), {})
    retriever = vectorstore.as_retriever(search_kwargs=dict(k=3))
    memory = VectorStoreRetrieverMemory(retriever=retriever, memory_key="chat_history", input_key="question")
    return {"response": "Memory Reset"}
    
@app.post("/generate")
def generate_chat(prompt: Prompt):
    try:
        generated_text = generate_text(prompt.text, api_key = e("OPENAI_API_KEY"), model = prompt.model, store=store, memory=memory)

        return {"response": generated_text}
    except Exception as ex:
        raise HTTPException(status_code=500, detail=str(ex))
    
@app.post("/generate-prompt")
def generate_prompt_for_gpt(prompt: Prompt):
    try:
        generated_prompt = generate_prompt(prompt.text, api_key = e("OPENAI_API_KEY"), store=store)
        
        return {"response": generated_prompt}
    except Exception as ex:
        raise HTTPException(status_code=500, detail=str(ex))
    
@app.post("/generate-sources")
def generate_sources_from_prompt(prompt: Prompt):
    try:
        sources = generate_sources(prompt.text, store=store, api_key = e("OPENAI_API_KEY"))
        
        return {"response": sources}
    except Exception as ex:
        raise HTTPException(status_code=500, detail=str(ex))    
    
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)