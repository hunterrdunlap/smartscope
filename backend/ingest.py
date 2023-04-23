"""This is the logic for ingesting Notion data into LangChain."""
from pathlib import Path
from langchain.text_splitter import MarkdownTextSplitter
import faiss
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
import pickle
from os import environ as env
from langchain.document_loaders import UnstructuredMarkdownLoader
from dotenv import load_dotenv

load_dotenv()
e = env.get
api_key = e("OPENAI_API_KEY")

# Here we load in the data in the format that Notion exports it in.
md_files = list(Path("Notion_DB/").glob("**/*.md"))

# data = []
# sources = []
# for p in ps:
#     with open(p) as f:
#         data.append(f.read())
#         sources.append(p)

# Here we split the documents, as needed, into smaller chunks.
# We do this due to the context limits of the LLMs.
md_splitter = MarkdownTextSplitter(chunk_size=1500, chunk_overlap=200)
for md_file in md_files:
    data = UnstructuredMarkdownLoader(md_file).load()
    metadata = data[0].metadata
    docs = md_splitter.create_documents([data[0].page_content])
    for doc in docs:
        doc.metadata = metadata

# Here we create a vector store from the documents and save it to disk.
store = FAISS.from_documents(docs, OpenAIEmbeddings(openai_api_key=api_key))
faiss.write_index(store.index, "docs.index")
store.index = None
with open("faiss_store.pkl", "wb") as f:
    pickle.dump(store, f)