from typing import Dict
from langchain.llms import OpenAI
from langchain.chains import VectorDBQAWithSourcesChain
from langchain.chains import ConversationChain
from langchain.vectorstores import FAISS
from langchain.memory import ConversationBufferMemory
import logging

# from chat_history import ChatHistory


# def generate_text(text: str, api_key: str, model: str, store):
#     llm = OpenAI(model_name= model, temperature=0, openai_api_key=api_key)
#     chain = VectorDBQAWithSourcesChain.from_llm(llm=llm, vectorstore=store)
#     result = chain({"question": text})
#     result_text = result["answer"] + "\n\n" + result["sources"]
#     return result_text

logger = logging.getLogger(__name__)

def generate_text(text: str, api_key: str, model: str, store: FAISS, memory: ConversationBufferMemory):
    store.similarity_search_with_relevance_scores(text, k=3)
    
    llm = OpenAI(model_name= model, temperature=0, openai_api_key=api_key)
    conversation = ConversationChain(llm=llm, memory=memory, verbose=True)
    answer = conversation.predict(input=text)
    logger.info(f"Generated Response From LLM: \n {answer}")

    return answer

