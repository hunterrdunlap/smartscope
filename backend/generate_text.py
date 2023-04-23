from typing import List, Tuple
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from langchain.vectorstores import FAISS
from langchain.memory import ConversationBufferMemory
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from langchain.schema import Document
import logging

# from chat_history import ChatHistory


# def generate_text(text: str, api_key: str, model: str, store):
#     llm = OpenAI(model_name= model, temperature=0, openai_api_key=api_key)
#     chain = VectorDBQAWithSourcesChain.from_llm(llm=llm, vectorstore=store)
#     result = chain({"question": text})
#     result_text = result["answer"] + "\n\n" + result["sources"]
#     return result_text

logger = logging.getLogger(__name__)

prompt_template = """
You are an AI Model which is an expert at providing accurate answers to questions. If you do not have the confidence to answer the question, you simply say 'I do not know'.

So far, you have been asked the following questions and had these answers:
{chat_history}

Please use this context to answer the question:
{context}

The question is:
{question}

Please respond with a well worded email on behalf of the founder of Pina, Gesa. This is a question coming from a potential carbon buyer. Please be respectful:
"""

def generate_text(text: str, api_key: str, model: str, store: FAISS, memory: ConversationBufferMemory):
    # search our vector store for the most relevant documents
    vector_search = store.similarity_search_with_relevance_scores(text, k=3)
    valid_context, sources = get_valid_context(vector_search, score_threshold=0.65)
    
    chat_history = memory.load_memory_variables({"question": text})['chat_history']
        
    # create prompt 
    prompt = PromptTemplate(template=prompt_template, input_variables=["chat_history", "context", "question"])
    
    # create chain
    llm = OpenAI(model_name= model, temperature=0, openai_api_key=api_key)
    conversation = LLMChain(llm=llm, verbose=True, prompt=prompt)
    answer = conversation.predict(chat_history=chat_history, context=valid_context, question=text)
    logger.info(f"Generated Response From LLM: \n {answer}")
    memory.save_context({"input": text}, {"output": answer})

    return answer + "\n\n" + str(sources)

def get_valid_context(context: List[Tuple[Document, float]], score_threshold: float = 0.65):
    valid_context = []
    sources = []
    
    for doc, score in context:
        if score > score_threshold:
            valid_context.append(doc.page_content)
            sources.append(str(doc.metadata['source']))
            
    return valid_context, sources

